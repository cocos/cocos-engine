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
import { ccclass, property, executionOrder, menu,executeInEditMode } from '../../core/data/class-decorator';
import utils from '../misc/utils';
import Skeleton from '../assets/skeleton';
import SkeletonInstance from './skeleton-instance';

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
@ccclass('cc.SkinningModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/SkinningModelComponent')
export default class SkinningModelComponent extends ModelComponent {
    /**
     * @type {Skeleton}
     */
    @property
    _skeleton = null;

    constructor() {
        super();

        /**
         * @type {import("../../renderer/gfx/texture-2d").default}
         */
        this._jointsTexture = null;

        /**
         * @type {Float32Array}
         */
        this._jointMatricesData = null;

        /**
         * @type {SkeletonInstance}
         */
        this._skeletonInstance = null;
    }

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
            this._skeletonInstance = new SkeletonInstance(this._skeleton);
            this._reInitJointsData();
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
        this._updateModels();
        this._updateCastShadow();
        this._updateReceiveShadow();

        //SkinningModelComponent.system.add(this);
    }

    update(dt) {
        this._updateMatrices();
    }


    onDestroy() {
        SkinningModelComponent.system.remove(this);
    }

    _updateMatrices() {
        if (!this._mesh || !this._skeletonInstance) {
            return;
        }

        this._skeleton.jointIndices.forEach((jointIndex, index) => {
            const bindpose = this._skeleton.bindposes[index];
            let worldMatrix = this._skeletonInstance.getWorldMatrix(jointIndex);
            mat4.multiply(_m4_tmp, worldMatrix, bindpose);
            this._setJointMatrix(index, _m4_tmp);
        });

        this._commitJointsData();
    }

    _updateModels() {
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
        this._jointMatricesData = null;
        if (this._jointsTexture) {
            this._jointsTexture.destroy();
        }

        if (cc.game._renderContext.allowFloatTexture()) {
            this._jointsTexture = utils.createJointsTexture(this._skeleton);
            this._jointMatricesData = new Float32Array(this._jointsTexture._width * this._jointsTexture._height * 4);
        } else {
            this._jointMatricesData = new Float32Array(this._skeleton.jointIndices.length * 16);
        }
    }

    _commitJointsData() {
        if (this._jointsTexture != null) {
            this._jointsTexture.updateImage({
                image: this._jointMatricesData,
                width: this._jointsTexture._width,
                height: this._jointsTexture._height,
                level: 0,
                flipY: false,
                premultiplyAlpha: false
            });
        }
    }

    _updateModelJointParam(model) {
        if (this._jointsTexture != null) {
            model.setJointsTexture(this._jointsTexture);
        } else {
            model.setJointsMatrixArray(this._jointMatricesData);
        }
    }

    _setJointMatrix(iMatrix, matrix) {
        this._jointMatricesData[16 * iMatrix + 0] = matrix.m00;
        this._jointMatricesData[16 * iMatrix + 1] = matrix.m01;
        this._jointMatricesData[16 * iMatrix + 2] = matrix.m02;
        this._jointMatricesData[16 * iMatrix + 3] = matrix.m03;
        this._jointMatricesData[16 * iMatrix + 4] = matrix.m04;
        this._jointMatricesData[16 * iMatrix + 5] = matrix.m05;
        this._jointMatricesData[16 * iMatrix + 6] = matrix.m06;
        this._jointMatricesData[16 * iMatrix + 7] = matrix.m07;
        this._jointMatricesData[16 * iMatrix + 8] = matrix.m08;
        this._jointMatricesData[16 * iMatrix + 9] = matrix.m09;
        this._jointMatricesData[16 * iMatrix + 10] = matrix.m10;
        this._jointMatricesData[16 * iMatrix + 11] = matrix.m11;
        this._jointMatricesData[16 * iMatrix + 12] = matrix.m12;
        this._jointMatricesData[16 * iMatrix + 13] = matrix.m13;
        this._jointMatricesData[16 * iMatrix + 14] = matrix.m14;
        this._jointMatricesData[16 * iMatrix + 15] = matrix.m15;
    }
}