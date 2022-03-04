/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
    String              name;
    uint                priority = 0;
    uint                tag      = 0;
    RenderQueueDescList renderQueues;
};

class CC_DLL RenderStage : public Object {
public:
    RenderStage();
    ~RenderStage() override;

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow);
    virtual bool initialize(const RenderStageInfo &info);

    virtual void destroy();
    virtual void render(scene::Camera *camera) = 0;

    inline const String &getName() const { return _name; }
    inline uint          getPriority() const { return _priority; }
    inline uint          getTag() const { return _tag; }
    inline RenderFlow *  getFlow() const { return _flow; }

protected:
    gfx::Rect _renderArea;
    // Generate quad ia, cannot be updated inside renderpass
    gfx::InputAssembler * _inputAssembler{nullptr};
    RenderQueueDescList   _renderQueueDescriptors;
    vector<RenderQueue *> _renderQueues;
    RenderPipeline *      _pipeline = nullptr;
    RenderFlow *          _flow     = nullptr;
    gfx::Device *         _device   = nullptr;
    String                _name;
    uint                  _priority    = 0;
    uint                  _tag         = 0;
    gfx::ColorList        _clearColors = {{0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}, {0.0F, 0.0F, 0.0F, 0.0F}};
};

} // namespace pipeline
} // namespace cc
