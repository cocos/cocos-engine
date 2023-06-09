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
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { P_SPRITE_SIZE, P_NORMALIZED_AGE, P_RIBBON_WIDTH, P_BASE_RIBBON_WIDTH, C_FROM_INDEX, C_TO_INDEX } from '../define';

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

    public tick (dataStore: VFXDataStore) {
        particles.ensureParameter(P_RIBBON_WIDTH);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.ensureParameter(P_BASE_RIBBON_WIDTH);
        }
        this.scalar.tick(dataStore);
    }

    public execute (dataStore: VFXDataStore) {
        const ribbonWidth = particles.getFloatArrayParameter(context.executionStage === ModuleExecStage.SPAWN ? P_BASE_RIBBON_WIDTH : P_RIBBON_WIDTH);
        const fromIndex = context.getUint32Parameter(C_FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(C_TO_INDEX).data;
        const scalarExp = this._scalar as FloatExpression;
        scalarExp.bind(dataStore);
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
