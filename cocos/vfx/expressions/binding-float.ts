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
import { VFXParameterDecl, VFXParameterNamespace } from '../vfx-parameter';
import { VFXDataStore } from '../vfx-data-store';

@ccclass('cc.BindingFloatExpression')
export class BindingFloatExpression extends FloatExpression {
    @type(VFXParameterDecl)
    get bindingParameter () {
        return this._bindingParameter;
    }

    set bindingParameter (val) {
        this._bindingParameter = val;
    }

    @serializable
    private _bindingParameter: VFXParameterDecl | null = null;
    private declare _data: Float32Array;
    private _constant = 0;
    private _getFloat = this._getConstant;

    public get isConstant (): boolean {
        return this._bindingParameter?.namespace !== VFXParameterNamespace.PARTICLE;
    }

    private _getConstant (index: number): number {
        return this._constant;
    }

    private _getFloatAt (index: number): number {
        return this._data[index];
    }

    constructor (vfxParameterIdentity: VFXParameterDecl) {
        super();
        this._bindingParameter = vfxParameterIdentity;
    }

    public tick (dataStore: VFXDataStore) {
        if (this._bindingParameter?.namespace === VFXParameterNamespace.PARTICLE) {
            dataStore.particles.ensureParameter(this._bindingParameter);
        }
    }

    public bind (dataStore: VFXDataStore) {
        if (!this._bindingParameter) {
            this._getFloat = this._getConstant;
            this._constant = 0;
            return;
        }
        switch (this._bindingParameter.namespace) {
        case VFXParameterNamespace.PARTICLE:
            this._data = particles.getFloatArrayParameter(this._bindingParameter).data;
            this._getFloat = this._getFloatAt;
            break;
        case VFXParameterNamespace.EMITTER:
            this._constant = emitter.getFloatParameter(this._bindingParameter).data;
            this._getFloat = this._getConstant;
            break;
        case VFXParameterNamespace.USER:
            this._constant = user.getFloatParameter(this._bindingParameter).data;
            this._getFloat = this._getConstant;
            break;
        case VFXParameterNamespace.CONTEXT:
            this._constant = context.getFloatParameter(this._bindingParameter).data;
            this._getFloat = this._getConstant;
            break;
        default:
        }
    }

    public evaluateSingle (): number {
        return this._getFloat(0);
    }

    public evaluate (index: number): number {
        return this._getFloat(index);
    }
}
