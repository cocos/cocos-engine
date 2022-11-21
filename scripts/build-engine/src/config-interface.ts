export interface Config {
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

    /**
     * Included files for quick-compiler.
     */
    includes: Array<string>,
    /**
     * The constants config for engine and user.
     */
    constants: IConstantConfig;

    /**
     * The decorators to be optimize when build engine.
     */
    optimizeDecorators: IOptimizeDecorators;
}

export interface IndexConfig {
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

export type Test = string;

/**
 * An engine feature.
 */
export interface Feature {
    /**
     * Modules to be included in this feature in their IDs.
     * The ID of a module is its relative path(no extension) under /exports/.
     */
    modules: string[];

    /**
     * Flags to set when this feature is enabled.
     */
    intrinsicFlags?: Record<string, unknown>;

    /**
     * List of uuid that the feature depend on.
     */
    dependentAssets?: string[];

    /**
     * List of module that the feature depend on.
     */
    dependentModules?: string[];

    /**
     * Whether it is a native only feature, default is false.
     * @default false
     */
    isNativeOnly?: boolean;
}

export interface Context {
    mode?: string;
    platform?: string;
    buildTimeConstants?: Object;
}

export type ConstantTypeName = 'boolean' | 'number';

export interface IConstantInfo {
    /**
     * The comment of the constant.
     * Which is used to generate the consts.d.ts file.
     */
    readonly comment: string;
    /**
     * The type of the constant for generating consts.d.ts file.
     */
    readonly type: ConstantTypeName;
    /**
     * The default value of the constant.
     * It can be a boolean, number or string.
     * When it's a string type, the value is the result of eval().
     */
    value: boolean | string | number,
    /**
     * Whether exported to global as a `CC_XXXX` constant.
     * eg. WECHAT is exported to global.CC_WECHAT
     * NOTE: this is a feature of compatibility with Cocos 2.x engine.
     * Default is false.
     * 
     * @default false
     */
    ccGlobal?: boolean,
    /**
     * Whether exported to developer.
     * If true, it's only exported to engine.
     */
    readonly internal: boolean,
    /**
     * Some constant can't specify the value in the Editor, Preview or Test environment,
     * so we need to dynamically judge them in runtime.
     * These values are specified in a helper called `helper-dynamic-constants.ts`.
     * Default is false.
     * 
     * @default false
     */
    dynamic?: boolean
}

export interface IConstantConfig {
    [ConstantName: string]: IConstantInfo;
}

export interface IOptimizeDecorators {
    /**
     * The decorators which should be optimized when they only decorate class fields.
     */
    fieldDecorators: string[],
    /**
     * The decorators which should be removed directly when they only work in Cocos Creator editor.
     */
    editorDecorators: string[],
}