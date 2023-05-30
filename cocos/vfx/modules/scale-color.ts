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

import { ccclass, type, serializable } from 'cc.decorator';
import { Color } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { ColorExpression, ConstantColorExpression } from '../expressions';
import { P_BASE_COLOR, P_COLOR, P_NORMALIZED_AGE, ParticleDataSet, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { Uint32Parameter, ColorArrayParameter } from '../parameters';

const tempColor = new Color();

@ccclass('cc.ScaleColorModule')
@VFXModule.register('ScaleColor', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [], [P_NORMALIZED_AGE.name])
export class ScaleColorModule extends VFXModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(ColorExpression)
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantColorExpression(Color.WHITE);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
    }

    @serializable
    private _scalar: ColorExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(P_BASE_COLOR);
        }
        particles.markRequiredParameter(P_COLOR);
        this.scalar.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const color = particles.getParameterUnsafe<ColorArrayParameter>(context.executionStage === ModuleExecStage.UPDATE ? P_COLOR : P_BASE_COLOR);
        const scalarExp = this.scalar;
        scalarExp.bind(particles, emitter, user, context);
        if (scalarExp.isConstant) {
            const colorVal = scalarExp.evaluate(0, tempColor);
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(colorVal, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const colorVal = scalarExp.evaluate(i, tempColor);
                color.multiplyColorAt(colorVal, i);
            }
        }
    }
}
