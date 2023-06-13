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

import { ccclass, serializable, type } from 'cc.decorator';
import { VFXModule, VFXExecutionStageFlags } from '../vfx-module';
import { Vec3 } from '../../core';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { P_PHYSICS_FORCE, P_POSITION, P_BASE_VELOCITY, P_VELOCITY, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_WORLD_TO_LOCAL_RS } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const gravity = new Vec3();
@ccclass('cc.GravityModule')
@VFXModule.register('Gravity', VFXExecutionStageFlags.UPDATE, [P_PHYSICS_FORCE.name])
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

    public tick (parameterMap: VFXParameterMap) {
        parameterMap.ensureParameter(P_POSITION);
        parameterMap.ensureParameter(P_BASE_VELOCITY);
        parameterMap.ensureParameter(P_VELOCITY);
        parameterMap.ensureParameter(P_PHYSICS_FORCE);
        this.gravity.tick(parameterMap);
    }

    public execute (parameterMap: VFXParameterMap) {
        const physicsForce = parameterMap.getVec3ArrayValue(P_PHYSICS_FORCE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const needTransform = !parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const gravityExp = this._gravity as Vec3Expression;
        gravityExp.bind(parameterMap);
        if (needTransform) {
            const transform = parameterMap.getMat3Value(E_WORLD_TO_LOCAL_RS).data;
            if (gravityExp.isConstant) {
                const force = Vec3.transformMat3(gravity, gravityExp.evaluate(0, gravity), transform);
                for (let i = fromIndex; i < toIndex; i++) {
                    physicsForce.addVec3At(force, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const force = Vec3.transformMat3(gravity, gravityExp.evaluate(i, gravity), transform);
                    physicsForce.addVec3At(force, i);
                }
            }
        } else if (gravityExp.isConstant) {
            const force = gravityExp.evaluate(0, gravity);
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(force, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(gravityExp.evaluate(i, gravity), i);
            }
        }
    }
}
