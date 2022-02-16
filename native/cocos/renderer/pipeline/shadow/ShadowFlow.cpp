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

#include "ShadowFlow.h"

#include "../Define.h"
#include "../GlobalDescriptorSetManager.h"
#include "../PipelineSceneData.h"
#include "../RenderPipeline.h"
#include "../SceneCulling.h"
#include "../forward/ForwardPipeline.h"
#include "ShadowStage.h"
#include "gfx-base/GFXDevice.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"

namespace cc {
namespace pipeline {
std::unordered_map<size_t, cc::gfx::RenderPass *> ShadowFlow::renderPassHashMap;

RenderFlowInfo ShadowFlow::initInfo = {
    "ShadowFlow",
    static_cast<uint>(ForwardFlowPriority::SHADOW),
    static_cast<uint>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::initInfo; }

ShadowFlow::ShadowFlow()  = default;
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
    auto *      shadowInfo = sceneData->getShadows();
    if (shadowInfo == nullptr || !shadowInfo->isEnabled() || shadowInfo->getType() != scene::ShadowType::SHADOW_MAP) {
        return;
    }

    lightCollecting();

    if (sceneData->getDirShadowObjects().empty() && sceneData->getRenderObjects().empty()) {
        clearShadowMap(camera);
        return;
    }

    if (shadowInfo->isShadowMapDirty()) {
        resizeShadowMap();
    }

    const auto &                   shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight            = camera->getScene()->getMainLight();
    if (mainLight) {
        gfx::DescriptorSet *globalDS = _pipeline->getDescriptorSet();
        if (!shadowFramebufferMap.count(mainLight)) {
            initShadowFrameBuffer(_pipeline, mainLight);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(mainLight);
        for (auto *stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage);
            shadowStage->setUsage(globalDS, mainLight, shadowFrameBuffer);
            shadowStage->render(camera);
        }
    }

    for (uint l = 0; l < _validLights.size(); ++l) {
        const scene::Light *light    = _validLights[l];
        gfx::DescriptorSet *globalDS = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(l);

        if (!shadowFramebufferMap.count(light)) {
            initShadowFrameBuffer(_pipeline, light);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light);

        for (auto *stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage);
            shadowStage->setUsage(globalDS, light, shadowFrameBuffer);
            shadowStage->render(camera);
        }
    }
}

void ShadowFlow::lightCollecting() {
    _validLights.clear();

    const vector<const scene::Light *> validPunctualLights = _pipeline->getPipelineSceneData()->getValidPunctualLights();
    for (const scene::Light *light : validPunctualLights) {
        if (light->getType() == scene::LightType::SPOT) {
            _validLights.emplace_back(light);
        }
    }
}

void ShadowFlow::clearShadowMap(scene::Camera *camera) {
    const auto *                   sceneData            = _pipeline->getPipelineSceneData();
    const auto &                   shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight            = camera->getScene()->getMainLight();

    if (mainLight) {
        gfx::DescriptorSet *globalDS = _pipeline->getDescriptorSet();
        if (!shadowFramebufferMap.count(mainLight)) {
            initShadowFrameBuffer(_pipeline, mainLight);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(mainLight);
        for (auto *stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage);
            shadowStage->setUsage(globalDS, mainLight, shadowFrameBuffer);
            shadowStage->render(camera);
        }
    }

    for (uint l = 0; l < _validLights.size(); ++l) {
        const scene::Light *light    = _validLights[l];
        gfx::DescriptorSet *globalDS = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(l);

        if (!shadowFramebufferMap.count(light)) {
            continue;
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light);
        for (auto *stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage);
            shadowStage->setUsage(globalDS, light, shadowFrameBuffer);
            shadowStage->clearFramebuffer(camera);
        }
    }
}

void ShadowFlow::resizeShadowMap() {
    const auto *sceneData  = _pipeline->getPipelineSceneData();
    auto *      shadowInfo = sceneData->getShadows();
    auto *      device     = gfx::Device::getInstance();
    const auto  width      = static_cast<uint>(shadowInfo->getSize().x);
    const auto  height     = static_cast<uint>(shadowInfo->getSize().y);
    const auto format      = supportsR32FloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;

    for (const auto &pair : sceneData->getShadowFramebufferMap()) {
        gfx::Framebuffer *framebuffer = pair.second;

        if (!framebuffer) {
            continue;
        }

        auto renderTargets = framebuffer->getColorTextures();
        for (const auto *renderTarget : renderTargets) {
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
            gfx::Format::DEPTH,
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

    shadowInfo->setShadowMapDirty(false);
}

void ShadowFlow::initShadowFrameBuffer(RenderPipeline *pipeline, const scene::Light *light) {
    auto *      device        = gfx::Device::getInstance();
    const auto *sceneData     = _pipeline->getPipelineSceneData();
    const auto *shadowInfo    = sceneData->getShadows();
    const auto &shadowMapSize = shadowInfo->getSize();
    const auto  width         = static_cast<uint>(shadowMapSize.x);
    const auto  height        = static_cast<uint>(shadowMapSize.y);
    const auto  format        = supportsR32FloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;

    const gfx::ColorAttachment colorAttachment = {
        format,
        gfx::SampleCount::ONE,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE},
        {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE},
    };

    const gfx::DepthStencilAttachment depthStencilAttachment = {
        gfx::Format::DEPTH,
        gfx::SampleCount::ONE,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE},
        {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE},
    };

    gfx::RenderPassInfo rpInfo;
    rpInfo.colorAttachments.emplace_back(colorAttachment);
    rpInfo.depthStencilAttachment = depthStencilAttachment;

    size_t rpHash = cc::gfx::RenderPass::computeHash(rpInfo);
    auto   iter   = renderPassHashMap.find(rpHash);
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
        gfx::Format::DEPTH,
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
    _renderPass = nullptr;
    for (const auto &rpPair : renderPassHashMap) {
        CC_DELETE(rpPair.second);
    }
    renderPassHashMap.clear();

    for (auto *texture : _usedTextures) {
        CC_SAFE_DESTROY_AND_DELETE(texture);
    }
    _usedTextures.clear();

    _validLights.clear();

    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
