#include "core/geometry/Ray.h"

namespace cc {
namespace geometry {
Ray *Ray::create(float ox, float oy, float oz, float dx, float dy, float dz) {
    return new Ray{ox, oy, oz, dx, dy, dz};
}

Ray *Ray::clone(const Ray &a) {
    return new Ray{
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
         float dx, float dy, float dz) {
    setType(ShapeEnum::SHAPE_RAY);
    o = {ox, oy, oz};
    d = {dx, dy, dz};
}

void Ray::computeHit(Vec3 *out, float distance) const {
    *out = o + d.getNormalized() * distance;
}
} // namespace geometry
} // namespace cc