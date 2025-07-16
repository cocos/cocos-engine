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

#include "cocos/core/geometry/Obb.h"
#include "base/memory/Memory.h"

namespace {
void transformExtentM3(cc::Vec3 *out, const cc::Vec3 &extent, const cc::Mat3 &m3) {
    cc::Mat3 m3Tmp;
    m3Tmp.m[0] = std::abs(m3.m[0]);
    m3Tmp.m[1] = std::abs(m3.m[1]);
    m3Tmp.m[2] = std::abs(m3.m[2]);
    m3Tmp.m[3] = std::abs(m3.m[3]);
    m3Tmp.m[4] = std::abs(m3.m[4]);
    m3Tmp.m[5] = std::abs(m3.m[5]);
    m3Tmp.m[6] = std::abs(m3.m[6]);
    m3Tmp.m[7] = std::abs(m3.m[7]);
    m3Tmp.m[8] = std::abs(m3.m[8]);
    out->transformMat3(extent, m3Tmp);
};
} // namespace

namespace cc {
namespace geometry {

OBB *OBB::create(
    float cx, float cy, float cz,
    float hw, float hh, float hl,
    float ox1, float ox2, float ox3,
    float oy1, float oy2, float oy3,
    float oz1, float oz2, float oz3) {
    return ccnew OBB(cx, cy, cz, hw, hh, hl,
                     ox1, ox2, ox3,
                     oy1, oy2, oy3,
                     oz1, oz2, oz3);
}

OBB *OBB::clone(const OBB &a) {
    return ccnew OBB(a.center.x, a.center.y, a.center.z,
                     a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
                     a.orientation.m[0], a.orientation.m[1], a.orientation.m[2],
                     a.orientation.m[3], a.orientation.m[4], a.orientation.m[5],
                     a.orientation.m[6], a.orientation.m[7], a.orientation.m[8]);
}

OBB *OBB::copy(OBB *out, const OBB &a) {
    out->center = a.center;
    out->halfExtents = a.halfExtents;
    out->orientation = a.orientation;
    return out;
}

OBB *OBB::fromPoints(OBB *out, const Vec3 &minPos, const Vec3 &maxPos) {
    out->center = 0.5F * (minPos + maxPos);
    out->halfExtents = 0.5F * (maxPos - minPos);
    Mat3::identity(out->orientation);
    return out;
}

OBB *OBB::set(OBB *out,
              float cx, float cy, float cz,
              float hw, float hh, float hl,
              float ox1, float ox2, float ox3,
              float oy1, float oy2, float oy3,
              float oz1, float oz2, float oz3) {
    out->center = {cx, cy, cz};
    out->halfExtents = {hw, hh, hl};
    out->orientation = {ox1, ox2, ox3, oy1, oy2, oy3, oz1, oz2, oz3};
    return out;
}

OBB::OBB(float cx, float cy, float cz,
         float hw, float hh, float hl,
         float ox1, float ox2, float ox3,
         float oy1, float oy2, float oy3,
         float oz1, float oz2, float oz3) : ShapeBase(ShapeEnum::SHAPE_OBB) {
    center = {cx, cy, cz};
    halfExtents = {hw, hh, hl};
    orientation = {ox1, ox2, ox3, oy1, oy2, oy3, oz1, oz2, oz3};
}

void OBB::getBoundary(Vec3 *minPos, Vec3 *maxPos) const {
    Vec3 v3Tmp;
    transformExtentM3(&v3Tmp, halfExtents, orientation);
    *minPos = center - v3Tmp;
    *maxPos = center + v3Tmp;
}

void OBB::transform(const Mat4 &m, const Vec3 & /*pos*/, const Quaternion &rot, const Vec3 &scale, OBB *out) const {
    Vec3::transformMat4(center, m, &out->center);
    // parent shape doesn't contain rotations for now
    Mat3::fromQuat(rot, &out->orientation);
    Vec3::multiply(halfExtents, scale, &out->halfExtents);
}

void OBB::translateAndRotate(const Mat4 &m, const Quaternion &rot, OBB *out) const {
    Vec3::transformMat4(center, m, &out->center);
    // parent shape doesn't contain rotations for now
    Mat3::fromQuat(rot, &out->orientation);
}

void OBB::setScale(const Vec3 &scale, OBB *out) const {
    Vec3::multiply(halfExtents, scale, &out->halfExtents);
}

} // namespace geometry
} // namespace cc
