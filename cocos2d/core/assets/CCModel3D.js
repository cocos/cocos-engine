/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

var Model3D = cc.Class({
    name: 'cc.Model3D',
    extends: cc.Asset,

    ctor () {
        this._bin = null;
    },

    properties: {
        _nativeAsset: {
            get () {
                return this._bin;
            },
            set (bin) {
                this._bin = bin.buffer;
            },
            override: true
        },

        _gltf: {
            default: {}
        }
    },

    _createVB (bin, gltf, accessors, attributes) {
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

        return vb;
    },

    initMesh (meshAsset) {
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

            let ibAcc = accessors[primitive.indices];
            let ibView = gltf.bufferViews[ibAcc.bufferView];
            let ibData = new Uint8Array(bin, ibView.byteOffset, ibView.byteLength);

            let vb = this._createVB(bin, gltf, accessors, primitive.attributes);
            let ib = new gfx.IndexBuffer(
                renderer.device,
                ibAcc.componentType,
                gfx.USAGE_STATIC,
                ibData,
                ibAcc.count
            );

            meshAsset._subMeshes[i] = new renderEngine.InputAssembler(vb, ib);
        }
    }
});

cc.Model3D = module.exports = Model3D;
