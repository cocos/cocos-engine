import enums from './enums';
import { vec3 } from '../vmath';

export default class ray {
  constructor(ox = 0, oy = 0, oz = 0, dx = 0, dy = 0, dz = -1) {
    this._type = enums.SHAPE_RAY;
    this.o = vec3.create(ox, oy, oz);
    this.d = vec3.create(dx, dy, dz);
  }

  /**
   * create a new ray
   *
   * @param {number} ox origin X component
   * @param {number} oy origin Y component
   * @param {number} oz origin Z component
   * @param {number} dx dir X component
   * @param {number} dy dir Y component
   * @param {number} dz dir Z component
   * @return {ray}
   */
  static create(ox, oy, oz, dx, dy, dz) {
    return new ray(ox, oy, oz, dx, dy, dz);
  }

  /**
   * Creates a new ray initialized with values from an existing ray
   *
   * @param {ray} a ray to clone
   * @return {ray} a new ray
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
   * @return {ray} out
   */
  static copy(out, a) {
    vec3.copy(out.o, a.o);
    vec3.copy(out.d, a.d);

    return out;
  }

  /**
   * create a ray from two points
   *
   * @param {ray} out the receiving ray
   * @param {vec3} origin ray origin
   * @param {vec3} target target position
   * @return {ray} out
   */
  static fromPoints(out, origin, target) {
    vec3.copy(out.o, origin);
    vec3.normalize(out.d, vec3.sub(out.d, target, origin));
    return out;
  }

  /**
   * Set the components of a ray to the given values
   *
   * @param {ray} out the receiving ray
   * @param {number} ox origin X component
   * @param {number} oy origin Y component
   * @param {number} oz origin Z component
   * @param {number} dx dir X component
   * @param {number} dy dir Y component
   * @param {number} dz dir Z component
   * @return {ray} out
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
}
