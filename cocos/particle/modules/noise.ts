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
import { approx, clamp, lerp, randomRangeInt, Vec2, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { perlin1D, perlin2D, perlin3D, PerlinNoise1DCache, PerlinNoise2DCache, PerlinNoise3DCache } from './perlin-noise';
import { RandNumGen } from '../rand-num-gen';

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
const seed = new Vec3();
const RANDOM_SEED_OFFSET = 112331;
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

export enum Quality {
    LOW,
    MIDDLE,
    HIGH
}

@ccclass('cc.NoiseModule')
@ParticleModule.register('Noise', ModuleExecStage.UPDATE, [], ['Solve', 'State'])
export class NoiseModule extends ParticleModule {
    @serializable
    @visible(true)
    public separateAxes = false;

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    public get strengthX () {
        return this._strengthX;
    }

    public set strengthX (value) {
        this._strengthX = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    public get strengthY () {
        if (!this._strengthY) {
            this._strengthY = new CurveRange(1);
        }
        return this._strengthY;
    }
    public set strengthY (value) {
        this._strengthY = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return this.separateAxes; })
    public get strengthZ () {
        if (!this._strengthZ) {
            this._strengthZ = new CurveRange(1);
        }
        return this._strengthZ;
    }
    public set strengthZ (value) {
        this._strengthZ = value;
    }

    @type(CurveRange)
    @visible(function (this: NoiseModule) { return !this.separateAxes; })
    public get strength () {
        return this.strengthX;
    }

    public set strength (val) {
        this.strengthX = val;
    }

    @type(CCFloat)
    @rangeMin(0.0001)
    public get frequency () {
        return this._frequency;
    }
    public set frequency (value) {
        this._frequency = value;
    }

    @type(CurveRange)
    public get scrollSpeed () {
        return this._scrollSpeed;
    }

    public set scrollSpeed (val) {
        this._scrollSpeed = val;
    }

    @serializable
    @visible(true)
    public damping = true;

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
    public get remapX () {
        if (!this._remapX) {
            this._remapX = new CurveRange(1);
        }
        return this._remapX;
    }
    public set remapX (value) {
        this._remapX = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    public get remapY () {
        if (!this._remapY) {
            this._remapY = new CurveRange(1);
        }
        return this._remapY;
    }
    public set remapY (value) {
        this._remapY = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && this.separateAxes; })
    public get remapZ () {
        if (!this._remapZ) {
            this._remapZ = new CurveRange(1);
        }
        return this._remapZ;
    }
    public set remapZ (value) {
        this._remapZ = value;
    }

    @type(CurveRange)
    @range([-1, 1])
    @visible(function (this: NoiseModule) { return this.enableRemap && !this.separateAxes; })
    public get remapCurve () {
        return this.remapX;
    }
    public set remapCurve (value) {
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

    private _scrollOffset = 0;
    private _offset = new Vec3();
    private _amplitudeScale = 1;

    private _randomSeed = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomSeed = state.rand.getUInt32();
        RandNumGen.get3Float(this._randomSeed, this._offset);
        this._offset.multiplyScalar(100);
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._scrollOffset += this._scrollSpeed.evaluate(context.emitterNormalizedTime, 1) * context.emitterDeltaTime;
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
        this._amplitudeScale = this.damping ? (1 / this.frequency) : 1;
        context.markRequiredParameter(BuiltinParticleParameter.VEC3_REGISTER);
        if (!approx(this.positionAmount.getScalar(), 0)) {
            context.markRequiredParameter(BuiltinParticleParameter.POSITION);
            context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        }
        if (!approx(this.rotationAmount.getScalar(), 0)) {
            context.markRequiredParameter(BuiltinParticleParameter.ROTATION);
        }
        if (!approx(this.sizeAmount.getScalar(), 0)) {
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
        const amplitudeScale = this._amplitudeScale;
        const frequency = this.frequency;
        const offset = this._offset;
        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        const samplePosition = hasPosition ? particles.position : vec3Register;
        if (!hasPosition) {
            samplePosition.fill1f(0, fromIndex, toIndex);
        }

        // eslint-disable-next-line no-lonely-if
        if (this.quality === Quality.HIGH) {
            for (let i = fromIndex; i < toIndex; i++) {
                samplePosition.getVec3At(pos, i);
                pos.add(offset);
                perlin3D(sampleX, Vec3.set(point3D, pos.z, pos.y, pos.x + scrollOffset), frequency, noiseXCache3D);
                perlin3D(sampleY, Vec3.set(point3D, pos.x + 100, pos.z, pos.y + scrollOffset), frequency, noiseYCache3D);
                perlin3D(sampleZ, Vec3.set(point3D, pos.y, pos.x + 100, pos.z + scrollOffset), frequency, noiseZCache3D);
                vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
            }
        } else if (this.quality === Quality.MIDDLE) {
            for (let i = fromIndex; i < toIndex; i++) {
                samplePosition.getVec3At(pos, i);
                pos.add(offset);
                perlin2D(sampleX, Vec2.set(point2D, pos.z, pos.y + scrollOffset), frequency, noiseXCache2D);
                perlin2D(sampleY, Vec2.set(point2D, pos.x + 100, pos.z + scrollOffset), frequency, noiseYCache2D);
                perlin2D(sampleZ, Vec2.set(point2D, pos.y, pos.x + 100 + scrollOffset), frequency, noiseZCache2D);
                vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                samplePosition.getVec3At(pos, i);
                pos.add(offset);
                perlin1D(sampleX, pos.z + scrollOffset, frequency, noiseXCache1D);
                perlin1D(sampleY, pos.x + 100 + scrollOffset, frequency, noiseYCache1D);
                perlin1D(sampleZ, pos.y + scrollOffset, frequency, noiseZCache1D);
                vec3Register.set3fAt(sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y, i);
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
                    const ratio = RandNumGen.get3Float(randomSeed[i] + RANDOM_SEED_OFFSET, seed);
                    vec3Register.multiply3fAt(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z), i);
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
                    const ratio = RandNumGen.get3Float(randomSeed[i] + RANDOM_SEED_OFFSET, seed);
                    vec3Register.multiply3fAt(
                        lerp(xMin.evaluate(life), xMax.evaluate(life), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(life), yMax.evaluate(life), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(life), zMax.evaluate(life), ratio.z) * zMultiplier, i,
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
                    const amplitude = lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET));
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
                        splineMax.evaluate(life), RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET)) * multiplier;
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
                    const amount = lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION));
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
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_POSITION)) * multiplier;
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
                    const amount = lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * deltaTime;
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
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
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
                    const amount = lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION));
                    vec3Register.getVec3At(sizeScalar, i);
                    size.multiply3fAt(sizeScalar.x * amount + 1, sizeScalar.y * amount + 1, sizeScalar.z * amount + 1, i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.sizeAmount;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const life = normalizedAliveTime[i];
                    const amount = lerp(splineMin.evaluate(life), splineMax.evaluate(life), RandNumGen.getFloat(randomSeed[i] + RANDOM_SEED_OFFSET_ROTATION)) * multiplier;
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
            'enableRemap', 'quality', 'damping'];
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
