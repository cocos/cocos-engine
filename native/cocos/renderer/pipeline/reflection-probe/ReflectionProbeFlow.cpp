/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ReflectionProbeFlow.h"

#include "ReflectionProbeStage.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/RenderPipeline.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/ReflectionProbe.h"
#include "scene/ReflectionProbeManager.h"
namespace cc {
namespace pipeline {
RenderFlowInfo ReflectionProbeFlow::initInfo = {
    "ReflectionProbeFlow",
    static_cast<uint32_t>(0),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ReflectionProbeFlow::getInitializeInfo() { return ReflectionProbeFlow::initInfo; }

ReflectionProbeFlow::ReflectionProbeFlow() = default;
ReflectionProbeFlow::~ReflectionProbeFlow() = default;

bool ReflectionProbeFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    if (_stages.empty()) {
        auto *probeStage = ccnew ReflectionProbeStage;
        probeStage->initialize(ReflectionProbeStage::getInitializeInfo());
        _stages.emplace_back(probeStage);
    }
    return true;
}

void ReflectionProbeFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void ReflectionProbeFlow::render(scene::Camera *camera) {
    CC_PROFILE(ReflectionProbeFlowRender);
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto probes = scene::ReflectionProbeManager::getInstance()->getAllProbes();
    for (auto *probe : probes) {
#if CC_EDITOR
        if (camera->getCameraUsage() != scene::CameraUsage::SCENE_VIEW) {
            continue;
        }
#endif
        if (probe->needRender()) {
            renderStage(camera, probe);
        }
    }
}

void ReflectionProbeFlow::renderStage(scene::Camera *camera, scene::ReflectionProbe *probe) {
    for (auto &stage : _stages) {
        if (probe->getProbeType() == scene::ReflectionProbe::ProbeType::PLANAR) {
            auto *framebuffer = probe->getRealtimePlanarTexture()->getWindow()->getFramebuffer();
            auto *reflectionProbeStage = static_cast<ReflectionProbeStage *>(stage.get());
            reflectionProbeStage->setUsage(framebuffer, probe);
            reflectionProbeStage->render(camera);
        } else {
            //render the 6 faces of the cubemap
            for (uint32_t faceIdx = 0; faceIdx < 6; faceIdx++) {
                //update camera dirction
                probe->updateCameraDir(faceIdx);
                ccstd::vector<IntrusivePtr<cc::RenderTexture>> cubeFaces = probe->getBakedCubeTextures();
                if (cubeFaces.empty()) {
                    probe->setNeedRender(false);
                    return;
                }
                auto *reflectionProbeStage = static_cast<ReflectionProbeStage *>(stage.get());
                reflectionProbeStage->setUsage(cubeFaces[faceIdx]->getWindow()->getFramebuffer(), probe);
                reflectionProbeStage->render(camera);
            }
            probe->setNeedRender(false);
        }
    }
}

void ReflectionProbeFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
