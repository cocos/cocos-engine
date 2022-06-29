/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, visible, type,
    formerlySerializedAs, serializable, editable, disallowAnimation } from 'cc.decorator';
import { JSB } from 'internal:constants';
import { Texture2D } from '../../core/assets';
import { Material } from '../../core/assets/material';
import { Mesh } from '../assets/mesh';
import { Vec4 } from '../../core/math';
import { scene } from '../../core/renderer';
import { MorphModel } from '../models/morph-model';
import { Root } from '../../core/root';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Enum } from '../../core/value-types';
import { builtinResMgr } from '../../core/builtin';
import { ModelRenderer } from '../../core/components/model-renderer';
import { MorphRenderingInstance } from '../assets/morph-rendering';
import { legacyCC } from '../../core/global-exports';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { CCFloat } from '../../core/data/utils/attribute';
import { property } from '../../core/data/class-decorator';

/**
 * @en Shadow projection mode.
 * @zh 阴影投射方式。
 */
const ModelShadowCastingMode = Enum({
    /**
     * @en Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF: 0,
    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: 1,
});

/**
 * @en Shadow receive mode.
 * @zh 阴影接收方式。
 */
const ModelShadowReceivingMode = Enum({
    /**
     * @en Disable shadow receiving.
     * @zh 不接收阴影。
     */
    OFF: 0,
    /**
     * @en Enable shadow receiving.
     * @zh 开启阴影投射。
     */
    ON: 1,
});

/**
 * @en Model's light map settings.
 * @zh 模型光照图设置
 */
@ccclass('cc.ModelLightmapSettings')
class ModelLightmapSettings {
    @serializable
    public texture: Texture2D|null = null;
    @serializable
    public uvParam: Vec4 = new Vec4();
    @serializable
    protected _bakeable = false;
    @serializable
    protected _castShadow = false;
    @formerlySerializedAs('_recieveShadow')
    protected _receiveShadow = false;
    @serializable
    protected _lightmapSize = 64;

    /**
     * @en Whether the model is static and bake-able with light map.
     * Notice: the model's vertex data must have the second UV attribute to enable light map baking.
     * @zh 模型是否是静态的并可以烘培光照贴图。
     * 注意：模型顶点数据必须包含第二套 UV 属性来支持光照贴图烘焙。
     */
    @editable
    get bakeable () {
        return this._bakeable;
    }

    set bakeable (val) {
        this._bakeable = val;
    }

    /**
     * @en Whether to cast shadow in light map baking.
     * @zh 在光照贴图烘焙中是否投射阴影。
     */
    @editable
    get castShadow () {
        return this._castShadow;
    }

    set castShadow (val) {
        this._castShadow = val;
    }

    /**
     * @en Whether to receive shadow in light map baking.
     * @zh 在光照贴图烘焙中是否接受阴影。
     */
    @editable
    get receiveShadow () {
        return this._receiveShadow;
    }

    set receiveShadow (val) {
        this._receiveShadow = val;
    }

    /**
     * @en The lightmap size.
     * @zh 光照图大小。
     */
    @editable
    get lightmapSize () {
        return this._lightmapSize;
    }

    set lightmapSize (val) {
        this._lightmapSize = val;
    }
}

/**
 * @en Mesh renderer component for general 3d model rendering, it generates and link to a Model in the render scene.
 * It supports real time lighting and shadow, baked light map, and morph rendering.
 * @zh 用于通用模型渲染的网格渲染器组件，会创建并关联一个渲染场景中的模型对象。
 * 该组件支持实时光照和阴影，预烘焙光照贴图和形变网格渲染。
 */
@ccclass('cc.MeshRenderer')
@help('i18n:cc.MeshRenderer')
@executionOrder(100)
@menu('Mesh/MeshRenderer')
@executeInEditMode
export class MeshRenderer extends ModelRenderer {
    /**
     * @en Shadow projection mode enumeration.
     * @zh 阴影投射方式枚举。
     */
    public static ShadowCastingMode = ModelShadowCastingMode;
    /**
     * @en Shadow receive mode enumeration.
     * @zh 阴影接收方式枚举。
     */
    public static ShadowReceivingMode = ModelShadowReceivingMode;

    /**
     * @en The settings for light map baking
     * @zh 光照贴图烘焙的配置
     */
    @serializable
    @editable
    @disallowAnimation
    public lightmapSettings = new ModelLightmapSettings();

    @serializable
    protected _mesh: Mesh | null = null;

    @serializable
    protected _shadowCastingMode = ModelShadowCastingMode.OFF;

    @serializable
    protected _shadowReceivingMode = ModelShadowReceivingMode.ON;

    @serializable
    protected _shadowBias = 0;

    @serializable
    protected _shadowNormalBias = 0;

    // @serializable
    private _subMeshShapesWeights: number[][] = [];

    /**
     * @en Local shadow bias for real time lighting.
     * @zh 实时光照下模型局部的阴影偏移。
     */
    @type(CCFloat)
    @tooltip('i18n:model.shadow_bias')
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 0 } })
    @disallowAnimation
    get shadowBias () {
        return this._shadowBias;
    }

    set shadowBias (val) {
        this._shadowBias = val;
        this._updateShadowBias();
        this._onUpdateLocalShadowBias();
    }

    /**
   * @en local shadow normal bias for real time lighting.
   * @zh 实时光照下模型局部的阴影法线偏移。
   */
    @type(CCFloat)
    @tooltip('i18n:model.shadow_normal_bias')
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 1 } })
    @disallowAnimation
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }

    set shadowNormalBias (val) {
        this._shadowNormalBias = val;
        this._updateShadowNormalBias();
        this._onUpdateLocalShadowBias();
    }

    /**
     * @en Shadow projection mode.
     * @zh 实时光照下阴影投射方式。
     */
    @type(ModelShadowCastingMode)
    @tooltip('i18n:model.shadow_casting_model')
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 2 } })
    @disallowAnimation
    get shadowCastingMode () {
        return this._shadowCastingMode;
    }

    set shadowCastingMode (val) {
        this._shadowCastingMode = val;
        this._updateCastShadow();
    }

    /**
     * @en receive shadow.
     * @zh 实时光照下是否接受阴影。
     */
    @type(ModelShadowReceivingMode)
    @tooltip('i18n:model.shadow_receiving_model')
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 3 } })
    @disallowAnimation
    get receiveShadow () {
        return this._shadowReceivingMode;
    }

    set receiveShadow (val) {
        this._shadowReceivingMode = val;
        this._updateReceiveShadow();
    }

    /**
     * @en Gets or sets the mesh of the model.
     * Note, when set, all morph targets' weights would be reset to zero.
     * @zh 获取或设置模型的网格数据。
     * 注意，设置时，所有形变目标的权重都将归零。
     */
    @type(Mesh)
    @tooltip('i18n:model.mesh')
    get mesh () {
        return this._mesh;
    }

    set mesh (val) {
        const old = this._mesh;
        const mesh = this._mesh = val;
        mesh?.initialize();
        this._initSubMeshShapesWeights();
        this._watchMorphInMesh();
        this._onMeshChanged(old);
        this._updateModels();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
        this._updateCastShadow();
        this._updateReceiveShadow();
    }

    /**
     * @en Gets the model in [[RenderScene]].
     * @zh 获取渲染场景 [[RenderScene]] 中对应的模型。
     */
    get model () {
        return this._model;
    }

    /**
     * @en Whether to enable morph rendering.
     * @zh 是否启用形变网格渲染。
     */
    // eslint-disable-next-line func-names
    @visible(function (this: MeshRenderer) {
        return !!(
            this.mesh
            && this.mesh.struct.morph
            && this.mesh.struct.morph.subMeshMorphs.some((subMeshMorph) => !!subMeshMorph)
        );
    })
    @disallowAnimation
    get enableMorph () {
        return this._enableMorph;
    }

    set enableMorph (value) {
        this._enableMorph = value;
    }

    protected _modelType: typeof scene.Model;

    protected _model: scene.Model | null = null;

    private _morphInstance: MorphRenderingInstance | null = null;

    @serializable
    private _enableMorph = true;

    constructor () {
        super();
        this._modelType = scene.Model;
    }

    public onLoad () {
        if (this._mesh) { this._mesh.initialize(); }
        if (!this._validateShapeWeights()) {
            this._initSubMeshShapesWeights();
        }
        this._watchMorphInMesh();
        this._updateModels();
        this._updateCastShadow();
        this._updateReceiveShadow();
        this._updateShadowBias();
        this._updateShadowNormalBias();
    }

    // Redo, Undo, Prefab restore, etc.
    public onRestore () {
        this._updateModels();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
        this._updateCastShadow();
        this._updateReceiveShadow();
        this._updateShadowBias();
        this._updateShadowNormalBias();
    }

    public onEnable () {
        super.onEnable();
        if (!this._model) {
            this._updateModels();
        }
        this._updateCastShadow();
        this._updateReceiveShadow();
        this._updateShadowBias();
        this._updateShadowNormalBias();
        this._onUpdateLocalShadowBias();
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

    public onGeometryChanged () {
        if (this._model && this._mesh) {
            this._model.createBoundingShape(this._mesh.struct.minPosition, this._mesh.struct.maxPosition);
            this._model.updateWorldBound();
            this._model.onGeometryChanged();
        }
    }

    /**
     * @zh 获取子网格指定形变目标的权重。
     * @en Gets the weight at specified morph target of the specified sub mesh.
     * @param subMeshIndex Index to the sub mesh.
     * @param shapeIndex Index to the morph target of the sub mesh.
     * @returns The weight.
     */
    public getWeight (subMeshIndex: number, shapeIndex: number) {
        const { _subMeshShapesWeights: subMeshShapesWeights } = this;
        assertIsTrue(subMeshIndex < subMeshShapesWeights.length);
        const shapeWeights = this._subMeshShapesWeights[subMeshIndex];
        assertIsTrue(shapeIndex < shapeWeights.length);
        return shapeWeights[shapeIndex];
    }

    /**
     * @zh
     * 设置子网格所有形变目标的权重。
     * `subMeshIndex` 是无效索引或 `weights` 的长度不匹配子网格的形变目标数量时，此方法不会生效。
     * @en
     * Sets weights of each morph target of the specified sub mesh.
     * If takes no effect if `subMeshIndex` is out of bounds or if `weights` has a different length with morph targets count of the sub mesh.
     * @param weights The weights.
     * @param subMeshIndex Index to the sub mesh.
     */
    public setWeights (weights: number[], subMeshIndex: number) {
        const { _subMeshShapesWeights: subMeshShapesWeights } = this;
        if (subMeshIndex >= subMeshShapesWeights.length) {
            return;
        }
        const shapeWeights = subMeshShapesWeights[subMeshIndex];
        if (shapeWeights.length !== weights.length) {
            return;
        }
        subMeshShapesWeights[subMeshIndex] = weights.slice(0);
        this._uploadSubMeshShapesWeights(subMeshIndex);
    }

    /**
     * @zh
     * 设置子网格指定外形的权重。
     * `subMeshIndex` 或 `shapeIndex` 是无效索引时，此方法不会生效。
     * @en
     * Sets the weight at specified shape of specified sub mesh.
     * If takes no effect if
     * `subMeshIndex` or `shapeIndex` out of bounds.
     * @param weight The weight.
     * @param subMeshIndex Index to the sub mesh.
     * @param shapeIndex Index to the shape of the sub mesh.
     */
    public setWeight (weight: number, subMeshIndex: number, shapeIndex: number) {
        const { _subMeshShapesWeights: subMeshShapesWeights } = this;
        if (subMeshIndex >= subMeshShapesWeights.length) {
            return;
        }
        const shapeWeights = subMeshShapesWeights[subMeshIndex];
        if (shapeIndex >= shapeWeights.length) {
            return;
        }
        shapeWeights[shapeIndex] = weight;
        this._uploadSubMeshShapesWeights(subMeshIndex);
    }

    public setInstancedAttribute (name: string, value: ArrayLike<number>) {
        if (!this.model) {
            return;
        }

        if (JSB) {
            (this.model as any)._setInstancedAttribute(name, value);
        } else {
            const { attributes, views } = this.model.instancedAttributes;
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].name === name) {
                    views[i].set(value);
                    break;
                }
            }
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _updateLightmap (lightmap: Texture2D|null, uOff: number, vOff: number, scale: number, lum: number) {
        this.lightmapSettings.texture = lightmap;
        this.lightmapSettings.uvParam.x = uOff;
        this.lightmapSettings.uvParam.y = vOff;
        this.lightmapSettings.uvParam.z = scale;
        this.lightmapSettings.uvParam.w = lum;

        this._onUpdateLightingmap();
    }

    protected _updateModels () {
        if (!this.enabledInHierarchy) {
            return;
        }

        const model = this._model;
        if (model) {
            model.destroy();
            model.initialize();
            model.node = model.transform = this.node;
        } else {
            this._createModel();
        }

        if (this._model) {
            if (this._mesh) {
                this._model.createBoundingShape(this._mesh.struct.minPosition, this._mesh.struct.maxPosition);
            }
            // Initialize lighting map before model initializing
            // because the lighting map will influence the model's shader
            this._model.initLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
            this._updateModelParams();
            this._onUpdateLightingmap();
            this._onUpdateLocalShadowBias();
        }
    }

    protected _createModel () {
        const preferMorphOverPlain = !!this._morphInstance;
        // Note we only change to use `MorphModel` if
        // we are required to render morph and the `this._modelType` is exactly the basic `Model`.
        // We do this since the `this._modelType` might be changed in classes derived from `Model`.
        // We shall not overwrite it.
        // Please notice that we do not enforce that
        // derived classes should use a morph-able model type(i.e. model type derived from `MorphModel`).
        // So we should take care of the edge case.
        const modelType = (preferMorphOverPlain && this._modelType === scene.Model) ? MorphModel : this._modelType;
        const model = this._model = (legacyCC.director.root as Root).createModel(modelType);
        model.visFlags = this.visibility;
        model.node = model.transform = this.node;
        this._models.length = 0;
        this._models.push(this._model);
        if (this._morphInstance && model instanceof MorphModel) {
            model.setMorphRendering(this._morphInstance);
        }
    }

    protected _attachToScene () {
        if (!this.node.scene || !this._model) {
            return;
        }
        const renderScene = this._getRenderScene();
        if (this._model.scene !== null) {
            this._detachFromScene();
        }
        renderScene.addModel(this._model);
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    protected _updateModelParams () {
        if (!this._mesh || !this._model) { return; }
        this.node.hasChangedFlags |= TransformBit.POSITION;
        this._model.transform.hasChangedFlags |= TransformBit.POSITION;
        this._model.isDynamicBatching = this._isBatchingEnabled();
        const meshCount = this._mesh ? this._mesh.renderingSubMeshes.length : 0;
        const renderingMesh = this._mesh.renderingSubMeshes;
        if (renderingMesh) {
            for (let i = 0; i < meshCount; ++i) {
                let material = this.getRenderMaterial(i);
                if (material && !material.isValid) {
                    material = null;
                }
                const subMeshData = renderingMesh[i];
                if (subMeshData) {
                    this._model.initSubModel(i, subMeshData, material || this._getBuiltinMaterial());
                }
            }
        }
        this._model.enabled = true;
    }

    protected _onUpdateLightingmap () {
        if (this.model !== null) {
            this.model.updateLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
        }

        this.setInstancedAttribute('a_lightingMapUVParam', [
            this.lightmapSettings.uvParam.x,
            this.lightmapSettings.uvParam.y,
            this.lightmapSettings.uvParam.z,
            this.lightmapSettings.uvParam.w,
        ]);
    }

    protected _onUpdateLocalShadowBias () {
        if (this.model !== null) {
            this.model.updateLocalShadowBias();
        }

        this.setInstancedAttribute('a_localShadowBias', [
            this._shadowBias,
            this._shadowNormalBias,
        ]);
    }

    protected _onMaterialModified (idx: number, material: Material | null) {
        if (!this._model || !this._model.inited) { return; }
        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (!this._model || !this._model.inited) { return; }
        this._model.isDynamicBatching = this._isBatchingEnabled();
        this._model.setSubModelMaterial(idx, material);
        this._onUpdateLightingmap();
        this._onUpdateLocalShadowBias();
    }

    protected _onMeshChanged (old: Mesh | null) {
    }

    protected _clearMaterials () {
        if (!this._model) { return; }
        const subModels = this._model.subModels;
        for (let i = 0; i < subModels.length; ++i) {
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

    protected _updateShadowBias () {
        if (!this._model) { return; }
        this._model.shadowBias = this._shadowBias;
    }

    protected _updateShadowNormalBias () {
        if (!this._model) { return; }
        this._model.shadowNormalBias = this._shadowNormalBias;
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

    protected _updateReceiveShadow () {
        if (!this._model) { return; }
        if (this._shadowReceivingMode === ModelShadowReceivingMode.OFF) {
            this._model.receiveShadow = false;
        } else {
            this._model.receiveShadow = true;
        }
    }

    protected _isBatchingEnabled () {
        for (let i = 0; i < this._materials.length; ++i) {
            const mat = this._materials[i];
            if (!mat) { continue; }
            for (let p = 0; p < mat.passes.length; ++p) {
                const pass = mat.passes[p];
                if (pass.batchingScheme) { return true; }
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

        if (!this._mesh
            || !this._mesh.struct.morph
            || !this._mesh.morphRendering) {
            return;
        }

        this._morphInstance = this._mesh.morphRendering.createInstance();
        const nSubMeshes = this._mesh.struct.primitives.length;
        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            this._uploadSubMeshShapesWeights(iSubMesh);
        }

        if (this._model && this._model instanceof MorphModel) {
            this._model.setMorphRendering(this._morphInstance);
        }
    }

    private _initSubMeshShapesWeights () {
        const { _mesh: mesh } = this;

        this._subMeshShapesWeights.length = 0;

        if (!mesh) {
            return;
        }

        const morph = mesh.struct.morph;
        if (!morph) {
            return;
        }

        const commonWeights = morph.weights;
        this._subMeshShapesWeights = morph.subMeshMorphs.map((subMeshMorph) => {
            if (!subMeshMorph) {
                return [];
            } else if (subMeshMorph.weights) {
                return subMeshMorph.weights.slice(0);
            } else if (commonWeights) {
                assertIsTrue(commonWeights.length === subMeshMorph.targets.length);
                return commonWeights.slice(0);
            } else {
                return new Array<number>(subMeshMorph.targets.length).fill(0.0);
            }
        });
    }

    private _validateShapeWeights () {
        const {
            _mesh: mesh,
            _subMeshShapesWeights: subMeshShapesWeights,
        } = this;

        if (!mesh || !mesh.struct.morph) {
            return subMeshShapesWeights.length === 0;
        }

        const { morph } = mesh.struct;
        if (morph.subMeshMorphs.length !== subMeshShapesWeights.length) {
            return false;
        }

        return subMeshShapesWeights.every(
            ({ length: shapeCount }, subMeshIndex) => (morph.subMeshMorphs[subMeshIndex]?.targets.length ?? 0) === shapeCount,
        );
    }

    private _uploadSubMeshShapesWeights (subMeshIndex: number) {
        this._morphInstance?.setWeights(subMeshIndex, this._subMeshShapesWeights[subMeshIndex]);
    }
}

export declare namespace MeshRenderer {
    /**
     * @en Shadow projection mode.
     * @zh 阴影投射方式。
     */
    export type ShadowCastingMode = EnumAlias<typeof ModelShadowCastingMode>;
    /**
     * @en Shadow receive mode.
     * @zh 阴影接收方式。
     */
    export type ShadowReceivingMode = EnumAlias<typeof ModelShadowReceivingMode>;
}
