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

import { ccclass, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { lerp, Vec3, Enum } from '../../core';
import { Space } from '../define';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ModuleExecContext } from '../base';
import { BASE_VELOCITY, NORMALIZED_AGE, PHYSICS_FORCE, POSITION, ParticleDataSet, RANDOM_SEED, VELOCITY } from '../particle-data-set';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { UserDataSet } from '../user-data-set';
import { EmitterDataSet } from '../emitter-data-set';

const _temp_v3 = new Vec3();

@ccclass('cc.ForceModule')
@VFXModule.register('Force', ModuleExecStageFlags.UPDATE, [VELOCITY.name])
export class ForceModule extends VFXModule {
    /**
     * @zh X 轴方向上的加速度分量。
     */
    @type(Vec3Expression)
    @serializable
    @displayOrder(2)
    @tooltip('i18n:forceOvertimeModule.x')
    public force: Vec3Expression = new ConstantVec3Expression();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Enum(Space))
    @serializable
    @displayOrder(1)
    @tooltip('i18n:forceOvertimeModule.space')
    public space = Space.LOCAL;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(BASE_VELOCITY);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(PHYSICS_FORCE);
        this.force.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const physicsForce = particles.getVec3Parameter(PHYSICS_FORCE);
        const { fromIndex, toIndex } = context;
        const needTransform = (this.space === Space.WORLD) !== emitter.isWorldSpace;
        const exp = this.force;
        exp.bind(particles, emitter, user, context);
        if (needTransform) {
            const transform = this.space === Space.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
            if (exp.isConstant) {
                const force = Vec3.transformMat3(_temp_v3, exp.evaluate(0, _temp_v3), transform);
                for (let i = fromIndex; i < toIndex; i++) {
                    physicsForce.addVec3At(force, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const force = Vec3.transformMat3(_temp_v3, exp.evaluate(i, _temp_v3), transform);
                    physicsForce.addVec3At(force, i);
                }
            }
        } else if (exp.isConstant) {
            const force = exp.evaluate(0, _temp_v3);
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(force, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(exp.evaluate(i, _temp_v3), i);
            }
        }
    }
}
