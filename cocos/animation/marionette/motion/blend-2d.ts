/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { approx, assertIsTrue, Vec2, Vec3 } from '../../../core';

/**
 * Blends given samples using simple directional algorithm.
 * @param weights Result weights of each sample.
 * @param samples Every samples' parameter.
 * @param input Input parameter.
 */
export const blendSimpleDirectional = ((): (weights: number[], samples: readonly Vec2[], input: Readonly<Vec2>) => void => {
    const CACHE_NORMALIZED_SAMPLE = new Vec2();

    const CACHE_BARYCENTRIC_SOLUTIONS: EquationResolutions = { wA: 0, wB: 0 };

    return function blendSimpleDirectional (weights: number[], samples: readonly Vec2[], input: Readonly<Vec2>): void {
        assertIsTrue(weights.length === samples.length);

        if (samples.length === 0) {
            return;
        }

        if (samples.length === 1) {
            weights[0] = 1.0;
            return;
        }

        if (Vec2.strictEquals(input, Vec2.ZERO)) {
            const iCenter = samples.findIndex((sample) => Vec2.strictEquals(sample, Vec2.ZERO));
            if (iCenter >= 0) {
                weights[iCenter] = 1.0;
            } else {
                weights.fill(1.0 / samples.length);
            }
            return;
        }

        // Finds out the sector the input point locates
        let iSectorStart = -1;
        let iSectorEnd = -1;
        let iCenter = -1;
        let lhsCosAngle = Number.NEGATIVE_INFINITY;
        let rhsCosAngle = Number.NEGATIVE_INFINITY;
        const { x: inputX, y: inputY } = input;
        for (let iSample = 0; iSample < samples.length; ++iSample) {
            const sample = samples[iSample];
            if (Vec2.equals(sample, Vec2.ZERO)) {
                iCenter = iSample;
                continue;
            }

            const sampleNormalized = Vec2.normalize(CACHE_NORMALIZED_SAMPLE, sample);
            const cosAngle = Vec2.dot(sampleNormalized, input);
            const sign = sampleNormalized.x * inputY - sampleNormalized.y * inputX;
            if (sign > 0) {
                if (cosAngle >= rhsCosAngle) {
                    rhsCosAngle = cosAngle;
                    iSectorStart = iSample;
                }
            } else if (cosAngle >= lhsCosAngle) {
                lhsCosAngle = cosAngle;
                iSectorEnd = iSample;
            }
        }

        let centerWeight = 0.0;
        if (iSectorStart < 0 || iSectorEnd < 0) {
            // Input fall at vertex.
            centerWeight = 1.0;
        } else {
            const { wA, wB } = solveBarycentric(samples[iSectorStart], samples[iSectorEnd], input, CACHE_BARYCENTRIC_SOLUTIONS);
            let w1 = 0.0;
            let w2 = 0.0;
            const sum = wA + wB;
            if (sum > 1) {
                // Input fall at line C-A or C-B but not beyond C
                w1 = wA / sum;
                w2 = wB / sum;
            } else if (sum < 0) {
                // Input fall at line C-A or C-B but beyond A or B
                w1 = 0.0;
                w2 = 0.0;
                centerWeight = 1.0;
            } else {
                // Inside triangle
                w1 = wA;
                w2 = wB;
                centerWeight = 1.0 - sum;
            }
            weights[iSectorStart] = w1;
            weights[iSectorEnd] = w2;
        }

        // Center influence part
        if (centerWeight > 0.0) {
            if (iCenter >= 0) {
                weights[iCenter] = centerWeight;
            } else {
                const average = centerWeight / weights.length;
                for (let i = 0; i < weights.length; ++i) {
                    weights[i] += average;
                }
            }
        }
    };
})();

/**
 * Validates the samples if they satisfied the requirements of simple directional algorithm.
 * @param samples Samples to validate.
 * @returns Issues the samples containing.
 */
export function validateSimpleDirectionalSamples (samples: ReadonlyArray<Vec2>): SimpleDirectionalSampleIssue[] {
    const nSamples = samples.length;
    const issues: SimpleDirectionalSampleIssue[] = [];
    const sameDirectionValidationFlag = new Array<boolean>(samples.length).fill(false);
    samples.forEach((sample, iSample) => {
        if (sameDirectionValidationFlag[iSample]) {
            return;
        }
        let sameDirectionSamples: number[] | undefined;
        for (let iCheckSample = 0; iCheckSample < nSamples; ++iCheckSample) {
            const checkSample = samples[iCheckSample];
            if (Vec2.equals(sample, checkSample, 1e-5)) {
                (sameDirectionSamples ??= []).push(iCheckSample);
                sameDirectionValidationFlag[iCheckSample] = true;
            }
        }
        if (sameDirectionSamples) {
            sameDirectionSamples.unshift(iSample);
            issues.push(new SimpleDirectionalIssueSameDirection(sameDirectionSamples));
        }
    });
    return issues;
}

export type SimpleDirectionalSampleIssue = SimpleDirectionalIssueSameDirection;

/**
 * Simple directional issue representing some samples have same(or very similar) direction.
 */
export class SimpleDirectionalIssueSameDirection {
    public constructor (public samples: readonly number[]) { }
}

//#region Gradient Band Interpolation

/**
 * In the following, two interpolation methods are implemented based on paper
 * [rune_skovbo_johansen_thesis.pdf](https://runevision.com/thesis/rune_skovbo_johansen_thesis.pdf).
 *
 * - Gradient brand interpolation in Cartesian space.
 *
 * - Gradient brand interpolation in polar space.
 *
 *   This is a variety of standard gradient brand interpolation
 *   which is suitable for velocity interpolation(the Cartesian one is not **WELL** suited as pointed out by the paper).
 *
 *   This type of method requires a motion to be placed at origin and
 *   the angles between adjacent points to be greater than 180°.
 */
const _DEV_NOTE = false;

//#endregion

/**
 * Cartesian Gradient Band Interpolation.
 * @param weights
 * @param thresholds
 * @param value
 */
export function sampleFreeformCartesian (weights: number[], thresholds: readonly Vec2[], value: Readonly<Vec2>): void {
    sampleFreeform(weights, thresholds, value, getGradientBandCartesianCoords);
}

function sampleFreeform (weights: number[], samples: readonly Vec2[], value: Readonly<Vec2>, getGradientBandCoords: GetGradientBandCoords): void {
    weights.fill(0.0);
    const pIpInput = new Vec2(0, 0);
    const pIJ = new Vec2(0, 0);
    let sumInfluence = 0.0;
    const nSamples = samples.length;
    for (let iSample = 0; iSample < nSamples; ++iSample) {
        let influence = Number.MAX_VALUE;
        let outsideHull = false;
        for (let jSample = 0; jSample < nSamples; ++jSample) {
            if (iSample === jSample) {
                continue;
            }
            getGradientBandCoords(samples[iSample], samples[jSample], value, pIpInput, pIJ);
            const t = 1 - Vec2.dot(pIpInput, pIJ) / Vec2.lengthSqr(pIJ);
            if (t < 0) {
                outsideHull = true;
                break;
            }
            influence = Math.min(influence, t);
        }
        if (!outsideHull) {
            weights[iSample] = influence;
            sumInfluence += influence;
        }
    }
    if (sumInfluence > 0) {
        weights.forEach((influence, index) => weights[index] = influence / sumInfluence);
    }
}

interface EquationResolutions {
    wA: number;
    wB: number;
}

/**
 * Solves the barycentric coordinates of `p` within triangle (0, `a`, `b`).
 * @param a Triangle vertex.
 * @param b Triangle vertex.
 * @param p Input vector.
 * @param resolutions The barycentric coordinates of `a` and `b`.
 * @returns
 */
function solveBarycentric (
    a: Readonly<Vec2>,
    b: Readonly<Vec2>,
    p: Readonly<Vec2>,
    resolutions: EquationResolutions,
): EquationResolutions {
    // Let P = p - 0, A = a - 0, B = b - 0,
    // wA = (P x B) / (A x B)
    // wB = (P x A) / (B x A)
    const det = Vec2.cross(a, b);
    if (!det) {
        resolutions.wA = 0.0;
        resolutions.wB = 0.0;
    } else {
        resolutions.wA = Vec2.cross(p, b) / det;
        resolutions.wB = Vec2.cross(p, a) / -det;
    }
    return resolutions;
}

type GetGradientBandCoords = (point: Readonly<Vec2>, pI: Readonly<Vec2>, pJ: Readonly<Vec2>, pIpInput: Vec2, pIpJ: Vec2) => void;

const getGradientBandCartesianCoords: GetGradientBandCoords = (pI, pJ, input, pIpInput, pIpJ) => {
    Vec2.subtract(pIpInput, input, pI);
    Vec2.subtract(pIpJ, pJ, pI);
};

const PRECOMPUTED_VIJ_DATA_STRIDE = 3;

/**
 * The class tracking the polar space gradient band interpolation.
 * For code readers, throughout the implementation:
 * - Variable names like `V_IJ` denotes a vector pointing from example motion "I" to example motion "J";
 * - Variable names like `V_IX` denotes a vector pointing from example motion "I" to new velocity being queried, which is properly named "X".
 * For detail definitions see section 6.3 in [paper](https://runevision.com/thesis/rune_skovbo_johansen_thesis.pdf) .
 */
export class PolarSpaceGradientBandInterpolator2D {
    private static _CACHE_INPUT_DIRECTION = new Vec2();

    private static _CACHE_VIJ = new Vec2();

    private static _CACHE_VIX = new Vec2();

    private static _ANGLE_MULTIPLIER = 1.0;

    constructor (examples: readonly Readonly<Vec2>[]) {
        const {
            _ANGLE_MULTIPLIER: angleMultiplier,
        } = PolarSpaceGradientBandInterpolator2D;

        const nExamples = examples.length;

        const exampleMagnitudes = this._exampleMagnitudes = new Array<number>(nExamples).fill(0.0);
        const exampleDirections = this._exampleDirections = examples.map((example, iExample) => {
            const direction = Vec2.copy(new Vec2(), example);
            const magnitude = Vec2.len(direction);
            exampleMagnitudes[iExample] = magnitude;
            if (!approx(magnitude, 0.0, 1e-5)) {
                Vec2.multiplyScalar(direction, direction, 1.0 / magnitude);
            }
            return direction;
        });

        const precomputedVIJs = this._precomputedVIJs = new Float32Array(PRECOMPUTED_VIJ_DATA_STRIDE * nExamples * nExamples);
        for (let iExample = 0; iExample < nExamples; ++iExample) {
            const magnitudeI = exampleMagnitudes[iExample];
            const directionI = exampleDirections[iExample];
            for (let jExample = 0; jExample < nExamples; ++jExample) {
                if (iExample === jExample) {
                    continue;
                }
                const magnitudeJ = exampleMagnitudes[jExample];
                const directionJ = exampleDirections[jExample];
                const averagedMagnitude = (magnitudeI + magnitudeJ) / 2;
                const pOutput = PRECOMPUTED_VIJ_DATA_STRIDE * (nExamples * iExample + jExample);
                precomputedVIJs[pOutput + 0] = (magnitudeJ - magnitudeI) / averagedMagnitude;
                precomputedVIJs[pOutput + 1] = signedAngle(directionI, directionJ) * angleMultiplier;
                precomputedVIJs[pOutput + 2] = averagedMagnitude;
            }
        }

        this._cacheVIXAngles = new Float32Array(nExamples);
    }

    public interpolate (weights: number[], input: Readonly<Vec2>): void {
        const {
            _exampleDirections: exampleDirections,
            _exampleMagnitudes: exampleMagnitudes,
            _precomputedVIJs: precomputedVIJs,
            _cacheVIXAngles: cacheVIXAngles,
        } = this;

        const {
            _CACHE_INPUT_DIRECTION: cacheInputDirection,
            _CACHE_VIJ: cacheVIJ,
            _CACHE_VIX: cacheVIX,
            _ANGLE_MULTIPLIER: angleMultiplier,
        } = PolarSpaceGradientBandInterpolator2D;

        const nExamples = exampleDirections.length;
        assertIsTrue(weights.length === nExamples);

        // Specially handle 0/1 sample case, the algorithm is not defined for them.
        if (nExamples === 0) {
            return;
        } else if (nExamples === 1) {
            weights[0] = 1.0;
            return;
        }

        const vX = input;
        const magnitudeX = Vec2.len(vX);

        // Calculate $\angle(v_i, v_x) * \alpha$ for each example.
        // If either vector is zero, the angle is defined as zero.
        const vIXAngles = cacheVIXAngles;
        if (Vec2.equals(vX, Vec2.ZERO)) {
            for (let iExample = 0; iExample < nExamples; ++iExample) {
                vIXAngles[iExample] = 0.0;
            }
        } else {
            const directionX = Vec2.multiplyScalar(cacheInputDirection, vX, 1.0 / magnitudeX);
            for (let iExample = 0; iExample < nExamples; ++iExample) {
                const directionI = exampleDirections[iExample];
                if (Vec2.equals(directionI, Vec2.ZERO)) {
                    vIXAngles[iExample] = 0.0;
                } else {
                    vIXAngles[iExample] = signedAngle(directionI, directionX) * angleMultiplier;
                }
            }
        }

        // The polar space gradient band interpolation.
        let totalWeight = 0.0;
        for (let iExample = 0; iExample < nExamples; ++iExample) {
            const magnitudeI = exampleMagnitudes[iExample];
            const directionI = exampleDirections[iExample];
            let minInfluence = Number.POSITIVE_INFINITY; // 1 - Math.abs(vIXAngles[iExample]) / Math.PI;
            for (let jExample = 0; jExample < nExamples; ++jExample) {
                if (iExample === jExample) {
                    continue;
                }

                const directionJ = exampleDirections[jExample];

                const precomputedDataIndex = PRECOMPUTED_VIJ_DATA_STRIDE * (nExamples * iExample + jExample);
                const {
                    [precomputedDataIndex + 0]: vIJMag,
                    [precomputedDataIndex + 1]: vIJAnglePrecomputed,
                    [precomputedDataIndex + 2]: averagedMagnitude,
                } = precomputedVIJs;

                let vIJAngle = vIJAnglePrecomputed;
                let vIXAngle = vIXAngles[iExample];

                // Handle zero cases:
                // - If $v_i$(or $v_j$) is zero vector,
                //   the angle between v_i_j is defined to be the angle between $v_x$ and $v_j$(or $v_i$).
                // - If $v_x$ is zero vector,
                //   the angle between v_i_x is defined to be the angle between $v_i$ and $v_j$.
                if (Vec2.equals(directionI, Vec2.ZERO)) {
                    vIJAngle = vIXAngles[jExample];
                    // And `vIXAngle` is 0 as computed above.
                } else if (Vec2.equals(directionJ, Vec2.ZERO)) {
                    vIJAngle = vIXAngles[iExample];
                } else if (Vec2.equals(vX, Vec2.ZERO)) {
                    vIXAngle = vIJAngle;
                }

                const vIJ = Vec2.set(cacheVIJ, vIJMag, vIJAngle);
                const vIX = Vec2.set(
                    cacheVIX,
                    (magnitudeX - magnitudeI) / averagedMagnitude,
                    vIXAngle,
                );

                // Calculate the influence.
                // Note we can't cache `len(vIJ)` due to above process of `vIJ.y`!
                const influence = 1.0 - Vec2.dot(vIX, vIJ) / Vec2.lengthSqr(vIJ);
                if (influence <= 0) { // The input is outside hull.
                    minInfluence = 0.0;
                    break; // No more iteration.
                }
                minInfluence = Math.min(minInfluence, influence);
            }
            weights[iExample] = minInfluence;
            totalWeight += minInfluence;
        }

        // Normalize the weights.
        if (totalWeight > 0) {
            for (let iExample = 0; iExample < nExamples; ++iExample) {
                weights[iExample] /= totalWeight;
            }
        } else {
            // This can happen if there no example at origin and the input is origin.
            // Just average weight to all examples.
            const averaged = 1.0 / nExamples;
            for (let iExample = 0; iExample < nExamples; ++iExample) {
                weights[iExample] = averaged;
            }
        }
    }

    private declare _exampleDirections: Vec2[];
    private declare _exampleMagnitudes: number[];

    /**
     * n*n Precomputed (\vec{p_i}{p_j}, (|p_i| + |p_j|) / 2).
     */
    private declare _precomputedVIJs: Float32Array;

    private declare _cacheVIXAngles: Float32Array;
}

function signedAngle (v1: Readonly<Vec2>, v2: Readonly<Vec2>): number {
    const angle = Vec2.angle(v1, v2);
    const determinate = v1.x * v2.y - v1.y * v2.x;
    return determinate < 0 ? -angle : angle;
}
