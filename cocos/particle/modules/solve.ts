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

import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleVec3Parameter } from '../particle-parameter';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const tempVelocity = new Vec3();

@ccclass('SolveModule')
@ParticleModule.register('Solve', ModuleExecStage.UPDATE, [], ['State'])
export class SolveModule extends ParticleModule {
    constructor () {
        super();
        this.enabled = true;
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, deltaTime } = context;
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY) && particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const { position, velocity } = particles;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                velocity.getVec3At(tempVelocity, particleHandle);
                position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION) && particles.hasParameter(BuiltinParticleParameter.ANGULAR_VELOCITY)) {
            const { angularVelocity, rotation } = particles;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                angularVelocity.getVec3At(tempVelocity, particleHandle);
                rotation.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
            }
        }
    }
}
