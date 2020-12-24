#pragma once

#include "../RenderFlow.h"

namespace cc {
namespace pipeline {

class ForwardStage;
struct Camera;

class ForwardFlow : public RenderFlow {
public:
    static const RenderFlowInfo &getInitializeInfo();

    ForwardFlow() = default;
    virtual ~ForwardFlow();
    
    virtual bool initialize(const RenderFlowInfo &info) override;
    virtual void activate(RenderPipeline *pipeline) override;
    virtual void destroy() override;
    virtual void render(Camera *camera) override;

private:
    static RenderFlowInfo _initInfo;

    ForwardStage *_forwardStage = nullptr;
};

} // namespace pipeline
} // namespace cc
