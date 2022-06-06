export interface IConstantInfo {
    /**
     * The comment of the constant.
     * Which is used to generate the consts.d.ts file.
     */
    readonly comment: string;
    /**
     * The default value of the constant.
     * It can be a boolean or string.
     * When it's a string type, the value is the result of eval().
     */
    value: boolean | string,
    /**
     * Whether exported to global as a `CC_XXXX` constant.
     * eg. WECHAT is exported to global.CC_WECHAT
     * NOTE: this is a feature of compatibility with Cocos 2.x engine.
     */
    readonly ccGlobal: boolean,
    /**
     * Whether exported to developer.
     * If true, it's only exported to engine.
     */
    readonly internal: boolean,
    /**
     * Some constant can't specify the value in the Editor, Preview or Test environment,
     * so we need to dynamically judge them in runtime.
     * These values are specified in a helper called `helper-dynamic-constants.ts`.
     */
    readonly dynamic: boolean
}

export interface IConstantConfig {
    [ConstantName: string]: IConstantInfo;
}