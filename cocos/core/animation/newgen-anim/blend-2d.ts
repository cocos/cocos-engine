import { assertIsTrue } from '../../data/utils/asserts';
import { Vec2, Vec3, clamp } from '../../math';

export function sampleSimpleDirectional (weights: number[], samples: readonly Vec2[], input: Readonly<Vec2>) {
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
            weights[iCenter] = 0.0;
        } else {
            weights.fill(1.0 / samples.length);
        }
        return;
    }

    // Finds out the sector the input point locates
    let iSectorStart = -1;
    let iSectorEnd = -1;
    let iCenter = -1;
    let lhsAngle = -1.0;
    let rhsCosAngle = -1.0;
    for (let iSample = 0; iSample < samples.length; ++iSample) {
        const sample = samples[iSample];
        if (Vec2.equals(sample, Vec2.ZERO)) {
            iCenter = iSample;
            continue;
        }

        const sampleNormalized = Vec2.normalize(new Vec2(), sample);
        const cosAngle = Vec2.dot(sampleNormalized, input);
        const sign = sampleNormalized.x * input.y - sampleNormalized.y * input.x;
        if (sign > 0) {
            if (cosAngle >= rhsCosAngle) {
                rhsCosAngle = cosAngle;
                iSectorStart = iSample;
            }
        } else if (cosAngle >= lhsAngle) {
            lhsAngle = cosAngle;
            iSectorEnd = iSample;
        }
    }

    let centerWeight = 0.0;
    if (iSectorStart < 0 || iSectorEnd < 0) {
        centerWeight = 1.0;
    } else {
        const { t1, t2 } = resolveEquation(samples[iSectorStart], samples[iSectorEnd], input);
        const sum = t1 + t2;
        let w1 = 0.0;
        let w2 = 0.0;
        if (sum > 1) {
            w1 = t1 / sum;
            w2 = t2 / sum;
        } else if (sum < 0) {
            w1 = 0.0;
            w2 = 0.0;
            centerWeight = 1.0;
        } else {
            w1 = t1;
            w2 = t2;
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

function resolveEquation (first: Readonly<Vec2>, second: Readonly<Vec2>, input: Readonly<Vec2>) {
    // Let's resolve equation `input = first * t1 + second * t2` for `t1` and `t2`.
    // |x1 x2|   |t1|   |input.x|
    // |     | x |  | = |       |
    // |y1 y2|   |t2|   |input.y|
    const {
        x: x1,
        y: y1,
    } = first;
    const {
        x: x2,
        y: y2,
    } = second;

    const det = x1 * y2 - x2 * y1;
    if (!det) {
        return { t1: 0, t2: 0 };
    }

    let t1 = (y2 * input.x - x2 * input.y) / det;
    let t2 = (-y1 * input.x + x1 * input.y) / det;
    if (t1 < 0 || t2 < 0) {
        t1 = t2 = 0.5;
    }
    return { t1, t2 };
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
