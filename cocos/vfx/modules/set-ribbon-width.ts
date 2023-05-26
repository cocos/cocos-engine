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
import { BASE_RIBBON_WIDTH, NORMALIZED_AGE, ParticleDataSet, RIBBON_WIDTH } from '../data-set/particle';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../data-set/context';
import { FloatExpression } from '../expressions/float';
import { EmitterDataSet } from '../data-set/emitter';
import { UserDataSet } from '../data-set/user';
import { ConstantFloatExpression } from '../expressions';
import { FloatArrayParameter, Uint32Parameter } from '../parameters';

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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_RIBBON_WIDTH);
        }

        particles.markRequiredParameter(RIBBON_WIDTH);
        this.width.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const ribbonWidth = particles.getParameterUnsafe<FloatArrayParameter>(context.executionStage === ModuleExecStage.SPAWN ? BASE_RIBBON_WIDTH : RIBBON_WIDTH);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
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
