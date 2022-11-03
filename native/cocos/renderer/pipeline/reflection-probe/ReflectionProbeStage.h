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
#include "../RenderStage.h"

namespace cc {
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
    inline void setUsage(gfx::Framebuffer *framebuffer) {
        _framebuffer = framebuffer;
    }

    void clearFramebuffer(const scene::Camera *camera);

private:
    static RenderStageInfo initInfo;

    gfx::Rect _renderArea;
    gfx::Framebuffer *_framebuffer = nullptr;


    ReflectionProbeBatchedQueue *_reflectionProbeBatchedQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
