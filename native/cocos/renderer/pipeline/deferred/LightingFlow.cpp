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

#include "LightingFlow.h"
#include "DeferredPipeline.h"
#include "LightingStage.h"
#include "../SceneCulling.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXDevice.h"

namespace cc {
namespace pipeline {
RenderFlowInfo LightingFlow::_initInfo = {
    "LightingFlow",
    static_cast<uint>(DeferredFlowPriority::LIGHTING),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &LightingFlow::getInitializeInfo() { return LightingFlow::_initInfo; }

LightingFlow::~LightingFlow() {
}

bool LightingFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    if (_stages.size() == 0) {
        auto stage = CC_NEW(LightingStage);
        stage->initialize(LightingStage::getInitializeInfo());
        _stages.emplace_back(stage);
    }

    return true;
}

void LightingFlow::createRenderPass(gfx::Device *device) {
    if (_lightingRenderPass == nullptr) {
        gfx::ColorAttachment cAttch = {
            gfx::Format::RGBA16F,
            gfx::SampleCount::X1,
            gfx::LoadOp::CLEAR,
            gfx::StoreOp::STORE,
            {},
            {gfx::AccessType::COLOR_ATTACHMENT_WRITE},
        };
        gfx::RenderPassInfo info;
        info.colorAttachments.push_back(cAttch);
        info.depthStencilAttachment = {
            device->getDepthStencilFormat(),
            gfx::SampleCount::X1,
            gfx::LoadOp::LOAD,
            gfx::StoreOp::DISCARD,
            gfx::LoadOp::DISCARD,
            gfx::StoreOp::DISCARD,
            {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE},
        };

        _lightingRenderPass = device->createRenderPass(info);
        assert(_lightingRenderPass != nullptr);
    }
}

void LightingFlow::createFrameBuffer(gfx::Device *device) {
    if (_lightingRenderTarget == nullptr) {
        gfx::TextureInfo rtInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA16F,
            _width,
            _height,
        };
        _lightingRenderTarget = device->createTexture(rtInfo);
    }

    if (!_lightingFrameBuff) {
        gfx::FramebufferInfo fbInfo;
        fbInfo.renderPass = _lightingRenderPass;
        fbInfo.colorTextures.push_back(_lightingRenderTarget);
        fbInfo.depthStencilTexture = _depth;
        _lightingFrameBuff = device->createFramebuffer(fbInfo);
        assert(_lightingFrameBuff != nullptr);
    }
}

void LightingFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
    if (_lightingRenderPass != nullptr) {
        return;
    }

    const auto device = pipeline->getDevice();
    if (device->getSurfaceTransform() == gfx::SurfaceTransform::IDENTITY ||
        device->getSurfaceTransform() == gfx::SurfaceTransform::ROTATE_180) {
            _width = device->getWidth();
            _height = device->getHeight();
    }
    else {
            _width = device->getHeight();
            _height = device->getWidth();
    }

    DeferredPipeline *pp = dynamic_cast<DeferredPipeline *>(pipeline);
    assert(pp != nullptr);
    _depth = pp->getDepth();

    // create renderpass
    createRenderPass(device);

    // create framebuffer
    createFrameBuffer(device);

    // bind sampler and texture, used in postprocess
    pipeline->getDescriptorSet()->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP),
        _lightingFrameBuff->getColorTextures()[0]);

    gfx::SamplerInfo spInfo = {
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP
    };

    auto spHash = genSamplerHash(spInfo);
    gfx::Sampler *copySampler = getSampler(spHash);
    pipeline->getDescriptorSet()->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP),
        copySampler);
}

void LightingFlow::render(Camera *camera) {
    auto pipeline = dynamic_cast<DeferredPipeline *>(_pipeline);
    RenderFlow::render(camera);
}

void LightingFlow::destroy() {
    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
