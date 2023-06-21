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
import { Vec3Expression } from './vec3';
import { VFXParameter, VFXParameterBinding, VFXParameterRegistry } from '../vfx-parameter';
import { VFXVec3Array } from '../data';
import { Vec3 } from '../../core';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXModule } from '../vfx-module';

@ccclass('cc.BindingVec3Expression')
export class BindingVec3Expression extends Vec3Expression {
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
    private _bindParameter: VFXParameter | null = null;
    private declare _data: VFXVec3Array;
    private _constant = new Vec3();
    private _getVec3 = this._getConstant;

    public get isConstant (): boolean {
        return !this._bindParameter || !this._bindParameter.isArray;
    }

    private _getConstant (index: number, out: Vec3): Vec3 {
        Vec3.copy(out, this._constant);
        return this._constant;
    }

    private _getVec3At (index: number, out: Vec3): Vec3 {
        return this._data.getVec3At(out, index);
    }

    constructor (vfxParameterIdentity: VFXParameter) {
        super();
        this._bindParameter = vfxParameterIdentity;
    }

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXModule) {
        super.compile(parameterMap, parameterRegistry, owner);
        if (this._binding) {
            this._bindParameter = this._binding.getBindingParameter(parameterRegistry);
        }
        if (this._bindParameter) {
            parameterMap.ensure(this._bindParameter);
            if (this._bindParameter.isArray) {
                this._getVec3 = this._getVec3At;
            } else {
                this._getVec3 = this._getConstant;
            }
        } else {
            this._getVec3 = this._getConstant;
            Vec3.copy(this._constant, Vec3.ZERO);
        }
    }

    public bind (parameterMap: VFXParameterMap) {
        if (!this._bindParameter) {
            return;
        }
        if (this._bindParameter.isArray) {
            this._data = parameterMap.getVec3ArrayValue(this._bindParameter);
        } else {
            Vec3.copy(this._constant, parameterMap.getVec3Value(this._bindParameter).data);
        }
    }

    public evaluate (index: number, out: Vec3): Vec3 {
        return this._getVec3(index, out);
    }
}
