/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "ForwardPipeline.h"
#include "../SceneCulling.h"
#include "../shadow/ShadowFlow.h"
#include "ForwardFlow.h"
#include "gfx-base/GFXDevice.h"
#include "scene/RenderScene.h"
#include "../helper/Utils.h"

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

framegraph::StringHandle ForwardPipeline::fgStrHandleForwardColorTexture = framegraph::FrameGraph::stringToHandle("forwardColorTexture");
framegraph::StringHandle ForwardPipeline::fgStrHandleForwardDepthTexture = framegraph::FrameGraph::stringToHandle("forwardDepthTexture");
framegraph::StringHandle ForwardPipeline::fgStrHandleForwardPass         = framegraph::FrameGraph::stringToHandle("forwardPass");

bool ForwardPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.empty()) {
        auto *shadowFlow = CC_NEW(ShadowFlow);
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto *forwardFlow = CC_NEW(ForwardFlow);
        forwardFlow->initialize(ForwardFlow::getInitializeInfo());
        _flows.emplace_back(forwardFlow);
    }

    return true;
}

bool ForwardPipeline::activate(gfx::Swapchain *swapchain) {
    _macros.setValue("CC_PIPELINE_TYPE", 0.F);

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

void ForwardPipeline::render(const vector<scene::Camera *> &cameras) {
    auto *     device               = gfx::Device::getInstance();
    const bool enableOcclusionQuery = getOcclusionQueryEnabled();
    if (enableOcclusionQuery) {
        device->getQueryPoolResults(_queryPools[0]);
    }

    _commandBuffers[0]->begin();

    if (enableOcclusionQuery) {
        _commandBuffers[0]->resetQueryPool(_queryPools[0]);
    }

    _pipelineUBO->updateGlobalUBO(cameras[0]);
    _pipelineUBO->updateMultiCameraUBO(cameras);
    ensureEnoughSize(cameras);
    decideProfilerCamera(cameras);

    for (auto *camera : cameras) {
        validPunctualLightsCulling(this, camera);
        sceneCulling(this, camera);
        for (auto *const flow : _flows) {
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
    const auto *sharedData = _pipelineSceneData->getSharedData();

    gfx::Sampler *const sampler = getGlobalDSManager()->getPointSampler();

    // Main light sampler binding
    _descriptorSet->bindSampler(SHADOWMAP::BINDING, sampler);
    _descriptorSet->bindSampler(SPOTLIGHTINGMAP::BINDING, sampler);
    _descriptorSet->update();

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", static_cast<bool>(sharedData->isHDR));
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    // step 2 create index buffer
    uint ibStride = 4;
    uint ibSize   = ibStride * 6;
    if (_quadIB == nullptr) {
        _quadIB = _device->createBuffer({gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
                                         gfx::MemoryUsageBit::DEVICE, ibSize, ibStride});
    }

    if (_quadIB == nullptr) {
        return false;
    }

    uint ibData[] = {0, 1, 2, 1, 3, 2};
    _quadIB->update(ibData, sizeof(ibData));

    _width  = swapchain->getWidth();
    _height = swapchain->getHeight();
    return true;
}

void ForwardPipeline::destroy() {
    destroyQuadInputAssembler();
    for (auto &it : _renderPasses) {
        CC_SAFE_DESTROY(it.second);
    }
    _renderPasses.clear();

    _queryPools.clear();
    _commandBuffers.clear();

    RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
