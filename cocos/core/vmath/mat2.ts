import { EPSILON } from './utils';

/**
 * Mathematical 2x2 matrix.
 */
class mat2 {
  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param m00 - Value assigned to element at column 0 row 0.
   * @param m01 - Value assigned to element at column 0 row 1.
   * @param m02 - Value assigned to element at column 1 row 0.
   * @param m03 - Value assigned to element at column 1 row 1.
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
    /**
     * The element at column 0 row 0.
     * @type {number}
     * */
    this.m00 = m00;

    /**
     * The element at column 0 row 1.
     * @type {number}
     * */
    this.m01 = m01;

    /**
     * The element at column 1 row 0.
     * @type {number}
     * */
    this.m02 = m02;

    /**
     * The element at column 1 row 1.
     * @type {number}
     * */
    this.m03 = m03;
  }

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param m00 - Value assigned to element at column 0 row 0.
   * @param m01 - Value assigned to element at column 0 row 1.
   * @param m02 - Value assigned to element at column 1 row 0.
   * @param m03 - Value assigned to element at column 1 row 1.
   * @return The newly created matrix.
   */
  static create(m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
    return new mat2(m00, m01, m02, m03);
  }

  /**
   * Clone a matrix.
   *
   * @param a - Matrix to clone.
   * @return The newly created matrix.
   */
  static clone(a) {
    return new mat2(a.m00, a.m01, a.m02, a.m03);
  }

  /**
   * Copy content of a matrix into another.
   *
   * @param out - Matrix to modified.
   * @param a - The specified matrix.
   * @return out.
   */
  static copy(out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m03;
    return out;
  }

  /**
   * Sets a matrix as identity matrix.
   *
   * @param out - Matrix to modified.
   * @return out.
   */
  static identity(out) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 1;
    return out;
  }

  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param out - The matrix to modified.
   * @param m00 - Value assigned to element at column 0 row 0.
   * @param m01 - Value assigned to element at column 0 row 1.
   * @param m10 - Value assigned to element at column 1 row 0.
   * @param m11 - Value assigned to element at column 1 row 1.
   * @return out.
   */
  static set(out, m00, m01, m10, m11) {
    out.m00 = m00;
    out.m01 = m01;
    out.m02 = m10;
    out.m03 = m11;
    return out;
  }


  /**
   * Transposes a matrix.
   *
   * @param out - Matrix to store result.
   * @param a - Matrix to transpose.
   * @return out.
   */
  static transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a1 = a.m01;
      out.m01 = a.m02;
      out.m02 = a1;
    } else {
      out.m00 = a.m00;
      out.m01 = a.m02;
      out.m02 = a.m01;
      out.m03 = a.m03;
    }

    return out;
  }

  /**
   * Inverts a matrix.
   *
   * @param out - Matrix to store result.
   * @param a - Matrix to invert.
   * @return out.
   */
  static invert(out, a) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;

    // Calculate the determinant
    let det = a0 * a3 - a2 * a1;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out.m00 = a3 * det;
    out.m01 = -a1 * det;
    out.m02 = -a2 * det;
    out.m03 = a0 * det;

    return out;
  }

  /**
   * Calculates the adjugate of a matrix.
   *
   * @param out - Matrix to store result.
   * @param a - Matrix to calculate.
   * @return out.
   */
  static adjoint(out, a) {
    // Caching this value is nessecary if out == a
    let a0 = a.m00;
    out.m00 = a.m03;
    out.m01 = -a.m01;
    out.m02 = -a.m02;
    out.m03 = a0;

    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param a - Matrix to calculate.
   * @return Determinant of a.
   */
  static determinant(a) {
    return a.m00 * a.m03 - a.m02 * a.m01;
  }

  /**
   * Multiply two matrices explicitly.
   *
   * @param out - Matrix to store result.
   * @param a - The first operand.
   * @param b - The second operand.
   * @return out.
   */
  static multiply(out, a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
    out.m00 = a0 * b0 + a2 * b1;
    out.m01 = a1 * b0 + a3 * b1;
    out.m02 = a0 * b2 + a2 * b3;
    out.m03 = a1 * b2 + a3 * b3;
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
   * @param out - Matrix to store result.
   * @param a - Matrix to rotate.
   * @param rad - The rotation angle.
   * @return out
   */
  static rotate(out, a, rad) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      s = Math.sin(rad),
      c = Math.cos(rad);
    out.m00 = a0 * c + a2 * s;
    out.m01 = a1 * c + a3 * s;
    out.m02 = a0 * -s + a2 * c;
    out.m03 = a1 * -s + a3 * c;
    return out;
  }

  /**
   * Scales the matrix given by a scale vector.
   *
   * @param out - Matrix to store result.
   * @param a - Matrix to scale.
   * @param v - The scale vector.
   * @return out
   **/
  static scale(out, a, v) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      v0 = v.x, v1 = v.y;
    out.m00 = a0 * v0;
    out.m01 = a1 * v0;
    out.m02 = a2 * v1;
    out.m03 = a3 * v1;
    return out;
  }

  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat2.set(dest, 1, 0, 0, 1);
   *     mat2.rotate(dest, dest, rad);
   *
   * @param out - Matrix to store result.
   * @param rad - The rotation angle.
   * @return out.
   */
  static fromRotation(out, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad);
    out.m00 = c;
    out.m01 = s;
    out.m02 = -s;
    out.m03 = c;
    return out;
  }

  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat2.set(dest, 1, 0, 0, 1);
   *     mat2.scale(dest, dest, vec);
   *
   * @param out - Matrix to store result.
   * @param v - Scale vector.
   * @return out.
   */
  static fromScaling(out, v) {
    out.m00 = v.x;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = v.y;
    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param a - The matrix.
   * @return String representation of this matrix.
   */
  static str(a) {
    return `mat2(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param out - Array to store result.
   * @param m - The matrix.
   * @return out.
   */
  static array(out, m) {
    out[0] = m.m00;
    out[1] = m.m01;
    out[2] = m.m02;
    out[3] = m.m03;

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param a - Matrix to calculate Frobenius norm of.
   * @return - The frobenius norm.
   */
  static frob(a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2)));
  }

  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix.
   * @param L - The lower triangular matrix.
   * @param D - The diagonal matrix.
   * @param U - The upper triangular matrix.
   * @param a - The input matrix to factorize.
   */
  static LDU(L, D, U, a) {
    L.m02 = a.m02 / a.m00;
    U.m00 = a.m00;
    U.m01 = a.m01;
    U.m03 = a.m03 - L.m02 * U.m01;
  }

  /**
   * Adds two matrices.
   *
   * @param out - Matrix to store result.
   * @param a - The first operand.
   * @param b - The second operand.
   * @return out.
   */
  static add(out, a, b) {
    out.m00 = a.m00 + b.m00;
    out.m01 = a.m01 + b.m01;
    out.m02 = a.m02 + b.m02;
    out.m03 = a.m03 + b.m03;
    return out;
  }

  /**
   * Subtracts matrix b from matrix a.
   *
   * @param out - Matrix to store result.
   * @param a - The first operand.
   * @param b - The second operand.
   * @return out.
   */
  static subtract(out, a, b) {
    out.m00 = a.m00 - b.m00;
    out.m01 = a.m01 - b.m01;
    out.m02 = a.m02 - b.m02;
    out.m03 = a.m03 - b.m03;
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
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @return True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03;
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @return True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
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
   * @param out - Matrix to store result.
   * @param a - Matrix to scale
   * @param b - The scale number.
   * @return out.
   */
  static multiplyScalar(out, a, b) {
    out.m00 = a.m00 * b;
    out.m01 = a.m01 * b;
    out.m02 = a.m02 * b;
    out.m03 = a.m03 * b;
    return out;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param out - Matrix to store result.
   * @param a - The first operand.
   * @param b - The second operand.
   * @param scale - The scale number.
   * @return out.
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    out.m00 = a.m00 + (b.m00 * scale);
    out.m01 = a.m01 + (b.m01 * scale);
    out.m02 = a.m02 + (b.m02 * scale);
    out.m03 = a.m03 + (b.m03 * scale);
    return out;
  }
}

export default mat2;