import { assertIsTrue } from '../../data/utils/asserts';
import { Vec2, Vec3, clamp } from '../../math';

/**
 * Blends given samples using simple directional algorithm.
 * @param weights Result weights of each sample.
 * @param samples Every samples' parameter.
 * @param input Input parameter.
 */
export const blendSimpleDirectional = (() => {
    const CACHE_NORMALIZED_SAMPLE = new Vec2();

    const CACHE_BARYCENTRIC_SOLUTIONS: EquationResolutions = { wA: 0, wB: 0 };

    return function blendSimpleDirectional (weights: number[], samples: readonly Vec2[], input: Readonly<Vec2>) {
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

type SimpleDirectionalSampleIssue = SimpleDirectionalIssueSameDirection;

/**
 * Simple directional issue representing some samples have same(or very similar) direction.
 */
export class SimpleDirectionalIssueSameDirection {
    public constructor (public samples: readonly number[]) { }
}

/**
 * Cartesian Gradient Band Interpolation.
 * @param weights
 * @param thresholds
 * @param value
 */
export function sampleFreeformCartesian (weights: number[], thresholds: readonly Vec2[], value: Readonly<Vec2>) {
    sampleFreeform(weights, thresholds, value, getGradientBandCartesianCoords);
}

/**
 * Polar Gradient Band Interpolation.
 * @param weights
 * @param thresholds
 * @param value
 */
export function sampleFreeformDirectional (weights: number[], thresholds: readonly Vec2[], value: Readonly<Vec2>) {
    sampleFreeform(weights, thresholds, value, getGradientBandPolarCoords);
}

function sampleFreeform (weights: number[], samples: readonly Vec2[], value: Readonly<Vec2>, getGradientBandCoords: GetGradientBandCoords) {
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
) {
    // Let P = p - 0, A = a - 0, B = b - 0,
    // wA = (P x B) / (A x B)
    // wB = (P x A) / (B x A)
    const det = Vec2.crossProduct(a, b);
    if (!det) {
        resolutions.wA = 0.0;
        resolutions.wB = 0.0;
    } else {
        resolutions.wA = Vec2.crossProduct(p, b) / det;
        resolutions.wB = Vec2.crossProduct(p, a) / -det;
    }
    return resolutions;
}

type GetGradientBandCoords = (point: Readonly<Vec2>, pI: Readonly<Vec2>, pJ: Readonly<Vec2>, pIpInput: Vec2, pIpJ: Vec2) => void;

const getGradientBandCartesianCoords: GetGradientBandCoords = (pI, pJ, input, pIpInput, pIpJ) => {
    Vec2.subtract(pIpInput, input, pI);
    Vec2.subtract(pIpJ, pJ, pI);
};

const getGradientBandPolarCoords = ((): GetGradientBandCoords => {
    const axis = new Vec3(0, 0, 0); // buffer for axis
    const tmpV3 = new Vec3(0, 0, 0); // buffer for temp vec3
    const pQueriedProjected = new Vec3(0, 0, 0); // buffer for pQueriedProjected
    const pi3 = new Vec3(0, 0, 0); // buffer for pi3
    const pj3 = new Vec3(0, 0, 0); // buffer for pj3
    const pQueried3 = new Vec3(0, 0, 0); // buffer for pQueried3
    return (pI, pJ, input, pIpInput, pIpJ) => {
        let aIJ = 0.0;
        let aIQ = 0.0;
        let angleMultiplier = 2.0;
        Vec3.set(pQueriedProjected, input.x, input.y, 0.0);
        if (Vec2.equals(pI, Vec2.ZERO)) {
            aIJ = Vec2.angle(input, pJ);
            aIQ = 0.0;
            angleMultiplier = 1.0;
        } else if (Vec2.equals(pJ, Vec2.ZERO)) {
            aIJ = Vec2.angle(input, pI);
            aIQ = aIJ;
            angleMultiplier = 1.0;
        } else {
            aIJ = Vec2.angle(pI, pJ);
            if (aIJ <= 0.0) {
                aIQ = 0.0;
            } else if (Vec2.equals(input, Vec2.ZERO)) {
                aIQ = aIJ;
            } else {
                Vec3.set(pi3, pI.x, pI.y, 0);
                Vec3.set(pj3, pJ.x, pJ.y, 0);
                Vec3.set(pQueried3, input.x, input.y, 0);
                Vec3.cross(axis, pi3, pj3);
                Vec3.projectOnPlane(pQueriedProjected, pQueried3, axis);
                aIQ = Vec3.angle(pi3, pQueriedProjected);
                if (aIJ < Math.PI * 0.99) {
                    if (Vec3.dot(Vec3.cross(tmpV3, pi3, pQueriedProjected), axis) < 0) {
                        aIQ = -aIQ;
                    }
                }
            }
        }
        const lenPI = Vec2.len(pI);
        const lenPJ = Vec2.len(pJ);
        const deno = (lenPJ + lenPI) / 2;
        Vec2.set(pIpJ, (lenPJ - lenPI) / deno, aIJ * angleMultiplier);
        Vec2.set(pIpInput, (Vec3.len(pQueriedProjected) - lenPI) / deno, aIQ * angleMultiplier);
    };
})();
