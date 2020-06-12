#pragma once

#include "../RenderFlow.h"

NS_PP_BEGIN

class RenderView;

class ForwardFlow : public RenderFlow {
public:
    ForwardFlow() = default;
    ~ForwardFlow() = default;

    virtual bool initialize(const RenderFlowInfo &info) override;
    virtual void destroy() override;
    virtual void render(RenderView *view) override;
    virtual void rebuild() override;
};

NS_PP_END
