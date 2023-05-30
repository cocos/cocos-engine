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
import { P_COLOR, P_ID, P_INV_LIFETIME, P_NORMALIZED_AGE, ParticleDataSet, P_POSITION, P_RANDOM_SEED, P_VELOCITY, C_DELTA_TIME, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD, UserDataSet } from '../data-set';
import { RandomStream } from '../random-stream';
import { BoolParameter, ColorArrayParameter, FloatArrayParameter, FloatParameter, Mat4Parameter, Uint32ArrayParameter, Uint32Parameter, Vec3ArrayParameter } from '../parameters';
import { VFXEventInfo } from '../vfx-events';

const eventInfo = new VFXEventInfo();

@ccclass('cc.LocationEventGeneratorModule')
@VFXModule.register('LocationEventGenerator', ModuleExecStageFlags.UPDATE, [], [P_POSITION.name, P_VELOCITY.name, P_COLOR.name])
export class LocationEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_INV_LIFETIME);
        particles.markRequiredParameter(P_RANDOM_SEED);
        particles.markRequiredParameter(P_NORMALIZED_AGE);
        particles.markRequiredParameter(P_ID);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const normalizedAge = particles.getParameterUnsafe<FloatArrayParameter>(P_NORMALIZED_AGE).data;
        const randomSeed = particles.getParameterUnsafe<Uint32ArrayParameter>(P_RANDOM_SEED).data;
        const invLifeTime = particles.getParameterUnsafe<FloatArrayParameter>(P_INV_LIFETIME).data;
        const id = particles.getParameterUnsafe<Uint32ArrayParameter>(P_ID).data;
        const randomOffset = this.randomSeed;
        const { events } = context;
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const deltaTime = context.getParameterUnsafe<FloatParameter>(C_DELTA_TIME).data;
        const localToWorld = emitter.getParameterUnsafe<Mat4Parameter>(E_LOCAL_TO_WORLD).data;
        const isWorldSpace = emitter.getParameterUnsafe<BoolParameter>(E_IS_WORLD_SPACE).data;
        const hasVelocity = particles.hasParameter(P_VELOCITY);
        const hasColor = particles.hasParameter(P_COLOR);
        const hasPosition = particles.hasParameter(P_POSITION);
        const velocity = hasVelocity ? particles.getParameterUnsafe<Vec3ArrayParameter>(P_VELOCITY) : null;
        const color = hasColor ? particles.getParameterUnsafe<ColorArrayParameter>(P_COLOR) : null;
        const position = hasPosition ? particles.getParameterUnsafe<Vec3ArrayParameter>(P_POSITION) : null;
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
                eventInfo.currentTime = 1 / invLifeTime[i] * normalizedAge[i];
                eventInfo.prevTime = eventInfo.currentTime - deltaTime;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.type = VFXEventType.LOCATION;
                events.dispatch(eventInfo);
            }
        }
    }
}
