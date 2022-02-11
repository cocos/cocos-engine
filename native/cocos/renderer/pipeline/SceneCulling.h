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

RenderObject genRenderObject(const scene::Model *, const scene::Camera *);
void         quantizeDirLightShadowCamera(RenderPipeline *pipeline, const scene::Camera *camera, geometry::Frustum *out);
void         validPunctualLightsCulling(RenderPipeline *pipeline, scene::Camera *camera);
void         sceneCulling(RenderPipeline *, scene::Camera *);
void         updateSphereLight(scene::Shadows *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *);
void         updateDirLight(scene::Shadows *shadows, const scene::Light *light, std::array<float, UBOShadow::COUNT> *);
void         updatePlanarNormalAndDistance(scene::Shadows *shadows, std::array<float, UBOShadow::COUNT> *shadowUBO);
void         getShadowWorldMatrix(const geometry::Sphere *sphere, const cc::Quaternion &rotation, const cc::Vec3 &dir, cc::Mat4 *shadowWorldMat, cc::Vec3 *out);
Mat4         getCameraWorldMatrix(const scene::Camera *camera);
void         updateDirFrustum(const geometry::Sphere *cameraBoundingSphere, const Quaternion &rotation, float range, geometry::Frustum *dirLightFrustum);
} // namespace pipeline
} // namespace cc
