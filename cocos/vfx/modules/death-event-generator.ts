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
import { C_EVENTS, C_EVENT_COUNT, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD, E_RANDOM_SEED, P_COLOR, P_ID, P_IS_DEAD, P_NORMALIZED_AGE, P_POSITION, P_VELOCITY, VFXEventType } from '../define';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { VFXEventInfo } from '../data/event';
import { VFXParameterMap } from '../vfx-parameter-map';
import { randFloat } from '../rand';
import { VFXParameterRegistry } from '../vfx-parameter';

const eventInfo = new VFXEventInfo();
@ccclass('cc.DeathEventGeneratorModule')
@VFXModule.register('DeathEventGenerator', VFXExecutionStageFlags.UPDATE, [], [P_POSITION.name, P_VELOCITY.name, P_NORMALIZED_AGE.name, P_COLOR.name])
export class DeathEventGeneratorModule extends VFXModule {
    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;

    @serializable
    private _randomOffset = Math.floor(Math.random() * 0xffffffff);

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        const compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(C_EVENTS);
        parameterMap.ensure(C_EVENT_COUNT);
        parameterMap.ensure(P_ID);
        parameterMap.ensure(P_IS_DEAD);
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const id = parameterMap.getUint32ArrayValue(P_ID);
        const isDead = parameterMap.getBoolArrayValue(P_IS_DEAD);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const localToWorld = parameterMap.getMat4Value(E_LOCAL_TO_WORLD).data;
        const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const events = parameterMap.getEventArrayValue(C_EVENTS);
        const eventCount = parameterMap.getUint32Value(C_EVENT_COUNT);
        const randomSeed = parameterMap.getUint32Value(E_RANDOM_SEED).data;
        const randomOffset = this._randomOffset;
        const hasVelocity = parameterMap.has(P_VELOCITY);
        const hasColor = parameterMap.has(P_COLOR);
        const hasPosition = parameterMap.has(P_POSITION);
        const probability = this.probability;
        const velocity = hasVelocity ? parameterMap.getVec3ArrayValue(P_VELOCITY) : null;
        const color = hasColor ? parameterMap.getColorArrayValue(P_COLOR) : null;
        const position = hasPosition ? parameterMap.getVec3ArrayValue(P_POSITION) : null;

        if (!approx(probability, 0)) {
            for (let i = fromIndex; i < toIndex; i++) {
                if (!isDead.getBoolAt(i)) {
                    continue;
                }
                if (randFloat(randomSeed, id.getUint32At(i), randomOffset) > probability) {
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
                eventInfo.particleId = id.getUint32At(i);
                eventInfo.prevTime = 0;
                eventInfo.currentTime = EPSILON;
                eventInfo.type = VFXEventType.DEATH;
                if (eventCount.data >= events.size) {
                    events.reserve(events.size * 2);
                }
                events.setEventAt(eventInfo, eventCount.data);
                eventCount.data++;
            }
        }
    }
}
