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
    void lightCollecting();

    void clearShadowMap(scene::Camera *camera);

    void resizeShadowMap();

    void initShadowFrameBuffer(RenderPipeline *pipeline, const scene::Light *light);

    static RenderFlowInfo initInfo;

    gfx::RenderPass *_renderPass = nullptr;

    vector<const scene::Light *> _validLights;
    vector<gfx::Texture *>       _usedTextures;

    static std::unordered_map<size_t, cc::gfx::RenderPass *> renderPassHashMap;
};
} // namespace pipeline
} // namespace cc
