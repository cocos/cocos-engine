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

#include "GbufferFlow.h"
#include "DeferredPipeline.h"
#include "GbufferStage.h"
#include "../SceneCulling.h"
#include "../../core/gfx/GFXDevice.h"
#include "../../core/gfx/GFXDescriptorSet.h"
#include "../../core/gfx/GFXSampler.h"
#include "gfx/GFXRenderPass.h"

namespace cc {
namespace pipeline {
RenderFlowInfo GbufferFlow::_initInfo = {
    "GbufferFlow",
    static_cast<uint>(DeferredFlowPriority::GBUFFER),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &GbufferFlow::getInitializeInfo() { return GbufferFlow::_initInfo; }

GbufferFlow::~GbufferFlow() {
}

bool GbufferFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.size() == 0) {
        GbufferStage *gbufferStage = CC_NEW(GbufferStage);
        gbufferStage->initialize(GbufferStage::getInitializeInfo());
        _stages.emplace_back(gbufferStage);
    }

    return true;
}

void GbufferFlow::createRenderPass(gfx::Device *device) {
    if (_gbufferRenderPass != nullptr) {
        return;
    }

    gfx::RenderPassInfo info;

    gfx::ColorAttachment color = {
        gfx::Format::RGBA16F,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {},
        {gfx::AccessType::COLOR_ATTACHMENT_WRITE},
    };

    for (int i = 0; i < 4; i++) {
        info.colorAttachments.push_back(color);
    }

    gfx::DepthStencilAttachment depth = {
        device->getDepthStencilFormat(),
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
    };

    info.depthStencilAttachment = depth;
    _gbufferRenderPass = device->createRenderPass(info);
}

void GbufferFlow::createRenderTargets(gfx::Device *device) {
    gfx::TextureInfo info = {
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        gfx::Format::RGBA16F,
        _width,
        _height,
    };

    if (_gbufferRenderTargets.empty()) {
        for (int i = 0; i < 4; i++) {
            gfx::Texture *tex = device->createTexture(info);
            _gbufferRenderTargets.push_back(tex);
        }
    }

    if (!_depth) {
        info.usage = gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT;
        info.format = device->getDepthStencilFormat();
        _depth = device->createTexture(info);

        DeferredPipeline *pp = dynamic_cast<DeferredPipeline*>(_pipeline);
        pp->setDepth(_depth);
    }

    if (!_gbufferFrameBuffer) {
        gfx::FramebufferInfo fbInfo = {
            _gbufferRenderPass,
            _gbufferRenderTargets,
            _depth,
        };

        _gbufferFrameBuffer = device->createFramebuffer(fbInfo);
    }
}

void GbufferFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);

    gfx::Device *device = pipeline->getDevice();
    if (device->getSurfaceTransform() == gfx::SurfaceTransform::IDENTITY ||
        device->getSurfaceTransform() == gfx::SurfaceTransform::ROTATE_180) {
            _width = device->getWidth();
            _height = device->getHeight();
    }
    else {
            _width = device->getHeight();
            _height = device->getWidth();
    }

    createRenderPass(device);
    createRenderTargets(device);

    pipeline->getDescriptorSet()->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_ALBEDOMAP), _gbufferFrameBuffer->getColorTextures()[0]);
    pipeline->getDescriptorSet()->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_POSITIONMAP), _gbufferFrameBuffer->getColorTextures()[1]);
    pipeline->getDescriptorSet()->bindTexture(
       static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_NORMALMAP), _gbufferFrameBuffer->getColorTextures()[2]);
    pipeline->getDescriptorSet()->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_EMISSIVEMAP), _gbufferFrameBuffer->getColorTextures()[3]);

    gfx::SamplerInfo sInfo = {
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    };

    uint hash = genSamplerHash(sInfo);
    gfx::Sampler *gbufferSampler = getSampler(hash);
    pipeline->getDescriptorSet()->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_ALBEDOMAP), gbufferSampler);
    pipeline->getDescriptorSet()->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_POSITIONMAP), gbufferSampler);
    pipeline->getDescriptorSet()->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_NORMALMAP), gbufferSampler);
    pipeline->getDescriptorSet()->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_EMISSIVEMAP), gbufferSampler);
}

void GbufferFlow::render(Camera *camera) {
    auto pipeline = static_cast<DeferredPipeline *>(_pipeline);
    sceneCulling(pipeline, camera);
    RenderFlow::render(camera);
}

void GbufferFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
