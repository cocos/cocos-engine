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
#include "scene/Light.h"

namespace cc {
namespace pipeline {
class RenderQueue;
class ShadowMapBatchedQueue;

class CC_DLL ShadowStage : public RenderStage {
public:
    ShadowStage()           = default;
    ~ShadowStage() override = default;

    static const RenderStageInfo &getInitializeInfo();

    bool initialize(const RenderStageInfo &info) override;
    void destroy() override;
    void render(scene::Camera *camera) override;
    void activate(RenderPipeline *pipeline, RenderFlow *flow) override;

    inline void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }
    inline void setUsage(gfx::DescriptorSet *globalDS, const scene::Light *light, gfx::Framebuffer *framebuffer) {
        _globalDS    = globalDS;
        _light       = light;
        _framebuffer = framebuffer;
    }

    void clearFramebuffer(scene::Camera *camera);

private:
    static RenderStageInfo initInfo;

    gfx::Rect           _renderArea;
    gfx::DescriptorSet *_globalDS      = nullptr;
    const scene::Light *_light         = nullptr;
    gfx::Framebuffer *  _framebuffer   = nullptr;

    ShadowMapBatchedQueue *_additiveShadowQueue = nullptr;
};

} // namespace pipeline
} // namespace cc
