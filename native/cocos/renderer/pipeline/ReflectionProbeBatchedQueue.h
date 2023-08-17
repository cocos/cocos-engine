/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
#include "scene/Define.h"
namespace cc {
namespace scene {
class Camera;
class Pass;
class ReflectionProbe;
} // namespace scene
namespace pipeline {
struct RenderObject;
class RenderInstancedQueue;
class RenderPipeline;

//const uint32_t phaseID(PassPhase::getPhaseID("shadow-caster"));

class CC_DLL ReflectionProbeBatchedQueue final {
public:
    explicit ReflectionProbeBatchedQueue(RenderPipeline *);
    ~ReflectionProbeBatchedQueue();

    void destroy();
    void clear();
    void gatherRenderObjects(const scene::Camera *, gfx::CommandBuffer *, const scene::ReflectionProbe *probe);
    void add(const scene::Model *);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

    void resetMacro();

    bool isUseReflectMapPass(const scene::SubModel *subModel) const;

private:
    int getDefaultPassIndex(const scene::SubModel *subModel) const;
    int getReflectMapPassIndex(const scene::SubModel *subModel) const;

    // weak reference
    RenderPipeline *_pipeline{nullptr};
    // weak reference
    ccstd::vector<const scene::SubModel *> _subModels;
    // weak reference
    ccstd::vector<scene::Pass *> _passes;
    // weak reference
    ccstd::vector<gfx::Shader *> _shaders;
    // manage memory manually
    RenderInstancedQueue *_instancedQueue{nullptr};
    uint32_t _phaseID{0};
    uint32_t _phaseReflectMapID{0};
    ccstd::vector<const scene::SubModel *> _rgbeSubModels;
    ccstd::vector<scene::IMacroPatch> _patches;
};

} // namespace pipeline
} // namespace cc
