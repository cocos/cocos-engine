#pragma once

#include "../RenderStage.h"

namespace cc {
namespace pipeline {

class RenderFlow;
class RenderBatchedQueue;
class RenderInstancedQueue;
class RenderAdditiveLightQueue;
class PlanarShadowQueue;
class ForwardPipeline;
class UIPhase;
struct Camera;

class CC_DLL ForwardStage : public RenderStage {
public:
    static const RenderStageInfo &getInitializeInfo();

    ForwardStage();
    ~ForwardStage();

    virtual bool initialize(const RenderStageInfo &info) override;
    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow) override;
    virtual void destroy() override;
    virtual void render(Camera *camera) override;

private:
    static RenderStageInfo _initInfo;
    ForwardPipeline *_forwrdPipeline = nullptr;
    PlanarShadowQueue *_planarShadowQueue = nullptr;
    RenderBatchedQueue *_batchedQueue = nullptr;
    RenderInstancedQueue *_instancedQueue = nullptr;
    RenderAdditiveLightQueue *_additiveLightQueue = nullptr;
    UIPhase *_uiPhase = nullptr;
    gfx::Rect _renderArea;
    uint _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
