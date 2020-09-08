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

import { DEBUG, JSB } from 'internal:constants';
import { NativeBufferPool, NativeObjectPool, NativeArrayPool } from './native-pools';
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState, IGFXDescriptorSetInfo,
    GFXDevice, GFXDescriptorSet, GFXShaderInfo, GFXShader, IGFXInputAssemblerInfo, GFXInputAssembler,
    IGFXPipelineLayoutInfo, GFXPipelineLayout, GFXFramebuffer, IGFXFramebufferInfo, GFXPrimitiveMode, GFXDynamicStateFlags, GFXClearFlag } from '../../gfx';
import { RenderPassStage } from '../../pipeline/define';
import { BatchingSchemes } from './pass';
import { Vec3, Mat4, Color, Rect, Quat, Vec4, Vec2 } from '../../math';
import { Layers } from '../../scene-graph/layers';
import { plane } from '../../geometry';

type Vec4Compatibles = Color | Rect | Quat | Vec4 | plane;


interface ITypedArrayConstructor<T> {
    new(buffer: ArrayBufferLike, byteOffset: number, length?: number): T;
    readonly BYTES_PER_ELEMENT: number;
}

// a little hacky, but works (different specializations should not be assignable to each other)
interface IHandle<T extends PoolType> extends Number {
    // we make this non-optional so that even plain numbers would not be directly assignable to handles.
    // this strictness will introduce some casting hassle in the pool implementation itself
    // but becomes generally more useful for client code type checking.
    _: T;
}

type BufferManifest = { [key: string]: number | string; COUNT: number; };
type StandardBufferElement = number | IHandle<any>;
type GeneralBufferElement = StandardBufferElement | Vec3 | Mat4 | Vec4Compatibles | Vec2;
type BufferTypeManifest<E extends BufferManifest> = { [key in E[keyof E]]: GeneralBufferElement };

type Conditional<V, T> = T extends V ? T : never;

class BufferPool<P extends PoolType, T extends TypedArray, E extends BufferManifest, M extends BufferTypeManifest<E>> {

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

    constructor (poolType: P, viewCtor: ITypedArrayConstructor<T>, enumType: E, entryBits = 8) {
        this._viewCtor = viewCtor;
        this._elementCount = enumType.COUNT;
        this._entryBits = entryBits;

        const bytesPerElement = viewCtor.BYTES_PER_ELEMENT || 1;
        this._stride = bytesPerElement * this._elementCount;
        this._entriesPerChunk = 1 << entryBits;
        this._entryMask = this._entriesPerChunk - 1;
        this._poolFlag = 1 << 30;
        this._chunkMask = ~(this._entryMask | this._poolFlag);
        this._nativePool = new NativeBufferPool(poolType, entryBits, this._stride);
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
        const bufferViews: T[] = [];
        const freelist: number[] = [];
        for (let j = 0; j < this._entriesPerChunk; j++) {
            bufferViews.push(new this._viewCtor(buffer, this._stride * j, this._elementCount));
            if (j) { freelist.push(j); }
        }
        this._arrayBuffers.push(buffer);
        this._bufferViews.push(bufferViews);
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
    public get<K extends E[keyof E]> (handle: IHandle<P>, element: K): Conditional<StandardBufferElement, M[K]> {
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return 0 as Conditional<StandardBufferElement, M[K]>;
        }
        return this._bufferViews[chunk][entry][element as number] as Conditional<StandardBufferElement, M[K]>;
    }

    public set<K extends E[keyof E]> (handle: IHandle<P>, element: K, value: Conditional<StandardBufferElement, M[K]>) {
        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        this._bufferViews[chunk][entry][element as number] = value as number;
    }

    public setVec2<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec2: Conditional<Vec2, M[K]>) {
        // Web engine has Vec2 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = this._bufferViews[chunk][entry];
        view[index++] = vec2.x; view[index++] = vec2.y;
    }

    public setVec3<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec3: Conditional<Vec3, M[K]>) {
        // Web engine has Vec3 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = this._bufferViews[chunk][entry];
        view[index++] = vec3.x; view[index++] = vec3.y; view[index] = vec3.z;
    }

    public setVec4<K extends E[keyof E]> (handle: IHandle<P>, element: K, vec4: Conditional<Vec4Compatibles, M[K]>) {
        // Web engine has Vec4 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = this._bufferViews[chunk][entry];
        view[index++] = vec4.x; view[index++] = vec4.y;
        view[index++] = vec4.z; view[index]   = vec4.w;
    }

    public setMat4<K extends E[keyof E]> (handle: IHandle<P>, element: K, mat4: Conditional<Mat4, M[K]>) {
        // Web engine has mat4 property, don't record it in shared memory.
        if (!JSB) return;

        const chunk = (this._chunkMask & handle as unknown as number) >> this._entryBits;
        const entry = this._entryMask & handle as unknown as number;
        if (DEBUG && (!handle || chunk < 0 || chunk >= this._bufferViews.length ||
            entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find((n) => n === entry))) {
            console.warn('invalid buffer pool handle');
            return;
        }
        let index = element as unknown as number;
        const view = this._bufferViews[chunk][entry];
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
        this._bufferViews[chunk][entry].fill(0);
        this._freelists[chunk].push(entry);
    }
}

class ObjectPool<T, P extends PoolType, A extends any[]> {

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

/**
 * P: pool type
 * D: pool data type
 */
export class ArrayPool<P extends PoolType, D extends PoolType> {
    private _nativeArrayPool: NativeArrayPool;
    private _arrayMap: Map<number, Uint32Array> = new Map<number, Uint32Array>();
    private _curArrayHandle: number = 0;
    private _arrayHandleFlag: number;
    private _arrayHandleMask: number;
    private _size: number = 0;
    private _step: number = 0;

    /**
     * Constructor.
     * @param size The size of the array
     * @param step The step size to extend the array when exceeding the array size.
     * It is the same as size if it is not set.
     */
    constructor (arrayType: P, size: number, step?: number) {
        this._arrayHandleFlag = 1 << 30;
        this._arrayHandleMask = ~this._arrayHandleFlag;
        this._size = size + 1;
        this._step = step || size;
        this._nativeArrayPool = new NativeArrayPool(arrayType, this._size);
    }

    /**
     * Allocate a new array.
     * @param size The size of the array
     * @param step The step size to extend the array when exceeding the array size.
     * It is the same as size if it is not set.
     */
    public alloc (): IHandle<P> {
        const handle = this._curArrayHandle++;
        const array = this._nativeArrayPool.alloc(handle);
        this._arrayMap.set(handle, array);

        return (handle | this._arrayHandleFlag) as unknown as IHandle<P>;
    }

    public free (handle: IHandle<P>) {
        const arrayHandle = this._arrayHandleMask & handle as unknown as number;
        if (this._arrayMap.get(arrayHandle) === undefined) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }
        this._arrayMap.delete(arrayHandle);
    }

    public assign (handle: IHandle<P>, index: number, value: IHandle<D>) {
        const arrayHandle = this._arrayHandleMask & handle as unknown as number;
        let array = this._arrayMap.get(arrayHandle);
        if (array === undefined) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        // First element is the length of array.
        index = index + 1;
        if (index >= array.length) {
            let length = array.length;
            while (index >= length) {
                length += this._step;
            }

            array = this._nativeArrayPool.resize(array, length);
            this._arrayMap.set(arrayHandle, array);
        }
        array[index] = value as unknown as number;

        // There may be holes in the array.
        const len = array[0];
        array[0] = index > len ? index : len;
    }

    public erase (handle: IHandle<P>, index: number) {
        const array = this._arrayMap.get(this._arrayHandleMask & handle as unknown as number);
        if (array === undefined || index > array[0]) {
            if (DEBUG) console.warn('invalid array pool index or invalid array handle');
            return;
        }
        for (let i = index + 1; i < array[0]; ++i) {
            array[i] = array[i + 1];
        }
        --array[0];
    }

    public push (handle: IHandle<P>, value: IHandle<D>) {
        const array = this._arrayMap.get(this._arrayHandleMask & handle as unknown as number);
        if (array === undefined) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        this.assign(handle, array[0], value);
    }

    public pop (handle: IHandle<P>) {
        const array = this._arrayMap.get(this._arrayHandleMask & handle as unknown as number);
        if (array === undefined) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }

        if (array[0] === 0) {
            return;
        } else {
            --array[0];
        }
    }

    /**
     * Clear the contents of array.
     * @param handle Handle to be clear.
     */
    public clear (handle: IHandle<P>) {
        const array = this._arrayMap.get(this._arrayHandleMask & handle as unknown as number);
        if (array === undefined) {
            if (DEBUG) console.warn('invalid array pool handle');
            return;
        }
        array[0] = 0;
    }
};

enum PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
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
    // array
    SUB_MODEL_ARRAY = 200,
    MODEL_ARRAY,
}

export const NULL_HANDLE = 0 as unknown as IHandle<any>;

export type RasterizerStateHandle = IHandle<PoolType.RASTERIZER_STATE>;
export type DepthStencilStateHandle = IHandle<PoolType.DEPTH_STENCIL_STATE>;
export type BlendStateHandle = IHandle<PoolType.BLEND_STATE>;
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
export type ModelArrayHandle = IHandle<PoolType.MODEL_ARRAY>;
export type AmbientHandle = IHandle<PoolType.AMBIENT>;
export type FogHandle = IHandle<PoolType.FOG>;
export type SkyboxHandle = IHandle<PoolType.SKYBOX>;
export type ShadowsHandle = IHandle<PoolType.SHADOW>;

// don't reuse any of these data-only structs, for GFX objects may directly reference them
export const RasterizerStatePool = new ObjectPool(PoolType.RASTERIZER_STATE, () => new GFXRasterizerState());
export const DepthStencilStatePool = new ObjectPool(PoolType.DEPTH_STENCIL_STATE, () => new GFXDepthStencilState());
export const BlendStatePool = new ObjectPool(PoolType.BLEND_STATE, () => new GFXBlendState());

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
export const PipelineLayoutPool = new ObjectPool(PoolType.PIPELINE_LAYOUT,
    (args: [GFXDevice, IGFXPipelineLayoutInfo], obj?: GFXPipelineLayout) => obj ? (obj.initialize(args[1]), obj) : args[0].createPipelineLayout(args[1]),
    (obj: GFXPipelineLayout) => obj && obj.destroy(),
);
export const FramebufferPool = new ObjectPool(PoolType.FRAMEBUFFER,
    (args: [GFXDevice, IGFXFramebufferInfo], obj?: GFXFramebuffer) => obj ? (obj.initialize(args[1]), obj) : args[0].createFramebuffer(args[1]),
    (obj: GFXFramebuffer) => obj && obj.destroy(),
);

export const SubModelArrayPool = new ArrayPool<PoolType.SUB_MODEL_ARRAY, PoolType.SUB_MODEL>(PoolType.SUB_MODEL_ARRAY, 10);
export const ModelArrayPool = new ArrayPool<PoolType.MODEL_ARRAY, PoolType.MODEL>(PoolType.MODEL_ARRAY, 50, 10);

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
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const PassPool = new BufferPool<PoolType.PASS, Uint32Array, typeof PassView, IPassViewType>(PoolType.PASS, Uint32Array, PassView);

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
    [SubModelView.COUNT]: never;
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const SubModelPool = new BufferPool<PoolType.SUB_MODEL, Uint32Array, typeof SubModelView, ISubModelViewType>
    (PoolType.SUB_MODEL, Uint32Array, SubModelView);

export enum ModelView {
    ENABLED,
    VIS_FLAGS,
    CAST_SHADOW,
    WORLD_BOUNDS,    // handle
    NODE,            // handle
    TRANSFORM,       // handle
    SUB_MODEL_ARRAY, // array handle
    COUNT
}
interface IModelViewType extends BufferTypeManifest<typeof ModelView> {
    [ModelView.ENABLED]: number;
    [ModelView.VIS_FLAGS]: number;
    [ModelView.CAST_SHADOW]: number;
    [ModelView.WORLD_BOUNDS]: AABBHandle;
    [ModelView.NODE]: NodeHandle;
    [ModelView.TRANSFORM]: NodeHandle;
    [ModelView.SUB_MODEL_ARRAY]: SubModelArrayHandle;
    [ModelView.COUNT]: never;
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const ModelPool = new BufferPool<PoolType.MODEL, Uint32Array, typeof ModelView, IModelViewType>(PoolType.MODEL, Uint32Array, ModelView);

export enum AABBView {
    CENTER,             // Vec3
    HALF_EXTENSION = 3, // Vec3
    COUNT = 6
}
interface IAABBViewType extends BufferTypeManifest<typeof AABBView> {
    [AABBView.CENTER]: Vec3;
    [AABBView.HALF_EXTENSION]: Vec3;
    [AABBView.COUNT]: never;
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const AABBPool = new BufferPool<PoolType.AABB, Float32Array, typeof AABBView, IAABBViewType>(PoolType.AABB, Float32Array, AABBView);

export enum SceneView {
    MAIN_LIGHT,    // TODO
    AMBIENT,       // TODO
    FOG,           // TODO
    SKYBOX,        // TODO
    PLANAR_SHADOW, // TODO
    MODEL_ARRAY,   // array handle
    COUNT,
}
interface ISceneViewType extends BufferTypeManifest<typeof SceneView> {
    [SceneView.MAIN_LIGHT]: number;
    [SceneView.AMBIENT]: number;
    [SceneView.FOG]: number;
    [SceneView.SKYBOX]: number;
    [SceneView.PLANAR_SHADOW]: number;
    [SceneView.MODEL_ARRAY]: ModelArrayHandle;
    [SceneView.COUNT]: never;
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const ScenePool = new BufferPool<PoolType.SCENE, Uint32Array, typeof SceneView, ISceneViewType>(PoolType.SCENE, Uint32Array, SceneView);

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
    [CameraView.CLEAR_COLOR]: Color;
    [CameraView.MAT_VIEW]: Mat4;
    [CameraView.MAT_VIEW_PROJ]: Mat4;
    [CameraView.MAT_VIEW_PROJ_INV]: Mat4;
    [CameraView.MAT_PROJ]: Mat4;
    [CameraView.MAT_PROJ_INV]: Mat4;
    [CameraView.COUNT]: never;
}
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const CameraPool = new BufferPool<PoolType.CAMERA, Float32Array, typeof CameraView, ICameraViewType>(PoolType.CAMERA, Float32Array, CameraView);

export enum NodeView {
    LAYER,
    WORLD_SCALE,        // Vec3
    WORLD_POSITION = 4, // Vec3
    WORLD_ROTATION = 7, // Quat
    WORLD_MATRIX = 11,  // Mat4
    COUNT = 27
}
interface INodeViewType extends BufferTypeManifest<typeof NodeView> {
    [NodeView.LAYER]: Layers.Enum;
    [NodeView.WORLD_SCALE]: Vec3;
    [NodeView.WORLD_POSITION]: Vec3;
    [NodeView.WORLD_ROTATION]: Quat;
    [NodeView.WORLD_MATRIX]: Mat4;
    [NodeView.COUNT]: never;
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) { delete NodeView[NodeView.COUNT]; NodeView[NodeView.COUNT = NodeView.LAYER + 1] = 'COUNT'; }
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const NodePool = new BufferPool<PoolType.NODE, Float32Array, typeof NodeView, INodeViewType>(PoolType.NODE, Float32Array, NodeView);

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
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const RootPool = new BufferPool<PoolType.ROOT, Float32Array, typeof RootView, IRootViewType>(PoolType.ROOT, Float32Array, RootView, 1);

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
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const RenderWindowPool = new BufferPool<PoolType.RENDER_WINDOW, Uint32Array, typeof RenderWindowView, IRenderWindowViewType>
    (PoolType.RENDER_WINDOW, Uint32Array, RenderWindowView, 2);

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
// Theoretically we only have to declare the type view here while all the other arguments can be inferred.
// but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
// we'll have to explicitly declare all these types.
export const FrustumPool = new BufferPool<PoolType.FRUSTUM, Float32Array, typeof FrustumView, IFrustumViewType>(PoolType.FRUSTUM, Float32Array, FrustumView);

export enum AmbientView {
    ENABLE,
    ILLUM,
    SKY_COLOR, // vec4
    GROUND_ALBEDO = 6, // vec4
    COUNT = 10
}
interface IAmbientViewType extends BufferTypeManifest<typeof AmbientView> {
    [AmbientView.ENABLE]: number;
    [AmbientView.ILLUM]: number;
    [AmbientView.SKY_COLOR]: Color;
    [AmbientView.GROUND_ALBEDO]: Color;
    [AmbientView.COUNT]: never;
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete AmbientView[AmbientView.COUNT]; AmbientView[AmbientView.COUNT = AmbientView.ILLUM + 1] = 'COUNT'; }
export const AmbientPool = new BufferPool<PoolType.AMBIENT, Float32Array, typeof AmbientView, IAmbientViewType>(PoolType.AMBIENT, Float32Array, AmbientView, 1);

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
export const SkyboxPool = new BufferPool<PoolType.SKYBOX, Float32Array, typeof SkyboxView, ISkyboxViewType>(PoolType.SKYBOX, Float32Array, SkyboxView, 1);

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
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete FogView[FogView.COUNT]; FogView[FogView.COUNT = FogView.RANGE + 1] = 'COUNT'; }
export const FogPool = new BufferPool<PoolType.FOG, Float32Array, typeof FogView, IFogViewType>(PoolType.FOG, Float32Array, FogView);

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
    ORTHO_SIZE,
    SIZE, // Vec2
    NORMAL = 13, // Vec3
    COLOR = 16, // Vec4
    SPHERE = 20, // Vec4
    COUNT = 24
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
    [ShadowsView.DIRTY]: number;
    [ShadowsView.ORTHO_SIZE]: number;
    [ShadowsView.SIZE]: Vec2;
    [ShadowsView.NORMAL]: Vec3;
    [ShadowsView.COLOR]: Color;
    [ShadowsView.SPHERE]: Vec4;
    [ShadowsView.COUNT]: never;
}
// @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.
if (!JSB) {delete ShadowsView[FogView.COUNT]; ShadowsView[ShadowsView.COUNT = ShadowsView.ORTHO_SIZE + 1] = 'COUNT'; }
export const ShadowsPool = new BufferPool<PoolType.SHADOW, Float32Array, typeof ShadowsView, IShadowsViewType>(PoolType.SHADOW, Float32Array, ShadowsView, 1);

