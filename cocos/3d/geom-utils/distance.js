import { vec3 } from '../vmath';

/**
 * the distance of the point to plane
 *
 * @param {vec3} point
 * @param {plane} plane
 */
function point_plane(point, plane) {
  return vec3.dot(plane.n, point) - plane.d;
}

/**
 * the closest point of the point to plane
 *
 * @param {vec3} out the result point
 * @param {vec3} point
 * @param {plane} plane
 */
function pt_point_plane (out, point, plane) {
  let t = point_plane(point, plane);

  return vec3.sub(out, point, vec3.scale(out, plane.n, t));
}


/**
 * @name distance
 */
export default {
  point_plane,
  pt_point_plane,
};