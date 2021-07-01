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

#include <utility>
#include "base/Log.h"

namespace cc {
namespace scene {

void RenderScene::update(uint32_t stamp) {
    if (_directionalLight) {
        _directionalLight->update();
    }
    for (SphereLight *light : _sphereLights) {
        light->update();
    }
    for (SpotLight *spotLight : _spotLights) {
        spotLight->update();
    }
    for (auto *model : _models) {
        if (model->getEnabled()) {
            model->updateTransform(stamp);
            model->updateUBOs(stamp);
        }
    }
}

void RenderScene::addSphereLight(SphereLight *light) {
    _sphereLights.push_back(light);
}

void RenderScene::removeSphereLight(SphereLight *sphereLight) {
    auto iter = std::find(_sphereLights.begin(), _sphereLights.end(), sphereLight);
    if (iter != _sphereLights.end()) {
        _sphereLights.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid sphere light.");
    }
}

void RenderScene::removeSphereLights() {
    _sphereLights.clear();
}

void RenderScene::addSpotLight(SpotLight *spotLight) {
    _spotLights.push_back(spotLight);
}

void RenderScene::removeSpotLight(SpotLight *spotLight) {
    auto iter = std::find(_spotLights.begin(), _spotLights.end(), spotLight);
    if (iter != _spotLights.end()) {
        _spotLights.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid spot light.");
    }
}

void RenderScene::removeSpotLights() {
    _sphereLights.clear();
}

void RenderScene::addModel(Model *model) {
    _models.push_back(model);
}

void RenderScene::addBakedSkinningModel(BakedSkinningModel *bakedSkinModel) {
    _models.push_back(bakedSkinModel);
}

void RenderScene::addSkinningModel(SkinningModel *skinModel) {
    _models.push_back(skinModel);
}

void RenderScene::removeModel(Model *model) {
    auto iter = std::find(_models.begin(), _models.end(), model);
    if (iter != _models.end()) {
        _models.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid model.");
    }
}

void RenderScene::removeModels() {
    _models.clear();
}

void RenderScene::updateBatches(std::vector<DrawBatch2D *> &&batches) {
    _drawBatch2Ds = batches;
}

void RenderScene::addBatch(DrawBatch2D *drawBatch2D) {
    _drawBatch2Ds.push_back(drawBatch2D);
}

void RenderScene::removeBatch(DrawBatch2D *drawBatch2D) {
    auto iter = std::find(_drawBatch2Ds.begin(), _drawBatch2Ds.end(), drawBatch2D);
    if (iter != _drawBatch2Ds.end()) {
        _drawBatch2Ds.erase(iter);
    } else {
        CC_LOG_WARNING("Try to remove invalid DrawBatch2D.");
    }
}

void RenderScene::removeBatch(uint32_t index) {
    if (index >= static_cast<uint32_t>(_drawBatch2Ds.size())) {
        return;
    }

    removeBatch(_drawBatch2Ds[index]);
}

void RenderScene::removeBatches() {
    _drawBatch2Ds.clear();
}

} // namespace scene
} // namespace cc
