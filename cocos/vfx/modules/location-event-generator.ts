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
import { VFXEventType } from '../define';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { COLOR, ID, INV_START_LIFETIME, NORMALIZED_AGE, ParticleDataSet, POSITION, RANDOM_SEED, VELOCITY } from '../particle-data-set';
import { ModuleExecContext, VFXEventInfo } from '../base';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ColorArrayParameter, Vec3ArrayParameter } from '../parameters';

const eventInfo = new VFXEventInfo();

@ccclass('cc.LocationEventGeneratorModule')
@VFXModule.register('LocationEventGenerator', ModuleExecStageFlags.UPDATE, [], [POSITION.name, VELOCITY.name, COLOR.name])
export class LocationEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(INV_START_LIFETIME);
        particles.markRequiredParameter(RANDOM_SEED);
        particles.markRequiredParameter(NORMALIZED_AGE);
        particles.markRequiredParameter(ID);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
        const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
        const invStartLifeTime = particles.getFloatParameter(INV_START_LIFETIME).data;
        const id = particles.getUint32Parameter(ID).data;
        const randomOffset = this.randomSeed;
        const { fromIndex, toIndex, deltaTime, events } = context;
        const { localToWorld } = emitter;
        const hasVelocity = particles.hasParameter(VELOCITY);
        const hasColor = particles.hasParameter(COLOR);
        const hasPosition = particles.hasParameter(POSITION);
        let velocity: Vec3ArrayParameter | null = null;
        let color: ColorArrayParameter | null = null;
        let position: Vec3ArrayParameter | null = null;
        if (hasVelocity) {
            velocity = particles.getVec3Parameter(VELOCITY);
        }
        if (hasColor) {
            color = particles.getColorParameter(COLOR);
        }
        if (hasPosition) {
            position = particles.getVec3Parameter(POSITION);
        }
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (RandomStream.getFloat(randomSeed[i] + randomOffset) > this.probability) {
                    continue;
                }
                Vec3.zero(eventInfo.position);
                Vec3.zero(eventInfo.velocity);
                Vec3.copy(eventInfo.scale, Vec3.ONE);
                Vec3.zero(eventInfo.rotation);
                Color.copy(eventInfo.color, Color.WHITE);
                if (hasPosition) {
                    (position as Vec3ArrayParameter).getVec3At(eventInfo.position, i);
                }
                if (hasVelocity) {
                    (velocity as Vec3ArrayParameter).getVec3At(eventInfo.velocity, i);
                }
                if (hasColor) {
                    (color as ColorArrayParameter).getColorAt(eventInfo.color, i);
                }
                if (!emitter.isWorldSpace) {
                    Vec3.transformMat4(eventInfo.position, eventInfo.position, localToWorld);
                    Vec3.transformMat4(eventInfo.velocity, eventInfo.velocity, localToWorld);
                }
                eventInfo.particleId = id[i];
                eventInfo.currentTime = 1 / invStartLifeTime[i] * normalizedAge[i];
                eventInfo.prevTime = eventInfo.currentTime - deltaTime;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.type = VFXEventType.LOCATION;
                events.dispatch(eventInfo);
            }
        }
    }
}
