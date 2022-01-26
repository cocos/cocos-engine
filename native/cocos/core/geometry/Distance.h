#pragma once

namespace cc {

class Mat4;
class Vec3;
namespace geometry {

class Plane;
class OBB;
class AABB;
/**
 * @en
 * the distance between a point and a plane
 * @zh
 * 计算点和平面之间的距离。
 * @param {Vec3} point 点。
 * @param {Plane} plane 平面。
 * @return 距离。
 */
float pointPlane(const Vec3 &point, const Plane &plane);

/**
 * @en
 * the closest point on plane to a given point
 * @zh
 * 计算平面上最接近给定点的点。
 * @param out 最近点。
 * @param point 给定点。
 * @param plane 平面。
 * @return 最近点。
 */
Vec3 *ptPointPlane(Vec3 *out, const Vec3 &point, const Plane &plane);

/**
 * @en
 * the closest point on aabb to a given point
 * @zh
 * 计算 aabb 上最接近给定点的点。
 * @param {Vec3} out 最近点。
 * @param {Vec3} point 给定点。
 * @param {AABB} aabb 轴对齐包围盒。
 * @return {Vec3} 最近点。
 */
Vec3 *ptPointAabb(Vec3 *out, const Vec3 &point, const AABB &aabb);

/**
 * @en
 * the closest point on obb to a given point
 * @zh
 * 计算 obb 上最接近给定点的点。
 * @param {Vec3} out 最近点。
 * @param {Vec3} point 给定点。
 * @param {OBB} obb 方向包围盒。
 * @return {Vec3} 最近点。
 */
Vec3 *ptPointObb(Vec3 *out, const Vec3 &point, const OBB &obb);

/**
 * @en
 * Calculate the nearest point on the line to the given point.
 * @zh
 * 计算给定点距离直线上最近的一点。
 * @param out 最近点
 * @param point 给定点
 * @param linePointA 线上的某点 A
 * @param linePointB 线上的某点 B
 */
Vec3 *ptPointLine(Vec3 *out, const Vec3 &point, const Vec3 &linePointA, const Vec3 &linePointB);

} // namespace geometry
} // namespace cc