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

#include "gfx-base/GFXDef.h"
#include "math/Vec4.h"

namespace cc {

namespace scene {
class Camera;
class Model;
} // namespace scene

namespace gfx {
class CommandBuffer;
class RenderPass;
} // namespace gfx

namespace pipeline {
class PipelineSceneData;

inline void srgbToLinear(cc::Vec4 *out, const cc::Vec4 &gamma) {
    out->x = gamma.x * gamma.x;
    out->y = gamma.y * gamma.y;
    out->z = gamma.z * gamma.z;
}

inline void srgbToLinear(gfx::Color *out, const gfx::Color &gamma) {
    out->x = gamma.x * gamma.x;
    out->y = gamma.y * gamma.y;
    out->z = gamma.z * gamma.z;
}

inline void linearToSrgb(cc::Vec4 *out, const cc::Vec4 &linear) {
    out->x = std::sqrt(linear.x);
    out->y = std::sqrt(linear.y);
    out->z = std::sqrt(linear.z);
}

inline void linearToSrgb(gfx::Color *out, const gfx::Color &linear) {
    out->x = std::sqrt(linear.x);
    out->y = std::sqrt(linear.y);
    out->z = std::sqrt(linear.z);
}

extern const scene::Camera *profilerCamera;

void decideProfilerCamera(const ccstd::vector<scene::Camera *> &cameras);
void renderProfiler(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, scene::Model *profiler, const scene::Camera *camera);
#if CC_USE_DEBUG_RENDERER
void renderDebugRenderer(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, PipelineSceneData *sceneData, const scene::Camera *camera);
#endif

} // namespace pipeline
} // namespace cc
