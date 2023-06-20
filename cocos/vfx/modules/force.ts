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
import { CoordinateSpace, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD_RS, E_WORLD_TO_LOCAL_RS, P_BASE_VELOCITY, P_PHYSICS_FORCE, P_POSITION, P_VELOCITY } from '../define';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const _temp_v3 = new Vec3();

@ccclass('cc.ForceModule')
@VFXModule.register('Force', VFXExecutionStageFlags.UPDATE, [P_VELOCITY.name])
export class ForceModule extends VFXModule {
    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Enum(CoordinateSpace))
    public get coordinateSpace () {
        return this._coordinateSpace;
    }

    public set coordinateSpace (val) {
        this._coordinateSpace = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
    }

    @serializable
    private _force: Vec3Expression | null = null;
    @serializable
    private _coordinateSpace = CoordinateSpace.SIMULATION;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_POSITION);
        parameterMap.ensure(P_BASE_VELOCITY);
        parameterMap.ensure(P_VELOCITY);
        parameterMap.ensure(P_PHYSICS_FORCE);
        this.force.compile(parameterMap, parameterRegistry, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const physicsForce = parameterMap.getVec3ArrayValue(P_PHYSICS_FORCE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const needTransform = this._coordinateSpace !== CoordinateSpace.SIMULATION && (this._coordinateSpace === CoordinateSpace.WORLD) !== parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const forceExp = this._force as Vec3Expression;
        forceExp.bind(parameterMap);
        if (needTransform) {
            const transform = parameterMap.getMat3Value(this._coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
            if (forceExp.isConstant) {
                const force = Vec3.transformMat3(_temp_v3, forceExp.evaluate(0, _temp_v3), transform);
                for (let i = fromIndex; i < toIndex; i++) {
                    physicsForce.addVec3At(force, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const force = Vec3.transformMat3(_temp_v3, forceExp.evaluate(i, _temp_v3), transform);
                    physicsForce.addVec3At(force, i);
                }
            }
        } else if (forceExp.isConstant) {
            const force = forceExp.evaluate(0, _temp_v3);
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(force, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                physicsForce.addVec3At(forceExp.evaluate(i, _temp_v3), i);
            }
        }
    }
}
