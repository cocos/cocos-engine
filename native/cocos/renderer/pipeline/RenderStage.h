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
#include "base/RefCounted.h"

namespace cc {
namespace scene {
class Camera;
}
namespace gfx {
class Framebuffer;
} // namespace gfx

namespace pipeline {

class RenderFlow;
class RenderPipeline;
class RenderQueue;

struct CC_DLL RenderStageInfo {
    ccstd::string name;
    uint32_t priority = 0;
    uint32_t tag = 0;
    RenderQueueDescList renderQueues;
};

class CC_DLL RenderStage : public RefCounted {
public:
    RenderStage();
    ~RenderStage() override;

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow);
    virtual bool initialize(const RenderStageInfo &info);

    virtual void destroy();

    // should not be pure virtual, since it will be instantiated in inspector
    virtual void render(scene::Camera *camera) {}

    inline const ccstd::string &getName() const { return _name; }
    inline void setName(ccstd::string &name) { _name = name; }
    inline uint32_t getPriority() const { return _priority; }
    inline void setPriority(uint32_t priority) { _priority = priority; }
    inline uint32_t getTag() const { return _tag; }
    inline void setTag(uint32_t tag) { _tag = tag; }
    inline RenderFlow *getFlow() const { return _flow; }

protected:
    gfx::Rect _renderArea;
    // Generate quad ia, cannot be updated inside renderpass.
    // weak reference, it is created and recorded in RenderPipeline::_quadIA.
    gfx::InputAssembler *_inputAssembler{nullptr};
    RenderQueueDescList _renderQueueDescriptors;
    // Manage memory manually.
    ccstd::vector<RenderQueue *> _renderQueues;
    // weak reference
    RenderPipeline *_pipeline{nullptr};
    // weak reference
    RenderFlow *_flow{nullptr};
    // weak reference
    gfx::Device *_device{nullptr};
    ccstd::string _name;
    uint32_t _priority{0};
    uint32_t _tag{0};
    gfx::ColorList _clearColors = {{0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}};
};

} // namespace pipeline
} // namespace cc
