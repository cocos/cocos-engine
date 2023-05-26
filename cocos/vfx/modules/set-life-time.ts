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
import { INV_START_LIFETIME, ParticleDataSet } from '../particle-data-set';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../context-data-set';
import { FloatExpression } from '../expressions/float';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from '../expressions/constant-float';
import { FloatArrayParameter, Uint32Parameter } from '../parameters';

@ccclass('cc.SetLifeTimeModule')
@VFXModule.register('SetLifeTime', ModuleExecStageFlags.SPAWN)
export class SetLifeTimeModule extends VFXModule {
    /**
      * @zh 粒子生命周期。
      */
    @type(FloatExpression)
    @serializable
    @rangeMin(0)
    public lifetime: FloatExpression = new ConstantFloatExpression(5);

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(INV_START_LIFETIME);
        this.lifetime.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const invStartLifeTime = particles.getParameterUnsafe<FloatArrayParameter>(INV_START_LIFETIME);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const exp = this.lifetime;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const invLifeTime = 1 / exp.evaluate(0);
            invStartLifeTime.fill(invLifeTime, fromIndex, toIndex);
        } else {
            const dest = invStartLifeTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                dest[i] = 1 / exp.evaluate(i);
            }
        }
    }
}
