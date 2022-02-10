#include "cocos/core/geometry/Capsule.h"
#include "cocos/math/Vec3.h"
namespace cc {
namespace geometry {

void Capsule::transform(const Mat4 &m, const Vec3 & /*pos*/, const Quaternion &rot, const Vec3 &scale, Capsule *out) const {
    const auto maxComponent = mathutils::absMaxComponent(scale);
    out->radius             = this->radius * abs(maxComponent);

    const auto halfTotalWorldHeight = (this->halfHeight + this->radius) * std::abs(scale.y);
    auto       halfWorldHeight      = halfTotalWorldHeight - out->radius;
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
            assert(false);
    }
}
} // namespace geometry
} // namespace cc