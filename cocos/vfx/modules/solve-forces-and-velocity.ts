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

import { ccclass } from 'cc.decorator';
import { VFXModule, VFXExecutionStageFlags } from '../vfx-module';
import { VFXVec3Array } from '../data';
import { P_POSITION, P_VELOCITY, C_FROM_INDEX, C_TO_INDEX, C_DELTA_TIME, P_PHYSICS_FORCE } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

@ccclass('cc.SolveForcesAndVelocityModule')
@VFXModule.register('SolveForcesAndVelocity', VFXExecutionStageFlags.UPDATE, [P_POSITION.name], [P_VELOCITY.name])
export class SolveForceAndVelocityModule extends VFXModule {
    public execute (parameterMap: VFXParameterMap) {
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        if (parameterMap.has(P_PHYSICS_FORCE) && parameterMap.has(P_VELOCITY)) {
            const physicsForce = parameterMap.getVec3ArrayValue(P_PHYSICS_FORCE);
            const velocity = parameterMap.getVec3ArrayValue(P_VELOCITY);
            VFXVec3Array.scaleAndAdd(velocity, velocity, physicsForce, deltaTime, fromIndex, toIndex);
        }
        if (parameterMap.has(P_VELOCITY) && parameterMap.has(P_POSITION)) {
            const position = parameterMap.getVec3ArrayValue(P_POSITION);
            const velocity = parameterMap.getVec3ArrayValue(P_VELOCITY);
            VFXVec3Array.scaleAndAdd(position, position, velocity, deltaTime, fromIndex, toIndex);
        }
    }
}
