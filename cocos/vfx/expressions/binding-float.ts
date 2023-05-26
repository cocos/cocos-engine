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
import { ContextDataSet } from '../context-data-set';
import { EmitterDataSet } from '../emitter-data-set';
import { VFXParameterNameSpace } from '../define';
import { ParticleDataSet } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { FloatExpression } from './float';
import { VFXParameterIdentity } from '../vfx-parameter';
import { FloatArrayParameter, FloatParameter } from '../parameters';

@ccclass('cc.BindingFloatExpression')
export class BindingFloatExpression extends FloatExpression {
    @type(VFXParameterIdentity)
    get bindingParameter () {
        return this._bindingParameter;
    }

    set bindingParameter (val) {
        this._bindingParameter = val;
    }

    @serializable
    private _bindingParameter: VFXParameterIdentity | null = null;
    private declare _data: Float32Array;
    private _constant = 0;
    private _getFloat = this._getConstant;

    public get isConstant (): boolean {
        return this._bindingParameter?.namespace !== VFXParameterNameSpace.PARTICLE;
    }

    private _getConstant (index: number): number {
        return this._constant;
    }

    private _getFloatAt (index: number): number {
        return this._data[index];
    }

    constructor (vfxParameterIdentity: VFXParameterIdentity) {
        super();
        this._bindingParameter = vfxParameterIdentity;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (this._bindingParameter?.namespace === VFXParameterNameSpace.PARTICLE) {
            particles.markRequiredParameter(this._bindingParameter);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (!this._bindingParameter) {
            this._getFloat = this._getConstant;
            this._constant = 0;
            return;
        }
        switch (this._bindingParameter.namespace) {
        case VFXParameterNameSpace.PARTICLE:
            this._data = particles.getParameterUnsafe<FloatArrayParameter>(this._bindingParameter).data;
            this._getFloat = this._getFloatAt;
            break;
        case VFXParameterNameSpace.EMITTER:
            this._constant = emitter.getParameterUnsafe<FloatParameter>(this._bindingParameter).data;
            this._getFloat = this._getConstant;
            break;
        case VFXParameterNameSpace.USER:
            this._constant = user.getParameterUnsafe<FloatParameter>(this._bindingParameter).data;
            this._getFloat = this._getConstant;
            break;
        case VFXParameterNameSpace.CONTEXT:
            this._constant = context.getParameterUnsafe<FloatParameter>(this._bindingParameter).data;
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
