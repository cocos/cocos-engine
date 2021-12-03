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

#include <unordered_map>
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXInputAssembler.h"
#include "pipeline/ClusterLightCulling.h"
#include "pipeline/RenderPipeline.h"
#include "pipeline/Enum.h"
#include "scene/RenderWindow.h"

namespace cc {
namespace pipeline {
struct UBOGlobal;
struct UBOCamera;
struct UBOShadow;

class CC_DLL DeferredPipeline : public RenderPipeline {
public:
    DeferredPipeline()           = default;
    ~DeferredPipeline() override = default;

    bool initialize(const RenderPipelineInfo &info) override;
    void destroy() override;
    bool activate(gfx::Swapchain *swapchain) override;
    void render(const vector<scene::Camera *> &cameras) override;

    inline gfx::Buffer *          getLightsUBO() const { return _lightsUBO; }
    inline const LightList &      getValidLights() const { return _validLights; }
    inline const gfx::BufferList &getLightBuffers() const { return _lightBuffers; }
    inline const UintList &       getLightIndexOffsets() const { return _lightIndexOffsets; }
    inline const UintList &       getLightIndices() const { return _lightIndices; }

private:
    bool activeRenderer(gfx::Swapchain *swapchain);

    gfx::Buffer *   _lightsUBO = nullptr;
    LightList       _validLights;
    gfx::BufferList _lightBuffers;
    UintList        _lightIndexOffsets;
    UintList        _lightIndices;

    ClusterLightCulling *_clusterComp{nullptr};

public:
    static constexpr uint GBUFFER_COUNT = 4;

    // deferred resource names
    static framegraph::StringHandle fgStrHandleGbufferTexture[GBUFFER_COUNT];

    // deferred pass names
    static framegraph::StringHandle fgStrHandleGbufferPass;
    static framegraph::StringHandle fgStrHandleLightingPass;
    static framegraph::StringHandle fgStrHandleTransparentPass;
    static framegraph::StringHandle fgStrHandleSsprPass;
};

} // namespace pipeline
} // namespace cc
