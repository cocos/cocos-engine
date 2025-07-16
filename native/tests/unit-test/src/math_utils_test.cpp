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
#include <stdlib.h>
#include <vector>
#include "cocos/math/Math.h"
#include "cocos/math/MathUtil.h"
#include "cocos/math/Utils.h"
#include "cocos/math/Vec2.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathUtilsTest, test9) {
    // smooth
    logLabel = "test the MathUtil smooth function";
    float startP = 3;
    cc::MathUtil::smooth(&startP, 10, 0.3, 0.7);
    ExpectEq(IsEqualF(startP, 5.1), true);
    cc::MathUtil::smooth(&startP, 10, 0.6, 0.4, 0.9);
    ExpectEq(IsEqualF(startP, 8.039999), true);
    // lerp
    logLabel = "test the MathUtil lerp function";
    float res = cc::MathUtil::lerp(2, 15, 0.8);
    ExpectEq(IsEqualF(res, 12.3999996), true);

    // equals
    logLabel = "test the MathUtil equals function";
    bool res1 = cc::mathutils::equals(2.0F, 2.0000001F);
    ExpectEq(res1, true);
    // approx
    logLabel = "test the MathUtil approx function";
    bool res2 = cc::mathutils::approx(2.0F, 2.0000001F);
    ExpectEq(res2, true);
    bool res3 = cc::mathutils::approx(2.0F, 2.0000001F, 0.000001F);
    ExpectEq(res3, true);
    // clamp
    logLabel = "test the MathUtil clamp function";
    float res4 = cc::mathutils::clamp(2.0F, 1.0F, 3.0F);
    ExpectEq(IsEqualF(res4, 2.0F), true);
    float res5 = cc::mathutils::clamp01(2.0F);
    ExpectEq(IsEqualF(res5, 1.0F), true);
    // lerp
    logLabel = "test the MathUtil lerp function";
    float res6 = cc::mathutils::lerp(2.0F, 3.0F, 0.5F);
    ExpectEq(IsEqualF(res6, 2.5F), true);
    // toRadian
    logLabel = "test the MathUtil toRadian function";
    float res7 = cc::mathutils::toRadian(180.0F);
    ExpectEq(cc::mathutils::equals(res7, 3.14159274F), true);
    // toDegree
    logLabel = "test the MathUtil toDegree function";
    float res8 = cc::mathutils::toDegree(3.14159274F);
    ExpectEq(cc::mathutils::equals(res8, 180.0F), true);
    // nextPow2
    logLabel = "test the MathUtil nextPow2 function";
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(0), 0), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(1), 1), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(2), 2), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(3), 4), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(4), 4), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(5), 8), true);
    ExpectEq(IsEqualF(cc::mathutils::nextPow2(31), 32), true);
    // repeat
    logLabel = "test the MathUtil repeat function";
    ExpectEq(IsEqualF(cc::mathutils::repeat(0.0F, 1.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::repeat(1.0F, 1.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::repeat(2.0F, 1.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::repeat(3.0F, 1.0F), 0.0F), true);
    // pingPong
    logLabel = "test the MathUtil pingPong function";
    ExpectEq(IsEqualF(cc::mathutils::pingPong(0.0F, 1.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::pingPong(1.0F, 1.0F), 1.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::pingPong(2.0F, 1.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::pingPong(0.5F, 1.0F), 0.5F), true);
    ExpectEq(IsEqualF(cc::mathutils::pingPong(.5F, .5F), 0.5F), true);
    // inverseLerp
    logLabel = "test the MathUtil inverseLerp function";
    ExpectEq(IsEqualF(cc::mathutils::inverseLerp(0.0F, 1.0F, 0.0F), 0.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::inverseLerp(0.0F, 1.0F, 1.0F), 1.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::inverseLerp(0.0F, 1.0F, 0.5F), 0.5F), true);
    // absMaxComponent
    logLabel = "test the MathUtil absMaxComponent function";
    ExpectEq(IsEqualF(cc::mathutils::absMaxComponent(cc::Vec3(1, 2, 3)), 3), true);
    ExpectEq(IsEqualF(cc::mathutils::absMaxComponent(cc::Vec3(1, 2, -3)), -3), true);
    ExpectEq(IsEqualF(cc::mathutils::absMaxComponent(cc::Vec3(1, -2, 3)), 3), true);
    // absMax
    logLabel = "test the MathUtil absMax function";
    ExpectEq(IsEqualF(cc::mathutils::absMax(1.0F, 3.0F), 3.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::absMax(-1.0F, 3.0F), 3.0F), true);
    ExpectEq(IsEqualF(cc::mathutils::absMax(1.0F, -3.0F), -3.0F), true);
}