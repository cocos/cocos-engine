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

#include "Color.h"

namespace cc {

Color::Color()
: r(0),
  g(0),
  b(0),
  a(0) {
}

Color::Color(uint8_t r, uint8_t g, uint8_t b, uint8_t a)
: r(r),
  g(g),
  b(b),
  a(a) {
}

Color::Color(const uint8_t *src) {
    set(src);
}

Color::Color(uint32_t val) {
    set(val);
}

Color::Color(const Color &p1, const Color &p2) {
    set(p1, p2);
}

Color::Color(const Color &copy) {
    set(copy);
}

void Color::set(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    this->r = r;
    this->g = g;
    this->b = b;
    this->a = a;
}

void Color::set(const uint8_t *array) {
    r = array[0];
    g = array[1];
    b = array[2];
    a = array[3];
}

void Color::set(uint32_t val) {
    r = val & 0x000000FF;
    g = (val & 0x0000FF00) >> 8;
    b = (val & 0x00FF0000) >> 16;
    a = (val & 0xFF000000) >> 24;
}

void Color::set(const Color &c) {
    this->r = c.r;
    this->g = c.g;
    this->b = c.b;
    this->a = c.a;
}

void Color::set(const Color &p1, const Color &p2) {
    r = p2.r - p1.r;
    g = p2.g - p1.g;
    b = p2.b - p1.b;
    a = p2.a - p1.a;
}

Vec4 Color::toVec4() const {
    return {static_cast<float>(r) / 255.F, static_cast<float>(g) / 255.F, static_cast<float>(b) / 255.F, static_cast<float>(a) / 255.F};
}

} // namespace cc
