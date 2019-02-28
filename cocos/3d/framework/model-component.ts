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
import { builtinResMgr } from '../../3d/builtin';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import Enum from '../../core/value-types/enum';
import { Model } from '../../renderer/scene/model';
import { Material } from '../assets/material';
import { Mesh } from '../assets/mesh';
import { RenderableComponent } from './renderable-component';

/**
 * !#en Shadow projection mode
 *
 * !#ch 阴影投射方式
 * @static
 * @enum ModelComponent.ShadowCastingMode
 */
const ModelShadowCastingMode = Enum({
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
export class ModelComponent extends RenderableComponent {

    /**
     * !#en The mesh of the model
     *
     * !#ch 模型网格
     * @type {Mesh}
     */
    @property({
        type: Mesh,
    })
    get mesh () {
        return this._mesh;
    }

    set mesh (val) {
        this._mesh = val;
        if (this._model) {
            this._model.destroy();
        }
        this._updateModels();
    }

    /**
     * !#en The shadow casting mode
     *
     * !#ch 投射阴影方式
     * @type {Number}
     */
    // @property({
    //     type: ModelShadowCastingMode,
    // })
    get shadowCastingMode () {
        return this._shadowCastingMode;
    }

    set shadowCastingMode (val) {
        this._shadowCastingMode = val;
        this._updateCastShadow();
    }

    /**
     * !#en Does this model receive shadows?
     *
     * !#ch 是否接受阴影?
     * @type {Boolean}
     */
    // @property
    get receiveShadows () {
        return this._receiveShadows;
    }

    set receiveShadows (val) {
        this._receiveShadows = val;
        this._updateReceiveShadow();
    }

    get model () {
        return this._model;
    }

    public static ShadowCastingMode = ModelShadowCastingMode;

    protected _model: Model | null = null;

    @property
    private _mesh: Mesh | null = null;

    @property
    private _shadowCastingMode = ModelShadowCastingMode.Off;

    @property
    private _receiveShadows = false;

    public onEnable () {
        this._updateModels();
        this._updateCastShadow();
        this._updateReceiveShadow();
        if (this._model) {
            this._model.enabled = true;
        }
    }

    public onDisable () {
        if (this._model) {
            this._model.enabled = false;
        }
    }

    public onDestroy () {
        if (this._model) {
            this._getRenderScene().destroyModel(this._model);
            this._model = null;
        }
    }

    protected _updateModels () {
        if (!this.enabledInHierarchy || !this._mesh) {
            return;
        }

        if (this._model && this._model.inited) {
            this._model.destroy();
        } else {
            this._createModel();
        }

        this._model!.createBoundingShape(this._mesh.minPosition, this._mesh.maxPosition);

        this._updateModelParams();

        if (this._model) {
            this._model.enabled = true;
        }
    }

    protected _createModel () {
        if (!this.node.scene) { return; }
        const scene = this._getRenderScene();
        this._model = scene.createModel(this._getModelConstructor(), this.node);
    }

    protected _getModelConstructor () {
        return Model;
    }

    protected _updateModelParams () {
        // @ts-ignore
        this.node._hasChanged = true;
        if (!this._mesh || !this._model) {
            return;
        }
        const meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        for (let i = 0; i < meshCount; ++i) {
            const material = this.getSharedMaterial(i);
            const renderingMesh = this._mesh.renderingMesh;
            if (renderingMesh) {
                const subMeshData = renderingMesh.getSubmesh(i);
                if (subMeshData) {
                    this._model.initSubModel(i, subMeshData, material || this._getBuiltinMaterial());
                }
            }
        }
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        if (this._model == null) {
            return;
        }
        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (this._model) {
            this._model.setSubModelMaterial(idx, material);
        }
    }

    protected _clearMaterials () {
        if (this._model == null) {
            return;
        }
        for (let i = 0; i < this._model.subModelNum; ++i) {
            this._onMaterialModified(i, null);
        }
    }

    private _updateCastShadow () {
        if (!this.enabledInHierarchy || !this._model) {
            return;
        }
        if (this._shadowCastingMode === ModelShadowCastingMode.Off) {
            for (let i = 0; i < this._model.subModelNum; ++i) {
                const subModel = this._model.getSubModel(i);
                subModel.castShadow = false;
            }
        } else if (this._shadowCastingMode === ModelShadowCastingMode.On) {
            for (let i = 0; i < this._model.subModelNum; ++i) {
                const subModel = this._model.getSubModel(i);
                subModel.castShadow = true;
            }
        } else {
            console.warn(`ShadowCastingMode ${this._shadowCastingMode} is not supported.`);
        }
    }

    private _updateReceiveShadow () {
        if (!this.enabledInHierarchy || !this._model) {
            return;
        }
        // for (let i = 0; i < this._model.subModelNum; ++i) {
        //     const subModel = this._model.getSubModel(i);
        //     if (subModel._defines['CC_USE_SHADOW_MAP'] != undefined) {
        //         this.getMaterial(i).define('CC_USE_SHADOW_MAP', this._receiveShadows);
        //     }
        // }
    }

    private _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>('default-material');
    }
}
