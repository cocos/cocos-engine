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

    /**
      * @zh 粒子初始大小。
      */
    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public sizeX = new CurveRange(1);

    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: SetSizeModule): boolean { return !this.separateAxes; })
    public get size () {
        return this.sizeX;
    }

    public set size (val) {
        this.sizeX = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public get sizeY () {
        if (!this._sizeY) {
            this._sizeY = new CurveRange(1);
        }
        return this._sizeY;
    }

    public set sizeY (val) {
        this._sizeY = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: SetSizeModule): boolean { return this.separateAxes; })
    public get sizeZ () {
        if (!this._sizeZ) {
            this._sizeZ = new CurveRange(1);
        }
        return this._sizeZ;
    }

    public set sizeZ (val) {
        this._sizeZ = val;
    }

    @serializable
    private _sizeY: CurveRange | null = null;
    @serializable
    private _sizeZ: CurveRange | null = null;
    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.BASE_SIZE);
        context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        if (this.separateAxes && DEBUG) {
            assert(this.sizeX.mode === this.sizeY.mode && this.sizeX.mode === this.sizeZ.mode,
                'SetSizeModule: sizeX, sizeY and sizeZ must have the same mode.');
        }
        if (this.sizeX.mode === CurveRange.Mode.Curve || this.sizeX.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { baseSize } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const rand = this._rand;
        if (this.separateAxes) {
            if (this.sizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.sizeX.constant;
                const constantY = this.sizeY.constant;
                const constantZ = this.sizeZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    baseSize.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.sizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.sizeX;
                const { constantMin: yMin, constantMax: yMax } = this.sizeY;
                const { constantMin: zMin, constantMax: zMax } = this.sizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const x = lerp(xMin, xMax, rand.getFloat());
                    const y = lerp(yMin, yMax, rand.getFloat());
                    const z = lerp(zMin, zMax, rand.getFloat());
                    baseSize.set3fAt(x, y, z, i);
                }
            } else if (this.sizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.sizeX;
                const { spline: yCurve, multiplier: yMultiplier } = this.sizeY;
                const { spline: zCurve, multiplier: zMultiplier } = this.sizeZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    const x = xCurve.evaluate(time) * xMultiplier;
                    const y = yCurve.evaluate(time) * yMultiplier;
                    const z = zCurve.evaluate(time) * zMultiplier;
                    baseSize.set3fAt(x, y, z, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.sizeX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.sizeY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.sizeZ;
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
            if (this.sizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.sizeX.constant;
                baseSize.fill1f(constantX, fromIndex, toIndex);
            } else if (this.sizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.sizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = lerp(xMin, xMax, rand.getFloat());
                    baseSize.set1fAt(pSize, i);
                }
            } else if (this.sizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.sizeX;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = xCurve.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * xMultiplier;
                    baseSize.set1fAt(pSize, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.sizeX;
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
            return ['separateAxes', 'sizeX'];
        } else {
            return ['separateAxes', 'sizeX', '_sizeY', '_sizeZ'];
        }
    }
}
