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

import { Texture2D } from '../../assets';
import { Material } from '../../assets/material';
import { Mesh } from '../../assets/mesh';
import { ccclass, help, executeInEditMode, executionOrder, menu, property } from '../../data/class-decorator';
import { Vec4 } from '../../math';
import { Model } from '../../renderer/scene/model';
import { MorphModel } from '../../renderer/models/morph-model';
import { Root } from '../../root';
import { TransformBit } from '../../scene-graph/node-enum';
import { Enum } from '../../value-types';
import { builtinResMgr } from '../builtin';
import { RenderableComponent } from './renderable-component';
import { MorphRenderingInstance } from '../../assets/morph';
import { legacyCC } from '../../global-exports';
import { assertIsTrue } from '../../data/utils/asserts';

/**
 * @en Shadow projection mode.
 * @zh 阴影投射方式。
 */
const ModelShadowCastingMode = Enum({
    /**
     * @zh Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF: 0,
    /**
     * @zh Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: 1,
});

/**
 * @en model light map settings.
 * @zh 模型光照图设置
 */
@ccclass('cc.ModelLightmapSettings')
class ModelLightmapSettings {
    @property({
        visible: false,
    })
    public texture: Texture2D|null = null;
    @property({
        visible: false,
    })
    public uvParam: Vec4 = new Vec4();
    @property
    protected _bakeable: boolean = false;
    @property
    protected _castShadow: boolean = false;
    @property({
        formerlySerializedAs: '_recieveShadow',
    })
    protected _receiveShadow: boolean = false;
    @property
    protected _lightmapSize: number = 64;

    /**
     * @en bakeable.
     * @zh 是否可烘培。
     */
    @property
    get bakeable () {
        return this._bakeable;
    }

    set bakeable (val) {
        this._bakeable = val;
    }

    /**
     * @en cast shadow.
     * @zh 是否投射阴影。
     */
    @property
    get castShadow () {
        return this._castShadow;
    }

    set castShadow (val) {
        this._castShadow = val;
    }

    /**
     * @en receive shadow.
     * @zh 是否接受阴影。
     */
    @property
    get receiveShadow () {
        return this._receiveShadow;
    }

    set receiveShadow (val) {
        this._receiveShadow = val;
    }

    /**
     * @en lightmap size.
     * @zh 光照图大小
     */
    @property
    get lightmapSize () {
        return this._lightmapSize;
    }

    set lightmapSize (val) {
        this._lightmapSize = val;
    }
}

/**
 * 模型组件。
 * @class ModelComponent
 */
@ccclass('cc.ModelComponent')
@help('i18n:cc.ModelComponent')
@executionOrder(100)
@menu('Components/Model')
@executeInEditMode
export class ModelComponent extends RenderableComponent {

    public static ShadowCastingMode = ModelShadowCastingMode;

    @property
    public lightmapSettings = new ModelLightmapSettings();

    @property
    protected _mesh: Mesh | null = null;

    @property
    protected _shadowCastingMode = ModelShadowCastingMode.OFF;

    /**
     * @en Shadow projection mode.
     * @zh 阴影投射方式。
     */
    @property({
        type: ModelShadowCastingMode,
        tooltip: 'i18n:model.shadow_casting_model',
    })
    get shadowCastingMode () {
        return this._shadowCastingMode;
    }

    set shadowCastingMode (val) {
        this._shadowCastingMode = val;
        this._updateCastShadow();
    }

    /**
     * @en The mesh of the model.
     * @zh 模型的网格数据。
     */
    @property({
        type: Mesh,
        tooltip: 'i18n:model.mesh',
    })
    get mesh () {
        return this._mesh;
    }

    set mesh (val) {
        const old = this._mesh;
        this._mesh = val;
        this._mesh?.initialize();
        this._watchMorphInMesh();
        this._onMeshChanged(old);
        this._updateModels();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
    }

    get model () {
        return this._model;
    }

    @property({
        visible (this: ModelComponent) {
            return !!(
                this.mesh &&
                this.mesh.struct.morph &&
                this.mesh.struct.morph.subMeshMorphs.some((subMeshMorph) => !!subMeshMorph)
            );
        },
    })
    get enableMorph () {
        return this._enableMorph;
    }

    set enableMorph (value) {
        this._enableMorph = value;
    }

    protected _modelType: typeof Model;

    protected _model: Model | null = null;

    private _morphInstance: MorphRenderingInstance | null = null;

    @property
    private _enableMorph = true;

    constructor () {
        super();
        this._modelType = Model;
    }

    public onLoad () {
        this._mesh?.initialize();
        this._watchMorphInMesh();
        this._updateModels();
        this._updateCastShadow();
    }

    public onRestore () {
        this._updateModels();
    }

    public onEnable () {
        if (!this._model) {
            this._updateModels();
        }
        this._attachToScene();
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
        if (this._morphInstance) {
            this._morphInstance.destroy();
        }
    }

    public setWeights (weights: number[], subMeshIndex: number) {
        if (this._morphInstance) {
            this._morphInstance.setWeights(subMeshIndex, weights);
        }
    }

    public setInstancedAttribute (name: string, value: ArrayLike<number>) {
        if (!this.model) { return; }
        const list = this.model.instancedAttributes.list;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) {
                (list[i].view as TypedArray).set(value);
                break;
            }
        }
    }

    public _updateLightmap (lightmap: Texture2D|null, uOff: number, vOff: number, uScale: number, vScale: number) {
        this.lightmapSettings.texture = lightmap;
        this.lightmapSettings.uvParam.x = uOff;
        this.lightmapSettings.uvParam.y = vOff;
        this.lightmapSettings.uvParam.z = uScale;
        this.lightmapSettings.uvParam.w = vScale;

        if (this.model !== null) {
            this.model.updateLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
        }
    }

    protected _updateModels () {
        if (!this.enabledInHierarchy || !this._mesh) {
            return;
        }

        if (this._model) {
            this._model.destroy();
            this._model.initialize(this.node);
        } else {
            this._createModel();
        }

        this._updateModelParams();

        if (this.model != null) {
            this.model.updateLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
        }
    }

    protected _createModel () {
        const preferMorphOverPlain = !!this._morphInstance;
        // Note we only change to use `MorphModel` if
        // we are required to render morph and the `this._modelType` is exactly the basic `Model`.
        // We do this since the `this._modelType` might be changed in classes derived from `ModelComponent`.
        // We shall not overwrite it.
        // Please notice that we do not enforce that
        // derived classes should use a morph-able model type(i.e. model type derived from `MorphModel`).
        // So we should take care of the edge case.
        const modelType = (preferMorphOverPlain && this._modelType === Model) ? MorphModel : this._modelType;
        this._model = (legacyCC.director.root as Root).createModel(modelType);
        this._model.visFlags = this.visibility;
        this._model.initialize(this.node);
        this._models.length = 0;
        this._models.push(this._model);
        if (this._morphInstance && this._model instanceof MorphModel) {
            this._model.setMorphRendering(this._morphInstance);
        }
    }

    protected _attachToScene () {
        if (!this.node.scene || !this._model) {
            return;
        }
        const scene = this._getRenderScene();
        if (this._model.scene != null) {
            this._detachFromScene();
        }
        scene.addModel(this._model);
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    protected _updateModelParams () {
        if (!this._mesh || !this._model) { return; }
        this.node.hasChangedFlags = this._model.transform.hasChangedFlags = TransformBit.POSITION;
        this._model.isDynamicBatching = this._isBatchingEnabled();
        const meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        const renderingMesh = this._mesh.renderingSubMeshes;
        if (renderingMesh) {
            for (let i = 0; i < meshCount; ++i) {
                const material = this.getRenderMaterial(i);
                const subMeshData = renderingMesh[i];
                if (subMeshData) {
                    this._model.initSubModel(i, subMeshData, material || this._getBuiltinMaterial());
                }
            }
        }
        this._model.createBoundingShape(this._mesh.minPosition, this._mesh.maxPosition);
        this._model.enabled = true;
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        if (!this._model || !this._model.inited) { return; }
        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (!this._model || !this._model.inited) { return; }
        this._model.isDynamicBatching = this._isBatchingEnabled();
        this._model.setSubModelMaterial(idx, material);
        this._model.updateLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
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

    protected _onVisibilityChange (val: number) {
        if (!this._model) { return; }
        this._model.visFlags = val;
    }

    protected _updateCastShadow () {
        if (!this._model) { return; }
        if (this._shadowCastingMode === ModelShadowCastingMode.OFF) {
            this._model.castShadow = false;
        } else {
            assertIsTrue(
                this._shadowCastingMode === ModelShadowCastingMode.ON,
                `ShadowCastingMode ${this._shadowCastingMode} is not supported.`,
            );
            this._model.castShadow = true;
        }
    }

    protected _isBatchingEnabled () {
        for (let i = 0; i < this._materials.length; ++i) {
            const mat = this._materials[i];
            if (!mat) { continue; }
            for (let p = 0; p < mat.passes.length; ++p) {
                const pass = mat.passes[p];
                if (pass.instancedBuffer || pass.batchedBuffer) { return true; }
            }
        }
        return false;
    }

    private _watchMorphInMesh () {
        if (this._morphInstance) {
            this._morphInstance.destroy();
            this._morphInstance = null;
        }

        if (!this._enableMorph) {
            return;
        }

        if (!this._mesh ||
            !this._mesh.struct.morph ||
            !this._mesh.morphRendering) {
            return;
        }

        const { morph } = this._mesh.struct;
        this._morphInstance = this._mesh.morphRendering.createInstance();
        const nSubMeshes = this._mesh.struct.primitives.length;
        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            const subMeshMorph = morph.subMeshMorphs[iSubMesh];
            if (!subMeshMorph) {
                continue;
            }
            const initialWeights = subMeshMorph.weights || morph.weights;
            const weights = initialWeights ?
                initialWeights.slice() :
                new Array<number>(subMeshMorph.targets.length).fill(0);
            this._morphInstance.setWeights(iSubMesh, weights);
        }

        if (this._model && this._model instanceof MorphModel) {
            this._model.setMorphRendering(this._morphInstance);
        }
    }

    private _syncMorphWeights (subMeshIndex: number) {
        if (!this._morphInstance) {
            return;
        }
        const subMeshMorphInstance = this._morphInstance[subMeshIndex];
        if (!subMeshMorphInstance || !subMeshMorphInstance.renderResources) {
            return;
        }
        subMeshMorphInstance.renderResources.setWeights(subMeshMorphInstance.weights);
    }
}

export namespace ModelComponent {
    export type ShadowCastingMode = EnumAlias<typeof ModelShadowCastingMode>;
}
