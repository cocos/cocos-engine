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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { P_RIBBON_WIDTH, P_NORMALIZED_AGE, P_BASE_RIBBON_WIDTH, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXEmitter } from '../vfx-emitter';

@ccclass('cc.SetRibbonWidthModule')
@VFXModule.register('SetRibbonWidth', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE, [P_RIBBON_WIDTH.name], [P_NORMALIZED_AGE.name])
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
        this.requireRecompile();
    }

    @serializable
    private _width: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_RIBBON_WIDTH);
        }

        parameterMap.ensure(P_RIBBON_WIDTH);
        this.width.compile(parameterMap, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const ribbonWidth = parameterMap.getFloatArrayVale(this.usage === VFXExecutionStage.SPAWN ? P_BASE_RIBBON_WIDTH : P_RIBBON_WIDTH);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const widthExp = this._width as FloatExpression;
        widthExp.bind(parameterMap);
        if (widthExp.isConstant) {
            const width = widthExp.evaluate(0);
            ribbonWidth.fill(width, fromIndex, toIndex);
        } else {
            for (let i = fromIndex; i < toIndex; ++i) {
                const width = widthExp.evaluate(i);
                ribbonWidth.setFloatAt(width, i);
            }
        }
    }
}
