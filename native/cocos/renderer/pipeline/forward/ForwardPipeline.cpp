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
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXQueue.h"
#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXSampler.h"
#include "gfx-base/GFXTexture.h"
#include "platform/Application.h"
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

gfx::RenderPass *ForwardPipeline::getOrCreateRenderPass(gfx::ClearFlags clearFlags) {
    if (_renderPasses.count(clearFlags)) {
        return _renderPasses[clearFlags];
    }

    auto *                      device = gfx::Device::getInstance();
    gfx::ColorAttachment        colorAttachment;
    gfx::DepthStencilAttachment depthStencilAttachment;
    colorAttachment.format                = device->getColorFormat();
    depthStencilAttachment.format         = device->getDepthStencilFormat();
    depthStencilAttachment.stencilStoreOp = gfx::StoreOp::STORE;
    depthStencilAttachment.depthStoreOp   = gfx::StoreOp::STORE;

    if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
        if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
            colorAttachment.loadOp = gfx::LoadOp::DISCARD;
        } else {
            colorAttachment.loadOp        = gfx::LoadOp::LOAD;
            colorAttachment.beginAccesses = {gfx::AccessType::COLOR_ATTACHMENT_WRITE};
        }
    }

    if (static_cast<gfx::ClearFlagBit>(clearFlags & gfx::ClearFlagBit::DEPTH_STENCIL) != gfx::ClearFlagBit::DEPTH_STENCIL) {
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::DEPTH)) depthStencilAttachment.depthLoadOp = gfx::LoadOp::LOAD;
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::STENCIL)) depthStencilAttachment.stencilLoadOp = gfx::LoadOp::LOAD;
        depthStencilAttachment.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
    }

    auto *renderPass          = device->createRenderPass({
        {colorAttachment},
        depthStencilAttachment,
        {},

    });
    _renderPasses[clearFlags] = renderPass;

    return renderPass;
}

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

bool ForwardPipeline::activate() {
    if (!RenderPipeline::activate()) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer()) {
        CC_LOG_ERROR("ForwardPipeline startup failed!");
        return false;
    }

    return true;
}

void ForwardPipeline::render(const vector<scene::Camera *> &cameras) {
    static gfx::TextureBarrier *present{_device->createTextureBarrier({{gfx::AccessType::COLOR_ATTACHMENT_WRITE}, {gfx::AccessType::PRESENT}})};
    static gfx::Texture *       backBuffer{nullptr};
    _commandBuffers[0]->begin();
    _pipelineUBO->updateGlobalUBO();
    _pipelineUBO->updateMultiCameraUBO(cameras);
    for (auto *camera : cameras) {
        sceneCulling(this, camera);
        for (auto *const flow : _flows) {
            flow->render(camera);
        }
        _pipelineUBO->incCameraUBOOffset();
    }
    _commandBuffers[0]->pipelineBarrier(nullptr, &present, &backBuffer, 1);
    _commandBuffers[0]->end();
    _device->flushCommands(_commandBuffers);
    _device->getQueue()->submit(_commandBuffers);
}

bool ForwardPipeline::activeRenderer() {
    _commandBuffers.push_back(_device->getCommandBuffer());
    auto *const sharedData = _pipelineSceneData->getSharedData();

    gfx::SamplerInfo info{
        gfx::Filter::POINT,
        gfx::Filter::POINT,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        {},
        {},
        {},
        {},
    };
    const uint          shadowMapSamplerHash = SamplerLib::genSamplerHash(info);
    gfx::Sampler *const shadowMapSampler     = SamplerLib::getSampler(shadowMapSamplerHash);

    // Main light sampler binding
    this->_descriptorSet->bindSampler(SHADOWMAP::BINDING, shadowMapSampler);
    this->_descriptorSet->bindTexture(SHADOWMAP::BINDING, getDefaultTexture());

    // Spot light sampler binding
    this->_descriptorSet->bindSampler(SPOTLIGHTINGMAP::BINDING, shadowMapSampler);
    this->_descriptorSet->bindTexture(SPOTLIGHTINGMAP::BINDING, getDefaultTexture());

    _descriptorSet->update();
    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", static_cast<bool>(sharedData->isHDR));
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    return true;
}

void ForwardPipeline::destroy() {
    if (_descriptorSet) {
        _descriptorSet->getBuffer(UBOGlobal::BINDING)->destroy();
        _descriptorSet->getBuffer(UBOCamera::BINDING)->destroy();
        _descriptorSet->getBuffer(UBOShadow::BINDING)->destroy();
        _descriptorSet->getSampler(SHADOWMAP::BINDING)->destroy();
        _descriptorSet->getTexture(SHADOWMAP::BINDING)->destroy();
        _descriptorSet->getSampler(SPOTLIGHTINGMAP::BINDING)->destroy();
        _descriptorSet->getTexture(SPOTLIGHTINGMAP::BINDING)->destroy();
    }

    for (auto &it : _renderPasses) {
        CC_SAFE_DESTROY(it.second);
    }
    _renderPasses.clear();

    _commandBuffers.clear();

    RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
