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
#include "scene/Model.h"

namespace cc {
namespace scene {
class Camera;
}
namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
class Shader;
} // namespace gfx
namespace pipeline {
class RenderPipeline;
class InstanceBuffer;
class RenderInstancedQueue;

class CC_DLL PlanarShadowQueue final {
public:
    explicit PlanarShadowQueue(RenderPipeline *pipeline);
    ~PlanarShadowQueue();

    void clear();
    void gatherShadowPasses(scene::Camera *camera, gfx::CommandBuffer *cmdBuffer);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *, uint32_t subpassID = 0);
    void destroy();
    int getShadowPassIndex(const scene::SubModel *subModel) const;

private:
    // weak reference
    RenderPipeline *_pipeline{nullptr};
    // manage memory manually
    RenderInstancedQueue *_instancedQueue{nullptr};

    uint32_t _phaseID = 0;

    // weak reference
    ccstd::vector<const scene::Model *> _castModels;
    // weak reference
    ccstd::vector<const scene::SubModel *> _subModelArray;
    // weak reference
    ccstd::vector<const scene::Pass *> _passArray;
    // weak reference
    ccstd::vector<gfx::Shader *> _shaderArray;
};
} // namespace pipeline
} // namespace cc
