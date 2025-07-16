/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

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

#include <cstdint>

#include "math/Vec4.h"

namespace cc {

class Color {
public:
    uint8_t r;
    uint8_t g;
    uint8_t b;
    uint8_t a;
    /**
     * Constructs a new color initialized to all zeros.
     */
    Color();

    /**
     * Constructs a new color initialized to the specified values.
     *
     * @param xx The x coordinate.
     * @param yy The y coordinate.
     * @param zz The z coordinate.
     * @param ww The w coordinate.
     */
    explicit Color(uint8_t r, uint8_t g, uint8_t b, uint8_t a);

    /**
     * Constructs a new color from the values in the specified array.
     *
     * @param array An array containing the elements of the color in the order r, g, b, a.
     */
    explicit Color(const uint8_t *src);

    explicit Color(uint32_t val);

    /**
     * Constructs a color that describes the direction between the specified points.
     *
     * @param p1 The first point.
     * @param p2 The second point.
     */
    Color(const Color &p1, const Color &p2);

    /**
     * Constructor.
     *
     * Creates a new color that is a copy of the specified color.
     *
     * @param copy The color to copy.
     */
    Color(const Color &copy);
    /**
     * Sets the elements of this color to the specified values.
     *
     * @param xx The new x coordinate.
     * @param yy The new y coordinate.
     * @param zz The new z coordinate.
     * @param ww The new w coordinate.
     */
    void set(uint8_t r, uint8_t g, uint8_t b, uint8_t a);

    /**
     * Sets the elements of this color from the values in the specified array.
     *
     * @param array An array containing the elements of the color in the order r, g, b, a.
     */
    void set(const uint8_t *array);

    void set(uint32_t val);

    /**
     * Sets the elements of this color to those in the specified color.
     *
     * @param v The color to copy.
     */
    void set(const Color &c);

    /**
     * Sets this color to the directional color between the specified points.
     *
     * @param p1 The first point.
     * @param p2 The second point.
     */
    void set(const Color &p1, const Color &p2);

    Vec4 toVec4() const;
};

} // namespace cc
