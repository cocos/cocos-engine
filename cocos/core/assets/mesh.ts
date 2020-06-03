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
 * @category asset
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { Mat4, Quat, Vec3 } from '../../core/math';
import { mapBuffer } from '../3d/misc/buffer';
import { BufferBlob } from '../3d/misc/buffer-blob';
import { aabb } from '../geometry';
import { GFXBuffer } from '../gfx/buffer';
import {
    getTypedArrayConstructor,
    GFXAttributeName,
    GFXBufferUsageBit,
    GFXFormat,
    GFXFormatInfos,
    GFXFormatType,
    GFXMemoryUsageBit,
    GFXPrimitiveMode,
} from '../gfx/define';
import { GFXDevice, GFXFeature } from '../gfx/device';
import { IGFXAttribute } from '../gfx/input-assembler';
import { warnID } from '../platform/debug';
import { sys } from '../platform/sys';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { Asset } from './asset';
import { Skeleton } from './skeleton';
import { postLoadMesh } from './utils/mesh-utils';
import { Morph, createMorphRendering, MorphRendering } from './morph';
import { legacyCC } from '../global-exports';

function getIndexStrideCtor (stride: number) {
    switch (stride) {
        case 1: return Uint8Array;
        case 2: return Uint16Array;
        case 4: return Uint32Array;
    }
    return Uint8Array;
}

/**
 * 允许存储索引的数组视图。
 */
export type IBArray = Uint8Array | Uint16Array | Uint32Array;

/**
 * 几何信息。
 */
export interface IGeometricInfo {
    /**
     * 顶点位置。
     */
    positions: Float32Array;

    /**
     * 索引数据。
     */
    indices?: IBArray;

    /**
     * 是否将图元按双面对待。
     */
    doubleSided?: boolean;

    /**
     * 此几何体的轴对齐包围盒。
     */
    boundingBox: { max: Vec3; min: Vec3; }
}

export interface IFlatBuffer {
    stride: number;
    count: number;
    buffer: Uint8Array;
}

/**
 * 渲染子网格。
 */
export class RenderingSubMesh {
    /**
     * 使用的所有顶点缓冲区。
     */
    public vertexBuffers: GFXBuffer[];

    /**
     * 所有顶点属性。
     */
    public attributes: IGFXAttribute[];

    /**
     * 图元类型。
     */
    public primitiveMode: GFXPrimitiveMode;

    /**
     * 使用的索引缓冲区，若未使用则无需指定。
     */
    public indexBuffer?: GFXBuffer;

    /**
     * 间接绘制缓冲区。
     */
    public indirectBuffer?: GFXBuffer;

    /**
     * （用于射线检测的）几何信息。
     */
    get geometricInfo () {
        if (this._geometricInfo) {
            return this._geometricInfo;
        }
        if (this.mesh === undefined) {
            return { positions: new Float32Array(), indices: new Uint8Array(), boundingBox: { min: Vec3.ZERO, max: Vec3.ZERO } };
        }
        if (this.subMeshIdx === undefined) {
            return { positions: new Float32Array(), indices: new Uint8Array(), boundingBox: { min: Vec3.ZERO, max: Vec3.ZERO } };
        }
        const mesh = this.mesh!; const index = this.subMeshIdx!;
        const positions = mesh.readAttribute(index, GFXAttributeName.ATTR_POSITION) as unknown as Float32Array;
        const indices = mesh.readIndices(index) as Uint16Array;
        const max = new Vec3();
        const min = new Vec3();
        const pAttri = this.attributes.find(element => element.name === legacyCC.GFXAttributeName.ATTR_POSITION);
        if (pAttri) {
            const conut = GFXFormatInfos[pAttri.format].count;
            if (conut === 2) {
                max.set(positions[0], positions[1], 0);
                min.set(positions[0], positions[1], 0);
            } else {
                max.set(positions[0], positions[1], positions[2]);
                min.set(positions[0], positions[1], positions[2]);
            }
            for (let i = 0; i < positions.length; i += conut) {
                if (conut === 2) {
                    max.x = positions[i] > max.x ? positions[i] : max.x;
                    max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
                    min.x = positions[i] < min.x ? positions[i] : min.x;
                    min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
                } else {
                    max.x = positions[i] > max.x ? positions[i] : max.x;
                    max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
                    max.z = positions[i + 2] > max.z ? positions[i + 2] : max.z;
                    min.x = positions[i] < min.x ? positions[i] : min.x;
                    min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
                    min.z = positions[i + 2] < min.z ? positions[i + 2] : min.z;
                }
            }
        }
        this._geometricInfo = { positions, indices, boundingBox: { max, min } };
        return this._geometricInfo;
    }

    /**
     * 扁平化的顶点缓冲区。
     */
    get flatBuffers () {
        if (this._flatBuffers) { return this._flatBuffers; }
        const buffers: IFlatBuffer[] = this._flatBuffers = [];
        if (!this.mesh || this.subMeshIdx === undefined) { return buffers; }
        const mesh = this.mesh;
        let idxCount = 0;
        const prim = mesh.struct.primitives[this.subMeshIdx];
        if (prim.indexView) { idxCount = prim.indexView.count; }
        for (const bundleIdx of prim.vertexBundelIndices) {
            const vertexBundle = mesh.struct.vertexBundles[bundleIdx];
            const vbCount = prim.indexView ? prim.indexView.count : vertexBundle.view.count;
            const vbStride = vertexBundle.view.stride;
            const vbSize = vbStride * vbCount;
            const view = new Uint8Array(mesh.data!.buffer, vertexBundle.view.offset, vertexBundle.view.length);
            if (!prim.indexView) {
                this._flatBuffers.push({ stride: vbStride, count: vbCount, buffer: view });
                continue;
            }
            const vbView = new Uint8Array(vbSize);
            const ibView = mesh.readIndices(this.subMeshIdx)!;
            // transform to flat buffer
            for (let n = 0; n < idxCount; ++n) {
                const idx = ibView[n];
                const offset = n * vbStride;
                const srcOffset = idx * vbStride;
                for (let m = 0; m < vbStride; ++m) {
                    vbView[offset + m] = view[srcOffset + m];
                }
            }
            this._flatBuffers.push({ stride: vbStride, count: vbCount, buffer: vbView });
        }
        return this._flatBuffers;
    }

    /**
     * 骨骼索引按映射表处理后的顶点缓冲。
     */
    get jointMappedBuffers () {
        if (this._jointMappedBuffers) { return this._jointMappedBuffers; }
        const buffers: GFXBuffer[] = this._jointMappedBuffers = [];
        const indices: number[] = this._jointMappedBufferIndices = [];
        if (!this.mesh || this.subMeshIdx === undefined) { return this._jointMappedBuffers = this.vertexBuffers; }
        const struct = this.mesh.struct;
        const prim = struct.primitives[this.subMeshIdx];
        if (!struct.jointMaps || prim.jointMapIndex === undefined || !struct.jointMaps[prim.jointMapIndex]) {
            return this._jointMappedBuffers = this.vertexBuffers;
        }
        let jointFormat: GFXFormat;
        let jointOffset: number;
        const device: GFXDevice = legacyCC.director.root.device;
        for (let i = 0; i < prim.vertexBundelIndices.length; i++) {
            const bundle = struct.vertexBundles[prim.vertexBundelIndices[i]];
            jointOffset = 0;
            jointFormat = GFXFormat.UNKNOWN;
            for (let j = 0; j < bundle.attributes.length; j++) {
                const attr = bundle.attributes[j];
                if (attr.name === GFXAttributeName.ATTR_JOINTS) {
                    jointFormat = attr.format;
                    break;
                }
                jointOffset += GFXFormatInfos[attr.format].size;
            }
            if (jointFormat) {
                const data = new Uint8Array(this.mesh.data!.buffer, bundle.view.offset, bundle.view.length);
                const dataView = new DataView(data.slice().buffer);
                const idxMap = struct.jointMaps[prim.jointMapIndex];
                mapBuffer(dataView, (cur) => idxMap.indexOf(cur), jointFormat, jointOffset,
                    bundle.view.length, bundle.view.stride, dataView);
                const buffer = device.createBuffer({
                    usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: bundle.view.length,
                    stride: bundle.view.stride,
                });
                buffer.update(dataView.buffer); buffers.push(buffer); indices.push(i);
            } else {
                buffers.push(this.vertexBuffers[prim.vertexBundelIndices[i]]);
            }
        }
        if (this._vertexIdChannel) {
            buffers.push(this._allocVertexIdBuffer(device));
        }
        return buffers;
    }

    public mesh?: Mesh;
    public subMeshIdx?: number;

    private _flatBuffers?: IFlatBuffer[];
    private _jointMappedBuffers?: GFXBuffer[];
    private _jointMappedBufferIndices?: number[];
    private _vertexIdChannel?: {
        stream: number;
        index: number;
    };
    private _geometricInfo?: IGeometricInfo;

    constructor (vertexBuffers: GFXBuffer[], attributes: IGFXAttribute[], primitiveMode: GFXPrimitiveMode) {
        this.vertexBuffers = vertexBuffers;
        this.attributes = attributes;
        this.primitiveMode = primitiveMode;
    }

    public destroy () {
        for (let i = 0; i < this.vertexBuffers.length; i++) {
            this.vertexBuffers[i].destroy();
        }
        this.vertexBuffers.length = 0;
        if (this.indexBuffer) {
            this.indexBuffer.destroy();
            this.indexBuffer = undefined;
        }
        if (this._jointMappedBuffers && this._jointMappedBufferIndices) {
            for (let i = 0; i < this._jointMappedBufferIndices.length; i++) {
                this._jointMappedBuffers[this._jointMappedBufferIndices[i]].destroy();
            }
            this._jointMappedBuffers = undefined;
            this._jointMappedBufferIndices = undefined;
        }
        if (this.indirectBuffer) {
            this.indirectBuffer.destroy();
            this.indirectBuffer = undefined;
        }
    }

    /**
     * Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
     * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
     * Once you call this function, the vertex attribute is permanently added.
     * Subsequent calls to this function take no effect.
     * @param device Device used to create related rendering resources.
     */
    public enableVertexIdChannel (device: GFXDevice) {
        if (this._vertexIdChannel) {
            return;
        }

        const streamIndex = this.vertexBuffers.length;
        const attributeIndex = this.attributes.length;

        const vertexIdBuffer = this._allocVertexIdBuffer(device);
        this.vertexBuffers.push(vertexIdBuffer);
        this.attributes.push({
            name: 'a_vertexId',
            format: GFXFormat.R32F,
            stream: streamIndex,
            isNormalized: false,
        });

        this._vertexIdChannel = {
            stream: streamIndex,
            index: attributeIndex,
        };
    }

    private _allocVertexIdBuffer (device: GFXDevice) {
        const vertexCount = (this.vertexBuffers.length === 0 || this.vertexBuffers[0].stride === 0) ?
            0 :
            // TODO: This depends on how stride of a vertex buffer is defined; Consider padding problem.
            this.vertexBuffers[0].size / this.vertexBuffers[0].stride;
        const vertexIds = new Float32Array(vertexCount);
        for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
            vertexIds[iVertex] = iVertex;
        }

        const vertexIdBuffer = device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vertexIds.byteLength,
            stride: vertexIds.BYTES_PER_ELEMENT,
        });
        vertexIdBuffer.update(vertexIds);

        return vertexIdBuffer;
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
     * @zh
     * 顶点块。顶点块描述了一组**交错排列**（interleaved）的顶点属性并存储了顶点属性的实际数据。<br>
     * 交错排列是指在实际数据的缓冲区中，每个顶点的所有属性总是依次排列，并总是出现在下一个顶点的所有属性之前。
     */
    export interface IVertexBundle {
        /**
         * 所有顶点属性的实际数据块。
         * 你必须使用 DataView 来读取数据。
         * 因为不能保证所有属性的起始偏移都按 TypedArray 要求的字节对齐。
         */
        view: IBufferView;

        /**
         * 包含的所有顶点属性。
         */
        attributes: IGFXAttribute[];
    }

    /**
     * 子网格。子网格由一系列相同类型的图元组成（例如点、线、面等）。
     */
    export interface ISubMesh {
        /**
         * 此子网格引用的顶点块，索引至网格的顶点块数组。
         */
        vertexBundelIndices: number[];

        /**
         * 此子网格的图元类型。
         */
        primitiveMode: GFXPrimitiveMode;

        /**
         * 此子网格使用的索引数据。
         */
        indexView?: IBufferView;

        /**
         * 此子网格使用的关节索引映射表在 IStruct.jointMaps 中的索引。
         * 如未定义或指向的映射表不存在，则默认 VB 内所有关节索引数据直接对应骨骼资源数据。
         */
        jointMapIndex?: number;

    }

    /**
     * 描述了网格的结构。
     */
    export interface IStruct {
        /**
         * 此网格所有的顶点块。
         */
        vertexBundles: IVertexBundle[];

        /**
         * 此网格的所有子网格。
         */
        primitives: ISubMesh[];

        /**
         * （各分量都）小于等于此网格任何顶点位置的最大位置。
         */
        minPosition?: Vec3;

        /**
         * （各分量都）大于等于此网格任何顶点位置的最小位置。
         */
        maxPosition?: Vec3;

        /**
         * 此网格使用的关节索引映射关系列表，数组长度应为子模型中实际使用到的所有关节，
         * 每个元素都对应一个原骨骼资源里的索引，按子模型 VB 内的实际索引排列。
         */
        jointMaps?: number[][];

        morph?: Morph;
    }

    export interface ICreateInfo {
        /**
         * 网格结构。
         */
        struct: Mesh.IStruct;

        /**
         * 网格二进制数据。
         */
        data: Uint8Array;
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();

/**
 * 网格资源。
 */
@ccclass('cc.Mesh')
export class Mesh extends Asset {

    get _nativeAsset (): ArrayBuffer {
        return this._data!.buffer;
    }

    set _nativeAsset (value: ArrayBuffer) {
        if (this._data && this._data.byteLength === value.byteLength) {
            this._data.set(new Uint8Array(value));
            if (legacyCC.loader._cache[this.nativeUrl]) {
                legacyCC.loader._cache[this.nativeUrl].content = this._data.buffer;
            }
        }
        else {
            this._data = new Uint8Array(value);
        }
        this.loaded = true;
        this.emit('load');
    }

    /**
     * 此网格的子网格数量。
     * @deprecated 请使用 `this.renderingMesh.subMeshCount`。
     */
    get subMeshCount () {
        const renderingMesh = this.renderingSubMeshes;
        return renderingMesh ? renderingMesh.length : 0;
    }

    /**
     * （各分量都）小于等于此网格任何顶点位置的最大位置。
     * @deprecated 请使用 `this.struct.minPosition`。
     */
    get minPosition () {
        return this.struct.minPosition;
    }

    /**
     * （各分量都）大于等于此网格任何顶点位置的最大位置。
     * @deprecated 请使用 `this.struct.maxPosition`。
     */
    get maxPosition () {
        return this.struct.maxPosition;
    }

    /**
     * 此网格的结构。
     */
    get struct () {
        return this._struct;
    }

    /**
     * 此网格的数据。
     */
    get data () {
        return this._data;
    }

    /**
     * 此网格的哈希值。
     */
    get hash () {
        // hashes should already be computed offline, but if not, make one
        if (!this._hash && this._data) { this._hash = murmurhash2_32_gc(this._data, 666); }
        return this._hash;
    }

    get jointBufferIndices () {
        if (this._jointBufferIndices) { return this._jointBufferIndices; }
        return this._jointBufferIndices = this._struct.primitives.map((p) => p.jointMapIndex || 0);
    }

    @property
    private _struct: Mesh.IStruct = {
        vertexBundles: [],
        primitives: [],
    };

    @property
    private _dataLength = 0;

    @property
    private _hash = 0;

    private _data: Uint8Array | null = null;
    private _initialized = false;
    private _renderingSubMeshes: RenderingSubMesh[] | null = null;
    private _boneSpaceBounds = new Map<number, (aabb | null)[]>();
    private _jointBufferIndices: number[] | null = null;

    constructor () {
        super();
        this.loaded = false;
    }

    public initialize () {
        if (this._initialized) {
            return;
        }

        this._initialized = true;

        if (!this._data) {
            this._data = new Uint8Array(this._dataLength);
            postLoadMesh(this);
        }
        const buffer = this._data.buffer;
        const gfxDevice: GFXDevice = legacyCC.director.root.device;
        const vertexBuffers = this._createVertexBuffers(gfxDevice, buffer);
        const indexBuffers: GFXBuffer[] = [];
        const subMeshes: RenderingSubMesh[] = [];

        for (let i = 0; i < this._struct.primitives.length; i++) {
            const prim = this._struct.primitives[i];
            if (prim.vertexBundelIndices.length === 0) {
                continue;
            }

            let indexBuffer: GFXBuffer | undefined;
            let ib: any = null;
            if (prim.indexView) {
                const idxView = prim.indexView;

                let dstStride = idxView.stride;
                let dstSize = idxView.length;
                if (dstStride === 4 && !gfxDevice.hasFeature(GFXFeature.ELEMENT_INDEX_UINT)) {
                    const vertexCount = this._struct.vertexBundles[prim.vertexBundelIndices[0]].view.count;
                    if (vertexCount >= 65536) {
                        warnID(10001, vertexCount, 65536);
                        continue; // Ignore this primitive
                    } else {
                        dstStride >>= 1; // Reduce to short.
                        dstSize >>= 1;
                    }
                }

                indexBuffer = gfxDevice.createBuffer({
                    usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: dstSize,
                    stride: dstStride,
                });
                indexBuffers.push(indexBuffer);

                ib = new (getIndexStrideCtor(idxView.stride))(buffer, idxView.offset, idxView.count);
                if (idxView.stride !== dstStride) {
                    ib = getIndexStrideCtor(dstStride).from(ib);
                }
                if (this.loaded) {
                    indexBuffer.update(ib);
                }
                else {
                    this.once('load', () => {
                        indexBuffer!.update(ib);
                    });
                }
            }

            const vbReference = prim.vertexBundelIndices.map((idx) => vertexBuffers[idx]);

            let gfxAttributes: IGFXAttribute[] = [];
            if (prim.vertexBundelIndices.length > 0) {
                const idx = prim.vertexBundelIndices[0];
                const vertexBundle = this._struct.vertexBundles[idx];
                gfxAttributes = vertexBundle.attributes;
            }

            const subMesh = new RenderingSubMesh(vbReference, gfxAttributes, prim.primitiveMode);
            subMesh.mesh = this; subMesh.subMeshIdx = i; subMesh.indexBuffer = indexBuffer;

            subMeshes.push(subMesh);
        }

        this._renderingSubMeshes = subMeshes;

        if (this._struct.morph) {
            this.morphRendering = createMorphRendering(this, gfxDevice);
        }
    }

    /**
     * 销毁此网格，并释放它占有的所有 GPU 资源。
     */
    public destroy () {
        this.destroyRenderingMesh();
        return super.destroy();
    }

    /**
     * 释放此网格占有的所有 GPU 资源。
     */
    public destroyRenderingMesh () {
        if (this._renderingSubMeshes) {
            for (let i = 0; i < this._renderingSubMeshes.length; i++) {
                this._renderingSubMeshes[i].destroy();
            }
            this._renderingSubMeshes = null;
            this._data = null;
            this._initialized = false;
        }
    }

    /**
     * 重置此网格的结构和数据。
     * @param struct 新的结构。
     * @param data 新的数据。
     * @deprecated 将在 V1.0.0 移除，请转用 `this.reset()`。
     */
    public assign (struct: Mesh.IStruct, data: Uint8Array) {
        this.reset({
            struct,
            data,
        });
    }

    /**
     * 重置此网格。
     * @param info 网格重置选项。
     */
    public reset (info: Mesh.ICreateInfo) {
        this.destroyRenderingMesh();
        this._struct = info.struct;
        this._data = info.data;
        this._hash = 0;
        this.loaded = true;
        this.emit('load');
    }

    /**
     * 此网格创建的渲染网格。
     */
    public get renderingSubMeshes () {
        this.initialize();
        return this._renderingSubMeshes!;
    }

    public getBoneSpaceBounds (skeleton: Skeleton) {
        if (this._boneSpaceBounds.has(skeleton.hash)) {
            return this._boneSpaceBounds.get(skeleton.hash)!;
        }
        const bounds: (aabb | null)[] = [];
        this._boneSpaceBounds.set(skeleton.hash, bounds);
        const valid: boolean[] = [];
        const bindposes = skeleton.bindposes;
        for (let i = 0; i < bindposes.length; i++) {
            bounds.push(new aabb(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity));
            valid.push(false);
        }
        const primitives = this._struct.primitives;
        for (let p = 0; p < primitives.length; p++) {
            const joints = this.readAttribute(p, GFXAttributeName.ATTR_JOINTS);
            const weights = this.readAttribute(p, GFXAttributeName.ATTR_WEIGHTS);
            const positions = this.readAttribute(p, GFXAttributeName.ATTR_POSITION);
            if (!joints || !weights || !positions) { continue; }
            const vertCount = Math.min(joints.length / 4, weights.length / 4, positions.length / 3);
            for (let i = 0; i < vertCount; i++) {
                Vec3.set(v3_1, positions[3 * i + 0], positions[3 * i + 1], positions[3 * i + 2]);
                for (let j = 0; j < 4; ++j) {
                    const idx = 4 * i + j;
                    const joint = joints[idx];
                    if (weights[idx] === 0 || joint >= bindposes.length) { continue; }
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
            if (!valid[i]) { bounds[i] = null; }
            else { aabb.fromPoints(b, b.center, b.halfExtents); }
        }
        return bounds;
    }

    /**
     * 合并指定的网格到此网格中。
     * @param mesh 合并的网格。
     * @param worldMatrix 合并的网格的世界变换矩阵
     * @param [validate=false] 是否进行验证。
     * @returns 是否验证成功。若验证选项为 `true` 且验证未通过则返回 `false`，否则返回 `true`。
     */
    public merge (mesh: Mesh, worldMatrix?: Mat4, validate?: boolean): boolean {
        if (validate) {
            if (!this.loaded || !mesh.loaded || !this.validateMergingMesh(mesh)) {
                return false;
            }
        }

        const vec3_temp = new Vec3();
        const rotate = worldMatrix && new Quat();
        const boundingBox = worldMatrix && new aabb();
        if (rotate) {
            worldMatrix!.getRotation(rotate);
        }
        if (!this._initialized && mesh._data) {
            const struct = JSON.parse(JSON.stringify(mesh._struct)) as Mesh.IStruct;
            const data = mesh._data.slice();
            if (worldMatrix) {
                if (struct.maxPosition && struct.minPosition) {
                    Vec3.add(boundingBox!.center, struct.maxPosition, struct.minPosition);
                    Vec3.multiplyScalar(boundingBox!.center, boundingBox!.center, 0.5);
                    Vec3.subtract(boundingBox!.halfExtents, struct.maxPosition, struct.minPosition);
                    Vec3.multiplyScalar(boundingBox!.halfExtents, boundingBox!.halfExtents, 0.5);
                    aabb.transform(boundingBox!, boundingBox!, worldMatrix);
                    Vec3.add(struct.maxPosition, boundingBox!.center, boundingBox!.halfExtents);
                    Vec3.subtract(struct.minPosition, boundingBox!.center, boundingBox!.halfExtents);
                }
                for (let i = 0; i < struct.vertexBundles.length; i++) {
                    const vtxBdl = struct.vertexBundles[i];
                    for (let j = 0; j < vtxBdl.attributes.length; j++) {
                        if (vtxBdl.attributes[j].name === GFXAttributeName.ATTR_POSITION || vtxBdl.attributes[j].name === GFXAttributeName.ATTR_NORMAL) {
                            const format = vtxBdl.attributes[j].format;

                            const inputView = new DataView(
                                data.buffer,
                                vtxBdl.view.offset + getOffset(vtxBdl.attributes, j));

                            const reader = getReader(inputView, format);
                            const writer = getWriter(inputView, format);
                            if (!reader || !writer) {
                                continue;
                            }
                            const vertexCount = vtxBdl.view.count;

                            const vertexStride = vtxBdl.view.stride;
                            const attrComponentByteLength = getComponentByteLength(format);
                            for (let vtxIdx = 0; vtxIdx < vertexCount; vtxIdx++) {
                                const xOffset = vtxIdx * vertexStride;
                                const yOffset = xOffset + attrComponentByteLength;
                                const zOffset = yOffset + attrComponentByteLength;
                                vec3_temp.set(reader(xOffset), reader(yOffset), reader(zOffset));
                                switch (vtxBdl.attributes[j].name) {
                                    case GFXAttributeName.ATTR_POSITION:
                                        vec3_temp.transformMat4(worldMatrix);
                                        break;
                                    case GFXAttributeName.ATTR_NORMAL:
                                        Vec3.transformQuat(vec3_temp, vec3_temp, rotate!);
                                        break;
                                }
                                writer(xOffset, vec3_temp.x);
                                writer(yOffset, vec3_temp.y);
                                writer(zOffset, vec3_temp.z);
                            }
                        }
                    }
                }
            }
            this.reset({ struct, data });
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

            srcVBView = this._data!.subarray(srcOffset, srcOffset + bundle.view.length);
            srcOffset += srcVBView.length;
            dstVBView = mesh._data!.subarray(dstOffset, dstOffset + dstBundle.view.length);
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
                    dstVBOffset += GFXFormatInfos[dstAttr.format].size;
                }
                if (hasAttr) {
                    attrSize = GFXFormatInfos[attr.format].size;
                    srcVBOffset = bundle.view.length + srcAttrOffset;
                    for (let v = 0; v < dstBundle.view.count; ++v) {
                        dstAttrView = dstVBView.subarray(dstVBOffset, dstVBOffset + attrSize);
                        vbView.set(dstAttrView, srcVBOffset);
                        if ((attr.name === GFXAttributeName.ATTR_POSITION || attr.name === GFXAttributeName.ATTR_NORMAL) && worldMatrix) {
                            const f32_temp = new Float32Array(vbView.buffer, srcVBOffset, 3);
                            vec3_temp.set(f32_temp[0], f32_temp[1], f32_temp[2]);
                            switch (attr.name) {
                                case GFXAttributeName.ATTR_POSITION:
                                    vec3_temp.transformMat4(worldMatrix);
                                    break;
                                case GFXAttributeName.ATTR_NORMAL:
                                    Vec3.transformQuat(vec3_temp, vec3_temp, rotate!);
                                    break;
                            }
                            f32_temp[0] = vec3_temp.x;
                            f32_temp[1] = vec3_temp.y;
                            f32_temp[2] = vec3_temp.z;
                        }
                        srcVBOffset += bundle.view.stride;
                        dstVBOffset += dstBundle.view.stride;
                    }
                }
                srcAttrOffset += GFXFormatInfos[attr.format].size;
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
                    srcIBView = new Uint16Array(this._data!.buffer, srcOffset, prim.indexView.count);
                } else if (prim.indexView.stride === 1) {
                    srcIBView = new Uint8Array(this._data!.buffer, srcOffset, prim.indexView.count);
                } else { // Uint32
                    srcIBView = new Uint32Array(this._data!.buffer, srcOffset, prim.indexView.count);
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
                    dstIBView = new Uint16Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
                } else if (dstPrim.indexView.stride === 1) {
                    dstIBView = new Uint8Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
                } else { // Uint32
                    dstIBView = new Uint32Array(mesh._data!.buffer, dstOffset, dstPrim.indexView.count);
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
                aabb.transform(boundingBox!, boundingBox!, worldMatrix);
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
     * 验证指定网格是否可以合并至当前网格。
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
     * @param mesh 指定的网格。
     */
    public validateMergingMesh (mesh: Mesh) {
        if (!this._data && mesh._data) {
            return true;
        }

        // validate vertex bundles
        if (this._struct.vertexBundles.length !== mesh._struct.vertexBundles.length) {
            return false;
        }

        for (let i = 0; i < this._struct.vertexBundles.length; ++i) {
            const bundle = this._struct.vertexBundles[i];
            const dstBundle = mesh._struct.vertexBundles[i];

            if (bundle.attributes.length !== dstBundle.attributes.length) {
                return false;
            }
            for (let j = 0; j < bundle.attributes.length; ++j) {
                if (bundle.attributes[j].format !== dstBundle.attributes[j].format) {
                    return false;
                }
            }
        }

        // validate primitives
        if (this._struct.primitives.length !== mesh._struct.primitives.length) {
            return false;
        }
        for (let i = 0; i < this._struct.primitives.length; ++i) {
            const prim = this._struct.primitives[i];
            const dstPrim = mesh._struct.primitives[i];
            if (prim.vertexBundelIndices.length !== dstPrim.vertexBundelIndices.length) {
                return false;
            }
            for (let j = 0; j < prim.vertexBundelIndices.length; ++j) {
                if (prim.vertexBundelIndices[j] !== dstPrim.vertexBundelIndices[j]) {
                    return false;
                }
            }
            if (prim.primitiveMode !== dstPrim.primitiveMode) {
                return false;
            }

            if (prim.indexView) {
                if (dstPrim.indexView === undefined) {
                    return false;
                }
            } else {
                if (dstPrim.indexView) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 读取子网格的指定属性。
     * @param primitiveIndex 子网格索引。
     * @param attributeName 属性名称。
     * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `null`，
     * 否则，创建足够大的缓冲区包含指定属性的所有数据，并为该缓冲区创建与属性类型对应的数组视图。
     */
    public readAttribute (primitiveIndex: number, attributeName: GFXAttributeName): Storage | null {
        let result: TypedArray | null = null;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const format = vertexBundle.attributes[iAttribute].format;

            const inputView = new DataView(
                this._data!.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));

            const formatInfo = GFXFormatInfos[format];
            const storageConstructor = getTypedArrayConstructor(GFXFormatInfos[format]);
            const reader = getReader(inputView, format);
            if (!storageConstructor || !reader) {
                return;
            }
            const vertexCount = vertexBundle.view.count;
            const componentCount = formatInfo.count;
            const storage = new storageConstructor(vertexCount * componentCount);
            const inputStride = vertexBundle.view.stride;
            for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
                    storage[componentCount * iVertex + iComponent] = reader(inputStride * iVertex + storage.BYTES_PER_ELEMENT * iComponent);
                }
            }
            result = storage;
            return;
        });
        return result;
    }

    /**
     * 读取子网格的指定属性到目标缓冲区中。
     * @param primitiveIndex 子网格索引。
     * @param attributeName 属性名称。
     * @param buffer 目标缓冲区。
     * @param stride 相邻属性在目标缓冲区的字节间隔。
     * @param offset 首个属性在目标缓冲区中的偏移。
     * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `false`，否则返回 `true`。
     */
    public copyAttribute (primitiveIndex: number, attributeName: GFXAttributeName, buffer: ArrayBuffer, stride: number, offset: number) {
        let written = false;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const format = vertexBundle.attributes[iAttribute].format;

            const inputView = new DataView(
                this._data!.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));

            const outputView = new DataView(buffer, offset);

            const formatInfo = GFXFormatInfos[format];

            const reader = getReader(inputView, format);
            const writer = getWriter(outputView, format);
            if (!reader || !writer) {
                return;
            }

            const vertexCount = vertexBundle.view.count;
            const componentCount = formatInfo.count;

            const inputStride = vertexBundle.view.stride;
            const inputComponentByteLength = getComponentByteLength(format);
            const outputStride = stride;
            const outputComponentByteLength = inputComponentByteLength;
            for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
                    const inputOffset = inputStride * iVertex + inputComponentByteLength * iComponent;
                    const outputOffset = outputStride * iVertex + outputComponentByteLength * iComponent;
                    writer(outputOffset, reader(inputOffset));
                }
            }
            written = true;
            return;
        });
        return written;
    }

    /**
     * 读取子网格的索引数据。
     * @param primitiveIndex 子网格索引。
     * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `null`，
     * 否则，创建足够大的缓冲区包含所有索引数据，并为该缓冲区创建与索引类型对应的数组视图。
     */
    public readIndices (primitiveIndex: number) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return null;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return null;
        }
        const stride = primitive.indexView.stride;
        const ctor = stride === 1 ? Uint8Array : (stride === 2 ? Uint16Array : Uint32Array);
        return new ctor(this._data.buffer, primitive.indexView.offset, primitive.indexView.count);
    }

    /**
     * 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex 子网格索引。
     * @param outputArray 目标数组。
     * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `false`，否则返回 `true`。
     */
    public copyIndices (primitiveIndex: number, outputArray: number[] | ArrayBufferView) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return false;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return false;
        }
        const indexCount = primitive.indexView.count;
        const indexFormat = primitive.indexView.stride === 1 ? GFXFormat.R8UI : (primitive.indexView.stride === 2 ? GFXFormat.R16UI : GFXFormat.R32UI);
        const reader = getReader(new DataView(this._data.buffer), indexFormat)!;
        for (let i = 0; i < indexCount; ++i) {
            outputArray[i] = reader(primitive.indexView.offset + GFXFormatInfos[indexFormat].size * i);
        }
        return true;
    }

    private _accessAttribute (
        primitiveIndex: number,
        attributeName: GFXAttributeName,
        accessor: (vertexBundle: Mesh.IVertexBundle, iAttribute: number) => void) {
        if (!this._data ||
            primitiveIndex >= this._struct.primitives.length) {
            return;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        for (const vertexBundleIndex of primitive.vertexBundelIndices) {
            const vertexBundle = this._struct.vertexBundles[vertexBundleIndex];
            const iAttribute = vertexBundle.attributes.findIndex((a) => a.name === attributeName);
            if (iAttribute < 0) {
                continue;
            }
            accessor(vertexBundle, iAttribute);
            break;
        }
        return;
    }

    private _createVertexBuffers (gfxDevice: GFXDevice, data: ArrayBuffer): GFXBuffer[] {
        return this._struct.vertexBundles.map((vertexBundle) => {

            const vertexBuffer = gfxDevice.createBuffer({
                usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: vertexBundle.view.length,
                stride: vertexBundle.view.stride,
            });

            const view = new Uint8Array(data, vertexBundle.view.offset, vertexBundle.view.length);
            if (this.loaded) {
                vertexBuffer.update(view);
            }
            else {
                this.once('load', () => {
                    vertexBuffer.update(view);
                });
            }
            return vertexBuffer;
        });
    }

    public morphRendering: MorphRendering | null = null;
}
legacyCC.Mesh = Mesh;

function getOffset (attributes: IGFXAttribute[], attributeIndex: number) {
    let result = 0;
    for (let i = 0; i < attributeIndex; ++i) {
        const attribute = attributes[i];
        result += GFXFormatInfos[attribute.format].size;
    }
    return result;
}

const isLittleEndian = sys.isLittleEndian;

function getComponentByteLength (format: GFXFormat) {
    const info = GFXFormatInfos[format];
    return info.size / info.count;
}

function getReader (dataView: DataView, format: GFXFormat) {
    const info = GFXFormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
        case GFXFormatType.UNORM: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getUint8(offset);
                case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.SNORM: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getInt8(offset);
                case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getInt8(offset);
                case 2: return (offset: number) => dataView.getInt16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getInt32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return (offset: number) => dataView.getUint8(offset);
                case 2: return (offset: number) => dataView.getUint16(offset, isLittleEndian);
                case 4: return (offset: number) => dataView.getUint32(offset, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return (offset: number) => dataView.getFloat32(offset, isLittleEndian);
        }
    }

    return null;
}

function getWriter (dataView: DataView, format: GFXFormat) {
    const info = GFXFormatInfos[format];
    const stride = info.size / info.count;

    switch (info.type) {
        case GFXFormatType.UNORM: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.SNORM: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setInt8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return (offset: number, value: number) => dataView.setUint8(offset, value);
                case 2: return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
                case 4: return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return (offset: number, value: number) => dataView.setFloat32(offset, value, isLittleEndian);
        }
    }

    return null;
}

// function get
