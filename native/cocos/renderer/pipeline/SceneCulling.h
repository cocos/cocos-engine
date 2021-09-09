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
#include "pipeline/Define.h"
#include "scene/Camera.h"
#include "scene/Define.h"
#include "scene/Light.h"
#include "scene/Sphere.h"
#include "scene/Frustum.h"

namespace cc {
class Mat4;
class Vec4;
class Vec3;
namespace pipeline {

struct RenderObject;
class RenderPipeline;

RenderObject genRenderObject(const scene::Model *, const scene::Camera *);
void         quantizeDirLightShadowCamera(RenderPipeline *pipeline, const scene::Camera *camera, scene::Frustum *out);
void         lightCollecting(scene::Camera *, std::vector<const scene::Light *> *);
void         sceneCulling(RenderPipeline *, scene::Camera *);
void         updateSphereLight(scene::Shadow *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *);
void         updateDirLight(scene::Shadow *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *);
void         getShadowWorldMatrix(const scene::Sphere *sphere, const cc::Quaternion &rotation, const cc::Vec3 &dir, cc::Mat4 *shadowWorldMat, cc::Vec3 *out);
Mat4         getCameraWorldMatrix(const scene::Camera *camera);
void         updateDirFrustum(const scene::Sphere *cameraBoundingSphere, const Quaternion &rotation, float range, scene::Frustum *dirLightFrustum);
} // namespace pipeline
} // namespace cc
