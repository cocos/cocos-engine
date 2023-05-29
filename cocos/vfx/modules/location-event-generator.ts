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
import { COLOR, ID, INV_START_LIFETIME, NORMALIZED_AGE, ParticleDataSet, POSITION, RANDOM_SEED, VELOCITY, DELTA_TIME, FROM_INDEX, ContextDataSet, TO_INDEX, EmitterDataSet, IS_WORLD_SPACE, LOCAL_TO_WORLD, UserDataSet } from '../data-set';
import { RandomStream } from '../random-stream';
import { BoolParameter, ColorArrayParameter, FloatArrayParameter, FloatParameter, Mat4Parameter, Uint32ArrayParameter, Uint32Parameter, Vec3ArrayParameter } from '../parameters';
import { VFXEventInfo } from '../vfx-events';

const eventInfo = new VFXEventInfo();

@ccclass('cc.LocationEventGeneratorModule')
@VFXModule.register('LocationEventGenerator', ModuleExecStageFlags.UPDATE, [], [POSITION.name, VELOCITY.name, COLOR.name])
export class LocationEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(INV_START_LIFETIME);
        particles.markRequiredParameter(RANDOM_SEED);
        particles.markRequiredParameter(NORMALIZED_AGE);
        particles.markRequiredParameter(ID);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const normalizedAge = particles.getParameterUnsafe<FloatArrayParameter>(NORMALIZED_AGE).data;
        const randomSeed = particles.getParameterUnsafe<Uint32ArrayParameter>(RANDOM_SEED).data;
        const invStartLifeTime = particles.getParameterUnsafe<FloatArrayParameter>(INV_START_LIFETIME).data;
        const id = particles.getParameterUnsafe<Uint32ArrayParameter>(ID).data;
        const randomOffset = this.randomSeed;
        const { events } = context;
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const deltaTime = context.getParameterUnsafe<FloatParameter>(DELTA_TIME).data;
        const localToWorld = emitter.getParameterUnsafe<Mat4Parameter>(LOCAL_TO_WORLD).data;
        const isWorldSpace = emitter.getParameterUnsafe<BoolParameter>(IS_WORLD_SPACE).data;
        const hasVelocity = particles.hasParameter(VELOCITY);
        const hasColor = particles.hasParameter(COLOR);
        const hasPosition = particles.hasParameter(POSITION);
        const velocity = hasVelocity ? particles.getParameterUnsafe<Vec3ArrayParameter>(VELOCITY) : null;
        const color = hasColor ? particles.getParameterUnsafe<ColorArrayParameter>(COLOR) : null;
        const position = hasPosition ? particles.getParameterUnsafe<Vec3ArrayParameter>(POSITION) : null;
        if (!approx(this.probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (RandomStream.getFloat(randomSeed[i] + randomOffset) > this.probability) {
                    continue;
                }
                Vec3.zero(eventInfo.position);
                Vec3.zero(eventInfo.velocity);
                Color.copy(eventInfo.color, Color.WHITE);
                if (hasPosition) {
                    position!.getVec3At(eventInfo.position, i);
                }
                if (hasVelocity) {
                    velocity!.getVec3At(eventInfo.velocity, i);
                }
                if (hasColor) {
                    color!.getColorAt(eventInfo.color, i);
                }
                if (!isWorldSpace) {
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
