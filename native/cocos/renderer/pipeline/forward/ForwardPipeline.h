/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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
#include "../RenderPipeline.h"
#include "frame-graph/FrameGraph.h"
#include "frame-graph/Handle.h"

namespace cc {
namespace pipeline {

enum class ForwaedInsertPoint {
    IP_FORWARD     = 100,
    IP_INVALID
};


struct UBOGlobal;
struct UBOCamera;
struct UBOShadow;

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline()           = default;
    ~ForwardPipeline() override = default;

    bool initialize(const RenderPipelineInfo &info) override;
    void destroy() override;
    bool activate(gfx::Swapchain *swapchain) override;
    void render(const vector<scene::Camera *> &cameras) override;

    framegraph::FrameGraph &getFrameGraph() { return _fg; }
    gfx::RenderPass *getOrCreateRenderPass(gfx::ClearFlags clearFlags, gfx::Swapchain *swapchain);

    inline gfx::Buffer *          getLightsUBO() const { return _lightsUBO; }
    inline const LightList &      getValidLights() const { return _validLights; }
    inline const gfx::BufferList &getLightBuffers() const { return _lightBuffers; }
    inline const UintList &       getLightIndexOffsets() const { return _lightIndexOffsets; }
    inline const UintList &       getLightIndices() const { return _lightIndices; }
    inline uint                   getWidth() const { return _width; }
    inline uint                   getHeight() const { return _height; }
    gfx::Rect                     getRenderArea(scene::Camera *camera, bool onScreen);

    static framegraph::StringHandle fgStrHandleForwardColorTexture;
    static framegraph::StringHandle fgStrHandleForwardDepthTexture;

    static framegraph::StringHandle fgStrHandleForwardPass;

private:
    bool activeRenderer();
    void updateUBO(scene::Camera *);

    gfx::Buffer *                                     _lightsUBO = nullptr;
    LightList                                         _validLights;
    gfx::BufferList                                   _lightBuffers;
    UintList                                          _lightIndexOffsets;
    UintList                                          _lightIndices;
    unordered_map<gfx::ClearFlags, gfx::RenderPass *> _renderPasses;

    uint                   _width  = 0;
    uint                   _height = 0;
    framegraph::FrameGraph _fg;
};

} // namespace pipeline
} // namespace cc
