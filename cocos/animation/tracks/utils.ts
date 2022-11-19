import type { Curve } from './track';

export function maskIfEmpty<T extends Curve> (curve: T) {
    return curve.keyFramesCount === 0 ? undefined : curve;
}

export interface Range {
    min: number;
    max: number;
}
