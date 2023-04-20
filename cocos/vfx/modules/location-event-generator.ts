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

import { ccclass, range, serializable, type } from 'cc.decorator';
import { approx, CCFloat, Color, Vec3 } from '../../core';
import { ParticleEventType, Space } from '../enum';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleColorParameter, ParticleVec3Parameter } from '../particle-parameter';
import { ModuleExecContext, VFXEmitterParams, VFXEventInfo, VFXEmitterState } from '../base';
import { RandomStream } from '../random-stream';

const eventInfo = new VFXEventInfo();
const requiredParameters = BuiltinParticleParameterFlags.INV_START_LIFETIME | BuiltinParticleParameterFlags.RANDOM_SEED
| BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME | BuiltinParticleParameterFlags.ID;

@ccclass('cc.LocationEventGeneratorModule')
@VFXModule.register('LocationEventGenerator', ModuleExecStageFlags.UPDATE, [], [ParameterName.POSITION, ParameterName.VELOCITY, ParameterName.COLOR])
export class LocationEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    private _randomOffset = 0;

    public onPlay (params: VFXEmitterParams, state: VFXEmitterState) {
        this._randomOffset = state.randomStream.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        particles.markRequiredParameters(requiredParameters);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const randomSeed = particles.randomSeed.data;
        const invStartLifeTime = particles.invStartLifeTime.data;
        const id = particles.id.data;
        const randomOffset = this._randomOffset;
        const { fromIndex, toIndex, deltaTime, events } = context;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        const hasRotation = particles.hasParameter(BuiltinParticleParameter.ROTATION);
        const hasSize = particles.hasParameter(BuiltinParticleParameter.SIZE);
        const hasColor = particles.hasParameter(BuiltinParticleParameter.COLOR);
        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        let velocity: ParticleVec3Parameter | null = null;
        let rotation: ParticleVec3Parameter | null = null;
        let size: ParticleVec3Parameter | null = null;
        let color: ParticleColorParameter | null = null;
        let position: ParticleVec3Parameter | null = null;
        if (hasVelocity) {
            velocity = particles.velocity;
        }
        if (hasRotation) {
            rotation = particles.rotation;
        }
        if (hasSize) {
            size = particles.size;
        }
        if (hasColor) {
            color = particles.color;
        }
        if (hasPosition) {
            position = particles.position;
        }
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (RandomStream.getFloat(randomSeed[i] + randomOffset) > this.probability) {
                    continue;
                }
                Vec3.zero(eventInfo.position);
                Vec3.zero(eventInfo.velocity);
                Vec3.copy(eventInfo.size, Vec3.ONE);
                Vec3.zero(eventInfo.rotation);
                Color.copy(eventInfo.color, Color.WHITE);
                if (hasPosition) {
                    (position as ParticleVec3Parameter).getVec3At(eventInfo.position, i);
                }
                if (hasVelocity) {
                    (velocity as ParticleVec3Parameter).getVec3At(eventInfo.velocity, i);
                }
                if (hasRotation) {
                    (rotation as ParticleVec3Parameter).getVec3At(eventInfo.rotation, i);
                }
                if (hasSize) {
                    (size as ParticleVec3Parameter).getVec3At(eventInfo.size, i);
                }
                if (hasColor) {
                    (color as ParticleColorParameter).getColorAt(eventInfo.color, i);
                }
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(eventInfo.position, eventInfo.position, localToWorld);
                    Vec3.transformMat4(eventInfo.velocity, eventInfo.velocity, localToWorld);
                }
                eventInfo.particleId = id[i];
                eventInfo.currentTime = 1 / invStartLifeTime[i] * normalizedAliveTime[i];
                eventInfo.prevTime = eventInfo.currentTime - deltaTime;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.type = ParticleEventType.LOCATION;
                events.dispatch(eventInfo);
            }
        }
    }
}
