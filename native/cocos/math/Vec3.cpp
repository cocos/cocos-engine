/**
 Copyright 2013 BlackBerry Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Original file from GamePlay3D: http://gameplay3d.org

 This file was modified to fit the cocos2d-x project
 */

#include "math/Vec3.h"
#include "base/Macros.h"
#include "math/Mat3.h"
#include "math/Math.h"
#include "math/MathUtil.h"
#include "math/Quaternion.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <cpu-features.h>
#endif

#if (CC_PLATFORM == CC_PLATFORM_IOS)
    #if defined(__arm64__)
        #define USE_NEON64
        #define INCLUDE_NEON64
    #endif
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #if defined(__arm64__) || defined(__aarch64__)
        #define USE_NEON64
        #define INCLUDE_NEON64
    #elif defined(__ARM_NEON__)
        #define INCLUDE_NEON32
    #endif
#endif

#if defined(USE_NEON64) || defined(USE_NEON32) || defined(INCLUDE_NEON32)
    #include "enoki/array.h"
    #ifndef ENOKI_ARM_NEON
        #error "ENOKI_ARM_NEON isn't enabled!"
    #endif
using SimdVec4 = enoki::Array<float, 4>;
#endif

NS_CC_MATH_BEGIN

Vec3::Vec3(float xx, float yy, float zz)
: x(xx),
  y(yy),
  z(zz) {
}

Vec3::Vec3(const float *array) {
    set(array);
}

Vec3::Vec3(const Vec3 &p1, const Vec3 &p2) {
    set(p1, p2);
}

Vec3::Vec3(const Vec3 &copy) {
    set(copy);
}

Vec3 Vec3::fromColor(unsigned int color) {
    float components[3];
    int componentIndex = 0;
    for (int i = 2; i >= 0; --i) {
        auto component = (color >> i * 8) & 0x0000ff;

        components[componentIndex++] = static_cast<float>(component) / 255.0F;
    }

    Vec3 value(components);
    return value;
}

void Vec3::transformInverseRTS(const Vec3 &v, const Quaternion &r, const Vec3 &t, const Vec3 &s, Vec3 *out) {
    CC_ASSERT(out);
    const float x = v.x - t.x;
    const float y = v.y - t.y;
    const float z = v.z - t.z;

    const float ix = r.w * x - r.y * z + r.z * y;
    const float iy = r.w * y - r.z * x + r.x * z;
    const float iz = r.w * z - r.x * y + r.y * x;
    const float iw = r.x * x + r.y * y + r.z * z;
    out->x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
    out->y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
    out->z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
}

float Vec3::angle(const Vec3 &v1, const Vec3 &v2) {
    const auto magSqr1 = v1.x * v1.x + v1.y * v1.y + v1.z * v1.z;
    const auto magSqr2 = v2.x * v2.x + v2.y * v2.y + v2.z * v2.z;

    if (magSqr1 == 0.0F || magSqr2 == 0.0F) {
        return 0.0F;
    }

    const auto dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    auto cosine = dot / (sqrt(magSqr1 * magSqr2));
    cosine = clampf(cosine, -1.0, 1.0);
    return acos(cosine);
}

void Vec3::add(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    CC_ASSERT(dst);

    dst->x = v1.x + v2.x;
    dst->y = v1.y + v2.y;
    dst->z = v1.z + v2.z;
}

void Vec3::clamp(const Vec3 &min, const Vec3 &max) {
    CC_ASSERT(!(min.x > max.x || min.y > max.y || min.z > max.z));

    // Clamp the x value.
    if (x < min.x) {
        x = min.x;
    }
    if (x > max.x) {
        x = max.x;
    }

    // Clamp the y value.
    if (y < min.y) {
        y = min.y;
    }
    if (y > max.y) {
        y = max.y;
    }

    // Clamp the z value.
    if (z < min.z) {
        z = min.z;
    }
    if (z > max.z) {
        z = max.z;
    }
}

void Vec3::clamp(const Vec3 &v, const Vec3 &min, const Vec3 &max, Vec3 *dst) {
    CC_ASSERT(dst);
    CC_ASSERT(!(min.x > max.x || min.y > max.y || min.z > max.z));

    // Clamp the x value.
    dst->x = v.x;
    if (dst->x < min.x) {
        dst->x = min.x;
    }
    if (dst->x > max.x) {
        dst->x = max.x;
    }

    // Clamp the y value.
    dst->y = v.y;
    if (dst->y < min.y) {
        dst->y = min.y;
    }
    if (dst->y > max.y) {
        dst->y = max.y;
    }

    // Clamp the z value.
    dst->z = v.z;
    if (dst->z < min.z) {
        dst->z = min.z;
    }
    if (dst->z > max.z) {
        dst->z = max.z;
    }
}

void Vec3::cross(const Vec3 &v) {
    cross(*this, v, this);
}

void Vec3::cross(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    dst->set(
        v1.y * v2.z - v1.z * v2.y,
        v1.z * v2.x - v1.x * v2.z,
        v1.x * v2.y - v1.y * v2.x);
}

void Vec3::multiply(const Vec3 &v) {
    x *= v.x;
    y *= v.y;
    z *= v.z;
}

void Vec3::multiply(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    dst->x = v1.x * v2.x;
    dst->y = v1.y * v2.y;
    dst->z = v1.z * v2.z;
}

void Vec3::transformMat3(const Vec3 &v, const Mat3 &m) {
    const float ix = v.x;
    const float iy = v.y;
    const float iz = v.z;
    x = ix * m.m[0] + iy * m.m[3] + iz * m.m[6];
    y = ix * m.m[1] + iy * m.m[4] + iz * m.m[7];
    z = ix * m.m[2] + iy * m.m[5] + iz * m.m[8];
}

void Vec3::transformMat4Neon(const Vec3 &v, const Mat4 &m) {
#if defined(USE_NEON64) || defined(USE_NEON32) || defined(INCLUDE_NEON32)
    alignas(16) float tmpV0[4];

    auto row0 = enoki::load_unaligned<SimdVec4>(&m.m[0]);
    auto row1 = enoki::load_unaligned<SimdVec4>(&m.m[4]);
    auto row2 = enoki::load_unaligned<SimdVec4>(&m.m[8]);
    auto row3 = enoki::load_unaligned<SimdVec4>(&m.m[12]);

    row0 *= v.x;
    row1 *= v.y;
    row2 *= v.z;

    row0 = row0 + row1 + row2 + row3;
    enoki::store(tmpV0, row0);
    float rhw;

    if (CC_PREDICT_TRUE(math::isNotZeroF(tmpV0[3]))) {
        rhw = 1.F / tmpV0[3];
    } else {
        rhw = 1.F;
    }

    SimdVec4 tmpV1{rhw};
    row0 *= tmpV1;
    enoki::store(tmpV0, row0);

    x = tmpV0[0];
    y = tmpV0[1];
    z = tmpV0[2];
#endif
}

void Vec3::transformMat4C(const Vec3 &v, const Mat4 &m) {
    alignas(16) float tmp[4] = {v.x, v.y, v.z, 1.0F};
    MathUtil::transformVec4(m.m, tmp, tmp);
    float rhw = math::isNotZeroF(tmp[3]) ? 1.F / tmp[3] : 1.F;
    x = tmp[0] * rhw;
    y = tmp[1] * rhw;
    z = tmp[2] * rhw;
}

void Vec3::transformMat4(const Vec3 &v, const Mat4 &m) {
#if defined(USE_NEON64)
    transformMat4Neon(v, m);
#elif defined(INCLUDE_NEON32)
    if (CC_PREDICT_TRUE(MathUtil::isNeon32Enabled())) {
        transformMat4Neon(v, m);
    } else {
        transformMat4C(v, m);
    }
#else
    transformMat4C(v, m);
#endif
}

void Vec3::transformMat4(const Vec3 &v, const Mat4 &m, Vec3 *dst) {
    dst->transformMat4(v, m);
}

void Vec3::transformMat4Normal(const Vec3 &v, const Mat4 &m, Vec3 *dst) {
    float x = v.x;
    float y = v.y;
    float z = v.z;
    float rhw = m.m[3] * x + m.m[7] * y + m.m[11] * z;
    rhw = (rhw != 0.0F ? 1.0F / rhw : 1.0F);
    dst->x = (m.m[0] * x + m.m[4] * y + m.m[8] * z) * rhw;
    dst->y = (m.m[1] * x + m.m[5] * y + m.m[9] * z) * rhw;
    dst->z = (m.m[2] * x + m.m[6] * y + m.m[10] * z) * rhw;
}

void Vec3::moveTowards(const Vec3 &current, const Vec3 &target, float maxStep, Vec3 *dst) {
    const auto deltaX = target.x - current.x;
    const auto deltaY = target.y - current.y;
    const auto deltaZ = target.z - current.z;

    const auto distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
    if (distanceSqr == 0.0F || (maxStep >= 0.0F && distanceSqr < maxStep * maxStep)) {
        dst->set(target);
        return;
    }

    const auto distance = std::sqrt(distanceSqr);
    const auto scale = maxStep / distance;
    dst->set(
        current.x + deltaX * scale,
        current.y + deltaY * scale,
        current.z + deltaZ * scale);
}

void Vec3::transformQuat(const Quaternion &q) {
    const float qx = q.x;
    const float qy = q.y;
    const float qz = q.z;
    const float qw = q.w;

    // calculate quat * vec
    const float ix = qw * x + qy * z - qz * y;
    const float iy = qw * y + qz * x - qx * z;
    const float iz = qw * z + qx * y - qy * x;
    const float iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
}

float Vec3::distance(const Vec3 &v) const {
    const float dx = v.x - x;
    const float dy = v.y - y;
    const float dz = v.z - z;

    return std::sqrt(dx * dx + dy * dy + dz * dz);
}

float Vec3::distanceSquared(const Vec3 &v) const {
    const float dx = v.x - x;
    const float dy = v.y - y;
    const float dz = v.z - z;

    return (dx * dx + dy * dy + dz * dz);
}

float Vec3::dot(const Vec3 &v) const {
    return (x * v.x + y * v.y + z * v.z);
}

float Vec3::dot(const Vec3 &v1, const Vec3 &v2) {
    return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
}

void Vec3::normalize() {
    float len = x * x + y * y + z * z;
    if (len > 0.0F) {
        len = 1.0F / std::sqrt(len);
        x *= len;
        y *= len;
        z *= len;
    }
}

Vec3 Vec3::getNormalized() const {
    Vec3 v(*this);
    v.normalize();
    return v;
}

void Vec3::subtract(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    CC_ASSERT(dst);

    dst->x = v1.x - v2.x;
    dst->y = v1.y - v2.y;
    dst->z = v1.z - v2.z;
}

void Vec3::max(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    CC_ASSERT(dst);

    dst->x = std::fmaxf(v1.x, v2.x);
    dst->y = std::fmaxf(v1.y, v2.y);
    dst->z = std::fmaxf(v1.z, v2.z);
}

void Vec3::min(const Vec3 &v1, const Vec3 &v2, Vec3 *dst) {
    CC_ASSERT(dst);

    dst->x = std::fminf(v1.x, v2.x);
    dst->y = std::fminf(v1.y, v2.y);
    dst->z = std::fminf(v1.z, v2.z);
}

void Vec3::smooth(const Vec3 &target, float elapsedTime, float responseTime) {
    if (elapsedTime > 0.0F) {
        *this += (target - *this) * (elapsedTime / (elapsedTime + responseTime));
    }
}

const Vec3 Vec3::ZERO(0.0F, 0.0F, 0.0F);
const Vec3 Vec3::ONE(1.0F, 1.0F, 1.0F);
const Vec3 Vec3::UNIT_X(1.0F, 0.0F, 0.0F);
const Vec3 Vec3::UNIT_Y(0.0F, 1.0F, 0.0F);
const Vec3 Vec3::UNIT_Z(0.0F, 0.0F, 1.0F);
const Vec3 Vec3::FORWARD(0.0F, 0.0F, -1.0F);

NS_CC_MATH_END
