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
import { ccclass, serializable, visible } from '../core/data/decorators';

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
    EVENT
}

export enum VFXParameterNamespace {
    EMITTER,
    PARTICLE,
    USER,
    CONTEXT
}

@ccclass('cc.VFXParameterDecl')
export class VFXParameterDecl {
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
    private _namespace: VFXParameterNamespace = VFXParameterNamespace.USER;
    @serializable
    private _isArray = false;

    constructor (id: number, name: string, type: VFXValueType, namespace: VFXParameterNamespace, isArray: boolean) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._namespace = namespace;
        this._isArray = isArray;
    }
}

export class VFXParameterRegistry {
    private _id2Identity: Record<number, VFXParameterDecl> = {};

    register (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(!(identity.id in this._id2Identity), `VFXParameter with id ${identity.id} already exists.`);
        }
        this._id2Identity[identity.id] = identity;
    }

    unregister (identity: VFXParameterDecl) {
        if (DEBUG) {
            assertIsTrue(identity.id in this._id2Identity, `VFXParameter with id ${identity.id} does not exist.`);
        }
        delete this._id2Identity[identity.id];
    }

    getDeclarationById (id: number) {
        if (id < )
        return this._id2Identity[id];
    }
}

export abstract class VFXParameter {
    get isArray () {
        return false;
    }

    abstract get type (): VFXValueType;
}

export abstract class ArrayParameter extends VFXParameter {
    get capacity () {
        return this._capacity;
    }

    get isArray () {
        return true;
    }

    abstract get data (): ArrayBufferView;
    abstract get stride (): number;
    protected _capacity = DEFAULT_CAPACITY;
    abstract reserve (capacity: number);
    abstract move (a: Handle, b: Handle);
    abstract copyFrom (src: ArrayParameter, fromIndex: Handle, toIndex: Handle);
    abstract copyToTypedArray (dest: ArrayBufferView, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle);
}
