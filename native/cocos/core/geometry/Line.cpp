#include "core/geometry/Line.h"

namespace cc {
namespace geometry {

Line *Line::create(float sx,
                   float sy,
                   float sz,
                   float ex,
                   float ey,
                   float ez) {
    return new Line(sx, sy, sz, ex, ey, ez);
}

Line *Line::clone(const Line &a) {
    return new Line(
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

Line::Line(float sx, float sy, float sz, float ex, float ey, float ez) {
    setType(ShapeEnum::SHAPE_LINE);
    s = {sx, sy, sz};
    e = {ex, ey, ez};
}

} // namespace geometry
} // namespace cc