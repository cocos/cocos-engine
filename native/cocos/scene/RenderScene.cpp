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
#include "scene/Model.h"
#include "scene/Octree.h"
#include "scene/SphereLight.h"
#include "scene/SpotLight.h"
#include "scene/RangedDirectionalLight.h"

namespace cc {
namespace scene {
RenderScene::RenderScene() = default;

RenderScene::~RenderScene() = default;

void RenderScene::activate() {
    const auto *sceneData = Root::getInstance()->getPipeline()->getPipelineSceneData();
    _octree = sceneData->getOctree();
}

bool RenderScene::initialize(const IRenderSceneInfo &info) {
    _name = info.name;
    return true;
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
    for (const auto &rangedDirLight : _rangedDirLights) {
        rangedDirLight->update();
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
}

void RenderScene::destroy() {
    removeCameras();
    removeSphereLights();
    removeSpotLights();
    removeRangedDirLights();
    removeModels();
}

void RenderScene::addCamera(Camera *camera) {
    camera->attachToScene(this);
    _cameras.emplace_back(camera);
}

void RenderScene::removeCamera(Camera *camera) {
    const auto iter = std::find(_cameras.begin(), _cameras.end(), camera);
    if (iter != _cameras.end()) {
        (*iter)->detachFromScene();
        _cameras.erase(iter);
    }
}

void RenderScene::removeCameras() {
    for (const auto &camera : _cameras) {
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
    const auto iter = std::find(_directionalLights.begin(), _directionalLights.end(), dl);
    if (iter != _directionalLights.end()) {
        (*iter)->detachFromScene();
        _directionalLights.erase(iter);
    }
}

void RenderScene::addSphereLight(SphereLight *light) {
    _sphereLights.emplace_back(light);
}

void RenderScene::removeSphereLight(SphereLight *sphereLight) {
    const auto iter = std::find(_sphereLights.begin(), _sphereLights.end(), sphereLight);
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
    const auto iter = std::find(_spotLights.begin(), _spotLights.end(), spotLight);
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

void RenderScene::addRangedDirLight(RangedDirectionalLight *rangedDirLight) {
    _rangedDirLights.emplace_back(rangedDirLight);
}

void RenderScene::removeRangedDirLight(RangedDirectionalLight *rangedDirLight) {
    const auto iter = std::find(_rangedDirLights.begin(), _rangedDirLights.end(), rangedDirLight);
    if (iter != _rangedDirLights.end()) {
        _rangedDirLights.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid ranged directional light.");
    }
}

void RenderScene::removeRangedDirLights() {
    for (const auto &rangedDirLight : _rangedDirLights) {
        rangedDirLight->detachFromScene();
    }
    _rangedDirLights.clear();
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

} // namespace scene
} // namespace cc
