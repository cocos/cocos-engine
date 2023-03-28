/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { DEBUG } from 'internal:constants';
import { ccclass, displayOrder, formerlySerializedAs, radian, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Color, lerp, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';
import { assert } from '../../core';
import { RandNumGen } from '../rand-num-gen';

@ccclass('cc.StartSizeModule')
@ParticleModule.register('StartSize', ModuleExecStage.SPAWN)
export class StartSizeModule extends ParticleModule {
    @serializable
    @tooltip('i18n:particle_system.startSize3D')
    public startSize3D = false;

    /**
      * @zh 粒子初始大小。
      */
    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public startSizeX = new CurveRange(1);

    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: StartSizeModule): boolean { return !this.startSize3D; })
    public get size () {
        return this.startSizeX;
    }

    public set size (val) {
        this.startSizeX = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public get startSizeY () {
        if (!this._startSizeY) {
            this._startSizeY = new CurveRange(1);
        }
        return this._startSizeY;
    }

    public set startSizeY (val) {
        this._startSizeY = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public get startSizeZ () {
        if (!this._startSizeZ) {
            this._startSizeZ = new CurveRange(1);
        }
        return this._startSizeZ;
    }

    public set startSizeZ (val) {
        this._startSizeZ = val;
    }

    @serializable
    private _startSizeY: CurveRange | null = null;
    @serializable
    private _startSizeZ: CurveRange | null = null;
    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.BASE_SIZE);
        context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        if (this.startSize3D && DEBUG) {
            assert(this.startSizeX.mode === this.startSizeY.mode && this.startSizeX.mode === this.startSizeZ.mode,
                'StartSizeModule: startSizeX, startSizeY and startSizeZ must have the same mode.');
        }
        if (this.startSizeX.mode === CurveRange.Mode.Curve || this.startSizeX.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { baseSize } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const rand = this._rand;
        if (this.startSize3D) {
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                const constantY = this.startSizeY.constant;
                const constantZ = this.startSizeZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    baseSize.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                const { constantMin: yMin, constantMax: yMax } = this.startSizeY;
                const { constantMin: zMin, constantMax: zMax } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const x = lerp(xMin, xMax, rand.getFloat());
                    const y = lerp(yMin, yMax, rand.getFloat());
                    const z = lerp(zMin, zMax, rand.getFloat());
                    baseSize.set3fAt(x, y, z, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                const { spline: yCurve, multiplier: yMultiplier } = this.startSizeY;
                const { spline: zCurve, multiplier: zMultiplier } = this.startSizeZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    const x = xCurve.evaluate(time) * xMultiplier;
                    const y = yCurve.evaluate(time) * yMultiplier;
                    const z = zCurve.evaluate(time) * zMultiplier;
                    baseSize.set3fAt(x, y, z, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.startSizeY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.startSizeZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    const x = lerp(xMin.evaluate(time), xMax.evaluate(time), rand.getFloat()) * xMultiplier;
                    const y = lerp(yMin.evaluate(time), yMax.evaluate(time), rand.getFloat()) * yMultiplier;
                    const z = lerp(zMin.evaluate(time), zMax.evaluate(time), rand.getFloat()) * zMultiplier;
                    baseSize.set3fAt(x, y, z, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                baseSize.fill1f(constantX, fromIndex, toIndex);
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = lerp(xMin, xMax, rand.getFloat());
                    baseSize.set1fAt(pSize, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = xCurve.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * xMultiplier;
                    baseSize.set1fAt(pSize, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    const pSize = lerp(xMin.evaluate(time), xMax.evaluate(time), rand.getFloat()) * xMultiplier;
                    baseSize.set1fAt(pSize, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.startSize3D) {
            return ['startSize3D', 'startSizeX'];
        } else {
            return ['startSize3D', 'startSizeX', '_startSizeZ', '_startSizeZ'];
        }
    }
}
