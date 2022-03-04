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

import { legacyCC } from '../global-exports';
import { mapBuffer } from '../../3d/misc/buffer';
import {
    Attribute, Device, InputAssemblerInfo, Buffer, BufferInfo, AttributeName, BufferUsageBit,
    Format, FormatInfos, MemoryUsageBit, PrimitiveMode, getTypedArrayConstructor,
} from '../gfx';
import { Vec3 } from '../math';
import { Mesh } from '../../3d/assets/mesh';

/**
 * @en Array views for index buffer
 * @zh 允许存储索引的数组视图。
 */
export type IBArray = Uint8Array | Uint16Array | Uint32Array;

/**
 * @en The interface of geometric information
 * @zh 几何信息。
 */
export interface IGeometricInfo {
    /**
     * @en Vertex positions
     * @zh 顶点位置。
     */
    positions: Float32Array;

    /**
     * @en Indices data
     * @zh 索引数据。
     */
    indices?: IBArray;

    /**
     * @en Whether the geometry is treated as double sided
     * @zh 是否将图元按双面对待。
     */
    doubleSided?: boolean;

    /**
     * @en The bounding box
     * @zh 此几何体的轴对齐包围盒。
     */
    boundingBox: { max: Vec3 | Readonly<Vec3>; min: Vec3 | Readonly<Vec3> };
}

/**
 * @en Flat vertex buffer
 * @zh 扁平化顶点缓冲区
 */
export interface IFlatBuffer {
    stride: number;
    count: number;
    buffer: Uint8Array;
}

/**
 * @en Sub mesh for rendering which contains all geometry data, it can be used to create [[InputAssembler]].
 * @zh 包含所有顶点数据的渲染子网格，可以用来创建 [[InputAssembler]]。
 */
export class RenderingSubMesh {
    public mesh?: Mesh;

    public subMeshIdx?: number;

    private _flatBuffers: IFlatBuffer[] = [];

    private _jointMappedBuffers?: Buffer[];

    private _jointMappedBufferIndices?: number[];

    private _vertexIdChannel?: { stream: number; index: number };

    private _geometricInfo?: IGeometricInfo;

    private _vertexBuffers: Buffer[];

    private _attributes: Attribute[];

    private _indexBuffer: Buffer | null = null;

    private _indirectBuffer: Buffer | null = null;

    private _primitiveMode: PrimitiveMode;

    private _iaInfo: InputAssemblerInfo;

    constructor (
        vertexBuffers: Buffer[], attributes: Attribute[], primitiveMode: PrimitiveMode,
        indexBuffer: Buffer | null = null, indirectBuffer: Buffer | null = null,
    ) {
        this._attributes = attributes;
        this._vertexBuffers = vertexBuffers;
        this._indexBuffer = indexBuffer;
        this._indirectBuffer = indirectBuffer;
        this._primitiveMode = primitiveMode;
        this._iaInfo = new InputAssemblerInfo(attributes, vertexBuffers, indexBuffer, indirectBuffer);
    }

    /**
     * @en All vertex attributes used by the sub mesh
     * @zh 所有顶点属性。
     */
    get attributes () { return this._attributes; }

    /**
     * @en All vertex buffers used by the sub mesh
     * @zh 使用的所有顶点缓冲区。
     */
    get vertexBuffers () { return this._vertexBuffers; }

    /**
     * @en Index buffer used by the sub mesh
     * @zh 使用的索引缓冲区，若未使用则无需指定。
     */
    get indexBuffer () { return this._indexBuffer; }

    /**
     * @en Indirect buffer used by the sub mesh
     * @zh 间接绘制缓冲区。
     */
    get indirectBuffer () { return this._indirectBuffer; }

    /**
     * @en Primitive mode used by the sub mesh
     * @zh 图元类型。
     */
    get primitiveMode () { return this._primitiveMode; }

    /**
     * @en The geometric info of the sub mesh, used for raycast.
     * @zh （用于射线检测的）几何信息。
     */
    get geometricInfo (): IGeometricInfo {
        if (this._geometricInfo) {
            return this._geometricInfo;
        }
        if (this.mesh === undefined) {
            return { positions: new Float32Array(), indices: new Uint8Array(), boundingBox: { min: Vec3.ZERO, max: Vec3.ZERO } };
        }
        if (this.subMeshIdx === undefined) {
            return { positions: new Float32Array(), indices: new Uint8Array(), boundingBox: { min: Vec3.ZERO, max: Vec3.ZERO } };
        }
        const { mesh } = this; const index = this.subMeshIdx;
        const positions = mesh.readAttribute(index, AttributeName.ATTR_POSITION) as unknown as Float32Array;
        const indices = mesh.readIndices(index) as Uint16Array;
        const max = new Vec3();
        const min = new Vec3();
        const pAttri = this.attributes.find((element) => element.name === AttributeName.ATTR_POSITION);
        if (pAttri) {
            const conut = FormatInfos[pAttri.format].count;
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
     * @en Flatted vertex buffers
     * @zh 扁平化的顶点缓冲区。
     */
    get flatBuffers () { return this._flatBuffers; }

    public genFlatBuffers () {
        if (this._flatBuffers.length || !this.mesh || this.subMeshIdx === undefined) { return; }

        const { mesh } = this;
        let idxCount = 0;
        const prim = mesh.struct.primitives[this.subMeshIdx];
        if (prim.indexView) { idxCount = prim.indexView.count; }
        for (let i = 0; i < prim.vertexBundelIndices.length; i++) {
            const bundleIdx = prim.vertexBundelIndices[i];
            const vertexBundle = mesh.struct.vertexBundles[bundleIdx];
            const vbCount = prim.indexView ? prim.indexView.count : vertexBundle.view.count;
            const vbStride = vertexBundle.view.stride;
            const vbSize = vbStride * vbCount;
            const view = new Uint8Array(mesh.data.buffer, vertexBundle.view.offset, vertexBundle.view.length);
            const sharedView = new Uint8Array(prim.indexView ? vbSize : vertexBundle.view.length);

            if (!prim.indexView) {
                sharedView.set(mesh.data.subarray(vertexBundle.view.offset, vertexBundle.view.offset + vertexBundle.view.length));
                this._flatBuffers.push({ stride: vbStride, count: vbCount, buffer: sharedView });
                continue;
            }

            const ibView = mesh.readIndices(this.subMeshIdx)!;
            // transform to flat buffer
            for (let n = 0; n < idxCount; ++n) {
                const idx = ibView[n];
                const offset = n * vbStride;
                const srcOffset = idx * vbStride;
                for (let m = 0; m < vbStride; ++m) {
                    sharedView[offset + m] = view[srcOffset + m];
                }
            }
            this._flatBuffers.push({ stride: vbStride, count: vbCount, buffer: sharedView });
        }
    }

    /**
     * @en The vertex buffer for joint after mapping
     * @zh 骨骼索引按映射表处理后的顶点缓冲。
     */
    get jointMappedBuffers () {
        if (this._jointMappedBuffers) { return this._jointMappedBuffers; }
        const buffers: Buffer[] = this._jointMappedBuffers = [];
        const indices: number[] = this._jointMappedBufferIndices = [];
        if (!this.mesh || this.subMeshIdx === undefined) { return this._jointMappedBuffers = this.vertexBuffers; }
        const { struct } = this.mesh;
        const prim = struct.primitives[this.subMeshIdx];
        if (!struct.jointMaps || prim.jointMapIndex === undefined || !struct.jointMaps[prim.jointMapIndex]) {
            return this._jointMappedBuffers = this.vertexBuffers;
        }
        let jointFormat: Format;
        let jointOffset: number;
        const { device } = legacyCC.director.root;
        for (let i = 0; i < prim.vertexBundelIndices.length; i++) {
            const bundle = struct.vertexBundles[prim.vertexBundelIndices[i]];
            jointOffset = 0;
            jointFormat = Format.UNKNOWN;
            for (let j = 0; j < bundle.attributes.length; j++) {
                const attr = bundle.attributes[j];
                if (attr.name === AttributeName.ATTR_JOINTS) {
                    jointFormat = attr.format;
                    break;
                }
                jointOffset += FormatInfos[attr.format].size;
            }
            if (jointFormat) {
                const data = new Uint8Array(this.mesh.data.buffer, bundle.view.offset, bundle.view.length);
                const dataView = new DataView(data.slice().buffer);
                const idxMap = struct.jointMaps[prim.jointMapIndex];
                mapBuffer(dataView, (cur) => idxMap.indexOf(cur), jointFormat, jointOffset,
                    bundle.view.length, bundle.view.stride, dataView);
                const buffer = device.createBuffer(new BufferInfo(
                    BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.DEVICE,
                    bundle.view.length,
                    bundle.view.stride,
                ));
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

    get iaInfo () { return this._iaInfo; }

    public destroy () {
        for (let i = 0; i < this.vertexBuffers.length; i++) {
            this.vertexBuffers[i].destroy();
        }
        this.vertexBuffers.length = 0;
        if (this._indexBuffer) {
            this._indexBuffer.destroy();
            this._indexBuffer = null;
        }
        if (this._jointMappedBuffers && this._jointMappedBufferIndices) {
            for (let i = 0; i < this._jointMappedBufferIndices.length; i++) {
                this._jointMappedBuffers[this._jointMappedBufferIndices[i]].destroy();
            }
            this._jointMappedBuffers = undefined;
            this._jointMappedBufferIndices = undefined;
        }
        if (this._indirectBuffer) {
            this._indirectBuffer.destroy();
            this._indirectBuffer = null;
        }
    }

    /**
     * @en Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
     * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
     * Once you call this function, the vertex attribute is permanently added.
     * Subsequent calls to this function take no effect.
     * @param device Device used to create related rendering resources.
     */
    public enableVertexIdChannel (device: Device) {
        if (this._vertexIdChannel) {
            return;
        }

        const streamIndex = this.vertexBuffers.length;
        const attributeIndex = this.attributes.length;

        const vertexIdBuffer = this._allocVertexIdBuffer(device);
        this._vertexBuffers.push(vertexIdBuffer);
        this._attributes.push(new Attribute('a_vertexId', Format.R32F, false, streamIndex));

        this._iaInfo.attributes = this._attributes;
        this._iaInfo.vertexBuffers = this._vertexBuffers;

        this._vertexIdChannel = {
            stream: streamIndex,
            index: attributeIndex,
        };
    }

    private _allocVertexIdBuffer (device: Device) {
        const vertexCount = (this.vertexBuffers.length === 0 || this.vertexBuffers[0].stride === 0)
            ? 0
            // TODO: This depends on how stride of a vertex buffer is defined; Consider padding problem.
            : this.vertexBuffers[0].size / this.vertexBuffers[0].stride;
        const vertexIds = new Float32Array(vertexCount);
        for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
            // `+0.5` because on some platforms, the "fetched integer" may have small error.
            // For example `26` may yield `25.99999`, which is convert to `25` instead of `26` using `int()`.
            vertexIds[iVertex] = iVertex + 0.5;
        }

        const vertexIdBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            vertexIds.byteLength,
            vertexIds.BYTES_PER_ELEMENT,
        ));
        vertexIdBuffer.update(vertexIds);

        return vertexIdBuffer;
    }
}
