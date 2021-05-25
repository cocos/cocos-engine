/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @hidden
 */

import { DEBUG, JSB } from 'internal:constants';
import { NativeBufferPool } from './native-pools';
import { Vec2, Vec3, Quat, Color, Rect, Mat4, IVec2Like, IVec3Like, IVec4Like, IMat4Like } from '../../math';
import { PoolType } from './memory-pools';

const contains = (a: number[], t: number) => {
    for (let i = 0; i < a.length; ++i) {
        if (a[i] === t) return true;
    }
    return false;
};

 interface IMemoryPool<P extends PoolType> {
     free (handle: IHandle<P>): void;
 }

 // a little hacky, but works (different specializations should not be assignable to each other)
 interface IHandle<P extends PoolType> extends Number {
     // we make this non-optional so that even plain numbers would not be directly assignable to handles.
     // this strictness will introduce some casting hassle in the pool implementation itself
     // but becomes generally more useful for client code type checking.
     _: P;
 }

 enum BufferDataType {
     UINT32,
     FLOAT32,
     NEVER,
 }

 type BufferManifest = { [key: string]: number | string; COUNT: number };
 type StandardBufferElement = number | IHandle<PoolType>;
 type GeneralBufferElement = StandardBufferElement | IVec2Like | IVec3Like | IVec4Like | IMat4Like;
 type BufferTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: GeneralBufferElement };
 type BufferDataTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: BufferDataType };
 type BufferDataMembersManifest<E extends BufferManifest> = { [key in E[keyof E]]: number };
 type BufferArrayType = Float32Array | Uint32Array;

class BufferPool<P extends PoolType, E extends BufferManifest, M extends BufferTypeManifest<E>> implements IMemoryPool<P> {
    // naming convension:
    // this._bufferViews[chunk][entry][element]

     private _dataType: BufferDataTypeManifest<E>;
     private _dataMembers: BufferDataMembersManifest<E>;
     private _elementCount: number;
     private _entryBits: number;
     private _stride: number;
     private _entriesPerChunk: number;
     private _entryMask: number;
     private _chunkMask: number;
     private _poolFlag: number;
     private _arrayBuffers: ArrayBuffer[] = [];
     private _freelists: number[][] = [];
     private _uint32BufferViews: Uint32Array[][] = [];
     private _float32BufferViews: Float32Array[][] = [];
     private _hasUint32 = false;
     private _hasFloat32 = false;
     private _nativePool: NativeBufferPool;

     constructor (poolType: P, dataType: BufferDataTypeManifest<E>, dataMembers: BufferDataMembersManifest<E>, enumType: E, entryBits = 8) {
         this._elementCount = enumType.COUNT;
         this._entryBits = entryBits;
         this._dataType = dataType;
         this._dataMembers = dataMembers;

         const bytesPerElement = 4;
         this._stride = bytesPerElement * this._elementCount;
         this._entriesPerChunk = 1 << entryBits;
         this._entryMask = this._entriesPerChunk - 1;
         this._poolFlag = 1 << 30;
         this._chunkMask = ~(this._entryMask | this._poolFlag);
         this._nativePool = new NativeBufferPool(poolType, entryBits, this._stride);

         let type: BufferDataType = BufferDataType.NEVER;
         let hasFloat32 = false; let hasUint32 = false;
         for (const e in dataType) {
             hasFloat32 = this._hasFloat32;
             hasUint32 = this._hasUint32;
             if (hasUint32 && hasFloat32) {
                 break;
             }

             type = dataType[e as E[keyof E]];
             if (!hasFloat32 && type === BufferDataType.FLOAT32) {
                 this._hasFloat32 = true;
             } else if (!hasUint32 && type === BufferDataType.UINT32) {
                 this._hasUint32 = true;
             }
         }
     }

     public alloc (): IHandle<P> {
         let i = 0;
         for (; i < this._freelists.length; i++) {
             const list = this._freelists[i];
             if (list.length) {
                 const j = list[list.length - 1]; list.length--;
                 return (i << this._entryBits) + j + this._poolFlag as unknown as IHandle<P>;
             }
         }
         // add a new chunk
         const buffer = this._nativePool.allocateNewChunk();
         const float32BufferViews: Float32Array[] = [];
         const uint32BufferViews: Uint32Array[] = [];
         const freelist: number[] = [];
         const hasFloat32 = this._hasFloat32;
         const hasUint32 = this._hasUint32;
         for (let j = 0; j < this._entriesPerChunk; j++) {
             if (hasFloat32) { float32BufferViews.push(new Float32Array(buffer, this._stride * j, this._elementCount)); }
             if (hasUint32) { uint32BufferViews.push(new Uint32Array(buffer, this._stride * j, this._elementCount)); }
             if (j) { freelist.push(j); }
         }
         this._arrayBuffers.push(buffer);
         if (hasUint32) { this._uint32BufferViews.push(uint32BufferViews); }
         if (hasFloat32) { this._float32BufferViews.push(float32BufferViews); }
         this._freelists.push(freelist);
         return (i << this._entryBits) + this._poolFlag as unknown as IHandle<P>; // guarantees the handle is always not zero
     }

     /**
     * Get the specified element out from buffer pool.
     *
     * Note the type inference does not work when `element` is not directly
     * an pre-declared enum value: (e.g. when doing arithmetic operations)
     * ```ts
     * SubModelPool.get(handle, SubModelView.SHADER_0 + passIndex); // the return value will have type GeneralBufferElement
     * ```
     *
     * To properly declare the variable type, you have two options:
     * ```ts
     * const hShader = SubModelPool.get(handle, SubModelView.SHADER_0 + passIndex) as ShaderHandle; // option #1
     * const hShader = SubModelPool.get<SubModelView.SHADER_0>(handle, SubModelView.SHADER_0 + passIndex); // option #2
     * ```
     */
     public get<K extends E[keyof E]> (handle: IHandle<P>, element: K): Extract<M[K], StandardBufferElement> {
         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
         if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
            || entry < 0 || entry >= this._entriesPerChunk || contains(this._freelists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return 0 as Extract<M[K], StandardBufferElement>;
         }
         return bufferViews[chunk][entry][element as number] as Extract<M[K], StandardBufferElement>;
     }

     public set<K extends E[keyof E]> (handle: IHandle<P>, element: K, value: Extract<M[K], StandardBufferElement>) {
         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
         if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
            || entry < 0 || entry >= this._entriesPerChunk || contains(this._freelists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return;
         }
         bufferViews[chunk][entry][element as number] = value as number;
     }

     public getTypedArray<K extends E[keyof E]> (handle: IHandle<P>, element: K): BufferArrayType {
         if (!JSB) { return [] as unknown as BufferArrayType; }

         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
         if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
             || entry < 0 || entry >= this._entriesPerChunk || contains(this._freelists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return [] as unknown as BufferArrayType;
         }
         const index = element as unknown as number;
         const view = bufferViews[chunk][entry];
         const count = this._dataMembers[element];

         return view.subarray(index, index + count);
     }

     public free (handle: IHandle<P>) {
         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         if (DEBUG && (!handle || chunk < 0 || chunk >= this._freelists.length
             || entry < 0 || entry >= this._entriesPerChunk || contains(this._freelists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return;
         }
         const bufferViews = this._hasUint32 ? this._uint32BufferViews : this._float32BufferViews;
         bufferViews[chunk][entry].fill(0);
         this._freelists[chunk].push(entry);
     }
}

export enum NodeView {
    FLAGS_CHANGED,
    LAYER,
    WORLD_SCALE,        // Vec3
    WORLD_POSITION = 5, // Vec3
    WORLD_ROTATION = 8, // Quat
    WORLD_MATRIX = 12,  // Mat4
    COUNT = 28
}

interface INodeViewType extends BufferTypeManifest<typeof NodeView> {
    [NodeView.FLAGS_CHANGED]: number;
    [NodeView.LAYER]: number;
    [NodeView.WORLD_SCALE]: Vec3;
    [NodeView.WORLD_POSITION]: Vec3;
    [NodeView.WORLD_ROTATION]: Quat;
    [NodeView.WORLD_MATRIX]: Mat4;
    [NodeView.COUNT]: never;
}
const NodeViewDataType: BufferDataTypeManifest<typeof NodeView> = {
    [NodeView.FLAGS_CHANGED]: BufferDataType.UINT32,
    [NodeView.LAYER]: BufferDataType.UINT32,
    [NodeView.WORLD_SCALE]: BufferDataType.FLOAT32,
    [NodeView.WORLD_POSITION]: BufferDataType.FLOAT32,
    [NodeView.WORLD_ROTATION]: BufferDataType.FLOAT32,
    [NodeView.WORLD_MATRIX]: BufferDataType.FLOAT32,
    [NodeView.COUNT]: BufferDataType.NEVER,
};
const NodeViewDataMembers: BufferDataMembersManifest<typeof NodeView> = {
    [NodeView.FLAGS_CHANGED]: 1,
    [NodeView.LAYER]: 1,
    [NodeView.WORLD_SCALE]: 3,
    [NodeView.WORLD_POSITION]: 3,
    [NodeView.WORLD_ROTATION]: 4,
    [NodeView.WORLD_MATRIX]: 16,
    [NodeView.COUNT]: 1,
};

// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const NodePool = new BufferPool<PoolType.NODE, typeof NodeView, INodeViewType>(PoolType.NODE, NodeViewDataType, NodeViewDataMembers, NodeView);
