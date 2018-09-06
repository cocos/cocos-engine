import vec3 from './vec3';
import vec4 from './vec4';
import mat3 from './mat3';
import { toDegree } from './utils';

let halfToRad = 0.5 * Math.PI / 180.0;

/**
 * Mathematical quaternion.
 *
 * A quaternion is a hypercomplex number represented by w + xi + yj + zk, where
 * x, y, z and w are real numbers(called here its components), and i, j, and k are the fundamental quaternion units.
 */
class quat {
  /**
   * Creates a quaternion, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   * @param {number} z - Value assigned to z component.
   * @param {number} w - Value assigned to w component.
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    /**
     * The x component.
     * @type {number}
     * */
    this.x = x;

    /**
     * The y component.
     * @type {number}
     * */
    this.y = y;

    /**
     * The z component.
     * @type {number}
     * */
    this.z = z;

    /**
     * The w component.
     * @type {number}
     * */
    this.w = w;
  }

  /**
   * Creates a quaternion, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   * @param {number} z - Value assigned to z component.
   * @param {number} w - Value assigned to w component.
   * @return {quat} The newly created quaternion.
   */
  static create(x = 0, y = 0, z = 0, w = 1) {
    return new quat(x, y, z, w);
  }

  /**
   * Clone a quaternion.
   *
   * @param {quat} a - Quaternion to clone.
   * @returns {quat} The newly created quaternion.
   */
  static clone(a) {
    return new quat(a.x, a.y, a.z, a.w);
  }

  /**
   * Copy content of a quaternion into another.
   *
   * @param {quat} out - Quaternion to modified.
   * @param {quat} a - The specified quaternion.
   * @returns {quat} out.
   */
  static copy(out, a) {
    return vec4.copy(out, a);
  }

  /**
   * Sets the components of a quaternion to the given values.
   *
   * @param {quat} out - The quaternion to modified.
   * @param {Number} x - Value set to x component.
   * @param {Number} y - Value set to y component.
   * @param {Number} z - Value set to z component.
   * @param {Number} w - Value set to w component.
   * @returns {quat} out.
   */
  static set(out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  }

  /**
   * Sets a quaternion as identity quaternion.
   *
   * @param {quat} out - Quaternion to set.
   * @returns {quat} out.
   */
  static identity(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    out.w = 1;
    return out;
  }

  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out - Quaternion to set.
   * @param {vec3} a - The initial vector.
   * @param {vec3} b - The destination vector.
   * @returns {quat} out.
   */
  static rotationTo(out, a, b) {
    let rotationToIIFE = (function () {
      let tmpvec3 = vec3.create(0, 0, 0);
      let xUnitVec3 = vec3.create(1, 0, 0);
      let yUnitVec3 = vec3.create(0, 1, 0);

      return function (out, a, b) {
        let dot = vec3.dot(a, b);
        if (dot < -0.999999) {
          vec3.cross(tmpvec3, xUnitVec3, a);
          if (vec3.magnitude(tmpvec3) < 0.000001) {
            vec3.cross(tmpvec3, yUnitVec3, a);
          }
          vec3.normalize(tmpvec3, tmpvec3);
          quat.fromAxisAngle(out, tmpvec3, Math.PI);
          return out;
        } else if (dot > 0.999999) {
          out.x = 0;
          out.y = 0;
          out.z = 0;
          out.w = 1;
          return out;
        } else {
          vec3.cross(tmpvec3, a, b);
          out.x = tmpvec3.x;
          out.y = tmpvec3.y;
          out.z = tmpvec3.z;
          out.w = 1 + dot;
          return quat.normalize(out, out);
        }
      };
    })();

    return rotationToIIFE(out, a, b);
  }

  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  fromAxisAngle, this method will return the same
   *  values as provided in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param  {vec3} out_axis - Vector to store the rotation axis.
   * @param  {quat} q - Quaternion to be decomposed.
   * @return {Number} - Angle, in radians, of the rotation.
   */
  static getAxisAngle(out_axis, q) {
    let rad = Math.acos(q.w) * 2.0;
    let s = Math.sin(rad / 2.0);
    if (s != 0.0) {
      out_axis.x = q.x / s;
      out_axis.y = q.y / s;
      out_axis.z = q.z / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      out_axis.x = 1;
      out_axis.y = 0;
      out_axis.z = 0;
    }
    return rad;
  }

  /**
   * Multiply two quaternions.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - The first operand.
   * @param {quat} b - The second operand.
   * @returns {quat} out.
   */
  static multiply(out, a, b) {
    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = b.x, by = b.y, bz = b.z, bw = b.w;

    out.x = ax * bw + aw * bx + ay * bz - az * by;
    out.y = ay * bw + aw * by + az * bx - ax * bz;
    out.z = az * bw + aw * bz + ax * by - ay * bx;
    out.w = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }

  /**
   * Alias of {@link quat.multiply}.
   */
  static mul(out, a, b) {
    return quat.multiply(out, a, b);
  }

  /**
   * Scales a quaternion with a number.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to scale.
   * @param {quat} b - The scale number.
   * @returns {quat} out.
   * */
  static scale(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  }

  /**
   * Rotates a quaternion by the given angle about the X axis.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to rotate.
   * @param {number} rad - Angle (in radians) to rotate.
   * @returns {quat} out.
   */
  static rotateX(out, a, rad) {
    rad *= 0.5;

    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = Math.sin(rad), bw = Math.cos(rad);

    out.x = ax * bw + aw * bx;
    out.y = ay * bw + az * bx;
    out.z = az * bw - ay * bx;
    out.w = aw * bw - ax * bx;
    return out;
  }

  /**
   * Rotates a quaternion by the given angle about the Y axis.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to rotate.
   * @param {number} rad - Angle (in radians) to rotate.
   * @returns {quat} out.
   */
  static rotateY(out, a, rad) {
    rad *= 0.5;

    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
      by = Math.sin(rad), bw = Math.cos(rad);

    out.x = ax * bw - az * by;
    out.y = ay * bw + aw * by;
    out.z = az * bw + ax * by;
    out.w = aw * bw - ay * by;
    return out;
  }

  /**
   * Rotates a quaternion by the given angle about the Z axis.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to rotate.
   * @param {number} rad - Angle (in radians) to rotate.
   * @returns {quat} out.
   */
  static rotateZ(out, a, rad) {
    rad *= 0.5;

    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bz = Math.sin(rad), bw = Math.cos(rad);

    out.x = ax * bw + ay * bz;
    out.y = ay * bw - ax * bz;
    out.z = az * bw + aw * bz;
    out.w = aw * bw - az * bz;
    return out;
  }

  /**
   * Rotates a quaternion by the given angle about a world space axis.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} rot - Quaternion to rotate.
   * @param {vec3} axis - The axis around which to rotate in world space.
   * @param {number} rad - Angle (in radians) to rotate.
   * @returns {quat} out.
   */
  static rotateAround(out, rot, axis, rad) {
    let rotateAroundIIFE = (function () {
      let v3_tmp = vec3.create(0, 0, 0);
      let q_tmp = quat.create();

      return function (out, rot, axis, rad) {
        // get inv-axis (local to rot)
        quat.invert(q_tmp, rot);
        vec3.transformQuat(v3_tmp, axis, q_tmp);
        // rotate by inv-axis
        quat.fromAxisAngle(q_tmp, v3_tmp, rad);
        quat.mul(out, rot, q_tmp);

        return out;
      };
    })();
    return rotateAroundIIFE(out, rot, axis, rad);
  }

  /**
   * Rotates a quaternion by the given angle about a local space axis.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} rot - Quaternion to rotate.
   * @param {vec3} axis - The axis around which to rotate in local space.
   * @param {number} rad - Angle (in radians) to rotate.
   * @returns {quat} out.
   */
  static rotateAroundLocal(out, rot, axis, rad) {
    let rotateAroundLocalIIFE = (function () {
      let q_tmp = quat.create();

      return function (out, rot, axis, rad) {
        quat.fromAxisAngle(q_tmp, axis, rad);
        quat.mul(out, rot, q_tmp);

        return out;
      };
    })();

    return rotateAroundLocalIIFE(out, rot, axis, rad);
  }

  /**
   * Calculates the W component of a quaternion from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to calculate W.
   * @returns {quat} out.
   */
  static calculateW(out, a) {
    let x = a.x, y = a.y, z = a.z;

    out.x = x;
    out.y = y;
    out.z = z;
    out.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
  }

  /**
   * Calculates the dot product of two quaternions.
   *
   * @param {quat} a - The first operand.
   * @param {quat} b - The second operand.
   * @returns {Number} - The dot product of a and b.
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }

  /**
   * Performs a linear interpolation between two quaternions.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - The first operand.
   * @param {quat} b - The second operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {quat} out.
   */
  static lerp(out, a, b, t) {
    let ax = a.x,
      ay = a.y,
      az = a.z,
      aw = a.w;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    out.z = az + t * (b.z - az);
    out.w = aw + t * (b.w - aw);
    return out;
  }

  /**
   * Performs a spherical linear interpolation between two quaternions.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - The first operand.
   * @param {quat} b - The second operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {quat} out.
   */
  static slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = b.x, by = b.y, bz = b.z, bw = b.w;

    let omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    // calculate coefficients
    if ((1.0 - cosom) > 0.000001) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }
    // calculate final values
    out.x = scale0 * ax + scale1 * bx;
    out.y = scale0 * ay + scale1 * by;
    out.z = scale0 * az + scale1 * bz;
    out.w = scale0 * aw + scale1 * bw;

    return out;
  }

  /**
   * Performs a spherical linear interpolation with two control points.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - The first operand.
   * @param {quat} b - The second operand.
   * @param {quat} c - The third operand.
   * @param {quat} d - The fourth operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {quat} out
   */
  static sqlerp(out, a, b, c, d, t) {
    let sqlerpIIFE = (function () {
      let temp1 = quat.create();
      let temp2 = quat.create();

      return function (out, a, b, c, d, t) {
        quat.slerp(temp1, a, d, t);
        quat.slerp(temp2, b, c, t);
        quat.slerp(out, temp1, temp2, 2 * t * (1 - t));

        return out;
      };
    }());
    return sqlerpIIFE(out, a, b, c, d, t);
  }

  /**
   * Calculates the inverse of a quaternion.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to calculate inverse of.
   * @returns {quat} out.
   */
  static invert(out, a) {
    let a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
    let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    let invDot = dot ? 1.0 / dot : 0;

    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out.x = -a0 * invDot;
    out.y = -a1 * invDot;
    out.z = -a2 * invDot;
    out.w = a3 * invDot;
    return out;
  }

  /**
   * Calculates the conjugate of a quaternion.
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to calculate conjugate of.
   * @returns {quat} out.
   */
  static conjugate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = a.w;
    return out;
  }

  /**
   * Calculates the length of a quaternion.
   *
   * @param {quat} a - The quaternion.
   * @returns {Number} Length of the quaternion.
   */
  static magnitude(a) {
    let x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }

  /**
   *Alias of {@link quat.magnitude}.
   */
  static mag(a) {
    return quat.magnitude(a);
  }

  /**
   * Calculates the squared length of a quaternion.
   *
   * @param {quat} a - The quaternion.
   * @returns {Number} Squared length of the quaternion.
   */
  static squaredMagnitude(a) {
    let x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
    return x * x + y * y + z * z + w * w;
  }

  /**
   *Alias of {@link quat.squaredMagnitude}
   */
  static sqrMag(a) {
    return quat.squaredMagnitude(a);
  }

  /**
   * Normalizes a quaternion.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {quat} a - Quaternion to normalize.
   * @returns {quat} out.
   * @function
   */
  static normalize(out, a) {
    let x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = x * len;
      out.y = y * len;
      out.z = z * len;
      out.w = w * len;
    }
    return out;
  }

  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {vec3} xAxis - Vector representing the local "right" direction.
   * @param {vec3} yAxis - Vector representing the local "up" direction.
   * @param {vec3} zAxis - Vector representing the viewing direction.
   * @returns {quat} out.
   */
  static fromAxes(out, xAxis, yAxis, zAxis) {
    let fromAxesIIFE = (function () {
      let matr = mat3.create();

      return function (out, xAxis, yAxis, zAxis) {
        mat3.set(matr,
          xAxis.x, xAxis.y, xAxis.z,
          yAxis.x, yAxis.y, yAxis.z,
          zAxis.x, zAxis.y, zAxis.z
        );
        return quat.normalize(out, quat.fromMat3(out, matr));
      };
    })();
    return fromAxesIIFE(out, xAxis, yAxis, zAxis);
  }

  /**
   * Calculates a quaternion from view direction and up direction
   *
   * @param {quat} out - Quaternion to store result.
   * @param {vec3} view - View direction (must be normalized).
   * @param {vec3} [up] - Up direction, default is (0,1,0) (must be normalized).
   *
   * @returns {quat} out.
   */
  static fromViewUp(out, view, up) {
    let fromViewUpIIFE = (function () {
      let matr = mat3.create();

      return function (out, view, up) {
        mat3.fromViewUp(matr, view, up);
        if (!matr) {
          return null;
        }

        return quat.normalize(out, quat.fromMat3(out, matr));
      };
    })();
    return fromViewUpIIFE(out, view, up);
  }

  /**
   * Sets a quaternion from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {vec3} axis - The axis around which to rotate.
   * @param {Number} rad - The angle in radians.
   * @returns {quat} out.
   **/
  static fromAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    out.x = s * axis.x;
    out.y = s * axis.y;
    out.z = s * axis.z;
    out.w = Math.cos(rad);
    return out;
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to re-normalize the quaternion yourself where necessary.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {mat3} m - The rotation matrix.
   * @returns {quat} out.
   * @function
   */
  static fromMat3(out, m) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    let m00 = m.m00, m01 = m.m03, m02 = m.m06,
      m10 = m.m01, m11 = m.m04, m12 = m.m07,
      m20 = m.m02, m21 = m.m05, m22 = m.m08;

    let trace = m00 + m11 + m22;

    if (trace > 0) {
      let s = 0.5 / Math.sqrt(trace + 1.0);

      out.w = 0.25 / s;
      out.x = (m21 - m12) * s;
      out.y = (m02 - m20) * s;
      out.z = (m10 - m01) * s;

    } else if ((m00 > m11) && (m00 > m22)) {
      let s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

      out.w = (m21 - m12) / s;
      out.x = 0.25 * s;
      out.y = (m01 + m10) / s;
      out.z = (m02 + m20) / s;

    } else if (m11 > m22) {
      let s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

      out.w = (m02 - m20) / s;
      out.x = (m01 + m10) / s;
      out.y = 0.25 * s;
      out.z = (m12 + m21) / s;

    } else {
      let s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

      out.w = (m10 - m01) / s;
      out.x = (m02 + m20) / s;
      out.y = (m12 + m21) / s;
      out.z = 0.25 * s;
    }

    return out;
  }

  /**
   * Creates a quaternion from the given euler angle x, y, z.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {number} x - Angle to rotate around X axis in degrees.
   * @param {number} y - Angle to rotate around Y axis in degrees.
   * @param {number} z - Angle to rotate around Z axis in degrees.
   * @returns {quat} out.
   * @function
   */
  static fromEuler(out, x, y, z) {
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out.x = sx * cy * cz - cx * sy * sz;
    out.y = cx * sy * cz + sx * cy * sz;
    out.z = cx * cy * sz - sx * sy * cz;
    out.w = cx * cy * cz + sx * sy * sz;

    return out;
  }

  /**
   * Convert a quaternion back to euler angle (in degrees).
   *
   * @param {vec3} out - Euler angle stored as a vec3
   * @param {number} q - the quaternion to be converted
   * @returns {vec3} out.
   */
  static toEuler(out, q) {
    let siny = 2.0 * (q.w * q.x + q.y * q.z);
    let cosy = 1 - 2 * (q.x * q.x + q.y * q.y);
    out.x = toDegree(Math.atan2(siny, cosy));

    let sinp = 2 * (q.w * q.y - q.z * q.x);
    if (Math.abs(sinp) >= 1) out.y = 90 * Math.sign(sinp);
    else out.y = toDegree(Math.asin(sinp));

    let sinr = 2 * (q.w * q.z + q.x * q.y);
    let cosr = 1 - 2 * (q.y * q.y + q.z * q.z);
    out.z = toDegree(Math.atan2(sinr, cosr));

    return out;
  }

  /**
   * Returns string representation of a quaternion.
   *
   * @param {quat} a - The quaternion.
   * @returns {String} - String representation of this quaternion.
   */
  static str(a) {
    return `quat(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
  }

  /**
   * Store components of a quaternion into array.
   *
   * @param {Array} out - Array to store result.
   * @param {quat} q - The quaternion.
   * @returns {Array} out.
   */
  static array(out, q) {
    out[0] = q.x;
    out[1] = q.y;
    out[2] = q.z;
    out[3] = q.w;

    return out;
  }

  /**
   * Returns whether the specified quaternions are equal. (Compared using ===)
   *
   * @param {quat} a - The first quaternion.
   * @param {quat} b - The second quaternion.
   * @returns {Boolean} True if the quaternions are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return vec4.exactEquals(a, b);
  }

  /**
   * Returns whether the specified quaternions are approximately equal.
   *
   * @param {quat} a The first quaternion.
   * @param {quat} b The second quaternion.
   * @returns {Boolean} True if the quaternions are approximately equal, false otherwise.
   */
  static equals(a, b) {
    return vec4.equals(a, b);
  }
}

export default quat;