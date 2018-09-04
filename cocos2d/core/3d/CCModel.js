/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

const AnimationClip = require('../../animation/animation-clip');

const renderEngine = require('../renderer/render-engine');
const renderer = require('../renderer');
const gfx = renderEngine.gfx;
const vec3 = cc.vmath.vec3;

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

function createArray(gltf, bin, accessorID) {
    let acc = gltf.accessors[accessorID];
    let bufView = gltf.bufferViews[acc.bufferView];

    let num = _type2size[acc.type];
    let typedArray = _compType2Array[acc.componentType];
    let result = new typedArray(bin, bufView.byteOffset + acc.byteOffset, acc.count * num);

    return result;
}

var Model = cc.Class({
    name: 'cc.Model',
    extends: cc.Asset,

    ctor() {
        this._bin = null;
    },

    properties: {
        _nativeAsset: {
            get() {
                return this._bin;
            },
            set(bin) {
                this._bin = bin.buffer;
                this._initNodes();
            },
            override: true
        },

        _gltf: {
            default: {}
        }
    },

    _initNodes() {
        let nodes = this._gltf.nodes;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            
            node.path = node.parent ? node.parent.path + '/' + node.name : '';

            let children = node.children;
            if (children) {
                for (let j = 0; j < children.length; j++) {
                    let child = nodes[children[j]];
                    child.parent = node;
                }
            }
        }
    },

    _createVB(bin, gltf, accessors, attributes) {
        // create vertex-format
        let vfmt = [];
        let vcount = 0;

        let byteOffset = 10e7, maxByteOffset = 0;

        if (attributes.POSITION !== undefined) {
            let acc = accessors[attributes.POSITION];
            let vbView = gltf.bufferViews[acc.bufferView];
            vcount = acc.count;

            vfmt.push({
                name: gfx.ATTR_POSITION, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.NORMAL !== undefined) {
            let acc = accessors[attributes.NORMAL];
            let vbView = gltf.bufferViews[acc.bufferView];

            vfmt.push({
                name: gfx.ATTR_NORMAL, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.TANGENT !== undefined) {
            let acc = accessors[attributes.TANGENT];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_TANGENT, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.COLOR_0 !== undefined) {
            let acc = accessors[attributes.COLOR_0];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_COLOR0, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.TEXCOORD_0 !== undefined) {
            let acc = accessors[attributes.TEXCOORD_0];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_UV0, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.TEXCOORD_1 !== undefined) {
            let acc = accessors[attributes.TEXCOORD_1];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_UV1, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.TEXCOORD_2 !== undefined) {
            let acc = accessors[attributes.TEXCOORD_2];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_UV2, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.TEXCOORD_3 !== undefined) {
            let acc = accessors[attributes.TEXCOORD_3];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_UV3, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.JOINTS_0 !== undefined) {
            let acc = accessors[attributes.JOINTS_0];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_JOINTS, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        if (attributes.WEIGHTS_0 !== undefined) {
            let acc = accessors[attributes.WEIGHTS_0];
            let vbView = gltf.bufferViews[acc.bufferView];
            vfmt.push({
                name: gfx.ATTR_WEIGHTS, type: acc.componentType, num: _type2size[acc.type],
                byteLength: vbView.byteLength, byteOffset: vbView.byteOffset
            });

            byteOffset = Math.min(byteOffset, vbView.byteOffset);
            maxByteOffset = Math.max(maxByteOffset, vbView.byteOffset + vbView.byteLength);
        }

        let gfxVFmt = new gfx.VertexFormat(vfmt);
        let els = gfxVFmt._elements;
        for (let i = 0; i < els.length; i++) {
            let el = els[i];
            el.offset = vfmt[i].byteOffset - byteOffset;
            el.stride = el.bytes;
        }

        // create vertex-buffer
        let vbData = new Uint8Array(bin, byteOffset, maxByteOffset - byteOffset);
        let vb = new gfx.VertexBuffer(
            renderer.device,
            gfxVFmt,
            gfx.USAGE_STATIC,
            vbData,
            vcount
        );

        vb.data = vbData;

        return vb;
    },

    createSkinning(index) {
        let gltf = this._gltf;
        let bin = this._bin;
        if (index >= gltf.skins.length) {
            return null;
        }

        let gltfSkin = gltf.skins[index];

        // extract bindposes mat4 data
        let accessor = gltf.accessors[gltfSkin.inverseBindMatrices];
        let bufView = gltf.bufferViews[accessor.bufferView];
        let data = new Float32Array(bin, bufView.byteOffset + accessor.byteOffset, accessor.count * 16);
        let bindposes = new Array(accessor.count);

        for (let i = 0; i < accessor.count; ++i) {
            bindposes[i] = cc.vmath.mat4.new(
                data[16 * i + 0], data[16 * i + 1], data[16 * i + 2], data[16 * i + 3],
                data[16 * i + 4], data[16 * i + 5], data[16 * i + 6], data[16 * i + 7],
                data[16 * i + 8], data[16 * i + 9], data[16 * i + 10], data[16 * i + 11],
                data[16 * i + 12], data[16 * i + 13], data[16 * i + 14], data[16 * i + 15]
            );
        }

        return {
            jointIndices: gltfSkin.joints,
            bindposes: bindposes,
        };
    },

    initMesh(meshAsset) {
        const index = meshAsset._meshID;

        const bin = this._bin;
        const gltf = this._gltf;
        const gltfMesh = gltf.meshes[index];
        const accessors = gltf.accessors;

        // create index-buffer
        meshAsset._subMeshes.length = gltfMesh.primitives.length;
        for (let i = 0; i < gltfMesh.primitives.length; ++i) {
            let primitive = gltfMesh.primitives[i];

            if (primitive.indices === undefined) continue;

            let vb = this._createVB(bin, gltf, accessors, primitive.attributes);

            let ibAcc = accessors[primitive.indices];
            let ibView = gltf.bufferViews[ibAcc.bufferView];
            let ibData = new Uint16Array(bin, ibView.byteOffset, ibView.byteLength/2);
            let ib = new gfx.IndexBuffer(
                renderer.device,
                ibAcc.componentType,
                gfx.USAGE_STATIC,
                ibData,
                ibAcc.count
            );
            ib.data = ibData;

            meshAsset._subMeshes[i] = new renderEngine.InputAssembler(vb, ib);
        }
    },

    initAnimationClip(clip) {
        let gltf = this._gltf;
        let bin = this._bin;

        let accessors = gltf.accessors;
        let gltfAnimation = gltf.animations[clip._animationID];

        clip.name = gltfAnimation.name;
        clip.wrapMode = cc.WrapMode.Loop;
        let duration = 0;

        let curveData = clip.curveData;
        let paths = curveData.paths = {};

        let nodes = gltf.nodes;
        let rootNode = nodes[0];

        let samplers = gltfAnimation.samplers;
        let channels = gltfAnimation.channels;
        for (let i = 0; i < channels.length; ++i) {
            let gltfChannel = channels[i];
            let sampler = samplers[gltfChannel.sampler];

            let inputArray = createArray(gltf, bin, sampler.input);
            let outputArray = createArray(gltf, bin, sampler.output);

            let interpolation = sampler.interpolation;
            
            let target = gltfChannel.target;
            let node = nodes[target.node];

            let path = node.path;

            let curves;
            if (path === '') {
                curves = curveData;
            }
            else {
                if (!paths[path]) {
                    paths[path] = {};
                }
                curves = paths[path];
            }

            if (!curves.props) {
                curves.props = {};
            }

            let frames = [];
            for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                let frame = inputArray[frameIdx];
                if (frame > duration) {
                    duration = frame;
                }
                frames.push({frame: frame});
            }
            if (target.path === 'translation') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 3;
                    frames[frameIdx].value = cc.v3(outputArray[i], outputArray[i+1], outputArray[i+2]);
                }
                curves.props.position = frames;
            }
            else if (target.path === 'rotation') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 4;
                    frames[frameIdx].value = cc.quat(outputArray[i], outputArray[i+1], outputArray[i+2], outputArray[i+3]);
                }
                curves.props.quat = frames;
            }
            else if (target.path === 'scale') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 3;
                    frames[frameIdx].value = cc.v3(outputArray[i], outputArray[i+1], outputArray[i+2]);
                }
                curves.props.scale = frames;
            }
        }

        for (let i = 1; i < nodes.length; i++) {
            let node = nodes[i];
            if (paths[node.path]) continue;

            let curves = paths[node.path] = { props: {} };
            let props = curves.props;

            let rotation = node.rotation;
            if (rotation) {
                props.quat = [{
                    frame: 0,
                    value: cc.quat(rotation[0], rotation[1], rotation[2], rotation[3])
                }];
            }

            let scale = node.scale;
            if (scale) {
                props.scale = [{
                    frame: 0,
                    value: cc.v3(scale[0], scale[1], scale[2])
                }];
            }

            let translation = node.translation;
            if (translation) {
                props.position = [{
                    frame: 0,
                    value: cc.v3(translation[0], translation[1], translation[2])
                }];
            }
        }

        clip._duration = duration;
    }
});

module.exports = Model;
