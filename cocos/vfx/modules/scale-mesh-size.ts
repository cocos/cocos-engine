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
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { P_SCALE, P_NORMALIZED_AGE, P_BASE_SCALE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const tempScalar = new Vec3();

@ccclass('cc.ScaleMeshSizeModule')
@VFXModule.register('ScaleMeshSize', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [P_SCALE.name], [P_NORMALIZED_AGE.name])
export class ScaleMeshSizeModule extends VFXModule {
    /**
      * @zh 决定是否在每个轴上独立控制粒子大小。
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
      * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
      */
    @type(FloatExpression)
    @visible(function (this: ScaleMeshSizeModule): boolean { return !this.separateAxes; })
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

    @type(Vec3Expression)
    @visible(function (this: ScaleMeshSizeModule): boolean { return this.separateAxes; })
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

    @serializable
    private _uniformScalar: FloatExpression | null = null;
    @serializable
    private _scalar: Vec3Expression | null = null;
    @serializable
    private _separateAxes = false;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_SCALE);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_SCALE);
        }
        if (this.separateAxes) {
            this.scalar.compile(parameterMap, parameterRegistry, this);
        } else {
            this.uniformScalar.compile(parameterMap, parameterRegistry, this);
        }
    }

    public execute (parameterMap: VFXParameterMap) {
        const scale = parameterMap.getVec3ArrayValue(this.usage === VFXExecutionStage.SPAWN ? P_BASE_SCALE : P_SCALE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (!this.separateAxes) {
            const uniformScalarExp = this._uniformScalar as FloatExpression;
            uniformScalarExp.bind(parameterMap);
            if (uniformScalarExp.isConstant) {
                const scalar = uniformScalarExp.evaluate(0);
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiplyScalarAt(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = uniformScalarExp.evaluate(i);
                    scale.multiplyScalarAt(scalar, i);
                }
            }
        } else {
            const scalarExp = this._scalar as Vec3Expression;
            scalarExp.bind(parameterMap);
            if (scalarExp.isConstant) {
                const scalar = scalarExp.evaluate(0, tempScalar);
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiplyVec3At(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = scalarExp.evaluate(i, tempScalar);
                    scale.multiplyVec3At(scalar, i);
                }
            }
        }
    }
}
