/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
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
class DefineMap;
class RenderInstancedQueue;
class RenderBatchedQueue;
class Device;
struct Sphere;
class Shader;
class ForwardPipeline;
class DescriptorSet;

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
    void gatherLightPasses(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void destroy();

private:
    void clear();
    void updateUBOs(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateCameraUBO(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateLightDescriptorSet(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateGlobalDescriptorSet(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    bool getLightPassIndex(const ModelView *model, vector<uint> &lightPassIndices) const;
    bool cullingLight(const Light *light, const ModelView *model);
    gfx::DescriptorSet *getOrCreateDescriptorSet(const Light *);

private:
    ForwardPipeline *_pipeline = nullptr;
    vector<vector<SubModelView *>> _sortedSubModelsArray;
    vector<vector<uint>> _sortedPSOCIArray;
    vector<const Light *> _validLights;
    vector<uint> _lightIndices;
    vector<AdditiveLightPass> _lightPasses;
    vector<uint> _dynamicOffsets;
    vector<float> _lightBufferData;
    RenderInstancedQueue *_instancedQueue = nullptr;
    RenderBatchedQueue *_batchedQueue = nullptr;
    gfx::Buffer *_lightBuffer = nullptr;
    gfx::Buffer *_firstLightBufferView = nullptr;
    gfx::Sampler *_sampler = nullptr;

    std::unordered_map<const Light *, gfx::DescriptorSet *> _descriptorSetMap;
    std::array<float, UBOGlobal::COUNT> _globalUBO;
    std::array<float, UBOCamera::COUNT> _cameraUBO;
    std::array<float, UBOShadow::COUNT> _shadowUBO;

    uint _lightBufferStride = 0;
    uint _lightBufferElementCount = 0;
    uint _lightBufferCount = 16;
    float _lightMeterScale = 10000.0f;
    uint _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
