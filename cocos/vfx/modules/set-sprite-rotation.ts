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
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { P_SPRITE_ROTATION, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

@ccclass('cc.SetSpriteRotationModule')
@VFXModule.register('SetSpriteRotation', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.EVENT_HANDLER, [P_SPRITE_ROTATION.name], [])
export class SetSpriteRotationModule extends VFXModule {
    @type(FloatExpression)
    public get rotation () {
        if (!this._rotation) {
            this._rotation = new ConstantFloatExpression(0);
        }
        return this._rotation;
    }

    public set rotation (val) {
        this._rotation = val;
        this.requireRecompile();
    }

    @serializable
    private _rotation: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_SPRITE_ROTATION);
        this.rotation.compile(parameterMap, parameterRegistry, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const spriteRotation = parameterMap.getFloatArrayVale(P_SPRITE_ROTATION);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const rotationExp = this._rotation as FloatExpression;
        rotationExp.bind(parameterMap);

        if (rotationExp.isConstant) {
            const rotation = rotationExp.evaluate(0);
            spriteRotation.fill(rotation, fromIndex, toIndex);
        } else {
            for (let i = fromIndex; i < toIndex; ++i) {
                spriteRotation.setFloatAt(rotationExp.evaluate(i), i);
            }
        }
    }
}
