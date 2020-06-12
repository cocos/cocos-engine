#pragma once

#include "../RenderStage.h"

NS_PP_BEGIN

class RenderFlow;
class RenderView;
class RenderBatchedQueue;
class RenderInstancedQueue;
class RenderAdditiveLightQueue;

class CC_DLL ForwardStage : public RenderStage {
public:
    static const RenderStageInfo &getInitializeInfo();
    
    ForwardStage();
    ~ForwardStage();

    virtual void activate(RenderFlow *flow) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void rebuild() override;
    virtual void render(RenderView *view) override;
    
private:
    static RenderStageInfo _initInfo;
    
    RenderBatchedQueue *_batchedQueue = nullptr;
    RenderInstancedQueue *_instancedQueue = nullptr;
    RenderAdditiveLightQueue *_additiveLightQueue = nullptr;
};

NS_PP_END
