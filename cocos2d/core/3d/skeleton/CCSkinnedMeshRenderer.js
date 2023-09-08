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

import Mat4 from '../../value-types/mat4';
const Skeleton = require('./CCSkeleton');
const MeshRenderer = require('../../mesh/CCMeshRenderer');
const RenderFlow = require('../../renderer/render-flow');
const enums = require('../../../renderer/enums');

let _m4_tmp = cc.mat4();
let _m4_tmp2 = cc.mat4();

/**
 * !#en
 * Skinned Mesh Renderer
 * !#zh
 * 蒙皮渲染组件
 * @class SkinnedMeshRenderer
 * @extends MeshRenderer
 */
let SkinnedMeshRenderer = cc.Class({
    name: 'cc.SkinnedMeshRenderer',
    extends: MeshRenderer,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.mesh/Skinned Mesh Renderer',
        help: 'i18n:COMPONENT.help_url.skinned-mesh-renderer',
    },

    ctor () {
        this._jointsData = this._jointsFloat32Data = null;
        this._jointsTexture = null;
        this._joints = [];
        this._dummyNode = new cc.Node();
        this._jointsTextureOptions = null;
        this._usingRGBA8Texture = false;
    },

    properties: {
        _skeleton: Skeleton,
        _rootBone: cc.Node,

        /**
         * !#en
         * Skeleton Asset
         * !#zh
         * 骨骼资源
         * @property {Skeleton} skeleton
         */
        skeleton: {
            get () {
                return this._skeleton;
            },
            set (val) {
                this._skeleton = val;
                this._init();
            },
            type: Skeleton
        },

        /**
         * !#en
         * Root Bone
         * !#zh
         * 骨骼根节点
         * @property {Node} rootBone
         */
        rootBone: {
            get () {
                return this._rootBone;
            },
            set (val) {
                this._rootBone = val;
                this._init();
            },
            type: cc.Node
        },

        // SkinnedMeshRenderer cannot batch
        enableAutoBatch: {
            get () {
                return false;
            },
            visible: false,
            override: true
        }
    },

    __preload () {
        this._super();
        this._init();
    },

    _init () {
        this._model = this._skeleton && this._skeleton.model;
        this._calFunc = null;
        
        this._initJoints();
        this._initJointsTexture();
        this._initCalcFunc();
        this._updateRenderNode();
    },

    _calcWorldMatrixToRoot (joint) {
        let worldMatrixToRoot = joint._worldMatrixToRoot;
        if (!worldMatrixToRoot) {
            joint._worldMatrixToRoot = worldMatrixToRoot = cc.mat4();
            joint.getLocalMatrix(worldMatrixToRoot);
        }
        else {
            return;
        }

        let parent = joint.parent;
        if (parent !== this.rootBone) {
            if (!parent._worldMatrixToRoot) {
                this._calcWorldMatrixToRoot(parent);
            }
            Mat4.mul(worldMatrixToRoot, parent._worldMatrixToRoot, worldMatrixToRoot);
        }
    },

    _validateRender () {
        if (!this._jointsData) {
            this.disableRender();
            return;
        }
        this._super();
    },

    _initJoints () {
        let joints = this._joints;
        joints.length = 0;

        if (!this.skeleton || !this.rootBone) return;

        let useJointMatrix = this._useJointMatrix();

        let jointPaths = this.skeleton.jointPaths;
        let rootBone = this.rootBone;
        for (let i = 0; i < jointPaths.length; i++) {
            let joint = cc.find(jointPaths[i], rootBone);
            if (!joint) {
                cc.warn('Can not find joint in root bone [%s] with path [%s]', rootBone.name, jointPaths[i]);
            }

            if (useJointMatrix) {
                joint._renderFlag &= ~RenderFlow.FLAG_CHILDREN;
                this._calcWorldMatrixToRoot(joint);
            }
            
            joints.push(joint);
        }

        if (useJointMatrix) {
            const uniqueBindPoses = this.skeleton.uniqueBindPoses;
            for (let i = 0; i < jointPaths.length; i++) {
                let joint = joints[i];
                if (uniqueBindPoses[i]) {
                    Mat4.mul(_m4_tmp, joint._worldMatrixToRoot, uniqueBindPoses[i]);
                    joint._jointMatrix = Mat4.toArray([], _m4_tmp);
                }
                else {
                    joint._jointMatrix = joint._worldMatrixToRoot;
                }
                
            }
        }
    },

    _initJointsTexture () {
        if (!this._skeleton) return;

        let jointCount = this._joints.length;

        let inited = false;
        if (jointCount <= cc.sys.getMaxJointMatrixSize()) {
            inited = true;

            this._jointsData = this._jointsFloat32Data = new Float32Array(jointCount * 16);
        }

        if (!inited) {
            let SUPPORT_FLOAT_TEXTURE = !!cc.sys.glExtension('OES_texture_float');
            let size;
            if (jointCount > 256) {
                size = 64;
            } else if (jointCount > 64) {
                size = 32;
            } else if (jointCount > 16) {
                size = 16;
            } else {
                size = 8;
            }

            this._jointsData = this._jointsFloat32Data = new Float32Array(size * size * 4);

            let pixelFormat = cc.Texture2D.PixelFormat.RGBA32F, 
                width = size, 
                height = size;
            
            if (!SUPPORT_FLOAT_TEXTURE) {
                this._jointsData = new Uint8Array(this._jointsFloat32Data.buffer);
                pixelFormat = cc.Texture2D.PixelFormat.RGBA8888;
                width *= 4;

                this._usingRGBA8Texture = true;

                cc.warn(`SkinnedMeshRenderer [${this.node.name}] has too many joints [${jointCount}] and device do not support float32 texture, fallback to use RGBA8888 texture, which is much slower.`);
            }

            let texture = this._jointsTexture || new cc.Texture2D();
            let NEAREST = cc.Texture2D.Filter.NEAREST;
            texture.setFilters(NEAREST, NEAREST);
            texture.initWithData(this._jointsData, pixelFormat, width, height);
            this._jointsTexture = texture;
            this._jointsTextureOptions = {
                format: pixelFormat, 
                width: texture.width, 
                height: texture.height, 
                images:[]
            };
        }

        this._updateMaterial();
    },

    _updateMaterial () {
        MeshRenderer.prototype._updateMaterial.call(this);

        let materials = this.getMaterials();
        for (let i = 0; i < materials.length; i++) {
            let material = materials[i];
            if (this._jointsTexture) {
                material.setProperty('jointsTexture', this._jointsTexture);
                material.setProperty('jointsTextureSize', new Float32Array([this._jointsTexture.width, this._jointsTexture.height]));
                
                material.define('CC_JOINTS_TEXTURE_FLOAT32', !!cc.sys.glExtension('OES_texture_float'));
                material.define('CC_USE_JOINTS_TEXTRUE', true);
            }
            else {
                if (this._jointsFloat32Data) {
                    material.setProperty('jointMatrices', this._jointsFloat32Data, undefined, true);
                }
                material.define('CC_USE_JOINTS_TEXTRUE', false);
            }
            material.define('CC_USE_SKINNING', true);
        }
    },

    _setJointsDataWithArray (iMatrix, matrixArray) {
        let data = this._jointsFloat32Data;
        data.set(matrixArray, iMatrix * 16);
    },

    _setJointsDataWithMatrix (iMatrix, matrix) {
        this._jointsFloat32Data.set(matrix.m, 16 * iMatrix);
    },

    _commitJointsData () {
        if (this._jointsTexture) {
            this._jointsTextureOptions.images[0] = this._jointsData;
            this._jointsTexture.update(this._jointsTextureOptions);
        }
    },

    _useJointMatrix () {
        return this._model && this._model.precomputeJointMatrix;
    },

    _updateRenderNode () {
        if (this._useJointMatrix() || this._usingRGBA8Texture) {
            this._assembler.setRenderNode(this.rootBone)
        } else {
            this._assembler.setRenderNode(this._dummyNode);
        }
    },

    _initCalcFunc () {
        if (this._useJointMatrix()) {
            this._calFunc = this._calJointMatrix;
        } 
        else if (this._usingRGBA8Texture) {
            this._calFunc = this._calRGBA8WorldMatrix;
        }
        else {
            this._calFunc = this._calWorldMatrix;
        }
    },

    _calJointMatrix () {
        const joints = this._joints;
        const bindposes = this.skeleton.bindposes;
        const uniqueBindPoses = this.skeleton.uniqueBindPoses;
        for (let i = 0; i < joints.length; ++i) {
            let joint = joints[i];
            let jointMatrix = joint._jointMatrix;

            if (uniqueBindPoses[i]) {
                this._setJointsDataWithArray(i, jointMatrix);
            }
            else {
                Mat4.multiply(_m4_tmp, jointMatrix, bindposes[i]);
                this._setJointsDataWithMatrix(i, _m4_tmp);
            }
        }
    },

    // Some device rgba8 texture precision is low, when encode a big number it may loss precision.
    // Invert root bone matrix can effectively avoid big position encode into rgba8 texture.
    _calRGBA8WorldMatrix () {
        const joints = this._joints;
        const bindposes = this.skeleton.bindposes;

        this.rootBone._updateWorldMatrix();
        let rootMatrix = this.rootBone._worldMatrix;
        let invRootMat = Mat4.invert(_m4_tmp2, rootMatrix);

        for (let i = 0; i < joints.length; ++i) {
            let joint = joints[i];
            joint._updateWorldMatrix();

            Mat4.multiply(_m4_tmp, invRootMat, joint._worldMatrix);
            Mat4.multiply(_m4_tmp, _m4_tmp, bindposes[i]);
            this._setJointsDataWithMatrix(i, _m4_tmp);
        }
    },

    _calWorldMatrix () {
        const joints = this._joints;
        const bindposes = this.skeleton.bindposes;
        for (let i = 0; i < joints.length; ++i) {
            let joint = joints[i];

            joint._updateWorldMatrix();
            Mat4.multiply(_m4_tmp, joint._worldMatrix, bindposes[i]);
            this._setJointsDataWithMatrix(i, _m4_tmp);
        }
    },

    calcJointMatrix () {
        if (!this.skeleton || !this.rootBone) return;

        this._calFunc.call(this);
        this._commitJointsData();
    }
});

cc.SkinnedMeshRenderer = module.exports = SkinnedMeshRenderer;
