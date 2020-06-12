#pragma once

#include "../RenderPipeline.h"

NS_PP_BEGIN

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline();
    ~ForwardPipeline();

    virtual bool initialize(const RenderPipelineInfo &info) override;
    virtual void destroy() override;
    virtual bool activate(cocos2d::Root *root) override;
    virtual void rebuild() override;
    virtual void updateUBOs(RenderView *view) override;
    virtual void sceneCulling() override;
    virtual cocos2d::vector<float>::type &getLightIndices() const override;
    virtual cocos2d::vector<float>::type &getLightIndexOffsets() const override;
    virtual cocos2d::vector<cocos2d::GFXBuffer *>::type &getLightBuffers() const override;

    CC_INLINE cocos2d::GFXBuffer *getLightsUBO() { return _lightsUBO; }

private:
    void cullLightPerModel(cocos2d::Model *model);

private:
    cocos2d::GFXBuffer *_lightsUBO = nullptr;
};

NS_PP_END
