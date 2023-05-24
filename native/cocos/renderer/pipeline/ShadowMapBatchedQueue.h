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
#include "cocos/base/Macros.h"
namespace cc {
namespace scene {
class Camera;
class Pass;
} // namespace scene
namespace pipeline {
struct RenderObject;
class RenderInstancedQueue;
class RenderPipeline;

//const uint32_t phaseID(PassPhase::getPhaseID("shadow-caster"));

class CC_DLL ShadowMapBatchedQueue final {
public:
    explicit ShadowMapBatchedQueue(RenderPipeline *);
    ~ShadowMapBatchedQueue();
    void destroy();

    void clear();
    void gatherLightPasses(const scene::Camera *, const scene::Light *, gfx::CommandBuffer *, uint32_t level = 0);
    void add(const scene::Model *);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *) const;

private:
    int getShadowPassIndex(const scene::SubModel *subModel) const;

    // weak reference
    RenderPipeline *_pipeline{nullptr};
    // weak reference
    ccstd::vector<const scene::SubModel *> _subModels;
    // weak reference
    ccstd::vector<const scene::Pass *> _passes;
    // weak reference
    ccstd::vector<gfx::Shader *> _shaders;
    // manage memory manually
    RenderInstancedQueue *_instancedQueue{nullptr};
    uint32_t _phaseID = 0;
};

} // namespace pipeline
} // namespace cc
