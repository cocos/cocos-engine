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
import { NativeBufferPool, NativeObjectPool, NativeBufferAllocator } from './native-pools';
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState, GFXDescriptorSetInfo,
    GFXDevice, GFXDescriptorSet, GFXShaderInfo, GFXShader, GFXInputAssemblerInfo, GFXInputAssembler,
    GFXPipelineLayoutInfo, GFXPipelineLayout, GFXFramebuffer, GFXFramebufferInfo, GFXPrimitiveMode,
    GFXDynamicStateFlags, GFXClearFlag, GFXAttribute } from '../../gfx';
import { RenderPassStage } from '../../pipeline/define';
import { BatchingSchemes } from './pass';
import { Layers } from '../../scene-graph/layers';
import { Vec2, Vec3, Quat, Color, Rect, Mat4, IVec2Like, IVec3Like, IVec4Like, IMat4Like } from '../../math';
import { plane } from '../../geometry';

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

type BufferManifest = { [key: string]: number | string; COUNT: number; };
type StandardBufferElement = number | IHandle<PoolType>;
type GeneralBufferElement = StandardBufferElement | IVec2Like | IVec3Like | IVec4Like | IMat4Like;
type BufferTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: GeneralBufferElement };
type BufferDataTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: BufferDataType };

class BufferPool<P extends PoolType, E extends BufferManifest, M extends BufferTypeManifest<E>> implements IMemoryPool<P> {

    // naming convension:
    // this._bufferViews[chunk][entry][element]

    private _dataType: BufferDataTypeManifest<E>;
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
    private _hasUint32: boolean = false;
    private _hasFloat32: boolean = false;

    private _nativePool: NativeBufferPool;

    constructor (poolType: P, dataType: BufferDataTypeManifest<E>, enumType: E, entryBits = 8) {
        this._elementCount = enumType.COUNT;
        this._entryBits = entryBits;
        this._dataType = dataType;

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

            type = dataType[e];
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
            if (hasFloat32) float32BufferViews.push(new Float32Array(buffer, this._stride * j, this._elementCount));
            if (hasUint32) uint32BufferViews.push(new Uint32Array(buffer, this._stride * j, this._elementCount))
            if (j) freelist.push(j);
        }
        this._arrayBuffers.push(buffer);
        if (hasUint32) this._uint32BufferViews.push(uint32BufferViews);
        if (hasFloat32) this._float32BufferViews.push(float32BufferViews);
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
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return 0 as Extract<M[K], StandardBufferElement>;
        }
        return bufferViews[chunk][entry][element as number] as Extract<M[K], StandardBufferElement>;
    }

    public set<K extends E[keyof E]> (handle: IHandle<P>, element: K, value: Extract<M[K], StandardBufferElement>) {
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        bufferViews[chunk][entry][element as number] = value as number;
    }

    public setVec2<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec2: Extract<M[K], IVec2Like>) {
        // Web engine has Vec2 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = bufferViews[chunk][entry];
        view[index++] = vec2.x; view[index++] = vec2.y;
    }

    public setVec3<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec3: Extract<M[K], IVec3Like>) {
        // Web engine has Vec3 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = bufferViews[chunk][entry];
        view[index++] = vec3.x; view[index++] = vec3.y; view[index] = vec3.z;
    }

    public setVec4<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec4: Extract<M[K], IVec4Like>) {
        // Web engine has Vec4 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = bufferViews[chunk][entry];
        view[index++] = vec4.x; view[index++] = vec4.y;
        view[index++] = vec4.z; view[index]   = vec4.w;
    }

    public setMat4<K extends E[keyof E]> (handle: IHandle<P>, element: K, mat4: Extract<M[K], IMat4Like>) {
        // Web engine has mat4 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        const bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;
        if (DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = bufferViews[chunk][entry];
        view[index++] = mat4.m00; view[index++] = mat4.m01; view[index++] = mat4.m02; view[index++] = mat4.m03;
        view[index++] = mat4.m04; view[index++] = mat4.m05; view[index++] = mat4.m06; view[index++] = mat4.m07;
        view[index++] = mat4.m08; view[index++] = mat4.m09; view[index++] = mat4.m10; view[index++] = mat4.m11;
        view[index++] = mat4.m12; view[index++] = mat4.m13; view[index++] = mat4.m14; view[index]   = mat4.m15;
    }

    public free (handle: IHandle<P>) {
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._freelists.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        const bufferViews = this._hasUint32 ? this._uint32BufferViews : this._float32BufferViews;
        bufferViews[chunk][entry].fill(0);
        this._freelists[chunk].push(entry);
    }
}

class ObjectPool<T, P extends PoolType, A extends any[]> implements IMemoryPool<P> {

    private _ctor: (args: A, obj?: T) => T;
    private _dtor?: (obj: T) => void;
    private _indexMask: number;
    private _poolFlag: number;

    private _array: T[] = [];
    private _freelist: number[] = [];

    private _nativePool: NativeObjectPool<T>;

    constructor (poolType: P, ctor: (args: A, obj?: T) => T, dtor?: (obj: T) => void) {
        this._ctor = ctor;
        if (dtor) { this._dtor = dtor; }
        this._poolFlag = 1 << 29;
        this._indexMask = ~this._poolFlag;
        this._nativePool = new NativeObjectPool(poolType, this._array);
    }

    public alloc (...args: A): IHandle<P> {
        const freelist = this._freelist;
        let i = -1;
        if (freelist.length) {
            i = freelist[freelist.length - 1];
            freelist.length--;
            this._array[i] = this._ctor(arguments as unknown as A, this._array[i]);
        }
        if (i < 0) {
            i = this._array.length;
            const obj = this._ctor(arguments as unknown as A);
            if (!obj) { return 0 as unknown as IHandle<P>; }
            this._array.push(obj);
        }
        return i + this._poolFlag as unknown as IHandle<P>; // guarantees the handle is always not zero
    }

    public get (handle: IHandle<P>) {
        const index = this._indexMask & handle as unknown as number;
        if (DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find((n) => n === index))) {
            console.warn('invalid object pool handle');
            return null!;
        }
        return this._array[index];
    }

    public free (handle: IHandle<P>) {
        const index = this._indexMask & handle as unknown as number;
        if (DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find((n) => n === index))) {
            console.warn('invalid object pool handle');
            return;
        }
        if (this._dtor) { this._dtor(this._array[index]); }
        this._freelist.push(index);
    }
}

class BufferAllocator<P extends PoolType> implements IMemoryPool<P> {

    protected _nativeBufferAllocator: NativeBufferAllocator;
    protected _buffers = new Map<number, ArrayBuffer>();
    protected _nextBufferIdx: number = 0;
    protected _poolFlag: number;
    protected _bufferIdxMask: number;

    constructor (poolType: P) {
        this._poolFlag = 1 << 30;
        this._bufferIdxMask = ~this._poolFlag;
        this._nativeBufferAllocator = new NativeBufferAllocator(poolType);
    }

    public alloc (size: number): IHandle<P> {
        const bufferIdx = this._nextBufferIdx++;
        const buffer = this._nativeBufferAllocator.alloc(bufferIdx, size);
        this._buffers.set(bufferIdx, buffer);
        return (bufferIdx | this._poolFlag) as unknown as IHandle<P>;
    }

    public free (handle: IHandle<P>) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        if (!this._buffers.get(bufferIdx)) {
            if (DEBUG) console.warn('invalid buffer allocator handle');
            return;
        }
        this._nativeBufferAllocator.free(bufferIdx);
        this._buffers.delete(bufferIdx);
    }

    public getBuffer (handle: IHandle<P>): ArrayBuffer {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const buffer = this._buffers.get(bufferIdx);
        if (!buffer) {
            if (DEBUG) console.warn('invalid array pool index or invalid array handle');
            return null!;
        }
        return buffer;
    }
}

class TypedArrayPool<P extends PoolType, T extends TypedArrayConstructor, D extends StandardBufferElement>
    extends BufferAllocator<P> implements IMemoryPool<P> {

    declare protected _buffers: Map<number, InstanceType<T>>;
    protected _viewCtor: T;
    protected _size: number;
    protected _step: number;

    constructor (poolType: P, viewCtor: T, size: number, step?: number) {
        super(poolType);
        this._viewCtor = viewCtor;
        this._size = size * viewCtor.BYTES_PER_ELEMENT;
        this._step = step || size;
    }

    public alloc (): IHandle<P> {
        const bufferIdx = this._nextBufferIdx++;
        const buffer = this._nativeBufferAllocator.alloc(bufferIdx, this._size);
        this._buffers.set(bufferIdx, new this._viewCtor(buffer) as InstanceType<T>);
        return (bufferIdx | this._poolFlag) as unknown as IHandle<P>;
    }

    // no direct buffer accesses for array pools
    public getBuffer (handle: IHandle<P>): never { return null!; }

    public assign (handle: IHandle<P>, index: number, value: D) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        let array = this._buffers.get(bufferIdx);
        if (!array) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        // First element is the length of array.
        index = index + 1;
        if (index >= array.length) {
            let newSize = array.length;
            while (index >= newSize) newSize += this._step;
            newSize *= this._viewCtor.BYTES_PER_ELEMENT;
            const newArray = new this._viewCtor(this._nativeBufferAllocator.alloc(bufferIdx, newSize)) as InstanceType<T>;
            newArray.set(array); array = newArray;
            this._buffers.set(bufferIdx, array);
        }
        array[index] = value as unknown as number;

        // There may be holes in the array.
        const len = array[0];
        array[0] = index > len ? index : len;
    }

    public erase (handle: IHandle<P>, index: number) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array || index >= array[0]) {
            if (DEBUG) console.warn('invalid array pool index or invalid array handle');
            return;
        }
        for (let i = index + 1; i < array[0]; ++i) {
            array[i] = array[i + 1];
        }
        --array[0];
    }

    public push (handle: IHandle<P>, value: D) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        this.assign(handle, array[0], value);
    }

    public pop (handle: IHandle<P>) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        if (array[0] === 0) {
            return;
        } else {
            --array[0];
        }
    }

    public clear (handle: IHandle<P>) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }
        array[0] = 0;
    }

    public get (handle: IHandle<P>, index: number): D {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array || index >= array[0]) {
            if (DEBUG) console.warn('invalid array pool handle');
            return 0 as D;
        }
        return array[index + 1] as D;
    }

    public length (handle: IHandle<P>) {
        const bufferIdx = this._bufferIdxMask & handle as unknown as number;
        const array = this._buffers.get(bufferIdx);
        if (!array) {
            if (DEBUG) console.warn('invalid array pool handle');
            return 0;
        }
        return array[0];
    }
}

export function freeHandleArray<P extends PoolType, H extends IHandle<PoolType>> (
    arrayHandle: IHandle<P>,
    arrayPool: TypedArrayPool<P, Uint32ArrayConstructor, H>,
    elementPool: IMemoryPool<H['_']>,
    freeArrayItself = true,
) {
    const count = arrayPool.length(arrayHandle);
    for (let i = 0; i < count; i++) {
        const element = arrayPool.get(arrayHandle, i);
        if (element) elementPool.free(element);
    }
    if (freeArrayItself) arrayPool.free(arrayHandle);
    else arrayPool.clear(arrayHandle);
}

enum PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    ATTRIBUTE,
    DESCRIPTOR_SETS,
    SHADER,
    INPUT_ASSEMBLER,
    PIPELINE_LAYOUT,
    FRAMEBUFFER,
    // buffers
    PASS = 100,
    SUB_MODEL,
    MODEL,
    SCENE,
    CAMERA,
    NODE,
    ROOT,
    AABB,
    RENDER_WINDOW,
    FRUSTUM,
    AMBIENT,
    FOG,
    SKYBOX,
    SHADOW,
    LIGHT,
    SPHERE,
    INSTANCED_ATTRIBUTE,
    FLAT_BUFFER,
    SUB_MESH,
    // arrays
    SUB_MODEL_ARRAY = 200,
    MODEL_ARRAY,
    ATTRIBUTE_ARRAY,
    FLAT_BUFFER_ARRAY,
    INSTANCED_BUFFER_ARRAY,
    LIGHT_ARRAY,
    // raw buffer
    RAW_BUFFER = 300,
}

export const NULL_HANDLE = 0 as unknown as IHandle<any>;

export type RasterizerStateHandle = IHandle<PoolType.RASTERIZER_STATE>;
export type DepthStencilStateHandle = IHandle<PoolType.DEPTH_STENCIL_STATE>;
export type BlendStateHandle = IHandle<PoolType.BLEND_STATE>;
export type AttributeHandle = IHandle<PoolType.ATTRIBUTE>;
export type DescriptorSetHandle = IHandle<PoolType.DESCRIPTOR_SETS>;
export type ShaderHandle = IHandle<PoolType.SHADER>;
export type InputAssemblerHandle = IHandle<PoolType.INPUT_ASSEMBLER>;
export type PipelineLayoutHandle = IHandle<PoolType.PIPELINE_LAYOUT>;
export type FramebufferHandle = IHandle<PoolType.FRAMEBUFFER>;
export type PassHandle = IHandle<PoolType.PASS>;
export type SubModelHandle = IHandle<PoolType.SUB_MODEL>;
export type ModelHandle = IHandle<PoolType.MODEL>;
export type SceneHandle = IHandle<PoolType.SCENE>;
export type CameraHandle = IHandle<PoolType.CAMERA>;
export type NodeHandle = IHandle<PoolType.NODE>;
export type RootHandle = IHandle<PoolType.ROOT>;
export type AABBHandle = IHandle<PoolType.AABB>;
export type FrustumHandle = IHandle<PoolType.FRUSTUM>;
export type RenderWindowHandle = IHandle<PoolType.RENDER_WINDOW>;
export type SubModelArrayHandle = IHandle<PoolType.SUB_MODEL_ARRAY>;
export type AttributeArrayHandle = IHandle<PoolType.ATTRIBUTE_ARRAY>;
export type ModelArrayHandle = IHandle<PoolType.MODEL_ARRAY>;
export type RawBufferHandle = IHandle<PoolType.RAW_BUFFER>;
export type AmbientHandle = IHandle<PoolType.AMBIENT>;
export type FogHandle = IHandle<PoolType.FOG>;
export type SkyboxHandle = IHandle<PoolType.SKYBOX>;
export type ShadowsHandle = IHandle<PoolType.SHADOW>;
export type LightHandle = IHandle<PoolType.LIGHT>;
export type SphereHandle = IHandle<PoolType.SPHERE>;
export type SubMeshHandle = IHandle<PoolType.SUB_MESH>;
export type FlatBufferHandle = IHandle<PoolType.FLAT_BUFFER>;
export type FlatBufferArrayHandle = IHandle<PoolType.FLAT_BUFFER_ARRAY>;
export type LightArrayHandle = IHandle<PoolType.LIGHT_ARRAY>;

// don't reuse any of these data-only structs, for GFX objects may directly reference them
export const RasterizerStatePool = new ObjectPool(PoolType.RASTERIZER_STATE, (_: never[]) => new GFXRasterizerState());
export const DepthStencilStatePool = new ObjectPool(PoolType.DEPTH_STENCIL_STATE, (_: never[]) => new GFXDepthStencilState());
export const BlendStatePool = new ObjectPool(PoolType.BLEND_STATE, (_: never[]) => new GFXBlendState());

export const AttrPool = new ObjectPool(PoolType.ATTRIBUTE, (_: never[], obj?: GFXAttribute) => obj || new GFXAttribute());

// TODO: could use Labeled Tuple Element feature here after next babel update (required TS4.0+ support)
export const ShaderPool = new ObjectPool(PoolType.SHADER,
    (args: [GFXDevice, GFXShaderInfo], obj?: GFXShader) => obj ? (obj.initialize(args[1]), obj) : args[0].createShader(args[1]),
    (obj: GFXShader) => obj && obj.destroy(),
);
export const DSPool = new ObjectPool(PoolType.DESCRIPTOR_SETS,
    (args: [GFXDevice, GFXDescriptorSetInfo], obj?: GFXDescriptorSet) => obj ? (obj.initialize(args[1]), obj) : args[0].createDescriptorSet(args[1]),
    (obj: GFXDescriptorSet) => obj && obj.destroy(),
);
export const IAPool = new ObjectPool(PoolType.INPUT_ASSEMBLER,
    (args: [GFXDevice, GFXInputAssemblerInfo], obj?: GFXInputAssembler) => obj ? (obj.initialize(args[1]), obj) : args[0].createInputAssembler(args[1]),
    (obj: GFXInputAssembler) => obj && obj.destroy(),
);
export const PipelineLayoutPool = new ObjectPool(PoolType.PIPELINE_LAYOUT,
    (args: [GFXDevice, GFXPipelineLayoutInfo], obj?: GFXPipelineLayout) => obj ? (obj.initialize(args[1]), obj) : args[0].createPipelineLayout(args[1]),
    (obj: GFXPipelineLayout) => obj && obj.destroy(),
);
export const FramebufferPool = new ObjectPool(PoolType.FRAMEBUFFER,
    (args: [GFXDevice, GFXFramebufferInfo], obj?: GFXFramebuffer) => obj ? (obj.initialize(args[1]), obj) : args[0].createFramebuffer(args[1]),
    (obj: GFXFramebuffer) => obj && obj.destroy(),
);

export const SubModelArrayPool = new TypedArrayPool<PoolType.SUB_MODEL_ARRAY, Uint32ArrayConstructor, SubModelHandle>
(PoolType.SUB_MODEL_ARRAY, Uint32Array, 8, 4);
export const ModelArrayPool = new TypedArrayPool<PoolType.MODEL_ARRAY, Uint32ArrayConstructor, ModelHandle>(PoolType.MODEL_ARRAY, Uint32Array, 32, 16);
export const AttributeArrayPool = new TypedArrayPool<PoolType.ATTRIBUTE_ARRAY, Uint32ArrayConstructor, AttributeHandle>
(PoolType.ATTRIBUTE_ARRAY, Uint32Array, 8, 4);
export const FlatBufferArrayPool = new TypedArrayPool<PoolType.FLAT_BUFFER_ARRAY, Uint32ArrayConstructor, FlatBufferHandle>
(PoolType.FLAT_BUFFER_ARRAY, Uint32Array, 8, 4);
export const LightArrayPool = new TypedArrayPool<PoolType.LIGHT_ARRAY, Uint32ArrayConstructor, LightHandle>(PoolType.LIGHT_ARRAY, Uint32Array, 8, 4);

export const RawBufferPool = new BufferAllocator(PoolType.RAW_BUFFER);

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
    PIPELINE_LAYOUT,     // handle
    COUNT,
}
interface IPassViewType extends BufferTypeManifest<typeof PassView> {
    [PassView.PRIORITY]: number;
    [PassView.STAGE]: RenderPassStage;
    [PassView.PHASE]: number;
    [PassView.BATCHING_SCHEME]: BatchingSchemes;
    [PassView.PRIMITIVE]: GFXPrimitiveMode;
    [PassView.DYNAMIC_STATES]: GFXDynamicStateFlags;
    [PassView.HASH]: number;
    [PassView.RASTERIZER_STATE]: RasterizerStateHandle;
    [PassView.DEPTH_STENCIL_STATE]: DepthStencilStateHandle;
    [PassView.BLEND_STATE]: BlendStateHandle;
    [PassView.DESCRIPTOR_SET]: DescriptorSetHandle;
    [PassView.PIPELINE_LAYOUT]: PipelineLayoutHandle;
    [PassView.COUNT]: never;
}
const passViewDataType: BufferDataTypeManifest<typeof PassView> = {
    [PassView.PRIORITY]: BufferDataType.UINT32,
    [PassView.STAGE]: BufferDataType.UINT32,
    [PassView.PHASE]: BufferDataType.UINT32,
    [PassView.BATCHING_SCHEME]: BufferDataType.UINT32,
    [PassView.PRIMITIVE]: BufferDataType.UINT32,
    [PassView.DYNAMIC_STATES]: BufferDataType.UINT32,
    [PassView.HASH]: BufferDataType.UINT32,
    [PassView.RASTERIZER_STATE]: BufferDataType.UINT32,
    [PassView.DEPTH_STENCIL_STATE]: BufferDataType.UINT32,
    [PassView.BLEND_STATE]: BufferDataType.UINT32,
    [PassView.DESCRIPTOR_SET]: BufferDataType.UINT32,
    [PassView.PIPELINE_LAYOUT]: BufferDataType.UINT32,
    [PassView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const PassPool = new BufferPool<PoolType.PASS, typeof PassView, IPassViewType>(PoolType.PASS, passViewDataType, PassView);

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
    SUB_MESH,        // handle
    COUNT,
}
interface ISubModelViewType extends BufferTypeManifest<typeof SubModelView> {
    [SubModelView.PRIORITY]: number;
    [SubModelView.PASS_COUNT]: number;
    [SubModelView.PASS_0]: PassHandle;
    [SubModelView.PASS_1]: PassHandle;
    [SubModelView.PASS_2]: PassHandle;
    [SubModelView.PASS_3]: PassHandle;
    [SubModelView.SHADER_0]: ShaderHandle;
    [SubModelView.SHADER_1]: ShaderHandle;
    [SubModelView.SHADER_2]: ShaderHandle;
    [SubModelView.SHADER_3]: ShaderHandle;
    [SubModelView.DESCRIPTOR_SET]: DescriptorSetHandle;
    [SubModelView.INPUT_ASSEMBLER]: InputAssemblerHandle;
    [SubModelView.SUB_MESH]: SubMeshHandle;
    [SubModelView.COUNT]: never;
}
const subModelViewDataType: BufferDataTypeManifest<typeof SubModelView> = {
    [SubModelView.PRIORITY]: BufferDataType.UINT32,
    [SubModelView.PASS_COUNT]: BufferDataType.UINT32,
    [SubModelView.PASS_0]: BufferDataType.UINT32,
    [SubModelView.PASS_1]: BufferDataType.UINT32,
    [SubModelView.PASS_2]: BufferDataType.UINT32,
    [SubModelView.PASS_3]: BufferDataType.UINT32,
    [SubModelView.SHADER_0]: BufferDataType.UINT32,
    [SubModelView.SHADER_1]: BufferDataType.UINT32,
    [SubModelView.SHADER_2]: BufferDataType.UINT32,
    [SubModelView.SHADER_3]: BufferDataType.UINT32,
    [SubModelView.DESCRIPTOR_SET]: BufferDataType.UINT32,
    [SubModelView.INPUT_ASSEMBLER]: BufferDataType.UINT32,
    [SubModelView.SUB_MESH]: BufferDataType.UINT32,
    [SubModelView.COUNT]: BufferDataType.NEVER,
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const SubModelPool = new BufferPool<PoolType.SUB_MODEL, typeof SubModelView, ISubModelViewType>
    (PoolType.SUB_MODEL, subModelViewDataType, SubModelView);

export enum ModelView {
    ENABLED,
    VIS_FLAGS,
    CAST_SHADOW,
    WORLD_BOUNDS,         // handle
    NODE,                 // handle
    TRANSFORM,            // handle
    SUB_MODEL_ARRAY,      // array handle
    INSTANCED_BUFFER,     // raw buffer handle
    INSTANCED_ATTR_ARRAY, // array handle
    COUNT,
}
interface IModelViewType extends BufferTypeManifest<typeof ModelView> {
    [ModelView.ENABLED]: number;
    [ModelView.VIS_FLAGS]: number;
    [ModelView.CAST_SHADOW]: number;
    [ModelView.WORLD_BOUNDS]: AABBHandle;
    [ModelView.NODE]: NodeHandle;
    [ModelView.TRANSFORM]: NodeHandle;
    [ModelView.SUB_MODEL_ARRAY]: SubModelArrayHandle;
    [ModelView.INSTANCED_BUFFER]: RawBufferHandle;
    [ModelView.INSTANCED_ATTR_ARRAY]: AttributeArrayHandle;
    [ModelView.COUNT]: never;
}
const modelViewDataType: BufferDataTypeManifest<typeof ModelView> = {
    [ModelView.ENABLED]: BufferDataType.UINT32,
    [ModelView.VIS_FLAGS]: BufferDataType.UINT32,
    [ModelView.CAST_SHADOW]: BufferDataType.UINT32,
    [ModelView.WORLD_BOUNDS]: BufferDataType.UINT32,
    [ModelView.NODE]: BufferDataType.UINT32,
    [ModelView.TRANSFORM]: BufferDataType.UINT32,
    [ModelView.SUB_MODEL_ARRAY]: BufferDataType.UINT32,
    [ModelView.INSTANCED_BUFFER]: BufferDataType.UINT32,
    [ModelView.INSTANCED_ATTR_ARRAY]: BufferDataType.UINT32,
    [ModelView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const ModelPool = new BufferPool<PoolType.MODEL, typeof ModelView, IModelViewType>(PoolType.MODEL, modelViewDataType, ModelView);

export enum AABBView {
    CENTER,             // Vec3
    HALF_EXTENSION = 3, // Vec3
    COUNT = 6,
}
interface IAABBViewType extends BufferTypeManifest<typeof AABBView> {
    [AABBView.CENTER]: Vec3;
    [AABBView.HALF_EXTENSION]: Vec3;
    [AABBView.COUNT]: never;
}
const aabbViewDataType: BufferDataTypeManifest<typeof AABBView> = {
    [AABBView.CENTER]: BufferDataType.FLOAT32,
    [AABBView.HALF_EXTENSION]: BufferDataType.FLOAT32,
    [AABBView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const AABBPool = new BufferPool<PoolType.AABB, typeof AABBView, IAABBViewType>(PoolType.AABB, aabbViewDataType, AABBView);

export enum SceneView {
    MAIN_LIGHT,    // handle
    MODEL_ARRAY,   // array handle
    SPHERE_LIGHT_ARRAY, // array handle
    SPOT_LIGHT_ARRAY, // array handle
    COUNT,
}
interface ISceneViewType extends BufferTypeManifest<typeof SceneView> {
    [SceneView.MAIN_LIGHT]: LightHandle;
    [SceneView.MODEL_ARRAY]: ModelArrayHandle;
    [SceneView.SPHERE_LIGHT_ARRAY]: LightArrayHandle;
    [SceneView.SPOT_LIGHT_ARRAY]: LightArrayHandle;
    [SceneView.COUNT]: never;
}
const sceneViewDataType: BufferDataTypeManifest<typeof SceneView> = {
    [SceneView.MAIN_LIGHT]: BufferDataType.UINT32,
    [SceneView.MODEL_ARRAY]: BufferDataType.UINT32,
    [SceneView.SPHERE_LIGHT_ARRAY]: BufferDataType.UINT32,
    [SceneView.SPOT_LIGHT_ARRAY]: BufferDataType.UINT32,
    [SceneView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const ScenePool = new BufferPool<PoolType.SCENE, typeof SceneView, ISceneViewType>(PoolType.SCENE, sceneViewDataType, SceneView);

export enum CameraView {
    WIDTH,
    HEIGHT,
    EXPOSURE,
    CLEAR_FLAG,
    CLEAR_DEPTH,
    CLEAR_STENCIL,
    NODE,                   // handle
    SCENE,                  // handle
    FRUSTUM,                // handle
    FORWARD,                // Vec3
    POSITION = 12,          // Vec3
    VIEW_PORT = 15,         // Rect
    CLEAR_COLOR = 19,       // Color
    MAT_VIEW = 23,          // Mat4
    MAT_VIEW_PROJ = 39,     // Mat4
    MAT_VIEW_PROJ_INV = 55, // Mat4
    MAT_PROJ = 71,          // Mat4
    MAT_PROJ_INV = 87,      // Mat4
    COUNT = 103
}
interface ICameraViewType extends BufferTypeManifest<typeof CameraView> {
    [CameraView.WIDTH]: number;
    [CameraView.HEIGHT]: number;
    [CameraView.EXPOSURE]: number;
    [CameraView.CLEAR_FLAG]: GFXClearFlag;
    [CameraView.CLEAR_DEPTH]: number;
    [CameraView.CLEAR_STENCIL]: number;
    [CameraView.NODE]: NodeHandle;
    [CameraView.SCENE]: SceneHandle;
    [CameraView.FRUSTUM]: FrustumHandle;
    [CameraView.FORWARD]: Vec3;
    [CameraView.POSITION]: Vec3;
    [CameraView.VIEW_PORT]: Rect;
    [CameraView.CLEAR_COLOR]: IVec4Like;
    [CameraView.MAT_VIEW]: Mat4;
    [CameraView.MAT_VIEW_PROJ]: Mat4;
    [CameraView.MAT_VIEW_PROJ_INV]: Mat4;
    [CameraView.MAT_PROJ]: Mat4;
    [CameraView.MAT_PROJ_INV]: Mat4;
    [CameraView.COUNT]: never;
}
const cameraViewDataType: BufferDataTypeManifest<typeof CameraView> = {
    [CameraView.WIDTH]: BufferDataType.UINT32,
    [CameraView.HEIGHT]: BufferDataType.UINT32,
    [CameraView.EXPOSURE]: BufferDataType.FLOAT32,
    [CameraView.CLEAR_FLAG]: BufferDataType.UINT32,
    [CameraView.CLEAR_DEPTH]: BufferDataType.FLOAT32,
    [CameraView.CLEAR_STENCIL]: BufferDataType.UINT32,
    [CameraView.NODE]: BufferDataType.UINT32,
    [CameraView.SCENE]: BufferDataType.UINT32,
    [CameraView.FRUSTUM]: BufferDataType.UINT32,
    [CameraView.FORWARD]: BufferDataType.FLOAT32,
    [CameraView.POSITION]: BufferDataType.FLOAT32,
    [CameraView.VIEW_PORT]: BufferDataType.FLOAT32,
    [CameraView.CLEAR_COLOR]: BufferDataType.FLOAT32,
    [CameraView.MAT_VIEW]: BufferDataType.FLOAT32,
    [CameraView.MAT_VIEW_PROJ]: BufferDataType.FLOAT32,
    [CameraView.MAT_VIEW_PROJ_INV]: BufferDataType.FLOAT32,
    [CameraView.MAT_PROJ]: BufferDataType.FLOAT32,
    [CameraView.MAT_PROJ_INV]: BufferDataType.FLOAT32,
    [CameraView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const CameraPool = new BufferPool<PoolType.CAMERA, typeof CameraView, ICameraViewType>(PoolType.CAMERA, cameraViewDataType, CameraView);

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
    [NodeView.LAYER]: Layers.Enum;
    [NodeView.WORLD_SCALE]: Vec3;
    [NodeView.WORLD_POSITION]: Vec3;
    [NodeView.WORLD_ROTATION]: Quat;
    [NodeView.WORLD_MATRIX]: Mat4;
    [NodeView.COUNT]: never;
}
const nodeViewDataType: BufferDataTypeManifest<typeof NodeView> = {
    [NodeView.FLAGS_CHANGED]: BufferDataType.UINT32,
    [NodeView.LAYER]: BufferDataType.UINT32,
    [NodeView.WORLD_SCALE]: BufferDataType.FLOAT32,
    [NodeView.WORLD_POSITION]: BufferDataType.FLOAT32,
    [NodeView.WORLD_ROTATION]: BufferDataType.FLOAT32,
    [NodeView.WORLD_MATRIX]: BufferDataType.FLOAT32,
    [NodeView.COUNT]: BufferDataType.NEVER
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) { delete NodeView[NodeView.COUNT]; NodeView[NodeView.COUNT = NodeView.LAYER + 1] = 'COUNT'; }
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const NodePool = new BufferPool<PoolType.NODE, typeof NodeView, INodeViewType>(PoolType.NODE, nodeViewDataType, NodeView);

export enum RootView {
    CUMULATIVE_TIME,
    FRAME_TIME,
    COUNT
}
interface IRootViewType extends BufferTypeManifest<typeof RootView> {
    [RootView.CUMULATIVE_TIME]: number;
    [RootView.FRAME_TIME]: number;
    [RootView.COUNT]: never;
}
const rootViewDataType: BufferDataTypeManifest<typeof RootView> = {
    [RootView.CUMULATIVE_TIME]: BufferDataType.FLOAT32,
    [RootView.FRAME_TIME]: BufferDataType.FLOAT32,
    [RootView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const RootPool = new BufferPool<PoolType.ROOT, typeof RootView, IRootViewType>(PoolType.ROOT, rootViewDataType, RootView, 1);

export enum RenderWindowView {
    HAS_ON_SCREEN_ATTACHMENTS,
    HAS_OFF_SCREEN_ATTACHMENTS,
    FRAMEBUFFER,  // handle
    COUNT
}
interface IRenderWindowViewType extends BufferTypeManifest<typeof RenderWindowView> {
    [RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS]: number;
    [RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS]: number;
    [RenderWindowView.FRAMEBUFFER]: FramebufferHandle;
    [RenderWindowView.COUNT]: never;
}
const renderWindowDataType: BufferDataTypeManifest<typeof RenderWindowView> = {
    [RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS]: BufferDataType.UINT32,
    [RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS]: BufferDataType.UINT32,
    [RenderWindowView.FRAMEBUFFER]: BufferDataType.UINT32,
    [RenderWindowView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const RenderWindowPool = new BufferPool<PoolType.RENDER_WINDOW, typeof RenderWindowView, IRenderWindowViewType>
    (PoolType.RENDER_WINDOW, renderWindowDataType, RenderWindowView, 2);

export enum FrustumView {
    VERTICES,    // Vec3[8]
    PLANES = 24, // plane[6]
    COUNT = 48
}
interface IFrustumViewType extends BufferTypeManifest<typeof FrustumView> {
    [FrustumView.VERTICES]: Vec3;
    [FrustumView.PLANES]: plane;
    [FrustumView.COUNT]: never;
}
const frustumViewDataType: BufferDataTypeManifest<typeof FrustumView> = {
    [FrustumView.VERTICES]: BufferDataType.FLOAT32,
    [FrustumView.PLANES]: BufferDataType.FLOAT32,
    [FrustumView.COUNT]: BufferDataType.NEVER,
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const FrustumPool = new BufferPool<PoolType.FRUSTUM, typeof FrustumView, IFrustumViewType>(PoolType.FRUSTUM, frustumViewDataType, FrustumView);

export enum AmbientView {
    ENABLE,
    ILLUM,
    SKY_COLOR,         // Vec4
    GROUND_ALBEDO = 6, // Vec4
    COUNT = 10
}
interface IAmbientViewType extends BufferTypeManifest<typeof AmbientView> {
    [AmbientView.ENABLE]: number;
    [AmbientView.ILLUM]: number;
    [AmbientView.SKY_COLOR]: Color;
    [AmbientView.GROUND_ALBEDO]: Color;
    [AmbientView.COUNT]: never;
}
const ambientViewDataType: BufferDataTypeManifest<typeof AmbientView> = {
    [AmbientView.ENABLE]: BufferDataType.UINT32,
    [AmbientView.ILLUM]: BufferDataType.FLOAT32,
    [AmbientView.SKY_COLOR]: BufferDataType.FLOAT32,
    [AmbientView.GROUND_ALBEDO]: BufferDataType.FLOAT32,
    [AmbientView.COUNT]: BufferDataType.NEVER
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete AmbientView[AmbientView.COUNT]; AmbientView[AmbientView.COUNT = AmbientView.ILLUM + 1] = 'COUNT'; }
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const AmbientPool = new BufferPool<PoolType.AMBIENT, typeof AmbientView, IAmbientViewType>(PoolType.AMBIENT, ambientViewDataType, AmbientView, 1);

export enum SkyboxView {
    ENABLE,
    IS_RGBE,
    USE_IBL,
    MODEL,
    COUNT
}
interface ISkyboxViewType extends BufferTypeManifest<typeof SkyboxView> {
    [SkyboxView.ENABLE]: number;
    [SkyboxView.IS_RGBE]: number;
    [SkyboxView.USE_IBL]: number;
    [SkyboxView.MODEL]: ModelHandle;
    [SkyboxView.COUNT]: never;
}
const skyboxDataType: BufferDataTypeManifest<typeof SkyboxView> = {
    [SkyboxView.ENABLE]: BufferDataType.UINT32,
    [SkyboxView.IS_RGBE]: BufferDataType.UINT32,
    [SkyboxView.USE_IBL]: BufferDataType.UINT32,
    [SkyboxView.MODEL]: BufferDataType.UINT32,
    [SkyboxView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const SkyboxPool = new BufferPool<PoolType.SKYBOX, typeof SkyboxView, ISkyboxViewType>(PoolType.SKYBOX, skyboxDataType, SkyboxView, 1);

export enum FogView {
    ENABLE,
    TYPE,
    DENSITY,
    START,
    END,
    ATTEN,
    TOP,
    RANGE,
    COLOR,
    COUNT = 12
}
interface IFogViewType extends BufferTypeManifest<typeof FogView> {
    [FogView.ENABLE]: number;
    [FogView.TYPE]: number;
    [FogView.DENSITY]: number;
    [FogView.START]: number;
    [FogView.END]: number;
    [FogView.ATTEN]: number;
    [FogView.TOP]: number;
    [FogView.RANGE]: number;
    [FogView.COLOR]: Color;
    [FogView.COUNT]: never;
}
const fogViewDataType: BufferDataTypeManifest<typeof FogView> = {
    [FogView.ENABLE]: BufferDataType.UINT32,
    [FogView.TYPE]: BufferDataType.UINT32,
    [FogView.DENSITY]: BufferDataType.FLOAT32,
    [FogView.START]: BufferDataType.FLOAT32,
    [FogView.END]: BufferDataType.FLOAT32,
    [FogView.ATTEN]: BufferDataType.FLOAT32,
    [FogView.TOP]: BufferDataType.FLOAT32,
    [FogView.RANGE]: BufferDataType.FLOAT32,
    [FogView.COLOR]: BufferDataType.FLOAT32,
    [FogView.COUNT]: BufferDataType.NEVER
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete FogView[FogView.COUNT]; FogView[FogView.COUNT = FogView.RANGE + 1] = 'COUNT'; }
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const FogPool = new BufferPool<PoolType.FOG, typeof FogView, IFogViewType>(PoolType.FOG, fogViewDataType, FogView);

export enum ShadowsView {
    ENABLE,
    DIRTY,
    TYPE,
    DISTANCE,
    INSTANCE_PASS,
    PLANAR_PASS,
    NEAR,
    FAR,
    ASPECT,
    PCF_TYPE,
    BIAS,
    ORTHO_SIZE,
    SPHERE, // handle
    SIZE, // Vec2
    NORMAL = 15, // Vec3
    COLOR = 18, // Vec4
    MAT_LIGHT = 22, // Mat4
    COUNT = 38
}
interface IShadowsViewType extends BufferTypeManifest<typeof ShadowsView> {
    [ShadowsView.ENABLE]: number;
    [ShadowsView.TYPE]: number;
    [ShadowsView.DISTANCE]: number;
    [ShadowsView.INSTANCE_PASS]: PassHandle;
    [ShadowsView.PLANAR_PASS]: PassHandle;
    [ShadowsView.NEAR]: number;
    [ShadowsView.FAR]: number;
    [ShadowsView.ASPECT]: number;
    [ShadowsView.PCF_TYPE]: number;
    [ShadowsView.BIAS]: number;
    [ShadowsView.DIRTY]: number;
    [ShadowsView.ORTHO_SIZE]: number;
    [ShadowsView.SPHERE]: number;
    [ShadowsView.SIZE]: Vec2;
    [ShadowsView.NORMAL]: Vec3;
    [ShadowsView.COLOR]: Color;
    [ShadowsView.MAT_LIGHT]: Mat4;
    [ShadowsView.COUNT]: never;
}
const shadowsViewDataType: BufferDataTypeManifest<typeof ShadowsView> = {
    [ShadowsView.ENABLE]: BufferDataType.UINT32,
    [ShadowsView.TYPE]: BufferDataType.UINT32,
    [ShadowsView.DISTANCE]: BufferDataType.FLOAT32,
    [ShadowsView.INSTANCE_PASS]: BufferDataType.UINT32,
    [ShadowsView.PLANAR_PASS]: BufferDataType.UINT32,
    [ShadowsView.NEAR]: BufferDataType.FLOAT32,
    [ShadowsView.FAR]: BufferDataType.FLOAT32,
    [ShadowsView.ASPECT]: BufferDataType.FLOAT32,
    [ShadowsView.PCF_TYPE]: BufferDataType.UINT32,
    [ShadowsView.BIAS]: BufferDataType.FLOAT32,
    [ShadowsView.DIRTY]: BufferDataType.UINT32,
    [ShadowsView.ORTHO_SIZE]: BufferDataType.UINT32,
    [ShadowsView.SIZE]: BufferDataType.FLOAT32,
    [ShadowsView.NORMAL]: BufferDataType.FLOAT32,
    [ShadowsView.COLOR]: BufferDataType.FLOAT32,
    [ShadowsView.SPHERE]: BufferDataType.UINT32,
    [ShadowsView.MAT_LIGHT]: BufferDataType.FLOAT32,
    [ShadowsView.COUNT]: BufferDataType.NEVER
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete ShadowsView[ShadowsView.COUNT]; ShadowsView[ShadowsView.COUNT = ShadowsView.SPHERE + 1] = 'COUNT'; }
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const ShadowsPool = new BufferPool<PoolType.SHADOW, typeof ShadowsView, IShadowsViewType>(PoolType.SHADOW, shadowsViewDataType, ShadowsView, 1);

export enum LightView {
    USE_COLOR_TEMPERATURE,
    ILLUMINANCE,
    NODE,                       // handle
    RANGE,
    TYPE,
    AABB,       // handle
    FRUSTUM,    // handle
    SIZE,
    SPOT_ANGLE,
    DIRECTION,                  // Vec3
    COLOR = 12,                  // Vec3
    COLOR_TEMPERATURE_RGB = 15,  // Vec3
    POSITION = 18,               // Vec3
    COUNT = 21
}
interface ILightViewType extends BufferTypeManifest<typeof LightView> {
    [LightView.USE_COLOR_TEMPERATURE]: number;
    [LightView.ILLUMINANCE]: number;
    [LightView.NODE]:NodeHandle;
    [LightView.RANGE]:number;
    [LightView.TYPE]:number;
    [LightView.AABB]:AABBHandle;
    [LightView.FRUSTUM]:FrustumHandle;
    [LightView.SIZE]:number;
    [LightView.SPOT_ANGLE]:number;
    [LightView.DIRECTION]: Vec3;
    [LightView.COLOR]: Vec3;
    [LightView.COLOR_TEMPERATURE_RGB]: Vec3;
    [LightView.POSITION]: Vec3;
    [LightView.COUNT]: never;
}
const lightViewDataType: BufferDataTypeManifest<typeof LightView> = {
    [LightView.USE_COLOR_TEMPERATURE]: BufferDataType.UINT32,
    [LightView.ILLUMINANCE]: BufferDataType.FLOAT32,
    [LightView.NODE]: BufferDataType.UINT32,
    [LightView.RANGE]: BufferDataType.FLOAT32,
    [LightView.TYPE]: BufferDataType.UINT32,
    [LightView.AABB]: BufferDataType.UINT32,
    [LightView.FRUSTUM]: BufferDataType.UINT32,
    [LightView.SIZE]: BufferDataType.FLOAT32,
    [LightView.SPOT_ANGLE]: BufferDataType.FLOAT32,
    [LightView.DIRECTION]: BufferDataType.FLOAT32,
    [LightView.COLOR]: BufferDataType.FLOAT32,
    [LightView.COLOR_TEMPERATURE_RGB]: BufferDataType.FLOAT32,
    [LightView.POSITION]: BufferDataType.FLOAT32,
    [LightView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const LightPool = new BufferPool<PoolType.LIGHT, typeof LightView, ILightViewType>(PoolType.LIGHT, lightViewDataType, LightView, 3);

export enum SphereView {
    RADIUS,
    CENTER,     // Vec3
    COUNT = 4
}
interface ISphereViewType extends BufferTypeManifest<typeof SphereView> {
    [SphereView.RADIUS]: number;
    [SphereView.CENTER]: Vec3;
    [SphereView.COUNT]: never;
}
const sphereViewDataType: BufferDataTypeManifest<typeof SphereView> = {
    [SphereView.RADIUS]: BufferDataType.FLOAT32,
    [SphereView.CENTER]: BufferDataType.FLOAT32,
    [SphereView.COUNT]: BufferDataType.NEVER
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete SphereView[SphereView.COUNT]; SphereView[SphereView.COUNT = SphereView.RADIUS + 1] = 'COUNT'; }
export const SpherePool = new BufferPool<PoolType.SPHERE, typeof SphereView, ISphereViewType>(PoolType.SPHERE, sphereViewDataType, SphereView, 3);

export enum FlatBufferView {
    STRIDE,
    AMOUNT,
    BUFFER, // raw buffer handle
    COUNT,
}
interface IFlatBufferViewType extends BufferTypeManifest<typeof FlatBufferView> {
    [FlatBufferView.STRIDE]: number;
    [FlatBufferView.AMOUNT]: number;
    [FlatBufferView.BUFFER]: RawBufferHandle;
    [FlatBufferView.COUNT]: never;
}
const flatBufferViewDataType: BufferDataTypeManifest<typeof FlatBufferView> = {
    [FlatBufferView.STRIDE]: BufferDataType.UINT32,
    [FlatBufferView.AMOUNT]: BufferDataType.UINT32,
    [FlatBufferView.BUFFER]: BufferDataType.UINT32,
    [FlatBufferView.COUNT]: BufferDataType.NEVER
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const FlatBufferPool = new BufferPool<PoolType.FLAT_BUFFER, typeof FlatBufferView, IFlatBufferViewType>
    (PoolType.FLAT_BUFFER, flatBufferViewDataType, FlatBufferView, 3);

export enum SubMeshView {
    FLAT_BUFFER_ARRAY,    // array handle
    COUNT,
}
interface ISubMeshViewType extends BufferTypeManifest<typeof SubMeshView> {
    [SubMeshView.FLAT_BUFFER_ARRAY]: FlatBufferArrayHandle;
    [SubMeshView.COUNT]: never;
}
const subMeshViewDataType: BufferDataTypeManifest<typeof SubMeshView> = {
    [SubMeshView.FLAT_BUFFER_ARRAY]: BufferDataType.UINT32,
    [SubMeshView.COUNT]: BufferDataType.NEVER,
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const SubMeshPool = new BufferPool<PoolType.SUB_MESH, typeof SubMeshView, ISubMeshViewType>
    (PoolType.SUB_MESH, subMeshViewDataType, SubMeshView, 3);
