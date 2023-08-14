/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import meshopt_asm_factory from 'external:emscripten/meshopt/meshopt_decoder.asm.js';
import meshopt_wasm_factory from 'external:emscripten/meshopt/meshopt_decoder.wasm.js';

import { WASM_SUPPORT_MODE } from 'internal:constants';
import  zlib  from '../../../external/compression/zlib.min';
import { Mesh } from '../assets/mesh';
import { AttributeName, Format, FormatInfos, PrimitiveMode, Attribute } from '../../gfx';
import { Vec3, sys } from '../../core';
import { IGeometry, IDynamicGeometry, ICreateMeshOptions, ICreateDynamicMeshOptions } from '../../primitive/define';
import { writeBuffer } from './buffer';
import { BufferBlob } from './buffer-blob';
import { game } from '../../game';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

const _defAttrs: Attribute[] = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_TANGENT, Format.RGBA32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F),
];

const v3_1 = new Vec3();
/**
 * @deprecated
 */
export function createMesh (geometry: IGeometry, out?: Mesh, options?: ICreateMeshOptions): Mesh {
    options = options || {};
    // Collect attributes and calculate length of result vertex buffer.
    const attributes: Attribute[] = [];
    let stride = 0;
    const channels: { offset: number; data: number[]; attribute: Attribute; }[] = [];
    let vertCount = 0;

    let attr: Attribute | null;

    const positions = geometry.positions.slice();
    if (positions.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === AttributeName.ATTR_POSITION) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[0];
        }

        attributes.push(attr);
        const info = FormatInfos[attr.format];
        vertCount = Math.max(vertCount, Math.floor(positions.length / info.count));
        channels.push({ offset: stride, data: positions, attribute: attr });
        stride += info.size;
    }

    if (geometry.normals && geometry.normals.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === AttributeName.ATTR_NORMAL) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[1];
        }

        const info = FormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.normals.length / info.count));
        channels.push({ offset: stride, data: geometry.normals, attribute: attr });
        stride += info.size;
    }

    if (geometry.uvs && geometry.uvs.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === AttributeName.ATTR_TEX_COORD) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[2];
        }

        const info = FormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.uvs.length / info.count));
        channels.push({ offset: stride, data: geometry.uvs, attribute: attr });
        stride += info.size;
    }

    if (geometry.tangents && geometry.tangents.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === AttributeName.ATTR_TANGENT) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[3];
        }

        const info = FormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.tangents.length / info.count));
        channels.push({ offset: stride, data: geometry.tangents, attribute: attr });
        stride += info.size;
    }

    if (geometry.colors && geometry.colors.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === AttributeName.ATTR_COLOR) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[4];
        }

        const info = FormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.colors.length / info.count));
        channels.push({ offset: stride, data: geometry.colors, attribute: attr });
        stride += info.size;
    }

    if (geometry.customAttributes) {
        for (let k = 0; k < geometry.customAttributes.length; k++) {
            const ca = geometry.customAttributes[k];
            const info = FormatInfos[ca.attr.format];
            attributes.push(ca.attr);
            vertCount = Math.max(vertCount, Math.floor(ca.values.length / info.count));
            channels.push({ offset: stride, data: ca.values, attribute: ca.attr });
            stride += info.size;
        }
    }

    // Use this to generate final merged buffer.
    const bufferBlob = new BufferBlob();

    // Fill vertex buffer.
    const vertexBuffer = new ArrayBuffer(vertCount * stride);
    const vertexBufferView = new DataView(vertexBuffer);
    for (const channel of channels) {
        writeBuffer(vertexBufferView, channel.data, channel.attribute.format, channel.offset, stride);
    }
    bufferBlob.setNextAlignment(0);
    const vertexBundle: Mesh.IVertexBundle = {
        attributes,
        view: {
            offset: bufferBlob.getLength(),
            length: vertexBuffer.byteLength,
            count: vertCount,
            stride,
        },
    };
    bufferBlob.addBuffer(vertexBuffer);

    // Fill index buffer.
    let indexBuffer: ArrayBuffer | null = null;
    let idxCount = 0;
    const idxStride = 2;
    if (geometry.indices) {
        const { indices } = geometry;
        idxCount = indices.length;
        indexBuffer = new ArrayBuffer(idxStride * idxCount);
        const indexBufferView = new DataView(indexBuffer);
        writeBuffer(indexBufferView, indices, Format.R16UI);
    }

    // Create primitive.
    const primitive: Mesh.ISubMesh = {
        primitiveMode: geometry.primitiveMode || PrimitiveMode.TRIANGLE_LIST,
        vertexBundelIndices: [0],
    };

    if (indexBuffer) {
        bufferBlob.setNextAlignment(idxStride);
        primitive.indexView = {
            offset: bufferBlob.getLength(),
            length: indexBuffer.byteLength,
            count: idxCount,
            stride: idxStride,
        };
        bufferBlob.addBuffer(indexBuffer);
    }

    let minPosition = geometry.minPos;
    if (!minPosition && options.calculateBounds) {
        minPosition = Vec3.set(new Vec3(), Infinity, Infinity, Infinity);
        for (let iVertex = 0; iVertex < vertCount; ++iVertex) {
            Vec3.set(v3_1, positions[iVertex * 3 + 0], positions[iVertex * 3 + 1], positions[iVertex * 3 + 2]);
            Vec3.min(minPosition, minPosition, v3_1);
        }
    }
    let maxPosition = geometry.maxPos;
    if (!maxPosition && options.calculateBounds) {
        maxPosition = Vec3.set(new Vec3(), -Infinity, -Infinity, -Infinity);
        for (let iVertex = 0; iVertex < vertCount; ++iVertex) {
            Vec3.set(v3_1, positions[iVertex * 3 + 0], positions[iVertex * 3 + 1], positions[iVertex * 3 + 2]);
            Vec3.max(maxPosition, maxPosition, v3_1);
        }
    }

    // Create mesh struct.
    const meshStruct: Mesh.IStruct = {
        vertexBundles: [vertexBundle],
        primitives: [primitive],
    };
    if (minPosition) {
        meshStruct.minPosition = new Vec3(minPosition.x, minPosition.y, minPosition.z);
    }
    if (maxPosition) {
        meshStruct.maxPosition = new Vec3(maxPosition.x, maxPosition.y, maxPosition.z);
    }

    // Create mesh.
    if (!out) {
        out = new Mesh();
    }
    out.reset({
        struct: meshStruct,
        data: new Uint8Array(bufferBlob.getCombined()),
    });

    return out;
}

function getPadding (length: number, align: number): number {
    if (align > 0) {
        const remainder = length % align;
        if (remainder !== 0) {
            const padding = align - remainder;
            return padding;
        }
    }

    return 0;
}

function createDynamicMesh (primitiveIndex: number, geometry: IDynamicGeometry, out?: Mesh, options?: ICreateDynamicMeshOptions): Mesh {
    options = options || { maxSubMeshes: 1, maxSubMeshVertices: 1024, maxSubMeshIndices: 1024 };

    const attributes: Attribute[] = [];
    let stream = 0;

    if (geometry.positions.length > 0) {
        attributes.push(new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, stream++, false, 0));
    }

    if (geometry.normals && geometry.normals.length > 0) {
        attributes.push(new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F, false, stream++, false, 0));
    }

    if (geometry.uvs && geometry.uvs.length > 0) {
        attributes.push(new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F, false, stream++, false, 0));
    }

    if (geometry.tangents && geometry.tangents.length > 0) {
        attributes.push(new Attribute(AttributeName.ATTR_TANGENT, Format.RGBA32F, false, stream++, false, 0));
    }

    if (geometry.colors && geometry.colors.length > 0) {
        attributes.push(new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F, false, stream++, false, 0));
    }

    if (geometry.customAttributes) {
        for (let k = 0; k < geometry.customAttributes.length; k++) {
            const ca = geometry.customAttributes[k];
            const attr = new Attribute();
            attr.copy(ca.attr);
            attr.stream = stream++;
            attributes.push(attr);
        }
    }

    const vertexBundles: Mesh.IVertexBundle[] = [];
    const primitives: Mesh.ISubMesh[] = [];
    let dataSize = 0;

    for (let i = 0; i < options.maxSubMeshes; i++) {
        const primitive: Mesh.ISubMesh = {
            vertexBundelIndices: [],
            primitiveMode: geometry.primitiveMode || PrimitiveMode.TRIANGLE_LIST,
        };

        // add vertex buffers
        for (const attr of attributes) {
            const formatInfo = FormatInfos[attr.format];
            const vertexBufferSize = options.maxSubMeshVertices * formatInfo.size;

            const vertexView: Mesh.IBufferView = {
                offset: dataSize,
                length: vertexBufferSize,
                count: 0,
                stride: formatInfo.size,
            };

            const vertexBundle: Mesh.IVertexBundle = {
                view: vertexView,
                attributes: [attr],
            };

            const vertexBundleIndex = vertexBundles.length;
            primitive.vertexBundelIndices.push(vertexBundleIndex);
            vertexBundles.push(vertexBundle);
            dataSize += vertexBufferSize;
        }

        // add index buffer
        let stride = 0;
        if (geometry.indices16 && geometry.indices16.length > 0) {
            stride = 2;
        } else if (geometry.indices32 && geometry.indices32.length > 0) {
            stride = 4;
        }

        if (stride > 0) {
            dataSize += getPadding(dataSize, stride);
            const indexBufferSize = options.maxSubMeshIndices * stride;

            const indexView: Mesh.IBufferView = {
                offset: dataSize,
                length: indexBufferSize,
                count: 0,
                stride,
            };

            primitive.indexView = indexView;
            dataSize += indexBufferSize;
        }

        primitives.push(primitive);
    }

    const dynamicInfo: Mesh.IDynamicInfo = {
        maxSubMeshes: options.maxSubMeshes,
        maxSubMeshVertices: options.maxSubMeshVertices,
        maxSubMeshIndices: options.maxSubMeshIndices,
    };

    const dynamicStruct: Mesh.IDynamicStruct = {
        info: dynamicInfo,
        bounds: [],
    };
    dynamicStruct.bounds.length = options.maxSubMeshes;

    const meshStruct: Mesh.IStruct = {
        vertexBundles,
        primitives,
        dynamic: dynamicStruct,
    };

    const createInfo: Mesh.ICreateInfo = {
        struct: meshStruct,
        data: new Uint8Array(dataSize),
    };

    if (!out) {
        out = new Mesh();
    }

    out.reset(createInfo);
    out.initialize();
    out.updateSubMesh(primitiveIndex, geometry);

    return out;
}

// merge mesh utilities // TODO: refactor interface to use Mesh.IStruct and data only
function mergeMeshes (meshes: Mesh.ICreateInfo[] = []): Mesh.ICreateInfo {
    if (meshes.length === 0) {
        // create a empty mesh
        console.warn('mergeMeshes: meshes is empty');
        return new Mesh();
    }

    if (meshes.length === 1) {
        return meshes[0];
    }

    if (meshes.every((mesh) => mesh.struct.compressed)) {
        return new Mesh();
    }

    const validate_morph = (meshes: Mesh[]): boolean => {
        const morphs = meshes.map((mesh) => mesh.struct.morph);
        if (morphs.every((morph) => morph === undefined)) {
            // if all undefined, exit immediately
            return true;
        }

        return false;
    };

    const validate_compress = (meshes: Mesh[]): boolean => {
        const encodeds = meshes.map((mesh) => mesh.struct.encoded);
        const compresses = meshes.map((mesh) => mesh.struct.compressed);
        const quantizeds = meshes.map((mesh) => mesh.struct.quantized);

        if (encodeds.every((encoded) => encoded === undefined)
            && compresses.every((compress) => compress === undefined)
            && quantizeds.every((quantized) => quantized === undefined)) {
            // if all undefined, exit immediately
            return true;
        }

        const firstEncoded = encodeds[0]!;
        for (let i = 1; i < encodeds.length; i++) {
            if (encodeds[i] !== firstEncoded) {
                return false;
            }
        }

        const firstCompress = compresses[0]!;
        for (let i = 1; i < compresses.length; i++) {
            if (compresses[i] !== firstCompress) {
                return false;
            }
        }

        const firstQuantized = quantizeds[0]!;
        for (let i = 1; i < quantizeds.length; i++) {
            if (quantizeds[i] !== firstQuantized) {
                return false;
            }
        }

        return true;
    };

    // validate joint map[][], joint map should be the same
    const validata_jointMap = (meshes: Mesh[]): boolean => {
        const jointMaps = meshes.map((mesh) => mesh.struct.jointMaps);
        // no joint map, or all joint map are the same
        if (jointMaps.every((jointMap) => jointMap === undefined)) {
            return true;
        }

        // all should be the same, data
        const firstJointMap = jointMaps[0]!;
        const xdim = firstJointMap.length;
        for (let i = 1; i < jointMaps.length; i++) {
            const jointMap = jointMaps[i]!;
            if (jointMap.length !== xdim) {
                return false;
            }

            for (let j = 0; j < jointMap.length; j++) {
                const ydim = firstJointMap[j].length;
                if (jointMap[j].length !== ydim) {
                    return false;
                }

                for (let k = 0; k < ydim; k++) {
                    if (jointMap[j][k] !== firstJointMap[j][k]) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    if (!validate_compress(meshes)) {
        console.warn('mergeMeshes: encoded state is not the same');
        return new Mesh();
    }

    if (!validata_jointMap(meshes)) {
        console.warn('mergeMeshes: jointMap is not the same');
        return new Mesh();
    }

    if (!validate_morph(meshes)) {
        console.warn('mergeMeshes: morph is not supported');
        return new Mesh();
    }

    const bufferSize = meshes.reduce((acc, cur) => acc + cur.data.byteLength, 0);

    const data = new Uint8Array(bufferSize);
    const vertexBundles: Mesh.IVertexBundle[] = [];
    const primitives: Mesh.ISubMesh[] = [];

    let data_offset = 0;
    let bundle_offset = 0;

    const minPosition = meshes[0].struct.minPosition || new Vec3(1e9);
    const maxPosition = meshes[0].struct.maxPosition || new Vec3(-1e9);

    for (let i = 0; i < meshes.length; i++) {
        // copy data from mesh.data to data at offset
        const mesh = meshes[i];
        const meshData = mesh.data;

        // append data to the end of the buffer
        data.set(meshData, data_offset);

        // copy the vertex bundles
        // eslint-disable-next-line no-loop-func
        vertexBundles.push(...mesh.struct.vertexBundles.map((bundle) => {
            const newBundle = bundle;
            newBundle.view.offset += data_offset;
            return newBundle;
        }));

        // copy the primitives, and apply the offset to view
        // eslint-disable-next-line no-loop-func
        primitives.push(...mesh.struct.primitives.map((primitive) => {
            const newPrimitive = primitive;
            newPrimitive.vertexBundelIndices = primitive.vertexBundelIndices.map((index) => index + bundle_offset);
            if (newPrimitive.indexView) {
                newPrimitive.indexView.offset += data_offset;
            }
            return newPrimitive;
        }));

        data_offset += meshData.byteLength;
        bundle_offset += mesh.struct.vertexBundles.length;

        minPosition.x = Math.min(minPosition.x, mesh.struct.minPosition?.x || 1e9);
        minPosition.y = Math.min(minPosition.y, mesh.struct.minPosition?.y || 1e9);
        minPosition.z = Math.min(minPosition.z, mesh.struct.minPosition?.z || 1e9);

        maxPosition.x = Math.max(maxPosition.x, mesh.struct.maxPosition?.x || -1e9);
        maxPosition.y = Math.max(maxPosition.y, mesh.struct.maxPosition?.y || -1e9);
        maxPosition.z = Math.max(maxPosition.z, mesh.struct.maxPosition?.z || -1e9);
    }

    // TODO: morph and skinning, joints, dynamic, etc.
    const meshCreateInfo: Mesh.ICreateInfo = {
        struct: {
            vertexBundles,
            primitives,
            minPosition,
            maxPosition,
            jointMaps: meshes[0].struct.jointMaps,
            dynamic: meshes[0].struct.dynamic,
            compressed: meshes[0].struct.compressed,
            quantized: meshes[0].struct.quantized,
            encoded: meshes[0].struct.encoded,
        },
        data,
    };

    return meshCreateInfo;
}

/**
 * @en mesh utility class, use to create mesh.
 * @zh 网格工具类，用于创建网格。
 */
export class MeshUtils {
    /**
     * @en create a static mesh.
     * @zh 创建一个静态网格。
     * @param geometry @en geometry data use for creating @zh 用于创建的几何数据
     * @param out @en output static mesh @zh 输出的静态网格
     * @param options @en options of creating @zh 创建选项
     * @return @en The created static mesh, which is same as out @zh 新创建的静态网格，同 out 参数
     */
    static createMesh (geometry: IGeometry, out?: Mesh, options?: ICreateMeshOptions): Mesh {
        return createMesh(geometry, out, options);
    }

    /**
     * @en create a dynamic mesh.
     * @zh 创建一个动态网格。
     * @param primitiveIndex @en sub mesh index @zh 子网格索引
     * @param geometry @en geometry data use for creating @zh 用于创建的几何数据
     * @param out @en output dynamic mesh @zh 输出的动态网格
     * @param options @en options of creating @zh 创建选项
     * @return @en The created dynamic mesh, which is same as out @zh 新创建的动态网格，同 out 参数
     */
    static createDynamicMesh (primitiveIndex: number, geometry: IDynamicGeometry, out?: Mesh, options?: ICreateDynamicMeshOptions): Mesh {
        return createDynamicMesh(primitiveIndex, geometry, out, options);
    }

    /**
     * merge mesh create infos to a single one
     * @param meshes meshes create infos to merge
     * @returns the merged mesh create info
     */
    static mergeMeshes (meshes: Mesh.ICreateInfo[] = []): Mesh.ICreateInfo {
        return mergeMeshes(meshes);
    }
}

export declare namespace createMesh {
    /**
     * @deprecated
     */
    export interface IOptions {
        /**
         * @en calculate mesh's aabb or not
         * @zh 是否计算模型的包围盒。
         */
        calculateBounds?: boolean;
    }
}

export const MeshoptDecoder = {} as any;

function initDecoderASM () {
    const Module = meshopt_asm_factory;
    return Promise.all([Module.ready]).then(() => {
        MeshoptDecoder.supported = true;
        MeshoptDecoder.ready = Promise.resolve();
        MeshoptDecoder.decodeVertexBuffer = Module.decodeVertexBuffer;
        MeshoptDecoder.decodeIndexBuffer = Module.decodeIndexBuffer;
        MeshoptDecoder.decodeIndexSequence = Module.decodeIndexSequence;
        MeshoptDecoder.decodeGltfBuffer = Module.decodeGltfBuffer;
        MeshoptDecoder.useWorkers = Module.useWorkers;
        MeshoptDecoder.decodeGltfBufferAsync = Module.decodeGltfBufferAsync;
        console.log(`meshopt asm decoder initialized`);
    });
}

function initDecoderWASM () {
    const Module = meshopt_wasm_factory;
    return Promise.all([Module.ready]).then(() => {
        MeshoptDecoder.supported = true;
        MeshoptDecoder.ready = Promise.resolve();
        MeshoptDecoder.decodeVertexBuffer = Module.decodeVertexBuffer;
        MeshoptDecoder.decodeIndexBuffer = Module.decodeIndexBuffer;
        MeshoptDecoder.decodeIndexSequence = Module.decodeIndexSequence;
        MeshoptDecoder.decodeGltfBuffer = Module.decodeGltfBuffer;
        MeshoptDecoder.useWorkers = Module.useWorkers;
        MeshoptDecoder.decodeGltfBufferAsync = Module.decodeGltfBufferAsync;
        console.log(`meshopt wasm decoder initialized`);
    });
}

export function InitDecoder () {
    if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
        if (sys.hasFeature(sys.Feature.WASM)) {
            return initDecoderWASM();
        } else {
            return initDecoderASM();
        }
    } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
        return initDecoderWASM();
    } else {
        return initDecoderASM();
    }
}

game.onPostInfrastructureInitDelegate.add(InitDecoder);

export function decodeMesh (mesh: Mesh.ICreateInfo): Mesh.ICreateInfo {
    if (!mesh.struct.encoded) {
        // the mesh is not encoded, so no need to decode
        return mesh;
    }

    // decode the mesh
    if (!MeshoptDecoder.supported) {
        console.warn('decodeMesh: meshopt decoder is not supported');
        return mesh;
    }

    const res_checker = (res: number) => {
        if (res < 0) {
            console.error(`Mesh decode error: ${res}`);
        }
    };

    const primitives = mesh.struct.primitives;
    let subMeshes = primitives.map((oriPrimitive, idx): Mesh.ICreateInfo | undefined => {
        const primitive = JSON.parse(JSON.stringify(oriPrimitive));
        let data: Uint8Array | undefined;
        let vertexBundles: Mesh.IVertexBundle [] = [];
        if (primitive.primitiveMode === PrimitiveMode.TRIANGLE_LIST) {
            if (!primitive.indexView) {
                console.warn(`Submesh ${idx} has no index buffer, encode optimization is not supported.`);
                return undefined;
            }
            if (primitive.vertexBundelIndices.length === 1) {
                const bundle = mesh.struct.vertexBundles[primitive.vertexBundelIndices[0]];
                const vertexView = bundle.view;
                const vertexBuffer = new Uint8Array(mesh.data.buffer, vertexView.offset, vertexView.length);
                const vertexCount = vertexView.count;
                const vertexStride = vertexView.stride;
                const indexView = primitive.indexView;
                const indexBuffer = new Uint8Array(mesh.data.buffer, indexView.offset, indexView.length);
                const indexCount = indexView.count;
                let destIndexBuffer: Uint8Array;
                let res = 0;
                if (indexView.stride === 4) { // support 32bit index
                    const indexBound = indexView.count * indexView.stride;
                    destIndexBuffer = new Uint8Array(indexBound);
                    res = MeshoptDecoder.decodeIndexBuffer(destIndexBuffer, indexView.count, indexView.stride, indexBuffer);
                    res_checker(res);
                } else if (indexView.stride === 2) { // 16 bit index, but impossible for now, since 16 bit index is not supported
                    const indexBuffer16 = new Uint16Array(mesh.data.buffer, indexView.offset, indexCount);
                    const indexBuffer32 = new Uint32Array(indexCount);
                    for (let i = 0; i < indexCount; ++i) {
                        indexBuffer32[i] = indexBuffer16[i];
                    }
                    const indexBound = indexView.count * indexView.stride;
                    destIndexBuffer = new Uint8Array(indexBound);
                    res = MeshoptDecoder.decodeIndexBuffer(destIndexBuffer, indexView.count, indexView.stride, indexBuffer32);
                    res_checker(res);
                } else {
                    console.warn(`Submesh ${idx} has unsupported index stride, Only 16bit and 32bit index buffer are supported.`);
                    return undefined;
                }

                const vertexBound = vertexView.count * vertexView.stride;
                const destVertexBuffer = new Uint8Array(vertexBound);
                res = MeshoptDecoder.decodeVertexBuffer(destVertexBuffer, vertexView.count, vertexView.stride, vertexBuffer);
                res_checker(res);

                data = new Uint8Array(destIndexBuffer.byteLength + destVertexBuffer.byteLength);
                data.set(destIndexBuffer);
                data.set(destVertexBuffer, destIndexBuffer.byteLength);

                vertexBundles = [{
                    view: {
                        offset: destIndexBuffer.byteLength,
                        length: destVertexBuffer.byteLength,
                        count: vertexCount,
                        stride: vertexStride,
                    },
                    attributes: mesh.struct.vertexBundles[primitive.vertexBundelIndices[0]].attributes,
                }];

                primitive.indexView = {
                    offset: 0,
                    length: destIndexBuffer.byteLength,
                    count: indexCount,
                    stride: Uint32Array.BYTES_PER_ELEMENT,
                };
                primitive.vertexBundelIndices = [0];
            } else if (primitive.vertexBundelIndices.length > 1) {
                console.warn(`Submesh ${idx} has more than one vertex bundle, encode optimization is not supported.`);
                return undefined;
            } else {
                console.warn(`Submesh ${idx} has no vertex bundle, encode optimization is not supported.`);
                return undefined;
            }
        } else if (primitive.primitiveMode === PrimitiveMode.POINT_LIST) {
            if (primitive.vertexBundelIndices.length === 1) {
                const vertexView = mesh.struct.vertexBundles[primitive.vertexBundelIndices[0]].view;
                const vertexCount = vertexView.count;
                const vertexSize = vertexView.stride;
                const vertexBuffer = new Uint8Array(mesh.data.buffer, vertexView.offset, vertexView.length);

                let res = 0;
                const vertexBound = vertexView.count * vertexView.stride;
                const destVertexBuffer = new Uint8Array(vertexBound);
                res = MeshoptDecoder.decodeVertexBuffer(destVertexBuffer, vertexView.count, vertexView.stride, vertexBuffer);
                res_checker(res);
                data = new Uint8Array(destVertexBuffer.buffer, 0, vertexBound); // shrink buffer size

                vertexBundles = [{
                    view: {
                        offset: 0,
                        length: destVertexBuffer.byteLength,
                        count: vertexCount,
                        stride: vertexSize,
                    },
                    attributes: mesh.struct.vertexBundles[primitive.vertexBundelIndices[0]].attributes,
                }];

                primitive.vertexBundelIndices = [0];
            } else {
                console.warn(`Submesh ${idx} has unsupported primitive mode ${primitive.primitiveMode}, encode optimization is not supported.`);
                return undefined;
            }
        }
        const struct = JSON.parse(JSON.stringify(mesh.struct));

        struct.primitives = [primitive];
        struct.vertexBundles = vertexBundles;

        if (struct.encoded) {
            delete struct.encoded;
        }

        if (data) {
            return {
                struct,
                data,
            };
        }

        return undefined;
    });

    subMeshes = subMeshes.filter((mesh) => mesh !== undefined).map((mesh) => mesh!);

    if (subMeshes.length > 0) {
        mesh = mergeMeshes(subMeshes.map((mesh) => mesh!));
        delete mesh.struct.encoded;
    }

    return mesh;
}

export function inflateMesh (mesh: Mesh.ICreateInfo): Mesh.ICreateInfo {
    const inflator = new zlib.Inflate(mesh.data);
    const decompressed = inflator.decompress();
    mesh.data = decompressed;
    mesh.struct.compressed = false;
    return mesh;
}
