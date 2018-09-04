import { vec3 } from '../vmath';

/**
 * @access public
 */
class triangle {
  constructor(ax, ay, az, bx, by, bz, cx, cy, cz) {
    this.a = vec3.create(ax, ay, az);
    this.b = vec3.create(bx, by, bz);
    this.c = vec3.create(cx, cy, cz);
  }

  /**
   * create a new triangle
   *
   * @return {triangle}
   */
  static create () {
    return new triangle(
      0, 0, 0,
      1, 0, 0,
      0, 1, 0
    );
  }

  /**
   * create a new triangle
   *
   * @param {Number} ax
   * @param {Number} ay
   * @param {Number} az
   * @param {Number} bx
   * @param {Number} by
   * @param {Number} bz
   * @param {Number} cx
   * @param {Number} cy
   * @param {Number} cz
   * @return {triangle}
   */
  static new (ax, ay, az, bx, by, bz, cx, cy, cz) {
    return new triangle(
      ax, ay, az,
      bx, by, bz,
      cx, cy, cz
    );
  }

  /**
   * clone a new triangle
   *
   * @param {triangle} t the source plane
   * @return {triangle}
   */
  static clone (t) {
    return new triangle(
      t.a.x, t.a.y, t.a.z,
      t.b.x, t.b.y, t.b.z,
      t.c.x, t.c.y, t.c.z
    );
  }

  /**
   * copy the values from one triangle to another
   *
   * @param {triangle} out the receiving triangle
   * @param {triangle} t the source triangle
   * @return {triangle}
   */
  static copy (out, t) {
    out.a.x = t.a.x;
    out.a.y = t.a.y;
    out.a.z = t.a.z;

    out.b.x = t.b.x;
    out.b.y = t.b.y;
    out.b.z = t.b.z;

    out.c.x = t.c.x;
    out.c.y = t.c.y;
    out.c.z = t.c.z;

    return out;
  }

  /**
   * Set the components of a triangle to the given values
   *
   * @param {triangle} out the receiving plane
   * @param {Number} ax X component of a
   * @param {Number} ay Y component of a
   * @param {Number} az Z component of a
   * @param {Number} bx X component of b
   * @param {Number} by Y component of b
   * @param {Number} bz Z component of b
   * @param {Number} cx X component of c
   * @param {Number} cy Y component of c
   * @param {Number} cz Z component of c
   * @returns {plane} out
   * @function
   */
  static set (out, ax, ay, az, bx, by, bz, cx, cy, cz) {
    out.a.x = ax;
    out.a.y = ay;
    out.a.z = az;

    out.b.x = bx;
    out.b.y = by;
    out.b.z = bz;

    out.c.x = cx;
    out.c.y = cy;
    out.c.z = cz;

    return out;
  }
}

export default triangle;