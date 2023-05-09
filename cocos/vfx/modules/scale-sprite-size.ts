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

import { ccclass, type, serializable, visible } from 'cc.decorator';
import { CCBoolean, Vec2 } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { BASE_SPRITE_SIZE, NORMALIZED_AGE, ParticleDataSet, SPRITE_SIZE } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec2Expression, Vec2Expression } from '../expressions';
import { Vec2ArrayParameter } from '../parameters/vec2';

const tempVec2 = new Vec2();

@ccclass('cc.ScaleSpriteSizeModule')
@VFXModule.register('ScaleSpriteSize', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [SPRITE_SIZE.name], [NORMALIZED_AGE.name])
export class ScaleSpriteSizeModule extends VFXModule {
    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @serializable
    @type(CCBoolean)
    public separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @type(FloatExpression)
    @visible(function (this: ScaleSpriteSizeModule): boolean { return !this.separateAxes; })
    public get uniformScalar () {
        if (!this._uniformScalar) {
            this._uniformScalar = new ConstantFloatExpression(1);
        }
        return this._uniformScalar;
    }

    public set uniformScalar (val) {
        this._uniformScalar = val;
    }

    @type(Vec2Expression)
    @visible(function (this: ScaleSpriteSizeModule): boolean { return this.separateAxes; })
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantVec2Expression(Vec2.ONE);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
    }

    @serializable
    private _uniformScalar: FloatExpression | null = null;
    @serializable
    private _scalar: Vec2Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(SPRITE_SIZE);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_SPRITE_SIZE);
        }
        if (!this.separateAxes) {
            this.uniformScalar.tick(particles, emitter, user, context);
        } else {
            this.scalar.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const spriteSize = particles.getVec2Parameter(context.executionStage === ModuleExecStage.SPAWN ? BASE_SPRITE_SIZE : SPRITE_SIZE);
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            const exp = this.uniformScalar;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const scalar = exp.evaluate(0);
                Vec2ArrayParameter.multiplyScalar(spriteSize, spriteSize, scalar, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i);
                    spriteSize.multiply1fAt(scalar, i);
                }
            }
        } else {
            const exp = this.scalar;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const scalar = exp.evaluate(0, tempVec2);
                for (let i = fromIndex; i < toIndex; i++) {
                    spriteSize.multiplyVec2At(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i, tempVec2);
                    spriteSize.multiplyVec2At(scalar, i);
                }
            }
        }
    }
}
