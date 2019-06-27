import { GFXAttributeName, GFXFormat, GFXFormatInfos, GFXFormatType, GFXPrimitiveMode, IGFXFormatInfo } from '../../gfx/define';
export { find } from '../../scene-graph/find';
import { Mat4, Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { Node } from '../../scene-graph';
import { IMeshStruct, IPrimitive, IVertexBundle, Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { SkinningModelComponent } from '../framework';
import { aabb } from '../geom-utils';
import { IGeometry } from '../primitive/define';
import { BufferBlob } from './buffer-blob';

/**
 * save a color buffer to a PPM file
 */
export function toPPM (buffer: Uint8Array, w: number, h: number) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}

enum _keyMap {
    positions = GFXAttributeName.ATTR_POSITION,
    normals = GFXAttributeName.ATTR_NORMAL,
    uvs = GFXAttributeName.ATTR_TEX_COORD,
    colors = GFXAttributeName.ATTR_COLOR,
}

const _defAttrs: IGFXAttribute[] = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RG32F },
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA32F },
];

export interface ICreateMeshOptions {
    calculateBounds?: boolean;
}

const v3_1 = new Vec3();
export function createMesh (geometry: IGeometry, out?: Mesh, options?: ICreateMeshOptions) {
    options = options || {};
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
                if (att.name === GFXAttributeName.ATTR_POSITION) {
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
            attr = _defAttrs[3];
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
        writeBuffer(indexBufferView, indices, GFXFormat.R16UI);
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

    let minPosition = geometry.minPos;
    if (!minPosition && options.calculateBounds) {
        minPosition = vec3.set(new vec3(), Infinity, Infinity, Infinity);
        for (let iVertex = 0; iVertex < vertCount; ++iVertex) {
            vec3.set(v3_1, geometry.positions[iVertex * 3 + 0], geometry.positions[iVertex * 3 + 1], geometry.positions[iVertex * 3 + 2]);
            vec3.min(minPosition, minPosition, v3_1);
        }
    }
    let maxPosition = geometry.maxPos;
    if (!maxPosition && options.calculateBounds) {
        maxPosition = vec3.set(new vec3(), -Infinity, -Infinity, -Infinity);
        for (let iVertex = 0; iVertex < vertCount; ++iVertex) {
            vec3.set(v3_1, geometry.positions[iVertex * 3 + 0], geometry.positions[iVertex * 3 + 1], geometry.positions[iVertex * 3 + 2]);
            vec3.max(maxPosition, maxPosition, v3_1);
        }
    }

    // Create mesh struct.
    const meshStruct: IMeshStruct = {
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
    if (!out) { out = new Mesh(); }
    out.assign(meshStruct, new Uint8Array(bufferBlob.getCombined()));

    return out;
}
export function readMesh (mesh: Mesh, iPrimitive: number = 0) {
    const out: IGeometry = { positions: [] };
    const dataView = new DataView(mesh._nativeAsset);
    const struct = mesh.struct;
    const primitive = struct.primitives[iPrimitive];
    for (const idx of primitive.vertexBundelIndices) {
        const bundle = struct.vertexBundles[idx];
        let offset = bundle.view.offset;
        const { length, stride } = bundle.view;
        for (const attr of bundle.attributes) {
            const name: GFXAttributeName = _keyMap[attr.name];
            if (name) { out[name] = (out[name] || []).concat(readBuffer(dataView, attr.format, offset, length, stride)); }
            offset += GFXFormatInfos[attr.format].size;
        }
    }
    const view = primitive.indexView!;
    out.indices = readBuffer(dataView, GFXFormat[`R${view.stride * 8}UI`], view.offset, view.length);
    return out;
}

const isLittleEndian = cc.sys.isLittleEndian;
const _typeMap = {
    [GFXFormatType.UNORM]: 'Uint',
    [GFXFormatType.SNORM]: 'Int',
    [GFXFormatType.UINT]: 'Uint',
    [GFXFormatType.INT]: 'Int',
    [GFXFormatType.UFLOAT]: 'Float',
    [GFXFormatType.FLOAT]: 'Float',
    default: 'Uint',
};
function _getDataViewType (info: IGFXFormatInfo) {
    const type = _typeMap[info.type] || _typeMap.default;
    const bytes = info.size / info.count * 8;
    return type + bytes;
}
// default params bahaves just like on an plain, compact Float32Array
export function writeBuffer (target: DataView, data: number[], format: GFXFormat = GFXFormat.R32F, offset: number = 0, stride: number = 0) {
    const info = GFXFormatInfos[format];
    if (!stride) { stride = info.size; }
    const writer = 'set' + _getDataViewType(info);
    const componentBytesLength = info.size / info.count;
    const nSeg = Math.floor(data.length / info.count);

    for (let iSeg = 0; iSeg < nSeg; ++iSeg) {
        const x = offset + stride * iSeg;
        for (let iComponent = 0; iComponent < info.count; ++iComponent) {
            const y = x + componentBytesLength * iComponent;
            target[writer](y, data[info.count * iSeg + iComponent], isLittleEndian);
        }
    }
}
export function readBuffer (
    target: DataView, format: GFXFormat = GFXFormat.R32F, offset: number = 0,
    length: number = target.byteLength - offset, stride: number = 0, out: number[] = []) {
    const info = GFXFormatInfos[format];
    if (!stride) { stride = info.size; }
    const reader = 'get' + _getDataViewType(info);
    const componentBytesLength = info.size / info.count;
    const nSeg = Math.floor(length / stride);

    for (let iSeg = 0; iSeg < nSeg; ++iSeg) {
        const x = offset + stride * iSeg;
        for (let iComponent = 0; iComponent < info.count; ++iComponent) {
            const y = x + componentBytesLength * iComponent;
            out[info.count * iSeg + iComponent] = target[reader](y, isLittleEndian);
        }
    }
    return out;
}
export function mapBuffer (
    target: DataView, callback: (cur: number, idx: number, view: DataView) => number, format: GFXFormat = GFXFormat.R32F,
    offset: number = 0, length: number = target.byteLength - offset, stride: number = 0, out?: DataView) {
    if (!out) { out = new DataView(new ArrayBuffer(target.byteLength)); }
    const info = GFXFormatInfos[format];
    if (!stride) { stride = info.size; }
    const writer = 'set' + _getDataViewType(info);
    const reader = 'get' + _getDataViewType(info);
    const componentBytesLength = info.size / info.count;
    const nSeg = Math.floor(length / stride);

    for (let iSeg = 0; iSeg < nSeg; ++iSeg) {
        const x = offset + stride * iSeg;
        for (let iComponent = 0; iComponent < info.count; ++iComponent) {
            const y = x + componentBytesLength * iComponent;
            const cur = target[reader](y, isLittleEndian);
            // iComponent is usually more useful than y
            out[writer](y, callback(cur, iComponent, target), isLittleEndian);
        }
    }
    return out;
}

// get the lowest common ancestor
const _path: Node[] = [];
export const LCA = (a: Node, b: Node) => {
    if (a === b) { return a; }
    let cur: Node | null = b;
    _path.length = 0;
    while (cur) { _path.push(cur); cur = cur.parent; }
    cur = a;
    while (cur) {
        if (_path.find((n) => n === cur)) { return cur; }
        cur = cur.parent;
    }
    return null;
};

const v3_2 = new Vec3();
function calculateBoneSpaceBounds (mesh: Mesh, skeleton: Skeleton) {
    const result = new Array< { max: Vec3, min: Vec3, hasValue: boolean } >(skeleton.joints.length);
    for (let i = 0; i < result.length; ++i) {
        result[i] = {
            hasValue: false,
            min: new Vec3(Infinity, Infinity, Infinity),
            max: new Vec3(-Infinity, -Infinity, -Infinity),
        };
    }

    for (let iPrimitive = 0; iPrimitive < mesh.struct.primitives.length; ++iPrimitive) {
        const joints = mesh.readAttribute(iPrimitive, GFXAttributeName.ATTR_JOINTS);
        if (!joints) {
            continue;
        }
        const weights = mesh.readAttribute(iPrimitive, GFXAttributeName.ATTR_WEIGHTS);
        if (!weights) {
            continue;
        }
        const positions = mesh.readAttribute(iPrimitive, GFXAttributeName.ATTR_POSITION);
        if (!positions) {
            continue;
        }
        const vertexCount = Math.min(joints.length / 4, weights.length / 4, positions.length / 3);
        for (let iVertex = 0; iVertex < vertexCount; ++iVertex) {
            vec3.set(v3_1, positions[3 * iVertex + 0], positions[3 * iVertex + 1], positions[3 * iVertex + 2]);
            for (let i = 0; i < 4; ++i) {
                const weight = weights[4 * iVertex + i];
                if (weight === 0) {
                    continue;
                }
                const refJointIndex = joints[4 * iVertex + i];
                if (refJointIndex >= skeleton.joints.length) {
                    continue;
                }

                if (skeleton.bindposes) { vec3.transformMat4(v3_2, v3_1, skeleton.bindposes[refJointIndex]); }
                else { vec3.copy(v3_2, v3_1); }

                const jointBounds = result[refJointIndex];
                jointBounds.hasValue = true;
                vec3.min(jointBounds.min, jointBounds.min, v3_2);
                vec3.max(jointBounds.max, jointBounds.max, v3_2);
            }
        }
    }
    return result.map((bounds) => bounds.hasValue ? aabb.fromPoints(new aabb(), bounds.min, bounds.max) : null);
}
interface ICachedBoneSpaceBounds {
    bounds: Array<aabb | null>;
    referenceCount: number;
}
class BoneSpaceBoundsManager {
    private _cached = new Map<Mesh, Map<Skeleton, ICachedBoneSpaceBounds>>();

    public use (mesh: Mesh, skeleton: Skeleton) {
        let bucket = this._cached.get(mesh);
        if (!bucket) {
            bucket = new Map();
            this._cached.set(mesh, bucket);
        }

        let cached = bucket.get(skeleton);
        if (!cached) {
            cached = {
                bounds: calculateBoneSpaceBounds(mesh, skeleton),
                referenceCount: 0,
            };
            bucket.set(skeleton, cached);
        }
        ++cached.referenceCount;
        return cached.bounds;
    }

    public unuse (mesh: Mesh, skeleton: Skeleton) {
        const bucket = this._cached.get(mesh);
        if (bucket) {
            const cached = bucket.get(skeleton);
            if (cached) {
                --cached.referenceCount;
                if (cached.referenceCount === 0) {
                    bucket.delete(skeleton);
                }
            }
            if (bucket.size === 0) {
                this._cached.delete(mesh);
            }
        }
    }
}
const boneSpaceBoundsManager = new BoneSpaceBoundsManager();
const m4_1 = new Mat4();
const ab_1 = new aabb();
const v3_3 = new Vec3();
const v3_4 = new Vec3();
export function calculateSkinnedBounds (out: aabb, comp: SkinningModelComponent) {
    if (!comp.model || !comp.mesh || !comp.skeleton) { return; }
    const mesh = comp.mesh;
    const skeleton = comp.skeleton;
    const joints = comp.model.joints;
    vec3.set(v3_3, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    vec3.set(v3_4, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const boundList = boneSpaceBoundsManager.use(mesh, skeleton);
    const len = joints.length;
    for (let i = 0; i < len; ++i) {
        const bounds = boundList[i];
        const targetNode = joints[i].node;
        if (!bounds || !targetNode) { continue; }
        targetNode.getWorldMatrix(m4_1);
        aabb.transform(ab_1, bounds, m4_1);
        ab_1.getBoundary(v3_1, v3_2);
        vec3.min(v3_3, v3_3, v3_1);
        vec3.max(v3_4, v3_4, v3_2);
    }
    aabb.fromPoints(out, v3_3, v3_4);
    return true;
}
