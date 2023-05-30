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

import { ccclass, type, serializable, range, visible, rangeMin } from 'cc.decorator';
import { lerp, math, Vec3 } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { ParticleDataSet, P_SCALE, P_VELOCITY, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { Uint32Parameter, Vec3ArrayParameter } from '../parameters';

const tempVelocity = new Vec3();
const tempScalar = new Vec3();
const tempScalar2 = new Vec3();
@ccclass('cc.ScaleMeshSizeBySpeedModule')
@VFXModule.register('ScaleMeshSizeBySpeed', ModuleExecStageFlags.UPDATE, [P_SCALE.name], [P_SCALE.name, P_VELOCITY.name])
export class ScaleMeshSizeBySpeedModule extends VFXModule {
    /**
      * @zh 决定是否在每个轴上独立控制粒子大小。
      */
    @serializable
    public separateAxes = false;

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
      */
    @type(FloatExpression)
    @range([0, 1])
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return !this.separateAxes; })
    public get uniformMinScalar () {
        if (!this._uniformMinScalar) {
            this._uniformMinScalar = new ConstantFloatExpression();
        }
        return this._uniformMinScalar;
    }

    public set uniformMinScalar (val) {
        this._uniformMinScalar = val;
    }

    @type(FloatExpression)
    @range([0, 1])
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return !this.separateAxes; })
    public get uniformMaxScalar () {
        if (!this._uniformMaxScalar) {
            this._uniformMaxScalar = new ConstantFloatExpression(1);
        }
        return this._uniformMaxScalar;
    }

    public set uniformMaxScalar (val) {
        this._uniformMaxScalar = val;
    }

    @type(Vec3Expression)
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return this.separateAxes; })
    public get minScalar () {
        if (!this._minScalar) {
            this._minScalar = new ConstantVec3Expression();
        }
        return this._minScalar;
    }

    public set minScalar (val) {
        this._minScalar = val;
    }

    @type(Vec3Expression)
    @visible(function (this: ScaleMeshSizeBySpeedModule): boolean { return this.separateAxes; })
    public get maxScalar () {
        if (!this._maxScalar) {
            this._maxScalar = new ConstantVec3Expression(1, 1, 1);
        }
        return this._maxScalar;
    }

    public set maxScalar (val) {
        this._maxScalar = val;
    }

    @type(FloatExpression)
    @rangeMin(0)
    public get minSpeedThreshold () {
        if (!this._minSpeedThreshold) {
            this._minSpeedThreshold = new ConstantFloatExpression();
        }
        return this._minSpeedThreshold;
    }

    public set minSpeedThreshold (val) {
        this._minSpeedThreshold = val;
    }

    @type(FloatExpression)
    @rangeMin(0)
    public get maxSpeedThreshold () {
        if (!this._maxSpeedThreshold) {
            this._maxSpeedThreshold = new ConstantFloatExpression(1);
        }
        return this._maxSpeedThreshold;
    }

    public set maxSpeedThreshold (val) {
        this._maxSpeedThreshold = val;
    }

    @serializable
    private _uniformMinScalar: FloatExpression | null = null;
    @serializable
    private _uniformMaxScalar: FloatExpression | null = null;
    @serializable
    private _minScalar: Vec3Expression | null = null;
    @serializable
    private _maxScalar: Vec3Expression | null = null;
    @serializable
    private _minSpeedThreshold: FloatExpression | null = null;
    @serializable
    private _maxSpeedThreshold: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_SCALE);
        if (this.separateAxes) {
            this.maxScalar.tick(particles, emitter, user, context);
            this.minScalar.tick(particles, emitter, user, context);
        } else {
            this.uniformMaxScalar.tick(particles, emitter, user, context);
            this.uniformMinScalar.tick(particles, emitter, user, context);
        }
        this.minSpeedThreshold.tick(particles, emitter, user, context);
        this.maxSpeedThreshold.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const hasVelocity = particles.hasParameter(P_VELOCITY);
        if (!hasVelocity) { return; }
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const scale = particles.getParameterUnsafe<Vec3ArrayParameter>(P_SCALE);
        const velocity = particles.getParameterUnsafe<Vec3ArrayParameter>(P_VELOCITY);
        const minSpeedThresholdExp = this._minSpeedThreshold as FloatExpression;
        const maxSpeedThresholdExp = this._maxSpeedThreshold as FloatExpression;
        minSpeedThresholdExp.bind(particles, emitter, user, context);
        maxSpeedThresholdExp.bind(particles, emitter, user, context);
        if (!this.separateAxes) {
            const uniformMinScalarExp = this._uniformMinScalar as FloatExpression;
            const uniformMaxScalarExp = this._uniformMaxScalar as FloatExpression;
            uniformMinScalarExp.bind(particles, emitter, user, context);
            uniformMaxScalarExp.bind(particles, emitter, user, context);
            if (minSpeedThresholdExp.isConstant && maxSpeedThresholdExp.isConstant) {
                const min = minSpeedThresholdExp.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    scale.multiplyScalarAt(lerp(uniformMinScalarExp.evaluate(i), uniformMaxScalarExp.evaluate(i), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThresholdExp.evaluate(i);
                    const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(i));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    scale.multiplyScalarAt(lerp(uniformMinScalarExp.evaluate(i), uniformMaxScalarExp.evaluate(i), ratio), i);
                }
            }
        } else {
            const minScalarExp = this._minScalar as Vec3Expression;
            const maxScalarExp = this._maxScalar as Vec3Expression;
            minScalarExp.bind(particles, emitter, user, context);
            maxScalarExp.bind(particles, emitter, user, context);
            if (minSpeedThresholdExp.isConstant && maxSpeedThresholdExp.isConstant) {
                const min = minSpeedThresholdExp.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    scale.multiplyVec3At(Vec3.lerp(tempScalar, minScalarExp.evaluate(i, tempScalar), maxScalarExp.evaluate(i, tempScalar2), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThresholdExp.evaluate(i);
                    const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(i));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    scale.multiplyVec3At(Vec3.lerp(tempScalar, minScalarExp.evaluate(i, tempScalar), maxScalarExp.evaluate(i, tempScalar2), ratio), i);
                }
            }
        }
    }
}
