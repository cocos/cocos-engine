import { EPSILON } from './utils';

/**
 * Mathematical 2x2 matrix.
 */
class mat2 {
  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 1 row 0.
   * @param {Number} m03 - Value assigned to element at column 1 row 1.
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
    if (m00 instanceof Float32Array) {
        // deep copy
        if (m01) {
            this.m = new Float32Array(4);
            this.m.set(m00);
        } else {
            this.m = m00;
        }
    } else {
        this.m = new Float32Array(4);
        let m = this.m;
        /**
         * The element at column 0 row 0.
         * @type {number}
         * */
        m[0] = m00;

        /**
         * The element at column 0 row 1.
         * @type {number}
         * */
        m[1] = m01;

        /**
         * The element at column 1 row 0.
         * @type {number}
         * */
        m[2] = m02;

        /**
         * The element at column 1 row 1.
         * @type {number}
         * */
        m[3] = m03;
    }
  }

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 1 row 0.
   * @param {Number} m03 - Value assigned to element at column 1 row 1.
   * @returns {mat2} The newly created matrix.
   */
  static create(m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
    return new mat2(m00, m01, m02, m03);
  }

  /**
   * Clone a matrix.
   *
   * @param {mat2} a - Matrix to clone.
   * @returns {mat2} The newly created matrix.
   */
  static clone(a) {
    let am = a.m;
    return new mat2(am[0], am[1], am[2], am[3]);
  }

  /**
   * Copy content of a matrix into another.
   *
   * @param {mat2} out - Matrix to modified.
   * @param {mat2} a - The specified matrix.
   * @returns {mat2} out.
   */
  static copy(out, a) {
    out.m.set(a.m);
    return out;
  }

  /**
   * Sets a matrix as identity matrix.
   *
   * @param {mat2} out - Matrix to modified.
   * @returns {mat2} out.
   */
  static identity(out) {
    let outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 1;
    return out;
  }

  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {mat2} out - The matrix to modified.
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m10 - Value assigned to element at column 1 row 0.
   * @param {Number} m11 - Value assigned to element at column 1 row 1.
   * @returns {mat2} out.
   */
  static set(out, m00, m01, m10, m11) {
    let outm = out.m;
    outm[0] = m00;
    outm[1] = m01;
    outm[2] = m10;
    outm[3] = m11;
    return out;
  }


  /**
   * Transposes a matrix.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to transpose.
   * @returns {mat2} out.
   */
  static transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    let outm = out.m, am = a.m;
    if (out === a) {
      let a1 = am[1];
      outm[1] = am[2];
      outm[2] = a1;
    } else {
      outm[0] = am[0];
      outm[1] = am[2];
      outm[2] = am[1];
      outm[3] = am[3];
    }

    return out;
  }

  /**
   * Inverts a matrix.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to invert.
   * @returns {mat2} out.
   */
  static invert(out, a) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3];

    // Calculate the determinant
    let det = a0 * a3 - a2 * a1;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    outm[0] = a3 * det;
    outm[1] = -a1 * det;
    outm[2] = -a2 * det;
    outm[3] = a0 * det;

    return out;
  }

  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to calculate.
   * @returns {mat2} out.
   */
  static adjoint(out, a) {
    let outm = out.m, am = a.m;
    // Caching this value is nessecary if out == a
    let a0 = am[0];
    outm[0] = am[3];
    outm[1] = -am[1];
    outm[2] = -am[2];
    outm[3] = a0;

    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param {mat2} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   */
  static determinant(a) {
    let am = a.m;
    return am[0] * am[3] - am[2] * am[1];
  }

  /**
   * Multiply two matrices explicitly.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - The first operand.
   * @param {mat2} b - The second operand.
   * @returns {mat2} out.
   */
  static multiply(out, a, b) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3];
    let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3];
    outm[0] = a0 * b0 + a2 * b1;
    outm[1] = a1 * b0 + a3 * b1;
    outm[2] = a0 * b2 + a2 * b3;
    outm[3] = a1 * b2 + a3 * b3;
    return out;
  }

  /**
   * Alias of {@link mat2.multiply}.
   */
  static mul(out, a, b) {
    return mat2.multiply(out, a, b);
  }

  /**
   * Rotates a matrix by the given angle.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to rotate.
   * @param {Number} rad - The rotation angle.
   * @returns {mat2} out
   */
  static rotate(out, a, rad) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3],
      s = Math.sin(rad),
      c = Math.cos(rad);
    outm[0] = a0 * c + a2 * s;
    outm[1] = a1 * c + a3 * s;
    outm[2] = a0 * -s + a2 * c;
    outm[3] = a1 * -s + a3 * c;
    return out;
  }

  /**
   * Scales the matrix given by a scale vector.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to scale.
   * @param {vec2} v - The scale vector.
   * @returns {mat2} out
   **/
  static scale(out, a, v) {
    let am = a.m, outm = out.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3],
      v0 = v.x, v1 = v.y;
    outm[0] = a0 * v0;
    outm[1] = a1 * v0;
    outm[2] = a2 * v1;
    outm[3] = a3 * v1;
    return out;
  }

  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat2.set(dest, 1, 0, 0, 1);
   *     mat2.rotate(dest, dest, rad);
   *
   * @param {mat2} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat2} out.
   */
  static fromRotation(out, rad) {
    let outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad);
    outm[0] = c;
    outm[1] = s;
    outm[2] = -s;
    outm[3] = c;
    return out;
  }

  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat2.set(dest, 1, 0, 0, 1);
   *     mat2.scale(dest, dest, vec);
   *
   * @param {mat2} out - Matrix to store result.
   * @param {vec2} v - Scale vector.
   * @returns {mat2} out.
   */
  static fromScaling(out, v) {
    let outm = out.m;
    outm[0] = v.x;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = v.y;
    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param {mat2} a - The matrix.
   * @returns {String} String representation of this matrix.
   */
  static str(a) {
    let am = a.m;
    return `mat2(${am[0]}, ${am[1]}, ${am[2]}, ${am[3]})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param {array} out - Array to store result.
   * @param {mat2} m - The matrix.
   * @returns {Array} out.
   */
  static array(out, m) {
    let mm = m.m;
    out[0] = mm[0];
    out[1] = mm[1];
    out[2] = mm[2];
    out[3] = mm[3];

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {mat2} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   */
  static frob(a) {
    let am = a.m;
    return (Math.sqrt(Math.pow(am[0], 2) + Math.pow(am[1], 2) + Math.pow(am[2], 2) + Math.pow(am[3], 2)));
  }

  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix.
   * @param {mat2} L - The lower triangular matrix.
   * @param {mat2} D - The diagonal matrix.
   * @param {mat2} U - The upper triangular matrix.
   * @param {mat2} a - The input matrix to factorize.
   */
  static LDU(L, D, U, a) {
    let Lm = L.m, Um = U.m, am = a.m;
    Lm[2] = am[2] / am[0];
    Um[0] = am[0];
    Um[1] = am[1];
    Um[3] = am[3] - Lm[2] * Um[1];
  }

  /**
   * Adds two matrices.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - The first operand.
   * @param {mat2} b - The second operand.
   * @returns {mat2} out.
   */
  static add(out, a, b) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + bm[0];
    outm[1] = am[1] + bm[1];
    outm[2] = am[2] + bm[2];
    outm[3] = am[3] + bm[3];
    return out;
  }

  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - The first operand.
   * @param {mat2} b - The second operand.
   * @returns {mat2} out.
   */
  static subtract(out, a, b) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] - bm[0];
    outm[1] = am[1] - bm[1];
    outm[2] = am[2] - bm[2];
    outm[3] = am[3] - bm[3];
    return out;
  }

  /**
   * Alias of {@link mat2.subtract}.
   */
  static sub(out, a, b) {
    return mat2.subtract(out, a, b);
  }

  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {mat2} a - The first matrix.
   * @param {mat2} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    let am = a.m, bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3];
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {mat2} a - The first matrix.
   * @param {mat2} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let am = a.m, bm = b.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3];
    let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3];
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
    );
  }

  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {mat2} out.
   */
  static multiplyScalar(out, a, b) {
    let am = a.m, outm = out.m;
    outm[0] = am[0] * b;
    outm[1] = am[1] * b;
    outm[2] = am[2] * b;
    outm[3] = am[3] * b;
    return out;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {mat2} out - Matrix to store result.
   * @param {mat2} a - The first operand.
   * @param {mat2} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {mat2} out.
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + (bm[0] * scale);
    outm[1] = am[1] + (bm[1] * scale);
    outm[2] = am[2] + (bm[2] * scale);
    outm[3] = am[3] + (bm[3] * scale);
    return out;
  }
}

export default mat2;