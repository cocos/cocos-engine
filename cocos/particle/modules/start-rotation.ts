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
import { ParticleExecContext, ParticleEmitterParams } from '../particle-base';
import { CurveRange } from '../curve-range';
import { lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';

@ccclass('cc.StartRotationModule')
@ParticleModule.register('StartRotation', ModuleExecStage.SPAWN, 1)
export class StartRotationModule extends ParticleModule {
    @serializable
    @tooltip('i18n:particle_system.startRotation3D')
    public startRotation3D = false;

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationX')
    @visible(function (this: StartRotationModule): boolean { return this.startRotation3D; })
    public get startRotationX () {
        if (!this._startRotationX) {
            this._startRotationX = new CurveRange();
        }
        return this._startRotationX;
    }

    public set startRotationX (val) {
        this._startRotationX = val;
    }

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationY')
    @visible(function (this: StartRotationModule): boolean { return this.startRotation3D; })
    public get startRotationY () {
        if (!this._startRotationY) {
            this._startRotationY = new CurveRange();
        }
        return this._startRotationY;
    }

    public set startRotationY (val) {
        this._startRotationY = val;
    }

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @formerlySerializedAs('startRotation')
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: StartRotationModule): boolean { return this.startRotation3D; })
    public startRotationZ = new CurveRange();

    @type(CurveRange)
    @range([-1, 1])
    @radian
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: StartRotationModule): boolean { return !this.startRotation3D; })
    public get startRotation () {
        return this.startRotationZ;
    }

    public set startRotation (val) {
        this.startRotationZ = val;
    }

    @serializable
    private _startRotationX: CurveRange | null = null;
    @serializable
    private _startRotationY: CurveRange | null = null;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.ROTATION);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { rotation } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT } = context;
        if (this.startRotation3D) {
            if (this.startRotationX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startRotationX.constant;
                const constantY = this.startRotationY.constant;
                const constantZ = this.startRotationZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.startRotationX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startRotationX;
                const { constantMin: yMin, constantMax: yMax } = this.startRotationY;
                const { constantMin: zMin, constantMax: zMax } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotation.set3fAt(lerp(xMin, xMax, rand),
                        lerp(yMin, yMax, rand),
                        lerp(zMin, zMax, rand), i);
                }
            } else if (this.startRotationX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startRotationX;
                const { spline: yCurve, multiplier: yMultiplier } = this.startRotationY;
                const { spline: zCurve, multiplier: zMultiplier } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.set3fAt(xCurve.evaluate(normalizedT) * xMultiplier,
                        yCurve.evaluate(normalizedT) * yMultiplier,
                        zCurve.evaluate(normalizedT) * zMultiplier, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startRotationX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.startRotationY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotation.set3fAt(lerp(xMin.evaluate(normalizedT), xMax.evaluate(normalizedT), rand) * xMultiplier,
                        lerp(yMin.evaluate(normalizedT), yMax.evaluate(normalizedT), rand) * yMultiplier,
                        lerp(zMin.evaluate(normalizedT), zMax.evaluate(normalizedT), rand) * zMultiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.startRotationZ.mode === CurveRange.Mode.Constant) {
                const constantZ = this.startRotationZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.setZAt(constantZ, i);
                }
            } else if (this.startRotationZ.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: zMin, constantMax: zMax } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotation.setZAt(lerp(zMin, zMax, rand), i);
                }
            } else if (this.startRotationZ.mode === CurveRange.Mode.Curve) {
                const { spline: zCurve, multiplier: zMultiplier } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    rotation.setZAt(zCurve.evaluate(normalizedT) * zMultiplier, i);
                }
            } else {
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.startRotationZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotation.setZAt(lerp(zMin.evaluate(normalizedT), zMax.evaluate(normalizedT), rand) * zMultiplier, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.startRotation3D) {
            return ['startRotation3D', 'startRotationZ'];
        } else {
            return ['startRotation3D', '_startRotationX', '_startRotationY', 'startRotationZ'];
        }
    }
}
