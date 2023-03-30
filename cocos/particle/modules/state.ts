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
import { Vec3 } from '../../core';
import { ccclass, serializable } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

export enum LifetimeElapsedOperation {
    KILL = 0,
    LOOP_LIFETIME = 1,
    KEEP
}

@ccclass('cc.StateModule')
@ParticleModule.register('State', ModuleExecStage.UPDATE, [BuiltinParticleParameterName.NORMALIZED_ALIVE_TIME])
export class StateModule extends ParticleModule {
    @serializable
    public lifetimeElapsedOperation = LifetimeElapsedOperation.KILL;

    constructor () {
        super();
        this.enabled = true;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        context.markRequiredParameter(BuiltinParticleParameter.INV_START_LIFETIME);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const invStartLifeTime = particles.invStartLifeTime.data;
        const { fromIndex, toIndex, deltaTime } = context;
        if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.LOOP_LIFETIME) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAliveTime[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAliveTime[particleHandle] > 1) {
                    normalizedAliveTime[particleHandle] -= 1;
                }
            }
        } else if (this.lifetimeElapsedOperation === LifetimeElapsedOperation.KEEP) {
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAliveTime[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAliveTime[particleHandle] > 1) {
                    normalizedAliveTime[particleHandle] = 1;
                }
            }
            // if has isDead parameter, deferred to remove particle until rendering.
        } else if (particles.hasParameter(BuiltinParticleParameter.IS_DEAD)) {
            const isDead = particles.isDead.data;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                normalizedAliveTime[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAliveTime[particleHandle] > 1) {
                    normalizedAliveTime[particleHandle] = 1;
                    isDead[particleHandle] = 1;
                }
            }
        } else {
            for (let particleHandle = toIndex - 1; particleHandle >= fromIndex; particleHandle--) {
                normalizedAliveTime[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
                if (normalizedAliveTime[particleHandle] > 1) {
                    normalizedAliveTime[particleHandle] = 1;
                    particles.removeParticle(particleHandle);
                    context.setExecuteRange(fromIndex, context.toIndex - 1);
                }
            }
        }
    }
}
