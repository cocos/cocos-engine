import { Mesh } from '../../assets/mesh';
import { GFXAttributeName, GFXFormat, GFXFormatInfos, GFXPrimitiveMode } from '../../gfx/define';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { Vec3 } from '../../math';
import { IGeometry } from '../../primitive/define';
import { writeBuffer } from './buffer';
import { BufferBlob } from './buffer-blob';
import { legacyCC } from '../../global-exports';

const _defAttrs: IGFXAttribute[] = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RG32F },
    { name: GFXAttributeName.ATTR_TANGENT, format: GFXFormat.RGBA32F },
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA32F },
];

const v3_1 = new Vec3();
export function createMesh (geometry: IGeometry, out?: Mesh, options?: createMesh.IOptions) {
    options = options || {};
    // Collect attributes and calculate length of result vertex buffer.
    const attributes: IGFXAttribute[] = [];
    let stride = 0;
    const channels: { offset: number; data: number[]; attribute: IGFXAttribute; }[] = [];
    let vertCount = 0;

    let attr: IGFXAttribute | null;

    const positions = geometry.positions.slice();
    if (positions.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === GFXAttributeName.ATTR_POSITION) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[0];
        }

        // device NDC correction
        const info = GFXFormatInfos[attr.format];
        const ySign = legacyCC.director.root.device.projectionSignY;
        for (let i = 1; i < positions.length; i += info.count) {
            positions[i] *= ySign;
        }

        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(positions.length / info.count));
        channels.push({ offset: stride, data: positions, attribute: attr });
        stride += info.size;

    }

    if (geometry.normals && geometry.normals.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === GFXAttributeName.ATTR_NORMAL) {
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
                if (att.name === GFXAttributeName.ATTR_TEX_COORD) {
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

    if (geometry.tangents && geometry.tangents.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === GFXAttributeName.ATTR_TANGENT) {
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
        vertCount = Math.max(vertCount, Math.floor(geometry.tangents.length / info.count));
        channels.push({ offset: stride, data: geometry.tangents, attribute: attr });
        stride += info.size;
    }

    if (geometry.colors && geometry.colors.length > 0) {
        attr = null;
        if (geometry.attributes) {
            for (const att of geometry.attributes) {
                if (att.name === GFXAttributeName.ATTR_COLOR) {
                    attr = att;
                    break;
                }
            }
        }

        if (!attr) {
            attr = _defAttrs[4];
        }

        const info = GFXFormatInfos[attr.format];
        attributes.push(attr);
        vertCount = Math.max(vertCount, Math.floor(geometry.colors.length / info.count));
        channels.push({ offset: stride, data: geometry.colors, attribute: attr });
        stride += info.size;
    }

    if (geometry.customAttributes) {
        for (const ca of geometry.customAttributes) {
            const info = GFXFormatInfos[ca.attr.format];
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
        writeBuffer(indexBufferView, indices, GFXFormat.R16UI);
    }

    // Create primitive.
    const primitive: Mesh.ISubMesh = {
        primitiveMode: geometry.primitiveMode || GFXPrimitiveMode.TRIANGLE_LIST,
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

export declare namespace createMesh {
    export interface IOptions {
        calculateBounds?: boolean;
    }
}
