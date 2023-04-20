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

import { ccclass, tooltip, range, type, serializable } from 'cc.decorator';
import { Enum, Mat3, Vec3 } from '../../core';
import { Space } from '../enum';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';

const tempVelocity = new Vec3();
const seed = new Vec3();
const requiredParameter = BuiltinParticleParameterFlags.VELOCITY | BuiltinParticleParameterFlags.POSITION;
const transform = new Mat3();

@ccclass('cc.AddVelocityModule')
@VFXModule.register('AddVelocity', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [BuiltinParticleParameterName.VELOCITY])
export class AddVelocityModule extends VFXModule {
    @type(Enum(Space))
    @serializable
    @tooltip('i18n:velocityOvertimeModule.space')
    public space = Space.LOCAL;

    @type(Vec3Expression)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:velocityOvertimeModule.x')
    public velocity: Vec3Expression = new ConstantVec3Expression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.velocity.tick(particles, emitter, user, context);
        particles.markRequiredParameters(requiredParameter);
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const needTransform = (this.space !== Space.WORLD) !== emitter.isWorldSpace;
        const dest = context.executionStage === ModuleExecStage.UPDATE ? particles.velocity : particles.baseVelocity;
        const { fromIndex, toIndex } = context;
        const velocity = this.velocity;

        if (needTransform) {
            if (this.space === Space.LOCAL) {
                Mat3.fromMat4(transform, emitter.localToWorld);
            } else {
                Mat3.fromMat4(transform, emitter.worldToLocal);
            }
        }
        if (velocity.isConstant) {
            velocity.evaluate(0, tempVelocity);
            if (needTransform) {
                Vec3.transformMat3(tempVelocity, tempVelocity, transform);
            }
            for (let i = fromIndex; i < toIndex; i++) {
                dest.addVec3At(tempVelocity, i);
            }
        } else if (needTransform) {
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.evaluate(i, tempVelocity);
                Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                dest.addVec3At(tempVelocity, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.evaluate(i, tempVelocity);
                dest.addVec3At(tempVelocity, i);
            }
        }
    }
}
