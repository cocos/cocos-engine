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
        ccstd::unordered_map<const Camera*, bool> visibleCameras;
    };

    struct LODInfo {
        int8_t visibleLevel{-1};
        bool needUpdate{true};
    };

    explicit LodStateCache(RenderScene* scene) : _renderScene(scene) {};
    ~LodStateCache() override = default;

    void addCamera(const Camera *camera);

    void removeCamera(const Camera *camera);

    void addLodGroup(const LODGroup *lodGroup);

    void removeLodGroup(const LODGroup *lodGroup);

    void removeModel(const Model *model);

    void updateLodState();

    bool isLodModelCulled(const Camera *camera, const Model *model);

    void clearCache();

private:
    /**
     * @zh LOD使用的model集合；包含每个LODGroup的每一级LOD
     * @en The collection of models used by LOD; Each LOD of each LODGroup.
     */
    ccstd::unordered_map<const Model *, ModelInfo> _modelsIncludeByLODGroup;

    /**
     * @zh 指定相机下，LODGroup使用哪一级的LOD
     * @en Specify which level of LOD is used by the LODGroup under the camera.
     */
    ccstd::unordered_map<const Camera *, ccstd::unordered_map<const LODGroup *, LODInfo>> _visibleLodLevelsByAnyLODGroup;

    /**
     * @zh 上一帧添加的lodgroup
     * @en The lodgroup added in the previous frame.
     */
    ccstd::vector<const LODGroup *> _vecAddedLodGroup;

    RenderScene *_renderScene{nullptr};
};

RenderScene::RenderScene() = default;

RenderScene::~RenderScene() = default;

void RenderScene::activate() {
    const auto *sceneData = Root::getInstance()->getPipeline()->getPipelineSceneData();
    _octree = sceneData->getOctree();
}

bool RenderScene::initialize(const IRenderSceneInfo &info) {
    _name = info.name;
    _lodStateCache = ccnew LodStateCache(this);
    return true;
}

void RenderScene::addLODGroup(LODGroup *group) {
    group->attachToScene(this);
    _lodGroups.emplace_back(group);
    _lodStateCache->addLodGroup(group);
}

void RenderScene::removeLODGroup(LODGroup *group) {
    auto iter = std::find(_lodGroups.begin(), _lodGroups.end(), group);
    if (iter != _lodGroups.end()) {
        _lodStateCache->removeLodGroup(group);
        group->detachFromScene();
        _lodGroups.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid LODGroup.");
    }
}

void RenderScene::removeLODGroups() {
    for (const auto &group : _lodGroups) {
        _lodStateCache->removeLodGroup(group);
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
    _lodStateCache->addCamera(camera);
}

void RenderScene::removeCamera(Camera *camera) {
    auto iter = std::find(_cameras.begin(), _cameras.end(), camera);
    if (iter != _cameras.end()) {
        _lodStateCache->removeCamera(camera);
        (*iter)->detachFromScene();
        _cameras.erase(iter);
    }
}

void RenderScene::removeCameras() {
    for (const auto &camera : _cameras) {
        _lodStateCache->removeCamera(camera);
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
        _lodStateCache->removeModel(model);
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
        _lodStateCache->removeModel(model);
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

void LodStateCache::addCamera(const Camera *camera) {
    for (const auto &lodGroup : _renderScene->getLODGroups()) {
        auto layer = lodGroup->getNode()->getLayer();
        if ((camera->getVisibility() & layer) == layer) {
            if (_visibleLodLevelsByAnyLODGroup.count(camera) == 0) {
                _visibleLodLevelsByAnyLODGroup[camera] = {};
            }
            break;
        }
    }
}

void LodStateCache::removeCamera(const Camera *camera) {
    if (_visibleLodLevelsByAnyLODGroup.count(camera) != 0) {
        _visibleLodLevelsByAnyLODGroup.erase(camera);
    }
}

void LodStateCache::addLodGroup(const LODGroup *lodGroup) {
    _vecAddedLodGroup.push_back(lodGroup);

    for (const auto &camera : _renderScene->getCameras()) {
        if (_visibleLodLevelsByAnyLODGroup.count(camera)) {
            continue;
        }
        auto layer = lodGroup->getNode()->getLayer();
        if ((camera->getVisibility() & layer) == layer) {
            _visibleLodLevelsByAnyLODGroup[camera] = {};
        }
    }
}

void LodStateCache::removeLodGroup(const LODGroup *lodGroup) {
    for (auto index = 0; index < lodGroup->getLodCount(); index++) {
        const auto &lod = lodGroup->getLodDataArray()[index];
        for (const auto &model : lod->getModels()) {
            _modelsIncludeByLODGroup.erase(model);
        }
    }
}

void LodStateCache::removeModel(const Model *model) {
    if (_modelsIncludeByLODGroup.count(model) != 0) {
        _modelsIncludeByLODGroup.erase(model);
    }
}

void LodStateCache::updateLodState() {
    //insert vecAddedLodGroup's model into modelsIncludeByLODGroup
    for (const auto &addedLodGroup : _vecAddedLodGroup) {
        for (uint8_t index = 0; index < addedLodGroup->getLodCount(); index++) {
            const auto &lod = addedLodGroup->getLodDataArray()[index];
            for (const auto &model : lod->getModels()) {
                auto &modelInfo = _modelsIncludeByLODGroup[model];
                modelInfo.ownerLodLevel = index;
                modelInfo.lodGroup = addedLodGroup;
            }
        }
    }
    _vecAddedLodGroup.clear();

    //update current visible lod index
    for (const auto &lodGroup : _renderScene->getLODGroups()) {
        if (lodGroup->isEnabled()) {
            const auto &lodLevels = lodGroup->getLockedLODLevels();
            // count == 0 will return to standard LOD processing.
            if (!lodLevels.empty()) {
                if (lodGroup->getNode()->getChangedFlags() > 0) {
                    for (auto &visibleCamera : _visibleLodLevelsByAnyLODGroup) {
                        visibleCamera.second[lodGroup].needUpdate = true;
                    }
                }
                continue;
            }

            bool hasUpdated = false;
            for (auto &visibleCamera : _visibleLodLevelsByAnyLODGroup) {
                auto cameraChangeFlags = visibleCamera.first->getNode()->getChangedFlags();
                auto lodGroupChangeFlags = lodGroup->getNode()->getChangedFlags();
                auto &lodInfo = visibleCamera.second[lodGroup];
                if (cameraChangeFlags > 0 || lodGroupChangeFlags > 0 || lodInfo.needUpdate) {
                    if (lodInfo.needUpdate) {
                        lodInfo.needUpdate = false;
                    }

                    int8_t index = lodGroup->getVisibleLODLevel(visibleCamera.first);
                    if (index != lodInfo.visibleLevel) {
                        lodInfo.visibleLevel = index;
                        hasUpdated = true;
                    }
                }
            }
            if (hasUpdated) {
                for (auto index = 0; index < lodGroup->getLodCount(); index++) {
                    const auto &lod = lodGroup->getLodDataArray()[index];
                    for (const auto &model : lod->getModels()) {
                        auto &modelInfo = _modelsIncludeByLODGroup[model];
                        modelInfo.visibleCameras.clear();
                        if (model->getNode() && model->getNode()->isActive()) {
                            for (auto &visibleCamera : _visibleLodLevelsByAnyLODGroup) {
                                if (modelInfo.ownerLodLevel == visibleCamera.second[lodGroup].visibleLevel) {
                                    modelInfo.visibleCameras.emplace(visibleCamera.first, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

bool LodStateCache::isLodModelCulled(const Camera *camera, const Model *model) {
    const auto &itModel = _modelsIncludeByLODGroup.find(model);
    if (itModel == _modelsIncludeByLODGroup.end()) {
        return false;
    }

    const auto &modelInfo = itModel->second;
    const auto *lodGroup = modelInfo.lodGroup;
    if (lodGroup->getLockedLODLevels().empty()) {
        auto &visibleCamera = modelInfo.visibleCameras;
        return visibleCamera.count(camera) == 0;
    }

    const auto &visibleLodLevels = lodGroup->getLockedLODLevels();
    for (int8_t index : visibleLodLevels) {
        if (modelInfo.ownerLodLevel == index) {
            return !(model->getNode() && model->getNode()->isActive());
        }
    }

    return true;
}

void LodStateCache::clearCache() {
    _modelsIncludeByLODGroup.clear();
    _visibleLodLevelsByAnyLODGroup.clear();
    _vecAddedLodGroup.clear();
}

} // namespace scene
} // namespace cc
