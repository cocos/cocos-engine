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
import { VFXEventType } from '../define';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { COLOR, ID, IS_DEAD, NORMALIZED_AGE, ParticleDataSet, POSITION, RANDOM_SEED, VELOCITY, FROM_INDEX, ContextDataSet, TO_INDEX, EmitterDataSet, IS_WORLD_SPACE, LOCAL_TO_WORLD, UserDataSet } from '../data-set';
import { RandomStream } from '../random-stream';
import { Vec3ArrayParameter, ColorArrayParameter, Uint32Parameter, Mat4Parameter, Uint32ArrayParameter, BoolArrayParameter, BoolParameter } from '../parameters';
import { VFXEventInfo } from '../vfx-events';

const eventInfo = new VFXEventInfo();
@ccclass('cc.DeathEventGeneratorModule')
@VFXModule.register('DeathEventGenerator', ModuleExecStageFlags.UPDATE, [], [POSITION.name, VELOCITY.name, NORMALIZED_AGE.name, COLOR.name])
export class DeathEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(RANDOM_SEED);
        particles.markRequiredParameter(ID);
        particles.markRequiredParameter(IS_DEAD);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const randomSeed = particles.getParameterUnsafe<Uint32ArrayParameter>(RANDOM_SEED).data;
        const id = particles.getParameterUnsafe<Uint32ArrayParameter>(ID).data;
        const isDead = particles.getParameterUnsafe<BoolArrayParameter>(IS_DEAD).data;
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const localToWorld = emitter.getParameterUnsafe<Mat4Parameter>(LOCAL_TO_WORLD).data;
        const isWorldSpace = emitter.getParameterUnsafe<BoolParameter>(IS_WORLD_SPACE).data;
        const { events } = context;
        const randomOffset = this.randomSeed;
        const hasVelocity = particles.hasParameter(VELOCITY);
        const hasColor = particles.hasParameter(COLOR);
        const hasPosition = particles.hasParameter(POSITION);
        const probability = this.probability;
        const velocity = hasVelocity ? particles.getParameterUnsafe<Vec3ArrayParameter>(VELOCITY) : null;
        const color = hasColor ? particles.getParameterUnsafe<ColorArrayParameter>(COLOR) : null;
        const position = hasPosition ? particles.getParameterUnsafe<Vec3ArrayParameter>(POSITION) : null;

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
                eventInfo.prevTime = 0;
                eventInfo.currentTime = EPSILON;
                eventInfo.randomSeed = randomSeed[i];
                eventInfo.type = VFXEventType.DEATH;
                events.dispatch(eventInfo);
            }
        }
    }
}
