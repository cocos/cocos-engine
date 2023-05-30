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
import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../core';
import { VFXParameterNameSpace, VFXParameterType } from './define';
import { FloatParameter, Vec3Parameter, ColorParameter, Uint32Parameter, BoolParameter, Vec2Parameter, Vec4Parameter, Int32Parameter, Uint8Parameter, QuatParameter, Mat3Parameter, Mat4Parameter, FloatArrayParameter, Vec3ArrayParameter, ColorArrayParameter, Uint32ArrayParameter, BoolArrayParameter, Vec2ArrayParameter, Vec4ArrayParameter, Int32ArrayParameter, Uint8ArrayParameter, QuatArrayParameter, Mat3ArrayParameter, Mat4ArrayParameter } from './parameters';
import { VFXParameter, VFXParameterIdentity } from './vfx-parameter';

export class VFXDataSet {
    public get parameterCount () {
        return this._parameterCount;
    }

    public get parameters (): ReadonlyArray<VFXParameter> {
        return this._parameters;
    }

    private _parameterMap: Record<number, VFXParameter> = {};
    private _parameters: VFXParameter[] = [];
    private _namespace = VFXParameterNameSpace.PARTICLE;
    private _isArrayDataSet = false;
    private _parameterCount = 0;

    constructor (namespace: VFXParameterNameSpace, isArrayDataSet: boolean) {
        this._namespace = namespace;
        this._isArrayDataSet = isArrayDataSet;
    }

    public hasParameter (identity: VFXParameterIdentity) {
        return identity.id in this._parameterMap;
    }

    public getParameterUnsafe<T extends VFXParameter> (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(this.hasParameter(identity));
            assertIsTrue(identity.namespace === this._namespace);
        }
        return this._parameterMap[identity.id] as T;
    }

    private addParameter_internal (id: number, parameter: VFXParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
    }

    public addParameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.namespace === this._namespace);
        }
        if (this.hasParameter(identity)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (identity.type) {
        case VFXParameterType.FLOAT:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new FloatParameter() : new FloatArrayParameter());
            break;
        case VFXParameterType.VEC3:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Vec3Parameter() : new Vec3ArrayParameter());
            break;
        case VFXParameterType.P_COLOR:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new ColorParameter() : new ColorArrayParameter());
            break;
        case VFXParameterType.UINT32:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Uint32Parameter() : new Uint32ArrayParameter());
            break;
        case VFXParameterType.BOOL:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new BoolParameter() : new BoolArrayParameter());
            break;
        case VFXParameterType.VEC2:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Vec2Parameter() : new Vec2ArrayParameter());
            break;
        case VFXParameterType.VEC4:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Vec4Parameter() : new Vec4ArrayParameter());
            break;
        case VFXParameterType.INT32:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Int32Parameter() : new Int32ArrayParameter());
            break;
        case VFXParameterType.UINT8:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Uint8Parameter() : new Uint8ArrayParameter());
            break;
        case VFXParameterType.QUAT:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new QuatParameter() : new QuatArrayParameter());
            break;
        case VFXParameterType.MAT3:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Mat3Parameter() : new Mat3ArrayParameter());
            break;
        case VFXParameterType.MAT4:
            this.addParameter_internal(identity.id, !this._isArrayDataSet ? new Mat4Parameter() : new Mat4ArrayParameter());
            break;
        default:
            throw new Error('Does not support these parameter type in this data set!');
        }
        this.doAddParameter(identity);
    }

    public removeParameter (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            return;
        }
        const parameter = this._parameterMap[identity.id];
        if (DEBUG) {
            assertIsTrue(parameter);
        }
        delete this._parameterMap[identity.id];
        this._parameterCount--;
        const index = this._parameters.indexOf(parameter);
        this._parameters.splice(index, 1);
    }

    public reset () {
        this._parameterMap = {};
        this._parameterCount = 0;
        this._parameters.length = 0;
    }

    protected doAddParameter (identity: VFXParameterIdentity) {}
}
