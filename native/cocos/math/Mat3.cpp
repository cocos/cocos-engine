/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "math/Mat3.hpp"

#include <cmath>
#include "math/Quaternion.h"
#include "math/MathUtil.h"
#include "base/ccMacros.h"

NS_CC_MATH_BEGIN

Mat3::Mat3()
{
    *this = IDENTITY;
}

Mat3::Mat3(float m11, float m12, float m13, float m21, float m22, float m23,
           float m31, float m32, float m33)
{
    set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
}

Mat3::Mat3(const float* mat)
{
    set(mat);
}

Mat3::Mat3(const Mat3& copy)
{
    memcpy(m, copy.m, MATRIX3_SIZE);
}

Mat3::~Mat3()
{
}

void Mat3::set(float m11, float m12, float m13, float m21, float m22, float m23, float m31, float m32, float m33)
{
    m[0]  = m11;
    m[1]  = m21;
    m[2]  = m31;
    m[3]  = m12;
    m[4]  = m22;
    m[5]  = m32;
    m[6]  = m13;
    m[7]  = m23;
    m[8] = m33;
}

void Mat3::set(const float* mat)
{
    GP_ASSERT(mat);
    memcpy(this->m, mat, MATRIX3_SIZE);
}

void Mat3::set(const Mat3& mat)
{
    memcpy(this->m, mat.m, MATRIX3_SIZE);
}

void Mat3::identity(Mat3& mat)
{
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

void Mat3::transpose()
{
    float a01 = m[1], a02 = m[2], a12 = m[5];
    m[1] = m[3];
    m[2] = m[6];
    m[3] = a01;
    m[5] = m[7];
    m[6] = a02;
    m[7] = a12;
}

void Mat3::transpose(Mat3 &out, const Mat3 &mat)
{
    out.m[0] = mat.m[0];
    out.m[1] = mat.m[3];
    out.m[2] = mat.m[6];
    out.m[3] = mat.m[1];
    out.m[4] = mat.m[4];
    out.m[5] = mat.m[7];
    out.m[6] = mat.m[2];
    out.m[7] = mat.m[5];
    out.m[8] = mat.m[8];
}

void Mat3::inverse()
{
    float a00 = m[0], a01 = m[1], a02 = m[2];
    float a10 = m[3], a11 = m[4], a12 = m[5];
    float a20 = m[6], a21 = m[7], a22 = m[8];
    
    float b01 = a22 * a11 - a12 * a21;
    float b11 = -a22 * a10 + a12 * a20;
    float b21 = a21 * a10 - a11 * a20;
    
    // Calculate the determinant
    float det = a00 * b01 + a01 * b11 + a02 * b21;
    
    det = 1.0 / det;
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

void Mat3::adjoint(Mat3 &out, const Mat3 &mat)
{
    float a00 = mat.m[0], a01 = mat.m[1], a02 = mat.m[2];
    float a10 = mat.m[3], a11 = mat.m[4], a12 = mat.m[5];
    float a20 = mat.m[6], a21 = mat.m[7], a22 = mat.m[8];
    
    out.m[0] = (a11 * a22 - a12 * a21);
    out.m[1] = (a02 * a21 - a01 * a22);
    out.m[2] = (a01 * a12 - a02 * a11);
    out.m[3] = (a12 * a20 - a10 * a22);
    out.m[4] = (a00 * a22 - a02 * a20);
    out.m[5] = (a02 * a10 - a00 * a12);
    out.m[6] = (a10 * a21 - a11 * a20);
    out.m[7] = (a01 * a20 - a00 * a21);
    out.m[8] = (a00 * a11 - a01 * a10);
}

float Mat3::determinant()
{
    return m[0] * (m[8] * m[4] - m[5] * m[7]) + m[1] * (-m[8] * m[3] + m[5] * m[6]) + m[2] * (m[7] * m[3] - m[4] * m[6]);
}

void Mat3::multiply(Mat3 &out, const Mat3 &a, const Mat3 &b)
{
    float a00 = a.m[0], a01 = a.m[1], a02 = a.m[2];
    float a10 = a.m[3], a11 = a.m[4], a12 = a.m[5];
    float a20 = a.m[6], a21 = a.m[7], a22 = a.m[8];
    
    float b00 = b.m[0], b01 = b.m[1], b02 = b.m[2];
    float b10 = b.m[3], b11 = b.m[4], b12 = b.m[5];
    float b20 = b.m[6], b21 = b.m[7], b22 = b.m[8];
    
    out.m[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out.m[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out.m[2] = b00 * a02 + b01 * a12 + b02 * a22;
    
    out.m[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out.m[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out.m[5] = b10 * a02 + b11 * a12 + b12 * a22;
    
    out.m[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out.m[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out.m[8] = b20 * a02 + b21 * a12 + b22 * a22;
}

void Mat3::translate(Mat3 &out, const Mat3 &mat, const Vec2 &vec)
{
    float a00 = mat.m[0], a01 = mat.m[1], a02 = mat.m[2];
    float a10 = mat.m[3], a11 = mat.m[4], a12 = mat.m[5];
    float a20 = mat.m[6], a21 = mat.m[7], a22 = mat.m[8];
    float x = vec.x, y = vec.y;
    
    out.m[0] = a00;
    out.m[1] = a01;
    out.m[2] = a02;
    
    out.m[3] = a10;
    out.m[4] = a11;
    out.m[5] = a12;
    
    out.m[6] = x * a00 + y * a10 + a20;
    out.m[7] = x * a01 + y * a11 + a21;
    out.m[8] = x * a02 + y * a12 + a22;
}

void Mat3::rotate(Mat3 &out, const Mat3 &mat, float rad)
{
    float a00 = mat.m[0], a01 = mat.m[1], a02 = mat.m[2];
    float a10 = mat.m[3], a11 = mat.m[4], a12 = mat.m[5];
    float a20 = mat.m[6], a21 = mat.m[7], a22 = mat.m[8];
    
    float s = sin(rad);
    float c = cos(rad);
    
    out.m[0] = c * a00 + s * a10;
    out.m[1] = c * a01 + s * a11;
    out.m[2] = c * a02 + s * a12;
    
    out.m[3] = c * a10 - s * a00;
    out.m[4] = c * a11 - s * a01;
    out.m[5] = c * a12 - s * a02;
    
    out.m[6] = a20;
    out.m[7] = a21;
    out.m[8] = a22;
}

void Mat3::scale(Mat3 &out, const Mat3 &mat, const Vec2 &vec)
{
    float x = vec.x, y = vec.y;
    
    out.m[0] = x * mat.m[0];
    out.m[1] = x * mat.m[1];
    out.m[2] = x * mat.m[2];
    
    out.m[3] = y * mat.m[3];
    out.m[4] = y * mat.m[4];
    out.m[5] = y * mat.m[5];
    
    out.m[6] = mat.m[6];
    out.m[7] = mat.m[7];
    out.m[8] = mat.m[8];
}

void Mat3::fromMat4(Mat3 &out, const Mat4 &mat)
{
    out.m[0] = mat.m[0];
    out.m[1] = mat.m[1];
    out.m[2] = mat.m[2];
    out.m[3] = mat.m[4];
    out.m[4] = mat.m[5];
    out.m[5] = mat.m[6];
    out.m[6] = mat.m[8];
    out.m[7] = mat.m[9];
    out.m[8] = mat.m[10];
}

void Mat3::fromTranslation(Mat3 &out, const Vec2 &vec)
{
    out.m[0] = 1;
    out.m[1] = 0;
    out.m[2] = 0;
    out.m[3] = 0;
    out.m[4] = 1;
    out.m[5] = 0;
    out.m[6] = vec.x;
    out.m[7] = vec.y;
    out.m[8] = 1;
}

void Mat3::fromRotation(Mat3 &out, float rad)
{
    float s = sin(rad);
    float c = cos(rad);

    out.m[0] = c;
    out.m[1] = s;
    out.m[2] = 0;
    
    out.m[3] = -s;
    out.m[4] = c;
    out.m[5] = 0;
    
    out.m[6] = 0;
    out.m[7] = 0;
    out.m[8] = 1;
}

void Mat3::fromScaling(Mat3 &out, const Vec2 &vec)
{
    out.m[0] = vec.x;
    out.m[1] = 0;
    out.m[2] = 0;
    
    out.m[3] = 0;
    out.m[4] = vec.y;
    out.m[5] = 0;
    
    out.m[6] = 0;
    out.m[7] = 0;
    out.m[8] = 1;
}

void Mat3::fromQuat(Mat3 &out, const Quaternion &quat)
{
    float x = quat.x, y = quat.y, z = quat.z, w = quat.w;
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
    
    out.m[0] = 1 - yy - zz;
    out.m[3] = yx - wz;
    out.m[6] = zx + wy;
    
    out.m[1] = yx + wz;
    out.m[4] = 1 - xx - zz;
    out.m[7] = zy - wx;
    
    out.m[2] = zx - wy;
    out.m[5] = zy + wx;
    out.m[8] = 1 - xx - yy;
}

void Mat3::add(Mat3 &out, const Mat3 &a, const Mat3 &b)
{
    out.m[0] = a.m[0] + b.m[0];
    out.m[1] = a.m[1] + b.m[1];
    out.m[2] = a.m[2] + b.m[2];
    out.m[3] = a.m[3] + b.m[3];
    out.m[4] = a.m[4] + b.m[4];
    out.m[5] = a.m[5] + b.m[5];
    out.m[6] = a.m[6] + b.m[6];
    out.m[7] = a.m[7] + b.m[7];
    out.m[8] = a.m[8] + b.m[8];
}

void Mat3::subtract(Mat3 &out, const Mat3 &a, const Mat3 &b)
{
    out.m[0] = a.m[0] - b.m[0];
    out.m[1] = a.m[1] - b.m[1];
    out.m[2] = a.m[2] - b.m[2];
    out.m[3] = a.m[3] - b.m[3];
    out.m[4] = a.m[4] - b.m[4];
    out.m[5] = a.m[5] - b.m[5];
    out.m[6] = a.m[6] - b.m[6];
    out.m[7] = a.m[7] - b.m[7];
    out.m[8] = a.m[8] - b.m[8];
}

const Mat3 Mat3::IDENTITY = Mat3(
                                 1.0f, 0.0f, 0.0f,
                                 0.0f, 1.0f, 0.0f,
                                 0.0f, 0.0f, 1.0f);

const Mat3 Mat3::ZERO = Mat3(
                             0, 0, 0,
                             0, 0, 0,
                             0, 0, 0);

NS_CC_MATH_END

