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
    virtual void render(RenderView *view) override;

    CC_INLINE void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }

private:
    static RenderStageInfo _initInfo;

    gfx::Rect _renderArea;
    gfx::Framebuffer *_framebuffer = nullptr;

    ShadowMapBatchedQueue *_additiveShadowQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
