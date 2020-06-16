#pragma once

#include "../RenderPipeline.h"

namespace cc {
namespace pipeline {

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline();
    ~ForwardPipeline();

    virtual bool initialize(const RenderPipelineInfo &info) override;
    virtual void destroy() override;
    virtual bool activate(cc::Root *root) override;
    virtual void rebuild() override;
    virtual void updateUBOs(RenderView *view) override;
    virtual void sceneCulling() override;
    virtual gfx::vector<float>::type &getLightIndices() const override;
    virtual gfx::vector<float>::type &getLightIndexOffsets() const override;
    virtual gfx::vector<gfx::GFXBuffer *>::type &getLightBuffers() const override;

    CC_INLINE gfx::GFXBuffer *getLightsUBO() { return _lightsUBO; }

private:
    void cullLightPerModel(cc::Model *model);

private:
    gfx::GFXBuffer *_lightsUBO = nullptr;
};

} // namespace pipeline
} // namespace cc
