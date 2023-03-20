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

import { approx, BitMask, CCFloat, Enum, EPSILON, Mat4, pseudoRandom, Quat, Vec3, warn } from '../../core';
import { ccclass, range, serializable, type, visible } from '../../core/data/decorators';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleData, ParticleVec3Parameter } from '../particle-data';
import { ParticleExecContext, ParticleEmitterParams, ParticleEventInfo } from '../particle-base';

const PROBABILITY_RANDOM_SEED_OFFSET = 199208;
const eventInfo = new ParticleEventInfo();

@ccclass('cc.LocationEventGeneratorModule')
@ParticleModule.register('LocationEventGenerator', ModuleExecStage.UPDATE, 23)
export class LocationEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { randomSeed, invStartLifeTime, normalizedAliveTime, id, velocity, animatedVelocity, position, rotation, size } = particles;
        const { fromIndex, toIndex, deltaTime, locationEvents } = context;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (pseudoRandom(randomSeed[i] + PROBABILITY_RANDOM_SEED_OFFSET) > this.probability) {
                    continue;
                }
                position.getVec3At(eventInfo.position, i);
                ParticleVec3Parameter.add(eventInfo.velocity, velocity, animatedVelocity, i);
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(eventInfo.position, eventInfo.position, localToWorld);
                    Vec3.transformMat4(eventInfo.velocity, eventInfo.velocity, localToWorld);
                }
                rotation.getVec3At(eventInfo.rotation, i);
                size.getVec3At(eventInfo.size, i);
                particles.getColorAt(eventInfo.color, i);
                const currentTime = normalizedAliveTime[i] / invStartLifeTime[i];
                eventInfo.particleId = id[i];
                eventInfo.currentTime = currentTime;
                eventInfo.prevTime = currentTime - deltaTime;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.startLifeTime = 1 / invStartLifeTime[i];
                eventInfo.normalizedAliveTime = normalizedAliveTime[i];
                locationEvents.dispatch(eventInfo);
            }
        }
    }
}
