/**
 Copyright 2013 BlackBerry Inc.

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

#include "math/Mat4.h"

NS_CC_MATH_BEGIN

inline const Mat4 Mat4::operator+(const Mat4& mat) const
{
    Mat4 result(*this);
    result.add(mat);
    return result;
}

inline Mat4& Mat4::operator+=(const Mat4& mat)
{
    add(mat);
    return *this;
}

inline const Mat4 Mat4::operator-(const Mat4& mat) const
{
    Mat4 result(*this);
    result.subtract(mat);
    return result;
}

inline Mat4& Mat4::operator-=(const Mat4& mat)
{
    subtract(mat);
    return *this;
}

inline const Mat4 Mat4::operator-() const
{
    Mat4 mat(*this);
    mat.negate();
    return mat;
}

inline const Mat4 Mat4::operator*(const Mat4& mat) const
{
    Mat4 result(*this);
    result.multiply(mat);
    return result;
}

inline Mat4& Mat4::operator*=(const Mat4& mat)
{
    multiply(mat);
    return *this;
}

inline Vec4& operator*=(Vec4& v, const Mat4& m)
{
    m.transformVector(&v);
    return v;
}

inline const Vec4 operator*(const Mat4& m, const Vec4& v)
{
    Vec4 x;
    m.transformVector(v, &x);
    return x;
}

inline bool Mat4::operator==(const Mat4& rhs) const {
    return math::isEqualF(m[0], rhs.m[0])
        && math::isEqualF(m[1], rhs.m[1])
        && math::isEqualF(m[2], rhs.m[2])
        && math::isEqualF(m[3], rhs.m[3])
        && math::isEqualF(m[4], rhs.m[4])
        && math::isEqualF(m[5], rhs.m[5])
        && math::isEqualF(m[6], rhs.m[6])
        && math::isEqualF(m[7], rhs.m[7])
        && math::isEqualF(m[8], rhs.m[8])
        && math::isEqualF(m[9], rhs.m[9])
        && math::isEqualF(m[10], rhs.m[10])
        && math::isEqualF(m[11], rhs.m[11])
        && math::isEqualF(m[12], rhs.m[12])
        && math::isEqualF(m[13], rhs.m[13])
        && math::isEqualF(m[14], rhs.m[14])
        && math::isEqualF(m[15], rhs.m[15]);
}

NS_CC_MATH_END
