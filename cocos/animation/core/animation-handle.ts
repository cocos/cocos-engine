/**
 * The reason why we wrap the index into an object is in that
 * the number of bones may vary due to animation replacement/added/moved(remember we have "overrideClips").
 */

export interface TransformHandle {
    __brand: 'TransformHandle';

    /**
     * Index of the transform in pose's transform array.
     */
    readonly index: number;

    destroy(): void;
}

export interface AuxiliaryCurveHandle {
    __brand: 'AuxiliaryCurveHandle';

    /**
     * Index of the auxiliary curve in pose's auxiliary curve array.
     */
    readonly index: number;

    destroy(): void;
}
