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
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { UserDataSet } from '../user-data-set';
import { EmitterDataSet } from '../emitter-data-set';

export enum LifetimeElapsedOperation {
    KILL = 0,
    LOOP_LIFETIME = 1,
    KEEP
}

@ccclass('cc.StateModule')
@VFXModule.register('State', ModuleExecStageFlags.UPDATE, [BuiltinParticleParameterName.NORMALIZED_AGE])
export class StateModule extends VFXModule {
    @type(Enum(LifetimeElapsedOperation))
    @visible(true)
    @serializable
    public lifetimeElapsedOperation = LifetimeElapsedOperation.KILL;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
        particles.markRequiredParameters(BuiltinParticleParameterFlags.INV_START_LIFETIME);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
        const invStartLifeTime = particles.getFloatParameter(INV_START_LIFETIME).data;
        const { fromIndex, toIndex, deltaTime } = context;
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
            // if has isDead parameter, deferred to remove particle until rendering.
        } else if (particles.hasParameter(BuiltinParticleParameter.IS_DEAD)) {
            const isDead = particles.getFloatParameter(IS_DEAD).data;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAge[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                    isDead[particleHandle] = 1;
                }
            }
        } else {
            for (let particleHandle = toIndex - 1; particleHandle >= fromIndex; particleHandle--) {
                normalizedAge[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAge[particleHandle] > 1) {
                    normalizedAge[particleHandle] = 1;
                    particles.removeParticle(particleHandle);
                    context.setExecuteRange(fromIndex, context.toIndex - 1);
                }
            }
        }
    }
}
