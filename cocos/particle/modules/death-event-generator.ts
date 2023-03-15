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
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const PROBABILITY_RANDOM_SEED_OFFSET = 199208;
@ccclass('cc.DeathEventGeneratorModule')
@ParticleModule.register('DeathEventGenerator', ModuleExecStage.UPDATE, 0)
export class DeathEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public execute (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { randomSeed, invStartLifeTime, normalizedAliveTime } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (invStartLifeTime[i] * deltaTime + normalizedAliveTime[i] < 1.0) {
                    continue;
                }
                if (pseudoRandom(randomSeed[i] + PROBABILITY_RANDOM_SEED_OFFSET) > this.probability) {
                    continue;
                }
                const event = context.dispatchEvent();
                particles.getRotationAt(event.rotation, i);
                particles.getSizeAt(event.size, i);
                particles.getColorAt(event.color, i);
                particles.getPositionAt(event.position, i);
                particles.getFinalVelocityAt(event.velocity, i);
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(event.position, event.position, localToWorld);
                    Vec3.transformMat4(event.velocity, event.velocity, localToWorld);
                }
                event.prevTime = 0;
                event.currentTime = EPSILON;
                event.randomSeed = randomSeed[i];
                event.startLifeTime = 1 / invStartLifeTime[i];
                event.normalizedAliveTime = normalizedAliveTime[i];
            }
        }
    }
}
