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
namespace pipeline {

class RenderPipeline;
class RenderStage;
struct Camera;

struct CC_DLL RenderFlowInfo {
    String name;
    uint priority = 0;
    uint tag = 0;
    RenderStageList stages;
};

class CC_DLL RenderFlow : public Object {
public:
    RenderFlow() = default;
    virtual ~RenderFlow();

    virtual bool initialize(const RenderFlowInfo &info);
    virtual void activate(RenderPipeline *pipeline);
    virtual void render(Camera *camera);
    virtual void destroy();

    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getTag() const { return _tag; }

protected:
    RenderStageList _stages;
    String _name;
    RenderPipeline *_pipeline = nullptr;
    uint _priority = 0;
    uint _tag = 0;
};

} // namespace pipeline
} // namespace cc
