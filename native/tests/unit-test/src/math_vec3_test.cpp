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
#include "cocos/math/Quaternion.h"
#include "cocos/math/Vec3.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathVec3Test, test2) {
    cc::Vec3 vec3(1, 2, 3);
    // isZero
    logLabel = "test whether vec3 is 0";
    ExpectEq(vec3.isZero(), false);
    vec3.set(0, 0, 0);
    ExpectEq(vec3.isZero(), true);
    vec3.set(1, 1, 1);
    vec3.setZero();
    ExpectEq(vec3.isZero(), true);
    // isOne
    logLabel = "test whether vec3 is 1";
    ExpectEq(vec3.isOne(), false);
    vec3.set(1, 1, 1);
    ExpectEq(vec3.isOne(), true);
    vec3.set(1.1f, 1.0f, 1.0f);
    ExpectEq(vec3.isOne(), false);
    // angle
    logLabel = "test the vec3 angle function";
    ExpectEq(IsEqualF(vec3.angle(cc::Vec3(2, 0, 0), cc::Vec3(-2, 0, 0)), M_PI), true);
    ExpectEq(IsEqualF(vec3.angle(cc::Vec3(2, 0, 0), cc::Vec3(0, 2, 0)), M_PI * 0.5f), true);
    ExpectEq(IsEqualF(vec3.angle(cc::Vec3(2, 0, 0), cc::Vec3(0, -2, 0)), M_PI * 0.5f), true);
    // transformInverseRTS
    logLabel = "test the vec3 transformInverseRTS function";
    cc::Vec3::transformInverseRTS(cc::Vec3(-2, 4, 7), cc::Quaternion(0, 0, sin(M_PI / 4), cos(M_PI / 4)), cc::Vec3(1, 2, 3), cc::Vec3(2, 3, 4), &vec3);
    ExpectEq(vec3.approxEquals(cc::Vec3(1, 1, 1)), true);
    // add
    logLabel = "test the vec3 add function";
    vec3.set(3.9, 1.3, 0);
    vec3.add(cc::Vec3(2.1f, 1.7f, 0));
    ExpectEq(vec3 == cc::Vec3(6, 3, 0), true);
    cc::Vec3::add(cc::Vec3(6, 3, 0), cc::Vec3(2, 1, 0), &vec3);
    ExpectEq(vec3 == cc::Vec3(8, 4, 0), true);
    // clamp
    logLabel = "test the vec3 clamp function";
    vec3.clamp(cc::Vec3(3, 1, 0), cc::Vec3(6, 2, 0));
    ExpectEq(vec3 == cc::Vec3(6, 2, 0), true);
    cc::Vec3::clamp(cc::Vec3(6, 2, 0), cc::Vec3(7, 1, 0), cc::Vec3(11, 3, 0), &vec3);
    ExpectEq(vec3 == cc::Vec3(7, 2, 0), true);
    // cross
    logLabel = "test the vec3 cross function";
    vec3.set(1, 2, 3);
    vec3.cross(cc::Vec3(3, 2, 1));
    ExpectEq(vec3 == cc::Vec3(-4, 8, -4), true);
    vec3.set(0, 0, 0);
    cc::Vec3::cross(cc::Vec3(1, 2, 3), cc::Vec3(3, 2, 1), &vec3);
    ExpectEq(vec3 == cc::Vec3(-4, 8, -4), true);
    // multiply
    logLabel = "test the vec3 multiply function";
    vec3.set(1, 3, 2);
    vec3.multiply(cc::Vec3(4, 7, 9));
    ExpectEq(vec3 == cc::Vec3(4, 21, 18), true);
    cc::Vec3::multiply(cc::Vec3(1, 3, 2), cc::Vec3(4, 7, 9), &vec3);
    ExpectEq(vec3 == cc::Vec3(4, 21, 18), true);
    // transformMat3
    logLabel = "test the vec3 transformMat3 function";
    cc::Mat3 matScale;
    matScale.m[0] = 2;
    matScale.m[4] = 1;
    matScale.m[8] = 2;
    vec3.transformMat3(cc::Vec3(1, 1, 2), matScale);
    ExpectEq(vec3 == cc::Vec3(2, 1, 4), true);
    // transformMat4
    logLabel = "test the vec3 transformMat4 function";
    cc::Mat4 matTranslate;
    matTranslate.m[12] = 2;
    matTranslate.m[13] = 1;
    matTranslate.m[14] = 2;
    vec3.transformMat4(cc::Vec3(1, 1, 2), matTranslate);
    ExpectEq(vec3 == cc::Vec3(3, 2, 4), true);
    // transformMat4Normal
    logLabel = "test the vec3 transformMat4Normal function";
    cc::Mat4 matTransfromNormal;
    matTransfromNormal.m[0] = 2;
    matTransfromNormal.m[5] = 4;
    matTransfromNormal.m[10] = 8;
    matTransfromNormal.m[12] = 2;
    matTransfromNormal.m[13] = 1;
    matTransfromNormal.m[14] = 2;
    cc::Vec3::transformMat4Normal(cc::Vec3(1, 1, 2), matTransfromNormal, &vec3);
    ExpectEq(vec3 == cc::Vec3(2, 4, 16), true);
    // transformQuat
    logLabel = "test the vec3 transformQuat function";
    vec3.set(3, 2, 4);
    cc::Quaternion quaternion(sin(M_PI / 4), 0, 0, cos(M_PI / 4));
    vec3.transformQuat(quaternion);
    ExpectEq(vec3.approxEquals(cc::Vec3(3, -4, 2)), true);
    // distance
    logLabel = "test the vec3 distance function";
    vec3.set(7, 2, 0);
    cc::Vec3 distVec(10, 2, 0);
    float dist = vec3.distance(distVec);
    ExpectEq(IsEqualF(dist, 3), true);
    dist = vec3.distanceSquared(distVec);
    ExpectEq(IsEqualF(dist, 9), true);
    // dot
    logLabel = "test the vec3 dot function";
    cc::Vec3 dotVec3(2, 3, 0);
    float dotRes = vec3.dot(dotVec3);
    ExpectEq(IsEqualF(dotRes, 20), true);
    dotRes = cc::Vec3::dot(vec3, dotVec3);
    ExpectEq(IsEqualF(dotRes, 20), true);
    // length
    logLabel = "test the vec3 length function";
    vec3.set(8, 6, 0);
    ExpectEq(IsEqualF(vec3.length(), 10), true);
    // normalize
    logLabel = "test whether vec3 is normalized";
    vec3.normalize();
    ExpectEq(IsEqualF(vec3.length(), 1.0f), true);
    vec3.set(1, 0, 0);
    ExpectEq(IsEqualF(vec3.length(), 1.0f), true);
    vec3.set(0.345, 123.34, 0);
    vec3.normalize();
    ExpectEq(IsEqualF(vec3.length(), 1.0f), true);
    vec3.set(10.345, 12.675, 20.231);
    vec3 = vec3.getNormalized();
    ExpectEq(IsEqualF(vec3.length(), 1.0f), true);
    // subtract
    logLabel = "test whether vec3 subtract function";
    vec3.set(4, 5, 0);
    vec3.subtract(cc::Vec3(1, 2, 0));
    ExpectEq(vec3 == cc::Vec3(3, 3, 0), true);
    cc::Vec3::subtract(cc::Vec3(4, 5, 0), cc::Vec3(1, 2, 0), &vec3);
    ExpectEq(vec3 == cc::Vec3(3, 3, 0), true);
    // max
    logLabel = "test whether vec3 max function";
    cc::Vec3::max(cc::Vec3(10, 1, 5), cc::Vec3(11, 3, 2), &vec3);
    ExpectEq(vec3 == cc::Vec3(11, 3, 5), true);
    // min
    logLabel = "test whether vec3 min function";
    cc::Vec3::min(cc::Vec3(10, 1, 5), cc::Vec3(11, 3, 2), &vec3);
    ExpectEq(vec3 == cc::Vec3(10, 1, 2), true);
    // smooth
    logLabel = "test whether vec3 smooth function";
    vec3.set(2, 0, 0);
    vec3.smooth(cc::Vec3(-1, 0, 0), 0.5, 0.5);
    ExpectEq(vec3 == cc::Vec3(0.5, 0, 0), true);
    // fromColor
    logLabel = "test whether vec3 fromColor function";
    vec3 = cc::Vec3::fromColor(255);
    ExpectEq(vec3.z == 1, true);
    logLabel = "test the Vec3 approx equal function";
    cc::Vec3 a{0.123456F, 1.234567F, 2.345678F};
    cc::Vec3 b{0.123455F, 1.234568F, 2.345679F};
    ExpectEq(a.approxEquals(b), true);
    //moveTowards
    cc::Vec3 from(1, 1, 0);
    cc::Vec3 to(5, 1, 0);
    cc::Vec3::moveTowards(from, to, 2, &vec3);
    ExpectEq(vec3 == cc::Vec3(3, 1, 0), true);
}
