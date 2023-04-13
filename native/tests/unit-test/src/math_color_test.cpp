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
#include <vector>
#include "cocos/math/Color.h"
#include "cocos/math/Math.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathColorTest, test) {
    logLabel = "test the Color set function";
    cc::Color color;
    uint32_t val = 0x12345678;
    color.set(val);
    EXPECT_EQ(color.a, 0x12);
    EXPECT_EQ(color.b, 0x34);
    EXPECT_EQ(color.g, 0x56);
    EXPECT_EQ(color.r, 0x78);

    logLabel = "test the color to Vec4 function";
    color.set(0xff, 0xff, 0x00, 0xff);
    cc::Vec4 vec4 = color.toVec4();
    EXPECT_EQ(vec4.x, 1.0F);
    EXPECT_EQ(vec4.y, 1.0F);
    EXPECT_EQ(vec4.z, 0.0F);
    EXPECT_EQ(vec4.w, 1.0F);
}