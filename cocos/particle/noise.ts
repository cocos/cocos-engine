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

import { Vec2, Vec3 } from '../core/math';

export class ParticleNoise {
    private permutation: number[] = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];

    constructor (permutation ? : number[]) {
        if (permutation) {
            this.permutation = permutation;
        }
    }

    public noise (x: number, y: number, z: number, min = 0, max = 1): number {
        const p: number[] = new Array(512);
        for (let i = 0; i < 256; i++) { p[256 + i] = p[i] = this.permutation[i]; }

        const X = Math.floor(x) & 255; // FIND UNIT CUBE THAT
        const Y = Math.floor(y) & 255; // CONTAINS POINT.
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x); // FIND RELATIVE X,Y,Z
        y -= Math.floor(y); // OF POINT IN CUBE.
        z -= Math.floor(z);
        const u = this.fade(x); // COMPUTE FADE CURVES
        const v = this.fade(y); // FOR EACH OF X,Y,Z.
        const w = this.fade(z);
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z; // HASH COORDINATES OF
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z; // THE 8 CUBE CORNERS,

        // The perlin noise value 0 -> 1
        const val = this.scale(this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), // AND ADD
            this.grad(p[BA], x - 1, y, z)), // BLENDED
        this.lerp(u, this.grad(p[AB], x, y - 1, z), // RESULTS
            this.grad(p[BB], x - 1, y - 1, z))), // FROM  8
        this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), // CORNERS
            this.grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
        this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1),
            this.grad(p[BB + 1], x - 1, y - 1, z - 1)))));

        return min + val * (max - min);
    }
    private fade (t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    private lerp (t: number, a: number, b: number): number {
        return a + t * (b - a);
    }
    private grad (hash: number, x: number, y: number, z: number): number {
        const h = hash & 15; // CONVERT LO 4 BITS OF HASH CODE
        const u = h < 8 ? x : y; // INTO 12 this.gradIENT DIRECTIONS.
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    private scale (n: number): number {
        return (1 + n) / 2;
    }

    private accSpeed: Vec3 = new Vec3();
    private noiseSpeed: Vec3 = new Vec3();
    private noiseFrequency = 0.0;
    private noiseAbs: Vec3 = new Vec3();
    private noiseAmplitude: Vec3 = new Vec3();
    private octaves: Vec3 = new Vec3();
    private dt = 0.0;
    private point: Vec3 = new Vec3();
    private result: Vec3 = new Vec3();
    private mixOut: Vec2 = new Vec2();

    public setSpeed (x, y, z) {
        this.noiseSpeed.set(x, y, z);
    }

    public setFrequency (f) {
        this.noiseFrequency = f;
    }

    public setAbs (x, y, z) {
        this.noiseAbs.set(x, y, z);
    }

    public setAmplititude (x, y, z) {
        this.noiseAmplitude.set(x, y, z);
    }

    public setOctaves (x, y, z) {
        this.octaves.set(x, y, z);
    }

    public setTime (t) {
        this.dt = t;
    }

    public setSamplePoint (p: Vec3) {
        this.point.set(p);
    }

    public getResult (): Vec3 {
        return this.result;
    }

    private getNoise (sx: number, sy: number, sz: number, time: number, offset: Vec3, noiseFrequency: number, octaves: Vec3): number {
        let frequency = noiseFrequency;
        let sum = 0.0;
        sum += this.noise(sx * frequency, sy * frequency, sz * frequency, -1.0, 1.0);
        if (octaves.x === 1) {
            return sum;
        }

        let amplitude = 1.0;
        let range = 1.0;
        for (let i = 1; i < octaves.x; ++i) {
            amplitude *= octaves.y;
            frequency *= octaves.z;
            range += amplitude;

            sum += this.noise(sx * frequency, sy * frequency, sz * frequency, -1.0, 1.0) * amplitude;
        }
        return sum / range;
    }

    private getNoiseMix (out: Vec2, point: Vec3, time: number, offSpeed: Vec3, noiseFrequency: number, octaves: Vec3) {
        out.x = this.getNoise(point.x, point.y, point.z, time, offSpeed, noiseFrequency, octaves);
        out.y = this.getNoise(point.y, point.z, point.x, time, offSpeed, noiseFrequency, octaves);
    }

    public getNoiseParticle () {
        this.accSpeed.set(this.noiseSpeed.x * this.dt, this.noiseSpeed.y * this.dt, this.noiseSpeed.z * this.dt);

        const axisOffset = 1000.0;
        // eslint-disable-next-line max-len
        const sampX = this.getNoise(this.point.z + this.accSpeed.x, this.point.y, this.point.x, this.dt, this.accSpeed, this.noiseFrequency, this.octaves);
        // eslint-disable-next-line max-len
        const sampY = this.getNoise(this.point.x + axisOffset, this.point.z + this.accSpeed.y, this.point.y, this.dt, this.accSpeed, this.noiseFrequency, this.octaves);
        // eslint-disable-next-line max-len
        const sampZ = this.getNoise(this.point.y, this.point.x + axisOffset, this.point.z + this.accSpeed.z, this.dt, this.accSpeed, this.noiseFrequency, this.octaves);

        this.result.set(sampX * this.noiseAmplitude.x, sampY * this.noiseAmplitude.y, sampZ * this.noiseAmplitude.z);
    }

    public getPreview (out: number[], width: number, height: number) {
        for (let h = 0; h < height; ++h) {
            for (let w = 0; w < width; ++w) {
                const sampx = (w - width * 0.5) / width + this.noiseSpeed.x * this.dt;
                const sampy = (h - height * 0.5) / height + this.noiseSpeed.y * this.dt;
                const pix = this.getNoise(sampx, sampy, 0.0, this.dt, this.accSpeed, this.noiseFrequency, this.octaves);
                out[h * width + w] = (pix + 1.0) * 0.5;
            }
        }
    }
}
