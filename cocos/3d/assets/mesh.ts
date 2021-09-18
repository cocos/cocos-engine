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
 * @module asset
 */

import { ccclass, serializable } from 'cc.decorator';
import { Asset } from '../../core/assets/asset';
import { BufferBlob } from '../misc/buffer-blob';
import { Skeleton } from './skeleton';
import { AABB } from '../../core/geometry';
import { legacyCC } from '../../core/global-exports';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { sys } from '../../core/platform/sys';
import { warnID } from '../../core/platform/debug';
import { RenderingSubMesh } from '../../core/assets';
import {
    Attribute, Device, Buffer, BufferInfo, AttributeName, BufferUsageBit, Feature, Format,
    FormatInfos, FormatType, MemoryUsageBit, PrimitiveMode, getTypedArrayConstructor, FormatInfo,
} from '../../core/gfx';
import { IVec3Like, IVec4Like, Mat4, Quat, Vec3, Vec4 } from '../../core/math';
import { MorphRendering, createMorphRendering } from './morph';
import { gfx } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { removeAt } from '../../core/utils/array';

function getIndexStrideCtor (stride: number) {
    switch (stride) {
    case 1: return Uint8Array;
    case 2: return Uint16Array;
    case 4: return Uint32Array;
    default: return Uint8Array;
    }
}

export declare namespace Mesh {
    export interface IBufferView {
        offset: number;
        length: number;
        count: number;
        stride: number;
    }

    /**
     * @en Vertex bundle, it describes a set of interleaved vertex attributes and their values.
     * @zh 顶点块。顶点块描述了一组**交错排列**（interleaved）的顶点属性并存储了顶点属性的实际数据。<br>
     * 交错排列是指在实际数据的缓冲区中，每个顶点的所有属性总是依次排列，并总是出现在下一个顶点的所有属性之前。
     */
    export interface IVertexBundle {
        /**
         * @en The actual value for all vertex attributes.
         * You must use DataView to access the data.
         * @zh 所有顶点属性的实际数据块。
         * 你必须使用 DataView 来读取数据。
         * 因为不能保证所有属性的起始偏移都按 TypedArray 要求的字节对齐。
         */
        view: IBufferView;

        /**
         * @en All attributes included in the bundle
         * @zh 包含的所有顶点属性。
         */
        attributes: Attribute[];
    }

    /**
     * @en Sub mesh contains a list of primitives with the same type (Point, Line or Triangle)
     * @zh 子网格。子网格由一系列相同类型的图元组成（例如点、线、面等）。
     */
    export interface ISubMesh {
        /**
         * @en The vertex bundle references used by the sub mesh.
         * @zh 此子网格引用的顶点块，索引至网格的顶点块数组。
         */
        vertexBundelIndices: number[];

        /**
         * @en The primitive mode of the sub mesh
         * @zh 此子网格的图元类型。
         */
        primitiveMode: PrimitiveMode;

        /**
         * @en The index data of the sub mesh
         * @zh 此子网格使用的索引数据。
         */
        indexView?: IBufferView;

        /**
         * @en The joint map index in [[IStruct.jointMaps]]. Could be absent
         * @zh 此子网格使用的关节索引映射表在 [[IStruct.jointMaps]] 中的索引。
         * 如未定义或指向的映射表不存在，则默认 VB 内所有关节索引数据直接对应骨骼资源数据。
         */
        jointMapIndex?: number;
    }

    /**
     * @en The structure of the mesh
     * @zh 描述了网格的结构。
     */
    export interface IStruct {
        /**
         * @en All vertex bundles of the mesh
         * @zh 此网格所有的顶点块。
         */
        vertexBundles: IVertexBundle[];

        /**
         * @en All sub meshes
         * @zh 此网格的所有子网格。
         */
        primitives: ISubMesh[];

        /**
         * @en The minimum position of all vertices in the mesh
         * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
         */
        minPosition?: Vec3;

        /**
         * @en The maximum position of all vertices in the mesh
         * @zh （各分量都）大于等于此网格任何顶点位置的最小位置。
         */
        maxPosition?: Vec3;

        /**
         * @en The joint index map list.
         * @zh 此网格使用的关节索引映射关系列表，数组长度应为子模型中实际使用到的所有关节，
         * 每个元素都对应一个原骨骼资源里的索引，按子模型 VB 内的实际索引排列。
         */
        jointMaps?: number[][];

        /**
         * @en The morph information of the mesh
         * @zh 网格的形变数据
         */
        morph?: {
            /**
             * Morph data of each sub-mesh.
             */
            subMeshMorphs: ({
                /**
                 * Attributes to morph.
                 */
                attributes: AttributeName[];

                /**
                 * Targets.
                 */
                targets: {
                    /**
                     * Displacement of each target attribute.
                     */
                    displacements: Mesh.IBufferView[];
                }[];

                /**
                 * Initial weights of each target.
                 */
                weights?: number[];
            } | null)[];

            /**
             * Common initial weights of each sub-mesh.
             */
            weights?: number[];

            /**
             * Name of each target of each sub-mesh morph.
             * This field is only meaningful if every sub-mesh has the same number of targets.
             */
            targetNames?: string[];
        };
    }

    export interface ICreateInfo {
        /**
         * @en Mesh structure
         * @zh 网格结构。
         */
        struct: Mesh.IStruct;

        /**
         * @en Mesh binary data
         * @zh 网格二进制数据。
         */
        data: Uint8Array;
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();
const globalEmptyMeshBuffer = new Uint8Array();

type TypedArrayView = TypedArray;

interface Layout {
    streams: Array<{
        attributes: Array<{
            name: Attribute['name'];
            format: Attribute['format'];
            location?: Attribute['location'];
            isNormalized?: Attribute['isNormalized'];
            isInstanced?: Attribute['isInstanced'];
        }>;
    }>;
}

interface SubMeshMorph {
    /**
     * Attributes to morph.
     */
    attributes: AttributeName[];

    /**
     * Targets.
     */
    targets: Array<{
        name?: string;
        displacements: Float32Array[];
    }>;

    /**
     * Initial weights of each target.
     */
    weights?: number[];
}

const hasSameVertexLayoutTag = Symbol('hasSameLayout');

const fromLegacySubMeshTag = Symbol('fromLegacySubMesh');

const flushTag = Symbol('flush');

const dirtyTag = Symbol('dirty');

type IndexFormat = Format.R8UI | Format.R16UI | Format.R32UI;

class SubMesh {
    public static [fromLegacySubMeshTag] (
        legacyPrimitive: Mesh.ISubMesh,
        legacyVertexBundles: Mesh.IVertexBundle[],
        legacyBuffer: ArrayBuffer,
        legacyBufferByteOffset: number,
    ) {
        const {
            primitiveMode,
            jointMapIndex,
            vertexBundelIndices,
            indexView: legacyIndexView,
        } = legacyPrimitive;

        const subMesh = new SubMesh();
        subMesh.primitiveMode = primitiveMode;
        subMesh.jointMapIndex = jointMapIndex;

        let nVertices = 0;
        const layout: Layout = {
            streams: vertexBundelIndices.map((vertexBundleIndex) => {
                const vertexBundle = legacyVertexBundles[vertexBundleIndex];
                nVertices = Math.max(nVertices, vertexBundle.view.count);
                return {
                    attributes: vertexBundle.attributes.map((legacyAttributeView): Layout['streams'][0]['attributes'][0] => ({
                        name: legacyAttributeView.name,
                        format: legacyAttributeView.format,
                        location: legacyAttributeView.location,
                        isNormalized: legacyAttributeView.isNormalized,
                        isInstanced: legacyAttributeView.isInstanced,
                    })),
                };
            }),
        };
        subMesh.rearrange(layout, nVertices);

        const { _streams: streams } = subMesh;
        assertIsTrue(streams.length === vertexBundelIndices.length);
        vertexBundelIndices.forEach((vertexBundleIndex, iVertexBundle) => {
            const vertexBundle = legacyVertexBundles[vertexBundleIndex];
            const stream = streams[iVertexBundle];
            const vertexBundleData = new Uint8Array(
                legacyBuffer,
                legacyBufferByteOffset + vertexBundle.view.offset,
                vertexBundle.view.length,
            );
            stream.data.set(vertexBundleData);
        });

        if (legacyIndexView) {
            let indexFormat: IndexFormat;
            switch (legacyIndexView.stride) {
            default: assertIsTrue(false); // fallthrough
            case 1: indexFormat = Format.R8UI; break;
            case 2: indexFormat =  Format.R16UI; break;
            case 4: indexFormat =  Format.R32UI; break;
            }
            subMesh.rearrangeIndices(indexFormat, legacyIndexView.count);
            assertIsTrue(subMesh.indices);
            const indices = new (getIndexStrideCtor(legacyIndexView.stride))(
                legacyBuffer,
                legacyBufferByteOffset + legacyIndexView.offset,
                legacyIndexView.count,
            );
            subMesh.indices.set(indices);
        }

        return subMesh;
    }

    /**
     * The count of the vertices in this sub mesh.
     */
    get vertexCount () {
        return this._vertexCount;
    }

    /**
     * The primitive mode of this sub mesh.
     */
    get primitiveMode () {
        return this._primitiveMode;
    }

    set primitiveMode (value) {
        this._primitiveMode = value;
    }

    get attributeNames () {
        return Object.keys(this._attributes);
    }

    get morph () {
        return this._morph;
    }

    set morph (value) {
        this._morph = value;
    }

    get indices () {
        return this._indices;
    }

    public jointMapIndex?: number;

    public [dirtyTag] = false;

    /**
     * Returns if this sub mesh has specified attribute.
     * @param attributeName The attribute's name.
     * @returns True if this sub mesh has specified attribute.
     */
    public hasAttribute (attributeName: string) {
        return attributeName in this._attributes;
    }

    /**
     * Gets the format of specified attribute.
     * @param attributeName The attribute's name.
     * @returns The attribute's format.
     */
    public getAttributeFormat (attributeName: string) {
        return this._attributes[attributeName].format;
    }

    /**
     * Creates an attribute view which views the specified attribute.
     * @param from Index to the start vertex.
     * @param count Count of vertices to view.
     * @returns The attribute view.
     */
    public viewAttribute (attributeName: string, from?: number, count?: number): VertexAttributeView {
        const { _attributes: attributes, _vertexCount: myVertexCount } = this;

        from ??= 0;
        count ??= myVertexCount - from;

        if (!(attributeName in attributes)) {
            throw new Error(`Nonexisting attribute ${attributeName}`);
        }

        const attribute = attributes[attributeName];
        const { data: streamData, stride } = this._streams[attribute.stream];
        const attributeFormat = attribute.format;
        const attributeStride = getComponentByteLength(attributeFormat) * FormatInfos[attributeFormat].count;
        if (attribute.streamOffset === 0 && stride === attributeStride) {
            return new CompactVertexAttributeView(
                streamData.buffer,
                streamData.byteOffset + stride * from,
                attributeFormat,
                count,
            );
        } else {
            return new InterleavedVertexAttributeView(
                streamData.buffer,
                streamData.byteOffset + stride * from,
                attribute.streamOffset,
                stride,
                attributeFormat,
                count,
            );
        }
    }

    /**
     * Resizes vertex count of specified sub mesh.
     * @param newVertexCount New vertex count.
     * @description If resize to a larger size, whole old data is kept;
     * otherwise only `vertexCount` of attributes is kept.
     */
    public resize (newVertexCount: number) {
        const { _vertexCount: oldVertexCount } = this;
        const verticesToKeep = Math.min(oldVertexCount, newVertexCount);
        this._vertexCount = newVertexCount;
        this._streams.forEach((stream) => {
            const { data: oldStreamData, stride } = stream;
            const newStreamData = new Uint8Array(stride * newVertexCount);
            newStreamData.set(oldStreamData.subarray(0, verticesToKeep * stride));
            stream.data = newStreamData;
        });
        this[dirtyTag] = true;
    }

    /**
     * Rearranges the layout of this sub mesh. All old data would be erased.
     * @param layout New layout.
     * @param vertexCount New vertex count.
     */
    public rearrange (layout: Layout, vertexCount: number) {
        const meshAttributes: SubMesh['_attributes'] = {};
        const streams: SubMesh['_streams'] = layout.streams.map(({ attributes: attributeDescriptions }, streamIndex) => {
            let stride = 0;
            attributeDescriptions.forEach(({ name, format }) => {
                const offset = stride;
                stride += FormatInfos[format].size;
                meshAttributes[name] = {
                    name: name as AttributeName,
                    format,
                    stream: streamIndex,
                    streamOffset: offset,
                };
            });
            const buffer = new Uint8Array(stride * vertexCount);
            return {
                data: buffer,
                stride,
            };
        });
        this._vertexCount = vertexCount;
        this._streams = streams;
        this._attributes = meshAttributes;
        this[dirtyTag] = true;
    }

    /**
     * Rearranges the format and count of indices.
     * @param format
     * @param indexCount
     */
    public rearrangeIndices (format: IndexFormat, indexCount: number) {
        type IndexStorageConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
        let IndexStorage: IndexStorageConstructor;
        switch (format) {
        default: assertIsTrue(false); // fallthrough
        case Format.R8UI: IndexStorage = Uint8Array; break;
        case Format.R16UI: IndexStorage = Uint16Array; break;
        case Format.R32UI: IndexStorage = Uint32Array; break;
        }
        this._indices = new IndexStorage(indexCount);
        this[dirtyTag] = true;
    }

    /**
     * Remove indices data.
     */
    public removeIndices () {
        this._indices = null;
        this[dirtyTag] = true;
    }

    public clone () {
        const that = new SubMesh();
        that._primitiveMode = this._primitiveMode;
        that._indices = this._indices?.slice() ?? null;
        that._streams = this._streams.map(({ data, stride }) => ({
            data: data.slice(),
            stride,
        }));
        that._vertexCount = this._vertexCount;
        for (const attributeName in this._attributes) {
            that._attributes[attributeName] = {
                ...this._attributes[attributeName],
            };
        }
        if (this._morph) {
            that._morph = {
                attributes: this._morph.attributes.slice(),
                targets: this._morph.targets.map(({ displacements }) => ({
                    displacements: displacements.slice(),
                })),
            };
        }
        return that;
    }

    public createRenderingSubMesh (gfxDevice: gfx.Device): RenderingSubMesh | null {
        const {
            _vertexCount: vertexCount,
            _indices: indices,
        } = this;

        // Prepare index buffer
        let indexBuffer: Buffer | null = null;
        if (indices) {
            const stride = indices.BYTES_PER_ELEMENT;
            let remoteStride = stride;
            let remoteSize = indices.length;
            if (stride === 4 && !gfxDevice.hasFeature(Feature.ELEMENT_INDEX_UINT)) {
                if (vertexCount >= 65536) {
                    warnID(10001, vertexCount, 65536);
                    return null; // Ignore this primitive
                } else {
                    remoteStride >>= 1; // Reduce to short.
                    remoteSize >>= 1;
                }
            }
            indexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX,
                MemoryUsageBit.DEVICE,
                remoteSize,
                remoteStride,
            ));

            const localBuffer = stride === remoteStride ? indices : getIndexStrideCtor(remoteStride).from(indices);
            indexBuffer.update(localBuffer);
        }

        // Prepare vertex buffers
        const vertexBuffers = this._streams.map(({ stride, data: streamData }) => {
            const vertexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX,
                MemoryUsageBit.DEVICE,
                streamData.byteLength,
                stride,
            ));
            vertexBuffer.update(streamData);
            return vertexBuffer;
        });

        // Prepare attributes
        const gfxAttributes = Object.entries(this._attributes).map(([name, attribute]) => {
            const gfxAttribute = new Attribute(
                attribute.name,
                attribute.format,
                attribute.isNormalized,
                attribute.stream,
                attribute.isInstanced,
                attribute.location,
            );
            return gfxAttribute;
        });

        const renderingSubMesh = new RenderingSubMesh(
            vertexBuffers,
            gfxAttributes,
            this._primitiveMode,
            indexBuffer,
        );

        return renderingSubMesh;
    }

    /**
     * Flush vertices for rendering.
     * You should ensure the vertex's layout and size are not changed your own.
     */
    public [flushTag] (renderingSubMesh: RenderingSubMesh) {
        this._streams.forEach(({ data: streamData }, streamIndex) => {
            const vertexBuffer = renderingSubMesh.vertexBuffers[streamIndex];
            vertexBuffer.update(streamData);
        });
    }

    public [hasSameVertexLayoutTag] (that: SubMesh) {
        if (this._primitiveMode !== that._primitiveMode) {
            return false;
        }

        const thisAttributeNames = Object.keys(this._attributes);
        const thatAttributeNames = Object.keys(that._attributes);
        if (thisAttributeNames.length !== thatAttributeNames.length) {
            return false;
        }

        for (const attributeName of thisAttributeNames) {
            const thisAttribute = this._attributes[attributeName];
            const thatAttribute = that._attributes[attributeName];
            if (!thatAttribute) {
                return false;
            }
            if (thisAttribute.format !== thatAttribute.format
                || thisAttribute.stream !== thatAttribute.stream
                || thisAttribute.streamOffset !== thatAttribute.streamOffset) {
                return false;
            }
        }

        return true;
    }

    private _primitiveMode: gfx.PrimitiveMode = gfx.PrimitiveMode.TRIANGLE_LIST;
    private _indices: Uint8Array | Uint16Array | Uint32Array | null = null;
    private _streams: Array<{
        data: Uint8Array;
        stride: number;
    }> = [];
    private _vertexCount = 0;
    private _attributes: Record<string, {
        name: gfx.AttributeName;
        format: gfx.Format;
        stream: number;
        streamOffset: number;
        isNormalized?: boolean;
        isInstanced?: boolean;
        location?: number;
    }> = {};
    private _morph: SubMeshMorph | null = null;
}

/**
 * Export type only since we don't want external world call its constructor.
 */
export type { SubMesh };

export interface VertexAttributeView {
    /**
     * Number of vertices this view views.
     */
    readonly vertexCount: number;

    /**
     * Number of component of per attribute.
     */
    readonly componentCount: number;

    /**
     * Creates a sub range which views the same attribute channel.
     * @param from Index to the start vertex.
     * @param end Index to the end vertex.
     * @returns The new view.
     */
    subarray(from?: number, end?: number): VertexAttributeView;

    set (view: VertexAttributeView, offset?: number): void;

    /**
     * Gets specified component of the specified vertex.
     * @param vertexIndex Index to the vertex.
     * @param componentIndex Index to the component.
     * @returns The component's value.
     */
    getComponent(vertexIndex: number, componentIndex: number): number;

    /**
     * Sets specified component of the specified vertex.
     * @param vertexIndex Index to the vertex.
     * @param componentIndex Index to the component.
     * @param value The value being set to the component.
     */
    setComponent (vertexIndex: number, componentIndex: number, value: number): void;

    /**
     * Reads vertices and returns the result into an array.
     * @param vertexCount Vertex count. If not specified, all vertices would be read.
     * @param storageConstructor Result array's constructor.
     */
    read<
        TStorageConstructor extends TypedArrayConstructor | ArrayConstructor
    >(vertexCount?: number, storageConstructor?: TStorageConstructor): InstanceType<TStorageConstructor>;

    /**
     * Reads vertices into specified array.
     * @param storage The array.
     * @param vertexCount Number of vertices to read. If not specified, all vertices would be read.
     */
    read<TStorage extends TypedArray | number[]>(storage: TStorage, vertexCount?: number): TStorage;

    /**
     * Writes vertices.
     * @param source Attribute data.
     * @param from Index to the start vertex to write. Defaults to 0.
     * @param to Index to the end vertex to write. Defaults to the view's count.
     */
    write (source: ArrayLike<number>, from?: number, to?: number): void;
}

class VertexAttributeViewBase {
    constructor (vertexCount: number, componentCount: number, typedArrayConstructor: TypedArrayConstructor) {
        this._vertexCount = vertexCount;
        this._componentCount = componentCount;
        this._typedArrayConstructor = typedArrayConstructor;
    }

    get vertexCount () {
        return this._vertexCount;
    }

    get componentCount () {
        return this._componentCount;
    }

    public getComponent (vertexIndex: number, componentIndex: number): number {
        throw new Error(`Not implemented`);
    }

    public setComponent (vertexIndex: number, componentIndex: number, value: number) {
        throw new Error(`Not implemented`);
    }

    public set (view: VertexAttributeView, offset?: number) {
        offset ??= 0;

        const { _vertexCount: myVertexCount, _componentCount: nComponents } = this;

        assertIsTrue(this.componentCount === view.componentCount);

        const nVerticesToCopy = Math.min(view.vertexCount, myVertexCount - offset);
        for (let iVertex = 0; iVertex < nVerticesToCopy; ++iVertex) {
            for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
                const value = view.getComponent(iVertex, iComponent);
                this.setComponent(offset + iVertex, iComponent, value);
            }
        }
    }

    public read<
        TStorageConstructor extends TypedArrayConstructor | ArrayConstructor
    >(vertexCount?: number, storageConstructor?: TStorageConstructor): InstanceType<TStorageConstructor>;

    public read<TStorage extends TypedArray | number[]>(storage: TStorage, vertexCount?: number): TStorage;

    public read (param0: unknown, param1: unknown): unknown {
        const {
            _vertexCount: myVertexCount,
            _typedArrayConstructor: DefaultTypedArrayConstructor,
            _componentCount: nComponents,
        } = this;

        let storage: TypedArray | number[];
        let vertexCount: number;
        if (typeof param0 === 'object') {
            // Storage + Vertex count
            vertexCount = (param1 as number | undefined) ?? myVertexCount;
            storage = param0 as typeof storage;
        } else {
            // Vertex count, Storage constructor
            vertexCount = (param0 as number | undefined) ?? myVertexCount;
            if (param1 === Array) {
                storage = new Array(vertexCount).fill(0);
            } else {
                const StorageConstructor = (param1 as TypedArrayConstructor | undefined)
                    ?? DefaultTypedArrayConstructor;
                storage = new StorageConstructor(nComponents * vertexCount);
            }
        }

        for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
            for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
                storage[nComponents * iVertex + iComponent] = this.getComponent(iVertex, iComponent);
            }
        }

        return storage;
    }

    public write (source: ArrayLike<number>, from?: number, to?: number) {
        const {
            _vertexCount: myVertexCount,
            _typedArrayConstructor: DefaultTypedArrayConstructor,
            _componentCount: nComponents,
        } = this;

        from ??= 0;
        to ??= myVertexCount;

        for (let iVertex = from; iVertex < to; ++iVertex) {
            for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
                this.setComponent(iVertex, iComponent, source[nComponents * iVertex + iComponent]);
            }
        }
    }

    protected _vertexCount: number;

    protected _componentCount: number;

    private _typedArrayConstructor: TypedArrayConstructor;
}

class InterleavedVertexAttributeView extends VertexAttributeViewBase implements VertexAttributeView {
    constructor (buffer: ArrayBuffer, byteOffset: number, attributeOffset: number, stride: number, format: gfx.Format, count: number) {
        super(count, FormatInfos[format].count, getTypedArrayConstructor(FormatInfos[format]));
        this._dataView = new DataView(buffer, byteOffset + attributeOffset, stride * count - attributeOffset);
        this._vertexCount = count;
        this._attributeOffset = attributeOffset;
        this._stride = stride;
        this._format = format;
        this._reader = getDataViewReader(FormatInfos[format]);
        this._writer = getDataViewWriter(FormatInfos[format]);
        this._componentBytes = getComponentByteLength(format);
    }

    public getComponent (vertexIndex: number, componentIndex: number) {
        const {
            _dataView: dataView,
            _stride: stride,
            _componentBytes: componentBytes,
            _reader: reader,
        } = this;
        return reader(
            dataView,
            stride * vertexIndex + componentBytes * componentIndex,
        );
    }

    public setComponent (vertexIndex: number, componentIndex: number, value: number) {
        const {
            _dataView: dataView,
            _stride: stride,
            _componentBytes: componentBytes,
            _writer: writer,
        } = this;
        writer(
            dataView,
            stride * vertexIndex + componentBytes * componentIndex,
            value,
        );
    }

    public subarray (from?: number, end?: number) {
        from ??= 0;
        end ??= this._vertexCount;

        return new InterleavedVertexAttributeView(
            this._dataView.buffer,
            (this._dataView.byteOffset - this._attributeOffset) + this._stride * from,
            this._attributeOffset,
            this._stride,
            this._format,
            end - from,
        );
    }

    private _dataView: DataView;
    private _stride: number;
    private _attributeOffset: number;
    private _format: gfx.Format;
    private _reader: ReturnType<typeof getDataViewReader>;
    private _writer: ReturnType<typeof getDataViewWriter>;
    private _componentBytes: number;
}

class CompactVertexAttributeView extends VertexAttributeViewBase implements VertexAttributeView {
    constructor (buffer: ArrayBuffer, byteOffset: number, format: gfx.Format, count: number) {
        super(count, FormatInfos[format].count, getTypedArrayConstructor(FormatInfos[format]));
        const Constructor = getTypedArrayConstructor(FormatInfos[format]);
        const components = FormatInfos[format].count;
        this._array = new Constructor(buffer, byteOffset, components * count);
        this._vertexCount = count;
        this._format = format;
    }

    public getComponent (vertexIndex: number, componentIndex: number) {
        return this._array[this._componentCount * vertexIndex + componentIndex];
    }

    public setComponent (vertexIndex: number, componentIndex: number, value: number) {
        this._array[this._componentCount * vertexIndex + componentIndex] = value;
    }

    public subarray (from?: number, end?: number) {
        from ??= 0;
        end ??= this._vertexCount;

        return new CompactVertexAttributeView(
            this._array.buffer,
            this._array.byteOffset + this._array.BYTES_PER_ELEMENT * this._componentCount * from,
            this._format,
            end - from,
        );
    }

    public set (view: VertexAttributeView, offset?: number) {
        offset ??= 0;
        assertIsTrue(this.componentCount === view.componentCount);
        if (view instanceof CompactVertexAttributeView) {
            this._array.set(view._array, this._componentCount * offset);
        } else {
            super.set(view, offset);
        }
    }

    private _array: TypedArray;
    private _format: gfx.Format;
}

export class VertexAttributeVec3View {
    constructor (baseView: VertexAttributeView) {
        assertIsTrue(baseView.componentCount === 3);
        this._baseView = baseView;
    }

    get view () {
        return this._baseView;
    }

    public get (vertexIndex: number, out?: Vec3) {
        out ??= new Vec3();
        out.x = this._baseView.getComponent(vertexIndex, 0);
        out.y = this._baseView.getComponent(vertexIndex, 1);
        out.z = this._baseView.getComponent(vertexIndex, 2);
        return out;
    }

    public set (vertexIndex: number, value: Readonly<IVec3Like>) {
        this._baseView.setComponent(vertexIndex, 0, value.x);
        this._baseView.setComponent(vertexIndex, 1, value.y);
        this._baseView.setComponent(vertexIndex, 2, value.z);
    }

    private _baseView: VertexAttributeView;
}

export class VertexAttributeVec4View {
    constructor (baseView: VertexAttributeView) {
        assertIsTrue(baseView.componentCount === 4);
        this._baseView = baseView;
    }

    get view () {
        return this._baseView;
    }

    public get (vertexIndex: number, out?: Vec4) {
        out ??= new Vec4();
        out.x = this._baseView.getComponent(vertexIndex, 0);
        out.y = this._baseView.getComponent(vertexIndex, 1);
        out.z = this._baseView.getComponent(vertexIndex, 2);
        out.w = this._baseView.getComponent(vertexIndex, 3);
        return out;
    }

    public set (vertexIndex: number, value: Readonly<IVec4Like>) {
        this._baseView.setComponent(vertexIndex, 0, value.x);
        this._baseView.setComponent(vertexIndex, 1, value.y);
        this._baseView.setComponent(vertexIndex, 2, value.z);
        this._baseView.setComponent(vertexIndex, 3, value.w);
    }

    private _baseView: VertexAttributeView;
}

const DEFAULT_MIN_POSITION = new Vec3(Infinity, Infinity, Infinity);

const DEFAULT_MAX_POSITION = new Vec3(-Infinity, -Infinity, -Infinity);

enum MeshEventType {
    RENDERING_SUB_MESH_RECONSTITUTED = 'rendering-sub-mesh-reconstituted',
}

/**
 * @en Mesh asset
 * @zh 网格资源。
 */
@ccclass('cc.Mesh')
export class Mesh extends Asset {
    public static EventType = MeshEventType;

    get _nativeAsset (): ArrayBuffer {
        return this._data.buffer;
    }

    set _nativeAsset (value: ArrayBuffer) {
        this._data = new Uint8Array(value);
    }

    /**
     * @en The sub meshes count of the mesh.
     * @zh 此网格的子网格数量。
     */
    get subMeshCount () {
        return this.subMeshes.length;
    }

    /**
     * @en The sub meshes of the mesh.
     * @zh 此网格的子网格。
     */
    get subMeshes () {
        return this._subMeshes;
    }

    /**
     * @en The minimum position of all vertices in the mesh
     * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
     */
    get minPosition () {
        return this._minPosition;
    }

    /**
     * @en The maximum position of all vertices in the mesh
     * @zh （各分量都）大于等于此网格任何顶点位置的最大位置。
     */
    get maxPosition () {
        return this._maxPosition;
    }

    /**
     * @en The struct of the mesh
     * @zh 此网格的结构。
     * @deprecated Deprecated.
     */
    get struct () {
        return this._struct;
    }

    /**
     * @en The actual data of the mesh
     * @zh 此网格的数据。
     * @deprecated Deprecated.
     */
    get data () {
        return this._data;
    }

    /**
     * @en The hash of the mesh
     * @zh 此网格的哈希值。
     */
    get hash () {
        // hashes should already be computed offline, but if not, make one
        if (!this._hash) { this._hash = murmurhash2_32_gc(this._data, 666); }
        return this._hash;
    }

    @serializable
    public jointMaps?: number[][];

    /**
     * The index of the joint buffer of all sub meshes in the joint map buffers
     */
    get jointBufferIndices () {
        if (this._jointBufferIndices) { return this._jointBufferIndices; }
        return this._jointBufferIndices = this._subMeshes.map(({ jointMapIndex = 0 }) => jointMapIndex);
    }

    /**
     * @en The sub meshes for rendering. Mesh could be split into different sub meshes for rendering.
     * @zh 此网格创建的渲染网格。
     */
    public get renderingSubMeshes () {
        this.initialize();
        return this._renderingSubMeshes!;
    }

    public morphRendering: MorphRendering | null = null;

    private _struct: Mesh.IStruct = {
        vertexBundles: [],
        primitives: [],
    };

    @serializable
    private _subMeshes: SubMesh[] = [];

    @serializable
    private _minPosition = new Vec3();

    @serializable
    private _maxPosition = new Vec3();

    @serializable
    private _hash = 0;

    private _data: Uint8Array = globalEmptyMeshBuffer;

    private _legacyMeshDataSynchronized = true;

    private _initialized = false;

    private _dirty = false;

    private _renderingSubMeshes: RenderingSubMesh[] | null = null;

    private _boneSpaceBounds: Map<number, (AABB | null)[]> = new Map();

    private _jointBufferIndices: number[] | null = null;

    constructor () {
        super();
    }

    public initialize () {
        if (this._initialized) {
            return;
        }

        this._syncLegacyMeshData();

        this._initialized = true;
        const gfxDevice: Device = legacyCC.director.root.device;

        this._renderingSubMeshes = [];
        const renderingSubMeshes = this._renderingSubMeshes;
        this._subMeshes.forEach((subMesh, subMeshIndex) => {
            subMesh[dirtyTag] = false;
            const renderingSubMesh = subMesh.createRenderingSubMesh(gfxDevice);
            if (!renderingSubMesh) { // Failed to create
                return;
            }
            renderingSubMesh.mesh = this;
            renderingSubMesh.subMeshIdx = subMeshIndex;
            renderingSubMeshes.push(renderingSubMesh);
        });

        const hasMorphData = this._subMeshes.some((subMesh) => !!subMesh.morph);
        if (hasMorphData) {
            this.morphRendering = createMorphRendering(this, gfxDevice);
        }
    }

    /**
     * @en Destroy the mesh and release all related GPU resources
     * @zh 销毁此网格，并释放它占有的所有 GPU 资源。
     */
    public destroy () {
        this.destroyRenderingMesh();
        return super.destroy();
    }

    /**
     * @en Release all related GPU resources
     * @zh 释放此网格占有的所有 GPU 资源。
     */
    public destroyRenderingMesh () {
        if (this._renderingSubMeshes) {
            for (let i = 0; i < this._renderingSubMeshes.length; i++) {
                this._renderingSubMeshes[i].destroy();
            }
            this._renderingSubMeshes = null;
            this._initialized = false;
        }
    }

    /**
     * Appends a sub mesh into this mesh.
     * @returns The sub mesh.
     */
    public addSubMesh () {
        const subMesh = new SubMesh();
        this._subMeshes.push(subMesh);
        this._dirty = true;
        return subMesh;
    }

    /**
     * Removes a sub mesh.
     * @param subMeshIndex Index to the sub mesh.
     */
    public removeSubMesh (subMeshIndex: number) {
        removeAt(this._subMeshes, subMeshIndex);
        this._dirty = true;
    }

    /**
     * Gets the specified index.
     * @param subMeshIndex Index to the sub mesh.
     * @returns The sub mesh.
     */
    public getSubMesh (subMeshIndex: number) {
        return this._subMeshes[subMeshIndex];
    }

    /**
     * Returns if any of the sub mesh has morph data.
     * @returns True if any of the sub mesh has morph data.
     */
    public hasMorph () {
        return this.subMeshes.some((subMesh) => !!subMesh.morph);
    }

    /**
     * @en Reset the struct and data of the mesh
     * @zh 重置此网格的结构和数据。
     * @param struct The new struct
     * @param data The new data
     * @deprecated Will be removed in v3.0.0, please use [[reset]] instead
     */
    public assign (struct: Mesh.IStruct, data: Uint8Array) {
        this.reset({
            struct,
            data,
        });
    }

    /**
     * @en Reset the mesh with mesh creation information
     * @zh 重置此网格。
     * @param info Mesh creation information including struct and data
     * @deprecated Deprecated.
     */
    public reset (info: Mesh.ICreateInfo) {
        this.destroyRenderingMesh();
        this._struct = info.struct;
        this._data = info.data;
        this._legacyMeshDataSynchronized = false;
        this._hash = 0;
    }

    /**
     * Flush all sub meshes data for rendering.
     */
    public flush () {
        const {
            _subMeshes: subMeshes,
            _renderingSubMeshes: renderingSubMeshes,
        } = this;
        if (!renderingSubMeshes) {
            return;
        }
        const nSubMeshes = subMeshes.length;

        let reconstitutedNeeded = false;
        if (this._dirty) {
            reconstitutedNeeded = true;
            this._dirty = false;
        }
        if (!reconstitutedNeeded) {
            for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
                const dirty = subMeshes[iSubMesh][dirtyTag];
                if (dirty) {
                    reconstitutedNeeded = true;
                }
            }
        }

        if (reconstitutedNeeded) {
            this.destroyRenderingMesh();
            this.initialize();
            this.emit(MeshEventType.RENDERING_SUB_MESH_RECONSTITUTED);
        } else {
            expect(renderingSubMeshes.length === nSubMeshes);
            for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
                subMeshes[iSubMesh][flushTag](renderingSubMeshes[iSubMesh]);
            }
        }
    }

    /**
     * @en Get [[AABB]] bounds in the skeleton's bone space
     * @zh 获取骨骼变换空间内下的 [[AABB]] 包围盒
     * @param skeleton
     */
    public getBoneSpaceBounds (skeleton: Skeleton) {
        if (this._boneSpaceBounds.has(skeleton.hash)) {
            return this._boneSpaceBounds.get(skeleton.hash)!;
        }
        const bounds: (AABB | null)[] = [];
        this._boneSpaceBounds.set(skeleton.hash, bounds);
        const valid: boolean[] = [];
        const { bindposes } = skeleton;
        for (let i = 0; i < bindposes.length; i++) {
            bounds.push(new AABB(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity));
            valid.push(false);
        }
        const { _subMeshes: subMeshes } = this;
        const nSubMeshes = subMeshes.length;
        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            const subMesh = subMeshes[iSubMesh];
            if (!subMesh.hasAttribute(AttributeName.ATTR_JOINTS)
                || !subMesh.hasAttribute(AttributeName.ATTR_WEIGHTS)
                || !subMesh.hasAttribute(AttributeName.ATTR_POSITION)) {
                continue;
            }
            const joints = subMesh.viewAttribute(AttributeName.ATTR_JOINTS);
            const weights = subMesh.viewAttribute(AttributeName.ATTR_WEIGHTS);
            const positions = subMesh.viewAttribute(AttributeName.ATTR_POSITION);
            const vertCount = subMesh.vertexCount;
            assertIsTrue(joints.componentCount >= 4);
            assertIsTrue(weights.componentCount >= 4);
            assertIsTrue(positions.componentCount >= 3);
            for (let i = 0; i < vertCount; i++) {
                Vec3.set(
                    v3_1,
                    positions.getComponent(i, 0),
                    positions.getComponent(i, 1),
                    positions.getComponent(i, 2),
                );
                for (let j = 0; j < 4; ++j) {
                    const joint = joints.getComponent(i, j);
                    const weight = weights.getComponent(i, j);
                    if (weight === 0 || joint >= bindposes.length) { continue; }
                    Vec3.transformMat4(v3_2, v3_1, bindposes[joint]);
                    valid[joint] = true;
                    const b = bounds[joint]!;
                    Vec3.min(b.center, b.center, v3_2);
                    Vec3.max(b.halfExtents, b.halfExtents, v3_2);
                }
            }
        }
        for (let i = 0; i < bindposes.length; i++) {
            const b = bounds[i]!;
            if (!valid[i]) { bounds[i] = null; } else { AABB.fromPoints(b, b.center, b.halfExtents); }
        }
        return bounds;
    }

    /**
     * @en Merge the given mesh into the current mesh
     * @zh 合并指定的网格到此网格中。
     * @param mesh The mesh to be merged
     * @param worldMatrix The world matrix of the given mesh
     * @param [validate=false] Whether to validate the mesh
     * @returns Check the mesh state and return the validation result.
     */
    public merge (mesh: Mesh, worldMatrix?: Mat4, validate?: boolean): boolean {
        if (validate) {
            if (!this.validateMergingMesh(mesh)) {
                return false;
            }
        }

        const vec3_temp = new Vec3();
        const rotation = worldMatrix?.getRotation(new Quat());
        const boundingBox = worldMatrix && new AABB();

        if (!this._initialized) {
            const subMeshes = mesh.subMeshes.map((subMesh) => subMesh.clone());
            this._subMeshes = subMeshes;
            const minPosition = Vec3.copy(this._minPosition, mesh._minPosition);
            const maxPosition = Vec3.copy(this._maxPosition, mesh._maxPosition);
            if (boundingBox) {
                const isValidMinMax = !Vec3.strictEquals(minPosition, DEFAULT_MIN_POSITION)
                && !Vec3.strictEquals(maxPosition, DEFAULT_MAX_POSITION);
                if (isValidMinMax) {
                    Vec3.add(boundingBox.center, maxPosition, minPosition);
                    Vec3.multiplyScalar(boundingBox.center, boundingBox.center, 0.5);
                    Vec3.subtract(boundingBox.halfExtents, maxPosition, minPosition);
                    Vec3.multiplyScalar(boundingBox.halfExtents, boundingBox.halfExtents, 0.5);
                    AABB.transform(boundingBox, boundingBox, worldMatrix!);
                    Vec3.add(maxPosition, boundingBox.center, boundingBox.halfExtents);
                    Vec3.subtract(minPosition, boundingBox.center, boundingBox.halfExtents);
                }
            }
            if (worldMatrix) {
                const nSubMeshes = subMeshes.length;
                for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
                    transformPositionNormalInSubMesh(
                        subMeshes[iSubMesh],
                        worldMatrix,
                        rotation!,
                    );
                }
            }
            this.initialize();
            return true;
        }

        // merge buffer
        const bufferBlob = new BufferBlob();

        // merge vertex buffer
        let vertCount = 0;
        let vertStride = 0;
        let srcOffset = 0;
        let dstOffset = 0;
        let vb: ArrayBuffer;
        let vbView: Uint8Array;
        let srcVBView: Uint8Array;
        let dstVBView: Uint8Array;
        let srcAttrOffset = 0;
        let srcVBOffset = 0;
        let dstVBOffset = 0;
        let attrSize = 0;
        let dstAttrView: Uint8Array;
        let hasAttr = false;

        const vertexBundles = new Array<Mesh.IVertexBundle>(this._struct.vertexBundles.length);
        for (let i = 0; i < this._struct.vertexBundles.length; ++i) {
            const bundle = this._struct.vertexBundles[i];
            const dstBundle = mesh._struct.vertexBundles[i];

            srcOffset = bundle.view.offset;
            dstOffset = dstBundle.view.offset;
            vertStride = bundle.view.stride;
            vertCount = bundle.view.count + dstBundle.view.count;

            vb = new ArrayBuffer(vertCount * vertStride);
            vbView = new Uint8Array(vb);

            srcVBView = this._data.subarray(srcOffset, srcOffset + bundle.view.length);
            srcOffset += srcVBView.length;
            dstVBView = mesh._data.subarray(dstOffset, dstOffset + dstBundle.view.length);
            dstOffset += dstVBView.length;

            vbView.set(srcVBView);

            srcAttrOffset = 0;
            for (const attr of bundle.attributes) {
                dstVBOffset = 0;
                hasAttr = false;
                for (const dstAttr of dstBundle.attributes) {
                    if (attr.name === dstAttr.name && attr.format === dstAttr.format) {
                        hasAttr = true;
                        break;
                    }
                    dstVBOffset += FormatInfos[dstAttr.format].size;
                }
                if (hasAttr) {
                    attrSize = FormatInfos[attr.format].size;
                    srcVBOffset = bundle.view.length + srcAttrOffset;
                    for (let v = 0; v < dstBundle.view.count; ++v) {
                        dstAttrView = dstVBView.subarray(dstVBOffset, dstVBOffset + attrSize);
                        vbView.set(dstAttrView, srcVBOffset);
                        if ((attr.name === AttributeName.ATTR_POSITION || attr.name === AttributeName.ATTR_NORMAL) && worldMatrix) {
                            const f32_temp = new Float32Array(vbView.buffer, srcVBOffset, 3);
                            vec3_temp.set(f32_temp[0], f32_temp[1], f32_temp[2]);
                            switch (attr.name) {
                            case AttributeName.ATTR_POSITION:
                                vec3_temp.transformMat4(worldMatrix);
                                break;
                            case AttributeName.ATTR_NORMAL:
                                Vec3.transformQuat(vec3_temp, vec3_temp, rotation!);
                                break;
                            default:
                            }
                            f32_temp[0] = vec3_temp.x;
                            f32_temp[1] = vec3_temp.y;
                            f32_temp[2] = vec3_temp.z;
                        }
                        srcVBOffset += bundle.view.stride;
                        dstVBOffset += dstBundle.view.stride;
                    }
                }
                srcAttrOffset += FormatInfos[attr.format].size;
            }

            vertexBundles[i] = {
                attributes: bundle.attributes,
                view: {
                    offset: bufferBlob.getLength(),
                    length: vb.byteLength,
                    count: vertCount,
                    stride: vertStride,
                },
            };

            bufferBlob.addBuffer(vb);
        }

        // merge index buffer
        let idxCount = 0;
        let idxStride = 2;
        let vertBatchCount = 0;
        let ibView: Uint8Array | Uint16Array | Uint32Array;
        let srcIBView: Uint8Array | Uint16Array | Uint32Array;
        let dstIBView: Uint8Array | Uint16Array | Uint32Array;

        const primitives: Mesh.ISubMesh[] = new Array<Mesh.ISubMesh>(this._struct.primitives.length);
        for (let i = 0; i < this._struct.primitives.length; ++i) {
            const prim = this._struct.primitives[i];
            const dstPrim = mesh._struct.primitives[i];

            primitives[i] = {
                primitiveMode: prim.primitiveMode,
                vertexBundelIndices: prim.vertexBundelIndices,
            };

            for (const bundleIdx of prim.vertexBundelIndices) {
                vertBatchCount = Math.max(vertBatchCount, this._struct.vertexBundles[bundleIdx].view.count);
            }

            if (prim.indexView && dstPrim.indexView) {
                idxCount = prim.indexView.count;
                idxCount += dstPrim.indexView.count;

                srcOffset = prim.indexView.offset;
                dstOffset = dstPrim.indexView.offset;

                if (idxCount < 256) {
                    idxStride = 1;
                } else if (idxCount < 65536) {
                    idxStride = 2;
                } else {
                    idxStride = 4;
                }

                const ib = new ArrayBuffer(idxCount * idxStride);
                if (idxStride === 2) {
                    ibView = new Uint16Array(ib);
                } else if (idxStride === 1) {
                    ibView = new Uint8Array(ib);
                } else { // Uint32
                    ibView = new Uint32Array(ib);
                }

                // merge src indices
                if (prim.indexView.stride === 2) {
                    srcIBView = new Uint16Array(this._data.buffer, srcOffset, prim.indexView.count);
                } else if (prim.indexView.stride === 1) {
                    srcIBView = new Uint8Array(this._data.buffer, srcOffset, prim.indexView.count);
                } else { // Uint32
                    srcIBView = new Uint32Array(this._data.buffer, srcOffset, prim.indexView.count);
                }

                if (idxStride === prim.indexView.stride) {
                    ibView.set(srcIBView);
                } else {
                    for (let n = 0; n < prim.indexView.count; ++n) {
                        ibView[n] = srcIBView[n];
                    }
                }
                srcOffset += prim.indexView.length;

                // merge dst indices
                if (dstPrim.indexView.stride === 2) {
                    dstIBView = new Uint16Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
                } else if (dstPrim.indexView.stride === 1) {
                    dstIBView = new Uint8Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
                } else { // Uint32
                    dstIBView = new Uint32Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
                }
                for (let n = 0; n < dstPrim.indexView.count; ++n) {
                    ibView[prim.indexView.count + n] = vertBatchCount + dstIBView[n];
                }
                dstOffset += dstPrim.indexView.length;

                primitives[i].indexView = {
                    offset: bufferBlob.getLength(),
                    length: ib.byteLength,
                    count: idxCount,
                    stride: idxStride,
                };

                bufferBlob.setNextAlignment(idxStride);
                bufferBlob.addBuffer(ib);
            }
        }

        // Create mesh struct.
        const meshStruct: Mesh.IStruct = {
            vertexBundles,
            primitives,
            minPosition: this._struct.minPosition,
            maxPosition: this._struct.maxPosition,
        };

        if (meshStruct.minPosition && mesh._struct.minPosition && meshStruct.maxPosition && mesh._struct.maxPosition) {
            if (worldMatrix) {
                Vec3.add(boundingBox!.center, mesh._struct.maxPosition, mesh._struct.minPosition);
                Vec3.multiplyScalar(boundingBox!.center, boundingBox!.center, 0.5);
                Vec3.subtract(boundingBox!.halfExtents, mesh._struct.maxPosition, mesh._struct.minPosition);
                Vec3.multiplyScalar(boundingBox!.halfExtents, boundingBox!.halfExtents, 0.5);
                AABB.transform(boundingBox!, boundingBox!, worldMatrix);
                Vec3.add(vec3_temp, boundingBox!.center, boundingBox!.halfExtents);
                Vec3.max(meshStruct.maxPosition, meshStruct.maxPosition, vec3_temp);
                Vec3.subtract(vec3_temp, boundingBox!.center, boundingBox!.halfExtents);
                Vec3.min(meshStruct.minPosition, meshStruct.minPosition, vec3_temp);
            } else {
                Vec3.min(meshStruct.minPosition, meshStruct.minPosition, mesh._struct.minPosition);
                Vec3.max(meshStruct.maxPosition, meshStruct.maxPosition, mesh._struct.maxPosition);
            }
        }

        // Create mesh.
        this.reset({
            struct: meshStruct,
            data: new Uint8Array(bufferBlob.getCombined()),
        });
        this.initialize();

        return true;
    }

    /**
     * @en Validation for whether the given mesh can be merged into the current mesh.
     * To pass the validation, it must satisfy either of these two requirements:
     * - When the current mesh have no data
     * - When the two mesh have the same vertex bundle count, the same sub meshes count, and the same sub mesh layout.
     *
     * Same mesh layout means:
     * - They have the same primitive type and reference to the same amount vertex bundle with the same indices.
     * - And they all have or don't have index view
     * @zh 验证指定网格是否可以合并至当前网格。
     *
     * 当满足以下条件之一时，指定网格可以合并至当前网格：
     *  - 当前网格无数据而待合并网格有数据；
     *  - 它们的顶点块数目相同且对应顶点块的布局一致，并且它们的子网格数目相同且对应子网格的布局一致。
     *
     * 两个顶点块布局一致当且仅当：
     *  - 它们具有相同数量的顶点属性且对应的顶点属性具有相同的属性格式。
     *
     * 两个子网格布局一致，当且仅当：
     *  - 它们具有相同的图元类型并且引用相同数量、相同索引的顶点块；并且，
     *  - 要么都需要索引绘制，要么都不需要索引绘制。
     * @param mesh The other mesh to be validated
     */
    public validateMergingMesh (that: Mesh) {
        const nSubMeshes = this._subMeshes.length;

        if (nSubMeshes !== that._subMeshes.length) {
            return false;
        }

        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            const thisSubMesh = this._subMeshes[iSubMesh];
            const thatSubMesh = that._subMeshes[iSubMesh];

            if (!!thisSubMesh.indices !== !!thatSubMesh.indices) {
                return false;
            }

            if (!thisSubMesh[hasSameVertexLayoutTag](thatSubMesh)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @en Read the requested attribute of the given sub mesh
     * @zh 读取子网格的指定属性。
     * @param primitiveIndex Sub mesh index
     * @param attributeName Attribute name
     * @returns Return null if not found or can't read, otherwise, will create a large enough typed array to contain all data of the attribute,
     * the array type will match the data type of the attribute.
     */
    public readAttribute (primitiveIndex: number, attributeName: AttributeName): TypedArray | null {
        const subMesh = this._subMeshes[primitiveIndex];
        if (!subMesh.hasAttribute(attributeName)) {
            return null;
        }
        const view = subMesh.viewAttribute(attributeName);
        const result = view.read() as TypedArray;
        assertIsTrue(ArrayBuffer.isView(result));
        return result;
    }

    /**
     * @en Read the requested attribute of the given sub mesh and fill into the given buffer.
     * @zh 读取子网格的指定属性到目标缓冲区中。
     * @param primitiveIndex Sub mesh index
     * @param attributeName Attribute name
     * @param buffer The target array buffer
     * @param stride Byte distance between two attributes in the target buffer
     * @param offset The offset of the first attribute in the target buffer
     * @returns Return false if failed to access attribute, return true otherwise.
     */
    public copyAttribute (primitiveIndex: number, attributeName: AttributeName, buffer: ArrayBuffer, stride: number, offset: number) {
        const subMesh = this._subMeshes[primitiveIndex];
        if (!subMesh.hasAttribute(attributeName)) {
            return false;
        }

        const view = subMesh.viewAttribute(attributeName);
        assertIsTrue(view instanceof InterleavedVertexAttributeView);

        // TODO: `VertexAttributeView` should only be called by `SubMesh` to be honest.
        const outView = new InterleavedVertexAttributeView(
            buffer,
            0,
            offset,
            stride,
            subMesh.getAttributeFormat(attributeName),
            subMesh.vertexCount,
        );

        outView.set(view);
        return true;
    }

    /**
     * @en Read the indices data of the given sub mesh
     * @zh 读取子网格的索引数据。
     * @param primitiveIndex Sub mesh index
     * @returns Return null if not found or can't read, otherwise, will create a large enough typed array to contain all indices data,
     * the array type will use the corresponding stride size.
     */
    public readIndices (primitiveIndex: number) {
        if (primitiveIndex >= this._subMeshes.length) {
            return null;
        }
        return this._subMeshes[primitiveIndex].indices?.slice() ?? null;
    }

    /**
     * @en Read the indices data of the given sub mesh and fill into the given array
     * @zh 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex Sub mesh index
     * @param outputArray The target output array
     * @returns Return false if failed to access the indices data, return true otherwise.
     */
    public copyIndices (primitiveIndex: number, outputArray: number[] | ArrayBufferView): boolean {
        if (primitiveIndex >= this._subMeshes.length) {
            return false;
        }
        const subMesh = this._subMeshes[primitiveIndex];
        const indices = subMesh.indices;
        if (!indices) {
            return false;
        }
        const nIndices = indices.length;
        for (let i = 0; i < nIndices; ++i) {
            outputArray[i] = indices[i];
        }
        return true;
    }

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        this.reset({
            struct: {
                vertexBundles: [],
                primitives: [],
            },
            data: globalEmptyMeshBuffer,
        });
    }

    public validate () {
        return this.renderingSubMeshes.length > 0 && this.data.byteLength > 0;
    }

    private _syncLegacyMeshData () {
        if (this._legacyMeshDataSynchronized) {
            return;
        }
        this._legacyMeshDataSynchronized = true;

        const {
            _struct: {
                primitives: legacyPrimitives,
                vertexBundles: legacyVertexBundles,
                minPosition: legacyMinPosition,
                maxPosition: legacyMaxPosition,
                jointMaps,
                morph: legacyMorph,
            },
            _data: legacyData,
        } = this;

        const {
            buffer: legacyBuffer,
            byteOffset: legacyBufferByteOffset,
        } = legacyData;

        if (legacyMinPosition && legacyMaxPosition) {
            Vec3.copy(this._minPosition, legacyMinPosition);
            Vec3.copy(this._maxPosition, legacyMaxPosition);
        }

        this._subMeshes = legacyPrimitives.map((legacyPrimitive) => SubMesh[fromLegacySubMeshTag](
            legacyPrimitive,
            legacyVertexBundles,
            legacyBuffer,
            legacyBufferByteOffset,
        ));

        if (legacyMorph) {
            const {
                subMeshMorphs,
                weights,
                targetNames,
            } = legacyMorph;
            assertIsTrue(subMeshMorphs.length === this._subMeshes.length);
            for (let iSubMesh = 0; iSubMesh < this._subMeshes.length; ++iSubMesh) {
                const legacySubMeshMorph = subMeshMorphs[iSubMesh];
                if (!legacySubMeshMorph) {
                    continue;
                }
                const subMesh = this._subMeshes[iSubMesh];
                subMesh.morph = {
                    attributes: legacySubMeshMorph.attributes.slice(),
                    targets: legacySubMeshMorph.targets.map((legacyTarget, iTarget) => ({
                        name: targetNames?.[iTarget],
                        displacements: legacyTarget.displacements.map((legacyDisplacementView) => {
                            assertIsTrue(legacyDisplacementView.count <= subMesh.vertexCount);
                            const displacementView = new Float32Array(3 * subMesh.vertexCount);
                            assertIsTrue(legacyDisplacementView.length <= displacementView.byteLength);
                            displacementView.set(new Float32Array(
                                legacyBuffer,
                                legacyBufferByteOffset + legacyDisplacementView.offset,
                                legacyDisplacementView.count,
                            ));
                            return displacementView;
                        }),
                    })),
                    weights: weights?.slice(),
                };
            }
        }

        this.jointMaps = jointMaps?.slice();
    }
}

export declare namespace Mesh {
    export type EventType = MeshEventType;
}

legacyCC.Mesh = Mesh;

const transformPositionNormalInSubMesh = (() => {
    const vec3_temp = new Vec3();
    return (
        subMesh: SubMesh,
        worldMatrix: Mat4,
        rotation: Quat,
    ) => {
        const nVertices = subMesh.vertexCount;
        for (const attributeName of [
            AttributeName.ATTR_POSITION,
            AttributeName.ATTR_NORMAL,
        ]) {
            const attribute = subMesh.viewAttribute(attributeName);
            for (let iVertex = 0; iVertex < nVertices; ++iVertex) {
                vec3_temp.set(
                    attribute.getComponent(iVertex, 0),
                    attribute.getComponent(iVertex, 1),
                    attribute.getComponent(iVertex, 2),
                );
                switch (attributeName) {
                case AttributeName.ATTR_POSITION:
                    vec3_temp.transformMat4(worldMatrix);
                    break;
                case AttributeName.ATTR_NORMAL:
                    Vec3.transformQuat(vec3_temp, vec3_temp, rotation);
                    break;
                default:
                }
                attribute.setComponent(iVertex, 0, vec3_temp.x);
                attribute.setComponent(iVertex, 1, vec3_temp.y);
                attribute.setComponent(iVertex, 2, vec3_temp.z);
            }
        }
    };
})();

function getOffset (attributes: Attribute[], attributeIndex: number) {
    let result = 0;
    for (let i = 0; i < attributeIndex; ++i) {
        const attribute = attributes[i];
        result += FormatInfos[attribute.format].size;
    }
    return result;
}

const { isLittleEndian } = sys;

function getComponentByteLength (format: Format) {
    const info = FormatInfos[format];
    return info.size / info.count;
}

function getReader (dataView: DataView, format: Format) {
    const info = FormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
    case FormatType.UNORM: {
        switch (stride) {
        case 1: return (offset: number) => dataView.getUint8(offset);
        case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
        case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.SNORM: {
        switch (stride) {
        case 1: return (offset: number) => dataView.getInt8(offset);
        case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
        case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.INT: {
        switch (stride) {
        case 1: return (offset: number) => dataView.getInt8(offset);
        case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
        case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.UINT: {
        switch (stride) {
        case 1: return (offset: number) => dataView.getUint8(offset);
        case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
        case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.FLOAT: {
        return (offset: number) => dataView.getFloat32(offset, isLittleEndian);
    }
    default:
    }

    return null;
}

function getDataViewReader (formatInfo: FormatInfo): (dataView: DataView, offset: number) => number {
    const stride = formatInfo.size / formatInfo.count;
    switch (formatInfo.type) {
    case FormatType.UNORM:
    case FormatType.UINT: switch (stride) {
    case 1: return (dataView, offset) => dataView.getUint8(offset);
    case 2: return (dataView, offset) => dataView.getUint16(offset, isLittleEndian);
    case 4: return (dataView, offset) => dataView.getUint32(offset, isLittleEndian);
    default: break;
    }
        break;

    case FormatType.SNORM:
    case FormatType.INT: switch (stride) {
    case 1: return (dataView, offset) => dataView.getInt8(offset);
    case 2: return (dataView, offset) => dataView.getInt16(offset, isLittleEndian);
    case 4: return (dataView, offset) => dataView.getInt32(offset, isLittleEndian);
    default: break;
    }
        break;

    case FormatType.FLOAT: {
        return (dataView, offset) => dataView.getFloat32(offset, isLittleEndian);
    }

    default:
    }
    throw new Error(`Bad format.`);
}

function getDataViewWriter (formatInfo: FormatInfo): (dataView: DataView, offset: number, value: number) => void {
    const stride = formatInfo.size / formatInfo.count;
    switch (formatInfo.type) {
    case FormatType.UNORM:
    case FormatType.UINT: switch (stride) {
    case 1: return (dataView, offset, value) => dataView.setUint8(offset, value);
    case 2: return (dataView, offset, value) => dataView.setUint16(offset, value, isLittleEndian);
    case 4: return (dataView, offset, value) => dataView.setUint32(offset, value, isLittleEndian);
    default: break;
    }
        break;

    case FormatType.SNORM:
    case FormatType.INT: switch (stride) {
    case 1: return (dataView, offset, value) => dataView.setInt8(offset, value);
    case 2: return (dataView, offset, value) => dataView.setInt16(offset, value, isLittleEndian);
    case 4: return (dataView, offset, value) => dataView.setInt32(offset, value, isLittleEndian);
    default: break;
    }
        break;

    case FormatType.FLOAT: {
        return (dataView, offset, value) => dataView.setFloat32(offset, value, isLittleEndian);
    }

    default:
    }
    throw new Error(`Bad format.`);
}

function getWriter (dataView: DataView, format: Format) {
    const info = FormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
    case FormatType.UNORM: {
        switch (stride) {
        case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
        case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
        case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.SNORM: {
        switch (stride) {
        case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
        case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
        case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.INT: {
        switch (stride) {
        case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
        case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
        case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.UINT: {
        switch (stride) {
        case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
        case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
        case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
        default:
        }
        break;
    }
    case FormatType.FLOAT: {
        return (offset: number, value: number) => dataView.setFloat32(offset, value, isLittleEndian);
    }
    default:
    }

    return null;
}

class BufferJoiner {
    private _viewOrPaddings: (ArrayBufferView | number)[] = [];
    private _length = 0;

    get byteLength () {
        return this._length;
    }

    public alignAs (align: number) {
        if (align !== 0) {
            const remainder = this._length % align;
            if (remainder !== 0) {
                const padding = align - remainder;
                this._viewOrPaddings.push(padding);
                this._length += padding;
                return padding;
            }
        }
        return 0;
    }

    public append (view: ArrayBufferView) {
        const result = this._length;
        this._viewOrPaddings.push(view);
        this._length += view.byteLength;
        return result;
    }

    public get () {
        const result = new Uint8Array(this._length);
        let counter = 0;
        this._viewOrPaddings.forEach((viewOrPadding) => {
            if (typeof viewOrPadding === 'number') {
                counter += viewOrPadding;
            } else {
                result.set(new Uint8Array(viewOrPadding.buffer, viewOrPadding.byteOffset, viewOrPadding.byteLength), counter);
                counter += viewOrPadding.byteLength;
            }
        });
        return result;
    }
}

// function get
