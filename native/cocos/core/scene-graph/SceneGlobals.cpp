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

#include "core/scene-graph/SceneGlobals.h"
#include "core/Root.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "scene/Ambient.h"
#include "scene/Fog.h"
#include "scene/Octree.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"

namespace cc {

SceneGlobals::SceneGlobals() {
    _ambientInfo = new scene::AmbientInfo();
    _shadowInfo  = new scene::ShadowsInfo();
    _skyboxInfo  = new scene::SkyboxInfo();
    _fogInfo     = new scene::FogInfo();
    _octreeInfo  = new scene::OctreeInfo();
}

void SceneGlobals::activate() {
    auto *sceneData = Root::getInstance()->getPipeline()->getPipelineSceneData();
    if (_ambientInfo != nullptr) {
        _ambientInfo->activate(sceneData->getAmbient());
    }

    if (_skyboxInfo != nullptr) {
        _skyboxInfo->activate(sceneData->getSkybox());
    }

    if (_shadowInfo != nullptr) {
        _shadowInfo->activate(sceneData->getShadows());
    }

    if (_fogInfo != nullptr) {
        _fogInfo->activate(sceneData->getFog());
    }

    if (_octreeInfo != nullptr) {
        _octreeInfo->activate(sceneData->getOctree());
    }
}

void SceneGlobals::setAmbientInfo(scene::AmbientInfo *info) { _ambientInfo = info; }
void SceneGlobals::setShadowsInfo(scene::ShadowsInfo *info) { _shadowInfo = info; }
void SceneGlobals::setSkyboxInfo(scene::SkyboxInfo *info) { _skyboxInfo = info; }
void SceneGlobals::setFogInfo(scene::FogInfo *info) { _fogInfo = info; }
void SceneGlobals::setOctreeInfo(scene::OctreeInfo *info) { _octreeInfo = info; }

} // namespace cc
