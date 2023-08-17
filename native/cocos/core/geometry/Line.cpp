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

#include "core/geometry/Line.h"
#include "base/memory/Memory.h"

namespace cc {
namespace geometry {

Line *Line::create(float sx,
                   float sy,
                   float sz,
                   float ex,
                   float ey,
                   float ez) {
    return ccnew Line(sx, sy, sz, ex, ey, ez);
}

Line *Line::clone(const Line &a) {
    return ccnew Line(
        a.s.x, a.s.y, a.s.z,
        a.e.x, a.e.y, a.e.z);
}

Line *Line::copy(Line *out, const Line &a) {
    out->s = a.s;
    out->e = a.e;
    return out;
}

Line *Line::fromPoints(Line *out, const Vec3 &start, const Vec3 &end) {
    out->s = start;
    out->e = end;
    return out;
}

Line *Line::set(Line *out,
                float sx,
                float sy,
                float sz,
                float ex,
                float ey,
                float ez) {
    out->s.x = sx;
    out->s.y = sy;
    out->s.z = sz;
    out->e.x = ex;
    out->e.y = ey;
    out->e.z = ez;

    return out;
}

Line::Line(float sx, float sy, float sz, float ex, float ey, float ez) : ShapeBase(ShapeEnum::SHAPE_LINE) {
    s = {sx, sy, sz};
    e = {ex, ey, ez};
}

} // namespace geometry
} // namespace cc
