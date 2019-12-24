/*
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
*/

/**
 * @category model
 */

import { Material, Mesh } from '../../assets';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../data/class-decorator';
import { Model } from '../../renderer/scene/model';
import { Root } from '../../root';
import { TransformBit } from '../../scene-graph/node-enum';
import { Enum } from '../../value-types';
import { builtinResMgr } from '../builtin';
import { RenderableComponent } from './renderable-component';

/**
 * Shadow projection mode<br/>
 * 阴影投射方式。
 */
const ModelShadowCastingMode = Enum({
    /**
     * 不投射阴影。
     */
    OFF: 0,
    /**
     * 开启阴影投射。
     */
    ON: 1,
});

/**
 * 模型组件。
 * @class ModelComponent
 */
@ccclass('cc.ModelComponent')
@executionOrder(100)
@menu('Components/Model')
@executeInEditMode
export class ModelComponent extends RenderableComponent {

    public static ShadowCastingMode = ModelShadowCastingMode;

    @property
    protected _mesh: Mesh | null = null;

    @property
    protected _shadowCastingMode = ModelShadowCastingMode.OFF;

    /**
     * @en The shadow casting mode
     * @zh 投射阴影方式。
     */
    @property({
        type: ModelShadowCastingMode,
        tooltip: '投射阴影方式',
    })
    get shadowCastingMode () {
        return this._shadowCastingMode;
    }

    set shadowCastingMode (val) {
        this._shadowCastingMode = val;
        this._updateCastShadow();
    }

    /**
     * @en The mesh of the model
     * @zh 模型网格。
     */
    @property({
        type: Mesh,
        tooltip: '模型网格',
    })
    get mesh () {
        return this._mesh;
    }

    set mesh (val) {
        const old = this._mesh;
        this._mesh = val;
        this._onMeshChanged(old);
        this._updateModels();
        if (this.node.activeInHierarchy) {
            this._attachToScene();
        }
    }

    get model () {
        return this._model;
    }

    protected _modelType: typeof Model;
    protected _model: Model | null = null;

    constructor () {
        super();
        this._modelType = Model;
    }

    public onLoad () {
        this._updateModels();
        this._updateCastShadow();
    }

    public onEnable () {
        if (!this._model) {
            this._updateModels();
        }
        if (this._model) {
            this._attachToScene();
        }
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
    }

    public onDestroy () {
        if (this._model) {
            cc.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
    }

    protected _updateModels () {
        if (!this.enabledInHierarchy || !this._mesh) {
            return;
        }

        if (this._model) {
            this._model.destroy();
        } else {
            this._createModel();
        }

        this._updateModelParams();

        if (this._model) {
            this._model.createBoundingShape(this._mesh.minPosition, this._mesh.maxPosition);
            this._model.enabled = true;
        }
    }

    protected _createModel () {
        this._model = (cc.director.root as Root).createModel(this._modelType);
        this._model.visFlags = this.visibility;
        this._model.initialize(this.node);
        this._models.length = 0;
        this._models.push(this._model);
    }

    protected _attachToScene () {
        if (!this.node.scene && !this._model) {
            return;
        }
        const scene = this._getRenderScene();
        if (this._model!.scene != null) {
            this._detachFromScene();
        }
        scene.addModel(this._model!);
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    protected _updateModelParams () {
        if (!this._mesh || !this._model) { return; }
        this.node.hasChangedFlags = this._model.transform.hasChangedFlags = TransformBit.POSITION;
        const batching = this._model.isDynamicBatching = this._isBatchingEnabled();
        if (batching) { this._mesh.createFlatBuffers(); }
        const meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        for (let i = 0; i < meshCount; ++i) {
            const material = this.getRenderMaterial(i);
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
        if (!this._model || !this._model.inited) { return; }
        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (!this._model || !this._model.inited) { return; }
        const batching = this._model.isDynamicBatching = this._isBatchingEnabled();
        if (batching && this._mesh) { this._mesh.createFlatBuffers(); }
        this._model.setSubModelMaterial(idx, material);
    }

    protected _onMeshChanged (old: Mesh | null) {
    }

    protected _clearMaterials () {
        if (!this._model) { return; }
        for (let i = 0; i < this._model.subModelNum; ++i) {
            this._onMaterialModified(i, null);
        }
    }

    protected _getBuiltinMaterial () {
        // classic ugly pink indicating missing material
        return builtinResMgr.get<Material>('missing-material');
    }

    protected _onVisiblityChange (val: number) {
        if (!this._model) { return; }
        this._model.visFlags = val;
    }

    private _updateCastShadow () {
        if (!this._model) { return; }
        if (this._shadowCastingMode === ModelShadowCastingMode.OFF) {
            this._model.castShadow = false;
        } else if (this._shadowCastingMode === ModelShadowCastingMode.ON) {
            this._model.castShadow = true;
        } else {
            console.warn(`ShadowCastingMode ${this._shadowCastingMode} is not supported.`);
        }
    }

    private _isBatchingEnabled () {
        if (!this._model || !this._mesh) { return false; }
        for (let i = 0; i < this._materials.length; ++i) {
            const mat = this._materials[i];
            if (!mat) { continue; }
            for (let p = 0; p < mat.passes.length; ++p) {
                const pass = mat.passes[p];
                if (pass.batchedBuffer) { return true; }
            }
        }
        return false;
    }
}
