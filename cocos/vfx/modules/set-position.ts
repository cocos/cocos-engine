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
import { VFXModule, VFXExecutionStageFlags } from '../vfx-module';
import { Vec3 } from '../../core';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const tempPos = new Vec3();

@ccclass('cc.SetPositionModule')
@VFXModule.register('SetPosition', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE, [P_POSITION.name], [])
export class SetPositionModule extends VFXModule {
    /**
      * @zh 设置粒子颜色。
      */
    @type(Vec3Expression)
    public get position () {
        if (!this._position) {
            this._position = new ConstantVec3Expression(0, 0, 0);
        }
        return this._position;
    }

    public set position (val) {
        this._position = val;
    }

    @serializable
    private _position: Vec3Expression | null = null;

    public tick (parameterMap: VFXParameterMap) {
        parameterMap.ensureParameter(P_POSITION);
        this.position.tick(parameterMap);
    }

    public execute (parameterMap: VFXParameterMap) {
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const positionExp = this._position as Vec3Expression;
        positionExp.bind(parameterMap);
        if (positionExp.isConstant) {
            position.fill(positionExp.evaluate(0, tempPos), fromIndex, toIndex);
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                position.setVec3At(positionExp.evaluate(i, tempPos), i);
            }
        }
    }
}
