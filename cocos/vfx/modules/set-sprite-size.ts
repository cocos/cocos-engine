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

import { ccclass, serializable, type, visible } from 'cc.decorator';
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec2Expression, Vec2Expression } from '../expressions';
import { Vec2 } from '../../core';
import { P_SPRITE_SIZE, P_NORMALIZED_AGE, P_BASE_SPRITE_SIZE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const tempSize = new Vec2();

@ccclass('cc.SetSpriteSizeModule')
@VFXModule.register('SetSpriteSize', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE, [P_SPRITE_SIZE.name], [P_NORMALIZED_AGE.name])
export class SetSpriteSizeModule extends VFXModule {
    @visible(true)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(function (this: SetSpriteSizeModule): boolean { return !this.separateAxes; })
    public get uniformSize () {
        if (!this._uniformSize) {
            this._uniformSize = new ConstantFloatExpression(1);
        }
        return this._uniformSize;
    }

    public set uniformSize (val) {
        this._uniformSize = val;
        this.requireRecompile();
    }

    @type(Vec2Expression)
    @visible(function (this: SetSpriteSizeModule): boolean { return this.separateAxes; })
    public get size () {
        if (!this._size) {
            this._size = new ConstantVec2Expression(Vec2.ONE);
        }
        return this._size;
    }

    public set size (val) {
        this._size = val;
        this.requireRecompile();
    }

    @serializable
    private _uniformSize: FloatExpression | null = null;
    @serializable
    private _size: Vec2Expression | null = null;
    @serializable
    private _separateAxes = false;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_SPRITE_SIZE);
        }

        parameterMap.ensure(P_SPRITE_SIZE);
        if (this.separateAxes) {
            this.size.compile(parameterMap, this);
        } else {
            this.uniformSize.compile(parameterMap, this);
        }
    }

    public execute (parameterMap: VFXParameterMap) {
        const scale = this.usage === VFXExecutionStage.SPAWN ? parameterMap.getVec2ArrayValue(P_BASE_SPRITE_SIZE) : parameterMap.getVec2ArrayValue(P_SPRITE_SIZE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (this.separateAxes) {
            const sizeExp = this._size as Vec2Expression;
            sizeExp.bind(parameterMap);
            if (sizeExp.isConstant) {
                const srcScale = sizeExp.evaluate(0, tempSize);
                scale.fill(srcScale, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    sizeExp.evaluate(i, tempSize);
                    scale.setVec2At(tempSize, i);
                }
            }
        } else {
            const uniformSizeExp = this._uniformSize as FloatExpression;
            uniformSizeExp.bind(parameterMap);
            if (uniformSizeExp.isConstant) {
                const srcScale = uniformSizeExp.evaluate(0);
                Vec2.set(tempSize, srcScale, srcScale);
                scale.fill(tempSize, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const srcScale = uniformSizeExp.evaluate(i);
                    scale.setUniformFloatAt(srcScale, i);
                }
            }
        }
    }
}
