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

import { ccclass, rangeMin, serializable, type } from 'cc.decorator';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { P_INV_LIFETIME, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

@ccclass('cc.SetLifeTimeModule')
@VFXModule.register('SetLifeTime', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.EVENT_HANDLER)
export class SetLifeTimeModule extends VFXModule {
    /**
      * @zh 粒子生命周期。
      */
    @type(FloatExpression)
    @rangeMin(0)
    public get lifetime () {
        if (!this._lifetime) {
            this._lifetime = new ConstantFloatExpression(1);
        }
        return this._lifetime;
    }

    public set lifetime (val) {
        this._lifetime = val;
        this.requireRecompile();
    }

    @serializable
    private _lifetime: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_INV_LIFETIME);
        compileResult &&= this.lifetime.compile(parameterMap, parameterRegistry, this);
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const invLifeTime = parameterMap.getFloatArrayVale(P_INV_LIFETIME);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const lifetimeExp = this._lifetime as FloatExpression;
        lifetimeExp.bind(parameterMap);

        for (let i = fromIndex; i < toIndex; ++i) {
            invLifeTime.setFloatAt(1 / lifetimeExp.evaluate(i), i);
        }
    }
}
