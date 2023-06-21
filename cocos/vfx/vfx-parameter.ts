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
import { ccclass, serializable, visible } from '../core/data/decorators';
import { CUSTOM_PARAMETER_ID_BEGIN } from './define';

const DEFAULT_CAPACITY = 16;
export const BATCH_OPERATION_THRESHOLD_VEC3 = 330;
export const BATCH_OPERATION_THRESHOLD = 1000;
export type Handle = number;

export enum VFXValueType {
    FLOAT,
    BOOL,
    VEC2,
    VEC3,
    VEC4,
    QUAT,
    COLOR,
    INT32,
    UINT32,
    UINT8,
    MAT3,
    MAT4,
    EVENT,
    SPAWN_INFO,
    COUNT,
}

export enum VFXValueTypeFlags {
    NONE = 0,
    FLOAT = 1 << VFXValueType.FLOAT,
    BOOL = 1 << VFXValueType.BOOL,
    VEC2 = 1 << VFXValueType.VEC2,
    VEC3 = 1 << VFXValueType.VEC3,
    VEC4 = 1 << VFXValueType.VEC4,
    QUAT = 1 << VFXValueType.QUAT,
    COLOR = 1 << VFXValueType.COLOR,
    INT32 = 1 << VFXValueType.INT32,
    UINT32 = 1 << VFXValueType.UINT32,
    UINT8 = 1 << VFXValueType.UINT8,
    MAT3 = 1 << VFXValueType.MAT3,
    MAT4 = 1 << VFXValueType.MAT4,
    EVENT = 1 << VFXValueType.EVENT,
    SPAWN_INFO = 1 << VFXValueType.SPAWN_INFO,
    ALL = (1 << VFXValueType.COUNT) - 1,
}

@ccclass('cc.VFXParameter')
export class VFXParameter {
    public get id () {
        return this._id;
    }

    public get type () {
        return this._type;
    }

    public get namespace () {
        return this._namespace;
    }

    public get isArray () {
        return this._isArray;
    }

    @visible(true)
    public get name () {
        return this._name;
    }

    public set name (val) {
        this._name = val;
    }

    @serializable
    private _id = 0;
    @serializable
    private _name = '';
    @serializable
    private _type: VFXValueType = VFXValueType.FLOAT;
    @serializable
    private _namespace = '';
    @serializable
    private _isArray = false;

    constructor (id: number, name: string, type: VFXValueType, namespace: string, isArray: boolean) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._namespace = namespace;
        this._isArray = isArray;
    }
}

@ccclass('cc.VFXParameterRegistry')
export class VFXParameterRegistry {
    public static get globalParameters (): ReadonlyArray<VFXParameter> {
        return this._globalParameters;
    }

    public static registerGlobalParameter (name: string, type: VFXValueType, namespace: string, isArray: boolean) {
        if (!(namespace in this._namespaceCurrentId)) {
            this._namespaceCurrentId[namespace] = this._namespaceIdBegin;
            this._namespaceIdBegin += 2000;
        }
        const parameter = new VFXParameter(++this._namespaceCurrentId[namespace], name, type, namespace, isArray);
        this._id2GlobalParameter[parameter.id] = parameter;
        this._name2GlobalParameter[parameter.name] = parameter;
        this._globalParameters.push(parameter);
        return parameter;
    }

    public static unregisterGlobalParameter (parameter: VFXParameter) {
        delete this._id2GlobalParameter[parameter.id];
        delete this._name2GlobalParameter[parameter.name];
        const index = this._globalParameters.indexOf(parameter);
        if (index !== -1) {
            this._globalParameters.splice(index, 1);
        }
    }

    public get parameters (): ReadonlyArray<VFXParameter> {
        return this._parameters;
    }

    private static _id2GlobalParameter: Record<number, VFXParameter> = {};
    private static _name2GlobalParameter: Record<string, VFXParameter> = {};
    private static _globalParameters: VFXParameter[] = [];
    private static _namespaceCurrentId: Record<string, number> = {};
    private static _namespaceIdBegin = 0;
    @serializable
    private _currentId = CUSTOM_PARAMETER_ID_BEGIN;
    @serializable
    private _parameters: VFXParameter[] = [];

    public register (name: string, type: VFXValueType, namespace: string, isArray: boolean) {
        const parameter = new VFXParameter(++this._currentId, name, type, namespace, isArray);
        this._parameters.push(parameter);
        return parameter;
    }

    public unregister (parameter: VFXParameter) {
        const index = this._parameters.indexOf(parameter);
        if (index !== -1) {
            this._parameters.splice(index, 1);
        }
    }

    public findParameterById (id: number) {
        if (id < CUSTOM_PARAMETER_ID_BEGIN) {
            return id in VFXParameterRegistry._id2GlobalParameter ? VFXParameterRegistry._id2GlobalParameter[id] : null;
        } else {
            const parameters = this._parameters;
            for (let i = 0, length = parameters.length; i < length; ++i) {
                if (parameters[i].id === id) {
                    return parameters[i];
                }
            }
        }
        return null;
    }

    public findParameterByName (name: string) {
        if (name in VFXParameterRegistry._name2GlobalParameter) {
            return VFXParameterRegistry._name2GlobalParameter[name];
        } else {
            const parameters = this._parameters;
            for (let i = 0, length = parameters.length; i < length; ++i) {
                if (parameters[i].name === name) {
                    return parameters[i];
                }
            }
        }
        return null;
    }

    public clear () {
        this._parameters.length = 0;
    }
}

@ccclass('cc.VFXParameterBinding')
export class VFXParameterBinding {
    get bindingParameterId () {
        return this._bindingParameterId;
    }

    @serializable
    private _bindingParameterId = 0;

    constructor (parameter?: VFXParameter) {
        if (parameter) {
            this._bindingParameterId = parameter.id;
        }
    }

    public getBindingParameter (registry: VFXParameterRegistry) {
        return registry.findParameterById(this._bindingParameterId);
    }
}

export abstract class VFXValue {
    get isArray () {
        return false;
    }

    abstract get type (): VFXValueType;
}

export abstract class VFXArray extends VFXValue {
    get capacity () {
        return this._capacity;
    }

    get isArray () {
        return true;
    }

    protected _capacity = DEFAULT_CAPACITY;
    abstract reserve (capacity: number);
    abstract moveTo (a: Handle, b: Handle);
    abstract copyFrom (src: VFXArray, fromIndex: Handle, toIndex: Handle);
}
