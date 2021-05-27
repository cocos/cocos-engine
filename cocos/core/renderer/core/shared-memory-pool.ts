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

const contains = (a: number[], t: number) => {
    for (let i = 0; i < a.length; ++i) {
        if (a[i] === t) return true;
    }
    return false;
};

 interface IMemoryPool<P extends SharedPoolType> {
     free (handle: IHandle<P>): void;
 }

 // a little hacky, but works (different specializations should not be assignable to each other)
 interface IHandle<P extends SharedPoolType> extends Number {
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

export enum SharedPoolType {
    NODE = 199
}

export type SharedNodeHandle = IHandle<SharedPoolType.NODE>;

 type BufferManifest = { [key: string]: number | string; COUNT: number };
 type StandardBufferElement = number | IHandle<SharedPoolType>;
 type GeneralBufferElement = StandardBufferElement | IVec2Like | IVec3Like | IVec4Like | IMat4Like;
 type BufferTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: GeneralBufferElement };
 type BufferDataTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: BufferDataType };
 type BufferDataMembersManifest<E extends BufferManifest> = { [key in E[keyof E]]: number };
 type BufferArrayType = Float32Array | Uint32Array;

class BufferPool<P extends SharedPoolType, E extends BufferManifest, M extends BufferTypeManifest<E>> implements IMemoryPool<P> {
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
     private _freeLists: number[][] = [];
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
         for (; i < this._freeLists.length; i++) {
             const list = this._freeLists[i];
             if (list.length) {
                 const j = list[list.length - 1]; list.length--;
                 return (i << this._entryBits) + j + this._poolFlag as unknown as IHandle<P>;
             }
         }
         // add a new chunk
         const buffer = this._nativePool.allocateNewChunk();
         const float32BufferViews: Float32Array[] = [];
         const uint32BufferViews: Uint32Array[] = [];
         const freeList: number[] = [];
         const hasFloat32 = this._hasFloat32;
         const hasUint32 = this._hasUint32;
         for (let j = 0; j < this._entriesPerChunk; j++) {
             if (hasFloat32) { float32BufferViews.push(new Float32Array(buffer, this._stride * j, this._elementCount)); }
             if (hasUint32) { uint32BufferViews.push(new Uint32Array(buffer, this._stride * j, this._elementCount)); }
             if (j) { freeList.push(j); }
         }
         if (hasUint32) { this._uint32BufferViews.push(uint32BufferViews); }
         if (hasFloat32) { this._float32BufferViews.push(float32BufferViews); }
         this._freeLists.push(freeList);
         this._arrayBuffers.push(buffer);
         const handle = (i << this._entryBits) + this._poolFlag as unknown as IHandle<P>;
         return handle; // guarantees the handle is always not zero
     }

     public getBuffer (handle: IHandle<P>): BufferArrayType {
         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         const bufferViews = this._float32BufferViews;
         if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
           || entry < 0 || entry >= this._entriesPerChunk || contains(this._freeLists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return [] as unknown as BufferArrayType;
         }

         return bufferViews[chunk][entry];
     }

     public getTypedArray<K extends E[keyof E]> (handle: IHandle<P>, element: K): BufferArrayType {
         const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
         const entry = this._entryMask & handle as unknown as number;
         const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
         if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length
             || entry < 0 || entry >= this._entriesPerChunk || contains(this._freeLists[chunk], entry))) {
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
         if (DEBUG && (!handle || chunk < 0 || chunk >= this._freeLists.length
             || entry < 0 || entry >= this._entriesPerChunk || contains(this._freeLists[chunk], entry))) {
             console.warn('invalid buffer pool handle');
             return;
         }
         const bufferViews = this._hasUint32 ? this._uint32BufferViews : this._float32BufferViews;
         bufferViews[chunk][entry].fill(0);
         this._freeLists[chunk].push(entry);
         // free
         if (this._freeLists[chunk].length === this._entriesPerChunk && this._freeLists.length > 1) {
             this._freeLists.splice(chunk, 1);
             this._arrayBuffers.splice(chunk, 1);
         }
     }
}

export enum SharedNodeView {
    FLAGS_CHANGED,
    LAYER,
    WORLD_SCALE,        // Vec3
    WORLD_POSITION = 5, // Vec3
    WORLD_ROTATION = 8, // Quat
    WORLD_MATRIX = 12,  // Mat4
    COUNT = 28
}

interface INodeViewType extends BufferTypeManifest<typeof SharedNodeView> {
    [SharedNodeView.FLAGS_CHANGED]: number;
    [SharedNodeView.LAYER]: number;
    [SharedNodeView.WORLD_SCALE]: Vec3;
    [SharedNodeView.WORLD_POSITION]: Vec3;
    [SharedNodeView.WORLD_ROTATION]: Quat;
    [SharedNodeView.WORLD_MATRIX]: Mat4;
    [SharedNodeView.COUNT]: never;
}
const NodeViewDataType: BufferDataTypeManifest<typeof SharedNodeView> = {
    [SharedNodeView.FLAGS_CHANGED]: BufferDataType.UINT32,
    [SharedNodeView.LAYER]: BufferDataType.UINT32,
    [SharedNodeView.WORLD_SCALE]: BufferDataType.FLOAT32,
    [SharedNodeView.WORLD_POSITION]: BufferDataType.FLOAT32,
    [SharedNodeView.WORLD_ROTATION]: BufferDataType.FLOAT32,
    [SharedNodeView.WORLD_MATRIX]: BufferDataType.FLOAT32,
    [SharedNodeView.COUNT]: BufferDataType.NEVER,
};
const NodeViewDataMembers: BufferDataMembersManifest<typeof SharedNodeView> = {
    [SharedNodeView.FLAGS_CHANGED]: 1,
    [SharedNodeView.LAYER]: 1,
    [SharedNodeView.WORLD_SCALE]: 3,
    [SharedNodeView.WORLD_POSITION]: 3,
    [SharedNodeView.WORLD_ROTATION]: 4,
    [SharedNodeView.WORLD_MATRIX]: 16,
    [SharedNodeView.COUNT]: 1,
};

// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const SharedNodePool = new BufferPool<SharedPoolType.NODE, typeof SharedNodeView, INodeViewType>(SharedPoolType.NODE, NodeViewDataType, NodeViewDataMembers, SharedNodeView);
