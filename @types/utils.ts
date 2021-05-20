export type CompareFunction<T> = (a: T, b: T) => number;

export type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};

export type TypedArray = Uint8Array | Uint8ClampedArray | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array;

export type TypedArrayConstructor = Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

export interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

export type Constructor<T = unknown> = new(...args: any[]) => T;

/**
 * Alias of `Function` but suppress eslint warning.
 * Please avoid using it and explicitly specify function signatures as possible.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyFunction = Function;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type Getter = () => any;

export type Setter = (value: any) => void;

export type EnumAlias<EnumT> = EnumT[keyof EnumT];