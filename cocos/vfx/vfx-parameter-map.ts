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
import { VFXFloat, VFXVec3, VFXColor, VFXUint32, VFXBool, VFXVec2, VFXVec4, VFXInt32, VFXUint8, VFXQuat, VFXMat3, VFXMat4, VFXFloatArray, VFXVec3Array, VFXColorArray, VFXUint32Array, VFXBoolArray, VFXVec2Array, VFXVec4Array, VFXInt32Array, VFXUint8Array, VFXQuatArray, VFXMat3Array, VFXMat4Array, VFXEvent, VFXEventArray, VFXSpawnInfo, VFXSpawnInfoArray } from './parameters';
import { VFXValue, VFXParameter, VFXParameterNamespace, VFXValueType } from './vfx-parameter';

export class VFXParameterMap {
    public get parameterCount () {
        return this._parameterCount;
    }

    public get parameters (): ReadonlyArray<VFXValue> {
        return this._parameters;
    }

    private _parameterMap: Record<number, VFXValue> = {};
    private _parameters: VFXValue[] = [];
    private _namespace = VFXParameterNamespace.PARTICLE;
    private _parameterCount = 0;

    public hasParameter (param: VFXParameter) {
        return param.id in this._parameterMap;
    }

    public ensureParameter (param: VFXParameter) {
        if (!this.hasParameter(param)) {
            this.addParameter(param);
        }
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
            assertIsTrue(param.namespace === this._namespace);
            assertIsTrue(this.hasParameter(param));
        }
        return this._parameterMap[param.id] as T;
    }

    private addParameter_internal (id: number, parameter: VFXValue) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
    }

    public addParameter (param: VFXParameter) {
        if (DEBUG) {
            assertIsTrue(param.namespace === this._namespace);
        }
        if (this.hasParameter(param)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (param.type) {
        case VFXValueType.FLOAT:
            this.addParameter_internal(param.id, !param.isArray ? new VFXFloat() : new VFXFloatArray());
            break;
        case VFXValueType.VEC3:
            this.addParameter_internal(param.id, !param.isArray ? new VFXVec3() : new VFXVec3Array());
            break;
        case VFXValueType.COLOR:
            this.addParameter_internal(param.id, !param.isArray ? new VFXColor() : new VFXColorArray());
            break;
        case VFXValueType.UINT32:
            this.addParameter_internal(param.id, !param.isArray ? new VFXUint32() : new VFXUint32Array());
            break;
        case VFXValueType.BOOL:
            this.addParameter_internal(param.id, !param.isArray ? new VFXBool() : new VFXBoolArray());
            break;
        case VFXValueType.VEC2:
            this.addParameter_internal(param.id, !param.isArray ? new VFXVec2() : new VFXVec2Array());
            break;
        case VFXValueType.VEC4:
            this.addParameter_internal(param.id, !param.isArray ? new VFXVec4() : new VFXVec4Array());
            break;
        case VFXValueType.INT32:
            this.addParameter_internal(param.id, !param.isArray ? new VFXInt32() : new VFXInt32Array());
            break;
        case VFXValueType.UINT8:
            this.addParameter_internal(param.id, !param.isArray ? new VFXUint8() : new VFXUint8Array());
            break;
        case VFXValueType.QUAT:
            this.addParameter_internal(param.id, !param.isArray ? new VFXQuat() : new VFXQuatArray());
            break;
        case VFXValueType.MAT3:
            this.addParameter_internal(param.id, !param.isArray ? new VFXMat3() : new VFXMat3Array());
            break;
        case VFXValueType.MAT4:
            this.addParameter_internal(param.id, !param.isArray ? new VFXMat4() : new VFXMat4Array());
            break;
        case VFXValueType.EVENT:
            this.addParameter_internal(param.id, !param.isArray ? new VFXEvent() : new VFXEventArray());
            break;
        case VFXValueType.SPAWN_INFO:
            this.addParameter_internal(param.id, !param.isArray ? new VFXSpawnInfo() : new VFXSpawnInfoArray());
            break;
        default:
            throw new Error('Does not support these parameter type in this data set!');
        }
        this.doAddParameter(param);
    }

    public removeParameter (param: VFXParameter) {
        if (!this.hasParameter(param)) {
            return;
        }
        const parameter = this._parameterMap[param.id];
        if (DEBUG) {
            assertIsTrue(parameter);
        }
        delete this._parameterMap[param.id];
        this._parameterCount--;
        const index = this._parameters.indexOf(parameter);
        this._parameters.splice(index, 1);
    }

    public reset () {
        this._parameterMap = {};
        this._parameterCount = 0;
        this._parameters.length = 0;
    }

    protected doAddParameter (param: VFXParameter) {}
}
