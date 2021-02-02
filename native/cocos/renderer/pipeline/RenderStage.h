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

#include "Define.h"

namespace cc {

namespace gfx {
class Framebuffer;
} // namespace gfx

namespace pipeline {

class RenderFlow;
class RenderPipeline;
class RenderQueue;
struct Camera;

struct CC_DLL RenderStageInfo {
    String name;
    uint priority = 0;
    uint tag = 0;
    RenderQueueDescList renderQueues;
};

class CC_DLL RenderStage : public Object {
public:
    RenderStage();
    virtual ~RenderStage();

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow);
    virtual bool initialize(const RenderStageInfo &info);

    virtual void destroy();
    virtual void render(Camera *camera) = 0;

    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getTag() const { return _tag; }
    CC_INLINE RenderFlow *getFlow() const {return _flow;}

protected:
    RenderQueueDescList _renderQueueDescriptors;
    vector<RenderQueue *> _renderQueues;
    RenderPipeline *_pipeline = nullptr;
    RenderFlow *_flow = nullptr;
    gfx::Device *_device = nullptr;
    String _name;
    uint _priority = 0;
    uint _tag = 0;
    gfx::ColorList _clearColors = {{0, 0, 0, 0.0f}, {0, 0, 0, 0.0f}, {0, 0, 0, 0.0f}, {0, 0, 0, 0.0f}};
};

} // namespace pipeline
} // namespace cc
