/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { Mesh } from '../assets/mesh';
import { AttributeName, Format, FormatInfos, PrimitiveMode, Attribute } from '../../core/gfx';
import { Vec3 } from '../../core/math';
import { IGeometry } from '../../primitive/define';
import { writeBuffer } from './buffer';
import { BufferBlob } from './buffer-blob';

const _defAttrs: Attribute[] = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_TANGENT, Format.RGBA32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F),
];

const v3_1 = new Vec3();
export function createMesh (geometry: IGeometry, out?: Mesh, options?: createMesh.IOptions) {
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
        for (const ca of geometry.customAttributes) {
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

export declare namespace createMesh {
    export interface IOptions {
        calculateBounds?: boolean;
    }
}
