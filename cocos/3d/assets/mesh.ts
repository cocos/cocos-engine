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
    FormatInfos, FormatType, MemoryUsageBit, PrimitiveMode, getTypedArrayConstructor,
} from '../../core/gfx';
import { Mat4, Quat, Vec3 } from '../../core/math';
import { Morph, MorphRendering, createMorphRendering } from './morph';

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
        morph?: Morph;
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

/**
 * @en Mesh asset
 * @zh 网格资源。
 */
@ccclass('cc.Mesh')
export class Mesh extends Asset {
    /**
     * @legacyPublic
     */
    get _nativeAsset (): ArrayBuffer {
        return this._data.buffer;
    }
    set _nativeAsset (value: ArrayBuffer) {
        this._data = new Uint8Array(value);
    }

    /**
     * @en The sub meshes count of the mesh.
     * @zh 此网格的子网格数量。
     * @deprecated Please use [[renderingSubMeshes.length]] instead
     */
    get subMeshCount () {
        const renderingMesh = this.renderingSubMeshes;
        return renderingMesh ? renderingMesh.length : 0;
    }

    /**
     * @en The minimum position of all vertices in the mesh
     * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.minPosition]] instead
     */
    get minPosition () {
        return this.struct.minPosition;
    }

    /**
     * @en The maximum position of all vertices in the mesh
     * @zh （各分量都）大于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.maxPosition]] instead
     */
    get maxPosition () {
        return this.struct.maxPosition;
    }

    /**
     * @en The struct of the mesh
     * @zh 此网格的结构。
     */
    get struct () {
        return this._struct;
    }

    /**
     * @en The actual data of the mesh
     * @zh 此网格的数据。
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

    /**
     * The index of the joint buffer of all sub meshes in the joint map buffers
     */
    get jointBufferIndices () {
        if (this._jointBufferIndices) { return this._jointBufferIndices; }
        return this._jointBufferIndices = this._struct.primitives.map((p) => p.jointMapIndex || 0);
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

    @serializable
    private _struct: Mesh.IStruct = {
        vertexBundles: [],
        primitives: [],
    };

    @serializable
    private _hash = 0;

    private _data: Uint8Array = globalEmptyMeshBuffer;

    private _initialized = false;

    private _renderingSubMeshes: RenderingSubMesh[] | null = null;

    private _boneSpaceBounds: Map<number, (AABB | null)[]> = new Map();

    private _jointBufferIndices: number[] | null = null;

    constructor () {
        super();
    }

    public onLoaded () {
        this.initialize();
    }

    public initialize () {
        if (this._initialized) {
            return;
        }

        this._initialized = true;
        const { buffer } = this._data;
        const gfxDevice: Device = legacyCC.director.root.device;
        const vertexBuffers = this._createVertexBuffers(gfxDevice, buffer);
        const indexBuffers: Buffer[] = [];
        const subMeshes: RenderingSubMesh[] = [];

        for (let i = 0; i < this._struct.primitives.length; i++) {
            const prim = this._struct.primitives[i];
            if (prim.vertexBundelIndices.length === 0) {
                continue;
            }

            let indexBuffer: Buffer | null = null;
            let ib: any = null;
            if (prim.indexView) {
                const idxView = prim.indexView;

                let dstStride = idxView.stride;
                let dstSize = idxView.length;
                if (dstStride === 4 && !gfxDevice.hasFeature(Feature.ELEMENT_INDEX_UINT)) {
                    const vertexCount = this._struct.vertexBundles[prim.vertexBundelIndices[0]].view.count;
                    if (vertexCount >= 65536) {
                        warnID(10001, vertexCount, 65536);
                        continue; // Ignore this primitive
                    } else {
                        dstStride >>= 1; // Reduce to short.
                        dstSize >>= 1;
                    }
                }

                indexBuffer = gfxDevice.createBuffer(new BufferInfo(
                    BufferUsageBit.INDEX,
                    MemoryUsageBit.DEVICE,
                    dstSize,
                    dstStride,
                ));
                indexBuffers.push(indexBuffer);

                ib = new (getIndexStrideCtor(idxView.stride))(buffer, idxView.offset, idxView.count);
                if (idxView.stride !== dstStride) {
                    ib = getIndexStrideCtor(dstStride).from(ib);
                }
                indexBuffer.update(ib);
            }

            const vbReference = prim.vertexBundelIndices.map((idx) => vertexBuffers[idx]);

            const gfxAttributes: Attribute[] = [];
            if (prim.vertexBundelIndices.length > 0) {
                const idx = prim.vertexBundelIndices[0];
                const vertexBundle = this._struct.vertexBundles[idx];
                const attrs = vertexBundle.attributes;
                for (let j = 0; j < attrs.length; ++j) {
                    const attr = attrs[j];
                    gfxAttributes[j] = new Attribute(attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location);
                }
            }

            const subMesh = new RenderingSubMesh(vbReference, gfxAttributes, prim.primitiveMode, indexBuffer);
            subMesh.mesh = this; subMesh.subMeshIdx = i;

            subMeshes.push(subMesh);
        }

        this._renderingSubMeshes = subMeshes;

        if (this._struct.morph) {
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
     */
    public reset (info: Mesh.ICreateInfo) {
        this.destroyRenderingMesh();
        this._struct = info.struct;
        this._data = info.data;
        this._hash = 0;
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
        const { primitives } = this._struct;
        for (let p = 0; p < primitives.length; p++) {
            const joints = this.readAttribute(p, AttributeName.ATTR_JOINTS);
            const weights = this.readAttribute(p, AttributeName.ATTR_WEIGHTS);
            const positions = this.readAttribute(p, AttributeName.ATTR_POSITION);
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
        const rotate = worldMatrix && new Quat();
        const boundingBox = worldMatrix && new AABB();
        if (rotate) {
            worldMatrix!.getRotation(rotate);
        }
        if (!this._initialized) {
            const struct = JSON.parse(JSON.stringify(mesh._struct)) as Mesh.IStruct;
            const data = mesh._data.slice();
            if (worldMatrix) {
                if (struct.maxPosition && struct.minPosition) {
                    Vec3.add(boundingBox!.center, struct.maxPosition, struct.minPosition);
                    Vec3.multiplyScalar(boundingBox!.center, boundingBox!.center, 0.5);
                    Vec3.subtract(boundingBox!.halfExtents, struct.maxPosition, struct.minPosition);
                    Vec3.multiplyScalar(boundingBox!.halfExtents, boundingBox!.halfExtents, 0.5);
                    AABB.transform(boundingBox!, boundingBox!, worldMatrix);
                    Vec3.add(struct.maxPosition, boundingBox!.center, boundingBox!.halfExtents);
                    Vec3.subtract(struct.minPosition, boundingBox!.center, boundingBox!.halfExtents);
                }
                for (let i = 0; i < struct.vertexBundles.length; i++) {
                    const vtxBdl = struct.vertexBundles[i];
                    for (let j = 0; j < vtxBdl.attributes.length; j++) {
                        if (vtxBdl.attributes[j].name === AttributeName.ATTR_POSITION || vtxBdl.attributes[j].name === AttributeName.ATTR_NORMAL) {
                            const { format } = vtxBdl.attributes[j];

                            const inputView = new DataView(
                                data.buffer,
                                vtxBdl.view.offset + getOffset(vtxBdl.attributes, j),
                            );

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
                                case AttributeName.ATTR_POSITION:
                                    vec3_temp.transformMat4(worldMatrix);
                                    break;
                                case AttributeName.ATTR_NORMAL:
                                    Vec3.transformQuat(vec3_temp, vec3_temp, rotate!);
                                    break;
                                default:
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
                                Vec3.transformQuat(vec3_temp, vec3_temp, rotate!);
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
    public validateMergingMesh (mesh: Mesh) {
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
            } else if (dstPrim.indexView) {
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
        let result: TypedArray | null = null;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const vertexCount = vertexBundle.view.count;
            const { format } = vertexBundle.attributes[iAttribute];
            const StorageConstructor = getTypedArrayConstructor(FormatInfos[format]);
            if (vertexCount === 0) {
                return;
            }

            const inputView = new DataView(
                this._data.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute),
            );

            const formatInfo = FormatInfos[format];
            const reader = getReader(inputView, format);
            if (!StorageConstructor || !reader) {
                return;
            }
            const componentCount = formatInfo.count;
            const storage = new StorageConstructor(vertexCount * componentCount);
            const inputStride = vertexBundle.view.stride;
            for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
                    storage[componentCount * iVertex + iComponent] = reader(inputStride * iVertex + storage.BYTES_PER_ELEMENT * iComponent);
                }
            }
            result = storage;
        });
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
        let written = false;
        this._accessAttribute(primitiveIndex, attributeName, (vertexBundle, iAttribute) => {
            const vertexCount = vertexBundle.view.count;
            if (vertexCount === 0) {
                written = true;
                return;
            }
            const { format } = vertexBundle.attributes[iAttribute];

            const inputView = new DataView(
                this._data.buffer,
                vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute),
            );

            const outputView = new DataView(buffer, offset);

            const formatInfo = FormatInfos[format];

            const reader = getReader(inputView, format);
            const writer = getWriter(outputView, format);
            if (!reader || !writer) {
                return;
            }

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
        });
        return written;
    }

    /**
     * @en Read the indices data of the given sub mesh
     * @zh 读取子网格的索引数据。
     * @param primitiveIndex Sub mesh index
     * @returns Return null if not found or can't read, otherwise, will create a large enough typed array to contain all indices data,
     * the array type will use the corresponding stride size.
     */
    public readIndices (primitiveIndex: number) {
        if (primitiveIndex >= this._struct.primitives.length) {
            return null;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return null;
        }
        const { stride } = primitive.indexView;
        const Ctor = stride === 1 ? Uint8Array : (stride === 2 ? Uint16Array : Uint32Array);
        return new Ctor(this._data.buffer, primitive.indexView.offset, primitive.indexView.count);
    }

    /**
     * @en Read the indices data of the given sub mesh and fill into the given array
     * @zh 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex Sub mesh index
     * @param outputArray The target output array
     * @returns Return false if failed to access the indices data, return true otherwise.
     */
    public copyIndices (primitiveIndex: number, outputArray: number[] | ArrayBufferView): boolean {
        if (primitiveIndex >= this._struct.primitives.length) {
            return false;
        }
        const primitive = this._struct.primitives[primitiveIndex];
        if (!primitive.indexView) {
            return false;
        }
        const indexCount = primitive.indexView.count;
        const indexFormat = primitive.indexView.stride === 1 ? Format.R8UI : (primitive.indexView.stride === 2 ? Format.R16UI : Format.R32UI);
        const reader = getReader(new DataView(this._data.buffer), indexFormat)!;
        for (let i = 0; i < indexCount; ++i) {
            outputArray[i] = reader(primitive.indexView.offset + FormatInfos[indexFormat].size * i);
        }
        return true;
    }

    private _accessAttribute (
        primitiveIndex: number,
        attributeName: AttributeName,
        accessor: (vertexBundle: Mesh.IVertexBundle, iAttribute: number) => void,
    ) {
        if (primitiveIndex >= this._struct.primitives.length) {
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
    }

    private _createVertexBuffers (gfxDevice: Device, data: ArrayBuffer): Buffer[] {
        return this._struct.vertexBundles.map((vertexBundle) => {
            const vertexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX,
                MemoryUsageBit.DEVICE,
                vertexBundle.view.length,
                vertexBundle.view.stride,
            ));

            const view = new Uint8Array(data, vertexBundle.view.offset, vertexBundle.view.length);
            vertexBuffer.update(view);
            return vertexBuffer;
        });
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
}
legacyCC.Mesh = Mesh;

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

// function get
