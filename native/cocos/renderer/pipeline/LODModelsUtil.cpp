/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "LODModelsUtil.h"

#include "scene/Camera.h"
#include "scene/LODGroup.h"
#include "scene/Model.h"
#include "scene/RenderScene.h"

namespace cc {
namespace pipeline {

namespace {

struct LODInfo {
    int8_t visibleLevel{-1};
    bool needUpdate{true};
    Node::AncestorTransformChanged::EventID eventId{};
};

/**
 * @zh LOD所有级别中存储的model集合；包含多个LODGroup的所有LOD
 * @en The collection of models stored in all levels of LOD, All LODs containing multiple LODGroups.
 */
ccstd::unordered_map<const scene::Model *, bool> modelsInAnyLODGroup;

/**
 * @zh 指定相机下，某一级LOD使用的model集合；可能包含多个LODGroup的某一级LOD
 * @en Specify the model set used by a level of LOD under the camera, LOD of a level that may contain multiple LODGroups.
 */
ccstd::unordered_map<const scene::Camera *, ccstd::unordered_map<const scene::Model *, bool>> visibleModelsByAnyLODGroup;

/**
 * @zh 指定相机下，某个LODGroup的当前状态，如：当前使用哪级的LOD，是否需要更新等
 * @en Specify the current status of a LODGroup under the camera, such as: which level of LOD is currently in use, whether it needs to be updated, etc.
 */
ccstd::unordered_map<const scene::Camera *, ccstd::unordered_map<const scene::LODGroup *, LODInfo>> lodGroupStateMap;

/**
 * @zh 指定相机的状态是否出现变化, 这里主要记录transform是否出现变化
 * @en Specify whether the state of the camera has changed or not, here it is mainly recorded whether the transform has changed or not.
 */
ccstd::unordered_map<const scene::Camera *, std::tuple<bool, Node::AncestorTransformChanged::EventID>> cameraStateMap;

} // namespace

void LODModelsCachedUtils::updateCachedLODModels(const scene::RenderScene *scene, const scene::Camera *camera) {
    bool isCameraTransformChanged = false;
    if (cameraStateMap.count(camera) == 0) {
        isCameraTransformChanged = true;
        std::get<1>(cameraStateMap[camera]) = camera->getNode()->on<cc::Node::AncestorTransformChanged>(
            [camera](cc::Node * /* emitter*/, cc::TransformBit  /*transformBit*/) {
                std::get<0>(cameraStateMap[camera]) = true;
            });
    }
    auto &visibleModels = visibleModelsByAnyLODGroup[camera];
    auto &lodInfoMap = lodGroupStateMap[camera];

    for (const auto &lodGroup : scene->getLODGroups()) {
        if (lodGroup->isEnabled()) {
            bool lodInfoExist = lodInfoMap.count(lodGroup) > 0;
            auto &lodInfo = lodInfoMap[lodGroup];
            if (!lodInfoExist) {
                lodInfo.eventId = lodGroup->getNode()->on<cc::Node::AncestorTransformChanged>(
                    [lodGroup](cc::Node * /* emitter*/, cc::TransformBit  /*transformBit*/) {
                        for (auto &cameraKV : lodGroupStateMap) {
                            cameraKV.second[lodGroup].needUpdate = true;
                        }
                    });
            }

            const auto &lodLevels = lodGroup->getLockedLODLevels();
            uint8_t count = lodLevels.size();
            // count == 0 will return to standard LOD processing.
            if (count > 0) {
                lodInfo.needUpdate = true;
                lodInfo.visibleLevel = -1;

                for (auto index = 0; index < lodGroup->getLodCount(); index++) {
                    const auto &lod = lodGroup->getLodDataArray()[index];
                    for (const auto &model : lod->getModels()) {
                        for (auto i = 0; i < count; i++) {
                            // The LOD level to use.
                            if (lodLevels[i] == index) {
                                auto *node = model->getNode();
                                if (node && node->isActive()) {
                                    visibleModels[model] = true;
                                    break;
                                }
                            } else {
                                visibleModels[model] = false;
                            }
                        }
                        modelsInAnyLODGroup[model] = true;
                    }
                }
                continue;
            }

            if (isCameraTransformChanged || lodInfo.needUpdate) {
                lodInfo.needUpdate = false;
                int8_t visIndex = lodGroup->getVisibleLODLevel(camera);
                if (visIndex == lodInfo.visibleLevel && visIndex != -1) {
                    continue; // do nothing
                }
                if (visIndex != lodInfo.visibleLevel) {
                    lodInfo.visibleLevel = visIndex;
                    for (auto index = 0; index < lodGroup->getLodCount(); index++) {
                        const auto &lod = lodGroup->getLodDataArray()[index];
                        for (const auto &model : lod->getModels()) {
                            auto *node = model->getNode();
                            if (visIndex == index && node && node->isActive()) {
                                visibleModels[model] = true;
                            } else {
                                visibleModels[model] = false;
                            }
                            modelsInAnyLODGroup[model] = true;
                        }
                    }
                }
            }
        }
    }
    if (isCameraTransformChanged) {
        std::get<0>(cameraStateMap[camera]) = false;
    }
}

bool LODModelsCachedUtils::isLODModelCulled(const scene::Camera *camera, const scene::Model *model) {
    auto &visibleModels = visibleModelsByAnyLODGroup[camera];
    return modelsInAnyLODGroup[model] && !visibleModels[model];
}

void LODModelsCachedUtils::clearCachedLODModels() {
    for (const auto &kv : cameraStateMap) {
        kv.first->getNode()->off(std::get<1>(kv.second));
    }
    cameraStateMap.clear();
    for (const auto &cameraKV : lodGroupStateMap) {
        for (const auto &lodInfoKV : cameraKV.second) {
            lodInfoKV.first->getNode()->off(lodInfoKV.second.eventId);
        }
    }
    lodGroupStateMap.clear();
    modelsInAnyLODGroup.clear();
    visibleModelsByAnyLODGroup.clear();
}
} // namespace pipeline
} // namespace cc
