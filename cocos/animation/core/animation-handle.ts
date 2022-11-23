export interface TransformHandle {
    __brand: 'TransformHandle';

    readonly index: number;

    destroy(): void;
}

export interface MetaValueHandle {
    __brand: 'MetaValueHandle';

    readonly index: number;

    destroy(): void;
}
