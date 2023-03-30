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

import { approx, BitMask, CCFloat, Color, Enum, EPSILON, Mat4, Quat, Vec3, warn } from '../../core';
import { ccclass, range, serializable, type, visible } from '../../core/data/decorators';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleColorParameter, ParticleVec3Parameter } from '../particle-parameter';
import { ParticleExecContext, ParticleEmitterParams, ParticleEventInfo } from '../particle-base';
import { RandNumGen } from '../rand-num-gen';

const PROBABILITY_RANDOM_SEED_OFFSET = 199208;
const eventInfo = new ParticleEventInfo();

@ccclass('cc.LocationEventGeneratorModule')
@ParticleModule.register('LocationEventGenerator', ModuleExecStage.UPDATE, [], [ParameterName.POSITION, ParameterName.VELOCITY, ParameterName.COLOR])
export class LocationEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.INV_START_LIFETIME);
        context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        context.markRequiredParameter(BuiltinParticleParameter.ID);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const randomSeed = particles.randomSeed.data;
        const invStartLifeTime = particles.invStartLifeTime.data;
        const id = particles.id.data;
        const { fromIndex, toIndex, deltaTime, locationEvents } = context;
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
                if (RandNumGen.getFloat(randomSeed[i] + PROBABILITY_RANDOM_SEED_OFFSET) > this.probability) {
                    continue;
                }
                Vec3.zero(eventInfo.position);
                Vec3.zero(eventInfo.velocity);
                Vec3.copy(eventInfo.size, Vec3.ONE);
                Vec3.zero(eventInfo.rotation);
                Color.copy(eventInfo.color, Color.WHITE);
                if (hasPosition) {
                    (<ParticleVec3Parameter>position).getVec3At(eventInfo.position, i);
                }
                if (hasVelocity) {
                    (<ParticleVec3Parameter>velocity).getVec3At(eventInfo.velocity, i);
                }
                if (hasRotation) {
                    (<ParticleVec3Parameter>rotation).getVec3At(eventInfo.rotation, i);
                }
                if (hasSize) {
                    (<ParticleVec3Parameter>size).getVec3At(eventInfo.size, i);
                }
                if (hasColor) {
                    (<ParticleColorParameter>color).getColorAt(eventInfo.color, i);
                }
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(eventInfo.position, eventInfo.position, localToWorld);
                    Vec3.transformMat4(eventInfo.velocity, eventInfo.velocity, localToWorld);
                }
                eventInfo.particleId = id[i];
                eventInfo.startLifeTime = 1 / invStartLifeTime[i];
                eventInfo.normalizedAliveTime = normalizedAliveTime[i];
                eventInfo.currentTime = eventInfo.startLifeTime * eventInfo.normalizedAliveTime;
                eventInfo.prevTime = eventInfo.currentTime - deltaTime;
                eventInfo.randomSeed = randomSeed[i];
                locationEvents.dispatch(eventInfo);
            }
        }
    }
}
