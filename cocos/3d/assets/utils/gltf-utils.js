// @ts-check
import gfx from "../../../renderer/gfx";
import { enums as gfxEnums } from "../../../renderer/gfx/enums";
import { vec3 } from "../../../core/vmath";
import Node from "../../../scene-graph/node";
import Texture from "../../../assets/CCTexture2D";
import { WrapMode, Filter } from "../../../assets/texture-base";
import Material from "../material";
import Mesh, { Primitive, VertexBundle } from "../mesh";
import BufferRange from "./buffer-range";
import Skeleton from "../skeleton";
import { Vec3, Mat4 } from "../../../core/value-types";
import AnimationClip, { AnimationFrame, AnimationChannel } from "../animation-clip";

/**
 * @typedef {import("../../../../types/glTF/glTF").GlTf} Gltf
 * @typedef {import("../../../../types/glTF/glTF").Accessor} GltfAccessor
 * @typedef {import("../../../../types/glTF/glTF").Buffer} GltfBuffer
 * @typedef {import("../../../../types/glTF/glTF").BufferView} GltfBufferView
 * @typedef {import("../../../../types/glTF/glTF").Node} GLTFNode
 * @typedef {import("../../../../types/glTF/glTF").Sampler} GltfSampler
 */

/**
 * 
 * @param {GLTFNode} gltfNode
 */
export function createNode(gltfNode) {
    let node = new Node(gltfNode.name);

    if (gltfNode.translation) {
        node.setPosition(
            gltfNode.translation[0],
            gltfNode.translation[1],
            gltfNode.translation[2]
        );
    }

    if (gltfNode.rotation) {
        node.setRotation(
            gltfNode.rotation[0],
            gltfNode.rotation[1],
            gltfNode.rotation[2],
            gltfNode.rotation[3]
        );
    }

    if (gltfNode.scale) {
        node.setScale(
            gltfNode.scale[0],
            gltfNode.scale[1],
            gltfNode.scale[2]
        );
    }
    return node;
}

class BufferBlob {
    constructor() {
        /**
         * @type {ArrayBuffer[]}
         */
        this._arrayByffers = [];

        this._length = 0;
    }

    /**
     * 
     * @param {ArrayBuffer} arrayBuffer 
     * @return {number}
     */
    addBuffer(arrayBuffer) {
        const result = this._length;
        this._arrayByffers.push(arrayBuffer);
        this._length += arrayBuffer.byteLength;
        return result;
    }

    getLength() {
        return this._length;
    }

    /**
     * @return {ArrayBuffer}
     */
    getCombined() {
        let length = 0;
        this._arrayByffers.forEach(arrayBuffer => length += arrayBuffer.byteLength);
        const result = new Uint8Array(length);
        let counter = 0;
        this._arrayByffers.forEach(arrayBuffer => {
            result.set(new Uint8Array(arrayBuffer), counter);
            counter += arrayBuffer.byteLength;
        });
        return result.buffer;
    }
}

export class GltfConverter {
    /**
     * 
     * @param {Gltf} gltf 
     * @param {Buffer[]} buffers 
     */
    constructor(gltf, buffers) {
        /**
         * @type {Gltf}
         */
        this._gltf = gltf;
        /**
         * @type {Buffer[]}
         */
        this._buffers = buffers;
    }

    /**
     * 
     * @param {number} index 
     * @return {{mesh: Mesh, buffer: ArrayBuffer}}
     */
    createMesh(index) {
        if (this._gltf.meshes === undefined || index >= this._gltf.meshes.length) {
            return null;
        }

        const gltfMesh = this._gltf.meshes[index];

        const bufferBlob = new BufferBlob();

        let minPosition = new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        let maxPosition = new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

        const vertexBundles = [];
        const primitives = gltfMesh.primitives.map((gltfPrimitive, primitiveIndex) => {
            const attributeNames = Object.getOwnPropertyNames(gltfPrimitive.attributes);

            let vertexBufferStride = 0;
            let verticesCount = 0;
            const formats = [];

            const attributeByteLengths = attributeNames.map((attributeName) => {
                const attributeAccessor = this._requireGltfAccessor(gltfPrimitive.attributes[attributeName]);
                const attributeByteLength = this._getBytesPerAttribute(attributeAccessor);
                vertexBufferStride += attributeByteLength;
                verticesCount = Math.max(verticesCount, attributeAccessor.count);
                return attributeByteLength;
            });

            const vertexBuffer = new ArrayBuffer(vertexBufferStride * verticesCount);

            let currentByteOffset = 0;
            attributeNames.forEach((attributeName, iAttribute) => {
                const attributeAccessor = this._requireGltfAccessor(gltfPrimitive.attributes[attributeName]);
                this._readAccessor(attributeAccessor, new DataView(vertexBuffer, currentByteOffset), vertexBufferStride);
                currentByteOffset += attributeByteLengths[iAttribute];

                if (attributeName === "POSITION") {
                    if (attributeAccessor.min) {
                        vec3.min(minPosition, minPosition, new vec3(attributeAccessor.min[0], attributeAccessor.min[1], attributeAccessor.min[2]));
                    }
                    if (attributeAccessor.max) {
                        vec3.max(maxPosition, maxPosition, new vec3(attributeAccessor.max[0], attributeAccessor.max[1], attributeAccessor.max[2]));
                    }
                }

                formats.push({
                    name: this._getGfxAttributeName(attributeName),
                    type: this._getGfxComponentType(attributeAccessor.componentType),
                    num: this._getComponentsPerAttribute(attributeAccessor.type)
                });
            });

            const vertexBundleRange = new BufferRange(bufferBlob.addBuffer(vertexBuffer), vertexBuffer.byteLength);

            const vertexBundle = new VertexBundle();
            vertexBundle._data = vertexBundleRange;
            vertexBundle._verticesCount = verticesCount;
            vertexBundle._formats = formats;
            vertexBundles.push(vertexBundle);

            let indices = null;
            let indexUnit = null;
            if (gltfPrimitive.indices !== undefined) {
                const indicesAccessor = this._requireGltfAccessor(gltfPrimitive.indices);
                const indexStride = this._getBytesPerAttribute(indicesAccessor);
                const indicesData = new ArrayBuffer(indexStride * indicesAccessor.count);
                this._readAccessor(indicesAccessor, new DataView(indicesData));
                indices = new BufferRange(bufferBlob.addBuffer(indicesData), indicesData.byteLength);
                indexUnit = this._getGfxIndexUnitType(indicesAccessor.componentType);
            }

            const primitive = new Primitive();
            primitive._vertexBundelIndices = [primitiveIndex];
            primitive._topology = this._getTopology(gltfPrimitive.mode === undefined ? 4 : gltfPrimitive.mode);
            primitive._indices = indices;
            primitive._indexUnit = indexUnit;
            return primitive;
        });

        const mesh = new Mesh();
        mesh.name = gltfMesh.name;
        mesh._minPosition = minPosition;
        mesh._maxPosition = maxPosition;
        mesh._primitives = primitives;
        mesh._vertexBundles = vertexBundles;
        return { mesh, buffer: bufferBlob.getCombined() };
    }

    /**
     * @param {number} index
     * @param {string[]} nodePathTable
     */
    createSkeleton(index, nodePathTable) {
        if (this._gltf.skins === undefined || index >= this._gltf.skins.length) {
            return null;
        }

        const gltfSkin = this._gltf.skins[index];

        const inverseBindMatrices = new Array(gltfSkin.joints.length);
        if (gltfSkin.inverseBindMatrices === undefined) {
            // The default is that each matrix is a 4x4 identity matrix,
            // which implies that inverse-bind matrices were pre-applied.
            for (let i = 0; i < inverseBindMatrices.length; ++i) {
                inverseBindMatrices[i] = new Mat4(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
            }
        } else {
            const inverseBindMatricesAccessor = this._requireGltfAccessor(gltfSkin.inverseBindMatrices);
            if (inverseBindMatricesAccessor.componentType !== 5126 ||
                inverseBindMatricesAccessor.type !== "MAT4") {
                throw `The inverse bind matrix should be floating-point 4x4 matrix.`;
            }
            const data = new Float32Array(inverseBindMatrices.length * 16);
            this._readAccessor(inverseBindMatricesAccessor, new DataView(data.buffer));
            for (let i = 0; i < inverseBindMatrices.length; ++i) {
                inverseBindMatrices[i] = new Mat4(
                    data[16 * i + 0], data[16 * i + 1], data[16 * i + 2], data[16 * i + 3],
                    data[16 * i + 4], data[16 * i + 5], data[16 * i + 6], data[16 * i + 7],
                    data[16 * i + 8], data[16 * i + 9], data[16 * i + 10], data[16 * i + 11],
                    data[16 * i + 12], data[16 * i + 13], data[16 * i + 14], data[16 * i + 15]
                );
            }
        }

        const skeleton = new Skeleton();
        skeleton.name = gltfSkin.name;
        skeleton._joints = gltfSkin.joints.map(nodeIndex => nodePathTable[nodeIndex]);
        skeleton._inverseBindMatrices = inverseBindMatrices;

        return skeleton;
    }

    /**
     * @param {number} index
     * @param {string[]} nodePathTable
     */
    createAnimation(index, nodePathTable) {
        if (this._gltf.animations === undefined || index >= this._gltf.animations.length) {
            return;
        }

        let gltfAnimation = this._gltf.animations[index];

        /** @type {AnimationFrame[]} */
        let frames = [];
        let maxLength = 0;

        gltfAnimation.channels.forEach(gltfChannel => {
            if (gltfChannel.target.node === undefined) {
                // When node isn't defined, channel should be ignored.
                return;
            }

            const gltfSampler = gltfAnimation.samplers[gltfChannel.sampler];
            const inputAccessor = this._requireGltfAccessor(gltfSampler.input);

            // find frame by input name
            /** @type {AnimationFrame} */
            let frame = frames.find((frame) => frame._name === inputAccessor.name);

            // if not found, create one
            if (!frame) {
                if (inputAccessor.componentType !== 5126 ||
                    inputAccessor.type !== "SCALAR") {
                    throw `Input of an animation channel must be floating point scalars represent times.`;
                }
                const inputData = new Float32Array(inputAccessor.count);
                this._readAccessor(inputAccessor, new DataView(inputData.buffer));

                const times = new Array(inputData.length);
                inputData.forEach((time, index) => {
                    times[index] = time;
                });
                if (times.length > 0) {
                    maxLength = Math.max(maxLength, times[times.length - 1]);
                }

                frame = new AnimationFrame();
                frame._name = inputAccessor.name;
                frame._times = times;
                frame._channels = [];
                frames.push(frame);
            }

            // find output frames by node id
            /** @type {AnimationChannel} */
            let channel = frame._channels.find((channel) => channel.target === nodePathTable[gltfChannel.target.node]);

            // if not found, create one
            if (!channel) {
                channel = new AnimationChannel();
                channel.target = nodePathTable[gltfChannel.target.node];
                frame._channels.push(channel);
            }

            const outputAccessor = this._requireGltfAccessor(gltfSampler.output);
            if (outputAccessor.componentType !== 5126) {
                throw `Output of an animation channel must be floating point values.`;
            }
            const outputData = new Float32Array(this._getComponentsPerAttribute(outputAccessor.type) * outputAccessor.count);
            this._readAccessor(outputAccessor, new DataView(outputData.buffer));
            if (gltfChannel.target.path === 'translation') {
                if (outputAccessor.type !== "VEC3") {
                    throw `Output of an animation channel targetting translation must be 3d vectors.`;
                }
                channel.positionCurve = new Array(outputAccessor.count);
                for (let i = 0; i < outputAccessor.count; ++i) {
                    channel.positionCurve[i] = new cc.Vec3(outputData[3 * i + 0], outputData[3 * i + 1], outputData[3 * i + 2]);
                }
            } else if (gltfChannel.target.path === 'rotation') {
                if (outputAccessor.type !== "VEC4") {
                    throw `Output of an animation channel targetting translation must be 4d vectors.`;
                }
                channel.rotationCurve = new Array(outputAccessor.count);
                for (let i = 0; i < outputAccessor.count; ++i) {
                    channel.rotationCurve[i] = new cc.Quat(outputData[4 * i + 0], outputData[4 * i + 1], outputData[4 * i + 2], outputData[4 * i + 3]);
                }
            } else if (gltfChannel.target.path === 'scale') {
                if (outputAccessor.type !== "VEC3") {
                    throw `Output of an animation channel targetting scale must be 3d vectors.`;
                }
                channel.scaleCurve = new Array(outputAccessor.count);
                for (let i = 0; i < outputAccessor.count; ++i) {
                    channel.scaleCurve[i] = new cc.Vec3(outputData[3 * i + 0], outputData[3 * i + 1], outputData[3 * i + 2]);
                }
            } else {
                throw `Unsupported channel target path.`;
            }
        });

        const animationClip = new AnimationClip();
        animationClip.name = gltfAnimation.name;
        animationClip._frames = frames;
        animationClip._length = maxLength;
        return animationClip;
    }

    /**
     * 
     * @param {number} index 
     * @param {Texture} textures 
     */
    createMaterial(index, textures) {
        if (this._gltf.materials === undefined || index >= this._gltf.materials.length) {
            return null;
        }

        const gltfMaterial = this._gltf.materials[index];

        const material = new Material();
        material.name = gltfMaterial.name;
        material.effectName = "builtin-effect-unlit";
        if (gltfMaterial.pbrMetallicRoughness) {
            const pbrMetallicRoughness = gltfMaterial.pbrMetallicRoughness;
            if (pbrMetallicRoughness.baseColorTexture) {
                material.define("USE_TEXTURE", true);
                material.setProperty("mainTexture", textures[pbrMetallicRoughness.baseColorTexture.index]);
            } else {
                material.define("USE_COLOR", true);
                let color = null;
                if (pbrMetallicRoughness.baseColorFactor) {
                    const c = pbrMetallicRoughness.baseColorFactor;
                    color = new cc.Color(c[0] * 255, c[1] * 255, c[2] * 255, c[3] * 255);
                } else {
                    color = new cc.Color(255, 255, 255, 255);
                }
                material.setProperty("color", color);
            }
        }

        return material;
    }

    /**
     * 
     * @param {number} index 
     */
    createTexture(index) {
        if (this._gltf.textures === undefined || index >= this._gltf.textures.length) {
            return null;
        }

        const gltfTexture = this._gltf.textures[index];
        const texture = new Texture();
        texture.name = gltfTexture.name;
        if (gltfTexture.sampler === undefined) {
            texture.setWrapMode(WrapMode.REPEAT, WrapMode.REPEAT);
        } else {
            const gltfSampler = this._requireSampler(gltfTexture.sampler);
            texture.setFilters(
                gltfSampler.minFilter === undefined ? undefined : this._getFilter(gltfSampler.minFilter),
                gltfSampler.magFilter === undefined ? undefined : this._getFilter(gltfSampler.magFilter)
            );
            texture.setWrapMode(
                this._getWrapMode(gltfSampler.wrapS === undefined ? 10497 : gltfSampler.wrapS),
                this._getWrapMode(gltfSampler.wrapT === undefined ? 10497 : gltfSampler.wrapT),
            );
        }

        return texture;
    }

    createNodePathTable() {
        if (this._gltf.nodes === undefined) {
            return [];
        }

        /** @type {string[]} */
        const result = new Array(this._gltf.nodes.length);
        result.fill("");
        this._gltf.nodes.forEach((gltfNode, nodeIndex) => {
            const myPath = result[nodeIndex] + gltfNode.name;
            result[nodeIndex] = myPath;
            if (gltfNode.children) {
                gltfNode.children.forEach(childNodeIndex => {
                    const childPath = result[childNodeIndex];
                    result[childNodeIndex] = `${myPath}/${childPath}`;
                });
            }
        });
        // Remove root segment
        result.forEach((path, index) => {
            let segments = path.split('/');
            segments.shift();
            result[index] = segments.join('/');
        });

        return result;
    }

    /**
     * 
     * @param {GltfAccessor} gltfAccessor 
     * @param {DataView} outputBuffer 
     * @param {number} outputStride 
     */
    _readAccessor(gltfAccessor, outputBuffer, outputStride = 0) {
        const gltfBufferView = this._requireGltfBufferView(gltfAccessor.bufferView);

        const componentsPerAttribute = this._getComponentsPerAttribute(gltfAccessor.type);
        const bytesPerElement = this._getBytesPerComponent(gltfAccessor.componentType);

        if (outputStride === 0) {
            outputStride = componentsPerAttribute * bytesPerElement;
        }

        const inputStartOffset =
            (gltfAccessor.byteOffset !== undefined ? gltfAccessor.byteOffset : 0) +
            (gltfBufferView.byteOffset !== undefined ? gltfBufferView.byteOffset : 0);

        const inputBuffer = new DataView(this._buffers[gltfBufferView.buffer].buffer, inputStartOffset);

        const inputStride = gltfBufferView.byteStride !== undefined ? gltfBufferView.byteStride : componentsPerAttribute * bytesPerElement;

        const componentReader = this._getComponentReader(gltfAccessor.componentType);
        const componentWriter = this._getComponentWriter(gltfAccessor.componentType);

        for (let iAttribute = 0; iAttribute < gltfAccessor.count; ++iAttribute) {
            const i = new DataView(inputBuffer.buffer, inputBuffer.byteOffset + inputStride * iAttribute);
            const o = new DataView(outputBuffer.buffer, outputBuffer.byteOffset + outputStride * iAttribute);
            for (let iComponent = 0; iComponent < componentsPerAttribute; ++iComponent) {
                const componentBytesOffset = bytesPerElement * iComponent;
                const value = componentReader(i, componentBytesOffset);
                componentWriter(o, componentBytesOffset, value);
            }
        }
    }

    /**
     * 
     * @param {number} mode 
     */
    _getTopology(mode) {
        switch (mode) {
            case 0: return gfxEnums.PT_POINTS;
            case 1: return gfxEnums.PT_LINES;
            case 2: return gfxEnums.PT_LINE_LOOP;
            case 3: return gfxEnums.PT_LINE_STRIP;
            case 4: return gfxEnums.PT_TRIANGLES;
            case 5: return gfxEnums.PT_TRIANGLE_STRIP;
            case 6: return gfxEnums.PT_TRIANGLE_FAN;
            default:
                throw `Unrecognized primitive mode: ${mode}.`;
        }
    }

    /**
     * 
     * @param {number} componentType 
     */
    _getGfxIndexUnitType(componentType) {
        return componentType;
    }

    /**
     * 
     * @param {number} componentType 
     */
    _getGfxComponentType(componentType) {
        return componentType;
    }

    /**
     * 
     * @param {GltfAccessor} gltfAccessor 
     */
    _getBytesPerAttribute(gltfAccessor) {
        return this._getBytesPerComponent(gltfAccessor.componentType) * this._getComponentsPerAttribute(gltfAccessor.type);
    }

    /**
     * 
     * @param {string} type 
     */
    _getComponentsPerAttribute(type) {
        switch (type) {
            case "SCALAR": return 1;
            case "VEC2": return 2;
            case "VEC3": return 3;
            case "VEC4": case "MAT2": return 4;
            case "MAT3": return 9;
            case "MAT4": return 16;
            default:
                throw `Unrecognized attribute type: ${type}.`;
        }
    }

    /**
     * 
     * @param {number} componentType 
     */
    _getBytesPerComponent(componentType) {
        switch (componentType) {
            case 5120: case 5121: return 1;
            case 5122: case 5123: return 2;
            case 5125: case 5126: return 4;
            default:
                throw `Unrecognized component type: ${componentType}`;
        }
    }

    /**
     * 
     * @param {string} name 
     */
    _getGfxAttributeName(name) {
        switch (name) {
            case "POSITION": return gfx.ATTR_POSITION;
            case "NORMAL": return gfx.ATTR_NORMAL;
            case "TANGENT": return gfx.ATTR_TANGENT;
            case "COLOR_0": return gfx.ATTR_COLOR0;
            case "TEXCOORD_0": return gfx.ATTR_UV0;
            case "TEXCOORD_1": return gfx.ATTR_UV1;
            case "TEXCOORD_2": return gfx.ATTR_UV2;
            case "TEXCOORD_3": return gfx.ATTR_UV3;
            case "JOINTS_0": return gfx.ATTR_JOINTS;
            case "WEIGHTS_0": return gfx.ATTR_WEIGHTS;
            default:
                throw `Unrecognized attribute type: ${name}`;
        }
    }

    /**
     * 
     * @param {number} componentType 
     * @return {(buffer: DataView, offset: number) => number}
     */
    _getComponentReader(componentType) {
        switch (componentType) {
            case 5120: return (buffer, offset) => buffer.getInt8(offset);
            case 5121: return (buffer, offset) => buffer.getUint8(offset);
            case 5122: return (buffer, offset) => buffer.getInt16(offset, true);
            case 5123: return (buffer, offset) => buffer.getUint16(offset, true);
            case 5125: return (buffer, offset) => buffer.getUint32(offset, true);
            case 5126: return (buffer, offset) => buffer.getFloat32(offset, true);
            default:
                throw `Unrecognized component type: ${componentType}`;
        }
    }

    /**
     * 
     * @param {number} componentType 
     * @return {(buffer: DataView, offset: number, value: number) => void}
     */
    _getComponentWriter(componentType) {
        switch (componentType) {
            case 5120: return (buffer, offset, value) => buffer.setInt8(offset, value);
            case 5121: return (buffer, offset, value) => buffer.setUint8(offset, value);
            case 5122: return (buffer, offset, value) => buffer.setInt16(offset, value, true);
            case 5123: return (buffer, offset, value) => buffer.setUint16(offset, value, true);
            case 5125: return (buffer, offset, value) => buffer.setUint32(offset, value, true);
            case 5126: return (buffer, offset, value) => buffer.setFloat32(offset, value, true);
            default:
                throw `Unrecognized component type: ${componentType}`;
        }
    }

    /**
     * 
     * @param {number} filter 
     */
    _getFilter(filter) {
        switch (filter) {
            case 9728:
                return Filter.NEAREST;
            case 9729:
                return Filter.LINEAR;
            default:
                throw `Unrecognized filter: ${filter}.`;
        }
    }

    /**
     * 
     * @param {number} wrapMode 
     */
    _getWrapMode(wrapMode) {
        switch (wrapMode) {
            case 33071:
                return WrapMode.CLAMP_TO_EDGE;
            case 33648:
                return WrapMode.MIRRORED_REPEAT;
            case 10497:
                return WrapMode.REPEAT;
            default:
                throw `Unrecognized wrapMode: ${wrapMode}.`;
        }
    }

    /**
     * 
     * @param {number} index 
     * @return {GltfBuffer}
     */
    _requireGltfBuffer(index) {
        if (this._gltf.buffers === undefined) {
            throw `Buffers is require but it do not exists.`;
        }
        return this._gltf.buffers[index];
    }

    /**
     * @return {GltfBufferView}
     * @param {number} index 
     */
    _requireGltfBufferView(index) {
        if (this._gltf.bufferViews === undefined) {
            throw `BufferViews is require but it do not exists.`;
        }
        return this._gltf.bufferViews[index];
    }

    /**
     * 
     * @param {number} index 
     * @return {GltfAccessor}
     */
    _requireGltfAccessor(index) {
        if (this._gltf.accessors === undefined) {
            throw `Accessors is require but it do not exists.`;
        }
        return this._gltf.accessors[index];
    }

    /**
     * @param {number} index 
     * @return {GltfSampler}
     * @private
     */
    _requireSampler(index) {
        if (this._gltf.samplers === undefined) {
            throw `Samplers is require but it do not exists.`;
        }
        return this._gltf.samplers[index];
    }
}