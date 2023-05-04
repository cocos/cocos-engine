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

import { ccclass, type, serializable, visible } from 'cc.decorator';
import { lerp, Vec3 } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterState, ModuleExecContext } from '../base';
import { FloatExpression } from '../expressions/float';
import { RandomStream } from '../random-stream';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const tempVelocity = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.VELOCITY;
@ccclass('cc.InheritVelocityModule')
@VFXModule.register('InheritVelocity', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [BuiltinParticleParameterName.VELOCITY])
export class InheritVelocityModule extends VFXModule {
    @type(FloatExpression)
    @visible(true)
    @serializable
    public scale: FloatExpression = new ConstantFloatExpression(1);

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.scale.tick(particles, emitter, user, context);
        particles.markRequiredParameter(requiredParameters);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BuiltinParticleParameterFlags.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const initialVelocity = emitter.velocity;
        const velocity = context.executionStage === ModuleExecStage.SPAWN ? particles.getVec3Parameter(BASE_VELOCITY) : particles.getVec3Parameter(VELOCITY);
        if (!emitter.isWorldSpace) { return; }
        this.scale.bind(particles, emitter, user, context);
        if (this.scale.isConstant) {
            Vec3.multiplyScalar(tempVelocity, initialVelocity, this.scale.evaluate(0));
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                Vec3.multiplyScalar(tempVelocity, initialVelocity, this.scale.evaluate(i));
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
