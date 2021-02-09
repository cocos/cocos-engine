/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
    void gatherValidLights(const Camera *camera);
    bool cullingLight(const Light *light, const ModelView *model);
    void addRenderQueue(const PassView *pass, const SubModelView *subModel, const ModelView *model, uint lightPassIdx);
    void updateUBOs(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateCameraUBO(const Camera *camera, gfx::CommandBuffer *cmdBuffer, bool hasOffScreenAttachments);
    void updateLightDescriptorSet(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateGlobalDescriptorSet(const Camera *camera, gfx::CommandBuffer *cmdBuffer);
    bool getLightPassIndex(const ModelView *model, vector<uint> &lightPassIndices) const;
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
