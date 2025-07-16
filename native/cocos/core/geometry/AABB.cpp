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

#include "AABB.h"
#include "base/Macros.h"
#include "cocos/core/geometry/Enums.h"
#include "cocos/core/geometry/Sphere.h"

namespace cc {
namespace geometry {

Sphere *AABB::toBoundingSphere(Sphere *out, const AABB &a) {
    out->setCenter(a.getCenter());
    out->setRadius(a.getHalfExtents().length());
    return out;
}

AABB *AABB::fromPoints(const Vec3 &minPos, const Vec3 &maxPos, AABB *dst) {
    Vec3 center{(minPos + maxPos) * 0.5F};
    Vec3 halfExtents{(maxPos - minPos) * 0.5F};
    dst->setCenter(center);
    dst->setHalfExtents(halfExtents);
    return dst;
}

AABB *AABB::merge(AABB *out, const AABB &a, const AABB &b) {
    Vec3 minCornor;
    Vec3 maxCorner;
    Vec3::max(a.getCenter() + a.getHalfExtents(), b.getCenter() + b.getHalfExtents(), &maxCorner);
    Vec3::min(a.getCenter() - a.getHalfExtents(), b.getCenter() - b.getHalfExtents(), &minCornor);
    return AABB::fromPoints(minCornor, maxCorner, out);
}

void AABB::merge(const cc::Vec3 &point) {
    cc::Vec3 minPos = getCenter() - getHalfExtents();
    cc::Vec3 maxPos = getCenter() + getHalfExtents();
    if (point.x < minPos.x) {
        minPos.x = point.x;
    }
    if (point.y < minPos.y) {
        minPos.y = point.y;
    }
    if (point.z < minPos.z) {
        minPos.z = point.z;
    }
    if (point.x > maxPos.x) {
        maxPos.x = point.x;
    }
    if (point.y > maxPos.y) {
        maxPos.y = point.y;
    }
    if (point.z > maxPos.z) {
        maxPos.z = point.z;
    }

    const Vec3 center = (minPos + maxPos) * 0.5F;
    setCenter(center);
    setHalfExtents(maxPos.x - center.x, maxPos.y - center.y, maxPos.z - center.z);
}

void AABB::merge(const ccstd::vector<cc::Vec3> &points) {
    for (const auto &p : points) {
        merge(p);
    }
}

void AABB::merge(const Frustum &frustum) {
    const ccstd::array<Vec3, 8> &vertices = frustum.vertices;
    for (size_t i = 0; i < vertices.max_size(); ++i) {
        merge(vertices[i]);
    }
}

bool AABB::aabbAabb(const AABB &aabb) const {
    Vec3 aMin;
    Vec3 aMax;
    Vec3 bMin;
    Vec3 bMax;
    Vec3::subtract(getCenter(), getHalfExtents(), &aMin);
    Vec3::add(getCenter(), getHalfExtents(), &aMax);
    Vec3::subtract(aabb.getCenter(), aabb.getHalfExtents(), &bMin);
    Vec3::add(aabb.getCenter(), aabb.getHalfExtents(), &bMax);
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
           (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
           (aMin.z <= bMax.z && aMax.z >= bMin.z);
}

int AABB::aabbPlane(const Plane &plane) const {
    auto r = getHalfExtents().x * std::abs(plane.n.x) +
             getHalfExtents().y * std::abs(plane.n.y) +
             getHalfExtents().z * std::abs(plane.n.z);
    auto dot = Vec3::dot(plane.n, getCenter());
    if (dot + r < plane.d) {
        return -1;
    }
    if (dot - r > plane.d) {
        return 0;
    }
    return 1;
}

bool AABB::aabbFrustum(const Frustum &frustum) const {
    const auto &planes = frustum.planes;
    const auto *self = this;
    return std::all_of(planes.begin(),
                       planes.end(),
                       // frustum plane normal points to the inside
                       [self](const Plane *plane) { return self->aabbPlane(*plane) != -1; });
}

void AABB::getBoundary(cc::Vec3 *minPos, cc::Vec3 *maxPos) const {
    *maxPos = getCenter() + getHalfExtents();
    *minPos = getCenter() - getHalfExtents();
}

void AABB::merge(const AABB &aabb) {
    AABB::merge(this, aabb, *this);
}

void AABB::set(const cc::Vec3 &centerVal, const cc::Vec3 &halfExtentVal) {
    setCenter(centerVal);
    setHalfExtents(halfExtentVal);
}

void AABB::transform(const Mat4 &m, AABB *out) const {
    Vec3::transformMat4(center, m, &out->center);
    transformExtentM4(&out->halfExtents, getHalfExtents(), m);
}

bool AABB::contain(const cc::Vec3 &point) const {
    cc::Vec3 minPos = getCenter() - getHalfExtents();
    cc::Vec3 maxPos = getCenter() + getHalfExtents();

    return !(point.x > maxPos.x || point.x < minPos.x ||
             point.y > maxPos.y || point.y < minPos.y ||
             point.z > maxPos.z || point.z < minPos.z);
}

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
void AABB::transformExtentM4(Vec3 *out, const Vec3 &extent, const Mat4 &m4) {
    Mat3 m3Tmp;
    m3Tmp.m[0] = std::abs(m4.m[0]);
    m3Tmp.m[1] = std::abs(m4.m[1]);
    m3Tmp.m[2] = std::abs(m4.m[2]);
    m3Tmp.m[3] = std::abs(m4.m[4]);
    m3Tmp.m[4] = std::abs(m4.m[5]);
    m3Tmp.m[5] = std::abs(m4.m[6]);
    m3Tmp.m[6] = std::abs(m4.m[8]);
    m3Tmp.m[7] = std::abs(m4.m[9]);
    m3Tmp.m[8] = std::abs(m4.m[10]);
    out->transformMat3(extent, m3Tmp);
}

AABB::AABB(float px, float py, float pz, float hw, float hh, float hl) : AABB() {
    setCenter(px, py, pz);
    setHalfExtents(hw, hh, hl);
}

} // namespace geometry
} // namespace cc
