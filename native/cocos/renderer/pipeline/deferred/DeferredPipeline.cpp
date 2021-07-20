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
#include "GbufferFlow.h"
#include "LightingFlow.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"
#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXSampler.h"
#include "gfx-base/GFXTexture.h"
#include "platform/Application.h"

namespace cc {
namespace pipeline {
namespace {
#define TO_VEC3(dst, src, offset)  \
    dst[offset]         = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z;
#define TO_VEC4(dst, src, offset)  \
    dst[offset]         = (src).x; \
    (dst)[(offset) + 1] = (src).y; \
    (dst)[(offset) + 2] = (src).z; \
    (dst)[(offset) + 3] = (src).w;
} // namespace

gfx::RenderPass *DeferredPipeline::getOrCreateRenderPass(gfx::ClearFlags clearFlags) {
    if (_renderPasses.find(clearFlags) != _renderPasses.end()) {
        return _renderPasses[clearFlags];
    }

    auto *                      device = gfx::Device::getInstance();
    gfx::ColorAttachment        colorAttachment;
    gfx::DepthStencilAttachment depthStencilAttachment;
    colorAttachment.format                = device->getColorFormat();
    depthStencilAttachment.format         = device->getDepthStencilFormat();
    depthStencilAttachment.stencilStoreOp = gfx::StoreOp::DISCARD;
    depthStencilAttachment.depthStoreOp   = gfx::StoreOp::DISCARD;

    if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
        if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
            colorAttachment.loadOp = gfx::LoadOp::DISCARD;
        } else {
            colorAttachment.loadOp        = gfx::LoadOp::LOAD;
            colorAttachment.beginAccesses = {gfx::AccessType::PRESENT};
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
    });
    _renderPasses[clearFlags] = renderPass;

    return renderPass;
}

bool DeferredPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.empty()) {
        auto *shadowFlow = CC_NEW(ShadowFlow);
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto *gbufferFlow = CC_NEW(GbufferFlow);
        gbufferFlow->initialize(GbufferFlow::getInitializeInfo());
        _flows.emplace_back(gbufferFlow);

        auto *lightingFlow = CC_NEW(LightingFlow);
        lightingFlow->initialize(LightingFlow::getInitializeInfo());
        _flows.emplace_back(lightingFlow);
    }

    return true;
}

bool DeferredPipeline::activate() {
    _macros.setValue("CC_PIPELINE_TYPE", static_cast<float>(1.0));

    if (!RenderPipeline::activate()) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer()) {
        CC_LOG_ERROR("DeferredPipeline startup failed!");
        return false;
    }

    return true;
}

void DeferredPipeline::render(const vector<scene::Camera *> &cameras) {
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
    _commandBuffers[0]->end();
    _device->flushCommands(_commandBuffers);
    _device->getQueue()->submit(_commandBuffers);
}

void DeferredPipeline::updateQuadVertexData(const gfx::Rect &renderArea) {
    if (_lastUsedRenderArea == renderArea) {
        return;
    }

    _lastUsedRenderArea = renderArea;
    float vbData[16]    = {0};
    genQuadVertexData(gfx::SurfaceTransform::IDENTITY, renderArea, vbData);
    _commandBuffers[0]->updateBuffer(_quadVBOffscreen, vbData);
}

void DeferredPipeline::genQuadVertexData(gfx::SurfaceTransform /*surfaceTransform*/, const gfx::Rect &renderArea, float *vbData) {
    float minX = float(renderArea.x) / _width;
    float maxX = float(renderArea.x + renderArea.width) / _width;
    float minY = float(renderArea.y) / _height;
    float maxY = float(renderArea.y + renderArea.height) / _height;
    if (_device->getCapabilities().screenSpaceSignY > 0) {
        std::swap(minY, maxY);
    }
    int n       = 0;
    vbData[n++] = -1.0;
    vbData[n++] = -1.0;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0;
    vbData[n++] = -1.0;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0;
    vbData[n++] = 1.0;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0;
    vbData[n++] = 1.0;
    vbData[n++] = maxX;
    vbData[n++] = minY;
}

bool DeferredPipeline::createQuadInputAssembler(gfx::Buffer **quadIB, gfx::Buffer **quadVB, gfx::InputAssembler **quadIA) {
    // step 1 create vertex buffer
    uint vbStride = sizeof(float) * 4;
    uint vbSize   = vbStride * 4;

    if (*quadVB == nullptr) {
        *quadVB = _device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                         gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE, vbSize, vbStride});
    }

    if (*quadVB == nullptr) {
        return false;
    }

    // step 2 create index buffer
    uint ibStride = 4;
    uint ibSize   = ibStride * 6;
    if (*quadIB == nullptr) {
        *quadIB = _device->createBuffer({gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
                                         gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE, ibSize, ibStride});
    }

    if (*quadIB == nullptr) {
        return false;
    }

    unsigned int ibData[] = {0, 1, 2, 1, 3, 2};
    (*quadIB)->update(ibData, sizeof(ibData));

    // step 3 create input assembler
    gfx::InputAssemblerInfo info;
    info.attributes.push_back({"a_position", gfx::Format::RG32F});
    info.attributes.push_back({"a_texCoord", gfx::Format::RG32F});
    info.vertexBuffers.push_back(*quadVB);
    info.indexBuffer = *quadIB;
    *quadIA          = _device->createInputAssembler(info);
    return (*quadIA) != nullptr;
}

gfx::Rect DeferredPipeline::getRenderArea(scene::Camera *camera) {
    gfx::Rect renderArea;

    uint w = camera->window->hasOnScreenAttachments && static_cast<uint>(_device->getSurfaceTransform()) % 2 ? camera->height : camera->width;
    uint h = camera->window->hasOnScreenAttachments && static_cast<uint>(_device->getSurfaceTransform()) % 2 ? camera->width : camera->height;

    const auto &viewport = camera->viewPort;
    renderArea.x         = static_cast<int>(viewport.x * w);
    renderArea.y         = static_cast<int>(viewport.y * h);
    renderArea.width     = static_cast<uint>(viewport.z * w * _pipelineSceneData->getSharedData()->shadingScale);
    renderArea.height    = static_cast<uint>(viewport.w * h * _pipelineSceneData->getSharedData()->shadingScale);
    return renderArea;
}

void DeferredPipeline::destroyQuadInputAssembler() {
    if (_quadIB) {
        _quadIB->destroy();
        _quadIB = nullptr;
    }

    if (_quadVBOffscreen) {
        _quadVBOffscreen->destroy();
        _quadVBOffscreen = nullptr;
    }

    if (_quadIAOffscreen) {
        _quadIAOffscreen->destroy();
        _quadIAOffscreen = nullptr;
    }
}

bool DeferredPipeline::activeRenderer() {
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
    const uint          samplerHash = SamplerLib::genSamplerHash(info);
    gfx::Sampler *const sampler     = SamplerLib::getSampler(samplerHash);

    // Main light sampler binding
    this->_descriptorSet->bindSampler(SHADOWMAP::BINDING, sampler);
    this->_descriptorSet->bindTexture(SHADOWMAP::BINDING, getDefaultTexture());

    // Spot light sampler binding
    this->_descriptorSet->bindSampler(SPOTLIGHTINGMAP::BINDING, sampler);
    this->_descriptorSet->bindTexture(SPOTLIGHTINGMAP::BINDING, getDefaultTexture());

    _descriptorSet->update();

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", static_cast<bool>(sharedData->isHDR));
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    if (!createQuadInputAssembler(&_quadIB, &_quadVBOffscreen, &_quadIAOffscreen)) {
        return false;
    }

    gfx::RenderPassInfo gbufferPass;

    gfx::ColorAttachment color = {
        gfx::Format::RGBA16F,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {},
        {gfx::AccessType::COLOR_ATTACHMENT_WRITE},
    };

    for (int i = 0; i < 4; i++) {
        gbufferPass.colorAttachments.push_back(color);
    }

    gfx::DepthStencilAttachment depth = {
        _device->getDepthStencilFormat(),
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
    };

    gbufferPass.depthStencilAttachment = depth;
    _gbufferRenderPass                 = _device->createRenderPass(gbufferPass);

    gfx::ColorAttachment cAttch = {
        gfx::Format::RGBA16F,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {},
        {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE},
    };

    gfx::RenderPassInfo lightPass;
    lightPass.colorAttachments.push_back(cAttch);

    lightPass.depthStencilAttachment = {
        _device->getDepthStencilFormat(),
        gfx::SampleCount::X1,
        gfx::LoadOp::LOAD,
        gfx::StoreOp::DISCARD,
        gfx::LoadOp::DISCARD,
        gfx::StoreOp::DISCARD,
        {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE},
    };

    _lightingRenderPass = _device->createRenderPass(lightPass);

    _width  = _device->getWidth();
    _height = _device->getHeight();

    generateDeferredRenderData();

    _descriptorSet->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_ALBEDOMAP), sampler);
    _descriptorSet->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_POSITIONMAP), sampler);
    _descriptorSet->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_NORMALMAP), sampler);
    _descriptorSet->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_EMISSIVEMAP), sampler);
    _descriptorSet->bindSampler(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP), sampler);

    return true;
}

void DeferredPipeline::resize(uint width, uint height) {
    if (_width == width && _height == height) {
        return;
    }
    _width  = width;
    _height = height;
    destroyDeferredData();
    generateDeferredRenderData();
}

void DeferredPipeline::generateDeferredRenderData() {
    _deferredRenderData = CC_NEW(DeferredRenderData);

    gfx::TextureInfo info = {
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        gfx::Format::RGBA16F,
        _width,
        _height,
    };

    for (int i = 0; i < 4; i++) {
        gfx::Texture *tex = _device->createTexture(info);
        _deferredRenderData->gbufferRenderTargets.push_back(tex);
    }

    info.usage                    = gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT;
    info.format                   = _device->getDepthStencilFormat();
    _deferredRenderData->depthTex = _device->createTexture(info);

    gfx::FramebufferInfo gbufferInfo = {
        _gbufferRenderPass,
        _deferredRenderData->gbufferRenderTargets,
        _deferredRenderData->depthTex,
    };

    _deferredRenderData->gbufferFrameBuffer = _device->createFramebuffer(gbufferInfo);

    gfx::TextureInfo rtInfo = {
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        gfx::Format::RGBA16F,
        _width,
        _height,
    };
    _deferredRenderData->lightingRenderTarget = _device->createTexture(rtInfo);

    gfx::FramebufferInfo lightingInfo;
    lightingInfo.renderPass = _lightingRenderPass;
    lightingInfo.colorTextures.push_back(_deferredRenderData->lightingRenderTarget);
    lightingInfo.depthStencilTexture       = _deferredRenderData->depthTex;
    _deferredRenderData->lightingFrameBuff = _device->createFramebuffer(lightingInfo);

    _descriptorSet->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_ALBEDOMAP), _deferredRenderData->gbufferFrameBuffer->getColorTextures()[0]);
    _descriptorSet->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_POSITIONMAP), _deferredRenderData->gbufferFrameBuffer->getColorTextures()[1]);
    _descriptorSet->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_NORMALMAP), _deferredRenderData->gbufferFrameBuffer->getColorTextures()[2]);
    _descriptorSet->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_GBUFFER_EMISSIVEMAP), _deferredRenderData->gbufferFrameBuffer->getColorTextures()[3]);

    _descriptorSet->bindTexture(
        static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP), _deferredRenderData->lightingFrameBuff->getColorTextures()[0]);
}

void DeferredPipeline::destroy() {
    destroyQuadInputAssembler();

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
        it.second->destroy();
    }
    _renderPasses.clear();

    _commandBuffers.clear();

    _gbufferRenderPass  = nullptr;
    _lightingRenderPass = nullptr;

    RenderPipeline::destroy();
}

void DeferredPipeline::destroyDeferredData() {
    if (_deferredRenderData->gbufferFrameBuffer) {
        _deferredRenderData->gbufferFrameBuffer->destroy();
        CC_DELETE(_deferredRenderData->gbufferFrameBuffer);
        _deferredRenderData->gbufferFrameBuffer = nullptr;
    }

    if (_deferredRenderData->lightingFrameBuff) {
        _deferredRenderData->lightingFrameBuff->destroy();
        CC_DELETE(_deferredRenderData->lightingFrameBuff);
        _deferredRenderData->lightingFrameBuff = nullptr;
    }

    if (_deferredRenderData->lightingRenderTarget) {
        _deferredRenderData->lightingRenderTarget->destroy();
        CC_DELETE(_deferredRenderData->lightingRenderTarget);
        _deferredRenderData->lightingRenderTarget = nullptr;
    }

    if (_deferredRenderData->depthTex) {
        _deferredRenderData->depthTex->destroy();
        CC_DELETE(_deferredRenderData->depthTex);
        _deferredRenderData->depthTex = nullptr;
    }

    for (auto *renderTarget : _deferredRenderData->gbufferRenderTargets) {
        renderTarget->destroy();
        CC_DELETE(renderTarget);
    }
    _deferredRenderData->gbufferRenderTargets.clear();

    CC_DELETE(_deferredRenderData);
    _deferredRenderData = nullptr;
}

} // namespace pipeline
} // namespace cc
