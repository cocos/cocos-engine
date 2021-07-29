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
#include "cocos/math/Vertex.h"
#include "utils.h"
#include <math.h>
#include <vector>

TEST(mathVertexTest, test8) {
    // ccVertexLineToPolygon
    logLabel = "test the vertex ccVertexLineToPolygon function";
    cc::Vec2 points[4];
    cc::Vec2 p1(1, 1);
    points[0] = p1;
    cc::Vec2 p2(10, 10);
    points[1] = p2;
    cc::Vec2 p3(0, -10);
    points[2] = p3;
    cc::Vec2 p4(20, 70);
    points[3] = p4;
    cc::Vec2 outP[6];
    cc::ccVertexLineToPolygon(points, 1, outP, 0, 5);
    ExpectEq(IsEqualF(outP[5].x, -0.468942523) && IsEqualF(outP[5].y, -9.82652664), true);
    // ccVertexLineIntersect
    logLabel = "test the vertex ccVertexLineIntersect function";
    float res;
    bool isFind = cc::ccVertexLineIntersect(5, 5, 1, 10, 12, 20, 12, 40, &res);
    ExpectEq(isFind, true);
    
}

