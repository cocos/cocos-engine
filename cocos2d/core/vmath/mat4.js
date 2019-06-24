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
    if (m00 instanceof Float32Array) {
        // deep copy
        if (m01) {
            this.m = new Float32Array(16);
            this.m.set(m00);
        } else {
            this.m = m00;
        }
    } else {
        this.m = new Float32Array(16);

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
         * The element at column 0 row 2.
         * @type {number}
         * */
        m[2] = m02;

        /**
         * The element at column 0 row 3.
         * @type {number}
         * */
        m[3] = m03;

        /**
         * The element at column 1 row 0.
         * @type {number}
         * */
        m[4] = m04;

        /**
         * The element at column 1 row 1.
         * @type {number}
         * */
        m[5] = m05;

        /**
         * The element at column 1 row 2.
         * @type {number}
         * */
        m[6] = m06;

        /**
         * The element at column 1 row 3.
         * @type {number}
         * */
        m[7] = m07;

        /**
         * The element at column 2 row 0.
         * @type {number}
         * */
        m[8] = m08;

        /**
         * The element at column 2 row 1.
         * @type {number}
         * */
        m[9] = m09;

        /**
         * The element at column 2 row 2.
         * @type {number}
         * */
        m[10] = m10;

        /**
         * The element at column 2 row 3.
         * @type {number}
         * */
        m[11] = m11;

        /**
         * The element at column 3 row 0.
         * @type {number}
         * */
        m[12] = m12;

        /**
         * The element at column 3 row 1.
         * @type {number}
         * */
        m[13] = m13;

        /**
         * The element at column 3 row 2.
         * @type {number}
         * */
        m[14] = m14;

        /**
         * The element at column 3 row 3.
         * @type {number}
         * */
        m[15] = m15;

    }
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
    let am = a.m;
    return new mat4(
      am[0], am[1], am[2], am[3],
      am[4], am[5], am[6], am[7],
      am[8], am[9], am[10], am[11],
      am[12], am[13], am[14], am[15]
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
    out.m.set(a.m);
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
    let outm = out.m;
    outm[0] = m00;
    outm[1] = m01;
    outm[2] = m02;
    outm[3] = m03;
    outm[4] = m10;
    outm[5] = m11;
    outm[6] = m12;
    outm[7] = m13;
    outm[8] = m20;
    outm[9] = m21;
    outm[10] = m22;
    outm[11] = m23;
    outm[12] = m30;
    outm[13] = m31;
    outm[14] = m32;
    outm[15] = m33;
    return out;
  }


  /**
   * Sets a matrix as identity matrix.
   *
   * @param {mat4} out - Matrix to modified.
   * @returns {mat4} out.
   */
  static identity(out) {
    let outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = 1;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = 1;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let am = a.m, outm = out.m;
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a01 = am[1], a02 = am[2], a03 = am[3],
        a12 = am[6], a13 = am[7],
        a23 = am[11];

      outm[1] = am[4];
      outm[2] = am[8];
      outm[3] = am[12];
      outm[4] = a01;
      outm[6] = am[9];
      outm[7] = am[13];
      outm[8] = a02;
      outm[9] = a12;
      outm[11] = am[14];
      outm[12] = a03;
      outm[13] = a13;
      outm[14] = a23;
    } else {
      outm[0] = am[0];
      outm[1] = am[4];
      outm[2] = am[8];
      outm[3] = am[12];
      outm[4] = am[1];
      outm[5] = am[5];
      outm[6] = am[9];
      outm[7] = am[13];
      outm[8] = am[2];
      outm[9] = am[6];
      outm[10] = am[10];
      outm[11] = am[14];
      outm[12] = am[3];
      outm[13] = am[7];
      outm[14] = am[11];
      outm[15] = am[15];
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
    let am = a.m, outm = out.m;
    let a00 = am[0], a01 = am[1], a02 = am[2], a03 = am[3],
      a10 = am[4], a11 = am[5], a12 = am[6], a13 = am[7],
      a20 = am[8], a21 = am[9], a22 = am[10], a23 = am[11],
      a30 = am[12], a31 = am[13], a32 = am[14], a33 = am[15];

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

    outm[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    outm[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    outm[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    outm[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    outm[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    outm[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    outm[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    outm[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    outm[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    outm[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    outm[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    outm[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    outm[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    outm[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    outm[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    outm[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

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
    let am = a.m, outm = out.m;
    let a00 = am[0], a01 = am[1], a02 = am[2], a03 = am[3],
      a10 = am[4], a11 = am[5], a12 = am[6], a13 = am[7],
      a20 = am[8], a21 = am[9], a22 = am[10], a23 = am[11],
      a30 = am[12], a31 = am[13], a32 = am[14], a33 = am[15];

    outm[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    outm[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    outm[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    outm[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    outm[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    outm[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    outm[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    outm[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    outm[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    outm[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    outm[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    outm[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    outm[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    outm[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    outm[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    outm[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param {mat4} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   */
  static determinant(a) {
    let am = a.m;
    let a00 = am[0], a01 = am[1], a02 = am[2], a03 = am[3],
      a10 = am[4], a11 = am[5], a12 = am[6], a13 = am[7],
      a20 = am[8], a21 = am[9], a22 = am[10], a23 = am[11],
      a30 = am[12], a31 = am[13], a32 = am[14], a33 = am[15];

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
    let am = a.m, bm = b.m, outm = out.m;
    let a00 = am[0], a01 = am[1], a02 = am[2], a03 = am[3],
      a10 = am[4], a11 = am[5], a12 = am[6], a13 = am[7],
      a20 = am[8], a21 = am[9], a22 = am[10], a23 = am[11],
      a30 = am[12], a31 = am[13], a32 = am[14], a33 = am[15];

    // Cache only the current line of the second matrix
    let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3];
    outm[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    outm[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    outm[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    outm[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = bm[4]; b1 = bm[5]; b2 = bm[6]; b3 = bm[7];
    outm[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    outm[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    outm[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    outm[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = bm[8]; b1 = bm[9]; b2 = bm[10]; b3 = bm[11];
    outm[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    outm[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    outm[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    outm[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = bm[12]; b1 = bm[13]; b2 = bm[14]; b3 = bm[15];
    outm[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    outm[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    outm[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    outm[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
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
    let am = a.m, outm = out.m;
    let x = v.x, y = v.y, z = v.z,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23;

    if (a === out) {
      outm[12] = am[0] * x + am[4] * y + am[8] * z + am[12];
      outm[13] = am[1] * x + am[5] * y + am[9] * z + am[13];
      outm[14] = am[2] * x + am[6] * y + am[10] * z + am[14];
      outm[15] = am[3] * x + am[7] * y + am[11] * z + am[15];
    } else {
      a00 = am[0]; a01 = am[1]; a02 = am[2]; a03 = am[3];
      a10 = am[4]; a11 = am[5]; a12 = am[6]; a13 = am[7];
      a20 = am[8]; a21 = am[9]; a22 = am[10]; a23 = am[11];

      outm[0] = a00; outm[1] = a01; outm[2] = a02; outm[3] = a03;
      outm[4] = a10; outm[5] = a11; outm[6] = a12; outm[7] = a13;
      outm[8] = a20; outm[9] = a21; outm[10] = a22; outm[11] = a23;

      outm[12] = a00 * x + a10 * y + a20 * z + am[12];
      outm[13] = a01 * x + a11 * y + a21 * z + am[13];
      outm[14] = a02 * x + a12 * y + a22 * z + am[14];
      outm[15] = a03 * x + a13 * y + a23 * z + am[15];
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
    let am = a.m, outm = out.m;
    outm[0] = am[0] * x;
    outm[1] = am[1] * x;
    outm[2] = am[2] * x;
    outm[3] = am[3] * x;
    outm[4] = am[4] * y;
    outm[5] = am[5] * y;
    outm[6] = am[6] * y;
    outm[7] = am[7] * y;
    outm[8] = am[8] * z;
    outm[9] = am[9] * z;
    outm[10] = am[10] * z;
    outm[11] = am[11] * z;
    outm[12] = am[12];
    outm[13] = am[13];
    outm[14] = am[14];
    outm[15] = am[15];
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
    let am = a.m, outm = out.m;
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

    a00 = am[0]; a01 = am[1]; a02 = am[2]; a03 = am[3];
    a10 = am[4]; a11 = am[5]; a12 = am[6]; a13 = am[7];
    a20 = am[8]; a21 = am[9]; a22 = am[10]; a23 = am[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    outm[0] = a00 * b00 + a10 * b01 + a20 * b02;
    outm[1] = a01 * b00 + a11 * b01 + a21 * b02;
    outm[2] = a02 * b00 + a12 * b01 + a22 * b02;
    outm[3] = a03 * b00 + a13 * b01 + a23 * b02;
    outm[4] = a00 * b10 + a10 * b11 + a20 * b12;
    outm[5] = a01 * b10 + a11 * b11 + a21 * b12;
    outm[6] = a02 * b10 + a12 * b11 + a22 * b12;
    outm[7] = a03 * b10 + a13 * b11 + a23 * b12;
    outm[8] = a00 * b20 + a10 * b21 + a20 * b22;
    outm[9] = a01 * b20 + a11 * b21 + a21 * b22;
    outm[10] = a02 * b20 + a12 * b21 + a22 * b22;
    outm[11] = a03 * b20 + a13 * b21 + a23 * b22;

    // If the source and destination differ, copy the unchanged last row
    if (a !== out) {
      outm[12] = am[12];
      outm[13] = am[13];
      outm[14] = am[14];
      outm[15] = am[15];
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
    let am = a.m, outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a10 = am[4],
      a11 = am[5],
      a12 = am[6],
      a13 = am[7],
      a20 = am[8],
      a21 = am[9],
      a22 = am[10],
      a23 = am[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      outm[0] = am[0];
      outm[1] = am[1];
      outm[2] = am[2];
      outm[3] = am[3];
      outm[12] = am[12];
      outm[13] = am[13];
      outm[14] = am[14];
      outm[15] = am[15];
    }

    // Perform axis-specific matrix multiplication
    outm[4] = a10 * c + a20 * s;
    outm[5] = a11 * c + a21 * s;
    outm[6] = a12 * c + a22 * s;
    outm[7] = a13 * c + a23 * s;
    outm[8] = a20 * c - a10 * s;
    outm[9] = a21 * c - a11 * s;
    outm[10] = a22 * c - a12 * s;
    outm[11] = a23 * c - a13 * s;

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
    let am = a.m, outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = am[0],
      a01 = am[1],
      a02 = am[2],
      a03 = am[3],
      a20 = am[8],
      a21 = am[9],
      a22 = am[10],
      a23 = am[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      outm[4] = am[4];
      outm[5] = am[5];
      outm[6] = am[6];
      outm[7] = am[7];
      outm[12] = am[12];
      outm[13] = am[13];
      outm[14] = am[14];
      outm[15] = am[15];
    }

    // Perform axis-specific matrix multiplication
    outm[0] = a00 * c - a20 * s;
    outm[1] = a01 * c - a21 * s;
    outm[2] = a02 * c - a22 * s;
    outm[3] = a03 * c - a23 * s;
    outm[8] = a00 * s + a20 * c;
    outm[9] = a01 * s + a21 * c;
    outm[10] = a02 * s + a22 * c;
    outm[11] = a03 * s + a23 * c;

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
    let am = a.m, outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad),
      a00 = am[0],
      a01 = am[1],
      a02 = am[2],
      a03 = am[3],
      a10 = am[4],
      a11 = am[5],
      a12 = am[6],
      a13 = am[7];

    // If the source and destination differ, copy the unchanged last row
    if (a !== out) {
      outm[8] = am[8];
      outm[9] = am[9];
      outm[10] = am[10];
      outm[11] = am[11];
      outm[12] = am[12];
      outm[13] = am[13];
      outm[14] = am[14];
      outm[15] = am[15];
    }

    // Perform axis-specific matrix multiplication
    outm[0] = a00 * c + a10 * s;
    outm[1] = a01 * c + a11 * s;
    outm[2] = a02 * c + a12 * s;
    outm[3] = a03 * c + a13 * s;
    outm[4] = a10 * c - a00 * s;
    outm[5] = a11 * c - a01 * s;
    outm[6] = a12 * c - a02 * s;
    outm[7] = a13 * c - a03 * s;

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
    let outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = 1;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = 1;
    outm[11] = 0;
    outm[12] = v.x;
    outm[13] = v.y;
    outm[14] = v.z;
    outm[15] = 1;
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
    let outm = out.m;
    outm[0] = v.x;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = v.y;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = v.z;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let outm = out.m;
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
    outm[0] = x * x * t + c;
    outm[1] = y * x * t + z * s;
    outm[2] = z * x * t - y * s;
    outm[3] = 0;
    outm[4] = x * y * t - z * s;
    outm[5] = y * y * t + c;
    outm[6] = z * y * t + x * s;
    outm[7] = 0;
    outm[8] = x * z * t + y * s;
    outm[9] = y * z * t - x * s;
    outm[10] = z * z * t + c;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = c;
    outm[6] = s;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = -s;
    outm[10] = c;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    outm[0] = c;
    outm[1] = 0;
    outm[2] = -s;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = 1;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = s;
    outm[9] = 0;
    outm[10] = c;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let outm = out.m;
    let s = Math.sin(rad),
      c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    outm[0] = c;
    outm[1] = s;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = -s;
    outm[5] = c;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = 1;
    outm[11] = 0;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;
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
    let outm = out.m;
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

    outm[0] = 1 - (yy + zz);
    outm[1] = xy + wz;
    outm[2] = xz - wy;
    outm[3] = 0;
    outm[4] = xy - wz;
    outm[5] = 1 - (xx + zz);
    outm[6] = yz + wx;
    outm[7] = 0;
    outm[8] = xz + wy;
    outm[9] = yz - wx;
    outm[10] = 1 - (xx + yy);
    outm[11] = 0;
    outm[12] = v.x;
    outm[13] = v.y;
    outm[14] = v.z;
    outm[15] = 1;

    return out;
  }
  
  static fromTRSArray (out, trs) {
    let outm = out.m;
    var x = trs[3], y = trs[4], z = trs[5], w = trs[6];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
  
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = trs[7];
    var sy = trs[8];
    var sz = trs[9];
  
    outm[0] = (1 - (yy + zz)) * sx;
    outm[1] = (xy + wz) * sx;
    outm[2] = (xz - wy) * sx;
    outm[3] = 0;
    outm[4] = (xy - wz) * sy;
    outm[5] = (1 - (xx + zz)) * sy;
    outm[6] = (yz + wx) * sy;
    outm[7] = 0;
    outm[8] = (xz + wy) * sz;
    outm[9] = (yz - wx) * sz;
    outm[10] = (1 - (xx + yy)) * sz;
    outm[11] = 0;
    outm[12] = trs[0];
    outm[13] = trs[1];
    outm[14] = trs[2];
    outm[15] = 1;
  
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
    let matm = mat.m;
    out.x = matm[12];
    out.y = matm[13];
    out.z = matm[14];

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
    let matm = mat.m;
    let m11 = matm[0],
      m12 = matm[1],
      m13 = matm[2],
      m21 = matm[4],
      m22 = matm[5],
      m23 = matm[6],
      m31 = matm[8],
      m32 = matm[9],
      m33 = matm[10];

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
    let matm = mat.m;
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    let trace = matm[0] + matm[5] + matm[10];
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out.w = 0.25 * S;
      out.x = (matm[6] - matm[9]) / S;
      out.y = (matm[8] - matm[2]) / S;
      out.z = (matm[1] - matm[4]) / S;
    } else if ((matm[0] > matm[5]) & (matm[0] > matm[10])) {
      S = Math.sqrt(1.0 + matm[0] - matm[5] - matm[10]) * 2;
      out.w = (matm[6] - matm[9]) / S;
      out.x = 0.25 * S;
      out.y = (matm[1] + matm[4]) / S;
      out.z = (matm[8] + matm[2]) / S;
    } else if (matm[5] > matm[10]) {
      S = Math.sqrt(1.0 + matm[5] - matm[0] - matm[10]) * 2;
      out.w = (matm[8] - matm[2]) / S;
      out.x = (matm[1] + matm[4]) / S;
      out.y = 0.25 * S;
      out.z = (matm[6] + matm[9]) / S;
    } else {
      S = Math.sqrt(1.0 + matm[10] - matm[0] - matm[5]) * 2;
      out.w = (matm[1] - matm[4]) / S;
      out.x = (matm[8] + matm[2]) / S;
      out.y = (matm[6] + matm[9]) / S;
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
    let outm = out.m;
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

    outm[0] = (1 - (yy + zz)) * sx;
    outm[1] = (xy + wz) * sx;
    outm[2] = (xz - wy) * sx;
    outm[3] = 0;
    outm[4] = (xy - wz) * sy;
    outm[5] = (1 - (xx + zz)) * sy;
    outm[6] = (yz + wx) * sy;
    outm[7] = 0;
    outm[8] = (xz + wy) * sz;
    outm[9] = (yz - wx) * sz;
    outm[10] = (1 - (xx + yy)) * sz;
    outm[11] = 0;
    outm[12] = v.x;
    outm[13] = v.y;
    outm[14] = v.z;
    outm[15] = 1;

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
    let outm = out.m;
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

    outm[0] = (1 - (yy + zz)) * sx;
    outm[1] = (xy + wz) * sx;
    outm[2] = (xz - wy) * sx;
    outm[3] = 0;
    outm[4] = (xy - wz) * sy;
    outm[5] = (1 - (xx + zz)) * sy;
    outm[6] = (yz + wx) * sy;
    outm[7] = 0;
    outm[8] = (xz + wy) * sz;
    outm[9] = (yz - wx) * sz;
    outm[10] = (1 - (xx + yy)) * sz;
    outm[11] = 0;
    outm[12] = v.x + ox - (outm[0] * ox + outm[4] * oy + outm[8] * oz);
    outm[13] = v.y + oy - (outm[1] * ox + outm[5] * oy + outm[9] * oz);
    outm[14] = v.z + oz - (outm[2] * ox + outm[6] * oy + outm[10] * oz);
    outm[15] = 1;

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
    let outm = out.m;
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

    outm[0] = 1 - yy - zz;
    outm[1] = yx + wz;
    outm[2] = zx - wy;
    outm[3] = 0;

    outm[4] = yx - wz;
    outm[5] = 1 - xx - zz;
    outm[6] = zy + wx;
    outm[7] = 0;

    outm[8] = zx + wy;
    outm[9] = zy - wx;
    outm[10] = 1 - xx - yy;
    outm[11] = 0;

    outm[12] = 0;
    outm[13] = 0;
    outm[14] = 0;
    outm[15] = 1;

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
    let outm = out.m;
    let rl = 1 / (right - left);
    let tb = 1 / (top - bottom);
    let nf = 1 / (near - far);

    outm[0] = (near * 2) * rl;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = (near * 2) * tb;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = (right + left) * rl;
    outm[9] = (top + bottom) * tb;
    outm[10] = (far + near) * nf;
    outm[11] = -1;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = (far * near * 2) * nf;
    outm[15] = 0;
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
    let outm = out.m;
    let f = 1.0 / Math.tan(fovy / 2);
    let nf = 1 / (near - far);

    outm[0] = f / aspect;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = f;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = (far + near) * nf;
    outm[11] = -1;
    outm[12] = 0;
    outm[13] = 0;
    outm[14] = (2 * far * near) * nf;
    outm[15] = 0;
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
    let outm = out.m;
    let upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    let downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    let leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    let rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    let xScale = 2.0 / (leftTan + rightTan);
    let yScale = 2.0 / (upTan + downTan);

    outm[0] = xScale;
    outm[1] = 0.0;
    outm[2] = 0.0;
    outm[3] = 0.0;
    outm[4] = 0.0;
    outm[5] = yScale;
    outm[6] = 0.0;
    outm[7] = 0.0;
    outm[8] = -((leftTan - rightTan) * xScale * 0.5);
    outm[9] = ((upTan - downTan) * yScale * 0.5);
    outm[10] = far / (near - far);
    outm[11] = -1.0;
    outm[12] = 0.0;
    outm[13] = 0.0;
    outm[14] = (far * near) / (near - far);
    outm[15] = 0.0;
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
    let outm = out.m;
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    outm[0] = -2 * lr;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 0;
    outm[5] = -2 * bt;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 0;
    outm[9] = 0;
    outm[10] = 2 * nf;
    outm[11] = 0;
    outm[12] = (left + right) * lr;
    outm[13] = (top + bottom) * bt;
    outm[14] = (far + near) * nf;
    outm[15] = 1;
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
    let outm = out.m;
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

    outm[0] = x0;
    outm[1] = y0;
    outm[2] = z0;
    outm[3] = 0;
    outm[4] = x1;
    outm[5] = y1;
    outm[6] = z1;
    outm[7] = 0;
    outm[8] = x2;
    outm[9] = y2;
    outm[10] = z2;
    outm[11] = 0;
    outm[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    outm[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    outm[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    outm[15] = 1;

    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param {mat4} a - The matrix.
   * @returns {String} String representation of this matrix.
   */
  static str(a) {
    let am = a.m;
    return `mat4(${am[0]}, ${am[1]}, ${am[2]}, ${am[3]}, ${am[4]}, ${am[5]}, ${am[6]}, ${am[7]}, ${am[8]}, ${am[9]}, ${am[10]}, ${am[11]}, ${am[12]}, ${am[13]}, ${am[14]}, ${am[15]})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param {array} out - Array to store result.
   * @param {mat4} m - The matrix.
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
    out[6] = mm[6];
    out[7] = mm[7];
    out[8] = mm[8];
    out[9] = mm[9];
    out[10] = mm[10];
    out[11] = mm[11];
    out[12] = mm[12];
    out[13] = mm[13];
    out[14] = mm[14];
    out[15] = mm[15];

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {mat4} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   */
  static frob(a) {
    let am = a.m;
    return (Math.sqrt(Math.pow(am[0], 2) + Math.pow(am[1], 2) + Math.pow(am[2], 2) + Math.pow(am[3], 2) + Math.pow(am[4], 2) + Math.pow(am[5], 2) + Math.pow(am[6], 2) + Math.pow(am[7], 2) + Math.pow(am[8], 2) + Math.pow(am[9], 2) + Math.pow(am[10], 2) + Math.pow(am[11], 2) + Math.pow(am[12], 2) + Math.pow(am[13], 2) + Math.pow(am[14], 2) + Math.pow(am[15], 2)))
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
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + bm[0];
    outm[1] = am[1] + bm[1];
    outm[2] = am[2] + bm[2];
    outm[3] = am[3] + bm[3];
    outm[4] = am[4] + bm[4];
    outm[5] = am[5] + bm[5];
    outm[6] = am[6] + bm[6];
    outm[7] = am[7] + bm[7];
    outm[8] = am[8] + bm[8];
    outm[9] = am[9] + bm[9];
    outm[10] = am[10] + bm[10];
    outm[11] = am[11] + bm[11];
    outm[12] = am[12] + bm[12];
    outm[13] = am[13] + bm[13];
    outm[14] = am[14] + bm[14];
    outm[15] = am[15] + bm[15];
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
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] - bm[0];
    outm[1] = am[1] - bm[1];
    outm[2] = am[2] - bm[2];
    outm[3] = am[3] - bm[3];
    outm[4] = am[4] - bm[4];
    outm[5] = am[5] - bm[5];
    outm[6] = am[6] - bm[6];
    outm[7] = am[7] - bm[7];
    outm[8] = am[8] - bm[8];
    outm[9] = am[9] - bm[9];
    outm[10] = am[10] - bm[10];
    outm[11] = am[11] - bm[11];
    outm[12] = am[12] - bm[12];
    outm[13] = am[13] - bm[13];
    outm[14] = am[14] - bm[14];
    outm[15] = am[15] - bm[15];
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
    let am = a.m, outm = out.m;
    outm[0] = am[0] * b;
    outm[1] = am[1] * b;
    outm[2] = am[2] * b;
    outm[3] = am[3] * b;
    outm[4] = am[4] * b;
    outm[5] = am[5] * b;
    outm[6] = am[6] * b;
    outm[7] = am[7] * b;
    outm[8] = am[8] * b;
    outm[9] = am[9] * b;
    outm[10] = am[10] * b;
    outm[11] = am[11] * b;
    outm[12] = am[12] * b;
    outm[13] = am[13] * b;
    outm[14] = am[14] * b;
    outm[15] = am[15] * b;
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
    let am = a.m, bm = b.m, outm = out.m;
    outm[0] = am[0] + (bm[0] * scale);
    outm[1] = am[1] + (bm[1] * scale);
    outm[2] = am[2] + (bm[2] * scale);
    outm[3] = am[3] + (bm[3] * scale);
    outm[4] = am[4] + (bm[4] * scale);
    outm[5] = am[5] + (bm[5] * scale);
    outm[6] = am[6] + (bm[6] * scale);
    outm[7] = am[7] + (bm[7] * scale);
    outm[8] = am[8] + (bm[8] * scale);
    outm[9] = am[9] + (bm[9] * scale);
    outm[10] = am[10] + (bm[10] * scale);
    outm[11] = am[11] + (bm[11] * scale);
    outm[12] = am[12] + (bm[12] * scale);
    outm[13] = am[13] + (bm[13] * scale);
    outm[14] = am[14] + (bm[14] * scale);
    outm[15] = am[15] + (bm[15] * scale);
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
    let am = a.m, bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] &&
      am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] &&
      am[8] === bm[8] && am[9] === bm[9] && am[10] === bm[10] && am[11] === bm[11] &&
      am[12] === bm[12] && am[13] === bm[13] && am[14] === bm[14] && am[15] === bm[15];
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {mat4} a - The first matrix.
   * @param {mat4} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let am = a.m, bm = b.m;
    let a0 = am[0], a1 = am[1], a2 = am[2], a3 = am[3],
      a4 = am[4], a5 = am[5], a6 = am[6], a7 = am[7],
      a8 = am[8], a9 = am[9], a10 = am[10], a11 = am[11],
      a12 = am[12], a13 = am[13], a14 = am[14], a15 = am[15];

    let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3],
      b4 = bm[4], b5 = bm[5], b6 = bm[6], b7 = bm[7],
      b8 = bm[8], b9 = bm[9], b10 = bm[10], b11 = bm[11],
      b12 = bm[12], b13 = bm[13], b14 = bm[14], b15 = bm[15];

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