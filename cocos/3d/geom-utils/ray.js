import { vec3 } from '../vmath';

/**
 * @access public
 */
class ray {
  constructor(ox, oy, oz, dx, dy, dz) {
    this.o = vec3.create(ox, oy, oz);
    this.d = vec3.create(dx, dy, dz);
  }

  /**
   * create a new ray
   *
   * @return {ray}
   */
  static create() {
    return new ray(0, 0, 0, 0, 0, -1);
  }

  /**
   * create a new ray
   *
   * @param {Number} ox origin X component
   * @param {Number} oy origin Y component
   * @param {Number} oz origin Z component
   * @param {Number} dx dir X component
   * @param {Number} dy dir Y component
   * @param {Number} dz dir Z component
   * @return {ray}
   */
  static new(ox, oy, oz, dx, dy, dz) {
    return new ray(ox, oy, oz, dx, dy, dz);
  }

  /**
   * Creates a new ray initialized with values from an existing ray
   *
   * @param {ray} a ray to clone
   * @returns {ray} a new ray
   */
  static clone(a) {
    return new ray(
      a.o.x, a.o.y, a.o.z,
      a.d.x, a.d.y, a.d.z
    );
  }

  /**
   * Copy the values from one ray to another
   *
   * @param {ray} out the receiving ray
   * @param {ray} a the source ray
   * @returns {ray} out
   */
  static copy(out, a) {
    out.o.x = a.o.x;
    out.o.y = a.o.y;
    out.o.z = a.o.z;
    out.d.x = a.d.x;
    out.d.y = a.d.y;
    out.d.z = a.d.z;

    return out;
  }

  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} ox origin X component
   * @param {Number} oy origin Y component
   * @param {Number} oz origin Z component
   * @param {Number} dx dir X component
   * @param {Number} dy dir Y component
   * @param {Number} dz dir Z component
   * @returns {vec3} out
   */
  static set(out, ox, oy, oz, dx, dy, dz) {
    out.o.x = ox;
    out.o.y = oy;
    out.o.z = oz;
    out.d.x = dx;
    out.d.y = dy;
    out.d.z = dz;

    return out;
  }

  /**
   * create ray from 2 points
   *
   * @param {ray} out the receiving plane
   * @param {vec3} origin
   * @param {vec3} lookAt
   * @returns {ray} out
   * @function
   */
  static fromPoints(out, origin, lookAt) {
    vec3.copy(out.o, origin);
    vec3.normalize(out.d, vec3.sub(out.d, lookAt, origin));

    return out;
  }
}

export default ray;