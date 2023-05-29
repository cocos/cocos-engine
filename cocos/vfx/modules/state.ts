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
import { ccclass, serializable, type, visible } from 'cc.decorator';
import { Enum } from '../../core';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { INV_START_LIFETIME, IS_DEAD, NORMALIZED_AGE, ParticleDataSet, DELTA_TIME, FROM_INDEX, ContextDataSet, TO_INDEX, UserDataSet, EmitterDataSet } from '../data-set';
import { FloatArrayParameter, FloatParameter, Uint32Parameter, BoolArrayParameter } from '../parameters';

export enum LifetimeElapsedOperation {
    KILL,
    LOOP_LIFETIME,
    KEEP
}

@ccclass('cc.StateModule')
@VFXModule.register('State', ModuleExecStageFlags.UPDATE, [NORMALIZED_AGE.name])
export class StateModule extends VFXModule {
    @type(Enum(LifetimeElapsedOperation))
    @visible(true)
    @serializable
    public lifetimeElapsedOperation = LifetimeElapsedOperation.KILL;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.KILL) {
            particles.markRequiredParameter(IS_DEAD);
        }
        particles.markRequiredParameter(NORMALIZED_AGE);
        particles.markRequiredParameter(INV_START_LIFETIME);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const normalizedAge = particles.getParameterUnsafe<FloatArrayParameter>(NORMALIZED_AGE).data;
        const invStartLifeTime = particles.getParameterUnsafe<FloatArrayParameter>(INV_START_LIFETIME).data;
        const deltaTime = context.getParameterUnsafe<FloatParameter>(DELTA_TIME).data;
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.LOOP_LIFETIME) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] -= 1;
                }
            }
        } else if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.KEEP) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                }
            }
        } else {
            const isDead = particles.getParameterUnsafe<BoolArrayParameter>(IS_DEAD).data;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                    isDead[particleHandle] = 1;
                }
            }
        }
    }
}
