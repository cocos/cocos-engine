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

import { ccclass, tooltip, type, serializable } from 'cc.decorator';
import { Vec3, Enum } from '../../core';
import { CoordinateSpace } from '../define';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../context-data-set';
import { BASE_VELOCITY, PHYSICS_FORCE, POSITION, ParticleDataSet, VELOCITY } from '../particle-data-set';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { UserDataSet } from '../user-data-set';
import { EmitterDataSet, IS_WORLD_SPACE, LOCAL_TO_WORLD_RS, WORLD_TO_LOCAL_RS } from '../emitter-data-set';
import { Vec3ArrayParameter, Uint32Parameter, BoolParameter, Mat3Parameter } from '../parameters';

const _temp_v3 = new Vec3();

@ccclass('cc.ForceModule')
@VFXModule.register('Force', ModuleExecStageFlags.UPDATE, [VELOCITY.name])
export class ForceModule extends VFXModule {
    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Enum(CoordinateSpace))
    @serializable
    @tooltip('i18n:forceOvertimeModule.space')
    public coordinateSpace = CoordinateSpace.LOCAL;

    /**
     * @zh X 轴方向上的加速度分量。
     */
    @type(Vec3Expression)
    public get force () {
        if (!this._force) {
            this._force = new ConstantVec3Expression();
        }
        return this._force;
    }

    public set force (val) {
        this._force = val;
    }

    @serializable
    private _force: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(BASE_VELOCITY);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(PHYSICS_FORCE);
        this.force.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const physicsForce = particles.getParameterUnsafe<Vec3ArrayParameter>(PHYSICS_FORCE);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace === CoordinateSpace.WORLD) !== emitter.getParameterUnsafe<BoolParameter>(IS_WORLD_SPACE).data;
        const exp = this._force as Vec3Expression;
        exp.bind(particles, emitter, user, context);
        if (needTransform) {
            const transform = emitter.getParameterUnsafe<Mat3Parameter>(this.coordinateSpace === CoordinateSpace.LOCAL ? LOCAL_TO_WORLD_RS : WORLD_TO_LOCAL_RS).data;
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
