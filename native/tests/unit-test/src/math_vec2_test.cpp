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
#include "cocos/math/Vec2.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathVec2Test, test1) {
    cc::Vec2 vec2(1, 2);

    EXPECT_EQ(vec2.isZero(), false);
    // isZero
    logLabel = "test whether vec2 is 0";
    ExpectEq(vec2.isZero(), false);
    vec2.set(0, 0);
    ExpectEq(vec2.isZero(), true);
    vec2.set(1, 1);
    vec2.setZero();
    ExpectEq(vec2.isZero(), true);
    // isOne
    logLabel = "test whether vec2 is 1";
    ExpectEq(vec2.isOne(), false);
    vec2.set(1, 1);
    ExpectEq(vec2.isOne(), true);
    vec2.set(1.1f, 1.0f);
    ExpectEq(vec2.isOne(), false);
    // angle
    logLabel = "test the vec2 angle function";
    ExpectEq(IsEqualF(vec2.angle(cc::Vec2(2, 0), cc::Vec2(-2, 0)), M_PI), true);
    ExpectEq(IsEqualF(vec2.angle(cc::Vec2(2, 0), cc::Vec2(0, 2)), M_PI * 0.5f), true);
    ExpectEq(IsEqualF(vec2.angle(cc::Vec2(2, 0), cc::Vec2(0, -2)), M_PI * 0.5f), true);
    vec2.set(2, 0);
    ExpectEq(IsEqualF(vec2.getAngle(), 0), true);
    ExpectEq(IsEqualF(vec2.getAngle(cc::Vec2(0, 2)), M_PI * 0.5f), true);
    cc::Vec2 rtVec = vec2.rotateByAngle(cc::Vec2(0, 0), M_PI * 0.5);
    ExpectEq(IsEqualF(rtVec.x, 0) && IsEqualF(rtVec.y, 2), true);
    // add
    logLabel = "test the vec2 add function";
    vec2.set(3.9, 1.3);
    vec2.add(cc::Vec2(2.1f, 1.7f));
    ExpectEq(vec2 == cc::Vec2(6, 3), true);
    cc::Vec2::add(cc::Vec2(6, 3), cc::Vec2(2, 1), &vec2);
    ExpectEq(vec2 == cc::Vec2(8, 4), true);
    // clamp
    logLabel = "test the vec2 clamp function";
    vec2.clamp(cc::Vec2(3, 1), cc::Vec2(6, 2));
    ExpectEq(vec2 == cc::Vec2(6, 2), true);
    cc::Vec2::clamp(cc::Vec2(6, 2), cc::Vec2(7, 1), cc::Vec2(11, 3), &vec2);
    ExpectEq(vec2 == cc::Vec2(7, 2), true);
    // distance
    logLabel = "test the vec2 distance function";
    cc::Vec2 distVec(10, 2);
    float dist = vec2.distance(distVec);
    ExpectEq(IsEqualF(dist, 3), true);
    dist = vec2.getDistance(distVec);
    ExpectEq(IsEqualF(dist, 3), true);
    dist = vec2.distanceSquared(distVec);
    ExpectEq(IsEqualF(dist, 9), true);
    dist = vec2.getDistanceSq(distVec);
    ExpectEq(IsEqualF(dist, 9), true);
    // dot
    logLabel = "test the vec2 dot function";
    cc::Vec2 dotVec2(2, 3);
    float dotRes = vec2.dot(dotVec2);
    ExpectEq(IsEqualF(dotRes, 20), true);
    dotRes = cc::Vec2::dot(vec2, dotVec2);
    ExpectEq(IsEqualF(dotRes, 20), true);
    // length
    logLabel = "test the vec2 length function";
    vec2.set(8, 6);
    ExpectEq(IsEqualF(vec2.length(), 10), true);
    // normalize
    logLabel = "test whether vec2 is normalized";
    vec2.normalize();
    ExpectEq(IsEqualF(vec2.length(), 1.0f), true);
    vec2.set(1, 0);
    ExpectEq(IsEqualF(vec2.length(), 1.0f), true);
    vec2.set(0.345, 123.34);
    vec2.normalize();
    ExpectEq(IsEqualF(vec2.length(), 1.0f), true);
    // rotate
    logLabel = "test whether vec2 rotate function";
    vec2.set(3, 0);
    vec2.rotate(cc::Vec2(0, 0), M_PI * 0.5f);
    ExpectEq(IsEqualF(vec2.x, 0) && IsEqualF(vec2.y, 3), true);
    // subtract
    logLabel = "test whether vec2 subtract function";
    vec2.set(4, 5);
    vec2.subtract(cc::Vec2(1, 2));
    ExpectEq(vec2 == cc::Vec2(3, 3), true);
    cc::Vec2::subtract(cc::Vec2(4, 5), cc::Vec2(1, 2), &vec2);
    ExpectEq(vec2 == cc::Vec2(3, 3), true);
    // equals
    logLabel = "test whether vec2 equals function";
    vec2.set(4, 5);
    ExpectEq(vec2.equals(cc::Vec2(4, 5)), true);
    ExpectEq(vec2.fuzzyEquals(cc::Vec2(3.2, 4.3), 1), true);
    // isLineIntersect
    logLabel = "test whether vec2 isLineIntersect function";
    ExpectEq(cc::Vec2::isLineIntersect(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(0, 0), cc::Vec2(1, -1)), true);
    // isSegmentIntersect
    logLabel = "test whether vec2 isSegmentIntersect function";
    ExpectEq(cc::Vec2::isSegmentIntersect(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(0, 1), cc::Vec2(1, -1)), true);
    // isLineParallel
    logLabel = "test whether vec2 isLineParallel function";
    ExpectEq(cc::Vec2::isLineParallel(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(0, -1), cc::Vec2(2, -1)), true);
    // isLineOverlap
    logLabel = "test whether vec2 isLineOverlap function";
    ExpectEq(cc::Vec2::isLineOverlap(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(-1, 1), cc::Vec2(0, 1)), true);
    // isSegmentOverlap
    logLabel = "test whether vec2 isSegmentOverlap function";
    cc::Vec2 s(0, 0);
    cc::Vec2 t(0, 0);
    ExpectEq(cc::Vec2::isSegmentOverlap(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(-1, 1), cc::Vec2(0, 1), &s, &t), true);
    // getIntersectPoint
    logLabel = "test whether vec2 getIntersectPoint function";
    ExpectEq(cc::Vec2::getIntersectPoint(cc::Vec2(0, 1), cc::Vec2(3, 1), cc::Vec2(0, 1), cc::Vec2(1, -1)) == cc::Vec2(0, 1), true);
    // approxEqual
    logLabel = "test the Vec2 approx equal function";
    cc::Vec2 a{0.123456F, 1.234567F};
    cc::Vec2 b{0.123455F, 1.234568F};
    ExpectEq(a.approxEquals(b), true);
}
