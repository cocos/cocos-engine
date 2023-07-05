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

import { ccclass, serializable, type } from '../../core/data/decorators';
import { FloatExpression } from './float';
import { VFXParameter, VFXParameterBinding, VFXParameterRegistry } from '../vfx-parameter';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXModule } from '../vfx-module';
import { VFXFloatArray } from '../data';

@ccclass('cc.BindingFloatExpression')
export class BindingFloatExpression extends FloatExpression {
    @type(VFXParameterBinding)
    get binding () {
        return this._binding;
    }

    set binding (val) {
        this._binding = val;
        this.requireRecompile();
    }

    @serializable
    private _binding: VFXParameterBinding | null = null;
    private _bindingParameter: VFXParameter | null = null;
    private declare _data: VFXFloatArray;
    private _constant = 0;
    private _getFloat = this._getConstant;

    public get isConstant (): boolean {
        return this._bindingParameter?.isArray !== true;
    }

    private _getConstant (index: number): number {
        return this._constant;
    }

    private _getFloatAt (index: number): number {
        return this._data.getFloatAt(index);
    }

    constructor (parameter?: VFXParameter) {
        super();
        if (parameter) {
            this._binding = new VFXParameterBinding(parameter);
        }
    }

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXModule) {
        const compileResult = super.compile(parameterMap, parameterRegistry, owner);

        if (this._binding) {
            this._bindingParameter = this._binding.getBindingParameter(parameterRegistry);
        }
        if (this._bindingParameter) {
            parameterMap.ensure(this._bindingParameter);
            if (this._bindingParameter.isArray) {
                this._getFloat = this._getFloatAt;
            } else {
                this._getFloat = this._getConstant;
            }
        } else {
            this._getFloat = this._getConstant;
            this._constant = 0;
        }
        return compileResult;
    }

    public bind (parameterMap: VFXParameterMap) {
        if (!this._bindingParameter) { return; }
        if (this._bindingParameter.isArray) {
            this._data = parameterMap.getFloatArrayVale(this._bindingParameter);
        } else {
            this._constant = parameterMap.getFloatValue(this._bindingParameter).data;
        }
    }

    public evaluate (index: number): number {
        return this._getFloat(index);
    }
}
