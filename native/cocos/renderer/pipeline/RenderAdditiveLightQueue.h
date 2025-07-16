/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "Define.h"
#include "base/Ptr.h"
#include "base/std/container/array.h"

namespace cc {
namespace scene {
class Camera;
class Pass;
class Light;
class SpotLight;
class SphereLight;
class PointLight;
class RangedDirectionalLight;
} // namespace scene
namespace pipeline {
struct RenderObject;
class RenderPipeline;
class RenderInstancedQueue;
class ForwardPipeline;

struct AdditiveLightPass {
    const scene::SubModel *subModel{nullptr}; // weak reference
    const scene::Pass *pass{nullptr};         // weak reference
    gfx::Shader *shader{nullptr};             //weak reference
    ccstd::vector<uint32_t> dynamicOffsets;
    ccstd::vector<const scene::Light *> lights; //light is weak reference
};

class RenderAdditiveLightQueue final {
public:
    explicit RenderAdditiveLightQueue(RenderPipeline *pipeline);
    ~RenderAdditiveLightQueue() = default;

    void recordCommandBuffer(gfx::Device *device, scene::Camera *camera, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer);
    void gatherLightPasses(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer);

private:
    static bool cullSphereLight(const scene::SphereLight *light, const scene::Model *model);
    static bool cullSpotLight(const scene::SpotLight *light, const scene::Model *model);
    static bool cullPointLight(const scene::PointLight *light, const scene::Model *model);
    static bool cullRangedDirLight(const scene::RangedDirectionalLight *light, const scene::Model *model);

    void clear();
    void addRenderQueue(scene::SubModel *subModel, const scene::Model *model, scene::Pass *pass, uint32_t lightPassIdx);
    void updateUBOs(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void updateLightDescriptorSet(const scene::Camera *camera, gfx::CommandBuffer *cmdBuffer);
    bool getLightPassIndex(const scene::Model *model, ccstd::vector<uint32_t> *lightPassIndices) const;
    void lightCulling(const scene::Model *model);

    uint32_t _lightBufferStride{0};
    uint32_t _lightBufferElementCount{0};
    uint32_t _lightBufferCount{16};
    uint32_t _phaseID{0};

    // weak reference
    RenderPipeline *_pipeline{nullptr};

    IntrusivePtr<gfx::Buffer> _lightBuffer;
    IntrusivePtr<gfx::Buffer> _firstLightBufferView;

    float _lightMeterScale{10000.0F};

    AdditiveLightPass _instancedLightPass;

    ccstd::vector<uint32_t> _dynamicOffsets;
    ccstd::vector<uint32_t> _lightIndices;

    ccstd::vector<float> _lightBufferData;
    ccstd::array<float, UBOShadow::COUNT> _shadowUBO{};

    // weak reference
    ccstd::vector<const scene::Light *> _validPunctualLights;

    ccstd::vector<IntrusivePtr<RenderInstancedQueue>> _instancedQueues;

    ccstd::vector<AdditiveLightPass> _lightPasses;

    ccstd::vector<ccstd::vector<uint32_t>> _sortedPSOCIArray;
};

} // namespace pipeline
} // namespace cc
