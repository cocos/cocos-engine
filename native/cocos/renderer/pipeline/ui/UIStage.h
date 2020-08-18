#pragma once
#include "../RenderStage.h"

namespace cc {
namespace pipeline {

class CC_DLL UIStage : public RenderStage {
public:
    UIStage() = default;
    ~UIStage();

    static const RenderStageInfo &getInitializeInfo();

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    virtual bool initialize(const RenderStageInfo &info) override;

    virtual void destroy() override;
    virtual void render(RenderView *view) override;

private:
    static RenderStageInfo _initInfo;

    gfx::Rect _renderArea;
    gfx::Device *_device = nullptr;
};

} // namespace pipeline
} // namespace cc
