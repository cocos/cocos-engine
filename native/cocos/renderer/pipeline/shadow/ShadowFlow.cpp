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

#include "ShadowFlow.h"

#include "CSMLayers.h"
#include "ShadowStage.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline//Define.h"
#include "pipeline/GlobalDescriptorSetManager.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/RenderPipeline.h"
#include "pipeline/SceneCulling.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/DirectionalLight.h"
#include "scene/RenderScene.h"
#include "scene/Shadow.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {
ccstd::unordered_map<ccstd::hash_t, IntrusivePtr<cc::gfx::RenderPass>> ShadowFlow::renderPassHashMap;

RenderFlowInfo ShadowFlow::initInfo = {
    "ShadowFlow",
    static_cast<uint32_t>(ForwardFlowPriority::SHADOW),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {},
};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::initInfo; }

ShadowFlow::ShadowFlow() = default;
ShadowFlow::~ShadowFlow() = default;

bool ShadowFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    if (_stages.empty()) {
        auto *shadowStage = ccnew ShadowStage;
        shadowStage->initialize(ShadowStage::getInitializeInfo());
        _stages.emplace_back(shadowStage);
    }

    return true;
}

void ShadowFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);

    // 0: SHADOWMAP_FLOAT, 1: SHADOWMAP_RGBE.
    const int32_t isRGBE = supportsR32FloatTexture(pipeline->getDevice()) ? 0 : 1;
    pipeline->setValue("CC_SHADOWMAP_FORMAT", isRGBE);

    // 0: SHADOWMAP_LINER_DEPTH_OFF, 1: SHADOWMAP_LINER_DEPTH_ON.
    const int32_t isLinear = 0;
    pipeline->setValue("CC_SHADOWMAP_USE_LINEAR_DEPTH", isLinear);

    // 0: UNIFORM_VECTORS_LESS_EQUAL_64, 1: UNIFORM_VECTORS_GREATER_EQUAL_125.
    const auto csmSupported = pipeline->getDevice()->getCapabilities().maxFragmentUniformVectors >=
                              (UBOGlobal::COUNT + UBOCamera::COUNT + UBOShadow::COUNT + UBOCSM::COUNT) >> 2;
    pipeline->getPipelineSceneData()->setCSMSupported(csmSupported);
    pipeline->setValue("CC_SUPPORT_CASCADED_SHADOW_MAP", csmSupported);

    // 0: CC_SHADOW_NONE, 1: CC_SHADOW_PLANAR, 2: CC_SHADOW_MAP
    pipeline->setValue("CC_SHADOW_TYPE", 0);

    // 0: PCFType.HARD, 1: PCFType.SOFT, 2: PCFType.SOFT_2X, 3: PCFType.SOFT_4X
    pipeline->setValue("CC_DIR_SHADOW_PCF_TYPE", static_cast<int32_t>(scene::PCFType::HARD));

    // 0: CC_DIR_LIGHT_SHADOW_PLANAR, 1: CC_DIR_LIGHT_SHADOW_UNIFORM, 2: CC_DIR_LIGHT_SHADOW_CASCADED, 3: CC_DIR_LIGHT_SHADOW_VARIANCE
    pipeline->setValue("CC_DIR_LIGHT_SHADOW_TYPE", 0);

    // 0: CC_CASCADED_LAYERS_TRANSITION_OFF, 1: CC_CASCADED_LAYERS_TRANSITION_ON
    pipeline->setValue("CC_CASCADED_LAYERS_TRANSITION", 0);

    pipeline->onGlobalPipelineStateChanged();
}

void ShadowFlow::render(scene::Camera *camera) {
    CC_PROFILE(ShadowFlowRender);
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *csmLayers = sceneData->getCSMLayers();
    auto *shadowInfo = sceneData->getShadows();
    if (shadowInfo == nullptr || !shadowInfo->isEnabled() || shadowInfo->getType() != scene::ShadowType::SHADOW_MAP) {
        return;
    }

    lightCollecting();

    if (csmLayers->getCastShadowObjects().empty() && sceneData->getRenderObjects().empty()) {
        clearShadowMap(camera);
        return;
    }

    if (shadowInfo->isShadowMapDirty()) {
        _pipeline->getGlobalDSManager()->bindTexture(SHADOWMAP::BINDING, nullptr);
        _pipeline->getGlobalDSManager()->bindTexture(SPOTSHADOWMAP::BINDING, nullptr);
    }

    const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight = camera->getScene()->getMainLight();
    if (mainLight) {
        gfx::DescriptorSet *globalDS = _pipeline->getDescriptorSet();
        if (!shadowFramebufferMap.count(mainLight)) {
            initShadowFrameBuffer(_pipeline, mainLight);
        } else {
            if (shadowInfo->isShadowMapDirty()) {
                resizeShadowMap(mainLight, globalDS);
            }
        }

        gfx::Framebuffer *shadowFrameBuffer = shadowFramebufferMap.at(mainLight);
        if (mainLight->isShadowFixedArea()) {
            renderStage(globalDS, camera, mainLight, shadowFrameBuffer);
        } else {
            const auto level = _pipeline->getPipelineSceneData()->getCSMSupported() ? static_cast<uint32_t>(mainLight->getCSMLevel()) : 1U;
            for (uint32_t i = 0; i < level; ++i) {
                renderStage(globalDS, camera, mainLight, shadowFrameBuffer, i);
            }
        }
    }

    for (const auto *light : _validLights) {
        gfx::DescriptorSet *ds = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);

        if (!shadowFramebufferMap.count(light)) {
            initShadowFrameBuffer(_pipeline, light);
        } else {
            if (shadowInfo->isShadowMapDirty()) {
                resizeShadowMap(light, ds);
            }
        }

        gfx::Framebuffer *shadowFrameBuffer = shadowFramebufferMap.at(light);
        renderStage(ds, camera, light, shadowFrameBuffer);
    }

    shadowInfo->setShadowMapDirty(false);
}

void ShadowFlow::renderStage(gfx::DescriptorSet *globalDS, scene::Camera *camera, const scene::Light *light, gfx::Framebuffer *framebuffer, uint32_t level) {
    for (auto &stage : _stages) {
        auto *shadowStage = static_cast<ShadowStage *>(stage.get());
        shadowStage->setUsage(globalDS, light, framebuffer, level);
        shadowStage->render(camera);
    }
}

void ShadowFlow::lightCollecting() {
    _validLights.clear();

    const ccstd::vector<const scene::Light *> validPunctualLights = _pipeline->getPipelineSceneData()->getValidPunctualLights();
    for (const scene::Light *light : validPunctualLights) {
        if (light->getType() == scene::LightType::SPOT) {
            const auto *spotLight = static_cast<const scene::SpotLight *>(light);
            if (spotLight->isShadowEnabled()) {
                _validLights.emplace_back(light);
            }
        }
    }
}

void ShadowFlow::clearShadowMap(scene::Camera *camera) {
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto &shadowFramebufferMap = sceneData->getShadowFramebufferMap();
    const scene::DirectionalLight *mainLight = camera->getScene()->getMainLight();

    if (mainLight) {
        gfx::DescriptorSet *globalDS = _pipeline->getDescriptorSet();
        if (!shadowFramebufferMap.count(mainLight)) {
            initShadowFrameBuffer(_pipeline, mainLight);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(mainLight).get();
        for (auto &stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage.get());
            shadowStage->setUsage(globalDS, mainLight, shadowFrameBuffer);
            shadowStage->render(camera);
        }
    }

    for (const auto *light : _validLights) {
        gfx::DescriptorSet *ds = _pipeline->getGlobalDSManager()->getOrCreateDescriptorSet(light);
        if (!shadowFramebufferMap.count(light)) {
            initShadowFrameBuffer(_pipeline, light);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light).get();
        for (auto &stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(stage.get());
            shadowStage->setUsage(ds, light, shadowFrameBuffer);
            shadowStage->clearFramebuffer(camera);
        }
    }
}

void ShadowFlow::resizeShadowMap(const scene::Light *light, gfx::DescriptorSet *ds) {
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();
    auto *device = gfx::Device::getInstance();
    const auto width = static_cast<uint32_t>(shadowInfo->getSize().x);
    const auto height = static_cast<uint32_t>(shadowInfo->getSize().y);
    const auto format = supportsR32FloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;
    gfx::Framebuffer *framebuffer = sceneData->getShadowFramebufferMap().at(light);

    auto *colorTexture = gfx::Device::getInstance()->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        format,
        width,
        height,
    });

    const auto &renderTargets = framebuffer->getColorTextures();
    for (auto *renderTarget : renderTargets) {
        const auto iter = std::find(_usedTextures.begin(), _usedTextures.end(), renderTarget);
        _usedTextures.erase(iter);
    }
    _usedTextures.emplace_back(colorTexture);

    switch (light->getType()) {
        case scene::LightType::DIRECTIONAL:
            ds->bindTexture(SHADOWMAP::BINDING, colorTexture);
            break;
        case scene::LightType::SPOT:
            ds->bindTexture(SPOTSHADOWMAP::BINDING, colorTexture);
            break;
        default:
            break;
    }
    ds->forceUpdate();

    auto *depthStencilTexture = device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
        gfx::Format::DEPTH,
        width,
        height,
    });

    auto *oldDepthStencilTexture = framebuffer->getDepthStencilTexture();
    const auto iter = std::find(_usedTextures.begin(), _usedTextures.end(), oldDepthStencilTexture);
    _usedTextures.erase(iter);
    _usedTextures.emplace_back(depthStencilTexture);

    framebuffer->destroy();
    framebuffer->initialize({
        _renderPass,
        {colorTexture},
        depthStencilTexture,
    });
}

void ShadowFlow::initShadowFrameBuffer(const RenderPipeline *pipeline, const scene::Light *light) {
    auto *device = gfx::Device::getInstance();
    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto *shadowInfo = sceneData->getShadows();
    const auto &shadowMapSize = shadowInfo->getSize();
    const auto width = static_cast<uint32_t>(shadowMapSize.x);
    const auto height = static_cast<uint32_t>(shadowMapSize.y);
    const auto format = supportsR32FloatTexture(device) ? gfx::Format::R32F : gfx::Format::RGBA8;

    const gfx::ColorAttachment colorAttachment{
        format,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        device->getGeneralBarrier({
            gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE,
            gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE,
        }),
    };

    const gfx::DepthStencilAttachment depthStencilAttachment{
        gfx::Format::DEPTH,
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::DISCARD,
        device->getGeneralBarrier({
            gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE,
            gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE,
        }),
    };

    gfx::RenderPassInfo rpInfo;
    rpInfo.colorAttachments.emplace_back(colorAttachment);
    rpInfo.depthStencilAttachment = depthStencilAttachment;

    ccstd::hash_t rpHash = cc::gfx::RenderPass::computeHash(rpInfo);
    const auto iter = renderPassHashMap.find(rpHash);
    if (iter != renderPassHashMap.end()) {
        _renderPass = iter->second;
    } else {
        _renderPass = device->createRenderPass(rpInfo);
        renderPassHashMap.insert({rpHash, _renderPass});
    }

    auto *colorTexture = device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        format,
        width,
        height,
    });
    _usedTextures.emplace_back(colorTexture);

    gfx::Texture *depthStencilTexture = device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        gfx::Format::DEPTH,
        width,
        height,
    });
    _usedTextures.emplace_back(depthStencilTexture);

    gfx::Framebuffer *framebuffer = device->createFramebuffer({
        _renderPass,
        {colorTexture},
        depthStencilTexture,
    });
    pipeline->getPipelineSceneData()->setShadowFramebuffer(light, framebuffer);
}

void ShadowFlow::destroy() {
    _pipeline->getGlobalDSManager()->bindTexture(SHADOWMAP::BINDING, nullptr);
    _pipeline->getGlobalDSManager()->bindTexture(SPOTSHADOWMAP::BINDING, nullptr);

    _renderPass = nullptr;
    renderPassHashMap.clear();
    _usedTextures.clear();
    _validLights.clear();

    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
