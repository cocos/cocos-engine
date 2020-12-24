#pragma once
#include "../RenderStage.h"

namespace cc {
namespace pipeline {
class RenderQueue;
class ShadowMapBatchedQueue;

class CC_DLL ShadowStage : public RenderStage {
public:
    ShadowStage();
    virtual ~ShadowStage();

    static const RenderStageInfo &getInitializeInfo();

    virtual bool initialize(const RenderStageInfo &info) override;
    virtual void destroy() override;
    virtual void render(Camera *camera) override;
    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow) override;

    CC_INLINE void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }
    CC_INLINE void setUseData(const Light *light, gfx::Framebuffer *framebuffer) {
        _light = light;
        _framebuffer = framebuffer;
    };

private:
    static RenderStageInfo _initInfo;

    gfx::Rect _renderArea;
    const Light *_light = nullptr;
    gfx::Framebuffer *_framebuffer = nullptr;

    ShadowMapBatchedQueue *_additiveShadowQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
