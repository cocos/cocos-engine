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
import Model from '../../renderer/scene/model';
import { ccclass, property, menu, executionOrder, executeInEditMode } from '../../core/data/class-decorator';
import Mesh from '../assets/mesh';
import Enum from '../../core/value-types/enum';
import RenderableComponent from './renderable-component';
/**
 * @typedef {import('../assets/material').default} Material
 */

/**
 * !#en Shadow projection mode
 *
 * !#ch 阴影投射方式
 * @static
 * @enum ModelComponent.ShadowCastingMode
 */
let ModelShadowCastingMode = Enum({
    /**
     * !#en
     *
     * !#ch 关闭阴影投射
     * @property Off
     * @readonly
     * @type {Number}
     */
    Off: 0,
    /**
     * !#en
     *
     * !#ch 开启阴影投射，当阴影光产生的时候
     * @property On
     * @readonly
     * @type {Number}
     */
    On: 1,
    /**
     * !#en
     *
     * !#ch 可以从网格的任意一遍投射出阴影
     * @property TwoSided
     * @readonly
     * @type {Number}
     */
    TwoSided: 2,
    /**
     * !#en
     *
     * !#ch 只显示阴影
     * @property ShadowsOnly
     * @readonly
     * @type {Number}
     */
    ShadowsOnly: 3,
});

/**
 * !#en The Model Component
 *
 * !#ch 模型组件
 * @class ModelComponent
 * @extends RenderableComponent
 */
@ccclass('cc.ModelComponent')
@executionOrder(100)
@menu('Components/ModelComponent')
@executeInEditMode
export default class ModelComponent extends RenderableComponent {

    /**
     * @type {Mesh}
     */
    @property
    _mesh = null;

    @property
    _shadowCastingMode = ModelShadowCastingMode.Off;

    @property
    _receiveShadows = false;

    /**
     * @type {Material}
     */
    static _builtinMaterial = null;

    /**
     * !#en The mesh of the model
     *
     * !#ch 模型网格
     * @type {Mesh}
     */
    @property({
        type: Mesh
    })
    get mesh() {
        return this._mesh;
    }

    set mesh(val) {
        this._mesh = val;
        this._updateModels();
    }

    /**
     * !#en The shadow casting mode
     *
     * !#ch 投射阴影方式
     * @type {Number}
     */
    @property({
        type: ModelShadowCastingMode
    })
    get shadowCastingMode() {
        return this._shadowCastingMode;
    }

    set shadowCastingMode(val) {
        this._shadowCastingMode = val;
        this._updateCastShadow();
    }

    /**
     * !#en Does this model receive shadows?
     *
     * !#ch 是否接受阴影?
     * @type {Boolean}
     */
    @property
    get receiveShadows() {
        return this._receiveShadows;
    }

    set receiveShadows(val) {
        this._receiveShadows = val;
        this._updateReceiveShadow();
    }

    static ShadowCastingMode = ModelShadowCastingMode;

    constructor() {
        super();
        /**
         * @type {Model[]}
         */
        this._models = [];
    }

    onLoad() {
        this._updateModels();
        this._updateCastShadow();
        this._updateReceiveShadow();
    }

    onEnable() {
        for (let i = 0; i < this._models.length; ++i) {
            this.scene.addModel(this._models[i]);
        }
    }

    onDisable() {
        for (let i = 0; i < this._models.length; ++i) {
            this.scene.removeModel(this._models[i]);
        }
    }

    _updateModels() {
        let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        let oldModels = this._models;

        this._models = new Array(meshCount);
        for (let i = 0; i < meshCount; ++i) {
            let model = this._createModel();
            model.createBoundingShape(this._mesh.minPosition, this._mesh.maxPosition);
            this._models[i] = model;
        }

        this._updateModelParams();

        if (this.enabled) {
            for (let i = 0; i < oldModels.length; ++i) {
                this.scene.removeModel(oldModels[i]);
            }
            for (let i = 0; i < this._models.length; ++i) {
                this.scene.addModel(this._models[i]);
            }
        }
    }

    _createModel() {
        return new Model();
    }

    _updateModelParams() {
        for (let i = 0; i < this._models.length; ++i) {
            let model = this._models[i];
            let material = this.getSharedMaterial(i);
            let inputAssembler = this._mesh.getSubMesh(i);

            model.setInputAssembler(inputAssembler);
            model.setNode(this.node);
            this._updateModelMaterial(model, material);
        }
    }

    _onMaterialModified(idx, material) {
        if (idx < this._models.length) {
            this._updateModelMaterial(this._models[idx], material);
        }
    }

    _clearMaterials() {
        for (let i = 0; i < this._models.length; ++i) {
            this._onMaterialModified(i, null);
        }
    }

    /**
     *
     * @param {Model} model
     * @param {Material} material
     */
    _updateModelMaterial(model, material) {
        model.setEffect((material ? material.effect : null) || this._getBuiltinMaterial().effect);
    }

    _updateCastShadow() {
        if (this._shadowCastingMode === ModelShadowCastingMode.Off) {
            for (let i = 0; i < this._models.length; ++i) {
                let model = this._models[i];
                model._castShadow = false;
            }
        } else if (this._shadowCastingMode === ModelShadowCastingMode.On) {
            for (let i = 0; i < this._models.length; ++i) {
                let model = this._models[i];
                model._castShadow = true;
            }
        } else {
            console.warn(`ShadowCastingMode ${this._shadowCastingMode} is not supported.`);
        }
    }

    _updateReceiveShadow() {
        for (let i = 0; i < this._models.length; ++i) {
            let model = this._models[i];
            if (model._defines['USE_SHADOW_MAP'] != undefined) {
                model._effect.define('USE_SHADOW_MAP', this._receiveShadows);
            }
        }
    }

    _getBuiltinMaterial() {
        // classic ugly pink indicating missing material
        if (ModelComponent._builtinMaterial === null) {
            const builtinMaterial = new cc.Material();
            builtinMaterial.effectName = 'builtin-effect-unlit';
            builtinMaterial.define("USE_COLOR", true);
            builtinMaterial.setProperty("color", new cc.Color(255, 0, 255, 255));
            ModelComponent._builtinMaterial = builtinMaterial;
        }
        return ModelComponent._builtinMaterial;
    }
}
