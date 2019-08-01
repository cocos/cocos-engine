/**
 * @category gemotry-utils
 */

import { plane } from '.';
import { vec3 } from '../../core/vmath';
import aabb from './aabb';
import obb from './obb';
const X = vec3.create();
const Y = vec3.create();
const Z = vec3.create();
const d = vec3.create();
const min = vec3.create();
const max = vec3.create();
const u = new Array(3);
const e = new Array(3);

/**
 * @en
 * the distance between a point and a plane
 * @zh
 * 计算点和平面之间的距离。
 * @param {vec3} point 点。
 * @param {plane} plane 平面。
 * @return 距离。
 */
export function point_plane (point: vec3, plane_: plane) {
    return vec3.dot(plane_.n, point) - plane_.d;
}

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
export function pt_point_plane (out: vec3, point: vec3, plane_: plane) {
    const t = point_plane(point, plane_);
    return vec3.subtract(out, point, vec3.scale(out, plane_.n, t));
}

/**
 * @en
 * the closest point on aabb to a given point
 * @zh
 * 计算 aabb 上最接近给定点的点。
 * @param {vec3} out 最近点。
 * @param {vec3} point 给定点。
 * @param {aabb} aabb 轴对齐包围盒。
 * @return {vec3} 最近点。
 */
export function pt_point_aabb (out: vec3, point: vec3, aabb_: aabb): vec3 {
    vec3.copy(out, point);
    vec3.subtract(min, aabb_.center, aabb_.halfExtents);
    vec3.add(max, aabb_.center, aabb_.halfExtents);

    out.x = (out.x < min.x) ? min.x : out.x;
    out.y = (out.y < min.x) ? min.y : out.y;
    out.z = (out.z < min.x) ? min.z : out.z;

    out.x = (out.x > max.x) ? max.x : out.x;
    out.y = (out.y > max.x) ? max.y : out.y;
    out.z = (out.z > max.x) ? max.z : out.z;
    return out;
}

/**
 * @en
 * the closest point on obb to a given point
 * @zh
 * 计算 obb 上最接近给定点的点。
 * @param {vec3} out 最近点。
 * @param {vec3} point 给定点。
 * @param {obb} obb 方向包围盒。
 * @return {vec3} 最近点。
 */
export function pt_point_obb (out: vec3, point: vec3, obb_: obb): vec3 {
    vec3.set(X, obb_.orientation.m00, obb_.orientation.m01, obb_.orientation.m02);
    vec3.set(Y, obb_.orientation.m03, obb_.orientation.m04, obb_.orientation.m05);
    vec3.set(Z, obb_.orientation.m06, obb_.orientation.m07, obb_.orientation.m08);

    u[0] = X;
    u[1] = Y;
    u[2] = Z;
    e[0] = obb_.halfExtents.x;
    e[1] = obb_.halfExtents.y;
    e[2] = obb_.halfExtents.z;

    vec3.subtract(d, point, obb_.center);

    // Start result at center of obb; make steps from there
    vec3.set(out, obb_.center.x, obb_.center.y, obb_.center.z);

    // For each OBB axis...
    for (let i = 0; i < 3; i++) {

        // ...project d onto that axis to get the distance
        // along the axis of d from the obb center
        let dist = vec3.dot(d, u[i]);

        // if distance farther than the obb extents, clamp to the obb
        if (dist > e[i]) {
            dist = e[i];
        }
        if (dist < -e[i]) {
            dist = -e[i];
        }

        // Step that distance along the axis to get world coordinate
        out.x += dist * u[i].x;
        out.y += dist * u[i].y;
        out.z += dist * u[i].z;
    }
    return out;
}
