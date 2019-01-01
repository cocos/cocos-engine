import { EPSILON, random } from './utils';

/**
 * Mathematical 2-dimensional vector.
 *
 * x, y is alias of the first, second component of vector, respectively.
 */
class vec2 {
  /**
   * Creates a vector, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   */
  constructor(x = 0, y = 0) {
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
  }

  /**
   * Creates a vector, with components specified separately.
   *
   * @param {number} x - Value assigned to x component.
   * @param {number} y - Value assigned to y component.
   * @return {vec2} The newly created vector.
   */
  static create(x = 0, y = 0) {
    return new vec2(x, y);
  }

  /**
   * Creates a zero vector.
   *
   * @return {vec2} The newly created vector.
   */
  static zero(out) {
    out.x = 0;
    out.y = 0;
    return out;
  }

  /**
   * Clone a vector.
   *
   * @param {vec2} a - Vector to clone.
   * @returns {vec2} The newly created vector.
   */
  static clone(a) {
    return new vec2(a.x, a.y);
  }

  /**
   * Copy content of a vector into another.
   *
   * @param {vec2} out - The vector to modified.
   * @param {vec2} a - The specified vector.
   * @returns {vec2} out.
   */
  static copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
  }

  /**
   * Sets the components of a vector to the given values.
   *
   * @param {vec2} out - The vector to modified.
   * @param {Number} x - Value set to x component.
   * @param {Number} y - Value set to y component.
   * @returns {vec2} out.
   */
  static set(out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  }

  /**
   * Add two vectors.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  /**
   * Subtract two vectors.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }

  /**
   *Alias of {@link vec2.subtract}.
   */
  static sub(out, a, b) {
    return vec2.subtract(out, a, b);
  }

  /**
   * Performs multiply on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }

  /**
   *Alias of {@link vec2.multiply}.
   */
  static mul(out, a, b) {
    return vec2.multiply(out, a, b);
  }

  /**
   * Performs division on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  }

  /**
   *Alias of {@link vec2.divide}.
   */
  static div(out, a, b) {
    return vec2.divide(out, a, b);
  }

  /**
   * Performs Math.ceil on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to perform operation.
   * @returns {vec2} out.
   */
  static ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    return out;
  }

  /**
   * Performs Math.floor on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to perform operation.
   * @returns {vec2} out.
   */
  static floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    return out;
  }

  /**
   * Performs Math.min on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }

  /**
   * Performs Math.min on each component of two vectors respectively.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec2} out.
   */
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }

  /**
   * Performs Math.round on each component of a vector.
   *
   * It doesn't matter that any amount of these parameters refer to same vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to perform operation.
   * @returns {vec2} out.
   */
  static round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    return out;
  }

  /**
   * Scales a vector with a number.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to scale.
   * @param {number} b - The scale number.
   * @returns {vec2} out.
   * */
  static scale(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  }

  /**
   * Add two vectors after scaling the second operand by a number.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @param {number} scale - The scale number before adding.
   * @returns {vec2} out.
   */
  static scaleAndAdd(out, a, b, scale) {
    out.x = a.x + (b.x * scale);
    out.y = a.y + (b.y * scale);
    return out;
  }

  /**
   * Calculates the euclidian distance between two vectors.
   *
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {number} Distance between a and b.
   */
  static distance(a, b) {
    let x = b.x - a.x,
      y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  }

  /**
   *Alias of {@link vec2.distance}.
   */
  static dist(a, b) {
    return vec2.distance(a, b);
  }

  /**
   * Calculates the squared euclidian distance between two vectors.
   *
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {number} Squared distance between a and b.
   */
  static squaredDistance(a, b) {
    let x = b.x - a.x,
      y = b.y - a.y;
    return x * x + y * y;
  }

  /**
   *Alias of {@link vec2.squaredDistance}.
   */
  static sqrDist(a, b) {
    return vec2.squaredDistance(a, b);
  }

  /**
   * Calculates the length of a vector.
   *
   * @param {vec2} a - The vector.
   * @returns {Number} Length of the vector.
   */
  static magnitude(a) {
    let x = a.x,
      y = a.y;
    return Math.sqrt(x * x + y * y);
  }

  /**
   *Alias of {@link vec2.magnitude}.
   */
  static mag(a) {
    return vec2.magnitude(a);
  }

  /**
   * Calculates the squared length of a vector.
   *
   * @param {vec2} a - The vector.
   * @returns {Number} Squared length of the vector.
   */
  static squaredMagnitude(a) {
    let x = a.x,
      y = a.y;
    return x * x + y * y;
  }

  /**
   *Alias of {@link vec2.squaredMagnitude}
   */
  static sqrMag(a) {
    return vec2.squaredMagnitude(a);
  }

  /**
   * Negates each component of a vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to negate.
   * @returns {vec2} out.
   */
  static negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    return out;
  }

  /**
   * Invert the components of a vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to invert.
   * @returns {vec2} out.
   */
  static inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    return out;
  }

  /**
   * Safely invert the components of a vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to invert.
   * @returns {vec2} out.
   */
  static inverseSafe(out, a) {
    let x = a.x,
      y = a.y;

    if (Math.abs(x) < EPSILON) {
      out.x = 0;
    } else {
      out.x = 1.0 / x;
    }

    if (Math.abs(y) < EPSILON) {
      out.y = 0;
    } else {
      out.y = 1.0 / a.y;
    }

    return out;
  }

  /**
   * Normalizes a vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to normalize.
   * @returns {vec2} out.
   */
  static normalize(out, a) {
    let x = a.x,
      y = a.y;
    let len = x * x + y * y;
    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
      out.x = a.x * len;
      out.y = a.y * len;
    }
    return out;
  }

  /**
   * Calculates the dot product of two vectors.
   *
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {Number} Dot product of a and b.
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * Calculate the cross product of two vectors.
   * Note that the cross product must by definition produce a 3D vector.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @returns {vec3} out.
   */
  static cross(out, a, b) {
    let z = a.x * b.y - a.y * b.x;
    out.x = out.y = 0;
    out.z = z;
    return out;
  }

  /**
   * Performs a linear interpolation between two vectors.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - The first operand.
   * @param {vec2} b - The second operand.
   * @param {Number} t - The interpolation coefficient.
   * @returns {vec2} out.
   */
  static lerp(out, a, b, t) {
    let ax = a.x,
      ay = a.y;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    return out;
  }

  /**
   * Generates a random vector uniformly distributed on a circle centered at the origin.
   *
   * @param {vec2} out - Vector to store result.
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit length vector will be returned.
   * @returns {vec2} out.
   */
  static random(out, scale) {
    scale = scale || 1.0;
    let r = random() * 2.0 * Math.PI;
    out.x = Math.cos(r) * scale;
    out.y = Math.sin(r) * scale;
    return out;
  }

  /**
   * Transforms a vector with a 2x2 matrix.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to transform.
   * @param {mat2} m - The matrix.
   * @returns {vec2} out.
   */
  static transformMat2(out, a, m) {
    let x = a.x,
      y = a.y;
    out.x = m.m00 * x + m.m02 * y;
    out.y = m.m01 * x + m.m03 * y;
    return out;
  }

  /**
   * Transforms a vector with a 2x3 matrix.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to transform.
   * @param {mat23} m - The matrix.
   * @returns {vec2} out.
   */
  static transformMat23(out, a, m) {
    let x = a.x,
      y = a.y;
    out.x = m.m00 * x + m.m02 * y + m.m04;
    out.y = m.m01 * x + m.m03 * y + m.m05;
    return out;
  }

  /**
   * Transforms a vector with a 3x3 matrix.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to transform.
   * @param {mat3} m - The matrix.
   * @returns {vec2} out.
   */
  static transformMat3(out, a, m) {
    let x = a.x,
      y = a.y;
    out.x = m.m00 * x + m.m03 * y + m.m06;
    out.y = m.m01 * x + m.m04 * y + m.m07;
    return out;
  }

  /**
   * Transforms a vector with a 4x4 matrix.
   * 3rd vector component is implicitly '0'.
   * 4th vector component is implicitly '1'.
   *
   * @param {vec2} out - Vector to store result.
   * @param {vec2} a - Vector to transform.
   * @param {mat4} m - The matrix.
   * @returns {vec2} out.
   */
  static transformMat4(out, a, m) {
    let x = a.x,
      y = a.y;
    out.x = m.m00 * x + m.m04 * y + m.m12;
    out.y = m.m01 * x + m.m05 * y + m.m13;
    return out;
  }

  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over.
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed.
   * @param {Number} offset Number of elements to skip at the beginning of the array.
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array.
   * @param {Function} fn Function to call for each vector in the array.
   * @param {Object} [arg] additional argument to pass to fn.
   * @returns {Array} a.
   */
  static forEach(a, stride, offset, count, fn, arg) {
    return vec2._forEach(a, stride, offset, count, fn, arg);
  }

  /**
   * Returns string representation of a vector.
   *
   * @param {vec2} a - The vector.
   * @returns {String} - String representation of this vector.
   */
  static str(a) {
    return `vec2(${a.x}, ${a.y})`;
  }

  /**
   * Store components of a vector into array.
   *
   * @param {Array} out - Array to store result.
   * @param {vec2} v - The vector.
   * @returns {Array} out.
   */
  static array(out, v) {
    out[0] = v.x;
    out[1] = v.y;

    return out;
  }

  /**
   * Returns whether the specified vectors are equal. (Compared using ===)
   *
   * @param {vec2} a - The first vector.
   * @param {vec2} b - The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  /**
   * Returns whether the specified vectors are approximately equal.
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are approximately equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.x, a1 = a.y;
    let b0 = b.x, b1 = b.y;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
  }

  /**
   * Returns the angle between the two vectors.
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Number} The angle in radians.
   */
  static angle(a, b) {
    return vec2._angle(a, b);
  } 
}

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over.
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed.
 * @param {Number} offset Number of elements to skip at the beginning of the array.
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array.
 * @param {Function} fn Function to call for each vector in the array.
 * @param {Object} [arg] additional argument to pass to fn.
 * @returns {Array} a.
 * @ignore
 */
vec2._forEach = (function () {
  let vec = vec2.create(0, 0);

  return function (a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 2;
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
      fn(vec, vec, arg);
      a[i] = vec.x;
      a[i + 1] = vec.y;
    }

    return a;
  };
})();

vec2._angle = (function () {
  let tempA = vec2.create(0, 0);
  let tempB = vec2.create(0, 0);

  return function (a, b) {
    vec2.normalize(tempA, a);
    vec2.normalize(tempB, b);
    let cosine = vec2.dot(tempA, tempB);
    if (cosine > 1.0) {
      return 0;
    }
    if (cosine < -1.0) {
      return Math.PI;
    }
    return Math.acos(cosine);
  };
})();

export default vec2;