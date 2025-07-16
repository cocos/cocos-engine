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

#include "../RenderFlow.h"
#include "scene/Define.h"

namespace cc {
namespace pipeline {
class ForwardPipeline;

class CC_DLL ShadowFlow : public RenderFlow {
public:
    ShadowFlow();
    ~ShadowFlow() override;

    static const RenderFlowInfo &getInitializeInfo();

    bool initialize(const RenderFlowInfo &info) override;

    void activate(RenderPipeline *pipeline) override;

    void render(scene::Camera *camera) override;

    void destroy() override;

private:
    void renderStage(gfx::DescriptorSet *globalDS, scene::Camera *camera, const scene::Light *light, gfx::Framebuffer *framebuffer, uint32_t level = 0);

    void lightCollecting();

    void clearShadowMap(scene::Camera *camera);

    void resizeShadowMap(const scene::Light *light, gfx::DescriptorSet *ds);

    void initShadowFrameBuffer(const RenderPipeline *pipeline, const scene::Light *light);

    static RenderFlowInfo initInfo;

    // weak reference
    gfx::RenderPass *_renderPass{nullptr};

    // weak reference
    ccstd::vector<const scene::Light *> _validLights;
    ccstd::vector<IntrusivePtr<gfx::Texture>> _usedTextures;

    static ccstd::unordered_map<ccstd::hash_t, IntrusivePtr<cc::gfx::RenderPass>> renderPassHashMap;
};
} // namespace pipeline
} // namespace cc
