import { GFXAttributeName, GFXPrimitiveMode } from '../../gfx/define';
export { default as find } from '../../scene-graph/find';
import Texture2D from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { Vec3 } from '../../core/value-types';
import { AttributeBaseType, AttributeType,
    IMeshStruct, IndexUnit, IPrimitive, IVertexAttribute, IVertexBundle, Mesh } from '../assets/mesh';
import { IGeometry } from '../primitive/defines';

/**
 *
 */
export function createJointsTexture (skinning: { joints: any[]; }) {
    const jointCount = skinning.joints.length;

    // Set jointsTexture.
    // A squared texture with side length N(N > 1) multiples of 2 can store
    // 2 ^ (2 * N - 2) matrices.
    // We support most 1024 joints.
    let size = 0;
    if (jointCount > 1024) {
        throw new Error('To many joints(more than 1024).');
    } else if (jointCount > 256) {
        size = 64;
    } else if (jointCount > 64) {
        size = 32;
    } else if (jointCount > 16) {
        size = 16;
    } else if (jointCount > 4) {
        size = 8;
    } else {
        size = 4;
    }

    const texture = new Texture2D();
    texture.create(size, size, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    return texture;
}

const copyAttribute = (attribute: IVertexAttribute) => Object.assign({}, attribute);
export function createMesh (geometry: IGeometry) {
    // Collect attributes and calculate length of result vertex buffer.
    const attributes: IVertexAttribute[] = [];
    let stride = 0;
    const channels: Array<{ offset: number; data: number[]; attribute: IVertexAttribute; }> = [];
    let verticesCount = 0;
    const addAttribute = (attribute: IVertexAttribute, data: number[]) => {
        const componentCount = _getComponentCount(attribute);
        const componentBytesLength = _getComponentByteLength(attribute);
        const bytesLength = componentBytesLength * componentCount;
        attributes.push(attribute);
        channels.push({ offset: stride, data, attribute });
        stride += bytesLength;
        verticesCount = Math.max(verticesCount, Math.floor(data.length / componentCount));
    };
    addAttribute(copyAttribute(predefinedAttributes.positions), geometry.positions);
    if (geometry.normals) {
        addAttribute(copyAttribute(predefinedAttributes.normals), geometry.normals);
    }
    if (geometry.uvs) {
        addAttribute(copyAttribute(predefinedAttributes.uvs), geometry.uvs);
    }
    if (geometry.colors) {
        addAttribute(copyAttribute(predefinedAttributes.colors), geometry.colors);
    }

    // Use this to generate final merged buffer.
    const bufferBlob = new BufferBlob();

    // Fill vertex buffer.
    const vertexBuffer = new ArrayBuffer(verticesCount * stride);
    const vertexBufferView = new DataView(vertexBuffer);
    for (const channel of channels) {
        _writeVertices(vertexBufferView, channel.offset, stride, channel.attribute, channel.data);
    }
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
    if (geometry.indices) {
        const { indices } = geometry;
        const indexUnitBytesLength = 2;
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
    if (indexBuffer) {
        primitive.indices = {
            indexUnit: targetIndexUnit,
            range: {
                offset: bufferBlob.getLength(),
                length: indexBuffer.byteLength,
            },
        };
        bufferBlob.addBuffer(indexBuffer);
    }

    // geometric info for raycasting
    if (primitive.primitiveMode >= GFXPrimitiveMode.TRIANGLE_LIST) {
        const geomInfo = Float32Array.from(geometry.positions);
        primitive.geometricInfo = {
            doubleSided: geometry.doubleSided,
            range: { offset: bufferBlob.getLength(), length: geomInfo.byteLength },
        };
        bufferBlob.addBuffer(geomInfo.buffer);
    }

    // Create mesh struct.
    const meshStruct: IMeshStruct = {
        vertexBundles: [vertexBundle],
        primitives: [primitive],
        minPosition: new Vec3(geometry.minPos.x, geometry.minPos.y, geometry.minPos.z),
        maxPosition: new Vec3(geometry.maxPos.x, geometry.maxPos.y, geometry.maxPos.z),
    };

    // Create mesh.
    const mesh = new Mesh();
    mesh.assign(meshStruct, new Uint8Array(bufferBlob.getCombined()));

    return mesh;
}

/**
 *
 */
export function toPPM (buffer: Uint8Array, w: number, h: number) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}

const predefinedAttributes = {
    positions: {
        name: GFXAttributeName.ATTR_POSITION,
        baseType: AttributeBaseType.FLOAT32,
        type: AttributeType.VEC3,
        normalize: false,
    },
    normals: {
        name: GFXAttributeName.ATTR_NORMAL,
        baseType: AttributeBaseType.FLOAT32,
        type: AttributeType.VEC3,
        normalize: false,
    },
    uvs: {
        name: GFXAttributeName.ATTR_TEX_COORD,
        baseType: AttributeBaseType.FLOAT32,
        type: AttributeType.VEC2,
        normalize: false,
    },
    colors: {
        name: GFXAttributeName.ATTR_COLOR,
        baseType: AttributeBaseType.FLOAT32,
        type: AttributeType.VEC4,
        normalize: false,
    },
};

class BufferBlob {
    private _arrayBuffers: ArrayBuffer[] = [];
    private _length = 0;

    public addBuffer (arrayBuffer: ArrayBuffer) {
        const result = this._length;
        this._arrayBuffers.push(arrayBuffer);
        this._length += arrayBuffer.byteLength;
        return result;
    }

    public getLength () {
        return this._length;
    }

    public getCombined () {
        let length = 0;
        this._arrayBuffers.forEach((arrayBuffer) => length += arrayBuffer.byteLength);
        const result = new Uint8Array(length);
        let counter = 0;
        this._arrayBuffers.forEach((arrayBuffer) => {
            result.set(new Uint8Array(arrayBuffer), counter);
            counter += arrayBuffer.byteLength;
        });
        return result.buffer;
    }
}

function _writeVertices (
    target: DataView, offset: number, stride: number, attribute: IVertexAttribute, data: number[]) {
    const writer = _getVerticesWriter(target, attribute.baseType);
    const componentCount = _getComponentCount(attribute);
    const componentBytesLength = _getComponentByteLength(attribute);
    const nVertices = Math.floor(data.length / componentCount);

    for (let iVertex = 0; iVertex < nVertices; ++iVertex) {
        const x = offset + stride * iVertex;
        for (let iComponent = 0; iComponent < componentCount; ++iComponent) {
            const y = x + componentBytesLength * iComponent;
            writer(y, data[componentCount * iVertex + iComponent]);
        }
    }
}

function _getComponentByteLength (vertexAttribute: IVertexAttribute) {
    switch (vertexAttribute.baseType) {
        case AttributeBaseType.INT8:
        case AttributeBaseType.UINT8:
            return 1;
        case AttributeBaseType.INT16:
        case AttributeBaseType.UINT16:
            return 2;
        case AttributeBaseType.INT32:
        case AttributeBaseType.UINT32:
        case AttributeBaseType.FLOAT32:
            return 4;
    }
    return 1;
}

function _getComponentCount (vertexAttribute: IVertexAttribute) {
    switch (vertexAttribute.type) {
        case AttributeType.SCALAR: return 1;
        case AttributeType.VEC2: return 2;
        case AttributeType.VEC3: return 3;
        case AttributeType.VEC4: return 4;
    }
    return 1;
}

function _getVerticesWriter (dataView: DataView, baseType: AttributeBaseType) {
    switch (baseType) {
        case AttributeBaseType.INT8:
            return (offset: number, value: number) => dataView.setInt8(offset, value);
        case AttributeBaseType.UINT8:
            return (offset: number, value: number) => dataView.setUint8(offset, value);
        case AttributeBaseType.INT16:
            return (offset: number, value: number) => dataView.setInt16(offset, value, isLittleEndian);
        case AttributeBaseType.UINT16:
            return (offset: number, value: number) => dataView.setUint16(offset, value, isLittleEndian);
        case AttributeBaseType.INT32:
            return (offset: number, value: number) => dataView.setInt32(offset, value, isLittleEndian);
        case AttributeBaseType.UINT32:
            return (offset: number, value: number) => dataView.setUint32(offset, value, isLittleEndian);
        case AttributeBaseType.FLOAT32:
            return (offset: number, value: number) => dataView.setFloat32(offset, value, isLittleEndian);
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

const isLittleEndian = (() => {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    // Int16Array uses the platform's endianness.
    return new Int16Array(buffer)[0] === 256;
})();
