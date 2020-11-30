
#include "ShadowFlow.h"

#include "../Define.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "ShadowStage.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXRenderPass.h"
#include "gfx/GFXTexture.h"
#include "../forward/SceneCulling.h"

namespace cc {
namespace pipeline {
RenderFlowInfo ShadowFlow::_initInfo = {
    "ShadowFlow",
    static_cast<uint>(ForwardFlowPriority::SHADOW),
    static_cast<uint>(RenderFlowTag::SCENE),
    {}};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::_initInfo; }

ShadowFlow::~ShadowFlow() {
}

bool ShadowFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);
    if (_stages.empty()) {
        auto shadowStage = CC_NEW(ShadowStage);
        shadowStage->initialize(ShadowStage::getInitializeInfo());
        _stages.emplace_back(shadowStage);
    }

    return true;
}

void ShadowFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);
}

void ShadowFlow::render(RenderView *view) {
    auto *pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto *shadowInfo = pipeline->getShadows();
    if (!shadowInfo->enabled || shadowInfo->getShadowType() != ShadowType::SHADOWMAP) return;

    lightCollecting(view, _validLights);
    shadowCollecting(pipeline, view);

    const auto &shadowFramebufferMap = pipeline->getShadowFramebufferMap();
    for (const auto *light : _validLights) {
        if (!shadowFramebufferMap.count(light)) {
            initShadowFrameBuffer(pipeline, light);
        }

        auto *shadowFrameBuffer = shadowFramebufferMap.at(light);
        if (shadowInfo->shadowMapDirty) {
            resizeShadowMap(light, (uint)shadowInfo->size.x, (uint)shadowInfo->size.y);
        }
        for (auto *_stage : _stages) {
            auto *shadowStage = static_cast<ShadowStage *>(_stage);
            shadowStage->setUseData(light, shadowFrameBuffer);
            shadowStage->render(view);
        }
    }
}

void ShadowFlow::resizeShadowMap(const Light *light, const uint width, const uint height) const {
    auto *pipeline = static_cast<ForwardPipeline *>(_pipeline);

    if (pipeline->getShadowFramebufferMap().count(light)) {
        auto *framebuffer = pipeline->getShadowFramebufferMap().at(light);

        if (!framebuffer) {
            return;
        }

        auto &renderTargets = framebuffer->getColorTextures();
        for (auto *renderTarget : renderTargets) {
            renderTarget->resize(width, height);
        }

        auto *depth = framebuffer->getDepthStencilTexture();
        if (depth) {
            depth->resize(width, height);
        }

        framebuffer->destroy();
        framebuffer->initialize({
            _renderPass,
            renderTargets,
            depth,
            {},
        });
    }
}

void ShadowFlow::initShadowFrameBuffer(ForwardPipeline *pipeline, const Light *light) {
    auto device = gfx::Device::getInstance();
    const auto shadowMapSize = static_cast<ForwardPipeline *>(this->_pipeline)->getShadows()->size;
    const auto width = (uint)shadowMapSize.x;
    const auto height = (uint)shadowMapSize.y;

    if (!_renderPass) {
        _renderPass = device->createRenderPass({
            {{
                gfx::Format::RGBA8,
                1,
                gfx::LoadOp::CLEAR, // should clear color attachment
                gfx::StoreOp::STORE,
                gfx::TextureLayout::UNDEFINED,
                gfx::TextureLayout::PRESENT_SRC,
            }},
            {
                device->getDepthStencilFormat(),
                1,
                gfx::LoadOp::CLEAR,
                gfx::StoreOp::STORE,
                gfx::LoadOp::CLEAR,
                gfx::StoreOp::STORE,
                gfx::TextureLayout::UNDEFINED,
                gfx::TextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });
    }

    vector<gfx::Texture *> renderTargets;
    renderTargets.emplace_back(device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
        gfx::Format::RGBA8,
        width,
        height,
    }));

    gfx::Texture *depth = device->createTexture({
        gfx::TextureType::TEX2D,
        gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
        device->getDepthStencilFormat(),
        width,
        height,
    });

    gfx::Framebuffer *framebuffer = device->createFramebuffer({
        _renderPass,
        renderTargets,
        depth,
        {}, //colorMipmapLevels
    });

    pipeline->setShadowFramebuffer(light, framebuffer);
}

void ShadowFlow::destroy() {
    static_cast<ForwardPipeline *>(_pipeline)->destroyShadowFrameBuffers();

    if (_renderPass) {
        _renderPass->destroy();
        _renderPass = nullptr;
    }

    _validLights.clear();

    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
