#pragma once
#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
class Shader;
} // namespace gfx
namespace pipeline {
class RenderPipeline;
class ForwardPipeline;
struct ModelView;
struct SubModelView;
struct PassView;
class InstanceBuffer;
class RenderInstancedQueue;
class RenderBatchedQueue;
struct RenderView;
struct AABB;

struct ShadowRenderData {
    const ModelView *model = nullptr;
    vector<gfx::Shader*> shaders;
    InstanceBuffer *instancedBuffer = nullptr;
};

class CC_DLL PlanarShadowQueue : public Object {
public:
    PlanarShadowQueue(RenderPipeline *);
    ~PlanarShadowQueue() = default;

    void clear();
    void gatherShadowPasses(RenderView *view , gfx::CommandBuffer *cmdBufferer);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);
    void destroy();
    
private:
    ForwardPipeline *_pipeline = nullptr;
    RenderInstancedQueue *_instancedQueue = nullptr;
    std::vector<const ModelView *> _pendingModels;
};
} // namespace pipeline
} // namespace cc
