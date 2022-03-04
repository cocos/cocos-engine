#include "core/geometry/Intersect.h"

#include <array>
#include <cmath>
#include <limits>
#include <vector>
#include "3d/assets/Mesh.h"
#include "base/Macros.h"
#include "core/TypedArray.h"
#include "core/assets/RenderingSubMesh.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Capsule.h"
#include "core/geometry/Distance.h"
#include "core/geometry/Enums.h"
#include "core/geometry/Frustum.h"
#include "core/geometry/Line.h"
#include "core/geometry/Obb.h"
#include "core/geometry/Plane.h"
#include "core/geometry/Ray.h"
#include "core/geometry/Spec.h"
#include "core/geometry/Sphere.h"
#include "core/geometry/Triangle.h"
#include "math/Mat3.h"
#include "math/Math.h"
#include "math/Vec3.h"
#include "renderer/gfx-base/GFXDef.h"
#include "scene/Model.h"

namespace cc {
namespace geometry {

float rayPlane(const Ray &ray, const Plane &plane) {
    auto denom = Vec3::dot(ray.d, plane.n);
    if (abs(denom) < math::EPSILON) {
        return 0;
    }
    auto t = (plane.n * plane.d - ray.o).dot(plane.n) / denom;
    return t < 0 ? 0 : t;
}

// based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/
float rayTriangle(const Ray &ray, const Triangle &triangle, bool doubleSided) {
    Vec3 pvec{};
    Vec3 qvec{};
    auto ab = triangle.b - triangle.a;
    auto ac = triangle.c - triangle.a;
    Vec3::cross(ray.d, ac, &pvec);
    float det = Vec3::dot(ab, pvec);
    if (det < math::EPSILON && (!doubleSided || det > -math::EPSILON)) {
        return 0;
    }
    float invDet = 1.0F / det;
    auto  ao     = ray.o - triangle.a;
    auto  u      = Vec3::dot(ao, pvec) * invDet;
    if (u < 0 || u > 1) {
        return 0;
    }
    Vec3::cross(ao, ab, &qvec);
    auto v = Vec3::dot(ray.d, qvec) * invDet;
    if (v < 0 || u + v > 1) {
        return 0;
    }

    auto t = Vec3::dot(ac, qvec) * invDet;
    return t < 0 ? 0 : t;
}

float raySphere(const Ray &ray, const Sphere &sphere) {
    auto rSq = sphere.getRadius() * sphere.getRadius();
    auto e   = sphere.getCenter() - ray.o;
    auto eSq = e.lengthSquared();

    auto aLength = Vec3::dot(e, ray.d); // assume ray direction already normalized
    auto fSq     = rSq - (eSq - aLength * aLength);
    if (fSq < 0) {
        return 0;
    }

    auto f = sqrt(fSq);
    auto t = eSq < rSq ? aLength + f : aLength - f;
    return t < 0 ? 0 : t;
}

float rayAABB2(const Ray &ray, const Vec3 &min, const Vec3 &max) {
    const auto &o    = ray.o;
    auto        d    = ray.d;
    auto        ix   = 1.0F / d.x;
    auto        iy   = 1.0F / d.y;
    auto        iz   = 1.0F / d.z;
    auto        tx1  = (min.x - o.x) * ix;
    auto        tx2  = (max.x - o.x) * ix;
    auto        ty1  = (min.y - o.y) * iy;
    auto        ty2  = (max.y - o.y) * iy;
    auto        tz1  = (min.z - o.z) * iz;
    auto        tz2  = (max.z - o.z) * iz;
    auto        tmin = std::max(std::max(std::min(tx1, tx2), std::min(ty1, ty2)), std::min(tz1, tz2));
    auto        tmax = std::min(std::min(std::max(tx1, tx2), std::max(ty1, ty2)), std::max(tz1, tz2));
    if (tmax < 0 || tmin > tmax) {
        return 0;
    }
    return tmin > 0 ? tmin : tmax; // ray origin inside aabb
}

float rayAABB(const Ray &ray, const AABB &aabb) {
    auto minV = aabb.getCenter() - aabb.getHalfExtents();
    auto maxV = aabb.getCenter() + aabb.getHalfExtents();
    return rayAABB2(ray, minV, maxV);
}

float rayOBB(const Ray &ray, const OBB &obb) {
    std::array<float, 6> t;
    std::array<float, 3> size   = {obb.halfExtents.x, obb.halfExtents.y, obb.halfExtents.z};
    const auto &         center = obb.center;
    auto const &         d      = ray.d;

    Vec3 x = {obb.orientation.m[0], obb.orientation.m[1], obb.orientation.m[2]};
    Vec3 y = {obb.orientation.m[3], obb.orientation.m[4], obb.orientation.m[5]};
    Vec3 z = {obb.orientation.m[6], obb.orientation.m[7], obb.orientation.m[8]};
    Vec3 p = center - ray.o;

    // The cos values of the ray on the X, Y, Z
    std::array<float, 3> f = {Vec3::dot(x, d), Vec3::dot(y, d), Vec3::dot(z, d)};

    // The projection length of P on X, Y, Z
    std::array<float, 3> e{Vec3::dot(x, p), Vec3::dot(y, p), Vec3::dot(z, p)};

    for (auto i = 0; i < 3; ++i) {
        if (f[i] == 0) {
            if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
                return 0;
            }
            // Avoid div by 0!
            f[i] = 0.000001F;
        }
        // min
        t[i * 2 + 0] = (e[i] + size[i]) / f[i];
        // max
        t[i * 2 + 1] = (e[i] - size[i]) / f[i];
    }
    auto tmin = std::max(std::max(std::min(t[0], t[1]), std::min(t[2], t[3])), std::min(t[4], t[5]));
    auto tmax = std::min(std::min(std::max(t[0], t[1]), std::max(t[2], t[3])), std::max(t[4], t[5]));
    if (tmax < 0 || tmin > tmax) {
        return 0;
    }
    return tmin > 0 ? tmin : tmax; // ray origin inside aabb
}

float rayCapsule(const Ray &ray, const Capsule &capsule) {
    Sphere sphere;
    auto   radiusSqr = capsule.radius * capsule.radius;
    auto   vRayNorm  = ray.d.getNormalized();
    auto   aa        = capsule.ellipseCenter0;
    auto   bb        = capsule.ellipseCenter1;
    auto   ba        = bb - aa;
    if (ba == Vec3::ZERO) {
        sphere.setRadius(capsule.radius);
        sphere.setCenter(capsule.ellipseCenter0);
        return raySphere(ray, sphere);
    }

    auto oa = ray.o - aa;
    Vec3 VxBA; //NOLINT(readability-identifier-naming)
    Vec3::cross(vRayNorm, ba, &VxBA);
    auto a = VxBA.lengthSquared();
    if (a == 0.0F) {
        sphere.setRadius(capsule.radius);
        auto bo = bb - ray.o;
        if (oa.lengthSquared() < bo.lengthSquared()) {
            sphere.setCenter(capsule.ellipseCenter0);
        } else {
            sphere.setCenter(capsule.ellipseCenter1);
        }
        return raySphere(ray, sphere);
    }

    Vec3 OAxBA; //NOLINT(readability-identifier-naming)
    Vec3::cross(oa, ba, &OAxBA);
    auto ab2 = ba.lengthSquared();
    auto b   = 2.0F * Vec3::dot(VxBA, OAxBA);
    auto c   = OAxBA.lengthSquared() - (radiusSqr * ab2);
    auto d   = b * b - 4 * a * c;

    if (d < 0) {
        return 0;
    }

    auto t = (-b - std::sqrt(d)) / (2.0F * a);
    if (t < 0.0F) {
        sphere.setRadius(capsule.radius);
        auto bo = bb - ray.o;
        if (oa.lengthSquared() < bo.lengthSquared()) {
            sphere.setCenter(capsule.ellipseCenter0);
        } else {
            sphere.setCenter(capsule.ellipseCenter1);
        }
        return raySphere(ray, sphere);
    }
    // Limit intersection between the bounds of the cylinder's end caps.
    auto iPos    = ray.o + vRayNorm * t;
    auto iPosLen = iPos - aa;
    auto tLimit  = Vec3::dot(iPosLen, ba) / ab2;

    if (tLimit >= 0 && tLimit <= 1) {
        return t;
    }
    if (tLimit < 0) {
        sphere.setRadius(capsule.radius);
        sphere.setCenter(capsule.ellipseCenter0);
        return raySphere(ray, sphere);
    }
    if (tLimit > 1) {
        sphere.setRadius(capsule.radius);
        sphere.setCenter(capsule.ellipseCenter1);
        return raySphere(ray, sphere);
    }
    return 0;
}

namespace {
void fillResult(float *minDis, ERaycastMode m, float d, float i0, float i1, float i2, cc::optional<std::vector<IRaySubMeshResult>> &r) {
    if (m == ERaycastMode::CLOSEST) {
        if (*minDis > d || *minDis == 0.0F) {
            *minDis = d;
            if (r) {
                if (r->empty()) {
                    r->emplace_back(IRaySubMeshResult{d, static_cast<uint32_t>(i0 / 3), static_cast<uint32_t>(i1 / 3), static_cast<uint32_t>(i2 / 3)});
                } else {
                    (*r)[0].distance     = d;
                    (*r)[0].vertexIndex0 = static_cast<uint32_t>(i0 / 3);
                    (*r)[0].vertexIndex1 = static_cast<uint32_t>(i1 / 3);
                    (*r)[0].vertexIndex2 = static_cast<uint32_t>(i2 / 3);
                }
            }
        }
    } else {
        *minDis = d;
        if (r) r->emplace_back(IRaySubMeshResult{d, static_cast<uint32_t>(i0 / 3), static_cast<uint32_t>(i1 / 3), static_cast<uint32_t>(i2 / 3)});
    }
}

float narrowphase(float *minDis, const Float32Array &vb, const IBArray &ib, gfx::PrimitiveMode pm, const Ray &ray, IRaySubMeshOptions *opt) {
    Triangle tri;
    auto     ibSize = cc::visit([](auto &arr) { return arr.length(); }, ib);
    return cc::visit([&](auto &ib) {
        if (pm == gfx::PrimitiveMode::TRIANGLE_LIST) {
            auto cnt = ibSize;
            for (auto j = 0; j < cnt; j += 3) {
                auto i0   = ib[j] * 3;
                auto i1   = ib[j + 1] * 3;
                auto i2   = ib[j + 2] * 3;
                tri.a     = {vb[i0], vb[i0 + 1], vb[i0 + 2]};
                tri.b     = {vb[i1], vb[i1 + 1], vb[i1 + 2]};
                tri.c     = {vb[i2], vb[i2 + 1], vb[i2 + 2]};
                auto dist = rayTriangle(ray, tri, opt->doubleSided);
                if (dist == 0.0F || dist > opt->distance) continue;
                fillResult(minDis, opt->mode, dist, static_cast<float>(i0), static_cast<float>(i1), static_cast<float>(i2), opt->result);
                if (opt->mode == ERaycastMode::ANY) return dist;
            }
        } else if (pm == gfx::PrimitiveMode::TRIANGLE_STRIP) {
            auto    cnt = ibSize - 2;
            int32_t rev = 0;
            for (auto j = 0; j < cnt; j += 1) {
                auto i0   = ib[j - rev] * 3;
                auto i1   = ib[j + rev + 1] * 3;
                auto i2   = ib[j + 2] * 3;
                tri.a     = {vb[i0], vb[i0 + 1], vb[i0 + 2]};
                tri.b     = {vb[i1], vb[i1 + 1], vb[i1 + 2]};
                tri.c     = {vb[i2], vb[i2 + 1], vb[i2 + 2]};
                rev       = ~rev;
                auto dist = rayTriangle(ray, tri, opt->doubleSided);
                if (dist == 0.0F || dist > opt->distance) continue;
                fillResult(minDis, opt->mode, dist, static_cast<float>(i0), static_cast<float>(i1), static_cast<float>(i2), opt->result);
                if (opt->mode == ERaycastMode::ANY) return dist;
            }
        } else if (pm == gfx::PrimitiveMode::TRIANGLE_FAN) {
            auto cnt = ibSize - 1;
            auto i0  = ib[0] * 3;
            tri.a    = {vb[i0], vb[i0 + 1], vb[i0 + 2]};
            for (auto j = 1; j < cnt; j += 1) {
                auto i1   = ib[j] * 3;
                auto i2   = ib[j + 1] * 3;
                tri.b     = {vb[i1], vb[i1 + 1], vb[i1 + 2]};
                tri.c     = {vb[i2], vb[i2 + 1], vb[i2 + 2]};
                auto dist = rayTriangle(ray, tri, opt->doubleSided);
                if (dist == 0.0 || dist > opt->distance) continue;
                fillResult(minDis, opt->mode, dist, static_cast<float>(i0), static_cast<float>(i1), static_cast<float>(i2), opt->result);
                if (opt->mode == ERaycastMode::ANY) return dist;
            }
        }
        return *minDis;
    },
                     ib);
}
} // namespace

float raySubMesh(const Ray &ray, const RenderingSubMesh &submesh, IRaySubMeshOptions *options) {
    Triangle           tri;
    IRaySubMeshOptions deOpt;
    deOpt.mode        = ERaycastMode::ANY;
    deOpt.distance    = FLT_MAX;
    deOpt.doubleSided = false;
    float minDis      = 0.0F;
    auto &mesh        = const_cast<RenderingSubMesh &>(submesh);
    if (mesh.getGeometricInfo().positions.empty()) return minDis;
    IRaySubMeshOptions *opt = options ? options : &deOpt;
    auto                min = mesh.getGeometricInfo().boundingBox.min;
    auto                max = mesh.getGeometricInfo().boundingBox.max;
    if (rayAABB2(ray, min, max) != 0.0F) {
        const auto &pm   = mesh.getPrimitiveMode();
        const auto &info = mesh.getGeometricInfo();
        narrowphase(&minDis, info.positions, info.indices.value(), pm, ray, opt);
    }
    return minDis;
}

float rayMesh(const Ray &ray, const Mesh &mesh, IRayMeshOptions *option) {
    float           minDis = 0.0F;
    IRayMeshOptions deOpt;
    deOpt.distance          = std::numeric_limits<float>::max();
    deOpt.doubleSided       = false;
    deOpt.mode              = ERaycastMode::ANY;
    IRayMeshOptions *opt    = option ? option : &deOpt;
    auto             length = mesh.getSubMeshCount();
    auto             min    = mesh.getStruct().minPosition;
    auto             max    = mesh.getStruct().maxPosition;
    if (min.has_value() && max.has_value() && rayAABB2(ray, min.value(), max.value()) == 0.0F) return minDis;
    for (uint32_t i = 0; i < length; i++) {
        const auto &sm  = const_cast<Mesh &>(mesh).getRenderingSubMeshes()[i];
        float       dis = raySubMesh(ray, *sm, opt);
        if (dis != 0.0F) {
            if (opt->mode == ERaycastMode::CLOSEST) {
                if (minDis == 0.0F || minDis > dis) {
                    minDis = dis;
                    if (opt->subIndices.has_value()) {
                        if (opt->subIndices->empty()) {
                            opt->subIndices->resize(1);
                        }
                        opt->subIndices.value()[0] = i;
                    }
                }
            } else {
                minDis = dis;
                if (opt->subIndices.has_value()) opt->subIndices->emplace_back(i);
                if (opt->mode == ERaycastMode::ANY) {
                    return dis;
                }
            }
        }
    }
    if (minDis != 0.0F && opt->mode == ERaycastMode::CLOSEST) {
        if (opt->result.has_value()) {
            opt->result.value()[0].distance = minDis;
            opt->result.value().resize(1);
        }
        if (opt->subIndices.has_value()) opt->subIndices.value().resize(1);
    }
    return minDis;
}

float rayModel(const Ray &ray, const scene::Model &model, IRayModelOptions *option) {
    float            minDis = 0.0F;
    IRayModelOptions deOpt;
    deOpt.distance    = std::numeric_limits<float>::max();
    deOpt.doubleSided = false;
    deOpt.mode        = ERaycastMode::ANY;

    IRayModelOptions *opt = option ? option : &deOpt;
    const auto *      wb  = model.getWorldBounds();
    if (wb && rayAABB(ray, *wb) == 0.0F) {
        return minDis;
    }
    Ray modelRay{ray};
    if (model.getNode()) {
        Mat4 m4 = model.getNode()->getWorldMatrix().getInversed();
        Vec3::transformMat4(ray.o, m4, &modelRay.o);
        Vec3::transformMat4Normal(ray.d, m4, &modelRay.d);
    }
    const auto &subModels = model.getSubModels();
    for (auto i = 0; i < subModels.size(); i++) {
        const auto &subMesh = subModels[i]->getSubMesh();
        float       dis     = raySubMesh(modelRay, *subMesh, opt);
        if (dis != 0.0F) {
            if (opt->mode == ERaycastMode::CLOSEST) {
                if (minDis == 0.0F || minDis > dis) {
                    minDis = dis;
                    if (opt->subIndices.has_value()) {
                        if (opt->subIndices->empty()) {
                            opt->subIndices->resize(1);
                        }
                        opt->subIndices.value()[0] = i;
                    }
                }
            } else {
                minDis = dis;
                if (opt->subIndices.has_value()) opt->subIndices->emplace_back(i);
                if (opt->mode == ERaycastMode::ANY) {
                    return dis;
                }
            }
        }
    }
    if (minDis != 0.0F && opt->mode == ERaycastMode::CLOSEST) {
        if (opt->result.has_value()) {
            opt->result.value()[0].distance = minDis;
            opt->result.value().resize(1);
        }
        if (opt->subIndices.has_value()) opt->subIndices->resize(1);
    }
    return minDis;
}

float linePlane(const Line &line, const Plane &plane) {
    auto ab = line.e - line.s;
    auto t  = (plane.d - Vec3::dot(line.s, plane.n)) / Vec3::dot(ab, plane.n);
    return (t < 0 || t > 1) ? 0 : t;
}

int lineTriangle(const Line &line, const Triangle &triangle, Vec3 *outPt) {
    Vec3 n;
    Vec3 e;
    auto ab = triangle.b - triangle.a;
    auto ac = triangle.c - triangle.a;
    auto qp = line.s - line.e;
    Vec3::cross(ab, ac, &n);

    auto det = Vec3::dot(qp, n);

    if (det <= 0.0F) {
        return 0;
    }

    auto ap = line.s - triangle.a;
    auto t  = Vec3::dot(ap, n);
    if (t < 0 || t > det) {
        return 0;
    }

    Vec3::cross(qp, ap, &e);
    auto v = Vec3::dot(ac, e);
    if (v < 0.0F || v > det) {
        return 0;
    }

    auto w = -Vec3::dot(ab, e);
    if (w < 0.0F || v + w > det) {
        return 0;
    }

    if (outPt) {
        auto invDet = 1.0F / det;
        v *= invDet;
        w *= invDet;
        auto u = 1.0F - v - w;

        // outPt = u*a + v*d + w*c;
        *outPt = {triangle.a.x * u + triangle.b.x * v + triangle.c.x * w,
                  triangle.a.y * u + triangle.b.y * v + triangle.c.y * w,
                  triangle.a.z * u + triangle.b.z * v + triangle.c.z * w};
    }

    return 1;
}

float lineAABB(const Line &line, const AABB &aabb) {
    Ray ray;
    ray.o.set(line.s);
    ray.d = line.e - line.s;
    ray.d.normalize();
    auto min = rayAABB(ray, aabb);
    return min < line.length() ? min : 0.0F;
}

float lineOBB(const Line &line, const OBB &obb) {
    Ray ray;
    ray.o.set(line.s);
    ray.d = line.e - line.s;
    ray.d.normalize();
    auto min = rayOBB(ray, obb);
    return min < line.length() ? min : 0.0F;
}

float lineSphere(const Line &line, const Sphere &sphere) {
    Ray ray;
    ray.o.set(line.s);
    ray.d = line.e - line.s;
    ray.d.normalize();
    auto min = raySphere(ray, sphere);
    return min < line.length() ? min : 0.0F;
}

bool aabbWithAABB(const AABB &aabb1, const AABB &aabb2) {
    auto aMin = aabb1.getCenter() - aabb1.getHalfExtents();
    auto aMax = aabb1.getCenter() + aabb1.getHalfExtents();
    auto bMin = aabb2.getCenter() - aabb2.getHalfExtents();
    auto bMax = aabb2.getCenter() + aabb2.getHalfExtents();
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) && (aMin.y <= bMax.y && aMax.y >= bMin.y) && (aMin.z <= bMax.z && aMax.z >= bMin.z);
}

static void getAABBVertices(const Vec3 &min, const Vec3 &max, std::array<Vec3, 8> *out) {
    *out = {
        Vec3{min.x, max.y, max.z},
        Vec3{min.x, max.y, min.z},
        Vec3{min.x, min.y, max.z},
        Vec3{min.x, min.y, min.z},
        Vec3{max.x, max.y, max.z},
        Vec3{max.x, max.y, min.z},
        Vec3{max.x, min.y, max.z},
        Vec3{max.x, min.y, min.z},
    };
}

static void getOBBVertices(const Vec3 &c, const Vec3 &e,
                           const Vec3 &a1, const Vec3 &a2, const Vec3 &a3,
                           std::array<Vec3, 8> *out) {
    *out = {Vec3{
                c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z,
                c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z,
                c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z},
            Vec3{
                c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z,
                c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z,
                c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z},
            Vec3{
                c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z,
                c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z,
                c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z},
            Vec3{
                c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z,
                c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z,
                c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z},
            Vec3{
                c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z,
                c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z,
                c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z},
            Vec3{
                c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z,
                c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z,
                c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z},
            Vec3{
                c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z,
                c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z,
                c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z},
            Vec3{
                c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z,
                c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z,
                c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z}};
}

struct Interval {
    float min;
    float max;
};

static Interval getInterval(const std::array<Vec3, 8> &vertices, const Vec3 &axis) {
    auto min = std::numeric_limits<float>::max();
    auto max = std::numeric_limits<float>::min();
    for (auto i = 0; i < 8; ++i) {
        auto projection = Vec3::dot(axis, vertices[i]);
        min             = std::min(projection, min);
        max             = std::max(projection, max);
    }
    return Interval{min, max};
}

int aabbWithOBB(const AABB &aabb, const OBB &obb) {
    std::array<Vec3, 15> test;
    std::array<Vec3, 8>  vertices;
    std::array<Vec3, 8>  vertices2;
    test[0] = {1, 0, 0};
    test[1] = {0, 1, 0};
    test[2] = {0, 0, 1};
    test[3] = {obb.orientation.m[0], obb.orientation.m[1], obb.orientation.m[2]};
    test[4] = {obb.orientation.m[3], obb.orientation.m[4], obb.orientation.m[5]};
    test[5] = {obb.orientation.m[6], obb.orientation.m[7], obb.orientation.m[8]};

    for (auto i = 0; i < 3; ++i) { // Fill out rest of axis
        Vec3::cross(test[i], test[3], &test[6 + i * 3 + 0]);
        Vec3::cross(test[i], test[4], &test[6 + i * 3 + 1]);
        Vec3::cross(test[i], test[5], &test[6 + i * 3 + 2]);
    }

    auto min = aabb.getCenter() - aabb.getHalfExtents();
    auto max = aabb.getCenter() + aabb.getHalfExtents();
    getAABBVertices(min, max, &vertices);
    getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], &vertices2);

    for (auto j = 0; j < 15; ++j) {
        auto a = getInterval(vertices, test[j]);
        auto b = getInterval(vertices2, test[j]);
        if (b.min > a.max || a.min > b.max) {
            return 0; // Seperating axis found
        }
    }

    return 1;
}

int aabbPlane(const AABB &aabb, const Plane &plane) {
    auto r   = aabb.getHalfExtents().x * std::abs(plane.n.x) + aabb.getHalfExtents().y * std::abs(plane.n.y) + aabb.getHalfExtents().z * std::abs(plane.n.z);
    auto dot = Vec3::dot(plane.n, aabb.getCenter());
    if (dot + r < plane.d) {
        return -1;
    }
    if (dot - r > plane.d) {
        return 0;
    }
    return 1;
}

int aabbFrustum(const AABB &aabb, const Frustum &frustum) {
    for (const auto &plane : frustum.planes) {
        // frustum plane normal points to the inside
        if (aabbPlane(aabb, *plane) == -1) {
            return 0;
        }
    } // completely outside
    return 1;
}

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
int aabbFrustumAccurate(const AABB &aabb, const Frustum &frustum) {
    std::array<Vec3, 8> tmp;
    int                 out1       = 0;
    int                 out2       = 0;
    int                 result     = 0;
    bool                intersects = false;
    // 1. aabb inside/outside frustum test
    for (const auto &plane : frustum.planes) {
        result = aabbPlane(aabb, *plane);
        // frustum plane normal points to the inside
        if (result == -1) {
            return 0; // completely outside
        }
        if (result == 1) {
            intersects = true;
        }
    }
    if (!intersects) {
        return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside aabb test
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        tmp[i] = frustum.vertices[i] - aabb.getCenter();
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        if (tmp[i].x > aabb.getHalfExtents().x) {
            out1++;
        } else if (tmp[i].x < -aabb.getHalfExtents().x) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0;
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        if (tmp[i].y > aabb.getHalfExtents().y) {
            out1++;
        } else if (tmp[i].y < -aabb.getHalfExtents().y) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0;
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        if (tmp[i].z > aabb.getHalfExtents().z) {
            out1++;
        } else if (tmp[i].z < -aabb.getHalfExtents().z) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0;
    }
    return 1;
}

bool obbPoint(const OBB &obb, const Vec3 &point) {
    Mat3 m3;
    auto lessThan = [](const Vec3 &a, const Vec3 &b) -> bool {
        return std::abs(a.x) < b.x && std::abs(a.y) < b.y && std::abs(a.z) < b.z;
    };
    auto tmp = point - obb.center;
    Mat3::transpose(obb.orientation, &m3);
    tmp.transformMat3(tmp, m3);
    return lessThan(tmp, obb.halfExtents);
};

int obbPlane(const OBB &obb, const Plane &plane) {
    auto absDot = [](const Vec3 &n, float x, float y, float z) -> float {
        return std::abs(n.x * x + n.y * y + n.z * z);
    };

    // Real-Time Collision Detection, Christer Ericson, p. 163.
    auto r = obb.halfExtents.x * absDot(plane.n, obb.orientation.m[0], obb.orientation.m[1], obb.orientation.m[2]) +
             obb.halfExtents.y * absDot(plane.n, obb.orientation.m[3], obb.orientation.m[4], obb.orientation.m[5]) +
             obb.halfExtents.z * absDot(plane.n, obb.orientation.m[6], obb.orientation.m[7], obb.orientation.m[8]);

    auto dot = Vec3::dot(plane.n, obb.center);
    if (dot + r < plane.d) {
        return -1;
    }
    if (dot - r > plane.d) {
        return 0;
    }
    return 1;
}

int obbFrustum(const OBB &obb, const Frustum &frustum) {
    for (const auto &plane : frustum.planes) {
        // frustum plane normal points to the inside
        if (obbPlane(obb, *plane) == -1) {
            return 0;
        }
    } // completely outside
    return 1;
};

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
int obbFrustumAccurate(const OBB &obb, const Frustum &frustum) {
    std::array<Vec3, 8> tmp  = {};
    float               dist = 0.0F;
    size_t              out1 = 0;
    size_t              out2 = 0;
    auto                dot  = [](const Vec3 &n, float x, float y, float z) -> float {
        return n.x * x + n.y * y + n.z * z;
    };
    int  result     = 0;
    auto intersects = false;
    // 1. obb inside/outside frustum test
    for (const auto &plane : frustum.planes) {
        result = obbPlane(obb, *plane);
        // frustum plane normal points to the inside
        if (result == -1) {
            return 0; // completely outside
        }
        if (result == 1) {
            intersects = true;
        }
    }
    if (!intersects) {
        return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside obb test
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        tmp[i] = frustum.vertices[i] - obb.center;
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        dist = dot(tmp[i], obb.orientation.m[0], obb.orientation.m[1], obb.orientation.m[2]);
        if (dist > obb.halfExtents.x) {
            out1++;
        } else if (dist < -obb.halfExtents.x) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0.0F;
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        dist = dot(tmp[i], obb.orientation.m[3], obb.orientation.m[4], obb.orientation.m[5]);
        if (dist > obb.halfExtents.y) {
            out1++;
        } else if (dist < -obb.halfExtents.y) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0;
    }
    out1 = 0;
    out2 = 0;
    for (auto i = 0; i < frustum.vertices.size(); i++) {
        dist = dot(tmp[i], obb.orientation.m[6], obb.orientation.m[7], obb.orientation.m[8]);
        if (dist > obb.halfExtents.z) {
            out1++;
        } else if (dist < -obb.halfExtents.z) {
            out2++;
        }
    }
    if (out1 == frustum.vertices.size() || out2 == frustum.vertices.size()) {
        return 0;
    }
    return 1;
}

int obbWithOBB(const OBB &obb1, const OBB &obb2) {
    std::array<Vec3, 8>  vertices;
    std::array<Vec3, 8>  vertices2;
    std::array<Vec3, 15> test;

    test[0] = {obb1.orientation.m[0], obb1.orientation.m[1], obb1.orientation.m[2]};
    test[1] = {obb1.orientation.m[3], obb1.orientation.m[4], obb1.orientation.m[5]};
    test[2] = {obb1.orientation.m[6], obb1.orientation.m[7], obb1.orientation.m[8]};
    test[3] = {obb2.orientation.m[0], obb2.orientation.m[1], obb2.orientation.m[2]};
    test[4] = {obb2.orientation.m[3], obb2.orientation.m[4], obb2.orientation.m[5]};
    test[5] = {obb2.orientation.m[6], obb2.orientation.m[7], obb2.orientation.m[8]};

    for (auto i = 0; i < 3; ++i) { // Fill out rest of axis
        Vec3::cross(test[i], test[3], &test[6 + i * 3 + 0]);
        Vec3::cross(test[i], test[4], &test[6 + i * 3 + 1]);
        Vec3::cross(test[i], test[5], &test[6 + i * 3 + 2]);
    }

    getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], &vertices);
    getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], &vertices2);

    for (auto i = 0; i < 15; ++i) {
        auto a = getInterval(vertices, test[i]);
        auto b = getInterval(vertices2, test[i]);
        if (b.min > a.max || a.min > b.max) {
            return 0; // Seperating axis found
        }
    }
    return 1;
}

// https://github.com/diku-dk/bvh-tvcg18/blob/1fd3348c17bc8cf3da0b4ae60fdb8f2aa90a6ff0/FOUNDATION/GEOMETRY/GEOMETRY/include/overlap/geometry_overlap_obb_capsule.h
int obbCapsule(const OBB &obb, const Capsule &capsule) {
    Sphere              sphere{};
    std::array<Vec3, 8> v3Verts8{};
    std::array<Vec3, 8> v3Axis8{};
    auto                h = capsule.ellipseCenter0.distanceSquared(capsule.ellipseCenter1);
    if (h == 0.0F) {
        sphere.setRadius(capsule.radius);
        sphere.setCenter(capsule.ellipseCenter0);
        return sphereOBB(sphere, obb);
    }
    Vec3 v3Tmp0 = {
        obb.orientation.m[0],
        obb.orientation.m[1],
        obb.orientation.m[2]};
    Vec3 v3Tmp1 = {
        obb.orientation.m[3],
        obb.orientation.m[4],
        obb.orientation.m[5]};
    Vec3 v3Tmp2 = {
        obb.orientation.m[6],
        obb.orientation.m[7],
        obb.orientation.m[8]};
    getOBBVertices(obb.center, obb.halfExtents, v3Tmp0, v3Tmp1, v3Tmp2, &v3Verts8);

    auto axes = v3Axis8;
    auto a0 = axes[0] = v3Tmp0;
    auto a1 = axes[1] = v3Tmp1;
    auto a2 = axes[2] = v3Tmp2;
    auto cc = axes[3] = capsule.center - obb.center;
    auto bb = axes[4] = capsule.ellipseCenter0 - capsule.ellipseCenter1;
    cc.normalize();
    bb.normalize();
    Vec3::cross(a0, bb, &axes[5]);
    Vec3::cross(a1, bb, &axes[6]);
    Vec3::cross(a2, bb, &axes[7]);

    for (auto i = 0; i < 8; ++i) {
        auto a    = getInterval(v3Verts8, axes[i]);
        auto d0   = Vec3::dot(axes[i], capsule.ellipseCenter0);
        auto d1   = Vec3::dot(axes[i], capsule.ellipseCenter1);
        auto dMin = std::min(d0, d1) - capsule.radius;
        auto dMax = std::max(d0, d1) + capsule.radius;
        if (dMin > a.max || a.min > dMax) {
            return 0; // Seperating axis found
        }
    }
    return 1;
}

int spherePlane(const Sphere &sphere, const Plane &plane) {
    auto dot = Vec3::dot(plane.n, sphere.getCenter());
    auto r   = sphere.getRadius() * plane.n.length();
    if (dot + r < plane.d) {
        return -1;
    }
    if (dot - r > plane.d) {
        return 0;
    }
    return 1;
}

int sphereFrustum(const Sphere &sphere, const Frustum &frustum) {
    for (const auto &plane : frustum.planes) {
        // frustum plane normal points to the inside
        if (spherePlane(sphere, *plane) == -1) {
            return 0;
        }
    } // completely outside
    return 1;
}

int sphereFrustumAccurate(const Sphere &sphere, const Frustum &frustum) {
    const static std::array<int, 6> MAP = {1, -1, 1, -1, 1, -1};
    for (auto i = 0; i < 6; i++) {
        const auto &plane = frustum.planes[i];
        const auto &n     = plane->n;
        const auto &d     = plane->d;
        auto        r     = sphere.getRadius();
        const auto &c     = sphere.getCenter();
        auto        dot   = Vec3::dot(n, c);
        // frustum plane normal points to the inside
        if (dot + r < d) {
            return 0; // completely outside
        }
        if (dot - r > d) {
            continue;
        }
        // in case of false positives
        // has false negatives, still working on it
        auto pt = c + n * r;
        for (auto j = 0; j < 6; j++) {
            if (j == i || j == i + MAP[i]) {
                continue;
            }
            const auto &test = frustum.planes[j];
            if (Vec3::dot(test->n, pt) < test->d) {
                return 0;
            }
        }
    }
    return 1;
}

bool sphereWithSphere(const Sphere &sphere0, const Sphere &sphere1) {
    auto r = sphere0.getRadius() + sphere1.getRadius();
    return sphere0.getCenter().distanceSquared(sphere1.getCenter()) < r * r;
}

bool sphereAABB(const Sphere &sphere, const AABB &aabb) {
    Vec3 pt;
    ptPointAabb(&pt, sphere.getCenter(), aabb);
    return sphere.getCenter().distanceSquared(pt) < sphere.getRadius() * sphere.getRadius();
}

bool sphereOBB(const Sphere &sphere, const OBB &obb) {
    Vec3 pt;
    ptPointObb(&pt, sphere.getCenter(), obb);
    return sphere.getCenter().distanceSquared(pt) < sphere.getRadius() * sphere.getRadius();
}

bool sphereCapsule(const Sphere &sphere, const Capsule &capsule) {
    auto r        = sphere.getRadius() + capsule.radius;
    auto squaredR = r * r;
    auto h        = capsule.ellipseCenter0.distanceSquared(capsule.ellipseCenter1);
    if (h == 0.0F) {
        return sphere.getCenter().distanceSquared(capsule.center) < squaredR;
    }
    auto v3Tmp0 = sphere.getCenter() - capsule.ellipseCenter0;
    auto v3Tmp1 = capsule.ellipseCenter1 - capsule.ellipseCenter0;
    auto t      = Vec3::dot(v3Tmp0, v3Tmp1) / h;
    if (t < 0) {
        return sphere.getCenter().distanceSquared(capsule.ellipseCenter0) < squaredR;
    }
    if (t > 1) {
        return sphere.getCenter().distanceSquared(capsule.ellipseCenter1) < squaredR;
    }
    v3Tmp0 = capsule.ellipseCenter0 + t * v3Tmp1;
    return sphere.getCenter().distanceSquared(v3Tmp0) < squaredR;
}

bool capsuleWithCapsule(const Capsule &capsuleA, const Capsule &capsuleB) {
    auto  u  = capsuleA.ellipseCenter1 - capsuleA.ellipseCenter0;
    auto  v  = capsuleB.ellipseCenter1 - capsuleB.ellipseCenter0;
    auto  w  = capsuleA.ellipseCenter0 - capsuleB.ellipseCenter0;
    auto  a  = Vec3::dot(u, u); // always >= 0
    auto  b  = Vec3::dot(u, v);
    auto  c  = Vec3::dot(v, v); // always >= 0
    auto  d  = Vec3::dot(u, w);
    auto  e  = Vec3::dot(v, w);
    auto  dd = a * c - b * b; // always >= 0
    float sN;
    float sD = dd; // sc = sN / sD, default sD = dd >= 0
    float tN;
    float tD = dd; // tc = tN / tD, default tD = dd >= 0

    // compute the line parameters of the two closest points
    if (dd < math::EPSILON) { // the lines are almost parallel
        sN = 0.0F;            // force using point P0 on segment S1
        sD = 1.0F;            // to prevent possible division by 0.0 later
        tN = e;
        tD = c;
    } else { // get the closest points on the infinite lines
        sN = (b * e - c * d);
        tN = (a * e - b * d);
        if (sN < 0.0F) { // sc < 0 => the s=0 edge is visible
            sN = 0.0F;
            tN = e;
            tD = c;
        } else if (sN > sD) { // sc > 1  => the s=1 edge is visible
            sN = sD;
            tN = e + b;
            tD = c;
        }
    }

    if (tN < 0.0F) { // tc < 0 => the t=0 edge is visible
        tN = 0.0F;
        // recompute sc for this edge
        if (-d < 0.0F) {
            sN = 0.0F;
        } else if (-d > a) {
            sN = sD;
        } else {
            sN = -d;
            sD = a;
        }
    } else if (tN > tD) { // tc > 1  => the t=1 edge is visible
        tN = tD;
        // recompute sc for this edge
        if ((-d + b) < 0.0F) {
            sN = 0.0F;
        } else if ((-d + b) > a) {
            sN = sD;
        } else {
            sN = (-d + b);
            sD = a;
        }
    }
    // finally do the division to get sc and tc
    auto sc = (std::abs(sN) < math::EPSILON ? 0.0F : sN / sD);
    auto tc = (std::abs(tN) < math::EPSILON ? 0.0F : tN / tD);

    // get the difference of the two closest points
    auto dP     = w;
    dP          = dP + u * sc;
    dP          = dP - v * tc;
    auto radius = capsuleA.radius + capsuleB.radius;
    return dP.lengthSquared() < radius * radius;
}

int dynObbFrustum(const OBB &obb, const Frustum &frustum) {
    if (frustum.getType() == ShapeEnum::SHAPE_FRUSTUM_ACCURATE) {
        return obbFrustumAccurate(obb, frustum);
    }
    return obbFrustum(obb, frustum);
}

int dynSphereFrustum(const Sphere &sphere, const Frustum &frustum) {
    if (frustum.getType() == ShapeEnum::SHAPE_FRUSTUM_ACCURATE) {
        return sphereFrustumAccurate(sphere, frustum);
    }
    return sphereFrustum(sphere, frustum);
}

int dynAabbFrustum(const AABB &aabb, const Frustum &frustum) {
    if (frustum.getType() == ShapeEnum::SHAPE_FRUSTUM_ACCURATE) {
        return aabbFrustumAccurate(aabb, frustum);
    }
    return aabbFrustum(aabb, frustum);
}

} // namespace geometry
} // namespace cc
