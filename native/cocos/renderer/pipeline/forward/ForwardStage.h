#pragma once

#include "../RenderStage.h"

namespace cc {
namespace pipeline {

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

} // namespace pipeline
} // namespace cc
