import { vec3 } from '../vmath';

/**
 * @access public
 */
class line {
  constructor(sx, sy, sz, ex, ey, ez) {
    this.s = vec3.create(sx, sy, sz);
    this.e = vec3.create(ex, ey, ez);
  }
  /**
 * create a new line
 *
 * @return {line}
 */
  static create() {
    return new line(0, 0, 0, 0, 0, -1);
  }

  /**
   * create a new line
   *
   * @param {Number} sx start X component
   * @param {Number} sy start Y component
   * @param {Number} sz start Z component
   * @param {Number} ex end X component
   * @param {Number} ey end Y component
   * @param {Number} ez end Z component
   * @return {line}
   */
  static new(sx, sy, sz, ex, ey, ez) {
    return new line(sx, sy, sz, ex, ey, ez);
  }

  /**
   * Creates a new line initialized with values from an existing line
   *
   * @param {line} a line to clone
   * @returns {line} a new line
   */
  static clone(a) {
    return new line(
      a.s.x, a.s.y, a.s.z,
      a.e.x, a.e.y, a.e.z
    );
  }

  /**
   * Copy the values from one line to another
   *
   * @param {line} out the receiving line
   * @param {line} a the source line
   * @returns {line} out
   */
  static copy(out, a) {
    out.s.x = a.s.x;
    out.s.y = a.s.y;
    out.s.z = a.s.z;
    out.e.x = a.e.x;
    out.e.y = a.e.y;
    out.e.z = a.e.z;

    return out;
  }

  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} sx start X component
   * @param {Number} sy start Y component
   * @param {Number} sz start Z component
   * @param {Number} ex end X component
   * @param {Number} ey end Y component
   * @param {Number} ez end Z component
   * @returns {vec3} out
   */
  static set(out, sx, sy, sz, ex, ey, ez) {
    out.s.x = sx;
    out.s.y = sy;
    out.s.z = sz;
    out.e.x = ex;
    out.e.y = ey;
    out.e.z = ez;

    return out;
  }

  /**
   * create line from 2 points
   *
   * @param {line} line
   * @returns {number}
   */
  static magnitude(line) {
    return vec3.distance(line.s, line.e);
  }

  /**
   *Alias of {@link line.magnitude}.
   */
  static mag(line) {
    return line.magnitude(line);
  }
}

export default line;