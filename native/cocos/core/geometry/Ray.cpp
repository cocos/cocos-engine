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

#include "core/geometry/Ray.h"
#include "base/memory/Memory.h"

namespace cc {
namespace geometry {
Ray *Ray::create(float ox, float oy, float oz, float dx, float dy, float dz) {
    return ccnew Ray{ox, oy, oz, dx, dy, dz};
}

Ray *Ray::clone(const Ray &a) {
    return ccnew Ray{
        a.o.x, a.o.y, a.o.z,
        a.d.x, a.d.y, a.d.z};
}

Ray *Ray::copy(Ray *out, const Ray &a) {
    out->o = a.o;
    out->d = a.d;
    return out;
}

Ray *Ray::fromPoints(Ray *out, const Vec3 &origin, const Vec3 &target) {
    out->o = origin;
    out->d = (target - origin).getNormalized();
    return out;
}

Ray *Ray::set(Ray *out, float ox, float oy,
              float oz,
              float dx,
              float dy,
              float dz) {
    out->o.x = ox;
    out->o.y = oy;
    out->o.z = oz;
    out->d.x = dx;
    out->d.y = dy;
    out->d.z = dz;
    return out;
}

Ray::Ray(float ox, float oy, float oz,
         float dx, float dy, float dz) : ShapeBase(ShapeEnum::SHAPE_RAY) {
    o = {ox, oy, oz};
    d = {dx, dy, dz};
}

void Ray::computeHit(Vec3 *out, float distance) const {
    *out = o + d.getNormalized() * distance;
}
} // namespace geometry
} // namespace cc
