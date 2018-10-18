// @ts-check
import { _decorator } from "../../../core/data/index";
const { ccclass, property } = _decorator;
import gfx from "../../../renderer/gfx";
import renderer from "../../../renderer";
import { vec3, quat, mat4 } from "../../../core/vmath";
import Node from "../../../scene-graph/node";
import { MeshResource } from "../mesh";
import GLTFAsset from "../../../assets/CCGLTFAsset";
import Skeleton from "../skeleton";
import { Mat4 } from "../../../core/value-types";
import AnimationClip, { AnimationFrame, AnimationChannel } from "../animation-clip";

/**
 * @typedef {import("../../../../types/glTF/glTF").GlTf} GLTFFormat
 * @typedef {import("../../../../types/glTF/glTF").Node} GLTFNode
 */

@ccclass('cc.GltfMeshResource')
export class GltfMeshResource extends MeshResource {
    /**
     * @type {GLTFAsset}
     */
    @property(GLTFAsset)
    gltfAsset = null;

    /**
     * @type {number}
     */
    @property(Number)
    gltfIndex = -1;

    /**
     * Update mesh asset's content to the GlTf asset's specified mesh.
     * The GlTf mesh is conditionally supported.
     * All attributes of a GlTf primitive shall be recognized;
     * they shall have same amount of elements, and
     * shall be tighly interleaved, with no extra head data, in same buffer view.
     * @param {cc.d3.asset.Mesh} mesh 
     */
    flush(mesh) {
        if (!this.gltfAsset) {
            return;
        }

        /** @type GLTFFormat */
        const gltf = this.gltfAsset.description;
        if (this.gltfIndex >= gltf.meshes.length) {
            return;
        }

        const gltfMesh = gltf.meshes[this.gltfIndex];
        const gltfAccessors = gltf.accessors;

        mesh.name = gltfMesh.name;

        mesh._subMeshes = new Array(gltfMesh.primitives.length);
        for (let i = 0; i < gltfMesh.primitives.length; ++i) {
            let primitive = gltfMesh.primitives[i];

            let iVertexBufferView = -1;
            let vertexCount = -1;
            const vfmt = [];
            for (const gltfAttribName in primitive.attributes) {
                const gfxAttribName = _gltfAttribMap[gltfAttribName];
                if (gfxAttribName === undefined) {
                    console.error(`Found unacceptable GlTf attribute ${gltfAttribName}.`);
                    return;
                }
                const gltfAccessor = gltfAccessors[primitive.attributes[gltfAttribName]];

                if (iVertexBufferView !== -1 && iVertexBufferView !== gltfAccessor.bufferView) {
                    console.error(`All attributes of one GlTf primitive should reference to the same buffer view.`);
                    return;
                } else {
                    iVertexBufferView = gltfAccessor.bufferView;
                }

                if (vertexCount !== -1 && vertexCount !== gltfAccessor.count) {
                    console.error(`All attributes of one GlTf primitive should have same amount of elements.`);
                    return;
                } else {
                    vertexCount = gltfAccessor.count;
                }

                if (gltfAttribName === "POSITION") {
                    mesh._minPos = vec3.create(gltfAccessor.min[0], gltfAccessor.min[1], gltfAccessor.min[2]);
                    mesh._maxPos = vec3.create(gltfAccessor.max[0], gltfAccessor.max[1], gltfAccessor.max[2]);
                }
                vfmt.push({ name: gfxAttribName, type: gltfAccessor.componentType, num: _type2size[gltfAccessor.type] });
            }

            const vertexBufferView = gltf.bufferViews[iVertexBufferView];
            const vbData = new Uint8Array(this.gltfAsset.buffers[vertexBufferView.buffer].data.buffer, vertexBufferView.byteOffset, vertexBufferView.byteLength);
            const vb = new gfx.VertexBuffer(
                cc.game._renderContext,
                new gfx.VertexFormat(vfmt),
                gfx.USAGE_STATIC,
                vbData,
                vertexCount
            );

            let ib = null;
            if (primitive.indices !== undefined) {
                let ibAcc = gltfAccessors[primitive.indices];
                let ibView = gltf.bufferViews[ibAcc.bufferView];
                let ibData = new DataView(this.gltfAsset.buffers[ibView.buffer].data.buffer, ibView.byteOffset, ibView.byteLength);

                ib = new gfx.IndexBuffer(
                    cc.game._renderContext,
                    ibAcc.componentType,
                    gfx.USAGE_STATIC,
                    ibData,
                    ibAcc.count
                );
            }

            mesh._subMeshes[i] = new renderer.InputAssembler(vb, ib);
        }
    }
}
cc.GltfMeshResource = GltfMeshResource;

const _type2size = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
};

const _compType2Array = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5124: Int32Array,
    5125: Uint32Array,
    5126: Float32Array,
};

const _gltfAttribMap = {
    POSITION: gfx.ATTR_POSITION,
    NORMAL: gfx.ATTR_NORMAL,
    TANGENT: gfx.ATTR_TANGENT,
    COLOR_0: gfx.ATTR_COLOR0,
    TEXCOORD_0: gfx.ATTR_UV0,
    TEXCOORD_1: gfx.ATTR_UV1,
    TEXCOORD_2: gfx.ATTR_UV2,
    TEXCOORD_3: gfx.ATTR_UV3,
    JOINTS_0: gfx.ATTR_JOINTS,
    WEIGHTS_0: gfx.ATTR_WEIGHTS
};

/**
 * @param {GLTFFormat} gltf
 * @param {ArrayBuffer} bin
 * @param {number} accessorID
 * @return {Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array}
 */
function _createArray(gltf, bin, accessorID) {
    let acc = gltf.accessors[accessorID];
    if (acc.bufferView === undefined) {
        throw "Unexpect accessor format.";
    }
    let bufView = gltf.bufferViews[acc.bufferView];

    let num = _type2size[acc.type];
    let typedArray = _compType2Array[acc.componentType];
    let result = new typedArray(bin, bufView.byteOffset + acc.byteOffset, acc.count * num);

    return result;
}

/**
 * @param {GLTFNode[]} gltfNodes
 */
export function createNodes(gltfNodes) {
    let nodes = new Array(gltfNodes.length);

    for (let i = 0; i < gltfNodes.length; ++i) {
        let node = createNode(gltfNodes[i]);
        nodes[i] = node;
    }

    for (let i = 0; i < gltfNodes.length; ++i) {
        let gltfNode = gltfNodes[i];
        let node = nodes[i];

        if (gltfNode.children) {
            for (let j = 0; j < gltfNode.children.length; ++j) {
                let index = gltfNode.children[j];
                node.append(nodes[index]);
            }
        }
    }

    return nodes;
}

/**
 * @param {*} app
 * @param {Array} gltfNodes
 */
export function createEntities(app, gltfNodes) {
    let nodes = new Array(gltfNodes.length);

    for (let i = 0; i < gltfNodes.length; ++i) {
        let gltfNode = gltfNodes[i];
        /** @type Node */
        let node = app.createEntity(gltfNode.name);

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

        nodes[i] = node;
    }

    for (let i = 0; i < gltfNodes.length; ++i) {
        let gltfNode = gltfNodes[i];
        let node = nodes[i];

        if (gltfNode.children) {
            for (let j = 0; j < gltfNode.children.length; ++j) {
                let index = gltfNode.children[j];
                node.append(nodes[index]);
            }
        }
    }

    return nodes;
}

/**
 * @param {GLTFFormat} gltf
 * @param {Buffer[]} buffers
 * @param {number} index
 * @param {string[]} nodePathTable
 */
export function createSkeleton(gltf, buffers, nodePathTable, index) {
    if (!gltf.skins || index >= gltf.skins.length) {
        return;
    }

    /** @type {cc.Node[]} */
    let nodes = [];
    if (gltf.nodes) {
        nodes = new Array(gltf.nodes.length);
        gltf.nodes.forEach((gltfNode, index) => {
            nodes[index] = createNode(gltfNode);
        });
        gltf.nodes.forEach((gltfNode, index) => {
            if (gltfNode.children) {
                const node = nodes[index];
                gltfNode.children.forEach(childIndex => {
                    node.addChild(nodes[childIndex]);
                });
            }
        });
    }

    const gltfSkin = gltf.skins[index];
    const skeleton = new Skeleton();
    skeleton.name = gltfSkin.name;
    skeleton._joints = gltfSkin.joints.map(nodeIndex => nodePathTable[nodeIndex]);
    // extract bindposes mat4 data
    let accessor = gltf.accessors[gltfSkin.inverseBindMatrices];
    let bufView = gltf.bufferViews[accessor.bufferView];
    let data = _createArray(gltf, buffers[bufView.buffer].buffer, gltfSkin.inverseBindMatrices);
    skeleton._inverseBindMatrices = new Array(accessor.count);
    for (let i = 0; i < accessor.count; ++i) {
        skeleton._inverseBindMatrices[i] = new Mat4(
            data[16 * i + 0], data[16 * i + 1], data[16 * i + 2], data[16 * i + 3],
            data[16 * i + 4], data[16 * i + 5], data[16 * i + 6], data[16 * i + 7],
            data[16 * i + 8], data[16 * i + 9], data[16 * i + 10], data[16 * i + 11],
            data[16 * i + 12], data[16 * i + 13], data[16 * i + 14], data[16 * i + 15]
        );
    }

    return skeleton;
}

/**
 * @param {GLTFFormat} gltf
 * @param {Buffer[]} buffers
 * @param {number} index
 * @param {string[]} nodePathTable
 */
export function createAnimation(gltf, buffers, nodePathTable, index) {
    if (!gltf.animations || index >= gltf.animations.length) {
        return;
    }

    const bin = buffers[0].buffer;

    /** @type {AnimationFrame[]} */
    let frames = [];
    let maxLength = -1;

    let gltfAnimation = gltf.animations[index];
    gltfAnimation.channels.forEach(gltfChannel => {
        if (gltfChannel.target.node === undefined) {
            // When node isn't defined, channel should be ignored.
            return;
        }

        let gltfSampler = gltfAnimation.samplers[gltfChannel.sampler];
        let inputAcc = gltf.accessors[gltfSampler.input];

        // find frame by input name
        /** @type {AnimationFrame} */
        let frame = frames.find((frame) => frame._name === inputAcc.name);

        // if not found, create one
        if (!frame) {
            let inArray = _createArray(gltf, bin, gltfSampler.input);
            /** @type {number[]} */
            let inputs = new Array(inArray.length);
            for (let i = 0; i < inArray.length; ++i) {
                let t = inArray[i];
                inputs[i] = t;

                if (maxLength < t) {
                    maxLength = t;
                }
            }

            frame = new AnimationFrame();
            frame._name = inputAcc.name;
            frame._times = inputs;
            frame._channels = [];
            frames.push(frame);
        }

        // find output frames by node id
        /** @type {AnimationChannel} */
        let channel = frame._channels.find((channel) => channel.target ===  nodePathTable[gltfChannel.target.node]);

        // if not found, create one
        if (!channel) {
            channel = new AnimationChannel();
            channel.target = nodePathTable[gltfChannel.target.node];
            frame._channels.push(channel);
        }

        let outArray = _createArray(gltf, bin, gltfSampler.output);
        if (gltfChannel.target.path === 'translation') {
            let cnt = outArray.length / 3;
            channel.positionCurve = new Array(cnt);
            for (let i = 0; i < cnt; ++i) {
                channel.positionCurve[i] = new cc.Vec3(
                    outArray[3 * i + 0],
                    outArray[3 * i + 1],
                    outArray[3 * i + 2]
                );
            }
        } else if (gltfChannel.target.path === 'rotation') {
            let cnt = outArray.length / 4;
            channel.rotationCurve = new Array(cnt);
            for (let i = 0; i < cnt; ++i) {
                channel.rotationCurve[i] = new cc.Quat(
                    outArray[4 * i + 0],
                    outArray[4 * i + 1],
                    outArray[4 * i + 2],
                    outArray[4 * i + 3]
                );
            }
        } else if (gltfChannel.target.path === 'scale') {
            let cnt = outArray.length / 3;
            channel.scaleCurve = new Array(cnt);
            for (let i = 0; i < cnt; ++i) {
                channel.scaleCurve[i] = new cc.Vec3(
                    outArray[3 * i + 0],
                    outArray[3 * i + 1],
                    outArray[3 * i + 2]
                );
            }
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
 * @param {GLTFFormat} gltf 
 * @param {number} index 
 */
function _createNodeRecursive(gltf, index) {
    let gltfNode = gltf.nodes[index];
    let node = createNode(gltfNode);
    if (gltfNode.children) {
        gltfNode.children.forEach((childGLTFNode) => {
            let childNode = _createNodeRecursive(gltf, childGLTFNode);
            node.addChild(childNode);
        });
    }
    return node;
}

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

/**
 * 
 * @param {GLTFFormat} gltf 
 */
export function createNodePathTable(gltf) {
    if (!gltf.nodes) {
        return [];
    }

    /** @type {string[]} */
    const result = new Array(gltf.nodes.length);
    result.fill("");
    gltf.nodes.forEach((gltfNode, nodeIndex) => {
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