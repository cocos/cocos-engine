import { DEBUG } from 'internal:constants';
import { lerp } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Transform, __applyDeltaTransform, __calculateDeltaTransform } from './transform';
import { TransformArray } from './transform-array';

export class Pose {
    readonly transforms: TransformArray;

    readonly metaValues: Float64Array;

    private constructor (transforms: TransformArray, metaValues: Float64Array) {
        this.transforms = transforms;
        this.metaValues = metaValues;
    }

    /**
     * @internal
     */
    public static _create (transforms: TransformArray, metaValues: Float64Array) {
        return new Pose(transforms, metaValues);
    }
}

export class TransformFilter {
    constructor (involvedTransforms: readonly number[]) {
        if (DEBUG) {
            assertIsTrue(
                involvedTransforms.every((transformIndex) => transformIndex < (2 ** 16)),
                'The number of transforms exceeds the max allowed(2 ** 16)',
            );
        }
        this._involvedTransforms = new Uint16Array(involvedTransforms);
    }

    get involvedTransforms () {
        return this._involvedTransforms as Readonly<Uint16Array>;
    }

    /**
     * ANOTHER IDEA: if we partition the indices into intervals,
     * can we achieve a better performance when do transform copy?
     *
     * For example: let every two elements of this array represents
     * an involved transform range: first index and end index.
     * For example, [1, 3, 4, 5, 5, 10] denotes the transform indices:
     * - [1, 3)  i.e indices 1, 2
     * - [4, 5)  i.e indices 4
     * - [5, 10) i.e indices 5, 6, 7, 8, 9
     * Its length always be multiple of 2.
     *
     * Obviously, the actual optimization effect is decided by the sparsity of the indices.
     *
     * ```ts
     * // Partition the ordered array in intervals.
     * let nIntervals = 0;
     * const intervals = new Uint32Array(involvedTransforms.length * 2); // Capacity, not size
     * for (let iBegin = 0; iBegin < involvedTransforms.length;) {
     *      const begin = involvedTransforms[iBegin];
     *      let iEnd = iBegin + 1;
     *      let end = begin + 1;
     *      for (; iEnd < involvedTransforms.length; ++iEnd, ++end) {
     *          if (intervals[iEnd] !== (end + 1)) {
     *              break;
     *          }
     *      }
     *      intervals[2 * nIntervals + 0] = begin;
     *      intervals[2 * nIntervals + 1] = end;
     *      ++nIntervals;
     *  }
     *
     * this._involvedTransformIntervals = intervals.slice(0, nIntervals * 2);
     * ```
     */
    private declare _involvedTransforms: Uint16Array;
}

export function blendPoseInto (target: Pose, source: Readonly<Pose>, alpha: number, transformFilter: TransformFilter | undefined = undefined) {
    blendTransformsInto(target.transforms, source.transforms, alpha, transformFilter);
    blendMetaValuesInto(target.metaValues, source.metaValues, alpha);
}

export function blendTransformsInto (
    target: TransformArray,
    source: Readonly<TransformArray>,
    alpha: number,
    transformFilter: TransformFilter | undefined = undefined,
) {
    const nTransforms = target.length;
    assertIsTrue(nTransforms === target.length);
    if (alpha === 0) {
        return;
    } else if (alpha === 1) {
        if (!transformFilter) {
            target.set(source);
        } else {
            copyTransformsWithFilter(target, source, transformFilter);
        }
        return;
    }
    if (!transformFilter) {
        // Fast path.
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            blendIntoTransformArrayAt(target, source, alpha, iTransform);
        }
    } else {
        for (const involvedTransformIndex of transformFilter.involvedTransforms) {
            blendIntoTransformArrayAt(target, source, alpha, involvedTransformIndex);
        }
    }
}

function copyTransformsWithFilter (target: TransformArray, source: Readonly<TransformArray>, filter: TransformFilter) {
    const nTransforms = target.length;
    assertIsTrue(nTransforms === target.length);
    for (const involvedTransformIndex of filter.involvedTransforms) {
        target.copyRange(involvedTransformIndex, source, involvedTransformIndex, 1);
    }
}

const blendIntoTransformArrayAt = (() => {
    const cacheTransformSource = new Transform();
    const cacheTransformTarget = new Transform();
    return (target: TransformArray, source: Readonly<TransformArray>, alpha: number, transformIndex: number) => {
        const transformTarget = target.getTransform(transformIndex, cacheTransformTarget);
        const transformSource = source.getTransform(transformIndex, cacheTransformSource);
        Transform.lerp(transformTarget, transformTarget, transformSource, alpha);
        target.setTransform(transformIndex, transformTarget);
    };
})();

export function blendMetaValuesInto (target: Float64Array, source: Readonly<Float64Array>, alpha: number) {
    const nValues = source.length;
    assertIsTrue(nValues === target.length);
    for (let iValue = 0; iValue < nValues; ++iValue) {
        target[iValue] = lerp(target[iValue], source[iValue], alpha);
    }
}

export function calculateDeltaPose (target: Pose, base: Pose) {
    calculateDeltaTransforms(target.transforms, base.transforms);
    calculateDeltaMetaValues(target.metaValues, base.metaValues);
}

const calculateDeltaTransformArrayAt = (() => {
    const cacheTransformBase = new Transform();
    const cacheTransformTarget = new Transform();
    return (target: TransformArray, base: Readonly<TransformArray>, transformIndex: number) => {
        const baseTransform = base.getTransform(transformIndex, cacheTransformBase);
        const targetTransform = target.getTransform(transformIndex, cacheTransformTarget);
        __calculateDeltaTransform(targetTransform, targetTransform, baseTransform);
        target.setTransform(transformIndex, targetTransform);
    };
})();

export function calculateDeltaTransforms (target: TransformArray, base: TransformArray) {
    const nTransforms = target.length;
    assertIsTrue(nTransforms === base.length);
    for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
        calculateDeltaTransformArrayAt(target, base, iTransform);
    }
}

export function calculateDeltaMetaValues (target: Float64Array, base: Float64Array) {
    const nMetaValues = target.length;
    assertIsTrue(nMetaValues === base.length);
    for (let i = 0; i < target.length; ++i) {
        target[i] -= base[i];
    }
}

export function applyDeltaPose (target: Pose, base: Pose, alpha: number, transformFilter: TransformFilter | undefined = undefined) {
    applyDeltaTransforms(target.transforms, base.transforms, alpha, transformFilter);
    applyDeltaMetaValues(target.metaValues, base.metaValues, alpha);
}

const applyDeltaTransformArrayAt = (() => {
    const cacheTransformDelta = new Transform();
    const cacheTransformTarget = new Transform();
    return (target: TransformArray, delta: Readonly<TransformArray>, alpha: number, transformIndex: number) => {
        const deltaTransform = delta.getTransform(transformIndex, cacheTransformDelta);
        const targetTransform = target.getTransform(transformIndex, cacheTransformTarget);
        __applyDeltaTransform(targetTransform, targetTransform, deltaTransform, alpha);
        target.setTransform(transformIndex, targetTransform);
    };
})();

export function applyDeltaTransforms (
    target: TransformArray, delta: TransformArray, alpha: number, transformFilter: TransformFilter | undefined = undefined,
) {
    const nTransforms = target.length;
    assertIsTrue(nTransforms === delta.length);
    if (!transformFilter) {
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            applyDeltaTransformArrayAt(target, delta, alpha, iTransform);
        }
    } else {
        for (const transformIndex of transformFilter.involvedTransforms) {
            applyDeltaTransformArrayAt(target, delta, alpha, transformIndex);
        }
    }
}

export function applyDeltaMetaValues (target: Float64Array, delta: Float64Array, alpha: number) {
    const nMetaValues = target.length;
    assertIsTrue(nMetaValues === delta.length);
    for (let i = 0; i < target.length; ++i) {
        target[i] += delta[i] * alpha;
    }
}
