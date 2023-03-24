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
import { GradientRange } from '../gradient-range';
import { Color, lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';

@ccclass('cc.StartSizeModule')
@ParticleModule.register('StartSize', ModuleExecStage.SPAWN, 1)
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
    public get baseSize () {
        return this.startSizeX;
    }

    public set baseSize (val) {
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

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.BASE_SIZE);
        context.markRequiredParameter(BuiltinParticleParameter.SIZE);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { baseSize, size } = particles;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT } = context;
        if (this.startSize3D) {
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                const constantY = this.startSizeY.constant;
                const constantZ = this.startSizeZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    size.set3fAt(constantX, constantY, constantZ, i);
                    baseSize.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                const { constantMin: yMin, constantMax: yMax } = this.startSizeY;
                const { constantMin: zMin, constantMax: zMax } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const x = lerp(xMin, xMax, rand);
                    const y = lerp(yMin, yMax, rand);
                    const z = lerp(zMin, zMax, rand);
                    size.set3fAt(x, y, z, i);
                    baseSize.set3fAt(x, y, z, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                const { spline: yCurve, multiplier: yMultiplier } = this.startSizeY;
                const { spline: zCurve, multiplier: zMultiplier } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const x = xCurve.evaluate(normalizedT) * xMultiplier;
                    const y = yCurve.evaluate(normalizedT) * yMultiplier;
                    const z = zCurve.evaluate(normalizedT) * zMultiplier;
                    size.set3fAt(x, y, z, i);
                    baseSize.set3fAt(x, y, z, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.startSizeY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const x = lerp(xMin.evaluate(normalizedT), xMax.evaluate(normalizedT), rand) * xMultiplier;
                    const y = lerp(yMin.evaluate(normalizedT), yMax.evaluate(normalizedT), rand) * yMultiplier;
                    const z = lerp(zMin.evaluate(normalizedT), zMax.evaluate(normalizedT), rand) * zMultiplier;
                    size.set3fAt(x, y, z, i);
                    baseSize.set3fAt(x, y, z, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                size.fill1f(constantX, fromIndex, toIndex);
                baseSize.fill1f(constantX, fromIndex, toIndex);
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const pSize = lerp(xMin, xMax, rand);
                    size.set1fAt(pSize, i);
                    baseSize.set1fAt(pSize, i);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = xCurve.evaluate(normalizedT) * xMultiplier;
                    size.set1fAt(pSize, i);
                    baseSize.set1fAt(pSize, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const pSize = lerp(xMin.evaluate(normalizedT), xMax.evaluate(normalizedT), rand) * xMultiplier;
                    size.set1fAt(pSize, i);
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
