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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { ColorExpression, ConstantColorExpression } from '../expressions';
import { P_NORMALIZED_AGE, P_BASE_COLOR, P_COLOR, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const tempColor = new Color();

@ccclass('cc.ScaleColorModule')
@VFXModule.register('ScaleColor', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [], [P_NORMALIZED_AGE.name])
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
        this.requireRecompile();
    }

    @serializable
    private _scalar: ColorExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_COLOR);
        }
        parameterMap.ensure(P_COLOR);
        this.scalar.compile(parameterMap, parameterRegistry, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const color = parameterMap.getColorArrayValue(this.usage === VFXExecutionStage.UPDATE ? P_COLOR : P_BASE_COLOR);
        const scalarExp = this.scalar;
        scalarExp.bind(parameterMap);
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
