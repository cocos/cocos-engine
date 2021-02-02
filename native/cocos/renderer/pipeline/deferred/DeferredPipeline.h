/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.

 https://www.cocos.com/

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
 */

#pragma once

#include <array>

#include "../RenderPipeline.h"
#include "../helper/SharedMemory.h"
#include "../../core/gfx/GFXBuffer.h"
#include "../../core/gfx/GFXInputAssembler.h"

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
    void setDepth(gfx::Texture *tex) {_depth = tex;}
    gfx::Texture *getDepth(){return _depth;}
    gfx::Rect getRenderArea(Camera *view, bool onScreen);

private:
    bool activeRenderer();
    bool createQuadInputAssembler(gfx::Buffer* &quadIB, gfx::Buffer* &quadVB, gfx::InputAssembler* &quadIA,
        gfx::SurfaceTransform surfaceTransform);
    void destroyQuadInputAssembler();

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

    gfx::Texture *_depth = nullptr;
};

} // namespace pipeline
} // namespace cc
