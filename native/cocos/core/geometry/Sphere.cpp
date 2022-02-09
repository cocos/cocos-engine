/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "core/geometry/Sphere.h"
#include <algorithm>
#include "core/geometry/AABB.h"
#include "math/Vec3.h"

namespace cc {
namespace geometry {

Sphere *Sphere::create(float cx, float cy, float cz, float radius) {
    return new Sphere(cx, cy, cz, radius);
}

Sphere *Sphere::clone(const Sphere &p) {
    return new Sphere(p._center.x, p._center.y, p._center.z, p._radius);
}

Sphere *Sphere::copy(Sphere *out, const Sphere &p) {
    out->_center = p._center;
    out->_radius = p._radius;
    return out;
}

Sphere *Sphere::fromPoints(Sphere *out, const Vec3 &minPos, const Vec3 &maxPos) {
    out->_center = 0.5F * (minPos + maxPos);
    out->_radius = 0.5F * (maxPos - minPos).length();
    return out;
}

Sphere *Sphere::set(Sphere *out, float cx, float cy, float cz, float r) {
    out->_center = {cx, cy, cz};
    out->_radius = r;
    return out;
}

Sphere *Sphere::mergePoint(Sphere *out, const Sphere &s, const Vec3 &point) {
    // if sphere.radius Less than 0,
    // Set this point as anchor,
    // And set radius to 0.
    if (s._radius < 0.0) {
        out->_center = point;
        out->_radius = 0.0F;
        return out;
    }

    auto offset = point - s._center;
    auto dist   = offset.length();

    if (dist > s._radius) {
        auto half = (dist - s._radius) * 0.5F;
        out->_radius += half;
        offset.scale(half / dist);
        out->_center = out->_center + offset;
    }

    return out;
}

void Sphere::merge(const std::vector<cc::Vec3> &points) {
    if (points.empty()) return;
    _radius = -1.0F;
    for (const auto &p : points) {
        merge(p);
    }
}

Sphere *Sphere::mergeAABB(Sphere *out, const Sphere &s, const AABB &a) {
    Vec3 aabbMin;
    Vec3 aabbMax;
    a.getBoundary(&aabbMin, &aabbMax);
    Sphere::mergePoint(out, s, aabbMin);
    Sphere::mergePoint(out, s, aabbMax);
    return out;
}

Sphere::Sphere(float cx, float cy, float cz, float radius) {
    setType(ShapeEnum::SHAPE_SPHERE);
    _center = {cx, cy, cz};
    _radius = radius;
}

void Sphere::getBoundary(Vec3 *minPos, Vec3 *maxPos) const {
    Vec3 half = {_radius, _radius, _radius};
    *minPos   = _center - half;
    *maxPos   = _center + half;
}

void Sphere::transform(const Mat4 &m,
                       const Vec3 & /*pos*/,
                       const Quaternion & /*rot*/,
                       const Vec3 &scale,
                       Sphere *    out) const {
    Vec3::transformMat4(_center, m, &out->_center);
    out->_radius = _radius * mathutils::maxComponent(scale);
}

int Sphere::interset(const Plane &plane) const {
    const float dot = plane.n.dot(_center);
    const float r   = _radius * plane.n.length();
    if (dot + r < plane.d) {
        return -1;
    }

    if (dot - r > plane.d) {
        return 0;
    }

    return 1;
}

bool Sphere::interset(const Frustum &frustum) const {
    const auto &planes = frustum.planes;
    const auto *self   = this;
    return std::all_of(planes.begin(),
                       planes.end(),
                       // frustum plane normal points to the inside
                       [self](const Plane *plane) { return self->interset(*plane) != -1; });
}

void Sphere::mergePoint(const Vec3 &point) {
    if (_radius < 0.0F) {
        _center = point;
        _radius = 0.0F;
        return;
    }

    auto offset   = point - _center;
    auto distance = offset.length();

    if (distance > _radius) {
        auto half = (distance - _radius) * 0.5F;
        _radius += half;
        offset.scale(half / distance);
        _center += offset;
    }
}

void Sphere::define(const AABB &aabb) {
    cc::Vec3 minPos;
    cc::Vec3 maxPos;
    aabb.getBoundary(&minPos, &maxPos);

    // Initialize sphere
    _center.set(minPos);
    _radius = 0.0F;

    // Calculate sphere
    const cc::Vec3 offset = maxPos - _center;
    const float    dist   = offset.length();

    const float half = dist * 0.5F;
    _radius += dist * 0.5F;
    _center += (half / dist) * offset;
}

void Sphere::mergeAABB(const AABB *aabb) {
    cc::Vec3 minPos;
    cc::Vec3 maxPos;
    aabb->getBoundary(&minPos, &maxPos);
    mergePoint(minPos);
    mergePoint(maxPos);
}

int Sphere::spherePlane(const Plane &plane) {
    const auto dot = cc::Vec3::dot(plane.n, _center);
    const auto r   = _radius * plane.n.length();
    if (dot + r < plane.d) {
        return -1;
    }
    if (dot - r > plane.d) {
        return 0;
    }
    return 1;
}

bool Sphere::sphereFrustum(const Frustum &frustum) const {
    const auto &planes = frustum.planes;
    const auto *self   = this;
    return std::all_of(planes.begin(),
                       planes.end(),
                       // frustum plane normal points to the inside
                       [self](const Plane *plane) { return self->interset(*plane) != -1; });
}

void Sphere::mergeFrustum(const Frustum &frustum) {
    const std::array<Vec3, 8> &vertices = frustum.vertices;
    for (size_t i = 0; i < vertices.max_size(); ++i) {
        merge(vertices[i]);
    }
}

} // namespace geometry
} // namespace cc
