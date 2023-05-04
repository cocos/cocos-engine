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
import { approx, lerp, Vec2, assertIsTrue } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { NORMALIZED_AGE, ParticleDataSet, RANDOM_SEED, SCALE, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { Vec3Expression } from '../expressions';

const SCALE_SIZE_RAND = 2818312;
@ccclass('cc.ScaleMeshSizeBySpeedModule')
@VFXModule.register('ScaleMeshSizeBySpeed', ModuleExecStageFlags.UPDATE, [SCALE.name], [SCALE.name, VELOCITY.name])
export class ScaleMeshSizeBySpeedModule extends VFXModule {
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
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(2)
    @tooltip('i18n:sizeOvertimeModule.scale')
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return !this.separateAxes; })
    public get uniformScalar () {
        return this.x;
    }

    public set uniformScalar (val) {
        this.x = val;
    }

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
      */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:sizeOvertimeModule.x')
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return this.separateAxes; })
    public x = new FloatExpression(1);

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
      */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:sizeOvertimeModule.y')
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return this.separateAxes; })
    public get y () {
        if (!this._y) {
            this._y = new FloatExpression(1);
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
    }

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
      */
    @type(FloatExpression)
    @range([0, 1])
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return this.separateAxes; })
    public get z () {
        if (!this._z) {
            this._z = new FloatExpression(1);
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
    private _uniformScalarMin: FloatExpression | null = null;
    @serializable
    private _scalar: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(SCALE);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { scale } = particles;
        const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
        const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                const constant = this.x.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(constant, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const { spline, multiplier } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(spline.evaluate(normalizedAge[i]) * multiplier, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin, constantMax } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.x;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAge[i];
                    scale.multiply1fAt(lerp(splineMin.evaluate(currentLife),
                        splineMax.evaluate(currentLife),
                        RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)) * multiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                const { constant: constantX } = this.x;
                const { constant: constantY } = this.y;
                const { constant: constantZ } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAge[i];
                    scale.multiply3fAt(splineX.evaluate(currentLife) * xMultiplier,
                        splineY.evaluate(currentLife) * yMultiplier,
                        splineZ.evaluate(currentLife) * zMultiplier, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply3fAt(lerp(xMin, xMax, RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)),
                        lerp(yMin, yMax, RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)),
                        lerp(zMin, zMax, RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedAge[i];
                    scale.multiply3fAt(
                        lerp(xMin.evaluate(currentLife), xMax.evaluate(currentLife), RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)) * xMultiplier,
                        lerp(yMin.evaluate(currentLife), yMax.evaluate(currentLife), RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)) * yMultiplier,
                        lerp(zMin.evaluate(currentLife), zMax.evaluate(currentLife), RandomStream.getFloat(randomSeed[i] + SCALE_SIZE_RAND)) * zMultiplier, i,
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
