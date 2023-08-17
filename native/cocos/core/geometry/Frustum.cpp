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

#include "core/geometry/Frustum.h"
#include <cmath>
#include "core/geometry/Enums.h"
#include "scene/Define.h"

namespace cc {
namespace geometry {
namespace {
const ccstd::vector<cc::Vec3> VEC_VALS{
    {1, 1, 1},
    {-1, 1, 1},
    {-1, -1, 1},
    {1, -1, 1},
    {1, 1, -1},
    {-1, 1, -1},
    {-1, -1, -1},
    {1, -1, -1}};
} // namespace

void Frustum::createOrtho(Frustum *out, float width,
                          float height,
                          float near,
                          float far,
                          const Mat4 &transform) {
    createOrthographic(out, width, height, near, far, transform);
}

void Frustum::createOrthographic(Frustum *out, float width,
                                 float height,
                                 float near,
                                 float far,
                                 const Mat4 &transform) {
    auto halfWidth = width / 2.0F;
    auto halfHeight = height / 2.0F;
    Vec3::transformMat4({halfWidth, halfHeight, -near}, transform, &out->vertices[0]);
    Vec3::transformMat4({-halfWidth, halfHeight, -near}, transform, &out->vertices[1]);
    Vec3::transformMat4({-halfWidth, -halfHeight, -near}, transform, &out->vertices[2]);
    Vec3::transformMat4({halfWidth, -halfHeight, -near}, transform, &out->vertices[3]);
    Vec3::transformMat4({halfWidth, halfHeight, -far}, transform, &out->vertices[4]);
    Vec3::transformMat4({-halfWidth, halfHeight, -far}, transform, &out->vertices[5]);
    Vec3::transformMat4({-halfWidth, -halfHeight, -far}, transform, &out->vertices[6]);
    Vec3::transformMat4({halfWidth, -halfHeight, -far}, transform, &out->vertices[7]);

    out->updatePlanes();
}

Frustum *Frustum::createFromAABB(Frustum *out, const AABB &aabb) {
    Vec3 minPos;
    Vec3 maxPos;
    aabb.getBoundary(&minPos, &maxPos);

    out->vertices[0].set(maxPos.x, maxPos.y, -minPos.z);
    out->vertices[1].set(minPos.x, maxPos.y, -minPos.z);
    out->vertices[2].set(minPos.x, minPos.y, -minPos.z);
    out->vertices[3].set(maxPos.x, minPos.y, -minPos.z);
    out->vertices[4].set(maxPos.x, maxPos.y, -maxPos.z);
    out->vertices[5].set(minPos.x, maxPos.y, -maxPos.z);
    out->vertices[6].set(minPos.x, minPos.y, -maxPos.z);
    out->vertices[7].set(maxPos.x, minPos.y, -maxPos.z);

    out->updatePlanes();

    return out;
}

void Frustum::createPerspective(Frustum *out, float fov,
                                float aspect,
                                float near,
                                float far,
                                const Mat4 &transform) {
    const float h = tanf(fov * 0.5F);
    const float w = h * aspect;
    const Vec3 nearTemp(near * w, near * h, near);
    const Vec3 farTemp(far * w, far * h, far);

    out->vertices[0].transformMat4(Vec3(nearTemp.x, nearTemp.y, -nearTemp.z), transform);
    out->vertices[1].transformMat4(Vec3(-nearTemp.x, nearTemp.y, -nearTemp.z), transform);
    out->vertices[2].transformMat4(Vec3(-nearTemp.x, -nearTemp.y, -nearTemp.z), transform);
    out->vertices[3].transformMat4(Vec3(nearTemp.x, -nearTemp.y, -nearTemp.z), transform);
    out->vertices[4].transformMat4(Vec3(farTemp.x, farTemp.y, -farTemp.z), transform);
    out->vertices[5].transformMat4(Vec3(-farTemp.x, farTemp.y, -farTemp.z), transform);
    out->vertices[6].transformMat4(Vec3(-farTemp.x, -farTemp.y, -farTemp.z), transform);
    out->vertices[7].transformMat4(Vec3(farTemp.x, -farTemp.y, -farTemp.z), transform);

    out->updatePlanes();
}

void Frustum::update(const Mat4 &m, const Mat4 &inv) {
    // left plane
    planes[0]->n.set(m.m[3] + m.m[0], m.m[7] + m.m[4], m.m[11] + m.m[8]);
    planes[0]->d = -(m.m[15] + m.m[12]);
    // right plane
    planes[1]->n.set(m.m[3] - m.m[0], m.m[7] - m.m[4], m.m[11] - m.m[8]);
    planes[1]->d = -(m.m[15] - m.m[12]);
    // bottom plane
    planes[2]->n.set(m.m[3] + m.m[1], m.m[7] + m.m[5], m.m[11] + m.m[9]);
    planes[2]->d = -(m.m[15] + m.m[13]);
    // top plane
    planes[3]->n.set(m.m[3] - m.m[1], m.m[7] - m.m[5], m.m[11] - m.m[9]);
    planes[3]->d = -(m.m[15] - m.m[13]);
    // near plane
    planes[4]->n.set(m.m[3] + m.m[2], m.m[7] + m.m[6], m.m[11] + m.m[10]);
    planes[4]->d = -(m.m[15] + m.m[14]);
    // far plane
    planes[5]->n.set(m.m[3] - m.m[2], m.m[7] - m.m[6], m.m[11] - m.m[10]);
    planes[5]->d = -(m.m[15] - m.m[14]);

    for (Plane *plane : planes) {
        float invDist = 1 / plane->n.length();
        plane->n *= invDist;
        plane->d *= invDist;
    }
    uint32_t i = 0;
    for (const Vec3 &vec : VEC_VALS) {
        vertices[i].transformMat4(vec, inv);
        i++;
    }
}

void Frustum::transform(const Mat4 &mat) {
    for (auto i = 0; i < 8; i++) {
        vertices[i].transformMat4(vertices[i], mat);
    }
    updatePlanes();
}

void Frustum::createOrthographic(float width, float height, float near, float far, const Mat4 &transform) {
    createOrthographic(this, width, height, near, far, transform);
}

void Frustum::createOrtho(const float width, const float height, const float near, const float far, const Mat4 &transform) {
    createOrthographic(width, height, near, far, transform);
}

void Frustum::split(float near, float far, float aspect, float fov, const Mat4 &transform) {
    createPerspective(this, fov, aspect, near, far, transform);
}

void Frustum::updatePlanes() {
    // left plane
    planes[0]->define(vertices[1], vertices[6], vertices[5]);
    // right plane
    planes[1]->define(vertices[3], vertices[4], vertices[7]);
    // bottom plane
    planes[2]->define(vertices[6], vertices[3], vertices[7]);
    // top plane
    planes[3]->define(vertices[0], vertices[5], vertices[4]);
    // near plane
    planes[4]->define(vertices[2], vertices[0], vertices[3]);
    // far plane
    planes[5]->define(vertices[7], vertices[5], vertices[6]);
}

Frustum::Frustum() : ShapeBase(ShapeEnum::SHAPE_FRUSTUM) {
    init();
}

Frustum::Frustum(const Frustum &rhs) : ShapeBase(rhs) {
    init();
    *this = rhs;
}

Frustum::~Frustum() {
    for (auto *plane : planes) {
        plane->release();
    }
}

Frustum &Frustum::operator=(const Frustum &rhs) {
    if (this == &rhs) {
        return *this;
    }

    vertices = rhs.vertices;

    for (size_t i = 0; i < planes.size(); ++i) { // NOLINT(modernize-loop-convert)
        Plane::copy(planes[i], *rhs.planes[i]);
    }

    return *this;
}

void Frustum::init() {
    for (size_t i = 0; i < planes.size(); ++i) { // NOLINT(modernize-loop-convert)
        planes[i] = ccnew Plane();
        planes[i]->addRef();
    }
}

} // namespace geometry
} // namespace cc
