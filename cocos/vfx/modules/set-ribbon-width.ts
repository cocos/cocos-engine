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
import { BASE_RIBBON_WIDTH, NORMALIZED_AGE, ParticleDataSet, RIBBON_WIDTH } from '../particle-data-set';
import { FROM_INDEX, ModuleExecContext, TO_INDEX } from '../module-exec-context';
import { FloatExpression } from '../expressions/float';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from '../expressions';

@ccclass('cc.SetRibbonWidthModule')
@VFXModule.register('SetRibbonWidth', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [RIBBON_WIDTH.name], [NORMALIZED_AGE.name])
export class SetRibbonWidthModule extends VFXModule {
    @type(FloatExpression)
    public get width () {
        if (!this._width) {
            this._width = new ConstantFloatExpression(1);
        }
        return this._width;
    }

    public set width (val) {
        this._width = val;
    }

    @serializable
    private _width: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_RIBBON_WIDTH);
        }

        particles.markRequiredParameter(RIBBON_WIDTH);
        this.width.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const ribbonWidth = context.executionStage === ModuleExecStage.SPAWN ? particles.getFloatParameter(BASE_RIBBON_WIDTH) : particles.getFloatParameter(RIBBON_WIDTH);
        const fromIndex = context.getUint32Parameter(FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(TO_INDEX).data;
        const exp = this._width as FloatExpression;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const width = exp.evaluate(0);
            ribbonWidth.fill(width, fromIndex, toIndex);
        } else {
            for (let i = fromIndex; i < toIndex; ++i) {
                const width = exp.evaluate(i);
                ribbonWidth.setFloatAt(width, i);
            }
        }
    }
}
