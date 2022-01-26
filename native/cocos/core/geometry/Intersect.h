#pragma once

#include "base/Macros.h"

#include <array>
#include "core/assets/RenderingSubMesh.h"
#include "core/geometry/Distance.h"
#include "core/geometry/Enums.h"
#include "core/geometry/Frustum.h"
#include "core/geometry/Spec.h"

#include "renderer/gfx-base/GFXDef.h"

#include <cmath>

namespace cc {

class Vec3;
class Mat3;

namespace scene {
class Model;
}

namespace geometry {

class Ray;
class Plane;
class OBB;
class AABB;
class Line;
class Frustum;
class Sphere;
class Triangle;
class Capsule;

/**
 * @en
 * ray-plane intersect detect.
 * @zh
 * 射线与平面的相交性检测。
 * @param {Ray} ray 射线
 * @param {Plane} plane 平面
 * @return {number} 0 或 非0
 */
float rayPlane(const Ray &ray, const Plane &plane);

// based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/
/**
 * @en
 * ray-triangle intersect detect.
 * @zh
 * 射线与三角形的相交性检测。
 * @param {Ray} ray 射线
 * @param {Triangle} triangle 三角形
 * @param {boolean} doubleSided 三角形是否为双面
 * @return {number} 0 或 非0
 */
float rayTriangle(const Ray &ray, const Triangle &triangle, bool doubleSided = false);
/**
 * @en
 * ray-sphere intersect detect.
 * @zh
 * 射线和球的相交性检测。
 * @param {Ray} ray 射线
 * @param {Sphere} sphere 球
 * @return {number} 0 或 非0
 */
float raySphere(const Ray &ray, const Sphere &sphere);

float rayAABB2(const Ray &ray, const Vec3 &min, const Vec3 &max);

/**
 * @en
 * ray-aabb intersect detect.
 * @zh
 * 射线和轴对齐包围盒的相交性检测。
 * @param {Ray} ray 射线
 * @param {AABB} aabb 轴对齐包围盒
 * @return {number} 0 或 非0
 */
float rayAABB(const Ray &ray, const AABB &aabb);

/**
 * @en
 * ray-obb intersect detect.
 * @zh
 * 射线和方向包围盒的相交性检测。
 * @param {Ray} ray 射线
 * @param {OBB} obb 方向包围盒
 * @return {number} 0 或 非0
 */
float rayOBB(const Ray &ray, const OBB &obb);

/**
 * @en
 * ray-capsule intersect detect.
 * @zh
 * 射线和胶囊体的相交性检测。
 * @param {Ray} ray 射线
 * @param {Capsule} capsule 胶囊体
 * @return {number} 0 或 非0
 */
float rayCapsule(const Ray &ray, const Capsule &capsule);

/**
 * @en
 * ray-subMesh intersect detect, in model space.
 * @zh
 * 在模型空间中，射线和子三角网格的相交性检测。
 * @param {Ray} ray
 * @param {RenderingSubMesh} subMesh
 * @param {IRaySubMeshOptions} options
 * @return {number} 0 or !0
 */
float raySubMesh(const Ray &ray, const RenderingSubMesh &submesh, IRaySubMeshOptions *options = nullptr);

/**
 * @en
 * ray-mesh intersect detect, in model space.
 * @zh
 * 在模型空间中，射线和三角网格资源的相交性检测。
 * @param {Ray} ray
 * @param {Mesh} mesh
 * @param {IRayMeshOptions} options
 * @return {number} 0 or !0
 */
float rayMesh(const Ray &ray, const Mesh &mesh, IRayMeshOptions *option);

/**
 * @en
 * ray-model intersect detect, in world space.
 * @zh
 * 在世界空间中，射线和渲染模型的相交性检测。
 * @param ray
 * @param model
 * @param options
 * @return 0 or !0
 */
float rayModel(const Ray &ray, const scene::Model &model, IRayModelOptions *option);

/**
 * @en
 * line-plane intersect detect.
 * @zh
 * 线段与平面的相交性检测。
 * @param {line} line 线段
 * @param {Plane} plane 平面
 * @return {number} 0 或 非0
 */
float linePlane(const Line &line, const Plane &plane);
/**
 * @en
 * line-triangle intersect detect.
 * @zh
 * 线段与三角形的相交性检测。
 * @param {line} line 线段
 * @param {Triangle} triangle 三角形
 * @param {Vec3} outPt 可选，相交点
 * @return {number} 0 或 非0
 */
int lineTriangle(const Line &line, const Triangle &triangle, Vec3 *outPt = nullptr);

/**
 * @en
 * line-aabb intersect detect.
 * @zh
 * 线段与轴对齐包围盒的相交性检测
 * @param line 线段
 * @param aabb 轴对齐包围盒
 * @return {number} 0 或 非0
 */
float lineAABB(const Line &line, const AABB &aabb);

/**
 * @en
 * line-obb intersect detect.
 * @zh
 * 线段与方向包围盒的相交性检测
 * @param line 线段
 * @param obb 方向包围盒
 * @return {number} 0 或 非0
 */
float lineOBB(const Line &line, const OBB &obb);

/**
 * @en
 * line-sphere intersect detect.
 * @zh
 * 线段与球的相交性检测
 * @param line 线段
 * @param sphere 球
 * @return {number} 0 或 非0
 */
float lineSphere(const Line &line, const Sphere &sphere);

/**
 * @en
 * aabb-aabb intersect detect.
 * @zh
 * 轴对齐包围盒和轴对齐包围盒的相交性检测。
 * @param {AABB} aabb1 轴对齐包围盒1
 * @param {AABB} aabb2 轴对齐包围盒2
 * @return {number} 0 或 非0
 */
bool aabbWithAABB(const AABB &aabb1, const AABB &aabb2);

/**
 * @en
 * aabb-obb intersect detect.
 * @zh
 * 轴对齐包围盒和方向包围盒的相交性检测。
 * @param {AABB} aabb 轴对齐包围盒
 * @param {OBB} obb 方向包围盒
 * @return {number} 0 或 非0
 */
int aabbWithOBB(const AABB &aabb, const OBB &obb);

/**
 * @en
 * aabb-plane intersect detect.
 * @zh
 * 轴对齐包围盒和平面的相交性检测。
 * @param {AABB} aabb 轴对齐包围盒
 * @param {Plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
int aabbPlane(const AABB &aabb, const Plane &plane);
/**
 * @en
 * aabb-frustum intersect detect, faster but has false positive corner cases.
 * @zh
 * 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
 * @param {AABB} aabb 轴对齐包围盒
 * @param {Frustum} frustum 锥台
 * @return {number} 0 或 非0
 */
int aabbFrustum(const AABB &aabb, const Frustum &frustum);

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
/**
 * @en
 * aabb-frustum intersect, handles most of the false positives correctly.
 * @zh
 * 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @param {AABB} aabb 轴对齐包围盒
 * @param {Frustum} frustum 锥台
 * @return {number}
 */
int aabbFrustumAccurate(const AABB &aabb, const Frustum &frustum);

/**
 * @en
 * obb contains the point.
 * @zh
 * 方向包围盒和点的相交性检测。
 * @param {OBB} obb 方向包围盒
 * @param {Vec3} point 点
 * @return {boolean} true or false
 */
bool obbPoint(const OBB &obb, const Vec3 &point);

/**
 * @en
 * obb-plane intersect detect.
 * @zh
 * 方向包围盒和平面的相交性检测。
 * @param {OBB} obb 方向包围盒
 * @param {Plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
int obbPlane(const OBB &obb, const Plane &plane);

/**
 * @en
 * obb-frustum intersect, faster but has false positive corner cases.
 * @zh
 * 方向包围盒和锥台相交性检测，速度快，但有错误情况。
 * @param {OBB} obb 方向包围盒
 * @param {Frustum} frustum 锥台
 * @return {number} 0 或 非0
 */
int obbFrustum(const OBB &obb, const Frustum &frustum);

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
/**
 * @en
 * obb-frustum intersect, handles most of the false positives correctly.
 * @zh
 * 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @param {OBB} obb 方向包围盒
 * @param {Frustum} frustum 锥台
 * @return {number} 0 或 非0
 */
int obbFrustumAccurate(const OBB &obb, const Frustum &frustum);

/**
 * @en
 * obb-obb intersect detect.
 * @zh
 * 方向包围盒和方向包围盒的相交性检测。
 * @param {OBB} obb1 方向包围盒1
 * @param {OBB} obb2 方向包围盒2
 * @return {number} 0 或 非0
 */
int obbWithOBB(const OBB &obb1, const OBB &obb2);

// https://github.com/diku-dk/bvh-tvcg18/blob/1fd3348c17bc8cf3da0b4ae60fdb8f2aa90a6ff0/FOUNDATION/GEOMETRY/GEOMETRY/include/overlap/geometry_overlap_obb_capsule.h
/**
 * @en
 * obb-capsule intersect detect.
 * @zh
 * 方向包围盒和胶囊体的相交性检测。
 * @param obb 方向包围盒
 * @param capsule 胶囊体
 */
int obbCapsule(const OBB &obb, const Capsule &capsule);

/**
 * @en
 * sphere-plane intersect, not necessarily faster than obb-plane,due to the length calculation of the
 * plane normal to factor out the unnomalized plane distance.
 * @zh
 * 球与平面的相交性检测。
 * @param {Sphere} sphere 球
 * @param {Plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
int spherePlane(const Sphere &sphere, const Plane &plane);
/**
 * @en
 * sphere-frustum intersect, faster but has false positive corner cases.
 * @zh
 * 球和锥台的相交性检测，速度快，但有错误情况。
 * @param {Sphere} sphere 球
 * @param {Frustum} frustum 锥台
 * @return {number} 0 或 非0
 */
int sphereFrustum(const Sphere &sphere, const Frustum &frustum);

// https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases
/**
 * @en
 * sphere-frustum intersect, handles the false positives correctly.
 * @zh
 * 球和锥台的相交性检测，正确处理大多数错误情况。
 * @param {Sphere} sphere 球
 * @param {Frustum} frustum 锥台
 * @return {number} 0 或 非0
 */
int sphereFrustumAccurate(const Sphere &sphere, const Frustum &frustum);

/**
 * @en
 * sphere-sphere intersect detect.
 * @zh
 * 球和球的相交性检测。
 * @param {Sphere} sphere0 球0
 * @param {Sphere} sphere1 球1
 * @return {boolean} true or false
 */
bool sphereWithSphere(const Sphere &sphere0, const Sphere &sphere1);
/**
 * @en
 * sphere-aabb intersect detect.
 * @zh
 * 球和轴对齐包围盒的相交性检测。
 * @param {Sphere} sphere 球
 * @param {AABB} aabb 轴对齐包围盒
 * @return {boolean} true or false
 */
bool sphereAABB(const Sphere &sphere, const AABB &aabb);

/**
 * @en
 * sphere-obb intersect detect.
 * @zh
 * 球和方向包围盒的相交性检测。
 * @param {Sphere} sphere 球
 * @param {OBB} obb 方向包围盒
 * @return {boolean} true or false
 */
bool sphereOBB(const Sphere &sphere, const OBB &obb);

/**
 * @en
 * sphere-capsule intersect detect.
 * @zh
 * 球和胶囊体的相交性检测。
 */
bool sphereCapsule(const Sphere &sphere, const Capsule &capsule);

// http://www.geomalgorithms.com/a07-_distance.html
/**
 * @en
 * capsule-capsule intersect detect.
 * @zh
 * 胶囊体和胶囊体的相交性检测。
 */
bool capsuleWithCapsule(const Capsule &capsuleA, const Capsule &capsuleB);

template <typename T1, typename T2>
auto intersects(const T1 & /*a*/, const T2 & /*b*/) {
    static_assert(std::is_base_of<T1, ShapeBase>::value, "type is not base of ShapeBase");
    static_assert(std::is_base_of<T2, ShapeBase>::value, "type is not base of ShapeBase");
    assert(false); // mismatch
}

#define DECLARE_EXCHANGABLE_INTERSECT(TYPE1, TYPE2, FN)            \
    template <>                                                    \
    inline auto intersects(const TYPE1 &arg1, const TYPE2 &arg2) { \
        return FN(arg1, arg2);                                     \
    }                                                              \
    template <>                                                    \
    inline auto intersects(const TYPE2 &arg2, const TYPE1 &arg1) { \
        return FN(arg1, arg2);                                     \
    }

#define DECLARE_SELF_INTERSECT(TYPE, FN)                         \
    template <>                                                  \
    inline auto intersects(const TYPE &arg1, const TYPE &arg2) { \
        return FN(arg1, arg2);                                   \
    }

int dynObbFrustum(const OBB &obb, const Frustum &frustum);
int dynSphereFrustum(const Sphere &sphere, const Frustum &frustum);
int dynAabbFrustum(const AABB &aabb, const Frustum &frustum);

DECLARE_EXCHANGABLE_INTERSECT(Ray, Sphere, raySphere)
DECLARE_EXCHANGABLE_INTERSECT(Ray, AABB, rayAABB)
DECLARE_EXCHANGABLE_INTERSECT(Ray, OBB, rayOBB)
DECLARE_EXCHANGABLE_INTERSECT(Ray, Plane, rayPlane)
DECLARE_EXCHANGABLE_INTERSECT(Ray, Triangle, rayTriangle)
DECLARE_EXCHANGABLE_INTERSECT(Ray, Capsule, rayCapsule)

DECLARE_EXCHANGABLE_INTERSECT(Line, Sphere, lineSphere)
DECLARE_EXCHANGABLE_INTERSECT(Line, AABB, lineAABB)
DECLARE_EXCHANGABLE_INTERSECT(Line, OBB, lineOBB)
DECLARE_EXCHANGABLE_INTERSECT(Line, Plane, linePlane)
DECLARE_EXCHANGABLE_INTERSECT(Line, Triangle, lineTriangle)

DECLARE_SELF_INTERSECT(Sphere, sphereWithSphere)
DECLARE_EXCHANGABLE_INTERSECT(Sphere, AABB, sphereAABB)
DECLARE_EXCHANGABLE_INTERSECT(Sphere, OBB, sphereOBB)
DECLARE_EXCHANGABLE_INTERSECT(Sphere, Plane, spherePlane)
DECLARE_EXCHANGABLE_INTERSECT(Sphere, Frustum, dynSphereFrustum)
DECLARE_EXCHANGABLE_INTERSECT(Sphere, Capsule, sphereCapsule)

DECLARE_SELF_INTERSECT(AABB, aabbWithAABB)
DECLARE_EXCHANGABLE_INTERSECT(AABB, OBB, aabbWithOBB)
DECLARE_EXCHANGABLE_INTERSECT(AABB, Plane, aabbPlane)
DECLARE_EXCHANGABLE_INTERSECT(AABB, Frustum, dynAabbFrustum)

DECLARE_SELF_INTERSECT(OBB, obbWithOBB)
DECLARE_EXCHANGABLE_INTERSECT(OBB, Plane, obbPlane)
DECLARE_EXCHANGABLE_INTERSECT(OBB, Frustum, dynObbFrustum)
DECLARE_EXCHANGABLE_INTERSECT(OBB, Capsule, obbCapsule)

DECLARE_SELF_INTERSECT(Capsule, capsuleWithCapsule)

#undef DECLARE_SELF_INTERSECT
#undef DECLARE_EXCHANGABLE_INTERSECT

} // namespace geometry
} // namespace cc