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

import { ccclass, serializable, type, visible } from 'cc.decorator';
import { CCBoolean, Enum, Vec3 } from '../../core';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { CoordinateSpace, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD_RS, E_WORLD_TO_LOCAL_RS, P_VELOCITY } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const tempScalar = new Vec3();
const tempVelocity = new Vec3();

@ccclass('cc.ScaleVelocityModule')
@VFXModule.register('ScaleVelocity', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.EVENT_HANDLER, [P_VELOCITY.name], [P_VELOCITY.name])
export class ScaleVelocityModule extends VFXModule {
    @type(Enum(CoordinateSpace))
    public get coordinateSpace () {
        return this._coordinateSpace;
    }

    public set coordinateSpace (val) {
        this._coordinateSpace = val;
        this.requireRecompile();
    }

    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @type(CCBoolean)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

    /**
     * @zh 速度修正系数。
     */
    @type(Vec3Expression)
    @visible(function (this: ScaleVelocityModule): boolean { return this.separateAxes; })
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantVec3Expression(1, 1, 1);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(function (this: ScaleVelocityModule): boolean { return !this.separateAxes; })
    public get uniformScalar () {
        if (!this._uniformScalar) {
            this._uniformScalar = new ConstantFloatExpression(1);
        }
        return this._uniformScalar;
    }

    public set uniformScalar (val) {
        this._uniformScalar = val;
        this.requireRecompile();
    }

    @serializable
    private _scalar: Vec3Expression | null = null;
    @serializable
    private _uniformScalar: FloatExpression | null = null;
    @serializable
    private _separateAxes = false;
    @serializable
    private _coordinateSpace = CoordinateSpace.SIMULATION;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_VELOCITY);
        if (this.separateAxes) {
            compileResult &&= this.scalar.compile(parameterMap, parameterRegistry, this);
        } else {
            compileResult &&= this.uniformScalar.compile(parameterMap, parameterRegistry, this);
        }
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const velocity  = parameterMap.getVec3ArrayValue(P_VELOCITY);
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace !== CoordinateSpace.WORLD) !== parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (this.separateAxes) {
            const scalarExp = this._scalar as Vec3Expression;
            scalarExp.bind(parameterMap);
            if (needTransform) {
                const transform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                const invTransform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_WORLD_TO_LOCAL_RS : E_LOCAL_TO_WORLD_RS).data;

                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = scalarExp.evaluate(i, tempScalar);
                    velocity.getVec3At(tempVelocity, i);
                    Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                    Vec3.multiply(tempVelocity, tempVelocity, scalar);
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = scalarExp.evaluate(i, tempScalar);
                    velocity.multiplyVec3At(scalar, i);
                }
            }
        } else {
            const uniformExp = this._uniformScalar as FloatExpression;
            uniformExp.bind(parameterMap);
            if (needTransform) {
                const transform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                const invTransform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_WORLD_TO_LOCAL_RS : E_LOCAL_TO_WORLD_RS).data;

                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = uniformExp.evaluate(i);
                    velocity.getVec3At(tempVelocity, i);
                    Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                    Vec3.multiplyScalar(tempVelocity, tempVelocity, scalar);
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = uniformExp.evaluate(i);
                    velocity.multiplyScalarAt(scalar, i);
                }
            }
        }
    }
}
