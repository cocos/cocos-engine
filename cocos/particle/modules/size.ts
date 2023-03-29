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

import { ccclass, tooltip, displayOrder, type, serializable, range, visible } from 'cc.decorator';
import { lerp, Vec3 } from '../../core/math';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { ModuleRandSeed } from '../enum';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { RandNumGen } from '../rand-num-gen';

const SIZE_OVERTIME_RAND_OFFSET = 1233881;
const seed = new Vec3();

@ccclass('cc.SizeModule')
@ParticleModule.register('Size', ModuleExecStage.UPDATE, ['State'])
export class SizeModule extends ParticleModule {
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
    @visible(function (this: SizeModule): boolean { return !this.separateAxes; })
    public get size () {
        return this.x;
    }

    public set size (val) {
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
    @visible(function (this: SizeModule): boolean { return this.separateAxes; })
    public x = new CurveRange(1);

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @type(CurveRange)
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:sizeOvertimeModule.y')
    @visible(function (this: SizeModule): boolean { return this.separateAxes; })
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
    @visible(function (this: SizeModule): boolean { return this.separateAxes; })
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

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
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
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            if (this.size.mode === CurveRange.Mode.Constant) {
                const constant = this.size.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(constant, i);
                }
            } else if (this.size.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.size;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(spline.evaluate(normalizedAliveTime[i]) * multiplier, i);
                }
            } else if (this.size.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.size;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply1fAt(lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.size;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    size.multiply1fAt(lerp(splineMin.evaluate(currentLife),
                        splineMax.evaluate(currentLife),
                        RandNumGen.getFloat(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * multiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.size.mode === CurveRange.Mode.Constant) {
                const { constant: constantX } = this.x;
                const { constant: constantY } = this.y;
                const { constant: constantZ } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    size.multiply3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.size.mode === CurveRange.Mode.Curve) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    size.multiply3fAt(splineX.evaluate(currentLife) * xMultiplier,
                        splineY.evaluate(currentLife) * yMultiplier,
                        splineZ.evaluate(currentLife) * zMultiplier, i);
                }
            } else if (this.size.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandNumGen.get3Float(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET, seed);
                    size.multiply3fAt(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAliveTime[i];
                    const ratio = RandNumGen.get3Float(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET, seed);
                    size.multiply3fAt(
                        lerp(xMin.evaluate(currentLife), xMax.evaluate(currentLife), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(currentLife), yMax.evaluate(currentLife), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(currentLife), zMax.evaluate(currentLife), ratio.z) * zMultiplier, i,
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
