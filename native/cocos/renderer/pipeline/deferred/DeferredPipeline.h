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

#include <array>

#include "pipeline/RenderPipeline.h"
#include "pipeline/helper/SharedMemory.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXInputAssembler.h"

namespace cc {
namespace pipeline {
struct UBOGlobal;
struct UBOCamera;
struct UBOShadow;
struct Fog;
struct Ambient;
struct Skybox;
struct Shadows;
struct Sphere;
class Framebuffer;
class Camera;

struct CC_DLL DeferredRenderData {
    gfx::TextureList gbufferRenderTargets;
    gfx::Framebuffer *gbufferFrameBuffer = nullptr;
    gfx::Framebuffer *lightingFrameBuff = nullptr;
    gfx::Texture *lightingRenderTarget = nullptr;
    gfx::Texture *depthTex = nullptr;
};

class CC_DLL DeferredPipeline : public RenderPipeline {
public:
    DeferredPipeline() = default;
    ~DeferredPipeline() = default;

    virtual bool initialize(const RenderPipelineInfo &info) override;
    virtual void destroy() override;
    virtual bool activate() override;
    virtual void render(const vector<uint> &cameras) override;

    gfx::RenderPass *getOrCreateRenderPass(gfx::ClearFlags clearFlags);

    CC_INLINE gfx::Buffer *getLightsUBO() const { return _lightsUBO; }
    CC_INLINE const LightList &getValidLights() const { return _validLights; }
    CC_INLINE const gfx::BufferList &getLightBuffers() const { return _lightBuffers; }
    CC_INLINE const UintList &getLightIndexOffsets() const { return _lightIndexOffsets; }
    CC_INLINE const UintList &getLightIndices() const { return _lightIndices; }
    gfx::InputAssembler *getQuadIAOnScreen(){return _quadIAOnscreen;}
    gfx::InputAssembler *getQuadIAOffScreen(){return _quadIAOffscreen;}
    gfx::Rect getRenderArea(Camera *view, bool onScreen);
    DeferredRenderData *getDeferredRenderData(Camera *view);

private:
    bool activeRenderer();
    bool createQuadInputAssembler(gfx::Buffer* &quadIB, gfx::Buffer* &quadVB, gfx::InputAssembler* &quadIA,
        gfx::SurfaceTransform surfaceTransform);
    void destroyQuadInputAssembler();
    void generateDeferredRenderData(Camera *view);

private:
    gfx::Buffer *_lightsUBO = nullptr;
    LightList _validLights;
    gfx::BufferList _lightBuffers;
    UintList _lightIndexOffsets;
    UintList _lightIndices;
    map<gfx::ClearFlags, gfx::RenderPass *> _renderPasses;

    // light stage
    gfx::Buffer *_quadIB = nullptr;
    gfx::Buffer *_quadVBOnscreen = nullptr;
    gfx::Buffer *_quadVBOffscreen = nullptr;
    gfx::InputAssembler *_quadIAOnscreen = nullptr;
    gfx::InputAssembler *_quadIAOffscreen = nullptr;
    
    map<Camera *, DeferredRenderData *> _deferredRenderDatas;
    gfx::RenderPass *_gbufferRenderPass = nullptr;
    gfx::RenderPass *_lightingRenderPass = nullptr;
    uint _width;
    uint _height;
};

} // namespace pipeline
} // namespace cc
