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

import { ccclass, type, serializable, visible, rangeMin } from 'cc.decorator';
import { Enum, lerp, Vec3 } from '../../core';
import { CoordinateSpace, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD_RS, E_WORLD_TO_LOCAL_RS, P_BASE_VELOCITY, P_VELOCITY } from '../define';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const limit = new Vec3();
const tempVelocity = new Vec3();
const srcVelocity = new Vec3();

@ccclass('cc.LimitVelocity')
@VFXModule.register('LimitVelocity', VFXExecutionStageFlags.UPDATE, [P_VELOCITY.name], [P_VELOCITY.name])
export class LimitVelocityModule extends VFXModule {
    /**
     * @zh 是否三个轴分开限制。
     */
    @visible(true)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

    /**
     * @zh 计算速度下限时采用的坐标系 [[Space]]。
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
     * @zh X 轴方向上的速度下限。
     */
    @type(FloatExpression)
    @visible(function (this: LimitVelocityModule): boolean {
        return !this.separateAxes;
    })
    public get uniformLimit () {
        if (!this._uniformLimit) {
            this._uniformLimit = new ConstantFloatExpression(1);
        }
        return this._uniformLimit;
    }

    public set uniformLimit (val) {
        this._uniformLimit = val;
        this.requireRecompile();
    }

    /**
     * @zh 速度下限。
     */
    @type(Vec3Expression)
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limit () {
        if (!this._limit) {
            this._limit = new ConstantVec3Expression(1, 1, 1);
        }
        return this._limit;
    }

    public set limit (val) {
        this._limit = val;
        this.requireRecompile();
    }

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @type(FloatExpression)
    public get dampen () {
        if (!this._dampen) {
            this._dampen = new ConstantFloatExpression(0.3);
        }
        return this._dampen;
    }

    public set dampen (val) {
        this._dampen = val;
        this.requireRecompile();
    }

    @serializable
    private _dampen: FloatExpression | null = null;
    @serializable
    private _uniformLimit: FloatExpression | null = null;
    @serializable
    private _limit: Vec3Expression | null = null;
    @serializable
    private _separateAxes = false;
    @serializable
    private _coordinateSpace = CoordinateSpace.SIMULATION;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_VELOCITY);
        parameterMap.ensure(P_BASE_VELOCITY);
        if (this.separateAxes) {
            compileResult &&= this.limit.compile(parameterMap, parameterRegistry, this);
        } else {
            compileResult &&= this.uniformLimit.compile(parameterMap, parameterRegistry, this);
        }
        compileResult &&= this.dampen.compile(parameterMap, parameterRegistry, this);
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const velocity = parameterMap.getVec3ArrayValue(P_VELOCITY);
        const baseVelocity = parameterMap.getVec3ArrayValue(P_BASE_VELOCITY);
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace !== CoordinateSpace.WORLD) !== parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const dampenExp = this._dampen as FloatExpression;
        dampenExp.bind(parameterMap);
        if (this.separateAxes) {
            const limitExp = this._limit as Vec3Expression;
            limitExp.bind(parameterMap);
            if (needTransform) {
                const transform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                const invTransform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_WORLD_TO_LOCAL_RS : E_LOCAL_TO_WORLD_RS).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    limitExp.evaluate(i, limit);
                    velocity.getVec3At(srcVelocity, i);
                    Vec3.transformMat3(tempVelocity, srcVelocity, transform);
                    const dampenRatio = dampenExp.evaluate(i);
                    Vec3.set(tempVelocity,
                        dampenBeyondLimit(tempVelocity.x, limit.x, dampenRatio),
                        dampenBeyondLimit(tempVelocity.y, limit.y, dampenRatio),
                        dampenBeyondLimit(tempVelocity.z, limit.z, dampenRatio));
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    limitExp.evaluate(i, limit);
                    velocity.getVec3At(tempVelocity, i);
                    const dampenRatio = dampenExp.evaluate(i);
                    Vec3.set(tempVelocity,
                        dampenBeyondLimit(tempVelocity.x, limit.x, dampenRatio),
                        dampenBeyondLimit(tempVelocity.y, limit.y, dampenRatio),
                        dampenBeyondLimit(tempVelocity.z, limit.z, dampenRatio));
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            }
        } else {
            const uniformLimitExp = this._uniformLimit as FloatExpression;
            uniformLimitExp.bind(parameterMap);
            if (needTransform) {
                const transform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                const invTransform = parameterMap.getMat3Value(this.coordinateSpace === CoordinateSpace.LOCAL ? E_WORLD_TO_LOCAL_RS : E_LOCAL_TO_WORLD_RS).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const limit = uniformLimitExp.evaluate(i);
                    velocity.getVec3At(srcVelocity, i);
                    Vec3.transformMat3(tempVelocity, srcVelocity, transform);
                    const dampenRatio = dampenExp.evaluate(i);
                    const oldLength = tempVelocity.length();
                    const newLength = dampenBeyondLimit(oldLength, limit, dampenRatio);
                    tempVelocity.multiplyScalar(newLength / oldLength);
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const limit = uniformLimitExp.evaluate(i);
                    velocity.getVec3At(tempVelocity, i);
                    const dampenRatio = dampenExp.evaluate(i);
                    const oldLength = tempVelocity.length();
                    const newLength = dampenBeyondLimit(oldLength, limit, dampenRatio);
                    tempVelocity.multiplyScalar(newLength / oldLength);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            }
        }
    }
}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}
