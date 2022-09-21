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
#include "cocos/math/Vec2.h"
#include "cocos/math/Math.h"
#include "cocos/math/MathUtil.h"
#include "utils.h"
#include <math.h>
#include <vector>

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
}