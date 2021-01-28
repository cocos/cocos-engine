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
    void gatherLightPasses(const Light *, gfx::CommandBuffer *);
    void add(const ModelView *, gfx::CommandBuffer *);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *) const;

private:
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
