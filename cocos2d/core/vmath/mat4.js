import { EPSILON } from './utils';

/**
 * Mathematical 4x4 matrix.
 *
 * NOTE: we use column-major matrix for all matrix calculation.
 *
 * This may lead to some confusion when referencing OpenGL documentation,
 * however, which represents out all matricies in column-major format.
 * This means that while in code a matrix may be typed out as:
 *
 * [1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  x, y, z, 0]
 *
 * The same matrix in the [OpenGL documentation](https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glTranslate.xml)
 * is written as:
 *
 *  1 0 0 x
 *  0 1 0 y
 *  0 0 1 z
 *  0 0 0 0
 *
 * Please rest assured, however, that they are the same thing!
 * This is not unique to glMatrix, either, as OpenGL developers have long been confused by the
 * apparent lack of consistency between the memory layout and the documentation.
 */
class mat4 {
  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 0 row 3.
   * @param {Number} m04 - Value assigned to element at column 1 row 0.
   * @param {Number} m05 - Value assigned to element at column 1 row 1.
   * @param {Number} m06 - Value assigned to element at column 1 row 2.
   * @param {Number} m07 - Value assigned to element at column 1 row 3.
   * @param {Number} m08 - Value assigned to element at column 2 row 0.
   * @param {Number} m09 - Value assigned to element at column 2 row 1.
   * @param {Number} m10 - Value assigned to element at column 2 row 2.
   * @param {Number} m11 - Value assigned to element at column 2 row 3.
   * @param {Number} m12 - Value assigned to element at column 3 row 0.
   * @param {Number} m13 - Value assigned to element at column 3 row 1.
   * @param {Number} m14 - Value assigned to element at column 3 row 2.
   * @param {Number} m15 - Value assigned to element at column 3 row 3.
   */
  constructor(
    m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    m04 = 0, m05 = 1, m06 = 0, m07 = 0,
    m08 = 0, m09 = 0, m10 = 1, m11 = 0,
    m12 = 0, m13 = 0, m14 = 0, m15 = 1
  ) {
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
     * The element at column 0 row 2.
     * @type {number}
     * */
    this.m02 = m02;

    /**
     * The element at column 0 row 3.
     * @type {number}
     * */
    this.m03 = m03;

    /**
     * The element at column 1 row 0.
     * @type {number}
     * */
    this.m04 = m04;

    /**
     * The element at column 1 row 1.
     * @type {number}
     * */
    this.m05 = m05;

    /**
     * The element at column 1 row 2.
     * @type {number}
     * */
    this.m06 = m06;

    /**
     * The element at column 1 row 3.
     * @type {number}
     * */
    this.m07 = m07;

    /**
     * The element at column 2 row 0.
     * @type {number}
     * */
    this.m08 = m08;

    /**
     * The element at column 2 row 1.
     * @type {number}
     * */
    this.m09 = m09;

    /**
     * The element at column 2 row 2.
     * @type {number}
     * */
    this.m10 = m10;

    /**
     * The element at column 2 row 3.
     * @type {number}
     * */
    this.m11 = m11;

    /**
     * The element at column 3 row 0.
     * @type {number}
     * */
    this.m12 = m12;

    /**
     * The element at column 3 row 1.
     * @type {number}
     * */
    this.m13 = m13;

    /**
     * The element at column 3 row 2.
     * @type {number}
     * */
    this.m14 = m14;

    /**
     * The element at column 3 row 3.
     * @type {number}
     * */
    this.m15 = m15;
  }

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 0 row 3.
   * @param {Number} m04 - Value assigned to element at column 1 row 0.
   * @param {Number} m05 - Value assigned to element at column 1 row 1.
   * @param {Number} m06 - Value assigned to element at column 1 row 2.
   * @param {Number} m07 - Value assigned to element at column 1 row 3.
   * @param {Number} m08 - Value assigned to element at column 2 row 0.
   * @param {Number} m09 - Value assigned to element at column 2 row 1.
   * @param {Number} m10 - Value assigned to element at column 2 row 2.
   * @param {Number} m11 - Value assigned to element at column 2 row 3.
   * @param {Number} m12 - Value assigned to element at column 3 row 0.
   * @param {Number} m13 - Value assigned to element at column 3 row 1.
   * @param {Number} m14 - Value assigned to element at column 3 row 2.
   * @param {Number} m15 - Value assigned to element at column 3 row 3.
   * @returns {mat4} The newly created matrix.
   */
  static create(
    m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    m04 = 0, m05 = 1, m06 = 0, m07 = 0,
    m08 = 0, m09 = 0, m10 = 1, m11 = 0,
    m12 = 0, m13 = 0, m14 = 0, m15 = 1
  ) {
    return new mat4(
      m00, m01, m02, m03,
      m04, m05, m06, m07,
      m08, m09, m10, m11,
      m12, m13, m14, m15);
  }

  /**
   * Clone a matrix.
   *
   * @param {mat4} a - Matrix to clone.
   * @returns {mat4} The newly created matrix.
   */
  static clone(a) {
    return new mat4(
      a.m00, a.m01, a.m02, a.m03,
      a.m04, a.m05, a.m06, a.m07,
      a.m08, a.m09, a.m10, a.m11,
      a.m12, a.m13, a.m14, a.m15
    );
  }

  /**
   * Copy content of a matrix into another.
   *
   * @param {mat4} out - Matrix to modified.
   * @param {mat4} a - The specified matrix.
   * @returns {mat4} out.
   */
  static copy(out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m03;
    out.m04 = a.m04;
    out.m05 = a.m05;
    out.m06 = a.m06;
    out.m07 = a.m07;
    out.m08 = a.m08;
    out.m09 = a.m09;
    out.m10 = a.m10;
    out.m11 = a.m11;
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
    return out;
  }

  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {mat4} out - The matrix to modified.
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 0 row 3.
   * @param {Number} m10 - Value assigned to element at column 1 row 0.
   * @param {Number} m11 - Value assigned to element at column 1 row 1.
   * @param {Number} m12 - Value assigned to element at column 1 row 2.
   * @param {Number} m13 - Value assigned to element at column 1 row 3.
   * @param {Number} m20 - Value assigned to element at column 2 row 0.
   * @param {Number} m21 - Value assigned to element at column 2 row 1.
   * @param {Number} m22 - Value assigned to element at column 2 row 2.
   * @param {Number} m23 - Value assigned to element at column 2 row 3.
   * @param {Number} m30 - Value assigned to element at column 3 row 0.
   * @param {Number} m31 - Value assigned to element at column 3 row 1.
   * @param {Number} m32 - Value assigned to element at column 3 row 2.
   * @param {Number} m33 - Value assigned to element at column 3 row 3.
   * @returns {mat4} out.
   */
  static set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out.m00 = m00;
    out.m01 = m01;
    out.m02 = m02;
    out.m03 = m03;
    out.m04 = m10;
    out.m05 = m11;
    out.m06 = m12;
    out.m07 = m13;
    out.m08 = m20;
    out.m09 = m21;
    out.m10 = m22;
    out.m11 = m23;
    out.m12 = m30;
    out.m13 = m31;
    out.m14 = m32;
    out.m15 = m33;
    return out;
  }


  /**
   * Sets a matrix as identity matrix.
   *
   * @param {mat4} out - Matrix to modified.
   * @returns {mat4} out.
   */
  static identity(out) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = 1;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = 1;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Transposes a matrix.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to transpose.
   * @returns {mat4} out.
   */
  static transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a01 = a.m01, a02 = a.m02, a03 = a.m03,
        a12 = a.m06, a13 = a.m07,
        a23 = a.m11;

      out.m01 = a.m04;
      out.m02 = a.m08;
      out.m03 = a.m12;
      out.m04 = a01;
      out.m06 = a.m09;
      out.m07 = a.m13;
      out.m08 = a02;
      out.m09 = a12;
      out.m11 = a.m14;
      out.m12 = a03;
      out.m13 = a13;
      out.m14 = a23;
    } else {
      out.m00 = a.m00;
      out.m01 = a.m04;
      out.m02 = a.m08;
      out.m03 = a.m12;
      out.m04 = a.m01;
      out.m05 = a.m05;
      out.m06 = a.m09;
      out.m07 = a.m13;
      out.m08 = a.m02;
      out.m09 = a.m06;
      out.m10 = a.m10;
      out.m11 = a.m14;
      out.m12 = a.m03;
      out.m13 = a.m07;
      out.m14 = a.m11;
      out.m15 = a.m15;
    }

    return out;
  }

  /**
   * Inverts a matrix.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to invert.
   * @returns {mat4} out.
   */
  static invert(out, a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }

  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to calculate.
   * @returns {mat4} out.
   */
  static adjoint(out, a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

    out.m00 = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out.m01 = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out.m02 = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out.m03 = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out.m04 = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out.m05 = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out.m06 = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out.m07 = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out.m08 = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out.m09 = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out.m10 = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out.m11 = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out.m12 = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out.m13 = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out.m14 = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out.m15 = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param {mat4} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   */
  static determinant(a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  /**
   * Multiply two matrices explicitly.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - The first operand.
   * @param {mat4} b - The second operand.
   * @returns {mat4} out.
   */
  static multiply(out, a, b) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

    // Cache only the current line of the second matrix
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
    out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b.m04; b1 = b.m05; b2 = b.m06; b3 = b.m07;
    out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b.m08; b1 = b.m09; b2 = b.m10; b3 = b.m11;
    out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b.m12; b1 = b.m13; b2 = b.m14; b3 = b.m15;
    out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }

  /**
   * Alias of {@link mat4.multiply}.
   */
  static mul(out, a, b) {
    return mat4.multiply(out, a, b);
  }

  /**
   * Multiply a matrix with a translation matrix given by a translation offset.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {vec3} v - The translation offset.
   * @returns {mat4} out.
   */
  static translate(out, a, v) {
    let x = v.x, y = v.y, z = v.z,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23;

    if (a === out) {
      out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
      out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
      out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
      out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
    } else {
      a00 = a.m00; a01 = a.m01; a02 = a.m02; a03 = a.m03;
      a10 = a.m04; a11 = a.m05; a12 = a.m06; a13 = a.m07;
      a20 = a.m08; a21 = a.m09; a22 = a.m10; a23 = a.m11;

      out.m00 = a00; out.m01 = a01; out.m02 = a02; out.m03 = a03;
      out.m04 = a10; out.m05 = a11; out.m06 = a12; out.m07 = a13;
      out.m08 = a20; out.m09 = a21; out.m10 = a22; out.m11 = a23;

      out.m12 = a00 * x + a10 * y + a20 * z + a.m12;
      out.m13 = a01 * x + a11 * y + a21 * z + a.m13;
      out.m14 = a02 * x + a12 * y + a22 * z + a.m14;
      out.m15 = a03 * x + a13 * y + a23 * z + a.m15;
    }

    return out;
  }

  /**
   * Multiply a matrix with a scale matrix given by a scale vector.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {vec3} v - The scale vector.
   * @returns {mat4} out
   **/
  static scale(out, a, v) {
    let x = v.x, y = v.y, z = v.z;

    out.m00 = a.m00 * x;
    out.m01 = a.m01 * x;
    out.m02 = a.m02 * x;
    out.m03 = a.m03 * x;
    out.m04 = a.m04 * y;
    out.m05 = a.m05 * y;
    out.m06 = a.m06 * y;
    out.m07 = a.m07 * y;
    out.m08 = a.m08 * z;
    out.m09 = a.m09 * z;
    out.m10 = a.m10 * z;
    out.m11 = a.m11 * z;
    out.m12 = a.m12;
    out.m13 = a.m13;
    out.m14 = a.m14;
    out.m15 = a.m15;
    return out;
  }

  /**
   * Multiply a matrix with a rotation matrix denotes by the rotation around arbitrary axis.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {Number} rad - The rotation angle.
   * @param {vec3} axis - The rotation axis.
   * @returns {mat4} out.
   */
  static rotate(out, a, rad, axis) {
    let x = axis.x, y = axis.y, z = axis.z;
    let s, c, t,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      b00, b01, b02,
      b10, b11, b12,
      b20, b21, b22;

    let len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a.m00; a01 = a.m01; a02 = a.m02; a03 = a.m03;
    a10 = a.m04; a11 = a.m05; a12 = a.m06; a13 = a.m07;
    a20 = a.m08; a21 = a.m09; a22 = a.m10; a23 = a.m11;

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out.m00 = a00 * b00 + a10 * b01 + a20 * b02;
    out.m01 = a01 * b00 + a11 * b01 + a21 * b02;
    out.m02 = a02 * b00 + a12 * b01 + a22 * b02;
    out.m03 = a03 * b00 + a13 * b01 + a23 * b02;
    out.m04 = a00 * b10 + a10 * b11 + a20 * b12;
    out.m05 = a01 * b10 + a11 * b11 + a21 * b12;
    out.m06 = a02 * b10 + a12 * b11 + a22 * b12;
    out.m07 = a03 * b10 + a13 * b11 + a23 * b12;
    out.m08 = a00 * b20 + a10 * b21 + a20 * b22;
    out.m09 = a01 * b20 + a11 * b21 + a21 * b22;
    out.m10 = a02 * b20 + a12 * b21 + a22 * b22;
    out.m11 = a03 * b20 + a13 * b21 + a23 * b22;

    // If the source and destination differ, copy the unchanged last row
    if (a !== out) {
      out.m12 = a.m12;
      out.m13 = a.m13;
      out.m14 = a.m14;
      out.m15 = a.m15;
    }

    return out;
  }

  /**
   * Multiply a matrix with a rotation matrix denotes by the rotation around x-axis.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static rotateX(out, a, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a10 = a.m04,
      a11 = a.m05,
      a12 = a.m06,
      a13 = a.m07,
      a20 = a.m08,
      a21 = a.m09,
      a22 = a.m10,
      a23 = a.m11;

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      out.m00 = a.m00;
      out.m01 = a.m01;
      out.m02 = a.m02;
      out.m03 = a.m03;
      out.m12 = a.m12;
      out.m13 = a.m13;
      out.m14 = a.m14;
      out.m15 = a.m15;
    }

    // Perform axis-specific matrix multiplication
    out.m04 = a10 * c + a20 * s;
    out.m05 = a11 * c + a21 * s;
    out.m06 = a12 * c + a22 * s;
    out.m07 = a13 * c + a23 * s;
    out.m08 = a20 * c - a10 * s;
    out.m09 = a21 * c - a11 * s;
    out.m10 = a22 * c - a12 * s;
    out.m11 = a23 * c - a13 * s;

    return out;
  }

  /**
   * Multiply a matrix with a rotation matrix denotes by the rotation around y-axis.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static rotateY(out, a, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a.m00,
      a01 = a.m01,
      a02 = a.m02,
      a03 = a.m03,
      a20 = a.m08,
      a21 = a.m09,
      a22 = a.m10,
      a23 = a.m11;

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      out.m04 = a.m04;
      out.m05 = a.m05;
      out.m06 = a.m06;
      out.m07 = a.m07;
      out.m12 = a.m12;
      out.m13 = a.m13;
      out.m14 = a.m14;
      out.m15 = a.m15;
    }

    // Perform axis-specific matrix multiplication
    out.m00 = a00 * c - a20 * s;
    out.m01 = a01 * c - a21 * s;
    out.m02 = a02 * c - a22 * s;
    out.m03 = a03 * c - a23 * s;
    out.m08 = a00 * s + a20 * c;
    out.m09 = a01 * s + a21 * c;
    out.m10 = a02 * s + a22 * c;
    out.m11 = a03 * s + a23 * c;

    return out;
  }

  /**
   * Multiply a matrix with a rotation matrix denotes by the rotation around z-axis.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to multiply.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static rotateZ(out, a, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = a.m00,
      a01 = a.m01,
      a02 = a.m02,
      a03 = a.m03,
      a10 = a.m04,
      a11 = a.m05,
      a12 = a.m06,
      a13 = a.m07;

    // If the source and destination differ, copy the unchanged last row
    if (a !== out) {
      out.m08 = a.m08;
      out.m09 = a.m09;
      out.m10 = a.m10;
      out.m11 = a.m11;
      out.m12 = a.m12;
      out.m13 = a.m13;
      out.m14 = a.m14;
      out.m15 = a.m15;
    }

    // Perform axis-specific matrix multiplication
    out.m00 = a00 * c + a10 * s;
    out.m01 = a01 * c + a11 * s;
    out.m02 = a02 * c + a12 * s;
    out.m03 = a03 * c + a13 * s;
    out.m04 = a10 * c - a00 * s;
    out.m05 = a11 * c - a01 * s;
    out.m06 = a12 * c - a02 * s;
    out.m07 = a13 * c - a03 * s;

    return out;
  }

  /**
   * Create a translation matrix from a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {vec3} v - The translation offset.
   * @returns {mat4} out.
   */
  static fromTranslation(out, v) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = 1;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = 1;
    out.m11 = 0;
    out.m12 = v.x;
    out.m13 = v.y;
    out.m14 = v.z;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a scale matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {vec3} v - The scale vector.
   * @returns {mat4} out.
   */
  static fromScaling(out, v) {
    out.m00 = v.x;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = v.y;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = v.z;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a rotation matrix from the rotation around arbitrary axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @param {vec3} axis - The rotation axis.
   * @returns {mat4} out.
   */
  static fromRotation(out, rad, axis) {
    let x = axis.x, y = axis.y, z = axis.z;
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;

    if (Math.abs(len) < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    // Perform rotation-specific matrix multiplication
    out.m00 = x * x * t + c;
    out.m01 = y * x * t + z * s;
    out.m02 = z * x * t - y * s;
    out.m03 = 0;
    out.m04 = x * y * t - z * s;
    out.m05 = y * y * t + c;
    out.m06 = z * y * t + x * s;
    out.m07 = 0;
    out.m08 = x * z * t + y * s;
    out.m09 = y * z * t - x * s;
    out.m10 = z * z * t + c;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a rotation matrix from the rotation around x-axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static fromXRotation(out, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = c;
    out.m06 = s;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = -s;
    out.m10 = c;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a rotation matrix from the rotation around y-axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static fromYRotation(out, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out.m00 = c;
    out.m01 = 0;
    out.m02 = -s;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = 1;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = s;
    out.m09 = 0;
    out.m10 = c;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a rotation matrix from the rotation around z-axis.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat4} out.
   */
  static fromZRotation(out, rad) {
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out.m00 = c;
    out.m01 = s;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = -s;
    out.m05 = c;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = 1;
    out.m11 = 0;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;
    return out;
  }

  /**
   * Creates a matrix from a quaternion rotation and a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {mat4} out - Matrix to store result.
   * @param {quat} q - Rotation quaternion.
   * @param {vec3} v - Translation vector.
   * @returns {mat4} out.
   */
  static fromRT(out, q, v) {
    // Quaternion math
    let x = q.x, y = q.y, z = q.z, w = q.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;

    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;

    out.m00 = 1 - (yy + zz);
    out.m01 = xy + wz;
    out.m02 = xz - wy;
    out.m03 = 0;
    out.m04 = xy - wz;
    out.m05 = 1 - (xx + zz);
    out.m06 = yz + wx;
    out.m07 = 0;
    out.m08 = xz + wy;
    out.m09 = yz - wx;
    out.m10 = 1 - (xx + yy);
    out.m11 = 0;
    out.m12 = v.x;
    out.m13 = v.y;
    out.m14 = v.z;
    out.m15 = 1;

    return out;
  }

  /**
   * Returns the translation vector component of a transformation
   *  matrix. If a matrix is built with fromRT,
   *  the returned vector will be the same as the translation offset
   *  originally supplied.
   * @param  {vec3} out - Vector to store result.
   * @param  {mat4} mat - Matrix to be decomposed.
   * @return {vec3} out.
   */
  static getTranslation(out, mat) {
    out.x = mat.m12;
    out.y = mat.m13;
    out.z = mat.m14;

    return out;
  }

  /**
   * Returns the scale component of a transformation
   *  matrix. If a matrix is built with fromRTS
   *  with a normalized Quaternion parameter, the returned vector will be
   *  the same as the scale vector
   *  originally supplied.
   * @param  {vec3} out - Vector to store result.
   * @param  {mat4} mat - Matrix to be decomposed.
   * @return {vec3} out.
   */
  static getScaling(out, mat) {
    let m11 = mat.m00,
      m12 = mat.m01,
      m13 = mat.m02,
      m21 = mat.m04,
      m22 = mat.m05,
      m23 = mat.m06,
      m31 = mat.m08,
      m32 = mat.m09,
      m33 = mat.m10;

    out.x = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out.y = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out.z = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

    return out;
  }

  /**
   * Returns a quaternion representing the rotational component
   *  of a transformation matrix. If a matrix is built with
   *  fromRT, the returned quaternion will be the
   *  same as the quaternion originally supplied.
   * @param {quat} out - Quaternion to store result.
   * @param {mat4} mat - Matrix to be decomposed.
   * @return {quat} out.
   */
  static getRotation(out, mat) {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    let trace = mat.m00 + mat.m05 + mat.m10;
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out.w = 0.25 * S;
      out.x = (mat.m06 - mat.m09) / S;
      out.y = (mat.m08 - mat.m02) / S;
      out.z = (mat.m01 - mat.m04) / S;
    } else if ((mat.m00 > mat.m05) & (mat.m00 > mat.m10)) {
      S = Math.sqrt(1.0 + mat.m00 - mat.m05 - mat.m10) * 2;
      out.w = (mat.m06 - mat.m09) / S;
      out.x = 0.25 * S;
      out.y = (mat.m01 + mat.m04) / S;
      out.z = (mat.m08 + mat.m02) / S;
    } else if (mat.m05 > mat.m10) {
      S = Math.sqrt(1.0 + mat.m05 - mat.m00 - mat.m10) * 2;
      out.w = (mat.m08 - mat.m02) / S;
      out.x = (mat.m01 + mat.m04) / S;
      out.y = 0.25 * S;
      out.z = (mat.m06 + mat.m09) / S;
    } else {
      S = Math.sqrt(1.0 + mat.m10 - mat.m00 - mat.m05) * 2;
      out.w = (mat.m01 - mat.m04) / S;
      out.x = (mat.m08 + mat.m02) / S;
      out.y = (mat.m06 + mat.m09) / S;
      out.z = 0.25 * S;
    }

    return out;
  }

  /**
   * Creates a matrix from a quaternion rotation, translation offset and scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *
   * @param {mat4} out mat4 - Matrix to store result.
   * @param {quat} q - Rotation quaternion.
   * @param {vec3} v - Translation offset.
   * @param {vec3} s - Scale vector.
   * @returns {mat4} out.
   */
  static fromRTS(out, q, v, s) {
    // Quaternion math
    let x = q.x, y = q.y, z = q.z, w = q.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;

    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s.x;
    let sy = s.y;
    let sz = s.z;

    out.m00 = (1 - (yy + zz)) * sx;
    out.m01 = (xy + wz) * sx;
    out.m02 = (xz - wy) * sx;
    out.m03 = 0;
    out.m04 = (xy - wz) * sy;
    out.m05 = (1 - (xx + zz)) * sy;
    out.m06 = (yz + wx) * sy;
    out.m07 = 0;
    out.m08 = (xz + wy) * sz;
    out.m09 = (yz - wx) * sz;
    out.m10 = (1 - (xx + yy)) * sz;
    out.m11 = 0;
    out.m12 = v.x;
    out.m13 = v.y;
    out.m14 = v.z;
    out.m15 = 1;

    return out;
  }

  /**
   * Creates a matrix from a quaternion rotation, translation offset and scale vector, rotating and scaling around the given origin.
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   *
   * @param {mat4} out mat4 - Matrix to store result.
   * @param {quat} q - Rotation quaternion.
   * @param {vec3} v - Translation offset.
   * @param {vec3} s - Scale vector.
   * @param {vec3} o The origin vector around which to scale and rotate.
   * @returns {mat4} out.
   */
  static fromRTSOrigin(out, q, v, s, o) {
    // Quaternion math
    let x = q.x, y = q.y, z = q.z, w = q.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;

    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;

    let sx = s.x;
    let sy = s.y;
    let sz = s.z;

    let ox = o.x;
    let oy = o.y;
    let oz = o.z;

    out.m00 = (1 - (yy + zz)) * sx;
    out.m01 = (xy + wz) * sx;
    out.m02 = (xz - wy) * sx;
    out.m03 = 0;
    out.m04 = (xy - wz) * sy;
    out.m05 = (1 - (xx + zz)) * sy;
    out.m06 = (yz + wx) * sy;
    out.m07 = 0;
    out.m08 = (xz + wy) * sz;
    out.m09 = (yz - wx) * sz;
    out.m10 = (1 - (xx + yy)) * sz;
    out.m11 = 0;
    out.m12 = v.x + ox - (out.m00 * ox + out.m04 * oy + out.m08 * oz);
    out.m13 = v.y + oy - (out.m01 * ox + out.m05 * oy + out.m09 * oz);
    out.m14 = v.z + oz - (out.m02 * ox + out.m06 * oy + out.m10 * oz);
    out.m15 = 1;

    return out;
  }

  /**
   * Calculates a 4x4 matrix from the given quaternion.
   *
   * @param {mat4} out mat4 - Matrix to store result.
   * @param {quat} q - Quaternion to create matrix from.
   *
   * @returns {mat4} out.
   */
  static fromQuat(out, q) {
    let x = q.x, y = q.y, z = q.z, w = q.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;

    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;

    out.m00 = 1 - yy - zz;
    out.m01 = yx + wz;
    out.m02 = zx - wy;
    out.m03 = 0;

    out.m04 = yx - wz;
    out.m05 = 1 - xx - zz;
    out.m06 = zy + wx;
    out.m07 = 0;

    out.m08 = zx + wy;
    out.m09 = zy - wx;
    out.m10 = 1 - xx - yy;
    out.m11 = 0;

    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;

    return out;
  }

  /**
   * Generates a frustum matrix with the given bounds.
   *
   * @param {mat4} out mat4 - Matrix to store result.
   * @param {Number} left - Left bound of the frustum.
   * @param {Number} right - Right bound of the frustum.
   * @param {Number} bottom - Bottom bound of the frustum.
   * @param {Number} top - Top bound of the frustum.
   * @param {Number} near - Near bound of the frustum.
   * @param {Number} far - Far bound of the frustum.
   * @returns {mat4} out.
   */
  static frustum(out, left, right, bottom, top, near, far) {
    let rl = 1 / (right - left);
    let tb = 1 / (top - bottom);
    let nf = 1 / (near - far);

    out.m00 = (near * 2) * rl;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = (near * 2) * tb;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = (right + left) * rl;
    out.m09 = (top + bottom) * tb;
    out.m10 = (far + near) * nf;
    out.m11 = -1;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = (far * near * 2) * nf;
    out.m15 = 0;
    return out;
  }

  /**
   * Generates a perspective projection matrix with the given bounds.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {number} fovy - Vertical field of view in radians.
   * @param {number} aspect - Aspect ratio. typically viewport width/height.
   * @param {number} near - Near bound of the frustum.
   * @param {number} far - Far bound of the frustum.
   * @returns {mat4} out.
   */
  static perspective(out, fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2);
    let nf = 1 / (near - far);

    out.m00 = f / aspect;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = f;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = (far + near) * nf;
    out.m11 = -1;
    out.m12 = 0;
    out.m13 = 0;
    out.m14 = (2 * far * near) * nf;
    out.m15 = 0;
    return out;
  }

  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {Object} fov - Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees.
   * @param {number} near - Near bound of the frustum.
   * @param {number} far - Far bound of the frustum.
   * @returns {mat4} out.
   */
  static perspectiveFromFieldOfView(out, fov, near, far) {
    let upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    let downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    let leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    let rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    let xScale = 2.0 / (leftTan + rightTan);
    let yScale = 2.0 / (upTan + downTan);

    out.m00 = xScale;
    out.m01 = 0.0;
    out.m02 = 0.0;
    out.m03 = 0.0;
    out.m04 = 0.0;
    out.m05 = yScale;
    out.m06 = 0.0;
    out.m07 = 0.0;
    out.m08 = -((leftTan - rightTan) * xScale * 0.5);
    out.m09 = ((upTan - downTan) * yScale * 0.5);
    out.m10 = far / (near - far);
    out.m11 = -1.0;
    out.m12 = 0.0;
    out.m13 = 0.0;
    out.m14 = (far * near) / (near - far);
    out.m15 = 0.0;
    return out;
  }

  /**
   * Generates a orthogonal projection matrix with the given bounds.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {number} left - Left bound of the frustum.
   * @param {number} right - Right bound of the frustum.
   * @param {number} bottom - Bottom bound of the frustum.
   * @param {number} top - Top bound of the frustum.
   * @param {number} near - Near bound of the frustum.
   * @param {number} far - Far bound of the frustum.
   * @returns {mat4} out.
   */
  static ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out.m00 = -2 * lr;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 0;
    out.m05 = -2 * bt;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 0;
    out.m09 = 0;
    out.m10 = 2 * nf;
    out.m11 = 0;
    out.m12 = (left + right) * lr;
    out.m13 = (top + bottom) * bt;
    out.m14 = (far + near) * nf;
    out.m15 = 1;
    return out;
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * `eye - center` mustn't be zero vector or parallel to `up`
   *
   * @param {mat4} out - Matrix to store result.
   * @param {vec3} eye - Position of the viewer.
   * @param {vec3} center - Point the viewer is looking at.
   * @param {vec3} up - Vector pointing up.
   * @returns {mat4} out
   */
  static lookAt(out, eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye.x;
    let eyey = eye.y;
    let eyez = eye.z;
    let upx = up.x;
    let upy = up.y;
    let upz = up.z;
    let centerx = center.x;
    let centery = center.y;
    let centerz = center.z;

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    x0 *= len;
    x1 *= len;
    x2 *= len;

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    out.m00 = x0;
    out.m01 = y0;
    out.m02 = z0;
    out.m03 = 0;
    out.m04 = x1;
    out.m05 = y1;
    out.m06 = z1;
    out.m07 = 0;
    out.m08 = x2;
    out.m09 = y2;
    out.m10 = z2;
    out.m11 = 0;
    out.m12 = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out.m13 = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out.m14 = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out.m15 = 1;

    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param {mat4} a - The matrix.
   * @returns {String} String representation of this matrix.
   */
  static str(a) {
    return `mat4(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05}, ${a.m06}, ${a.m07}, ${a.m08}, ${a.m09}, ${a.m10}, ${a.m11}, ${a.m12}, ${a.m13}, ${a.m14}, ${a.m15})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param {array} out - Array to store result.
   * @param {mat4} m - The matrix.
   * @returns {Array} out.
   */
  static array(out, m) {
    out[0] = m.m00;
    out[1] = m.m01;
    out[2] = m.m02;
    out[3] = m.m03;
    out[4] = m.m04;
    out[5] = m.m05;
    out[6] = m.m06;
    out[7] = m.m07;
    out[8] = m.m08;
    out[9] = m.m09;
    out[10] = m.m10;
    out[11] = m.m11;
    out[12] = m.m12;
    out[13] = m.m13;
    out[14] = m.m14;
    out[15] = m.m15;

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {mat4} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   */
  static frob(a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2) + Math.pow(a.m09, 2) + Math.pow(a.m10, 2) + Math.pow(a.m11, 2) + Math.pow(a.m12, 2) + Math.pow(a.m13, 2) + Math.pow(a.m14, 2) + Math.pow(a.m15, 2)))
  }

  /**
   * Adds two matrices.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - The first operand.
   * @param {mat4} b - The second operand.
   * @returns {mat4} out.
   */
  static add(out, a, b) {
    out.m00 = a.m00 + b.m00;
    out.m01 = a.m01 + b.m01;
    out.m02 = a.m02 + b.m02;
    out.m03 = a.m03 + b.m03;
    out.m04 = a.m04 + b.m04;
    out.m05 = a.m05 + b.m05;
    out.m06 = a.m06 + b.m06;
    out.m07 = a.m07 + b.m07;
    out.m08 = a.m08 + b.m08;
    out.m09 = a.m09 + b.m09;
    out.m10 = a.m10 + b.m10;
    out.m11 = a.m11 + b.m11;
    out.m12 = a.m12 + b.m12;
    out.m13 = a.m13 + b.m13;
    out.m14 = a.m14 + b.m14;
    out.m15 = a.m15 + b.m15;
    return out;
  }

  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - The first operand.
   * @param {mat4} b - The second operand.
   * @returns {mat4} out.
   */
  static subtract(out, a, b) {
    out.m00 = a.m00 - b.m00;
    out.m01 = a.m01 - b.m01;
    out.m02 = a.m02 - b.m02;
    out.m03 = a.m03 - b.m03;
    out.m04 = a.m04 - b.m04;
    out.m05 = a.m05 - b.m05;
    out.m06 = a.m06 - b.m06;
    out.m07 = a.m07 - b.m07;
    out.m08 = a.m08 - b.m08;
    out.m09 = a.m09 - b.m09;
    out.m10 = a.m10 - b.m10;
    out.m11 = a.m11 - b.m11;
    out.m12 = a.m12 - b.m12;
    out.m13 = a.m13 - b.m13;
    out.m14 = a.m14 - b.m14;
    out.m15 = a.m15 - b.m15;
    return out;
  }

  /**
   * Alias of {@link mat4.subtract}.
   */
  static sub(out, a, b) {
    return mat4.subtract(out, a, b);
  }

  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {mat4} out.
   */
  static multiplyScalar(out, a, b) {
    out.m00 = a.m00 * b;
    out.m01 = a.m01 * b;
    out.m02 = a.m02 * b;
    out.m03 = a.m03 * b;
    out.m04 = a.m04 * b;
    out.m05 = a.m05 * b;
    out.m06 = a.m06 * b;
    out.m07 = a.m07 * b;
    out.m08 = a.m08 * b;
    out.m09 = a.m09 * b;
    out.m10 = a.m10 * b;
    out.m11 = a.m11 * b;
    out.m12 = a.m12 * b;
    out.m13 = a.m13 * b;
    out.m14 = a.m14 * b;
    out.m15 = a.m15 * b;
    return out;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {mat4} out - Matrix to store result.
   * @param {mat4} a - The first operand.
   * @param {mat4} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {mat4} out.
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    out.m00 = a.m00 + (b.m00 * scale);
    out.m01 = a.m01 + (b.m01 * scale);
    out.m02 = a.m02 + (b.m02 * scale);
    out.m03 = a.m03 + (b.m03 * scale);
    out.m04 = a.m04 + (b.m04 * scale);
    out.m05 = a.m05 + (b.m05 * scale);
    out.m06 = a.m06 + (b.m06 * scale);
    out.m07 = a.m07 + (b.m07 * scale);
    out.m08 = a.m08 + (b.m08 * scale);
    out.m09 = a.m09 + (b.m09 * scale);
    out.m10 = a.m10 + (b.m10 * scale);
    out.m11 = a.m11 + (b.m11 * scale);
    out.m12 = a.m12 + (b.m12 * scale);
    out.m13 = a.m13 + (b.m13 * scale);
    out.m14 = a.m14 + (b.m14 * scale);
    out.m15 = a.m15 + (b.m15 * scale);
    return out;
  }

  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {mat4} a - The first matrix.
   * @param {mat4} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 &&
      a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 &&
      a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 &&
      a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {mat4} a - The first matrix.
   * @param {mat4} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07,
      a8 = a.m08, a9 = a.m09, a10 = a.m10, a11 = a.m11,
      a12 = a.m12, a13 = a.m13, a14 = a.m14, a15 = a.m15;

    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03,
      b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07,
      b8 = b.m08, b9 = b.m09, b10 = b.m10, b11 = b.m11,
      b12 = b.m12, b13 = b.m13, b14 = b.m14, b15 = b.m15;

    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
      Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
      Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
      Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
      Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
      Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
      Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
      Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
      Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
      Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
      Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
      Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
      Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15))
    );
  }
}

export default mat4;