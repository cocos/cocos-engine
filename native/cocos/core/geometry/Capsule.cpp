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

#include "cocos/core/geometry/Capsule.h"
#include "cocos/math/Vec3.h"
namespace cc {
namespace geometry {

void Capsule::transform(const Mat4 &m, const Vec3 & /*pos*/, const Quaternion &rot, const Vec3 &scale, Capsule *out) const {
    const auto maxComponent = mathutils::absMaxComponent(scale);
    out->radius = this->radius * std::abs(maxComponent);

    const auto halfTotalWorldHeight = (this->halfHeight + this->radius) * std::abs(scale.y);
    auto halfWorldHeight = halfTotalWorldHeight - out->radius;
    if (halfWorldHeight < 0) halfWorldHeight = 0;
    out->halfHeight = halfWorldHeight;

    out->center.transformMat4(this->center, m);
    Quaternion::multiply(this->rotation, rot, &out->rotation);
    out->updateCache();
}

void Capsule::updateCache() {
    updateLocalCenter();
    ellipseCenter0.transformQuat(rotation);
    ellipseCenter1.transformQuat(rotation);
    ellipseCenter0 += center;
    ellipseCenter1 += center;
}

void Capsule::updateLocalCenter() {
    switch (axis) {
        case CenterEnum::X:
            ellipseCenter0 = {halfHeight, 0, 0};
            ellipseCenter1 = {-halfHeight, 0, 0};
            break;
        case CenterEnum::Y:
            ellipseCenter0 = {0, halfHeight, 0};
            ellipseCenter1 = {0, -halfHeight, 0};
            break;
        case CenterEnum::Z:
            ellipseCenter0 = {0, 0, halfHeight};
            ellipseCenter1 = {0, 0, -halfHeight};
            break;
        default:
            CC_ABORT();
    }
}
} // namespace geometry
} // namespace cc
