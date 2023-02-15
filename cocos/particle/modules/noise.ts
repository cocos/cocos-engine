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
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { perlinNoise1D, perlinNoise2D, perlinNoise3D } from './perlin-noise';

const pos = new Vec3();
const sample3D = new Vec3();
const sample2D = new Vec2();
const velocity = new Vec3();
const RANDOM_SEED_OFFSET_X = 112331;
const RANDOM_SEED_OFFSET_Y = 291830;
const RANDOM_SEED_OFFSET_Z = 616728;
const RANDOM_SEED_OFFSET_POSITION = 943728;
const RANDOM_SEED_OFFSET_ROTATION = 746210;

enum Quality {
    LOW,
    MIDDLE,
    HIGH
}

@ccclass('cc.NoiseModule')
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

    public update (particles: ParticleSOAData, params: ParticleSystemParams, particleUpdateContext: ParticleUpdateContext) {
        const { normalizedTimeInCycle, deltaTime } = particleUpdateContext;
        const { count, randomSeed, normalizedAliveTime, noiseX, noiseY, noiseZ, rotationX, rotationY, rotationZ, sizeX, sizeY, sizeZ } = particles;
        this._scrollOffset += this._scrollSpeed.evaluate(normalizedTimeInCycle, 1) * deltaTime;
        const scrollOffset = this._scrollOffset;
        const frequency = Math.max(this.frequency, 0);
        const offsetX = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_X) * 100;
        const offsetY = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Y) * 100;
        const offsetZ = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Z) * 100;
        const { octaves,  octaveScale, octaveMultiplier } = this;
        if (octaves > 1) {
            if (this.quality === Quality.MIDDLE) {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec2.set(sample2D, pos.y, pos.x + 100 + scrollOffset);
                    noiseX[i] = accumulateNoise2D(sample2D, frequency, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(sample2D, pos.z, pos.y + scrollOffset);
                    noiseY[i] = accumulateNoise2D(sample2D, frequency, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(sample2D, pos.x + 100, pos.z + scrollOffset);
                    noiseZ[i] = accumulateNoise2D(sample2D, frequency, octaves, octaveScale, octaveMultiplier);
                }
            } else if (this.quality === Quality.HIGH) {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec3.set(sample3D, pos.y, pos.x + 100, pos.z + scrollOffset);
                    noiseX[i] = accumulateNoise3D(sample3D, frequency, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(sample3D, pos.z, pos.y, pos.x + scrollOffset);
                    noiseY[i] = accumulateNoise3D(sample3D, frequency, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(sample3D, pos.x + 100, pos.z, pos.y + scrollOffset);
                    noiseZ[i] = accumulateNoise3D(sample3D, frequency, octaves, octaveScale, octaveMultiplier);
                }
            } else {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    noiseX[i] = accumulateNoise1D(pos.y + scrollOffset, frequency, octaves, octaveScale, octaveMultiplier);
                    noiseY[i] = accumulateNoise1D(pos.z + scrollOffset, frequency, octaves, octaveScale, octaveMultiplier);
                    noiseZ[i] = accumulateNoise1D(pos.x + 100 + scrollOffset, frequency, octaves, octaveScale, octaveMultiplier);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.quality === Quality.HIGH) {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec3.set(sample3D, pos.y, pos.x + 100, pos.z + scrollOffset);
                    Vec3.multiplyScalar(sample3D, sample3D, frequency);
                    noiseX[i] = perlinNoise3D(sample3D);
                    Vec3.set(sample3D, pos.z, pos.y, pos.x + scrollOffset);
                    Vec3.multiplyScalar(sample3D, sample3D, frequency);
                    noiseY[i] = perlinNoise3D(sample3D);
                    Vec3.set(sample3D, pos.x + 100, pos.z, pos.y + scrollOffset);
                    Vec3.multiplyScalar(sample3D, sample3D, frequency);
                    noiseZ[i] = perlinNoise3D(sample3D);
                }
            } else if (this.quality === Quality.MIDDLE) {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec2.set(sample2D, pos.y, pos.x + 100 + scrollOffset);
                    Vec2.multiplyScalar(sample2D, sample2D, frequency);
                    noiseX[i] = perlinNoise2D(sample2D);
                    Vec2.set(sample2D, pos.z, pos.y + scrollOffset);
                    Vec2.multiplyScalar(sample3D, sample3D, frequency);
                    noiseY[i] = perlinNoise2D(sample2D);
                    Vec2.set(sample2D, pos.x + 100, pos.z + scrollOffset);
                    Vec2.multiplyScalar(sample2D, sample2D, frequency);
                    noiseZ[i] = perlinNoise2D(sample2D);
                }
            } else {
                for (let i = 0; i < count; i++) {
                    particles.getPositionAt(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    noiseX[i] = perlinNoise1D((pos.y + scrollOffset) * frequency);
                    noiseY[i] = perlinNoise1D((pos.z + scrollOffset) * frequency);
                    noiseZ[i] = perlinNoise1D((pos.x + 100 + scrollOffset) * frequency);
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
                    for (let i = 0; i < count; i++) {
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
                    for (let i = 0; i < count; i++) {
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
                const amplitudeX = this.strengthX.constant;
                const amplitudeY = this.strengthY.constant;
                const amplitudeZ = this.strengthZ.constant;
                for (let i = 0; i < count; i++) {
                    noiseX[i] *= amplitudeX;
                    noiseY[i] *= amplitudeY;
                    noiseZ[i] *= amplitudeZ;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline: splineX, multiplier: multiplierX } = this.strengthX;
                const { spline: splineY, multiplier: multiplierY } = this.strengthY;
                const { spline: splineZ, multiplier: multiplierZ } = this.strengthZ;
                for (let i = 0; i < count; i++) {
                    const life = normalizedAliveTime[i];
                    noiseX[i] *= splineX.evaluate(life) * multiplierX;
                    noiseY[i] *= splineY.evaluate(life) * multiplierY;
                    noiseZ[i] *= splineZ.evaluate(life) * multiplierZ;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMax: xMax, constantMin: xMin } = this.strengthX;
                const { constantMax: yMax, constantMin: yMin } = this.strengthY;
                const { constantMax: zMax, constantMin: zMin } = this.strengthZ;
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i];
                    noiseX[i] *= lerp(xMin, xMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_X));
                    noiseY[i] *= lerp(yMin, yMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Y));
                    noiseZ[i] *= lerp(zMin, zMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Z));
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.strengthX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.strengthY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.strengthZ;
                for (let i = 0; i < count; i++) {
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
                const amplitude = this.strengthX.constant;
                for (let i = 0; i < count; i++) {
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.strengthX;
                for (let i = 0; i < count; i++) {
                    const amplitude = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMax, constantMin } = this.strengthX;
                for (let i = 0; i < count; i++) {
                    const amplitude = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i]));
                    noiseX[i] *= amplitude;
                    noiseY[i] *= amplitude;
                    noiseZ[i] *= amplitude;
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.strengthX;
                for (let i = 0; i < count; i++) {
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
                for (let i = 0; i < count; i++) {
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.positionAmount;
                for (let i = 0; i < count; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.TwoCurves) {
                const { constantMin, constantMax } = this.positionAmount;
                for (let i = 0; i < count; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION));
                    Vec3.set(velocity, noiseX[i] * amount, noiseY[i] * amount, noiseZ[i] * amount);
                    particles.addAnimatedVelocityAt(velocity, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.positionAmount;
                for (let i = 0; i < count; i++) {
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
                for (let i = 0; i < count; i++) {
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.Curve) {
                const { spline } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                for (let i = 0; i < count; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier * deltaTime;
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.rotationAmount;
                for (let i = 0; i < count; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * deltaTime;
                    rotationX[i] += noiseX[i] * amount;
                    rotationY[i] += noiseY[i] * amount;
                    rotationZ[i] += noiseZ[i] * amount;
                }
            } else {
                const { splineMin, splineMax } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                for (let i = 0; i < count; i++) {
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
                for (let i = 0; i < count; i++) {
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.sizeAmount;
                for (let i = 0; i < count; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.sizeAmount;
                for (let i = 0; i < count; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION));
                    sizeX[i] *= (noiseX[i] * amount + 1);
                    sizeY[i] *= (noiseY[i] * amount + 1);
                    sizeZ[i] *= (noiseZ[i] * amount + 1);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.sizeAmount;
                for (let i = 0; i < count; i++) {
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
            'enableRemap', '_octaves', '_octaveScale', '_octaveMultiplier'];
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

function accumulateNoise1D (pos: number, frequency: number, octaveCount: number, octaveScale: number, octaveMultiplier: number) {
    pos *= frequency;
    let sum = perlinNoise1D(pos);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveCount; i++) {
        pos *= octaveScale;
        amplitude *= octaveMultiplier;
        range += amplitude;
        sum += perlinNoise1D(pos) * amplitude;
    }
    return sum / range;
}

function accumulateNoise2D (pos: Vec2, frequency: number, octaveCount: number, octaveScale: number, octaveMultiplier: number) {
    Vec2.multiplyScalar(pos, pos, frequency);
    let sum = perlinNoise2D(pos);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveCount; i++) {
        Vec2.multiplyScalar(pos, pos, octaveScale);
        amplitude *= octaveMultiplier;
        range += amplitude;
        sum += perlinNoise2D(pos) * amplitude;
    }
    return sum / range;
}

function accumulateNoise3D (pos: Vec3, frequency: number, octaveCount: number, octaveScale: number, octaveMultiplier: number) {
    Vec3.multiplyScalar(pos, pos, frequency);
    let sum = perlinNoise3D(pos);
    let amplitude = 1;
    let range = 1;
    for (let i = 1; i < octaveCount; i++) {
        Vec3.multiplyScalar(pos, pos, octaveScale);
        amplitude *= octaveMultiplier;
        range += amplitude;
        sum += perlinNoise3D(pos) * amplitude;
    }
    return sum / range;
}
