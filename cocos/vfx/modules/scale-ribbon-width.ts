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
import { FloatExpression } from '../expressions/float';
import { BASE_RIBBON_WIDTH, NORMALIZED_AGE, ParticleDataSet, RIBBON_WIDTH, SPRITE_SIZE } from '../particle-data-set';
import { FROM_INDEX, ModuleExecContext, TO_INDEX } from '../module-exec-context';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from '../expressions';

@ccclass('cc.ScaleRibbonWidthModule')
@VFXModule.register('ScaleRibbonWidth', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [SPRITE_SIZE.name], [NORMALIZED_AGE.name])
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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(RIBBON_WIDTH);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_RIBBON_WIDTH);
        }
        this.scalar.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const ribbonWidth = particles.getFloatParameter(context.executionStage === ModuleExecStage.SPAWN ? BASE_RIBBON_WIDTH : RIBBON_WIDTH);
        const fromIndex = context.getUint32Parameter(FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(TO_INDEX).data;
        const exp = this._scalar as FloatExpression;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const scalar = exp.evaluate(0);
            for (let i = fromIndex; i < toIndex; i++) {
                ribbonWidth.multiplyFloatAt(scalar, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const scalar = exp.evaluate(i);
                ribbonWidth.multiplyFloatAt(scalar, i);
            }
        }
    }
}
