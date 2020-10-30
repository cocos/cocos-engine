#pragma once
#include "core/CoreStd.h"

namespace cc {
namespace pipeline {
struct SubModelView;
struct PassView;
struct RenderObject;
class RenderInstancedQueue;
class RenderBatchedQueue;

class CC_DLL ShadowMapBatchedQueue : public Object {
public:
    ShadowMapBatchedQueue();
    ~ShadowMapBatchedQueue() = default;
    void destroy();

    void clear(gfx::Buffer *buffer);
    void add(const RenderObject &renderObject, uint subModelIdx, uint passIdx);
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const;

private:
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
