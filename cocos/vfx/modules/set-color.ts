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
import { BASE_COLOR, COLOR, NORMALIZED_AGE, ParticleDataSet } from '../data-set/particle';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../data-set/context';
import { ColorExpression } from '../expressions/color';
import { Color } from '../../core';
import { EmitterDataSet } from '../data-set/emitter';
import { UserDataSet } from '../data-set/user';
import { ConstantColorExpression } from '../expressions';
import { ColorArrayParameter, Uint32Parameter } from '../parameters';

const tempColor = new Color();

@ccclass('cc.SetColorModule')
@VFXModule.register('SetColor', ModuleExecStageFlags.SPAWN, [COLOR.name], [NORMALIZED_AGE.name])
export class SetColorModule extends VFXModule {
    /**
       * @zh 设置粒子颜色。
       */
    @type(ColorExpression)
    @serializable
    public color: ColorExpression = new ConstantColorExpression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(COLOR);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_COLOR);
        }
        this.color.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const color = particles.getParameterUnsafe<ColorArrayParameter>(context.executionStage === ModuleExecStage.SPAWN ? BASE_COLOR : COLOR);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        this.color.bind(particles, emitter, user, context);
        if (this.color.isConstant) {
            color.fill(this.color.evaluate(0, tempColor), fromIndex, toIndex);
        } else {
            const dest = color.data;
            const exp = this.color;
            for (let i = fromIndex; i < toIndex; i++) {
                dest[i] = Color.toUint32(exp.evaluate(i, tempColor));
            }
        }
    }
}
