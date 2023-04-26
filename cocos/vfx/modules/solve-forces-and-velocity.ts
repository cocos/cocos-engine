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
import { BuiltinParticleParameter, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { Vec3ArrayParameter } from '../vfx-parameter';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

@ccclass('cc.SolveForcesAndVelocityModule')
@VFXModule.register('SolveForcesAndVelocity', ModuleExecStageFlags.UPDATE, [ParameterName.POSITION, ParameterName.ROTATION], [ParameterName.VELOCITY, ParameterName.ANGULAR_VELOCITY])
export class SolveForceAndVelocityModule extends VFXModule {
    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex, deltaTime } = context;
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY) && particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const { position, velocity } = particles;
            Vec3ArrayParameter.scaleAndAdd(position, position, velocity, deltaTime, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION) && particles.hasParameter(BuiltinParticleParameter.ANGULAR_VELOCITY)) {
            const { angularVelocity, rotation } = particles;
            Vec3ArrayParameter.scaleAndAdd(rotation, rotation, angularVelocity, deltaTime, fromIndex, toIndex);
        }
    }
}
