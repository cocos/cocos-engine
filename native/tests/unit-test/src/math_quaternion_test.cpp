/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
#include <math.h>
#include "cocos/math/Mat3.h"
#include "cocos/math/Mat4.h"
#include "cocos/math/Math.h"
#include "cocos/math/Quaternion.h"
#include "cocos/math/Vec3.h"
#include "cocos/math/Vec4.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathQuaternionTest, test6) {
    // identity
    logLabel = "test the quaternion identity function";
    cc::Quaternion quat(1, 2, 1, 1);
    quat = cc::Quaternion::identity();
    ExpectEq(quat.x == 0 && quat.y == 0 && quat.z == 0 && quat.w == 1, true);
    // isIdentity
    logLabel = "test the quaternion isIdentity function";
    quat.set(5, 10, 10, 2);
    quat.setIdentity();
    ExpectEq(quat.isIdentity(), true);
    // zero
    logLabel = "test the quaternion zero function";
    cc::Quaternion zero(1, 2, 1, 1);
    zero = cc::Quaternion::zero();
    ExpectEq(zero.x == 0 && zero.y == 0 && zero.z == 0 && zero.w == 0, true);
    // isZero
    logLabel = "test the quaternion isZero function";
    ExpectEq(zero.isZero(), true);
    // createFromRotationMatrix
    logLabel = "test the quaternion createFromRotationMatrix function";
    cc::Mat4 rotMat;
    rotMat.m[0] = cos(cc::math::PI_DIV2);
    rotMat.m[2] = sin(cc::math::PI_DIV2);
    rotMat.m[8] = -sin(cc::math::PI_DIV2);
    rotMat.m[10] = cos(cc::math::PI_DIV2);
    cc::Quaternion::createFromRotationMatrix(rotMat, &quat);
    ExpectEq(IsEqualF(-0.707106, quat.y), true);
    // createFromAxisAngle
    logLabel = "test the quaternion createFromAxisAngle function";
    cc::Vec3 axis(0, 1, 0);
    cc::Quaternion::createFromAxisAngle(axis, cc::math::PI_DIV2, &quat);
    ExpectEq(IsEqualF(0.707106, quat.y), true);
    // conjugate
    logLabel = "test the quaternion conjugate function";
    quat.set(1, 2, 1, 1);
    quat.conjugate();
    ExpectEq(quat.x == -1 && quat.y == -2 && quat.z == -1, true);
    quat = quat.getConjugated();
    ExpectEq(quat.x == 1 && quat.y == 2 && quat.z == 1, true);
    // inverse
    logLabel = "test the quaternion inverse function";
    quat.inverse();
    ExpectEq(IsEqualF(-0.142857149, quat.x) && IsEqualF(-0.142857149, quat.z), true);
    quat = quat.getInversed();
    ExpectEq(IsEqualF(1, quat.x) && IsEqualF(1, quat.z), true);
    // multiply
    logLabel = "test the quaternion multiply function";
    cc::Quaternion mul(3, 2, 0, 1);
    quat.multiply(mul);
    ExpectEq(IsEqualF(2, quat.x) && IsEqualF(-3, quat.z), true);
    // normalize
    logLabel = "test the quaternion normalize function";
    quat.normalize();
    ExpectEq(IsEqualF(0.20203051, quat.x) && IsEqualF(-0.30304575, quat.z), true);
    quat = quat.getNormalized();
    ExpectEq(IsEqualF(0.20203051, quat.x) && IsEqualF(-0.30304575, quat.z), true);
    // toAxisAngle
    logLabel = "test the quaternion toAxisAngle function";
    cc::Vec3 e;
    quat.toAxisAngle(&e);
    ExpectEq(IsEqualF(0.254000247, e.x) && IsEqualF(-0.38100034, e.z), true);
    // lerp
    logLabel = "test the quaternion lerp function";
    cc::Quaternion q1(5, 2, 1, 1);
    cc::Quaternion q2(10, 0, 0, 1);
    cc::Quaternion::lerp(q1, q2, 0.5, &quat);
    ExpectEq(IsEqualF(7.5, quat.x) && IsEqualF(0.5, quat.z), true);
    // slerp
    logLabel = "test the quaternion slerp function";
    q1.setIdentity();
    q2.set(sin(M_PI / 4), 0, 0, cos(M_PI / 4));
    cc::Quaternion::slerp(q1, q2, 0.5f, &quat);
    ExpectEq(quat.approxEquals(cc::Quaternion(sin(M_PI / 8), 0, 0, cos(M_PI / 8))), true);
    logLabel = "test the quaternion approx equal function";
    cc::Quaternion a{0.123456F, 1.234567F, 2.345678F, 3.345679F};
    cc::Quaternion b{0.123455F, 1.234568F, 2.345679F, 3.345678F};
    ExpectEq(a.approxEquals(b), true);
    // fromEuler
    logLabel = "test the quaternion fromEuler function";
    cc::Quaternion::fromEuler(0, 0, 60, &q1);
    ExpectEq(q1.approxEquals(cc::Quaternion(0, 0, sin(M_PI / 6), cos(M_PI / 6))), true);
    // toEuler
    logLabel = "test the quaternion toEuler function";
    cc::Vec3 v;
    cc::Quaternion::toEuler(q1, false, &v);
    ExpectEq(v == cc::Vec3(0, 0, 60), true);
    // fromMat3
    logLabel = "test the quaternion fromMat3 function";
    cc::Mat3 m;
    cc::Mat3::fromRotation(M_PI / 3, &m);
    cc::Quaternion::fromMat3(m, &q1);
    ExpectEq(q1.approxEquals(cc::Quaternion(0, 0, sin(M_PI / 6), cos(M_PI / 6))), true);
    // createFromAngleZ
    logLabel = "test the quaternion createFromAngleZ function";
    cc::Quaternion::createFromAngleZ(60, &q1);
    ExpectEq(q1.approxEquals(cc::Quaternion(0, 0, sin(M_PI / 6), cos(M_PI / 6))), true);
    // rotateTowards
    cc::Quaternion qfrom(std::sin(M_PI / 8), 0, 0, std::cos(M_PI / 8));
    cc::Quaternion qto(std::sin(M_PI / 3), 0, 0, std::cos(M_PI / 3));
    cc::Quaternion::rotateTowards(qfrom, qto, 180.0F / 8, &q1);
    ExpectEq(q1.approxEquals(cc::Quaternion(std::sin(M_PI * 3 / 16), 0, 0, std::cos(M_PI * 3 / 16))), true);
}
