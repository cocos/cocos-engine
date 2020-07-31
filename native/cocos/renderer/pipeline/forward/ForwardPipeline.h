#pragma once

#include "../RenderPipeline.h"

namespace cc {
namespace pipeline {

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline();
    ~ForwardPipeline();

    virtual bool initialize(const RenderPipelineInfo *info) override;
    virtual void destroy() override;
    virtual bool activate() override;

    CC_INLINE gfx::Buffer *getLightsUBO() { return _lightsUBO; }

private:
//    void cullLightPerModel(cc::Model *model);

private:
    gfx::Buffer *_lightsUBO = nullptr;
};

} // namespace pipeline
} // namespace cc
