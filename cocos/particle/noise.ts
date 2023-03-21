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

import { Vec2, Vec3 } from '../core/math';
import { perlin3D, PerlinNoise3DCache } from './noise-util'

const _temp_v3 = new Vec3();
const _temp_v2 = new Vec2();
const sampleX = new Vec2();
const sampleY = new Vec2();
const sampleZ = new Vec2();

export class ParticleNoise {
    constructor () {
        this.noiseCache = new PerlinNoise3DCache();
    }

    private noise (out: Vec2, sx: number, sy: number, sz: number, freq: number) {
        _temp_v3.set(sx, sy, sz);
        return perlin3D(out, _temp_v3, freq, this.noiseCache);
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
    private noiseCache: PerlinNoise3DCache;

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

    private accumulateNoise3D (outSample: Vec2, x: number, y: number, z: number, frequency: number, octaveToIndex: number, octaveScale: number, octaveMultiplier: number) {
        const sum = this.noise(outSample, x, y, z, frequency);
        let amplitude = 1;
        let range = 1;
        for (let i = 1; i < octaveToIndex; i++) {
            frequency *= octaveScale;
            amplitude *= octaveMultiplier;
            range += amplitude;
            Vec2.scaleAndAdd(sum, sum, this.noise(_temp_v2, x, y, z, frequency), amplitude);
        }
        return Vec2.multiplyScalar(sum, sum, 1 / range);
    }

    private getNoise (out: Vec2, sx: number, sy: number, sz: number, noiseFrequency: number, octaves: Vec3) {
        this.accumulateNoise3D(out, sx, sy, sz, noiseFrequency, octaves.x, octaves.z, octaves.y);
    }

    public getNoiseParticle () {
        this.accSpeed.set(this.noiseSpeed.x * this.dt, this.noiseSpeed.y * this.dt, this.noiseSpeed.z * this.dt);

        const axisOffset = 1000.0;
        // eslint-disable-next-line max-len
        this.getNoise(sampleX, this.point.z + this.accSpeed.x, this.point.y, this.point.x, this.noiseFrequency, this.octaves);
        // eslint-disable-next-line max-len
        this.getNoise(sampleY, this.point.x + axisOffset, this.point.z + this.accSpeed.y, this.point.y, this.noiseFrequency, this.octaves);
        // eslint-disable-next-line max-len
        this.getNoise(sampleZ, this.point.y, this.point.x + axisOffset, this.point.z + this.accSpeed.z, this.noiseFrequency, this.octaves);

        const sampX = sampleZ.x - sampleY.y;
        const sampY = sampleX.x - sampleZ.y;
        const sampZ = sampleY.x - sampleX.y;

        this.result.set(sampX * this.noiseAmplitude.x, sampY * this.noiseAmplitude.y, sampZ * this.noiseAmplitude.z);
    }

    public getPreview (out: number[], width: number, height: number) {
        for (let h = 0; h < height; ++h) {
            for (let w = 0; w < width; ++w) {
                const sampx = (w - width * 0.5) / width + this.noiseSpeed.x * this.dt;
                const sampy = (h - height * 0.5) / height + this.noiseSpeed.y * this.dt;
                this.getNoise(sampleY, sampx, sampy, 0.0, this.noiseFrequency, this.octaves);
                this.getNoise(sampleZ, sampx, sampy, 0.0, this.noiseFrequency, this.octaves);
                const pix = sampleZ.x - sampleY.y;
                out[h * width + w] = (pix + 1.0) * 0.5;
            }
        }
    }
}
