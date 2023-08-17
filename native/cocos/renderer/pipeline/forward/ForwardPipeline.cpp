/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ForwardPipeline.h"
#include "../GlobalDescriptorSetManager.h"
#include "../PipelineSceneData.h"
#include "../PipelineUBO.h"
#include "../SceneCulling.h"
#include "../helper/Utils.h"
#include "../reflection-probe/ReflectionProbeFlow.h"
#include "../shadow/ShadowFlow.h"
#include "ForwardFlow.h"
#include "gfx-base/GFXDevice.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/RenderScene.h"

namespace cc {
namespace pipeline {
namespace {
#define TO_VEC3(dst, src, offset)  \
    (dst)[(offset) + 0] = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z;
#define TO_VEC4(dst, src, offset)  \
    (dst)[(offset) + 0] = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z; \
    (dst)[(offset) + 3] = (src).w;
} // namespace

ForwardPipeline::ForwardPipeline() {
    _pipelineSceneData = ccnew PipelineSceneData();
}

framegraph::StringHandle ForwardPipeline::fgStrHandleForwardPass = framegraph::FrameGraph::stringToHandle("forwardPass");

bool ForwardPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.empty()) {
        auto *shadowFlow = ccnew ShadowFlow;
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto *reflectionProbeFlow = ccnew ReflectionProbeFlow();
        reflectionProbeFlow->initialize(ReflectionProbeFlow::getInitializeInfo());
        _flows.emplace_back(reflectionProbeFlow);

        auto *forwardFlow = ccnew ForwardFlow;
        forwardFlow->initialize(ForwardFlow::getInitializeInfo());
        _flows.emplace_back(forwardFlow);
    }

    return true;
}

bool ForwardPipeline::activate(gfx::Swapchain *swapchain) {
    _macros["CC_PIPELINE_TYPE"] = 0;

    if (!RenderPipeline::activate(swapchain)) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer(swapchain)) {
        CC_LOG_ERROR("ForwardPipeline startup failed!");
        return false;
    }

    return true;
}

void ForwardPipeline::render(const ccstd::vector<scene::Camera *> &cameras) {
    CC_PROFILE(ForwardPipelineRender);
#if CC_USE_GEOMETRY_RENDERER
    updateGeometryRenderer(cameras); // for capability
#endif

    auto *device = gfx::Device::getInstance();
    const bool enableOcclusionQuery = isOcclusionQueryEnabled();
    if (enableOcclusionQuery) {
        device->getQueryPoolResults(_queryPools[0]);
    }

    _commandBuffers[0]->begin();

    if (enableOcclusionQuery) {
        _commandBuffers[0]->resetQueryPool(_queryPools[0]);
    }

    _pipelineUBO->updateMultiCameraUBO(_globalDSManager, cameras);
    _pipelineUBO->updateGlobalUBO(cameras[0]);

    ensureEnoughSize(cameras);
    decideProfilerCamera(cameras);

    for (auto *camera : cameras) {
        bool isCullingEnable = camera->isCullingEnabled();
        if (isCullingEnable) {
            validPunctualLightsCulling(this, camera);
            sceneCulling(this, camera);
        }
        for (auto const &flow : _flows) {
            flow->render(camera);
        }
        _fg.compile();
        _fg.execute();
        _fg.reset();
        _pipelineUBO->incCameraUBOOffset();
    }

    if (enableOcclusionQuery) {
        _commandBuffers[0]->completeQueryPool(_queryPools[0]);
    }

    _commandBuffers[0]->end();
    _device->flushCommands(_commandBuffers);
    _device->getQueue()->submit(_commandBuffers);

    RenderPipeline::framegraphGC();
}

bool ForwardPipeline::activeRenderer(gfx::Swapchain *swapchain) {
    _commandBuffers.push_back(_device->getCommandBuffer());
    _queryPools.push_back(_device->getQueryPool());

    gfx::Sampler *const sampler = getGlobalDSManager()->getPointSampler();

    // Main light sampler binding
    _descriptorSet->bindSampler(SHADOWMAP::BINDING, sampler);
    _descriptorSet->bindSampler(SPOTSHADOWMAP::BINDING, sampler);
    _descriptorSet->update();

    // update global defines when all states initialized.
    _macros["CC_USE_HDR"] = static_cast<bool>(_pipelineSceneData->isHDR());
    _macros["CC_SUPPORT_FLOAT_TEXTURE"] = hasAnyFlags(_device->getFormatFeatures(gfx::Format::RGBA32F), gfx::FormatFeature::RENDER_TARGET | gfx::FormatFeature::SAMPLED_TEXTURE);
    _macros["CC_USE_DEBUG_VIEW"] = static_cast<int32_t>(0);

    // step 2 create index buffer
    uint32_t ibStride = 4;
    uint32_t ibSize = ibStride * 6;
    if (_quadIB == nullptr) {
        _quadIB = _device->createBuffer({gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
                                         gfx::MemoryUsageBit::DEVICE, ibSize, ibStride});
    }

    if (_quadIB == nullptr) {
        return false;
    }

    uint32_t ibData[] = {0, 1, 2, 1, 3, 2};
    _quadIB->update(ibData, sizeof(ibData));

    _width = swapchain->getWidth();
    _height = swapchain->getHeight();
    return true;
}

bool ForwardPipeline::destroy() {
    destroyQuadInputAssembler();
    for (auto &it : _renderPasses) {
        CC_SAFE_DESTROY_AND_DELETE(it.second);
    }
    _renderPasses.clear();

    _queryPools.clear();
    _commandBuffers.clear();

    return RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
