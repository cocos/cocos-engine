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
import { lerp, math, Vec2, Vec3 } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { ParticleDataSet, SCALE, SPRITE_SIZE, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec2Expression, ConstantVec3Expression, Vec2Expression, Vec3Expression } from '../expressions';

const tempVelocity = new Vec3();
const tempScalar = new Vec2();
const tempScalar2 = new Vec2();
@ccclass('cc.ScaleSpriteSizeBySpeedModule')
@VFXModule.register('ScaleSpriteSizeBySpeed', ModuleExecStageFlags.UPDATE, [SPRITE_SIZE.name], [SPRITE_SIZE.name, VELOCITY.name])
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
    @range([0, 1])
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
    @range([0, 1])
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
    @serializable
    @rangeMin(0)
    public minSpeedThreshold: FloatExpression = new ConstantFloatExpression();

    @type(FloatExpression)
    @serializable
    @rangeMin(0)
    public maxSpeedThreshold: FloatExpression = new ConstantFloatExpression(1);

    @serializable
    private _uniformMinScalar: FloatExpression | null = null;
    @serializable
    private _uniformMaxScalar: FloatExpression | null = null;
    @serializable
    private _minScalar: Vec2Expression | null = null;
    @serializable
    private _maxScalar: Vec2Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(SCALE);
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

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const hasVelocity = particles.hasParameter(VELOCITY);
        if (!hasVelocity) { return; }
        const spriteSize = particles.getVec2Parameter(SPRITE_SIZE);
        const velocity = particles.getVec3Parameter(VELOCITY);
        const minSpeedThreshold = this.minSpeedThreshold;
        const maxSpeedThreshold = this.maxSpeedThreshold;
        minSpeedThreshold.bind(particles, emitter, user, context);
        maxSpeedThreshold.bind(particles, emitter, user, context);
        if (!this.separateAxes) {
            const uniformMinScalar = this.uniformMinScalar;
            const uniformMaxScalar = this.uniformMaxScalar;
            uniformMinScalar.bind(particles, emitter, user, context);
            uniformMaxScalar.bind(particles, emitter, user, context);
            if (minSpeedThreshold.isConstant && maxSpeedThreshold.isConstant) {
                const min = minSpeedThreshold.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThreshold.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiply1fAt(lerp(uniformMinScalar.evaluate(i), uniformMaxScalar.evaluate(i), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThreshold.evaluate(i);
                    const speedScale = 1 / Math.abs(min - maxSpeedThreshold.evaluate(0));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiply1fAt(lerp(uniformMinScalar.evaluate(i), uniformMaxScalar.evaluate(i), ratio), i);
                }
            }
        } else {
            const minScalar = this.minScalar;
            const maxScalar = this.maxScalar;
            minScalar.bind(particles, emitter, user, context);
            maxScalar.bind(particles, emitter, user, context);
            if (minSpeedThreshold.isConstant && maxSpeedThreshold.isConstant) {
                const min = minSpeedThreshold.evaluate(0);
                const speedScale = 1 / Math.abs(min - maxSpeedThreshold.evaluate(0));
                const speedOffset = -min * speedScale;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyVec2At(Vec2.lerp(tempScalar, minScalar.evaluate(i, tempScalar), maxScalar.evaluate(i, tempScalar2), ratio), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const min = minSpeedThreshold.evaluate(0);
                    const speedScale = 1 / Math.abs(min - maxSpeedThreshold.evaluate(0));
                    const speedOffset = -min * speedScale;
                    velocity.getVec3At(tempVelocity, i);
                    const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                    spriteSize.multiplyVec2At(Vec2.lerp(tempScalar, minScalar.evaluate(i, tempScalar), maxScalar.evaluate(i, tempScalar2), ratio), i);
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
