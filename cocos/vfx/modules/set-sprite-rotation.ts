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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, P_SPRITE_ROTATION, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { FloatArrayParameter, Uint32Parameter } from '../parameters';

@ccclass('cc.SetSpriteRotationModule')
@VFXModule.register('SetSpriteRotation', ModuleExecStageFlags.SPAWN)
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
    }

    @serializable
    private _rotation: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_SPRITE_ROTATION);
        this.rotation.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const spriteRotation = particles.getParameterUnsafe<FloatArrayParameter>(P_SPRITE_ROTATION);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const rotationExp = this._rotation as FloatExpression;
        rotationExp.bind(particles, emitter, user, context);

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
