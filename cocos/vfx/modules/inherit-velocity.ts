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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { P_VELOCITY, E_IS_WORLD_SPACE, P_POSITION, P_BASE_VELOCITY, C_FROM_INDEX, C_TO_INDEX, E_VELOCITY } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXEmitter } from '../vfx-emitter';

const tempVelocity = new Vec3();
const scale = new Vec3();
@ccclass('cc.InheritVelocityModule')
@VFXModule.register('InheritVelocity', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [P_VELOCITY.name])
export class InheritVelocityModule extends VFXModule {
    @type(Vec3Expression)
    @visible(true)
    public get scale () {
        if (!this._scale) { this._scale = new ConstantVec3Expression(1, 1, 1); }
        return this._scale;
    }

    public set scale (val) {
        this._scale = val;
        this.requireRecompile();
    }

    @serializable
    private _scale: Vec3Expression | null = null;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        if (!parameterMap.getBoolValue(E_IS_WORLD_SPACE).data) { return; }
        this.scale.compile(parameterMap, this);
        parameterMap.ensure(P_POSITION);
        parameterMap.ensure(P_VELOCITY);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_VELOCITY);
        }
    }

    public execute (parameterMap: VFXParameterMap) {
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const initialVelocity = parameterMap.getVec3Value(E_VELOCITY).data;
        if (!parameterMap.getBoolValue(E_IS_WORLD_SPACE).data) { return; }
        const velocity = parameterMap.getVec3ArrayValue(this.usage === VFXExecutionStage.SPAWN ? P_BASE_VELOCITY : P_VELOCITY);
        const scaleExp = this._scale as Vec3Expression;
        scaleExp.bind(parameterMap);
        if (scaleExp.isConstant) {
            Vec3.multiply(tempVelocity, initialVelocity, scaleExp.evaluate(0, scale));
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                Vec3.multiply(tempVelocity, initialVelocity, scaleExp.evaluate(i, scale));
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
