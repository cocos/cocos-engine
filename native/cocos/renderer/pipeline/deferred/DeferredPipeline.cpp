/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.
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

#include "DeferredPipeline.h"
#include "../GlobalDescriptorSetManager.h"
#include "../PipelineUBO.h"
#include "../RenderPipeline.h"
#include "../SceneCulling.h"
#include "../helper/Utils.h"
#include "../shadow/ShadowFlow.h"
#include "DeferredPipelineSceneData.h"
#include "MainFlow.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXSwapchain.h"
#include "gfx-base/states/GFXTextureBarrier.h"
#include "pipeline/ClusterLightCulling.h"
#include "profiler/Profiler.h"
#include "scene/RenderWindow.h"

namespace cc {
namespace pipeline {

#define TO_VEC3(dst, src, offset)  \
    dst[offset] = (src).x;         \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z;
#define TO_VEC4(dst, src, offset)  \
    dst[offset] = (src).x;         \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z; \
    (dst)[(offset) + 3] = (src).w;

DeferredPipeline::DeferredPipeline() {
    _pipelineSceneData = ccnew DeferredPipelineSceneData();
}

DeferredPipeline::~DeferredPipeline() = default;

framegraph::StringHandle DeferredPipeline::fgStrHandleGbufferTexture[GBUFFER_COUNT] = {
    framegraph::FrameGraph::stringToHandle("gbufferAlbedoTexture"),
    framegraph::FrameGraph::stringToHandle("gbufferNormalTexture"),
    framegraph::FrameGraph::stringToHandle("gbufferEmissiveTexture")};

framegraph::StringHandle DeferredPipeline::fgStrHandleGbufferPass = framegraph::FrameGraph::stringToHandle("deferredGbufferPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleLightingPass = framegraph::FrameGraph::stringToHandle("deferredLightingPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleTransparentPass = framegraph::FrameGraph::stringToHandle("deferredTransparentPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleSsprPass = framegraph::FrameGraph::stringToHandle("deferredSSPRPass");

bool DeferredPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.empty()) {
        auto *shadowFlow = ccnew ShadowFlow;
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto *mainFlow = ccnew MainFlow;
        mainFlow->initialize(MainFlow::getInitializeInfo());
        _flows.emplace_back(mainFlow);
    }
    return true;
}

bool DeferredPipeline::activate(gfx::Swapchain *swapchain) {
    _macros["CC_PIPELINE_TYPE"] = 1;

    if (!RenderPipeline::activate(swapchain)) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer(swapchain)) {
        CC_LOG_ERROR("DeferredPipeline startup failed!");
        return false;
    }

    return true;
}

void DeferredPipeline::render(const ccstd::vector<scene::Camera *> &cameras) {
    CC_PROFILE(DeferredPipelineRender);
#if CC_USE_GEOMETRY_RENDERER
    updateGeometryRenderer(cameras); // for capability
#endif

    auto *device = gfx::Device::getInstance();
    bool enableOcclusionQuery = isOcclusionQueryEnabled();
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
        sceneCulling(this, camera);

        if (_clusterEnabled) {
            _clusterComp->clusterLightCulling(camera);
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

void DeferredPipeline::onGlobalPipelineStateChanged() {
    _pipelineSceneData->updatePipelineSceneData();
}

bool DeferredPipeline::activeRenderer(gfx::Swapchain *swapchain) {
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

    unsigned int ibData[] = {0, 1, 2, 1, 3, 2};
    _quadIB->update(ibData, sizeof(ibData));

    _width = swapchain->getWidth();
    _height = swapchain->getHeight();

    if (_clusterEnabled) {
        // cluster component resource
        _clusterComp = ccnew ClusterLightCulling(this);
        _clusterComp->initialize(this->getDevice());
    }

    return true;
}

bool DeferredPipeline::destroy() {
    destroyQuadInputAssembler();

    for (auto &it : _renderPasses) {
        it.second->destroy();
    }
    _renderPasses.clear();

    _queryPools.clear();
    _commandBuffers.clear();

    CC_SAFE_DELETE(_clusterComp);

    return RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
