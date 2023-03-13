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
import { ParticleModule, ModuleExecStage, moduleName, execStages, execOrder } from '../particle-module';
import { ParticleSOAData, RecordReason } from '../particle-soa-data';
import { ParticleEmitter } from '../particle-emitter';
import { particleSystemManager } from '../particle-system-manager';
import { ParticleEmitterContext, ParticleEmitterParams, ParticleUpdateContext } from '../particle-update-context';

const PROBABILITY_RANDOM_SEED_OFFSET = 199208;
const tempContext = new ParticleEmitterContext();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const position = new Vec3();
const velocity = new Vec3();

@ccclass('cc.LocationEventGeneratorModule')
@moduleName('LocationEventGenerator')
@execStages(ModuleExecStage.UPDATE)
@execOrder(0)
export class LocationEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public update (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const { randomSeed, invStartLifeTime, normalizedAliveTime } = particles;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (pseudoRandom(randomSeed[i] + PROBABILITY_RANDOM_SEED_OFFSET) > this.probability) {
                    continue;
                }
                particles.getPositionAt(position, i);
                particles.getFinalVelocityAt(velocity, i);
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(position, position, localToWorld);
                    Vec3.transformMat4(velocity, velocity, localToWorld);
                }
                const currentTime = normalizedAliveTime[i] / invStartLifeTime[i];
                const prevTime = currentTime - dt;
                const spawnEvent = particleSystemManager.dispatchSpawnEvent();
                spawnEvent.velocity.set(velocity);
                spawnEvent.deltaTime = dt;
                spawnEvent.prevTime = prevTime;
                Vec3.normalize(dir, tempContext.velocity);
                const angle = Math.abs(Vec3.dot(dir, Vec3.UNIT_Z));
                Vec3.lerp(up, Vec3.UNIT_Z, Vec3.UNIT_Y, angle);
                Quat.fromViewUp(rot, dir, up);
                Mat4.fromRT(spawnEvent.transform, rot, position);
            }
        }
    }
}
