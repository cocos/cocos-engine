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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatParameter, Uint32Parameter, Vec3ArrayParameter } from '../parameters';
import { P_POSITION, P_VELOCITY, C_FROM_INDEX, C_TO_INDEX, C_DELTA_TIME, P_PHYSICS_FORCE } from '../define';

@ccclass('cc.SolveForcesAndVelocityModule')
@VFXModule.register('SolveForcesAndVelocity', ModuleExecStageFlags.UPDATE, [P_POSITION.name], [P_VELOCITY.name])
export class SolveForceAndVelocityModule extends VFXModule {
    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const fromIndex = context.getUint32Parameter(C_FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(C_TO_INDEX).data;
        const deltaTime = context.getFloatParameter(C_DELTA_TIME).data;
        if (particles.hasParameter(P_PHYSICS_FORCE) && particles.hasParameter(P_VELOCITY)) {
            const physicsForce = particles.getVec3ArrayParameter(P_PHYSICS_FORCE);
            const velocity = particles.getVec3ArrayParameter(P_VELOCITY);
            Vec3ArrayParameter.scaleAndAdd(velocity, velocity, physicsForce, deltaTime, fromIndex, toIndex);
        }
        if (particles.hasParameter(P_VELOCITY) && particles.hasParameter(P_POSITION)) {
            const position = particles.getVec3ArrayParameter(P_POSITION);
            const velocity = particles.getVec3ArrayParameter(P_VELOCITY);
            Vec3ArrayParameter.scaleAndAdd(position, position, velocity, deltaTime, fromIndex, toIndex);
        }
    }
}
