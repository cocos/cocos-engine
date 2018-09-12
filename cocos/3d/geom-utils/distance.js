import { vec3 } from '../vmath';

/**
 * the distance between a point and a plane
 *
 * @param {vec3} point
 * @param {plane} plane
 * @return {number}
 */
function point_plane(point, plane) {
  return vec3.dot(plane.n, point) - plane.d;
}

/**
 * the closest point on plane to a given point
 *
 * @param {vec3} out the result point
 * @param {vec3} point
 * @param {plane} plane
 * @return {vec3}
 */
function pt_point_plane(out, point, plane) {
  let t = point_plane(point, plane);
  return vec3.sub(out, point, vec3.scale(out, plane.n, t));
}

/**
 * the closest point on aabb to a given point
 *
 * @param {vec3} out the result point
 * @param {vec3} point
 * @param {aabb} aabb
 * @return {vec3}
 */
let pt_point_aabb = (function () {
  let min = vec3.create();
  let max = vec3.create();
  return function pt_point_aabb(out, point, aabb) {
    vec3.set(out, point);
    vec3.sub(min, aabb.center, aabb.halfExtents);
    vec3.add(max, aabb.center, aabb.halfExtents);
    
    out.x = (out.x < min.x) ? min.x : out.x;
    out.y = (out.y < min.x) ? min.y : out.y;
    out.z = (out.z < min.x) ? min.z : out.z;

    out.x = (out.x > max.x) ? max.x : out.x;
    out.y = (out.y > max.x) ? max.y : out.y;
    out.z = (out.z > max.x) ? max.z : out.z;
    return out;
  };
})();

/**
 * the closest point on obb to a given point
 *
 * @param {vec3} out the result point
 * @param {vec3} point
 * @param {obb} obb
 * @return {vec3}
 */
let pt_point_obb = (function () {
  let X = vec3.create();
  let Y = vec3.create();
  let Z = vec3.create();
  let d = vec3.create();
  let u = new Array(3);
  let e = new Array(3);

  return function (out, point, obb) {
    vec3.set(X, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
    vec3.set(Y, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
    vec3.set(Z, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

    u[0] = X;
    u[1] = Y;
    u[2] = Z;
    e[0] = obb.halfExtents.x;
    e[1] = obb.halfExtents.y;
    e[2] = obb.halfExtents.z;

    vec3.sub(d, point, obb.center);

    //Start result at center of obb; make steps from there
    vec3.set(out, obb.center.x, obb.center.y, obb.center.z);

    //For each OBB axis...
    for (let i = 0; i < 3; i++) {

      //...project d onto that axis to get the distance
      //along the axis of d from the obb center
      let dist = vec3.dot(d, u[i]);

      //if distance farther than the obb extents, clamp to the obb
      if (dist > e[i]) {
        dist = e[i];
      }
      if (dist < -e[i]) {
        dist = -e[i];
      }

      //Step that distance along the axis to get world coordinate
      out.x += dist * u[i].x;
      out.y += dist * u[i].y;
      out.z += dist * u[i].z;
    }
    return out;
  };
})();

/**
 * @name distance
 */
export default {
  point_plane,
  
  pt_point_aabb,
  pt_point_obb,
  pt_point_plane,
};