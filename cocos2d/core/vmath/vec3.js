import { EPSILON, random } from './utils';

/**
 * Mathematical 3-dimensional vector.
 *
 * x, y, z is alias of the first, second, third component of vector, respectively.
 */
class vec3 {
	/**
   * Creates a vector, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   * @param {number} z - Value assigned to z component.
   */
  constructor(x = 0, y = 0, z = 0) {
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
  }

  /**
   * Creates a vector, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   * @param {number} z - Value assigned to z component.
   * @return {vec3} The newly created vector.
   */
  static create(x = 0, y = 0, z = 0) {
    return new vec3(x, y, z);
  }

  /**
   * Creates a zero vector.
   *
   * @return {vec3} The newly created vector.
   */
  static zero(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    return out;
  }

  /**
   * Clone a vector.
   *
   * @param {vec3} a - Vector to clone.
   * @returns {vec3} The newly created vector.
   */
  static clone(a) {
    return new vec3(a.x, a.y, a.z);
  }

  /**
   * Copy content of a vector into another.
   *
   * @param {vec3} out - The vector to modified.
   * @param {vec3} a - The specified vector.
   * @returns {vec3} out.
   */
  static copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
  }

  /**
   * Sets the components of a vector to the given values.
   *
   * @param {vec3} out - The vector to modified.
   * @param {Number} x - Value set to x component.
   * @param {Number} y - Value set to y component.
   * @param {Number} z - Value set to z component.
   * @returns {vec3} out.
   */
  static set(out, x, y, z) {
    out.x = x;
    out.y = y;
    out.z = z;
    return out;
  }

  /**
   * Add two vectors.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }

  /**
   * Subtract two vectors.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }

  /**
   * Alias of {@link vec3.subtract}.
   */
  static sub(out, a, b) {
    return vec3.subtract(out, a, b);
  }

  /**
   * Performs multiply on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  /**
   * Alias of {@link vec3.multiply}.
   */
  static mul(out, a, b) {
    return vec3.multiply(out, a, b);
  }

  /**
   * Performs division on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  }

  /**
   * Alias of {@link vec3.divide}.
   */
  static div(out, a, b) {
    return vec3.divide(out, a, b);
  }

  /**
   * Performs Math.ceil on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to perform operation.
   * @returns {vec3} out.
   */
  static ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    return out;
  }

  /**
   * Performs Math.floor on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to perform operation.
   * @returns {vec3} out.
   */
  static floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    return out;
  }

  /**
   * Performs Math.min on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }

  /**
   * Performs Math.min on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }

  /**
   * Performs Math.round on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to perform operation.
   * @returns {vec3} out.
   */
  static round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    return out;
  }

  /**
   * Scales a vector with a number.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to scale.
   * @param {number} b - The scale number.
   * @returns {vec3} out.
   * */
  static scale(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }

  /**
   * Add two vectors after scaling the second operand by a number.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @param {number} scale - The scale number before adding.
   * @returns {vec3} out.
   */
  static scaleAndAdd(out, a, b, scale) {
    out.x = a.x + (b.x * scale);
    out.y = a.y + (b.y * scale);
    out.z = a.z + (b.z * scale);
    return out;
  }

  /**
   * Calculates the euclidian distance between two vectors.
   *
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {number} Distance between a and b.
   */
  static distance(a, b) {
    let x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z;
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Alias of {@link vec3.distance}.
   */
  static dist(a, b) {
    return vec3.distance(a, b);
  }

  /**
   * Calculates the squared euclidian distance between two vectors.
   *
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {number} Squared distance between a and b.
   */
  static squaredDistance(a, b) {
    let x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z;
    return x * x + y * y + z * z;
  }

  /**
   * Alias of {@link vec3.squaredDistance}.
   */
  static sqrDist(a, b) {
    return vec3.squaredDistance(a, b);
  }

  /**
   * Calculates the length of a vector.
   *
   * @param {vec3} a - The vector.
   * @returns {Number} Length of the vector.
   */
  static magnitude(a) {
    let x = a.x,
      y = a.y,
      z = a.z;
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   *Alias of {@link vec3.magnitude}.
   */
  static mag(a) {
    return vec3.magnitude(a);
  }

  /**
   * Calculates the squared length of a vector.
   *
   * @param {vec3} a - The vector.
   * @returns {Number} Squared length of the vector.
   */
  static squaredMagnitude(a) {
    let x = a.x,
      y = a.y,
      z = a.z;
    return x * x + y * y + z * z;
  }

  /**
   *Alias of {@link vec3.squaredMagnitude}
   */
  static sqrMag(a) {
    return vec3.squaredMagnitude(a);
  }

  /**
   * Negates each component of a vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to negate.
   * @returns {vec3} out.
   */
  static negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    return out;
  }

  /**
   * Inverts the components of a vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to invert.
   * @returns {vec3} out.
   */
  static inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    return out;
  }

  /**
   * Safely inverts the components of a vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to invert.
   * @returns {vec3} out.
   */
  static inverseSafe(out, a) {
    let x = a.x,
      y = a.y,
      z = a.z;

    if (Math.abs(x) < EPSILON) {
      out.x = 0;
    } else {
      out.x = 1.0 / x;
    }

    if (Math.abs(y) < EPSILON) {
      out.y = 0;
    } else {
      out.y = 1.0 / y;
    }

    if (Math.abs(z) < EPSILON) {
      out.z = 0;
    } else {
      out.z = 1.0 / z;
    }

    return out;
  }

  /**
   * Normalizes a vector.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to normalize.
   * @returns {vec3} out.
   */
  static normalize(out, a) {
    let x = a.x,
      y = a.y,
      z = a.z;

    let len = x * x + y * y + z * z;
    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
      out.x = x * len;
      out.y = y * len;
      out.z = z * len;
    }
    return out;
  }

  /**
   * Calculates the dot product of two vectors.
   *
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {Number} Dot product of a and b.
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * Calculates the cross product of two vectors.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {vec3} out.
   */
  static cross(out, a, b) {
    let ax = a.x, ay = a.y, az = a.z,
      bx = b.x, by = b.y, bz = b.z;

    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }

  /**
   * Performs a linear interpolation between two vectors.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {vec3} out.
   */
  static lerp(out, a, b, t) {
    let ax = a.x,
      ay = a.y,
      az = a.z;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    out.z = az + t * (b.z - az);
    return out;
  }

  /**
   * Performs a hermite interpolation with two control points.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @param {vec3} c - The third operand.
   * @param {vec3} d - The fourth operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {vec3} out.
   */
  static hermite(out, a, b, c, d, t) {
    let factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);

    out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
    out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
    out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

    return out;
  }

  /**
   * Performs a bezier interpolation with two control points.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @param {vec3} c - The third operand.
   * @param {vec3} d - The fourth operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {vec3} out.
   */
  static bezier(out, a, b, c, d, t) {
    let inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;

    out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
    out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
    out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

    return out;
  }

  /**
   * Generates a random vector uniformly distributed on a sphere centered at the origin.
   *
   * @param {vec3} out - Vector to store result.
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit length vector will be returned.
   * @returns {vec3} out.
   */
  static random(out, scale) {
    scale = scale || 1.0;

    let phi = random() * 2.0 * Math.PI;
    let theta = Math.acos(random() * 2 - 1);

    out.x = Math.sin(theta) * Math.cos(phi) * scale;
    out.y = Math.sin(theta) * Math.sin(phi) * scale;
    out.z = Math.cos(theta) * scale;
    return out;
  }

  /**
   * Transforms a point vector with a 4x4 matrix,
   * i.e. 4th vector component is implicitly '1'.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to transform.
   * @param {mat4} m - The matrix.
   * @returns {vec3} out.
   */
  static transformMat4(out, a, m) {
    let mm = m.m;
    let x = a.x, y = a.y, z = a.z,
      rhw = mm[3] * x + mm[7] * y + mm[11] * z + mm[15];
    rhw = rhw ? 1 / rhw : 1;
    out.x = (mm[0] * x + mm[4] * y + mm[8] * z + mm[12]) * rhw;
    out.y = (mm[1] * x + mm[5] * y + mm[9] * z + mm[13]) * rhw;
    out.z = (mm[2] * x + mm[6] * y + mm[10] * z + mm[14]) * rhw;
    return out;
  }

  /**
   * Transforms a normal vector with a 4x4 matrix,
   * i.e. 4th vector component is implicitly '0'.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to transform.
   * @param {mat4} m - The matrix.
   * @returns {vec3} out.
   */
  static transformMat4Normal(out, a, m) {
    let mm = m.m;
    let x = a.x, y = a.y, z = a.z,
      rhw = mm[3] * x + mm[7] * y + mm[11] * z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (mm[0] * x + mm[4] * y + mm[8] * z) * rhw;
    out.y = (mm[1] * x + mm[5] * y + mm[9] * z) * rhw;
    out.z = (mm[2] * x + mm[6] * y + mm[10] * z) * rhw;
    return out;
  }

  /**
   * Transforms a vector with a 3x3 matrix.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to transform.
   * @param {mat3} m - The matrix.
   * @returns {vec3} out.
   */
  static transformMat3(out, a, m) {
    let mm = m.m;
    let x = a.x, y = a.y, z = a.z;
    out.x = x * mm[0] + y * mm[3] + z * mm[6];
    out.y = x * mm[1] + y * mm[4] + z * mm[7];
    out.z = x * mm[2] + y * mm[5] + z * mm[8];
    return out;
  }

  /**
   * Transforms a vector with a quaternion.
   *
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - Vector to transform.
   * @param {quat} q - The quaternion.
   * @returns {vec3} out.
   */
  static transformQuat(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    let x = a.x, y = a.y, z = a.z;
    let qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    // calculate quat * vec
    let ix = qw * x + qy * z - qz * y;
    let iy = qw * y + qz * x - qx * z;
    let iz = qw * z + qx * y - qy * x;
    let iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
  }

  /**
   * Rotates a 3D vector around the x-axis.
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The point to rotate.
   * @param {vec3} b - The origin of the rotation.
   * @param {Number} c - The angle of rotation.
   * @returns {vec3} out.
   */
  static rotateX(out, a, b, c) {
    // Translate point to the origin
    let px = a.x - b.x;
    let py = a.y - b.y;
    let pz = a.z - b.z;

    //perform rotation
    let rx = px;
    let ry = py * Math.cos(c) - pz * Math.sin(c);
    let rz = py * Math.sin(c) + pz * Math.cos(c);

    //translate to correct position
    out.x = rx + b.x;
    out.y = ry + b.y;
    out.z = rz + b.z;

    return out;
  }

  /**
   * Rotates a 3D vector around the y-axis.
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The point to rotate.
   * @param {vec3} b - The origin of the rotation.
   * @param {Number} c - The angle of rotation.
   * @returns {vec3} out.
   */
  static rotateY(out, a, b, c) {
    //Translate point to the origin
    let px = a.x - b.x;
    let py = a.y - b.y;
    let pz = a.z - b.z;

    //perform rotation
    let rx = pz * Math.sin(c) + px * Math.cos(c);
    let ry = py;
    let rz = pz * Math.cos(c) - px * Math.sin(c);

    //translate to correct position
    out.x = rx + b.x;
    out.y = ry + b.y;
    out.z = rz + b.z;

    return out;
  }

  /**
   * Rotates a 3D vector around the z-axis.
   * @param {vec3} out - Vector to store result.
   * @param {vec3} a - The point to rotate.
   * @param {vec3} b - The origin of the rotation.
   * @param {Number} c - The angle of rotation.
   * @returns {vec3} out.
   */
  static rotateZ(out, a, b, c) {
    //Translate point to the origin
    let px = a.x - b.x;
    let py = a.y - b.y;
    let pz = a.z - b.z;

    //perform rotation
    let rx = px * Math.cos(c) - py * Math.sin(c);
    let ry = px * Math.sin(c) + py * Math.cos(c);
    let rz = pz;

    //translate to correct position
    out.x = rx + b.x;
    out.y = ry + b.y;
    out.z = rz + b.z;

    return out;
  }

  /**
   * Returns string representation of a vector.
   *
   * @param {vec3} a - The vector.
   * @returns {String} - String representation of this vector.
   */
  static str(a) {
    return `vec3(${a.x}, ${a.y}, ${a.z})`;
  }

  /**
   * Store components of a vector into array.
   *
   * @param {Array} out - Array to store result.
   * @param {vec3} v - The vector.
   * @returns {Array} out.
   */
  static array(out, v) {
    out[0] = v.x;
    out[1] = v.y;
    out[2] = v.z;

    return out;
  }

  /**
   * Returns whether the specified vectors are equal. (Compared using ===)
   *
   * @param {vec3} a - The first vector.
   * @param {vec3} b - The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }

  /**
   * Returns whether the specified vectors are approximately equal.
   *
   * @param {vec3} a The first vector.
   * @param {vec3} b The second vector.
   * @returns {Boolean} True if the vectors are approximately equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.x, a1 = a.y, a2 = a.z;
    let b0 = b.x, b1 = b.y, b2 = b.z;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
  }

  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over.
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed.
   * @param {Number} offset Number of elements to skip at the beginning of the array.
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array.
   * @param {Function} fn Function to call for each vector in the array.
   * @param {Object} [arg] additional argument to pass to fn.
   * @returns {Array} a.
   */
  static forEach(a, stride, offset, count, fn, arg) {
    return vec3._forEach(a, stride, offset, count, fn, arg);
  }

  /**
   * Gets the angle between two vectors.
   * @param {vec3} a - The first operand.
   * @param {vec3} b - The second operand.
   * @returns {Number} - The angle in radians.
   */
  static angle(a, b) {
    return vec3._angle(a, b);
  }

  /**
   * Projects a vector onto a plane represented by its normal.
   * @param {vec3} out The result vector.
   * @param {vec3} a The vector.
   * @param {vec3} n The plane's normal.
   */
  static projectOnPlane(out, a, n) {
    return vec3.sub(out, a, vec3.project(out, a, n));
  }

  /**
   * Projects a vector onto another vector.
   * @param {vec3} out The result vector.
   * @param {vec3} a The vector to project.
   * @param {vec3} b The vector onto which the projection performs.
   */
  static project(out, a, b) {
    let sqrLen = vec3.squaredMagnitude(b);
    if (sqrLen < 0.000001)
      return vec3.set(out, 0, 0, 0);
    else
      return vec3.scale(out, b, vec3.dot(a, b) / sqrLen);
  }
}

/**
* Perform some operation over an array of vec3s.
*
* @param {Array} a the array of vectors to iterate over.
* @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed.
* @param {Number} offset Number of elements to skip at the beginning of the array.
* @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array.
* @param {Function} fn Function to call for each vector in the array.
* @param {Object} [arg] additional argument to pass to fn.
* @returns {Array} a.
* @ignore.
*/
vec3._forEach = (function () {
  let vec = vec3.create(0, 0, 0);

  return function (a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec.x = a[i];
      vec.y = a[i + 1];
      vec.z = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec.x;
      a[i + 1] = vec.y;
      a[i + 2] = vec.z;
    }

    return a;
  };
})();

/**
 * Get the angle between two 3D vectors.
 * @param {vec3} a The first operand.
 * @param {vec3} b The second operand.
 * @returns {Number} The angle in radians.
 * @ignore
 */
vec3._angle = (function () {
  let tempA = vec3.create(0, 0, 0);
  let tempB = vec3.create(0, 0, 0);

  return function (a, b) {
    vec3.copy(tempA, a);
    vec3.copy(tempB, b);

    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);

    let cosine = vec3.dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  };
})();

export default vec3;