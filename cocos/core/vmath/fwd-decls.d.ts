export interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}
