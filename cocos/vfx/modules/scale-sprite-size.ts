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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec2Expression, Vec2Expression } from '../expressions';
import { VFXVec2Array } from '../data';
import { P_SPRITE_SIZE, P_NORMALIZED_AGE, P_BASE_SPRITE_SIZE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const tempVec2 = new Vec2();

@ccclass('cc.ScaleSpriteSizeModule')
@VFXModule.register('ScaleSpriteSize', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [P_SPRITE_SIZE.name], [P_NORMALIZED_AGE.name])
export class ScaleSpriteSizeModule extends VFXModule {
    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @type(CCBoolean)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @serializable
    private _uniformScalar: FloatExpression | null = null;
    @serializable
    private _scalar: Vec2Expression | null = null;
    @serializable
    private _separateAxes = false;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_SPRITE_SIZE);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_SPRITE_SIZE);
        }
        if (!this.separateAxes) {
            compileResult &&= this.uniformScalar.compile(parameterMap, parameterRegistry, this);
        } else {
            compileResult &&= this.scalar.compile(parameterMap, parameterRegistry, this);
        }
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const spriteSize = parameterMap.getVec2ArrayValue(this.usage === VFXExecutionStage.SPAWN ? P_BASE_SPRITE_SIZE : P_SPRITE_SIZE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (!this.separateAxes) {
            const uniformScalarExp = this._uniformScalar as FloatExpression;
            uniformScalarExp.bind(parameterMap);

            for (let i = fromIndex; i < toIndex; i++) {
                const scalar = uniformScalarExp.evaluate(i);
                spriteSize.multiplyScalarAt(scalar, i);
            }
        } else {
            const scalarExp = this._scalar as Vec2Expression;
            scalarExp.bind(parameterMap);

            for (let i = fromIndex; i < toIndex; i++) {
                const scalar = scalarExp.evaluate(i, tempVec2);
                spriteSize.multiplyVec2At(scalar, i);
            }
        }
    }
}
