
declare const cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
};


declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}
