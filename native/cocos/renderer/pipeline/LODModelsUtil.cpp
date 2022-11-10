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

/**
 * @zh LOD所有级别中存储的model集合；包含多个LODGroup的所有LOD
 * @en The collection of models stored in all levels of LOD, All LODs containing multiple LODGroups.
 */
ccstd::unordered_map<scene::Model *, bool> modelsInAnyLODGroup;

/**
 * @zh 指定相机下，某一级LOD使用的model集合；可能包含多个LODGroup的某一级LOD
 * @en Specify the model set used by a level of LOD under the camera, LOD of a level that may contain multiple LODGroups.
 */
ccstd::unordered_map<scene::Model *, bool> visibleModelsByAnyLODGroup;

void LODModelsCachedUtils::updateCachedLODModels(const scene::RenderScene *scene, const scene::Camera *camera) {
    for (const auto &lodGroup : scene->getLODGroups()) {
        if (lodGroup->isEnabled()) {
            const auto &lodLevels = lodGroup->getLockedLODLevels();
            uint8_t count = lodLevels.size();
            // count == 0 will return to standard LOD processing.
            if (count > 0) {
                for (auto index = 0; index < lodGroup->getLodCount(); index++) {
                    const auto &lod = lodGroup->getLodDataArray()[index];
                    for (const auto &model : lod->getModels()) {
                        for (auto i = 0; i < count; i++) {
                            // The LOD level to use.
                            if (lodLevels[i] == index) {
                                auto *node = model->getNode();
                                if (node && node->isActive()) {
                                    visibleModelsByAnyLODGroup[model] = true;
                                    break;
                                }
                            }
                        }
                        modelsInAnyLODGroup[model] = true;
                    }
                }
                continue;
            }

            int8_t visIndex = lodGroup->getVisibleLODLevel(camera);
            for (auto index = 0; index < lodGroup->getLodCount(); index++) {
                const auto &lod = lodGroup->getLodDataArray()[index];
                for (const auto &model : lod->getModels()) {
                    auto *node = model->getNode();
                    if (visIndex == index && node && node->isActive()) {
                        visibleModelsByAnyLODGroup[model] = true;
                    }
                    modelsInAnyLODGroup[model] = true;
                }
            }
        }
    }
}

bool LODModelsCachedUtils::isLODModelCulled(scene::Model *model) {
    return modelsInAnyLODGroup[model] && !visibleModelsByAnyLODGroup[model];
}

void LODModelsCachedUtils::clearCachedLODModels() {
    modelsInAnyLODGroup.clear();
    visibleModelsByAnyLODGroup.clear();
}
} // namespace pipeline
} // namespace cc
