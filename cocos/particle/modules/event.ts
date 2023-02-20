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

import { approx, BitMask, CCFloat, Enum, EPSILON, pseudoRandom, Vec3 } from '../../core';
import { ccclass, range, serializable, type, visible } from '../../core/data/decorators';
import { Space } from '../enum';
import { ParticleModule, ParticleUpdateStage, UpdateModule } from '../particle-module';
import { ParticleSOAData, RecordReason } from '../particle-soa-data';
import { ParticleSystem } from '../particle-system';
import { particleSystemManager } from '../particle-system-manager';
import { ParticleSystemParams, ParticleUpdateContext, SpawnEvent } from '../particle-update-context';

const emitProbabilityRandomSeedOffset = 199208;

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

const temp = new Vec3();
const temp1 = new Vec3();

@ccclass('cc.EventModule')
export class EventModule extends UpdateModule {
    @type([EventData])
    @visible(true)
    @serializable
    public eventInfos: EventData[] = [];

    public get name (): string {
        return 'EventModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.POST_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const { randomSeed, invStartLifeTime, normalizedAliveTime } = particles;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        const eventInfos = this.eventInfos;
        for (let i = fromIndex; i < toIndex; i++) {
            particles.getPositionAt(temp, i);
            particles.getFinalVelocity(temp1, i);
            if (simulationSpace === Space.LOCAL) {
                Vec3.transformMat4(temp, temp, localToWorld);
                Vec3.transformMat4(temp1, temp1, localToWorld);
            }
            for (let j = 0, length = eventInfos.length; j < length; j++) {
                const eventInfo = eventInfos[j];
                if (eventInfo.condition === EventCondition.LIFETIME && eventInfo.emitter && eventInfo.emitter.isValid
                    && !approx(eventInfo.probability, 0)
                    && pseudoRandom(randomSeed[i] + emitProbabilityRandomSeedOffset) <= eventInfo.probability) {
                    const spawnEvent = particleSystemManager.dispatchSpawnEvent();
                    spawnEvent.emitter = eventInfo.emitter;
                    spawnEvent.deltaTime = dt;
                    spawnEvent.t = normalizedAliveTime[i] / invStartLifeTime[i];
                    spawnEvent.context.emissionState.emittingOverDistanceAccumulatedCount = 0;
                    spawnEvent.context.emissionState.emittingOverTimeAccumulatedCount = 0;
                    spawnEvent.context.emissionState.burstCount = 0;
                    spawnEvent.prevT = spawnEvent.t - dt;
                    spawnEvent.context.localToWorld.set(localToWorld);
                    spawnEvent.context.emitterVelocity.set(temp1);
                    spawnEvent.context.currentPosition.set(temp);
                    spawnEvent.context.lastPosition.set(Vec3.subtract(temp, temp, temp1.multiplyScalar(dt)));
                }
            }
        }
    }

    public onEvent (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        const { particleEventSnapshots, particleEventSnapshotCount } = particles;
        const eventInfos = this.eventInfos;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        for (let i = 0; i < particleEventSnapshotCount; i++) {
            const snapshot = particleEventSnapshots[i];
            if (simulationSpace === Space.LOCAL) {
                Vec3.transformMat4(temp, snapshot.position, localToWorld);
                Vec3.transformMat4(temp1, snapshot.velocity, localToWorld);
            }
            for (let j = 0, length = eventInfos.length; j < length; j++) {
                const eventInfo = eventInfos[j];
                if (eventInfo.condition === EventCondition.DEATH && snapshot.recordReason === RecordReason.DEATH
                    && eventInfo.emitter && eventInfo.emitter.isValid
                    && !approx(eventInfo.probability, 0)
                    && pseudoRandom(snapshot.randomSeed + emitProbabilityRandomSeedOffset) <= eventInfo.probability) {
                    const spawnEvent = particleSystemManager.dispatchSpawnEvent();
                    spawnEvent.emitter = eventInfo.emitter;
                    spawnEvent.deltaTime = EPSILON;
                    spawnEvent.t = EPSILON;
                    spawnEvent.prevT = 0;
                    spawnEvent.context.emissionState.emittingOverDistanceAccumulatedCount = 0;
                    spawnEvent.context.emissionState.emittingOverTimeAccumulatedCount = 0;
                    spawnEvent.context.localToWorld.set(localToWorld);
                    spawnEvent.context.emitterVelocity.set(temp1);
                    spawnEvent.context.currentPosition.set(temp);
                    spawnEvent.context.lastPosition.set(temp);
                }
            }
        }
    }
}
