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
import { Vec3 } from '../../core';
import { FloatExpression, ConstantFloatExpression } from '../expressions';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { P_VELOCITY, P_SCALE, P_SPRITE_SIZE, P_POSITION, P_BASE_VELOCITY, P_PHYSICS_FORCE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const _tempVec3 = new Vec3();
@ccclass('cc.DragModule')
@VFXModule.register('Drag', VFXExecutionStageFlags.UPDATE, [P_VELOCITY.name], [P_VELOCITY.name, P_SCALE.name, P_SPRITE_SIZE.name])
export class DragModule extends VFXModule {
    @type(FloatExpression)
    @visible(true)
    public get drag () {
        if (!this._drag) {
            this._drag = new ConstantFloatExpression(0);
        }
        return this._drag;
    }

    public set drag (val) {
        this._drag = val;
        this.requireRecompile();
    }

    @serializable
    private _drag: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_POSITION);
        parameterMap.ensure(P_BASE_VELOCITY);
        parameterMap.ensure(P_VELOCITY);
        parameterMap.ensure(P_PHYSICS_FORCE);
        this.drag.compile(parameterMap, parameterRegistry, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const physicsForce = parameterMap.getVec3ArrayValue(P_PHYSICS_FORCE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const velocity = parameterMap.getVec3ArrayValue(P_VELOCITY);
        const dragExp = this._drag as FloatExpression;
        dragExp.bind(parameterMap);

        for (let i = fromIndex; i < toIndex; i++) {
            const drag = dragExp.evaluate(i);
            const length = velocity.getVec3At(_tempVec3, i).length();
            Vec3.multiplyScalar(_tempVec3, _tempVec3, -drag / length);
            physicsForce.addVec3At(_tempVec3, i);
        }
    }
}
