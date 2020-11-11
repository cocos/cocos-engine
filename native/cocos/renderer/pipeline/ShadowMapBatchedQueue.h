#pragma once
#include <algorithm>

#include "core/CoreStd.h"
#include "Define.h"

namespace cc {
namespace pipeline {
struct SubModelView;
struct PassView;
struct RenderObject;
class RenderInstancedQueue;
class RenderBatchedQueue;
class ForwardPipeline;
class Device;
struct Shadows;
struct Light;
struct ModelView;

//const uint phaseID(PassPhase::getPhaseID("shadow-caster"));

class CC_DLL ShadowMapBatchedQueue : public Object {
public:
    ShadowMapBatchedQueue(ForwardPipeline *);
    ~ShadowMapBatchedQueue() = default;
    void destroy();

    void clear();
    void gatherLightPasses(const Light *, gfx::CommandBuffer *cmdBufferer);
    void add(const ModelView *);
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const;

private:
    void updateUBOs(const Light *, gfx::CommandBuffer *cmdBufferer) const;
    int getShadowPassIndex(const ModelView *model) const;

private:
    ForwardPipeline *_pipeline = nullptr;
    vector<const SubModelView *> _subModels;
    vector<const PassView *> _passes;
    vector<gfx::Shader *> _shaders;
    RenderInstancedQueue *_instancedQueue = nullptr;
    RenderBatchedQueue *_batchedQueue = nullptr;
    gfx::Buffer *_buffer = nullptr;
    uint _phaseID = 0;
};
} // namespace pipeline
} // namespace cc
