import ps from 'path';
import fs from 'fs-extra';
import JSON5 from 'json5';
import dedent from 'dedent';

interface Config {
    /**
     * Engine features. Keys are feature IDs.
     */
    features: Record<string, Feature>;

    /**
     * Describe how to generate the index module `'cc'`.
     * Currently not used.
     */
    index?: IndexConfig;

    moduleOverrides?: Array<{
        test: Test;
        overrides: Record<string, string>;
        isVirtualModule: boolean;
    }>;
}

interface IndexConfig {
    modules?: Record<string, {
        /**
         * If specified, export contents of the module into a namespace specified by `ns`
         * and then export that namespace into `'cc'`.
         * If not specified, contents of the module will be directly exported into `'cc'`.
         */
        ns?: string;

        /**
         * If `true`, accesses the exports of this module from `'cc'` will be marked as deprecated.
         */
        deprecated?: boolean;
    }>;
}

type Test = string;

/**
 * An engine feature.
 */
interface Feature {
    /**
     * Modules to be included in this feature in their IDs.
     * The ID of a module is its relative path(no extension) under /exports/.
     */
    modules: string[];

    /**
     * Flags to set when this feature is enabled.
     */
    intrinsicFlags?: Record<string, unknown>;
}

interface Context {
    mode?: string;
    platform?: string;
    buildTimeConstants?: Object;
}

/**
 * Query any any stats of the engine.
 */
export class StatsQuery {
    /**
     * @param engine Path to the engine root.
     */
    public static async create (engine: string) {
        const configFile = ps.join(engine, 'cc.config.json');
        const config: Config = JSON5.parse(await fs.readFile(configFile, 'utf8'));
        const query = new StatsQuery(engine, config);
        await query._initialize();
        return query;
    }

    /**
     * Gets the path to the engine root.
     */
    get path () {
        return this._engine;
    }

    /**
     * Gets the path to tsconfig.
     */
    get tsConfigPath () {
        return ps.join(this._engine, 'tsconfig.json');
    }

    /**
     * Gets all features defined.
     */
    public getFeatures () {
        return Object.keys(this._features);
    }

    /**
     * Returns if the specified feature is defined.
     * @param feature Feature ID.
     */
    public hasFeature (feature: string) {
        return !!this._features[feature];
    }

    /**
     * Gets all feature units included in specified features.
     * @param featureIds Feature ID.
     */
    public getUnitsOfFeatures (featureIds: string[]) {
        const units = new Set<string>();
        for (const featureId of featureIds) {
            this._features[featureId]?.modules.forEach((entry) => units.add(entry));
        }
        return Array.from(units);
    }

    public getIntrinsicFlagsOfFeatures (featureIds: string[]) {
        const flags: Record<string, unknown> = {};
        for (const featureId of featureIds) {
            const featureFlags = this._features[featureId]?.intrinsicFlags;
            if (featureFlags) {
                Object.assign(flags, featureFlags);
            }
        }
        return flags as Record<string, number | boolean | string>;
    }

    /**
     * Gets all feature units in their names.
     */
    public getFeatureUnits () {
        return Object.keys(this._featureUnits);
    }

    /**
     * Gets the path to source file of the feature unit.
     * @param moduleId Name of the feature unit.
     */
    public getFeatureUnitFile (featureUnit: string) {
        return this._featureUnits[featureUnit];
    }

    /**
     * Gets all editor public modules in their names.
     */
    public getEditorPublicModules () {
        return Object.keys(this._editorPublicModules);
    }

    /**
     * Gets the path to source file of the editor-public module.
     * @param moduleName Name of the public module.
     */
    public getEditorPublicModuleFile (moduleName: string) {
        return this._editorPublicModules[moduleName];
    }

    /**
     * Gets the source of `'cc'`.
     * @param featureUnits Involved feature units.
     * @param mapper If exists, map the feature unit name into another module request.
     */
    public evaluateIndexModuleSource (featureUnits: string[], mapper?: (featureUnit: string) => string) {
        return featureUnits.map((featureUnit) => {
            const indexInfo = this._index.modules[featureUnit];
            const ns = indexInfo?.ns;
            if (ns) {
                return dedent`
                    import * as ${ns} from '${mapper?.(featureUnit) ?? featureUnit}';
                    export { ${ns} };
                `;
            }
            return `export * from '${mapper?.(featureUnit) ?? featureUnit}';`;
        }).join('\n');
    }

    /**
     * Evaluates the source of `'internal-constants'`(`'cc/env'`),
     * @param context
     */
    public evaluateEnvModuleSourceFromRecord (record: Record<string, unknown>) {
        return Object.entries(record).map(([k, v]) => `export const ${k} = ${v};`).join('\n');
    }

    /**
     * Evaluates module overrides under specified context.
     * @param context
     */
    public evaluateModuleOverrides (context: Context) {
        const overrides: Record<string, string> = {};

        const addModuleOverrides = (moduleOverrides: Record<string, string>, isVirtualModule: boolean) => {
            for (let [source, override] of Object.entries(moduleOverrides)) {
                const normalizedSource = isVirtualModule ? source : ps.resolve(this._engine, source);
                override = this._evalPathTemplate(override, context);
                const normalizedOverride = ps.resolve(this._engine, override);
                overrides[normalizedSource] = normalizedOverride;
            }
        };

        this._config.moduleOverrides?.forEach(({ test, overrides, isVirtualModule }) => {
            if (this._evalTest(test, context)) {
                addModuleOverrides(overrides, isVirtualModule);
            }
        });

        return overrides;
    }

    private static async _readModulesInDir (exportsDir: string, mapper: (baseName: string) => string) {
        const result: Record<string, string> = {};
        for (const entryFileName of await fs.readdir(exportsDir)) {
            const entryExtName = ps.extname(entryFileName);
            if (!entryExtName.toLowerCase().endsWith('.ts')) {
                continue;
            }
            const baseName = ps.basename(entryFileName, entryExtName);
            const moduleName = mapper(baseName);
            const entryFile = ps.join(exportsDir, entryFileName);
            result[moduleName] = entryFile;
        }
        return result;
    }

    private static _baseNameToFeatureUnitName (baseName: string) {
        return `${baseName}`;
    }

    private static _editorBaseNameToModuleName (baseName: string) {
        return `cc/editor/${baseName}`;
    }

    private constructor (engine: string, config: Config) {
        this._config = config;
        this._engine = engine;
    }

    private _evalTest<T> (test: Test, context: Context) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
        const result = new Function('context', `return ${test}`)(context) as T;
        // console.debug(`Eval "${test}" to ${result}`);
        return result;
    }

    private _evalPathTemplate (pathTemplate: string, context: Context): string {
        let resultPath = pathTemplate;
        const regExp = /\{\{(.*?)\}\}/g;
        let exeResult;
        while (exeResult = regExp.exec(pathTemplate)) {
            const templateItem = exeResult[0];
            const exp = exeResult[1];
            const evalResult = (new Function('context', `return ${exp}`)(context)) as string;
            resultPath = pathTemplate.replace(templateItem, evalResult);
        }
        return resultPath;
    }

    private async _initialize () {
        const { _config: config, _engine: engine } = this;

        const featureUnits = this._featureUnits = await StatsQuery._readModulesInDir(
            ps.join(engine, 'exports'), StatsQuery._baseNameToFeatureUnitName,
        );

        for (const [featureName, feature] of Object.entries(config.features)) {
            const parsedFeature = this._features[featureName] = { modules: [] } as Feature;
            for (const moduleFileBaseName of feature.modules) {
                const featureUnitName = StatsQuery._baseNameToFeatureUnitName(moduleFileBaseName);
                if (!featureUnits[featureUnitName]) {
                    throw new Error(`Invalid config file: '${moduleFileBaseName}' is not a valid module.`);
                }
                parsedFeature.modules.push(featureUnitName);
            }
            parsedFeature.intrinsicFlags = feature.intrinsicFlags;
        }

        if (config.index) {
            if (config.index.modules) {
                for (const [k, v] of Object.entries(config.index.modules)) {
                    this._index.modules[StatsQuery._baseNameToFeatureUnitName(k)] = v;
                }
            }
            this._index = {
                ...config.index,
                modules: this._index.modules,
            };
        }

        this._editorPublicModules = await StatsQuery._readModulesInDir(
            ps.join(engine, 'editor', 'exports'), StatsQuery._editorBaseNameToModuleName,
        );
    }

    private _engine: string;
    private _index: ParsedIndexConfig = { modules: {} };
    private _features: Config['features'] = {};
    private _config: Readonly<Config>;
    private _featureUnits: Record<string, string> = {};
    private _editorPublicModules: Record<string, string> = {};
}

type ParsedIndexConfig = Omit<IndexConfig, 'modules'> & {
    modules: NonNullable<IndexConfig['modules']>;
};
