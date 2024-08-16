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
#include "cocos/math/Geometry.h"
#include "cocos/math/Math.h"
#include "cocos/math/Vec2.h"
#include "gtest/gtest.h"
#include "utils.h"

TEST(mathGeometryTest, test7) {
    // setSize
    logLabel = "test the geometry_size setSize function";
    cc::Size size(100, 80);
    size.setSize(20, 10);
    ExpectEq(size.width == 20 && size.height == 10, true);
    // equals size
    logLabel = "test the geometry_size equals function";
    cc::Size target(20, 10);
    ExpectEq(size.equals(target), true);
    // Rect getMinX
    logLabel = "test the geometry_rect getMinX function";
    cc::Rect rect;
    rect.setRect(0, 0, 100, 70);
    ExpectEq(rect.getMinX() == 0, true);
    // Rect getMidX
    logLabel = "test the geometry_rect getMidX function";
    ExpectEq(rect.getMidX() == 50, true);
    // Rect getMaxX
    logLabel = "test the geometry_rect getMaxX function";
    ExpectEq(rect.getMaxX() == 100, true);
    // Rect getMinY
    logLabel = "test the geometry_rect getMinY function";
    ExpectEq(rect.getMinY() == 0, true);
    // Rect getMidY
    logLabel = "test the geometry_rect getMidY function";
    ExpectEq(rect.getMidY() == 35, true);
    // Rect getMaxY
    logLabel = "test the geometry_rect getMaxY function";
    ExpectEq(rect.getMaxY() == 70, true);
    // Rect equals
    logLabel = "test the geometry_rect equals function";
    cc::Rect equalTarget(0, 0, 100, 70);
    ExpectEq(rect.equals(equalTarget), true);
    // containsPoint
    logLabel = "test the geometry_rect containsPoint function";
    cc::Vec2 point(10, 10);
    ExpectEq(rect.containsPoint(point), true);
    // intersectsRect
    logLabel = "test the geometry_rect intersectsRect function";
    cc::Rect intersectRect(10, 10, 50, 40);
    ExpectEq(rect.intersectsRect(intersectRect), true);
    // intersectsCircle
    logLabel = "test the geometry_rect intersectsCircle function";
    cc::Vec2 intersectsCircle(50, 10);
    ExpectEq(rect.intersectsCircle(intersectsCircle, 50), true);
    // unionWithRect
    logLabel = "test the geometry_rect unionWithRect function";
    cc::Rect unionWithRect(10, 10, 150, 40);
    rect = rect.unionWithRect(unionWithRect);
    cc::Vec2 equalTar(0, 0);
    size.setSize(160, 70);
    ExpectEq(equalTar.equals(cc::Vec2{rect.x, rect.y}) && size.equals(cc::Size{rect.width, rect.height}), true);
    // merge
    logLabel = "test the geometry_rect merge function";
    cc::Rect merge(30, 10, 200, 180);
    rect.merge(merge);
    size.setSize(230, 190);
    ExpectEq(size.equals(cc::Size{rect.width, rect.height}), true);
}
