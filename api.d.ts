
declare let CC_JSB: boolean
declare let CC_NATIVERENDERER: boolean
declare let CC_EDITOR: boolean

declare let cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
}


declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

declare let module: {
    exports: object
}
