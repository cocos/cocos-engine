/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

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

namespace cc {
namespace pipeline {

class Camera;
class GbufferStage;

class CC_DLL GbufferFlow : public RenderFlow {
public:
    static const RenderFlowInfo &getInitializeInfo();

    GbufferFlow() = default;
    virtual ~GbufferFlow();

    virtual bool initialize(const RenderFlowInfo &info) override;
    virtual void activate(RenderPipeline *pipeline) override;
    virtual void destroy() override;
    virtual void render(Camera *camera) override;
    gfx::Framebuffer *getFrameBuffer() {return _gbufferFrameBuffer;}

private:
    void createRenderPass(gfx::Device *device);
    void createRenderTargets(gfx::Device *device);

private:
    static RenderFlowInfo _initInfo;

    gfx::RenderPass *_gbufferRenderPass = nullptr;
    gfx::TextureList _gbufferRenderTargets;
    gfx::Framebuffer *_gbufferFrameBuffer = nullptr;
    gfx::Texture *_depth = nullptr;
    uint _width;
    uint _height;

    GbufferStage *_GbufferStage = nullptr;
};

} // namespace pipeline
} // namespace cc
