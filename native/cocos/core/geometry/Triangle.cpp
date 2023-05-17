/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "core/geometry/Triangle.h"
#include "base/memory/Memory.h"

namespace cc {
namespace geometry {

Triangle *Triangle::create(float ax, float ay, float az,
                           float bx, float by, float bz,
                           float cx, float cy, float cz) {
    return ccnew Triangle(ax, ay, az, bx, by, bz, cx, cy, cz);
}

Triangle *Triangle::clone(const Triangle &t) {
    return ccnew Triangle(
        t.a.x, t.a.y, t.a.z,
        t.b.x, t.b.y, t.b.z,
        t.c.x, t.c.y, t.c.z);
}

Triangle *Triangle::copy(Triangle *out, const Triangle &t) {
    out->a = t.a;
    out->b = t.b;
    out->c = t.c;
    return out;
}

Triangle *Triangle::fromPoints(Triangle *out, const Vec3 &a,
                               const Vec3 &b,
                               const Vec3 &c) {
    out->a = a;
    out->b = b;
    out->c = c;
    return out;
}

Triangle *Triangle::set(Triangle *out,
                        float ax, float ay, float az,
                        float bx, float by, float bz,
                        float cx, float cy, float cz) {
    out->a.x = ax;
    out->a.y = ay;
    out->a.z = az;

    out->b.x = bx;
    out->b.y = by;
    out->b.z = bz;

    out->c.x = cx;
    out->c.y = cy;
    out->c.z = cz;

    return out;
}

Triangle::Triangle(float ax, float ay, float az,
                   float bx, float by, float bz,
                   float cx, float cy, float cz) : ShapeBase(ShapeEnum::SHAPE_TRIANGLE) {
    a = {ax, ay, az};
    b = {bx, by, bz};
    c = {cx, cy, cz};
}
} // namespace geometry
} // namespace cc
