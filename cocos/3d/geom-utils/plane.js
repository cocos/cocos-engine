import { vec3 } from '../vmath';

/**
 * @access public
 */
class plane {
  constructor(nx, ny, nz, d) {
    this.n = vec3.create(nx, ny, nz);
    this.d = d;
  }

  /**
   * create a new plane
   *
   * @return {plane}
   */
  static create() {
    return new plane(0, 1, 0, 0);
  }

  /**
   * create a new plane
   *
   * @param {Number} nx normal X component
   * @param {Number} ny normal Y component
   * @param {Number} nz normal Z component
   * @param {Number} d the constant d
   * @return {plane}
   */
  static new(nx, ny, nz, d) {
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
    out.n.x = p.n.x;
    out.n.y = p.n.y;
    out.n.z = p.n.z;
    out.d = p.d;

    return out;
  }

  /**
   * Set the components of a plane to the given values
   *
   * @param {plane} out the receiving plane
   * @param {Number} nx X component of n
   * @param {Number} ny Y component of n
   * @param {Number} nz Z component of n
   * @param {Number} d
   * @returns {plane} out
   * @function
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
   * @returns {plane} out
   * @function
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
 * @returns {plane} out
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

/**
 * create plane from 3 points
 *
 * @param {plane} out the receiving plane
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @returns {plane} out
 * @function
 */
plane.fromPoints = (function () {
  let v1 = vec3.create(0, 0, 0);
  let v2 = vec3.create(0, 0, 0);

  return function (out, a, b, c) {
    vec3.sub(v1, b, a);
    vec3.sub(v2, c, a);

    vec3.normalize(out.n, vec3.cross(out.n, v1, v2));
    out.d = vec3.dot(out.n, a);

    return out;
  };
})();

export default plane;
