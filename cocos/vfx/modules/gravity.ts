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

import { ccclass, displayOrder, serializable, tooltip, type } from 'cc.decorator';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { BASE_VELOCITY, PHYSICS_FORCE, POSITION, ParticleDataSet, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { Vec3 } from '../../core';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const gravity = new Vec3();
@ccclass('cc.GravityModule')
@VFXModule.register('Gravity', ModuleExecStageFlags.UPDATE, [PHYSICS_FORCE.name])
export class GravityModule extends VFXModule {
    @type(Vec3Expression)
    public get gravity () {
        if (!this._gravity) {
            this._gravity = new ConstantVec3Expression();
        }
        return this._gravity;
    }

    public set gravity (val) {
        this._gravity = val;
    }

    @serializable
    private _gravity: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(BASE_VELOCITY);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(PHYSICS_FORCE);
        this.gravity.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const physicsForce = particles.getVec3Parameter(PHYSICS_FORCE);
        const { fromIndex, toIndex } = context;
        const needTransform = !emitter.isWorldSpace;
        const exp = this._gravity as Vec3Expression;
        exp.bind(particles, emitter, user, context);
        if (needTransform) {
            const transform = emitter.worldToLocalRS;
            if (exp.isConstant) {
                const force = Vec3.transformMat3(gravity, exp.evaluate(0, gravity), transform);
                for (let i = fromIndex; i < toIndex; i++) {
                    physicsForce.addVec3At(force, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const force = Vec3.transformMat3(gravity, exp.evaluate(i, gravity), transform);
                    physicsForce.addVec3At(force, i);
                }
            }
        } else if (exp.isConstant) {
            const force = exp.evaluate(0, gravity);
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(force, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(exp.evaluate(i, gravity), i);
            }
        }
    }
}
