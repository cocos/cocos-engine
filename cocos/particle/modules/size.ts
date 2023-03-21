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
import { lerp, pseudoRandom, Vec3 } from '../../core/math';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { ModuleRandSeed } from '../enum';
import { ParticleData } from '../particle-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const SIZE_OVERTIME_RAND_OFFSET = ModuleRandSeed.SIZE;
const tempSize = new Vec3();

@ccclass('cc.SizeModule')
@ParticleModule.register('Size', ModuleExecStage.UPDATE, 24)
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

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { startSize, size } = particles;
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const randomSeed = particles.randomSeed.data;
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            if (this.size.mode === CurveRange.Mode.Constant) {
                const constant = this.size.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    size.setVec3At(tempSize.multiplyScalar(constant), i);
                }
            } else if (this.size.mode === CurveRange.Mode.Curve) {
                const { spline, multiplier } = this.size;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    size.setVec3At(tempSize.multiplyScalar(spline.evaluate(normalizedAliveTime[i]) * multiplier), i);
                }
            } else if (this.size.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.size;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    size.setVec3At(tempSize.multiplyScalar(lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET))), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.size;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    const currentLife = normalizedAliveTime[i];
                    size.setVec3At(tempSize.multiplyScalar(lerp(splineMin.evaluate(currentLife),
                        splineMax.evaluate(currentLife),
                        pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * multiplier), i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.size.mode === CurveRange.Mode.Constant) {
                const { constant: constantX } = this.x;
                const { constant: constantY } = this.y;
                const { constant: constantZ } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    size.setVec3At(tempSize.multiply3f(constantX, constantY, constantZ), i);
                }
            } else if (this.size.mode === CurveRange.Mode.Curve) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    const currentLife = normalizedAliveTime[i];
                    size.setVec3At(tempSize.multiply3f(splineX.evaluate(currentLife) * xMultiplier,
                        splineY.evaluate(currentLife) * yMultiplier,
                        splineZ.evaluate(currentLife) * zMultiplier), i);
                }
            } else if (this.size.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    size.setVec3At(tempSize.multiply3f(
                        lerp(xMin, xMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(yMin, yMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(zMin, zMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                    ), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    startSize.getVec3At(tempSize, i);
                    const currentLife = normalizedAliveTime[i];
                    size.setVec3At(tempSize.multiply3f(
                        lerp(xMin.evaluate(currentLife), xMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * xMultiplier,
                        lerp(yMin.evaluate(currentLife), yMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * yMultiplier,
                        lerp(zMin.evaluate(currentLife), zMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * zMultiplier,
                    ), i);
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
