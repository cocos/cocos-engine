/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "scene/RenderScene.h"
#include "scene/Camera.h"

#include <utility>
#include "3d/models/BakedSkinningModel.h"
#include "3d/models/SkinningModel.h"
#include "base/Log.h"
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "profiler/Profiler.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/DrawBatch2D.h"
#include "scene/LODGroup.h"
#include "scene/Model.h"
#include "scene/Octree.h"
#include "scene/SphereLight.h"
#include "scene/SpotLight.h"

namespace cc {
namespace scene {

class LodStateCache : public RefCounted {
public:
    struct ModelInfo {
        int8_t ownerLodLevel{-1};
        const LODGroup *lodGroup{nullptr};
    };

    LodStateCache(RenderScene* scene) : renderScene(scene) {};
    ~LodStateCache() = default;

    void onCameraAdded(const Camera *camera);

    void onCameraRemoved(const Camera *camera);

    void onLodGroupAdded(const LODGroup *lodGroup);

    void onLodGroupRemoved(const LODGroup *lodGroup);

    void onModelRemoved(const Model *model);

    void updateLodState();

    bool isLodModelCulled(const Camera *camera, const Model *model);

    void clearCache();

private:
    bool isLodGroupVisibleByCamera(const LODGroup *lodGroup, const Camera *camera);
    void registerCameraChange(const Camera *camera);
    /**
     * @zh LOD使用的model集合；可能包含多个LODGroup的每一级LOD
     * @en Collection of mods used by LODs; may contain multiple LODGs for each level of LOD.
     */
    ccstd::unordered_map<const Model *, ModelInfo> modelsByAnyLODGroup;

    /**
     * @zh 指定相机下，LODGroup使用哪一级的LOD
     * @en Specify which level of LOD is used by the LODGroup under the camera.
     */
    ccstd::unordered_map<const Camera *, ccstd::unordered_map<const LODGroup *, int8_t>> visibleLodLevelsByAnyLODGroup;

    /**
     * @zh 某个LODGroup的当前状态，是否需要更新等
     * @en Specify the current status of a LODGroup, whether it needs to be updated, etc.
     */
    ccstd::unordered_map<const LODGroup *, std::tuple<bool, Node::AncestorTransformChanged::EventID>> lodGroupStateMap;

    /**
     * @zh 指定相机的状态是否出现变化, 这里主要记录transform是否出现变化
     * @en Specify whether the state of the camera has changed or not, here it is mainly recorded whether the transform has changed or not.
     */
    ccstd::unordered_map<const Camera *, std::tuple<bool, Node::AncestorTransformChanged::EventID>> cameraStateMap;

    /**
     * @zh 上一帧添加的lodgroup
     * @en The lodgroup added in the previous frame.
     */
    ccstd::vector<const LODGroup *> vecAddedLodGroup;

    RenderScene *renderScene{nullptr};
};

RenderScene::RenderScene() = default;

RenderScene::~RenderScene() = default;

void RenderScene::activate() {
    const auto *sceneData = Root::getInstance()->getPipeline()->getPipelineSceneData();
    _octree = sceneData->getOctree();
}

bool RenderScene::initialize(const IRenderSceneInfo &info) {
    _name = info.name;
    _lodStateCache = new LodStateCache(this);
    return true;
}

void RenderScene::addLODGroup(LODGroup *group) {
    group->attachToScene(this);
    _lodGroups.emplace_back(group);
    _lodStateCache->onLodGroupAdded(group);
}

void RenderScene::removeLODGroup(LODGroup *group) {
    auto iter = std::find(_lodGroups.begin(), _lodGroups.end(), group);
    if (iter != _lodGroups.end()) {
        _lodStateCache->onLodGroupRemoved(group);
        group->detachFromScene();
        _lodGroups.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid LODGroup.");
    }
}

void RenderScene::removeLODGroups() {
    for (const auto &group : _lodGroups) {
        _lodStateCache->onLodGroupRemoved(group);
        group->detachFromScene();
    }
    _lodGroups.clear();
}

bool RenderScene::isCulledByLod(const Camera *camera, const Model *model) const {
    return _lodStateCache->isLodModelCulled(camera, model);
}

void RenderScene::setMainLight(DirectionalLight *dl) {
    _mainLight = dl;
}

void RenderScene::update(uint32_t stamp) {
    CC_PROFILE(RenderSceneUpdate);

    if (_mainLight) {
        _mainLight->update();
    }
    for (const auto &light : _sphereLights) {
        light->update();
    }
    for (const auto &spotLight : _spotLights) {
        spotLight->update();
    }
    for (const auto &model : _models) {
        if (model->isEnabled()) {
            model->updateTransform(stamp);
            model->updateUBOs(stamp);
            model->updateOctree();
        }
    }

    CC_PROFILE_OBJECT_UPDATE(Models, _models.size());
    CC_PROFILE_OBJECT_UPDATE(Cameras, _cameras.size());
    CC_PROFILE_OBJECT_UPDATE(DrawBatch2D, _batches.size());

    _lodStateCache->updateLodState();
}

void RenderScene::destroy() {
    removeCameras();
    removeSphereLights();
    removeSpotLights();
    removeLODGroups();
    removeModels();
    _lodStateCache->clearCache();
}

void RenderScene::addCamera(Camera *camera) {
    camera->attachToScene(this);
    _cameras.emplace_back(camera);
    _lodStateCache->onCameraAdded(camera);
}

void RenderScene::removeCamera(Camera *camera) {
    auto iter = std::find(_cameras.begin(), _cameras.end(), camera);
    if (iter != _cameras.end()) {
        _lodStateCache->onCameraRemoved(camera);
        (*iter)->detachFromScene();
        _cameras.erase(iter);
    }
}

void RenderScene::removeCameras() {
    for (const auto &camera : _cameras) {
        _lodStateCache->onCameraRemoved(camera);
        camera->detachFromScene();
        camera->destroy();
    }
    _cameras.clear();
}

void RenderScene::unsetMainLight(DirectionalLight *dl) {
    if (_mainLight == dl) {
        const auto &dlList = _directionalLights;
        if (!dlList.empty()) {
            setMainLight(dlList[dlList.size() - 1]);
            if (_mainLight->getNode() != nullptr) {
                uint32_t flag = _mainLight->getNode()->getChangedFlags();
                _mainLight->getNode()->setChangedFlags(flag | static_cast<uint32_t>(TransformBit::ROTATION));
            }
            return;
        }
        setMainLight(nullptr);
    }
}

void RenderScene::addDirectionalLight(DirectionalLight *dl) {
    dl->attachToScene(this);
    _directionalLights.emplace_back(dl);
}

void RenderScene::removeDirectionalLight(DirectionalLight *dl) {
    auto iter = std::find(_directionalLights.begin(), _directionalLights.end(), dl);
    if (iter != _directionalLights.end()) {
        (*iter)->detachFromScene();
        _directionalLights.erase(iter);
        return;
    }
}

void RenderScene::addSphereLight(SphereLight *light) {
    _sphereLights.emplace_back(light);
}

void RenderScene::removeSphereLight(SphereLight *sphereLight) {
    auto iter = std::find(_sphereLights.begin(), _sphereLights.end(), sphereLight);
    if (iter != _sphereLights.end()) {
        _sphereLights.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid sphere light.");
    }
}

void RenderScene::addSpotLight(SpotLight *spotLight) {
    _spotLights.emplace_back(spotLight);
}

void RenderScene::removeSpotLight(SpotLight *spotLight) {
    auto iter = std::find(_spotLights.begin(), _spotLights.end(), spotLight);
    if (iter != _spotLights.end()) {
        _spotLights.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid spot light.");
    }
}

void RenderScene::removeSphereLights() {
    for (const auto &sphereLight : _sphereLights) {
        sphereLight->detachFromScene();
    }
    _sphereLights.clear();
}

void RenderScene::removeSpotLights() {
    for (const auto &spotLight : _spotLights) {
        spotLight->detachFromScene();
    }
    _spotLights.clear();
}

void RenderScene::addModel(Model *model) {
    model->attachToScene(this);
    _models.emplace_back(model);
    if (_octree && _octree->isEnabled()) {
        _octree->insert(model);
    }
}

void RenderScene::removeModel(Model *model) {
    auto iter = std::find(_models.begin(), _models.end(), model);
    if (iter != _models.end()) {
        if (_octree && _octree->isEnabled()) {
            _octree->remove(*iter);
        }
        _lodStateCache->onModelRemoved(model);
        model->detachFromScene();
        _models.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid model.");
    }
}

void RenderScene::removeModels() {
    for (const auto &model : _models) {
        if (_octree && _octree->isEnabled()) {
            _octree->remove(model);
        }
        _lodStateCache->onModelRemoved(model);
        model->detachFromScene();
        CC_SAFE_DESTROY(model);
    }
    _models.clear();
}
void RenderScene::addBatch(DrawBatch2D *drawBatch2D) {
    _batches.emplace_back(drawBatch2D);
}

void RenderScene::removeBatch(DrawBatch2D *drawBatch2D) {
    auto iter = std::find(_batches.begin(), _batches.end(), drawBatch2D);
    if (iter != _batches.end()) {
        _batches.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid DrawBatch2D.");
    }
}

void RenderScene::removeBatches() {
    _batches.clear();
}

void RenderScene::updateOctree(Model *model) {
    if (_octree && _octree->isEnabled()) {
        _octree->update(model);
    }
}

void RenderScene::onGlobalPipelineStateChanged() {
    for (const auto &model : _models) {
        model->onGlobalPipelineStateChanged();
    }
}

bool LodStateCache::isLodGroupVisibleByCamera(const LODGroup *lodGroup, const Camera *camera) {
    auto layer = lodGroup->getNode()->getLayer();
    return (camera->getVisibility() & layer) == layer;
}

void LodStateCache::registerCameraChange(const Camera *camera) {
    std::get<1>(cameraStateMap[camera]) = camera->getNode()->on<cc::Node::AncestorTransformChanged>(
            [camera, this](cc::Node * /* emitter*/, cc::TransformBit /*transformBit*/) {
                std::get<0>(cameraStateMap[camera]) = true;
            });
}

void LodStateCache::onCameraAdded(const Camera *camera) {
    bool needRegisterChanged = false;
    for (const auto &lodGroupState : lodGroupStateMap) {
        if (isLodGroupVisibleByCamera(lodGroupState.first, camera)) {
            needRegisterChanged = true;
            break;
        }
    }

    if (needRegisterChanged) {
        registerCameraChange(camera);
    }
}

void LodStateCache::onCameraRemoved(const Camera *camera) {
    if (cameraStateMap.count(camera) == 0) {
        return;
    }
    camera->getNode()->off(std::get<1>(cameraStateMap[camera]));
}

void LodStateCache::onLodGroupAdded(const LODGroup *lodGroup) {
    std::get<1>(lodGroupStateMap[lodGroup]) = lodGroup->getNode()->on<cc::Node::AncestorTransformChanged>(
        [lodGroup, this](cc::Node * /* emitter*/, cc::TransformBit /*transformBit*/) {
            std::get<0>(lodGroupStateMap[lodGroup]) = true;
        });
    std::get<0>(lodGroupStateMap[lodGroup]) = true;
    vecAddedLodGroup.push_back(lodGroup);

    for (const auto &camera : renderScene->getCameras()) {
        if (cameraStateMap.count(camera)) {
            continue;
        }
        if (isLodGroupVisibleByCamera(lodGroup, camera)) {
            registerCameraChange(camera);
        }
    }
}

void LodStateCache::onLodGroupRemoved(const LODGroup *lodGroup) {
    if (lodGroupStateMap.count(lodGroup) == 0) {
        return;
    }
    lodGroup->getNode()->off(std::get<1>(lodGroupStateMap[lodGroup]));

    for (auto index = 0; index < lodGroup->getLodCount(); index++) {
        const auto &lod = lodGroup->getLodDataArray()[index];
        for (const auto &model : lod->getModels()) {
            modelsByAnyLODGroup.erase(model);
        }
    }
}

void LodStateCache::onModelRemoved(const Model *model) {
    if (modelsByAnyLODGroup.count(model) != 0) {
        modelsByAnyLODGroup.erase(model);
    }
}

void LodStateCache::updateLodState() {
    //insert vecAddedLodGroup's model into modelsByAnyLODGroup
    for (const auto &addedLodGroup : vecAddedLodGroup) {
        for (auto index = 0; index < addedLodGroup->getLodCount(); index++) {
            const auto &lod = addedLodGroup->getLodDataArray()[index];
            for (const auto &model : lod->getModels()) {
                auto &modelInfo = modelsByAnyLODGroup[model];
                modelInfo.ownerLodLevel = index;
                modelInfo.lodGroup = addedLodGroup;
            }
        }
    }
    vecAddedLodGroup.clear();

    //update current visible lod index
    for (const auto &lodGroup : renderScene->getLODGroups()) {
        if (lodGroup->isEnabled()) {
            const auto &lodLevels = lodGroup->getLockedLODLevels();
            uint8_t count = lodLevels.size();
            // count == 0 will return to standard LOD processing.
            if (count > 0) {
                std::get<0>(lodGroupStateMap[lodGroup]) = true;
                continue;
            }

            for (const auto &cameraState : cameraStateMap) {
                bool isCameraTransformChanged = std::get<0>(cameraState.second);
                auto needUpdate = std::get<0>(lodGroupStateMap[lodGroup]);
                if (isCameraTransformChanged || needUpdate) {
                    visibleLodLevelsByAnyLODGroup[cameraState.first][lodGroup] = lodGroup->getVisibleLODLevel(cameraState.first);
                }
            }

            if (std::get<0>(lodGroupStateMap[lodGroup])) {
                std::get<0>(lodGroupStateMap[lodGroup]) = false;
            }
        }

        for (auto &cameraState : cameraStateMap) {
            std::get<0>(cameraState.second) = false;
        }
    }
}

bool LodStateCache::isLodModelCulled(const Camera *camera, const Model *model) {
    if (modelsByAnyLODGroup.count(model) == 0) {
        return false;
    }
    if (visibleLodLevelsByAnyLODGroup.count(camera) == 0) {
        return true;
    }

    const auto &modelInfo = modelsByAnyLODGroup[model];
    const auto *lodGroup = modelInfo.lodGroup;

    const auto &visibleLodLevels = lodGroup->getLockedLODLevels();
    if (visibleLodLevels.size() > 0) {
        for (uint8_t index : visibleLodLevels) {
            if (modelInfo.ownerLodLevel == index) {
                return !(model->getNode() && model->getNode()->isActive());
            }
        }

        return true;
    }

    const auto &lodGroupMap = visibleLodLevelsByAnyLODGroup[camera];
    if (modelInfo.ownerLodLevel == lodGroupMap.at(lodGroup)) {
        return !(model->getNode() && model->getNode()->isActive());
    }


    return true;
}

void LodStateCache::clearCache() {
    cameraStateMap.clear();
    lodGroupStateMap.clear();
    modelsByAnyLODGroup.clear();
    visibleLodLevelsByAnyLODGroup.clear();
    vecAddedLodGroup.clear();
}

} // namespace scene
} // namespace cc
