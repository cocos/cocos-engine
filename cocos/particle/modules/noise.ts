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

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { CCBoolean, CCFloat, CCInteger } from '../../core';
import { range, rangeStep, slide, visible } from '../../core/data/decorators/editable';
import { lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { ParticleNoise } from '../noise';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';

const samplePosition = new Vec3();
const velocity = new Vec3();
const tempAmplitude = new Vec3();
const RANDOM_SEED_OFFSET_X = 112331;
const RANDOM_SEED_OFFSET_Y = 291830;
const RANDOM_SEED_OFFSET_Z = 616728;
const RANDOM_SEED_OFFSET = 332133;

@ccclass('cc.NoiseModule')
export class NoiseModule extends ParticleModule {
    @serializable
    public separateAxes = false;

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthX () {
        return this._sx;
    }

    set strengthX (value) {
        this._sx = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthY () {
        if (!this._sy) {
            this._sy = new CurveRange(1);
        }
        return this._sy;
    }
    set strengthY (value) {
        this._sy = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthZ () {
        if (!this._sz) {
            this._sz = new CurveRange(1);
        }
        return this._sz;
    }
    set strengthZ (value) {
        this._sz = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return !this.separateAxes; })
    get strength () {
        return this.strengthX;
    }

    set strength (val) {
        this.strengthX = val;
    }

    @type(CCFloat)
    get frequency () {
        return this._frequency;
    }
    set frequency (value) {
        this._frequency = value;
    }

    @type(CurveRange)
    get scrollSpeed () {
        return this._scrollSpeed;
    }

    set scrollSpeed (val) {
        this._scrollSpeed = val;
    }

    @type(CCInteger)
    @range([1, 4])
    @rangeStep(1)
    @slide
    get octaves () {
        return this._octaves;
    }
    set octaves (value: number) {
        this._octaves = value;
    }

    // eslint-disable-next-line func-names
    @visible(function (this: NoiseModule) { return this._octaves > 1; })
    @type(CCFloat)
    @range([0, 1])
    @rangeStep(0.1)
    get octaveMultiplier () {
        return this._octaveMultiplier;
    }
    set octaveMultiplier (value: number) {
        this._octaveMultiplier = value;
    }

    // eslint-disable-next-line func-names
    @visible(function (this: NoiseModule) { return this._octaves > 1; })
    @type(CCFloat)
    @range([1, 4])
    @rangeStep(0.1)
    get octaveScale () {
        return this._octaveScale;
    }
    set octaveScale (value: number) {
        this._octaveScale = value;
    }

    @serializable
    public enableRemap = false;

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapX () {
        if (!this._rx) {
            this._rx = new CurveRange(1);
        }
        return this._rx;
    }
    set remapX (value) {
        this._rx = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapY () {
        if (!this._ry) {
            this._ry = new CurveRange(1);
        }
        return this._ry;
    }
    set remapY (value) {
        this._ry = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapZ () {
        if (!this._rz) {
            this._rz = new CurveRange(1);
        }
        return this._rz;
    }
    set remapZ (value) {
        this._rz = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && !this.separateAxes; })
    get remapCurve () {
        return this.remapX;
    }
    set remapCurve (value) {
        this.remapX = value;
    }

    @type(CurveRange)
    @serializable
    public positionAmount = new CurveRange(1);
    @type(CurveRange)
    @serializable
    public rotationAmount = new CurveRange();
    @type(CurveRange)
    @serializable
    public sizeAmount = new CurveRange();

    public get name (): string {
        return 'NoiseModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public get updatePriority (): number {
        return 3;
    }

    @serializable
    private _sx = new CurveRange(1);
    @serializable
    private _sy: CurveRange | null = null;
    @serializable
    private _sz: CurveRange | null = null;
    @serializable
    private _scrollSpeed = new CurveRange();
    @serializable
    private _frequency = 0.5;
    @serializable
    private _rx: CurveRange | null = null;
    @serializable
    private _ry: CurveRange | null = null;
    @serializable
    private _rz: CurveRange | null = null;
    @serializable
    private _octaves = 1;
    @serializable
    private _octaveScale = 2;
    @serializable
    private _octaveMultiplier = 0.5;

    private _randomSeed = randomRangeInt(0, 233280);

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { accumulatedTime, normalizedTimeInCycle, deltaTime } = particleUpdateContext;
        const { count, randomSeed, normalizedAliveTime } = particles;
        const scrollOffset = this._scrollSpeed.evaluate(normalizedTimeInCycle, 1) * deltaTime;
        const frequency = Math.max(this.frequency, 0);
        const offsetX = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_X) * 100;
        const offsetY = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Y) * 100;
        const offsetZ = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Z) * 100;
        if (this._octaves > 1) {

        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.separateAxes) {
                if (this.strengthX.mode === CurveRange.Mode.Constant) {
                    const amplitude = Vec3.set(tempAmplitude, this.strengthX.constant, this.strengthY.constant, this.strengthZ.constant);
                    for (let i = 0; i < count; i++) {
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiply(velocity, velocity, amplitude), i);
                    }
                } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: multiplierX } = this.strengthX;
                    const { spline: splineY, multiplier: multiplierY } = this.strengthY;
                    const { spline: splineZ, multiplier: multiplierZ } = this.strengthZ;
                    for (let i = 0; i < count; i++) {
                        const life = normalizedAliveTime[i];
                        const amplitude = Vec3.set(tempAmplitude, splineX.evaluate(life) * multiplierX,
                            splineY.evaluate(life) * multiplierY,
                            splineZ.evaluate(life) * multiplierZ);
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiply(velocity, velocity, amplitude), i);
                    }
                } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMax: xMax, constantMin: xMin } = this.strengthX;
                    const { constantMax: yMax, constantMin: yMin } = this.strengthY;
                    const { constantMax: zMax, constantMin: zMin } = this.strengthZ;
                    for (let i = 0; i < count; i++) {
                        const seed = randomSeed[i];
                        const amplitude = Vec3.set(tempAmplitude, lerp(xMin, xMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_X)),
                            lerp(yMin, yMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Y)),
                            lerp(zMin, zMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Z)));
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiply(velocity, velocity, amplitude), i);
                    }
                } else {
                    const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.strengthX;
                    const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.strengthY;
                    const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.strengthZ;
                    for (let i = 0; i < count; i++) {
                        const life = normalizedAliveTime[i];
                        const seed = randomSeed[i];
                        const amplitude = Vec3.set(tempAmplitude, lerp(xMin.evaluate(life),
                            xMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_X)) * xMultiplier,
                        lerp(yMin.evaluate(life),
                            yMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Y)) * yMultiplier,
                        lerp(zMin.evaluate(life),
                            zMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Z)) * zMultiplier);
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiply(velocity, velocity, amplitude), i);
                    }
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this.strengthX.mode === CurveRange.Mode.Constant) {
                    const amplitude = this.strengthX.constant;
                    for (let i = 0; i < count; i++) {
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiplyScalar(velocity, velocity, amplitude), i);
                    }
                } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                    const { spline, multiplier } = this.strengthX;
                    for (let i = 0; i < count; i++) {
                        const amplitude = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiplyScalar(velocity, velocity, amplitude), i);
                    }
                } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                    const { constantMax, constantMin } = this.strengthX;
                    for (let i = 0; i < count; i++) {
                        const amplitude = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i]));
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiplyScalar(velocity, velocity, amplitude), i);
                    }
                } else {
                    const { splineMin, splineMax, multiplier } = this.strengthX;
                    for (let i = 0; i < count; i++) {
                        const life = normalizedAliveTime[i];
                        const amplitude = lerp(splineMin.evaluate(life),
                            splineMax.evaluate(life), pseudoRandom(randomSeed[i])) * multiplier;
                        particles.getPositionAt(samplePosition, i);
                        samplePosition.add3f(offsetX, offsetY, offsetZ);
                        Vec3.set(velocity, noise(samplePosition.y, samplePosition.x + 100, samplePosition.z + scrollOffset, frequency),
                            noise(samplePosition.z, samplePosition.y, samplePosition.x + scrollOffset, frequency),
                            noise(samplePosition.x + 100, samplePosition.z, samplePosition.y + scrollOffset, frequency));
                        particles.addAnimatedVelocityAt(Vec3.multiplyScalar(velocity, velocity, amplitude), i);
                    }
                }
            }
        }
    }

    public getNoisePreview (out: number[], time, width: number, height: number) {
        return out;
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        const serializedProps = ['separateAxes', '_sx', '_scrollSpeed', '_frequency',
            'enableRemap', '_octaves', '_octaveScale', '_octaveMultiplier'];
        if (this.enableRemap) {
            serializedProps.push('_rx');
        }
        if (this.separateAxes) {
            serializedProps.push('_sy, _sz');
        }
        if (this.enableRemap && this.separateAxes) {
            serializedProps.push('_ry, _rz');
        }
        return serializedProps;
    }
}

// https://mrl.cs.nyu.edu/~perlin/noise/
const permutation = [151, 160, 137, 91, 90, 15,
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

const p = new Array<number>(512);
for (let i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i];

function noise (x: number, y: number, z: number, frequency: number) {
    x *= frequency;
    y *= frequency;
    z *= frequency;
    const X = Math.floor(x) & 255;                  // FIND UNIT CUBE THAT
    const Y = Math.floor(y) & 255;                  // CONTAINS POINT.
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
    y -= Math.floor(y);                                // OF POINT IN CUBE.
    z -= Math.floor(z);
    const u = fade(x);                                // COMPUTE FADE CURVES
    const v = fade(y);                                // FOR EACH OF X,Y,Z.
    const w = fade(z);
    const A = p[X] + Y; const AA = p[A] + Z; const AB = p[A + 1] + Z;      // HASH COORDINATES OF
    const B = p[X + 1] + Y; const BA = p[B] + Z; const BB = p[B + 1] + Z;      // THE 8 CUBE CORNERS,

    return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
        grad(p[BA], x - 1, y, z)), // BLENDED
    lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
        grad(p[BB], x - 1, y - 1, z))), // FROM  8
    lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
        grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
    lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
        grad(p[BB + 1], x - 1, y - 1, z - 1)))) * frequency;
}

function accumulatedNoise (x: number, y: number, z: number, frequency: number, octaveCount: number, octaveScale: number, octaveMultiplier: number) {
    let sum = noise(x, y, z, frequency);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveCount; i++) {
        frequency *= octaveScale;
        amplitude *= octaveMultiplier;
        range += amplitude;

        sum += noise(x, y, z, frequency) * amplitude;
    }
    return sum / range;
}

function grad (hash: number, x: number, y: number, z: number) {
    const h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
    const u = h < 8 ? x : y;                 // INTO 12 GRADIENT DIRECTIONS.
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function fade (t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
