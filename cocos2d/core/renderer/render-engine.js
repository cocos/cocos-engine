
/*
 * engine-next.js v0.3.1
 * (c) 2018 @pandamicro
 * Released under the MIT License.
 */

module.exports = (function () {
  'use strict';
  
  const _d2r = Math.PI / 180.0;
  const _r2d = 180.0 / Math.PI;
  
  /**
   * @property {number} EPSILON
   */
  const EPSILON = 0.000001;
  
  /**
   * Tests whether or not the arguments have approximately the same value, within an absolute
   * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
   * than or equal to 1.0, and a relative tolerance is used for larger values)
   *
   * @param {Number} a The first number to test.
   * @param {Number} b The second number to test.
   * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
   */
  function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
  }
  
  /**
   * Tests whether or not the arguments have approximately the same value by given maxDiff
   *
   * @param {Number} a The first number to test.
   * @param {Number} b The second number to test.
   * @param {Number} maxDiff Maximum difference.
   * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
   */
  function approx(a, b, maxDiff) {
    maxDiff = maxDiff || EPSILON;
    return Math.abs(a - b) <= maxDiff;
  }
  
  /**
   * Clamps a value between a minimum float and maximum float value.
   *
   * @method clamp
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }
  
  /**
   * Clamps a value between 0 and 1.
   *
   * @method clamp01
   * @param {number} val
   * @return {number}
   */
  function clamp01(val) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
  }
  
  /**
   * @method lerp
   * @param {number} from
   * @param {number} to
   * @param {number} ratio - the interpolation coefficient
   * @return {number}
   */
  function lerp(from, to, ratio) {
    return from + (to - from) * ratio;
  }
  
  /**
  * Convert Degree To Radian
  *
  * @param {Number} a Angle in Degrees
  */
  function toRadian(a) {
    return a * _d2r;
  }
  
  /**
  * Convert Radian To Degree
  *
  * @param {Number} a Angle in Radian
  */
  function toDegree(a) {
    return a * _r2d;
  }
  
  /**
  * @method random
  */
  const random = Math.random;
  
  /**
   * Returns a floating-point random number between min (inclusive) and max (exclusive).
   *
   * @method randomRange
   * @param {number} min
   * @param {number} max
   * @return {number} the random number
   */
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  /**
   * Returns a random integer between min (inclusive) and max (exclusive).
   *
   * @method randomRangeInt
   * @param {number} min
   * @param {number} max
   * @return {number} the random integer
   */
  function randomRangeInt(min, max) {
    return Math.floor(randomRange(min, max));
  }
  
  /**
   * Returns the next power of two for the value
   *
   * @method nextPow2
   * @param {number} val
   * @return {number} the the next power of two
   */
  function nextPow2(val) {
    --val;
    val = (val >> 1) | val;
    val = (val >> 2) | val;
    val = (val >> 4) | val;
    val = (val >> 8) | val;
    val = (val >> 16) | val;
    ++val;
  
    return val;
  }
  
  /**
   * Bit twiddling hacks for JavaScript.
   *
   * Author: Mikola Lysenko
   *
   * Ported from Stanford bit twiddling hack library:
   *    http://graphics.stanford.edu/~seander/bithacks.html
   */
  
  // Number of bits in an integer
  const INT_BITS = 32;
  const INT_MAX =  0x7fffffff;
  const INT_MIN = -1<<(INT_BITS-1);
  
  /**
   * Returns -1, 0, +1 depending on sign of x
   *
   * @param {number} v
   * @returns {number}
   */
  function sign(v) {
    return (v > 0) - (v < 0);
  }
  
  /**
   * Computes absolute value of integer
   *
   * @param {number} v
   * @returns {number}
   */
  function abs(v) {
    let mask = v >> (INT_BITS-1);
    return (v ^ mask) - mask;
  }
  
  /**
   * Computes minimum of integers x and y
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function min(x, y) {
    return y ^ ((x ^ y) & -(x < y));
  }
  
  /**
   * Computes maximum of integers x and y
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function max(x, y) {
    return x ^ ((x ^ y) & -(x < y));
  }
  
  /**
   * Checks if a number is a power of two
   *
   * @param {number} v
   * @returns {boolean}
   */
  function isPow2(v) {
    return !(v & (v-1)) && (!!v);
  }
  
  /**
   * Computes log base 2 of v
   *
   * @param {number} v
   * @returns {number}
   */
  function log2(v) {
    let r, shift;
    r =     (v > 0xFFFF) << 4; v >>>= r;
    shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
    shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
    shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
    return r | (v >> 1);
  }
  
  /**
   * Computes log base 10 of v
   *
   * @param {number} v
   * @returns {number}
   */
  function log10(v) {
    return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
            (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
            (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
  }
  
  /**
   * Counts number of bits
   *
   * @param {number} v
   * @returns {number}
   */
  function popCount(v) {
    v = v - ((v >>> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
    return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
  }
  
  /**
   * Counts number of trailing zeros
   *
   * @param {number} v
   * @returns {number}
   */
  function countTrailingZeros(v) {
    let c = 32;
    v &= -v;
    if (v) c--;
    if (v & 0x0000FFFF) c -= 16;
    if (v & 0x00FF00FF) c -= 8;
    if (v & 0x0F0F0F0F) c -= 4;
    if (v & 0x33333333) c -= 2;
    if (v & 0x55555555) c -= 1;
    return c;
  }
  
  /**
   * Rounds to next power of 2
   *
   * @param {number} v
   * @returns {number}
   */
  function nextPow2$1(v) {
    v += v === 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
  }
  
  /**
   * Rounds down to previous power of 2
   *
   * @param {number} v
   * @returns {number}
   */
  function prevPow2(v) {
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v - (v>>>1);
  }
  
  /**
   * Computes parity of word
   *
   * @param {number} v
   * @returns {number}
   */
  function parity(v) {
    v ^= v >>> 16;
    v ^= v >>> 8;
    v ^= v >>> 4;
    v &= 0xf;
    return (0x6996 >>> v) & 1;
  }
  
  const REVERSE_TABLE = new Array(256);
  
  (function(tab) {
    for(let i=0; i<256; ++i) {
      let v = i, r = i, s = 7;
      for (v >>>= 1; v; v >>>= 1) {
        r <<= 1;
        r |= v & 1;
        --s;
      }
      tab[i] = (r << s) & 0xff;
    }
  })(REVERSE_TABLE);
  
  /**
   * Reverse bits in a 32 bit word
   *
   * @param {number} v
   * @returns {number}
   */
  function reverse(v) {
    return (REVERSE_TABLE[v & 0xff] << 24) |
           (REVERSE_TABLE[(v >>> 8) & 0xff] << 16) |
           (REVERSE_TABLE[(v >>> 16) & 0xff] << 8) |
           REVERSE_TABLE[(v >>> 24) & 0xff];
  }
  
  /**
   * Interleave bits of 2 coordinates with 16 bits. Useful for fast quadtree codes
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function interleave2(x, y) {
    x &= 0xFFFF;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
  
    y &= 0xFFFF;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;
  
    return x | (y << 1);
  }
  
  /**
   * Extracts the nth interleaved component
   *
   * @param {number} v
   * @param {number} n
   * @returns {number}
   */
  function deinterleave2(v, n) {
    v = (v >>> n) & 0x55555555;
    v = (v | (v >>> 1))  & 0x33333333;
    v = (v | (v >>> 2))  & 0x0F0F0F0F;
    v = (v | (v >>> 4))  & 0x00FF00FF;
    v = (v | (v >>> 16)) & 0x000FFFF;
    return (v << 16) >> 16;
  }
  
  /**
   * Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number}
   */
  function interleave3(x, y, z) {
    x &= 0x3FF;
    x  = (x | (x<<16)) & 4278190335;
    x  = (x | (x<<8))  & 251719695;
    x  = (x | (x<<4))  & 3272356035;
    x  = (x | (x<<2))  & 1227133513;
  
    y &= 0x3FF;
    y  = (y | (y<<16)) & 4278190335;
    y  = (y | (y<<8))  & 251719695;
    y  = (y | (y<<4))  & 3272356035;
    y  = (y | (y<<2))  & 1227133513;
    x |= (y << 1);
  
    z &= 0x3FF;
    z  = (z | (z<<16)) & 4278190335;
    z  = (z | (z<<8))  & 251719695;
    z  = (z | (z<<4))  & 3272356035;
    z  = (z | (z<<2))  & 1227133513;
  
    return x | (z << 2);
  }
  
  /**
   * Extracts nth interleaved component of a 3-tuple
   *
   * @param {number} v
   * @param {number} n
   * @returns {number}
   */
  function deinterleave3(v, n) {
    v = (v >>> n)       & 1227133513;
    v = (v | (v>>>2))   & 3272356035;
    v = (v | (v>>>4))   & 251719695;
    v = (v | (v>>>8))   & 4278190335;
    v = (v | (v>>>16))  & 0x3FF;
    return (v<<22)>>22;
  }
  
  /**
   * Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
   *
   * @param {number} v
   * @returns {number}
   */
  function nextCombination(v) {
    let t = v | (v - 1);
    return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
  }
  
  var bits_ = Object.freeze({
    INT_BITS: INT_BITS,
    INT_MAX: INT_MAX,
    INT_MIN: INT_MIN,
    sign: sign,
    abs: abs,
    min: min,
    max: max,
    isPow2: isPow2,
    log2: log2,
    log10: log10,
    popCount: popCount,
    countTrailingZeros: countTrailingZeros,
    nextPow2: nextPow2$1,
    prevPow2: prevPow2,
    parity: parity,
    reverse: reverse,
    interleave2: interleave2,
    deinterleave2: deinterleave2,
    interleave3: interleave3,
    deinterleave3: deinterleave3,
    nextCombination: nextCombination
  });
  
  let _tmp = new Array(2);
  
  class _vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    toJSON() {
      _tmp[0] = this.x;
      _tmp[1] = this.y;
  
      return _tmp;
    }
  }
  
  /**
   * @class 2 Dimensional Vector
   * @name vec2
   */
  let vec2 = {};
  
  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */
  vec2.create = function () {
    return new _vec2(0, 0);
  };
  
  /**
   * Creates a new vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} a new 2D vector
   */
  vec2.new = function (x, y) {
    return new _vec2(x, y);
  };
  
  /**
   * Creates a new vec2 initialized with values from an existing vector
   *
   * @param {vec2} a vector to clone
   * @returns {vec2} a new 2D vector
   */
  vec2.clone = function (a) {
    return new _vec2(a.x, a.y);
  };
  
  /**
   * Copy the values from one vec2 to another
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the source vector
   * @returns {vec2} out
   */
  vec2.copy = function (out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
  };
  
  /**
   * Set the components of a vec2 to the given values
   *
   * @param {vec2} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} out
   */
  vec2.set = function (out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  };
  
  /**
   * Adds two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.add = function (out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  };
  
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.subtract = function (out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  };
  
  /**
   * Alias for {@link vec2.subtract}
   * @function
   */
  vec2.sub = vec2.subtract;
  
  /**
   * Multiplies two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.multiply = function (out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  };
  
  /**
   * Alias for {@link vec2.multiply}
   * @function
   */
  vec2.mul = vec2.multiply;
  
  /**
   * Divides two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.divide = function (out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  };
  
  /**
   * Alias for {@link vec2.divide}
   * @function
   */
  vec2.div = vec2.divide;
  
  /**
   * Math.ceil the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to ceil
   * @returns {vec2} out
   */
  vec2.ceil = function (out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    return out;
  };
  
  /**
   * Math.floor the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to floor
   * @returns {vec2} out
   */
  vec2.floor = function (out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    return out;
  };
  
  /**
   * Returns the minimum of two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.min = function (out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  };
  
  /**
   * Returns the maximum of two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */
  vec2.max = function (out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  };
  
  /**
   * Math.round the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to round
   * @returns {vec2} out
   */
  vec2.round = function (out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    return out;
  };
  
  /**
   * Scales a vec2 by a scalar number
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec2} out
   */
  vec2.scale = function (out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  };
  
  /**
   * Adds two vec2's after scaling the second operand by a scalar value
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec2} out
   */
  vec2.scaleAndAdd = function (out, a, b, scale) {
    out.x = a.x + (b.x * scale);
    out.y = a.y + (b.y * scale);
    return out;
  };
  
  /**
   * Calculates the euclidian distance between two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} distance between a and b
   */
  vec2.distance = function (a, b) {
    let x = b.x - a.x,
        y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  };
  
  /**
   * Alias for {@link vec2.distance}
   * @function
   */
  vec2.dist = vec2.distance;
  
  /**
   * Calculates the squared euclidian distance between two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} squared distance between a and b
   */
  vec2.squaredDistance = function (a, b) {
    let x = b.x - a.x,
        y = b.y - a.y;
    return x * x + y * y;
  };
  
  /**
   * Alias for {@link vec2.squaredDistance}
   * @function
   */
  vec2.sqrDist = vec2.squaredDistance;
  
  /**
   * Calculates the length of a vec2
   *
   * @param {vec2} a vector to calculate length of
   * @returns {Number} length of a
   */
  vec2.length = function (a) {
    let x = a.x,
        y = a.y;
    return Math.sqrt(x * x + y * y);
  };
  
  /**
   * Alias for {@link vec2.length}
   * @function
   */
  vec2.len = vec2.length;
  
  /**
   * Calculates the squared length of a vec2
   *
   * @param {vec2} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */
  vec2.squaredLength = function (a) {
    let x = a.x,
        y = a.y;
    return x * x + y * y;
  };
  
  /**
   * Alias for {@link vec2.squaredLength}
   * @function
   */
  vec2.sqrLen = vec2.squaredLength;
  
  /**
   * Negates the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to negate
   * @returns {vec2} out
   */
  vec2.negate = function (out, a) {
    out.x = -a.x;
    out.y = -a.y;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to invert
   * @returns {vec2} out
   */
  vec2.inverse = function (out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec2 safely
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to invert
   * @returns {vec2} out
   */
  vec2.inverseSafe = function (out, a) {
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
  };
  
  /**
   * Normalize a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to normalize
   * @returns {vec2} out
   */
  vec2.normalize = function (out, a) {
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
  };
  
  /**
   * Calculates the dot product of two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} dot product of a and b
   */
  vec2.dot = function (a, b) {
    return a.x * b.x + a.y * b.y;
  };
  
  /**
   * Computes the cross product of two vec2's
   * Note that the cross product must by definition produce a 3D vector
   *
   * @param {vec3} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec3} out
   */
  vec2.cross = function (out, a, b) {
    let z = a.x * b.y - a.y * b.x;
    out.x = out.y = 0;
    out.z = z;
    return out;
  };
  
  /**
   * Performs a linear interpolation between two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {vec2} out
   */
  vec2.lerp = function (out, a, b, t) {
    let ax = a.x,
        ay = a.y;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    return out;
  };
  
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec2} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec2} out
   */
  vec2.random = function (out, scale) {
    scale = scale || 1.0;
    let r = random() * 2.0 * Math.PI;
    out.x = Math.cos(r) * scale;
    out.y = Math.sin(r) * scale;
    return out;
  };
  
  /**
   * Transforms the vec2 with a mat2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat2} m matrix to transform with
   * @returns {vec2} out
   */
  vec2.transformMat2 = function (out, a, m) {
    let x = a.x,
        y = a.y;
    out.x = m.m00 * x + m.m02 * y;
    out.y = m.m01 * x + m.m03 * y;
    return out;
  };
  
  /**
   * Transforms the vec2 with a mat23
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat23} m matrix to transform with
   * @returns {vec2} out
   */
  vec2.transformMat23 = function (out, a, m) {
    let x = a.x,
        y = a.y;
    out.x = m.m00 * x + m.m02 * y + m.m04;
    out.y = m.m01 * x + m.m03 * y + m.m05;
    return out;
  };
  
  /**
   * Transforms the vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat3} m matrix to transform with
   * @returns {vec2} out
   */
  vec2.transformMat3 = function (out, a, m) {
    let x = a.x,
        y = a.y;
    out.x = m.m00 * x + m.m03 * y + m.m06;
    out.y = m.m01 * x + m.m04 * y + m.m07;
    return out;
  };
  
  /**
   * Transforms the vec2 with a mat4
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec2} out
   */
  vec2.transformMat4 = function (out, a, m) {
    let x = a.x,
        y = a.y;
    out.x = m.m00 * x + m.m04 * y + m.m12;
    out.y = m.m01 * x + m.m05 * y + m.m13;
    return out;
  };
  
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */
  vec2.forEach = (function () {
    let vec = vec2.create();
  
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
        vec.x = a[i]; vec.y = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec.x; a[i + 1] = vec.y;
      }
  
      return a;
    };
  })();
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec2} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  vec2.str = function (a) {
    return `vec2(${a.x}, ${a.y})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {vec2} v
   * @returns {array}
   */
  vec2.array = function (out, v) {
    out[0] = v.x;
    out[1] = v.y;
  
    return out;
  };
  
  /**
   * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec2.exactEquals = function (a, b) {
    return a.x === b.x && a.y === b.y;
  };
  
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec2.equals = function (a, b) {
    let a0 = a.x, a1 = a.y;
    let b0 = b.x, b1 = b.y;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
  };
  
  let _tmp$1 = new Array(3);
  
  class _vec3 {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  
    toJSON() {
      _tmp$1[0] = this.x;
      _tmp$1[1] = this.y;
      _tmp$1[2] = this.z;
  
      return _tmp$1;
    }
  }
  
  /**
   * @class 3 Dimensional Vector
   * @name vec3
   */
  let vec3 = {};
  
  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */
  vec3.create = function () {
    return new _vec3(0, 0, 0);
  };
  
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */
  vec3.new = function (x, y, z) {
    return new _vec3(x, y, z);
  };
  
  /**
   * Creates a new vec3 initialized with values from an existing vector
   *
   * @param {vec3} a vector to clone
   * @returns {vec3} a new 3D vector
   */
  vec3.clone = function (a) {
    return new _vec3(a.x, a.y, a.z);
  };
  
  /**
   * Copy the values from one vec3 to another
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the source vector
   * @returns {vec3} out
   */
  vec3.copy = function (out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
  };
  
  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} out
   */
  vec3.set = function (out, x, y, z) {
    out.x = x;
    out.y = y;
    out.z = z;
    return out;
  };
  
  /**
   * Adds two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.add = function (out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  };
  
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.subtract = function (out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  };
  
  /**
   * Alias for {@link vec3.subtract}
   * @function
   */
  vec3.sub = vec3.subtract;
  
  /**
   * Multiplies two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.multiply = function (out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  };
  
  /**
   * Alias for {@link vec3.multiply}
   * @function
   */
  vec3.mul = vec3.multiply;
  
  /**
   * Divides two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.divide = function (out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  };
  
  /**
   * Alias for {@link vec3.divide}
   * @function
   */
  vec3.div = vec3.divide;
  
  /**
   * Math.ceil the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to ceil
   * @returns {vec3} out
   */
  vec3.ceil = function (out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    return out;
  };
  
  /**
   * Math.floor the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to floor
   * @returns {vec3} out
   */
  vec3.floor = function (out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    return out;
  };
  
  /**
   * Returns the minimum of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.min = function (out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  };
  
  /**
   * Returns the maximum of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.max = function (out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  };
  
  /**
   * Math.round the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to round
   * @returns {vec3} out
   */
  vec3.round = function (out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    return out;
  };
  
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */
  vec3.scale = function (out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  };
  
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec3} out
   */
  vec3.scaleAndAdd = function (out, a, b, scale) {
    out.x = a.x + (b.x * scale);
    out.y = a.y + (b.y * scale);
    out.z = a.z + (b.z * scale);
    return out;
  };
  
  /**
   * Calculates the euclidian distance between two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} distance between a and b
   */
  vec3.distance = function (a, b) {
    let x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z;
    return Math.sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Alias for {@link vec3.distance}
   * @function
   */
  vec3.dist = vec3.distance;
  
  /**
   * Calculates the squared euclidian distance between two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} squared distance between a and b
   */
  vec3.squaredDistance = function (a, b) {
    let x = b.x - a.x,
        y = b.y - a.y,
        z = b.z - a.z;
    return x * x + y * y + z * z;
  };
  
  /**
   * Alias for {@link vec3.squaredDistance}
   * @function
   */
  vec3.sqrDist = vec3.squaredDistance;
  
  /**
   * Calculates the length of a vec3
   *
   * @param {vec3} a vector to calculate length of
   * @returns {Number} length of a
   */
  vec3.length = function (a) {
    let x = a.x,
        y = a.y,
        z = a.z;
    return Math.sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Alias for {@link vec3.length}
   * @function
   */
  vec3.len = vec3.length;
  
  /**
   * Calculates the squared length of a vec3
   *
   * @param {vec3} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */
  vec3.squaredLength = function (a) {
    let x = a.x,
        y = a.y,
        z = a.z;
    return x * x + y * y + z * z;
  };
  
  /**
   * Alias for {@link vec3.squaredLength}
   * @function
   */
  vec3.sqrLen = vec3.squaredLength;
  
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to negate
   * @returns {vec3} out
   */
  vec3.negate = function (out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to invert
   * @returns {vec3} out
   */
  vec3.inverse = function (out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec3 safely
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to invert
   * @returns {vec3} out
   */
  vec3.inverseSafe = function (out, a) {
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
  };
  
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */
  vec3.normalize = function (out, a) {
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
  };
  
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} dot product of a and b
   */
  vec3.dot = function (a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  };
  
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */
  vec3.cross = function (out, a, b) {
    let ax = a.x, ay = a.y, az = a.z,
        bx = b.x, by = b.y, bz = b.z;
  
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  };
  
  /**
   * Performs a linear interpolation between two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {vec3} out
   */
  vec3.lerp = function (out, a, b, t) {
    let ax = a.x,
        ay = a.y,
        az = a.z;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    out.z = az + t * (b.z - az);
    return out;
  };
  
  /**
   * Performs a hermite interpolation with two control points
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {vec3} c the third operand
   * @param {vec3} d the fourth operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {vec3} out
   */
  vec3.hermite = function (out, a, b, c, d, t) {
    let factorTimes2 = t * t,
        factor1 = factorTimes2 * (2 * t - 3) + 1,
        factor2 = factorTimes2 * (t - 2) + t,
        factor3 = factorTimes2 * (t - 1),
        factor4 = factorTimes2 * (3 - 2 * t);
  
    out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
    out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
    out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;
  
    return out;
  };
  
  /**
   * Performs a bezier interpolation with two control points
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {vec3} c the third operand
   * @param {vec3} d the fourth operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {vec3} out
   */
  vec3.bezier = function (out, a, b, c, d, t) {
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
  };
  
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec3} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec3} out
   */
  vec3.random = function (out, scale) {
    scale = scale || 1.0;
  
    let r = random() * 2.0 * Math.PI;
    let z = (random() * 2.0) - 1.0;
    let zScale = Math.sqrt(1.0 - z * z) * scale;
  
    out.x = Math.cos(r) * zScale;
    out.y = Math.sin(r) * zScale;
    out.z = z * scale;
    return out;
  };
  
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec3} out
   */
  vec3.transformMat4 = function (out, a, m) {
    let x = a.x, y = a.y, z = a.z,
        w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
    w = w || 1.0;
    out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) / w;
    out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) / w;
    out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) / w;
    return out;
  };
  
  /**
   * Transforms the vec3 with a mat3.
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat4} m the 3x3 matrix to transform with
   * @returns {vec3} out
   */
  vec3.transformMat3 = function (out, a, m) {
    let x = a.x, y = a.y, z = a.z;
    out.x = x * m.m00 + y * m.m03 + z * m.m06;
    out.y = x * m.m01 + y * m.m04 + z * m.m07;
    out.z = x * m.m02 + y * m.m05 + z * m.m08;
    return out;
  };
  
  /**
   * Transforms the vec3 with a quat
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {quat} q quaternion to transform with
   * @returns {vec3} out
   */
  vec3.transformQuat = function (out, a, q) {
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
  };
  
  /**
   * Rotate a 3D vector around the x-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  vec3.rotateX = function (out, a, b, c) {
    let p = [], r = [];
    // Translate point to the origin
    p.x = a.x - b.x;
    p.y = a.y - b.y;
    p.z = a.z - b.z;
  
    //perform rotation
    r.x = p.x;
    r.y = p.y * Math.cos(c) - p.z * Math.sin(c);
    r.z = p.y * Math.sin(c) + p.z * Math.cos(c);
  
    //translate to correct position
    out.x = r.x + b.x;
    out.y = r.y + b.y;
    out.z = r.z + b.z;
  
    return out;
  };
  
  /**
   * Rotate a 3D vector around the y-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  vec3.rotateY = function (out, a, b, c) {
    let p = [], r = [];
    //Translate point to the origin
    p.x = a.x - b.x;
    p.y = a.y - b.y;
    p.z = a.z - b.z;
  
    //perform rotation
    r.x = p.z * Math.sin(c) + p.x * Math.cos(c);
    r.y = p.y;
    r.z = p.z * Math.cos(c) - p.x * Math.sin(c);
  
    //translate to correct position
    out.x = r.x + b.x;
    out.y = r.y + b.y;
    out.z = r.z + b.z;
  
    return out;
  };
  
  /**
   * Rotate a 3D vector around the z-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */
  vec3.rotateZ = function (out, a, b, c) {
    let p = [], r = [];
    //Translate point to the origin
    p.x = a.x - b.x;
    p.y = a.y - b.y;
    p.z = a.z - b.z;
  
    //perform rotation
    r.x = p.x * Math.cos(c) - p.y * Math.sin(c);
    r.y = p.x * Math.sin(c) + p.y * Math.cos(c);
    r.z = p.z;
  
    //translate to correct position
    out.x = r.x + b.x;
    out.y = r.y + b.y;
    out.z = r.z + b.z;
  
    return out;
  };
  
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */
  vec3.forEach = (function () {
    let vec = vec3.create();
  
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
        vec.x = a[i]; vec.y = a[i + 1]; vec.z = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec.x; a[i + 1] = vec.y; a[i + 2] = vec.z;
      }
  
      return a;
    };
  })();
  
  /**
   * Get the angle between two 3D vectors
   * @param {vec3} a The first operand
   * @param {vec3} b The second operand
   * @returns {Number} The angle in radians
   */
  vec3.angle = (function () {
    let tempA = vec3.create();
    let tempB = vec3.create();
  
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
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec3} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  vec3.str = function (a) {
    return `vec3(${a.x}, ${a.y}, ${a.z})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {vec3} v
   * @returns {array}
   */
  vec3.array = function (out, v) {
    out[0] = v.x;
    out[1] = v.y;
    out[2] = v.z;
  
    return out;
  };
  
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   *
   * @param {vec3} a The first vector.
   * @param {vec3} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec3.exactEquals = function (a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  };
  
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec3} a The first vector.
   * @param {vec3} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec3.equals = function (a, b) {
    let a0 = a.x, a1 = a.y, a2 = a.z;
    let b0 = b.x, b1 = b.y, b2 = b.z;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
  };
  
  let _tmp$2 = new Array(4);
  
  class _vec4 {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  
    toJSON() {
      _tmp$2[0] = this.x;
      _tmp$2[1] = this.y;
      _tmp$2[2] = this.z;
      _tmp$2[3] = this.w;
  
      return _tmp$2;
    }
  }
  
  /**
   * @class 4 Dimensional Vector
   * @name vec4
   */
  let vec4 = {};
  
  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */
  vec4.create = function () {
    return new _vec4(0, 0, 0, 0);
  };
  
  /**
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */
  vec4.new = function (x, y, z, w) {
    return new _vec4(x, y, z, w);
  };
  
  /**
   * Creates a new vec4 initialized with values from an existing vector
   *
   * @param {vec4} a vector to clone
   * @returns {vec4} a new 4D vector
   */
  vec4.clone = function (a) {
    return new _vec4(a.x, a.y, a.z, a.w);
  };
  
  /**
   * Copy the values from one vec4 to another
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the source vector
   * @returns {vec4} out
   */
  vec4.copy = function (out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = a.w;
    return out;
  };
  
  /**
   * Set the components of a vec4 to the given values
   *
   * @param {vec4} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} out
   */
  vec4.set = function (out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  };
  
  /**
   * Adds two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.add = function (out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.w = a.w + b.w;
    return out;
  };
  
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.subtract = function (out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.w = a.w - b.w;
    return out;
  };
  
  /**
   * Alias for {@link vec4.subtract}
   * @function
   */
  vec4.sub = vec4.subtract;
  
  /**
   * Multiplies two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.multiply = function (out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    out.w = a.w * b.w;
    return out;
  };
  
  /**
   * Alias for {@link vec4.multiply}
   * @function
   */
  vec4.mul = vec4.multiply;
  
  /**
   * Divides two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.divide = function (out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    out.w = a.w / b.w;
    return out;
  };
  
  /**
   * Alias for {@link vec4.divide}
   * @function
   */
  vec4.div = vec4.divide;
  
  /**
   * Math.ceil the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to ceil
   * @returns {vec4} out
   */
  vec4.ceil = function (out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    out.w = Math.ceil(a.w);
    return out;
  };
  
  /**
   * Math.floor the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to floor
   * @returns {vec4} out
   */
  vec4.floor = function (out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    out.w = Math.floor(a.w);
    return out;
  };
  
  /**
   * Returns the minimum of two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.min = function (out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    out.w = Math.min(a.w, b.w);
    return out;
  };
  
  /**
   * Returns the maximum of two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */
  vec4.max = function (out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    out.w = Math.max(a.w, b.w);
    return out;
  };
  
  /**
   * Math.round the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to round
   * @returns {vec4} out
   */
  vec4.round = function (out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    out.w = Math.round(a.w);
    return out;
  };
  
  /**
   * Scales a vec4 by a scalar number
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec4} out
   */
  vec4.scale = function (out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  };
  
  /**
   * Adds two vec4's after scaling the second operand by a scalar value
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec4} out
   */
  vec4.scaleAndAdd = function (out, a, b, scale) {
    out.x = a.x + (b.x * scale);
    out.y = a.y + (b.y * scale);
    out.z = a.z + (b.z * scale);
    out.w = a.w + (b.w * scale);
    return out;
  };
  
  /**
   * Calculates the euclidian distance between two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} distance between a and b
   */
  vec4.distance = function (a, b) {
    let x = b.x - a.x,
      y = b.y - a.y,
      z = b.z - a.z,
      w = b.w - a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  
  /**
   * Alias for {@link vec4.distance}
   * @function
   */
  vec4.dist = vec4.distance;
  
  /**
   * Calculates the squared euclidian distance between two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} squared distance between a and b
   */
  vec4.squaredDistance = function (a, b) {
    let x = b.x - a.x,
        y = b.y - a.y,
        z = b.z - a.z,
        w = b.w - a.w;
    return x * x + y * y + z * z + w * w;
  };
  
  /**
   * Alias for {@link vec4.squaredDistance}
   * @function
   */
  vec4.sqrDist = vec4.squaredDistance;
  
  /**
   * Calculates the length of a vec4
   *
   * @param {vec4} a vector to calculate length of
   * @returns {Number} length of a
   */
  vec4.length = function (a) {
    let x = a.x,
        y = a.y,
        z = a.z,
        w = a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  
  /**
   * Alias for {@link vec4.length}
   * @function
   */
  vec4.len = vec4.length;
  
  /**
   * Calculates the squared length of a vec4
   *
   * @param {vec4} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */
  vec4.squaredLength = function (a) {
    let x = a.x,
        y = a.y,
        z = a.z,
        w = a.w;
    return x * x + y * y + z * z + w * w;
  };
  
  /**
   * Alias for {@link vec4.squaredLength}
   * @function
   */
  vec4.sqrLen = vec4.squaredLength;
  
  /**
   * Negates the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to negate
   * @returns {vec4} out
   */
  vec4.negate = function (out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = -a.w;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to invert
   * @returns {vec4} out
   */
  vec4.inverse = function (out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    out.w = 1.0 / a.w;
    return out;
  };
  
  /**
   * Returns the inverse of the components of a vec4 safely
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to invert
   * @returns {vec4} out
   */
  vec4.inverseSafe = function (out, a) {
    let x = a.x,
        y = a.y,
        z = a.z,
        w = a.w;
  
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
  
    if (Math.abs(w) < EPSILON) {
      out.w = 0;
    } else {
      out.w = 1.0 / w;
    }
  
    return out;
  };
  
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to normalize
   * @returns {vec4} out
   */
  vec4.normalize = function (out, a) {
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
  };
  
  /**
   * Calculates the dot product of two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} dot product of a and b
   */
  vec4.dot = function (a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  };
  
  /**
   * Performs a linear interpolation between two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {vec4} out
   */
  vec4.lerp = function (out, a, b, t) {
    let ax = a.x,
        ay = a.y,
        az = a.z,
        aw = a.w;
    out.x = ax + t * (b.x - ax);
    out.y = ay + t * (b.y - ay);
    out.z = az + t * (b.z - az);
    out.w = aw + t * (b.w - aw);
    return out;
  };
  
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec4} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec4} out
   */
  vec4.random = function (out, scale) {
    scale = scale || 1.0;
  
    //TODO: This is a pretty awful way of doing this. Find something better.
    out.x = random();
    out.y = random();
    out.z = random();
    out.w = random();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
  };
  
  /**
   * Transforms the vec4 with a mat4.
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec4} out
   */
  vec4.transformMat4 = function (out, a, m) {
    let x = a.x, y = a.y, z = a.z, w = a.w;
    out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12 * w;
    out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13 * w;
    out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14 * w;
    out.w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15 * w;
    return out;
  };
  
  /**
   * Transforms the vec4 with a quat
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to transform
   * @param {quat} q quaternion to transform with
   * @returns {vec4} out
   */
  vec4.transformQuat = function (out, a, q) {
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
    out.w = a.w;
    return out;
  };
  
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */
  vec4.forEach = (function () {
    let vec = vec4.create();
  
    return function (a, stride, offset, count, fn, arg) {
      let i, l;
      if (!stride) {
        stride = 4;
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
        vec.x = a[i]; vec.y = a[i + 1]; vec.z = a[i + 2]; vec.w = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec.x; a[i + 1] = vec.y; a[i + 2] = vec.z; a[i + 3] = vec.w;
      }
  
      return a;
    };
  })();
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec4} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  vec4.str = function (a) {
    return `vec4(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {vec4} v
   * @returns {array}
   */
  vec4.array = function (out, v) {
    out[0] = v.x;
    out[1] = v.y;
    out[2] = v.z;
    out[3] = v.w;
  
    return out;
  };
  
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   *
   * @param {vec4} a The first vector.
   * @param {vec4} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec4.exactEquals = function (a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
  };
  
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec4} a The first vector.
   * @param {vec4} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  vec4.equals = function (a, b) {
    let a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
    let b0 = b.x, b1 = b.y, b2 = b.z, b3 = b.w;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
  };
  
  let _tmp$4 = new Array(9);
  
  class _mat3 {
    constructor(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
      this.m00 = m00;
      this.m01 = m01;
      this.m02 = m02;
      this.m03 = m03;
      this.m04 = m04;
      this.m05 = m05;
      this.m06 = m06;
      this.m07 = m07;
      this.m08 = m08;
    }
  
    toJSON() {
      _tmp$4[0] = this.m00;
      _tmp$4[1] = this.m01;
      _tmp$4[2] = this.m02;
      _tmp$4[3] = this.m03;
      _tmp$4[4] = this.m04;
      _tmp$4[5] = this.m05;
      _tmp$4[6] = this.m06;
      _tmp$4[7] = this.m07;
      _tmp$4[8] = this.m08;
  
      return _tmp$4;
    }
  }
  
  /**
   * @class 3x3 Matrix
   * @name mat3
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
  let mat3 = {};
  
  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */
  mat3.create = function () {
    return new _mat3(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  };
  
  /**
   * Create a new mat3 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   * @returns {mat3} A new mat3
   */
  mat3.new = function (m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    return new _mat3(
      m00, m01, m02,
      m10, m11, m12,
      m20, m21, m22
    );
  };
  
  /**
   * Creates a new mat3 initialized with values from an existing matrix
   *
   * @param {mat3} a matrix to clone
   * @returns {mat3} a new 3x3 matrix
   */
  mat3.clone = function (a) {
    return new _mat3(
      a.m00, a.m01, a.m02,
      a.m03, a.m04, a.m05,
      a.m06, a.m07, a.m08
    );
  };
  
  /**
   * Copy the values from one mat3 to another
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */
  mat3.copy = function (out, a) {
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
  };
  
  /**
   * Set the components of a mat3 to the given values
   *
   * @param {mat3} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   * @returns {mat3} out
   */
  mat3.set = function (out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
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
  };
  
  /**
   * Set a mat3 to the identity matrix
   *
   * @param {mat3} out the receiving matrix
   * @returns {mat3} out
   */
  mat3.identity = function (out) {
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
  };
  
  /**
   * Transpose the values of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */
  mat3.transpose = function (out, a) {
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
  };
  
  /**
   * Inverts a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */
  mat3.invert = function (out, a) {
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
  };
  
  /**
   * Calculates the adjugate of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */
  mat3.adjoint = function (out, a) {
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
  };
  
  /**
   * Calculates the determinant of a mat3
   *
   * @param {mat3} a the source matrix
   * @returns {Number} determinant of a
   */
  mat3.determinant = function (a) {
    let a00 = a.m00, a01 = a.m01, a02 = a.m02,
        a10 = a.m03, a11 = a.m04, a12 = a.m05,
        a20 = a.m06, a21 = a.m07, a22 = a.m08;
  
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  };
  
  /**
   * Multiplies two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */
  mat3.multiply = function (out, a, b) {
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
  };
  
  /**
   * Alias for {@link mat3.multiply}
   * @function
   */
  mat3.mul = mat3.multiply;
  
  /**
   * Translate a mat3 by the given vector
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to translate
   * @param {vec2} v vector to translate by
   * @returns {mat3} out
   */
  mat3.translate = function (out, a, v) {
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
  };
  
  /**
   * Rotates a mat3 by the given angle
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat3} out
   */
  mat3.rotate = function (out, a, rad) {
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
  };
  
  /**
   * Scales the mat3 by the dimensions in the given vec2
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat3} out
   **/
  mat3.scale = function (out, a, v) {
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
  };
  
  /**
   * Copies the upper-left 3x3 values into the given mat3.
   *
   * @param {mat3} out the receiving 3x3 matrix
   * @param {mat4} a   the source 4x4 matrix
   * @returns {mat3} out
   */
  mat3.fromMat4 = function (out, a) {
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
  };
  
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {vec2} v Translation vector
   * @returns {mat3} out
   */
  mat3.fromTranslation = function (out, v) {
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
  };
  
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat3} out
   */
  mat3.fromRotation = function (out, rad) {
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
  };
  
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat3} out
   */
  mat3.fromScaling = function (out, v) {
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
  };
  
  /**
   * Copies the values from a mat2d into a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat2d} a the matrix to copy
   * @returns {mat3} out
   **/
  mat3.fromMat2d = function (out, a) {
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
  };
  
  /**
  * Calculates a 3x3 matrix from the given quaternion
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {quat} q Quaternion to create matrix from
  *
  * @returns {mat3} out
  */
  mat3.fromQuat = function (out, q) {
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
  };
  
  /**
  * Calculates a 3x3 matrix from view direction and up direction
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {vec3} view view direction (must be normalized)
  * @param {vec3} [up] up direction, default is (0,1,0) (must be normalized)
  *
  * @returns {mat3} out
  */
  mat3.fromViewUp = (function () {
    let default_up = vec3.new(0, 1, 0);
    let x = vec3.create();
    let y = vec3.create();
  
    return function (out, view, up) {
      if (vec3.sqrLen(view) < EPSILON * EPSILON) {
        mat3.identity(out);
        return out;
      }
  
      up = up || default_up;
      vec3.cross(x, up, view);
  
      if (vec3.sqrLen(x) < EPSILON * EPSILON) {
        mat3.identity(out);
        return out;
      }
  
      vec3.cross(y, view, x);
      mat3.set(out,
        x.x, x.y, x.z,
        y.x, y.y, y.z,
        view.x, view.y, view.z
      );
  
      return out;
    };
  })();
  
  /**
  * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {mat4} a Mat4 to derive the normal matrix from
  *
  * @returns {mat3} out
  */
  mat3.normalFromMat4 = function (out, a) {
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
  };
  
  /**
   * Returns a string representation of a mat3
   *
   * @param {mat3} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */
  mat3.str = function (a) {
    return `mat3(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05}, ${a.m06}, ${a.m07}, ${a.m08})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {mat3} m
   * @returns {array}
   */
  mat3.array = function (out, m) {
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
  };
  
  /**
   * Returns Frobenius norm of a mat3
   *
   * @param {mat3} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */
  mat3.frob = function (a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2)));
  };
  
  /**
   * Adds two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */
  mat3.add = function (out, a, b) {
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
  };
  
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */
  mat3.subtract = function (out, a, b) {
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
  };
  
  /**
   * Alias for {@link mat3.subtract}
   * @function
   */
  mat3.sub = mat3.subtract;
  
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat3} out
   */
  mat3.multiplyScalar = function (out, a, b) {
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
  };
  
  /**
   * Adds two mat3's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat3} out the receiving vector
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat3} out
   */
  mat3.multiplyScalarAndAdd = function (out, a, b, scale) {
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
  };
  
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat3} a The first matrix.
   * @param {mat3} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat3.exactEquals = function (a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 &&
      a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 &&
      a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08;
  };
  
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat3} a The first matrix.
   * @param {mat3} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat3.equals = function (a, b) {
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
  };
  
  let _tmp$3 = new Array(4);
  
  class _quat {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  
    toJSON() {
      _tmp$3[0] = this.x;
      _tmp$3[1] = this.y;
      _tmp$3[2] = this.z;
      _tmp$3[3] = this.w;
  
      return _tmp$3;
    }
  }
  
  /**
   * @class Quaternion
   * @name quat
   */
  let quat = {};
  
  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */
  quat.create = function () {
    return new _quat(0, 0, 0, 1);
  };
  
  /**
   * Creates a new quat initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} a new quaternion
   * @function
   */
  quat.new = function (x, y, z, w) {
    return new _quat(x, y, z, w);
  };
  
  /**
   * Creates a new quat initialized with values from an existing quaternion
   *
   * @param {quat} a quaternion to clone
   * @returns {quat} a new quaternion
   * @function
   */
  quat.clone = function (a) {
    return new _quat(a.x, a.y, a.z, a.w);
  };
  
  /**
   * Copy the values from one quat to another
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the source quaternion
   * @returns {quat} out
   * @function
   */
  quat.copy = vec4.copy;
  
  /**
   * Set the components of a quat to the given values
   *
   * @param {quat} out the receiving quaternion
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} out
   * @function
   */
  quat.set = vec4.set;
  
  /**
   * Set a quat to the identity quaternion
   *
   * @param {quat} out the receiving quaternion
   * @returns {quat} out
   */
  quat.identity = function (out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    out.w = 1;
    return out;
  };
  
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */
  quat.rotationTo = (function () {
    let tmpvec3 = vec3.create();
    let xUnitVec3 = vec3.new(1, 0, 0);
    let yUnitVec3 = vec3.new(0, 1, 0);
  
    return function (out, a, b) {
      let dot = vec3.dot(a, b);
      if (dot < -0.999999) {
        vec3.cross(tmpvec3, xUnitVec3, a);
        if (vec3.length(tmpvec3) < 0.000001) {
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
  
  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  fromAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param  {vec3} out_axis  Vector receiving the axis of rotation
   * @param  {quat} q     Quaternion to be decomposed
   * @return {Number}     Angle, in radians, of the rotation
   */
  quat.getAxisAngle = function (out_axis, q) {
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
  };
  
  /**
   * Multiplies two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {quat} out
   */
  quat.multiply = function (out, a, b) {
    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
        bx = b.x, by = b.y, bz = b.z, bw = b.w;
  
    out.x = ax * bw + aw * bx + ay * bz - az * by;
    out.y = ay * bw + aw * by + az * bx - ax * bz;
    out.z = az * bw + aw * bz + ax * by - ay * bx;
    out.w = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  };
  
  /**
   * Alias for {@link quat.multiply}
   * @function
   */
  quat.mul = quat.multiply;
  
  /**
   * Scales a quat by a scalar number
   *
   * @param {quat} out the receiving vector
   * @param {quat} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {quat} out
   * @function
   */
  quat.scale = vec4.scale;
  
  /**
   * Rotates a quaternion by the given angle about the X axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  quat.rotateX = function (out, a, rad) {
    rad *= 0.5;
  
    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
        bx = Math.sin(rad), bw = Math.cos(rad);
  
    out.x = ax * bw + aw * bx;
    out.y = ay * bw + az * bx;
    out.z = az * bw - ay * bx;
    out.w = aw * bw - ax * bx;
    return out;
  };
  
  /**
   * Rotates a quaternion by the given angle about the Y axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  quat.rotateY = function (out, a, rad) {
    rad *= 0.5;
  
    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
        by = Math.sin(rad), bw = Math.cos(rad);
  
    out.x = ax * bw - az * by;
    out.y = ay * bw + aw * by;
    out.z = az * bw + ax * by;
    out.w = aw * bw - ay * by;
    return out;
  };
  
  /**
   * Rotates a quaternion by the given angle about the Z axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  quat.rotateZ = function (out, a, rad) {
    rad *= 0.5;
  
    let ax = a.x, ay = a.y, az = a.z, aw = a.w,
        bz = Math.sin(rad), bw = Math.cos(rad);
  
    out.x = ax * bw + ay * bz;
    out.y = ay * bw - ax * bz;
    out.z = az * bw + aw * bz;
    out.w = aw * bw - az * bz;
    return out;
  };
  
  /**
   * Rotates a quaternion by the given angle about the axis in world space
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} rot quat to rotate
   * @param {vec3} axis the axis around which to rotate in world space
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  quat.rotateAround = (function () {
    let v3_tmp = vec3.create();
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
  
  /**
   * Rotates a quaternion by the given angle about the axis in local space
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} rot quat to rotate
   * @param {vec3} axis the axis around which to rotate in local space
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */
  quat.rotateAroundLocal = (function () {
    let q_tmp = quat.create();
  
    return function (out, rot, axis, rad) {
      quat.fromAxisAngle(q_tmp, axis, rad);
      quat.mul(out, rot, q_tmp);
  
      return out;
    };
  })();
  
  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate W component of
   * @returns {quat} out
   */
  quat.calculateW = function (out, a) {
    let x = a.x, y = a.y, z = a.z;
  
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
  };
  
  /**
   * Calculates the dot product of two quat's
   *
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {Number} dot product of a and b
   * @function
   */
  quat.dot = vec4.dot;
  
  /**
   * Performs a linear interpolation between two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {quat} out
   * @function
   */
  quat.lerp = vec4.lerp;
  
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {quat} out
   */
  quat.slerp = function (out, a, b, t) {
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
      bx = - bx;
      by = - by;
      bz = - bz;
      bw = - bw;
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
  };
  
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
   * @param {Number} t interpolation amount
   * @returns {quat} out
   */
  quat.sqlerp = (function () {
    let temp1 = quat.create();
    let temp2 = quat.create();
  
    return function (out, a, b, c, d, t) {
      quat.slerp(temp1, a, d, t);
      quat.slerp(temp2, b, c, t);
      quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
  
      return out;
    };
  }());
  
  /**
   * Calculates the inverse of a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate inverse of
   * @returns {quat} out
   */
  quat.invert = function (out, a) {
    let a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
    let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    let invDot = dot ? 1.0 / dot : 0;
  
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
  
    out.x = -a0 * invDot;
    out.y = -a1 * invDot;
    out.z = -a2 * invDot;
    out.w = a3 * invDot;
    return out;
  };
  
  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate conjugate of
   * @returns {quat} out
   */
  quat.conjugate = function (out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = a.w;
    return out;
  };
  
  /**
   * Calculates the length of a quat
   *
   * @param {quat} a vector to calculate length of
   * @returns {Number} length of a
   * @function
   */
  quat.length = vec4.length;
  
  /**
   * Alias for {@link quat.length}
   * @function
   */
  quat.len = quat.length;
  
  /**
   * Calculates the squared length of a quat
   *
   * @param {quat} a vector to calculate squared length of
   * @returns {Number} squared length of a
   * @function
   */
  quat.squaredLength = vec4.squaredLength;
  
  /**
   * Alias for {@link quat.squaredLength}
   * @function
   */
  quat.sqrLen = quat.squaredLength;
  
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */
  quat.normalize = vec4.normalize;
  
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} xAxis the vector representing the local "right" direction
   * @param {vec3} yAxis the vector representing the local "up" direction
   * @param {vec3} zAxis the vector representing the viewing direction
   * @returns {quat} out
   */
  quat.fromAxes = (function () {
    let matr = mat3.create();
  
    return function (out, xAxis, yAxis, zAxis) {
      mat3.set(
        matr,
        xAxis.x, xAxis.y, xAxis.z,
        yAxis.x, yAxis.y, yAxis.z,
        zAxis.x, zAxis.y, zAxis.z
      );
      return quat.normalize(out, quat.fromMat3(out, matr));
    };
  })();
  
  /**
  * Calculates a quaternion from view direction and up direction
  *
  * @param {quat} out mat3 receiving operation result
  * @param {vec3} view view direction (must be normalized)
  * @param {vec3} [up] up direction, default is (0,1,0) (must be normalized)
  *
  * @returns {quat} out
  */
  quat.fromViewUp = (function () {
    let matr = mat3.create();
  
    return function (out, view, up) {
      mat3.fromViewUp(matr, view, up);
      if (!matr) {
        return null;
      }
  
      return quat.normalize(out, quat.fromMat3(out, matr));
    };
  })();
  
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/
  quat.fromAxisAngle = function (out, axis, rad) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    out.x = s * axis.x;
    out.y = s * axis.y;
    out.z = s * axis.z;
    out.w = Math.cos(rad);
    return out;
  };
  
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {mat3} m rotation matrix
   * @returns {quat} out
   * @function
   */
  quat.fromMat3 = function (out, m) {
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
  };
  
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   *
   * @param {quat} out the receiving quaternion
   * @param {x} Angle to rotate around X axis in degrees.
   * @param {y} Angle to rotate around Y axis in degrees.
   * @param {z} Angle to rotate around Z axis in degrees.
   * @returns {quat} out
   * @function
   */
  quat.fromEuler = function (out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
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
  };
  
  /**
   * Returns a string representation of a quatenion
   *
   * @param {quat} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  quat.str = function (a) {
    return `quat(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {quat} q
   * @returns {array}
   */
  quat.array = function (out, q) {
    out[0] = q.x;
    out[1] = q.y;
    out[2] = q.z;
    out[3] = q.w;
  
    return out;
  };
  
  /**
   * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
   *
   * @param {quat} a The first quaternion.
   * @param {quat} b The second quaternion.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  quat.exactEquals = vec4.exactEquals;
  
  /**
   * Returns whether or not the quaternions have approximately the same elements in the same position.
   *
   * @param {quat} a The first vector.
   * @param {quat} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */
  quat.equals = vec4.equals;
  
  let _tmp$5 = new Array(4);
  
  class _mat2 {
    constructor(m00, m01, m02, m03) {
      this.m00 = m00;
      this.m01 = m01;
      this.m02 = m02;
      this.m03 = m03;
    }
  
    toJSON() {
      _tmp$5[0] = this.m00;
      _tmp$5[1] = this.m01;
      _tmp$5[2] = this.m02;
      _tmp$5[3] = this.m03;
  
      return _tmp$5;
    }
  }
  
  /**
   * @class 2x2 Matrix
   * @name mat2
   */
  let mat2 = {};
  
  /**
   * Creates a new identity mat2
   *
   * @returns {mat2} a new 2x2 matrix
   */
  mat2.create = function() {
    return new _mat2(1, 0, 0, 1);
  };
  
  /**
   * Create a new mat2 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m10 Component in column 1, row 0 position (index 2)
   * @param {Number} m11 Component in column 1, row 1 position (index 3)
   * @returns {mat2} out A new 2x2 matrix
   */
  mat2.new = function (m00, m01, m10, m11) {
    return new _mat2(m00, m01, m10, m11);
  };
  
  /**
   * Creates a new mat2 initialized with values from an existing matrix
   *
   * @param {mat2} a matrix to clone
   * @returns {mat2} a new 2x2 matrix
   */
  mat2.clone = function (a) {
    return new _mat2(a.m00, a.m01, a.m02, a.m03);
  };
  
  /**
   * Copy the values from one mat2 to another
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */
  mat2.copy = function (out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m03;
    return out;
  };
  
  /**
   * Set a mat2 to the identity matrix
   *
   * @param {mat2} out the receiving matrix
   * @returns {mat2} out
   */
  mat2.identity = function (out) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 1;
    return out;
  };
  
  /**
   * Set the components of a mat2 to the given values
   *
   * @param {mat2} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m10 Component in column 1, row 0 position (index 2)
   * @param {Number} m11 Component in column 1, row 1 position (index 3)
   * @returns {mat2} out
   */
  mat2.set = function (out, m00, m01, m10, m11) {
    out.m00 = m00;
    out.m01 = m01;
    out.m02 = m10;
    out.m03 = m11;
    return out;
  };
  
  
  /**
   * Transpose the values of a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */
  mat2.transpose = function (out, a) {
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
  };
  
  /**
   * Inverts a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */
  mat2.invert = function (out, a) {
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
  };
  
  /**
   * Calculates the adjugate of a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */
  mat2.adjoint = function (out, a) {
    // Caching this value is nessecary if out == a
    let a0 = a.m00;
    out.m00 = a.m03;
    out.m01 = -a.m01;
    out.m02 = -a.m02;
    out.m03 = a0;
  
    return out;
  };
  
  /**
   * Calculates the determinant of a mat2
   *
   * @param {mat2} a the source matrix
   * @returns {Number} determinant of a
   */
  mat2.determinant = function (a) {
    return a.m00 * a.m03 - a.m02 * a.m01;
  };
  
  /**
   * Multiplies two mat2's
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */
  mat2.multiply = function (out, a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
    out.m00 = a0 * b0 + a2 * b1;
    out.m01 = a1 * b0 + a3 * b1;
    out.m02 = a0 * b2 + a2 * b3;
    out.m03 = a1 * b2 + a3 * b3;
    return out;
  };
  
  /**
   * Alias for {@link mat2.multiply}
   * @function
   */
  mat2.mul = mat2.multiply;
  
  /**
   * Rotates a mat2 by the given angle
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2} out
   */
  mat2.rotate = function (out, a, rad) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
        s = Math.sin(rad),
        c = Math.cos(rad);
    out.m00 = a0 * c + a2 * s;
    out.m01 = a1 * c + a3 * s;
    out.m02 = a0 * -s + a2 * c;
    out.m03 = a1 * -s + a3 * c;
    return out;
  };
  
  /**
   * Scales the mat2 by the dimensions in the given vec2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat2} out
   **/
  mat2.scale = function (out, a, v) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
        v0 = v.x, v1 = v.y;
    out.m00 = a0 * v0;
    out.m01 = a1 * v0;
    out.m02 = a2 * v1;
    out.m03 = a3 * v1;
    return out;
  };
  
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.rotate(dest, dest, rad);
   *
   * @param {mat2} out mat2 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2} out
   */
  mat2.fromRotation = function (out, rad) {
    let s = Math.sin(rad),
        c = Math.cos(rad);
    out.m00 = c;
    out.m01 = s;
    out.m02 = -s;
    out.m03 = c;
    return out;
  };
  
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.scale(dest, dest, vec);
   *
   * @param {mat2} out mat2 receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat2} out
   */
  mat2.fromScaling = function (out, v) {
    out.m00 = v.x;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = v.y;
    return out;
  };
  
  /**
   * Returns a string representation of a mat2
   *
   * @param {mat2} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */
  mat2.str = function (a) {
    return `mat2(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {mat2} m
   * @returns {array}
   */
  mat2.array = function (out, m) {
    out[0] = m.m00;
    out[1] = m.m01;
    out[2] = m.m02;
    out[3] = m.m03;
  
    return out;
  };
  
  /**
   * Returns Frobenius norm of a mat2
   *
   * @param {mat2} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */
  mat2.frob = function (a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2)));
  };
  
  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
   * @param {mat2} L the lower triangular matrix
   * @param {mat2} D the diagonal matrix
   * @param {mat2} U the upper triangular matrix
   * @param {mat2} a the input matrix to factorize
   */
  
  mat2.LDU = function (L, D, U, a) {
    L.m02 = a.m02 / a.m00;
    U.m00 = a.m00;
    U.m01 = a.m01;
    U.m03 = a.m03 - L.m02 * U.m01;
  };
  
  /**
   * Adds two mat2's
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */
  mat2.add = function (out, a, b) {
    out.m00 = a.m00 + b.m00;
    out.m01 = a.m01 + b.m01;
    out.m02 = a.m02 + b.m02;
    out.m03 = a.m03 + b.m03;
    return out;
  };
  
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */
  mat2.subtract = function (out, a, b) {
    out.m00 = a.m00 - b.m00;
    out.m01 = a.m01 - b.m01;
    out.m02 = a.m02 - b.m02;
    out.m03 = a.m03 - b.m03;
    return out;
  };
  
  /**
   * Alias for {@link mat2.subtract}
   * @function
   */
  mat2.sub = mat2.subtract;
  
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat2} a The first matrix.
   * @param {mat2} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat2.exactEquals = function (a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03;
  };
  
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat2} a The first matrix.
   * @param {mat2} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat2.equals = function (a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
    );
  };
  
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat2} out
   */
  mat2.multiplyScalar = function (out, a, b) {
    out.m00 = a.m00 * b;
    out.m01 = a.m01 * b;
    out.m02 = a.m02 * b;
    out.m03 = a.m03 * b;
    return out;
  };
  
  /**
   * Adds two mat2's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat2} out the receiving vector
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat2} out
   */
  mat2.multiplyScalarAndAdd = function (out, a, b, scale) {
    out.m00 = a.m00 + (b.m00 * scale);
    out.m01 = a.m01 + (b.m01 * scale);
    out.m02 = a.m02 + (b.m02 * scale);
    out.m03 = a.m03 + (b.m03 * scale);
    return out;
  };
  
  let _tmp$6 = new Array(6);
  
  class _mat23 {
    constructor(m00, m01, m02, m03, m04, m05) {
      this.m00 = m00;
      this.m01 = m01;
      this.m02 = m02;
      this.m03 = m03;
      this.m04 = m04;
      this.m05 = m05;
    }
  
    toJSON() {
      _tmp$6[0] = this.m00;
      _tmp$6[1] = this.m01;
      _tmp$6[2] = this.m02;
      _tmp$6[3] = this.m03;
      _tmp$6[4] = this.m04;
      _tmp$6[5] = this.m05;
  
      return _tmp$6;
    }
  }
  
  /**
   * @class 2x3 Matrix
   * @name mat23
   *
   * @description
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
  let mat23 = {};
  
  /**
   * Creates a new identity mat23
   *
   * @returns {mat23} a new 2x3 matrix
   */
  mat23.create = function () {
    return new _mat23(
      1, 0,
      0, 1,
      0, 0
    );
  };
  
  /**
   * Create a new mat23 with the given values
   *
   * @param {Number} a Component A (index 0)
   * @param {Number} b Component B (index 1)
   * @param {Number} c Component C (index 2)
   * @param {Number} d Component D (index 3)
   * @param {Number} tx Component TX (index 4)
   * @param {Number} ty Component TY (index 5)
   * @returns {mat23} A new mat23
   */
  mat23.new = function (a, b, c, d, tx, ty) {
    return new _mat23(
      a, b,
      c, d,
      tx, ty
    );
  };
  
  /**
   * Creates a new mat23 initialized with values from an existing matrix
   *
   * @param {mat23} a matrix to clone
   * @returns {mat23} a new 2x3 matrix
   */
  mat23.clone = function (a) {
    return new _mat23(
      a.m00, a.m01,
      a.m02, a.m03,
      a.m04, a.m05
    );
  };
  
  /**
   * Copy the values from one mat23 to another
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the source matrix
   * @returns {mat23} out
   */
  mat23.copy = function (out, a) {
    out.m00 = a.m00;
    out.m01 = a.m01;
    out.m02 = a.m02;
    out.m03 = a.m03;
    out.m04 = a.m04;
    out.m05 = a.m05;
    return out;
  };
  
  /**
   * Set a mat23 to the identity matrix
   *
   * @param {mat23} out the receiving matrix
   * @returns {mat23} out
   */
  mat23.identity = function (out) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 1;
    out.m04 = 0;
    out.m05 = 0;
    return out;
  };
  
  /**
   * Set the components of a mat23 to the given values
   *
   * @param {mat23} out the receiving matrix
   * @param {Number} a Component A (index 0)
   * @param {Number} b Component B (index 1)
   * @param {Number} c Component C (index 2)
   * @param {Number} d Component D (index 3)
   * @param {Number} tx Component TX (index 4)
   * @param {Number} ty Component TY (index 5)
   * @returns {mat23} out
   */
  mat23.set = function (out, a, b, c, d, tx, ty) {
    out.m00 = a;
    out.m01 = b;
    out.m02 = c;
    out.m03 = d;
    out.m04 = tx;
    out.m05 = ty;
    return out;
  };
  
  /**
   * Inverts a mat23
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the source matrix
   * @returns {mat23} out
   */
  mat23.invert = function (out, a) {
    let aa = a.m00, ab = a.m01, ac = a.m02, ad = a.m03,
      atx = a.m04, aty = a.m05;
  
    let det = aa * ad - ab * ac;
    if (!det) {
      return null;
    }
    det = 1.0 / det;
  
    out.m00 = ad * det;
    out.m01 = -ab * det;
    out.m02 = -ac * det;
    out.m03 = aa * det;
    out.m04 = (ac * aty - ad * atx) * det;
    out.m05 = (ab * atx - aa * aty) * det;
    return out;
  };
  
  /**
   * Calculates the determinant of a mat23
   *
   * @param {mat23} a the source matrix
   * @returns {Number} determinant of a
   */
  mat23.determinant = function (a) {
    return a.m00 * a.m03 - a.m01 * a.m02;
  };
  
  /**
   * Multiplies two mat23's
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the first operand
   * @param {mat23} b the second operand
   * @returns {mat23} out
   */
  mat23.multiply = function (out, a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
      b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
    out.m00 = a0 * b0 + a2 * b1;
    out.m01 = a1 * b0 + a3 * b1;
    out.m02 = a0 * b2 + a2 * b3;
    out.m03 = a1 * b2 + a3 * b3;
    out.m04 = a0 * b4 + a2 * b5 + a4;
    out.m05 = a1 * b4 + a3 * b5 + a5;
    return out;
  };
  
  /**
   * Alias for {@link mat23.multiply}
   * @function
   */
  mat23.mul = mat23.multiply;
  
  /**
   * Rotates a mat23 by the given angle
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat23} out
   */
  mat23.rotate = function (out, a, rad) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
      s = Math.sin(rad),
      c = Math.cos(rad);
    out.m00 = a0 * c + a2 * s;
    out.m01 = a1 * c + a3 * s;
    out.m02 = a0 * -s + a2 * c;
    out.m03 = a1 * -s + a3 * c;
    out.m04 = a4;
    out.m05 = a5;
    return out;
  };
  
  /**
   * Scales the mat23 by the dimensions in the given vec2
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the matrix to translate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat23} out
   **/
  mat23.scale = function (out, a, v) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
      v0 = v.x, v1 = v.y;
    out.m00 = a0 * v0;
    out.m01 = a1 * v0;
    out.m02 = a2 * v1;
    out.m03 = a3 * v1;
    out.m04 = a4;
    out.m05 = a5;
    return out;
  };
  
  /**
   * Translates the mat23 by the dimensions in the given vec2
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the matrix to translate
   * @param {vec2} v the vec2 to translate the matrix by
   * @returns {mat23} out
   **/
  mat23.translate = function (out, a, v) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
      v0 = v.x, v1 = v.y;
    out.m00 = a0;
    out.m01 = a1;
    out.m02 = a2;
    out.m03 = a3;
    out.m04 = a0 * v0 + a2 * v1 + a4;
    out.m05 = a1 * v0 + a3 * v1 + a5;
    return out;
  };
  
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.rotate(dest, dest, rad);
   *
   * @param {mat23} out mat23 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat23} out
   */
  mat23.fromRotation = function (out, rad) {
    let s = Math.sin(rad), c = Math.cos(rad);
    out.m00 = c;
    out.m01 = s;
    out.m02 = -s;
    out.m03 = c;
    out.m04 = 0;
    out.m05 = 0;
    return out;
  };
  
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.scale(dest, dest, vec);
   *
   * @param {mat23} out mat23 receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat23} out
   */
  mat23.fromScaling = function (out, v) {
    out.m00 = v.m00;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = v.m01;
    out.m04 = 0;
    out.m05 = 0;
    return out;
  };
  
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat23.identity(dest);
   *     mat23.translate(dest, dest, vec);
   *
   * @param {mat23} out mat23 receiving operation result
   * @param {vec2} v Translation vector
   * @returns {mat23} out
   */
  mat23.fromTranslation = function (out, v) {
    out.m00 = 1;
    out.m01 = 0;
    out.m02 = 0;
    out.m03 = 1;
    out.m04 = v.x;
    out.m05 = v.y;
    return out;
  };
  
  /**
   * Returns a string representation of a mat23
   *
   * @param {mat23} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */
  mat23.str = function (a) {
    return `mat23(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {mat23} m
   * @returns {array}
   */
  mat23.array = function (out, m) {
    out[0] = m.m00;
    out[1] = m.m01;
    out[2] = m.m02;
    out[3] = m.m03;
    out[4] = m.m04;
    out[5] = m.m05;
  
    return out;
  };
  
  /**
   * Returns typed array to 16 float array
   *
   * @param {array} out
   * @param {mat23} m
   * @returns {array}
   */
  mat23.array4x4 = function (out, m) {
    out[0] = m.m00;
    out[1] = m.m01;
    out[2] = 0;
    out[3] = 0;
    out[4] = m.m02;
    out[5] = m.m03;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = m.m04;
    out[13] = m.m05;
    out[14] = 0;
    out[15] = 1;
  
    return out;
  };
  
  /**
   * Returns Frobenius norm of a mat23
   *
   * @param {mat23} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */
  mat23.frob = function (a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + 1));
  };
  
  /**
   * Adds two mat23's
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the first operand
   * @param {mat23} b the second operand
   * @returns {mat23} out
   */
  mat23.add = function (out, a, b) {
    out.m00 = a.m00 + b.m00;
    out.m01 = a.m01 + b.m01;
    out.m02 = a.m02 + b.m02;
    out.m03 = a.m03 + b.m03;
    out.m04 = a.m04 + b.m04;
    out.m05 = a.m05 + b.m05;
    return out;
  };
  
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the first operand
   * @param {mat23} b the second operand
   * @returns {mat23} out
   */
  mat23.subtract = function (out, a, b) {
    out.m00 = a.m00 - b.m00;
    out.m01 = a.m01 - b.m01;
    out.m02 = a.m02 - b.m02;
    out.m03 = a.m03 - b.m03;
    out.m04 = a.m04 - b.m04;
    out.m05 = a.m05 - b.m05;
    return out;
  };
  
  /**
   * Alias for {@link mat23.subtract}
   * @function
   */
  mat23.sub = mat23.subtract;
  
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat23} out the receiving matrix
   * @param {mat23} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat23} out
   */
  mat23.multiplyScalar = function (out, a, b) {
    out.m00 = a.m00 * b;
    out.m01 = a.m01 * b;
    out.m02 = a.m02 * b;
    out.m03 = a.m03 * b;
    out.m04 = a.m04 * b;
    out.m05 = a.m05 * b;
    return out;
  };
  
  /**
   * Adds two mat23's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat23} out the receiving vector
   * @param {mat23} a the first operand
   * @param {mat23} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat23} out
   */
  mat23.multiplyScalarAndAdd = function (out, a, b, scale) {
    out.m00 = a.m00 + (b.m00 * scale);
    out.m01 = a.m01 + (b.m01 * scale);
    out.m02 = a.m02 + (b.m02 * scale);
    out.m03 = a.m03 + (b.m03 * scale);
    out.m04 = a.m04 + (b.m04 * scale);
    out.m05 = a.m05 + (b.m05 * scale);
    return out;
  };
  
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat23} a The first matrix.
   * @param {mat23} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat23.exactEquals = function (a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05;
  };
  
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat23} a The first matrix.
   * @param {mat23} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat23.equals = function (a, b) {
    let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05;
    let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
      Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
      Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
    );
  };
  
  let _tmp$7 = new Array(16);
  
  class _mat4 {
    constructor(
      m00, m01, m02, m03,
      m04, m05, m06, m07,
      m08, m09, m10, m11,
      m12, m13, m14, m15
    ) {
      this.m00 = m00;
      this.m01 = m01;
      this.m02 = m02;
      this.m03 = m03;
      this.m04 = m04;
      this.m05 = m05;
      this.m06 = m06;
      this.m07 = m07;
      this.m08 = m08;
      this.m09 = m09;
      this.m10 = m10;
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m14 = m14;
      this.m15 = m15;
    }
  
    toJSON() {
      _tmp$7[0] = this.m00;
      _tmp$7[1] = this.m01;
      _tmp$7[2] = this.m02;
      _tmp$7[3] = this.m03;
      _tmp$7[4] = this.m04;
      _tmp$7[5] = this.m05;
      _tmp$7[6] = this.m06;
      _tmp$7[7] = this.m07;
      _tmp$7[8] = this.m08;
      _tmp$7[9] = this.m09;
      _tmp$7[10] = this.m10;
      _tmp$7[11] = this.m11;
      _tmp$7[12] = this.m12;
      _tmp$7[13] = this.m13;
      _tmp$7[14] = this.m14;
      _tmp$7[15] = this.m15;
  
      return _tmp$7;
    }
  }
  
  /**
   * @class 4x4 Matrix
   * @name mat4
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
  let mat4 = {};
  
  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */
  mat4.create = function () {
    return new _mat4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  };
  
  /**
   * Create a new mat4 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} A new mat4
   */
  mat4.new = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    return new _mat4(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33
    );
  };
  
  /**
   * Creates a new mat4 initialized with values from an existing matrix
   *
   * @param {mat4} a matrix to clone
   * @returns {mat4} a new 4x4 matrix
   */
  mat4.clone = function (a) {
    return new _mat4(
      a.m00, a.m01, a.m02, a.m03,
      a.m04, a.m05, a.m06, a.m07,
      a.m08, a.m09, a.m10, a.m11,
      a.m12, a.m13, a.m14, a.m15
    );
  };
  
  /**
   * Copy the values from one mat4 to another
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */
  mat4.copy = function (out, a) {
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
  };
  
  /**
   * Set the components of a mat4 to the given values
   *
   * @param {mat4} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} out
   */
  mat4.set = function (out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
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
  };
  
  
  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */
  mat4.identity = function (out) {
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
  };
  
  /**
   * Transpose the values of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */
  mat4.transpose = function (out, a) {
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
  };
  
  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */
  mat4.invert = function (out, a) {
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
  };
  
  /**
   * Calculates the adjugate of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */
  mat4.adjoint = function (out, a) {
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
  };
  
  /**
   * Calculates the determinant of a mat4
   *
   * @param {mat4} a the source matrix
   * @returns {Number} determinant of a
   */
  mat4.determinant = function (a) {
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
  };
  
  /**
   * Multiplies two mat4's explicitly
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */
  mat4.multiply = function (out, a, b) {
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
  };
  
  /**
   * Alias for {@link mat4.multiply}
   * @function
   */
  mat4.mul = mat4.multiply;
  
  /**
   * Translate a mat4 by the given vector
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to translate
   * @param {vec3} v vector to translate by
   * @returns {mat4} out
   */
  mat4.translate = function (out, a, v) {
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
  };
  
  /**
   * Scales the mat4 by the dimensions in the given vec3
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {vec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/
  mat4.scale = function (out, a, v) {
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
  };
  
  /**
   * Rotates a mat4 by the given angle around the given axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {vec3} axis the axis to rotate around
   * @returns {mat4} out
   */
  mat4.rotate = function (out, a, rad, axis) {
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
  };
  
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.rotateX = function (out, a, rad) {
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
  };
  
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.rotateY = function (out, a, rad) {
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
  };
  
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.rotateZ = function (out, a, rad) {
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
  };
  
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {vec3} v Translation vector
   * @returns {mat4} out
   */
  mat4.fromTranslation = function (out, v) {
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
  };
  
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {vec3} v Scaling vector
   * @returns {mat4} out
   */
  mat4.fromScaling = function (out, v) {
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
  };
  
  /**
   * Creates a matrix from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @param {vec3} axis the axis to rotate around
   * @returns {mat4} out
   */
  mat4.fromRotation = function (out, rad, axis) {
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
  };
  
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.fromXRotation = function (out, rad) {
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
  };
  
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.fromYRotation = function (out, rad) {
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
  };
  
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */
  mat4.fromZRotation = function (out, rad) {
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
  };
  
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @returns {mat4} out
   */
  mat4.fromRT = function (out, q, v) {
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
  };
  
  /**
   * Returns the translation vector component of a transformation
   *  matrix. If a matrix is built with fromRT,
   *  the returned vector will be the same as the translation vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive translation component
   * @param  {mat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  mat4.getTranslation = function (out, mat) {
    out.x = mat.m12;
    out.y = mat.m13;
    out.z = mat.m14;
  
    return out;
  };
  
  /**
   * Returns the scaling factor component of a transformation
   *  matrix. If a matrix is built with fromRTS
   *  with a normalized Quaternion paramter, the returned vector will be
   *  the same as the scaling vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {mat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  mat4.getScaling = function (out, mat) {
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
  };
  
  /**
   * Returns a quaternion representing the rotational component
   *  of a transformation matrix. If a matrix is built with
   *  fromRT, the returned quaternion will be the
   *  same as the quaternion originally supplied.
   * @param {quat} out Quaternion to receive the rotation component
   * @param {mat4} mat Matrix to be decomposed (input)
   * @return {quat} out
   */
  mat4.getRotation = function (out, mat) {
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
  };
  
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @param {vec3} s Scaling vector
   * @returns {mat4} out
   */
  mat4.fromRTS = function (out, q, v, s) {
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
  };
  
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
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
   * @param {mat4} out mat4 receiving operation result
   * @param {quat} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @param {vec3} s Scaling vector
   * @param {vec3} o The origin vector around which to scale and rotate
   * @returns {mat4} out
   */
  mat4.fromRTSOrigin = function (out, q, v, s, o) {
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
  };
  
  /**
   * Calculates a 4x4 matrix from the given quaternion
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat} q Quaternion to create matrix from
   *
   * @returns {mat4} out
   */
  mat4.fromQuat = function (out, q) {
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
  };
  
  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {Number} left Left bound of the frustum
   * @param {Number} right Right bound of the frustum
   * @param {Number} bottom Bottom bound of the frustum
   * @param {Number} top Top bound of the frustum
   * @param {Number} near Near bound of the frustum
   * @param {Number} far Far bound of the frustum
   * @returns {mat4} out
   */
  mat4.frustum = function (out, left, right, bottom, top, near, far) {
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
  };
  
  /**
   * Generates a perspective projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */
  mat4.perspective = function (out, fovy, aspect, near, far) {
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
  };
  
  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */
  mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
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
  };
  
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */
  mat4.ortho = function (out, left, right, bottom, top, near, far) {
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
  };
  
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing up
   * @returns {mat4} out
   */
  mat4.lookAt = function (out, eye, center, up) {
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
  
    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return mat4.identity(out);
    }
  
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
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
  
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
  
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
  
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
  };
  
  /**
   * Returns a string representation of a mat4
   *
   * @param {mat4} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */
  mat4.str = function (a) {
    return `mat4(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05}, ${a.m06}, ${a.m07}, ${a.m08}, ${a.m09}, ${a.m10}, ${a.m11}, ${a.m12}, ${a.m13}, ${a.m14}, ${a.m15})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {mat4} m
   * @returns {array}
   */
  mat4.array = function (out, m) {
    out[0]  = m.m00;
    out[1]  = m.m01;
    out[2]  = m.m02;
    out[3]  = m.m03;
    out[4]  = m.m04;
    out[5]  = m.m05;
    out[6]  = m.m06;
    out[7]  = m.m07;
    out[8]  = m.m08;
    out[9]  = m.m09;
    out[10] = m.m10;
    out[11] = m.m11;
    out[12] = m.m12;
    out[13] = m.m13;
    out[14] = m.m14;
    out[15] = m.m15;
  
    return out;
  };
  
  /**
   * Returns Frobenius norm of a mat4
   *
   * @param {mat4} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */
  mat4.frob = function (a) {
    return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + Math.pow(a.m06, 2) + Math.pow(a.m07, 2) + Math.pow(a.m08, 2) + Math.pow(a.m09, 2) + Math.pow(a.m10, 2) + Math.pow(a.m11, 2) + Math.pow(a.m12, 2) + Math.pow(a.m13, 2) + Math.pow(a.m14, 2) + Math.pow(a.m15, 2)))
  };
  
  /**
   * Adds two mat4's
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */
  mat4.add = function (out, a, b) {
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
  };
  
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */
  mat4.subtract = function (out, a, b) {
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
  };
  
  /**
   * Alias for {@link mat4.subtract}
   * @function
   */
  mat4.sub = mat4.subtract;
  
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat4} out
   */
  mat4.multiplyScalar = function (out, a, b) {
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
  };
  
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat4} out the receiving vector
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat4} out
   */
  mat4.multiplyScalarAndAdd = function (out, a, b, scale) {
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
  };
  
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat4} a The first matrix.
   * @param {mat4} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat4.exactEquals = function (a, b) {
    return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 &&
      a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 &&
      a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 &&
      a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
  };
  
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat4} a The first matrix.
   * @param {mat4} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */
  mat4.equals = function (a, b) {
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
  };
  
  let _tmp$8 = new Array(3);
  
  class _color3 {
    constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
    }
  
    toJSON() {
      _tmp$8[0] = this.r;
      _tmp$8[1] = this.g;
      _tmp$8[2] = this.b;
  
      return _tmp$8;
    }
  }
  
  /**
   * @class Color
   * @name color3
   */
  let color3 = {};
  
  /**
   * Creates a new color
   *
   * @returns {color3} a new color
   */
  color3.create = function () {
    return new _color3(1, 1, 1);
  };
  
  /**
   * Creates a new color initialized with the given values
   *
   * @param {Number} r red component
   * @param {Number} g green component
   * @param {Number} b blue component
   * @returns {color3} a new color
   * @function
   */
  color3.new = function (r, g, b) {
    return new _color3(r, g, b);
  };
  
  /**
   * Creates a new color initialized with values from an existing quaternion
   *
   * @param {color3} a color to clone
   * @returns {color3} a new color
   * @function
   */
  color3.clone = function (a) {
    return new _color3(a.r, a.g, a.b, a.a);
  };
  
  /**
   * Copy the values from one color to another
   *
   * @param {color3} out the receiving color
   * @param {color3} a the source color
   * @returns {color3} out
   * @function
   */
  color3.copy = function (out, a) {
    out.r = a.r;
    out.g = a.g;
    out.b = a.b;
    return out;
  };
  
  /**
   * Set the components of a color to the given values
   *
   * @param {color3} out the receiving color
   * @param {Number} r red component
   * @param {Number} g green component
   * @param {Number} b blue component
   * @returns {color3} out
   * @function
   */
  color3.set = function (out, r, g, b) {
    out.r = r;
    out.g = g;
    out.b = b;
    return out;
  };
  
  /**
   * Set from hex
   *
   * @param {color3} out the receiving color
   * @param {Number} hex
   * @returns {color3} out
   * @function
   */
  color3.fromHex = function (out, hex) {
    let r = ((hex >> 16)) / 255.0;
    let g = ((hex >> 8) & 0xff) / 255.0;
    let b = ((hex) & 0xff) / 255.0;
  
    out.r = r;
    out.g = g;
    out.b = b;
    return out;
  };
  
  /**
   * Adds two color's
   *
   * @param {color3} out the receiving color
   * @param {color3} a the first operand
   * @param {color3} b the second operand
   * @returns {color3} out
   * @function
   */
  color3.add = function (out, a, b) {
    out.r = a.r + b.r;
    out.g = a.g + b.g;
    out.b = a.b + b.b;
    return out;
  };
  
  /**
   * Subtracts color b from color a
   *
   * @param {color3} out the receiving color
   * @param {color3} a the first operand
   * @param {color3} b the second operand
   * @returns {color3} out
   */
  color3.subtract = function (out, a, b) {
    out.r = a.r - b.r;
    out.g = a.g - b.g;
    out.b = a.b - b.b;
    return out;
  };
  
  /**
   * Alias for {@link color3.subtract}
   * @function
   */
  color3.sub = color3.subtract;
  
  /**
   * Multiplies two color's
   *
   * @param {color3} out the receiving color
   * @param {color3} a the first operand
   * @param {color3} b the second operand
   * @returns {color3} out
   * @function
   */
  color3.multiply = function (out, a, b) {
    out.r = a.r * b.r;
    out.g = a.g * b.g;
    out.b = a.b * b.b;
    return out;
  };
  
  /**
   * Alias for {@link color3.multiply}
   * @function
   */
  color3.mul = color3.multiply;
  
  /**
   * Divides two color's
   *
   * @param {color3} out the receiving vector
   * @param {color3} a the first operand
   * @param {color3} b the second operand
   * @returns {color3} out
   */
  color3.divide = function (out, a, b) {
    out.r = a.r / b.r;
    out.g = a.g / b.g;
    out.b = a.b / b.b;
    return out;
  };
  
  /**
   * Alias for {@link color3.divide}
   * @function
   */
  color3.div = color3.divide;
  
  
  /**
   * Scales a color by a scalar number
   *
   * @param {color3} out the receiving vector
   * @param {color3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {color3} out
   * @function
   */
  color3.scale = function (out, a, b) {
    out.r = a.r * b;
    out.g = a.g * b;
    out.b = a.b * b;
    return out;
  };
  
  /**
   * Performs a linear interpolation between two color's
   *
   * @param {color3} out the receiving color
   * @param {color3} a the first operand
   * @param {color3} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {color3} out
   * @function
   */
  color3.lerp = function (out, a, b, t) {
    let ar = a.r,
        ag = a.g,
        ab = a.b;
    out.r = ar + t * (b.r - ar);
    out.g = ag + t * (b.g - ag);
    out.b = ab + t * (b.b - ab);
    return out;
  };
  
  /**
   * Returns a string representation of a color
   *
   * @param {color3} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  color3.str = function (a) {
    return `color3(${a.r}, ${a.g}, ${a.b})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {color3} a
   * @returns {array}
   */
  color3.array = function (out, a) {
    out[0] = a.r;
    out[1] = a.g;
    out[2] = a.b;
  
    return out;
  };
  
  /**
   * Returns whether or not the color have exactly the same elements in the same position (when compared with ===)
   *
   * @param {color3} a The first color3.
   * @param {color3} b The second color3.
   * @returns {Boolean} True if the colors are equal, false otherwise.
   */
  color3.exactEquals = function (a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b;
  };
  
  /**
   * Returns whether or not the colors have approximately the same elements in the same position.
   *
   * @param {color3} a The first color3.
   * @param {color3} b The second color3.
   * @returns {Boolean} True if the colors are equal, false otherwise.
   */
  color3.equals = function (a, b) {
    let a0 = a.r, a1 = a.g, a2 = a.b;
    let b0 = b.r, b1 = b.g, b2 = b.b;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
  };
  
  /**
   * Returns the hex value
   *
   * @param {color3} a The color
   * @returns {Number}
   */
  color3.hex = function (a) {
    return (a.r * 255) << 16 | (a.g * 255) << 8 | (a.b * 255);
  };
  
  let _tmp$9 = new Array(4);
  
  class _color4 {
    constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  
    toJSON() {
      _tmp$9[0] = this.r;
      _tmp$9[1] = this.g;
      _tmp$9[2] = this.b;
      _tmp$9[3] = this.a;
  
      return _tmp$9;
    }
  }
  
  /**
   * @class Color
   * @name color4
   */
  let color4 = {};
  
  /**
   * Creates a new color
   *
   * @returns {color4} a new color
   */
  color4.create = function () {
    return new _color4(1, 1, 1, 1);
  };
  
  /**
   * Creates a new color initialized with the given values
   *
   * @param {Number} r red component
   * @param {Number} g green component
   * @param {Number} b blue component
   * @param {Number} a alpha component
   * @returns {color4} a new color
   * @function
   */
  color4.new = function (r, g, b, a) {
    return new _color4(r, g, b, a);
  };
  
  /**
   * Creates a new color initialized with values from an existing quaternion
   *
   * @param {color4} a color to clone
   * @returns {color4} a new color
   * @function
   */
  color4.clone = function (a) {
    return new _color4(a.r, a.g, a.b, a.a);
  };
  
  /**
   * Copy the values from one color to another
   *
   * @param {color4} out the receiving color
   * @param {color4} a the source color
   * @returns {color4} out
   * @function
   */
  color4.copy = function (out, a) {
    out.r = a.r;
    out.g = a.g;
    out.b = a.b;
    out.a = a.a;
    return out;
  };
  
  /**
   * Set the components of a color to the given values
   *
   * @param {color4} out the receiving color
   * @param {Number} r red component
   * @param {Number} g green component
   * @param {Number} b blue component
   * @param {Number} a alpha component
   * @returns {color4} out
   * @function
   */
  color4.set = function (out, r, g, b, a) {
    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  };
  
  /**
   * Set from hex
   *
   * @param {color4} out the receiving color
   * @param {Number} hex
   * @returns {color4} out
   * @function
   */
  color4.fromHex = function (out, hex) {
    let r = ((hex >> 24)) / 255.0;
    let g = ((hex >> 16) & 0xff) / 255.0;
    let b = ((hex >> 8) & 0xff) / 255.0;
    let a = ((hex) & 0xff) / 255.0;
  
    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  };
  
  /**
   * Adds two color's
   *
   * @param {color4} out the receiving color
   * @param {color4} a the first operand
   * @param {color4} b the second operand
   * @returns {color4} out
   * @function
   */
  color4.add = function (out, a, b) {
    out.r = a.r + b.r;
    out.g = a.g + b.g;
    out.b = a.b + b.b;
    out.a = a.a + b.a;
    return out;
  };
  
  /**
   * Subtracts color b from color a
   *
   * @param {color4} out the receiving color
   * @param {color4} a the first operand
   * @param {color4} b the second operand
   * @returns {color4} out
   */
  color4.subtract = function (out, a, b) {
    out.r = a.r - b.r;
    out.g = a.g - b.g;
    out.b = a.b - b.b;
    out.a = a.a - b.a;
    return out;
  };
  
  /**
   * Alias for {@link color4.subtract}
   * @function
   */
  color4.sub = color4.subtract;
  
  /**
   * Multiplies two color's
   *
   * @param {color4} out the receiving color
   * @param {color4} a the first operand
   * @param {color4} b the second operand
   * @returns {color4} out
   * @function
   */
  color4.multiply = function (out, a, b) {
    out.r = a.r * b.r;
    out.g = a.g * b.g;
    out.b = a.b * b.b;
    out.a = a.a * b.a;
    return out;
  };
  
  /**
   * Alias for {@link color4.multiply}
   * @function
   */
  color4.mul = color4.multiply;
  
  /**
   * Divides two color's
   *
   * @param {color4} out the receiving vector
   * @param {color4} a the first operand
   * @param {color4} b the second operand
   * @returns {color4} out
   */
  color4.divide = function (out, a, b) {
    out.r = a.r / b.r;
    out.g = a.g / b.g;
    out.b = a.b / b.b;
    out.a = a.a / b.a;
    return out;
  };
  
  /**
   * Alias for {@link color4.divide}
   * @function
   */
  color4.div = color4.divide;
  
  
  /**
   * Scales a color by a scalar number
   *
   * @param {color4} out the receiving vector
   * @param {color4} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {color4} out
   * @function
   */
  color4.scale = function (out, a, b) {
    out.r = a.r * b;
    out.g = a.g * b;
    out.b = a.b * b;
    out.a = a.a * b;
    return out;
  };
  
  /**
   * Performs a linear interpolation between two color's
   *
   * @param {color4} out the receiving color
   * @param {color4} a the first operand
   * @param {color4} b the second operand
   * @param {Number} t interpolation amount between the two inputs
   * @returns {color4} out
   * @function
   */
  color4.lerp = function (out, a, b, t) {
    let ar = a.r,
        ag = a.g,
        ab = a.b,
        aa = a.a;
    out.r = ar + t * (b.r - ar);
    out.g = ag + t * (b.g - ag);
    out.b = ab + t * (b.b - ab);
    out.a = aa + t * (b.a - aa);
    return out;
  };
  
  /**
   * Returns a string representation of a color
   *
   * @param {color4} a vector to represent as a string
   * @returns {String} string representation of the vector
   */
  color4.str = function (a) {
    return `color4(${a.r}, ${a.g}, ${a.b}, ${a.a})`;
  };
  
  /**
   * Returns typed array
   *
   * @param {array} out
   * @param {color4} a
   * @returns {array}
   */
  color4.array = function (out, a) {
    out[0] = a.r;
    out[1] = a.g;
    out[2] = a.b;
    out[3] = a.a;
  
    return out;
  };
  
  /**
   * Returns whether or not the color have exactly the same elements in the same position (when compared with ===)
   *
   * @param {color4} a The first color4.
   * @param {color4} b The second color4.
   * @returns {Boolean} True if the colors are equal, false otherwise.
   */
  color4.exactEquals = function (a, b) {
    return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
  };
  
  /**
   * Returns whether or not the colors have approximately the same elements in the same position.
   *
   * @param {color4} a The first color4.
   * @param {color4} b The second color4.
   * @returns {Boolean} True if the colors are equal, false otherwise.
   */
  color4.equals = function (a, b) {
    let a0 = a.r, a1 = a.g, a2 = a.b, a3 = a.a;
    let b0 = b.r, b1 = b.g, b2 = b.b, b3 = b.a;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
  };
  
  /**
   * Returns the hex value
   *
   * @param {color4} a The color
   * @returns {Number}
   */
  color4.hex = function (a) {
    return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
  };
  
  // NOTE: there is no syntax for: export {* as bits} from './lib/bits';
  let bits = bits_;
  
  
  
  var math = Object.freeze({
    bits: bits,
    vec2: vec2,
    vec3: vec3,
    vec4: vec4,
    quat: quat,
    mat2: mat2,
    mat23: mat23,
    mat3: mat3,
    mat4: mat4,
    color3: color3,
    color4: color4,
    EPSILON: EPSILON,
    equals: equals,
    approx: approx,
    clamp: clamp,
    clamp01: clamp01,
    lerp: lerp,
    toRadian: toRadian,
    toDegree: toDegree,
    random: random,
    randomRange: randomRange,
    randomRangeInt: randomRangeInt,
    nextPow2: nextPow2
  });
  
  var enums = {
    // projection
    PROJ_PERSPECTIVE: 0,
    PROJ_ORTHO: 1,
  
    // lights
    LIGHT_DIRECTIONAL: 0,
    LIGHT_POINT: 1,
    LIGHT_SPOT: 2,
  
    // shadows
    SHADOW_NONE: 0,
    SHADOW_HARD: 1,
    SHADOW_SOFT: 2,
  
    // parameter type
    PARAM_INT:             0,
    PARAM_INT2:            1,
    PARAM_INT3:            2,
    PARAM_INT4:            3,
    PARAM_FLOAT:           4,
    PARAM_FLOAT2:          5,
    PARAM_FLOAT3:          6,
    PARAM_FLOAT4:          7,
    PARAM_COLOR3:          8,
    PARAM_COLOR4:          9,
    PARAM_MAT2:           10,
    PARAM_MAT3:           11,
    PARAM_MAT4:           12,
    PARAM_TEXTURE_2D:     13,
    PARAM_TEXTURE_CUBE:   14,
  
    // clear flags
    CLEAR_COLOR: 1,
    CLEAR_DEPTH: 2,
    CLEAR_STENCIL: 4,
  };
  
  const GL_NEAREST = 9728;                // gl.NEAREST
  const GL_LINEAR = 9729;                 // gl.LINEAR
  const GL_NEAREST_MIPMAP_NEAREST = 9984; // gl.NEAREST_MIPMAP_NEAREST
  const GL_LINEAR_MIPMAP_NEAREST = 9985;  // gl.LINEAR_MIPMAP_NEAREST
  const GL_NEAREST_MIPMAP_LINEAR = 9986;  // gl.NEAREST_MIPMAP_LINEAR
  const GL_LINEAR_MIPMAP_LINEAR = 9987;   // gl.LINEAR_MIPMAP_LINEAR
  
  // const GL_BYTE = 5120;                  // gl.BYTE
  const GL_UNSIGNED_BYTE = 5121;            // gl.UNSIGNED_BYTE
  // const GL_SHORT = 5122;                 // gl.SHORT
  const GL_UNSIGNED_SHORT = 5123;           // gl.UNSIGNED_SHORT
  const GL_UNSIGNED_INT = 5125;             // gl.UNSIGNED_INT
  const GL_FLOAT = 5126;                    // gl.FLOAT
  const GL_UNSIGNED_SHORT_5_6_5 = 33635;    // gl.UNSIGNED_SHORT_5_6_5
  const GL_UNSIGNED_SHORT_4_4_4_4 = 32819;  // gl.UNSIGNED_SHORT_4_4_4_4
  const GL_UNSIGNED_SHORT_5_5_5_1 = 32820;  // gl.UNSIGNED_SHORT_5_5_5_1
  const GL_HALF_FLOAT_OES = 36193;          // gl.HALF_FLOAT_OES
  
  const GL_DEPTH_COMPONENT = 6402; // gl.DEPTH_COMPONENT
  
  const GL_ALPHA = 6406;            // gl.ALPHA
  const GL_RGB = 6407;              // gl.RGB
  const GL_RGBA = 6408;             // gl.RGBA
  const GL_LUMINANCE = 6409;        // gl.LUMINANCE
  const GL_LUMINANCE_ALPHA = 6410;  // gl.LUMINANCE_ALPHA
  
  const GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;   // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
  const GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;  // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
  const GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;  // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
  const GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;  // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
  
  const GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;  // ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
  const GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;  // ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
  const GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
  const GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
  
  const GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // ext.COMPRESSED_RGB_ETC1_WEBGL
  
  const _filterGL = [
    [ GL_NEAREST,  GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR ],
    [ GL_LINEAR,  GL_LINEAR_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_LINEAR ],
  ];
  
  const _textureFmtGL = [
    // TEXTURE_FMT_RGB_DXT1: 0
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_S3TC_DXT1_EXT, pixelType: null },
  
    // TEXTURE_FMT_RGBA_DXT1: 1
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT1_EXT, pixelType: null },
  
    // TEXTURE_FMT_RGBA_DXT3: 2
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT3_EXT, pixelType: null },
  
    // TEXTURE_FMT_RGBA_DXT5: 3
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT5_EXT, pixelType: null },
  
    // TEXTURE_FMT_RGB_ETC1: 4
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_ETC1_WEBGL, pixelType: null },
  
    // TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG, pixelType: null },
  
    // TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, pixelType: null },
  
    // TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG, pixelType: null },
  
    // TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, pixelType: null },
  
    // TEXTURE_FMT_A8: 9
    { format: GL_ALPHA, internalFormat: GL_ALPHA, pixelType: GL_UNSIGNED_BYTE },
  
    // TEXTURE_FMT_L8: 10
    { format: GL_LUMINANCE, internalFormat: GL_LUMINANCE, pixelType: GL_UNSIGNED_BYTE },
  
    // TEXTURE_FMT_L8_A8: 11
    { format: GL_LUMINANCE_ALPHA, internalFormat: GL_LUMINANCE_ALPHA, pixelType: GL_UNSIGNED_BYTE },
  
    // TEXTURE_FMT_R5_G6_B5: 12
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_SHORT_5_6_5 },
  
    // TEXTURE_FMT_R5_G5_B5_A1: 13
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_5_5_5_1 },
  
    // TEXTURE_FMT_R4_G4_B4_A4: 14
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_4_4_4_4 },
  
    // TEXTURE_FMT_RGB8: 15
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_BYTE },
  
    // TEXTURE_FMT_RGBA8: 16
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_BYTE },
  
    // TEXTURE_FMT_RGB16F: 17
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_HALF_FLOAT_OES },
  
    // TEXTURE_FMT_RGBA16F: 18
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_HALF_FLOAT_OES },
  
    // TEXTURE_FMT_RGB32F: 19
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_FLOAT },
  
    // TEXTURE_FMT_RGBA32F: 20
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_FLOAT },
  
    // TEXTURE_FMT_R32F: 21
    { format: null, internalFormat: null, pixelType: null },
  
    // TEXTURE_FMT_111110F: 22
    { format: null, internalFormat: null, pixelType: null },
  
    // TEXTURE_FMT_SRGB: 23
    { format: null, internalFormat: null, pixelType: null },
  
    // TEXTURE_FMT_SRGBA: 24
    { format: null, internalFormat: null, pixelType: null },
  
    // TEXTURE_FMT_D16: 25
    { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_SHORT },
  
    // TEXTURE_FMT_D24: 26
    { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },
  
    // TEXTURE_FMT_D24S8: 27
    { format: null, internalFormat: null, pixelType: null },
  ];
  
  /**
   * enums
   */
  const enums$1 = {
    // buffer usage
    USAGE_STATIC: 35044,  // gl.STATIC_DRAW
    USAGE_DYNAMIC: 35048, // gl.DYNAMIC_DRAW
    USAGE_STREAM: 35040,  // gl.STREAM_DRAW
  
    // index buffer format
    INDEX_FMT_UINT8: 5121,  // gl.UNSIGNED_BYTE
    INDEX_FMT_UINT16: 5123, // gl.UNSIGNED_SHORT
    INDEX_FMT_UINT32: 5125, // gl.UNSIGNED_INT (OES_element_index_uint)
  
    // vertex attribute semantic
    ATTR_POSITION: 'a_position',
    ATTR_NORMAL: 'a_normal',
    ATTR_TANGENT: 'a_tangent',
    ATTR_BITANGENT: 'a_bitangent',
    ATTR_WEIGHTS: 'a_weights',
    ATTR_JOINTS: 'a_joints',
    ATTR_COLOR: 'a_color',
    ATTR_COLOR0: 'a_color0',
    ATTR_COLOR1: 'a_color1',
    ATTR_UV: 'a_uv',
    ATTR_UV0: 'a_uv0',
    ATTR_UV1: 'a_uv1',
    ATTR_UV2: 'a_uv2',
    ATTR_UV3: 'a_uv3',
    ATTR_UV4: 'a_uv4',
    ATTR_UV5: 'a_uv5',
    ATTR_UV6: 'a_uv6',
    ATTR_UV7: 'a_uv7',
  
    // vertex attribute type
    ATTR_TYPE_INT8: 5120,    // gl.BYTE
    ATTR_TYPE_UINT8: 5121,   // gl.UNSIGNED_BYTE
    ATTR_TYPE_INT16: 5122,   // gl.SHORT
    ATTR_TYPE_UINT16: 5123,  // gl.UNSIGNED_SHORT
    ATTR_TYPE_INT32: 5124,   // gl.INT
    ATTR_TYPE_UINT32: 5125,  // gl.UNSIGNED_INT
    ATTR_TYPE_FLOAT32: 5126, // gl.FLOAT
  
    // texture filter
    FILTER_NEAREST: 0,
    FILTER_LINEAR: 1,
  
    // texture wrap mode
    WRAP_REPEAT: 10497, // gl.REPEAT
    WRAP_CLAMP: 33071,  // gl.CLAMP_TO_EDGE
    WRAP_MIRROR: 33648, // gl.MIRRORED_REPEAT
  
    // texture format
    // compress formats
    TEXTURE_FMT_RGB_DXT1: 0,
    TEXTURE_FMT_RGBA_DXT1: 1,
    TEXTURE_FMT_RGBA_DXT3: 2,
    TEXTURE_FMT_RGBA_DXT5: 3,
    TEXTURE_FMT_RGB_ETC1: 4,
    TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5,
    TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6,
    TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7,
    TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8,
  
    // normal formats
    TEXTURE_FMT_A8: 9,
    TEXTURE_FMT_L8: 10,
    TEXTURE_FMT_L8_A8: 11,
    TEXTURE_FMT_R5_G6_B5: 12,
    TEXTURE_FMT_R5_G5_B5_A1: 13,
    TEXTURE_FMT_R4_G4_B4_A4: 14,
    TEXTURE_FMT_RGB8: 15,
    TEXTURE_FMT_RGBA8: 16,
    TEXTURE_FMT_RGB16F: 17,
    TEXTURE_FMT_RGBA16F: 18,
    TEXTURE_FMT_RGB32F: 19,
    TEXTURE_FMT_RGBA32F: 20,
    TEXTURE_FMT_R32F: 21,
    TEXTURE_FMT_111110F: 22,
    TEXTURE_FMT_SRGB: 23,
    TEXTURE_FMT_SRGBA: 24,
  
    // depth formats
    TEXTURE_FMT_D16: 25,
    TEXTURE_FMT_D32: 26,
    TEXTURE_FMT_D24S8: 27,
  
    // depth and stencil function
    DS_FUNC_NEVER: 512,    // gl.NEVER
    DS_FUNC_LESS: 513,     // gl.LESS
    DS_FUNC_EQUAL: 514,    // gl.EQUAL
    DS_FUNC_LEQUAL: 515,   // gl.LEQUAL
    DS_FUNC_GREATER: 516,  // gl.GREATER
    DS_FUNC_NOTEQUAL: 517, // gl.NOTEQUAL
    DS_FUNC_GEQUAL: 518,   // gl.GEQUAL
    DS_FUNC_ALWAYS: 519,   // gl.ALWAYS
  
    // render-buffer format
    RB_FMT_RGBA4: 32854,    // gl.RGBA4
    RB_FMT_RGB5_A1: 32855,  // gl.RGB5_A1
    RB_FMT_RGB565: 36194,   // gl.RGB565
    RB_FMT_D16: 33189,      // gl.DEPTH_COMPONENT16
    RB_FMT_S8: 36168,       // gl.STENCIL_INDEX8
    RB_FMT_D24S8: 34041,    // gl.DEPTH_STENCIL
  
    // blend-equation
    BLEND_FUNC_ADD: 32774,              // gl.FUNC_ADD
    BLEND_FUNC_SUBTRACT: 32778,         // gl.FUNC_SUBTRACT
    BLEND_FUNC_REVERSE_SUBTRACT: 32779, // gl.FUNC_REVERSE_SUBTRACT
  
    // blend
    BLEND_ZERO: 0,                          // gl.ZERO
    BLEND_ONE: 1,                           // gl.ONE
    BLEND_SRC_COLOR: 768,                   // gl.SRC_COLOR
    BLEND_ONE_MINUS_SRC_COLOR: 769,         // gl.ONE_MINUS_SRC_COLOR
    BLEND_DST_COLOR: 774,                   // gl.DST_COLOR
    BLEND_ONE_MINUS_DST_COLOR: 775,         // gl.ONE_MINUS_DST_COLOR
    BLEND_SRC_ALPHA: 770,                   // gl.SRC_ALPHA
    BLEND_ONE_MINUS_SRC_ALPHA: 771,         // gl.ONE_MINUS_SRC_ALPHA
    BLEND_DST_ALPHA: 772,                   // gl.DST_ALPHA
    BLEND_ONE_MINUS_DST_ALPHA: 773,         // gl.ONE_MINUS_DST_ALPHA
    BLEND_CONSTANT_COLOR: 32769,            // gl.CONSTANT_COLOR
    BLEND_ONE_MINUS_CONSTANT_COLOR: 32770,  // gl.ONE_MINUS_CONSTANT_COLOR
    BLEND_CONSTANT_ALPHA: 32771,            // gl.CONSTANT_ALPHA
    BLEND_ONE_MINUS_CONSTANT_ALPHA: 32772,  // gl.ONE_MINUS_CONSTANT_ALPHA
    BLEND_SRC_ALPHA_SATURATE: 776,          // gl.SRC_ALPHA_SATURATE
  
    // stencil operation
    STENCIL_OP_KEEP: 7680,          // gl.KEEP
    STENCIL_OP_ZERO: 0,             // gl.ZERO
    STENCIL_OP_REPLACE: 7681,       // gl.REPLACE
    STENCIL_OP_INCR: 7682,          // gl.INCR
    STENCIL_OP_INCR_WRAP: 34055,    // gl.INCR_WRAP
    STENCIL_OP_DECR: 7683,          // gl.DECR
    STENCIL_OP_DECR_WRAP: 34056,    // gl.DECR_WRAP
    STENCIL_OP_INVERT: 5386,        // gl.INVERT
  
    // cull
    CULL_NONE: 0,
    CULL_FRONT: 1028,
    CULL_BACK: 1029,
    CULL_FRONT_AND_BACK: 1032,
  
    // primitive type
    PT_POINTS: 0,         // gl.POINTS
    PT_LINES: 1,          // gl.LINES
    PT_LINE_LOOP: 2,      // gl.LINE_LOOP
    PT_LINE_STRIP: 3,     // gl.LINE_STRIP
    PT_TRIANGLES: 4,      // gl.TRIANGLES
    PT_TRIANGLE_STRIP: 5, // gl.TRIANGLE_STRIP
    PT_TRIANGLE_FAN: 6,   // gl.TRIANGLE_FAN
  };
  
  /**
   * @method attrTypeBytes
   * @param {ATTR_TYPE_*} attrType
   */
  function attrTypeBytes(attrType) {
    if (attrType === enums$1.ATTR_TYPE_INT8) {
      return 1;
    } else if (attrType === enums$1.ATTR_TYPE_UINT8) {
      return 1;
    } else if (attrType === enums$1.ATTR_TYPE_INT16) {
      return 2;
    } else if (attrType === enums$1.ATTR_TYPE_UINT16) {
      return 2;
    } else if (attrType === enums$1.ATTR_TYPE_INT32) {
      return 4;
    } else if (attrType === enums$1.ATTR_TYPE_UINT32) {
      return 4;
    } else if (attrType === enums$1.ATTR_TYPE_FLOAT32) {
      return 4;
    }
  
    console.warn(`Unknown ATTR_TYPE: ${attrType}`);
    return 0;
  }
  
  /**
   * @method glFilter
   * @param {WebGLContext} gl
   * @param {FILTER_*} filter
   * @param {FILTER_*} mipFilter
   */
  function glFilter(gl, filter, mipFilter = -1) {
    let result = _filterGL[filter][mipFilter+1];
    if (result === undefined) {
      console.warn(`Unknown FILTER: ${filter}`);
      return mipFilter === -1 ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR;
    }
  
    return result;
  }
  
  /**
   * @method glTextureFmt
   * @param {TEXTURE_FMT_*} fmt
   */
  function glTextureFmt(fmt) {
    let result = _textureFmtGL[fmt];
    if (result === undefined) {
      console.warn(`Unknown TEXTURE_FMT: ${fmt}`);
      return _textureFmtGL[enums$1.TEXTURE_FMT_RGBA8];
    }
  
    return result;
  }
  
  // ====================
  // exports
  // ====================
  
  class VertexFormat {
    /**
     * @constructor
     * @param {Array} infos
     *
     * @example
     * let vertexFmt = new VertexFormat([
     *   { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
     *   { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
     *   { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4, normalize: true },
     * ])
     */
    constructor(infos) {
      this._attr2el = {};
      this._elements = [];
      this._bytes = 0;
  
      let offset = 0;
      for (let i = 0, len = infos.length; i < len; ++i) {
        let info = infos[i];
        let el = {
          name: info.name,
          offset: offset,
          stride: 0,
          stream: -1,
          type: info.type,
          num: info.num,
          normalize: (info.normalize === undefined) ? false : info.normalize,
          bytes: info.num * attrTypeBytes(info.type),
        };
  
        this._attr2el[el.name] = el;
        this._elements.push(el);
  
        this._bytes += el.bytes;
        offset += el.bytes;
      }
  
      for (let i = 0, len = this._elements.length; i < len; ++i) {
        let el = this._elements[i];
        el.stride = this._bytes;
      }
    }
  
    /**
     * @method element
     * @param {string} attrName
     */
    element(attrName) {
      return this._attr2el[attrName];
    }
  }
  
  class IndexBuffer {
    /**
     * @constructor
     * @param {Device} device
     * @param {INDEX_FMT_*} format
     * @param {USAGE_*} usage
     * @param {ArrayBuffer} data
     * @param {Number} numIndices
     */
    constructor(device, format, usage, data, numIndices) {
      this._device = device;
      this._format = format;
      this._usage = usage;
      this._numIndices = numIndices;
      this._bytesPerIndex = 0;
      // calculate bytes
      let bytes = 0;
      if (format === enums$1.INDEX_FMT_UINT8) {
        this._bytesPerIndex = 1;
      } else if (format === enums$1.INDEX_FMT_UINT16) {
        this._bytesPerIndex = 2;
      } else if (format === enums$1.INDEX_FMT_UINT32) {
        this._bytesPerIndex = 4;
      }
      this._bytes = this._bytesPerIndex * numIndices;
  
      // update
      this._glID = device._gl.createBuffer();
      this.update(0, data);
  
      // stats
      device._stats.ib += bytes;
    }
  
    /**
     * @method destroy
     */
    destroy() {
      if (this._glID === -1) {
        console.error('The buffer already destroyed');
        return;
      }
  
      let gl = this._device._gl;
      gl.deleteBuffer(this._glID);
      this._device._stats.ib -= this.bytes;
  
      this._glID = -1;
    }
  
    /**
     * @method update
     * @param {Number} offset
     * @param {ArrayBuffer} data
     */
    update(offset, data) {
      if (this._glID === -1) {
        console.error('The buffer is destroyed');
        return;
      }
  
      if (data && data.byteLength + offset > this._bytes) {
        console.error('Failed to update data, bytes exceed.');
        return;
      }
  
      let gl = this._device._gl;
      let glUsage = this._usage;
  
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);
      if (!data) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._bytes, glUsage);
      } else {
        if (offset) {
          gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
        } else {
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
        }
      }
      this._device._restoreIndexBuffer();
    }
  
    get count () {
      return this._numIndices;
    }
  }
  
  class VertexBuffer {
    /**
     * @constructor
     * @param {Device} device
     * @param {VertexFormat} format
     * @param {USAGE_*} usage
     * @param {ArrayBuffer} data
     * @param {Number} numVertices
     */
    constructor(device, format, usage, data, numVertices) {
      this._device = device;
      this._format = format;
      this._usage = usage;
      this._numVertices = numVertices;
  
      // calculate bytes
      this._bytes = this._format._bytes * numVertices;
  
      // update
      this._glID = device._gl.createBuffer();
      this.update(0, data);
  
      // stats
      device._stats.vb += this._bytes;
    }
  
    /**
     * @method destroy
     */
    destroy() {
      if (this._glID === -1) {
        console.error('The buffer already destroyed');
        return;
      }
  
      let gl = this._device._gl;
      gl.deleteBuffer(this._glID);
      this._device._stats.vb -= this.bytes;
  
      this._glID = -1;
    }
  
    /**
     * @method update
     * @param {Number} offset
     * @param {ArrayBuffer} data
     */
    update(offset, data) {
      if (this._glID === -1) {
        console.error('The buffer is destroyed');
        return;
      }
  
      if (data && data.byteLength + offset > this._bytes) {
        console.error('Failed to update data, bytes exceed.');
        return;
      }
  
      let gl = this._device._gl;
      let glUsage = this._usage;
  
      gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);
      if (!data) {
        gl.bufferData(gl.ARRAY_BUFFER, this._bytes, glUsage);
      } else {
        if (offset) {
          gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  
    get count () {
      return this._numVertices;
    }
  }
  
  let _genID = 0;
  
  function _parseError(out, type, errorLog) {
    errorLog.split('\n').forEach(msg => {
      if (msg.length < 5) {
        return;
      }
  
      let parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(msg);
      if (parts) {
        out.push({
          type: type,
          fileID: parts[1] | 0,
          line: parts[2] | 0,
          message: parts[3].trim()
        });
      } else if (msg.length > 0) {
        out.push({
          type: type,
          fileID: -1,
          line: 0,
          message: msg
        });
      }
    });
  }
  
  class Program {
    /**
     * @param {ef.GraphicsDevice} device - graphic device
     * @param {object} options - shader definition
     * @param {string} options.vert - vertex shader source code
     * @param {string} options.frag - fragment shader shader source code
     * @example
     * let prog = new Program(device, {
     *   vert: `
     *     attribute vec3 a_position;
     *     void main() {
     *       gl_Position = vec4( a_position, 1.0 );
     *     }
     *   `,
     *   frag: `
     *     precision mediump float;
     *     void main() {
     *       gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
     *     }
     *   `
     * });
     */
    constructor(device, options) {
      this._device = device;
  
      // stores gl information: { location, type }
      this._attributes = [];
      this._uniforms = [];
      this._samplers = [];
      this._errors = [];
      this._linked = false;
      this._vertSource = options.vert;
      this._fragSource = options.frag;
      this._glID = null;
      this._id = _genID++;
    }
  
    get id() {
      return this._id;
    }
  
    link() {
      if (this._linked) {
        return;
      }
  
      let gl = this._device._gl;
  
      let vertShader = _createShader(gl, gl.VERTEX_SHADER, this._vertSource);
      let fragShader = _createShader(gl, gl.FRAGMENT_SHADER, this._fragSource);
  
      let program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
  
      let failed = false;
      let errors = this._errors;
  
      if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        _parseError(errors, 'vs', gl.getShaderInfoLog(vertShader));
        failed = true;
      }
  
      if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        _parseError(errors, 'fs', gl.getShaderInfoLog(fragShader));
        failed = true;
      }
  
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
  
      if (failed) {
        errors.forEach(err => {
          console.error(`Failed to compile ${err.type} ${err.fileID} (ln ${err.line}): ${err.message}`);
        });
        return;
      }
  
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Failed to link shader program: ${gl.getProgramInfoLog(program)}`);
        failed = true;
      }
  
      if (failed) {
        return;
      }
  
      this._glID = program;
  
      // parse attribute
      let numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (let i = 0; i < numAttributes; ++i) {
        let info = gl.getActiveAttrib(program, i);
        let location = gl.getAttribLocation(program, info.name);
  
        this._attributes.push({
          name: info.name,
          location: location,
          type: info.type,
        });
      }
  
      // parse uniform
      let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < numUniforms; ++i) {
        let info = gl.getActiveUniform(program, i);
        let name = info.name;
        let location = gl.getUniformLocation(program, name);
        let isArray = name.substr(name.length - 3) === '[0]';
        if (isArray) {
          name = name.substr(0, name.length - 3);
        }
  
        this._uniforms.push({
          name: name,
          location: location,
          type: info.type,
          size: isArray ? info.size : undefined, // used when uniform is an array
        });
      }
  
      this._linked = true;
    }
  
    destroy() {
      let gl = this._device._gl;
      gl.deleteProgram(this._glID);
  
      this._linked = false;
      this._glID = null;
      this._attributes = [];
      this._uniforms = [];
      this._samplers = [];
    }
  }
  
  // ====================
  // internal
  // ====================
  
  function _createShader(gl, type, src) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
  
    return shader;
  }
  
  class Texture {
    /**
     * @constructor
     */
    constructor(device) {
      this._device = device;
  
      this._width = 4;
      this._height = 4;
      this._hasMipmap = false;
      this._compressed = false;
  
      this._anisotropy = 1;
      this._minFilter = enums$1.FILTER_LINEAR;
      this._magFilter = enums$1.FILTER_LINEAR;
      this._mipFilter = enums$1.FILTER_LINEAR;
      this._wrapS = enums$1.WRAP_REPEAT;
      this._wrapT = enums$1.WRAP_REPEAT;
      // wrapR available in webgl2
      // this._wrapR = enums.WRAP_REPEAT;
      this._format = enums$1.TEXTURE_FMT_RGBA8;
  
      this._target = -1;
    }
  
    /**
     * @method destroy
     */
    destroy() {
      if (this._glID === -1) {
        console.error('The texture already destroyed');
        return;
      }
  
      let gl = this._device._gl;
      gl.deleteTexture(this._glID);
  
      this._device._stats.tex -= this.bytes;
      this._glID = -1;
    }
  }
  
  function isPow2$1(v) {
    return !(v & (v - 1)) && (!!v);
  }
  
  class Texture2D$1 extends Texture {
    /**
     * @constructor
     * @param {Device} device
     * @param {Object} options
     * @param {Array} options.images
     * @param {Boolean} options.mipmap
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {TEXTURE_FMT_*} options.format
     * @param {Number} options.anisotropy
     * @param {FILTER_*} options.minFilter
     * @param {FILTER_*} options.magFilter
     * @param {FILTER_*} options.mipFilter
     * @param {WRAP_*} options.wrapS
     * @param {WRAP_*} options.wrapT
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    constructor(device, options) {
      super(device);
  
      let gl = this._device._gl;
      this._target = gl.TEXTURE_2D;
      this._glID = gl.createTexture();
  
      // always alloc texture in GPU when we create it.
      options.images = options.images || [null];
      this.update(options);
    }
  
    /**
     * @method update
     * @param {Object} options
     * @param {Array} options.images
     * @param {Boolean} options.mipmap
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {TEXTURE_FMT_*} options.format
     * @param {Number} options.anisotropy
     * @param {FILTER_*} options.minFilter
     * @param {FILTER_*} options.magFilter
     * @param {FILTER_*} options.mipFilter
     * @param {WRAP_*} options.wrapS
     * @param {WRAP_*} options.wrapT
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    update(options) {
      let gl = this._device._gl;
      let genMipmap = this._hasMipmap;
  
      if (options) {
        if (options.width !== undefined) {
          this._width = options.width;
        }
        if (options.height !== undefined) {
          this._height = options.height;
        }
        if (options.anisotropy !== undefined) {
          this._anisotropy = options.anisotropy;
        }
        if (options.minFilter !== undefined) {
          this._minFilter = options.minFilter;
        }
        if (options.magFilter !== undefined) {
          this._magFilter = options.magFilter;
        }
        if (options.mipFilter !== undefined) {
          this._mipFilter = options.mipFilter;
        }
        if (options.wrapS !== undefined) {
          this._wrapS = options.wrapS;
        }
        if (options.wrapT !== undefined) {
          this._wrapT = options.wrapT;
        }
        if (options.format !== undefined) {
          this._format = options.format;
          this._compressed = (
            this._format >= enums$1.TEXTURE_FMT_RGB_DXT1 &&
            this._format <= enums$1.TEXTURE_FMT_RGBA_PVRTC_4BPPV1
          );
        }
  
        // check if generate mipmap
        if (options.mipmap !== undefined) {
          this._hasMipmap = options.mipmap;
          genMipmap = options.mipmap;
        }
  
        if (options.images !== undefined) {
          if (options.images.length > 1) {
            genMipmap = false;
            let maxLength = options.width > options.height ? options.width : options.height;
            if (maxLength >> (options.images.length - 1) !== 1) {
              console.error('texture-2d mipmap is invalid, should have a 1x1 mipmap.');
            }
          }
        }
      }
  
      // NOTE: get pot after this._width, this._height has been assigned.
      let pot = isPow2$1(this._width) && isPow2$1(this._height);
      if (!pot) {
        genMipmap = false;
      }
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this._glID);
      if (options.images !== undefined) {
        this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
      }
  
      this._setTexInfo();
  
      if (genMipmap) {
        gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      this._device._restoreTexture(0);
    }
  
    /**
     * @method updateSubImage
     * @param {Object} options
     * @param {Number} options.x
     * @param {Number} options.y
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {Number} options.level
     * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    updateSubImage(options) {
      let gl = this._device._gl;
      let glFmt = glTextureFmt(this._format);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this._glID);
      this._setSubImage(glFmt, options);
      this._device._restoreTexture(0);
    }
  
    /**
     * @method updateImage
     * @param {Object} options
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {Number} options.level
     * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    updateImage(options) {
      let gl = this._device._gl;
      let glFmt = glTextureFmt(this._format);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this._glID);
      this._setImage(glFmt, options);
      this._device._restoreTexture(0);
    }
  
    _setSubImage(glFmt, options) {
      let gl = this._device._gl;
      let flipY = options.flipY;
      let premultiplyAlpha = options.premultiplyAlpha;
      let img = options.image;
  
      if (
        img instanceof HTMLCanvasElement ||
        img instanceof HTMLImageElement ||
        img instanceof HTMLVideoElement
      ) {
        if (flipY === undefined) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        } else {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
  
        if (premultiplyAlpha === undefined) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
  
        gl.texSubImage2D(gl.TEXTURE_2D, options.level, options.x, options.y, glFmt.format, glFmt.pixelType, img);
      } else {
        if (flipY === undefined) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
  
        if (premultiplyAlpha === undefined) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
  
        if (this._compressed) {
          gl.compressedTexSubImage2D(gl.TEXTURE_2D,
            options.level,
            options.x,
            options.y,
            options.width,
            options.height,
            glFmt.format,
            img
          );
        } else {
          gl.texSubImage2D(
            gl.TEXTURE_2D,
            options.level,
            options.x,
            options.y,
            options.width,
            options.height,
            glFmt.format,
            glFmt.pixelType,
            img
          );
        }
      }
    }
  
    _setImage(glFmt, options) {
      let gl = this._device._gl;
      let flipY = options.flipY;
      let premultiplyAlpha = options.premultiplyAlpha;
      let img = options.image;
  
      if (
        img instanceof HTMLCanvasElement ||
        img instanceof HTMLImageElement ||
        img instanceof HTMLVideoElement
      ) {
        if (flipY === undefined) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        } else {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
  
        if (premultiplyAlpha === undefined) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
  
        gl.texImage2D(
          gl.TEXTURE_2D,
          options.level,
          glFmt.internalFormat,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      } else {
        if (flipY === undefined) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
  
        if (premultiplyAlpha === undefined) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
  
        if (this._compressed) {
          gl.compressedTexImage2D(
            gl.TEXTURE_2D,
            options.level,
            glFmt.internalFormat,
            options.width,
            options.height,
            0,
            img
          );
        } else {
          gl.texImage2D(
            gl.TEXTURE_2D,
            options.level,
            glFmt.internalFormat,
            options.width,
            options.height,
            0,
            glFmt.format,
            glFmt.pixelType,
            img
          );
        }
      }
    }
  
    _setMipmap(images, flipY, premultiplyAlpha) {
      let glFmt = glTextureFmt(this._format);
      let options = {
        width: this._width,
        height: this._height,
        flipY: flipY,
        premultiplyAlpha: premultiplyAlpha,
        level: 0,
        image: null
      };
  
      for (let i = 0; i < images.length; ++i) {
        options.level = i;
        options.width = this._width >> i;
        options.height = this._height >> i;
        options.image = images[i];
        this._setImage(glFmt, options);
      }
    }
  
    _setTexInfo() {
      let gl = this._device._gl;
      let pot = isPow2$1(this._width) && isPow2$1(this._height);
  
      // WebGL1 doesn't support all wrap modes with NPOT textures
      if (!pot && (this._wrapS !== enums$1.WRAP_CLAMP || this._wrapT !== enums$1.WRAP_CLAMP)) {
        console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
        this._wrapS = enums$1.WRAP_CLAMP;
        this._wrapT = enums$1.WRAP_CLAMP;
      }
  
      let mipFilter = this._hasMipmap ? this._mipFilter : -1;
      if (!pot && mipFilter !== -1) {
        console.warn('NPOT textures do not support mipmap filter');
        mipFilter = -1;
      }
  
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);
  
      let ext = this._device.ext('EXT_texture_filter_anisotropic');
      if (ext) {
        gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
      }
    }
  }
  
  class TextureCube extends Texture {
    /**
     * @constructor
     * @param {Device} device
     * @param {Object} options
     * @param {Array} options.images
     * @param {Boolean} options.mipmap
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {TEXTURE_FMT_*} options.format
     * @param {Number} options.anisotropy
     * @param {FILTER_*} options.minFilter
     * @param {FILTER_*} options.magFilter
     * @param {FILTER_*} options.mipFilter
     * @param {WRAP_*} options.wrapS
     * @param {WRAP_*} options.wrapT
     * @param {WRAP_*} options.wrapR
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    constructor(device, options) {
      super(device);
      let gl = this._device._gl;
      this._target = gl.TEXTURE_CUBE_MAP;
      this._glID = gl.createTexture();
      this.update(options);
    }
  
    /**
     * @method update
     * @param {Object} options
     * @param {Array} options.images
     * @param {Boolean} options.mipmap
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {TEXTURE_FMT_*} options.format
     * @param {Number} options.anisotropy
     * @param {FILTER_*} options.minFilter
     * @param {FILTER_*} options.magFilter
     * @param {FILTER_*} options.mipFilter
     * @param {WRAP_*} options.wrapS
     * @param {WRAP_*} options.wrapT
     * @param {WRAP_*} options.wrapR
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    update(options) {
      let gl = this._device._gl;
      let genMipmap = this._hasMipmap;
  
      if (options) {
        if (options.width !== undefined) {
          this._width = options.width;
        }
        if (options.height !== undefined) {
          this._height = options.height;
        }
        if (options.anisotropy !== undefined) {
          this._anisotropy = options.anisotropy;
        }
        if (options.minFilter !== undefined) {
          this._minFilter = options.minFilter;
        }
        if (options.magFilter !== undefined) {
          this._magFilter = options.magFilter;
        }
        if (options.mipFilter !== undefined) {
          this._mipFilter = options.mipFilter;
        }
        if (options.wrapS !== undefined) {
          this._wrapS = options.wrapS;
        }
        if (options.wrapT !== undefined) {
          this._wrapT = options.wrapT;
        }
        // wrapR available in webgl2
        // if (options.wrapR !== undefined) {
        //   this._wrapR = options.wrapR;
        // }
        if (options.format !== undefined) {
          this._format = options.format;
          this._compressed = (
            this._format >= enums$1.TEXTURE_FMT_RGB_DXT1 &&
            this._format <= enums$1.TEXTURE_FMT_RGBA_PVRTC_4BPPV1
          );
        }
  
        // check if generate mipmap
        if (options.mipmap !== undefined) {
          this._hasMipmap = options.mipmap;
          genMipmap = options.mipmap;
        }
  
        if (options.images !== undefined) {
          if (options.images.length > 1) {
            genMipmap = false;
            if (options.width !== options.height) {
              console.warn('texture-cube width and height should be identical.');
            }
            if (options.width >> (options.images.length - 1) !== 1) {
              console.error('texture-cube mipmap is invalid. please set mipmap as 1x1, 2x2, 4x4 ... nxn');
            }
          }
        }
      }
  
      // NOTE: get pot after this._width, this._height has been assigned.
      let pot = isPow2$1(this._width) && isPow2$1(this._height);
      if (!pot) {
        genMipmap = false;
      }
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
      if (options.images !== undefined) {
        this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
      }
  
      this._setTexInfo();
  
      if (genMipmap) {
        gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      }
      this._device._restoreTexture(0);
    }
  
    /**
     * @method updateSubImage
     * @param {Object} options
     * @param {Number} options.x
     * @param {Number} options.y
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {Number} options.level
     * @param {Number} options.faceIndex
     * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    updateSubImage(options) {
      let gl = this._device._gl;
      let glFmt = glTextureFmt(this._format);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
      this._setSubImage(glFmt, options);
  
      this._device._restoreTexture(0);
    }
  
    /**
     * @method updateImage
     * @param {Object} options
     * @param {Number} options.width
     * @param {Number} options.height
     * @param {Number} options.level
     * @param {Number} options.faceIndex
     * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
     * @param {Boolean} options.flipY
     * @param {Boolean} options.premultiplyAlpha
     */
    updateImage(options) {
      let gl = this._device._gl;
      let glFmt = glTextureFmt(this._format);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
      this._setImage(glFmt, options);
      this._device._restoreTexture(0);
    }
  
    _setSubImage(glFmt, options) {
      let gl = this._device._gl;
      let flipY = options.flipY;
      let premultiplyAlpha = options.premultiplyAlpha;
      let faceIndex = options.faceIndex;
      let img = options.image;
  
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }
  
      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }
  
      if (
        img instanceof HTMLCanvasElement ||
        img instanceof HTMLImageElement ||
        img instanceof HTMLVideoElement
      ) {
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, options.level, options.x, options.y, glFmt.format, glFmt.pixelType, img);
      } else {
        if (this._compressed) {
          gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
            options.level,
            options.x,
            options.y,
            options.width,
            options.height,
            glFmt.format,
            img
          );
        } else {
          gl.texSubImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
            options.level,
            options.x,
            options.y,
            options.width,
            options.height,
            glFmt.format,
            glFmt.pixelType,
            img
          );
        }
      }
    }
  
    _setImage(glFmt, options) {
      let gl = this._device._gl;
      let flipY = options.flipY;
      let premultiplyAlpha = options.premultiplyAlpha;
      let faceIndex = options.faceIndex;
      let img = options.image;
  
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }
  
      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }
      if (
        img instanceof HTMLCanvasElement ||
        img instanceof HTMLImageElement ||
        img instanceof HTMLVideoElement
      ) {
        gl.texImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
          options.level,
          glFmt.internalFormat,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      } else {
        if (this._compressed) {
          gl.compressedTexImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
            options.level,
            glFmt.internalFormat,
            options.width,
            options.height,
            0,
            img
          );
        } else {
          gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
            options.level,
            glFmt.internalFormat,
            options.width,
            options.height,
            0,
            glFmt.format,
            glFmt.pixelType,
            img
          );
        }
      }
    }
  
    // levelImages = [imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegz]
    // images = [levelImages0, levelImages1, ...]
    _setMipmap(images, flipY, premultiplyAlpha) {
      let glFmt = glTextureFmt(this._format);
      let options = {
        width: this._width,
        height: this._height,
        faceIndex: 0,
        flipY: flipY,
        premultiplyAlpha: premultiplyAlpha,
        level: 0,
        image: null
      };
  
      for (let i = 0; i < images.length; ++i) {
        let levelImages = images[i];
        options.level = i;
        options.width = this._width >> i;
        options.height = this._height >> i;
  
        for (let face = 0; face < 6; ++face) {
          options.faceIndex = face;
          options.image = levelImages[face];
          this._setImage(glFmt, options);
        }
      }
    }
  
    _setTexInfo() {
      let gl = this._device._gl;
      let pot = isPow2$1(this._width) && isPow2$1(this._height);
  
      // WebGL1 doesn't support all wrap modes with NPOT textures
      if (!pot && (this._wrapS !== enums$1.WRAP_CLAMP || this._wrapT !== enums$1.WRAP_CLAMP)) {
        console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
        this._wrapS = enums$1.WRAP_CLAMP;
        this._wrapT = enums$1.WRAP_CLAMP;
      }
  
      let mipFilter = this._hasMipmap ? this._mipFilter : -1;
      if (!pot && mipFilter !== -1) {
        console.warn('NPOT textures do not support mipmap filter');
        mipFilter = -1;
      }
  
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this._wrapS);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this._wrapT);
      // wrapR available in webgl2
      // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, this._wrapR);
  
      let ext = this._device.ext('EXT_texture_filter_anisotropic');
      if (ext) {
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
      }
    }
  }
  
  class RenderBuffer {
    /**
     * @constructor
     * @param {Device} device
     * @param {RB_FMT_*} format
     * @param {Number} width
     * @param {Number} height
     */
    constructor(device, format, width, height) {
      this._device = device;
      this._format = format;
      this._width = width;
      this._height = height;
  
      const gl = device._gl;
      this._glID = gl.createRenderbuffer();
  
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._glID);
      gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
  
    /**
     * @method destroy
     */
    destroy() {
      if (this._glID === null) {
        console.error('The render-buffer already destroyed');
        return;
      }
  
      const gl = this._device._gl;
  
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.deleteRenderbuffer(this._glID);
  
      this._glID = null;
    }
  }
  
  class FrameBuffer {
    /**
     * @constructor
     * @param {Device} device
     * @param {Number} width
     * @param {Number} height
     * @param {Object} options
     * @param {Array} options.colors
     * @param {RenderBuffer|Texture2D|TextureCube} options.depth
     * @param {RenderBuffer|Texture2D|TextureCube} options.stencil
     * @param {RenderBuffer|Texture2D|TextureCube} options.depthStencil
     */
    constructor(device, width, height, options) {
      this._device = device;
      this._width = width;
      this._height = height;
  
      this._colors = options.colors || [];
      this._depth = options.depth || null;
      this._stencil = options.stencil || null;
      this._depthStencil = options.depthStencil || null;
  
      this._glID = device._gl.createFramebuffer();
    }
  
    /**
     * @method destroy
     */
    destroy() {
      if (this._glID === null) {
        console.error('The frame-buffer already destroyed');
        return;
      }
  
      const gl = this._device._gl;
  
      gl.deleteFramebuffer(this._glID);
  
      this._glID = null;
    }
  }
  
  const _default = {
    // blend
    blend: false,
    blendSep: false,
    blendColor: 0xffffffff,
    blendEq: enums$1.BLEND_FUNC_ADD,
    blendAlphaEq: enums$1.BLEND_FUNC_ADD,
    blendSrc: enums$1.BLEND_ONE,
    blendDst: enums$1.BLEND_ZERO,
    blendSrcAlpha: enums$1.BLEND_ONE,
    blendDstAlpha: enums$1.BLEND_ZERO,
  
    // depth
    depthTest: false,
    depthWrite: false,
    depthFunc: enums$1.DS_FUNC_LESS,
  
    // stencil
    stencilTest: false,
    stencilSep: false,
    stencilFuncFront: enums$1.DS_FUNC_ALWAYS,
    stencilRefFront: 0,
    stencilMaskFront: 0xff,
    stencilFailOpFront: enums$1.STENCIL_OP_KEEP,
    stencilZFailOpFront: enums$1.STENCIL_OP_KEEP,
    stencilZPassOpFront: enums$1.STENCIL_OP_KEEP,
    stencilWriteMaskFront: 0xff,
    stencilFuncBack: enums$1.DS_FUNC_ALWAYS,
    stencilRefBack: 0,
    stencilMaskBack: 0xff,
    stencilFailOpBack: enums$1.STENCIL_OP_KEEP,
    stencilZFailOpBack: enums$1.STENCIL_OP_KEEP,
    stencilZPassOpBack: enums$1.STENCIL_OP_KEEP,
    stencilWriteMaskBack: 0xff,
  
    // cull-mode
    cullMode: enums$1.CULL_BACK,
  
    // primitive-type
    primitiveType: enums$1.PT_TRIANGLES,
  
    // bindings
    maxStream: -1,
    vertexBuffers: [],
    vertexBufferOffsets: [],
    indexBuffer: null,
    textureUnits: [],
    program: null,
  };
  
  class State {
    constructor() {
      // bindings
      this.vertexBuffers = [];
      this.vertexBufferOffsets = [];
      this.textureUnits = [];
  
      this.set(_default);
    }
  
    reset () {
      this.set(_default);
    }
  
    set (cpy) {
      // blending
      this.blend = cpy.blend;
      this.blendSep = cpy.blendSep;
      this.blendColor = cpy.blendColor;
      this.blendEq = cpy.blendEq;
      this.blendAlphaEq = cpy.blendAlphaEq;
      this.blendSrc = cpy.blendSrc;
      this.blendDst = cpy.blendDst;
      this.blendSrcAlpha = cpy.blendSrcAlpha;
      this.blendDstAlpha = cpy.blendDstAlpha;
  
      // depth
      this.depthTest = cpy.depthTest;
      this.depthWrite = cpy.depthWrite;
      this.depthFunc = cpy.depthFunc;
  
      // stencil
      this.stencilTest = cpy.stencilTest;
      this.stencilSep = cpy.stencilSep;
      this.stencilFuncFront = cpy.stencilFuncFront;
      this.stencilRefFront = cpy.stencilRefFront;
      this.stencilMaskFront = cpy.stencilMaskFront;
      this.stencilFailOpFront = cpy.stencilFailOpFront;
      this.stencilZFailOpFront = cpy.stencilZFailOpFront;
      this.stencilZPassOpFront = cpy.stencilZPassOpFront;
      this.stencilWriteMaskFront = cpy.stencilWriteMaskFront;
      this.stencilFuncBack = cpy.stencilFuncBack;
      this.stencilRefBack = cpy.stencilRefBack;
      this.stencilMaskBack = cpy.stencilMaskBack;
      this.stencilFailOpBack = cpy.stencilFailOpBack;
      this.stencilZFailOpBack = cpy.stencilZFailOpBack;
      this.stencilZPassOpBack = cpy.stencilZPassOpBack;
      this.stencilWriteMaskBack = cpy.stencilWriteMaskBack;
  
      // cull-mode
      this.cullMode = cpy.cullMode;
  
      // primitive-type
      this.primitiveType = cpy.primitiveType;
  
      // bindings
      this.maxStream = cpy.maxStream;
      for (let i = 0; i < cpy.vertexBuffers.length; ++i) {
        this.vertexBuffers[i] = cpy.vertexBuffers[i];
      }
      for (let i = 0; i < cpy.vertexBufferOffsets.length; ++i) {
        this.vertexBufferOffsets[i] = cpy.vertexBufferOffsets[i];
      }
      this.indexBuffer = cpy.indexBuffer;
      for (let i = 0; i < cpy.textureUnits.length; ++i) {
        this.textureUnits[i] = cpy.textureUnits[i];
      }
      this.program = cpy.program;
    }
  }
  
  const GL_INT = 5124;
  const GL_FLOAT$1 = 5126;
  const GL_FLOAT_VEC2 = 35664;
  const GL_FLOAT_VEC3 = 35665;
  const GL_FLOAT_VEC4 = 35666;
  const GL_INT_VEC2 = 35667;
  const GL_INT_VEC3 = 35668;
  const GL_INT_VEC4 = 35669;
  const GL_BOOL = 35670;
  const GL_BOOL_VEC2 = 35671;
  const GL_BOOL_VEC3 = 35672;
  const GL_BOOL_VEC4 = 35673;
  const GL_FLOAT_MAT2 = 35674;
  const GL_FLOAT_MAT3 = 35675;
  const GL_FLOAT_MAT4 = 35676;
  const GL_SAMPLER_2D = 35678;
  const GL_SAMPLER_CUBE = 35680;
  
  /**
   * _type2uniformCommit
   */
  let _type2uniformCommit = {
    [GL_INT]: function (gl, id, value) {
      gl.uniform1i(id, value);
    },
  
    [GL_FLOAT$1]: function (gl, id, value) {
      gl.uniform1f(id, value);
    },
  
    [GL_FLOAT_VEC2]: function (gl, id, value) {
      gl.uniform2fv(id, value);
    },
  
    [GL_FLOAT_VEC3]: function (gl, id, value) {
      gl.uniform3fv(id, value);
    },
  
    [GL_FLOAT_VEC4]: function (gl, id, value) {
      gl.uniform4fv(id, value);
    },
  
    [GL_INT_VEC2]: function (gl, id, value) {
      gl.uniform2iv(id, value);
    },
  
    [GL_INT_VEC3]: function (gl, id, value) {
      gl.uniform3iv(id, value);
    },
  
    [GL_INT_VEC4]: function (gl, id, value) {
      gl.uniform4iv(id, value);
    },
  
    [GL_BOOL]: function (gl, id, value) {
      gl.uniform1i(id, value);
    },
  
    [GL_BOOL_VEC2]: function (gl, id, value) {
      gl.uniform2iv(id, value);
    },
  
    [GL_BOOL_VEC3]: function (gl, id, value) {
      gl.uniform3iv(id, value);
    },
  
    [GL_BOOL_VEC4]: function (gl, id, value) {
      gl.uniform4iv(id, value);
    },
  
    [GL_FLOAT_MAT2]: function (gl, id, value) {
      gl.uniformMatrix2fv(id, false, value);
    },
  
    [GL_FLOAT_MAT3]: function (gl, id, value) {
      gl.uniformMatrix3fv(id, false, value);
    },
  
    [GL_FLOAT_MAT4]: function (gl, id, value) {
      gl.uniformMatrix4fv(id, false, value);
    },
  
    [GL_SAMPLER_2D]: function (gl, id, value) {
      gl.uniform1i(id, value);
    },
  
    [GL_SAMPLER_CUBE]: function (gl, id, value) {
      gl.uniform1i(id, value);
    },
  };
  
  /**
   * _type2uniformArrayCommit
   */
  let _type2uniformArrayCommit = {
    [GL_INT]: function (gl, id, value) {
      gl.uniform1iv(id, value);
    },
  
    [GL_FLOAT$1]: function (gl, id, value) {
      gl.uniform1fv(id, value);
    },
  
    [GL_FLOAT_VEC2]: function (gl, id, value) {
      gl.uniform2fv(id, value);
    },
  
    [GL_FLOAT_VEC3]: function (gl, id, value) {
      gl.uniform3fv(id, value);
    },
  
    [GL_FLOAT_VEC4]: function (gl, id, value) {
      gl.uniform4fv(id, value);
    },
  
    [GL_INT_VEC2]: function (gl, id, value) {
      gl.uniform2iv(id, value);
    },
  
    [GL_INT_VEC3]: function (gl, id, value) {
      gl.uniform3iv(id, value);
    },
  
    [GL_INT_VEC4]: function (gl, id, value) {
      gl.uniform4iv(id, value);
    },
  
    [GL_BOOL]: function (gl, id, value) {
      gl.uniform1iv(id, value);
    },
  
    [GL_BOOL_VEC2]: function (gl, id, value) {
      gl.uniform2iv(id, value);
    },
  
    [GL_BOOL_VEC3]: function (gl, id, value) {
      gl.uniform3iv(id, value);
    },
  
    [GL_BOOL_VEC4]: function (gl, id, value) {
      gl.uniform4iv(id, value);
    },
  
    [GL_FLOAT_MAT2]: function (gl, id, value) {
      gl.uniformMatrix2fv(id, false, value);
    },
  
    [GL_FLOAT_MAT3]: function (gl, id, value) {
      gl.uniformMatrix3fv(id, false, value);
    },
  
    [GL_FLOAT_MAT4]: function (gl, id, value) {
      gl.uniformMatrix4fv(id, false, value);
    },
  
    [GL_SAMPLER_2D]: function (gl, id, value) {
      gl.uniform1iv(id, value);
    },
  
    [GL_SAMPLER_CUBE]: function (gl, id, value) {
      gl.uniform1iv(id, value);
    },
  };
  
  /**
   * _commitBlendStates
   */
  function _commitBlendStates(gl, cur, next) {
    // enable/disable blend
    if (cur.blend !== next.blend) {
      if (!next.blend) {
        gl.disable(gl.BLEND);
        return;
      }
  
      gl.enable(gl.BLEND);
  
      if (
        next.blendSrc === enums$1.BLEND_CONSTANT_COLOR ||
        next.blendSrc === enums$1.BLEND_ONE_MINUS_CONSTANT_COLOR ||
        next.blendDst === enums$1.BLEND_CONSTANT_COLOR ||
        next.blendDst === enums$1.BLEND_ONE_MINUS_CONSTANT_COLOR
      ) {
        gl.blendColor(
          (next.blendColor >> 24) / 255,
          (next.blendColor >> 16 & 0xff) / 255,
          (next.blendColor >> 8 & 0xff) / 255,
          (next.blendColor & 0xff) / 255
        );
      }
  
      if (next.blendSep) {
        gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
        gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
      } else {
        gl.blendFunc(next.blendSrc, next.blendDst);
        gl.blendEquation(next.blendEq);
      }
  
      return;
    }
  
    // nothing to update
    if (next.blend === false) {
      return;
    }
  
    // blend-color
    if (cur.blendColor !== next.blendColor) {
      gl.blendColor(
        (next.blendColor >> 24) / 255,
        (next.blendColor >> 16 & 0xff) / 255,
        (next.blendColor >> 8 & 0xff) / 255,
        (next.blendColor & 0xff) / 255
      );
    }
  
    // separate diff, reset all
    if (cur.blendSep !== next.blendSep) {
      if (next.blendSep) {
        gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
        gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
      } else {
        gl.blendFunc(next.blendSrc, next.blendDst);
        gl.blendEquation(next.blendEq);
      }
  
      return;
    }
  
    if (next.blendSep) {
      // blend-func-separate
      if (
        cur.blendSrc !== next.blendSrc ||
        cur.blendDst !== next.blendDst ||
        cur.blendSrcAlpha !== next.blendSrcAlpha ||
        cur.blendDstAlpha !== next.blendDstAlpha
      ) {
        gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      }
  
      // blend-equation-separate
      if (
        cur.blendEq !== next.blendEq ||
        cur.blendAlphaEq !== next.blendAlphaEq
      ) {
        gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
      }
    } else {
      // blend-func
      if (
        cur.blendSrc !== next.blendSrc ||
        cur.blendDst !== next.blendDst
      ) {
        gl.blendFunc(next.blendSrc, next.blendDst);
      }
  
      // blend-equation
      if (cur.blendEq !== next.blendEq) {
        gl.blendEquation(next.blendEq);
      }
    }
  }
  
  /**
   * _commitDepthStates
   */
  function _commitDepthStates(gl, cur, next) {
    // enable/disable depth-test
    if (cur.depthTest !== next.depthTest) {
      if (!next.depthTest) {
        gl.disable(gl.DEPTH_TEST);
        return;
      }
  
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(next.depthFunc);
      gl.depthMask(next.depthWrite);
  
      return;
    }
  
    // commit depth-write
    if (cur.depthWrite !== next.depthWrite) {
      gl.depthMask(next.depthWrite);
    }
  
    // check if depth-write enabled
    if (next.depthTest === false) {
      if (next.depthWrite) {
        next.depthTest = true;
        next.depthFunc = enums$1.DS_FUNC_ALWAYS;
  
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(next.depthFunc);
      }
  
      return;
    }
  
    // depth-func
    if (cur.depthFunc !== next.depthFunc) {
      gl.depthFunc(next.depthFunc);
    }
  }
  
  /**
   * _commitStencilStates
   */
  function _commitStencilStates(gl, cur, next) {
    if (next.stencilTest !== cur.stencilTest) {
      if (!next.stencilTest) {
        gl.disable(gl.STENCIL_TEST);
        return;
      }
  
      gl.enable(gl.STENCIL_TEST);
  
      if (next.stencilSep) {
        gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
        gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
        gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
        gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
        gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
        gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
      } else {
        gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
        gl.stencilMask(next.stencilWriteMaskFront);
        gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      }
  
      return;
    }
  
    // fast return
    if (!next.stencilTest) {
      return;
    }
  
    if (cur.stencilSep !== next.stencilSep) {
      if (next.stencilSep) {
        gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
        gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
        gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
        gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
        gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
        gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
      } else {
        gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
        gl.stencilMask(next.stencilWriteMaskFront);
        gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      }
      return;
    }
  
    if (next.stencilSep) {
      // front
      if (
        cur.stencilFuncFront !== next.stencilFuncFront ||
        cur.stencilRefFront !== next.stencilRefFront ||
        cur.stencilMaskFront !== next.stencilMaskFront
      ) {
        gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      }
      if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
        gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      }
      if (
        cur.stencilFailOpFront !== next.stencilFailOpFront ||
        cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
        cur.stencilZPassOpFront !== next.stencilZPassOpFront
      ) {
        gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      }
  
      // back
      if (
        cur.stencilFuncBack !== next.stencilFuncBack ||
        cur.stencilRefBack !== next.stencilRefBack ||
        cur.stencilMaskBack !== next.stencilMaskBack
      ) {
        gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      }
      if (cur.stencilWriteMaskBack !== next.stencilWriteMaskBack) {
        gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      }
      if (
        cur.stencilFailOpBack !== next.stencilFailOpBack ||
        cur.stencilZFailOpBack !== next.stencilZFailOpBack ||
        cur.stencilZPassOpBack !== next.stencilZPassOpBack
      ) {
        gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
      }
    } else {
      if (
        cur.stencilFuncFront !== next.stencilFuncFront ||
        cur.stencilRefFront !== next.stencilRefFront ||
        cur.stencilMaskFront !== next.stencilMaskFront
      ) {
        gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      }
      if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
        gl.stencilMask(next.stencilWriteMaskFront);
      }
      if (
        cur.stencilFailOpFront !== next.stencilFailOpFront ||
        cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
        cur.stencilZPassOpFront !== next.stencilZPassOpFront
      ) {
        gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      }
    }
  
  }
  
  /**
   * _commitCullMode
   */
  function _commitCullMode(gl, cur, next) {
    if (cur.cullMode === next.cullMode) {
      return;
    }
  
    if (next.cullMode === enums$1.CULL_NONE) {
      gl.disable(gl.CULL_FACE);
      return;
    }
  
    gl.enable(gl.CULL_FACE);
    gl.cullFace(next.cullMode);
  }
  
  /**
   * _commitVertexBuffers
   */
  function _commitVertexBuffers(device, gl, cur, next) {
    let attrsDirty = false;
  
    // nothing changed for vertex buffer
    if (next.maxStream === -1) {
      console.warn('VertexBuffer not assigned, please call setVertexBuffer before every draw.');
      return;
    }
  
    if (cur.maxStream !== next.maxStream) {
      attrsDirty = true;
    } else if (cur.program !== next.program) {
      attrsDirty = true;
    } else {
      for (let i = 0; i < next.maxStream + 1; ++i) {
        if (
          cur.vertexBuffers[i] !== next.vertexBuffers[i] ||
          cur.vertexBufferOffsets[i] !== next.vertexBufferOffsets[i]
        ) {
          attrsDirty = true;
          break;
        }
      }
    }
  
    if (attrsDirty) {
      for (let i = 0; i < device._caps.maxVertexAttribs; ++i) {
        device._newAttributes[i] = 0;
      }
  
      for (let i = 0; i < next.maxStream + 1; ++i) {
        let vb = next.vertexBuffers[i];
        let vbOffset = next.vertexBufferOffsets[i];
        if (!vb) {
          continue;
        }
  
        gl.bindBuffer(gl.ARRAY_BUFFER, vb._glID);
  
        for (let j = 0; j < next.program._attributes.length; ++j) {
          let attr = next.program._attributes[j];
  
          let el = vb._format.element(attr.name);
          if (!el) {
            console.warn(`Can not find vertex attribute: ${attr.name}`);
            continue;
          }
  
          if (device._enabledAttributes[attr.location] === 0) {
            gl.enableVertexAttribArray(attr.location);
            device._enabledAttributes[attr.location] = 1;
          }
          device._newAttributes[attr.location] = 1;
  
          gl.vertexAttribPointer(
            attr.location,
            el.num,
            el.type,
            el.normalize,
            el.stride,
            el.offset + vbOffset * el.stride
          );
        }
      }
  
      // disable unused attributes
      for (let i = 0; i < device._caps.maxVertexAttribs; ++i) {
        if (device._enabledAttributes[i] !== device._newAttributes[i]) {
          gl.disableVertexAttribArray(i);
          device._enabledAttributes[i] = 0;
        }
      }
    }
  }
  
  /**
   * _commitTextures
   */
  function _commitTextures(gl, cur, next) {
    for (let i = 0; i < next.textureUnits.length; ++i) {
      if (cur.textureUnits[i] !== next.textureUnits[i]) {
        let texture = next.textureUnits[i];
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(texture._target, texture._glID);
      }
    }
  }
  
  /**
   * _attach
   */
  function _attach(gl, location, attachment, face = 0) {
    if (attachment instanceof Texture2D$1) {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        location,
        gl.TEXTURE_2D,
        attachment._glID,
        0
      );
    } else if (attachment instanceof TextureCube) {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        location,
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
        attachment._glID,
        0
      );
    } else {
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        location,
        gl.RENDERBUFFER,
        attachment._glID
      );
    }
  }
  
  class Device$1 {
    /**
     * @param {HTMLElement} canvasEL
     * @param {object} opts
     */
    constructor(canvasEL, opts) {
      let gl;
  
      // default options
      opts = opts || {};
      if (opts.alpha === undefined) {
        opts.alpha = false;
      }
      if (opts.stencil === undefined) {
        opts.stencil = true;
      }
      if (opts.depth === undefined) {
        opts.depth = true;
      }
      if (opts.antialias === undefined) {
        opts.antialias = false;
      }
      // NOTE: it is said the performance improved in mobile device with this flag off.
      if (opts.preserveDrawingBuffer === undefined) {
        opts.preserveDrawingBuffer = false;
      }
  
      try {
        gl = canvasEL.getContext('webgl', opts);
      } catch (err) {
        console.error(err);
        return;
      }
  
      // statics
      this._gl = gl;
      this._extensions = {};
      this._caps = {}; // capability
      this._stats = {
        texture: 0,
        vb: 0,
        ib: 0,
        drawcalls: 0,
      };
  
      // runtime
      this._current = new State();
      this._next = new State();
      this._uniforms = {}; // name: { value, num, dirty }
      this._vx = this._vy = this._vw = this._vh = 0;
      this._sx = this._sy = this._sw = this._sh = 0;
      this._framebuffer = null;
  
      this._initExtensions([
        'EXT_texture_filter_anisotropic',
        'EXT_shader_texture_lod',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_float_linear',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_compressed_texture_atc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_pvrtc',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
      ]);
      this._initCaps();
      this._initStates();
  
      //
      this._enabledAttributes = new Array(this._caps.maxVertexAttribs);
      this._newAttributes = new Array(this._caps.maxVertexAttribs);
  
      for (let i = 0; i < this._caps.maxVertexAttribs; ++i) {
        this._enabledAttributes[i] = 0;
        this._newAttributes[i] = 0;
      }
    }
  
    _initExtensions(extensions) {
      const gl = this._gl;
  
      for (let i = 0; i < extensions.length; ++i) {
        let name = extensions[i];
  
        try {
          let ext = gl.getExtension(name);
          if (ext) {
            this._extensions[name] = ext;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  
    _initCaps() {
      const gl = this._gl;
      const extDrawBuffers = this.ext('WEBGL_draw_buffers');
  
      this._caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
      this._caps.maxFragUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
      this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      this._caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
  
      this._caps.maxDrawBuffers = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
      this._caps.maxColorAttachments = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
    }
  
    _initStates() {
      const gl = this._gl;
  
      // gl.frontFace(gl.CCW);
      gl.disable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ZERO);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendColor(1,1,1,1);
  
      gl.colorMask(true, true, true, true);
  
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
  
      gl.disable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.depthMask(false);
      gl.disable(gl.POLYGON_OFFSET_FILL);
      gl.depthRange(0,1);
  
      gl.disable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
      gl.stencilMask(0xFF);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  
      // TODO:
      // this.setAlphaToCoverage(false);
      // this.setTransformFeedbackBuffer(null);
      // this.setRaster(true);
      // this.setDepthBias(false);
  
      gl.clearDepth(1);
      gl.clearColor(0, 0, 0, 0);
      gl.clearStencil(0);
  
      gl.disable(gl.SCISSOR_TEST);
    }
  
    _restoreTexture(unit) {
      const gl = this._gl;
  
      let texture = this._current.textureUnits[unit];
      if (texture) {
        gl.bindTexture(texture._target, texture._glID);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    }
  
    _restoreIndexBuffer () {
      const gl = this._gl;
  
      let ib = this._current.indexBuffer;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib ? ib._glID : null);
    }
  
    /**
     * @method ext
     * @param {string} name
     */
    ext(name) {
      return this._extensions[name];
    }
  
    // ===============================
    // Immediate Settings
    // ===============================
  
    /**
     * @method setFrameBuffer
     * @param {FrameBuffer} fb - null means use the backbuffer
     */
    setFrameBuffer(fb) {
      if (this._framebuffer === fb) {
        return;
      }
  
      this._framebuffer = fb;
      const gl = this._gl;
  
      if (fb === null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return;
      }
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb._glID);
  
      let numColors = this._framebuffer._colors.length;
      for (let i = 0; i < numColors; ++i) {
        let colorBuffer = this._framebuffer._colors[i];
        _attach(gl, gl.COLOR_ATTACHMENT0 + i, colorBuffer);
  
        // TODO: what about cubemap face??? should be the target parameter for colorBuffer
      }
      for (let i = numColors; i < this._caps.maxColorAttachments; ++i) {
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0 + i,
          gl.TEXTURE_2D,
          null,
          0
        );
      }
  
      if (this._framebuffer._depth) {
        _attach(gl, gl.DEPTH_ATTACHMENT, this._framebuffer._depth);
      }
  
      if (this._framebuffer._stencil) {
        _attach(gl, gl.STENCIL_ATTACHMENT, fb._stencil);
      }
  
      if (this._framebuffer._depthStencil) {
        _attach(gl, gl.DEPTH_STENCIL_ATTACHMENT, fb._depthStencil);
      }
    }
  
    /**
     * @method setViewport
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    setViewport(x, y, w, h) {
      if (
        this._vx !== x ||
        this._vy !== y ||
        this._vw !== w ||
        this._vh !== h
      ) {
        this._gl.viewport(x, y, w, h);
        this._vx = x;
        this._vy = y;
        this._vw = w;
        this._vh = h;
      }
    }
  
    /**
     * @method setScissor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    setScissor(x, y, w, h) {
      if (
        this._sx !== x ||
        this._sy !== y ||
        this._sw !== w ||
        this._sh !== h
      ) {
        this._gl.scissor(x, y, w, h);
        this._sx = x;
        this._sy = y;
        this._sw = w;
        this._sh = h;
      }
    }
  
    /**
     * @method clear
     * @param {Object} opts
     * @param {Array} opts.color
     * @param {Number} opts.depth
     * @param {Number} opts.stencil
     */
    clear(opts) {
      const gl = this._gl;
      let flags = 0;
  
      if (opts.color !== undefined) {
        flags |= gl.COLOR_BUFFER_BIT;
        gl.clearColor(opts.color[0], opts.color[1], opts.color[2], opts.color[3]);
      }
  
      if (opts.depth !== undefined) {
        flags |= gl.DEPTH_BUFFER_BIT;
        gl.clearDepth(opts.depth);
  
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.ALWAYS);
      }
  
      if (opts.stencil !== undefined) {
        flags |= gl.STENCIL_BUFFER_BIT;
        gl.clearStencil(opts.stencil);
      }
  
      gl.clear(flags);
  
      // restore depth-write
      if (opts.depth !== undefined) {
        if (this._current.depthTest === false) {
          gl.disable(gl.DEPTH_TEST);
        } else {
          if (this._current.depthWrite === false) {
            gl.depthMask(false);
          }
          if (this._current.depthFunc !== enums$1.DS_FUNC_ALWAYS) {
            gl.depthFunc(this._current.depthFunc);
          }
        }
      }
    }
  
    // ===============================
    // Deferred States
    // ===============================
  
    /**
     * @method enableBlend
     */
    enableBlend() {
      this._next.blend = true;
    }
  
    /**
     * @method enableDepthTest
     */
    enableDepthTest() {
      this._next.depthTest = true;
    }
  
    /**
     * @method enableDepthWrite
     */
    enableDepthWrite() {
      this._next.depthWrite = true;
    }
  
    /**
     * @method enableStencilTest
     */
    enableStencilTest() {
      this._next.stencilTest = true;
    }
  
    /**
     * @method setStencilFunc
     * @param {DS_FUNC_*} func
     * @param {Number} ref
     * @param {Number} mask
     */
    setStencilFunc(func, ref, mask) {
      this._next.stencilSep = false;
      this._next.stencilFuncFront = this._next.stencilFuncBack = func;
      this._next.stencilRefFront = this._next.stencilRefBack = ref;
      this._next.stencilMaskFront = this._next.stencilMaskBack = mask;
    }
  
    /**
     * @method setStencilFuncFront
     * @param {DS_FUNC_*} func
     * @param {Number} ref
     * @param {Number} mask
     */
    setStencilFuncFront(func, ref, mask) {
      this._next.stencilSep = true;
      this._next.stencilFuncFront = func;
      this._next.stencilRefFront = ref;
      this._next.stencilMaskFront = mask;
    }
  
    /**
     * @method setStencilFuncBack
     * @param {DS_FUNC_*} func
     * @param {Number} ref
     * @param {Number} mask
     */
    setStencilFuncBack(func, ref, mask) {
      this._next.stencilSep = true;
      this._next.stencilFuncBack = func;
      this._next.stencilRefBack = ref;
      this._next.stencilMaskBack = mask;
    }
  
    /**
     * @method setStencilOp
     * @param {STENCIL_OP_*} failOp
     * @param {STENCIL_OP_*} zFailOp
     * @param {STENCIL_OP_*} zPassOp
     * @param {Number} writeMask
     */
    setStencilOp(failOp, zFailOp, zPassOp, writeMask) {
      this._next.stencilFailOpFront = this._next.stencilFailOpBack = failOp;
      this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = zFailOp;
      this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = zPassOp;
      this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = writeMask;
    }
  
    /**
     * @method setStencilOpFront
     * @param {STENCIL_OP_*} failOp
     * @param {STENCIL_OP_*} zFailOp
     * @param {STENCIL_OP_*} zPassOp
     * @param {Number} writeMask
     */
    setStencilOpFront(failOp, zFailOp, zPassOp, writeMask) {
      this._next.stencilSep = true;
      this._next.stencilFailOpFront = failOp;
      this._next.stencilZFailOpFront = zFailOp;
      this._next.stencilZPassOpFront = zPassOp;
      this._next.stencilWriteMaskFront = writeMask;
    }
  
    /**
     * @method setStencilOpBack
     * @param {STENCIL_OP_*} failOp
     * @param {STENCIL_OP_*} zFailOp
     * @param {STENCIL_OP_*} zPassOp
     * @param {Number} writeMask
     */
    setStencilOpBack(failOp, zFailOp, zPassOp, writeMask) {
      this._next.stencilSep = true;
      this._next.stencilFailOpBack = failOp;
      this._next.stencilZFailOpBack = zFailOp;
      this._next.stencilZPassOpBack = zPassOp;
      this._next.stencilWriteMaskBack = writeMask;
    }
  
    /**
     * @method setDepthFunc
     * @param {DS_FUNC_*} depthFunc
     */
    setDepthFunc(depthFunc) {
      this._next.depthFunc = depthFunc;
    }
  
    /**
     * @method setBlendColor32
     * @param {Number} rgba
     */
    setBlendColor32(rgba) {
      this._next.blendColor = rgba;
    }
  
    /**
     * @method setBlendColor
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @param {Number} a
     */
    setBlendColor(r, g, b, a) {
      this._next.blendColor = ((r * 255) << 24 | (g * 255) << 16 | (b * 255) << 8 | a * 255) >>> 0;
    }
  
    /**
     * @method setBlendFunc
     * @param {BELND_*} src
     * @param {BELND_*} dst
     */
    setBlendFunc(src, dst) {
      this._next.blendSep = false;
      this._next.blendSrc = src;
      this._next.blendDst = dst;
    }
  
    /**
     * @method setBlendFuncSep
     * @param {BELND_*} src
     * @param {BELND_*} dst
     * @param {BELND_*} srcAlpha
     * @param {BELND_*} dstAlpha
     */
    setBlendFuncSep(src, dst, srcAlpha, dstAlpha) {
      this._next.blendSep = true;
      this._next.blendSrc = src;
      this._next.blendDst = dst;
      this._next.blendSrcAlpha = srcAlpha;
      this._next.blendDstAlpha = dstAlpha;
    }
  
    /**
     * @method setBlendEq
     * @param {BELND_FUNC_*} eq
     */
    setBlendEq(eq) {
      this._next.blendSep = false;
      this._next.blendEq = eq;
    }
  
    /**
     * @method setBlendEqSep
     * @param {BELND_FUNC_*} eq
     * @param {BELND_FUNC_*} alphaEq
     */
    setBlendEqSep(eq, alphaEq) {
      this._next.blendSep = true;
      this._next.blendEq = eq;
      this._next.blendAlphaEq = alphaEq;
    }
  
    /**
     * @method setCullMode
     * @param {CULL_*} mode
     */
    setCullMode(mode) {
      this._next.cullMode = mode;
    }
  
    /**
     * @method setVertexBuffer
     * @param {Number} stream
     * @param {VertexBuffer} buffer
     * @param {Number} start - start vertex
     */
    setVertexBuffer(stream, buffer, start = 0) {
      this._next.vertexBuffers[stream] = buffer;
      this._next.vertexBufferOffsets[stream] = start;
      if (this._next.maxStream < stream) {
        this._next.maxStream = stream;
      }
    }
  
    /**
     * @method setIndexBuffer
     * @param {IndexBuffer} buffer
     */
    setIndexBuffer(buffer) {
      this._next.indexBuffer = buffer;
    }
  
    /**
     * @method setProgram
     * @param {Program} program
     */
    setProgram(program) {
      this._next.program = program;
    }
  
    /**
     * @method setTexture
     * @param {String} name
     * @param {Texture} texture
     * @param {Number} slot
     */
    setTexture(name, texture, slot) {
      if (slot >= this._caps.maxTextureUnits) {
        console.warn(`Can not set texture ${name} at stage ${slot}, max texture exceed: ${this._caps.maxTextureUnits}`);
        return;
      }
  
      this._next.textureUnits[slot] = texture;
      this.setUniform(name, slot);
    }
  
    /**
     * @method setTextureArray
     * @param {String} name
     * @param {Array} textures
     * @param {Int32Array} slots
     */
    setTextureArray(name, textures, slots) {
      let len = textures.length;
      if (len >= this._caps.maxTextureUnits) {
        console.warn(`Can not set ${len} textures for ${name}, max texture exceed: ${this._caps.maxTextureUnits}`);
        return;
      }
      for (let i = 0; i < len; ++i) {
        let slot = slots[i];
        this._next.textureUnits[slot] = textures[i];
      }
      this.setUniform(name, slots);
    }
  
    /**
     * @method setUniform
     * @param {String} name
     * @param {*} value
     */
    setUniform(name, value) {
      let uniform = this._uniforms[name];
      if (!uniform) {
        uniform = {
          dirty: true,
          value: value,
        };
      } else {
        uniform.dirty = true;
        uniform.value = value;
      }
      this._uniforms[name] = uniform;
    }
  
    /**
     * @method setPrimitiveType
     * @param {PT_*} type
     */
    setPrimitiveType(type) {
      this._next.primitiveType = type;
    }
  
    /**
     * @method draw
     * @param {Number} base
     * @param {Number} count
     */
    draw(base, count) {
      const gl = this._gl;
      let cur = this._current;
      let next = this._next;
  
      // commit blend
      _commitBlendStates(gl, cur, next);
  
      // commit depth
      _commitDepthStates(gl, cur, next);
  
      // commit stencil
      _commitStencilStates(gl, cur, next);
  
      // commit cull
      _commitCullMode(gl, cur, next);
  
      // commit vertex-buffer
      _commitVertexBuffers(this, gl, cur, next);
  
      // commit index-buffer
      if (cur.indexBuffer !== next.indexBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, next.indexBuffer ? next.indexBuffer._glID : null);
      }
  
      // commit program
      let programDirty = false;
      if (cur.program !== next.program) {
        if (next.program._linked) {
          gl.useProgram(next.program._glID);
        } else {
          console.warn('Failed to use program: has not linked yet.');
        }
        programDirty = true;
      }
  
      // commit texture/sampler
      _commitTextures(gl, cur, next);
  
      // commit uniforms
      for (let i = 0; i < next.program._uniforms.length; ++i) {
        let uniformInfo = next.program._uniforms[i];
        let uniform = this._uniforms[uniformInfo.name];
        if (!uniform) {
          // console.warn(`Can not find uniform ${uniformInfo.name}`);
          continue;
        }
  
        if (!programDirty && !uniform.dirty) {
          continue;
        }
  
        uniform.dirty = false;
  
        // TODO: please consider array uniform: uniformInfo.size > 0
  
        let commitFunc = (uniformInfo.size === undefined) ? _type2uniformCommit[uniformInfo.type] : _type2uniformArrayCommit[uniformInfo.type];
        if (!commitFunc) {
          console.warn(`Can not find commit function for uniform ${uniformInfo.name}`);
          continue;
        }
  
        commitFunc(gl, uniformInfo.location, uniform.value);
      }
  
      // drawPrimitives
      if (next.indexBuffer) {
        gl.drawElements(
          this._next.primitiveType,
          count,
          next.indexBuffer._format,
          base * next.indexBuffer._bytesPerIndex
        );
      } else {
        gl.drawArrays(
          this._next.primitiveType,
          base,
          count
        );
      }
  
      // TODO: autogen mipmap for color buffer
      // if (this._framebuffer && this._framebuffer.colors[0].mipmap) {
      //   gl.bindTexture(this._framebuffer.colors[i]._target, colors[i]._glID);
      //   gl.generateMipmap(this._framebuffer.colors[i]._target);
      // }
  
      // update stats
      this._stats.drawcalls += 1;
  
      // reset states
      cur.set(next);
      next.reset();
    }
  }
  
  let gfx = {
    // classes
    VertexFormat,
    IndexBuffer,
    VertexBuffer,
    Program,
    Texture,
    Texture2D: Texture2D$1,
    TextureCube,
    RenderBuffer,
    FrameBuffer,
    Device: Device$1,
  
    // functions
    attrTypeBytes,
    glFilter,
    glTextureFmt,
  };
  Object.assign(gfx, enums$1);
  
  class InputAssembler$1 {
    constructor(vb, ib, pt = gfx.PT_TRIANGLES) {
      this._vertexBuffer = vb;
      this._indexBuffer = ib;
      this._primitiveType = pt;
      this._start = 0;
      this._count = -1;
  
      // TODO: instancing data
      // this._stream = 0;
    }
  
    getPrimitiveCount () {
      if (this._count !== -1) {
        return this._count;
      }
  
      if (this._indexBuffer) {
        return this._indexBuffer.count;
      }
  
      return this._vertexBuffer.count;
    }
  }
  
  class Pass {
    constructor(name) {
      this._programName = name;
  
      // cullmode
      this._cullMode = gfx.CULL_BACK;
  
      // blending
      this._blend = false;
      this._blendEq = gfx.BLEND_FUNC_ADD;
      this._blendAlphaEq = gfx.BLEND_FUNC_ADD;
      this._blendSrc = gfx.BLEND_ONE;
      this._blendDst = gfx.BLEND_ZERO;
      this._blendSrcAlpha = gfx.BLEND_ONE;
      this._blendDstAlpha = gfx.BLEND_ZERO;
      this._blendColor = 0xffffffff;
  
      // depth
      this._depthTest = false;
      this._depthWrite = false;
      this._depthFunc = gfx.DS_FUNC_LESS,
  
      // stencil
      this._stencilTest = false;
      // front
      this._stencilFuncFront = gfx.DS_FUNC_ALWAYS;
      this._stencilRefFront = 0;
      this._stencilMaskFront = 0xff;
      this._stencilFailOpFront = gfx.STENCIL_OP_KEEP;
      this._stencilZFailOpFront = gfx.STENCIL_OP_KEEP;
      this._stencilZPassOpFront = gfx.STENCIL_OP_KEEP;
      this._stencilWriteMaskFront = 0xff;
      // back
      this._stencilFuncBack = gfx.DS_FUNC_ALWAYS;
      this._stencilRefBack = 0;
      this._stencilMaskBack = 0xff;
      this._stencilFailOpBack = gfx.STENCIL_OP_KEEP;
      this._stencilZFailOpBack = gfx.STENCIL_OP_KEEP;
      this._stencilZPassOpBack = gfx.STENCIL_OP_KEEP;
      this._stencilWriteMaskBack = 0xff;
    }
  
    setCullMode(cullMode) {
      this._cullMode = cullMode;
    }
  
    setBlend(
      blendEq = gfx.BLEND_FUNC_ADD,
      blendSrc = gfx.BLEND_ONE,
      blendDst = gfx.BLEND_ZERO,
      blendAlphaEq = gfx.BLEND_FUNC_ADD,
      blendSrcAlpha = gfx.BLEND_ONE,
      blendDstAlpha = gfx.BLEND_ZERO,
      blendColor = 0xffffffff
    ) {
      this._blend = true;
      this._blendEq = blendEq;
      this._blendSrc = blendSrc;
      this._blendDst = blendDst;
      this._blendAlphaEq = blendAlphaEq;
      this._blendSrcAlpha = blendSrcAlpha;
      this._blendDstAlpha = blendDstAlpha;
      this._blendColor = blendColor;
    }
  
    setDepth(
      depthTest = false,
      depthWrite = false,
      depthFunc = gfx.DS_FUNC_LESS
    ) {
      this._depthTest = depthTest;
      this._depthWrite = depthWrite;
      this._depthFunc = depthFunc;
    }
  
    setStencilFront(
      stencilFunc = gfx.DS_FUNC_ALWAYS,
      stencilRef = 0,
      stencilMask = 0xff,
      stencilFailOp = gfx.STENCIL_OP_KEEP,
      stencilZFailOp = gfx.STENCIL_OP_KEEP,
      stencilZPassOp = gfx.STENCIL_OP_KEEP,
      stencilWriteMask = 0xff
    ) {
      this._stencilTest = true;
      this._stencilFuncFront = stencilFunc;
      this._stencilRefFront = stencilRef;
      this._stencilMaskFront = stencilMask;
      this._stencilFailOpFront = stencilFailOp;
      this._stencilZFailOpFront = stencilZFailOp;
      this._stencilZPassOpFront = stencilZPassOp;
      this._stencilWriteMaskFront = stencilWriteMask;
    }
  
    setStencilBack(
      stencilFunc = gfx.DS_FUNC_ALWAYS,
      stencilRef = 0,
      stencilMask = 0xff,
      stencilFailOp = gfx.STENCIL_OP_KEEP,
      stencilZFailOp = gfx.STENCIL_OP_KEEP,
      stencilZPassOp = gfx.STENCIL_OP_KEEP,
      stencilWriteMask = 0xff
    ) {
      this._stencilTest = true;
      this._stencilFuncBack = stencilFunc;
      this._stencilRefBack = stencilRef;
      this._stencilMaskBack = stencilMask;
      this._stencilFailOpBack = stencilFailOp;
      this._stencilZFailOpBack = stencilZFailOp;
      this._stencilZPassOpBack = stencilZPassOp;
      this._stencilWriteMaskBack = stencilWriteMask;
    }
  }
  
  let _stageOffset = 0;
  let _name2stageID = {};
  
  var config = {
    addStage: function (name) {
      // already added
      if (_name2stageID[name] !== undefined) {
        return;
      }
  
      let stageID = 1 << _stageOffset;
      _name2stageID[name] = stageID;
  
      _stageOffset += 1;
    },
  
    stageID: function (name) {
      let id = _name2stageID[name];
      if (id === undefined) {
        return -1;
      }
      return id;
    },
  
    stageIDs: function (nameList) {
      let key = 0;
      for (let i = 0; i < nameList.length; ++i) {
        let id = _name2stageID[nameList[i]];
        if (id !== undefined) {
          key |= id;
        }
      }
      return key;
    }
  };
  
  let _genID$1 = 0;
  
  class Technique {
    /**
     * @param {Array} stages
     * @param {Array} parameters
     * @param {Array} passes
     * @param {Number} layer
     */
    constructor(stages, parameters, passes, layer = 0) {
      this._id = _genID$1++;
      this._stageIDs = config.stageIDs(stages);
      this._parameters = parameters; // {name, type, size, val}
      this._passes = passes;
      this._layer = layer;
      // TODO: this._version = 'webgl' or 'webgl2' // ????
    }
  
    setStages(stages) {
      this._stageIDs = config.stageIDs(stages);
    }
  
    get passes() {
      return this._passes;
    }
  
    get stageIDs() {
      return this._stageIDs;
    }
  }
  
  class Effect {
    /**
     * @param {Array} techniques
     */
    constructor(techniques, properties = {}, defines = []) {
      this._techniques = techniques;
      this._properties = properties;
      this._defines = defines;
  
      // TODO: check if params is valid for current technique???
    }
  
    clear() {
      this._techniques.length = 0;
      this._properties = null;
      this._defines.length = 0;
    }
  
    getTechnique(stage) {
      let stageID = config.stageID(stage);
      for (let i = 0; i < this._techniques.length; ++i) {
        let tech = this._techniques[i];
        if (tech.stageIDs & stageID) {
          return tech;
        }
      }
  
      return null;
    }
  
    getProperty(name) {
      return this._properties[name];
    }
  
    setProperty(name, value) {
      // TODO: check if params is valid for current technique???
      this._properties[name] = value;
    }
  
    getDefine(name) {
      for (let i = 0; i < this._defines.length; ++i) {
        let def = this._defines[i];
        if ( def.name === name ) {
          return def.value;
        }
      }
  
      console.warn(`Failed to get define ${name}, define not found.`);
      return null;
    }
  
    define(name, value) {
      for (let i = 0; i < this._defines.length; ++i) {
        let def = this._defines[i];
        if ( def.name === name ) {
          def.value = value;
          return;
        }
      }
  
      console.warn(`Failed to set define ${name}, define not found.`);
    }
  
    extractDefines(out = {}) {
      for (let i = 0; i < this._defines.length; ++i) {
        let def = this._defines[i];
        out[def.name] = def.value;
      }
  
      return out;
    }
  }
  
  /**
   * @param {object} json
   */
  
  
  /**
   * @param {gfx.Device} device
   * @param {Object} data
   */
  function createIA(device, data) {
    if (!data.positions) {
      console.error('The data must have positions field');
      return null;
    }
  
    let verts = [];
    let vcount = data.positions.length / 3;
  
    for (let i = 0; i < vcount; ++i) {
      verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);
  
      if (data.normals) {
        verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
      }
  
      if (data.uvs) {
        verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
      }
    }
  
    let vfmt = [];
    vfmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
    if (data.normals) {
      vfmt.push({ name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
    }
    if (data.uvs) {
      vfmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    }
  
    let vb = new gfx.VertexBuffer(
      device,
      new gfx.VertexFormat(vfmt),
      gfx.USAGE_STATIC,
      new Float32Array(verts),
      vcount
    );
  
    let ib = null;
    if (data.indices) {
      ib = new gfx.IndexBuffer(
        device,
        gfx.INDEX_FMT_UINT16,
        gfx.USAGE_STATIC,
        new Uint16Array(data.indices),
        data.indices.length
      );
    }
  
    return new InputAssembler$1(vb, ib);
  }
  
  let _m4_tmp = mat4.create();
  let _genID$2 = 0;
  
  class View$1 {
    constructor() {
      this._id = _genID$2++;
  
      // viewport
      this._rect = {
        x: 0, y: 0, w: 1, h: 1
      };
  
      // TODO:
      // this._scissor = {
      //   x: 0, y: 0, w: 1, h: 1
      // };
  
      // clear options
      this._color = color4.new(0.3, 0.3, 0.3, 1);
      this._depth = 1;
      this._stencil = 1;
      this._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
  
      // matrix
      this._matView = mat4.create();
      this._matProj = mat4.create();
      this._matViewProj = mat4.create();
      this._matInvViewProj = mat4.create();
  
      // stages & framebuffer
      this._stages = [];
      this._cullingMask = 1;
      this._framebuffer = null;
  
      this._shadowLight = null; // TODO: should not refer light in view.
    }
  
    getForward(out) {
      return vec3.set(
        out,
        -this._matView.m02,
        -this._matView.m06,
        -this._matView.m10
      );
    }
  
    getPosition(out) {
      mat4.invert(_m4_tmp, this._matView);
      return mat4.getTranslation(out, _m4_tmp);
    }
  }
  
  const _forward = vec3.new(0, 0, -1);
  
  let _m4_tmp$1 = mat4.create();
  let _m3_tmp = mat3.create();
  let _transformedLightDirection = vec3.create();
  
  // compute light viewProjMat for shadow.
  function _computeSpotLightViewProjMatrix(light, outView, outProj) {
    // view matrix
    light._node.getWorldRT(outView);
    mat4.invert(outView, outView);
  
    // proj matrix
    mat4.perspective(outProj, light._spotAngle * light._spotAngleScale, 1, light._shadowMinDepth, light._shadowMaxDepth);
  }
  
  function _computeDirectionalLightViewProjMatrix(light, outView, outProj) {
    // view matrix
    light._node.getWorldRT(outView);
    mat4.invert(outView, outView);
  
    // TODO: should compute directional light frustum based on rendered meshes in scene.
    // proj matrix
    let halfSize = light._shadowFustumSize / 2;
    mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
  }
  
  function _computePointLightViewProjMatrix(light, outView, outProj) {
    // TODO:
  }
  
  class Light {
    constructor() {
      this._poolID = -1;
      this._node = null;
  
      this._type = enums.LIGHT_DIRECTIONAL;
  
      this._color = color3.new(1, 1, 1);
      this._intensity = 1;
  
      // used for spot and point light
      this._range = 1;
      // used for spot light, default to 60 degrees
      this._spotAngle = toRadian(60);
      this._spotExp = 1;
      // cached for uniform
      this._directionUniform = new Float32Array(3);
      this._positionUniform = new Float32Array(3);
      this._colorUniform = new Float32Array([this._color.r * this._intensity, this._color.g * this._intensity, this._color.b * this._intensity]);
      this._spotUniform = new Float32Array([Math.cos(this._spotAngle * 0.5), this._spotExp]);
  
      // shadow params
      this._shadowType = enums.SHADOW_NONE;
      this._shadowFrameBuffer = null;
      this._shadowMap = null;
      this._shadowMapDirty = false;
      this._shadowDepthBuffer = null;
      this._shadowResolution = 1024;
      this._shadowBias = 0.00005;
      this._shadowDarkness = 1;
      this._shadowMinDepth = 1;
      this._shadowMaxDepth = 1000;
      this._shadowDepthScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.
      this._frustumEdgeFalloff = 0; // used by directional and spot light.
      this._viewProjMatrix = mat4.create();
      this._spotAngleScale = 1; // used for spot light.
      this._shadowFustumSize = 80; // used for directional light.
    }
  
    setNode(node) {
      this._node = node;
    }
  
    setColor(r, g, b) {
      color3.set(this._color, r, g, b);
      this._colorUniform[0] = r * this._intensity;
      this._colorUniform[1] = g * this._intensity;
      this._colorUniform[2] = b * this._intensity;
    }
    get color() {
      return this._color;
    }
  
    setIntensity(val) {
      this._intensity = val;
      this._colorUniform[0] = val * this._color.r;
      this._colorUniform[1] = val * this._color.g;
      this._colorUniform[2] = val * this._color.b;
    }
    get intensity() {
      return this._intensity;
    }
  
    setType(tpe) {
      this._type = tpe;
    }
    get type() {
      return this._type;
    }
  
    setSpotAngle(val) {
      this._spotAngle = val;
      this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
    }
    get spotAngle() {
      return this._spotAngle;
    }
  
    setSpotExp(val) {
      this._spotExp = val;
      this._spotUniform[1] = val;
    }
    get spotExp() {
      return this._spotExp;
    }
  
    setRange(tpe) {
      this._range = tpe;
    }
    get range() {
      return this._range;
    }
  
    setShadowType(type) {
      if (this._shadowType === enums.SHADOW_NONE && type !== enums.SHADOW_NONE) {
        this._shadowMapDirty = true;
      }
      this._shadowType = type;
    }
    get shadowType() {
      return this._shadowType;
    }
  
    get shadowMap() {
      return this._shadowMap;
    }
  
    get viewProjMatrix() {
      return this._viewProjMatrix;
    }
  
    setShadowResolution(val) {
      if (this._shadowResolution !== val) {
        this._shadowMapDirty = true;
      }
      this._shadowResolution = val;
    }
    get shadowResolution() {
      return this._shadowResolution;
    }
  
    setShadowBias(val) {
      this._shadowBias = val;
    }
    get shadowBias() {
      return this._shadowBias;
    }
  
    setShadowDarkness(val) {
      this._shadowDarkness = val;
    }
    get shadowDarkness() {
      return this._shadowDarkness;
    }
  
    setShadowMinDepth(val) {
      this._shadowMinDepth = val;
    }
    get shadowMinDepth() {
      if (this._type === enums.LIGHT_DIRECTIONAL) {
        return 1.0;
      }
      return this._shadowMinDepth;
    }
  
    setShadowMaxDepth(val) {
      this._shadowMaxDepth = val;
    }
    get shadowMaxDepth() {
      if (this._type === enums.LIGHT_DIRECTIONAL) {
        return 1.0;
      }
      return this._shadowMaxDepth;
    }
  
    setShadowDepthScale(val) {
      this._shadowDepthScale = val;
    }
    get shadowDepthScale() {
      return this._shadowDepthScale;
    }
  
    setFrustumEdgeFalloff(val) {
      this._frustumEdgeFalloff = val;
    }
    get frustumEdgeFalloff() {
      return this._frustumEdgeFalloff;
    }
  
    extractView(out, stages) {
      // TODO: view should not handle light.
      out._shadowLight = this;
  
      // rect
      out._rect.x = 0;
      out._rect.y = 0;
      out._rect.w = this._shadowResolution;
      out._rect.h = this._shadowResolution;
  
      // clear opts
      color4.set(out._color, 1, 1, 1, 1);
      out._depth = 1;
      out._stencil = 1;
      out._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
  
      // stages & framebuffer
      out._stages = stages;
      out._framebuffer = this._shadowFrameBuffer;
  
      // view projection matrix
      switch(this._type) {
        case enums.LIGHT_SPOT:
          _computeSpotLightViewProjMatrix(this, out._matView, out._matProj);
          break;
  
        case enums.LIGHT_DIRECTIONAL:
          _computeDirectionalLightViewProjMatrix(this, out._matView, out._matProj);
          break;
  
        case enums.LIGHT_POINT:
          _computePointLightViewProjMatrix(this, out._matView, out._matProj);
          break;
  
        default:
          console.warn('shadow of this light type is not supported');
      }
  
      // view-projection
      mat4.mul(out._matViewProj, out._matProj, out._matView);
      this._viewProjMatrix = out._matViewProj;
      mat4.invert(out._matInvViewProj, out._matViewProj);
    }
  
    _updateLightPositionAndDirection() {
      this._node.getWorldMatrix(_m4_tmp$1);
      mat3.fromMat4(_m3_tmp, _m4_tmp$1);
      vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);
      vec3.array(this._directionUniform, _transformedLightDirection);
      let pos = this._positionUniform;
      pos[0] = _m4_tmp$1.m12;
      pos[1] = _m4_tmp$1.m13;
      pos[2] = _m4_tmp$1.m14;
    }
  
    _generateShadowMap(device) {
      this._shadowMap = new gfx.Texture2D(device, {
        width: this._shadowResolution,
        height: this._shadowResolution,
        format: gfx.TEXTURE_FMT_RGBA8,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
      });
      this._shadowDepthBuffer = new gfx.RenderBuffer(device,
        gfx.RB_FMT_D16,
        this._shadowResolution,
        this._shadowResolution
      );
      this._shadowFrameBuffer = new gfx.FrameBuffer(device, this._shadowResolution, this._shadowResolution, {
        colors: [this._shadowMap],
        depth: this._shadowDepthBuffer,
      });
    }
  
    _destroyShadowMap() {
      if (this._shadowMap) {
        this._shadowMap.destroy();
        this._shadowDepthBuffer.destroy();
        this._shadowFrameBuffer.destroy();
        this._shadowMap = null;
        this._shadowDepthBuffer = null;
        this._shadowFrameBuffer = null;
      }
    }
  
    update(device) {
      this._updateLightPositionAndDirection();
  
      if (this._shadowType === enums.SHADOW_NONE) {
        this._destroyShadowMap();
      } else if (this._shadowMapDirty) {
        this._destroyShadowMap();
        this._generateShadowMap(device);
        this._shadowMapDirty = false;
      }
  
    }
  }
  
  let _matView = mat4.create();
  let _matProj = mat4.create();
  let _matViewProj = mat4.create();
  let _matInvViewProj = mat4.create();
  let _tmp_v3 = vec3.create();
  
  class Camera$1 {
    constructor() {
      this._poolID = -1;
      this._node = null;
  
      //
      this._projection = enums.PROJ_PERSPECTIVE;
  
      // clear options
      this._color = color4.new(0.2, 0.3, 0.47, 1);
      this._depth = 1;
      this._stencil = 1;
      this._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
  
      // culling mask
      this._cullingMask = 1;
  
      // stages & framebuffer
      this._stages = [];
      this._framebuffer = null;
  
      // projection properties
      this._near = 0.01;
      this._far = 1000.0;
      this._fov = Math.PI/4.0; // vertical fov
      // this._aspect = 16.0/9.0; // DISABLE: use _rect.w/_rect.h
      this._rect = {
        x: 0, y: 0, w: 1, h: 1
      };
  
      // ortho properties
      this._orthoHeight = 10;
    }
  
    // culling mask
    get cullingMask() {
      return this._cullingMask;
    }
  
    set cullingMask(mask) {
      this._cullingMask = mask;
    }
  
    // node
    getNode() {
      return this._node;
    }
    setNode(node) {
      this._node = node;
    }
  
    // type
    getType() {
      return this._projection;
    }
    setType(type) {
      this._projection = type;
    }
  
    // orthoHeight
    getOrthoHeight() {
      return this._orthoHeight;
    }
    setOrthoHeight(val) {
      this._orthoHeight = val;
    }
  
    // fov
    getFov() {
      return this._fov;
    }
    setFov(fov) {
      this._fov = fov;
    }
  
    // near
    getNear() {
      return this._near;
    }
    setNear(near) {
      this._near = near;
    }
  
    // far
    getFar() {
      return this._far;
    }
    setFar(far) {
      this._far = far;
    }
  
    // color
    getColor(out) {
      return color4.copy(out, this._color);
    }
    setColor(r, g, b, a) {
      color4.set(this._color, r, g, b, a);
    }
  
    // depth
    getDepth() {
      return this._depth;
    }
    setDepth(depth) {
      this._depth = depth;
    }
  
    // stencil
    getStencil() {
      return this._stencil;
    }
    setStencil(stencil) {
      this._stencil = stencil;
    }
  
    // clearFlags
    getClearFlags() {
      return this._clearFlags;
    }
    setClearFlags(flags) {
      this._clearFlags = flags;
    }
  
    // rect
    getRect(out) {
      out.x = this._rect.x;
      out.y = this._rect.y;
      out.w = this._rect.w;
      out.h = this._rect.h;
  
      return out;
    }
    /**
     * @param {Number} x - [0,1]
     * @param {Number} y - [0,1]
     * @param {Number} w - [0,1]
     * @param {Number} h - [0,1]
     */
    setRect(x, y, w, h) {
      this._rect.x = x;
      this._rect.y = y;
      this._rect.w = w;
      this._rect.h = h;
    }
  
    // stages
    getStages() {
      return this._stages;
    }
    setStages(stages) {
      this._stages = stages;
    }
  
    // framebuffer
    getFramebuffer() {
      return this._framebuffer;
    }
    setFramebuffer(framebuffer) {
      this._framebuffer = framebuffer;
    }
  
    extractView(out, width, height) {
      // rect
      out._rect.x = this._rect.x * width;
      out._rect.y = this._rect.y * height;
      out._rect.w = this._rect.w * width;
      out._rect.h = this._rect.h * height;
  
      // clear opts
      out._color = this._color;
      out._depth = this._depth;
      out._stencil = this._stencil;
      out._clearFlags = this._clearFlags;
  
      // culling mask
      out._cullingMask = this._cullingMask;
  
      // stages & framebuffer
      out._stages = this._stages;
      out._framebuffer = this._framebuffer;
  
      // view matrix
      this._node.getWorldRT(out._matView);
      mat4.invert(out._matView, out._matView);
  
      // projection matrix
      // TODO: if this._projDirty
      let aspect = width / height;
      if (this._projection === enums.PROJ_PERSPECTIVE) {
        mat4.perspective(out._matProj,
          this._fov,
          aspect,
          this._near,
          this._far
        );
      } else {
        let x = this._orthoHeight * aspect;
        let y = this._orthoHeight;
        mat4.ortho(out._matProj,
          -x, x, -y, y, this._near, this._far
        );
      }
  
      // view-projection
      mat4.mul(out._matViewProj, out._matProj, out._matView);
      mat4.invert(out._matInvViewProj, out._matViewProj);
    }
  
    screenToWorld(out, screenPos, width, height) {
      let aspect = width / height;
      let cx = this._rect.x * width;
      let cy = this._rect.y * height;
      let cw = this._rect.w * width;
      let ch = this._rect.h * height;
  
      // view matrix
      this._node.getWorldRT(_matView);
      mat4.invert(_matView, _matView);
  
      // projection matrix
      if (this._projection === enums.PROJ_PERSPECTIVE) {
        mat4.perspective(_matProj,
          this._fov,
          aspect,
          this._near,
          this._far
        );
      } else {
        let x = this._orthoHeight * aspect;
        let y = this._orthoHeight;
        mat4.ortho(_matProj,
          -x, x, -y, y, this._near, this._far
        );
      }
  
      // view-projection
      mat4.mul(_matViewProj, _matProj, _matView);
  
      // inv view-projection
      mat4.invert(_matInvViewProj, _matViewProj);
  
      //
      if (this._projection === enums.PROJ_PERSPECTIVE) {
        // calculate screen pos in far clip plane
        vec3.set(out,
          (screenPos.x - cx) * 2.0 / cw - 1.0,
          (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
          1.0
        );
  
        // transform to world
        vec3.transformMat4(out, out, _matInvViewProj);
  
        //
        this._node.getWorldPos(_tmp_v3);
        vec3.lerp(out, _tmp_v3, out, screenPos.z / this._far);
      } else {
        let range = this._farClip - this._nearClip;
        vec3.set(out,
          (screenPos.x - cx) * 2.0 / cw - 1.0,
          (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
          (this._far - screenPos.z) / range * 2.0 - 1.0
        );
  
        // transform to world
        vec3.transformMat4(out, out, _matInvViewProj);
      }
  
      return out;
    }
  
    worldToScreen(out, worldPos, width, height) {
      let aspect = width / height;
      let cx = this._rect.x * width;
      let cy = this._rect.y * height;
      let cw = this._rect.w * width;
      let ch = this._rect.h * height;
  
      // view matrix
      this._node.getWorldRT(_matView);
      mat4.invert(_matView, _matView);
  
      // projection matrix
      if (this._projection === enums.PROJ_PERSPECTIVE) {
        mat4.perspective(_matProj,
          this._fov,
          aspect,
          this._near,
          this._far
        );
      } else {
        let x = this._orthoHeight * aspect;
        let y = this._orthoHeight;
        mat4.ortho(_matProj,
          -x, x, -y, y, this._near, this._far
        );
      }
  
      // view-projection
      mat4.mul(_matViewProj, _matProj, _matView);
  
      // calculate w
      let w =
        worldPos.x * _matViewProj.m03 +
        worldPos.y * _matViewProj.m07 +
        worldPos.z * _matViewProj.m11 +
        _matViewProj.m15;
  
      vec3.transformMat4(out, worldPos, _matViewProj);
      out.x = cx + (out.x / w + 1) * 0.5 * cw;
      out.y = cy + (out.y / w + 1) * 0.5 * ch;
  
      return out;
    }
  }
  
  class Model$1 {
    constructor() {
      this._poolID = -1;
      this._node = null;
      this._inputAssemblers = [];
      this._effects = [];
      this._defines = [];
      this._dynamicIA = false;
      this._cullingMask = -1;
  
      // TODO: we calculate aabb based on vertices
      // this._aabb
    }
  
    get inputAssemblerCount() {
      return this._inputAssemblers.length;
    }
  
    get dynamicIA() {
      return this._dynamicIA;
    }
  
    get drawItemCount() {
      return this._dynamicIA ? 1 : this._inputAssemblers.length;
    }
  
    get cullingMask() {
      return this._cullingMask;
    }
  
    set cullingMask(mask) {
      this._cullingMask = mask;
    }
  
    setNode(node) {
      this._node = node;
    }
  
    setDynamicIA(enabled) {
      this._dynamicIA = enabled;
    }
  
    addInputAssembler(ia) {
      if (this._inputAssemblers.indexOf(ia) !== -1) {
        return;
      }
      this._inputAssemblers.push(ia);
    }
  
    clearInputAssemblers() {
      this._inputAssemblers.length = 0;
    }
  
    addEffect(effect) {
      if (this._effects.indexOf(effect) !== -1) {
        return;
      }
      this._effects.push(effect);
  
      //
      let defs = Object.create(null);
      effect.extractDefines(defs);
      this._defines.push(defs);
    }
  
    clearEffects() {
      this._effects.length = 0;
      this._defines.length = 0;
    }
  
    extractDrawItem(out, index) {
      if (this._dynamicIA) {
        out.model = this;
        out.node = this._node;
        out.ia = null;
        out.effect = this._effects[0];
        out.defines = out.effect.extractDefines(this._defines[0]);
  
        return;
      }
  
      if (index >= this._inputAssemblers.length ) {
        out.model = null;
        out.node = null;
        out.ia = null;
        out.effect = null;
        out.defines = null;
  
        return;
      }
  
      out.model = this;
      out.node = this._node;
      out.ia = this._inputAssemblers[index];
  
      let effect, defines;
      if (index < this._effects.length) {
        effect = this._effects[index];
        defines = this._defines[index];
      } else {
        effect = this._effects[this._effects.length-1];
        defines = this._defines[this._effects.length-1];
      }
      out.effect = effect;
      out.defines = effect.extractDefines(defines);
    }
  }
  
  // reference: https://github.com/mziccard/node-timsort
  
  /**
   * Default minimum size of a run.
   */
  const DEFAULT_MIN_MERGE = 32;
  
  /**
   * Minimum ordered subsequece required to do galloping.
   */
  const DEFAULT_MIN_GALLOPING = 7;
  
  /**
   * Default tmp storage length. Can increase depending on the size of the
   * smallest run to merge.
   */
  const DEFAULT_TMP_STORAGE_LENGTH = 256;
  
  /**
   * Pre-computed powers of 10 for efficient lexicographic comparison of
   * small integers.
   */
  const POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
  
  /**
   * Estimate the logarithm base 10 of a small integer.
   *
   * @param {number} x - The integer to estimate the logarithm of.
   * @return {number} - The estimated logarithm of the integer.
   */
  function log10$1(x) {
    if (x < 1e5) {
      if (x < 1e2) {
        return x < 1e1 ? 0 : 1;
      }
  
      if (x < 1e4) {
        return x < 1e3 ? 2 : 3;
      }
  
      return 4;
    }
  
    if (x < 1e7) {
      return x < 1e6 ? 5 : 6;
    }
  
    if (x < 1e9) {
      return x < 1e8 ? 7 : 8;
    }
  
    return 9;
  }
  
  /**
   * Default alphabetical comparison of items.
   *
   * @param {string|object|number} a - First element to compare.
   * @param {string|object|number} b - Second element to compare.
   * @return {number} - A positive number if a.toString() > b.toString(), a
   * negative number if .toString() < b.toString(), 0 otherwise.
   */
  function alphabeticalCompare(a, b) {
    if (a === b) {
      return 0;
    }
  
    if (~~a === a && ~~b === b) {
      if (a === 0 || b === 0) {
        return a < b ? -1 : 1;
      }
  
      if (a < 0 || b < 0) {
        if (b >= 0) {
          return -1;
        }
  
        if (a >= 0) {
          return 1;
        }
  
        a = -a;
        b = -b;
      }
  
      const al = log10$1(a);
      const bl = log10$1(b);
  
      let t = 0;
  
      if (al < bl) {
        a *= POWERS_OF_TEN[bl - al - 1];
        b /= 10;
        t = -1;
      } else if (al > bl) {
        b *= POWERS_OF_TEN[al - bl - 1];
        a /= 10;
        t = 1;
      }
  
      if (a === b) {
        return t;
      }
  
      return a < b ? -1 : 1;
    }
  
    let aStr = String(a);
    let bStr = String(b);
  
    if (aStr === bStr) {
      return 0;
    }
  
    return aStr < bStr ? -1 : 1;
  }
  
  /**
   * Compute minimum run length for TimSort
   *
   * @param {number} n - The size of the array to sort.
   */
  function minRunLength(n) {
    let r = 0;
  
    while (n >= DEFAULT_MIN_MERGE) {
      r |= (n & 1);
      n >>= 1;
    }
  
    return n + r;
  }
  
  /**
   * Counts the length of a monotonically ascending or strictly monotonically
   * descending sequence (run) starting at array[lo] in the range [lo, hi). If
   * the run is descending it is made ascending.
   *
   * @param {array} array - The array to reverse.
   * @param {number} lo - First element in the range (inclusive).
   * @param {number} hi - Last element in the range.
   * @param {function} compare - Item comparison function.
   * @return {number} - The length of the run.
   */
  function makeAscendingRun(array, lo, hi, compare) {
    let runHi = lo + 1;
  
    if (runHi === hi) {
      return 1;
    }
  
    // Descending
    if (compare(array[runHi++], array[lo]) < 0) {
      while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
        runHi++;
      }
  
      reverseRun(array, lo, runHi);
      // Ascending
    } else {
      while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
        runHi++;
      }
    }
  
    return runHi - lo;
  }
  
  /**
   * Reverse an array in the range [lo, hi).
   *
   * @param {array} array - The array to reverse.
   * @param {number} lo - First element in the range (inclusive).
   * @param {number} hi - Last element in the range.
   */
  function reverseRun(array, lo, hi) {
    hi--;
  
    while (lo < hi) {
      let t = array[lo];
      array[lo++] = array[hi];
      array[hi--] = t;
    }
  }
  
  /**
   * Perform the binary sort of the array in the range [lo, hi) where start is
   * the first element possibly out of order.
   *
   * @param {array} array - The array to sort.
   * @param {number} lo - First element in the range (inclusive).
   * @param {number} hi - Last element in the range.
   * @param {number} start - First element possibly out of order.
   * @param {function} compare - Item comparison function.
   */
  function binaryInsertionSort(array, lo, hi, start, compare) {
    if (start === lo) {
      start++;
    }
  
    for (; start < hi; start++) {
      let pivot = array[start];
  
      // Ranges of the array where pivot belongs
      let left = lo;
      let right = start;
  
      /*
       *   pivot >= array[i] for i in [lo, left)
       *   pivot <  array[i] for i in  in [right, start)
       */
      while (left < right) {
        let mid = (left + right) >>> 1;
  
        if (compare(pivot, array[mid]) < 0) {
          right = mid;
        } else {
          left = mid + 1;
        }
      }
  
      /*
       * Move elements right to make room for the pivot. If there are elements
       * equal to pivot, left points to the first slot after them: this is also
       * a reason for which TimSort is stable
       */
      let n = start - left;
      // Switch is just an optimization for small arrays
      switch (n) {
        case 3:
          array[left + 3] = array[left + 2];
        /* falls through */
        case 2:
          array[left + 2] = array[left + 1];
        /* falls through */
        case 1:
          array[left + 1] = array[left];
          break;
        default:
          while (n > 0) {
            array[left + n] = array[left + n - 1];
            n--;
          }
      }
  
      array[left] = pivot;
    }
  }
  
  /**
   * Find the position at which to insert a value in a sorted range. If the range
   * contains elements equal to the value the leftmost element index is returned
   * (for stability).
   *
   * @param {number} value - Value to insert.
   * @param {array} array - The array in which to insert value.
   * @param {number} start - First element in the range.
   * @param {number} length - Length of the range.
   * @param {number} hint - The index at which to begin the search.
   * @param {function} compare - Item comparison function.
   * @return {number} - The index where to insert value.
   */
  function gallopLeft(value, array, start, length, hint, compare) {
    let lastOffset = 0;
    let maxOffset = 0;
    let offset = 1;
  
    if (compare(value, array[start + hint]) > 0) {
      maxOffset = length - hint;
  
      while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
  
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
  
      if (offset > maxOffset) {
        offset = maxOffset;
      }
  
      // Make offsets relative to start
      lastOffset += hint;
      offset += hint;
  
      // value <= array[start + hint]
    } else {
      maxOffset = hint + 1;
      while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
  
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
      if (offset > maxOffset) {
        offset = maxOffset;
      }
  
      // Make offsets relative to start
      let tmp = lastOffset;
      lastOffset = hint - offset;
      offset = hint - tmp;
    }
  
    /*
     * Now array[start+lastOffset] < value <= array[start+offset], so value
     * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
     * binary search, with invariant array[start + lastOffset - 1] < value <=
     * array[start + offset].
     */
    lastOffset++;
    while (lastOffset < offset) {
      let m = lastOffset + ((offset - lastOffset) >>> 1);
  
      if (compare(value, array[start + m]) > 0) {
        lastOffset = m + 1;
  
      } else {
        offset = m;
      }
    }
    return offset;
  }
  
  /**
   * Find the position at which to insert a value in a sorted range. If the range
   * contains elements equal to the value the rightmost element index is returned
   * (for stability).
   *
   * @param {number} value - Value to insert.
   * @param {array} array - The array in which to insert value.
   * @param {number} start - First element in the range.
   * @param {number} length - Length of the range.
   * @param {number} hint - The index at which to begin the search.
   * @param {function} compare - Item comparison function.
   * @return {number} - The index where to insert value.
   */
  function gallopRight(value, array, start, length, hint, compare) {
    let lastOffset = 0;
    let maxOffset = 0;
    let offset = 1;
  
    if (compare(value, array[start + hint]) < 0) {
      maxOffset = hint + 1;
  
      while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
  
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
  
      if (offset > maxOffset) {
        offset = maxOffset;
      }
  
      // Make offsets relative to start
      let tmp = lastOffset;
      lastOffset = hint - offset;
      offset = hint - tmp;
  
      // value >= array[start + hint]
    } else {
      maxOffset = length - hint;
  
      while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
  
        if (offset <= 0) {
          offset = maxOffset;
        }
      }
  
      if (offset > maxOffset) {
        offset = maxOffset;
      }
  
      // Make offsets relative to start
      lastOffset += hint;
      offset += hint;
    }
  
    /*
     * Now array[start+lastOffset] < value <= array[start+offset], so value
     * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
     * binary search, with invariant array[start + lastOffset - 1] < value <=
     * array[start + offset].
     */
    lastOffset++;
  
    while (lastOffset < offset) {
      let m = lastOffset + ((offset - lastOffset) >>> 1);
  
      if (compare(value, array[start + m]) < 0) {
        offset = m;
  
      } else {
        lastOffset = m + 1;
      }
    }
  
    return offset;
  }
  
  class TimSort {
  
    constructor(array, compare) {
      this.array = array;
      this.compare = compare;
      this.minGallop = DEFAULT_MIN_GALLOPING;
      this.length = array.length;
  
      this.tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
      if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
        this.tmpStorageLength = this.length >>> 1;
      }
  
      this.tmp = new Array(this.tmpStorageLength);
  
      this.stackLength =
        (this.length < 120 ? 5 :
          this.length < 1542 ? 10 :
            this.length < 119151 ? 19 : 40);
  
      this.runStart = new Array(this.stackLength);
      this.runLength = new Array(this.stackLength);
      this.stackSize = 0;
    }
  
    /**
     * Push a new run on TimSort's stack.
     *
     * @param {number} runStart - Start index of the run in the original array.
     * @param {number} runLength - Length of the run;
     */
    pushRun(runStart, runLength) {
      this.runStart[this.stackSize] = runStart;
      this.runLength[this.stackSize] = runLength;
      this.stackSize += 1;
    }
  
    /**
     * Merge runs on TimSort's stack so that the following holds for all i:
     * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
     * 2) runLength[i - 2] > runLength[i - 1]
     */
    mergeRuns() {
      while (this.stackSize > 1) {
        let n = this.stackSize - 2;
  
        if ((n >= 1 &&
          this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1]) ||
          (n >= 2 &&
          this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
  
          if (this.runLength[n - 1] < this.runLength[n + 1]) {
            n--;
          }
  
        } else if (this.runLength[n] > this.runLength[n + 1]) {
          break;
        }
        this.mergeAt(n);
      }
    }
  
    /**
     * Merge all runs on TimSort's stack until only one remains.
     */
    forceMergeRuns() {
      while (this.stackSize > 1) {
        let n = this.stackSize - 2;
  
        if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
          n--;
        }
  
        this.mergeAt(n);
      }
    }
  
    /**
     * Merge the runs on the stack at positions i and i+1. Must be always be called
     * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
     *
     * @param {number} i - Index of the run to merge in TimSort's stack.
     */
    mergeAt(i) {
      let compare = this.compare;
      let array = this.array;
  
      let start1 = this.runStart[i];
      let length1 = this.runLength[i];
      let start2 = this.runStart[i + 1];
      let length2 = this.runLength[i + 1];
  
      this.runLength[i] = length1 + length2;
  
      if (i === this.stackSize - 3) {
        this.runStart[i + 1] = this.runStart[i + 2];
        this.runLength[i + 1] = this.runLength[i + 2];
      }
  
      this.stackSize--;
  
      /*
       * Find where the first element in the second run goes in run1. Previous
       * elements in run1 are already in place
       */
      let k = gallopRight(array[start2], array, start1, length1, 0, compare);
      start1 += k;
      length1 -= k;
  
      if (length1 === 0) {
        return;
      }
  
      /*
       * Find where the last element in the first run goes in run2. Next elements
       * in run2 are already in place
       */
      length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
  
      if (length2 === 0) {
        return;
      }
  
      /*
       * Merge remaining runs. A tmp array with length = min(length1, length2) is
       * used
       */
      if (length1 <= length2) {
        this.mergeLow(start1, length1, start2, length2);
  
      } else {
        this.mergeHigh(start1, length1, start2, length2);
      }
    }
  
    /**
     * Merge two adjacent runs in a stable way. The runs must be such that the
     * first element of run1 is bigger than the first element in run2 and the
     * last element of run1 is greater than all the elements in run2.
     * The method should be called when run1.length <= run2.length as it uses
     * TimSort temporary array to store run1. Use mergeHigh if run1.length >
     * run2.length.
     *
     * @param {number} start1 - First element in run1.
     * @param {number} length1 - Length of run1.
     * @param {number} start2 - First element in run2.
     * @param {number} length2 - Length of run2.
     */
    mergeLow(start1, length1, start2, length2) {
  
      let compare = this.compare;
      let array = this.array;
      let tmp = this.tmp;
      let i = 0;
  
      for (i = 0; i < length1; i++) {
        tmp[i] = array[start1 + i];
      }
  
      let cursor1 = 0;
      let cursor2 = start2;
      let dest = start1;
  
      array[dest++] = array[cursor2++];
  
      if (--length2 === 0) {
        for (i = 0; i < length1; i++) {
          array[dest + i] = tmp[cursor1 + i];
        }
        return;
      }
  
      if (length1 === 1) {
        for (i = 0; i < length2; i++) {
          array[dest + i] = array[cursor2 + i];
        }
        array[dest + length2] = tmp[cursor1];
        return;
      }
  
      let minGallop = this.minGallop;
  
      while (true) {
        let count1 = 0;
        let count2 = 0;
        let exit = false;
  
        do {
          if (compare(array[cursor2], tmp[cursor1]) < 0) {
            array[dest++] = array[cursor2++];
            count2++;
            count1 = 0;
  
            if (--length2 === 0) {
              exit = true;
              break;
            }
  
          } else {
            array[dest++] = tmp[cursor1++];
            count1++;
            count2 = 0;
            if (--length1 === 1) {
              exit = true;
              break;
            }
          }
        } while ((count1 | count2) < minGallop);
  
        if (exit) {
          break;
        }
  
        do {
          count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
  
          if (count1 !== 0) {
            for (i = 0; i < count1; i++) {
              array[dest + i] = tmp[cursor1 + i];
            }
  
            dest += count1;
            cursor1 += count1;
            length1 -= count1;
            if (length1 <= 1) {
              exit = true;
              break;
            }
          }
  
          array[dest++] = array[cursor2++];
  
          if (--length2 === 0) {
            exit = true;
            break;
          }
  
          count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
  
          if (count2 !== 0) {
            for (i = 0; i < count2; i++) {
              array[dest + i] = array[cursor2 + i];
            }
  
            dest += count2;
            cursor2 += count2;
            length2 -= count2;
  
            if (length2 === 0) {
              exit = true;
              break;
            }
          }
          array[dest++] = tmp[cursor1++];
  
          if (--length1 === 1) {
            exit = true;
            break;
          }
  
          minGallop--;
  
        } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
  
        if (exit) {
          break;
        }
  
        if (minGallop < 0) {
          minGallop = 0;
        }
  
        minGallop += 2;
      }
  
      this.minGallop = minGallop;
  
      if (minGallop < 1) {
        this.minGallop = 1;
      }
  
      if (length1 === 1) {
        for (i = 0; i < length2; i++) {
          array[dest + i] = array[cursor2 + i];
        }
        array[dest + length2] = tmp[cursor1];
  
      } else if (length1 === 0) {
        throw new Error('mergeLow preconditions were not respected');
  
      } else {
        for (i = 0; i < length1; i++) {
          array[dest + i] = tmp[cursor1 + i];
        }
      }
    }
  
    /**
     * Merge two adjacent runs in a stable way. The runs must be such that the
     * first element of run1 is bigger than the first element in run2 and the
     * last element of run1 is greater than all the elements in run2.
     * The method should be called when run1.length > run2.length as it uses
     * TimSort temporary array to store run2. Use mergeLow if run1.length <=
     * run2.length.
     *
     * @param {number} start1 - First element in run1.
     * @param {number} length1 - Length of run1.
     * @param {number} start2 - First element in run2.
     * @param {number} length2 - Length of run2.
     */
    mergeHigh(start1, length1, start2, length2) {
      let compare = this.compare;
      let array = this.array;
      let tmp = this.tmp;
      let i = 0;
  
      for (i = 0; i < length2; i++) {
        tmp[i] = array[start2 + i];
      }
  
      let cursor1 = start1 + length1 - 1;
      let cursor2 = length2 - 1;
      let dest = start2 + length2 - 1;
      let customCursor = 0;
      let customDest = 0;
  
      array[dest--] = array[cursor1--];
  
      if (--length1 === 0) {
        customCursor = dest - (length2 - 1);
  
        for (i = 0; i < length2; i++) {
          array[customCursor + i] = tmp[i];
        }
  
        return;
      }
  
      if (length2 === 1) {
        dest -= length1;
        cursor1 -= length1;
        customDest = dest + 1;
        customCursor = cursor1 + 1;
  
        for (i = length1 - 1; i >= 0; i--) {
          array[customDest + i] = array[customCursor + i];
        }
  
        array[dest] = tmp[cursor2];
        return;
      }
  
      let minGallop = this.minGallop;
  
      while (true) {
        let count1 = 0;
        let count2 = 0;
        let exit = false;
  
        do {
          if (compare(tmp[cursor2], array[cursor1]) < 0) {
            array[dest--] = array[cursor1--];
            count1++;
            count2 = 0;
            if (--length1 === 0) {
              exit = true;
              break;
            }
  
          } else {
            array[dest--] = tmp[cursor2--];
            count2++;
            count1 = 0;
            if (--length2 === 1) {
              exit = true;
              break;
            }
          }
  
        } while ((count1 | count2) < minGallop);
  
        if (exit) {
          break;
        }
  
        do {
          count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
  
          if (count1 !== 0) {
            dest -= count1;
            cursor1 -= count1;
            length1 -= count1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;
  
            for (i = count1 - 1; i >= 0; i--) {
              array[customDest + i] = array[customCursor + i];
            }
  
            if (length1 === 0) {
              exit = true;
              break;
            }
          }
  
          array[dest--] = tmp[cursor2--];
  
          if (--length2 === 1) {
            exit = true;
            break;
          }
  
          count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
  
          if (count2 !== 0) {
            dest -= count2;
            cursor2 -= count2;
            length2 -= count2;
            customDest = dest + 1;
            customCursor = cursor2 + 1;
  
            for (i = 0; i < count2; i++) {
              array[customDest + i] = tmp[customCursor + i];
            }
  
            if (length2 <= 1) {
              exit = true;
              break;
            }
          }
  
          array[dest--] = array[cursor1--];
  
          if (--length1 === 0) {
            exit = true;
            break;
          }
  
          minGallop--;
  
        } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
  
        if (exit) {
          break;
        }
  
        if (minGallop < 0) {
          minGallop = 0;
        }
  
        minGallop += 2;
      }
  
      this.minGallop = minGallop;
  
      if (minGallop < 1) {
        this.minGallop = 1;
      }
  
      if (length2 === 1) {
        dest -= length1;
        cursor1 -= length1;
        customDest = dest + 1;
        customCursor = cursor1 + 1;
  
        for (i = length1 - 1; i >= 0; i--) {
          array[customDest + i] = array[customCursor + i];
        }
  
        array[dest] = tmp[cursor2];
  
      } else if (length2 === 0) {
        throw new Error('mergeHigh preconditions were not respected');
  
      } else {
        customCursor = dest - (length2 - 1);
        for (i = 0; i < length2; i++) {
          array[customCursor + i] = tmp[i];
        }
      }
    }
  }
  
  /**
   * Sort an array in the range [lo, hi) using TimSort.
   *
   * @param {array} array - The array to sort.
   * @param {number} lo - First element in the range (inclusive).
   * @param {number} hi - Last element in the range.
   * @param {function=} compare - Item comparison function. Default is alphabetical.
   */
  var sort = function (array, lo, hi, compare) {
    if (!Array.isArray(array)) {
      throw new TypeError('Can only sort arrays');
    }
  
    /*
     * Handle the case where a comparison function is not provided. We do
     * lexicographic sorting
     */
  
    if (lo === undefined) {
      lo = 0;
    }
  
    if (hi === undefined) {
      hi = array.length;
    }
  
    if (compare === undefined) {
      compare = alphabeticalCompare;
    }
  
    let remaining = hi - lo;
  
    // The array is already sorted
    if (remaining < 2) {
      return;
    }
  
    let runLength = 0;
    // On small arrays binary sort can be used directly
    if (remaining < DEFAULT_MIN_MERGE) {
      runLength = makeAscendingRun(array, lo, hi, compare);
      binaryInsertionSort(array, lo, hi, lo + runLength, compare);
      return;
    }
  
    let ts = new TimSort(array, compare);
  
    let minRun = minRunLength(remaining);
  
    do {
      runLength = makeAscendingRun(array, lo, hi, compare);
      if (runLength < minRun) {
        let force = remaining;
        if (force > minRun) {
          force = minRun;
        }
  
        binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
        runLength = force;
      }
      // Push new run and merge if necessary
      ts.pushRun(lo, runLength);
      ts.mergeRuns();
  
      // Go find next run
      remaining -= runLength;
      lo += runLength;
  
    } while (remaining !== 0);
  
    // Force merging of remaining runs
    ts.forceMergeRuns();
  };
  
  class FixedArray {
    constructor(size) {
      this._count = 0;
      this._data = new Array(size);
    }
  
    _resize(size) {
      if (size > this._data.length) {
        for (let i = this._data.length; i < size; ++i) {
          this._data[i] = undefined;
        }
      }
    }
  
    get length() {
      return this._count;
    }
  
    get data() {
      return this._data;
    }
  
    reset() {
      for (let i = 0; i < this._count; ++i) {
        this._data[i] = undefined;
      }
  
      this._count = 0;
    }
  
    push(val) {
      if (this._count >= this._data.length) {
        this._resize(this._data.length * 2);
      }
  
      this._data[this._count] = val;
      ++this._count;
    }
  
    pop() {
      --this._count;
  
      if (this._count < 0) {
        this._count = 0;
      }
  
      let ret = this._data[this._count];
      this._data[this._count] = undefined;
  
      return ret;
    }
  
    fastRemove(idx) {
      if (idx >= this._count) {
        return;
      }
  
      let last = this._count - 1;
      this._data[idx] = this._data[last];
      this._data[last] = undefined;
      this._count -= 1;
    }
  
    indexOf(val) {
      let idx = this._data.indexOf(val);
      if (idx >= this._count) {
        return -1;
      }
  
      return idx;
    }
  
    sort(cmp) {
      return sort(this._data, 0, this._count, cmp);
    }
  }
  
  class Pool {
    constructor(fn, size) {
      this._fn = fn;
      this._idx = size - 1;
      this._frees = new Array(size);
  
      for (let i = 0; i < size; ++i) {
        this._frees[i] = fn();
      }
    }
  
    _expand(size) {
      let old = this._frees;
      this._frees = new Array(size);
  
      let len = size - old.length;
      for (let i = 0; i < len; ++i) {
        this._frees[i] = this._fn();
      }
  
      for (let i = len, j = 0; i < size; ++i, ++j) {
        this._frees[i] = old[j];
      }
  
      this._idx += len;
    }
  
    alloc() {
      // create some more space (expand by 20%, minimum 1)
      if (this._idx < 0) {
        this._expand(Math.round(this._frees.length * 1.2) + 1);
      }
  
      let ret = this._frees[this._idx];
      this._frees[this._idx] = null;
      --this._idx;
  
      return ret;
    }
  
    free(obj) {
      ++this._idx;
      this._frees[this._idx] = obj;
    }
  }
  
  class RecyclePool {
    constructor(fn, size) {
      this._fn = fn;
      this._count = 0;
      this._data = new Array(size);
  
      for (let i = 0; i < size; ++i) {
        this._data[i] = fn();
      }
    }
  
    get length() {
      return this._count;
    }
  
    get data() {
      return this._data;
    }
  
    reset() {
      this._count = 0;
    }
  
    resize(size) {
      if (size > this._data.length) {
        for (let i = this._data.length; i < size; ++i) {
          this._data[i] = this._fn();
        }
      }
    }
  
    add() {
      if (this._count >= this._data.length) {
        this.resize(this._data.length * 2);
      }
  
      return this._data[this._count++];
    }
  
    remove(idx) {
      if (idx >= this._count) {
        return;
      }
  
      let last = this._count - 1;
      let tmp = this._data[idx];
      this._data[idx] = this._data[last];
      this._data[last] = tmp;
      this._count -= 1;
    }
  
    sort(cmp) {
      return sort(this._data, 0, this._count, cmp);
    }
  }
  
  let _bufferPools = Array(8);
  for (let i = 0; i < 8; ++i) {
    _bufferPools[i] = [];
  }
  
  class Scene$1 {
    constructor() {
      this._lights = new FixedArray(16);
      this._models = new FixedArray(16);
      this._cameras = new FixedArray(16);
      this._debugCamera = null;
  
      // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
      this._views = [];
    }
  
    _add(pool, item) {
      if (item._poolID !== -1) {
        return;
      }
  
      pool.push(item);
      item._poolID = pool.length - 1;
    }
  
    _remove(pool, item) {
      if (item._poolID === -1) {
        return;
      }
  
      pool.data[pool.length-1]._poolID = item._poolID;
      pool.fastRemove(item._poolID);
      item._poolID = -1;
    }
  
    reset() {
      for (let i = 0; i < this._models.length; ++i) {
        let model = this._models.data[i];
        model._cullingMask = -1;
      }
    }
  
    setDebugCamera(cam) {
      this._debugCamera = cam;
    }
  
    // camera
  
    getCameraCount() {
      return this._cameras.length;
    }
  
    getCamera(idx) {
      return this._cameras.data[idx];
    }
  
    addCamera(camera) {
      this._add(this._cameras, camera);
    }
  
    removeCamera(camera) {
      this._remove(this._cameras, camera);
    }
  
    // model
  
    getModelCount() {
      return this._models.length;
    }
  
    getModel(idx) {
      return this._models.data[idx];
    }
  
    addModel(model) {
      this._add(this._models, model);
    }
  
    removeModel(model) {
      this._remove(this._models, model);
    }
  
    // light
  
    getLightCount() {
      return this._lights.length;
    }
  
    getLight(idx) {
      return this._lights.data[idx];
    }
  
    addLight(light) {
      this._add(this._lights, light);
    }
  
    removeLight(light) {
      this._remove(this._lights, light);
    }
  
    // view
  
    addView(view) {
      if (this._views.indexOf(view) === -1) {
        this._views.push(view);
      }
    }
  
    removeView(view) {
      let idx = this._views.indexOf(view);
      if (idx !== -1) {
        this._views.splice(idx, 1);
      }
    }
  }
  
  let _shdID = 0;
  
  function _generateDefines(defs) {
    let defines = [];
    for (let def in defs) {
      if (defs[def] === true) {
        defines.push(`#define ${def}`);
      }
    }
    return defines.join('\n');
  }
  
  function _replaceMacroNums(string, defs) {
    let cache = {};
    let tmp = string;
    for (let def in defs) {
      if (Number.isInteger(defs[def])) {
        cache[def] = defs[def];
      }
    }
    for (let def in cache) {
      let reg = new RegExp(def, 'g');
      tmp = tmp.replace(reg, cache[def]);
    }
    return tmp;
  }
  
  function _unrollLoops(string) {
    let pattern = /#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g;
    function replace(match, index, begin, end, snippet) {
      let unroll = '';
      let parsedBegin = parseInt(begin);
      let parsedEnd = parseInt(end);
      if (parsedBegin.isNaN || parsedEnd.isNaN) {
        console.error('Unroll For Loops Error: begin and end of range must be an int num.');
      }
      for (let i = parsedBegin; i < parsedEnd; ++i) {
        unroll += snippet.replace(new RegExp(`{${index}}`, 'g'), i);
      }
      return unroll;
    }
    return string.replace(pattern, replace);
  }
  
  class ProgramLib {
    /**
     * @param {gfx.Device} device
     * @param {Array} templates
     * @param {Object} chunks
     */
    constructor(device, templates = [], chunks = {}) {
      this._device = device;
      this._precision = `precision highp float;\n`;
  
      // register templates
      this._templates = {};
      for (let i = 0; i < templates.length; ++i) {
        let tmpl = templates[i];
        this.define(tmpl.name, tmpl.vert, tmpl.frag, tmpl.defines);
      }
  
      // register chunks
      this._chunks = {};
      Object.assign(this._chunks, chunks);
  
      this._cache = {};
    }
  
    /**
     * @param {string} name
     * @param {string} template
     * @param {Array} options
     *
     * @example:
     *   programLib.define('foobar', vertTmpl, fragTmpl, [
     *     { name: 'shadow' },
     *     { name: 'lightCount', min: 1, max: 4 }
     *   ]);
     */
    define(name, vert, frag, defines) {
      if (this._templates[name]) {
        console.warn(`Failed to define shader ${name}: already exists.`);
        return;
      }
  
      let id = ++_shdID;
  
      // calculate option mask offset
      let offset = 0;
      for (let i = 0; i < defines.length; ++i) {
        let def = defines[i];
        def._offset = offset;
  
        let cnt = 1;
  
        if (def.min !== undefined && def.max !== undefined) {
          cnt = Math.ceil((def.max - def.min) * 0.5);
  
          def._map = function (value) {
            return (value - this._min) << def._offset;
          }.bind(def);
        } else {
          def._map = function (value) {
            if (value) {
              return 1 << def._offset;
            }
            return 0;
          }.bind(def);
        }
  
        offset += cnt;
  
        def._offset = offset;
      }
  
      vert = this._precision + vert;
      frag = this._precision + frag;
  
      // store it
      this._templates[name] = {
        id,
        name,
        vert,
        frag,
        defines
      };
    }
  
    /**
     * @param {string} name
     * @param {Object} options
     */
    getKey(name, defines) {
      let tmpl = this._templates[name];
      let key = 0;
      for (let i = 0; i < tmpl.defines.length; ++i) {
        let tmplDefs = tmpl.defines[i];
        let value = defines[tmplDefs.name];
        if (value === undefined) {
          continue;
        }
  
        key |= tmplDefs._map(value);
      }
  
      return key << 8 | tmpl.id;
    }
  
    /**
     * @param {string} name
     * @param {Object} options
     */
    getProgram(name, defines) {
      let key = this.getKey(name, defines);
      let program = this._cache[key];
      if (program) {
        return program;
      }
  
      // get template
      let tmpl = this._templates[name];
      let customDef = _generateDefines(defines) + '\n';
      let vert = _replaceMacroNums(tmpl.vert, defines);
      vert = customDef + _unrollLoops(vert);
      let frag = _replaceMacroNums(tmpl.frag, defines);
      frag = customDef + _unrollLoops(frag);
  
      program = new gfx.Program(this._device, {
        vert,
        frag
      });
      program.link();
      this._cache[key] = program;
  
      return program;
    }
  }
  
  let _m3_tmp$1 = mat3.create();
  let _m4_tmp$2 = mat4.create();
  
  let _stageInfos = new RecyclePool(() => {
    return {
      stage: null,
      items: null,
    };
  }, 8);
  
  let _float2_pool = new RecyclePool(() => {
    return new Float32Array(2);
  }, 8);
  
  let _float3_pool = new RecyclePool(() => {
    return new Float32Array(3);
  }, 8);
  
  let _float4_pool = new RecyclePool(() => {
    return new Float32Array(4);
  }, 8);
  
  let _float9_pool = new RecyclePool(() => {
    return new Float32Array(9);
  }, 8);
  
  let _float16_pool = new RecyclePool(() => {
    return new Float32Array(16);
  }, 8);
  
  let _float64_pool = new RecyclePool(() => {
    return new Float32Array(64);
  }, 8);
  
  let _int2_pool = new RecyclePool(() => {
    return new Int32Array(2);
  }, 8);
  
  let _int3_pool = new RecyclePool(() => {
    return new Int32Array(3);
  }, 8);
  
  let _int4_pool = new RecyclePool(() => {
    return new Int32Array(4);
  }, 8);
  
  let _int64_pool = new RecyclePool(() => {
    return new Int32Array(64);
  }, 8);
  
  let _type2uniformValue = {
    [enums.PARAM_INT]: function (value) {
      return value;
    },
  
    [enums.PARAM_INT2]: function (value) {
      return vec2.array(_int2_pool.add(), value);
    },
  
    [enums.PARAM_INT3]: function (value) {
      return vec3.array(_int3_pool.add(), value);
    },
  
    [enums.PARAM_INT4]: function (value) {
      return vec4.array(_int4_pool.add(), value);
    },
  
    [enums.PARAM_FLOAT]: function (value) {
      return value;
    },
  
    [enums.PARAM_FLOAT2]: function (value) {
      return vec2.array(_float2_pool.add(), value);
    },
  
    [enums.PARAM_FLOAT3]: function (value) {
      return vec3.array(_float3_pool.add(), value);
    },
  
    [enums.PARAM_FLOAT4]: function (value) {
      return vec4.array(_float4_pool.add(), value);
    },
  
    [enums.PARAM_COLOR3]: function (value) {
      return color3.array(_float3_pool.add(), value);
    },
  
    [enums.PARAM_COLOR4]: function (value) {
      return color4.array(_float4_pool.add(), value);
    },
  
    [enums.PARAM_MAT2]: function (value) {
      return mat2.array(_float4_pool.add(), value);
    },
  
    [enums.PARAM_MAT3]: function (value) {
      return mat3.array(_float9_pool.add(), value);
    },
  
    [enums.PARAM_MAT4]: function (value) {
      return mat4.array(_float16_pool.add(), value);
    },
  
    // [enums.PARAM_TEXTURE_2D]: function (value) {
    // },
  
    // [enums.PARAM_TEXTURE_CUBE]: function (value) {
    // },
  };
  
  let _type2uniformArrayValue = {
    [enums.PARAM_INT]: {
      func (values) {
        let result = _int64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          result[i] = values[i];
        }
        return result;
      },
      size: 1,
    },
  
    [enums.PARAM_INT2]: {
      func (values) {
        let result = _int64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          result[2 * i] = values[i].x;
          result[2 * i + 1] = values[i].y;
        }
        return result;
      },
      size: 2,
    },
  
    [enums.PARAM_INT3]: {
      func: undefined,
      size: 3,
    },
  
    [enums.PARAM_INT4]: {
      func (values) {
        let result = _int64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          let v = values[i];
          result[4 * i] = v.x;
          result[4 * i + 1] = v.y;
          result[4 * i + 2] = v.z;
          result[4 * i + 3] = v.w;
        }
        return result;
      },
      size: 4,
    },
  
    [enums.PARAM_FLOAT]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          result[i] = values[i];
        }
        return result;
      },
      size: 1
    },
  
    [enums.PARAM_FLOAT2]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          result[2 * i] = values[i].x;
          result[2 * i + 1] = values[i].y;
        }
        return result;
      },
      size: 2,
    },
  
    [enums.PARAM_FLOAT3]: {
      func: undefined,
      size: 3,
    },
  
    [enums.PARAM_FLOAT4]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          let v = values[i];
          result[4 * i] = v.x;
          result[4 * i + 1] = v.y;
          result[4 * i + 2] = v.z;
          result[4 * i + 3] = v.w;
        }
        return result;
      },
      size: 4,
    },
  
    [enums.PARAM_COLOR3]: {
      func: undefined,
      size: 3,
    },
  
    [enums.PARAM_COLOR4]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          let v = values[i];
          result[4 * i] = v.r;
          result[4 * i + 1] = v.g;
          result[4 * i + 2] = v.b;
          result[4 * i + 3] = v.a;
        }
        return result;
      },
      size: 4,
    },
  
    [enums.PARAM_MAT2]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          let v = values[i];
          result[4 * i] = v.m00;
          result[4 * i + 1] = v.m01;
          result[4 * i + 2] = v.m02;
          result[4 * i + 3] = v.m03;
        }
        return result;
      },
      size: 4
    },
  
    [enums.PARAM_MAT3]: {
      func: undefined,
      size: 9
    },
  
  
    [enums.PARAM_MAT4]: {
      func (values) {
        let result = _float64_pool.add();
        for (let i = 0; i < values.length; ++i) {
          let v = values[i];
          result[16 * i] = v.m00;
          result[16 * i + 1] = v.m01;
          result[16 * i + 2] = v.m02;
          result[16 * i + 3] = v.m03;
          result[16 * i + 4] = v.m04;
          result[16 * i + 5] = v.m05;
          result[16 * i + 6] = v.m06;
          result[16 * i + 7] = v.m07;
          result[16 * i + 8] = v.m08;
          result[16 * i + 9] = v.m09;
          result[16 * i + 10] = v.m10;
          result[16 * i + 11] = v.m11;
          result[16 * i + 12] = v.m12;
          result[16 * i + 13] = v.m13;
          result[16 * i + 14] = v.m14;
          result[16 * i + 15] = v.m15;
        }
        return result;
      },
      size: 16
    },
  
    // [enums.PARAM_TEXTURE_2D]: function (value) {
    // },
  
    // [enums.PARAM_TEXTURE_CUBE]: function (value) {
    // },
  };
  
  class Base {
    /**
     * @param {gfx.Device} device
     * @param {Object} opts
     * @param {gfx.Texture2D} opts.defaultTexture
     * @param {gfx.TextureCube} opts.defaultTextureCube
     * @param {Array} opts.programTemplates
     * @param {Object} opts.programChunks
     */
    constructor(device, opts) {
      this._device = device;
      this._programLib = new ProgramLib(device, opts.programTemplates, opts.programChunks);
      this._opts = opts;
      this._type2defaultValue = {
        [enums.PARAM_INT]: 0,
        [enums.PARAM_INT2]: vec2.new(0, 0),
        [enums.PARAM_INT3]: vec3.new(0, 0, 0),
        [enums.PARAM_INT4]: vec4.new(0, 0, 0, 0),
        [enums.PARAM_FLOAT]: 0.0,
        [enums.PARAM_FLOAT2]: vec2.new(0, 0),
        [enums.PARAM_FLOAT3]: vec3.new(0, 0, 0),
        [enums.PARAM_FLOAT4]: vec4.new(0, 0, 0, 0),
        [enums.PARAM_COLOR3]: color3.new(0, 0, 0),
        [enums.PARAM_COLOR4]: color4.new(0, 0, 0, 1),
        [enums.PARAM_MAT2]: mat2.create(),
        [enums.PARAM_MAT3]: mat3.create(),
        [enums.PARAM_MAT4]: mat4.create(),
        [enums.PARAM_TEXTURE_2D]: opts.defaultTexture,
        [enums.PARAM_TEXTURE_CUBE]: opts.defaultTextureCube,
      };
      this._stage2fn = {};
      this._usedTextureUnits = 0;
  
      this._viewPools = new RecyclePool(() => {
        return new View$1();
      }, 8);
  
      this._drawItemsPools = new RecyclePool(() => {
        return {
          model: null,
          node: null,
          ia: null,
          effect: null,
          defines: null,
        };
      }, 100);
  
      this._stageItemsPools = new RecyclePool(() => {
        return new RecyclePool(() => {
          return {
            model: null,
            node: null,
            ia: null,
            effect: null,
            defines: null,
            technique: null,
            sortKey: -1,
          };
        }, 100);
      }, 16);
    }
  
    _resetTextuerUnit() {
      this._usedTextureUnits = 0;
    }
  
    _allocTextuerUnit() {
      const device = this._device;
  
      let unit = this._usedTextureUnits;
      if (unit >= device._caps.maxTextureUnits) {
        console.warn(`Trying to use ${unit} texture units while this GPU supports only ${device._caps.maxTextureUnits}`);
      }
  
      this._usedTextureUnits += 1;
      return unit;
    }
  
    _registerStage(name, fn) {
      this._stage2fn[name] = fn;
    }
  
    _reset() {
      this._viewPools.reset();
      this._stageItemsPools.reset();
    }
  
    _requestView() {
      return this._viewPools.add();
    }
  
    _render(view, scene) {
      const device = this._device;
  
      // setup framebuffer
      device.setFrameBuffer(view._framebuffer);
  
      // setup viewport
      device.setViewport(
        view._rect.x,
        view._rect.y,
        view._rect.w,
        view._rect.h
      );
  
      // setup clear
      let clearOpts = {};
      if (view._clearFlags & enums.CLEAR_COLOR) {
        clearOpts.color = [
          view._color.r,
          view._color.g,
          view._color.b,
          view._color.a
        ];
      }
      if (view._clearFlags & enums.CLEAR_DEPTH) {
        clearOpts.depth = view._depth;
      }
      if (view._clearFlags & enums.CLEAR_STENCIL) {
        clearOpts.stencil = view._stencil;
      }
      device.clear(clearOpts);
  
      // get all draw items
      this._drawItemsPools.reset();
  
      for (let i = 0; i < scene._models.length; ++i) {
        let model = scene._models.data[i];
  
        // filter model by view
        if ((model._cullingMask & view._cullingMask) === 0) {
          continue;
        }
  
        for (let m = 0; m < model.drawItemCount; ++m) {
          let drawItem = this._drawItemsPools.add();
          model.extractDrawItem(drawItem, m);
        }
      }
  
      // TODO: update frustum
      // TODO: visbility test
      // frustum.update(view._viewProj);
  
      // dispatch draw items to different stage
      _stageInfos.reset();
  
      for (let i = 0; i < view._stages.length; ++i) {
        let stage = view._stages[i];
        let stageItems = this._stageItemsPools.add();
        stageItems.reset();
  
        for (let j = 0; j < this._drawItemsPools.length; ++j) {
          let drawItem = this._drawItemsPools.data[j];
          let tech = drawItem.effect.getTechnique(stage);
  
          if (tech) {
            let stageItem = stageItems.add();
            stageItem.model = drawItem.model;
            stageItem.node = drawItem.node;
            stageItem.ia = drawItem.ia;
            stageItem.effect = drawItem.effect;
            stageItem.defines = drawItem.defines;
            stageItem.technique = tech;
            stageItem.sortKey = -1;
          }
        }
  
        let stageInfo = _stageInfos.add();
        stageInfo.stage = stage;
        stageInfo.items = stageItems;
      }
  
      // render stages
      for (let i = 0; i < _stageInfos.length; ++i) {
        let info = _stageInfos.data[i];
        let fn = this._stage2fn[info.stage];
  
        fn(view, info.items);
      }
    }
  
    _draw(item) {
      const device = this._device;
      const programLib = this._programLib;
      const { node, ia, effect, technique, defines } = item;
  
      // reset the pool
      // NOTE: we can use drawCounter optimize this
      // TODO: should be configurable
      _float2_pool.reset();
      _float3_pool.reset();
      _float4_pool.reset();
      _float9_pool.reset();
      _float16_pool.reset();
      _float64_pool.reset();
      _int2_pool.reset();
      _int3_pool.reset();
      _int4_pool.reset();
      _int64_pool.reset();
  
      // set common uniforms
      // TODO: try commit this depends on effect
      // {
      node.getWorldMatrix(_m4_tmp$2);
      device.setUniform('model', mat4.array(_float16_pool.add(), _m4_tmp$2));
  
      mat3.transpose(_m3_tmp$1, mat3.invert(_m3_tmp$1, mat3.fromMat4(_m3_tmp$1, _m4_tmp$2)));
      device.setUniform('normalMatrix', mat3.array(_float9_pool.add(), _m3_tmp$1));
      // }
  
      // set technique uniforms
      for (let i = 0; i < technique._parameters.length; ++i) {
        let prop = technique._parameters[i];
        let param = effect.getProperty(prop.name);
  
        if (param === undefined) {
          param = prop.val;
        }
  
        if (param === undefined) {
          param = this._type2defaultValue[prop.type];
        }
  
        if (param === undefined) {
          console.warn(`Failed to set technique property ${prop.name}, value not found.`);
          continue;
        }
  
        if (
          prop.type === enums.PARAM_TEXTURE_2D ||
          prop.type === enums.PARAM_TEXTURE_CUBE
        ) {
          if (prop.size !== undefined) {
            if (prop.size !== param.length) {
              console.error(`The length of texture array (${param.length}) is not corrent(expect ${prop.size}).`);
              continue;
            }
            let slots = _int64_pool.add();
            for (let index = 0; index < param.length; ++index) {
              slots[index] = this._allocTextuerUnit();
            }
            device.setTextureArray(prop.name, param, slots);
          } else {
            device.setTexture(prop.name, param, this._allocTextuerUnit());
          }
        } else {
          let convertedValue;
          if (prop.size !== undefined) {
            let convertArray = _type2uniformArrayValue[prop.type];
            if (convertArray.func === undefined) {
              console.error('Uniform array of color3/int3/float3/mat3 can not be supportted!');
              continue;
            }
            if (prop.size * convertArray.size > 64) {
              console.error('Uniform array is too long!');
              continue;
            }
            convertedValue = convertArray.func(param);
          } else {
            let convertFn = _type2uniformValue[prop.type];
            convertedValue = convertFn(param);
          }
          device.setUniform(prop.name, convertedValue);
        }
      }
  
      // for each pass
      for (let i = 0; i < technique._passes.length; ++i) {
        let pass = technique._passes[i];
        let count = ia.getPrimitiveCount();
  
        // set vertex buffer
        device.setVertexBuffer(0, ia._vertexBuffer);
  
        // set index buffer
        if (ia._indexBuffer) {
          device.setIndexBuffer(ia._indexBuffer);
        }
  
        // set primitive type
        device.setPrimitiveType(ia._primitiveType);
  
        // set program
        let program = programLib.getProgram(pass._programName, defines);
        device.setProgram(program);
  
        // cull mode
        device.setCullMode(pass._cullMode);
  
        // blend
        if (pass._blend) {
          device.enableBlend();
          device.setBlendFuncSep(
            pass._blendSrc,
            pass._blendDst,
            pass._blendSrcAlpha,
            pass._blendDstAlpha
          );
          device.setBlendEqSep(
            pass._blendEq,
            pass._blendAlphaEq
          );
          device.setBlendColor32(pass._blendColor);
        }
  
        // depth test & write
        if (pass._depthTest) {
          device.enableDepthTest();
          device.setDepthFunc(pass._depthFunc);
        }
        if (pass._depthWrite) {
          device.enableDepthWrite();
        }
  
        // stencil
        if (pass._stencilTest) {
          device.enableStencilTest();
  
          // front
          device.setStencilFuncFront(
            pass._stencilFuncFront,
            pass._stencilRefFront,
            pass._stencilMaskFront
          );
          device.setStencilOpFront(
            pass._stencilFailOpFront,
            pass._stencilZFailOpFront,
            pass._stencilZPassOpFront,
            pass._stencilWriteMaskFront
          );
  
          // back
          device.setStencilFuncBack(
            pass._stencilFuncBack,
            pass._stencilRefBack,
            pass._stencilMaskBack
          );
          device.setStencilOpBack(
            pass._stencilFailOpBack,
            pass._stencilZFailOpBack,
            pass._stencilZPassOpBack,
            pass._stencilWriteMaskBack
          );
        }
  
        // draw pass
        device.draw(ia._start, count);
  
        this._resetTextuerUnit();
      }
    }
  }
  
  let renderer = {
    // config
    addStage: config.addStage,
  
    // utils
    createIA,
  
    // classes
    Pass,
    Technique,
    Effect,
    InputAssembler: InputAssembler$1,
    View: View$1,
  
    Light,
    Camera: Camera$1,
    Model: Model$1,
    Scene: Scene$1,
  
    Base,
    ProgramLib,
  };
  Object.assign(renderer, enums);
  
  let _a16_view = new Float32Array(16);
  let _a16_proj = new Float32Array(16);
  let _a16_viewProj = new Float32Array(16);
  
  // Add stage to renderer
  renderer.addStage('transparent');
  
  class ForwardRenderer$1 extends renderer.Base {
    constructor (device, builtin) {
      super(device, builtin);
      this._registerStage('transparent', this._transparentStage.bind(this));
    }
  
    reset () {
      this._reset();
    }
  
    render (scene) {
      this._reset();
  
      const canvas = this._device._gl.canvas;
  
      for (let i = 0; i < scene._cameras.length; ++i) {
        let camera = scene._cameras.data[i];
        let view = camera.view;
        let dirty = camera.dirty;
        if (!view) {
          view = this._requestView();
          dirty = true;
        }
        if (dirty) {
          camera.extractView(view, canvas.width, canvas.height);
        }
        this._render(view, scene);
      }
    }
  
    _transparentStage (view, items) {
      // update uniforms
      this._device.setUniform('view', mat4.array(_a16_view, view._matView));
      this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
      this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
  
      // draw it
      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
        this._draw(item);
      }
    }
  }
  
  class Device$2 {
    /**
     * @param {HTMLElement} canvasEL
     */
    constructor(canvasEL) {
      let ctx;
  
      try {
        ctx = canvasEL.getContext('2d');
      } catch (err) {
        console.error(err);
        return;
      }
  
      // statics
      this._canvas = canvasEL;
      this._ctx = ctx;
      this._caps = {}; // capability
      this._stats = {
        drawcalls: 0,
      };
  
      // runtime
      this._vx = this._vy = this._vw = this._vh = 0;
      this._sx = this._sy = this._sw = this._sh = 0;
    }
  
    _restoreTexture (unit) {
    }
  
    // ===============================
    // Immediate Settings
    // ===============================
  
    /**
     * @method setViewport
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    setViewport(x, y, w, h) {
      if (
        this._vx !== x ||
        this._vy !== y ||
        this._vw !== w ||
        this._vh !== h
      ) {
        this._vx = x;
        this._vy = y;
        this._vw = w;
        this._vh = h;
      }
    }
  
    /**
     * @method setScissor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    setScissor(x, y, w, h) {
      if (
        this._sx !== x ||
        this._sy !== y ||
        this._sw !== w ||
        this._sh !== h
      ) {
        this._sx = x;
        this._sy = y;
        this._sw = w;
        this._sh = h;
      }
    }
  
    clear(color) {
      let ctx = this._ctx;
      ctx.clearRect(this._vx, this._vy, this._vw, this._vh);
      if (color && (color[0] !== 0 || color[1] !== 0 || color[2] !== 0)) {
        ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] +')';
        ctx.globalAlpha = color[3];
        ctx.fillRect(this._vx, this._vy, this._vw, this._vh);
      }
    }
  }
  
  const _clearColor = [0, 0, 0, 1];
  
  class Base$1 {
    /**
     * @param {gfx.Device} device
     * @param {Object} opts
     */
    constructor(device, opts) {
      this._device = device;
      this._opts = opts;
      this._stage2fn = {};
  
      this._drawItemsPools = new RecyclePool(() => {
        return {
          model: null,
          node: null,
        };
      }, 100);
    }
  
    _registerStage(name, fn) {
      this._stage2fn[name] = fn;
    }
  
    _reset() {
      this._drawItemsPools.reset();
    }
  
    _render(view, scene) {
      const device = this._device;
      let stage = view._stages[0];
  
      // reset transform to camera
      let ctx = device._ctx;
      let mat = camera._viewProj;
      ctx.setTransform(mat.m00, mat.m01, mat.m04, mat.m05, mat.m12, mat.m13);
      device.setViewport(0, 0, camera._rect.w, camera._rect.h);
      device.clear(_clearColor);
  
      // get all draw items
      let allDrawItems = this._drawItemsPools.alloc();
      allDrawItems.reset();
  
      for (let i = 0; i < scene._models.length; ++i) {
        let model = scene._models.data[i];
        let drawItem = allDrawItems.add();
        model.extractDrawItem(drawItem);
      }
  
      // render only the default stage
      let fn = this._stage2fn[stages[0]];
      fn(view, allDrawItems);
    }
  
    _draw(item) {
      const device = this._device;
      const ctx = device._ctx;
  
      item.model.draw(ctx);
    }
  }
  
  var renderer$3 = {
    Base: Base$1
  };
  
  class Texture2D$2 {
  
    /**
     * @constructor
     * @param {Device} device
     * @param {Object} options
     * @param {Array} options.images
     * @param {Number} options.width
     * @param {Number} options.height
     */
    constructor(device, options) {
      this._device = device;
      
      this._width = 4;
      this._height = 4;
  
      this._image = null;
  
      if (options) {
        if (options.width !== undefined) {
          this._width = options.width;
        }
        if (options.height !== undefined) {
          this._height = options.height;
        }
  
        if (options.images && options.images[0]) {
          let ops = {
            image: options.images[0]
          };
          this.updateImage(ops);
        }
      }
    }
  
    update (options) {
      this.updateImage(options);
    }
  
    updateImage(options) {
      if (options.image && options.image !== this._image) {
        this._image = options.image;
      }
    }
  
    destroy () {
      this._image = null;
    }
  }
  
  var canvas = {
      Device: Device$2,
      renderer: renderer$3,
      Texture2D: Texture2D$2
  };
  
  const renderer$2 = canvas.renderer;
  
  class ForwardRenderer$2 extends renderer$2.Base {
    constructor (device, builtin) {
      super(device, builtin);
      
      this._registerStage('transparent', this._transparentStage.bind(this));
    }
  
    reset () {
      // Reset renderer internal datas
      this._reset();
    }
  
    render (camera, scene) {
      this.reset();
  
      // visit logic node tree to get zorders
      // scene.visit();
  
      this._render(camera, scene);
    }
  
    _transparentStage (camera, items) {
      let ctx = this._device._ctx;
      let mat = camera._viewProj;
  
      // Culling and draw items
      for (let i = 0, l = items.length; i < l; ++i) {
        ctx.setTransform(mat.m00, mat.m01, mat.m04, mat.m05, mat.m12, mat.m13);
        let item = items.data[i];
        this._draw(item);
      }
    }
  }
  
  var chunks = {
  };
  
  var templates = [
    {
      name: 'gray_sprite',
      vert: 'uniform mat4 viewProj;\nattribute vec3 a_position;\nattribute vec4 a_color;\nvarying lowp vec4 v_fragmentColor;\nattribute vec2 a_uv0;\nvarying vec2 uv0;\nvoid main () {\n  vec4 pos = viewProj * vec4(a_position, 1);\n  v_fragmentColor = a_color;\n  uv0 = a_uv0;\n  gl_Position = pos;\n}',
      frag: 'uniform sampler2D texture;\nvarying vec2 uv0;\nvarying vec4 v_fragmentColor;\nvoid main () {\n  vec4 c = v_fragmentColor * texture2D(texture, uv0);\n  float gray = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;\n  gl_FragColor = vec4(gray, gray, gray, c.a);\n}',
      defines: [
      ],
    },
    {
      name: 'sprite',
      vert: 'uniform mat4 viewProj;\nattribute vec3 a_position;\nattribute vec4 a_color;\nvarying lowp vec4 v_fragmentColor;\n#ifdef useModel\n  uniform mat4 model;\n#endif\n#ifdef useTexture\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n#endif\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n  vec4 pos = mvp * vec4(a_position, 1);\n  v_fragmentColor = a_color;\n  \n  #ifdef useTexture\n    uv0 = a_uv0;\n  #endif\n  gl_Position = pos;\n}',
      frag: '#ifdef useTexture\n  uniform sampler2D texture;\n  varying vec2 uv0;\n#endif\n#ifdef alphaTest\n  uniform float alphaThreshold;\n#endif\nvarying vec4 v_fragmentColor;\nvoid main () {\n  vec4 o = v_fragmentColor;\n  #ifdef useTexture\n    o *= texture2D(texture, uv0);\n  #endif\n  #ifdef alphaTest\n    if (o.a <= alphaThreshold)\n      discard;\n  #endif\n  gl_FragColor = o;\n}',
      defines: [
        { name: 'useTexture', },
        { name: 'useModel', },
        { name: 'alphaTest', },
      ],
    },
    {
      name: 'vfx_emitter',
      vert: '#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec2 a_quad;\nvarying vec2 index;\nvoid main() {\n    index = (a_quad + 1.0) / 2.0;\n    gl_Position = vec4(a_quad, 0, 1);\n}\n',
      frag: '#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D noise;\nuniform sampler2D state;\nuniform vec2 statesize;\nuniform vec2 noisesize;\nuniform bool stopped;\nuniform float dt;\nuniform float mode;\nuniform float noiseId;\nuniform float emitVar;\nuniform float life;\nuniform float lifeVar;\nuniform vec2 pos;\nuniform vec2 posVar;\nuniform vec4 color;\nuniform vec4 colorVar;\nuniform vec4 endColor;\nuniform vec4 endColorVar;\nuniform float size;\nuniform float sizeVar;\nuniform float endSize;\nuniform float endSizeVar;\nuniform float rot;\nuniform float rotVar;\nuniform float endRot;\nuniform float endRotVar;\nuniform float angle;\nuniform float angleVar;\nuniform float speed;\nuniform float speedVar;\nuniform float radial;\nuniform float radialVar;\nuniform float tangent;\nuniform float tangentVar;\nuniform float radius;\nuniform float radiusVar;\nuniform float endRadius;\nuniform float endRadiusVar;\nuniform float rotatePS;\nuniform float rotatePSVar;\nuniform float sizeScale;\nuniform float accelScale;\nuniform float radiusScale;\nvarying vec2 index;\nconst float BASE = 255.0;\nconst float OFFSET = BASE * BASE / 2.0;\nconst float NOISE_SCALE = 10000.0;\nconst float POSITION_SCALE = 1.0;\nconst float ROTATION_SCALE = 1.0;\nconst float COLOR_SCALE = 1.0;\nconst float LIFE_SCALE = 100.0;\nconst float START_SIZE_EQUAL_TO_END_SIZE = -1.0;\nconst float START_RADIUS_EQUAL_TO_END_RADIUS = -1.0;\nfloat decode(vec2 channels, float scale) {\n    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\nvec2 encode(float value, float scale) {\n    value = value * scale + OFFSET;\n    float x = mod(value, BASE);\n    float y = floor(value / BASE);\n    return vec2(x, y) / BASE;\n}\nfloat randomMinus1To1(vec2 randomD) {\n    float random = decode(randomD, NOISE_SCALE);\n    return (random - 0.5) * 2.0;\n}\nbool doEmit (vec4 randomD) {\n    float random1 = decode(randomD.rg, NOISE_SCALE);\n    if (!stopped && (life + lifeVar) * random1 < life) {\n        return true;\n    }\n    else {\n        return false;\n    }\n}\nvec4 initLife (vec4 data, vec4 randomD) {\n    \n    if (doEmit(randomD)) {\n        float random2 = decode(randomD.ba, NOISE_SCALE);\n        float plife = life + lifeVar * random2;\n        vec2 l = encode(plife, LIFE_SCALE);\n        return vec4(l, l);\n    }\n    else {\n        return data;\n    }\n}\nvec4 initColor (float randr, float randg, float randb, float randa) {\n    vec4 random = vec4(randr, randg, randb, randa);\n    vec4 result = clamp(color + colorVar * random, 0.0, 255.0);\n    return result / 255.0;\n}\nvec4 initDeltaRG (vec2 startR, vec2 random) {\n    vec2 start = clamp(color.rg + colorVar.rg * startR, 0.0, 255.0);\n    vec2 end = clamp(endColor.rg + endColorVar.rg * random, 0.0, 255.0);\n    vec2 delta = end - start;\n    return vec4(encode(delta.x, COLOR_SCALE), encode(delta.y, COLOR_SCALE));\n}\nvec4 initDeltaBA (vec2 startR, vec2 random) {\n    vec2 start = clamp(color.ba + colorVar.ba * startR, 0.0, 255.0);\n    vec2 end = clamp(endColor.ba + endColorVar.ba * random, 0.0, 255.0);\n    vec2 delta = end - start;\n    return vec4(encode(delta.x, COLOR_SCALE), encode(delta.y, COLOR_SCALE));\n}\nvec4 initSize (float rand1, float rand2) {\n    float start = max(0.0, size + sizeVar * rand1);\n    if (endSize == START_SIZE_EQUAL_TO_END_SIZE) {\n        float delta = 0.0;\n        return vec4(encode(start, sizeScale), encode(delta, sizeScale));\n    }\n    else {\n        float end = max(0.0, endSize + endSizeVar * rand2);\n        float delta = end - start;\n        return vec4(encode(start, sizeScale), encode(delta, sizeScale));\n    }\n}\nvec4 initRotation (float rand1, float rand2) {\n    float start = rot + rotVar * rand1;\n    float end = endRot + endRotVar * rand2;\n    float delta = end - start;\n    return vec4(encode(start, ROTATION_SCALE), encode(delta, ROTATION_SCALE));\n}\nvec4 initControl1 (float rand1, float rand2) {\n    \n    if (mode == 0.0) {\n        float pAngle = angle + angleVar * rand1;\n        float dirX = cos(pAngle);\n        float dirY = sin(pAngle);\n        float pSpeed = speed + speedVar * rand2;\n        return vec4(encode(dirX * pSpeed, POSITION_SCALE), encode(dirY * pSpeed, POSITION_SCALE));\n    }\n    \n    else {\n        float pAngle = angle + angleVar * rand1;\n        float pRadius = radius + radiusVar * rand2;\n        return vec4(encode(pAngle, ROTATION_SCALE), encode(pRadius, radiusScale));\n    }\n}\nvec4 initControl2 (float startR1, float rand1, float rand2) {\n    \n    if (mode == 0.0) {\n        float pRadial = radial + radialVar * rand1;\n        float pTangent = tangent + tangentVar * rand2;\n        return vec4(encode(pRadial, accelScale), encode(pTangent, accelScale));\n    }\n    \n    else {\n        float degreesPerSecond = rotatePS + rotatePSVar * rand1;\n        float pDeltaRadius;\n        if (endRadius == START_RADIUS_EQUAL_TO_END_RADIUS) {\n            pDeltaRadius = 0.0;\n        }\n        else {\n            float pRadius = radius + radiusVar * startR1;\n            pDeltaRadius = (endRadius + endRadiusVar * rand2 - pRadius);\n        }\n        return vec4(encode(degreesPerSecond, ROTATION_SCALE), encode(pDeltaRadius, radiusScale));\n    }\n}\nvec4 initPos (float rand1, float rand2) {\n    vec2 result = pos + posVar * vec2(rand1, rand2);\n    return vec4(encode(result.x, POSITION_SCALE), encode(result.y, POSITION_SCALE));\n}\nvoid main() {\n    vec2 pixel = floor(index * statesize);\n    vec2 pindex = floor(pixel / 3.0);\n    vec2 temp = mod(pixel, vec2(3.0, 3.0));\n    float id = floor(temp.y * 3.0 + temp.x);\n    vec2 noffset = vec2(floor(noiseId / 4.0), mod(noiseId, 4.0));\n    vec2 nid = pixel + noffset;\n    vec4 randomD = texture2D(noise, nid / noisesize);\n    \n    vec4 lifeData = texture2D(state, pindex * 3.0 / statesize);\n    float rest = decode(lifeData.rg, LIFE_SCALE);\n    float life = decode(lifeData.ba, LIFE_SCALE);\n    \n    if (id == 0.0) {\n        vec4 data = texture2D(state, index);\n        if (rest <= 0.0) {\n            gl_FragColor = initLife(data, randomD);\n        }\n        else {\n            gl_FragColor = data;\n        }\n        return;\n    }\n    \n    if (rest > 0.0) {\n        vec4 data = texture2D(state, index);\n        gl_FragColor = data;\n        return;\n    }\n    vec2 lifeNid = pindex * 3.0 + noffset;\n    vec4 lifeRandomD = texture2D(noise, lifeNid / noisesize);\n    bool emitting = doEmit(lifeRandomD);\n    if (!emitting) {\n        vec4 data = texture2D(state, index);\n        gl_FragColor = data;\n        return;\n    }\n    \n    float random1 = randomMinus1To1(randomD.rg);\n    float random2 = randomMinus1To1(randomD.ba);\n    \n    if (id == 1.0) {\n        vec4 randomD3 = texture2D(noise, vec2(nid.x - 1.0, nid.y + 1.0) / noisesize);\n        float random3 = randomMinus1To1(randomD3.rg);\n        float random4 = randomMinus1To1(randomD3.ba);\n        gl_FragColor = initColor(random1, random2, random3, random4);\n        return;\n    }\n    \n    if (id == 2.0) {\n        vec4 randomD1 = texture2D(noise, vec2(nid.x - 1.0, nid.y) / noisesize);\n        float startR1 = randomMinus1To1(randomD1.rg);\n        float startR2 = randomMinus1To1(randomD1.ba);\n        vec2 startR = vec2(startR1, startR2);\n        gl_FragColor = initDeltaRG(startR, vec2(random1, random2));\n        return;\n    }\n    \n    if (id == 3.0) {\n        vec2 startR = vec2(random1, random2);\n        gl_FragColor = initDeltaBA(startR, vec2(random1, random2));\n        return;\n    }\n    \n    if (id == 4.0) {\n        gl_FragColor = initSize(random1, random2);\n        return;\n    }\n    \n    if (id == 5.0) {\n        gl_FragColor = initRotation(random1, random2);\n        return;\n    }\n    \n    if (id == 6.0) {\n        gl_FragColor = initControl1(random1, random2);\n        return;\n    }\n    \n    if (id == 7.0) {\n        vec4 randomD6 = texture2D(noise, vec2(nid.x - 1.0, nid.y) / noisesize);\n        float startR1 = randomMinus1To1(randomD6.rg);\n        gl_FragColor = initControl2(startR1, random1, random2);\n        return;\n    }\n    \n    if (id == 8.0) {\n        gl_FragColor = initPos(random1, random2);\n        return;\n    }\n}',
      defines: [
      ],
    },
    {
      name: 'vfx_particle',
      vert: '#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec2 a_quad;\nuniform mat4 model;\nuniform mat4 viewProj;\nuniform sampler2D state;\nuniform sampler2D quad;\nuniform vec2 statesize;\nuniform vec2 quadsize;\nuniform float z;\nuniform vec2 lb;\nuniform vec2 rt;\nvarying lowp vec4 v_fragmentColor;\nvarying vec2 uv0;\nconst float BASE = 255.0;\nconst float OFFSET = BASE * BASE / 2.0;\nconst float LIFE_SCALE = 100.0;\nconst float POSITION_SCALE = 1.0;\nfloat decode(vec2 channels, float scale) {\n    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\nvoid main() {\n    vec2 sIndex = floor(a_quad / 2.0) * 3.0;\n    vec4 lifeData = texture2D(state, sIndex / statesize);\n    float life = decode(lifeData.rg, LIFE_SCALE);\n    if (life <= 0.0) {\n        v_fragmentColor = vec4(0.0, 0.0, 0.0, 0.0);\n        uv0 = vec2(0.0, 0.0);\n        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n    }\n    else {\n        vec2 posIndex = a_quad / quadsize;\n        vec4 posData = texture2D(quad, posIndex);\n        vec2 pos = vec2(decode(posData.rg, POSITION_SCALE), decode(posData.ba, POSITION_SCALE));\n        vec2 cIndex = vec2(sIndex.x + 1.0, sIndex.y) / statesize;\n        vec4 color = texture2D(state, cIndex);\n        v_fragmentColor = color;\n        float u, v;\n        vec2 uvId = mod(a_quad, vec2(2.0));\n        if (uvId.x == 0.0) {\n            u = lb.x;\n        }\n        else {\n            u = rt.x;\n        }\n        if (uvId.y == 0.0) {\n            v = lb.y;\n        }\n        else {\n            v = rt.y;\n        }\n        uv0 = vec2(u, v);\n        gl_Position = viewProj * model * vec4(pos, z, 1.0);\n    }    \n}\n',
      frag: '#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D texture;\nvarying vec2 uv0;\nvarying vec4 v_fragmentColor;\nvoid main () {\n  vec4 o = v_fragmentColor;\n  o *= texture2D(texture, uv0);\n  gl_FragColor = o;\n}',
      defines: [
      ],
    },
    {
      name: 'vfx_quad',
      vert: '#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec2 a_quad;\nvarying vec2 index;\nvoid main() {\n    index = (a_quad + 1.0) / 2.0;\n    gl_Position = vec4(a_quad, 0, 1);\n}\n',
      frag: '#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D state;\nuniform vec2 quadsize;\nuniform vec2 statesize;\nuniform float sizeScale;\nvarying vec2 index;\nconst float BASE = 255.0;\nconst float OFFSET = BASE * BASE / 2.0;\nconst float LIFE_SCALE = 100.0;\nconst float POSITION_SCALE = 1.0;\nconst float ROTATION_SCALE = 1.0;\nfloat decode(vec2 channels, float scale) {\n    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\nvec2 encode(float value, float scale) {\n    value = value * scale + OFFSET;\n    float x = mod(value, BASE);\n    float y = floor(value / BASE);\n    return vec2(x, y) / BASE;\n}\nvoid main() {\n    vec2 pixel = floor(index * quadsize);\n    vec2 pIndex = floor(pixel / 2.0) * 3.0;\n    vec4 lifeData = texture2D(state, pIndex / statesize);\n    float rest = decode(lifeData.rg, LIFE_SCALE);\n    if (rest <= 0.0) {\n        gl_FragColor = vec4(encode(0.0, POSITION_SCALE), encode(0.0, POSITION_SCALE));\n        return;\n    }\n    vec2 dataIndex = (pIndex + 2.0) / statesize;\n    vec4 posData = texture2D(state, dataIndex);\n    float x = decode(posData.rg, POSITION_SCALE);\n    float y = decode(posData.ba, POSITION_SCALE);\n    vec2 pos = vec2(x, y);\n    dataIndex = (pIndex + 1.0) / statesize;\n    vec4 sizeData = texture2D(state, dataIndex);\n    float size = decode(sizeData.rg, sizeScale);\n    dataIndex.x = (pIndex.x + 2.0) / statesize.x;\n    dataIndex.y = (pIndex.y + 1.0) / statesize.y;\n    vec4 rotData = texture2D(state, dataIndex);\n    float rot = radians(mod(decode(rotData.rg, ROTATION_SCALE), 180.0));\n    float a = cos(rot);\n    float b = -sin(rot);\n    float c = -b;\n    float d = a;\n    vec2 vert = (mod(pixel, vec2(2.0)) - 0.5) * size;\n    x = vert.x * a + vert.y * c + pos.x;\n    y = vert.x * b + vert.y * d + pos.y;\n    gl_FragColor = vec4(encode(x, POSITION_SCALE), encode(y, POSITION_SCALE));\n}\n',
      defines: [
      ],
    },
    {
      name: 'vfx_update',
      vert: '#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec2 a_quad;\nvarying vec2 index;\nvoid main() {\n    index = (a_quad + 1.0) / 2.0;\n    gl_Position = vec4(a_quad, 0, 1);\n}\n',
      frag: '#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D state;\nuniform vec2 statesize;\nuniform float dt;\nuniform float mode;\nuniform vec2 gravity;\nuniform float sizeScale;\nuniform float accelScale;\nuniform float radiusScale;\nvarying vec2 index;\nconst float BASE = 255.0;\nconst float OFFSET = BASE * BASE / 2.0;\nconst float MAX_VALUE = BASE * BASE;\nconst float LIFE_SCALE = 100.0;\nconst float POSITION_SCALE = 1.0;\nconst float ROTATION_SCALE = 1.0;\nconst float COLOR_SCALE = 1.0;\nfloat decode(vec2 channels, float scale) {\n    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\nvec2 encode(float value, float scale) {\n    value = value * scale + OFFSET;\n    float x = mod(value, BASE);\n    float y = floor(value / BASE);\n    return vec2(x, y) / BASE;\n}\nvec4 updateLife (vec4 data) {\n    float rest = decode(data.rg, LIFE_SCALE);\n    rest -= dt;\n    return vec4(encode(rest, LIFE_SCALE), data.ba);\n}\nvec4 updateColor (vec4 color, vec4 deltaRG, vec4 deltaBA, float life) {\n    float r = decode(deltaRG.rg, COLOR_SCALE);\n    float g = decode(deltaRG.ba, COLOR_SCALE);\n    float b = decode(deltaBA.rg, COLOR_SCALE);\n    float a = decode(deltaBA.ba, COLOR_SCALE);\n    vec4 deltaColor = vec4(r, g, b, a) / 255.0;\n    \n    color = clamp(color + deltaColor * dt / life, 0.0, 1.0);\n    return color;\n}\nvec4 updateSize (vec4 data, float life) {\n    float size = decode(data.rg, sizeScale);\n    float deltaSize = decode(data.ba, sizeScale);\n    size = clamp(size + deltaSize * dt / life, 0.0, MAX_VALUE);\n    return vec4(encode(size, sizeScale), data.ba);\n}\nvec4 updateRotation (vec4 data, float life) {\n    float rotation = decode(data.rg, ROTATION_SCALE);\n    float deltaRotation = decode(data.ba, ROTATION_SCALE);\n    rotation = mod(rotation + deltaRotation * dt / life, 180.0);\n    return vec4(encode(rotation, ROTATION_SCALE), data.ba);\n}\nvec4 updateControl (vec4 control1, vec4 control2, vec4 posData, float life) {\n    \n    if (mode == 0.0) {\n        vec2 dir = vec2(decode(control1.rg, POSITION_SCALE), decode(control1.ba, POSITION_SCALE));\n        float radialAccel = decode(control2.rg, accelScale);\n        float tangentialAccel = decode(control2.ba, accelScale);\n        vec2 pos = vec2(decode(posData.rg, POSITION_SCALE), decode(posData.ba, POSITION_SCALE));\n        vec2 radial = normalize(pos);\n        vec2 tangential = vec2(-radial.y, radial.x);\n        radial = radial * radialAccel;\n        tangential = tangential * tangentialAccel;\n        vec2 result = dir + (radial + tangentialAccel + gravity) * dt;\n        return vec4(encode(result.x, POSITION_SCALE), encode(result.y, POSITION_SCALE));\n    }\n    \n    else {\n        float angle = mod(decode(control1.rg, ROTATION_SCALE), 180.0);\n        float radius = decode(control1.ba, radiusScale);\n        float degreesPerSecond = decode(control2.rg, ROTATION_SCALE);\n        float deltaRadius = decode(control2.ba, radiusScale);\n        angle += degreesPerSecond * dt;\n        radius += deltaRadius * dt / life;\n        return vec4(encode(angle, ROTATION_SCALE), encode(radius, radiusScale));\n    }\n}\nvec4 updatePos (vec4 posData, vec4 control) {\n    vec2 result;\n    \n    if (mode == 0.0) {\n        vec2 dir = vec2(decode(control.rg, POSITION_SCALE), decode(control.ba, POSITION_SCALE));\n        vec2 pos = vec2(decode(posData.rg, POSITION_SCALE), decode(posData.ba, POSITION_SCALE));\n        result = pos + dir * dt;\n    }\n    \n    else {\n        float angle = radians(mod(decode(control.rg, ROTATION_SCALE), 180.0));\n        float radius = decode(control.ba, radiusScale);\n        result.x = -cos(angle) * radius;\n        result.y = -sin(angle) * radius;\n    }\n    return vec4(encode(result.x, POSITION_SCALE), encode(result.y, POSITION_SCALE));\n}\nvoid main() {\n    vec2 pixel = floor(index * statesize);\n    vec2 pindex = floor(pixel / 3.0);\n    vec2 temp = mod(pixel, vec2(3.0));\n    float id = floor(temp.y * 3.0 + temp.x);\n    \n    vec4 data = texture2D(state, index);\n    vec4 lifeData = texture2D(state, pindex * 3.0 / statesize);\n    float rest = decode(lifeData.rg, LIFE_SCALE);\n    if (rest <= 0.0) {\n        gl_FragColor = data;\n        return;\n    }\n    \n    if (id == 2.0 || id == 3.0 || id == 7.0) {\n        gl_FragColor = data;\n        return;\n    }\n    float life = decode(lifeData.ba, LIFE_SCALE);\n    \n    if (id == 0.0) {\n        gl_FragColor = updateLife(data);\n        return;\n    }\n    \n    if (id == 1.0) {\n        vec2 rgIndex = vec2(pixel.x + 1.0, pixel.y) / statesize;\n        vec4 deltaRG = texture2D(state, rgIndex);\n        vec2 baIndex = vec2(pixel.x - 1.0, pixel.y + 1.0) / statesize;\n        vec4 deltaBA = texture2D(state, baIndex);\n        gl_FragColor = updateColor(data, deltaRG, deltaBA, life);\n        return;\n    }\n    \n    if (id == 4.0) {\n        gl_FragColor = updateSize(data, life);\n        return;\n    }\n    \n    if (id == 5.0) {\n        gl_FragColor = updateRotation(data, life);\n        return;\n    }\n    \n    if (id == 6.0) {\n        vec2 ctrlIndex = vec2(pixel.x + 1.0, pixel.y) / statesize;\n        vec4 control2 = texture2D(state, ctrlIndex);\n        vec2 posIndex = vec2(pixel.x + 2.0, pixel.y) / statesize;\n        vec4 pos = texture2D(state, posIndex);\n        gl_FragColor = updateControl(data, control2, pos, life);\n        return;\n    }\n    \n    if (id == 8.0) {\n        vec2 ctrlIndex = vec2(pixel.x - 2.0, pixel.y) / statesize;\n        vec4 control1 = texture2D(state, ctrlIndex);\n        gl_FragColor = updatePos(data, control1);\n        return;\n    }\n}\n',
      defines: [
      ],
    },
  ];
  
  let shaders = {
      chunks,
      templates
  };
  
  var _pool;
  var _dataPool = new Pool(() => {
    return {
      x: 0.0,
      y: 0.0,
      u: 0.0,
      v: 0.0,
      color: 0
    };
  }, 128);
  
  class RenderData {
    constructor () {
      this._data = [];
      this._indices = [];
  
      this.effect = null;
  
      this._pivotX = 0;
      this._pivotY = 0;
      this._width = 0;
      this._height = 0;
  
      this.vertexCount = 0;
      this.indiceCount = 0;
  
      this.uvDirty = true;
      this.vertDirty = true;
    }
  
    get dataLength () {
      return this._data.length;
    }
  
    set dataLength (length) {
      let data = this._data;
      // Free extra data
      for (let i = length; i < data.length; i++) {
        _dataPool.free(data[i]);
      }
      // Alloc needed data
      for (let i = data.length; i < length; i++) {
        data[i] = _dataPool.alloc();
      }
      data.length = length;
    }
  
    updateSizeNPivot (width, height, pivotX, pivotY) {
      if (width !== this._width || 
          height !== this._height ||
          pivotX !== this._pivotX ||
          pivotY !== this._pivotY) 
      {
        this._width = width;
        this._height = height;
        this._pivotX = pivotX;
        this._pivotY = pivotY;
        this.vertDirty = true;
      }
    }
    
    static alloc () {
      return _pool.alloc();
    }
  
    static free (data) {
      if (data instanceof RenderData) {
        for (let i = data.length-1; i > 0; i--) {
          _dataPool.free(data._data[i]);
        }
        data._data.length = 0;
        data._indices.length = 0;
        data.effect = null;
        data.uvDirty = true;
        data.vertDirty = true;
        data.vertexCount = 0;
        data.indiceCount = 0;
        _pool.free(data);
      }
    }
  }
  
  _pool = new Pool(() => {
    return new RenderData();
  }, 32);
  
  const BASE = 255;
  const NOISE_SCALE = 10000;
  const POS_SCALE = 1;
  const LIFE_SCALE = 100;
  const COLOR_SCALE = 1;
  const ROTATION_SCALE = 1;
  const MAX_SCALE = 500;
  let _vertexFmt = new gfx.VertexFormat([
    { name: 'a_quad', type: gfx.ATTR_TYPE_FLOAT32, num: 2 }
  ]);
  
  let _dataOpts = {
    width: 0,
    height: 0,
    minFilter: gfx.FILTER_NEAREST,
    magFilter: gfx.FILTER_NEAREST,
    wrapS: gfx.WRAP_CLAMP,
    wrapT: gfx.WRAP_CLAMP,
    format: gfx.TEXTURE_FMT_RGBA8,
    images: []
  };
  
  function encode (value, scale, outArr, offset) {
    value = value * scale + BASE * BASE / 2;
    outArr[offset] = Math.floor((value % BASE) / BASE * 255);
    outArr[offset+1] = Math.floor(Math.floor(value / BASE) / BASE * 255);
  }
  
  function decode (arr, offset, scale) {
    return (((arr[offset] / 255) * BASE +
             (arr[offset+1] / 255) * BASE * BASE) - BASE * BASE / 2) / scale;
  }
  
  function clampf (value, min_inclusive, max_inclusive) {
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
  }
  
  class Particles {
    constructor (device, renderer$$1, config) {
      this._device = device;
      this._config = config;
      this._sizeScale = 1;
      this._accelScale = 1;
      this._radiusScale = 1;
      
      let opts = {};
      let programLib = renderer$$1._programLib;
      this.programs = {
        emitter: programLib.getProgram('vfx_emitter', opts),
        update: programLib.getProgram('vfx_update', opts),
        quad: programLib.getProgram('vfx_quad', opts),
      };
  
      this.textures = {
        // need swap
        state0: new gfx.Texture2D(device, opts),
        state1: new gfx.Texture2D(device, opts),
        // no swap needed
        noise: new gfx.Texture2D(device, opts),
        quads: new gfx.Texture2D(device, opts),
      };
  
      this.framebuffers = {
        state0: new gfx.FrameBuffer(device, 0, 0, {
          colors: [this.textures.state0]
        }),
        state1: new gfx.FrameBuffer(device, 0, 0, {
          colors: [this.textures.state1]
        }),
        quads: new gfx.FrameBuffer(device, 0, 0, {
          colors: [this.textures.quads]
        })
      };
  
      let verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      let indices = new Uint8Array([ 0, 1, 2, 1, 3, 2]);
      this.buffers = {
        updateVB: new gfx.VertexBuffer(device, _vertexFmt, gfx.USAGE_STATIC, verts, 4),
        updateIB: new gfx.IndexBuffer(device, gfx.INDEX_FMT_UINT8, gfx.USAGE_STATIC, indices, 6),
        indexes: null,
        particleCache: null
      };
  
      this._elapsed = 0;
      this._stopped = false;
  
      this.updateMaxParticle(config);
      this.updateSizeScale(config);
      this.updateRadiusScale(config);
      this.updateAccelScale(config);
  
      // Vector uniforms
      this._pos = new Float32Array([config.sourcePos.x, config.sourcePos.y]);
      this._posVar = new Float32Array([config.posVar.x, config.posVar.y]);
      this._gravity = new Float32Array([config.gravity.x, config.gravity.y]);
      this._color = new Float32Array([config.startColor.r, config.startColor.g, config.startColor.b, config.startColor.a]);
      this._colorVar = new Float32Array([config.startColorVar.r, config.startColorVar.g, config.startColorVar.b, config.startColorVar.a]);
      this._endColor = new Float32Array([config.endColor.r, config.endColor.g, config.endColor.b, config.endColor.a]);
      this._endColorVar = new Float32Array([config.endColorVar.r, config.endColorVar.g, config.endColorVar.b, config.endColorVar.a]);
    }
  
    get vertexFormat () {
      return _vertexFmt;
    }
  
    // TODO: it's too slow, need other approach to retrieve the real particle count
    get particleCount () {
      let particleCount = 0;
      let device = this._device;
      device.setFrameBuffer(this.framebuffers.state0);
      let w = this.statesize[0], h = this.statesize[1],
          tw = this._tw, th = this._th,
          rgba = this.buffers.particleCache;
      device._gl.readPixels(0, 0, w, h, device._gl.RGBA, device._gl.UNSIGNED_BYTE, rgba);
      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          let offset = y * 3 * tw * 12 + x * 12;
          let rest = decode(rgba, offset, LIFE_SCALE);
          if (rest > 0) {
            particleCount++;
          }
        }
      }
      return particleCount;
    }
  
    get stopped () {
      return this._stopped;
    }
  
    updateMaxParticle (config) {
      let emissionMax = Math.floor(config.emissionRate * (config.life + config.lifeVar));
      let maxParticle;
      if (config.totalParticles > emissionMax) {
        maxParticle = emissionMax;
        this._emitVar = config.lifeVar;
      }
      else {
        maxParticle = config.totalParticles;
        this._emitVar = 0;
      }
      if (maxParticle !== this._maxParticle) {
        this._maxParticle = maxParticle;
        this._tw = Math.ceil(Math.sqrt(maxParticle));
        this._th = Math.floor(Math.sqrt(maxParticle));
        this.initTextures();
        this.initBuffers();
      }
    }
  
    set pos (pos) {
      this._pos[0] = pos.x;
      this._pos[1] = pos.y;
    }
  
    set posVar (posVar) {
      this._posVar[0] = posVar.x;
      this._posVar[1] = posVar.y;
    }
  
    set gravity (gravity) {
      this._gravity[0] = gravity.x;
      this._gravity[1] = gravity.y;
    }
  
    set startColor (color) {
      this._color[0] = color.r;
      this._color[1] = color.g;
      this._color[2] = color.b;
      this._color[3] = color.a;
    }
  
    set startColorVar (color) {
      this._colorVar[0] = color.r;
      this._colorVar[1] = color.g;
      this._colorVar[2] = color.b;
      this._colorVar[3] = color.a;
    }
  
    set endColor (color) {
      this._endColor[0] = color.r;
      this._endColor[1] = color.g;
      this._endColor[2] = color.b;
      this._endColor[3] = color.a;
    }
  
    set endColorVar (color) {
      this._endColorVar[0] = color.r;
      this._endColorVar[1] = color.g;
      this._endColorVar[2] = color.b;
      this._endColorVar[3] = color.a;
    }
  
    _updateTex (tex, data, width, height) {
      _dataOpts.images.length = 1;
      _dataOpts.images[0] = data;
      _dataOpts.width = width;
      _dataOpts.height = height;
      tex.update(_dataOpts);
    }
  
    _initNoise () {
      let tw = this._tw, th = this._th;
      let w = (tw + 1) * 3, h = (th + 1) * 3;
      let data = new Uint8Array(w * h * 4);
      let offset = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          encode(Math.random(), NOISE_SCALE, data, offset);
          encode(Math.random(), NOISE_SCALE, data, offset + 2);
          offset += 4;
        }
      }
      this._noisesize = new Float32Array([w, h]);
      this._updateTex(this.textures.noise, data, w, h);
    }
  
    initTextures () {
      let tw = this._tw, th = this._th;
      this.statesize = new Float32Array([tw * 3, th * 3]);
      this.quadsize = new Float32Array([tw * 2, th * 2]);
      let data = new Uint8Array(tw * 3 * th * 3 * 4);
      // decode([97, 97], 0, LIFE_SCALE); equals to -128, just for initalize a negative value in life
      data.fill(97);
      this._updateTex(this.textures.state0, data, tw * 3, th * 3);
      this._updateTex(this.textures.state1, data, tw * 3, th * 3);
      this._updateTex(this.textures.quads, null, tw * 2, th * 2);
      this._initNoise();
    }
  
    initBuffers () {
      var w = this.quadsize[0], h = this.quadsize[1],
          indexes = new Float32Array(w * h * 2),
          i = 0;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          indexes[i + 0] = x;
          indexes[i + 1] = y;
          i += 2;
        }
      }
      this.buffers.indexes = indexes;
      this.buffers.particleCache = new Uint8Array(this.statesize[0] * this.statesize[1] * 4);
    }
  
    updateSizeScale (config) {
      let size = config.startSize,
          sizeVar = config.startSizeVar,
          endSize = config.endSize,
          endSizeVar = config.endSizeVar;
      let scale = Math.floor(Math.pow(BASE, 2) / Math.max(size + sizeVar, endSize + endSizeVar));
      this._sizeScale = clampf(scale, 1, MAX_SCALE);
    }
  
    updateAccelScale (config) {
      let radial = config.radialAccel,
          radialVar = config.radialAccelVar,
          tangential = config.tangentialAccel,
          tangentialVar = config.tangentialAccelVar;
      let accelScale = Math.floor(Math.pow(BASE, 2) / Math.max(Math.abs(radial) + radialVar, Math.abs(tangential) + tangentialVar) / 2);
      this._accelScale = clampf(accelScale, 1, MAX_SCALE);
    }
  
    updateRadiusScale (config) {
      let radius = config.startRadius,
          radiusVar = config.startRadiusVar,
          endRadius = config.endRadius,
          endRadiusVar = config.endRadiusVar;
      let scale = Math.floor(Math.pow(BASE, 2) / Math.max(Math.abs(radius) + radiusVar, Math.abs(endRadius) + endRadiusVar));
      this._radiusScale = clampf(scale, 1, MAX_SCALE);
    }
  
    resetSystem () {
      this._stopped = false;
    }
  
    stopSystem () {
      this._stopped = true;
    }
  
    getState (framebuffer) {
      let device = this._device;
      device.setFrameBuffer(framebuffer);
      let w = this.statesize[0], h = this.statesize[1],
          tw = this._tw, th = this._th,
          rgba = new Uint8Array(w * h * 4);
      device._gl.readPixels(0, 0, w, h, device._gl.RGBA, device._gl.UNSIGNED_BYTE, rgba);
      let particles = [];
      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          let offset = y * 3 * tw * 12 + x * 12;
          let colorI = offset + 1 * 4;
          let deltaRGI = offset + 2 * 4;
          let deltaBAI = offset + tw * 12;
          let sizeI = offset + tw * 12 + 1 * 4;
          let rotI = offset + tw * 12 + 2 * 4;
          let control1I = offset + 2 * tw * 12;
          let control2I = offset + 2 * tw * 12 + 1 * 4;
          let posI = offset + 2 * tw * 12 + 2 * 4;
          
          let rest = decode(rgba, offset, LIFE_SCALE);
          let life = decode(rgba, offset + 2, LIFE_SCALE);
          let color = {
            r: rgba[colorI],
            g: rgba[colorI+1],
            b: rgba[colorI+2],
            a: rgba[colorI+3]
          };
          let deltaColor = {
            r: decode(rgba, deltaRGI, COLOR_SCALE),
            g: decode(rgba, deltaRGI + 2, COLOR_SCALE),
            b: decode(rgba, deltaBAI, COLOR_SCALE),
            a: decode(rgba, deltaBAI + 2, COLOR_SCALE)
          };
          let size = decode(rgba, sizeI, this._sizeScale);
          let deltaSize = decode(rgba, sizeI + 2, this._sizeScale);
          let rot = decode(rgba, rotI, ROTATION_SCALE);
          let deltaRot = decode(rgba, rotI + 2, ROTATION_SCALE);
          let control;
          if (this._config.emitterMode === 0) {
            control = [
              decode(rgba, control1I, POS_SCALE),
              decode(rgba, control1I + 2, POS_SCALE),
              decode(rgba, control2I, this._accelScale),
              decode(rgba, control2I + 2, this._accelScale)
            ];
          }
          else {
            control = [
              decode(rgba, control1I, ROTATION_SCALE),
              decode(rgba, control1I + 2, this._radiusScale),
              decode(rgba, control2I, ROTATION_SCALE),
              decode(rgba, control2I + 2, this._radiusScale)
            ];
          }
          let pos = {
            x: decode(rgba, posI, POS_SCALE),
            y: decode(rgba, posI + 2, POS_SCALE)
          };
          particles.push({
            rest,
            life,
            color,
            deltaColor,
            size,
            deltaSize,
            rot,
            deltaRot,
            control: control,
            pos: pos
          });
        }
      }
      return particles;
    }
  
    getNoise () {
      let device = this._device;
      let framebuffer = new gfx.FrameBuffer(device, 0, 0, {
          colors: [this.textures.noise]
        });
      device.setFrameBuffer(framebuffer);
      let w = this._noisesize[0], h = this._noisesize[1],
          rgba = new Uint8Array(w * h * 4);
      device._gl.readPixels(0, 0, w, h, device._gl.RGBA, device._gl.UNSIGNED_BYTE, rgba);
      let noises = [];
      let offset = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          noises.push(decode(rgba, offset, 10000));
          noises.push(decode(rgba, offset+2, 10000));
          offset += 4;
        }
      }
      return noises;
    }
  
    getQuads () {
      let device = this._device;
      let framebuffer = new gfx.FrameBuffer(device, 0, 0, {
          colors: [this.textures.quads]
        });
      device.setFrameBuffer(framebuffer);
      let w = this.quadsize[0], h = this.quadsize[1],
          rgba = new Uint8Array(w * h * 4);
      device._gl.readPixels(0, 0, w, h, device._gl.RGBA, device._gl.UNSIGNED_BYTE, rgba);
      let quads = [];
      let off1 = 0, off2 = 0;
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          off1 = (y * w + x) * 4;
          off2 = ((y + 1) * w + x) * 4;
          quads.push([
            decode(rgba, off1, POS_SCALE),
            decode(rgba, off1+2, POS_SCALE),
            decode(rgba, off1+4, POS_SCALE),
            decode(rgba, off1+6, POS_SCALE),
            decode(rgba, off2, POS_SCALE),
            decode(rgba, off2+2, POS_SCALE),
            decode(rgba, off2+4, POS_SCALE),
            decode(rgba, off2+6, POS_SCALE)
          ]);
        }
      }
      return quads;
    }
  
    step (dt) {
      let config = this._config;
      let device = this._device;
  
      // setup
      device.setViewport(0, 0, this.statesize[0], this.statesize[1]);
  
      // Emitter
      device.setFrameBuffer(this.framebuffers.state1);
      device.setTexture('noise', this.textures.noise, 0);
      device.setTexture('state', this.textures.state0, 1);
      device.setUniform('statesize', this.statesize);
      device.setUniform('noisesize', this._noisesize);
      device.setUniform('stopped', this._stopped);
      device.setUniform('dt', dt);
      device.setUniform('mode', config.emitterMode);
      device.setUniform('noiseId', Math.floor(Math.random() * 16));
      device.setUniform('emitVar', this._emitVar);
      device.setUniform('life', config.life);
      device.setUniform('lifeVar', config.lifeVar);
      device.setUniform('pos', this._pos);
      device.setUniform('posVar', this._posVar);
      device.setUniform('color', this._color);
      device.setUniform('colorVar', this._colorVar);
      device.setUniform('endColor', this._endColor);
      device.setUniform('endColorVar', this._endColorVar);
      device.setUniform('size', config.startSize);
      device.setUniform('sizeVar', config.startSizeVar);
      device.setUniform('endSize', config.endSize);
      device.setUniform('endSizeVar', config.endSizeVar);
      device.setUniform('rot', config.startSpin);
      device.setUniform('rotVar', config.startSpinVar);
      device.setUniform('endRot', config.endSpin);
      device.setUniform('endRotVar', config.endSpinVar);
      device.setUniform('angle', config.angle);
      device.setUniform('angleVar', config.angleVar);
      device.setUniform('speed', config.speed);
      device.setUniform('speedVar', config.speedVar);
      device.setUniform('radial', config.radialAccel);
      device.setUniform('radialVar', config.radialAccelVar);
      device.setUniform('tangent', config.tangentialAccel);
      device.setUniform('tangentVar', config.tangentialAccelVar);
      device.setUniform('radius', config.startRadius);
      device.setUniform('radiusVar', config.startRadiusVar);
      device.setUniform('endRadius', config.endRadius);
      device.setUniform('endRadiusVar', config.endRadiusVar);
      device.setUniform('rotatePS', config.rotatePerS);
      device.setUniform('rotatePSVar', config.rotatePerSVar);
      device.setUniform('sizeScale', this._sizeScale);
      device.setUniform('accelScale', this._accelScale);
      device.setUniform('radiusScale', this._radiusScale);
      device.setVertexBuffer(0, this.buffers.updateVB);
      device.setIndexBuffer(this.buffers.updateIB);
      device.setProgram(this.programs.emitter);
      device.draw(0, this.buffers.updateIB.count);
  
      // Update
      device.setFrameBuffer(this.framebuffers.state0);
      device.setTexture('state', this.textures.state1, 0);
      device.setUniform('statesize', this.statesize);
      device.setUniform('dt', dt);
      device.setUniform('mode', config.emitterMode);
      device.setUniform('gravity', this._gravity);
      device.setUniform('sizeScale', this._sizeScale);
      device.setUniform('accelScale', this._accelScale);
      device.setUniform('radiusScale', this._radiusScale);
      device.setVertexBuffer(0, this.buffers.updateVB);
      device.setIndexBuffer(this.buffers.updateIB);
      device.setProgram(this.programs.update);
      device.draw(0, this.buffers.updateIB.count);
  
      // Draw quad
      device.setViewport(0, 0, this._tw * 2, this._th * 2);
      device.setFrameBuffer(this.framebuffers.quads);
      device.setTexture('state', this.textures.state0, 0);
      device.setUniform('quadsize', this.quadsize);
      device.setUniform('statesize', this.statesize);
      device.setUniform('sizeScale', this._sizeScale);
      device.setVertexBuffer(0, this.buffers.updateVB);
      device.setIndexBuffer(this.buffers.updateIB);
      device.setProgram(this.programs.quad);
      device.draw(0, this.buffers.updateIB.count);
  
      this._elapsed += dt;
      if (config.duration !== -1 && config.duration < this._elapsed) {
        this.stopSystem();
      }
    }
  }
  
  class Asset {
    constructor(persist = true) {
      this._loaded = false;
      this._persist = persist;
    }
  
    unload() {
      this._loaded = false;
    }
  
    reload() {
      // TODO
    }
  }
  
  class Material extends Asset {
    constructor(persist = false) {
      super(persist);
  
      this._effect = null; // renderer.Effect
    }
  }
  
  class MaterialUtil {
    constructor () {
        this._cache = {};
    }
  
    get (key) {
      return this._cache[key];
    }
  
    register (key, material) {
      if (key === undefined || this._cache[key]) {
          console.warn("Material key is invalid or already exists");
      }
      else if (!material instanceof Material) {
          console.warn("Invalid Material");
      }
      else {
          this._cache[key] = material;
      }
    }
  
    unregister (key) {
      if (key !== undefined) {
          delete this._cache[key];
      }
    }
  }
  
  class SpriteMaterial extends Material {
    constructor() {
      super(false);
  
      var pass = new renderer.Pass('sprite');
      pass.setDepth(false, false);
      pass.setCullMode(gfx.CULL_NONE);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
      );
  
      let mainTech = new renderer.Technique(
        ['transparent'],
        [
          { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
        ],
        [
          pass
        ]
      );
  
      this._effect = new renderer.Effect(
        [
          mainTech,
        ],
        {},
        [
          { name: 'useTexture', value: true },
          { name: 'useModel', value: false },
          { name: 'alphaTest', value: false },
        ]
      );
      
      this._mainTech = mainTech;
    }
  
    get effect () {
      return this._effect;
    }
    
    get useTexture () {
      this._effect.getDefine('useTexture', val);
    }
  
    set useTexture(val) {
      this._effect.define('useTexture', val);
    }
    
    get useModel () {
      this._effect.getDefine('useModel', val);
    }
  
    set useModel(val) {
      this._effect.define('useModel', val);
    }
  
    get texture () {
      return this._effect.getProperty('texture');
    }
  
    set texture(val) {
      this._effect.setProperty('texture', val);
    }
  
    clone () {
      let copy = new SpriteMaterial(values);
      copy.texture = this.texture;
      copy.useTexture = this.useTexture;
      copy.useModel = this.useModel;
      return copy;
    }
  }
  
  class GraySpriteMaterial extends Material {
    constructor() {
      super(false);
  
      var pass = new renderer.Pass('gray_sprite');
      pass.setDepth(false, false);
      pass.setCullMode(gfx.CULL_NONE);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
      );
  
      let mainTech = new renderer.Technique(
        ['transparent'],
        [
          { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
        ],
        [
          pass
        ]
      );
  
      this._effect = new renderer.Effect(
        [
          mainTech,
        ],
        {},
        []
      );
      
      this._mainTech = mainTech;
    }
  
    get effect () {
      return this._effect;
    }
  
    get texture () {
      return this._effect.getProperty('texture');
    }
  
    set texture (val) {
      this._effect.setProperty('texture', val);
    }
  
    clone () {
      let copy = new GraySpriteMaterial(values);
      copy.texture = this.texture;
      return copy;
    }
  }
  
  class StencilMaterial extends Material {
    constructor() {
      super(false);
  
      this._pass = new renderer.Pass('sprite');
      this._pass.setDepth(false, false);
      this._pass.setCullMode(gfx.CULL_NONE);
      this._pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
      );
  
      let mainTech = new renderer.Technique(
        ['transparent'],
        [
          { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
          { name: 'alphaThreshold', type: renderer.PARAM_FLOAT },
        ],
        [
          this._pass
        ]
      );
  
      this._effect = new renderer.Effect(
        [
          mainTech,
        ],
        {},
        [
          { name: 'useTexture', value: true },
          { name: 'useModel', value: false },
          { name: 'alphaTest', value: true },
        ]
      );
      
      this._mainTech = mainTech;
    }
  
    get effect () {
      return this._effect;
    }
    
    get useTexture () {
      this._effect.getDefine('useTexture', val);
    }
  
    set useTexture (val) {
      this._effect.define('useTexture', val);
    }
  
    get texture () {
      return this._effect.getProperty('texture');
    }
  
    set texture (val) {
      this._effect.setProperty('texture', val);
    }
    
    get alphaThreshold () {
      return this._effect.getProperty('alphaThreshold');
    }
  
    set alphaThreshold (val) {
      this._effect.setProperty('alphaThreshold', val);
    }
  
    clone () {
      let copy = new StencilMaterial(values);
      copy.useTexture = this.useTexture;
      copy.texture = this.texture;
      copy.alphaThreshold = this.alphaThreshold;
      return copy;
    }
  }
  
  class ParticleMaterial extends Material {
    constructor() {
      super(false);
  
      var pass = new renderer.Pass('vfx_particle');
      pass.setDepth(false, false);
      pass.setCullMode(gfx.CULL_NONE);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
      );
  
      let mainTech = new renderer.Technique(
        ['transparent'],
        [
          { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
          { name: 'state', type: renderer.PARAM_TEXTURE_2D },
          { name: 'quad', type: renderer.PARAM_TEXTURE_2D },
          { name: 'z', type: renderer.PARAM_FLOAT },
          { name: 'statesize', type: renderer.PARAM_FLOAT2 },
          { name: 'quadsize', type: renderer.PARAM_FLOAT2 },
          { name: 'lb', type: renderer.PARAM_FLOAT2 },
          { name: 'rt', type: renderer.PARAM_FLOAT2 },
        ],
        [
          pass
        ]
      );
  
      this._effect = new renderer.Effect(
        [
          mainTech,
        ],
        {},
        []
      );
      
      this._mainTech = mainTech;
      this._lb = vec2.create();
      this._rt = vec2.create();
    }
  
    get effect () {
      return this._effect;
    }
  
    get texture () {
      return this._effect.getProperty('texture');
    }
  
    set texture (val) {
      this._effect.setProperty('texture', val);
    }
  
    get stateMap () {
      return this._effect.getProperty('state');
    }
  
    set stateMap (val) {
      this._effect.setProperty('state', val);
    }
  
    get quadMap () {
      return this._effect.getProperty('quad');
    }
  
    set quadMap (val) {
      this._effect.setProperty('quad', val);
    }
  
    get stateSize () {
      return this._effect.getProperty('statesize');
    }
  
    set stateSize (val) {
      this._effect.setProperty('statesize', val);
    }
  
    get quadSize () {
      return this._effect.getProperty('quadsize');
    }
  
    set quadSize (val) {
      this._effect.setProperty('quadsize', val);
    }
  
    get z () {
      return this._effect.getProperty('z');
    }
  
    set z (val) {
      this._effect.setProperty('z', val);
    }
  
    get uv () {
      let lb = this._effect.getProperty('lb');
      let rt = this._effect.getProperty('rt');
      return {
        l: lb.x,
        r: rt.x,
        b: lb.y,
        t: rt.y
      }
    }
  
    set uv (val) {
      this._lb.x = val.l;
      this._lb.y = val.b;
      this._rt.x = val.r;
      this._rt.y = val.t;
      this._effect.setProperty('lb', this._lb);
      this._effect.setProperty('rt', this._rt);
    }
  
    clone () {
      let copy = new ParticleMaterial(values);
      copy.texture = this.texture;
      copy.stateMap = this.stateMap;
      copy.quadMap = this.quadMap;
      copy.stateSize = this.stateSize;
      copy.quadSize = this.quadSize;
      copy.z = this.z;
      copy.uv = this.uv;
      return copy;
    }
  }
  
  function create3DContext (canvas, opt_attribs) {
    try {
      return canvas.getContext('webgl', opt_attribs) || canvas.getContext('experimental-webgl', opt_attribs);
    } catch (e) {
      return null;
    }
  }
  
  let supportWebGL = false;
  
  // In editor main process
  if (typeof window === 'undefined') {
    supportWebGL = true;
  }
  else {
    const sys = window.cc && window.cc.sys;
    let canvas = document.createElement("canvas");
    
    if (window.WebGLRenderingContext) {
      // if (create3DContext(canvas)) {
        supportWebGL = true;
      // }
      if (supportWebGL && sys && sys.os === sys.OS_ANDROID) {
        var browserVer = parseFloat(sys.browserVersion);
        switch (sys.browserType) {
        case sys.BROWSER_TYPE_MOBILE_QQ:
        case sys.BROWSER_TYPE_BAIDU:
        case sys.BROWSER_TYPE_BAIDU_APP:
          // QQ & Baidu Brwoser 6.2+ (using blink kernel)
          if (browserVer >= 6.2) {
              supportWebGL = true;
          }
          else {
              supportWebGL = false;
          }
          break;
        case sys.BROWSER_TYPE_ANDROID:
          // Android 5+ default browser
          if (sys.osMainVersion && sys.osMainVersion >= 5) {
              supportWebGL = true;
          }
          break;
        case sys.BROWSER_TYPE_CHROME:
          // Chrome on android supports WebGL from v. 30
          if (browserVer >= 30.0) {
              supportWebGL = true;
          } else {
              supportWebGL = false;
          }
          break;
        case sys.BROWSER_TYPE_UC:
          if (browserVer > 11.0) {
              supportWebGL = true;
          } else {
              supportWebGL = false;
          }
        case sys.BROWSER_TYPE_360:
          supportWebGL = false;
        }
      }
    }  
  }
  
  var renderMode = {
    supportWebGL,
    create3DContext
  };
  
  // intenral
  // deps
  const Scene = renderer.Scene;
  const Camera = renderer.Camera;
  const View = renderer.View;
  const ForwardRenderer = renderMode.supportWebGL ? ForwardRenderer$1 : ForwardRenderer$2;
  const Texture2D = renderMode.supportWebGL ? gfx.Texture2D : canvas.Texture2D;
  const Device = renderMode.supportWebGL ? gfx.Device : canvas.Device;
  const Model = renderer.Model;
  const InputAssembler = renderer.InputAssembler;
  
  let renderEngine = {
    // core classes
    Device,
    ForwardRenderer,
    Texture2D,
  
    // render scene
    Scene,
    Camera,
    View,
    Model,
    RenderData,
    InputAssembler,
  
    // vfx
    Particles,
    
    // assets
    Asset,
    Material,
    
    // materials
    SpriteMaterial,
    GraySpriteMaterial,
    StencilMaterial,
    ParticleMaterial,
  
    // shaders
    shaders,
  
    // utils
    renderMode,
    MaterialUtil,
  
    // memop
    RecyclePool,
    Pool,
  
    // modules
    math,
    renderer,
    gfx,
    canvas
  };
  
  return renderEngine;
  
  }());