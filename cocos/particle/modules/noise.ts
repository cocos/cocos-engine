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
import { range, rangeMin, rangeStep, slide, visible } from '../../core/data/decorators/editable';
import { clamp, lerp, pseudoRandom, randomRangeInt, Vec2, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { perlin1D, perlin2D, perlin3D, PerlinNoise1DCache, PerlinNoise2DCache, PerlinNoise3DCache } from './perlin-noise';

const pos = new Vec3();
const point3D = new Vec3();
const point2D = new Vec2();
const sampleX = new Vec2();
const sampleY = new Vec2();
const sampleZ = new Vec2();
const deltaVelocity = new Vec3();
const rotationRate = new Vec3();
const sizeScalar = new Vec3();
const tempRemap = new Vec3();
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
    @rangeMin(0.0001)
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
    private _offsetX = 0;
    private _offsetY = 0;
    private _offsetZ = 0;
    private _amplitudeScale = 1;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._scrollOffset += this._scrollSpeed.evaluate(context.normalizedTimeInCycle, 1) * context.deltaTime;
        if (this._scrollOffset > 256) {
            this._scrollOffset -= 256;
        }
        if (DEBUG) {
            if (this.enableRemap) {
                assert(this.remapX.mode === CurveRange.Mode.Curve, 'The remapX must be curve mode');
                if (this.separateAxes) {
                    assert(this.remapX.mode === this.remapY.mode && this.remapZ.mode === this.remapY.mode,
                        'The remapX, remapY, remapZ must be same mode');
                }
            }

            if (this.separateAxes) {
                assert(this.strengthX.mode === this.strengthY.mode && this.strengthZ.mode === this.remapY.mode,
                    'The strengthX, strengthY, strengthZ must be curve mode');
            }
        }
        this.frequency = Math.max(this.frequency, 0.0001);
        this._offsetX = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_X) * 100;
        this._offsetY = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Y) * 100;
        this._offsetZ = pseudoRandom(this._randomSeed + RANDOM_SEED_OFFSET_Z) * 100;
        this._amplitudeScale = this.damping ? (1 / this.frequency) : 1;
        context.markRequiredParameter(BuiltinParticleParameter.VEC3_REGISTER);
        if (this.positionAmount.getScalar() !== 0) {
            context.markRequiredParameter(BuiltinParticleParameter.POSITION);
            context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        }
        if (this.rotationAmount.getScalar() !== 0) {
            context.markRequiredParameter(BuiltinParticleParameter.ROTATION);
        }
        if (this.sizeAmount.getScalar() !== 0) {
            context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        }

        if (this._strengthX.mode === CurveRange.Mode.Curve || this._strengthX.mode === CurveRange.Mode.TwoCurves
            || this.positionAmount.mode === CurveRange.Mode.Curve || this.positionAmount.mode === CurveRange.Mode.TwoCurves
            || this.rotationAmount.mode === CurveRange.Mode.Curve || this.rotationAmount.mode === CurveRange.Mode.TwoCurves
            || this.sizeAmount.mode === CurveRange.Mode.Curve || this.sizeAmount.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
        if (this._strengthX.mode === CurveRange.Mode.TwoConstants || this._strengthX.mode === CurveRange.Mode.TwoCurves
            || this.positionAmount.mode === CurveRange.Mode.TwoConstants || this.positionAmount.mode === CurveRange.Mode.TwoCurves
            || this.rotationAmount.mode === CurveRange.Mode.TwoConstants || this.rotationAmount.mode === CurveRange.Mode.TwoCurves
            || this.sizeAmount.mode === CurveRange.Mode.TwoConstants || this.sizeAmount.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { vec3Register } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const scrollOffset = this._scrollOffset;
        const offsetX = this._offsetX;
        const offsetY = this._offsetY;
        const offsetZ = this._offsetZ;
        const amplitudeScale = this._amplitudeScale;
        const frequency = this.frequency;
        const { octaves,  octaveScale, octaveMultiplier } = this;

        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        const samplePosition = hasPosition ? particles.position : vec3Register;
        if (!hasPosition) {
            samplePosition.fill1f(0, fromIndex, toIndex);
        }

        if (octaves > 1) {
            if (this.quality === Quality.MIDDLE) {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec2.set(point2D, pos.z, pos.y + scrollOffset);
                    accumulateNoise2D(sampleX, point2D, frequency, noiseXCache2D, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(point2D, pos.x + 100, pos.z + scrollOffset);
                    accumulateNoise2D(sampleY, point2D, frequency, noiseYCache2D, octaves, octaveScale, octaveMultiplier);
                    Vec2.set(point2D, pos.y, pos.x + 100 + scrollOffset);
                    accumulateNoise2D(sampleZ, point2D, frequency, noiseZCache2D, octaves, octaveScale, octaveMultiplier);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            } else if (this.quality === Quality.HIGH) {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    Vec3.set(point3D, pos.z, pos.y, pos.x + scrollOffset);
                    accumulateNoise3D(sampleX, point3D, frequency, noiseXCache3D, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(point3D, pos.x + 100, pos.z, pos.y + scrollOffset);
                    accumulateNoise3D(sampleY, point3D, frequency, noiseYCache3D, octaves, octaveScale, octaveMultiplier);
                    Vec3.set(point3D, pos.y, pos.x + 100, pos.z + scrollOffset);
                    accumulateNoise3D(sampleZ, point3D, frequency, noiseZCache3D, octaves, octaveScale, octaveMultiplier);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    accumulateNoise1D(sampleX, pos.z + scrollOffset, frequency, noiseXCache1D, octaves, octaveScale, octaveMultiplier);
                    accumulateNoise1D(sampleY, pos.x + 100 + scrollOffset, frequency, noiseYCache1D, octaves, octaveScale, octaveMultiplier);
                    accumulateNoise1D(sampleZ, pos.y + scrollOffset, frequency, noiseZCache1D, octaves, octaveScale, octaveMultiplier);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.quality === Quality.HIGH) {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin3D(sampleX, Vec3.set(point3D, pos.z, pos.y, pos.x + scrollOffset), frequency, noiseXCache3D);
                    perlin3D(sampleY, Vec3.set(point3D, pos.x + 100, pos.z, pos.y + scrollOffset), frequency, noiseYCache3D);
                    perlin3D(sampleZ, Vec3.set(point3D, pos.y, pos.x + 100, pos.z + scrollOffset), frequency, noiseZCache3D);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            } else if (this.quality === Quality.MIDDLE) {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin2D(sampleX, Vec2.set(point2D, pos.z, pos.y + scrollOffset), frequency, noiseXCache2D);
                    perlin2D(sampleY, Vec2.set(point2D, pos.x + 100, pos.z + scrollOffset), frequency, noiseYCache2D);
                    perlin2D(sampleZ, Vec2.set(point2D, pos.y, pos.x + 100 + scrollOffset), frequency, noiseZCache2D);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    samplePosition.getVec3At(pos, i);
                    pos.add3f(offsetX, offsetY, offsetZ);
                    perlin1D(sampleX, pos.z + scrollOffset, frequency, noiseXCache1D);
                    perlin1D(sampleY, pos.x + 100 + scrollOffset, frequency, noiseYCache1D);
                    perlin1D(sampleZ, pos.y + scrollOffset, frequency, noiseZCache1D);
                    vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
                }
            }
        }
        // remap
        if (this.enableRemap) {
            if (this.separateAxes) {
                if (this.remapX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: multiplierX } = this.remapX;
                    const { spline: splineY, multiplier: multiplierY } = this.remapY;
                    const { spline: splineZ, multiplier: multiplierZ } = this.remapZ;
                    for (let i = fromIndex; i < toIndex; i++) {
                        vec3Register.getVec3At(tempRemap, i);
                        vec3Register.set3fAt(splineX.evaluate(clamp(tempRemap.x * 0.5 + 0.5, 0, 1)) * multiplierX,
                            splineY.evaluate(clamp(tempRemap.y * 0.5 + 0.5, 0, 1)) * multiplierY,
                            splineZ.evaluate(clamp(tempRemap.z * 0.5 + 0.5, 0, 1)) * multiplierZ,
                            i);
                    }
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this.remapX.mode === CurveRange.Mode.Curve) {
                    const { spline: splineX, multiplier: multiplierX } = this.remapX;
                    for (let i = fromIndex; i < toIndex; i++) {
                        vec3Register.getVec3At(tempRemap, i);
                        vec3Register.set3fAt(splineX.evaluate(clamp(tempRemap.x * 0.5 + 0.5, 0, 1)) * multiplierX,
                            splineX.evaluate(clamp(tempRemap.y * 0.5 + 0.5, 0, 1)) * multiplierX,
                            splineX.evaluate(clamp(tempRemap.z * 0.5 + 0.5, 0, 1)) * multiplierX, i);
                    }
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
                    vec3Register.multiply3fAt(amplitudeX, amplitudeY, amplitudeZ, i);
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline: splineX } = this.strengthX;
                const { spline: splineY } = this.strengthY;
                const { spline: splineZ } = this.strengthZ;
                const multiplierX = this.strengthX.multiplier * amplitudeScale;
                const multiplierY = this.strengthY.multiplier * amplitudeScale;
                const multiplierZ = this.strengthZ.multiplier * amplitudeScale;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    vec3Register.multiply3fAt(splineX.evaluate(life) * multiplierX,
                        splineY.evaluate(life) * multiplierY,
                        splineZ.evaluate(life) * multiplierZ, i);
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const xMax = this.strengthX.constantMax * amplitudeScale;
                const xMin = this.strengthX.constantMin * amplitudeScale;
                const yMax = this.strengthY.constantMax * amplitudeScale;
                const yMin = this.strengthY.constantMin * amplitudeScale;
                const zMax = this.strengthZ.constantMax * amplitudeScale;
                const zMin = this.strengthZ.constantMin * amplitudeScale;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const seed = randomSeed[i];
                    vec3Register.multiply3fAt(lerp(xMin, xMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_X)),
                        lerp(yMin, yMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Y)),
                        lerp(zMin, zMax, pseudoRandom(seed + RANDOM_SEED_OFFSET_Z)), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax } = this.strengthX;
                const { splineMin: yMin, splineMax: yMax } = this.strengthY;
                const { splineMin: zMin, splineMax: zMax } = this.strengthZ;
                const xMultiplier = this.strengthX.multiplier * amplitudeScale;
                const yMultiplier = this.strengthY.multiplier * amplitudeScale;
                const zMultiplier = this.strengthZ.multiplier * amplitudeScale;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const seed = randomSeed[i];
                    vec3Register.multiply3fAt(
                        lerp(xMin.evaluate(life), xMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_X)) * xMultiplier,
                        lerp(yMin.evaluate(life), yMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Y)) * yMultiplier,
                        lerp(zMin.evaluate(life), zMax.evaluate(life), pseudoRandom(seed + RANDOM_SEED_OFFSET_Z)) * zMultiplier, i,
                    );
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.strengthX.mode === CurveRange.Mode.Constant) {
                const amplitude = this.strengthX.constant * amplitudeScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    vec3Register.multiply1fAt(amplitude, i);
                }
            } else if (this.strengthX.mode === CurveRange.Mode.Curve) {
                const { spline } = this.strengthX;
                const multiplier = this.strengthX.multiplier * amplitudeScale;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amplitude = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    vec3Register.multiply1fAt(amplitude, i);
                }
            } else if (this.strengthX.mode === CurveRange.Mode.TwoConstants) {
                const constantMax = this.strengthX.constantMax * amplitudeScale;
                const constantMin = this.strengthX.constantMin * amplitudeScale;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amplitude = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i]));
                    vec3Register.multiply1fAt(amplitude, i);
                }
            } else {
                const { splineMin, splineMax } = this.strengthX;
                const multiplier = this.strengthX.multiplier * amplitudeScale;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amplitude = lerp(splineMin.evaluate(life),
                        splineMax.evaluate(life), pseudoRandom(randomSeed[i])) * multiplier;
                    vec3Register.multiply1fAt(amplitude, i);
                }
            }
        }

        if (this.positionAmount.getScalar() !== 0) {
            const { velocity } = particles;
            if (this.positionAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.positionAmount.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    vec3Register.getVec3At(deltaVelocity, i);
                    Vec3.multiplyScalar(deltaVelocity, deltaVelocity, amount);
                    velocity.addVec3At(deltaVelocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.Curve) {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { spline, multiplier } = this.positionAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    vec3Register.getVec3At(deltaVelocity, i);
                    Vec3.multiplyScalar(deltaVelocity, deltaVelocity, amount);
                    velocity.addVec3At(deltaVelocity, i);
                }
            } else if (this.positionAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.positionAmount;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION));
                    vec3Register.getVec3At(deltaVelocity, i);
                    Vec3.multiplyScalar(deltaVelocity, deltaVelocity, amount);
                    velocity.addVec3At(deltaVelocity, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.positionAmount;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION)) * multiplier;
                    vec3Register.getVec3At(deltaVelocity, i);
                    Vec3.multiplyScalar(deltaVelocity, deltaVelocity, amount);
                    velocity.addVec3At(deltaVelocity, i);
                }
            }
        }

        if (this.rotationAmount.getScalar() !== 0) {
            const { rotation } = particles;
            if (this.rotationAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.rotationAmount.constant * deltaTime;
                for (let i = fromIndex; i < toIndex; i++) {
                    vec3Register.getVec3At(rotationRate, i);
                    Vec3.multiplyScalar(rotationRate, rotationRate, amount);
                    rotation.addVec3At(rotationRate, i);
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.Curve) {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { spline } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier * deltaTime;
                    vec3Register.getVec3At(rotationRate, i);
                    Vec3.multiplyScalar(rotationRate, rotationRate, amount);
                    rotation.addVec3At(rotationRate, i);
                }
            } else if (this.rotationAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.rotationAmount;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * deltaTime;
                    vec3Register.getVec3At(rotationRate, i);
                    Vec3.multiplyScalar(rotationRate, rotationRate, amount);
                    rotation.addVec3At(rotationRate, i);
                }
            } else {
                const { splineMin, splineMax } = this.rotationAmount;
                const multiplier = this.rotationAmount.multiplier * deltaTime;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
                    vec3Register.getVec3At(rotationRate, i);
                    Vec3.multiplyScalar(rotationRate, rotationRate, amount);
                    rotation.addVec3At(rotationRate, i);
                }
            }
        }

        if (this.sizeAmount.getScalar() !== 0) {
            const { size } = particles;
            if (this.sizeAmount.mode === CurveRange.Mode.Constant) {
                const amount = this.sizeAmount.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    vec3Register.getVec3At(sizeScalar, i);
                    size.multiply3fAt(sizeScalar.x * amount + 1, sizeScalar.y * amount + 1, sizeScalar.z * amount + 1, i);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.Curve) {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const { spline, multiplier } = this.sizeAmount;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    vec3Register.getVec3At(sizeScalar, i);
                    size.multiply3fAt(sizeScalar.x * amount + 1, sizeScalar.y * amount + 1, sizeScalar.z * amount + 1, i);
                }
            } else if (this.sizeAmount.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.sizeAmount;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const amount = lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION));
                    vec3Register.getVec3At(sizeScalar, i);
                    size.multiply3fAt(sizeScalar.x * amount + 1, sizeScalar.y * amount + 1, sizeScalar.z * amount + 1, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.sizeAmount;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), pseudoRandom(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
                    vec3Register.getVec3At(sizeScalar, i);
                    size.multiply3fAt(sizeScalar.x * amount + 1, sizeScalar.y * amount + 1, sizeScalar.z * amount + 1, i);
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
