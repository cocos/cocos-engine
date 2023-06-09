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

import { ccclass, type, serializable, visible, rangeMin } from 'cc.decorator';
import { lerp, math, Vec2, Vec3 } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec2Expression, Vec2Expression, Vec3Expression } from '../expressions';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { P_SPRITE_SIZE, P_VELOCITY, P_SCALE, C_FROM_INDEX, C_TO_INDEX } from '../define';

const tempVelocity = new Vec3();
const tempScalar = new Vec2();
const tempScalar2 = new Vec2();
@ccclass('cc.ScaleSpriteSizeBySpeedModule')
@VFXModule.register('ScaleSpriteSizeBySpeed', ModuleExecStageFlags.UPDATE, [P_SPRITE_SIZE.name], [P_SPRITE_SIZE.name, P_VELOCITY.name])
export class ScaleSpriteSizeBySpeedModule extends VFXModule {
    /**
       * @zh 决定是否在每个轴上独立控制粒子大小。
       */
    @serializable
    public separateAxes = false;

    /**
       * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
       */
    @type(FloatExpression)
    @visible(function (this: ScaleSpriteSizeBySpeedModule): boolean { return !this.separateAxes; })
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
    @visible(function (this: ScaleSpriteSizeBySpeedModule): boolean { return !this.separateAxes; })
    public get uniformMaxScalar () {
        if (!this._uniformMaxScalar) {
            this._uniformMaxScalar = new ConstantFloatExpression(1);
        }
        return this._uniformMaxScalar;
    }

    public set uniformMaxScalar (val) {
        this._uniformMaxScalar = val;
    }

    @type(Vec2Expression)
    @visible(function (this: ScaleSpriteSizeBySpeedModule): boolean { return this.separateAxes; })
    public get minScalar () {
        if (!this._minScalar) {
            this._minScalar = new ConstantVec2Expression();
        }
        return this._minScalar;
    }

    public set minScalar (val) {
        this._minScalar = val;
    }

    @type(Vec3Expression)
    @visible(function (this: ScaleSpriteSizeBySpeedModule): boolean { return this.separateAxes; })
    public get maxScalar () {
        if (!this._maxScalar) {
            this._maxScalar = new ConstantVec2Expression(Vec2.ONE);
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
    private _minSpeedThreshold: FloatExpression | null = null;
    @serializable
    private _maxSpeedThreshold: FloatExpression | null = null;
    @serializable
    private _uniformMinScalar: FloatExpression | null = null;
    @serializable
    private _uniformMaxScalar: FloatExpression | null = null;
    @serializable
    private _minScalar: Vec2Expression | null = null;
    @serializable
    private _maxScalar: Vec2Expression | null = null;

    public tick (dataStore: VFXDataStore) {
        particles.ensureParameter(P_SCALE);
        if (this.separateAxes) {
            this.maxScalar.tick(dataStore);
            this.minScalar.tick(dataStore);
        } else {
            this.uniformMaxScalar.tick(dataStore);
            this.uniformMinScalar.tick(dataStore);
        }
        this.minSpeedThreshold.tick(dataStore);
        this.maxSpeedThreshold.tick(dataStore);
    }

    public execute (dataStore: VFXDataStore) {
        const hasVelocity = particles.hasParameter(P_VELOCITY);
        if (!hasVelocity) { return; }
        const spriteSize = particles.getVec2ArrayParameter(P_SPRITE_SIZE);
        const velocity = particles.getVec3ArrayParameter(P_VELOCITY);
        const fromIndex = context.getUint32Parameter(C_FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(C_TO_INDEX).data;
        const minSpeedThresholdExp = this._minSpeedThreshold as FloatExpression;
        const maxSpeedThresholdExp = this._maxSpeedThreshold as FloatExpression;
        minSpeedThresholdExp.bind(dataStore);
        maxSpeedThresholdExp.bind(dataStore);
        if (!this.separateAxes) {
            const uniformMinScalarExp = this._uniformMinScalar as FloatExpression;
            const uniformMaxScalarExp = this._uniformMaxScalar as FloatExpression;
            uniformMinScalarExp.bind(dataStore);
            uniformMaxScalarExp.bind(dataStore);
            if (minSpeedThresholdExp.isConstant && maxSpeedThresholdExp.isConstant) {
                const min = minSpeedThresholdExp.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyScalarAt(lerp(uniformMinScalarExp.evaluate(i), uniformMaxScalarExp.evaluate(i), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThresholdExp.evaluate(i);
                    const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(i));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyScalarAt(lerp(uniformMinScalarExp.evaluate(i), uniformMaxScalarExp.evaluate(i), ratio), i);
                }
            }
        } else {
            const minScalarExp = this._minScalar as Vec2Expression;
            const maxScalarExp = this._maxScalar as Vec2Expression;
            minScalarExp.bind(dataStore);
            maxScalarExp.bind(dataStore);
            if (minSpeedThresholdExp.isConstant && maxSpeedThresholdExp.isConstant) {
                const min = minSpeedThresholdExp.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyVec2At(Vec2.lerp(tempScalar, minScalarExp.evaluate(i, tempScalar), maxScalarExp.evaluate(i, tempScalar2), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThresholdExp.evaluate(i);
                    const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(i));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyVec2At(Vec2.lerp(tempScalar, minScalarExp.evaluate(i, tempScalar), maxScalarExp.evaluate(i, tempScalar2), ratio), i);
                }
            }
        }
    }
}
