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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { Vec3 } from '../../core';
import { P_SCALE, P_NORMALIZED_AGE, P_BASE_SCALE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterRegistry } from '../vfx-parameter';
import { VFXParameterMap } from '../vfx-parameter-map';

const tempScale = new Vec3();
@ccclass('cc.SetMeshScaleModule')
@VFXModule.register('SetMeshScale', VFXExecutionStageFlags.SPAWN | VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.EVENT_HANDLER, [P_SCALE.name], [P_NORMALIZED_AGE.name])
export class SetMeshScaleModule extends VFXModule {
    @visible(true)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(function (this: SetMeshScaleModule): boolean { return !this.separateAxes; })
    public get uniformScale () {
        if (!this._uniformScale) {
            this._uniformScale = new ConstantFloatExpression(1);
        }
        return this._uniformScale;
    }

    public set uniformScale (val) {
        this._uniformScale = val;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    @visible(function (this: SetMeshScaleModule): boolean { return this.separateAxes; })
    public get scale () {
        if (!this._scale) {
            this._scale = new ConstantVec3Expression(1, 1, 1);
        }
        return this._scale;
    }

    public set scale (val) {
        this._scale = val;
        this.requireRecompile();
    }

    @serializable
    private _uniformScale: FloatExpression | null = null;
    @serializable
    private _scale: Vec3Expression | null = null;
    @serializable
    private _separateAxes = false;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        if (this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_BASE_SCALE);
        }

        parameterMap.ensure(P_SCALE);
        if (this.separateAxes) {
            compileResult &&= this.scale.compile(parameterMap, parameterRegistry, this);
        } else {
            compileResult &&= this.uniformScale.compile(parameterMap, parameterRegistry, this);
        }
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const scale = parameterMap.getVec3ArrayValue(this.usage === VFXExecutionStage.SPAWN ? P_BASE_SCALE : P_SCALE);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        if (this.separateAxes) {
            const scaleExp = this._scale as Vec3Expression;
            scaleExp.bind(parameterMap);

            for (let i = fromIndex; i < toIndex; ++i) {
                scaleExp.evaluate(i, tempScale);
                scale.setVec3At(tempScale, i);
            }
        } else {
            const uniformScaleExp = this._uniformScale as FloatExpression;
            uniformScaleExp.bind(parameterMap);

            for (let i = fromIndex; i < toIndex; ++i) {
                const srcScale = uniformScaleExp.evaluate(i);
                scale.setUniformFloatAt(srcScale, i);
            }
        }
    }
}
