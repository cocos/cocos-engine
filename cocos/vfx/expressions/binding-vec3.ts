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
import { ccclass, serializable } from '../../core/data/decorators';
import { ContextDataSet, EmitterDataSet, ParticleDataSet, UserDataSet } from '../data-set';
import { Vec3Expression } from './vec3';
import { VFXParameterDecl, VFXParameterNamespace } from '../vfx-parameter';
import { Vec3ArrayParameter } from '../parameters';
import { Vec3 } from '../../core';

@ccclass('cc.BindingVec3Expression')
export class BindingVec3Expression extends Vec3Expression {
    @serializable
    private _bindParameter: VFXParameterDecl | null = null;
    private declare _data: Vec3ArrayParameter;
    private _constant = new Vec3();
    private _getVec3 = this._getConstant;

    public get isConstant (): boolean {
        return !this._bindParameter || this._bindParameter.namespace !== VFXParameterNamespace.PARTICLE;
    }

    private _getConstant (index: number, out: Vec3): Vec3 {
        Vec3.copy(out, this._constant);
        return this._constant;
    }

    private _getVec3At (index: number, out: Vec3): Vec3 {
        return this._data.getVec3At(out, index);
    }

    constructor (vfxParameterIdentity: VFXParameterDecl) {
        super();
        this._bindParameter = vfxParameterIdentity;
    }

    public tick (dataStore: VFXDataStore) {
        if (this._bindParameter?.namespace === VFXParameterNamespace.PARTICLE) {
            particles.ensureParameter(this._bindParameter);
        }
    }

    public bind (dataStore: VFXDataStore) {
        if (this._bindParameter?.namespace === VFXParameterNamespace.PARTICLE) {
            this._data = particles.getVec3ArrayParameter(this._bindParameter);
            this._getVec3 = this._getVec3At;
        } else {
            this._getVec3 = this._getConstant;
        }
    }

    public evaluateSingle (out: Vec3): Vec3 {
        return this._getVec3(0, out);
    }

    public evaluate (index: number, out: Vec3): Vec3 {
        return this._getVec3(index, out);
    }
}
