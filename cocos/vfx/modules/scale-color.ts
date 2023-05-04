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

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Color } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { ColorExpression } from '../expressions/color';
import { BASE_COLOR, COLOR, NORMALIZED_AGE, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { ConstantColorExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const tempColor = new Color();

@ccclass('cc.ScaleColor')
@VFXModule.register('MultiplyColor', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [], [NORMALIZED_AGE.name])
export class ScaleColorModule extends VFXModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(ColorExpression)
    @serializable
    public scalar: ColorExpression = new ConstantColorExpression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_COLOR);
        }
        particles.markRequiredParameter(COLOR);
        this.scalar.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const dest = particles.getColorParameter(context.executionStage === ModuleExecStage.UPDATE ? COLOR : BASE_COLOR);
        const exp = this.scalar;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const colorVal = exp.evaluate(0, tempColor);
            for (let i = fromIndex; i < toIndex; i++) {
                dest.multiplyColorAt(colorVal, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const colorVal = exp.evaluate(0, tempColor);
                dest.multiplyColorAt(colorVal, i);
            }
        }
    }
}
