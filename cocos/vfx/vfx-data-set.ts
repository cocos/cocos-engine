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
import { FloatParameter, Vec3Parameter, ColorParameter, Uint32Parameter, BoolParameter, Vec2Parameter, Vec4Parameter, Int32Parameter, Uint8Parameter, QuatParameter, Mat3Parameter, Mat4Parameter, FloatArrayParameter, Vec3ArrayParameter, ColorArrayParameter, Uint32ArrayParameter, BoolArrayParameter, Vec2ArrayParameter, Vec4ArrayParameter, Int32ArrayParameter, Uint8ArrayParameter, QuatArrayParameter, Mat3ArrayParameter, Mat4ArrayParameter } from './parameters';
import { VFXParameter, VFXParameterDecl, VFXParameterNamespace, VFXValueType } from './vfx-parameter';

export class VFXDataSet {
    public get parameterCount () {
        return this._parameterCount;
    }

    public get parameters (): ReadonlyArray<VFXParameter> {
        return this._parameters;
    }

    private _parameterMap: Record<number, VFXParameter> = {};
    private _parameters: VFXParameter[] = [];
    private _namespace = VFXParameterNamespace.PARTICLE;
    private _parameterCount = 0;

    constructor (namespace: VFXParameterNamespace) {
        this._namespace = namespace;
    }

    public hasParameter (identity: VFXParameterDecl) {
        return identity.id in this._parameterMap;
    }

    public getBoolParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.BOOL);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<BoolParameter>(identity);
    }

    public getBoolArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.BOOL);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<BoolArrayParameter>(identity);
    }

    public getColorParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.COLOR);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<ColorParameter>(identity);
    }

    public getColorArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.COLOR);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<ColorArrayParameter>(identity);
    }

    public getFloatParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.FLOAT);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<FloatParameter>(identity);
    }

    public getFloatArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.FLOAT);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<FloatArrayParameter>(identity);
    }

    public getInt32Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.INT32);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Int32Parameter>(identity);
    }

    public getInt32ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.INT32);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Int32ArrayParameter>(identity);
    }

    public getMat3Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.MAT3);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Mat3Parameter>(identity);
    }

    public getMat3ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.MAT3);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Mat3ArrayParameter>(identity);
    }

    public getMat4Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.MAT4);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Mat4Parameter>(identity);
    }

    public getMat4ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.MAT4);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Mat4ArrayParameter>(identity);
    }

    public getQuatParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.QUAT);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<QuatParameter>(identity);
    }

    public getQuatArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.QUAT);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<QuatArrayParameter>(identity);
    }

    public getUint8Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.UINT8);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Uint8Parameter>(identity);
    }

    public getUint8ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.UINT8);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Uint8ArrayParameter>(identity);
    }

    public getUint32Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.UINT32);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Uint32Parameter>(identity);
    }

    public getUint32ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.UINT32);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Uint32ArrayParameter>(identity);
    }

    public getVec2Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC2);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Vec2Parameter>(identity);
    }

    public getVec2ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC2);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Vec2ArrayParameter>(identity);
    }

    public getVec3Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC3);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Vec3Parameter>(identity);
    }

    public getVec3ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC3);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Vec3ArrayParameter>(identity);
    }

    public getVec4Parameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC4);
            assertIsTrue(!identity.isArray);
        }
        return this.getParameterUnsafe<Vec4Parameter>(identity);
    }

    public getVec4ArrayParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXValueType.VEC4);
            assertIsTrue(identity.isArray);
        }
        return this.getParameterUnsafe<Vec4ArrayParameter>(identity);
    }

    public getParameterUnsafe<T extends VFXParameter> (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.namespace === this._namespace);
            assertIsTrue(this.hasParameter(identity));
        }
        return this._parameterMap[identity.id] as T;
    }

    private addParameter_internal (id: number, parameter: VFXParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
    }

    public addParameter (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.namespace === this._namespace);
        }
        if (this.hasParameter(identity)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (identity.type) {
        case VFXValueType.FLOAT:
            this.addParameter_internal(identity.id, !identity.isArray ? new FloatParameter() : new FloatArrayParameter());
            break;
        case VFXValueType.VEC3:
            this.addParameter_internal(identity.id, !identity.isArray ? new Vec3Parameter() : new Vec3ArrayParameter());
            break;
        case VFXValueType.COLOR:
            this.addParameter_internal(identity.id, !identity.isArray ? new ColorParameter() : new ColorArrayParameter());
            break;
        case VFXValueType.UINT32:
            this.addParameter_internal(identity.id, !identity.isArray ? new Uint32Parameter() : new Uint32ArrayParameter());
            break;
        case VFXValueType.BOOL:
            this.addParameter_internal(identity.id, !identity.isArray ? new BoolParameter() : new BoolArrayParameter());
            break;
        case VFXValueType.VEC2:
            this.addParameter_internal(identity.id, !identity.isArray ? new Vec2Parameter() : new Vec2ArrayParameter());
            break;
        case VFXValueType.VEC4:
            this.addParameter_internal(identity.id, !identity.isArray ? new Vec4Parameter() : new Vec4ArrayParameter());
            break;
        case VFXValueType.INT32:
            this.addParameter_internal(identity.id, !identity.isArray ? new Int32Parameter() : new Int32ArrayParameter());
            break;
        case VFXValueType.UINT8:
            this.addParameter_internal(identity.id, !identity.isArray ? new Uint8Parameter() : new Uint8ArrayParameter());
            break;
        case VFXValueType.QUAT:
            this.addParameter_internal(identity.id, !identity.isArray ? new QuatParameter() : new QuatArrayParameter());
            break;
        case VFXValueType.MAT3:
            this.addParameter_internal(identity.id, !identity.isArray ? new Mat3Parameter() : new Mat3ArrayParameter());
            break;
        case VFXValueType.MAT4:
            this.addParameter_internal(identity.id, !identity.isArray ? new Mat4Parameter() : new Mat4ArrayParameter());
            break;
        default:
            throw new Error('Does not support these parameter type in this data set!');
        }
        this.doAddParameter(identity);
    }

    public removeParameter (identity: VFXParameterDecl) {
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

    protected doAddParameter (identity: VFXParameterDecl) {}
}
