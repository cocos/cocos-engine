#pragma once

#include "core/CoreStd.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
struct SubModelView;
struct Light;
struct RenderObject;
struct PassView;
class RenderPipeline;
class RenderView;
class DefineMap;
class RenderInstancedQueue;
class RenderBatchedQueue;
class Device;
struct Sphere;
class Shader;
class ForwardPipeline;

struct AdditiveLightPass {
    const SubModelView *subModel = nullptr;
    const PassView *pass = nullptr;
    gfx::Shader *shader = nullptr;
    vector<uint> dynamicOffsets;
    vector<const Light *> lights;
};

class RenderAdditiveLightQueue : public Object {
public:
    RenderAdditiveLightQueue(RenderPipeline *pipeline);
    ~RenderAdditiveLightQueue();

    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer);
    void gatherLightPasses(const RenderView *view, gfx::CommandBuffer *cmdBuffer);

private:
    void updateUBOs(const RenderView *view, gfx::CommandBuffer *cmdBuffer);
    int getLightPassIndex(const ModelView *model) const;
    bool cullingLight(const Light *light, const ModelView *model);
    void updateSpotUBO(gfx::DescriptorSet *, const Light *, gfx::CommandBuffer *cmdBufferer) const;

private:
    ForwardPipeline *_pipeline = nullptr;
    vector<vector<SubModelView *>> _sortedSubModelsArray;
    vector<vector<uint>> _sortedPSOCIArray;
    vector<const Light *> _validLights;
    vector<uint> _lightIndices;
    vector<AdditiveLightPass> _lightPasses;
    vector<RenderObject> _renderObjects;
    vector<uint> _dynamicOffsets;
    vector<float> _lightBufferData;
    RenderInstancedQueue *_instancedQueue = nullptr;
    RenderBatchedQueue *_batchedQueue = nullptr;
    gfx::Buffer *_lightBuffer = nullptr;
    gfx::Buffer *_firstlightBufferView = nullptr;
    gfx::Sampler *_sampler = nullptr;

    float _fpScale = 0;
    bool _isHDR = false;
    uint _lightBufferStride = 0;
    uint _lightBufferElementCount = 0;
    uint _lightBufferCount = 16;
    float _lightMeterScale = 10000.0f;
    uint _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
