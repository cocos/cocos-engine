#pragma once

#include "../RenderPipeline.h"

NS_PP_BEGIN

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
    virtual cc::vector<float>::type &getLightIndices() const override;
    virtual cc::vector<float>::type &getLightIndexOffsets() const override;
    virtual cc::vector<cc::GFXBuffer *>::type &getLightBuffers() const override;

    CC_INLINE cc::GFXBuffer *getLightsUBO() { return _lightsUBO; }

private:
    void cullLightPerModel(cc::Model *model);

private:
    cc::GFXBuffer *_lightsUBO = nullptr;
};

NS_PP_END
