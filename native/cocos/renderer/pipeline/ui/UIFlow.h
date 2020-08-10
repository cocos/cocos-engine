#pragma once
#include "../RenderFlow.h"

namespace cc {
namespace pipeline {

class CC_DLL UIFlow : public RenderFlow {
public:
    UIFlow() = default;
    ~UIFlow();

    static const RenderFlowInfo &getInitializeInfo();

    virtual bool initialize(const RenderFlowInfo &info) override;
    virtual void activate(RenderPipeline *pipeline) override;
    virtual void render(RenderView *view) override;
    virtual void destroy() override;

private:
    static RenderFlowInfo _initInfo;
};

} // namespace pipeline
} // namespace cc
