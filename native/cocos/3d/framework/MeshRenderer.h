#pragma once

#include <cstdint>
#include "3d/assets/Mesh.h"
#include "3d/assets/MorphRendering.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "core/assets/Material.h"
#include "core/assets/TextureCube.h"
#include "core/event/EventTarget.h"
#include "misc/ModelRenderer.h"
#include "scene/Model.h"

namespace cc {

/**
 * @en Shadow projection mode.
 * @zh 阴影投射方式。
 */
enum class ModelShadowCastingMode {
    /**
     * @en Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF = 0,
    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON = 1
};

/**
 * @en Shadow receive mode.
 * @zh 阴影接收方式。
 */
enum class ModelShadowReceivingMode {
    /**
     * @en Disable shadow receiving.
     * @zh 不接收阴影。
     */
    OFF = 0,
    /**
     * @en Enable shadow receiving.
     * @zh 开启阴影投射。
     */
    ON = 1,
};

/**
 * @en Reflection probe type
 * @zh 反射探针类型。
 */
enum class ReflectionProbeType {
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
};

/**
 * @en Model's bake settings.
 * @zh 模型烘焙设置
 */
class ModelBakeSettings final: public RefCounted {
    IMPL_EVENT_TARGET(ModelBakeSettings)
    DECLARE_TARGET_EVENT_BEGIN(ModelBakeSettings)
    /**
     * @en The event which will be triggered when the useLightProbe is changed.
     * @zh useLightProbe属性修改时触发的事件
     */
    TARGET_EVENT_ARG0(USE_LIGHT_PROBE_CHANGED); //= 'use_light_probe_changed';

    /**
     * @en The event which will be triggered when the reflectionProbe is changed.
     * @zh reflectionProbe 属性修改时触发的事件
     */
    TARGET_EVENT_ARG0(REFLECTION_PROBE_CHANGED); // = 'reflection_probe_changed';

    /**
     * @en The event which will be triggered when the bakeToReflectionProbe is changed.
     * @zh bakeToReflectionProbe 属性修改时触发的事件
     */
    TARGET_EVENT_ARG0(BAKE_TO_REFLECTION_PROBE_CHANGED); // = 'bake_to_reflection_probe_changed';
    DECLARE_TARGET_EVENT_END()

public:
    IntrusivePtr<Texture2D> texture;
    Vec4 uvParam;
    bool _bakeable = false;
    bool _castShadow = false;
    bool _receiveShadow = false;
    int32_t _lightmapSize = 64;

    bool _useLightProbe = false;
    bool _bakeToLightProbe = true;

    ReflectionProbeType _reflectionProbeType = ReflectionProbeType::NONE;
    bool _bakeToReflectionProbe = true;
    IntrusivePtr<TextureCube> _probeCubemap;
    IntrusivePtr<gfx::Texture> _probePlanarmap;

    /**
     * @en Whether the model is static and bake-able with light map.
     * Notice: the model's vertex data must have the second UV attribute to enable light map baking.
     * @zh 模型是否是静态的并可以烘培光照贴图。
     * 注意：模型顶点数据必须包含第二套 UV 属性来支持光照贴图烘焙。
     */
    bool isBakeable() const {
        return _bakeable;
    }

    void setBakeable(bool val) {
        _bakeable = val;
    }

    /**
     * @en Whether to cast shadow in light map baking.
     * @zh 在光照贴图烘焙中是否投射阴影。
     */
    bool isCastShadow() const {
        return _castShadow;
    }

    void setCastShadow(bool val) {
        _castShadow = val;
    }

    /**
     * @en Whether to receive shadow in light map baking.
     * @zh 在光照贴图烘焙中是否接受阴影。
     */
    bool isReceiveShadow() const {
        return _receiveShadow;
    }

    void setReceiveShadow(bool val) {
        _receiveShadow = val;
    }

    /**
     * @en The lightmap size.
     * @zh 光照图大小。
     */
    int32_t getLightmapSize() const {
        return _lightmapSize;
    }

    void setLightmapSize(int32_t val) {
        _lightmapSize = val;
    }

    /**
     * @en Whether to use light probe which provides indirect light to dynamic objects.
     * @zh 模型是否使用光照探针，光照探针为动态物体提供间接光。
     */
    bool isUseLightProbe() {
        return _useLightProbe;
    }

    void setUseLightProbe(bool val) {
        _useLightProbe = val;
        emit<USE_LIGHT_PROBE_CHANGED>();
    }

    /**
     * @en Whether the model is used to calculate light probe
     * @zh 模型是否用于计算光照探针
     */
    bool isBakeToLightProbe() const {
        return _bakeToLightProbe;
    }

    void setBakeToLightProbe(bool val) {
        _bakeToLightProbe = val;
    }

    /**
     * @en Used to set whether to use the reflection probe or set probe's type.
     * @zh 用于设置是否使用反射探针或者设置反射探针的类型。
     */
    ReflectionProbeType getReflectionProbe() const {
        return _reflectionProbeType;
    }

    void setReflectionProbe(ReflectionProbeType val) {
        _reflectionProbeType = val;
        emit<REFLECTION_PROBE_CHANGED>();
    }

    /**
     * @en Whether the model can be render by the reflection probe
     * @zh 模型是否能被反射探针渲染
     */
    bool isBakeToReflectionProbe() const {
        return _bakeToReflectionProbe;
    }

    void setBakeToReflectionProbe(bool val) {
        _bakeToReflectionProbe = val;
        emit<BAKE_TO_REFLECTION_PROBE_CHANGED>();
    }
};

class MeshRenderer : public ModelRenderer {
public:
    using Super = ModelRenderer;
    /**
     * @en Shadow projection mode enumeration.
     * @zh 阴影投射方式枚举。
     */
    using ShadowCastingMode = ModelShadowCastingMode;
    /**
     * @en Shadow receive mode enumeration.
     * @zh 阴影接收方式枚举。
     */
    using ShadowReceivingMode = ModelShadowReceivingMode;

    /**
     * @en The settings for GI baking, it was called lightmapSettings before
     * @zh 全局光照烘焙的配置，以前名称为lightmapSettings
     */
    Ptr<ModelBakeSettings> bakeSettings;

    ShadowCastingMode _shadowCastingMode{ShadowCastingMode::OFF};

    ShadowReceivingMode _shadowReceivingMode{ShadowReceivingMode::ON};

    float _shadowBias{0};

    float _shadowNormalBias{0};

    Ptr<Mesh> _mesh;

private:

    ccstd::vector<ccstd::vector<float>> _subMeshShapesWeights{};

public:
    /**
     * @en Local shadow bias for real time lighting.
     * @zh 实时光照下模型局部的阴影偏移。
     */
    float getShadowBias() const {
        return _shadowBias;
    }

    void setShadowBias(float val) {
        _shadowBias = val;
        _updateShadowBias();
        _onUpdateLocalShadowBias();
    }

    /**
   * @en local shadow normal bias for real time lighting.
   * @zh 实时光照下模型局部的阴影法线偏移。
   */
    float getShadowNormalBias() const {
        return _shadowNormalBias;
    }

    void setShadowNormalBias(float val) {
        _shadowNormalBias = val;
        _updateShadowNormalBias();
        _onUpdateLocalShadowBias();
    }

    /**
     * @en Shadow projection mode.
     * @zh 实时光照下阴影投射方式。
     */
    ShadowCastingMode getShadowCastingMode() const {
        return _shadowCastingMode;
    }

    void setShadowCastingMode(ShadowCastingMode val) {
        _shadowCastingMode = val;
        _updateCastShadow();
    }

    void onUpdateReceiveDirLight(uint32_t visibility, bool forceClose);

    /**
     * @en receive shadow.
     * @zh 实时光照下是否接受阴影。
     */
    ShadowReceivingMode getReceiveShadow() const {
        return _shadowReceivingMode;
    }

    void setReceiveShadow(ShadowReceivingMode val) {
        _shadowReceivingMode = val;
        _updateReceiveShadow();
    }

    /**
     * @en Gets or sets the mesh of the model.
     * Note, when set, all morph targets' weights would be reset to zero.
     * @zh 获取或设置模型的网格数据。
     * 注意，设置时，所有形变目标的权重都将归零。
     */
    Mesh *getMesh() const {
        return _mesh;
    }

    void setMesh(Mesh *val) {
        auto old = _mesh;
        Mesh *mesh = _mesh = val;
        if (mesh) {
            mesh->initialize();
        }
        _initSubMeshShapesWeights();
        _watchMorphInMesh();
        _onMeshChanged(old);
        _updateModels();
        if (isEnabledInHierarchy()) {
            _attachToScene();
        }
        _updateCastShadow();
        _updateReceiveShadow();
        _updateUseLightProbe();
        _updateUseReflectionProbe();
    }

    /**
     * @en Gets the model in [[RenderScene]].
     * @zh 获取渲染场景 [[RenderScene]] 中对应的模型。
     */
    scene::Model *getModel() const {
        return _model;
    }

    /**
     * @en Whether to enable morph rendering.
     * @zh 是否启用形变网格渲染。
     */
    // eslint-disable-next-line func-names
    bool isEnableMorph() const {
        return _enableMorph;
    }

    void setEnableMorph(bool value) {
        _enableMorph = value;
    }

    Ptr<scene::Model> _model;
protected:
    Ptr<MorphRenderingInstance> _morphInstance;

private:
    Node::MobilityChanged::EventID _nodeMobiChangeEv;
    scene::Model::Type _modelType = scene::Model::Type::DEFAULT;

public:
    bool _enableMorph{true};

    MeshRenderer();

    void onLoad() override;
    void onRestore() override;
    void onEnable() override;
    void onDisable() override;
    void onDestroy() override;
    void onGeometryChanged();

    /**
     * @zh 获取子网格指定形变目标的权重。
     * @en Gets the weight at specified morph target of the specified sub mesh.
     * @param subMeshIndex Index to the sub mesh.
     * @param shapeIndex Index to the morph target of the sub mesh.
     * @returns The weight.
     */
    float getWeight(index_t subMeshIndex, index_t shapeIndex);

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
    void setWeights(const ccstd::vector<float> &weights, index_t subMeshIndex);

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
    void setWeight(float weight, index_t subMeshIndex, index_t shapeIndex);

    void setInstancedAttribute(const char *name, const ccstd::vector<float> &value);

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    void _updateLightmap(Texture2D *lightmap, float uOff, float vOff, float scale, float lum);

    void updateProbeCubemap(TextureCube *cubeMap, bool useDefaultTexture);

    void updateProbePlanarMap(gfx::Texture *planarMap);

protected:
    void _updateReflectionProbeTexture();

    void _updateModels();

    void _createModel();

    void _attachToScene() override;
    void _detachFromScene() override;
    void _updateModelParams();
    void _onUpdateLightingmap();
    void _onUpdateLocalShadowBias();
    void _onMaterialModified(index_t idx, Material *material) override;
    void _onRebuildPSO(index_t idx, Material *material) override;

    void _onMeshChanged(Mesh *old);

    void _clearMaterials() override;

    Material *_getBuiltinMaterial();

    void _onVisibilityChanged(int32_t val);

    void _updateShadowBias();

    void _updateShadowNormalBias();

    void _updateCastShadow();

    void _updateReceiveShadow();

    void onMobilityChanged();

    void onUseLightProbeChanged();

    void onReflectionProbeChanged();

    void onBakeToReflectionProbeChanged();

    void _updateUseLightProbe();

    bool _isBatchingEnabled();

    void _updateUseReflectionProbe();

    void _updateBakeToReflectionProbe();

private:
    void _watchMorphInMesh();
    void _initSubMeshShapesWeights();
    bool _validateShapeWeights();
    void _uploadSubMeshShapesWeights(index_t subMeshIndex);
};
} // namespace cc
