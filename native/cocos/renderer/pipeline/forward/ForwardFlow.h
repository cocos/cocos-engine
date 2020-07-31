#pragma once

#include "../RenderFlow.h"

namespace cc {
namespace pipeline {

class RenderView;

class ForwardFlow : public RenderFlow {
public:
    ForwardFlow() = default;
    ~ForwardFlow() = default;

    virtual bool initialize(const RenderFlowInfo &info) override;
    virtual void destroy() override;
    virtual void render(RenderView *view) override;
};

} // namespace pipeline
} // namespace cc
