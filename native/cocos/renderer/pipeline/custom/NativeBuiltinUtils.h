/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include <cstdint>
#include "cocos/math/Vec4.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/NativeFwd.h"
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"

namespace cc {

namespace scene {
class Camera;
class Light;
class DirectionalLight;
class Shadows;
} // namespace scene

namespace geometry {
class Frustum;
} // namespace geometry

namespace gfx {
class Device;
} // namespace gfx

namespace pipeline {
class PipelineSceneData;
} // namespace pipeline

namespace render {

void setCameraUBOValues(
    const scene::Camera &camera,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &cfg,
    const scene::DirectionalLight *mainLight,
    RenderData &data);

void setLegacyTextureUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    RenderData &data);

// For use shadow map
void setShadowUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    const scene::DirectionalLight &mainLight,
    RenderData &data);

// For build shadow map
void setShadowUBOLightView(
    gfx::Device *device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    const BuiltinCascadedShadowMap *csm,
    const scene::Light &light,
    uint32_t level,
    RenderData &data);

// Additive light
void setLightUBO(
    const scene::Light *light, bool bHDR, float exposure,
    const scene::Shadows *shadowInfo,
    char *buffer, size_t bufferSize);

void setPunctualLightShadowUBO(
    gfx::Device *device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &pplSceneData,
    const scene::DirectionalLight *mainLight,
    const scene::Light &light,
    RenderData &data);

// Render graph
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter);

// Geometry
void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]);

// Shadow
const BuiltinCascadedShadowMap *getBuiltinShadowCSM(
    const PipelineRuntime &pplRuntime,
    const scene::Camera &camera,
    const scene::DirectionalLight *mainLight);

const geometry::Frustum &getBuiltinShadowFrustum(
    const PipelineRuntime &pplRuntime,
    const scene::Camera &camera,
    const scene::DirectionalLight *mainLight,
    uint32_t level);

} // namespace render

} // namespace cc
