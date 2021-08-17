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

#include "ShadowFlow.h"

#include "../Define.h"
#include "../SceneCulling.h"
#include "../forward/ForwardPipeline.h"
#include "ShadowStage.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXTexture.h"

namespace cc::pipeline {
std::unordered_map<uint, cc::gfx::RenderPass *> ShadowFlow::renderPassHashMap;

RenderFlowInfo ShadowFlow::initInfo = {
    "ShadowFlow",
    static_cast<uint>(ForwardFlowPriority::SHADOW),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::initInfo; }

ShadowFlow::~ShadowFlow() = default;

bool ShadowFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    if (_stages.empty()) {
        auto *shadowStage = CC_NEW(ShadowStage);
        shadowStage->initialize(ShadowStage::getInitializeInfo());
        _stages.emplace_back(shadowStage);
    }

    return true;
}

void ShadowFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void ShadowFlow::render(scene::Camera *camera) {
    const auto *sceneData  = _pipeline->getPipelineSceneData();
    auto *      shadowInfo = sceneData->getSharedData()->shadow;
    if (!shadowInfo->enabled || shadowInfo->shadowType != scene::ShadowType::SHADOWMAP) return;

    lightCollecting(camera, &_validLights);

    if (sceneData->getShadowObjects().empty()) {
        clearShadowMap(camera);
        return;
    }

    if (shadowInfo->shadowMapDirty) {
        resizeShadowMap(&shadowInfo);
    }

    const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    for (const auto *light : _validLights) {
        if (!shadowFramebufferMap.count(light)) {
            initShadowFrameBuffer(_pipeline, light);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light);

        for (auto *stage : _stages) {
            auto *shadowStage = dynamic_cast<ShadowStage *>(stage);
            shadowStage->setUseData(light, shadowFrameBuffer);
            shadowStage->render(camera);
        }
    }

    // After the shadowMap rendering of all lights is completed,
    // restore the ShadowUBO data of the main light.
    _pipeline->getPipelineUBO()->updateShadowUBO(camera);
}

void ShadowFlow::clearShadowMap(scene::Camera *camera) {
    auto *      sceneData            = _pipeline->getPipelineSceneData();
    const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    for (const auto *light : _validLights) {
        if (!shadowFramebufferMap.count(light)) {
            continue;
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light);
        for (auto *stage : _stages) {
            auto *shadowStage = dynamic_cast<ShadowStage *>(stage);
            shadowStage->setUseData(light, shadowFrameBuffer);
            shadowStage->clearFramebuffer(camera);
        }
    }
}

void ShadowFlow::resizeShadowMap(scene::Shadow **shadowInfo) {
    auto *     sceneData = _pipeline->getPipelineSceneData();
    auto *     device    = gfx::Device::getInstance();
    const auto width     = static_cast<uint>((*shadowInfo)->size.x);
    const auto height    = static_cast<uint>((*shadowInfo)->size.y);
    const auto format    = supportsHalfFloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;

    for (const auto &pair : sceneData->getShadowFramebufferMap()) {
        gfx::Framebuffer *framebuffer = pair.second;

        if (!framebuffer) {
            continue;
        }

        auto renderTargets = framebuffer->getColorTextures();
        for (auto *renderTarget : renderTargets) {
            CC_DELETE(renderTarget);
        }
        renderTargets.clear();
        renderTargets.emplace_back(gfx::Device::getInstance()->createTexture({
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            format,
            width,
            height,
        }));
        for (auto *renderTarget : renderTargets) {
            _usedTextures.emplace_back(renderTarget);
        }

        auto *depth = framebuffer->getDepthStencilTexture();
        CC_DELETE(depth);
        depth = device->createTexture({
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
            device->getDepthStencilFormat(),
            width,
            height,
        });
        _usedTextures.emplace_back(depth);

        framebuffer->destroy();
        framebuffer->initialize({
            _renderPass,
            renderTargets,
            depth,
        });
    }

    (*shadowInfo)->shadowMapDirty = false;
}

void ShadowFlow::initShadowFrameBuffer(RenderPipeline *pipeline, const scene::Light *light) {
    auto *      device        = gfx::Device::getInstance();
    const auto *sceneData     = _pipeline->getPipelineSceneData();
    const auto *shadowInfo    = sceneData->getSharedData()->shadow;
    const auto  shadowMapSize = shadowInfo->size;
    const auto  width         = static_cast<uint>(shadowMapSize.x);
    const auto  height        = static_cast<uint>(shadowMapSize.y);
    const auto  format        = supportsHalfFloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;
    
    const gfx::ColorAttachment colorAttachment = {
        format,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {},
        {},
    };

    const gfx::DepthStencilAttachment depthStencilAttachment = {
        device->getDepthStencilFormat(),
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        {},
        {},
    };

    gfx::RenderPassInfo rpInfo;
    rpInfo.colorAttachments.emplace_back(colorAttachment);
    rpInfo.depthStencilAttachment = depthStencilAttachment;

    uint rpHash = cc::gfx::RenderPass::computeHash(rpInfo);
    auto iter   = renderPassHashMap.find(rpHash);
    if (iter != renderPassHashMap.end()) {
        _renderPass = iter->second;
    } else {
        _renderPass = device->createRenderPass(rpInfo);
        renderPassHashMap.insert({rpHash, _renderPass});
    }

    vector<gfx::Texture *> renderTargets;
    renderTargets.emplace_back(device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        format,
        width,
        height,
    }));
    for (auto *renderTarget : renderTargets) {
        _usedTextures.emplace_back(renderTarget);
    }

    gfx::Texture *depth = device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        device->getDepthStencilFormat(),
        width,
        height,
    });
    _usedTextures.emplace_back(depth);

    gfx::Framebuffer *framebuffer = device->createFramebuffer({
        _renderPass,
        renderTargets,
        depth,
    });

    pipeline->getPipelineSceneData()->setShadowFramebuffer(light, framebuffer);
}

void ShadowFlow::destroy() {
    for (auto rpPair : renderPassHashMap) {
        rpPair.second->destroy();
    }
    renderPassHashMap.clear();
    CC_SAFE_DESTROY(_renderPass)

    for (auto *texture : _usedTextures) {
        CC_SAFE_DESTROY(texture);
    }
    _usedTextures.clear();

    _validLights.clear();

    RenderFlow::destroy();
}

} // namespace cc::pipeline
