/**
 Copyright 2013 BlackBerry Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#include "math/Mat3.hpp"
#include "math/MathUtil.h"
#include "base/ccMacros.h"
#include "math/Quaternion.h"

NS_CC_MATH_BEGIN

Vec3::Vec3()
    : x(0.0f), y(0.0f), z(0.0f)
{
}

Vec3::Vec3(float xx, float yy, float zz)
    : x(xx), y(yy), z(zz)
{
}

Vec3::Vec3(const float* array)
{
    set(array);
}

Vec3::Vec3(const Vec3& p1, const Vec3& p2)
{
    set(p1, p2);
}

Vec3::Vec3(const Vec3& copy)
{
    set(copy);
}

Vec3 Vec3::fromColor(unsigned int color)
{
    float components[3];
    int componentIndex = 0;
    for (int i = 2; i >= 0; --i)
    {
        int component = (color >> i*8) & 0x0000ff;

        components[componentIndex++] = static_cast<float>(component) / 255.0f;
    }

    Vec3 value(components);
    return value;
}

Vec3::~Vec3()
{
}

float Vec3::angle(const Vec3& v1, const Vec3& v2)
{
    float dx = v1.y * v2.z - v1.z * v2.y;
    float dy = v1.z * v2.x - v1.x * v2.z;
    float dz = v1.x * v2.y - v1.y * v2.x;

    return std::atan2(std::sqrt(dx * dx + dy * dy + dz * dz) + MATH_FLOAT_SMALL, dot(v1, v2));
}

void Vec3::add(const Vec3& v1, const Vec3& v2, Vec3* dst)
{
    GP_ASSERT(dst);

    dst->x = v1.x + v2.x;
    dst->y = v1.y + v2.y;
    dst->z = v1.z + v2.z;
}

void Vec3::clamp(const Vec3& min, const Vec3& max)
{
    GP_ASSERT(!(min.x > max.x || min.y > max.y || min.z > max.z));

    // Clamp the x value.
    if (x < min.x)
        x = min.x;
    if (x > max.x)
        x = max.x;

    // Clamp the y value.
    if (y < min.y)
        y = min.y;
    if (y > max.y)
        y = max.y;

    // Clamp the z value.
    if (z < min.z)
        z = min.z;
    if (z > max.z)
        z = max.z;
}

void Vec3::clamp(const Vec3& v, const Vec3& min, const Vec3& max, Vec3* dst)
{
    GP_ASSERT(dst);
    GP_ASSERT(!(min.x > max.x || min.y > max.y || min.z > max.z));

    // Clamp the x value.
    dst->x = v.x;
    if (dst->x < min.x)
        dst->x = min.x;
    if (dst->x > max.x)
        dst->x = max.x;

    // Clamp the y value.
    dst->y = v.y;
    if (dst->y < min.y)
        dst->y = min.y;
    if (dst->y > max.y)
        dst->y = max.y;

    // Clamp the z value.
    dst->z = v.z;
    if (dst->z < min.z)
        dst->z = min.z;
    if (dst->z > max.z)
        dst->z = max.z;
}

void Vec3::cross(const Vec3& v)
{
    cross(*this, v, this);
}

void Vec3::cross(const Vec3& v1, const Vec3& v2, Vec3* dst)
{
    GP_ASSERT(dst);

    // NOTE: This code assumes Vec3 struct members are contiguous floats in memory.
    // We might want to revisit this (and other areas of code that make this assumption)
    // later to guarantee 100% safety/compatibility.
    MathUtil::crossVec3(&v1.x, &v2.x, &dst->x);
}

void Vec3::multiply(const Vec3& v)
{
    x *= v.x;
    y *= v.y;
    z *= v.z;
}

void Vec3::multiply(const Vec3& v1, const Vec3& v2, Vec3* dst)
{
    dst->x = v1.x * v2.x;
    dst->y = v1.y * v2.y;
    dst->z = v1.z * v2.z;
}

void Vec3::transformMat3(const Vec3& v, const Mat3 &m)
{
    float ix = v.x, iy = v.y, iz = v.z;
    x = ix * m.m[0] + iy * m.m[3] + iz * m.m[6];
    y = ix * m.m[1] + iy * m.m[4] + iz * m.m[7];
    z = ix * m.m[2] + iy * m.m[5] + iz * m.m[8];
}

void Vec3::transformMat4(const Vec3& v, const Mat4 &m)
{
    float ix = v.x, iy = v.y, iz = v.z;
    float rhw = m.m[3] * ix + m.m[7] * iy + m.m[11] * iz + m.m[15];
    rhw = rhw ? 1 / rhw : 1;
    
    x = (m.m[0] * ix + m.m[4] * iy + m.m[8] * iz + m.m[12]) * rhw;
    y = (m.m[1] * ix + m.m[5] * iy + m.m[9] * iz + m.m[13]) * rhw;
    z = (m.m[2] * ix + m.m[6] * iy + m.m[10] * iz + m.m[14]) * rhw;
}

void Vec3::transformQuat(const Quaternion& q)
{
    float qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    
    // calculate quat * vec
    float ix = qw * x + qy * z - qz * y;
    float iy = qw * y + qz * x - qx * z;
    float iz = qw * z + qx * y - qy * x;
    float iw = -qx * x - qy * y - qz * z;
    
    // calculate result * inverse quat
    x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
}

float Vec3::distance(const Vec3& v) const
{
    float dx = v.x - x;
    float dy = v.y - y;
    float dz = v.z - z;

    return std::sqrt(dx * dx + dy * dy + dz * dz);
}

float Vec3::distanceSquared(const Vec3& v) const
{
    float dx = v.x - x;
    float dy = v.y - y;
    float dz = v.z - z;

    return (dx * dx + dy * dy + dz * dz);
}

float Vec3::dot(const Vec3& v) const
{
    return (x * v.x + y * v.y + z * v.z);
}

float Vec3::dot(const Vec3& v1, const Vec3& v2)
{
    return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
}

void Vec3::normalize()
{
    float n = x * x + y * y + z * z;
    // Already normalized.
    if (n == 1.0f)
        return;

    n = std::sqrt(n);
    // Too close to zero.
    if (n < MATH_TOLERANCE)
        return;

    n = 1.0f / n;
    x *= n;
    y *= n;
    z *= n;
}

Vec3 Vec3::getNormalized() const
{
    Vec3 v(*this);
    v.normalize();
    return v;
}

void Vec3::subtract(const Vec3& v1, const Vec3& v2, Vec3* dst)
{
    GP_ASSERT(dst);

    dst->x = v1.x - v2.x;
    dst->y = v1.y - v2.y;
    dst->z = v1.z - v2.z;
}

void Vec3::smooth(const Vec3& target, float elapsedTime, float responseTime)
{
    if (elapsedTime > 0)
    {
        *this += (target - *this) * (elapsedTime / (elapsedTime + responseTime));
    }
}

const Vec3 Vec3::ZERO(0.0f, 0.0f, 0.0f);
const Vec3 Vec3::ONE(1.0f, 1.0f, 1.0f);
const Vec3 Vec3::UNIT_X(1.0f, 0.0f, 0.0f);
const Vec3 Vec3::UNIT_Y(0.0f, 1.0f, 0.0f);
const Vec3 Vec3::UNIT_Z(0.0f, 0.0f, 1.0f);

NS_CC_MATH_END
