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
const BufferAsset = require('../assets/CCBufferAsset');

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

let Model = cc.Class({
    name: 'cc.Model',
    extends: cc.Asset,

    ctor () {
        this._nodesInited = false;
    },

    properties: {
        _buffers: [BufferAsset],

        _gltf: {
            default: {}
        }
    },

    _initNodes () {
        if (this._nodesInited) return;
        this._nodesInited = true;

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

    initSkeleton (skeleton) {
        let gltf = this._gltf;
        let buffers = this._buffers;
        let skinID = skeleton._skinID;
        if (skinID >= gltf.skins.length) {
            return null;
        }

        let gltfSkin = gltf.skins[skinID];

        // extract bindposes mat4 data
        let accessor = gltf.accessors[gltfSkin.inverseBindMatrices];
        let bufView = gltf.bufferViews[accessor.bufferView];
        let bin = buffers[bufView.buffer]._buffer;
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

        skeleton.jointIndices = gltfSkin.joints;
        skeleton.bindposes = bindposes;
    },

    _createVB (gltf, accessors, primitive) {
        const buffers = this._buffers;

        // create vertex-format
        let vfmt = [];
        let vcount = 0;

        let byteOffset = 10e7, maxByteOffset = 0;
        let bufferViewIndex = -1;
        let attributes = primitive.attributes;
        for (let gltfAttribName in attributes) {
            const gfxAttribName = _gltfAttribMap[gltfAttribName];
            if (gfxAttribName === undefined) {
                console.error(`Found unacceptable GlTf attribute ${gltfAttribName}.`);
                return;
            }
            let acc = accessors[attributes[gltfAttribName]];
            vcount = Math.max(acc.count, vcount);

            let vbView = gltf.bufferViews[acc.bufferView];
            bufferViewIndex = vbView.buffer;
            vfmt.push({
                name: gfxAttribName, type: acc.componentType, num: _type2size[acc.type],
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

        let bin = this._buffers[bufferViewIndex]._buffer;

        // create vertex-buffer
        let vbData = new Uint8Array(bin, byteOffset, maxByteOffset - byteOffset);
        let vb = new gfx.VertexBuffer(
            renderer.device,
            gfxVFmt,
            gfx.USAGE_STATIC,
            vbData,
            vcount
        );

        return {
            buffer: vb,
            data: vbData
        };
    },

    _createIB (gltf, accessors, primitive) {
        let ibAcc = accessors[primitive.indices];
        let ibView = gltf.bufferViews[ibAcc.bufferView];
        let bin = this._buffers[ibView.buffer]._buffer;
        let ibData = new Uint16Array(bin, ibView.byteOffset, ibView.byteLength / 2);
        let ibBuffer = new gfx.IndexBuffer(
            renderer.device,
            ibAcc.componentType,
            gfx.USAGE_STATIC,
            ibData,
            ibAcc.count
        );

        return {
            buffer: ibBuffer,
            data: ibData
        }
    },

    _createArray (gltf, accessorID) {
        let acc = gltf.accessors[accessorID];
        let bufView = gltf.bufferViews[acc.bufferView];
        let bin = this._buffers[bufView.buffer]._buffer;

        let num = _type2size[acc.type];
        let typedArray = _compType2Array[acc.componentType];
        let result = new typedArray(bin, bufView.byteOffset + acc.byteOffset, acc.count * num);

        return result;
    },

    initMesh (meshAsset) {
        const index = meshAsset._meshID;

        const gltf = this._gltf;
        const gltfMesh = gltf.meshes[index];
        const accessors = gltf.accessors;

        // create index-buffer
        let length = gltfMesh.primitives.length;
        meshAsset._ibs.length = length;
        meshAsset._vbs.length = length;
        meshAsset._subMeshes.length = length;
        for (let i = 0; i < length; ++i) {
            let primitive = gltfMesh.primitives[i];

            if (primitive.indices === undefined) continue;

            let vb = this._createVB(gltf, accessors, primitive);
            let ib = this._createIB(gltf, accessors, primitive);

            if (primitive.attributes.POSITION) {
                let gltfAccessor = accessors[primitive.attributes.POSITION];
                let minPos = meshAsset._minPos, maxPos = meshAsset._maxPos,
                    min = gltfAccessor.min, max = gltfAccessor.max;
                minPos.x = Math.min(minPos.x, min[0]);
                minPos.y = Math.min(minPos.y, min[1]);
                minPos.z = Math.min(minPos.z, min[2]);
                maxPos.x = Math.max(maxPos.x, max[0]);
                maxPos.y = Math.max(maxPos.y, max[1]);
                maxPos.z = Math.max(maxPos.z, max[2]);
            }

            meshAsset._subMeshes[i] = new renderEngine.InputAssembler(vb.buffer, ib.buffer);
            meshAsset._vbs[i] = vb;
            meshAsset._ibs[i] = ib;
        }
    },

    initAnimationClip (clip) {
        this._initNodes();

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

            let inputArray = this._createArray(gltf, sampler.input);
            let outputArray = this._createArray(gltf, sampler.output);

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
                frames.push({ frame: frame });
            }
            if (target.path === 'translation') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 3;
                    frames[frameIdx].value = cc.v3(outputArray[i], outputArray[i + 1], outputArray[i + 2]);
                }
                curves.props.position = frames;
            }
            else if (target.path === 'rotation') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 4;
                    frames[frameIdx].value = cc.quat(outputArray[i], outputArray[i + 1], outputArray[i + 2], outputArray[i + 3]);
                }
                curves.props.quat = frames;
            }
            else if (target.path === 'scale') {
                for (let frameIdx = 0; frameIdx < inputArray.length; frameIdx++) {
                    let i = frameIdx * 3;
                    frames[frameIdx].value = cc.v3(outputArray[i], outputArray[i + 1], outputArray[i + 2]);
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

cc.Model = module.exports = Model;
