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

import { ccclass, serializable, type } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { ColorExpression, ConstantColorExpression } from '../expressions';
import { Color } from '../../core';
import { ColorArrayParameter, Uint32Parameter } from '../parameters';
import { P_COLOR, P_NORMALIZED_AGE, P_BASE_COLOR, C_FROM_INDEX, C_TO_INDEX } from '../define';

const tempColor = new Color();

@ccclass('cc.SetColorModule')
@VFXModule.register('SetColor', ModuleExecStageFlags.SPAWN, [P_COLOR.name], [P_NORMALIZED_AGE.name])
export class SetColorModule extends VFXModule {
    /**
       * @zh 设置粒子颜色。
       */
    @type(ColorExpression)
    public get color () {
        if (!this._color) {
            this._color = new ConstantColorExpression();
        }
        return this._color;
    }

    public set color (val) {
        this._color = val;
    }

    @serializable
    private _color: ColorExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_COLOR);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(P_BASE_COLOR);
        }
        this.color.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const color = particles.getParameterUnsafe<ColorArrayParameter>(context.executionStage === ModuleExecStage.SPAWN ? P_BASE_COLOR : P_COLOR);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const colorExp = this._color as ColorExpression;
        colorExp.bind(particles, emitter, user, context);
        if (colorExp.isConstant) {
            color.fill(colorExp.evaluate(0, tempColor), fromIndex, toIndex);
        } else {
            const dest = color.data;
            for (let i = fromIndex; i < toIndex; i++) {
                dest[i] = Color.toUint32(colorExp.evaluate(i, tempColor));
            }
        }
    }
}
