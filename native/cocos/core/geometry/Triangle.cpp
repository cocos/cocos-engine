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
                   float cx, float cy, float cz) {
    setType(ShapeEnum::SHAPE_TRIANGLE);
    a = {ax, ay, az};
    b = {bx, by, bz};
    c = {cx, cy, cz};
}
} // namespace geometry
} // namespace cc
