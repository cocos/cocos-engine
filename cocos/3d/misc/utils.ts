import { GFXAttributeName, GFXFormat, GFXFormatInfos, GFXFormatType, GFXPrimitiveMode } from '../../gfx/define';
export { find } from '../../scene-graph/find';
import { Vec3 } from '../../core/value-types';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { IMeshStruct, IndexUnit, IPrimitive, IVertexBundle, Mesh } from '../assets/mesh';
import { IGeometry } from '../primitive/define';

/**
 * save a color buffer to a PPM file
 */
export function toPPM (buffer: Uint8Array, w: number, h: number) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}

export function createMesh (geometry: IGeometry, out?: Mesh) {
    // Collect attributes and calculate length of result vertex buffer.
    const attributes: IGFXAttribute[] = [];
    let stride = 0;
    const channels: Array<{ offset: number; data: number[]; attribute: IGFXAttribute; }> = [];
    let verticesCount = 0;

    if (geometry.positions.length > 0) {
        const attr: IGFXAttribute = { name: 'a_position', format: GFXFormat.RGB32F };
        attributes.push(attr);
        verticesCount = Math.max(verticesCount, Math.floor(geometry.positions.length / 3));
        channels.push({ offset: stride, data: geometry.positions, attribute: attr });
        stride += 12;
    }

    if (geometry.normals && geometry.normals.length > 0) {
        const attr: IGFXAttribute = { name: 'a_normal', format: GFXFormat.RGB32F };

        attributes.push(attr);
        verticesCount = Math.max(verticesCount, Math.floor(geometry.normals.length / 3));
        channels.push({ offset: stride, data: geometry.normals, attribute: attr });
        stride += 12;
    }

    if (geometry.uvs && geometry.uvs.length > 0) {
        const attr: IGFXAttribute = { name: 'a_texCoord', format: GFXFormat.RG32F };
        attributes.push(attr);
        verticesCount = Math.max(verticesCount, Math.floor(geometry.uvs.length / 2));
        channels.push({ offset: stride, data: geometry.uvs, attribute: attr });
        stride += 8;
    }

    if (geometry.colors && geometry.colors.length > 0) {
        const attr: IGFXAttribute = { name: 'a_color', format: GFXFormat.RGBA32F };
        attributes.push(attr);
        verticesCount = Math.max(verticesCount, Math.floor(geometry.colors.length / 4));
        channels.push({ offset: stride, data: geometry.colors, attribute: attr });
        stride += 16;
    }

    // Use this to generate final merged buffer.
    const bufferBlob = new BufferBlob();

    // Fill vertex buffer.
    const vertexBuffer = new ArrayBuffer(verticesCount * stride);
    const vertexBufferView = new DataView(vertexBuffer);
    for (const channel of channels) {
        _writeVertices(vertexBufferView, channel.offset, stride, channel.attribute.format, channel.data);
    }
    bufferBlob.setNextAlignment(0);
    const vertexBundle: IVertexBundle = {
        verticesCount,
        attributes,
        data: {
            offset: bufferBlob.getLength(),
            length: vertexBuffer.byteLength,
        },
    };
    bufferBlob.addBuffer(vertexBuffer);

    // Fill index buffer.
    let indexBuffer: ArrayBuffer | null = null;
    const targetIndexUnit = IndexUnit.UINT16;
    const indexUnitBytesLength = 2;
    if (geometry.indices) {
        const { indices } = geometry;
        indexBuffer = new ArrayBuffer(indexUnitBytesLength * indices.length);
        const indexBufferView = new DataView(indexBuffer);
        const writer = _getIndicesWriter(indexBufferView, targetIndexUnit);
        for (let i = 0; i < indices.length; ++i) {
            writer(indexUnitBytesLength * i, indices[i]);
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
            range: { offset: bufferBlob.getLength(), length: geomInfo.byteLength },
        };
        bufferBlob.addBuffer(geomInfo.buffer);
    }

    if (indexBuffer) {
        bufferBlob.setNextAlignment(indexUnitBytesLength);
        primitive.indices = {
            indexUnit: targetIndexUnit,
            range: {
                offset: bufferBlob.getLength(),
                length: indexBuffer.byteLength,
            },
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

class BufferBlob {
    private _arrayBufferOrPaddings: Array<ArrayBuffer | number> = [];
    private _length = 0;

    public setNextAlignment (align: number) {
        if (align !== 0) {
            const remainder = this._length % align;
            if (remainder !== 0) {
                const padding = align - remainder;
                this._arrayBufferOrPaddings.push(padding);
                this._length += padding;
            }
        }
    }

    public addBuffer (arrayBuffer: ArrayBuffer) {
        const result = this._length;
        this._arrayBufferOrPaddings.push(arrayBuffer);
        this._length += arrayBuffer.byteLength;
        return result;
    }

    public getLength () {
        return this._length;
    }

    public getCombined () {
        const result = new Uint8Array(this._length);
        let counter = 0;
        this._arrayBufferOrPaddings.forEach((arrayBufferOrPadding) => {
            if (typeof arrayBufferOrPadding === 'number') {
                counter += arrayBufferOrPadding;
            } else {
                result.set(new Uint8Array(arrayBufferOrPadding), counter);
                counter += arrayBufferOrPadding.byteLength;
            }
        });
        return result.buffer;
    }
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

function _getIndicesWriter (dataView: DataView, indexUnit: IndexUnit) {
    switch (indexUnit) {
        case IndexUnit.UINT8:
            return (offset: number, value: number) => dataView.setUint8(offset, value);
        case IndexUnit.UINT16:
            return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
        case IndexUnit.UINT32:
            return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
    }
    return (offset: number, value: number) => dataView.setUint8(offset, value);
}
