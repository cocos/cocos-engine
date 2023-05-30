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
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { P_BASE_RIBBON_WIDTH, P_NORMALIZED_AGE, ParticleDataSet, P_RIBBON_WIDTH, P_SPRITE_SIZE, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatArrayParameter, Uint32Parameter } from '../parameters';

@ccclass('cc.ScaleRibbonWidthModule')
@VFXModule.register('ScaleRibbonWidth', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [P_SPRITE_SIZE.name], [P_NORMALIZED_AGE.name])
export class ScaleRibbonWidthModule extends VFXModule {
    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
      */
    @type(FloatExpression)
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantFloatExpression(1);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
    }

    @serializable
    private _scalar: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_RIBBON_WIDTH);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(P_BASE_RIBBON_WIDTH);
        }
        this.scalar.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const ribbonWidth = particles.getParameterUnsafe<FloatArrayParameter>(context.executionStage === ModuleExecStage.SPAWN ? P_BASE_RIBBON_WIDTH : P_RIBBON_WIDTH);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const scalarExp = this._scalar as FloatExpression;
        scalarExp.bind(particles, emitter, user, context);
        if (scalarExp.isConstant) {
            const scalar = scalarExp.evaluate(0);
            for (let i = fromIndex; i < toIndex; i++) {
                ribbonWidth.multiplyFloatAt(scalar, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const scalar = scalarExp.evaluate(i);
                ribbonWidth.multiplyFloatAt(scalar, i);
            }
        }
    }
}
