import enums from './enums';
import { vec3 } from '../vmath';

export default class line {
  constructor(sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
    this._type = enums.SHAPE_LINE;
    this.s = vec3.create(sx, sy, sz);
    this.e = vec3.create(ex, ey, ez);
  }

  /**
   * create a new line
   *
   * @param {number} sx start X component
   * @param {number} sy start Y component
   * @param {number} sz start Z component
   * @param {number} ex end X component
   * @param {number} ey end Y component
   * @param {number} ez end Z component
   * @return {line}
   */
  static create(sx, sy, sz, ex, ey, ez) {
    return new line(sx, sy, sz, ex, ey, ez);
  }

  /**
   * Creates a new line initialized with values from an existing line
   *
   * @param {line} a line to clone
   * @return {line} a new line
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
   * @return {line} out
   */
  static copy(out, a) {
    vec3.copy(out.s, a.s);
    vec3.copy(out.e, a.e);

    return out;
  }

  /**
   * create a line from two points
   *
   * @param {line} out the receiving line
   * @param {vec3} start line start
   * @param {vec3} end target position
   * @return {line} out
   */
  static fromPoints(out, start, end) {
    vec3.copy(out.s, start);
    vec3.copy(out.e, end);
    return out;
  }

  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {number} sx start X component
   * @param {number} sy start Y component
   * @param {number} sz start Z component
   * @param {number} ex end X component
   * @param {number} ey end Y component
   * @param {number} ez end Z component
   * @return {vec3} out
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
   * @return {number}
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
