#pragma once
#include "../RenderStage.h"

namespace cc {
namespace pipeline {
class RenderQueue;

class CC_DLL ShadowStage : public RenderStage {
public:
    ShadowStage() = default;
    ~ShadowStage();

    static const RenderStageInfo &getInitializeInfo();

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    virtual bool initialize(const RenderStageInfo &info) override;

    virtual void destroy() override;
    virtual void render(RenderView *view) override;

private:
    static RenderStageInfo _initInfo;

    gfx::Rect _renderArea;
    RenderQueueDescList _renderQueueDescriptors;
    vector<RenderQueue *> _renderQueues;
};

} // namespace pipeline
} // namespace cc
