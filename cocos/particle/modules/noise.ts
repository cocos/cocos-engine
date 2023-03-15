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
import { DEBUG } from 'internal:constants';
import { assert, CCBoolean, CCFloat, CCInteger, Enum, warn } from '../../core';
import { range, rangeStep, slide, visible } from '../../core/data/decorators/editable';
import { clamp, lerp, pseudoRandom, randomRangeInt, Vec2, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { perlin1D, perlin2D, perlin3D, PerlinNoise1DCache, PerlinNoise2DCache, PerlinNoise3DCache } from './perlin-noise';

const pos = new Vec3();
const point3D = new Vec3();
const point2D = new Vec2();
const sampleX = new Vec2();
const sampleY = new Vec2();
const sampleZ = new Vec2();
const velocity = new Vec3();
const RANDOM_SEED_OFFSET_X = 112331;
const RANDOM_SEED_OFFSET_Y = 291830;
const RANDOM_SEED_OFFSET_Z = 616728;
const RANDOM_SEED_OFFSET_POSITION = 943728;
const RANDOM_SEED_OFFSET_ROTATION = 746210;
const noiseXCache3D = new PerlinNoise3DCache();
const noiseYCache3D = new PerlinNoise3DCache();
const noiseZCache3D = new PerlinNoise3DCache();
const noiseXCache2D = new PerlinNoise2DCache();
const noiseYCache2D = new PerlinNoise2DCache();
const noiseZCache2D = new PerlinNoise2DCache();
const noiseXCache1D = new PerlinNoise1DCache();
const noiseYCache1D = new PerlinNoise1DCache();
const noiseZCache1D = new PerlinNoise1DCache();

enum Quality {
    LOW,
    MIDDLE,
    HIGH
}

@ccclass('cc.NoiseModule')
@ParticleModule.register('Noise', ModuleExecStage.UPDATE, 3)
export class NoiseModule extends ParticleModule {
    @serializable
    @visible(true)
    public separateAxes = false;

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthX () {
        return this._strengthX;
    }

    set strengthX (value) {
        this._strengthX = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthY () {
        if (!this._strengthY) {
            this._strengthY = new CurveRange(1);
        }
        return this._strengthY;
    }
    set strengthY (value) {
        this._strengthY = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    get strengthZ () {
        if (!this._strengthZ) {
            this._strengthZ = new CurveRange(1);
        }
        return this._strengthZ;
    }
    set strengthZ (value) {
        this._strengthZ = value;
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

    @serializable
    @visible(true)
    public damping = true;

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

    @type(Enum(Quality))
    @serializable
    @visible(true)
    public quality = Quality.HIGH;

    @serializable
    @visible(true)
    public enableRemap = false;

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapX () {
        if (!this._remapX) {
            this._remapX = new CurveRange(1);
        }
        return this._remapX;
    }
    set remapX (value) {
        this._remapX = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapY () {
        if (!this._remapY) {
            this._remapY = new CurveRange(1);
        }
        return this._remapY;
    }
    set remapY (value) {
        this._remapY = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    get remapZ () {
        if (!this._remapZ) {
            this._remapZ = new CurveRange(1);
        }
        return this._remapZ;
    }
    set remapZ (value) {
        this._remapZ = value;
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
    @visible(true)
    public positionAmount = new CurveRange(1);

    @type(CurveRange)
    @serializable
    @visible(true)
    public rotationAmount = new CurveRange();

    @type(CurveRange)
    @serializable
    @visible(true)
    public sizeAmount = new CurveRange();

    @serializable
    private _strengthX = new CurveRange(1);
    @serializable
    private _strengthY: CurveRange | null = null;
    @serializable
    private _strengthZ: CurveRange | null = null;
    @serializable
    private _scrollSpeed = new CurveRange();
    @serializable
    private _frequency = 0.5;
    @serializable
    private _remapX: CurveRange | null = null;
    @serializable
    private _remapY: CurveRange | null = null;
    @serializable
    private _remapZ: CurveRange | null = null;
    @serializable
    private _octaves = 1;
    @serializable
    private _octaveScale = 2;
    @serializable
    private _octaveMultiplier = 0.5;

    private _randomSeed = randomRangeInt(0, 233280);
    private _scrollOffset = 0;

    public tick (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._scrollOffset += this._scrollSpeed.evaluate(context.normalizedTimeInCycle, 1) * context.deltaTime;
        if (this._scrollOffset > 256) {
            this._scrollOffset -= 256;
        }
    }

    public execute (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { randomSeed, normalizedAliveTime, noiseX, noiseY, noiseZ, rotationX, rotationY, rotationZ, sizeX, sizeY, sizeZ } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const scrollOffset = this._scrollOffset;
        const frequency = Math.max(this.frequency, 0);
        const offsetX = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_X) * 100;
        const offsetY = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Y) * 100;
        const offsetZ = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Z) * 100;
        const { octaves,  octaveScale, octaveMultiplier } = this;
        const amplitudeScale = this.damping ? (1 / this.frequency) : 1;
        if (octaves > 1) {
            if (this.quality === Quality.MIDDLE) {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec2.set(point2D, pos.z, pos.y + scrollOffset);
                    accumulateNoise2D(sampleX, point2D, frequency, noiseXCache2D, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(point2D, pos.x + 100, pos.z + scrollOffset);
                    accumulateNoise2D(sampleY, point2D, frequency, noiseYCache2D, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(point2D, pos.y, pos.x + 100 + scrollOffset);
                    accumulateNoise2D(sampleZ, point2D, frequency, noiseZCache2D, octaves, octaveScale, octaveMultiplier);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            } else if (this.quality === Quality.HIGH) {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec3.set(point3D, pos.z, pos.y, pos.x + scrollOffset);
                    accumulateNoise3D(sampleX, point3D, frequency, noiseXCache3D, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(point3D, pos.x + 100, pos.z, pos.y + scrollOffset);
                    accumulateNoise3D(sampleY, point3D, frequency, noiseYCache3D, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(point3D, pos.y, pos.x + 100, pos.z + scrollOffset);
                    accumulateNoise3D(sampleZ, point3D, frequency, noiseZCache3D, octaves, octaveScale, octaveMultiplier);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    accumulateNoise1D(sampleX, pos.z + scrollOffset, frequency, noiseXCache1D, octaves, octaveScale, octaveMultiplier);
                    accumulateNoise1D(sampleY, pos.x + 100 + scrollOffset, frequency, noiseYCache1D, octaves, octaveScale, octaveMultiplier);
                    accumulateNoise1D(sampleZ, pos.y + scrollOffset, frequency, noiseZCache1D, octaves, octaveScale, octaveMultiplier);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.quality === Quality.HIGH) {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin3D(sampleX, Vec3.set(point3D, pos.z, pos.y, pos.x + scrollOffset), frequency, noiseXCache3D);
                    perlin3D(sampleY, Vec3.set(point3D, pos.x + 100, pos.z, pos.y + scrollOffset), frequency, noiseYCache3D);
                    perlin3D(sampleZ, Vec3.set(point3D, pos.y, pos.x + 100, pos.z + scrollOffset), frequency, noiseZCache3D);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            } else if (this.quality === Quality.MIDDLE) {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin2D(sampleX, Vec2.set(point2D, pos.z, pos.y + scrollOffset), frequency, noiseXCache2D);
                    perlin2D(sampleY, Vec2.set(point2D, pos.x + 100, pos.z + scrollOffset), frequency, noiseYCache2D);
                    perlin2D(sampleZ, Vec2.set(point2D, pos.y, pos.x + 100 + scrollOffset), frequency, noiseZCache2D);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin1D(sampleX, pos.z + scrollOffset, frequency, noiseXCache1D);
                    perlin1D(sampleY, pos.x + 100 + scrollOffset, frequency, noiseYCache1D);
                    perlin1D(sampleZ, pos.y + scrollOffset, frequency, noiseZCache1D);
                    noiseX[i] = sampleZ.x - sampleY.y;
                    noiseY[i] = sampleX.x - sampleZ.y;
                    noiseZ[i] = sampleY.x - sampleX.y;
                }
            }
        }
        // remap
        if (this.enableRemap) {
            if (this.separateAxes) {
                if (DEBUG) {
                    assert(this.remapX.mode === this.remapY.mode && this.remapZ.mode === this.remapY.mode,
                        'The remapX, remapY, remapZ must be same mode');
                }
                if (this.remapX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: multiplierX } = this.remapX;
                    const { spline: splineY, multiplier: multiplierY } = this.remapY;
                    const { spline: splineZ, multiplier: multiplierZ } = this.remapZ;
                    for (let i = fromIndex; i < toIndex; i++) {
                        noiseX[i] = splineX.evaluate(clamp(noiseX[i] * 0.5 + 0.5, 0, 1)) * multiplierX;
                        noiseY[i] = splineY.evaluate(clamp(noiseY[i] * 0.5 + 0.5, 0, 1)) * multiplierY;
                        noiseZ[i] = splineZ.evaluate(clamp(noiseY[i] * 0.5 + 0.5, 0, 1)) * multiplierZ;
                    }
                } else {
                    warn('The remap curve range muse be Curve Mode');
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this.remapX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: multiplierX } = this.remapX;
                    for (let i = fromIndex; i < toIndex; i++) {
                        noiseX[i] = splineX.evaluate(clamp(noiseX[i] * 0.5 + 0.5, 0, 1)) * multiplierX;
                        noiseY[i] = splineX.evaluate(clamp(noiseY[i] * 0.5 + 0.5, 0, 1)) * multiplierX;
                        noiseZ[i] = splineX.evaluate(clamp(noiseY[i] * 0.5 + 0.5, 0, 1)) * multiplierX;
                    }
                } else {
                    warn('The remap curve range muse be Curve Mode');
                }
            }
        }
        // eslint-disable-next-line no-lonely-if
        if (this.separateAxes) {
            if (this.strengthX.mode === CurveRange.Mode.Constant) {
                const amplitudeX = this.strengthX.constant * amplitudeScale;
                const amplitudeY = this.strengthY.constant * amplitudeScale;
                const amplitudeZ = this.strengthZ.constant * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    noiseX[i] *= amplitudeX;
                    noiseY[i] *= amplitudeY;
                    noiseZ[i] *= amplitudeZ;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline: splineX } = this.strengthX;
                const { spline: splineY } = this.strengthY;
                const { spline: splineZ } = this.strengthZ;
                const multiplierX = this.strengthX.multiplier * amplitudeScale;
                const multiplierY = this.strengthY.multiplier * amplitudeScale;
                const multiplierZ = this.strengthZ.multiplier * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    noiseX[i] *= splineX.evaluate(life) * multiplierX;
                    noiseY[i] *= splineY.evaluate(life) * multiplierY;
                    noiseZ[i] *= splineZ.evaluate(life) * multiplierZ;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const xMax = this.strengthX.constantMax * amplitudeScale;
                const xMin = this.strengthX.constantMin * amplitudeScale;
                const yMax = this.strengthY.constantMax * amplitudeScale;
                const yMin = this.strengthY.constantMin * amplitudeScale;
                const zMax = this.strengthZ.constantMax * amplitudeScale;
                const zMin = this.strengthZ.constantMin * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    noiseX[i] *= lerp(xMin, xMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_X));
                    noiseY[i] *= lerp(yMin, yMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Y));
                    noiseZ[i] *= lerp(zMin, zMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Z));
                }
            } else {
                const { splineMin: xMin, splineMax: xMax } = this.strengthX;
                const { splineMin: yMin, splineMax: yMax } = this.strengthY;
                const { splineMin: zMin, splineMax: zMax } = this.strengthZ;
                const xMultiplier = this.strengthX.multiplier * amplitudeScale;
                const yMultiplier = this.strengthY.multiplier * amplitudeScale;
                const zMultiplier = this.strengthZ.multiplier * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const seed = randomSeed[i];
                    noiseX[i] *= lerp(xMin.evaluate(life),
                        xMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_X)) * xMultiplier;
                    noiseY[i] *= lerp(yMin.evaluate(life),
                        yMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Y)) * yMultiplier;
                    noiseZ[i] *= lerp(zMin.evaluate(life),
                        zMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Z)) * zMultiplier;
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.strengthX.mode === CurveRange.Mode.Constant) {
                const amplitude = this.strengthX.constant * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline } = this.strengthX;
                const multiplier = this.strengthX.multiplier * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amplitude = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const constantMax = this.strengthX.constantMax * amplitudeScale;
                const constantMin = this.strengthX.constantMin * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amplitude = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i]));
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else {
                const { splineMin, splineMax } = this.strengthX;
                const multiplier = this.strengthX.multiplier * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amplitude = lerp(splineMin.evaluate(life),
                        splineMax.evaluate(life), pseudoRandom(randomSeed[i])) * multiplier;
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            }
        }

        if (this.positionAmount.getMax() !== 0) {
            if (this.positionAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.positionAmount.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.positionAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.TwoCurves) {
                const { constantMin, constantMax } = this.positionAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION));
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.positionAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION)) * multiplier;
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            }
        }

        if (this.rotationAmount.getMax() !== 0) {
            if (this.rotationAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.rotationAmount.constant * deltaTime;
                for (let i = fromIndex; i < toIndex; i++) {
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.Curve) {
                const { spline } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier * deltaTime;
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.rotationAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * deltaTime;
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else {
                const { splineMin, splineMax } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            }
        }

        if (this.sizeAmount.getMax() !== 0) {
            if (this.sizeAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.sizeAmount.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.sizeAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.sizeAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION));
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.sizeAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
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
        const serializedProps = ['separateAxes', '_strengthX', '_scrollSpeed', '_frequency',
            'enableRemap', '_octaves', '_octaveScale', '_octaveMultiplier', 'quality', 'damping'];
        if (this.enableRemap) {
            serializedProps.push('_remapX');
        }
        if (this.separateAxes) {
            serializedProps.push('_strengthY, _strengthZ');
        }
        if (this.enableRemap && this.separateAxes) {
            serializedProps.push('_remapY, _remapZ');
        }
        return serializedProps;
    }
}

const tempSample = new Vec2();

function accumulateNoise1D (outSample: Vec2, pos: number, frequency: number, cache: PerlinNoise1DCache, octaveToIndex: number, octaveScale: number, octaveMultiplier: number) {
    const sum = perlin1D(outSample, pos, frequency, cache);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveToIndex; i++) {
        frequency *= octaveScale;
        amplitude *= octaveMultiplier;
        range += amplitude;
        Vec2.scaleAndAdd(sum, sum, perlin1D(tempSample, pos, frequency, cache), amplitude);
    }
    return Vec2.multiplyScalar(sum, sum, 1 / range);
}

function accumulateNoise2D (outSample: Vec2, pos: Vec2, frequency: number, cache: PerlinNoise2DCache, octaveToIndex: number, octaveScale: number, octaveMultiplier: number) {
    const sum = perlin2D(outSample, pos, frequency, cache);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveToIndex; i++) {
        frequency *= octaveScale;
        amplitude *= octaveMultiplier;
        range += amplitude;
        Vec2.scaleAndAdd(sum, sum, perlin2D(tempSample, pos, frequency, cache), amplitude);
    }
    return Vec2.multiplyScalar(sum, sum, 1 / range);
}

function accumulateNoise3D (outSample: Vec2, pos: Vec3, frequency: number, cache: PerlinNoise3DCache, octaveToIndex: number, octaveScale: number, octaveMultiplier: number) {
    const sum = perlin3D(outSample, pos, frequency, cache);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveToIndex; i++) {
        frequency *= octaveScale;
        amplitude *= octaveMultiplier;
        range += amplitude;
        Vec2.scaleAndAdd(sum, sum, perlin3D(tempSample, pos, frequency, cache), amplitude);
    }
    return Vec2.multiplyScalar(sum, sum, 1 / range);
}
