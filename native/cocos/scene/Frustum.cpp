/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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

#include "scene/Frustum.h"
#include "scene/Define.h"

namespace cc {
namespace scene {
namespace {
const std::vector<cc::Vec3> VEC_VALS{
    {1, 1, 1},
    {-1, 1, 1},
    {-1, -1, 1},
    {1, -1, 1},
    {1, 1, -1},
    {-1, 1, -1},
    {-1, -1, -1},
    {1, -1, -1}};
} // namespace

// Define from 3 vertices.
void Plane::define(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2) {
    const Vec3 dist1 = v1 - v0;
    const Vec3 dist2 = v2 - v0;

    Vec3 dist;
    Vec3::crossProduct(dist1, dist2, &dist);
    define(dist, v0);
}

// Define from a normal vector and a point on the plane.
void Plane::define(const Vec3 &normal, const Vec3 &point) {
    n = normal.getNormalized();
    d = normal.dot(point);
}

// Return signed distance to a point.
float Plane::distance(const Vec3 &point) const {
    return n.dot(point) - d;
}

Plane Plane::clone() const {
    Plane plane;
    plane.n.set(n);
    plane.d = d;

    return plane;
}

void Frustum::createOrtho(const float width, const float height, const float near, const float far, const Mat4 &transform) {
    const float halfWidth  = width * 0.5F;
    const float halfHeight = height * 0.5F;

    vertices[0].transformMat4(Vec3(halfWidth, halfHeight, -near), transform);
    vertices[1].transformMat4(Vec3(-halfWidth, halfHeight, -near), transform);
    vertices[2].transformMat4(Vec3(-halfWidth, -halfHeight, -near), transform);
    vertices[3].transformMat4(Vec3(halfWidth, -halfHeight, -near), transform);
    vertices[4].transformMat4(Vec3(halfWidth, halfHeight, -far), transform);
    vertices[5].transformMat4(Vec3(-halfWidth, halfHeight, -far), transform);
    vertices[6].transformMat4(Vec3(-halfWidth, -halfHeight, -far), transform);
    vertices[7].transformMat4(Vec3(halfWidth, -halfHeight, -far), transform);

    updatePlanes();
}

void Frustum::split(float start, float end, float aspect, float fov, const Mat4 &transform) {
    const float h = tanf(fov * 0.5F);
    const float w = h * aspect;
    const Vec3  nearTemp(start * w, start * h, start);
    const Vec3  farTemp(end * w, end * h, end);

    vertices[0].transformMat4(Vec3(nearTemp.x, nearTemp.y, nearTemp.z), transform);
    vertices[1].transformMat4(Vec3(-nearTemp.x, nearTemp.y, nearTemp.z), transform);
    vertices[2].transformMat4(Vec3(-nearTemp.x, -nearTemp.y, nearTemp.z), transform);
    vertices[3].transformMat4(Vec3(nearTemp.x, -nearTemp.y, nearTemp.z), transform);
    vertices[4].transformMat4(Vec3(farTemp.x, farTemp.y, farTemp.z), transform);
    vertices[5].transformMat4(Vec3(-farTemp.x, farTemp.y, farTemp.z), transform);
    vertices[6].transformMat4(Vec3(-farTemp.x, -farTemp.y, farTemp.z), transform);
    vertices[7].transformMat4(Vec3(farTemp.x, -farTemp.y, farTemp.z), transform);

    updatePlanes();
}

void Frustum::updatePlanes() {
    // left plane
    planes[0].define(vertices[1], vertices[6], vertices[5]);
    // right plane
    planes[1].define(vertices[3], vertices[4], vertices[7]);
    // bottom plane
    planes[2].define(vertices[6], vertices[3], vertices[7]);
    // top plane
    planes[3].define(vertices[0], vertices[5], vertices[4]);
    // near plane
    planes[4].define(vertices[2], vertices[0], vertices[3]);
    // far plane
    planes[5].define(vertices[7], vertices[5], vertices[6]);
}

void Frustum::update(const Mat4 &m, const Mat4 &inv) {
    // left plane
    planes[0].n.set(m.m[3] + m.m[0], m.m[7] + m.m[4], m.m[11] + m.m[8]);
    planes[0].d = -(m.m[15] + m.m[12]);
    // right plane
    planes[1].n.set(m.m[3] - m.m[0], m.m[7] - m.m[4], m.m[11] - m.m[8]);
    planes[1].d = -(m.m[15] - m.m[12]);
    // bottom plane
    planes[2].n.set(m.m[3] + m.m[1], m.m[7] + m.m[5], m.m[11] + m.m[9]);
    planes[2].d = -(m.m[15] + m.m[13]);
    // top plane
    planes[3].n.set(m.m[3] - m.m[1], m.m[7] - m.m[5], m.m[11] - m.m[9]);
    planes[3].d = -(m.m[15] - m.m[13]);
    // near plane
    planes[4].n.set(m.m[3] + m.m[2], m.m[7] + m.m[6], m.m[11] + m.m[10]);
    planes[4].d = -(m.m[15] + m.m[14]);
    // far plane
    planes[5].n.set(m.m[3] - m.m[2], m.m[7] - m.m[6], m.m[11] - m.m[10]);
    planes[5].d = -(m.m[15] - m.m[14]);

    if (type != ShapeEnums::SHAPE_FRUSTUM_ACCURATE) {
        return;
    }

    for (Plane &plane : planes) {
        float invDist = 1 / plane.n.length();
        plane.n *= invDist;
        plane.d *= invDist;
    }
    uint32_t i = 0;
    for (const Vec3 &vec : VEC_VALS) {
        vertices[i].transformMat4(vec, inv);
        i++;
    }
}

Frustum Frustum::clone() {
    Frustum frustum;
    for (uint i = 0; i < planes.size(); ++i) {
        frustum.planes[i] = planes[i].clone();
    }

    frustum.type = type;

    for (uint i = 0; i < vertices.size(); ++i) {
        frustum.vertices[i].set(vertices[i]);
    }

    return frustum;
}

void Frustum::transform(const Mat4 &transform) {
    vertices[0].transformMat4(vertices[0], transform);
    vertices[1].transformMat4(vertices[1], transform);
    vertices[2].transformMat4(vertices[2], transform);
    vertices[3].transformMat4(vertices[3], transform);
    vertices[4].transformMat4(vertices[4], transform);
    vertices[5].transformMat4(vertices[5], transform);
    vertices[6].transformMat4(vertices[6], transform);
    vertices[7].transformMat4(vertices[7], transform);
}

} // namespace scene
} // namespace cc