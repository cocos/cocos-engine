import { ImportMap, ModLo } from '@cocos/creator-programming-mod-lo';
import { QuickPack } from '@cocos/creator-programming-quick-pack/lib/quick-pack';
import { pathToFileURL } from 'url';
import ps from 'path';
import { StatsQuery } from '../stats-query';
import { setupBuildTimeConstants } from '../build-time-constants';

function regexpEscape (string: string) {
    return string.replace(/([^\w\d\s])/gi, '\\$1');
}

export class DevBuild {
    constructor ({
        engine,
        workspace,
    }: {
        engine: string;
        workspace: string;
    }) {
        const engineURLSlash = pathToFileURL(ps.join(engine, '/'));

        const statsQueryPromise = StatsQuery.create(engine);
        this._statsQuery = statsQueryPromise;
        const modLo = new ModLo({
            _compressUUID: (uuid) => '',
            transformExcludes: [
                new RegExp(`${regexpEscape(new URL('node_modules/@cocos/physx', engineURLSlash).href)}/.*`),
                new RegExp(`${regexpEscape(new URL('node_modules/@cocos/bullet', engineURLSlash).href)}/.*`),
            ],
        });
        const quickPack = new QuickPack({
            modLo,
            workspace,
            origin: engine,
            verbose: true,
        });
        this._modLo = modLo;
        this._quickPack = quickPack;

        this._initialize = (async () => {
            const statsQuery = await statsQueryPromise;

            const mode = undefined;
            const platform = 'HTML5';

            const buildTimeConstants = setupBuildTimeConstants({
                mode,
                platform,
                flags: {},
            });

            const moduleOverrides = statsQuery.evaluateModuleOverrides({
                mode,
                platform,
                buildTimeConstants,
            });

            const importMap: ImportMap = {};
            importMap.imports = {};

            importMap.imports = {
                ...importMap.imports,
                'cc.decorator': './cocos/core/data/decorators/index.ts',
            };

            for (const [k, v] of Object.entries(moduleOverrides)) {
                const kURL = ps.isAbsolute(k) ? pathToFileURL(k).href : k;
                const vURL = pathToFileURL(v);
                importMap.imports[kURL] = vURL.href;
            }

            // All engine module are subjected to extension less resolution
            modLo.setExtensionLessResolutionWhitelist([pathToFileURL(engine).href]);

            modLo.addMemoryModule('internal:constants', statsQuery.evaluateEnvModuleSourceFromRecord(buildTimeConstants));

            modLo.setImportMap(importMap, new URL('import-map.json', pathToFileURL(ps.join(engine, ps.sep))));
        })();
    }

    public setFeatures (features: string[]) {
        this._features = features.slice();
    }

    public async build () {
        await this._initialize;
        const statsQuery = await this._statsQuery;
        const entries = statsQuery
            .getUnitsOfFeatures(this._features)
            .map((featureUnit) => statsQuery.getFeatureUnitFile(featureUnit))
            .map(pathToFileURL);
        await this._quickPack.build(entries);
    }

    private _statsQuery: Promise<StatsQuery>;
    private _modLo: ModLo;
    private _quickPack: QuickPack;
    private _features: string[] = [];

    private _initialize: Promise<void>;

    private async _fullBuild () {
    }
}
