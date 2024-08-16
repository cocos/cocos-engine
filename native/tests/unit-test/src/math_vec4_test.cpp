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
#include "cocos/math/Vec4.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathVec4Test, test3) {
    cc::Vec4 vec4(1, 2, 3, 1);
    // isZero
    logLabel = "test whether vec4 is 0";
    ExpectEq(vec4.isZero(), false);
    vec4.set(0, 0, 0, 0);
    ExpectEq(vec4.isZero(), true);
    vec4.set(1, 2, 1, 1);
    ExpectEq(vec4.isZero(), false);
    // isOne
    logLabel = "test whether vec4 is 1";
    vec4.set(2, 1, 1, 1);
    ExpectEq(vec4.isOne(), false);
    vec4.set(1, 1, 1, 1);
    ExpectEq(vec4.isOne(), true);
    vec4.set(1.1f, 1.0f, 1.0f, 1.0f);
    ExpectEq(vec4.isOne(), false);
    // angle
    logLabel = "test the vec4 angle function";
    ExpectEq(IsEqualF(vec4.angle(cc::Vec4(2, 0, 0, 0), cc::Vec4(-2, 0, 0, 0)), M_PI), true);
    ExpectEq(IsEqualF(vec4.angle(cc::Vec4(2, 0, 0, 0), cc::Vec4(0, 2, 0, 0)), M_PI * 0.5f), true);
    ExpectEq(IsEqualF(vec4.angle(cc::Vec4(2, 0, 0, 0), cc::Vec4(0, -2, 0, 0)), M_PI * 0.5f), true);
    // add
    logLabel = "test the vec4 add function";
    vec4.set(3.9, 1.3, 0, 0);
    vec4.add(cc::Vec4(2.1f, 1.7f, 0, 0));
    ExpectEq(vec4 == cc::Vec4(6, 3, 0, 0), true);
    cc::Vec4::add(cc::Vec4(6, 3, 0, 0), cc::Vec4(2, 1, 0, 1), &vec4);
    ExpectEq(vec4 == cc::Vec4(8, 4, 0, 1), true);
    // clamp
    logLabel = "test the vec4 clamp function";
    vec4.clamp(cc::Vec4(3, 1, 0, 1), cc::Vec4(6, 2, 0, 1));
    ExpectEq(vec4 == cc::Vec4(6, 2, 0, 1), true);
    cc::Vec4::clamp(cc::Vec4(6, 2, 0, 1), cc::Vec4(7, 1, 0, 1), cc::Vec4(11, 3, 0, 1), &vec4);
    ExpectEq(vec4 == cc::Vec4(7, 2, 0, 1), true);
    // distance
    logLabel = "test the vec4 distance function";
    vec4.set(7, 2, 0, 1);
    cc::Vec4 distVec(10, 2, 0, 1);
    float dist = vec4.distance(distVec);
    ExpectEq(IsEqualF(dist, 3), true);
    dist = vec4.distanceSquared(distVec);
    ExpectEq(IsEqualF(dist, 9), true);
    // dot
    logLabel = "test the vec4 dot function";
    vec4.set(3, 5, 0, 0);
    cc::Vec4 dotVec4(2, 3, 0, 0);
    float dotRes = vec4.dot(dotVec4);
    ExpectEq(IsEqualF(dotRes, 21), true);
    dotRes = cc::Vec4::dot(vec4, dotVec4);
    ExpectEq(IsEqualF(dotRes, 21), true);
    // length
    logLabel = "test the vec4 length function";
    vec4.set(8, 6, 0, 0);
    ExpectEq(IsEqualF(vec4.length(), 10), true);
    // negate
    logLabel = "test the vec4 negate function";
    vec4.set(8, 6, 0, 0);
    vec4.negate();
    ExpectEq(vec4.approxEquals(cc::Vec4(-8, -6, 0, 0)), true);
    // inverse
    logLabel = "test the vec4 inverse function";
    vec4.set(8, 6, 1, 1);
    cc::Vec4::inverse(vec4, &vec4);
    ExpectEq(vec4.approxEquals(cc::Vec4(0.125F, 0.16666667F, 1.0F, 1.0F)), true);
    // scale
    logLabel = "test the vec4 scale function";
    vec4.set(8, 6, 0, 0);
    vec4.scale(2);
    ExpectEq(vec4.approxEquals(cc::Vec4(16, 12, 0, 0)), true);
    // normalize
    logLabel = "test whether vec4 is normalized";
    vec4.normalize();
    ExpectEq(IsEqualF(vec4.length(), 1.0f), true);
    vec4.set(1, 0, 0, 1);
    vec4.normalize();
    ExpectEq(IsEqualF(vec4.length(), 1.0f), true);
    vec4.set(0.345, 123.34, 0, 1);
    vec4.normalize();
    ExpectEq(IsEqualF(vec4.length(), 1.0f), true);
    vec4.set(10.345, 12.675, 20.231, 1);
    vec4 = vec4.getNormalized();
    ExpectEq(IsEqualF(vec4.length(), 1.0f), true);
    // subtract
    logLabel = "test whether vec4 subtract function";
    vec4.set(4, 5, 0, 1);
    vec4.subtract(cc::Vec4(1, 2, 0, 1));
    ExpectEq(vec4 == cc::Vec4(3, 3, 0, 0), true);
    cc::Vec4::subtract(cc::Vec4(4, 5, 0, 1), cc::Vec4(1, 2, 0, 1), &vec4);
    ExpectEq(vec4 == cc::Vec4(3, 3, 0, 0), true);
    // lerp
    logLabel = "test whether vec4 lerp function";
    vec4.set(4, 5, 0, 1);
    cc::Vec4::lerp(vec4, cc::Vec4(1, 2, 0, 1), 0.5F, &vec4);
    ExpectEq(vec4 == cc::Vec4(2.5F, 3.5F, 0, 1), true);
    // fromColor
    logLabel = "test whether vec3 fromColor function";
    vec4 = cc::Vec4::fromColor(255);
    ExpectEq(vec4.w == 1, true);
    logLabel = "test the Vec4 approx equal function";
    cc::Vec4 a{0.123456F, 1.234567F, 2.345678F, 3.345679F};
    cc::Vec4 b{0.123455F, 1.234568F, 2.345679F, 3.345678F};
    ExpectEq(a.approxEquals(b), true);
}
