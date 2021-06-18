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

#include "AABB.h"

namespace cc {
namespace scene {
bool AABB::aabbAabb(const AABB &aabb) const {
    Vec3 aMin;
    Vec3 aMax;
    Vec3 bMin;
    Vec3 bMax;
    Vec3::subtract(center, halfExtents, &aMin);
    Vec3::add(center, halfExtents, &aMax);
    Vec3::subtract(center, aabb.halfExtents, &bMin);
    Vec3::add(aabb.center, aabb.halfExtents, &bMax);
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
           (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
           (aMin.z <= bMax.z && aMax.z >= bMin.z);
}

int AABB::aabbPlane(const Plane &plane) const {
    auto r = halfExtents.x * std::abs(plane.n.x) +
             halfExtents.y * std::abs(plane.n.y) +
             halfExtents.z * std::abs(plane.n.z);
    auto dot = Vec3::dot(plane.n, center);
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
    const auto *self   = this;
    return std::all_of(planes.begin(),
                       planes.end(),
                       // frustum plane normal points to the inside
                       [self](const Plane &plane) { return self->aabbPlane(plane) != -1; });
}

void AABB::getBoundary(cc::Vec3 *minPos, cc::Vec3 *maxPos) const {
    Vec3::subtract(center, halfExtents, minPos);
    Vec3::add(center, halfExtents, maxPos);
}

void AABB::merge(const AABB &aabb) {
    cc::Vec3 minA = center - halfExtents;
    cc::Vec3 minB = aabb.center - aabb.halfExtents;
    cc::Vec3 maxA = center + halfExtents;
    cc::Vec3 maxB = aabb.center + aabb.halfExtents;
    cc::Vec3 maxP;
    cc::Vec3 minP;
    cc::Vec3::max(maxA, maxB, &maxP);
    cc::Vec3::min(minA, minB, &minP);

    cc::Vec3 addP = maxP + minP;
    cc::Vec3 subP = maxP - minP;
    center        = addP * 0.5F;
    halfExtents   = subP * 0.5F;
}

void AABB::set(const cc::Vec3 &centerVal, const cc::Vec3 &halfExtentVal) {
    center      = centerVal;
    halfExtents = halfExtentVal;
}

void AABB::transform(const Mat4 &m, AABB *out) const {
    out->center.transformMat4(center, m);
    transformExtentM4(&out->halfExtents, halfExtents, m);
}

void AABB::transformExtentM4(Vec3 *out, const Vec3 &extent, const Mat4 &m4) {
    Mat3 m3Tmp;
    m3Tmp.m[0] = abs(m4.m[0]);
    m3Tmp.m[1] = abs(m4.m[1]);
    m3Tmp.m[2] = abs(m4.m[2]);
    m3Tmp.m[3] = abs(m4.m[4]);
    m3Tmp.m[4] = abs(m4.m[5]);
    m3Tmp.m[5] = abs(m4.m[6]);
    m3Tmp.m[6] = abs(m4.m[8]);
    m3Tmp.m[7] = abs(m4.m[9]);
    m3Tmp.m[8] = abs(m4.m[10]);
    out->transformMat3(extent, m3Tmp);
}

void AABB::fromPoints(const Vec3 &minPos, const Vec3 &maxPos, AABB *dst) {
    Vec3 v3Tmp;
    Vec3::add(maxPos, minPos, &v3Tmp);
    dst->center.set(v3Tmp * 0.5);
    Vec3::subtract(maxPos, minPos, &v3Tmp);
    dst->halfExtents.set(v3Tmp * 0.5);
}

} // namespace scene
} // namespace cc
