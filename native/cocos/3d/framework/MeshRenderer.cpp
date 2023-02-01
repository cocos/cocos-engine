#include "MeshRenderer.h"
#include "3d/framework/MeshRenderer.h"
#include "Accessor.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/scene-graph/NodeEnum.h"
#include "scene/ReflectionProbe.h"
// #include "scene/ReflectionProbeManager.h"
#include "v8/ScriptEngine.h"

// mark  decltype of Model as jsb object
#include "bindings/auto/jsb_scene_auto.h"

namespace cc {

#if defined(MR_PROBE_EVENTS) || defined(MR_SCENE_GLOBAL)
    #error target macros are already defined
#endif

#define MR_PROBE_EVENTS(fn)                                 \
    fn(USE_LIGHT_PROBE_CHANGED, onUseLightProbeChanged);    \
    fn(REFLECTION_PROBE_CHANGED, onReflectionProbeChanged); \
    fn(BAKE_TO_REFLECTION_PROBE_CHANGED, onBakeToReflectionProbeChanged);

#define MR_SCENE_GLOBAL() \
    getNode()->getScene()->getSceneGlobals()

MeshRenderer::MeshRenderer() {

    bakeSettings = new ModelBakeSettings;
    se::AutoHandleScope scope;
    se::Value settings = se::accessor::globalPath("cc.settings");
    se::Value highQualityMode = se::accessor::invoke(settings, "querySettings", "rendering", "highQualityMode");
    if (!highQualityMode.isNullOrUndefined()) {
        _shadowCastingMode = ShadowCastingMode::ON;
        bakeSettings->setCastShadow(true);
        bakeSettings->setReceiveShadow(true);
    }
}

void MeshRenderer::onUpdateReceiveDirLight(uint32_t visibility, bool forceClose) {
    if (!_model) {
        return;
    }
    if (forceClose) {
        _model->setReceiveDirLight(false);
        return;
    }
    auto *node = getNode();
    if (node && ((visibility & node->getLayer()) == node->getLayer()) || (visibility & static_cast<uint32_t>(_model->getVisFlags()))) {
        _model->setReceiveDirLight(true);
    } else {
        _model->setReceiveDirLight(false);
    }
}

void MeshRenderer::onLoad() {
    if (_mesh) {
        _mesh->initialize();
    }
    if (!_validateShapeWeights()) {
        _initSubMeshShapesWeights();
    }
    _watchMorphInMesh();
    _updateModels();
    _updateCastShadow();
    _updateReceiveShadow();
    _updateShadowBias();
    _updateShadowNormalBias();
    _updateUseLightProbe();
    _updateBakeToReflectionProbe();
    _updateUseReflectionProbe();
}

// Redo, Undo, Prefab restore, etc.
void MeshRenderer::onRestore() {
    _updateModels();
    if (isEnabledInHierarchy()) {
        _attachToScene();
    }
    _updateCastShadow();
    _updateReceiveShadow();
    _updateShadowBias();
    _updateShadowNormalBias();
    _updateUseLightProbe();
    _updateBakeToReflectionProbe();
    _updateUseReflectionProbe();
}

void MeshRenderer::onEnable() {
    Super::onEnable();
    _nodeMobiChangeEv = getNode()->on<Node::MobilityChanged>([&](cc::Node * /*emitter*/) { onMobilityChanged(); });

#define BK_BIND(ev, cb) \
    bakeSettings->on<ModelBakeSettings::ev>([&](ModelBakeSettings * /*emitter*/) { cb(); })
    MR_PROBE_EVENTS(BK_BIND)
#undef BAKE_BIND

    if (!_model) {
        _updateModels();
    }
    _updateCastShadow();
    _updateReceiveShadow();
    _updateShadowBias();
    _updateShadowNormalBias();
    _updateBakeToReflectionProbe();
    _updateUseReflectionProbe();
    _onUpdateLocalShadowBias();
    _updateUseLightProbe();
    _attachToScene();
}

void MeshRenderer::onDisable() {
    if (_model) {
        _detachFromScene();
    }
    getNode()->off<Node::MobilityChanged>(_nodeMobiChangeEv);
#define BK_UNBIND(ev, cb) \
    bakeSettings->off<ModelBakeSettings::ev>()
    MR_PROBE_EVENTS(BK_UNBIND)
#undef BAKE_BIND
}

void MeshRenderer::onDestroy() {
    if (_model) {
        se::accessor::invokeGlobal("cc.director.root", "destroyModel", _model);
        _model = nullptr;
        _models.clear();
    }
    if (_morphInstance) {
        _morphInstance->destroy();
        _morphInstance = nullptr;
    }
}

void MeshRenderer::onGeometryChanged() {
    if (_model && _mesh) {
        const auto &meshStruct = _mesh->getStruct();
        _model->createBoundingShape(meshStruct.minPosition, meshStruct.maxPosition);
        _model->updateWorldBound();
        _model->onGeometryChanged();
    }
}

// NOLINTNEXTLINE
float MeshRenderer::getWeight(index_t subMeshIndex, index_t shapeIndex) {
    CC_ASSERT(subMeshIndex < _subMeshShapesWeights.size());
    auto &shapeWeights = _subMeshShapesWeights[subMeshIndex];
    CC_ASSERT(shapeIndex < shapeWeights.size());
    return shapeWeights[shapeIndex];
}

void MeshRenderer::setWeights(const ccstd::vector<float> &weights, index_t subMeshIndex) {
    if (subMeshIndex >= _subMeshShapesWeights.size()) {
        return;
    }
    auto &shapeWeights = _subMeshShapesWeights[subMeshIndex];
    if (shapeWeights.size() != weights.size()) {
        return;
    }
    _subMeshShapesWeights[subMeshIndex] = weights;
    _uploadSubMeshShapesWeights(subMeshIndex);
}

// NOLINTNEXTLINE
void MeshRenderer::setWeight(float weight, index_t subMeshIndex, index_t shapeIndex) {
    if (subMeshIndex >= _subMeshShapesWeights.size()) {
        return;
    }
    auto &shapeWeights = _subMeshShapesWeights[subMeshIndex];
    if (shapeIndex >= shapeWeights.size()) {
        return;
    }
    shapeWeights[shapeIndex] = weight;
    _uploadSubMeshShapesWeights(subMeshIndex);
}

void MeshRenderer::setInstancedAttribute(const char *name, const ccstd::vector<float> &value) {
    if (!_model) return;

    _model->setInstancedAttribute(name, value.data(), value.size() * sizeof(value[0]));
}

// NOLINTNEXTLINE
void MeshRenderer::_updateLightmap(Texture2D *lightmap, float uOff, float vOff, float scale, float lum) {
    bakeSettings->texture = lightmap;
    bakeSettings->uvParam.x = uOff;
    bakeSettings->uvParam.y = vOff;
    bakeSettings->uvParam.z = scale;
    bakeSettings->uvParam.w = lum;
    _onUpdateLightingmap();
}

void MeshRenderer::updateProbeCubemap(TextureCube *cubeMap, bool useDefaultTexture) {
    if (bakeSettings->_probeCubemap && bakeSettings->_probeCubemap == cubeMap) {
        return;
    }
    bakeSettings->_probeCubemap = cubeMap;
    if (_model) {
        auto &cubeMap = bakeSettings->_probeCubemap;
        if (!cubeMap && getNode()->getScene() && !useDefaultTexture) {
            cubeMap = MR_SCENE_GLOBAL()->getSkyboxInfo()->getEnvmap();
        }
        _model->updateReflectionProbeCubemap(cubeMap);
    }
}

void MeshRenderer::updateProbePlanarMap(gfx::Texture *planarMap) {
    if (bakeSettings->_probePlanarmap == planarMap) {
        return;
    }
    bakeSettings->_probePlanarmap = planarMap;
    if (_model) {
        _model->updateReflectionProbePlanarMap(bakeSettings->_probePlanarmap);
    }
}

void MeshRenderer::_updateReflectionProbeTexture() {
    if (!_model) return;
    if (bakeSettings->getReflectionProbe() == ReflectionProbeType::BAKED_CUBEMAP) {
        auto &cubeMap = bakeSettings->_probeCubemap;
        if (!cubeMap && getNode()->getScene()) {
            cubeMap = MR_SCENE_GLOBAL()->getSkyboxInfo()->getEnvmap();
        }
        _model->updateReflectionProbeCubemap(cubeMap);
        _model->updateReflectionProbePlanarMap(nullptr);
    } else if (bakeSettings->getReflectionProbe() == ReflectionProbeType::PLANAR_REFLECTION) {
        _model->updateReflectionProbePlanarMap(bakeSettings->_probePlanarmap);
        _model->updateReflectionProbeCubemap(nullptr);
    } else {
        _model->updateReflectionProbeCubemap(nullptr);
        _model->updateReflectionProbePlanarMap(nullptr);
    }
}

void MeshRenderer::_updateModels() {
    if (!isEnabledInHierarchy()) {
        return;
    }

    if (_model) {
        _model->destroy();
        _model->initialize();
        _model->setNode(getNode());
        _model->setTransform(getNode());
    } else {
        _createModel();
    }

    if (_model) {
        if (_mesh) {
            const auto &meshStruct = _mesh->getStruct();
            _model->createBoundingShape(meshStruct.minPosition, meshStruct.maxPosition);
        }
        // Initialize lighting map before model initializing
        // because the lighting map will influence the model's shader
        _model->initLightingmap(bakeSettings->texture, bakeSettings->uvParam);
        _updateUseLightProbe();
        _updateModelParams();
        _onUpdateLightingmap();
        _onUpdateLocalShadowBias();
        _updateUseReflectionProbe();
    }
}

void MeshRenderer::_createModel() {
    bool preferMorphOverPlain = !!_morphInstance;
    // Note we only change to use `MorphModel` if
    // we are required to render morph and the `_modelType` is exactly the basic `Model`.
    // We do this since the `_modelType` might be changed in classes derived from `Model`.
    // We shall not overwrite it.
    // Please notice that we do not enforce that
    // derived classes should use a morph-able model type(i.e. model type derived from `MorphModel`).
    // So we should take care of the edge case.
    if (preferMorphOverPlain && _modelType == scene::Model::Type::DEFAULT) {
        _model = Root::getInstance()->createModel<MorphModel>();
    } else {
        switch (_modelType) {
            case scene::Model::Type::DEFAULT:
                _model = Root::getInstance()->createModel<scene::Model>();
                break;
            case scene::Model::Type::SKINNING:
                _model = Root::getInstance()->createModel<SkinningModel>();
                break;
            case scene::Model::Type::BAKED_SKINNING:
                _model = Root::getInstance()->createModel<BakedSkinningModel>();
                break;
            case scene::Model::Type::PARTICLE_BATCH:
                //cjh todo:
                break;
            case scene::Model::Type::LINE:
                //cjh todo:
                break;
            default:
                _model = Root::getInstance()->createModel<scene::Model>();
                break;
        }
    }
    auto *node = getNode();
    _model->setVisFlags(static_cast<Layers::Enum>(getVisibility()));
    _model->setNode(node);
    _model->setTransform(node);

    _models.clear();
    _models.emplace_back(_model);
    if (_morphInstance != nullptr) {
        auto *morphModel = dynamic_cast<MorphModel *>(_model.get());
        if (morphModel != nullptr) {
            morphModel->setMorphRendering(_morphInstance);
        }
    }
}

void MeshRenderer::_attachToScene() {
    if (!getNode()->getScene() || !_model) {
        return;
    }
    auto *renderScene = _getRenderScene();
    if (_model->getScene()) {
        _detachFromScene();
    }
    CC_LOG_DEBUG("%s: address of model : %p, submodel: %p", getName().c_str(),  _model.get(),
                 _model && _model->getSubModels().size() > 0 ? _model->getSubModels()[0].get() : nullptr);
    renderScene->addModel(_model);
}
void MeshRenderer::_detachFromScene() {
    if (_model && _model->getScene()) {
        _model->getScene()->removeModel(_model);
    }
}

void MeshRenderer::_updateModelParams() {
    if (!_mesh || !_model) {
        return;
    }
    auto *node = getNode();
    node->setChangedFlagsAdditive(TransformBit::POSITION);
    _model->getTransform()->setChangedFlagsAdditive(TransformBit::POSITION);

    _model->setDynamicBatching(_isBatchingEnabled());
    if (_mesh && !_mesh->getRenderingSubMeshes().empty()) {
        const auto &renderingMesh = _mesh->getRenderingSubMeshes();
        for (auto i = 0; i < renderingMesh.size(); ++i) {
            auto *material = getRenderMaterial(i);
            if (material && !material->isValid()) {
                material = nullptr;
            }
            const auto &subMeshData = renderingMesh[i];
            Material *dftMaterial = material ? material : _getBuiltinMaterial();
            if (subMeshData && dftMaterial) {
                _model->initSubModel(i, subMeshData, dftMaterial);
            }
        }
    }
    _model->setEnabled(true);
}

void MeshRenderer::_onUpdateLightingmap() {
    if (_model) {
        _model->updateLightingmap(bakeSettings->texture, bakeSettings->uvParam);
    }

    setInstancedAttribute("a_lightingMapUVParam",
                          {
                              bakeSettings->uvParam.x,
                              bakeSettings->uvParam.y,
                              bakeSettings->uvParam.z,
                              bakeSettings->uvParam.w,
                          });
}

void MeshRenderer::_onUpdateLocalShadowBias() {
    if (_model) {
        _model->updateLocalShadowBias();
    }

    setInstancedAttribute("a_localShadowBias",
                          {
                              _shadowBias,
                              _shadowNormalBias,
                          });
}

void MeshRenderer::_onMaterialModified(index_t idx, Material *material) {
    if (!_model || !_model->isInited()) {
        return;
    }
    _onRebuildPSO(idx, material ? material : _getBuiltinMaterial());
}

void MeshRenderer::_onRebuildPSO(index_t idx, Material *material) {
    if (!_model || !_model->isInited()) {
        return;
    }
    _model->setDynamicBatching(_isBatchingEnabled());
    _model->setSubModelMaterial(idx, material);
    _onUpdateLightingmap();
    _onUpdateLocalShadowBias();
    _updateReflectionProbeTexture();
}

void MeshRenderer::_onMeshChanged(Mesh *old) {
}

void MeshRenderer::_clearMaterials() {
    if (!_model) {
        return;
    }
    const auto &subModels = _model->getSubModels();
    for (auto i = 0; i < subModels.size(); ++i) {
        _onMaterialModified(i, nullptr);
    }
}

Material *MeshRenderer::_getBuiltinMaterial() { // NOLINT
    // classic ugly pink indicating missing material
    return BuiltinResMgr::getInstance()->get<Material>("mising-material");
}

void MeshRenderer::_onVisibilityChanged(int32_t val) {
    if (!_model) return;
    _model->setVisFlags(static_cast<Layers::Enum>(val));
}

void MeshRenderer::_updateShadowBias() {
    if (!_model) return;
    _model->setShadowBias(_shadowBias);
}

void MeshRenderer::_updateShadowNormalBias() {
    if (!_model) return;
    _model->setShadowNormalBias(_shadowNormalBias);
}

void MeshRenderer::_updateCastShadow() {
    if (!_model) {
        return;
    }
    if (_shadowCastingMode == ModelShadowCastingMode::OFF) {
        _model->setCastShadow(false);
    } else {
        CC_ASSERTF(
            _shadowCastingMode == ModelShadowCastingMode::ON,
            "ShadowCastingMode %d is not supported.",
            static_cast<int>(_shadowCastingMode));
        _model->setCastShadow(true);
    }
}

void MeshRenderer::_updateReceiveShadow() {
    if (!_model) {
        return;
    }
    if (_shadowReceivingMode == ModelShadowReceivingMode::OFF) {
        _model->setReceiveShadow(false);
    } else {
        _model->setReceiveShadow(true);
    }
}

void MeshRenderer::onMobilityChanged() {
    _updateUseLightProbe();
}

void MeshRenderer::onUseLightProbeChanged() {
    _updateUseLightProbe();
}

void MeshRenderer::onReflectionProbeChanged() {
    _updateUseReflectionProbe();
    if (bakeSettings->getReflectionProbe() == ReflectionProbeType::BAKED_CUBEMAP) {
        // TODO(PatriceJiang): should call scene::ReflectionProbeManager::getInstance()
        se::accessor::invokeGlobal("cc.internal.reflectionProbeManager", "updateUseCubeModels", _model);
    } else if (bakeSettings->getReflectionProbe() == ReflectionProbeType::PLANAR_REFLECTION) {
        se::accessor::invokeGlobal("cc.internal.reflectionProbeManager", "updateUsePlanarModels", _model);
    }
}

void MeshRenderer::onBakeToReflectionProbeChanged() {
    _updateBakeToReflectionProbe();
}

void MeshRenderer::_updateUseLightProbe() {
    if (!_model) return;
    const auto *node = getNode();
    if (_mesh && node && node->getMobility() == MobilityMode::Movable && bakeSettings->isUseLightProbe()) {
        _model->setUseLightProbe(true);
    } else {
        _model->setUseLightProbe(false);
    }
}

bool MeshRenderer::_isBatchingEnabled() {
    for (auto &mat : _materials) {
        if (!mat) {
            continue;
        }
        const auto &passes = mat->getPasses();
        for (auto &pass : *passes) {
            if (pass->getBatchingScheme() != scene::BatchingSchemes::NONE) {
                return true;
            }
        }
    }
    return false;
}

void MeshRenderer::_updateUseReflectionProbe() {
    if (!_model) return;
    _model->setReflectionProbeType(static_cast<int>(bakeSettings->getReflectionProbe()));
    _updateReflectionProbeTexture();
}

void MeshRenderer::_updateBakeToReflectionProbe() {
    if (!_model) {
        return;
    }
    _model->setBakeToReflectionProbe(bakeSettings->isBakeToReflectionProbe());
}

void MeshRenderer::_watchMorphInMesh() {
    CC_SAFE_DESTROY(_morphInstance);

    if (!_enableMorph) return;

    if (!_mesh || !_mesh->getStruct().morph.has_value() || !_mesh->morphRendering) {
        return;
    }

    _morphInstance = _mesh->morphRendering->createInstance();
    const auto nSubMeshes = _mesh->getStruct().primitives.size();
    for (index_t iSubMesh = 0; iSubMesh < nSubMeshes; iSubMesh++) {
        _uploadSubMeshShapesWeights(iSubMesh);
    }

    if (_model) {
        auto *morphModel = dynamic_cast<MorphModel *>(_model.get());
        if (morphModel) {
            morphModel->setMorphRendering(_morphInstance);
        }
    }
}

void MeshRenderer::_initSubMeshShapesWeights() {
    _subMeshShapesWeights.clear();

    if (!_mesh) return;

    const auto &morph = _mesh->getStruct().morph;
    if (!morph.has_value()) return;

    const auto &commonWeights = morph->weights;
    const auto &subMeshMorphs = morph.value().subMeshMorphs;
    std::vector<MeshWeightsType> shapesWeights;

    for (const auto &subMeshMorphHolder : subMeshMorphs) {
        if (!subMeshMorphHolder.has_value()) {
            shapesWeights.emplace_back();
            continue;
        }

        const auto &subMeshMorph = subMeshMorphHolder.value();
        if (subMeshMorph.weights.has_value()) {
            shapesWeights.emplace_back(subMeshMorph.weights.value());
        } else if (commonWeights.has_value()) {
            CC_ASSERT(commonWeights.value().size() == subMeshMorph.targets.size());
            shapesWeights.emplace_back(morph->weights.value());
        } else {
            shapesWeights.emplace_back(subMeshMorph.targets.size());
        }
    }
    _subMeshShapesWeights = shapesWeights;
}

bool MeshRenderer::_validateShapeWeights() {
    if (!_mesh || !_mesh->getStruct().morph.has_value()) {
        return _subMeshShapesWeights.empty();
    }

    const auto &morph = _mesh->getStruct().morph;
    if (morph->subMeshMorphs.size() != _subMeshShapesWeights.size()) {
        return false;
    }
    for (index_t subMeshIdx = 0; subMeshIdx < _subMeshShapesWeights.size(); ++subMeshIdx) {
        auto shapeCount = _subMeshShapesWeights[subMeshIdx].size();

        const auto &subMeshMorphHolder = morph->subMeshMorphs[subMeshIdx];
        if (!subMeshMorphHolder.has_value()) {
            continue;
        }

        const auto &subMeshMorph = subMeshMorphHolder.value();
        if (subMeshMorph.targets.size() != shapeCount) {
            return false;
        }
    }
    return true;
}

void MeshRenderer::_uploadSubMeshShapesWeights(index_t subMeshIndex) {
    if (_morphInstance) {
        _morphInstance->setWeights(subMeshIndex, _subMeshShapesWeights[subMeshIndex]);
    }
}

#undef MR_PROBE_EVENTS
#undef MR_SCENE_GLOBAL

} // namespace cc
