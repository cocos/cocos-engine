type EnumMapImpl<
    Map extends Record<number, any>,
    _,
    Minus1 extends any[] = [],
    Index extends keyof Map = Minus1['length']
> = [
    ...(Minus1 extends [infer _2, ...infer Remain] ? EnumMapImpl<Map, _2, Remain> : []),
    // Index,
    Map[Index],
];

type MapTuple<Map extends Record<number, any>, T> = T extends [infer _1, ...infer Remain] ? EnumMapImpl<Map, _1, Remain> : never;

type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

export type MapEnum<Map extends Record<number, any>, Length extends number> = MapTuple<Map, Tuple<unknown, Length>>;

type TupleSplit<T, N extends number, O extends readonly any[] = readonly []> =
    O['length'] extends N ? [O, T] : T extends readonly [infer F, ...infer R] ?
    TupleSplit<readonly [...R], N, readonly [...O, F]> : [O, T];

type TakeFirst<T extends readonly any[], N extends number> =
    TupleSplit<T, N>[0];

type SkipFirst<T extends readonly any[], N extends number> =
    TupleSplit<T, N>[1];

export type TupleSlice<T extends readonly any[], S extends number, E extends number = T['length']> =
    SkipFirst<TakeFirst<T, E>, S>;
