/** Running in the editor. */
declare const CC_EDITOR: boolean;
/** Preview in browser or simulator. */
declare const CC_PREVIEW: boolean;
/** Running in the editor or preview. */
declare const CC_DEV: boolean;
/** Running in the editor or preview, or build in debug mode. */
declare const CC_DEBUG: boolean;
/** Running in published project. */
declare const CC_BUILD: boolean;
/** Running in native platforms (mobile app, desktop app, or simulator). */
declare const CC_JSB: boolean;
/** Running in runtime environments. */
declare const CC_RUNTIME: boolean;
/** Running in the engine's unit test. */
declare const CC_TEST: boolean;
/** Running in the WeChat Mini Game. */
declare const CC_WECHATGAME: boolean;

declare let cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
}

declare let Editor: any;

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type KeyPartial<T, K extends keyof T> = { [P in K]?: T[P] };
type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
type ConstructorType<T> = OmitType<T, Function>;

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

declare let module: {
    exports: object
}
