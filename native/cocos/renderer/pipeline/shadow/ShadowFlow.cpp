
#include "ShadowFlow.h"
#include "../Define.h"
#include "../forward/ForwardPipeline.h"
#include "ShadowStage.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXRenderPass.h"
#include "gfx/GFXTexture.h"
#include "math/Vec2.h"

namespace cc {
namespace pipeline {
RenderFlowInfo ShadowFlow::_initInfo = {
    "ShadowFlow",
    static_cast<uint>(ForwardFlowPriority::SHADOW),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderFlowInfo &ShadowFlow::getInitializeInfo() { return ShadowFlow::_initInfo; }

ShadowFlow::~ShadowFlow() {
    destroy();
}

bool ShadowFlow::initialize(const RenderFlowInfo &info) {
    RenderFlow::initialize(info);

    auto shadowStage = CC_NEW(ShadowStage);
    shadowStage->initialize(ShadowStage::getInitializeInfo());
    _stages.emplace_back(shadowStage);
    return true;
}

void ShadowFlow::activate(RenderPipeline *pipeline) {
    RenderFlow::activate(pipeline);

    auto device = gfx::Device::getInstance();
    cc::Vec2 shadowMapSize; //TODO
    _width = shadowMapSize.x;
    _height = shadowMapSize.y;

    if (!_renderPass) {
        _renderPass = device->createRenderPass({
            {{
                gfx::Format::RGBA8,
                gfx::LoadOp::CLEAR, // should clear color attachment
                gfx::StoreOp::STORE,
                1,
                gfx::TextureLayout::UNDEFINED,
                gfx::TextureLayout::PRESENT_SRC,
            }},
            {
                device->getDepthStencilFormat(),
                gfx::LoadOp::CLEAR,
                gfx::StoreOp::STORE,
                gfx::LoadOp::CLEAR,
                gfx::StoreOp::STORE,
                1,
                gfx::TextureLayout::UNDEFINED,
                gfx::TextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });
    }

    if (_renderTargets.size() == 0) {
        _renderTargets.emplace_back(device->createTexture({
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA8,
            _width,
            _height,
        }));
    }

    if (!_depthTexture) {
        _depthTexture = device->createTexture({
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
            device->getDepthStencilFormat(),
            _width,
            _height,
        });
    }

    if (!_framebuffer) {
        _framebuffer = device->createFramebuffer({
            _renderPass,
            _renderTargets,
            {}, //colorMipmapLevels
            _depthTexture,
        });
    }

    for (const auto stage : _stages) {
        static_cast<ShadowStage *>(stage)->setFramebuffer(_framebuffer);
    }
}

void ShadowFlow::render(RenderView *view) {
    //TODO
    //    const shadowInfo = ShadowInfo.instance;
    //    if (!shadowInfo.enabled) { return; }
    //
    //    const shadowMapSize = shadowInfo.shadowMapSize;
    //    if (this._width !== shadowMapSize.x || this._height !== shadowMapSize.y) {
    //        this.resizeShadowMap(shadowMapSize.x,shadowMapSize.y);
    //        this._width = shadowMapSize.x;
    //        this._height = shadowMapSize.y;
    //    }
    //
    //    const pipeline = this._pipeline as ForwardPipeline;
    //    view.camera.update();
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    pipeline->updateUBOs(view);
    RenderFlow::render(view);

    //TODO
    //    pipeline.descriptorSet.bindTexture(UNIFORM_SHADOWMAP.binding, this._shadowFrameBuffer!.colorTextures[0]!);
}

void ShadowFlow::resizeShadowMap(uint width, uint height) {
    if (_depthTexture) {
        _depthTexture->resize(width, height);
    }

    if (_renderTargets.size()) {
        for (auto renderTarget : _renderTargets) {
            if (renderTarget) {
                renderTarget->resize(width, height);
            }
        }
    }

    if (_framebuffer) {
        _framebuffer->destroy();
        _framebuffer->initialize({
            _renderPass,
            _renderTargets,
            {},
            _depthTexture,
        });
    }
}

void ShadowFlow::destroy() {
    for (auto renderTarget : _renderTargets) {
        CC_SAFE_DESTROY(renderTarget);
    }
    _renderTargets.clear();

    CC_SAFE_DESTROY(_renderPass);
    CC_SAFE_DESTROY(_depthTexture)
    CC_SAFE_DESTROY(_framebuffer);

    RenderFlow::destroy();
}

} // namespace pipeline
} // namespace cc
