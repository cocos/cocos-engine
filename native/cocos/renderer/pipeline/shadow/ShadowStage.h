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
#include "../RenderStage.h"

namespace cc {
namespace pipeline {
class RenderQueue;
class ShadowMapBatchedQueue;

class CC_DLL ShadowStage : public RenderStage {
public:
    ShadowStage();
    virtual ~ShadowStage();

    static const RenderStageInfo &getInitializeInfo();

    virtual bool initialize(const RenderStageInfo &info) override;
    virtual void destroy() override;
    virtual void render(Camera *camera) override;
    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow) override;

    CC_INLINE void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }
    CC_INLINE void setUseData(const Light *light, gfx::Framebuffer *framebuffer) {
        _light = light;
        _framebuffer = framebuffer;
    };

private:
    static RenderStageInfo _initInfo;

    gfx::Rect _renderArea;
    const Light *_light = nullptr;
    gfx::Framebuffer *_framebuffer = nullptr;

    ShadowMapBatchedQueue *_additiveShadowQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
