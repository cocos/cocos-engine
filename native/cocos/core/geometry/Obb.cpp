#include "cocos/core/geometry/Obb.h"

namespace {
void transformExtentM3(cc::Vec3 *out, const cc::Vec3 &extent, const cc::Mat3 &m3) {
    cc::Mat3 m3Tmp;
    m3Tmp.m[0] = abs(m3.m[0]);
    m3Tmp.m[1] = abs(m3.m[1]);
    m3Tmp.m[2] = abs(m3.m[2]);
    m3Tmp.m[3] = abs(m3.m[3]);
    m3Tmp.m[4] = abs(m3.m[4]);
    m3Tmp.m[5] = abs(m3.m[5]);
    m3Tmp.m[6] = abs(m3.m[6]);
    m3Tmp.m[7] = abs(m3.m[7]);
    m3Tmp.m[8] = abs(m3.m[8]);
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
    return new OBB(cx, cy, cz, hw, hh, hl,
                   ox1, ox2, ox3,
                   oy1, oy2, oy3,
                   oz1, oz2, oz3);
}

OBB *OBB::clone(const OBB &a) {
    return new OBB(a.center.x, a.center.y, a.center.z,
                   a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
                   a.orientation.m[0], a.orientation.m[1], a.orientation.m[2],
                   a.orientation.m[3], a.orientation.m[4], a.orientation.m[5],
                   a.orientation.m[6], a.orientation.m[7], a.orientation.m[8]);
}

OBB *OBB::copy(OBB *out, const OBB &a) {
    out->center      = a.center;
    out->halfExtents = a.halfExtents;
    out->orientation = a.orientation;
    return out;
}

OBB *OBB::fromPoints(OBB *out, const Vec3 &minPos, const Vec3 &maxPos) {
    out->center      = 0.5F * (minPos + maxPos);
    out->halfExtents = 0.5F * (maxPos - minPos);
    Mat3::identity(out->orientation);
    return out;
}

OBB *OBB::set(OBB * out,
              float cx, float cy, float cz,
              float hw, float hh, float hl,
              float ox1, float ox2, float ox3,
              float oy1, float oy2, float oy3,
              float oz1, float oz2, float oz3) {
    out->center      = {cx, cy, cz};
    out->halfExtents = {hw, hh, hl};
    out->orientation = {ox1, ox2, ox3, oy1, oy2, oy3, oz1, oz2, oz3};
    return out;
}

OBB::OBB(float cx, float cy, float cz,
         float hw, float hh, float hl,
         float ox1, float ox2, float ox3,
         float oy1, float oy2, float oy3,
         float oz1, float oz2, float oz3) {
    setType(ShapeEnum::SHAPE_OBB);
    center      = {cx, cy, cz};
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