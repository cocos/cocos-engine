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

#include "core/geometry/Frustum.h"
#include "core/geometry/Sphere.h"
#include "pipeline/Define.h"
#include "scene/Define.h"

namespace cc {
class Mat4;
class Vec4;
class Vec3;
namespace scene {
class Camera;
class Shadows;
class Light;
} // namespace scene
namespace pipeline {

struct RenderObject;
class RenderPipeline;
class ShadowTransformInfo;

RenderObject genRenderObject(const scene::Model *, const scene::Camera *);
void validPunctualLightsCulling(const RenderPipeline *pipeline, const scene::Camera *camera);
void shadowCulling(const RenderPipeline *, const scene::Camera *, ShadowTransformInfo *);
void sceneCulling(const RenderPipeline *, scene::Camera *);
} // namespace pipeline
} // namespace cc
