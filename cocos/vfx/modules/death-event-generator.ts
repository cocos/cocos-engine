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
import { approx, CCFloat, Color, EPSILON, Vec3 } from '../../core';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleColorArrayParameter, ParticleVec3ArrayParameter } from '../particle-parameter';
import { ParticleEmitterParams, ParticleEmitterState, ParticleEventInfo, ParticleEventType, ParticleExecContext } from '../particle-base';
import { RandomStream } from '../random-stream';

const eventInfo = new ParticleEventInfo();
const requiredParameters =  BuiltinParticleParameterFlags.RANDOM_SEED
| BuiltinParticleParameterFlags.ID | BuiltinParticleParameterFlags.IS_DEAD;
@ccclass('cc.DeathEventGeneratorModule')
@ParticleModule.register('DeathEventGenerator', ModuleExecStage.UPDATE, [], [ParameterName.POSITION, ParameterName.SIZE, ParameterName.ROTATION, ParameterName.VELOCITY, ParameterName.NORMALIZED_ALIVE_TIME, ParameterName.COLOR])
export class DeathEventGeneratorModule extends ParticleModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomOffset = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(requiredParameters);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const randomSeed = particles.randomSeed.data;
        const id = particles.id.data;
        const isDead = particles.isDead.data;
        const { fromIndex, toIndex, events } = context;
        const { localToWorld } = context;
        const { simulationSpace } = params;
        const randomOffset = this._randomOffset;
        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        const hasRotation = particles.hasParameter(BuiltinParticleParameter.ROTATION);
        const hasSize = particles.hasParameter(BuiltinParticleParameter.SIZE);
        const hasColor = particles.hasParameter(BuiltinParticleParameter.COLOR);
        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        const probability = this.probability;
        let velocity: ParticleVec3ArrayParameter | null = null;
        let rotation: ParticleVec3ArrayParameter | null = null;
        let size: ParticleVec3ArrayParameter | null = null;
        let color: ParticleColorArrayParameter | null = null;
        let position: ParticleVec3ArrayParameter | null = null;
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
        if (!approx(probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (!isDead[i]) {
                    continue;
                }
                if (RandomStream.getFloat(randomSeed[i] + randomOffset) > probability) {
                    continue;
                }

                Vec3.zero(eventInfo.position);
                Vec3.zero(eventInfo.velocity);
                Vec3.copy(eventInfo.size, Vec3.ONE);
                Vec3.zero(eventInfo.rotation);
                Color.copy(eventInfo.color, Color.WHITE);
                if (hasPosition) {
                    (position as ParticleVec3ArrayParameter).getVec3At(eventInfo.position, i);
                }
                if (hasVelocity) {
                    (velocity as ParticleVec3ArrayParameter).getVec3At(eventInfo.velocity, i);
                }
                if (hasRotation) {
                    (rotation as ParticleVec3ArrayParameter).getVec3At(eventInfo.rotation, i);
                }
                if (hasSize) {
                    (size as ParticleVec3ArrayParameter).getVec3At(eventInfo.size, i);
                }
                if (hasColor) {
                    (color as ParticleColorArrayParameter).getColorAt(eventInfo.color, i);
                }
                if (simulationSpace === Space.LOCAL) {
                    Vec3.transformMat4(eventInfo.position, eventInfo.position, localToWorld);
                    Vec3.transformMat4(eventInfo.velocity, eventInfo.velocity, localToWorld);
                }
                eventInfo.particleId = id[i];
                eventInfo.prevTime = 0;
                eventInfo.currentTime = EPSILON;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.type = ParticleEventType.DEATH;
                events.dispatch(eventInfo);
            }
        }
    }
}
