export type TupleValues<T> = T[Exclude<keyof T, keyof []>];
