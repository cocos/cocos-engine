#pragma once

#include "Define.h"

NS_CC_BEGIN
class GFXFramebuffer;
NS_CC_END

NS_PP_BEGIN

class RenderFlow;
class RenderPipeline;
class RenderView;

class CC_DLL RenderStage : public cocos2d::Object {
public:
    RenderStage() = default;
    virtual ~RenderStage() = default;

    virtual bool initialize(const RenderStageInfo &info);
    virtual void activate(RenderFlow *flow);

    virtual void destroy() = 0;
    virtual void render(RenderView *view) = 0;
    virtual void resize(uint width, uint height) = 0;
    virtual void rebuild() = 0;

    void setClearColor(/*color: IGFXColor*/);
    void setClearColors(/*colors: IGFXColor[]*/);
    void setClearDepth(float depth);
    void setClearStencil(float stencil);
    void setRenderArea(size_t width, size_t height);
    void sortRenderQueue();
    void executeCommandBuffer(RenderView *view);
    void createBuffer();

    CC_INLINE RenderFlow *getFlow() const { return _flow; }
    CC_INLINE RenderPipeline *getPipeline() const { return _pipeline; }
    CC_INLINE int getPriority() const { return _priority; }
    CC_INLINE cocos2d::GFXFramebuffer *getFrameBuffer() const { return _frameBuffer; }

protected:
    RenderFlow *_flow = nullptr;
    RenderPipeline *_pipeline = nullptr;
    cocos2d::GFXFramebuffer *_frameBuffer = nullptr;
    int _priority = 0;
};

NS_PP_END
