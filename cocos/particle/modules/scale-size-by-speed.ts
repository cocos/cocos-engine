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

import { ccclass, tooltip, displayOrder, type, serializable, range, visible, rangeMin } from 'cc.decorator';
import { approx, lerp, Vec2, Vec3 } from '../../core/math';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { ModuleRandSeed } from '../enum';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { assert } from '../../core';
import { RandNumGen } from '../rand-num-gen';

const SIZE_OVERTIME_RAND_OFFSET = ModuleRandSeed.SIZE;

@ccclass('cc.ScaleSizeBySpeedModule')
@ParticleModule.register('ScaleSizeBySpeed', ModuleExecStage.UPDATE, ['Solve'])
export class ScaleSizeBySpeedModule extends ParticleModule {
    /**
      * @zh 决定是否在每个轴上独立控制粒子大小。
      */
    @serializable
    @displayOrder(1)
    @tooltip('i18n:sizeOvertimeModule.separateAxes')
    public separateAxes = false;

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
      */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(2)
    @tooltip('i18n:sizeOvertimeModule.size')
    @visible(function (this: ScaleSizeBySpeedModule): boolean { return !this.separateAxes; })
    public get scalar () {
        return this.x;
    }

    public set scalar (val) {
        this.x = val;
    }

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
      */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:sizeOvertimeModule.x')
    @visible(function (this: ScaleSizeBySpeedModule): boolean { return this.separateAxes; })
    public x = new CurveRange(1);

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
      */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:sizeOvertimeModule.y')
    @visible(function (this: ScaleSizeBySpeedModule): boolean { return this.separateAxes; })
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
      * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
      */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(5)
    @tooltip('i18n:sizeOvertimeModule.z')
    @visible(function (this: ScaleSizeBySpeedModule): boolean { return this.separateAxes; })
    public get z () {
        if (!this._z) {
            this._z = new CurveRange(1);
        }
        return this._z;
    }

    public set z (val) {
        this._z = val;
    }

    @type(Vec2)
    @serializable
    @rangeMin(0)
    public speedRange = new Vec2(0, 1);

    @serializable
    private _y: CurveRange | null = null;
    @serializable
    private _z: CurveRange | null = null;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        assert(!approx(this.speedRange.x, this.speedRange.y), 'Speed Range X is so closed to Speed Range Y');
        context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        if (this.x.mode === CurveRange.Mode.TwoConstants || this.x.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
        if (this.x.mode === CurveRange.Mode.Curve || this.x.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { size } = particles;
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const randomSeed = particles.randomSeed.data;
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            if (this.x.mode === CurveRange.Mode.Constant) {
                const constant = this.x.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(constant, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(spline.evaluate(normalizedAliveTime[i]) * multiplier, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    size.multiply1fAt(lerp(splineMin.evaluate(currentLife),
                        splineMax.evaluate(currentLife),
                        RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * multiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === CurveRange.Mode.Constant) {
                const { constant: constantX } = this.x;
                const { constant: constantY } = this.y;
                const { constant: constantZ } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.x.mode === CurveRange.Mode.Curve) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    size.multiply3fAt(splineX.evaluate(currentLife) * xMultiplier,
                        splineY.evaluate(currentLife) * yMultiplier,
                        splineZ.evaluate(currentLife) * zMultiplier, i);
                }
            } else if (this.x.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply3fAt(lerp(xMin, xMax, RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    size.multiply3fAt(
                        lerp(xMin.evaluate(currentLife), xMax.evaluate(currentLife), RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(currentLife), yMax.evaluate(currentLife), RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(currentLife), zMax.evaluate(currentLife), RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * zMultiplier, i,
                    );
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
