/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#include "core/scene-graph/SceneGlobals.h"
#include "core/Root.h"
#include "gi/light-probe/LightProbe.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "scene/Ambient.h"
#include "scene/Fog.h"
#include "scene/Octree.h"
#include "scene/Shadow.h"
#include "scene/Skin.h"
#include "scene/Skybox.h"
#include "scene/PostSettings.h"

namespace cc {

SceneGlobals::SceneGlobals() {
    _ambientInfo = ccnew scene::AmbientInfo();
    _shadowInfo = ccnew scene::ShadowsInfo();
    _skyboxInfo = ccnew scene::SkyboxInfo();
    _fogInfo = ccnew scene::FogInfo();
    _octreeInfo = ccnew scene::OctreeInfo();
    _lightProbeInfo = ccnew gi::LightProbeInfo();
    _bakedWithStationaryMainLight = false;
    _bakedWithHighpLightmap = false;
    _skinInfo = ccnew scene::SkinInfo();
    _postSettingsInfo = ccnew scene::PostSettingsInfo();
}

void SceneGlobals::activate(Scene *scene) {
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

    if (_lightProbeInfo != nullptr && sceneData->getLightProbes() != nullptr) {
        _lightProbeInfo->activate(scene, sceneData->getLightProbes());
    }

    if (_skinInfo != nullptr && sceneData->getSkin()) {
        _skinInfo->activate(sceneData->getSkin());
    }

    if (_postSettingsInfo != nullptr && sceneData->getPostSettings()) {
        _postSettingsInfo->activate(sceneData->getPostSettings());
    }

    Root::getInstance()->onGlobalPipelineStateChanged();
}

void SceneGlobals::setAmbientInfo(scene::AmbientInfo *info) {
    _ambientInfo = info;
}

void SceneGlobals::setShadowsInfo(scene::ShadowsInfo *info) {
    _shadowInfo = info;
}

void SceneGlobals::setSkyboxInfo(scene::SkyboxInfo *info) {
    _skyboxInfo = info;
}

void SceneGlobals::setFogInfo(scene::FogInfo *info) {
    _fogInfo = info;
}

void SceneGlobals::setOctreeInfo(scene::OctreeInfo *info) {
    _octreeInfo = info;
}

void SceneGlobals::setLightProbeInfo(gi::LightProbeInfo *info) {
    _lightProbeInfo = info;
}

void SceneGlobals::setBakedWithStationaryMainLight(bool value) {
    _bakedWithStationaryMainLight = value;
}

void SceneGlobals::setBakedWithHighpLightmap(bool value) {
    _bakedWithHighpLightmap = value;
}

void SceneGlobals::setSkinInfo(scene::SkinInfo *info) {
    _skinInfo = info;
}

void SceneGlobals::setPostSettingsInfo(scene::PostSettingsInfo *info) {
    _postSettingsInfo = info;
}

} // namespace cc
