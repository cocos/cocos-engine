/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once

#include "base/Macros.h"
#include "math/Vec2.h"

namespace cc {

class CC_DLL Size {
public:
    /**Width of the Size.*/
    float width{0.F};
    /**Height of the Size.*/
    float height{0.F};

    /**Conversion from Vec2 to Size.*/
    operator Vec2() const { // NOLINT
        return Vec2(width, height);
    }

    /**
    @{
    Constructor.
    @param width Width of the size.
    @param height Height of the size.
    @param other Copy constructor.
    @param point Conversion from a point.
     */
    Size();
    Size(float width, float height);
    Size(const Size &other);
    explicit Size(const Vec2 &point);
    /**@}*/

    Size &operator=(const Size &other);
    Size &operator=(const Vec2 &point);
    Size operator+(const Size &right) const;
    Size operator-(const Size &right) const;
    Size operator*(float a) const;
    Size operator/(float a) const;
    /**
    Set the width and height of Size.
     */
    void setSize(float width, float height);
    /**
    Check if two size is the same.
     */
    bool equals(const Size &target) const;
    /**Size(0,0).*/
    static const Size ZERO;
};

/**Rectangle area.*/
class CC_DLL Rect {
public:
    float x{0.F};
    float y{0.F};
    float width{0.F};
    float height{0.F};

    Rect();
    Rect(float x, float y, float width, float height);
    Rect(const Vec2 &pos, const Size &dimension);
    Rect(const Rect &other);
    Rect &operator=(const Rect &other);
    void setRect(float x, float y, float width, float height);
    /**
    Get the left of the rect.
     */
    float getMinX() const; /// return the leftmost x-value of current rect
    /**
    Get the X coordinate of center point.
     */
    float getMidX() const; /// return the midpoint x-value of current rect
    /**
    Get the right of rect.
     */
    float getMaxX() const; /// return the rightmost x-value of current rect
    /**
    Get the bottom of rect.
     */
    float getMinY() const; /// return the bottommost y-value of current rect
    /**
    Get the Y coordinate of center point.
     */
    float getMidY() const; /// return the midpoint y-value of current rect
    /**
    Get top of rect.
     */
    float getMaxY() const; /// return the topmost y-value of current rect

    bool equals(const Rect &rect) const;
    /**
    Check if the points is contained in the rect.
     */
    bool containsPoint(const Vec2 &point) const;
    /**
    Check the intersect status of two rects.
     */
    bool intersectsRect(const Rect &rect) const;
    /**
    Check the intersect status of the rect and a circle.
     */
    bool intersectsCircle(const Vec2 &center, float radius) const;
    /**
    Get the min rect which can contain this and rect.
     */
    Rect unionWithRect(const Rect &rect) const;
    /**Compute the min rect which can contain this and rect, assign it to this.*/
    void merge(const Rect &rect);
    /**An empty Rect.*/
    static const Rect ZERO;
};

} // namespace cc
