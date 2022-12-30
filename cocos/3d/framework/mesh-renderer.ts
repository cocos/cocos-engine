/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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
import { JSB } from 'internal:constants';
import { displayOrder, group, range } from 'cc.decorator';
import { Texture2D, TextureCube } from '../../asset/assets';
import { Material } from '../../asset/assets/material';
import { Mesh } from '../assets/mesh';
import { Vec4, Enum, cclegacy, CCBoolean, CCFloat, assertIsTrue, _decorator, CCInteger, EventTarget } from '../../core';
import { scene } from '../../render-scene';
import { MorphModel } from '../models/morph-model';
import { Root } from '../../root';
import { MobilityMode, TransformBit } from '../../scene-graph/node-enum';
import { ModelRenderer } from '../../misc/model-renderer';
import { MorphRenderingInstance } from '../assets/morph-rendering';
import { NodeEventType } from '../../scene-graph/node-event';
import { Texture } from '../../gfx';
import { builtinResMgr } from '../../asset/asset-manager/builtin-res-mgr';
import { settings, Settings } from '../../core/settings';

const { property, ccclass, help, executeInEditMode, executionOrder, menu, tooltip, visible, type,
    formerlySerializedAs, serializable, editable, disallowAnimation } = _decorator;

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
 * @en Reflection probe type
 * @zh 反射探针类型。
 */
export enum ReflectionProbeType {
    /**
     * @en Use the default skybox.
     * @zh 使用默认天空盒
     */
    NONE = 0,
    /**
     * @en Cubemap generate by probe
     * @zh Probe烘焙的cubemap
     */
    BAKED_CUBEMAP = 1,
    /**
     * @en Realtime planar reflection
     * @zh 实时平面反射
     */
    PLANAR_REFLECTION = 2,
}

/**
 * @en Model's bake settings.
 * @zh 模型烘焙设置
 */
@ccclass('cc.ModelBakeSettings')
class ModelBakeSettings extends EventTarget {
    /**
     * @en The event which will be triggered when the useLightProbe is changed.
     * @zh useLightProbe属性修改时触发的事件
     */
    public static readonly USE_LIGHT_PROBE_CHANGED = 'use_light_probe_changed';

    /**
     * @en The event which will be triggered when the reflectionProbe is changed.
     * @zh reflectionProbe 属性修改时触发的事件
     */
    public static readonly REFLECTION_PROBE_CHANGED = 'reflection_probe_changed';

    /**
     * @en The event which will be triggered when the bakeToReflectionProbe is changed.
     * @zh bakeToReflectionProbe 属性修改时触发的事件
     */
    public static readonly BAKE_TO_REFLECTION_PROBE_CHANGED = 'bake_to_reflection_probe_changed';

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

    @serializable
    protected _useLightProbe = false;
    @serializable
    protected _bakeToLightProbe = true;

    @serializable
    protected _reflectionProbeType = ReflectionProbeType.NONE;
    @serializable
    protected _bakeToReflectionProbe = true;
    @serializable
    public _probeCubemap: TextureCube | null = null;
    public _probePlanarmap: Texture | null = null;

    /**
     * @en Whether the model is static and bake-able with light map.
     * Notice: the model's vertex data must have the second UV attribute to enable light map baking.
     * @zh 模型是否是静态的并可以烘培光照贴图。
     * 注意：模型顶点数据必须包含第二套 UV 属性来支持光照贴图烘焙。
     */
    @group({ id: 'LightMap', name: 'LightMapSettings', displayOrder: 0 })
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
    @group({ id: 'LightMap', name: 'LightMapSettings' })
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
    @group({ id: 'LightMap', name: 'LightMapSettings' })
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
    @group({ id: 'LightMap', name: 'LightMapSettings' })
    @editable
    @type(CCInteger)
    @range([0, 1024])
    get lightmapSize () {
        return this._lightmapSize;
    }

    set lightmapSize (val) {
        this._lightmapSize = val;
    }

    /**
     * @en Whether to use light probe which provides indirect light to dynamic objects.
     * @zh 模型是否使用光照探针，光照探针为动态物体提供间接光。
     */
    @group({ id: 'LightProbe', name: 'LightProbeSettings', displayOrder: 1 })
    @editable
    @type(CCBoolean)
    get useLightProbe () {
        return this._useLightProbe;
    }

    set useLightProbe (val) {
        this._useLightProbe = val;
        this.emit(ModelBakeSettings.USE_LIGHT_PROBE_CHANGED);
    }

    /**
     * @en Whether the model is used to calculate light probe
     * @zh 模型是否用于计算光照探针
     */
    @group({ id: 'LightProbe', name: 'LightProbeSettings' })
    @editable
    @type(CCBoolean)
    get bakeToLightProbe () {
        return this._bakeToLightProbe;
    }

    set bakeToLightProbe (val) {
        this._bakeToLightProbe = val;
    }

    /**
     * @en Used to set whether to use the reflection probe or set probe's type.
     * @zh 用于设置是否使用反射探针或者设置反射探针的类型。
     */
    @group({ id: 'ReflectionProbe', name: 'ReflectionProbeSettings', displayOrder: 2 })
    @type(Enum(ReflectionProbeType))
    get reflectionProbe () {
        return this._reflectionProbeType;
    }

    set reflectionProbe (val) {
        this._reflectionProbeType = val;
        this.emit(ModelBakeSettings.REFLECTION_PROBE_CHANGED);
    }

    /**
     * @en Whether the model can be render by the reflection probe
     * @zh 模型是否能被反射探针渲染
     */
    @group({ id: 'ReflectionProbe', name: 'ReflectionProbeSettings' })
    @type(CCBoolean)
    get bakeToReflectionProbe () {
        return this._bakeToReflectionProbe;
    }

    set bakeToReflectionProbe (val) {
        this._bakeToReflectionProbe = val;
        this.emit(ModelBakeSettings.BAKE_TO_REFLECTION_PROBE_CHANGED);
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
     * @en The settings for GI baking, it was called lightmapSettings before
     * @zh 全局光照烘焙的配置，以前名称为lightmapSettings
     */
    @serializable
    @editable
    @disallowAnimation
    @displayOrder(1)
    public bakeSettings = new ModelBakeSettings(this);

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
    @group({ id: 'DynamicShadow', name: 'DynamicShadowSettings', displayOrder: 0 })
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
    @group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })
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
    @group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })
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
    @group({ id: 'DynamicShadow', name: 'DynamicShadowSettings' })
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
        this._updateUseLightProbe();
        this._updateUseReflectionProbe();
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

        const highQualityMode = settings.querySettings(Settings.Category.RENDERING, 'highQualityMode');
        if (highQualityMode) {
            this._shadowCastingMode = ModelShadowCastingMode.ON;
            this.bakeSettings.castShadow = true;
            this.bakeSettings.receiveShadow = true;
        }
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
        this._updateUseLightProbe();
        this._updateBakeToReflectionProbe();
        this._updateUseReflectionProbe();
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
        this._updateUseLightProbe();
        this._updateBakeToReflectionProbe();
        this._updateUseReflectionProbe();
    }

    public onEnable () {
        super.onEnable();
        this.node.on(NodeEventType.MOBILITY_CHANGED, this.onMobilityChanged, this);
        this.bakeSettings.on(ModelBakeSettings.USE_LIGHT_PROBE_CHANGED, this.onUseLightProbeChanged, this);
        this.bakeSettings.on(ModelBakeSettings.REFLECTION_PROBE_CHANGED, this.onReflectionProbeChanged, this);
        this.bakeSettings.on(ModelBakeSettings.BAKE_TO_REFLECTION_PROBE_CHANGED, this.onBakeToReflectionProbeChanged, this);

        if (!this._model) {
            this._updateModels();
        }
        this._updateCastShadow();
        this._updateReceiveShadow();
        this._updateShadowBias();
        this._updateShadowNormalBias();
        this._updateBakeToReflectionProbe();
        this._updateUseReflectionProbe();
        this._onUpdateLocalShadowBias();
        this._updateUseLightProbe();
        this._attachToScene();
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
        this.node.off(NodeEventType.MOBILITY_CHANGED, this.onMobilityChanged, this);
        this.bakeSettings.off(ModelBakeSettings.USE_LIGHT_PROBE_CHANGED, this.onUseLightProbeChanged, this);
        this.bakeSettings.off(ModelBakeSettings.REFLECTION_PROBE_CHANGED, this.onReflectionProbeChanged, this);
        this.bakeSettings.off(ModelBakeSettings.BAKE_TO_REFLECTION_PROBE_CHANGED, this.onBakeToReflectionProbeChanged, this);
    }

    public onDestroy () {
        if (this._model) {
            cclegacy.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
        if (this._morphInstance) {
            this._morphInstance.destroy();
        }
    }

    public onGeometryChanged () {
        if (this._model && this._mesh) {
            const meshStruct = this._mesh.struct;
            this._model.createBoundingShape(meshStruct.minPosition, meshStruct.maxPosition);
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
            const subModels = this.model.subModels;
            for (let i = 0; i < subModels.length; i++) {
                const subModel = subModels[i];
                const { attributes, views } = subModel.instancedAttributeBlock;
                for (let i = 0; i < attributes.length; i++) {
                    if (attributes[i].name === name) {
                        views[i].set(value);
                        break;
                    }
                }
            }
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _updateLightmap (lightmap: Texture2D|null, uOff: number, vOff: number, scale: number, lum: number) {
        this.bakeSettings.texture = lightmap;
        this.bakeSettings.uvParam.x = uOff;
        this.bakeSettings.uvParam.y = vOff;
        this.bakeSettings.uvParam.z = scale;
        this.bakeSettings.uvParam.w = lum;

        this._onUpdateLightingmap();
    }

    public updateProbeCubemap (cubeMap: TextureCube | null, useDefaultTexture?: boolean) {
        if (this.bakeSettings._probeCubemap && this.bakeSettings._probeCubemap === cubeMap) {
            return;
        }
        this.bakeSettings._probeCubemap = cubeMap;
        if (this.model !== null) {
            let cubeMap = this.bakeSettings._probeCubemap;
            if (!cubeMap && this.node.scene && !useDefaultTexture) {
                cubeMap = this.node.scene._globals.skybox.envmap;
            }
            this.model.updateReflectionProbeCubemap(cubeMap);
        }
    }
    public updateProbePlanarMap (planarMap: Texture | null) {
        if (this.bakeSettings._probePlanarmap === planarMap) {
            return;
        }
        this.bakeSettings._probePlanarmap = planarMap;
        if (this.model !== null) {
            this.model.updateReflectionProbePlanarMap(this.bakeSettings._probePlanarmap);
        }
    }

    protected _updateReflectionProbeTexture () {
        if (this.model === null) return;
        if (this.bakeSettings.reflectionProbe === ReflectionProbeType.BAKED_CUBEMAP) {
            let cubeMap = this.bakeSettings._probeCubemap;
            if (!cubeMap && this.node.scene) {
                cubeMap = this.node.scene._globals.skybox.envmap;
            }
            this.model.updateReflectionProbeCubemap(cubeMap);
            this.model.updateReflectionProbePlanarMap(null);
        } else if (this.bakeSettings.reflectionProbe === ReflectionProbeType.PLANAR_REFLECTION) {
            this.model.updateReflectionProbePlanarMap(this.bakeSettings._probePlanarmap);
            this.model.updateReflectionProbeCubemap(null);
        } else {
            this.model.updateReflectionProbeCubemap(null);
            this.model.updateReflectionProbePlanarMap(null);
        }
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
                const meshStruct = this._mesh.struct;
                this._model.createBoundingShape(meshStruct.minPosition, meshStruct.maxPosition);
            }
            // Initialize lighting map before model initializing
            // because the lighting map will influence the model's shader
            this._model.initLightingmap(this.bakeSettings.texture, this.bakeSettings.uvParam);
            this._updateUseLightProbe();
            this._updateModelParams();
            this._onUpdateLightingmap();
            this._onUpdateLocalShadowBias();
            this._updateUseReflectionProbe();
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
        const model = this._model = (cclegacy.director.root as Root).createModel(modelType);
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
            this.model.updateLightingmap(this.bakeSettings.texture, this.bakeSettings.uvParam);
        }

        this.setInstancedAttribute('a_lightingMapUVParam', [
            this.bakeSettings.uvParam.x,
            this.bakeSettings.uvParam.y,
            this.bakeSettings.uvParam.z,
            this.bakeSettings.uvParam.w,
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
        this._updateReflectionProbeTexture();
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

    protected onMobilityChanged () {
        this._updateUseLightProbe();
    }

    protected onUseLightProbeChanged () {
        this._updateUseLightProbe();
    }

    protected onReflectionProbeChanged () {
        this._updateUseReflectionProbe();
        if (this.bakeSettings.reflectionProbe === ReflectionProbeType.BAKED_CUBEMAP) {
            cclegacy.internal.reflectionProbeManager.updateUseCubeModels(this._model);
        } else if (this.bakeSettings.reflectionProbe === ReflectionProbeType.PLANAR_REFLECTION) {
            cclegacy.internal.reflectionProbeManager.updateUsePlanarModels(this._model);
        }
    }

    protected onBakeToReflectionProbeChanged () {
        this._updateBakeToReflectionProbe();
    }

    protected _updateUseLightProbe () {
        if (!this._model) { return; }
        const node = this.node;
        if (this._mesh && node && node.mobility === MobilityMode.Movable && this.bakeSettings.useLightProbe) {
            this._model.useLightProbe = true;
        } else {
            this._model.useLightProbe = false;
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

    protected _updateUseReflectionProbe () {
        if (!this._model) return;
        this._model.reflectionProbeType = this.bakeSettings.reflectionProbe;
        this._updateReflectionProbeTexture();
    }

    protected _updateBakeToReflectionProbe () {
        if (!this._model) { return; }
        this._model.bakeToReflectionProbe = this.bakeSettings.bakeToReflectionProbe;
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
