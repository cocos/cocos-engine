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
#include "../RenderStage.h"

namespace cc {
namespace scene {
class ReflectionProbe;
}
namespace pipeline {
class RenderQueue;
class ReflectionProbeBatchedQueue;

class CC_DLL ReflectionProbeStage : public RenderStage {
public:
    ReflectionProbeStage();
    ~ReflectionProbeStage() override;

    static const RenderStageInfo &getInitializeInfo();

    bool initialize(const RenderStageInfo &info) override;
    void destroy() override;
    void render(scene::Camera *camera) override;
    void activate(RenderPipeline *pipeline, RenderFlow *flow) override;

    inline void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }
    inline void setUsage(gfx::Framebuffer *framebuffer, scene::ReflectionProbe *probe) {
        _framebuffer = framebuffer;
        _probe = probe;
    }

private:
    static RenderStageInfo initInfo;

    gfx::Rect _renderArea;
    gfx::Framebuffer *_framebuffer = nullptr;

    scene::ReflectionProbe *_probe = nullptr;

    ReflectionProbeBatchedQueue *_reflectionProbeBatchedQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
