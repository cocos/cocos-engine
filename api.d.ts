
declare let CC_JSB: boolean
declare let CC_NATIVERENDERER: boolean
declare let CC_EDITOR: boolean

declare let cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
}

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
