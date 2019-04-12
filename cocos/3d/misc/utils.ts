import { GFXFormat, GFXFormatInfos, GFXFormatType, GFXPrimitiveMode } from '../../gfx/define';
export { find } from '../../scene-graph/find';
import { Vec3 } from '../../core/value-types';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { IMeshStruct, IPrimitive, IVertexBundle, Mesh } from '../assets/mesh';
import { IGeometry } from '../primitive/define';
import { BufferBlob } from './buffer-blob';

/**
 * save a color buffer to a PPM file
 */
export function toPPM (buffer: Uint8Array, w: number, h: number) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}

const _defAttrs: IGFXAttribute[] = [
    { name: 'a_position', format: GFXFormat.RGB32F },
    { name: 'a_normal', format: GFXFormat.RGB32F },
    { name: 'a_texCoord', format: GFXFormat.RG32F },
    { name: 'a_color', format: GFXFormat.RGBA32F },
];

export function createMesh (geometry: IGeometry, out?: Mesh) {
    // Collect attributes and calculate length of result vertex buffer.
    const attributes: IGFXAttribute[] = [];
    let stride = 0;
    const channels: Array<{ offset: number; data: number[]; attribute: IGFXAttribute; }> = [];
    let vertCount = 0;

    let attr: IGFXAttribute | null;

    if (geometry.positions.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === 'a_position') {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[0];
        }

        const info = GFXFormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.positions.length / info.count));
        channels.push({ offset: stride, data: geometry.positions, attribute: attr });
        stride += info.size;
    }

    if (geometry.normals && geometry.normals.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === 'a_normal') {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[1];
        }

        const info = GFXFormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.normals.length / info.count));
        channels.push({ offset: stride, data: geometry.normals, attribute: attr });
        stride += info.size;
    }

    if (geometry.uvs && geometry.uvs.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === 'a_texCoord') {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[2];
        }

        const info = GFXFormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.uvs.length / info.count));
        channels.push({ offset: stride, data: geometry.uvs, attribute: attr });
        stride += info.size;
    }

    if (geometry.colors && geometry.colors.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === 'a_color') {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[3];
        }

        const info = GFXFormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.colors.length / info.count));
        channels.push({ offset: stride, data: geometry.colors, attribute: attr });
        stride += info.size;
    }

    // Use this to generate final merged buffer.
    const bufferBlob = new BufferBlob();

    // Fill vertex buffer.
    const vertexBuffer = new ArrayBuffer(vertCount * stride);
    const vertexBufferView = new DataView(vertexBuffer);
    for (const channel of channels) {
        _writeVertices(vertexBufferView, channel.offset, stride, channel.attribute.format, channel.data);
    }
    bufferBlob.setNextAlignment(0);
    const vertexBundle: IVertexBundle = {
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
        const writer = _getIndicesWriter(indexBufferView, idxStride);
        for (let i = 0; i < idxCount; ++i) {
            writer(idxStride * i, indices[i]);
        }
    }

    // Create primitive.
    const primitive: IPrimitive = {
        primitiveMode: geometry.primitiveMode || GFXPrimitiveMode.TRIANGLE_LIST,
        vertexBundelIndices: [0],
    };
    // geometric info for raycasting
    if (primitive.primitiveMode >= GFXPrimitiveMode.TRIANGLE_LIST) {
        const geomInfo = Float32Array.from(geometry.positions);
        bufferBlob.setNextAlignment(4);
        primitive.geometricInfo = {
            doubleSided: geometry.doubleSided,
            view: {
                offset: bufferBlob.getLength(),
                length: geomInfo.byteLength,
                count: geometry.positions.length / 4,
                stride: 4,
            },
        };
        bufferBlob.addBuffer(geomInfo.buffer);
    }

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

    // Create mesh struct.
    const meshStruct: IMeshStruct = {
        vertexBundles: [vertexBundle],
        primitives: [primitive],
        minPosition: geometry.minPos && new Vec3(geometry.minPos.x, geometry.minPos.y, geometry.minPos.z),
        maxPosition: geometry.maxPos && new Vec3(geometry.maxPos.x, geometry.maxPos.y, geometry.maxPos.z),
    };

    // Create mesh.
    if (!out) { out = new Mesh(); }
    out.assign(meshStruct, new Uint8Array(bufferBlob.getCombined()));

    return out;
}

function _writeVertices (
    target: DataView, offset: number, stride: number, format: GFXFormat, data: number[]) {
    const writer = _getVerticesWriter(target, format);
    const info = GFXFormatInfos[format];
    const componentBytesLength = info.size / info.count;
    const nVertices = Math.floor(data.length / info.count);

    for (let iVertex = 0; iVertex < nVertices; ++iVertex) {
        const x = offset + stride * iVertex;
        for (let iComponent = 0; iComponent < info.count; ++iComponent) {
            const y = x + componentBytesLength * iComponent;
            writer(y, data[info.count * iVertex + iComponent]);
        }
    }
}

const isLittleEndian = cc.sys.isLittleEndian;

function _getVerticesWriter (dataView: DataView, format: GFXFormat) {

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

    return (offset: number, value: number) => dataView.setUint8(offset, value);
}

function _getIndicesWriter (dataView: DataView, idxStride: number) {
    switch (idxStride) {
        case 1:
            return (offset: number, value: number) => dataView.setUint8(offset, value);
        case 2:
            return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
        case 4:
            return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
    }
    return (offset: number, value: number) => dataView.setUint8(offset, value);
}
