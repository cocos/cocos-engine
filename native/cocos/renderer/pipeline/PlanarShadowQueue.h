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
struct SubModelView;
struct PassView;
class InstanceBuffer;
class RenderInstancedQueue;
class RenderBatchedQueue;
struct Camera;

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
    void gatherShadowPasses(Camera *camera , gfx::CommandBuffer *cmdBufferer);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);
    void destroy();
    
private:
    RenderPipeline *_pipeline = nullptr;
    RenderInstancedQueue *_instancedQueue = nullptr;
    std::vector<const ModelView *> _pendingModels;
};
} // namespace pipeline
} // namespace cc
