/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "Define.h"
#include "cocos/base/Macros.h"
namespace cc {
namespace scene {
class Camera;
class Pass;
class ReflectionProbe;
} // namespace scene
namespace pipeline {
struct RenderObject;
class RenderInstancedQueue;
class RenderBatchedQueue;
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
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *) const;

    void resetMacro()const;

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
    // manage memory manually
    RenderBatchedQueue *_batchedQueue{nullptr};
    uint32_t _phaseID{0};
    uint32_t _phaseReflectMapID{0};
    ccstd::vector<const scene::SubModel *> _rgbeSubModels;
};

} // namespace pipeline
} // namespace cc
