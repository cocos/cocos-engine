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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { DELTA_TIME, FROM_INDEX, ContextDataSet, TO_INDEX } from '../data-set/context';
import { ParticleDataSet, SPRITE_ROTATION } from '../data-set/particle';
import { EmitterDataSet } from '../data-set/emitter';
import { UserDataSet } from '../data-set/user';
import { ConstantFloatExpression } from '../expressions';
import { FloatArrayParameter, FloatParameter, Uint32Parameter } from '../parameters';

@ccclass('cc.SpriteRotationRateModule')
@VFXModule.register('SpriteRotationRate', ModuleExecStageFlags.UPDATE, [SPRITE_ROTATION.name], [])
export class SpriteRotationRateModule extends VFXModule {
    @type(FloatExpression)
    public get rate () {
        if (!this._rate) {
            this._rate = new ConstantFloatExpression(0);
        }
        return this._rate;
    }

    public set rate (val) {
        this._rate = val;
    }

    @serializable
    private _rate: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(SPRITE_ROTATION);
        this.rate.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const spriteRotation = particles.getParameterUnsafe<FloatArrayParameter>(SPRITE_ROTATION);
        const deltaTime = context.getParameterUnsafe<FloatParameter>(DELTA_TIME).data;
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const exp = this._rate as FloatExpression;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const rate = exp.evaluate(0);
            for (let i = fromIndex; i < toIndex; i++) {
                spriteRotation.addFloatAt(rate * deltaTime, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const rate = exp.evaluate(i);
                spriteRotation.addFloatAt(rate * deltaTime, i);
            }
        }
    }
}
