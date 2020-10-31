#pragma once

#include "core/CoreStd.h"

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
};

class RenderAdditiveLightQueue : public Object {
public:
    RenderAdditiveLightQueue(RenderPipeline *pipeline);
    ~RenderAdditiveLightQueue();

    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer);
    void gatherLightPasses(const RenderView *view, gfx::CommandBuffer *cmdBuffer);

private:
    void updateUBOs(const RenderView *view, gfx::CommandBuffer *cmdBuffer);

private:
    gfx::Device *_device = nullptr;
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
    ForwardPipeline *_forwardPipline = nullptr;

    float _fpScale = 0;
    bool _isHDR = false;
    uint _lightBufferStride = 0;
    uint _lightBufferElementCount = 0;
    uint _lightBufferCount = 16;
    float _lightMeterScale = 10000.0f;
};

} // namespace pipeline
} // namespace cc
