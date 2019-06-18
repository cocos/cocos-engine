import { EPSILON } from './utils';

/**
 * Mathematical 2x3 matrix.
 *
 * A mat23 contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
class mat23 {
  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 -  Value assigned to element a.
   * @param {Number} m01 -  Value assigned to element b.
   * @param {Number} m02 -  Value assigned to element c.
   * @param {Number} m03 -  Value assigned to element d.
   * @param {Number} m04 -  Value assigned to element tx.
   * @param {Number} m05 -  Value assigned to element ty.
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 1, m04 = 0, m05 = 0) {
    if (m00 instanceof Float32Array) {
        // deep copy
        if (m01) {
            this.m = new Float32Array(6);
            this.m.set(m00);
        } else {
            this.m = m00;
        }
    } else {
        this.m = new Float32Array(6);
        let m = this.m;
        /**
         * The element a.
         * @type {number}
         * */
        m[0] = m00;

        /**
         * The element b.
         * @type {number}
         * */
        m[1] = m01;

        /**
         * The element c.
         * @type {number}
         * */
        m[2] = m02;

        /**
         * The element d.
         * @type {number}
         * */
        m[3] = m03;

        /**
         * The element tx.
         * @type {number}
         * */
        m[4] = m04;

        /**
         * The element ty.
         * @type {number}
         * */
        m[5] = m05;
    }
  }

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 -  Value assigned to element a.
   * @param {Number} m01 -  Value assigned to element b.
   * @param {Number} m02 -  Value assigned to element c.
   * @param {Number} m03 -  Value assigned to element d.
   * @param {Number} m04 -  Value assigned to element tx.
   * @param {Number} m05 -  Value assigned to element ty.
   * @returns {mat23} The newly created matrix.
   */
  static create(m00 = 1, m01 = 0, m02 = 0, m03 = 1, m04 = 0, m05 = 0) {
    return new mat23(m00, m01, m02, m03, m04, m05);
  }

  /**
   * Clone a matrix.
   *
   * @param {mat23} a - Matrix to clone.
   * @returns {mat23} The newly created matrix.
   */
  static clone(a) {
    let am = a.m;
    return new mat23(
      am[0], am[1],
      am[2], am[3],
      am[4], am[5]
    );
  }

  /**
   * Copy content of a matrix into another.
   *
   * @param {mat23} out - Matrix to modified.
   * @param {mat23} a - The specified matrix.
   * @returns {mat23} out.
   */
  static copy(out, a) {
    out.m.set(a.m);
    return out;
  }

  /**
   * Sets a matrix as identity matrix.
   *
   * @param {mat23} out - Matrix to modified.
   * @returns {mat23} out.
   */
  static identity(out) {
    let outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 1;
    outm[4] = 0;
    outm[5] = 0;
    return out;
  }

  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {mat23} out - The matrix to modified.
   * @param {Number} a - Value assigned to element a.
   * @param {Number} b - Value assigned to element b.
   * @param {Number} c - Value assigned to element c.
   * @param {Number} d - Value assigned to element d.
   * @param {Number} tx - Value assigned to element tx.
   * @param {Number} ty - Value assigned to element ty.
   * @returns {mat23} out.
   */
  static set(out, a, b, c, d, tx, ty) {
    let outm = out.m;
    outm[0] = a;
    outm[1] = b;
    outm[2] = c;
    outm[3] = d;
    outm[4] = tx;
    outm[5] = ty;
    return out;
  }

  /**
   * Inverts a matrix.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - Matrix to invert.
   * @returns {mat23} out.
   */
  static invert(out, a) {
    let am = a.m, outm = out.m;
    let aa = am[0], ab = am[1], ac = am[2], ad = am[3],
      atx = am[4], aty = am[5];

    let det = aa * ad - ab * ac;
    if (!det) {
      return null;
    }
    det = 1.0 / det;

    outm[0] = ad * det;
    outm[1] = -ab * det;
    outm[2] = -ac * det;
    outm[3] = aa * det;
    outm[4] = (ac * aty - ad * atx) * det;
    outm[5] = (ab * atx - aa * aty) * det;
    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param {mat23} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   */
  static determinant(a) {
    let am = a.m;
    return am[0] * am[3] - am[1] * am[2];
  }

  /**
   * Multiply two matrices explicitly.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - The first operand.
   * @param {mat23} b - The second operand.
   * @returns {mat23} out.
   */
  static multiply(out, a, b) {
    let am = a.m, bm = b.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3], a4 = am[4], a5 = am[5],
      b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3], b4 = bm[4], b5 = bm[5];
    outm[0] = a0 * b0 + a2 * b1;
    outm[1] = a1 * b0 + a3 * b1;
    outm[2] = a0 * b2 + a2 * b3;
    outm[3] = a1 * b2 + a3 * b3;
    outm[4] = a0 * b4 + a2 * b5 + a4;
    outm[5] = a1 * b4 + a3 * b5 + a5;
    return out;
  }

  /**
   * Alias of {@link mat23.multiply}.
   */
  static mul(out, a, b) {
    return mat23.multiply(out, a, b);
  }

  /**
   * Rotates a matrix by the given angle.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - Matrix to rotate.
   * @param {Number} rad - The rotation angle.
   * @returns {mat23} out
   */
  static rotate(out, a, rad) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3], a4 = am[4], a5 = am[5],
      s = Math.sin(rad),
      c = Math.cos(rad);
    outm[0] = a0 * c + a2 * s;
    outm[1] = a1 * c + a3 * s;
    outm[2] = a0 * -s + a2 * c;
    outm[3] = a1 * -s + a3 * c;
    outm[4] = a4;
    outm[5] = a5;
    return out;
  }

  /**
   * Multiply a matrix with a scale matrix given by a scale vector.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - Matrix to multiply.
   * @param {vec2} v - The scale vector.
   * @returns {mat23} out
   **/
  static scale(out, a, v) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3], a4 = am[4], a5 = am[5],
      v0 = v.x, v1 = v.y;
    outm[0] = a0 * v0;
    outm[1] = a1 * v0;
    outm[2] = a2 * v1;
    outm[3] = a3 * v1;
    outm[4] = a4;
    outm[5] = a5;
    return out;
  }

  /**
   * Multiply a matrix with a translation matrix given by a translation offset.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - Matrix to multiply.
   * @param {vec2} v - The translation offset.
   * @returns {mat23} out.
   */
  static translate(out, a, v) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3], a4 = am[4], a5 = am[5],
      v0 = v.x, v1 = v.y;
    outm[0] = a0;
    outm[1] = a1;
    outm[2] = a2;
    outm[3] = a3;
    outm[4] = a0 * v0 + a2 * v1 + a4;
    outm[5] = a1 * v0 + a3 * v1 + a5;
    return out;
  }

  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.rotate(dest, dest, rad);
   *
   * @param {mat23} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat23} out.
   */
  static fromRotation(out, rad) {
    let outm = out.m;
    let s = Math.sin(rad), c = Math.cos(rad);
    outm[0] = c;
    outm[1] = s;
    outm[2] = -s;
    outm[3] = c;
    outm[4] = 0;
    outm[5] = 0;
    return out;
  }

  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.scale(dest, dest, vec);
   *
   * @param {mat23} out - Matrix to store result.
   * @param {vec2} v - Scale vector.
   * @returns {mat23} out.
   */
  static fromScaling(out, v) {
    let vm = v.m, outm = out.m;
    outm[0] = vm[0];
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = vm[1];
    outm[4] = 0;
    outm[5] = 0;
    return out;
  }

  /**
   * Creates a matrix from a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.translate(dest, dest, vec);
   *
   * @param {mat23} out - Matrix to store result.
   * @param {vec2} v - The translation offset.
   * @returns {mat23} out.
   */
  static fromTranslation(out, v) {
    let outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 1;
    outm[4] = v.x;
    outm[5] = v.y;
    return out;
  }

  /**
   * Creates a matrix from a rotation, translation offset and scale vector.
   * This is equivalent to (but faster than):
   *
   *     mat23.identity(dest);
   *     mat23.translate(dest, vec);
   *     let tmp = mat23.create();
   *     mat23.fromRotation(tmp, rot);
   *     mat23.multiply(dest, dest, tmp);
   *     mat23.fromScaling(tmp, scale);
   *     mat23.multiply(dest, dest, tmp);
   *
   * @param {mat23} out - Matrix to store result.
   * @param {number} r - Rotation radian.
   * @param {vec2} t - Translation offset.
   * @param {vec2} s - Scale vector.
   * @returns {mat23} out.
   */
  static fromRTS(out, r, t, s) {
    let outm = out.m;
    let sr = Math.sin(r), cr = Math.cos(r);
    outm[0] = cr * s.x;
    outm[1] = sr * s.x;
    outm[2] = -sr * s.y;
    outm[3] = cr * s.y;
    outm[4] = t.x;
    outm[5] = t.y;
    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param {mat23} a - The matrix.
   * @returns {String} String representation of this matrix.
   */
  static str(a) {
    let am = a.m;
    return `mat23(${am[0]}, ${am[1]}, ${am[2]}, ${am[3]}, ${am[4]}, ${am[5]})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param {array} out - Array to store result.
   * @param {mat23} m - The matrix.
   * @returns {Array} out.
   */
  static array(out, m) {
    let mm = m.m;
    out[0] = mm[0];
    out[1] = mm[1];
    out[2] = mm[2];
    out[3] = mm[3];
    out[4] = mm[4];
    out[5] = mm[5];

    return out;
  }

  /**
   * Store elements of a matrix into 16 floats array.
   *
   * @param {array} out
   * @param {mat23} m
   * @returns {array}
   */
  static array4x4(out, m) {
    let mm = m.m;
    out[0] = mm[0];
    out[1] = mm[1];
    out[2] = 0;
    out[3] = 0;
    out[4] = mm[2];
    out[5] = mm[3];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = mm[4];
    out[13] = mm[5];
    out[14] = 0;
    out[15] = 1;

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {mat23} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   */
  static frob(a) {
    let am = a.m;
    return (Math.sqrt(Math.pow(am[0], 2) + Math.pow(am[1], 2) + Math.pow(am[2], 2) + Math.pow(am[3], 2) + Math.pow(am[4], 2) + Math.pow(am[5], 2) + 1));
  }

  /**
   * Adds two matrices.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - The first operand.
   * @param {mat23} b - The second operand.
   * @returns {mat23} out.
   */
  static add(out, a, b) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + bm[0];
    outm[1] = am[1] + bm[1];
    outm[2] = am[2] + bm[2];
    outm[3] = am[3] + bm[3];
    outm[4] = am[4] + bm[4];
    outm[5] = am[5] + bm[5];
    return out;
  }

  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - The first operand.
   * @param {mat23} b - The second operand.
   * @returns {mat23} out.
   */
  static subtract(out, a, b) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] - bm[0];
    outm[1] = am[1] - bm[1];
    outm[2] = am[2] - bm[2];
    outm[3] = am[3] - bm[3];
    outm[4] = am[4] - bm[4];
    outm[5] = am[5] - bm[5];
    return out;
  }

  /**
   * Alias of {@link mat23.subtract}.
   */
  static sub(out, a, b) {
    return mat23.subtract(out, a, b);
  }

  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {mat23} out.
   */
  static multiplyScalar(out, a, b) {
    let am = a.m, outm = out.m;
    outm[0] = am[0] * b;
    outm[1] = am[1] * b;
    outm[2] = am[2] * b;
    outm[3] = am[3] * b;
    outm[4] = am[4] * b;
    outm[5] = am[5] * b;
    return out;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {mat23} out - Matrix to store result.
   * @param {mat23} a - The first operand.
   * @param {mat23} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {mat23} out.
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + (bm[0] * scale);
    outm[1] = am[1] + (bm[1] * scale);
    outm[2] = am[2] + (bm[2] * scale);
    outm[3] = am[3] + (bm[3] * scale);
    outm[4] = am[4] + (bm[4] * scale);
    outm[5] = am[5] + (bm[5] * scale);
    return out;
  }

  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {mat23} a - The first matrix.
   * @param {mat23} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    let am = a.m, bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5];
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {mat23} a - The first matrix.
   * @param {mat23} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let am = a.m, bm = b.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3], a4 = am[4], a5 = am[5];
    let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3], b4 = bm[4], b5 = bm[5];
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
      Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
      Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
    );
  }
}

export default mat23;