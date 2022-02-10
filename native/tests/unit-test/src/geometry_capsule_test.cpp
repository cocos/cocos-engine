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
#include <cmath>
#include "cocos/core/geometry/Capsule.h"
#include "cocos/math/Mat3.h"
#include "cocos/math/Mat4.h"
#include "cocos/math/Math.h"
#include "cocos/math/Quaternion.h"
#include "cocos/math/Vec3.h"
#include "cocos/math/Vec4.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(geometryCapsuleTest, testTransform) {
    cc::geometry::Capsule capsule{1.0, 2.0};
    cc::geometry::Capsule capsuleNew{};
    cc::Mat4              trans;
    cc::Quaternion        quat{};
    cc::Vec3              scale{1.0F, 2.0F, 3.0F};
    {
        cc::Vec3 axis  = {1.0, 0.0, 0.0};
        float    angle = M_PI;
        cc::Quaternion::createFromAxisAngle(axis, angle, &quat);
        trans.translate(0, 1, 0);
    }
    capsule.transform(trans, {}, quat, scale, &capsuleNew);
    EXPECT_TRUE(capsuleNew.center == cc::Vec3(0.0F, 1.0F, 0.0F));
    EXPECT_FLOAT_EQ(capsule.ellipseCenter0.y, 2.0F);
    EXPECT_FLOAT_EQ(capsule.ellipseCenter1.y, -2.0F);
    EXPECT_FLOAT_EQ(capsuleNew.ellipseCenter0.y, -2.0F);
    EXPECT_FLOAT_EQ(capsuleNew.ellipseCenter1.y, 4.0F);
}
