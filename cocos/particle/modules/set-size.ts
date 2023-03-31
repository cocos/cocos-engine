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
import { BuiltinParticleParameter, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Color, lerp, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';
import { assert } from '../../core';
import { RandNumGen } from '../rand-num-gen';

@ccclass('cc.SetSizeModule')
@ParticleModule.register('SetSize', ModuleExecStage.SPAWN | ModuleExecStage.UPDATE, [ParameterName.SIZE], [ParameterName.NORMALIZED_ALIVE_TIME])
export class SetSizeModule extends ParticleModule {
    @serializable
    @tooltip('i18n:particle_system.startSize3D')
    public separateAxes = false;

    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: SetSizeModule): boolean { return !this.separateAxes; })
    public get size () {
        return this.x;
    }

    public set size (val) {
        this.x = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public x = new CurveRange(1);

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public get y () {
        if (!this._y) {
            this._y = new CurveRange(1);
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public get z () {
        if (!this._z) {
            this._z = new CurveRange(1);
        }
        return this._z;
    }

    public set z (val) {
        this._z = val;
    }

    @serializable
    private _y: CurveRange | null = null;
    @serializable
    private _z: CurveRange | null = null;
    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.BASE_SIZE);
        context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        if (this.separateAxes && DEBUG) {
            assert(this.x.mode === this.y.mode && this.x.mode === this.z.mode,
                'SetSizeModule: x, y and z must have the same mode.');
        }
        if (this.x.mode === CurveRange.Mode.Curve || this.x.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { baseSize } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const rand = this._rand;
        if (this.separateAxes) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                const constantX = this.x.constant;
                const constantY = this.y.constant;
                const constantZ = this.z.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    baseSize.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const x = lerp(xMin, xMax, rand.getFloat());
                    const y = lerp(yMin, yMax, rand.getFloat());
                    const z = lerp(zMin, zMax, rand.getFloat());
                    baseSize.set3fAt(x, y, z, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    const x = xCurve.evaluate(time) * xMultiplier;
                    const y = yCurve.evaluate(time) * yMultiplier;
                    const z = zCurve.evaluate(time) * zMultiplier;
                    baseSize.set3fAt(x, y, z, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
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
            if (this.x.mode === CurveRange.Mode.Constant) {
                const constantX = this.x.constant;
                baseSize.fill1f(constantX, fromIndex, toIndex);
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = lerp(xMin, xMax, rand.getFloat());
                    baseSize.set1fAt(pSize, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = xCurve.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * xMultiplier;
                    baseSize.set1fAt(pSize, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
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
        if (!this.separateAxes) {
            return ['separateAxes', 'x'];
        } else {
            return ['separateAxes', 'x', '_y', '_z'];
        }
    }
}
