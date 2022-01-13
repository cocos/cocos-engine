/**
 Copyright 2013 BlackBerry Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "math/Quaternion.h"

#include <cmath>
#include <cstring>
#include "base/Macros.h"
#include "math/Mat3.h"
#include "math/Math.h"
#include "math/Utils.h"

NS_CC_MATH_BEGIN

const Quaternion Quaternion::ZERO(0.F, 0.F, 0.F, 0.F);

Quaternion::Quaternion(float xx, float yy, float zz, float ww)
: x(xx),
  y(yy),
  z(zz),
  w(ww) {
}

Quaternion::Quaternion(float *array) {
    set(array);
}

Quaternion::Quaternion(const Mat4 &m) {
    set(m);
}

Quaternion::Quaternion(const Vec3 &axis, float angle) {
    set(axis, angle);
}

const Quaternion &Quaternion::identity() {
    static Quaternion value(0.F, 0.F, 0.F, 1.F);
    return value;
}

const Quaternion &Quaternion::zero() {
    static Quaternion value(0.F, 0.F, 0.F, 0.F);
    return value;
}

bool Quaternion::isIdentity() const {
    return x == 0.F && y == 0.F && z == 0.F && w == 1.F;
}

bool Quaternion::isZero() const {
    return x == 0.F && y == 0.F && z == 0.F && w == 0.F;
}

void Quaternion::createFromRotationMatrix(const Mat4 &m, Quaternion *dst) {
    m.getRotation(dst);
}

void Quaternion::createFromAxisAngle(const Vec3 &axis, float angle, Quaternion *dst) {
    GP_ASSERT(dst);

    float halfAngle    = angle * 0.5F;
    float sinHalfAngle = sinf(halfAngle);

    Vec3 normal(axis);
    normal.normalize();
    dst->x = normal.x * sinHalfAngle;
    dst->y = normal.y * sinHalfAngle;
    dst->z = normal.z * sinHalfAngle;
    dst->w = cosf(halfAngle);
}

void Quaternion::createFromAngleZ(float z, Quaternion *dst) {
    GP_ASSERT(dst);

    z *= mathutils::HALF_TO_RAD;
    dst->x = dst->y = 0.F;
    dst->z          = sinf(z);
    dst->w          = cosf(z);
}

void Quaternion::conjugate() {
    x = -x;
    y = -y;
    z = -z;
    //w =  w;
}

Quaternion Quaternion::getConjugated() const {
    Quaternion q(*this);
    q.conjugate();
    return q;
}

bool Quaternion::inverse() {
    float n = x * x + y * y + z * z + w * w;
    if (n == 1.F) {
        x = -x;
        y = -y;
        z = -z;
        //w = w;

        return true;
    }

    // Too close to zero.
    if (n < 0.000001F) {
        return false;
    }

    n = 1.F / n;
    x = -x * n;
    y = -y * n;
    z = -z * n;
    w = w * n;

    return true;
}

Quaternion Quaternion::getInversed() const {
    Quaternion q(*this);
    q.inverse();
    return q;
}

void Quaternion::multiply(const Quaternion &q) {
    multiply(*this, q, this);
}

void Quaternion::multiply(const Quaternion &q1, const Quaternion &q2, Quaternion *dst) {
    GP_ASSERT(dst);

    float x = q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y;
    float y = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
    float z = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
    float w = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;

    dst->x = x;
    dst->y = y;
    dst->z = z;
    dst->w = w;
}

void Quaternion::normalize() {
    float n = x * x + y * y + z * z + w * w;

    // Already normalized.
    if (n == 1.F) {
        return;
    }

    n = sqrt(n);
    // Too close to zero.
    if (n < 0.000001F) {
        return;
    }

    n = 1.F / n;
    x *= n;
    y *= n;
    z *= n;
    w *= n;
}

Quaternion Quaternion::getNormalized() const {
    Quaternion q(*this);
    q.normalize();
    return q;
}

void Quaternion::set(float xx, float yy, float zz, float ww) {
    this->x = xx;
    this->y = yy;
    this->z = zz;
    this->w = ww;
}

void Quaternion::set(const float *array) {
    GP_ASSERT(array);
    x = array[0];
    y = array[1];
    z = array[2];
    w = array[3];
}

void Quaternion::set(const Mat4 &m) {
    Quaternion::createFromRotationMatrix(m, this);
}

void Quaternion::set(const Vec3 &axis, float angle) {
    Quaternion::createFromAxisAngle(axis, angle, this);
}

void Quaternion::set(const Quaternion &q) {
    this->x = q.x;
    this->y = q.y;
    this->z = q.z;
    this->w = q.w;
}

void Quaternion::setIdentity() {
    x = 0.F;
    y = 0.F;
    z = 0.F;
    w = 1.F;
}

float Quaternion::toAxisAngle(Vec3 *axis) const {
    GP_ASSERT(axis);

    Quaternion q(x, y, z, w);
    q.normalize();
    axis->x = q.x;
    axis->y = q.y;
    axis->z = q.z;
    axis->normalize();

    return (2.F * std::acos(q.w));
}

void Quaternion::lerp(const Quaternion &q1, const Quaternion &q2, float t, Quaternion *dst) {
    GP_ASSERT(dst);
    GP_ASSERT(!(t < 0.F || t > 1.F));

    if (t == 0.F) {
        memcpy(dst, &q1, sizeof(float) * 4);
        return;
    }
    if (t == 1.F) {
        memcpy(dst, &q2, sizeof(float) * 4);
        return;
    }

    float t1 = 1.F - t;

    dst->x = t1 * q1.x + t * q2.x;
    dst->y = t1 * q1.y + t * q2.y;
    dst->z = t1 * q1.z + t * q2.z;
    dst->w = t1 * q1.w + t * q2.w;
}

void Quaternion::slerp(const Quaternion &q1, const Quaternion &q2, float t, Quaternion *dst) {
    GP_ASSERT(dst);
    slerp(q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, t, &dst->x, &dst->y, &dst->z, &dst->w);
}

void Quaternion::squad(const Quaternion &q1, const Quaternion &q2, const Quaternion &s1, const Quaternion &s2, float t, Quaternion *dst) {
    GP_ASSERT(!(t < 0.F || t > 1.F));

    Quaternion dstQ(0.F, 0.F, 0.F, 1.F);
    Quaternion dstS(0.F, 0.F, 0.F, 1.F);

    slerpForSquad(q1, q2, t, &dstQ);
    slerpForSquad(s1, s2, t, &dstS);
    slerpForSquad(dstQ, dstS, 2.F * t * (1.F - t), dst);
}

void Quaternion::fromViewUp(const Vec3 &view, Quaternion *out) {
    GP_ASSERT(out);
    fromViewUp(view, Vec3(0, 1, 0), out);
}
void Quaternion::fromViewUp(const Vec3 &view, const Vec3 &up, Quaternion *out) {
    GP_ASSERT(out);
    Mat3 mTemp{Mat3::IDENTITY};
    Mat3::fromViewUp(view, up, &mTemp);
    Quaternion::fromMat3(mTemp, out);
    out->normalize();
}

void Quaternion::fromEuler(float x, float y, float z, Quaternion *dst) {
    GP_ASSERT(dst);
    float halfToRad = 0.5F * cc::math::PI / 180.F;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    float sx = std::sin(x);
    float cx = std::cos(x);
    float sy = std::sin(y);
    float cy = std::cos(y);
    float sz = std::sin(z);
    float cz = std::cos(z);

    dst->x = sx * cy * cz + cx * sy * sz;
    dst->y = cx * sy * cz + sx * cy * sz;
    dst->z = cx * cy * sz - sx * sy * cz;
    dst->w = cx * cy * cz - sx * sy * sz;
}

void Quaternion::toEuler(const Quaternion &q, bool outerZ, Vec3 *out) {
    GP_ASSERT(out);
    float x{q.x};
    float y{q.y};
    float z{q.z};
    float w{q.w};
    float bank{0};
    float heading{0};
    float attitude{0};
    float test = x * y + z * w;
    float r2d  = 180.F / math::PI;
    if (test > 0.499999) {
        bank     = 0;
        heading  = -2 * atan2(x, w) * r2d;
        attitude = 90;
    } else if (test < -0.499999) {
        bank     = 0;
        heading  = -2 * atan2(x, w) * r2d;
        attitude = -90;
    } else {
        float sqx = x * x;
        float sqy = y * y;
        float sqz = z * z;
        bank      = atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz) * r2d;
        heading   = atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz) * r2d;
        attitude  = asin(2 * test) * r2d;
        if (outerZ) {
            bank     = static_cast<float>(-180.F * math::Sgn(bank + 1e-6) + bank);
            heading  = static_cast<float>(-180.F * math::Sgn(heading + 1e-6) + heading);
            attitude = static_cast<float>(180.F * math::Sgn(attitude + 1e-6) - attitude);
        }
    }
    out->x = bank;
    out->y = heading;
    out->z = attitude;
}

void Quaternion::fromMat3(const Mat3 &m, Quaternion *out) {
    GP_ASSERT(out);
    float m00   = m.m[0];
    float m03   = m.m[1];
    float m06   = m.m[2];
    float m01   = m.m[3];
    float m04   = m.m[4];
    float m07   = m.m[5];
    float m02   = m.m[6];
    float m05   = m.m[7];
    float m08   = m.m[8];
    float trace = m00 + m04 + m08;
    if (trace > 0) {
        const float s = 0.5F / sqrtf(trace + 1.F);
        out->w        = 0.25F / s;
        out->x        = (m05 - m07) * s;
        out->y        = (m06 - m02) * s;
        out->z        = (m01 - m03) * s;
    } else if ((m00 > m04) && (m00 > m08)) {
        const float s = 2.F * sqrtf(1.F + m04 - m00 - m08);

        out->w = (m05 - m07) / s;
        out->x = 0.25F * s;
        out->y = (m03 + m01) / s;
        out->z = (m06 + m02) / s;
    } else if (m04 > m08) {
        const float s = 2.F * sqrtf(1.F + m04 - m00 - m08);

        out->w = (m06 - m02) / s;
        out->x = (m03 + m01) / s;
        out->y = 0.25F * s;
        out->z = (m07 + m05) / s;
    } else {
        const float s = 2.F * sqrtf(1.F + m08 - m00 - m04);

        out->w = (m01 - m03) / s;
        out->x = (m06 + m02) / s;
        out->y = (m07 + m05) / s;
        out->z = 0.25F * s;
    }
}

void Quaternion::slerp(float q1x, float q1y, float q1z, float q1w, float q2x, float q2y, float q2z, float q2w, float t, float *dstx, float *dsty, float *dstz, float *dstw) {
    // Fast slerp implementation by kwhatmough:
    // It contains no division operations, no trig, no inverse trig
    // and no sqrt. Not only does this code tolerate small constraint
    // errors in the input quaternions, it actually corrects for them.
    GP_ASSERT(dstx && dsty && dstz && dstw);
    GP_ASSERT(!(t < 0.F || t > 1.F));

    if (t == 0.F) {
        *dstx = q1x;
        *dsty = q1y;
        *dstz = q1z;
        *dstw = q1w;
        return;
    }

    if (t == 1.F) {
        *dstx = q2x;
        *dsty = q2y;
        *dstz = q2z;
        *dstw = q2w;
        return;
    }

    if (q1x == q2x && q1y == q2y && q1z == q2z && q1w == q2w) {
        *dstx = q1x;
        *dsty = q1y;
        *dstz = q1z;
        *dstw = q1w;
        return;
    }

    float halfY;
    float alpha;
    float beta;

    float u;
    float f1;
    float f2a;
    float f2b;

    float ratio1;
    float ratio2;

    float halfSecHalfTheta;
    float versHalfTheta;

    float sqNotU;
    float sqU;

    float cosTheta = q1w * q2w + q1x * q2x + q1y * q2y + q1z * q2z;

    // As usual in all slerp implementations, we fold theta.
    alpha = cosTheta >= 0 ? 1.F : -1.F;
    halfY = 1.F + alpha * cosTheta;

    // Here we bisect the interval, so we need to fold t as well.
    f2b = t - 0.5F;
    u   = f2b >= 0 ? f2b : -f2b;
    f2a = u - f2b;
    f2b += u;
    u += u;
    f1 = 1.F - u;

    // One iteration of Newton to get 1-cos(theta / 2) to good accuracy.
    halfSecHalfTheta = 1.09F - (0.476537F - 0.0903321F * halfY) * halfY;
    halfSecHalfTheta *= 1.5F - halfY * halfSecHalfTheta * halfSecHalfTheta;
    versHalfTheta = 1.F - halfY * halfSecHalfTheta;

    // Evaluate series expansions of the coefficients.
    sqNotU = f1 * f1;
    ratio2 = 0.0000440917108F * versHalfTheta;
    ratio1 = -0.00158730159F + (sqNotU - 16.F) * ratio2;
    ratio1 = 0.0333333333F + ratio1 * (sqNotU - 9.F) * versHalfTheta;
    ratio1 = -0.333333333F + ratio1 * (sqNotU - 4.F) * versHalfTheta;
    ratio1 = 1.F + ratio1 * (sqNotU - 1.F) * versHalfTheta;

    sqU    = u * u;
    ratio2 = -0.00158730159F + (sqU - 16.F) * ratio2;
    ratio2 = 0.0333333333F + ratio2 * (sqU - 9.F) * versHalfTheta;
    ratio2 = -0.333333333F + ratio2 * (sqU - 4.F) * versHalfTheta;
    ratio2 = 1.F + ratio2 * (sqU - 1.F) * versHalfTheta;

    // Perform the bisection and resolve the folding done earlier.
    f1 *= ratio1 * halfSecHalfTheta;
    f2a *= ratio2;
    f2b *= ratio2;
    alpha *= f1 + f2a;
    beta = f1 + f2b;

    // Apply final coefficients to a and b as usual.
    float w = alpha * q1w + beta * q2w;
    float x = alpha * q1x + beta * q2x;
    float y = alpha * q1y + beta * q2y;
    float z = alpha * q1z + beta * q2z;

    // This final adjustment to the quaternion's length corrects for
    // any small constraint error in the inputs q1 and q2 But as you
    // can see, it comes at the cost of 9 additional multiplication
    // operations. If this error-correcting feature is not required,
    // the following code may be removed.
    f1    = 1.5F - 0.5F * (w * w + x * x + y * y + z * z);
    *dstw = w * f1;
    *dstx = x * f1;
    *dsty = y * f1;
    *dstz = z * f1;
}

void Quaternion::slerpForSquad(const Quaternion &q1, const Quaternion &q2, float t, Quaternion *dst) {
    GP_ASSERT(dst);

    // cos(omega) = q1 * q2;
    // slerp(q1, q2, t) = (q1*sin((1-t)*omega) + q2*sin(t*omega))/sin(omega);
    // q1 = +- q2, slerp(q1,q2,t) = q1.
    // This is a straight-forward implementation of the formula of slerp. It does not do any sign switching.
    float c = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

    if (std::abs(c) >= 1.F) {
        dst->x = q1.x;
        dst->y = q1.y;
        dst->z = q1.z;
        dst->w = q1.w;
        return;
    }

    float omega = std::acos(c);
    float s     = std::sqrt(1.F - c * c);
    if (std::abs(s) <= 0.00001F) {
        dst->x = q1.x;
        dst->y = q1.y;
        dst->z = q1.z;
        dst->w = q1.w;
        return;
    }

    float r1 = std::sin((1 - t) * omega) / s;
    float r2 = std::sin(t * omega) / s;
    dst->x   = (q1.x * r1 + q2.x * r2);
    dst->y   = (q1.y * r1 + q2.y * r2);
    dst->z   = (q1.z * r1 + q2.z * r2);
    dst->w   = (q1.w * r1 + q2.w * r2);
}

NS_CC_MATH_END
