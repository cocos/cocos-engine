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
import { VFXFloat, VFXVec3, VFXColor, VFXUint32, VFXBool, VFXVec2, VFXVec4, VFXInt32, VFXUint8, VFXQuat, VFXMat3, VFXMat4, VFXFloatArray, VFXVec3Array, VFXColorArray, VFXUint32Array, VFXBoolArray, VFXVec2Array, VFXVec4Array, VFXInt32Array, VFXUint8Array, VFXQuatArray, VFXMat3Array, VFXMat4Array, VFXEvent, VFXEventArray, VFXSpawnInfo, VFXSpawnInfoArray } from './data';
import { VFXValue, VFXParameter, VFXValueType } from './vfx-parameter';

export class VFXParameterMap {
    public get count () {
        return this._count;
    }

    private _id2Value: Record<number, VFXValue> = {};
    private _namespace2Values: Record<string, VFXValue[]> = {};
    private _count = 0;

    public has (param: VFXParameter) {
        return param.id in this._id2Value;
    }

    public ensure (param: VFXParameter) {
        if (!this.has(param)) {
            this.register(param);
        }
    }

    public getValueEntriesWithNamespace (namespace: string): ReadonlyArray<VFXValue> {
        return this._namespace2Values[namespace];
    }

    public getBoolValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.BOOL);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXBool>(param);
    }

    public getBoolArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.BOOL);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXBoolArray>(param);
    }

    public getColorValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.COLOR);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXColor>(param);
    }

    public getColorArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.COLOR);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXColorArray>(param);
    }

    public getFloatValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.FLOAT);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXFloat>(param);
    }

    public getFloatArrayVale (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.FLOAT);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXFloatArray>(param);
    }

    public getInt32Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.INT32);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXInt32>(param);
    }

    public getInt32ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.INT32);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXInt32Array>(param);
    }

    public getMat3Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.MAT3);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXMat3>(param);
    }

    public getMat3ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.MAT3);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXMat3Array>(param);
    }

    public getMat4Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.MAT4);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXMat4>(param);
    }

    public getMat4ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.MAT4);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXMat4Array>(param);
    }

    public getQuatValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.QUAT);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXQuat>(param);
    }

    public getQuatArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.QUAT);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXQuatArray>(param);
    }

    public getUint8Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.UINT8);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXUint8>(param);
    }

    public getUint8ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.UINT8);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXUint8Array>(param);
    }

    public getUint32Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.UINT32);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXUint32>(param);
    }

    public getUint32ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.UINT32);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXUint32Array>(param);
    }

    public getVec2Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC2);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXVec2>(param);
    }

    public getVec2ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC2);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXVec2Array>(param);
    }

    public getVec3Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC3);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXVec3>(param);
    }

    public getVec3ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC3);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXVec3Array>(param);
    }

    public getVec4Value (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC4);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXVec4>(param);
    }

    public getVec4ArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.VEC4);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXVec4Array>(param);
    }

    public getEventValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.EVENT);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXEvent>(param);
    }

    public getEventArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.EVENT);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXEventArray>(param);
    }

    public getSpawnInfoValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.SPAWN_INFO);
            assertIsTrue(!param.isArray);
        }
        return this.getValueUnsafe<VFXSpawnInfo>(param);
    }

    public getSpawnInfoArrayValue (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.type === VFXValueType.SPAWN_INFO);
            assertIsTrue(param.isArray);
        }
        return this.getValueUnsafe<VFXSpawnInfoArray>(param);
    }

    public getValueUnsafe<T extends VFXValue> (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(this.has(param));
        }
        return this._id2Value[param.id] as T;
    }

    private addParameter_internal (id: number, namespace: string, value: VFXValue) {
        this._count++;
        if (!(namespace in this._namespace2Values)) {
            this._namespace2Values[namespace] = [];
        }
        this._namespace2Values[namespace].push(value);
        this._id2Value[id] = value;
    }

    public register (param: VFXParameter) {
        if (this.has(param)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (param.type) {
        case VFXValueType.FLOAT:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXFloat() : new VFXFloatArray());
            break;
        case VFXValueType.VEC3:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXVec3() : new VFXVec3Array());
            break;
        case VFXValueType.COLOR:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXColor() : new VFXColorArray());
            break;
        case VFXValueType.UINT32:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXUint32() : new VFXUint32Array());
            break;
        case VFXValueType.BOOL:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXBool() : new VFXBoolArray());
            break;
        case VFXValueType.VEC2:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXVec2() : new VFXVec2Array());
            break;
        case VFXValueType.VEC4:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXVec4() : new VFXVec4Array());
            break;
        case VFXValueType.INT32:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXInt32() : new VFXInt32Array());
            break;
        case VFXValueType.UINT8:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXUint8() : new VFXUint8Array());
            break;
        case VFXValueType.QUAT:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXQuat() : new VFXQuatArray());
            break;
        case VFXValueType.MAT3:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXMat3() : new VFXMat3Array());
            break;
        case VFXValueType.MAT4:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXMat4() : new VFXMat4Array());
            break;
        case VFXValueType.EVENT:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXEvent() : new VFXEventArray());
            break;
        case VFXValueType.SPAWN_INFO:
            this.addParameter_internal(param.id, param.namespace, !param.isArray ? new VFXSpawnInfo() : new VFXSpawnInfoArray());
            break;
        default:
            throw new Error('Does not support these parameter type in this data set!');
        }
    }

    public unregister (param: VFXParameter) {
        if (!this.has(param)) {
            return;
        }
        const value = this._id2Value[param.id];
        if (DEBUG) {
            assertIsTrue(value);
        }
        delete this._id2Value[param.id];
        this._count--;
        this._namespace2Values[param.namespace].splice(this._namespace2Values[param.namespace].indexOf(value), 1);
    }

    public reset () {
        this._id2Value = {};
        this._count = 0;
        this._namespace2Values = {};
    }
}
