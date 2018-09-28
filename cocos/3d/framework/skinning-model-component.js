/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import { mat4 } from '../../core/vmath';
import ModelComponent from './model-component';
import renderer from '../../renderer/index';
import { ccclass, property, executionOrder, menu } from '../../core/data/class-decorator';
import utils from '../misc/utils';
import Skeleton from '../assets/skeleton';

/**
 * @typedef {import("../framework/skeleton-instance").default} SkeletonInstance
 */
let _m4_tmp = mat4.create();

/**
 * !#en The Skinning Model Component
 *
 * !#ch 皮肤模型组件
 * @class SkinningModelComponent
 * @extends ModelComponent
 */
@executionOrder(100)
@ccclass('cc.SkinningModelComponent')
@menu('Components/SkinningModelComponent')
export default class SkinningModelComponent extends ModelComponent {
    @property
    _skeleton = null;

    /**
     * !#en The bone nodes
     *
     * !#ch 骨骼节点
     * @type {Skeleton}
     */
    @property({
        type: Skeleton
    })
    get skeleton() {
        return this._skeleton;
    }

    set skeleton(val) {
        this._skeleton = val;

        if (this._skeleton) {
            this._skeletonInstance = this._skeleton.instantiate();
        } else {
            this._skeletonInstance = null;
        }
    }

    /**
     * !#en The bone nodes
     *
     * !#ch 实例化骨骼节点
     * @type {SkeletonInstance}
     */
    get skeletonInstance() {
        return this._skeletonInstance;
    }

    onLoad() {
        this._models = [];
        // internal skinning data
        this._jointsTexture = null;
        this._jointsMatricesArray = null;
        this._skeleton = null;

        this._updateModels();
        this._updateCastShadow();
        this._updateReceiveShadow();

        SkinningModelComponent.system.add(this);
    }

    update(dt) {
        this._updateMatrices();
    }


    onDestroy() {
        SkinningModelComponent.system.remove(this);
    }

    _updateMatrices() {
        if (!this._mesh || !this._mesh.skinning || !this._skeleton) {
            return;
        }

        const jointIndices = this._mesh.skinning.jointIndices;
        const bindposes = this._mesh.skinning.bindposes;

        for (let i = 0; i < jointIndices.length; ++i) {
            let bindpose = bindposes[i];
            let idx = jointIndices[i];

            let worldMatrix = this._skeleton.getWorldMatrix(idx);
            mat4.multiply(_m4_tmp, worldMatrix, bindpose);

            this._setJointMatrix(i, _m4_tmp);
        }

        this._commitJointsData();
    }

    _updateModels() {
        if (this._mesh.skinning) {
            this._reInitJointsData();
        }

        let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        let oldModels = this._models;

        this._models = new Array(meshCount);
        for (let i = 0; i < meshCount; ++i) {
            let model = new renderer.SkinningModel();
            model.createBoundingShape(this._mesh._minPos, this._mesh._maxPos);
            this._models[i] = model;
        }

        this._updateModelParams();

        if (this.enabled) {
            this.node.emit('skinning-model-changed', this, 'mesh', oldModels);
        }
    }

    _updateModelParams() {
        super._updateModelParams();
        for (let i = 0; i < this._models.length; ++i)
            this._updateModelJointParam(this._models[i]);
    }

    _reInitJointsData() {
        if (this._jointsTexture) {
            this._jointsTexture.unload();
            this._jointsTexture = null;
        } else {
            this._jointsMatricesArray = null;
        }

        if (cc.game._renderContext.allowFloatTexture()) {
            this._jointsTexture = utils.createJointsTexture(this._mesh.skinning);
        } else {
            this._jointsMatricesArray = new Float32Array(this._mesh.skinning.jointIndices.length * 16);
        }
    }

    _commitJointsData() {
        const texture = this._jointsTexture;
        if (texture != null) {
            texture.commit();
        }
    }

    _updateModelJointParam(model) {
        const texture = this._jointsTexture;
        if (texture != null) {
            model.setJointsTexture(texture._texture);
        } else {
            model.setJointsMatrixArray(this._jointsMatricesArray);
        }
    }

    _setJointMatrix(iMatrix, matrix) {
        let arr = null;
        const texture = this._jointsTexture;
        if (texture != null) {
            arr = texture.data;
        } else {
            arr = this._jointsMatricesArray;
        }
        arr[16 * iMatrix + 0] = matrix.m00;
        arr[16 * iMatrix + 1] = matrix.m01;
        arr[16 * iMatrix + 2] = matrix.m02;
        arr[16 * iMatrix + 3] = matrix.m03;
        arr[16 * iMatrix + 4] = matrix.m04;
        arr[16 * iMatrix + 5] = matrix.m05;
        arr[16 * iMatrix + 6] = matrix.m06;
        arr[16 * iMatrix + 7] = matrix.m07;
        arr[16 * iMatrix + 8] = matrix.m08;
        arr[16 * iMatrix + 9] = matrix.m09;
        arr[16 * iMatrix + 10] = matrix.m10;
        arr[16 * iMatrix + 11] = matrix.m11;
        arr[16 * iMatrix + 12] = matrix.m12;
        arr[16 * iMatrix + 13] = matrix.m13;
        arr[16 * iMatrix + 14] = matrix.m14;
        arr[16 * iMatrix + 15] = matrix.m15;
    }
}
