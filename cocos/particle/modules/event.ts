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

@ccclass('cc.EventModule')
export class EventGeneratorModule extends ParticleModule {
    @type([EventData])
    @visible(true)
    @serializable
    public eventInfos: EventData[] = [];

    public get name (): string {
        return 'EventModule';
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
        const eventInfos = this.eventInfos;
        let lifeTimeSubEmitterIndex = 0;
        for (let j = 0, length = eventInfos.length; j < length; j++) {
            const eventInfo = eventInfos[j];
            const { emitter, probability } = eventInfo;
            if (eventInfo.condition === EventCondition.LIFETIME && emitter && emitter.isValid
                && !approx(probability, 0)) {
                if (lifeTimeSubEmitterIndex >= MAX_SUB_EMITTER_ACCUMULATOR) {
                    warn('Event module only supports 3 sub-emitter with lifetime mode at most!');
                    continue;
                }
                for (let i = fromIndex; i < toIndex; i++) {
                    if (pseudoRandom(randomSeed[i] + PROBABILITY_RANDOM_SEED_OFFSET) > probability) {
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

    public onEvent (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        const { particleEventSnapshots, particleEventSnapshotCount } = particles;
        const eventInfos = this.eventInfos;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        for (let j = 0, length = eventInfos.length; j < length; j++) {
            const eventInfo = eventInfos[j];
            const { emitter, probability } = eventInfo;
            if (eventInfo.condition === EventCondition.DEATH && emitter && emitter.isValid && !approx(probability, 0)) {
                for (let i = 0; i < particleEventSnapshotCount; i++) {
                    const snapshot = particleEventSnapshots[i];
                    if (snapshot.recordReason === RecordReason.DEATH
                        && pseudoRandom(snapshot.randomSeed + PROBABILITY_RANDOM_SEED_OFFSET) <= probability) {
                        position.set(snapshot.position);
                        velocity.set(snapshot.finalVelocity);
                        if (simulationSpace === Space.LOCAL) {
                            Vec3.transformMat4(position, position, localToWorld);
                            Vec3.transformMat4(velocity, velocity, localToWorld);
                        }
                        tempContext.velocity.set(velocity);
                        emitter.evaluateEmissionState(EPSILON, 0, tempContext);
                        if (tempContext.burstCount > 1) {
                            const spawnEvent = particleSystemManager.dispatchSpawnEvent();
                            spawnEvent.emitter = emitter;
                            spawnEvent.deltaTime = EPSILON;
                            spawnEvent.currentTime = EPSILON;
                            spawnEvent.prevTime = 0;
                            Vec3.normalize(dir, tempContext.velocity);
                            const angle = Math.abs(Vec3.dot(dir, Vec3.UNIT_Z));
                            Vec3.lerp(up, Vec3.UNIT_Z, Vec3.UNIT_Y, angle);
                            Quat.fromViewUp(rot, dir, up);
                            Mat4.fromRT(spawnEvent.context.emitterTransform, rot, position);
                            spawnEvent.context.velocity.set(tempContext.velocity);
                            spawnEvent.context.emittingAccumulatedCount = 0;
                            spawnEvent.context.emittingNumOverDistance = 0;
                            spawnEvent.context.emittingNumOverTime = 0;
                            spawnEvent.context.burstCount = tempContext.burstCount;
                        }
                    }
                }
            }
        }
    }

    public beginUpdate () {
        for (let i = 0; i < this.eventInfos.length; i++) {
            const eventInfo = this.eventInfos[i];
            if (eventInfo.emitter && eventInfo.emitter.isValid) {
                eventInfo.emitter.isSubEmitter = true;
            }
        }
    }
}
