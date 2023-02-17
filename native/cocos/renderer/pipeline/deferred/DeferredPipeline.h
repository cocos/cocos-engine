/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/std/container/array.h"

#include "base/std/container/unordered_map.h"
#include "pipeline/Enum.h"
#include "pipeline/RenderPipeline.h"

namespace cc {
namespace pipeline {
class ClusterLightCulling;

struct UBOGlobal;
struct UBOCamera;
struct UBOShadow;

class CC_DLL DeferredPipeline : public RenderPipeline {
public:
    DeferredPipeline();
    ~DeferredPipeline() override;

    bool initialize(const RenderPipelineInfo &info) override;
    bool destroy() override;
    bool activate(gfx::Swapchain *swapchain) override;
    void render(const ccstd::vector<scene::Camera *> &cameras) override;
    void onGlobalPipelineStateChanged() override;

    inline gfx::Buffer *getLightsUBO() const { return _lightsUBO; }
    inline const LightList &getValidLights() const { return _validLights; }
    inline const gfx::BufferList &getLightBuffers() const { return _lightBuffers; }
    inline const UintList &getLightIndexOffsets() const { return _lightIndexOffsets; }
    inline const UintList &getLightIndices() const { return _lightIndices; }

private:
    bool activeRenderer(gfx::Swapchain *swapchain);

    gfx::Buffer *_lightsUBO = nullptr;
    LightList _validLights;
    gfx::BufferList _lightBuffers;
    UintList _lightIndexOffsets;
    UintList _lightIndices;

    ClusterLightCulling *_clusterComp{nullptr};

public:
    static constexpr uint32_t GBUFFER_COUNT = 3;

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
