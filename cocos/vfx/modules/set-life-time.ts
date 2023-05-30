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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { P_INV_LIFETIME, ParticleDataSet, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { FloatArrayParameter, Uint32Parameter } from '../parameters';

@ccclass('cc.SetLifeTimeModule')
@VFXModule.register('SetLifeTime', ModuleExecStageFlags.SPAWN)
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
    }

    @serializable
    private _lifetime: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_INV_LIFETIME);
        this.lifetime.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const invLifeTime = particles.getParameterUnsafe<FloatArrayParameter>(P_INV_LIFETIME);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const lifetimeExp = this._lifetime as FloatExpression;
        lifetimeExp.bind(particles, emitter, user, context);
        if (lifetimeExp.isConstant) {
            invLifeTime.fill(1 / lifetimeExp.evaluate(0), fromIndex, toIndex);
        } else {
            const dest = invLifeTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                dest[i] = 1 / lifetimeExp.evaluate(i);
            }
        }
    }
}
