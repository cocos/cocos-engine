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

import { ccclass, displayOrder, serializable, tooltip, type } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext, VFXEmitterParams, VFXEmitterState } from '../base';
import { ColorExpression } from '../expressions/color';
import { Color } from '../../core';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantColorExpression } from '../expressions';

const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

const COLOR_RAND_SEED = 1767123;

@ccclass('cc.SetColorModule')
@VFXModule.register('SetColor', ModuleExecStageFlags.SPAWN, [ParameterName.COLOR], [ParameterName.NORMALIZED_AGE])
export class SetColorModule extends VFXModule {
    /**
      * @zh 粒子初始颜色。
      */
    @type(ColorExpression)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.baseColor')
    public color: ColorExpression = new ConstantColorExpression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameters(BuiltinParticleParameterFlags.COLOR);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.BASE_COLOR);
        }
        this.color.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const color = context.executionStage === ModuleExecStage.SPAWN ? particles.baseColor.data : particles.color.data;
        const { fromIndex, toIndex } = context;
        this.color.bind(particles, emitter, user, context);
        if (this.color.isConstant) {
            const colorNum = Color.toUint32(this.color.evaluate(0, tempColor));
            for (let i = fromIndex; i < toIndex; i++) {
                color[i] = colorNum;
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const colorNum = Color.toUint32(this.color.evaluate(i, tempColor));
                color[i] = colorNum;
            }
        }
    }
}
