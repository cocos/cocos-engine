#pragma once
#include "../RenderFlow.h"
namespace cc {
namespace pipeline {
class CC_DLL ShadowFlow : public RenderFlow {
public:
    ShadowFlow() = default;
    virtual ~ShadowFlow();

    static const RenderFlowInfo &getInitializeInfo();

    virtual bool initialize(const RenderFlowInfo &info) override;

    virtual void activate(RenderPipeline *pipeline) override;

    virtual void render(RenderView *view) override;

    virtual void destroy() override;

private:
    void resizeShadowMap(uint width, uint height);

private:
    static RenderFlowInfo _initInfo;

    gfx::RenderPass *_renderPass = nullptr;
    gfx::TextureList _renderTargets;
    gfx::Texture *_depthTexture = nullptr;
    gfx::Framebuffer *_framebuffer = nullptr;

    uint _width = 0;
    uint _height = 0;
};
} // namespace pipeline
} // namespace cc
