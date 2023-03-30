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

import { ccclass, displayOrder, formerlySerializedAs, radian, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { CurveRange } from '../curve-range';
import { lerp } from '../../core/math';
import { RandNumGen } from '../rand-num-gen';

@ccclass('cc.SetRotationModule')
@ParticleModule.register('SetRotationModule', ModuleExecStage.SPAWN)
export class SetRotationModule extends ParticleModule {
    @serializable
    @tooltip('i18n:particle_system.startRotation3D')
    public separateAxes = false;

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationX')
    @visible(function (this: SetRotationModule): boolean { return this.separateAxes; })
    public get rotationX () {
        if (!this._rotationX) {
            this._rotationX = new CurveRange();
        }
        return this._rotationX;
    }

    public set rotationX (val) {
        this._rotationX = val;
    }

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationY')
    @visible(function (this: SetRotationModule): boolean { return this.separateAxes; })
    public get rotationY () {
        if (!this._rotationY) {
            this._rotationY = new CurveRange();
        }
        return this._rotationY;
    }

    public set rotationY (val) {
        this._rotationY = val;
    }

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: SetRotationModule): boolean { return this.separateAxes; })
    public rotationZ = new CurveRange();

    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: SetRotationModule): boolean { return !this.separateAxes; })
    public get rotation () {
        return this.rotationZ;
    }

    public set rotation (val) {
        this.rotationZ = val;
    }

    @serializable
    private _rotationX: CurveRange | null = null;
    @serializable
    private _rotationY: CurveRange | null = null;

    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.ROTATION);
        if (this.rotationX.mode === CurveRange.Mode.Curve || this.rotationX.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { rotation } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const rand = this._rand;
        if (this.separateAxes) {
            if (this.rotationX.mode === CurveRange.Mode.Constant) {
                const constantX = this.rotationX.constant;
                const constantY = this.rotationY.constant;
                const constantZ = this.rotationZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.rotationX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.rotationX;
                const { constantMin: yMin, constantMax: yMax } = this.rotationY;
                const { constantMin: zMin, constantMax: zMax } = this.rotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.set3fAt(lerp(xMin, xMax, rand.getFloat()),
                        lerp(yMin, yMax, rand.getFloat()),
                        lerp(zMin, zMax, rand.getFloat()), i);
                }
            } else if (this.rotationX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.rotationX;
                const { spline: yCurve, multiplier: yMultiplier } = this.rotationY;
                const { spline: zCurve, multiplier: zMultiplier } = this.rotationZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    rotation.set3fAt(xCurve.evaluate(time) * xMultiplier,
                        yCurve.evaluate(time) * yMultiplier,
                        zCurve.evaluate(time) * zMultiplier, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.rotationX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.rotationY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.rotationZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    rotation.set3fAt(lerp(xMin.evaluate(time), xMax.evaluate(time), rand.getFloat()) * xMultiplier,
                        lerp(yMin.evaluate(time), yMax.evaluate(time), rand.getFloat()) * yMultiplier,
                        lerp(zMin.evaluate(time), zMax.evaluate(time), rand.getFloat()) * zMultiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.rotationZ.mode === CurveRange.Mode.Constant) {
                const constantZ = this.rotationZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.setZAt(constantZ, i);
                }
            } else if (this.rotationZ.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: zMin, constantMax: zMax } = this.rotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.setZAt(lerp(zMin, zMax, rand.getFloat()), i);
                }
            } else if (this.rotationZ.mode === CurveRange.Mode.Curve) {
                const { spline: zCurve, multiplier: zMultiplier } = this.rotationZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.setZAt(zCurve.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * zMultiplier, i);
                }
            } else {
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.rotationZ;
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    rotation.setZAt(lerp(zMin.evaluate(time), zMax.evaluate(time), rand.getFloat()) * zMultiplier, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.separateAxes) {
            return ['separateAxes', 'rotationZ'];
        } else {
            return ['separateAxes', '_rotationX', '_rotationY', 'rotationZ'];
        }
    }
}
