/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

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

#include "DeferredPipeline.h"
#include "../SceneCulling.h"
#include "../shadow/ShadowFlow.h"
#include "MainFlow.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXSwapchain.h"
#include "gfx-base/states/GFXTextureBarrier.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {
#define TO_VEC3(dst, src, offset)  \
    dst[offset]         = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z;
#define TO_VEC4(dst, src, offset)  \
    dst[offset]         = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z; \
    (dst)[(offset) + 3] = (src).w;

framegraph::StringHandle DeferredPipeline::fgStrHandleGbufferTexture[GBUFFER_COUNT] = {
    framegraph::FrameGraph::stringToHandle("gbufferAlbedoTexture"),
    framegraph::FrameGraph::stringToHandle("gbufferPositionTexture"),
    framegraph::FrameGraph::stringToHandle("gbufferNormalTexture"),
    framegraph::FrameGraph::stringToHandle("gbufferEmissiveTexture")};

framegraph::StringHandle DeferredPipeline::fgStrHandleGbufferPass     = framegraph::FrameGraph::stringToHandle("deferredGbufferPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleLightingPass    = framegraph::FrameGraph::stringToHandle("deferredLightingPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleTransparentPass = framegraph::FrameGraph::stringToHandle("deferredTransparentPass");
framegraph::StringHandle DeferredPipeline::fgStrHandleSsprPass        = framegraph::FrameGraph::stringToHandle("deferredSSPRPass");

bool DeferredPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.empty()) {
        auto *shadowFlow = CC_NEW(ShadowFlow);
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto *mainFlow = CC_NEW(MainFlow);
        mainFlow->initialize(MainFlow::getInitializeInfo());
        _flows.emplace_back(mainFlow);
    }
    return true;
}

bool DeferredPipeline::activate(gfx::Swapchain *swapchain) {
    _macros.setValue("CC_PIPELINE_TYPE", static_cast<float>(1.0));

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

void DeferredPipeline::render(const vector<scene::Camera *> &cameras) {
    _commandBuffers[0]->begin();
    _pipelineUBO->updateGlobalUBO(cameras[0]);
    _pipelineUBO->updateMultiCameraUBO(cameras);
    ensureEnoughSize(cameras);

    for (auto *camera : cameras) {
        sceneCulling(this, camera);

        _fg.reset();

        if (_clusterEnabled) {
            _clusterComp->clusterLightCulling(camera);
        }

        for (auto *const flow : _flows) {
            flow->render(camera);
        }
        _fg.compile();
        // _fg.exportGraphViz("fg_vis.dot");
        _fg.execute();

        _pipelineUBO->incCameraUBOOffset();
    }

    _commandBuffers[0]->end();
    _device->flushCommands(_commandBuffers);
    _device->getQueue()->submit(_commandBuffers);
}

bool DeferredPipeline::activeRenderer(gfx::Swapchain *swapchain) {
    _commandBuffers.push_back(_device->getCommandBuffer());
    auto *const sharedData = _pipelineSceneData->getSharedData();

    gfx::Sampler *const sampler = _device->getSampler({
        gfx::Filter::POINT,
        gfx::Filter::POINT,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    });

    // Main light sampler binding
    _descriptorSet->bindSampler(SHADOWMAP::BINDING, sampler);
    _descriptorSet->bindTexture(SHADOWMAP::BINDING, getDefaultTexture());

    // Spot light sampler binding
    _descriptorSet->bindSampler(SPOTLIGHTINGMAP::BINDING, sampler);
    _descriptorSet->bindTexture(SPOTLIGHTINGMAP::BINDING, getDefaultTexture());

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

    unsigned int ibData[] = {0, 1, 2, 1, 3, 2};
    _quadIB->update(ibData, sizeof(ibData));

    _width  = swapchain->getWidth();
    _height = swapchain->getHeight();

    if (_clusterEnabled) {
        // cluster component resource
        _clusterComp = new ClusterLightCulling(this);
        _clusterComp->initialize(this->getDevice());
    }

    return true;
}

void DeferredPipeline::destroy() {
    destroyQuadInputAssembler();

    for (auto &it : _renderPasses) {
        CC_DESTROY(it.second);
    }
    _renderPasses.clear();

    _commandBuffers.clear();

    CC_SAFE_DELETE(_clusterComp);

    RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
