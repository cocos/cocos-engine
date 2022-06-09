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

#include "Define.h"
#include "base/std/container/array.h"

namespace cc {
class Mat4;
namespace scene {
class Camera;
class Shadows;
class DirectionalLight;
}
namespace pipeline {
class RenderPipeline;
class CC_DLL PipelineUBO final {
public:
    static void updateGlobalUBOView(const scene::Camera *camera, ccstd::array<float, UBOGlobal::COUNT> *bufferView);
    static void updateCameraUBOView(const RenderPipeline *pipeline, float *output, const scene::Camera *camera);
    static void updateShadowUBOView(const RenderPipeline *pipeline, ccstd::array<float, UBOShadow::COUNT> *shadowBufferView,
                                    const scene::Camera *camera);
    static void updateShadowUBOLightView(const RenderPipeline *pipeline, ccstd::array<float, UBOShadow::COUNT> *shadowBufferView,
        const scene::Light *light, uint level);
    static uint8_t getCombineSignY();

    PipelineUBO() = default;
    ~PipelineUBO() = default;
    void activate(gfx::Device *device, RenderPipeline *pipeline);
    void destroy();
    void updateGlobalUBO(const scene::Camera *camera);
    void updateCameraUBO(const scene::Camera *camera);
    void updateMultiCameraUBO(const ccstd::vector<scene::Camera *> &cameras);
    void updateShadowUBO(const scene::Camera *camera);
    void updateShadowUBOLight(gfx::DescriptorSet *globalDS, const scene::Light *light, uint level = 0U);
    void updateShadowUBORange(uint offset, const Mat4 *data);

    uint getCurrentCameraUBOOffset() const;
    void incCameraUBOOffset();

private:
    static float getPCFRadius(const scene::Shadows *shadowInfo, const scene::DirectionalLight *dirLight);
    void initCombineSignY() const;

    RenderPipeline *_pipeline = nullptr;
    gfx::Device *_device = nullptr;

    ccstd::array<float, UBOGlobal::COUNT> _globalUBO;
    ccstd::array<float, UBOShadow::COUNT> _shadowUBO;

    ccstd::vector<gfx::Buffer *> _ubos;
    ccstd::vector<float> _cameraUBOs;

    gfx::Buffer *_cameraBuffer{nullptr};
    uint _currentCameraUBOOffset{0};
    uint _alignedCameraUBOSize{0};
};

} // namespace pipeline
} // namespace cc
