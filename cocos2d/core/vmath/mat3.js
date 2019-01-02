import { EPSILON } from './utils';
import vec3 from './vec3';

/**
 * Mathematical 3x3 matrix.
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
class mat3 {
  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 1 row 0.
   * @param {Number} m04 - Value assigned to element at column 1 row 1.
   * @param {Number} m05 - Value assigned to element at column 1 row 2.
   * @param {Number} m06 - Value assigned to element at column 2 row 0.
   * @param {Number} m07 - Value assigned to element at column 2 row 1.
   * @param {Number} m08 - Value assigned to element at column 2 row 2.
   */
  constructor(
    m00 = 1, m01 = 0, m02 = 0,
    m03 = 0, m04 = 1, m05 = 0,
    m06 = 0, m07 = 0, m08 = 1
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
     * The element at column 1 row 0.
     * @type {number}
     * */
    this.m03 = m03;

    /**
     * The element at column 1 row 1.
     * @type {number}
     * */
    this.m04 = m04;

    /**
     * The element at column 1 row 2.
     * @type {number}
     * */
    this.m05 = m05;

    /**
     * The element at column 2 row 0.
     * @type {number}
     * */
    this.m06 = m06;

    /**
     * The element at column 2 row 1.
     * @type {number}
     * */
    this.m07 = m07;

    /**
     * The element at column 2 row 2.
     * @type {number}
     * */
    this.m08 = m08;
  }

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 1 row 0.
   * @param {Number} m04 - Value assigned to element at column 1 row 1.
   * @param {Number} m05 - Value assigned to element at column 1 row 2.
   * @param {Number} m06 - Value assigned to element at column 2 row 0.
   * @param {Number} m07 - Value assigned to element at column 2 row 1.
   * @param {Number} m08 - Value assigned to element at column 2 row 2.
   * @returns {mat3} The newly created matrix.
   */
  static create(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m04 = 1, m05 = 0, m06 = 0, m07 = 0, m08 = 1) {
    return new mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08);
  }

  /**
   * Clone a matrix.
   *
   * @param {mat3} a - Matrix to clone.
   * @returns {mat3} The newly created matrix.
   */
  static clone(a) {
    return new mat3(
      a.m00, a.m01, a.m02,
      a.m03, a.m04, a.m05,
      a.m06, a.m07, a.m08
    );
  }

  /**
   * Copy content of a matrix into another.
   *
   * @param {mat3} out - Matrix to modified.
   * @param {mat3} a - The specified matrix.
   * @returns {mat3} out.
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
    return out;
  }

  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {mat3} out - The matrix to modified.
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m10 - Value assigned to element at column 1 row 0.
   * @param {Number} m11 - Value assigned to element at column 1 row 1.
   * @param {Number} m12 - Value assigned to element at column 1 row 2.
   * @param {Number} m20 - Value assigned to element at column 2 row 0.
   * @param {Number} m21 - Value assigned to element at column 2 row 1.
   * @param {Number} m22 - Value assigned to element at column 2 row 2.
   * @returns {mat3} out.
   */
  static set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out.m00 = m00;
    out.m01 = m01;
    out.m02 = m02;
    out.m03 = m10;
    out.m04 = m11;
    out.m05 = m12;
    out.m06 = m20;
    out.m07 = m21;
    out.m08 = m22;
    return out;
  }

  /**
   * return an identity matrix.
   *
   * @returns {mat3} out.
   */
  static identity(out) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 1;
    out.m05 = 0;
    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 1;
    return out;
  }

  /**
   * Transposes a matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to transpose.
   * @returns {mat3} out.
   */
  static transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a01 = a.m01, a02 = a.m02, a12 = a.m05;
      out.m01 = a.m03;
      out.m02 = a.m06;
      out.m03 = a01;
      out.m05 = a.m07;
      out.m06 = a02;
      out.m07 = a12;
    } else {
      out.m00 = a.m00;
      out.m01 = a.m03;
      out.m02 = a.m06;
      out.m03 = a.m01;
      out.m04 = a.m04;
      out.m05 = a.m07;
      out.m06 = a.m02;
      out.m07 = a.m05;
      out.m08 = a.m08;
    }

    return out;
  }

  /**
   * Inverts a matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to invert.
   * @returns {mat3} out.
   */
  static invert(out, a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out.m00 = b01 * det;
    out.m01 = (-a22 * a01 + a02 * a21) * det;
    out.m02 = (a12 * a01 - a02 * a11) * det;
    out.m03 = b11 * det;
    out.m04 = (a22 * a00 - a02 * a20) * det;
    out.m05 = (-a12 * a00 + a02 * a10) * det;
    out.m06 = b21 * det;
    out.m07 = (-a21 * a00 + a01 * a20) * det;
    out.m08 = (a11 * a00 - a01 * a10) * det;
    return out;
  }

  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to calculate.
   * @returns {mat3} out.
   */
  static adjoint(out, a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

    out.m00 = (a11 * a22 - a12 * a21);
    out.m01 = (a02 * a21 - a01 * a22);
    out.m02 = (a01 * a12 - a02 * a11);
    out.m03 = (a12 * a20 - a10 * a22);
    out.m04 = (a00 * a22 - a02 * a20);
    out.m05 = (a02 * a10 - a00 * a12);
    out.m06 = (a10 * a21 - a11 * a20);
    out.m07 = (a01 * a20 - a00 * a21);
    out.m08 = (a00 * a11 - a01 * a10);
    return out;
  }

  /**
   * Calculates the determinant of a matrix.
   *
   * @param {mat3} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   */
  static determinant(a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }

  /**
   * Multiply two matrices explicitly.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - The first operand.
   * @param {mat3} b - The second operand.
   * @returns {mat3} out.
   */
  static multiply(out, a, b) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

    let b00 = b.m00, b01 = b.m01, b02 = b.m02;
    let b10 = b.m03, b11 = b.m04, b12 = b.m05;
    let b20 = b.m06, b21 = b.m07, b22 = b.m08;

    out.m00 = b00 * a00 + b01 * a10 + b02 * a20;
    out.m01 = b00 * a01 + b01 * a11 + b02 * a21;
    out.m02 = b00 * a02 + b01 * a12 + b02 * a22;

    out.m03 = b10 * a00 + b11 * a10 + b12 * a20;
    out.m04 = b10 * a01 + b11 * a11 + b12 * a21;
    out.m05 = b10 * a02 + b11 * a12 + b12 * a22;

    out.m06 = b20 * a00 + b21 * a10 + b22 * a20;
    out.m07 = b20 * a01 + b21 * a11 + b22 * a21;
    out.m08 = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }

  /**
   * Alias of {@link mat3.multiply}.
   */
  static mul(out, a, b) {
    return mat3.multiply(out, a, b);
  }

  /**
   * Multiply a matrix with a translation matrix given by a translation offset.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to multiply.
   * @param {vec2} v - The translation offset.
   * @returns {mat3} out.
   */
  static translate(out, a, v) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;
    let x = v.x, y = v.y;

    out.m00 = a00;
    out.m01 = a01;
    out.m02 = a02;

    out.m03 = a10;
    out.m04 = a11;
    out.m05 = a12;

    out.m06 = x * a00 + y * a10 + a20;
    out.m07 = x * a01 + y * a11 + a21;
    out.m08 = x * a02 + y * a12 + a22;
    return out;
  }

  /**
   * Rotates a matrix by the given angle.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to rotate.
   * @param {Number} rad - The rotation angle.
   * @returns {mat3} out
   */
  static rotate(out, a, rad) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

    let s = Math.sin(rad);
    let c = Math.cos(rad);

    out.m00 = c * a00 + s * a10;
    out.m01 = c * a01 + s * a11;
    out.m02 = c * a02 + s * a12;

    out.m03 = c * a10 - s * a00;
    out.m04 = c * a11 - s * a01;
    out.m05 = c * a12 - s * a02;

    out.m06 = a20;
    out.m07 = a21;
    out.m08 = a22;
    return out;
  }

  /**
   * Multiply a matrix with a scale matrix given by a scale vector.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to multiply.
   * @param {vec2} v - The scale vector.
   * @returns {mat3} out
   **/
  static scale(out, a, v) {
    let x = v.x, y = v.y;

    out.m00 = x * a.m00;
    out.m01 = x * a.m01;
    out.m02 = x * a.m02;

    out.m03 = y * a.m03;
    out.m04 = y * a.m04;
    out.m05 = y * a.m05;

    out.m06 = a.m06;
    out.m07 = a.m07;
    out.m08 = a.m08;
    return out;
  }

  /**
   * Copies the upper-left 3x3 values of a 4x4 matrix into a 3x3 matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat4} a - The 4x4 matrix.
   * @returns {mat3} out.
   */
  static fromMat4(out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m04;
    out.m04 = a.m05;
    out.m05 = a.m06;
    out.m06 = a.m08;
    out.m07 = a.m09;
    out.m08 = a.m10;
    return out;
  }

  /**
   * Creates a matrix from a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   *
   * @param {mat3} out - Matrix to store result.
   * @param {vec2} v - The translation offset.
   * @returns {mat3} out.
   */
  static fromTranslation(out, v) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 0;
    out.m04 = 1;
    out.m05 = 0;
    out.m06 = v.x;
    out.m07 = v.y;
    out.m08 = 1;
    return out;
  }

  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   *
   * @param {mat3} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {mat3} out.
   */
  static fromRotation(out, rad) {
    let s = Math.sin(rad), c = Math.cos(rad);

    out.m00 = c;
    out.m01 = s;
    out.m02 = 0;

    out.m03 = -s;
    out.m04 = c;
    out.m05 = 0;

    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 1;
    return out;
  }

  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   *
   * @param {mat3} out - Matrix to store result.
   * @param {vec2} v - Scale vector.
   * @returns {mat3} out.
   */
  static fromScaling(out, v) {
    out.m00 = v.x;
    out.m01 = 0;
    out.m02 = 0;

    out.m03 = 0;
    out.m04 = v.y;
    out.m05 = 0;

    out.m06 = 0;
    out.m07 = 0;
    out.m08 = 1;
    return out;
  }

  /**
   * Copies the values from a 2x3 matrix into a 3x3 matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat23} a - The 2x3 matrix.
   * @returns {mat3} out.
   **/
  static fromMat2d(out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = 0;

    out.m03 = a.m02;
    out.m04 = a.m03;
    out.m05 = 0;

    out.m06 = a.m04;
    out.m07 = a.m05;
    out.m08 = 1;
    return out;
  }

  /**
   * Calculates a 3x3 matrix from the given quaternion.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {quat} q - The quaternion.
   *
   * @returns {mat3} out.
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
    out.m03 = yx - wz;
    out.m06 = zx + wy;

    out.m01 = yx + wz;
    out.m04 = 1 - xx - zz;
    out.m07 = zy - wx;

    out.m02 = zx - wy;
    out.m05 = zy + wx;
    out.m08 = 1 - xx - yy;

    return out;
  }

  /**
   * Calculates a 3x3 matrix from view direction and up direction.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {vec3} view - View direction (must be normalized).
   * @param {vec3} [up] - Up direction, default is (0,1,0) (must be normalized).
   *
   * @returns {mat3} out
   */
  static fromViewUp(out, view, up) {
    let _fromViewUpIIFE = (function () {
      let default_up = vec3.create(0, 1, 0);
      let x = vec3.create(0, 0, 0);
      let y = vec3.create(0, 0, 0);

      return function (out, view, up) {
        if (vec3.sqrMag(view) < EPSILON * EPSILON) {
          mat3.identity(out);
          return out;
        }

        up = up || default_up;
        vec3.normalize(x, vec3.cross(x, up, view));

        if (vec3.sqrMag(x) < EPSILON * EPSILON) {
          mat3.identity(out);
          return out;
        }

        vec3.cross(y, view, x);
        mat3.set(
          out,
          x.x, x.y, x.z,
          y.x, y.y, y.z,
          view.x, view.y, view.z
        );

        return out;
      };
    })();
    return _fromViewUpIIFE(out, view, up);
  }

  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat4} a - A 4x4 matrix to derive the normal matrix from.
   *
   * @returns {mat3} out.
   */
  static normalFromMat4(out, a) {
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
    out.m01 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out.m03 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out.m04 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out.m05 = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out.m06 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out.m07 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out.m08 = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
  }

  /**
   * Returns a string representation of a matrix.
   *
   * @param {mat3} a - The matrix.
   * @returns {String} String representation of this matrix.
   */
  static str(a) {
    return `mat3(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05}, ${a.m06}, ${a.m07}, ${a.m08})`;
  }

  /**
   * Store elements of a matrix into array.
   *
   * @param {array} out - Array to store result.
   * @param {mat3} m - The matrix.
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

    return out;
  }

  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {mat3} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   */
  static frob(a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2)));
  }

  /**
   * Adds two matrices.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - The first operand.
   * @param {mat3} b - The second operand.
   * @returns {mat3} out.
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
    return out;
  }

  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - The first operand.
   * @param {mat3} b - The second operand.
   * @returns {mat3} out.
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
    return out;
  }

  /**
   * Alias of {@link mat3.subtract}.
   */
  static sub(out, a, b) {
    return mat3.subtract(out, a, b);
  }

  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {mat3} out.
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
    return out;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {mat3} out - Matrix to store result.
   * @param {mat3} a - The first operand.
   * @param {mat3} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {mat3} out.
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
    return out;
  }

  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {mat3} a - The first matrix.
   * @param {mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 &&
      a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 &&
      a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08;
  }

  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {mat3} a - The first matrix.
   * @param {mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07, a8 = a.m08;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07, b8 = b.m08;
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
      Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
      Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
      Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
      Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
      Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8))
    );
  }
}

export default mat3;