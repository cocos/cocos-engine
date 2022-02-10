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
#include "gtest/gtest.h"
#include "cocos/math/Vec4.h"
#include "utils.h"
#include <math.h>

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
    // fromColor
    logLabel = "test whether vec3 fromColor function";
    vec4 = cc::Vec4::fromColor(255);
    ExpectEq(vec4.w == 1, true);
}

