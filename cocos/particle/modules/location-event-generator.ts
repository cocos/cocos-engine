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
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { MAX_SUB_EMITTER_ACCUMULATOR, ParticleSOAData, RecordReason } from '../particle-soa-data';
import { ParticleSystem } from '../particle-system';
import { particleSystemManager } from '../particle-system-manager';
import { ParticleEmitterContext, ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';

const PROBABILITY_RANDOM_SEED_OFFSET = 199208;
const tempContext = new ParticleEmitterContext();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const position = new Vec3();
const velocity = new Vec3();

export enum EventCondition {
    LIFETIME,
    DEATH,
}

export enum InheritedProperty {
    COLOR = 1,
    SIZE = 1 << 1,
    ROTATION = 1 << 2,
    LIFETIME = 1 << 3,
    DURATION = 1 << 4
}

@ccclass('cc.EventData')
export class EventData {
    @type(Enum(EventCondition))
    @visible(true)
    @serializable
    public condition = EventCondition.LIFETIME;

    @type(ParticleSystem)
    @visible(true)
    @serializable
    public emitter: ParticleSystem | null = null;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;
}

@ccclass('cc.LocationEventGeneratorModule')
export class LocationEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public get name (): string {
        return 'LocationEventGenerator';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const { randomSeed, invStartLifeTime, normalizedAliveTime, subEmitterAccumulators } = particles;
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
                let accumulator = subEmitterAccumulators[i * MAX_SUB_EMITTER_ACCUMULATOR + lifeTimeSubEmitterIndex];
                const currentTime = normalizedAliveTime[i] / invStartLifeTime[i];
                const prevTime = currentTime - dt;
                tempContext.velocity.set(velocity);
                emitter.evaluateEmissionState(currentTime, prevTime, tempContext);
                const { emittingNumOverTime, emittingNumOverDistance, burstCount } = tempContext;
                if ((accumulator + emittingNumOverTime + emittingNumOverDistance) >= 1 || burstCount >= 1) {
                    const spawnEvent = particleSystemManager.dispatchSpawnEvent();
                    spawnEvent.emitter = emitter;
                    spawnEvent.deltaTime = dt;
                    spawnEvent.prevTime = prevTime;
                    Vec3.normalize(dir, tempContext.velocity);
                    const angle = Math.abs(Vec3.dot(dir, Vec3.UNIT_Z));
                    Vec3.lerp(up, Vec3.UNIT_Z, Vec3.UNIT_Y, angle);
                    Quat.fromViewUp(rot, dir, up);
                    Mat4.fromRT(spawnEvent.context.emitterTransform, rot, position);
                    spawnEvent.context.emittingAccumulatedCount = accumulator;
                    spawnEvent.context.velocity.set(tempContext.velocity);
                    spawnEvent.context.emittingNumOverTime = emittingNumOverTime;
                    spawnEvent.context.emittingNumOverDistance = emittingNumOverDistance;
                    spawnEvent.context.burstCount = burstCount;
                }

                accumulator += emittingNumOverTime + emittingNumOverDistance;
                accumulator -= Math.floor(accumulator);
                subEmitterAccumulators[i * MAX_SUB_EMITTER_ACCUMULATOR + lifeTimeSubEmitterIndex] = accumulator;
            }
            lifeTimeSubEmitterIndex++;
        }
    }
}
