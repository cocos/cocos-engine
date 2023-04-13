/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.
 
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

#include "math/Mat3.h"

#include <cmath>
#include <cstring>
#include "base/Macros.h"
#include "math/Math.h"
#include "math/MathUtil.h"
#include "math/Quaternion.h"

NS_CC_MATH_BEGIN

Mat3::Mat3() {
    *this = IDENTITY;
}

Mat3::Mat3(float m00, float m01, float m02,
           float m03, float m04, float m05,
           float m06, float m07, float m08) {
    set(m00, m01, m02, m03, m04, m05, m06, m07, m08);
}

Mat3::Mat3(const float *mat) {
    set(mat);
}

Mat3::Mat3(const Mat3 &copy) {
    memcpy(m, copy.m, MATRIX3_SIZE);
}

void Mat3::set(float m00, float m01, float m02,
               float m03, float m04, float m05,
               float m06, float m07, float m08) {
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;
    m[3] = m03;
    m[4] = m04;
    m[5] = m05;
    m[6] = m06;
    m[7] = m07;
    m[8] = m08;
}

void Mat3::set(const float *mat) {
    CC_ASSERT(mat);
    memcpy(this->m, mat, MATRIX3_SIZE);
}

void Mat3::set(const Mat3 &mat) {
    memcpy(this->m, mat.m, MATRIX3_SIZE);
}

void Mat3::identity(Mat3 &mat) {
    mat.m[0] = 1;
    mat.m[1] = 0;
    mat.m[2] = 0;
    mat.m[3] = 0;
    mat.m[4] = 1;
    mat.m[5] = 0;
    mat.m[6] = 0;
    mat.m[7] = 0;
    mat.m[8] = 1;
}

void Mat3::fromViewUp(const Vec3 &view, Mat3 *out) {
    CC_ASSERT(out);
    fromViewUp(view, Vec3(0, 1, 0), out);
}
void Mat3::fromViewUp(const Vec3 &view, const Vec3 &up, Mat3 *out) {
    CC_ASSERT(out);
    if (view.lengthSquared() < math::EPSILON * math::EPSILON) {
        Mat3::identity(*out);
        return;
    }
    Vec3 vTempA{Vec3::ZERO};
    Vec3 vTempB{Vec3::ZERO};

    Vec3::cross(up, view, &vTempA);
    vTempA.normalize();
    if (vTempA.lengthSquared() < math::EPSILON * math::EPSILON) {
        Mat3::identity(*out);
        return;
    }
    Vec3::cross(view, vTempA, &vTempB);
    out->set(vTempA.x, vTempA.y, vTempA.z,
             vTempB.x, vTempB.y, vTempB.z,
             view.x, view.y, view.z);
}

void Mat3::transpose() {
    float a01 = m[1];
    float a02 = m[2];
    float a12 = m[5];
    m[1] = m[3];
    m[2] = m[6];
    m[3] = a01;
    m[5] = m[7];
    m[6] = a02;
    m[7] = a12;
}

void Mat3::transpose(const Mat3 &mat, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = mat.m[0];
    out->m[1] = mat.m[3];
    out->m[2] = mat.m[6];
    out->m[3] = mat.m[1];
    out->m[4] = mat.m[4];
    out->m[5] = mat.m[7];
    out->m[6] = mat.m[2];
    out->m[7] = mat.m[5];
    out->m[8] = mat.m[8];
}

void Mat3::inverse() {
    float a00 = m[0];
    float a01 = m[1];
    float a02 = m[2];
    float a10 = m[3];
    float a11 = m[4];
    float a12 = m[5];
    float a20 = m[6];
    float a21 = m[7];
    float a22 = m[8];

    float b01 = a22 * a11 - a12 * a21;
    float b11 = -a22 * a10 + a12 * a20;
    float b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    float det = a00 * b01 + a01 * b11 + a02 * b21;
    if (det == 0.F) {
        set(0.F, 0.F, 0.F, 0.F, 0.F, 0.F, 0.F, 0.F, 0.F);
        return;
    }

    det = 1.0F / det;
    m[0] = b01 * det;
    m[1] = (-a22 * a01 + a02 * a21) * det;
    m[2] = (a12 * a01 - a02 * a11) * det;
    m[3] = b11 * det;
    m[4] = (a22 * a00 - a02 * a20) * det;
    m[5] = (-a12 * a00 + a02 * a10) * det;
    m[6] = b21 * det;
    m[7] = (-a21 * a00 + a01 * a20) * det;
    m[8] = (a11 * a00 - a01 * a10) * det;
}

void Mat3::adjoint(const Mat3 &mat, Mat3 *out) {
    CC_ASSERT(out);
    float a00 = mat.m[0];
    float a01 = mat.m[1];
    float a02 = mat.m[2];
    float a10 = mat.m[3];
    float a11 = mat.m[4];
    float a12 = mat.m[5];
    float a20 = mat.m[6];
    float a21 = mat.m[7];
    float a22 = mat.m[8];

    out->m[0] = (a11 * a22 - a12 * a21);
    out->m[1] = (a02 * a21 - a01 * a22);
    out->m[2] = (a01 * a12 - a02 * a11);
    out->m[3] = (a12 * a20 - a10 * a22);
    out->m[4] = (a00 * a22 - a02 * a20);
    out->m[5] = (a02 * a10 - a00 * a12);
    out->m[6] = (a10 * a21 - a11 * a20);
    out->m[7] = (a01 * a20 - a00 * a21);
    out->m[8] = (a00 * a11 - a01 * a10);
}

float Mat3::determinant() {
    return m[0] * (m[8] * m[4] - m[5] * m[7]) + m[1] * (-m[8] * m[3] + m[5] * m[6]) + m[2] * (m[7] * m[3] - m[4] * m[6]);
}

void Mat3::multiply(const Mat3 &a, const Mat3 &b, Mat3 *out) {
    CC_ASSERT(out);
    float a00 = a.m[0];
    float a01 = a.m[1];
    float a02 = a.m[2];
    float a10 = a.m[3];
    float a11 = a.m[4];
    float a12 = a.m[5];
    float a20 = a.m[6];
    float a21 = a.m[7];
    float a22 = a.m[8];

    float b00 = b.m[0];
    float b01 = b.m[1];
    float b02 = b.m[2];
    float b10 = b.m[3];
    float b11 = b.m[4];
    float b12 = b.m[5];
    float b20 = b.m[6];
    float b21 = b.m[7];
    float b22 = b.m[8];

    out->m[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out->m[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out->m[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out->m[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out->m[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out->m[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out->m[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out->m[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out->m[8] = b20 * a02 + b21 * a12 + b22 * a22;
}

void Mat3::translate(const Mat3 &mat, const Vec2 &vec, Mat3 *out) {
    CC_ASSERT(out);
    float a00 = mat.m[0];
    float a01 = mat.m[1];
    float a02 = mat.m[2];
    float a10 = mat.m[3];
    float a11 = mat.m[4];
    float a12 = mat.m[5];
    float a20 = mat.m[6];
    float a21 = mat.m[7];
    float a22 = mat.m[8];
    float x = vec.x;
    float y = vec.y;

    out->m[0] = a00;
    out->m[1] = a01;
    out->m[2] = a02;

    out->m[3] = a10;
    out->m[4] = a11;
    out->m[5] = a12;

    out->m[6] = x * a00 + y * a10 + a20;
    out->m[7] = x * a01 + y * a11 + a21;
    out->m[8] = x * a02 + y * a12 + a22;
}

void Mat3::rotate(const Mat3 &mat, float rad, Mat3 *out) {
    CC_ASSERT(out);
    float a00 = mat.m[0];
    float a01 = mat.m[1];
    float a02 = mat.m[2];
    float a10 = mat.m[3];
    float a11 = mat.m[4];
    float a12 = mat.m[5];
    float a20 = mat.m[6];
    float a21 = mat.m[7];
    float a22 = mat.m[8];

    float s = sin(rad);
    float c = cos(rad);

    out->m[0] = c * a00 + s * a10;
    out->m[1] = c * a01 + s * a11;
    out->m[2] = c * a02 + s * a12;

    out->m[3] = c * a10 - s * a00;
    out->m[4] = c * a11 - s * a01;
    out->m[5] = c * a12 - s * a02;

    out->m[6] = a20;
    out->m[7] = a21;
    out->m[8] = a22;
}

void Mat3::scale(const Mat3 &mat, const Vec2 &vec, Mat3 *out) {
    CC_ASSERT(out);
    float x = vec.x;
    float y = vec.y;

    out->m[0] = x * mat.m[0];
    out->m[1] = x * mat.m[1];
    out->m[2] = x * mat.m[2];

    out->m[3] = y * mat.m[3];
    out->m[4] = y * mat.m[4];
    out->m[5] = y * mat.m[5];

    out->m[6] = mat.m[6];
    out->m[7] = mat.m[7];
    out->m[8] = mat.m[8];
}

void Mat3::fromMat4(const Mat4 &mat, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = mat.m[0];
    out->m[1] = mat.m[1];
    out->m[2] = mat.m[2];
    out->m[3] = mat.m[4];
    out->m[4] = mat.m[5];
    out->m[5] = mat.m[6];
    out->m[6] = mat.m[8];
    out->m[7] = mat.m[9];
    out->m[8] = mat.m[10];
}

void Mat3::fromTranslation(const Vec2 &vec, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = 1;
    out->m[1] = 0;
    out->m[2] = 0;
    out->m[3] = 0;
    out->m[4] = 1;
    out->m[5] = 0;
    out->m[6] = vec.x;
    out->m[7] = vec.y;
    out->m[8] = 1;
}

void Mat3::fromRotation(float rad, Mat3 *out) {
    CC_ASSERT(out);
    float s = sin(rad);
    float c = cos(rad);

    out->m[0] = c;
    out->m[1] = s;
    out->m[2] = 0;

    out->m[3] = -s;
    out->m[4] = c;
    out->m[5] = 0;

    out->m[6] = 0;
    out->m[7] = 0;
    out->m[8] = 1;
}

void Mat3::fromScaling(const Vec2 &vec, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = vec.x;
    out->m[1] = 0;
    out->m[2] = 0;

    out->m[3] = 0;
    out->m[4] = vec.y;
    out->m[5] = 0;

    out->m[6] = 0;
    out->m[7] = 0;
    out->m[8] = 1;
}

void Mat3::fromQuat(const Quaternion &quat, Mat3 *out) {
    CC_ASSERT(out);
    float x = quat.x;
    float y = quat.y;
    float z = quat.z;
    float w = quat.w;
    float x2 = x + x;
    float y2 = y + y;
    float z2 = z + z;

    float xx = x * x2;
    float yx = y * x2;
    float yy = y * y2;
    float zx = z * x2;
    float zy = z * y2;
    float zz = z * z2;
    float wx = w * x2;
    float wy = w * y2;
    float wz = w * z2;

    out->m[0] = 1 - yy - zz;
    out->m[3] = yx - wz;
    out->m[6] = zx + wy;

    out->m[1] = yx + wz;
    out->m[4] = 1 - xx - zz;
    out->m[7] = zy - wx;

    out->m[2] = zx - wy;
    out->m[5] = zy + wx;
    out->m[8] = 1 - xx - yy;
}

void Mat3::add(const Mat3 &a, const Mat3 &b, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = a.m[0] + b.m[0];
    out->m[1] = a.m[1] + b.m[1];
    out->m[2] = a.m[2] + b.m[2];
    out->m[3] = a.m[3] + b.m[3];
    out->m[4] = a.m[4] + b.m[4];
    out->m[5] = a.m[5] + b.m[5];
    out->m[6] = a.m[6] + b.m[6];
    out->m[7] = a.m[7] + b.m[7];
    out->m[8] = a.m[8] + b.m[8];
}

void Mat3::subtract(const Mat3 &a, const Mat3 &b, Mat3 *out) {
    CC_ASSERT(out);
    out->m[0] = a.m[0] - b.m[0];
    out->m[1] = a.m[1] - b.m[1];
    out->m[2] = a.m[2] - b.m[2];
    out->m[3] = a.m[3] - b.m[3];
    out->m[4] = a.m[4] - b.m[4];
    out->m[5] = a.m[5] - b.m[5];
    out->m[6] = a.m[6] - b.m[6];
    out->m[7] = a.m[7] - b.m[7];
    out->m[8] = a.m[8] - b.m[8];
}

bool Mat3::approxEquals(const Mat3 &v, float precision /* = CC_FLOAT_CMP_PRECISION */) const {
    return math::isEqualF(m[0], v.m[0], precision) &&
           math::isEqualF(m[1], v.m[1], precision) &&
           math::isEqualF(m[2], v.m[2], precision) &&
           math::isEqualF(m[3], v.m[3], precision) &&
           math::isEqualF(m[4], v.m[4], precision) &&
           math::isEqualF(m[5], v.m[5], precision) &&
           math::isEqualF(m[6], v.m[6], precision) &&
           math::isEqualF(m[7], v.m[7], precision) &&
           math::isEqualF(m[8], v.m[8], precision);
}

const Mat3 Mat3::IDENTITY = Mat3(
    1.F, 0.F, 0.F,
    0.F, 1.F, 0.F,
    0.F, 0.F, 1.F);

const Mat3 Mat3::ZERO = Mat3(
    0, 0, 0,
    0, 0, 0,
    0, 0, 0);

NS_CC_MATH_END
