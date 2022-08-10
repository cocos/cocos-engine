/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { assertIsTrue } from '../../core/data/utils/asserts';
import { Vec3 } from '../../core/math/vec3';
import { Enum } from '../../core/value-types';

const SH_BASIS_FAST_COUNT = 4;
const SH_BASIS_NORMAL_COUNT = 9;

export const LightProbeQuality = Enum({
    Fast: 0,   // 4 basis functions of L0 & L1
    Normal: 1, // 9 basis functions of L0 & L1 & L2
});

class LightProbeSampler {
    /**
     *  generate one sample from sphere uniformly
     */
    public static uniformSampleSphere (u1: number, u2: number) {
        const z = 1.0 - 2.0 * u1;
        const r = Math.sqrt(Math.max(0.0, 1.0 - z * z));
        const phi = 2.0 * Math.PI * u2;

        const x = r * Math.cos(phi);
        const y = r * Math.sin(phi);

        return new Vec3(x, y, z);
    }

    /**
     *  generate ucount1 * ucount2 samples from sphere uniformly
     */
    public static uniformSamplesSphereAll (uCount1: number, uCount2: number) {
        assertIsTrue(uCount1 > 0 && uCount2 > 0);

        const samples: Vec3[] = [];
        const uDelta1 = 1.0 / uCount1;
        const uDelta2 = 1.0 / uCount2;

        for (let i = 0; i < uCount1; i++) {
            const u1 = (i + 0.5) * uDelta1;

            for (let j = 0; j < uCount2; j++) {
                const u2 = (j + 0.5) * uDelta2;
                const sample = this.uniformSampleSphere(u1, u2);
                samples.push(sample);
            }
        }

        return samples;
    }

    /**
     *  probability density function of uniform distribution on spherical surface
     */
    public static uniformSpherePdf () { return 1.0 / (4.0 * Math.PI); }
}

/**
 * Spherical Harmonics utility class
 */
class SH {
    private static _basisFunctions: { (v: Vec3): number }[] =
    [
        (v: Vec3): number => +0.5 * Math.sqrt(1.0 / Math.PI),
        (v: Vec3): number => -0.5 * Math.sqrt(3.0 / Math.PI) * v.y,
        (v: Vec3): number => +0.5 * Math.sqrt(3.0 / Math.PI) * v.z,
        (v: Vec3): number => -0.5 * Math.sqrt(3.0 / Math.PI) * v.x,
        (v: Vec3): number => +0.5 * Math.sqrt(15.0 / Math.PI) * v.y * v.x,
        (v: Vec3): number => -0.5 * Math.sqrt(15.0 / Math.PI) * v.y * v.z,
        (v: Vec3): number => 0.25 * Math.sqrt(5.0 / Math.PI) * (3.0 * v.z * v.z - 1.0),
        (v: Vec3): number => -0.5 * Math.sqrt(15.0 / Math.PI) * v.z * v.x,
        (v: Vec3): number => 0.25 * Math.sqrt(15.0 / Math.PI) * (v.x * v.x - v.y * v.y),
    ];

    /**
     * recreate a function from sh coefficients
     */
    public static evaluate (quality: number, sample: Vec3, coefficients: Vec3[]) {
        const result = new Vec3(0.0, 0.0, 0.0);

        const size = coefficients.length;
        for (let i = 0; i < size; i++) {
            const c = coefficients[i];
            Vec3.scaleAndAdd(result, result, c, this.evaluateBasis(quality, i, sample));
        }

        return result;
    }

    /**
     * project a function to sh coefficients
     */
    public static project (quality: number, samples: Vec3[], values: Vec3[]) {
        assertIsTrue(samples.length > 0 && samples.length === values.length);

        // integral using Monte Carlo method
        const basisCount = this.getBasisCount(quality);
        const sampleCount = samples.length;
        const scale = 1.0 / (LightProbeSampler.uniformSpherePdf() * sampleCount);

        const coefficients: Vec3[] = [];

        for (let i = 0; i < basisCount; i++) {
            const coefficient = new Vec3(0.0, 0.0, 0.0);

            for (let k = 0; k < sampleCount; k++) {
                Vec3.scaleAndAdd(coefficient, coefficient, values[k], this.evaluateBasis(quality, i, samples[k]));
            }

            Vec3.multiplyScalar(coefficient, coefficient, scale);
            coefficients.push(coefficient);
        }

        return coefficients;
    }

    /**
     * calculate irradiance's sh coefficients from radiance's sh coefficients directly
     */
    public static convolveCosine (quality: number, radianceCoefficients: Vec3[]) {
        const COSTHETA: number[] = [0.8862268925, 1.0233267546, 0.4954159260];
        const lmax = this.getBandCount(quality);

        const irradianceCoefficients: Vec3[] = [];

        for (let l = 0; l <= lmax; l++) {
            for (let m = -l; m <= l; m++) {
                const i = this.toIndex(l, m);

                const coefficient = new Vec3(0.0, 0.0, 0.0);
                Vec3.multiplyScalar(coefficient, radianceCoefficients[i], this.lambda(l) * COSTHETA[l]);
                irradianceCoefficients.push(coefficient);
            }
        }

        return irradianceCoefficients;
    }

    /**
     * return band count: lmax = 1 or lmax = 2
     */
    public static getBandCount (quality: number) {
        return (quality === LightProbeQuality.Normal ? 2 : 1);
    }

    /**
     * return basis function count
     */
    public static getBasisCount (quality: number) {
        const BASIS_COUNTS: number[] = [SH_BASIS_FAST_COUNT, SH_BASIS_NORMAL_COUNT];
        return BASIS_COUNTS[quality];
    }

    /**
     * evaluate from a basis function
     */
    public static evaluateBasis (quality: number, index: number, sample: Vec3) {
        assertIsTrue(index < this.getBasisCount(quality));
        const func = this._basisFunctions[index];

        return func(sample);
    }

    private static lambda (l: number) {
        return Math.sqrt((4.0 * Math.PI) / (2.0 * l + 1.0));
    }

    private static toIndex (l: number, m: number) {
        return l * l + l + m;
    }
}
