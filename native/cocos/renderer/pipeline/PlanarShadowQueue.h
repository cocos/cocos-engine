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
struct ModelView;
class InstanceBuffer;

struct ShadowRenderData {
    const ModelView *model = nullptr;
    vector<gfx::Shader*> shaders;
    InstanceBuffer *instancedBuffer = nullptr;
};

class CC_DLL PlanarShadowQueue : public Object {
public:
    PlanarShadowQueue(RenderPipeline *);
    ~PlanarShadowQueue() = default;

    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

private:
    ShadowRenderData createShadowData(const ModelView *model);
    
private:
    RenderPipeline *_pipeline = nullptr;
};
} // namespace pipeline
} // namespace cc
