/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "ReflectionProbeFlow.h"

#include "ReflectionProbeStage.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline//Define.h"
#include "pipeline/GlobalDescriptorSetManager.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/RenderPipeline.h"
#include "pipeline/SceneCulling.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/RenderScene.h"
#include "pipeline/ReflectionProbeManager.h"
#include "scene/ReflectionProbe.h"
namespace cc {
namespace pipeline {
ccstd::unordered_map<ccstd::hash_t, IntrusivePtr<cc::gfx::RenderPass>> ReflectionProbeFlow::renderPassHashMap;

RenderFlowInfo ReflectionProbeFlow::initInfo = {
    "ReflectionProbeFlow",
    static_cast<uint32_t>(ForwardFlowPriority::SHADOW),
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
    if (camera->getCameraType() != scene::CameraType::REFLECTION_PROBE) {
        return;
    }
    //const probe = ReflectionProbeManager.probeManager.getProbeByCamera(camera);
    renderStage(camera, nullptr);
}

void ReflectionProbeFlow::renderStage(scene::Camera *camera, gfx::Framebuffer *framebuffer) {
    for (auto &stage : _stages) {
        auto *reflectionProbeStage = static_cast<ReflectionProbeStage *>(stage.get());
        reflectionProbeStage->setUsage(framebuffer);
        reflectionProbeStage->render(camera);

        const scene::ReflectionProbe *const probe = ReflectionProbeManager::getInstance()->getProbeByCamera(camera);
        const scene::RenderScene *const scene = camera->getScene();
        for (const auto &model : scene->getModels()) {
            // filter model by view visibility
            if (model->isEnabled()) {
                //model->updateReflctionProbePlanarMap(probe->getRealtimePlanarTexture()->getGFXTexture());
                //const auto visibility = camera->getVisibility();
                //const auto *const node = model->getNode();

              /*  if ((model->getNode() && ((visibility & node->getLayer()) == node->getLayer())) ||
                    (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
                    const auto *modelWorldBounds = model->getWorldBounds();
                    if (!modelWorldBounds) {
                        continue;
                    }
                }*/
            }
        }

    }
}

void ReflectionProbeFlow::destroy() {
    _renderPass = nullptr;
    renderPassHashMap.clear();

    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
