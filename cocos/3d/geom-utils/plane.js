import enums from './enums';
import { vec3 } from '../vmath';

let v1 = vec3.create(0, 0, 0);
let v2 = vec3.create(0, 0, 0);

export default class plane {
  constructor(nx = 0, ny = 1, nz = 0, d = 0) {
    this._type = enums.SHAPE_PLANE;
    this.n = vec3.create(nx, ny, nz);
    this.d = d;
  }

  /**
   * create a new plane
   *
   * @param {number} nx normal X component
   * @param {number} ny normal Y component
   * @param {number} nz normal Z component
   * @param {number} d distance to the origin
   * @return {plane}
   */
  static create(nx, ny, nz, d) {
    return new plane(nx, ny, nz, d);
  }

  /**
   * clone a new plane
   *
   * @param {plane} p a the source plane
   * @return {plane}
   */
  static clone(p) {
    return new plane(p.n.x, p.n.y, p.n.z, p.d);
  }

  /**
   * copy the values from one plane to another
   *
   * @param {plane} out the receiving plane
   * @param {plane} p the source plane
   * @return {plane}
   */
  static copy(out, p) {
    vec3.copy(out.n, p.n);
    out.d = p.d;

    return out;
  }

  /**
   * create a plane from three points
   *
   * @param {plane} out the receiving plane
   * @param {vec3} a
   * @param {vec3} b
   * @param {vec3} c
   * @return {plane}
   */
  static fromPoints(out, a, b, c) {
    vec3.sub(v1, b, a);
    vec3.sub(v2, c, a);

    vec3.normalize(out.n, vec3.cross(out.n, v1, v2));
    out.d = vec3.dot(out.n, a);

    return out;
  }

  /**
   * Set the components of a plane to the given values
   *
   * @param {plane} out the receiving plane
   * @param {number} nx X component of n
   * @param {number} ny Y component of n
   * @param {number} nz Z component of n
   * @param {number} d
   * @return {plane} out
   */
  static set(out, nx, ny, nz, d) {
    out.n.x = nx;
    out.n.y = ny;
    out.n.z = nz;
    out.d = d;

    return out;
  }

  /**
   * create plane from normal and point
   *
   * @param {plane} out the receiving plane
   * @param {vec3} normal
   * @param {vec3} point
   * @return {plane} out
   */
  static fromNormalAndPoint(out, normal, point) {
    vec3.copy(out.n, normal);
    out.d = vec3.dot(normal, point);

    return out;
  }

  /**
 * normalize a plane
 *
 * @param {plane} out the receiving plane
 * @param {plane} a plane to normalize
 * @return {plane} out
 */
  static normalize(out, a) {
    let len = vec3.magnitude(a.n);
    vec3.normalize(out.n, a.n);
    if (len > 0) {
      out.d = a.d / len;
    }
    return out;
  }
}
