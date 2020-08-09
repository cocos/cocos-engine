/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @hidden
 */

import { DEBUG } from 'internal:constants';
import { NativeBufferPool, NativeObjectPool } from './native-pools';
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState, IGFXDescriptorSetInfo,
    GFXDevice, GFXDescriptorSet, GFXShaderInfo, GFXShader, IGFXInputAssemblerInfo, GFXInputAssembler } from '../../gfx';

interface ITypedArrayConstructor<T> {
    new(buffer: ArrayBufferLike, byteOffset: number, length?: number): T;
    readonly BYTES_PER_ELEMENT: number;
}

interface IElementEnum {
    COUNT: number;
}

// a little hacky, but works (different specializations should not be assignable to each other)
class Handle<T extends PoolType> extends Number { m?: T; }

class BufferPool<T extends TypedArray, E extends IElementEnum, P extends PoolType> {

    // naming convension:
    // this._bufferViews[chunk][entry][element]

    private _viewCtor: ITypedArrayConstructor<T>;
    private _elementCount: number;
    private _entryBits: number;

    private _stride: number;
    private _entriesPerChunk: number;
    private _entryMask: number;
    private _chunkMask: number;
    private _poolFlag: number;

    private _arrayBuffers: ArrayBuffer[] = [];
    private _freelists: number[][] = [];
    private _bufferViews: T[][] = [];

    private _nativePool: NativeBufferPool;

    constructor (dataType: P, viewCtor: ITypedArrayConstructor<T>, enumType: E, entryBits = 8) {
        this._viewCtor = viewCtor;
        this._elementCount = enumType.COUNT;
        this._entryBits = entryBits;

        const bytesPerElement = viewCtor.BYTES_PER_ELEMENT || 1;
        this._stride = bytesPerElement * this._elementCount;
        this._entriesPerChunk = 1 << entryBits;
        this._entryMask = this._entriesPerChunk - 1;
        this._poolFlag = 1 << 30;
        this._chunkMask = ~(this._entryMask | this._poolFlag);
        this._nativePool = new NativeBufferPool(dataType, entryBits, this._stride);
    }

    public alloc (): Handle<P> {
        let i = 0;
        for (; i < this._freelists.length; i++) {
            const list = this._freelists[i];
            if (list.length) {
                const j = list[list.length - 1]; list.length--;
                return (i << this._entryBits) + j + this._poolFlag;
            }
        }
        // add a new chunk
        const buffer = this._nativePool.allocateNewChunk();
        const bufferViews: T[] = [];
        const freelist: number[] = [];
        for (let j = 0; j < this._entriesPerChunk; j++) {
            bufferViews.push(new this._viewCtor(buffer, this._stride * j, this._elementCount));
            if (j) { freelist.push(j); }
        }
        this._arrayBuffers.push(buffer);
        this._bufferViews.push(bufferViews);
        this._freelists.push(freelist);
        return (i << this._entryBits) + this._poolFlag; // guarantees the handle is always not zero
    }

    public get (handle: Handle<P>, element: E[keyof E]) {
        const chunk = (this._chunkMask & handle as number) >> this._entryBits;
        const entry = this._entryMask & handle as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid native buffer pool handle');
            return 0;
        }
        return this._bufferViews[chunk][entry][element as unknown as number];
    }

    public set (handle: Handle<P>, element: E[keyof E], value: number | Handle<any>) {
        const chunk = (this._chunkMask & handle as number) >> this._entryBits;
        const entry = this._entryMask & handle as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid native buffer pool handle');
            return;
        }
        this._bufferViews[chunk][entry][element as unknown as number] = value as number;
    }

    public free (handle: Handle<P>) {
        const chunk = (this._chunkMask & handle as number) >> this._entryBits;
        const entry = this._entryMask & handle as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._freelists.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid native buffer pool handle');
            return;
        }
        this._bufferViews[chunk][entry].fill(0);
        this._freelists[chunk].push(entry);
    }
}

class ObjectPool<T, P extends PoolType> {

    private _ctor: (args: any, obj?: T) => T;
    private _dtor?: (obj: T) => void;
    private _indexMask: number;
    private _poolFlag: number;

    private _array: T[] = [];
    private _freelist: number[] = [];

    private _nativePool: NativeObjectPool<T>;

    constructor (dataType: P, ctor: (args: any, obj?: T) => T, dtor?: (obj: T) => void) {
        this._ctor = ctor;
        if (dtor) { this._dtor = dtor; }
        this._poolFlag = 1 << 29;
        this._indexMask = ~this._poolFlag;
        this._nativePool = new NativeObjectPool(dataType, this._array);
    }

    public alloc (...args: any[]): Handle<P> {
        const freelist = this._freelist;
        let i = -1;
        if (freelist.length) {
            i = freelist[freelist.length - 1];
            freelist.length--;
            this._array[i] = this._ctor(arguments, this._array[i]);
        }
        if (i < 0) {
            i = this._array.length;
            const obj = this._ctor(arguments);
            if (!obj) { return 0; }
            this._array.push(obj);
        }
        return i + this._poolFlag; // guarantees the handle is always not zero
    }

    public get (handle: Handle<P>) {
        const index = this._indexMask & handle as number;
        if (DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find((n) => n === index))) {
            console.warn('invalid native object pool handle');
            return null!;
        }
        return this._array[index];
    }

    public free (handle: Handle<P>) {
        const index = this._indexMask & handle as number;
        if (DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find((n) => n === index))) {
            console.warn('invalid native object pool handle');
            return;
        }
        if (this._dtor) { this._dtor(this._array[index]); }
        this._freelist.push(index);
    }
}

enum PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    DESCRIPTOR_SETS,
    SHADER,
    INPUT_ASSEMBLER,
    // buffers
    PASS,
    SUB_MODEL,
}
export type RasterizerStateHandle = Handle<PoolType.RASTERIZER_STATE>;
export type DepthStencilStateHandle = Handle<PoolType.DEPTH_STENCIL_STATE>;
export type BlendStateHandle = Handle<PoolType.BLEND_STATE>;
export type DescriptorSetHandle = Handle<PoolType.DESCRIPTOR_SETS>;
export type ShaderHandle = Handle<PoolType.SHADER>;
export type IAHandle = Handle<PoolType.INPUT_ASSEMBLER>;
export type PassHandle = Handle<PoolType.PASS>;
export type SubModelHandle = Handle<PoolType.SUB_MODEL>;

// don't reuse any of these data-only structs, for GFX objects may directly reference them
export const RasterizerStatePool = new ObjectPool(PoolType.RASTERIZER_STATE, (_: any) => new GFXRasterizerState());
export const DepthStencilStatePool = new ObjectPool(PoolType.DEPTH_STENCIL_STATE, (_: any) => new GFXDepthStencilState());
export const BlendStatePool = new ObjectPool(PoolType.BLEND_STATE, (_: any) => new GFXBlendState());

export const ShaderPool = new ObjectPool(PoolType.SHADER,
    (args: [GFXDevice, GFXShaderInfo], obj?: GFXShader) => obj ? (obj.initialize(args[1]), obj) : args[0].createShader(args[1]),
    (obj: GFXShader) => obj && obj.destroy(),
);
export const DSPool = new ObjectPool(PoolType.DESCRIPTOR_SETS,
    (args: [GFXDevice, IGFXDescriptorSetInfo], obj?: GFXDescriptorSet) => obj ? (obj.initialize(args[1]), obj) : args[0].createDescriptorSet(args[1]),
    (obj: GFXDescriptorSet) => obj && obj.destroy(),
);
export const IAPool = new ObjectPool(PoolType.INPUT_ASSEMBLER,
    (args: [GFXDevice, IGFXInputAssemblerInfo], obj?: GFXInputAssembler) => obj ? (obj.initialize(args[1]), obj) : args[0].createInputAssembler(args[1]),
    (obj: GFXInputAssembler) => obj && obj.destroy(),
);

export enum PassView {
    PRIORITY,
    STAGE,
    PHASE,
    BATCHING_SCHEME,
    PRIMITIVE,
    DYNAMIC_STATES,
    HASH,
    RASTERIZER_STATE,    // handle
    DEPTH_STENCIL_STATE, // handle
    BLEND_STATE,         // handle
    DESCRIPTOR_SET,      // handle
    COUNT,
}
export const PassPool = new BufferPool(PoolType.PASS, Uint32Array, PassView);

export enum SubModelView {
    PRIORITY,
    PASS_COUNT,
    PASS_0,          // handle
    PASS_1,          // handle
    PASS_2,          // handle
    PASS_3,          // handle
    SHADER_0,        // handle
    SHADER_1,        // handle
    SHADER_2,        // handle
    SHADER_3,        // handle
    DESCRIPTOR_SET,  // handle
    INPUT_ASSEMBLER, // handle
    COUNT,
}
export const SubModelPool = new BufferPool(PoolType.SUB_MODEL, Uint32Array, SubModelView);
