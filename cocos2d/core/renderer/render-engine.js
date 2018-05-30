
/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 render-engine v1.2.0
 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 

'use strict';

var _d2r = Math.PI / 180.0;
var _r2d = 180.0 / Math.PI;

/**
 * @property {number} EPSILON
 */
var EPSILON = 0.000001;

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
var random = Math.random;

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
var INT_BITS = 32;
var INT_MAX =  0x7fffffff;
var INT_MIN = -1<<(INT_BITS-1);

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
  var mask = v >> (INT_BITS-1);
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
  var r, shift;
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
  var c = 32;
  v &= -v;
  if (v) { c--; }
  if (v & 0x0000FFFF) { c -= 16; }
  if (v & 0x00FF00FF) { c -= 8; }
  if (v & 0x0F0F0F0F) { c -= 4; }
  if (v & 0x33333333) { c -= 2; }
  if (v & 0x55555555) { c -= 1; }
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

var REVERSE_TABLE = new Array(256);

(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
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
  var t = v | (v - 1);
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

var _tmp = new Array(2);

var _vec2 = function _vec2(x, y) {
  this.x = x;
  this.y = y;
};

_vec2.prototype.toJSON = function toJSON () {
  _tmp[0] = this.x;
  _tmp[1] = this.y;

  return _tmp;
};

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

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
  var x = b.x - a.x,
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
  var x = b.x - a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
      y = a.y;
  var len = x * x + y * y;
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
  var z = a.x * b.y - a.y * b.x;
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
  var ax = a.x,
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
  var r = random() * 2.0 * Math.PI;
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var vec = vec2.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
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
  return ("vec2(" + (a.x) + ", " + (a.y) + ")");
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
  var a0 = a.x, a1 = a.y;
  var b0 = b.x, b1 = b.y;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
};

var _tmp$1 = new Array(3);

var _vec3 = function _vec3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

_vec3.prototype.toJSON = function toJSON () {
  _tmp$1[0] = this.x;
  _tmp$1[1] = this.y;
  _tmp$1[2] = this.z;

  return _tmp$1;
};

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

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
  var x = b.x - a.x,
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
  var x = b.x - a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
      y = a.y,
      z = a.z;

  var len = x * x + y * y + z * z;
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
  var ax = a.x, ay = a.y, az = a.z,
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
  var ax = a.x,
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
  var factorTimes2 = t * t,
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
  var inverseFactor = 1 - t,
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

  var r = random() * 2.0 * Math.PI;
  var z = (random() * 2.0) - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;

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
  var x = a.x, y = a.y, z = a.z,
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
  var x = a.x, y = a.y, z = a.z;
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

  var x = a.x, y = a.y, z = a.z;
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

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
  var p = [], r = [];
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
  var p = [], r = [];
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
  var p = [], r = [];
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
  var vec = vec3.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
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
  var tempA = vec3.create();
  var tempB = vec3.create();

  return function (a, b) {
    vec3.copy(tempA, a);
    vec3.copy(tempB, b);

    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);

    var cosine = vec3.dot(tempA, tempB);

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
  return ("vec3(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ")");
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
  var a0 = a.x, a1 = a.y, a2 = a.z;
  var b0 = b.x, b1 = b.y, b2 = b.z;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

var _tmp$2 = new Array(4);

var _vec4 = function _vec4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

_vec4.prototype.toJSON = function toJSON () {
  _tmp$2[0] = this.x;
  _tmp$2[1] = this.y;
  _tmp$2[2] = this.z;
  _tmp$2[3] = this.w;

  return _tmp$2;
};

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

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
  var x = b.x - a.x,
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
  var x = b.x - a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
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
  var x = a.x,
      y = a.y,
      z = a.z,
      w = a.w;
  var len = x * x + y * y + z * z + w * w;
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
  var ax = a.x,
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
  var x = a.x, y = a.y, z = a.z, w = a.w;
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
  var x = a.x, y = a.y, z = a.z;
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quat * vec
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

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
  var vec = vec4.create();

  return function (a, stride, offset, count, fn, arg) {
    var i, l;
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
  return ("vec4(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ", " + (a.w) + ")");
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
  var a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
  var b0 = b.x, b1 = b.y, b2 = b.z, b3 = b.w;
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

var _tmp$3 = new Array(9);

var _mat3 = function _mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
  this.m04 = m04;
  this.m05 = m05;
  this.m06 = m06;
  this.m07 = m07;
  this.m08 = m08;
};

_mat3.prototype.toJSON = function toJSON () {
  _tmp$3[0] = this.m00;
  _tmp$3[1] = this.m01;
  _tmp$3[2] = this.m02;
  _tmp$3[3] = this.m03;
  _tmp$3[4] = this.m04;
  _tmp$3[5] = this.m05;
  _tmp$3[6] = this.m06;
  _tmp$3[7] = this.m07;
  _tmp$3[8] = this.m08;

  return _tmp$3;
};

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
var mat3 = {};

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
    var a01 = a.m01, a02 = a.m02, a12 = a.m05;
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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21;

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var b00 = b.m00, b01 = b.m01, b02 = b.m02;
  var b10 = b.m03, b11 = b.m04, b12 = b.m05;
  var b20 = b.m06, b21 = b.m07, b22 = b.m08;

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;
  var x = v.x, y = v.y;

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02,
      a10 = a.m03, a11 = a.m04, a12 = a.m05,
      a20 = a.m06, a21 = a.m07, a22 = a.m08;

  var s = Math.sin(rad);
  var c = Math.cos(rad);

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
  var x = v.x, y = v.y;

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
  var s = Math.sin(rad), c = Math.cos(rad);

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
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

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
  var default_up = vec3.new(0, 1, 0);
  var x = vec3.create();
  var y = vec3.create();

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

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
  return ("mat3(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ", " + (a.m06) + ", " + (a.m07) + ", " + (a.m08) + ")");
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07, a8 = a.m08;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07, b8 = b.m08;
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

var _tmp$4 = new Array(4);

var _quat = function _quat(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

_quat.prototype.toJSON = function toJSON () {
  _tmp$4[0] = this.x;
  _tmp$4[1] = this.y;
  _tmp$4[2] = this.z;
  _tmp$4[3] = this.w;

  return _tmp$4;
};

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

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
  var tmpvec3 = vec3.create();
  var xUnitVec3 = vec3.new(1, 0, 0);
  var yUnitVec3 = vec3.new(0, 1, 0);

  return function (out, a, b) {
    var dot = vec3.dot(a, b);
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
  var rad = Math.acos(q.w) * 2.0;
  var s = Math.sin(rad / 2.0);
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
  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
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

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
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

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
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

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
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
  var v3_tmp = vec3.create();
  var q_tmp = quat.create();

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
  var q_tmp = quat.create();

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
  var x = a.x, y = a.y, z = a.z;

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

  var ax = a.x, ay = a.y, az = a.z, aw = a.w,
      bx = b.x, by = b.y, bz = b.z, bw = b.w;

  var omega, cosom, sinom, scale0, scale1;

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
  var temp1 = quat.create();
  var temp2 = quat.create();

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
  var a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0;

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
  var matr = mat3.create();

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
  var matr = mat3.create();

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
  var s = Math.sin(rad);
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

  var m00 = m.m00, m01 = m.m03, m02 = m.m06,
      m10 = m.m01, m11 = m.m04, m12 = m.m07,
      m20 = m.m02, m21 = m.m05, m22 = m.m08;

  var trace = m00 + m11 + m22;

  if (trace > 0) {
    var s = 0.5 / Math.sqrt(trace + 1.0);

    out.w = 0.25 / s;
    out.x = (m21 - m12) * s;
    out.y = (m02 - m20) * s;
    out.z = (m10 - m01) * s;

  } else if ((m00 > m11) && (m00 > m22)) {
    var s$1 = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

    out.w = (m21 - m12) / s$1;
    out.x = 0.25 * s$1;
    out.y = (m01 + m10) / s$1;
    out.z = (m02 + m20) / s$1;

  } else if (m11 > m22) {
    var s$2 = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

    out.w = (m02 - m20) / s$2;
    out.x = (m01 + m10) / s$2;
    out.y = 0.25 * s$2;
    out.z = (m12 + m21) / s$2;

  } else {
    var s$3 = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

    out.w = (m10 - m01) / s$3;
    out.x = (m02 + m20) / s$3;
    out.y = (m12 + m21) / s$3;
    out.z = 0.25 * s$3;
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
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;

  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);

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
  return ("quat(" + (a.x) + ", " + (a.y) + ", " + (a.z) + ", " + (a.w) + ")");
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

var _tmp$5 = new Array(4);

var _mat2 = function _mat2(m00, m01, m02, m03) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
};

_mat2.prototype.toJSON = function toJSON () {
  _tmp$5[0] = this.m00;
  _tmp$5[1] = this.m01;
  _tmp$5[2] = this.m02;
  _tmp$5[3] = this.m03;

  return _tmp$5;
};

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

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
    var a1 = a.m01;
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;

  // Calculate the determinant
  var det = a0 * a3 - a2 * a1;

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
  var a0 = a.m00;
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
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
  var s = Math.sin(rad),
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
  return ("mat2(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ")");
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
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

var _tmp$6 = new Array(6);

var _mat23 = function _mat23(m00, m01, m02, m03, m04, m05) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m03 = m03;
  this.m04 = m04;
  this.m05 = m05;
};

_mat23.prototype.toJSON = function toJSON () {
  _tmp$6[0] = this.m00;
  _tmp$6[1] = this.m01;
  _tmp$6[2] = this.m02;
  _tmp$6[3] = this.m03;
  _tmp$6[4] = this.m04;
  _tmp$6[5] = this.m05;

  return _tmp$6;
};

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
var mat23 = {};

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
  var aa = a.m00, ab = a.m01, ac = a.m02, ad = a.m03,
    atx = a.m04, aty = a.m05;

  var det = aa * ad - ab * ac;
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
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
  var s = Math.sin(rad), c = Math.cos(rad);
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
  return ("mat23(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ")");
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05;
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
  );
};

var _tmp$7 = new Array(16);

var _mat4 = function _mat4(
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
};

_mat4.prototype.toJSON = function toJSON () {
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
};

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
var mat4 = {};

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
    var a01 = a.m01, a02 = a.m02, a03 = a.m03,
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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

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
  var a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
      a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
      a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
      a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

  // Cache only the current line of the second matrix
  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
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
  var x = v.x, y = v.y, z = v.z,
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
  var x = v.x, y = v.y, z = v.z;

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
  var x = axis.x, y = axis.y, z = axis.z;
  var s, c, t,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      b00, b01, b02,
      b10, b11, b12,
      b20, b21, b22;

  var len = Math.sqrt(x * x + y * y + z * z);

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
  var s = Math.sin(rad),
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
  var s = Math.sin(rad),
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
  var s = Math.sin(rad),
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
  var x = axis.x, y = axis.y, z = axis.z;
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;

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
  var s = Math.sin(rad),
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
  var s = Math.sin(rad),
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
  var s = Math.sin(rad),
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
  var x = q.x, y = q.y, z = q.z, w = q.w;
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
  var m11 = mat.m00,
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
  var trace = mat.m00 + mat.m05 + mat.m10;
  var S = 0;

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
  var x = q.x, y = q.y, z = q.z, w = q.w;
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
  var sx = s.x;
  var sy = s.y;
  var sz = s.z;

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
  var x = q.x, y = q.y, z = q.z, w = q.w;
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

  var sx = s.x;
  var sy = s.y;
  var sz = s.z;

  var ox = o.x;
  var oy = o.y;
  var oz = o.z;

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
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;

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
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);

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
  var f = 1.0 / Math.tan(fovy / 2);
  var nf = 1 / (near - far);

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
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);

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
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
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
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye.x;
  var eyey = eye.y;
  var eyez = eye.z;
  var upx = up.x;
  var upy = up.y;
  var upz = up.z;
  var centerx = center.x;
  var centery = center.y;
  var centerz = center.z;

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
  return ("mat4(" + (a.m00) + ", " + (a.m01) + ", " + (a.m02) + ", " + (a.m03) + ", " + (a.m04) + ", " + (a.m05) + ", " + (a.m06) + ", " + (a.m07) + ", " + (a.m08) + ", " + (a.m09) + ", " + (a.m10) + ", " + (a.m11) + ", " + (a.m12) + ", " + (a.m13) + ", " + (a.m14) + ", " + (a.m15) + ")");
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
  var a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03,
      a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07,
      a8 = a.m08, a9 = a.m09, a10 = a.m10, a11 = a.m11,
      a12 = a.m12, a13 = a.m13, a14 = a.m14, a15 = a.m15;

  var b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03,
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

var _tmp$8 = new Array(3);

var _color3 = function _color3(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
};

_color3.prototype.toJSON = function toJSON () {
  _tmp$8[0] = this.r;
  _tmp$8[1] = this.g;
  _tmp$8[2] = this.b;

  return _tmp$8;
};

/**
 * @class Color
 * @name color3
 */
var color3 = {};

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
  var r = ((hex >> 16)) / 255.0;
  var g = ((hex >> 8) & 0xff) / 255.0;
  var b = ((hex) & 0xff) / 255.0;

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
  var ar = a.r,
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
  return ("color3(" + (a.r) + ", " + (a.g) + ", " + (a.b) + ")");
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
  var a0 = a.r, a1 = a.g, a2 = a.b;
  var b0 = b.r, b1 = b.g, b2 = b.b;
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

var _tmp$9 = new Array(4);

var _color4 = function _color4(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

_color4.prototype.toJSON = function toJSON () {
  _tmp$9[0] = this.r;
  _tmp$9[1] = this.g;
  _tmp$9[2] = this.b;
  _tmp$9[3] = this.a;

  return _tmp$9;
};

/**
 * @class Color
 * @name color4
 */
var color4 = {};

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
  var r = ((hex >> 24)) / 255.0;
  var g = ((hex >> 16) & 0xff) / 255.0;
  var b = ((hex >> 8) & 0xff) / 255.0;
  var a = ((hex) & 0xff) / 255.0;

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
  var ar = a.r,
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
  return ("color4(" + (a.r) + ", " + (a.g) + ", " + (a.b) + ", " + (a.a) + ")");
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
  var a0 = a.r, a1 = a.g, a2 = a.b, a3 = a.a;
  var b0 = b.r, b1 = b.g, b2 = b.b, b3 = b.a;
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
var bits = bits_;



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

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

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

var GL_NEAREST = 9728;                // gl.NEAREST
var GL_LINEAR = 9729;                 // gl.LINEAR
var GL_NEAREST_MIPMAP_NEAREST = 9984; // gl.NEAREST_MIPMAP_NEAREST
var GL_LINEAR_MIPMAP_NEAREST = 9985;  // gl.LINEAR_MIPMAP_NEAREST
var GL_NEAREST_MIPMAP_LINEAR = 9986;  // gl.NEAREST_MIPMAP_LINEAR
var GL_LINEAR_MIPMAP_LINEAR = 9987;   // gl.LINEAR_MIPMAP_LINEAR

// const GL_BYTE = 5120;                  // gl.BYTE
var GL_UNSIGNED_BYTE = 5121;            // gl.UNSIGNED_BYTE
// const GL_SHORT = 5122;                 // gl.SHORT
var GL_UNSIGNED_SHORT = 5123;           // gl.UNSIGNED_SHORT
var GL_UNSIGNED_INT = 5125;             // gl.UNSIGNED_INT
var GL_FLOAT = 5126;                    // gl.FLOAT
var GL_UNSIGNED_SHORT_5_6_5 = 33635;    // gl.UNSIGNED_SHORT_5_6_5
var GL_UNSIGNED_SHORT_4_4_4_4 = 32819;  // gl.UNSIGNED_SHORT_4_4_4_4
var GL_UNSIGNED_SHORT_5_5_5_1 = 32820;  // gl.UNSIGNED_SHORT_5_5_5_1
var GL_HALF_FLOAT_OES = 36193;          // gl.HALF_FLOAT_OES

var GL_DEPTH_COMPONENT = 6402; // gl.DEPTH_COMPONENT

var GL_ALPHA = 6406;            // gl.ALPHA
var GL_RGB = 6407;              // gl.RGB
var GL_RGBA = 6408;             // gl.RGBA
var GL_LUMINANCE = 6409;        // gl.LUMINANCE
var GL_LUMINANCE_ALPHA = 6410;  // gl.LUMINANCE_ALPHA

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;   // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;  // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;  // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;  // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;  // ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;  // ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // ext.COMPRESSED_RGB_ETC1_WEBGL

var _filterGL = [
  [ GL_NEAREST,  GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR ],
  [ GL_LINEAR,  GL_LINEAR_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_LINEAR ] ];

var _textureFmtGL = [
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

  // TEXTURE_FMT_D32: 26
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

  // TEXTURE_FMT_D24S8: 27
  { format: null, internalFormat: null, pixelType: null } ];

/**
 * enums
 */
var enums$1 = {
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

  console.warn(("Unknown ATTR_TYPE: " + attrType));
  return 0;
}

/**
 * @method glFilter
 * @param {WebGLContext} gl
 * @param {FILTER_*} filter
 * @param {FILTER_*} mipFilter
 */
function glFilter(gl, filter, mipFilter) {
  if ( mipFilter === void 0 ) mipFilter = -1;

  var result = _filterGL[filter][mipFilter+1];
  if (result === undefined) {
    console.warn(("Unknown FILTER: " + filter));
    return mipFilter === -1 ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR;
  }

  return result;
}

/**
 * @method glTextureFmt
 * @param {TEXTURE_FMT_*} fmt
 */
function glTextureFmt(fmt) {
  var result = _textureFmtGL[fmt];
  if (result === undefined) {
    console.warn(("Unknown TEXTURE_FMT: " + fmt));
    return _textureFmtGL[enums$1.TEXTURE_FMT_RGBA8];
  }

  return result;
}

// ====================
// exports
// ====================

var VertexFormat = function VertexFormat(infos) {
  var this$1 = this;

  this._attr2el = {};
  this._elements = [];
  this._bytes = 0;

  var offset = 0;
  for (var i = 0, len = infos.length; i < len; ++i) {
    var info = infos[i];
    var el = {
      name: info.name,
      offset: offset,
      stride: 0,
      stream: -1,
      type: info.type,
      num: info.num,
      normalize: (info.normalize === undefined) ? false : info.normalize,
      bytes: info.num * attrTypeBytes(info.type),
    };

    this$1._attr2el[el.name] = el;
    this$1._elements.push(el);

    this$1._bytes += el.bytes;
    offset += el.bytes;
  }

  for (var i$1 = 0, len$1 = this._elements.length; i$1 < len$1; ++i$1) {
    var el$1 = this$1._elements[i$1];
    el$1.stride = this$1._bytes;
  }
};

/**
 * @method element
 * @param {string} attrName
 */
VertexFormat.prototype.element = function element (attrName) {
  return this._attr2el[attrName];
};

var IndexBuffer = function IndexBuffer(device, format, usage, data, numIndices) {
  this._device = device;
  this._format = format;
  this._usage = usage;
  this._numIndices = numIndices;
  this._bytesPerIndex = 0;

  // calculate bytes
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
  device._stats.ib += this._bytes;
};

var prototypeAccessors = { count: { configurable: true } };

/**
 * @method destroy
 */
IndexBuffer.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The buffer already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteBuffer(this._glID);
  this._device._stats.ib -= this.bytes;

  this._glID = -1;
};

/**
 * @method update
 * @param {Number} offset
 * @param {ArrayBuffer} data
 */
IndexBuffer.prototype.update = function update (offset, data) {
  if (this._glID === -1) {
    console.error('The buffer is destroyed');
    return;
  }

  if (data && data.byteLength + offset > this._bytes) {
    console.error('Failed to update data, bytes exceed.');
    return;
  }

  var gl = this._device._gl;
  var glUsage = this._usage;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);
  if (!data) {
    if (this._bytes) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._bytes, glUsage);
    } else {
      console.warn('bufferData should not submit 0 bytes data');
    }
  } else {
    if (offset) {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, data);
    } else {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
    }
  }
  this._device._restoreIndexBuffer();
};

prototypeAccessors.count.get = function () {
  return this._numIndices;
};

Object.defineProperties( IndexBuffer.prototype, prototypeAccessors );

var VertexBuffer = function VertexBuffer(device, format, usage, data, numVertices) {
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
};

var prototypeAccessors$1 = { count: { configurable: true } };

/**
 * @method destroy
 */
VertexBuffer.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The buffer already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteBuffer(this._glID);
  this._device._stats.vb -= this.bytes;

  this._glID = -1;
};

/**
 * @method update
 * @param {Number} offset
 * @param {ArrayBuffer} data
 */
VertexBuffer.prototype.update = function update (offset, data) {
  if (this._glID === -1) {
    console.error('The buffer is destroyed');
    return;
  }

  if (data && data.byteLength + offset > this._bytes) {
    console.error('Failed to update data, bytes exceed.');
    return;
  }

  var gl = this._device._gl;
  var glUsage = this._usage;

  gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);
  if (!data) {
    if (this._bytes) {
      gl.bufferData(gl.ARRAY_BUFFER, this._bytes, glUsage);
    } else {
      console.warn('bufferData should not submit 0 bytes data');
    }
  } else {
    if (offset) {
      gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

prototypeAccessors$1.count.get = function () {
  return this._numVertices;
};

Object.defineProperties( VertexBuffer.prototype, prototypeAccessors$1 );

var _genID = 0;

function _parseError(out, type, errorLog) {
  errorLog.split('\n').forEach(function (msg) {
    if (msg.length < 5) {
      return;
    }

    var parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(msg);
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

var Program = function Program(device, options) {
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
};

var prototypeAccessors$2 = { id: { configurable: true } };

prototypeAccessors$2.id.get = function () {
  return this._id;
};

Program.prototype.link = function link () {
    var this$1 = this;

  if (this._linked) {
    return;
  }

  var gl = this._device._gl;

  var vertShader = _createShader(gl, gl.VERTEX_SHADER, this._vertSource);
  var fragShader = _createShader(gl, gl.FRAGMENT_SHADER, this._fragSource);

  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  var failed = false;
  var errors = this._errors;

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
    errors.forEach(function (err) {
      console.error(("Failed to compile " + (err.type) + " " + (err.fileID) + " (ln " + (err.line) + "): " + (err.message)));
    });
    return;
  }

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(("Failed to link shader program: " + (gl.getProgramInfoLog(program))));
    failed = true;
  }

  if (failed) {
    return;
  }

  this._glID = program;

  // parse attribute
  var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < numAttributes; ++i) {
    var info = gl.getActiveAttrib(program, i);
    var location = gl.getAttribLocation(program, info.name);

    this$1._attributes.push({
      name: info.name,
      location: location,
      type: info.type,
    });
  }

  // parse uniform
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i$1 = 0; i$1 < numUniforms; ++i$1) {
    var info$1 = gl.getActiveUniform(program, i$1);
    var name = info$1.name;
    var location$1 = gl.getUniformLocation(program, name);
    var isArray = name.substr(name.length - 3) === '[0]';
    if (isArray) {
      name = name.substr(0, name.length - 3);
    }

    this$1._uniforms.push({
      name: name,
      location: location$1,
      type: info$1.type,
      size: isArray ? info$1.size : undefined, // used when uniform is an array
    });
  }

  this._linked = true;
};

Program.prototype.destroy = function destroy () {
  var gl = this._device._gl;
  gl.deleteProgram(this._glID);

  this._linked = false;
  this._glID = null;
  this._attributes = [];
  this._uniforms = [];
  this._samplers = [];
};

Object.defineProperties( Program.prototype, prototypeAccessors$2 );

// ====================
// internal
// ====================

function _createShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  return shader;
}

var Texture = function Texture(device) {
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
};

/**
 * @method destroy
 */
Texture.prototype.destroy = function destroy () {
  if (this._glID === -1) {
    console.error('The texture already destroyed');
    return;
  }

  var gl = this._device._gl;
  gl.deleteTexture(this._glID);

  this._device._stats.tex -= this.bytes;
  this._glID = -1;
};

function isPow2$1(v) {
  return !(v & (v - 1)) && (!!v);
}

var Texture2D = (function (Texture$$1) {
  function Texture2D(device, options) {
    Texture$$1.call(this, device);

    var gl = this._device._gl;
    this._target = gl.TEXTURE_2D;
    this._glID = gl.createTexture();

    // always alloc texture in GPU when we create it.
    options.images = options.images || [null];
    this.update(options);
  }

  if ( Texture$$1 ) Texture2D.__proto__ = Texture$$1;
  Texture2D.prototype = Object.create( Texture$$1 && Texture$$1.prototype );
  Texture2D.prototype.constructor = Texture2D;

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
  Texture2D.prototype.update = function update (options) {
    var gl = this._device._gl;
    var genMipmap = this._hasMipmap;

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
          var maxLength = options.width > options.height ? options.width : options.height;
          if (maxLength >> (options.images.length - 1) !== 1) {
            console.error('texture-2d mipmap is invalid, should have a 1x1 mipmap.');
          }
        }
      }
    }

    // NOTE: get pot after this._width, this._height has been assigned.
    var pot = isPow2$1(this._width) && isPow2$1(this._height);
    if (!pot) {
      genMipmap = false;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    if (options.images !== undefined && options.images.length > 0) {
      this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
    }

    this._setTexInfo();

    if (genMipmap) {
      gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    this._device._restoreTexture(0);
  };

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
  Texture2D.prototype.updateSubImage = function updateSubImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setSubImage(glFmt, options);
    this._device._restoreTexture(0);
  };

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
  Texture2D.prototype.updateImage = function updateImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setImage(glFmt, options);
    this._device._restoreTexture(0);
  };

  Texture2D.prototype._setSubImage = function _setSubImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var img = options.image;

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
  };

  Texture2D.prototype._setImage = function _setImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var img = options.image;

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
  };

  Texture2D.prototype._setMipmap = function _setMipmap (images, flipY, premultiplyAlpha) {
    var this$1 = this;

    var glFmt = glTextureFmt(this._format);
    var options = {
      width: this._width,
      height: this._height,
      flipY: flipY,
      premultiplyAlpha: premultiplyAlpha,
      level: 0,
      image: null
    };

    for (var i = 0; i < images.length; ++i) {
      options.level = i;
      options.width = this$1._width >> i;
      options.height = this$1._height >> i;
      options.image = images[i];
      this$1._setImage(glFmt, options);
    }
  };

  Texture2D.prototype._setTexInfo = function _setTexInfo () {
    var gl = this._device._gl;
    var pot = isPow2$1(this._width) && isPow2$1(this._height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (this._wrapS !== enums$1.WRAP_CLAMP || this._wrapT !== enums$1.WRAP_CLAMP)) {
      console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
      this._wrapS = enums$1.WRAP_CLAMP;
      this._wrapT = enums$1.WRAP_CLAMP;
    }

    var mipFilter = this._hasMipmap ? this._mipFilter : -1;
    if (!pot && mipFilter !== -1) {
      console.warn('NPOT textures do not support mipmap filter');
      mipFilter = -1;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);

    var ext = this._device.ext('EXT_texture_filter_anisotropic');
    if (ext) {
      gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
    }
  };

  return Texture2D;
}(Texture));

var TextureCube = (function (Texture$$1) {
  function TextureCube(device, options) {
    Texture$$1.call(this, device);
    var gl = this._device._gl;
    this._target = gl.TEXTURE_CUBE_MAP;
    this._glID = gl.createTexture();
    this.update(options);
  }

  if ( Texture$$1 ) TextureCube.__proto__ = Texture$$1;
  TextureCube.prototype = Object.create( Texture$$1 && Texture$$1.prototype );
  TextureCube.prototype.constructor = TextureCube;

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
  TextureCube.prototype.update = function update (options) {
    var gl = this._device._gl;
    var genMipmap = this._hasMipmap;

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
    var pot = isPow2$1(this._width) && isPow2$1(this._height);
    if (!pot) {
      genMipmap = false;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    if (options.images !== undefined && options.images.length > 0) {
      this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
    }

    this._setTexInfo();

    if (genMipmap) {
      gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
    this._device._restoreTexture(0);
  };

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
  TextureCube.prototype.updateSubImage = function updateSubImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    this._setSubImage(glFmt, options);

    this._device._restoreTexture(0);
  };

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
  TextureCube.prototype.updateImage = function updateImage (options) {
    var gl = this._device._gl;
    var glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
    this._setImage(glFmt, options);
    this._device._restoreTexture(0);
  };

  TextureCube.prototype._setSubImage = function _setSubImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var faceIndex = options.faceIndex;
    var img = options.image;

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
  };

  TextureCube.prototype._setImage = function _setImage (glFmt, options) {
    var gl = this._device._gl;
    var flipY = options.flipY;
    var premultiplyAlpha = options.premultiplyAlpha;
    var faceIndex = options.faceIndex;
    var img = options.image;

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
  };

  // levelImages = [imagePosX, imageNegX, imagePosY, imageNegY, imagePosZ, imageNegz]
  // images = [levelImages0, levelImages1, ...]
  TextureCube.prototype._setMipmap = function _setMipmap (images, flipY, premultiplyAlpha) {
    var this$1 = this;

    var glFmt = glTextureFmt(this._format);
    var options = {
      width: this._width,
      height: this._height,
      faceIndex: 0,
      flipY: flipY,
      premultiplyAlpha: premultiplyAlpha,
      level: 0,
      image: null
    };

    for (var i = 0; i < images.length; ++i) {
      var levelImages = images[i];
      options.level = i;
      options.width = this$1._width >> i;
      options.height = this$1._height >> i;

      for (var face = 0; face < 6; ++face) {
        options.faceIndex = face;
        options.image = levelImages[face];
        this$1._setImage(glFmt, options);
      }
    }
  };

  TextureCube.prototype._setTexInfo = function _setTexInfo () {
    var gl = this._device._gl;
    var pot = isPow2$1(this._width) && isPow2$1(this._height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (this._wrapS !== enums$1.WRAP_CLAMP || this._wrapT !== enums$1.WRAP_CLAMP)) {
      console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
      this._wrapS = enums$1.WRAP_CLAMP;
      this._wrapT = enums$1.WRAP_CLAMP;
    }

    var mipFilter = this._hasMipmap ? this._mipFilter : -1;
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

    var ext = this._device.ext('EXT_texture_filter_anisotropic');
    if (ext) {
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
    }
  };

  return TextureCube;
}(Texture));

var RenderBuffer = function RenderBuffer(device, format, width, height) {
  this._device = device;
  this._format = format;
  this._width = width;
  this._height = height;

  var gl = device._gl;
  this._glID = gl.createRenderbuffer();

  gl.bindRenderbuffer(gl.RENDERBUFFER, this._glID);
  gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};

/**
 * @method destroy
 */
RenderBuffer.prototype.destroy = function destroy () {
  if (this._glID === null) {
    console.error('The render-buffer already destroyed');
    return;
  }

  var gl = this._device._gl;

  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.deleteRenderbuffer(this._glID);

  this._glID = null;
};

var FrameBuffer = function FrameBuffer(device, width, height, options) {
  this._device = device;
  this._width = width;
  this._height = height;

  this._colors = options.colors || [];
  this._depth = options.depth || null;
  this._stencil = options.stencil || null;
  this._depthStencil = options.depthStencil || null;

  this._glID = device._gl.createFramebuffer();
};

/**
 * @method destroy
 */
FrameBuffer.prototype.destroy = function destroy () {
  if (this._glID === null) {
    console.error('The frame-buffer already destroyed');
    return;
  }

  var gl = this._device._gl;

  gl.deleteFramebuffer(this._glID);

  this._glID = null;
};

var _default = {
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
  maxTextureSlot: -1,
  textureUnits: [],
  program: null,
};

var State = function State(device) {
  // bindings
  this.vertexBuffers = new Array(device._caps.maxVertexStreams);
  this.vertexBufferOffsets = new Array(device._caps.maxVertexStreams);
  this.textureUnits = new Array(device._caps.maxTextureUnits);

  this.set(_default);
};

State.initDefault = function initDefault (device) {
  _default.vertexBuffers = new Array(device._caps.maxVertexStreams);
  _default.vertexBufferOffsets = new Array(device._caps.maxVertexStreams);
  _default.textureUnits = new Array(device._caps.maxTextureUnits);
};

State.prototype.reset = function reset () {
  this.set(_default);
};

State.prototype.set = function set (cpy) {
    var this$1 = this;

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

  // buffer bindings
  this.maxStream = cpy.maxStream;
  for (var i = 0; i < cpy.vertexBuffers.length; ++i) {
    this$1.vertexBuffers[i] = cpy.vertexBuffers[i];
  }
  for (var i$1 = 0; i$1 < cpy.vertexBufferOffsets.length; ++i$1) {
    this$1.vertexBufferOffsets[i$1] = cpy.vertexBufferOffsets[i$1];
  }
  this.indexBuffer = cpy.indexBuffer;

  // texture bindings
  this.maxTextureSlot = cpy.maxTextureSlot;
  for (var i$2 = 0; i$2 < cpy.textureUnits.length; ++i$2) {
    this$1.textureUnits[i$2] = cpy.textureUnits[i$2];
  }

  this.program = cpy.program;
};

var GL_INT = 5124;
var GL_FLOAT$1 = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;

/**
 * _type2uniformCommit
 */
var _type2uniformCommit = {};
_type2uniformCommit[GL_INT] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_FLOAT$1] = function (gl, id, value) {
    gl.uniform1f(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC2] = function (gl, id, value) {
    gl.uniform2fv(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC3] = function (gl, id, value) {
    gl.uniform3fv(id, value);
  };
_type2uniformCommit[GL_FLOAT_VEC4] = function (gl, id, value) {
    gl.uniform4fv(id, value);
  };
_type2uniformCommit[GL_INT_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformCommit[GL_INT_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformCommit[GL_INT_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformCommit[GL_BOOL] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformCommit[GL_BOOL_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformCommit[GL_FLOAT_MAT2] = function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  };
_type2uniformCommit[GL_FLOAT_MAT3] = function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  };
_type2uniformCommit[GL_FLOAT_MAT4] = function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  };
_type2uniformCommit[GL_SAMPLER_2D] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };
_type2uniformCommit[GL_SAMPLER_CUBE] = function (gl, id, value) {
    gl.uniform1i(id, value);
  };

/**
 * _type2uniformArrayCommit
 */
var _type2uniformArrayCommit = {};
_type2uniformArrayCommit[GL_INT] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT$1] = function (gl, id, value) {
    gl.uniform1fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC2] = function (gl, id, value) {
    gl.uniform2fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC3] = function (gl, id, value) {
    gl.uniform3fv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_VEC4] = function (gl, id, value) {
    gl.uniform4fv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformArrayCommit[GL_INT_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC2] = function (gl, id, value) {
    gl.uniform2iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC3] = function (gl, id, value) {
    gl.uniform3iv(id, value);
  };
_type2uniformArrayCommit[GL_BOOL_VEC4] = function (gl, id, value) {
    gl.uniform4iv(id, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT2] = function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT3] = function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  };
_type2uniformArrayCommit[GL_FLOAT_MAT4] = function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  };
_type2uniformArrayCommit[GL_SAMPLER_2D] = function (gl, id, value) {
    gl.uniform1iv(id, value);
  };
_type2uniformArrayCommit[GL_SAMPLER_CUBE] = function (gl, id, value) {
    gl.uniform1iv(id, value);
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
  var attrsDirty = false;

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
    for (var i = 0; i < next.maxStream + 1; ++i) {
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
    for (var i$1 = 0; i$1 < device._caps.maxVertexAttribs; ++i$1) {
      device._newAttributes[i$1] = 0;
    }

    for (var i$2 = 0; i$2 < next.maxStream + 1; ++i$2) {
      var vb = next.vertexBuffers[i$2];
      var vbOffset = next.vertexBufferOffsets[i$2];
      if (!vb) {
        continue;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vb._glID);

      for (var j = 0; j < next.program._attributes.length; ++j) {
        var attr = next.program._attributes[j];

        var el = vb._format.element(attr.name);
        if (!el) {
          console.warn(("Can not find vertex attribute: " + (attr.name)));
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
    for (var i$3 = 0; i$3 < device._caps.maxVertexAttribs; ++i$3) {
      if (device._enabledAttributes[i$3] !== device._newAttributes[i$3]) {
        gl.disableVertexAttribArray(i$3);
        device._enabledAttributes[i$3] = 0;
      }
    }
  }
}

/**
 * _commitTextures
 */
function _commitTextures(gl, cur, next) {
  for (var i = 0; i < next.maxTextureSlot + 1; ++i) {
    if (cur.textureUnits[i] !== next.textureUnits[i]) {
      var texture = next.textureUnits[i];
      if (texture !== undefined && texture._glID !== -1) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(texture._target, texture._glID);
      }
    }
  }
}

/**
 * _attach
 */
function _attach(gl, location, attachment, face) {
  if ( face === void 0 ) face = 0;

  if (attachment instanceof Texture2D) {
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

var Device = function Device(canvasEL, opts) {
  var this$1 = this;

  var gl;

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
    'WEBGL_draw_buffers' ]);
  this._initCaps();
  this._initStates();

  // runtime
  State.initDefault(this);
  this._current = new State(this);
  this._next = new State(this);
  this._uniforms = {}; // name: { value, num, dirty }
  this._vx = this._vy = this._vw = this._vh = 0;
  this._sx = this._sy = this._sw = this._sh = 0;
  this._framebuffer = null;

  //
  this._enabledAttributes = new Array(this._caps.maxVertexAttribs);
  this._newAttributes = new Array(this._caps.maxVertexAttribs);

  for (var i = 0; i < this._caps.maxVertexAttribs; ++i) {
    this$1._enabledAttributes[i] = 0;
    this$1._newAttributes[i] = 0;
  }
};

Device.prototype._initExtensions = function _initExtensions (extensions) {
    var this$1 = this;

  var gl = this._gl;

  for (var i = 0; i < extensions.length; ++i) {
    var name = extensions[i];

    try {
      var ext = gl.getExtension(name);
      if (ext) {
        this$1._extensions[name] = ext;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

Device.prototype._initCaps = function _initCaps () {
  var gl = this._gl;
  var extDrawBuffers = this.ext('WEBGL_draw_buffers');

  this._caps.maxVertexStreams = 4;
  this._caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  this._caps.maxFragUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
  this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  this._caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

  this._caps.maxDrawBuffers = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
  this._caps.maxColorAttachments = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
};

Device.prototype._initStates = function _initStates () {
  var gl = this._gl;

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
};

Device.prototype._restoreTexture = function _restoreTexture (unit) {
  var gl = this._gl;

  var texture = this._current.textureUnits[unit];
  if (texture && texture._glID !== -1) {
    gl.bindTexture(texture._target, texture._glID);
  } else {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
};

Device.prototype._restoreIndexBuffer = function _restoreIndexBuffer () {
  var gl = this._gl;

  var ib = this._current.indexBuffer;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib ? ib._glID : null);
};

/**
 * @method ext
 * @param {string} name
 */
Device.prototype.ext = function ext (name) {
  return this._extensions[name];
};

// ===============================
// Immediate Settings
// ===============================

/**
 * @method setFrameBuffer
 * @param {FrameBuffer} fb - null means use the backbuffer
 */
Device.prototype.setFrameBuffer = function setFrameBuffer (fb) {
    var this$1 = this;

  if (this._framebuffer === fb) {
    return;
  }

  this._framebuffer = fb;
  var gl = this._gl;

  if (fb === null) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return;
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb._glID);

  var numColors = this._framebuffer._colors.length;
  for (var i = 0; i < numColors; ++i) {
    var colorBuffer = this$1._framebuffer._colors[i];
    _attach(gl, gl.COLOR_ATTACHMENT0 + i, colorBuffer);

    // TODO: what about cubemap face??? should be the target parameter for colorBuffer
  }
  for (var i$1 = numColors; i$1 < this._caps.maxColorAttachments; ++i$1) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + i$1,
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
};

/**
 * @method setViewport
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setViewport = function setViewport (x, y, w, h) {
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
};

/**
 * @method setScissor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device.prototype.setScissor = function setScissor (x, y, w, h) {
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
};

/**
 * @method clear
 * @param {Object} opts
 * @param {Array} opts.color
 * @param {Number} opts.depth
 * @param {Number} opts.stencil
 */
Device.prototype.clear = function clear (opts) {
  var gl = this._gl;
  var flags = 0;

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
};

// ===============================
// Deferred States
// ===============================

/**
 * @method enableBlend
 */
Device.prototype.enableBlend = function enableBlend () {
  this._next.blend = true;
};

/**
 * @method enableDepthTest
 */
Device.prototype.enableDepthTest = function enableDepthTest () {
  this._next.depthTest = true;
};

/**
 * @method enableDepthWrite
 */
Device.prototype.enableDepthWrite = function enableDepthWrite () {
  this._next.depthWrite = true;
};

/**
 * @method enableStencilTest
 */
Device.prototype.enableStencilTest = function enableStencilTest () {
  this._next.stencilTest = true;
};

/**
 * @method setStencilFunc
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFunc = function setStencilFunc (func, ref, mask) {
  this._next.stencilSep = false;
  this._next.stencilFuncFront = this._next.stencilFuncBack = func;
  this._next.stencilRefFront = this._next.stencilRefBack = ref;
  this._next.stencilMaskFront = this._next.stencilMaskBack = mask;
};

/**
 * @method setStencilFuncFront
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFuncFront = function setStencilFuncFront (func, ref, mask) {
  this._next.stencilSep = true;
  this._next.stencilFuncFront = func;
  this._next.stencilRefFront = ref;
  this._next.stencilMaskFront = mask;
};

/**
 * @method setStencilFuncBack
 * @param {DS_FUNC_*} func
 * @param {Number} ref
 * @param {Number} mask
 */
Device.prototype.setStencilFuncBack = function setStencilFuncBack (func, ref, mask) {
  this._next.stencilSep = true;
  this._next.stencilFuncBack = func;
  this._next.stencilRefBack = ref;
  this._next.stencilMaskBack = mask;
};

/**
 * @method setStencilOp
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOp = function setStencilOp (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilFailOpFront = this._next.stencilFailOpBack = failOp;
  this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = zFailOp;
  this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = zPassOp;
  this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = writeMask;
};

/**
 * @method setStencilOpFront
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOpFront = function setStencilOpFront (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilSep = true;
  this._next.stencilFailOpFront = failOp;
  this._next.stencilZFailOpFront = zFailOp;
  this._next.stencilZPassOpFront = zPassOp;
  this._next.stencilWriteMaskFront = writeMask;
};

/**
 * @method setStencilOpBack
 * @param {STENCIL_OP_*} failOp
 * @param {STENCIL_OP_*} zFailOp
 * @param {STENCIL_OP_*} zPassOp
 * @param {Number} writeMask
 */
Device.prototype.setStencilOpBack = function setStencilOpBack (failOp, zFailOp, zPassOp, writeMask) {
  this._next.stencilSep = true;
  this._next.stencilFailOpBack = failOp;
  this._next.stencilZFailOpBack = zFailOp;
  this._next.stencilZPassOpBack = zPassOp;
  this._next.stencilWriteMaskBack = writeMask;
};

/**
 * @method setDepthFunc
 * @param {DS_FUNC_*} depthFunc
 */
Device.prototype.setDepthFunc = function setDepthFunc (depthFunc) {
  this._next.depthFunc = depthFunc;
};

/**
 * @method setBlendColor32
 * @param {Number} rgba
 */
Device.prototype.setBlendColor32 = function setBlendColor32 (rgba) {
  this._next.blendColor = rgba;
};

/**
 * @method setBlendColor
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 */
Device.prototype.setBlendColor = function setBlendColor (r, g, b, a) {
  this._next.blendColor = ((r * 255) << 24 | (g * 255) << 16 | (b * 255) << 8 | a * 255) >>> 0;
};

/**
 * @method setBlendFunc
 * @param {BELND_*} src
 * @param {BELND_*} dst
 */
Device.prototype.setBlendFunc = function setBlendFunc (src, dst) {
  this._next.blendSep = false;
  this._next.blendSrc = src;
  this._next.blendDst = dst;
};

/**
 * @method setBlendFuncSep
 * @param {BELND_*} src
 * @param {BELND_*} dst
 * @param {BELND_*} srcAlpha
 * @param {BELND_*} dstAlpha
 */
Device.prototype.setBlendFuncSep = function setBlendFuncSep (src, dst, srcAlpha, dstAlpha) {
  this._next.blendSep = true;
  this._next.blendSrc = src;
  this._next.blendDst = dst;
  this._next.blendSrcAlpha = srcAlpha;
  this._next.blendDstAlpha = dstAlpha;
};

/**
 * @method setBlendEq
 * @param {BELND_FUNC_*} eq
 */
Device.prototype.setBlendEq = function setBlendEq (eq) {
  this._next.blendSep = false;
  this._next.blendEq = eq;
};

/**
 * @method setBlendEqSep
 * @param {BELND_FUNC_*} eq
 * @param {BELND_FUNC_*} alphaEq
 */
Device.prototype.setBlendEqSep = function setBlendEqSep (eq, alphaEq) {
  this._next.blendSep = true;
  this._next.blendEq = eq;
  this._next.blendAlphaEq = alphaEq;
};

/**
 * @method setCullMode
 * @param {CULL_*} mode
 */
Device.prototype.setCullMode = function setCullMode (mode) {
  this._next.cullMode = mode;
};

/**
 * @method setVertexBuffer
 * @param {Number} stream
 * @param {VertexBuffer} buffer
 * @param {Number} start - start vertex
 */
Device.prototype.setVertexBuffer = function setVertexBuffer (stream, buffer, start) {
    if ( start === void 0 ) start = 0;

  this._next.vertexBuffers[stream] = buffer;
  this._next.vertexBufferOffsets[stream] = start;
  if (this._next.maxStream < stream) {
    this._next.maxStream = stream;
  }
};

/**
 * @method setIndexBuffer
 * @param {IndexBuffer} buffer
 */
Device.prototype.setIndexBuffer = function setIndexBuffer (buffer) {
  this._next.indexBuffer = buffer;
};

/**
 * @method setProgram
 * @param {Program} program
 */
Device.prototype.setProgram = function setProgram (program) {
  this._next.program = program;
};

/**
 * @method setTexture
 * @param {String} name
 * @param {Texture} texture
 * @param {Number} slot
 */
Device.prototype.setTexture = function setTexture (name, texture, slot) {
  if (slot >= this._caps.maxTextureUnits) {
    console.warn(("Can not set texture " + name + " at stage " + slot + ", max texture exceed: " + (this._caps.maxTextureUnits)));
    return;
  }

  this._next.textureUnits[slot] = texture;
  this.setUniform(name, slot);

  if (this._next.maxTextureSlot < slot) {
    this._next.maxTextureSlot = slot;
  }
};

/**
 * @method setTextureArray
 * @param {String} name
 * @param {Array} textures
 * @param {Int32Array} slots
 */
Device.prototype.setTextureArray = function setTextureArray (name, textures, slots) {
    var this$1 = this;

  var len = textures.length;
  if (len >= this._caps.maxTextureUnits) {
    console.warn(("Can not set " + len + " textures for " + name + ", max texture exceed: " + (this._caps.maxTextureUnits)));
    return;
  }
  for (var i = 0; i < len; ++i) {
    var slot = slots[i];
    this$1._next.textureUnits[slot] = textures[i];
  }
  this.setUniform(name, slots);
};

/**
 * @method setUniform
 * @param {String} name
 * @param {*} value
 */
Device.prototype.setUniform = function setUniform (name, value) {
  var uniform = this._uniforms[name];
  if (!uniform) {
    var newValue = value;
    var isArray = false;
    if (value instanceof Float32Array || Array.isArray(value)) {
      newValue = new Float32Array(value);
      isArray = true;
    }
    else if (value instanceof Int32Array) {
      newValue = new Int32Array(value);
      isArray = true;
    }

    uniform = {
      dirty: true,
      value: newValue,
      isArray: isArray
    };
  } else {
    var oldValue = uniform.value;
    var dirty = false;
    if (uniform.isArray) {
      for (var i = 0, l = oldValue.length; i < l; i++) {
        if (oldValue[i] !== value[i]) {
          dirty = true;
          oldValue[i] = value[i];
        }
      }
    }
    else {
      if (oldValue !== value) {
        dirty = true;
        uniform.value = value;
      }
    }

    if (dirty) {
      uniform.dirty = true;
    }
  }
  this._uniforms[name] = uniform;
};

/**
 * @method setPrimitiveType
 * @param {PT_*} type
 */
Device.prototype.setPrimitiveType = function setPrimitiveType (type) {
  this._next.primitiveType = type;
};

/**
 * @method draw
 * @param {Number} base
 * @param {Number} count
 */
Device.prototype.draw = function draw (base, count) {
    var this$1 = this;

  var gl = this._gl;
  var cur = this._current;
  var next = this._next;

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
  var programDirty = false;
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
  for (var i = 0; i < next.program._uniforms.length; ++i) {
    var uniformInfo = next.program._uniforms[i];
    var uniform = this$1._uniforms[uniformInfo.name];
    if (!uniform) {
      // console.warn(`Can not find uniform ${uniformInfo.name}`);
      continue;
    }

    if (!programDirty && !uniform.dirty) {
      continue;
    }

    uniform.dirty = false;

    // TODO: please consider array uniform: uniformInfo.size > 0

    var commitFunc = (uniformInfo.size === undefined) ? _type2uniformCommit[uniformInfo.type] : _type2uniformArrayCommit[uniformInfo.type];
    if (!commitFunc) {
      console.warn(("Can not find commit function for uniform " + (uniformInfo.name)));
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
  // gl.bindTexture(this._framebuffer.colors[i]._target, colors[i]._glID);
  // gl.generateMipmap(this._framebuffer.colors[i]._target);
  // }

  // update stats
  this._stats.drawcalls += 1;

  // reset states
  cur.set(next);
  next.reset();
};

var gfx = {
  // classes
  VertexFormat: VertexFormat,
  IndexBuffer: IndexBuffer,
  VertexBuffer: VertexBuffer,
  Program: Program,
  Texture: Texture,
  Texture2D: Texture2D,
  TextureCube: TextureCube,
  RenderBuffer: RenderBuffer,
  FrameBuffer: FrameBuffer,
  Device: Device,

  // functions
  attrTypeBytes: attrTypeBytes,
  glFilter: glFilter,
  glTextureFmt: glTextureFmt,
};
Object.assign(gfx, enums$1);

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var InputAssembler = function InputAssembler(vb, ib, pt) {
  if ( pt === void 0 ) pt = gfx.PT_TRIANGLES;

  this._vertexBuffer = vb;
  this._indexBuffer = ib;
  this._primitiveType = pt;
  this._start = 0;
  this._count = -1;

  // TODO: instancing data
  // this._stream = 0;
};

InputAssembler.prototype.getPrimitiveCount = function getPrimitiveCount () {
  if (this._count !== -1) {
    return this._count;
  }

  if (this._indexBuffer) {
    return this._indexBuffer.count;
  }

  return this._vertexBuffer.count;
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var Pass = function Pass(name) {
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
  this._depthFunc = gfx.DS_FUNC_LESS, this._stencilTest = false;
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
};

Pass.prototype.setCullMode = function setCullMode (cullMode) {
  this._cullMode = cullMode;
};

Pass.prototype.setBlend = function setBlend (
  blendEq,
  blendSrc,
  blendDst,
  blendAlphaEq,
  blendSrcAlpha,
  blendDstAlpha,
  blendColor
) {
    if ( blendEq === void 0 ) blendEq = gfx.BLEND_FUNC_ADD;
    if ( blendSrc === void 0 ) blendSrc = gfx.BLEND_ONE;
    if ( blendDst === void 0 ) blendDst = gfx.BLEND_ZERO;
    if ( blendAlphaEq === void 0 ) blendAlphaEq = gfx.BLEND_FUNC_ADD;
    if ( blendSrcAlpha === void 0 ) blendSrcAlpha = gfx.BLEND_ONE;
    if ( blendDstAlpha === void 0 ) blendDstAlpha = gfx.BLEND_ZERO;
    if ( blendColor === void 0 ) blendColor = 0xffffffff;

  this._blend = true;
  this._blendEq = blendEq;
  this._blendSrc = blendSrc;
  this._blendDst = blendDst;
  this._blendAlphaEq = blendAlphaEq;
  this._blendSrcAlpha = blendSrcAlpha;
  this._blendDstAlpha = blendDstAlpha;
  this._blendColor = blendColor;
};

Pass.prototype.setDepth = function setDepth (
  depthTest,
  depthWrite,
  depthFunc
) {
    if ( depthTest === void 0 ) depthTest = false;
    if ( depthWrite === void 0 ) depthWrite = false;
    if ( depthFunc === void 0 ) depthFunc = gfx.DS_FUNC_LESS;

  this._depthTest = depthTest;
  this._depthWrite = depthWrite;
  this._depthFunc = depthFunc;
};

Pass.prototype.setStencilFront = function setStencilFront (
  stencilFunc,
  stencilRef,
  stencilMask,
  stencilFailOp,
  stencilZFailOp,
  stencilZPassOp,
  stencilWriteMask
) {
    if ( stencilFunc === void 0 ) stencilFunc = gfx.DS_FUNC_ALWAYS;
    if ( stencilRef === void 0 ) stencilRef = 0;
    if ( stencilMask === void 0 ) stencilMask = 0xff;
    if ( stencilFailOp === void 0 ) stencilFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZFailOp === void 0 ) stencilZFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZPassOp === void 0 ) stencilZPassOp = gfx.STENCIL_OP_KEEP;
    if ( stencilWriteMask === void 0 ) stencilWriteMask = 0xff;

  this._stencilTest = true;
  this._stencilFuncFront = stencilFunc;
  this._stencilRefFront = stencilRef;
  this._stencilMaskFront = stencilMask;
  this._stencilFailOpFront = stencilFailOp;
  this._stencilZFailOpFront = stencilZFailOp;
  this._stencilZPassOpFront = stencilZPassOp;
  this._stencilWriteMaskFront = stencilWriteMask;
};

Pass.prototype.setStencilBack = function setStencilBack (
  stencilFunc,
  stencilRef,
  stencilMask,
  stencilFailOp,
  stencilZFailOp,
  stencilZPassOp,
  stencilWriteMask
) {
    if ( stencilFunc === void 0 ) stencilFunc = gfx.DS_FUNC_ALWAYS;
    if ( stencilRef === void 0 ) stencilRef = 0;
    if ( stencilMask === void 0 ) stencilMask = 0xff;
    if ( stencilFailOp === void 0 ) stencilFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZFailOp === void 0 ) stencilZFailOp = gfx.STENCIL_OP_KEEP;
    if ( stencilZPassOp === void 0 ) stencilZPassOp = gfx.STENCIL_OP_KEEP;
    if ( stencilWriteMask === void 0 ) stencilWriteMask = 0xff;

  this._stencilTest = true;
  this._stencilFuncBack = stencilFunc;
  this._stencilRefBack = stencilRef;
  this._stencilMaskBack = stencilMask;
  this._stencilFailOpBack = stencilFailOp;
  this._stencilZFailOpBack = stencilZFailOp;
  this._stencilZPassOpBack = stencilZPassOp;
  this._stencilWriteMaskBack = stencilWriteMask;
};

Pass.prototype.disableStencilTest = function disableStencilTest () {
  this._stencilTest = false;
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _stageOffset = 0;
var _name2stageID = {};

var config = {
  addStage: function (name) {
    // already added
    if (_name2stageID[name] !== undefined) {
      return;
    }

    var stageID = 1 << _stageOffset;
    _name2stageID[name] = stageID;

    _stageOffset += 1;
  },

  stageID: function (name) {
    var id = _name2stageID[name];
    if (id === undefined) {
      return -1;
    }
    return id;
  },

  stageIDs: function (nameList) {
    var key = 0;
    for (var i = 0; i < nameList.length; ++i) {
      var id = _name2stageID[nameList[i]];
      if (id !== undefined) {
        key |= id;
      }
    }
    return key;
  }
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _genID$1 = 0;

var Technique = function Technique(stages, parameters, passes, layer) {
  if ( layer === void 0 ) layer = 0;

  this._id = _genID$1++;
  this._stageIDs = config.stageIDs(stages);
  this._parameters = parameters; // {name, type, size, val}
  this._passes = passes;
  this._layer = layer;
  // TODO: this._version = 'webgl' or 'webgl2' // ????
};

var prototypeAccessors$3 = { passes: { configurable: true },stageIDs: { configurable: true } };

Technique.prototype.setStages = function setStages (stages) {
  this._stageIDs = config.stageIDs(stages);
};

prototypeAccessors$3.passes.get = function () {
  return this._passes;
};

prototypeAccessors$3.stageIDs.get = function () {
  return this._stageIDs;
};

Object.defineProperties( Technique.prototype, prototypeAccessors$3 );

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var Effect = function Effect(techniques, properties, defines) {
  if ( properties === void 0 ) properties = {};
  if ( defines === void 0 ) defines = [];

  this._techniques = techniques;
  this._properties = properties;
  this._defines = defines;

  // TODO: check if params is valid for current technique???
};

Effect.prototype.clear = function clear () {
  this._techniques.length = 0;
  this._properties = null;
  this._defines.length = 0;
};

Effect.prototype.getTechnique = function getTechnique (stage) {
    var this$1 = this;

  var stageID = config.stageID(stage);
  for (var i = 0; i < this._techniques.length; ++i) {
    var tech = this$1._techniques[i];
    if (tech.stageIDs & stageID) {
      return tech;
    }
  }

  return null;
};

Effect.prototype.getProperty = function getProperty (name) {
  return this._properties[name];
};

Effect.prototype.setProperty = function setProperty (name, value) {
  // TODO: check if params is valid for current technique???
  this._properties[name] = value;
};

Effect.prototype.getDefine = function getDefine (name) {
    var this$1 = this;

  for (var i = 0; i < this._defines.length; ++i) {
    var def = this$1._defines[i];
    if ( def.name === name ) {
      return def.value;
    }
  }

  console.warn(("Failed to get define " + name + ", define not found."));
  return null;
};

Effect.prototype.define = function define (name, value) {
    var this$1 = this;

  for (var i = 0; i < this._defines.length; ++i) {
    var def = this$1._defines[i];
    if ( def.name === name ) {
      def.value = value;
      return;
    }
  }

  console.warn(("Failed to set define " + name + ", define not found."));
};

Effect.prototype.extractDefines = function extractDefines (out) {
    var this$1 = this;
    if ( out === void 0 ) out = {};

  for (var i = 0; i < this._defines.length; ++i) {
    var def = this$1._defines[i];
    out[def.name] = def.value;
  }

  return out;
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

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

  var verts = [];
  var vcount = data.positions.length / 3;

  for (var i = 0; i < vcount; ++i) {
    verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);

    if (data.normals) {
      verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
    }

    if (data.uvs) {
      verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
    }
  }

  var vfmt = [];
  vfmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  if (data.normals) {
    vfmt.push({ name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  }
  if (data.uvs) {
    vfmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
  }

  var vb = new gfx.VertexBuffer(
    device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    new Float32Array(verts),
    vcount
  );

  var ib = null;
  if (data.indices) {
    ib = new gfx.IndexBuffer(
      device,
      gfx.INDEX_FMT_UINT16,
      gfx.USAGE_STATIC,
      new Uint16Array(data.indices),
      data.indices.length
    );
  }

  return new InputAssembler(vb, ib);
}

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _m4_tmp = mat4.create();
var _genID$2 = 0;

var View = function View() {
  this._id = _genID$2++;

  // viewport
  this._rect = {
    x: 0, y: 0, w: 1, h: 1
  };

  // TODO:
  // this._scissor = {
  // x: 0, y: 0, w: 1, h: 1
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
};

View.prototype.getForward = function getForward (out) {
  return vec3.set(
    out,
    -this._matView.m02,
    -this._matView.m06,
    -this._matView.m10
  );
};

View.prototype.getPosition = function getPosition (out) {
  mat4.invert(_m4_tmp, this._matView);
  return mat4.getTranslation(out, _m4_tmp);
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _forward = vec3.new(0, 0, -1);

var _m4_tmp$1 = mat4.create();
var _m3_tmp = mat3.create();
var _transformedLightDirection = vec3.create();

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
  var halfSize = light._shadowFustumSize / 2;
  mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computePointLightViewProjMatrix(light, outView, outProj) {
  // TODO:
}

var Light = function Light() {
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
};

var prototypeAccessors$4 = { color: { configurable: true },intensity: { configurable: true },type: { configurable: true },spotAngle: { configurable: true },spotExp: { configurable: true },range: { configurable: true },shadowType: { configurable: true },shadowMap: { configurable: true },viewProjMatrix: { configurable: true },shadowResolution: { configurable: true },shadowBias: { configurable: true },shadowDarkness: { configurable: true },shadowMinDepth: { configurable: true },shadowMaxDepth: { configurable: true },shadowDepthScale: { configurable: true },frustumEdgeFalloff: { configurable: true } };

Light.prototype.setNode = function setNode (node) {
  this._node = node;
};

Light.prototype.setColor = function setColor (r, g, b) {
  color3.set(this._color, r, g, b);
  this._colorUniform[0] = r * this._intensity;
  this._colorUniform[1] = g * this._intensity;
  this._colorUniform[2] = b * this._intensity;
};
prototypeAccessors$4.color.get = function () {
  return this._color;
};

Light.prototype.setIntensity = function setIntensity (val) {
  this._intensity = val;
  this._colorUniform[0] = val * this._color.r;
  this._colorUniform[1] = val * this._color.g;
  this._colorUniform[2] = val * this._color.b;
};
prototypeAccessors$4.intensity.get = function () {
  return this._intensity;
};

Light.prototype.setType = function setType (tpe) {
  this._type = tpe;
};
prototypeAccessors$4.type.get = function () {
  return this._type;
};

Light.prototype.setSpotAngle = function setSpotAngle (val) {
  this._spotAngle = val;
  this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
};
prototypeAccessors$4.spotAngle.get = function () {
  return this._spotAngle;
};

Light.prototype.setSpotExp = function setSpotExp (val) {
  this._spotExp = val;
  this._spotUniform[1] = val;
};
prototypeAccessors$4.spotExp.get = function () {
  return this._spotExp;
};

Light.prototype.setRange = function setRange (tpe) {
  this._range = tpe;
};
prototypeAccessors$4.range.get = function () {
  return this._range;
};

Light.prototype.setShadowType = function setShadowType (type) {
  if (this._shadowType === enums.SHADOW_NONE && type !== enums.SHADOW_NONE) {
    this._shadowMapDirty = true;
  }
  this._shadowType = type;
};
prototypeAccessors$4.shadowType.get = function () {
  return this._shadowType;
};

prototypeAccessors$4.shadowMap.get = function () {
  return this._shadowMap;
};

prototypeAccessors$4.viewProjMatrix.get = function () {
  return this._viewProjMatrix;
};

Light.prototype.setShadowResolution = function setShadowResolution (val) {
  if (this._shadowResolution !== val) {
    this._shadowMapDirty = true;
  }
  this._shadowResolution = val;
};
prototypeAccessors$4.shadowResolution.get = function () {
  return this._shadowResolution;
};

Light.prototype.setShadowBias = function setShadowBias (val) {
  this._shadowBias = val;
};
prototypeAccessors$4.shadowBias.get = function () {
  return this._shadowBias;
};

Light.prototype.setShadowDarkness = function setShadowDarkness (val) {
  this._shadowDarkness = val;
};
prototypeAccessors$4.shadowDarkness.get = function () {
  return this._shadowDarkness;
};

Light.prototype.setShadowMinDepth = function setShadowMinDepth (val) {
  this._shadowMinDepth = val;
};
prototypeAccessors$4.shadowMinDepth.get = function () {
  if (this._type === enums.LIGHT_DIRECTIONAL) {
    return 1.0;
  }
  return this._shadowMinDepth;
};

Light.prototype.setShadowMaxDepth = function setShadowMaxDepth (val) {
  this._shadowMaxDepth = val;
};
prototypeAccessors$4.shadowMaxDepth.get = function () {
  if (this._type === enums.LIGHT_DIRECTIONAL) {
    return 1.0;
  }
  return this._shadowMaxDepth;
};

Light.prototype.setShadowDepthScale = function setShadowDepthScale (val) {
  this._shadowDepthScale = val;
};
prototypeAccessors$4.shadowDepthScale.get = function () {
  return this._shadowDepthScale;
};

Light.prototype.setFrustumEdgeFalloff = function setFrustumEdgeFalloff (val) {
  this._frustumEdgeFalloff = val;
};
prototypeAccessors$4.frustumEdgeFalloff.get = function () {
  return this._frustumEdgeFalloff;
};

Light.prototype.extractView = function extractView (out, stages) {
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
};

Light.prototype._updateLightPositionAndDirection = function _updateLightPositionAndDirection () {
  this._node.getWorldMatrix(_m4_tmp$1);
  mat3.fromMat4(_m3_tmp, _m4_tmp$1);
  vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);
  vec3.array(this._directionUniform, _transformedLightDirection);
  var pos = this._positionUniform;
  pos[0] = _m4_tmp$1.m12;
  pos[1] = _m4_tmp$1.m13;
  pos[2] = _m4_tmp$1.m14;
};

Light.prototype._generateShadowMap = function _generateShadowMap (device) {
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
};

Light.prototype._destroyShadowMap = function _destroyShadowMap () {
  if (this._shadowMap) {
    this._shadowMap.destroy();
    this._shadowDepthBuffer.destroy();
    this._shadowFrameBuffer.destroy();
    this._shadowMap = null;
    this._shadowDepthBuffer = null;
    this._shadowFrameBuffer = null;
  }
};

Light.prototype.update = function update (device) {
  this._updateLightPositionAndDirection();

  if (this._shadowType === enums.SHADOW_NONE) {
    this._destroyShadowMap();
  } else if (this._shadowMapDirty) {
    this._destroyShadowMap();
    this._generateShadowMap(device);
    this._shadowMapDirty = false;
  }

};

Object.defineProperties( Light.prototype, prototypeAccessors$4 );

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _matView = mat4.create();
var _matProj = mat4.create();
var _matViewProj = mat4.create();
var _matInvViewProj = mat4.create();
var _tmp_v3 = vec3.create();

var Camera = function Camera() {
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
};

var prototypeAccessors$5 = { cullingMask: { configurable: true } };

// culling mask
prototypeAccessors$5.cullingMask.get = function () {
  return this._cullingMask;
};

prototypeAccessors$5.cullingMask.set = function (mask) {
  this._cullingMask = mask;
};

// node
Camera.prototype.getNode = function getNode () {
  return this._node;
};
Camera.prototype.setNode = function setNode (node) {
  this._node = node;
};

// type
Camera.prototype.getType = function getType () {
  return this._projection;
};
Camera.prototype.setType = function setType (type) {
  this._projection = type;
};

// orthoHeight
Camera.prototype.getOrthoHeight = function getOrthoHeight () {
  return this._orthoHeight;
};
Camera.prototype.setOrthoHeight = function setOrthoHeight (val) {
  this._orthoHeight = val;
};

// fov
Camera.prototype.getFov = function getFov () {
  return this._fov;
};
Camera.prototype.setFov = function setFov (fov) {
  this._fov = fov;
};

// near
Camera.prototype.getNear = function getNear () {
  return this._near;
};
Camera.prototype.setNear = function setNear (near) {
  this._near = near;
};

// far
Camera.prototype.getFar = function getFar () {
  return this._far;
};
Camera.prototype.setFar = function setFar (far) {
  this._far = far;
};

// color
Camera.prototype.getColor = function getColor (out) {
  return color4.copy(out, this._color);
};
Camera.prototype.setColor = function setColor (r, g, b, a) {
  color4.set(this._color, r, g, b, a);
};

// depth
Camera.prototype.getDepth = function getDepth () {
  return this._depth;
};
Camera.prototype.setDepth = function setDepth (depth) {
  this._depth = depth;
};

// stencil
Camera.prototype.getStencil = function getStencil () {
  return this._stencil;
};
Camera.prototype.setStencil = function setStencil (stencil) {
  this._stencil = stencil;
};

// clearFlags
Camera.prototype.getClearFlags = function getClearFlags () {
  return this._clearFlags;
};
Camera.prototype.setClearFlags = function setClearFlags (flags) {
  this._clearFlags = flags;
};

// rect
Camera.prototype.getRect = function getRect (out) {
  out.x = this._rect.x;
  out.y = this._rect.y;
  out.w = this._rect.w;
  out.h = this._rect.h;

  return out;
};
/**
 * @param {Number} x - [0,1]
 * @param {Number} y - [0,1]
 * @param {Number} w - [0,1]
 * @param {Number} h - [0,1]
 */
Camera.prototype.setRect = function setRect (x, y, w, h) {
  this._rect.x = x;
  this._rect.y = y;
  this._rect.w = w;
  this._rect.h = h;
};

// stages
Camera.prototype.getStages = function getStages () {
  return this._stages;
};
Camera.prototype.setStages = function setStages (stages) {
  this._stages = stages;
};

// framebuffer
Camera.prototype.getFramebuffer = function getFramebuffer () {
  return this._framebuffer;
};
Camera.prototype.setFramebuffer = function setFramebuffer (framebuffer) {
  this._framebuffer = framebuffer;
};

Camera.prototype.extractView = function extractView (out, width, height) {
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
  var aspect = width / height;
  if (this._projection === enums.PROJ_PERSPECTIVE) {
    mat4.perspective(out._matProj,
      this._fov,
      aspect,
      this._near,
      this._far
    );
  } else {
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
    mat4.ortho(out._matProj,
      -x, x, -y, y, this._near, this._far
    );
  }

  // view-projection
  mat4.mul(out._matViewProj, out._matProj, out._matView);
  mat4.invert(out._matInvViewProj, out._matViewProj);
};

Camera.prototype.screenToWorld = function screenToWorld (out, screenPos, width, height) {
  var aspect = width / height;
  var cx = this._rect.x * width;
  var cy = this._rect.y * height;
  var cw = this._rect.w * width;
  var ch = this._rect.h * height;

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
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
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
    var range = this._farClip - this._nearClip;
    vec3.set(out,
      (screenPos.x - cx) * 2.0 / cw - 1.0,
      (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
      (this._far - screenPos.z) / range * 2.0 - 1.0
    );

    // transform to world
    vec3.transformMat4(out, out, _matInvViewProj);
  }

  return out;
};

Camera.prototype.worldToScreen = function worldToScreen (out, worldPos, width, height) {
  var aspect = width / height;
  var cx = this._rect.x * width;
  var cy = this._rect.y * height;
  var cw = this._rect.w * width;
  var ch = this._rect.h * height;

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
    var x = this._orthoHeight * aspect;
    var y = this._orthoHeight;
    mat4.ortho(_matProj,
      -x, x, -y, y, this._near, this._far
    );
  }

  // view-projection
  mat4.mul(_matViewProj, _matProj, _matView);

  // calculate w
  var w =
    worldPos.x * _matViewProj.m03 +
    worldPos.y * _matViewProj.m07 +
    worldPos.z * _matViewProj.m11 +
    _matViewProj.m15;

  vec3.transformMat4(out, worldPos, _matViewProj);
  out.x = cx + (out.x / w + 1) * 0.5 * cw;
  out.y = cy + (out.y / w + 1) * 0.5 * ch;

  return out;
};

Object.defineProperties( Camera.prototype, prototypeAccessors$5 );

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var Model = function Model() {
  this._poolID = -1;
  this._node = null;
  this._inputAssemblers = [];
  this._effects = [];
  this._defines = [];
  this._dynamicIA = false;
  this._cullingMask = -1;

  // TODO: we calculate aabb based on vertices
  // this._aabb
};

var prototypeAccessors$6 = { inputAssemblerCount: { configurable: true },dynamicIA: { configurable: true },drawItemCount: { configurable: true },cullingMask: { configurable: true } };

prototypeAccessors$6.inputAssemblerCount.get = function () {
  return this._inputAssemblers.length;
};

prototypeAccessors$6.dynamicIA.get = function () {
  return this._dynamicIA;
};

prototypeAccessors$6.drawItemCount.get = function () {
  return this._dynamicIA ? 1 : this._inputAssemblers.length;
};

prototypeAccessors$6.cullingMask.get = function () {
  return this._cullingMask;
};

prototypeAccessors$6.cullingMask.set = function (mask) {
  this._cullingMask = mask;
};

Model.prototype.setNode = function setNode (node) {
  this._node = node;
};

Model.prototype.setDynamicIA = function setDynamicIA (enabled) {
  this._dynamicIA = enabled;
};

Model.prototype.addInputAssembler = function addInputAssembler (ia) {
  if (this._inputAssemblers.indexOf(ia) !== -1) {
    return;
  }
  this._inputAssemblers.push(ia);
};

Model.prototype.clearInputAssemblers = function clearInputAssemblers () {
  this._inputAssemblers.length = 0;
};

Model.prototype.addEffect = function addEffect (effect) {
  if (this._effects.indexOf(effect) !== -1) {
    return;
  }
  this._effects.push(effect);

  //
  var defs = Object.create(null);
  effect.extractDefines(defs);
  this._defines.push(defs);
};

Model.prototype.clearEffects = function clearEffects () {
  this._effects.length = 0;
  this._defines.length = 0;
};

Model.prototype.extractDrawItem = function extractDrawItem (out, index) {
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

  var effect, defines;
  if (index < this._effects.length) {
    effect = this._effects[index];
    defines = this._defines[index];
  } else {
    effect = this._effects[this._effects.length-1];
    defines = this._defines[this._effects.length-1];
  }
  out.effect = effect;
  out.defines = effect.extractDefines(defines);
};

Object.defineProperties( Model.prototype, prototypeAccessors$6 );

// reference: https://github.com/mziccard/node-timsort

/**
 * Default minimum size of a run.
 */
var DEFAULT_MIN_MERGE = 32;

/**
 * Minimum ordered subsequece required to do galloping.
 */
var DEFAULT_MIN_GALLOPING = 7;

/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
var DEFAULT_TMP_STORAGE_LENGTH = 256;

/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */
var POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

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

    var al = log10$1(a);
    var bl = log10$1(b);

    var t = 0;

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

  var aStr = String(a);
  var bStr = String(b);

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
  var r = 0;

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
  var runHi = lo + 1;

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
    var t = array[lo];
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
    var pivot = array[start];

    // Ranges of the array where pivot belongs
    var left = lo;
    var right = start;

    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */
    while (left < right) {
      var mid = (left + right) >>> 1;

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
    var n = start - left;
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
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

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
    var tmp = lastOffset;
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
    var m = lastOffset + ((offset - lastOffset) >>> 1);

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
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

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
    var tmp = lastOffset;
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
    var m = lastOffset + ((offset - lastOffset) >>> 1);

    if (compare(value, array[start + m]) < 0) {
      offset = m;

    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

var TimSort = function TimSort(array, compare) {
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
};

/**
 * Push a new run on TimSort's stack.
 *
 * @param {number} runStart - Start index of the run in the original array.
 * @param {number} runLength - Length of the run;
 */
TimSort.prototype.pushRun = function pushRun (runStart, runLength) {
  this.runStart[this.stackSize] = runStart;
  this.runLength[this.stackSize] = runLength;
  this.stackSize += 1;
};

/**
 * Merge runs on TimSort's stack so that the following holds for all i:
 * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
 * 2) runLength[i - 2] > runLength[i - 1]
 */
TimSort.prototype.mergeRuns = function mergeRuns () {
    var this$1 = this;

  while (this.stackSize > 1) {
    var n = this$1.stackSize - 2;

    if ((n >= 1 &&
      this$1.runLength[n - 1] <= this$1.runLength[n] + this$1.runLength[n + 1]) ||
      (n >= 2 &&
      this$1.runLength[n - 2] <= this$1.runLength[n] + this$1.runLength[n - 1])) {

      if (this$1.runLength[n - 1] < this$1.runLength[n + 1]) {
        n--;
      }

    } else if (this$1.runLength[n] > this$1.runLength[n + 1]) {
      break;
    }
    this$1.mergeAt(n);
  }
};

/**
 * Merge all runs on TimSort's stack until only one remains.
 */
TimSort.prototype.forceMergeRuns = function forceMergeRuns () {
    var this$1 = this;

  while (this.stackSize > 1) {
    var n = this$1.stackSize - 2;

    if (n > 0 && this$1.runLength[n - 1] < this$1.runLength[n + 1]) {
      n--;
    }

    this$1.mergeAt(n);
  }
};

/**
 * Merge the runs on the stack at positions i and i+1. Must be always be called
 * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
 *
 * @param {number} i - Index of the run to merge in TimSort's stack.
 */
TimSort.prototype.mergeAt = function mergeAt (i) {
  var compare = this.compare;
  var array = this.array;

  var start1 = this.runStart[i];
  var length1 = this.runLength[i];
  var start2 = this.runStart[i + 1];
  var length2 = this.runLength[i + 1];

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
  var k = gallopRight(array[start2], array, start1, length1, 0, compare);
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
};

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
TimSort.prototype.mergeLow = function mergeLow (start1, length1, start2, length2) {

  var compare = this.compare;
  var array = this.array;
  var tmp = this.tmp;
  var i = 0;

  for (i = 0; i < length1; i++) {
    tmp[i] = array[start1 + i];
  }

  var cursor1 = 0;
  var cursor2 = start2;
  var dest = start1;

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

  var minGallop = this.minGallop;

  while (true) {
    var count1 = 0;
    var count2 = 0;
    var exit = false;

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
};

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
TimSort.prototype.mergeHigh = function mergeHigh (start1, length1, start2, length2) {
  var compare = this.compare;
  var array = this.array;
  var tmp = this.tmp;
  var i = 0;

  for (i = 0; i < length2; i++) {
    tmp[i] = array[start2 + i];
  }

  var cursor1 = start1 + length1 - 1;
  var cursor2 = length2 - 1;
  var dest = start2 + length2 - 1;
  var customCursor = 0;
  var customDest = 0;

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

  var minGallop = this.minGallop;

  while (true) {
    var count1 = 0;
    var count2 = 0;
    var exit = false;

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
};

/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function=} compare - Item comparison function. Default is alphabetical.
 */
function sort (array, lo, hi, compare) {
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

  var remaining = hi - lo;

  // The array is already sorted
  if (remaining < 2) {
    return;
  }

  var runLength = 0;
  // On small arrays binary sort can be used directly
  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    return;
  }

  var ts = new TimSort(array, compare);

  var minRun = minRunLength(remaining);

  do {
    runLength = makeAscendingRun(array, lo, hi, compare);
    if (runLength < minRun) {
      var force = remaining;
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
}

var FixedArray = function FixedArray(size) {
  this._count = 0;
  this._data = new Array(size);
};

var prototypeAccessors$7 = { length: { configurable: true },data: { configurable: true } };

FixedArray.prototype._resize = function _resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = undefined;
    }
  }
};

prototypeAccessors$7.length.get = function () {
  return this._count;
};

prototypeAccessors$7.data.get = function () {
  return this._data;
};

FixedArray.prototype.reset = function reset () {
    var this$1 = this;

  for (var i = 0; i < this._count; ++i) {
    this$1._data[i] = undefined;
  }

  this._count = 0;
};

FixedArray.prototype.push = function push (val) {
  if (this._count >= this._data.length) {
    this._resize(this._data.length * 2);
  }

  this._data[this._count] = val;
  ++this._count;
};

FixedArray.prototype.pop = function pop () {
  --this._count;

  if (this._count < 0) {
    this._count = 0;
  }

  var ret = this._data[this._count];
  this._data[this._count] = undefined;

  return ret;
};

FixedArray.prototype.fastRemove = function fastRemove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  this._data[idx] = this._data[last];
  this._data[last] = undefined;
  this._count -= 1;
};

FixedArray.prototype.indexOf = function indexOf (val) {
  var idx = this._data.indexOf(val);
  if (idx >= this._count) {
    return -1;
  }

  return idx;
};

FixedArray.prototype.sort = function sort$1 (cmp) {
  return sort(this._data, 0, this._count, cmp);
};

Object.defineProperties( FixedArray.prototype, prototypeAccessors$7 );

var Pool = function Pool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._idx = size - 1;
  this._frees = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._frees[i] = fn();
  }
};

Pool.prototype._expand = function _expand (size) {
    var this$1 = this;

  var old = this._frees;
  this._frees = new Array(size);

  var len = size - old.length;
  for (var i = 0; i < len; ++i) {
    this$1._frees[i] = this$1._fn();
  }

  for (var i$1 = len, j = 0; i$1 < size; ++i$1, ++j) {
    this$1._frees[i$1] = old[j];
  }

  this._idx += len;
};

Pool.prototype.alloc = function alloc () {
  // create some more space (expand by 20%, minimum 1)
  if (this._idx < 0) {
    this._expand(Math.round(this._frees.length * 1.2) + 1);
  }

  var ret = this._frees[this._idx];
  this._frees[this._idx] = null;
  --this._idx;

  return ret;
};

Pool.prototype.free = function free (obj) {
  ++this._idx;
  this._frees[this._idx] = obj;
};

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`

var LinkedArray = function LinkedArray(fn, size) {
  this._fn = fn;
  this._count = 0;
  this._head = null;
  this._tail = null;

  this._pool = new Pool(fn, size);
};

var prototypeAccessors$8 = { head: { configurable: true },tail: { configurable: true },length: { configurable: true } };

prototypeAccessors$8.head.get = function () {
  return this._head;
};

prototypeAccessors$8.tail.get = function () {
  return this._tail;
};

prototypeAccessors$8.length.get = function () {
  return this._count;
};

LinkedArray.prototype.add = function add () {
  var node = this._pool.alloc();

  if (!this._tail) {
    this._head = node;
  } else {
    this._tail._next = node;
    node._prev = this._tail;
  }
  this._tail = node;
  this._count += 1;

  return node;
};

LinkedArray.prototype.remove = function remove (node) {
  if (node._prev) {
    node._prev._next = node._next;
  } else {
    this._head = node._next;
  }

  if (node._next) {
    node._next._prev = node._prev;
  } else {
    this._tail = node._prev;
  }

  node._next = null;
  node._prev = null;
  this._pool.free(node);
  this._count -= 1;
};

LinkedArray.prototype.forEach = function forEach (fn, binder) {
    var this$1 = this;

  var cursor = this._head;
  if (!cursor) {
    return;
  }

  if (binder) {
    fn = fn.bind(binder);
  }

  var idx = 0;
  var next = cursor;

  while (cursor) {
    next = cursor._next;
    fn(cursor, idx, this$1);

    cursor = next;
    ++idx;
  }
};

Object.defineProperties( LinkedArray.prototype, prototypeAccessors$8 );

var RecyclePool = function RecyclePool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._count = 0;
  this._data = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._data[i] = fn();
  }
};

var prototypeAccessors$9 = { length: { configurable: true },data: { configurable: true } };

prototypeAccessors$9.length.get = function () {
  return this._count;
};

prototypeAccessors$9.data.get = function () {
  return this._data;
};

RecyclePool.prototype.reset = function reset () {
  this._count = 0;
};

RecyclePool.prototype.resize = function resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = this$1._fn();
    }
  }
};

RecyclePool.prototype.add = function add () {
  if (this._count >= this._data.length) {
    this.resize(this._data.length * 2);
  }

  return this._data[this._count++];
};

RecyclePool.prototype.remove = function remove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  var tmp = this._data[idx];
  this._data[idx] = this._data[last];
  this._data[last] = tmp;
  this._count -= 1;
};

RecyclePool.prototype.sort = function sort$1 (cmp) {
  return sort(this._data, 0, this._count, cmp);
};

Object.defineProperties( RecyclePool.prototype, prototypeAccessors$9 );

var _bufferPools = Array(8);
for (var i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var Scene = function Scene() {
  this._lights = new FixedArray(16);
  this._models = new FixedArray(16);
  this._cameras = new FixedArray(16);
  this._debugCamera = null;

  // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
  this._views = [];
};

Scene.prototype._add = function _add (pool, item) {
  if (item._poolID !== -1) {
    return;
  }

  pool.push(item);
  item._poolID = pool.length - 1;
};

Scene.prototype._remove = function _remove (pool, item) {
  if (item._poolID === -1) {
    return;
  }

  pool.data[pool.length-1]._poolID = item._poolID;
  pool.fastRemove(item._poolID);
  item._poolID = -1;
};

Scene.prototype.reset = function reset () {
    var this$1 = this;

  for (var i = 0; i < this._models.length; ++i) {
    var model = this$1._models.data[i];
    model._cullingMask = -1;
  }
};

Scene.prototype.setDebugCamera = function setDebugCamera (cam) {
  this._debugCamera = cam;
};

// camera

Scene.prototype.getCameraCount = function getCameraCount () {
  return this._cameras.length;
};

Scene.prototype.getCamera = function getCamera (idx) {
  return this._cameras.data[idx];
};

Scene.prototype.addCamera = function addCamera (camera) {
  this._add(this._cameras, camera);
};

Scene.prototype.removeCamera = function removeCamera (camera) {
  this._remove(this._cameras, camera);
};

// model

Scene.prototype.getModelCount = function getModelCount () {
  return this._models.length;
};

Scene.prototype.getModel = function getModel (idx) {
  return this._models.data[idx];
};

Scene.prototype.addModel = function addModel (model) {
  this._add(this._models, model);
};

Scene.prototype.removeModel = function removeModel (model) {
  this._remove(this._models, model);
};

// light

Scene.prototype.getLightCount = function getLightCount () {
  return this._lights.length;
};

Scene.prototype.getLight = function getLight (idx) {
  return this._lights.data[idx];
};

Scene.prototype.addLight = function addLight (light) {
  this._add(this._lights, light);
};

Scene.prototype.removeLight = function removeLight (light) {
  this._remove(this._lights, light);
};

// view

Scene.prototype.addView = function addView (view) {
  if (this._views.indexOf(view) === -1) {
    this._views.push(view);
  }
};

Scene.prototype.removeView = function removeView (view) {
  var idx = this._views.indexOf(view);
  if (idx !== -1) {
    this._views.splice(idx, 1);
  }
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _shdID = 0;

function _generateDefines(defs) {
  var defines = [];
  for (var def in defs) {
    if (defs[def] === true) {
      defines.push(("#define " + def));
    }
  }
  return defines.join('\n');
}

function _replaceMacroNums(string, defs) {
  var cache = {};
  var tmp = string;
  for (var def in defs) {
    if (Number.isInteger(defs[def])) {
      cache[def] = defs[def];
    }
  }
  for (var def$1 in cache) {
    var reg = new RegExp(def$1, 'g');
    tmp = tmp.replace(reg, cache[def$1]);
  }
  return tmp;
}

function _unrollLoops(string) {
  var pattern = /#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g;
  function replace(match, index, begin, end, snippet) {
    var unroll = '';
    var parsedBegin = parseInt(begin);
    var parsedEnd = parseInt(end);
    if (parsedBegin.isNaN || parsedEnd.isNaN) {
      console.error('Unroll For Loops Error: begin and end of range must be an int num.');
    }
    for (var i = parsedBegin; i < parsedEnd; ++i) {
      unroll += snippet.replace(new RegExp(("{" + index + "}"), 'g'), i);
    }
    return unroll;
  }
  return string.replace(pattern, replace);
}

var ProgramLib = function ProgramLib(device, templates, chunks) {
  var this$1 = this;
  if ( templates === void 0 ) templates = [];
  if ( chunks === void 0 ) chunks = {};

  this._device = device;
  this._precision = "precision highp float;\n";

  // register templates
  this._templates = {};
  for (var i = 0; i < templates.length; ++i) {
    var tmpl = templates[i];
    this$1.define(tmpl.name, tmpl.vert, tmpl.frag, tmpl.defines);
  }

  // register chunks
  this._chunks = {};
  Object.assign(this._chunks, chunks);

  this._cache = {};
};

/**
 * @param {string} name
 * @param {string} template
 * @param {Array} options
 *
 * @example:
 * programLib.define('foobar', vertTmpl, fragTmpl, [
 *   { name: 'shadow' },
 *   { name: 'lightCount', min: 1, max: 4 }
 * ]);
 */
ProgramLib.prototype.define = function define (name, vert, frag, defines) {
  if (this._templates[name]) {
    console.warn(("Failed to define shader " + name + ": already exists."));
    return;
  }

  var id = ++_shdID;

  // calculate option mask offset
  var offset = 0;
  var loop = function ( i ) {
    var def = defines[i];
    def._offset = offset;

    var cnt = 1;

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
  };

    for (var i = 0; i < defines.length; ++i) loop( i );

  vert = this._precision + vert;
  frag = this._precision + frag;

  // store it
  this._templates[name] = {
    id: id,
    name: name,
    vert: vert,
    frag: frag,
    defines: defines
  };
};

/**
 * @param {string} name
 * @param {Object} options
 */
ProgramLib.prototype.getKey = function getKey (name, defines) {
  var tmpl = this._templates[name];
  var key = 0;
  for (var i = 0; i < tmpl.defines.length; ++i) {
    var tmplDefs = tmpl.defines[i];
    var value = defines[tmplDefs.name];
    if (value === undefined) {
      continue;
    }

    key |= tmplDefs._map(value);
  }

  return key << 8 | tmpl.id;
};

/**
 * @param {string} name
 * @param {Object} options
 */
ProgramLib.prototype.getProgram = function getProgram (name, defines) {
  var key = this.getKey(name, defines);
  var program = this._cache[key];
  if (program) {
    return program;
  }

  // get template
  var tmpl = this._templates[name];
  var customDef = _generateDefines(defines) + '\n';
  var vert = _replaceMacroNums(tmpl.vert, defines);
  vert = customDef + _unrollLoops(vert);
  var frag = _replaceMacroNums(tmpl.frag, defines);
  frag = customDef + _unrollLoops(frag);

  program = new gfx.Program(this._device, {
    vert: vert,
    frag: frag
  });
  program.link();
  this._cache[key] = program;

  return program;
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

var _m3_tmp$1 = mat3.create();
var _m4_tmp$2 = mat4.create();

var _stageInfos = new RecyclePool(function () {
  return {
    stage: null,
    items: null,
  };
}, 8);

var _float2_pool = new RecyclePool(function () {
  return new Float32Array(2);
}, 8);

var _float3_pool = new RecyclePool(function () {
  return new Float32Array(3);
}, 8);

var _float4_pool = new RecyclePool(function () {
  return new Float32Array(4);
}, 8);

var _float9_pool = new RecyclePool(function () {
  return new Float32Array(9);
}, 8);

var _float16_pool = new RecyclePool(function () {
  return new Float32Array(16);
}, 8);

var _float64_pool = new RecyclePool(function () {
  return new Float32Array(64);
}, 8);

var _int2_pool = new RecyclePool(function () {
  return new Int32Array(2);
}, 8);

var _int3_pool = new RecyclePool(function () {
  return new Int32Array(3);
}, 8);

var _int4_pool = new RecyclePool(function () {
  return new Int32Array(4);
}, 8);

var _int64_pool = new RecyclePool(function () {
  return new Int32Array(64);
}, 8);

var _type2uniformValue = {};
_type2uniformValue[enums.PARAM_INT] = function (value) {
    return value;
  };
_type2uniformValue[enums.PARAM_INT2] = function (value) {
    return vec2.array(_int2_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_INT3] = function (value) {
    return vec3.array(_int3_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_INT4] = function (value) {
    return vec4.array(_int4_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_FLOAT] = function (value) {
    return value;
  };
_type2uniformValue[enums.PARAM_FLOAT2] = function (value) {
    return vec2.array(_float2_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_FLOAT3] = function (value) {
    return vec3.array(_float3_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_FLOAT4] = function (value) {
    return vec4.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_COLOR3] = function (value) {
    return color3.array(_float3_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_COLOR4] = function (value) {
    return color4.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_MAT2] = function (value) {
    return mat2.array(_float4_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_MAT3] = function (value) {
    return mat3.array(_float9_pool.add(), value);
  };
_type2uniformValue[enums.PARAM_MAT4] = function (value) {
    return mat4.array(_float16_pool.add(), value);
  };

var _type2uniformArrayValue = {};
_type2uniformArrayValue[enums.PARAM_INT] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1,
  };
_type2uniformArrayValue[enums.PARAM_INT2] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  };
_type2uniformArrayValue[enums.PARAM_INT3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums.PARAM_INT4] = {
    func: function func (values) {
      var result = _int64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums.PARAM_FLOAT] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1
  };
_type2uniformArrayValue[enums.PARAM_FLOAT2] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  };
_type2uniformArrayValue[enums.PARAM_FLOAT3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums.PARAM_FLOAT4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums.PARAM_COLOR3] = {
    func: undefined,
    size: 3,
  };
_type2uniformArrayValue[enums.PARAM_COLOR4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.r;
        result[4 * i + 1] = v.g;
        result[4 * i + 2] = v.b;
        result[4 * i + 3] = v.a;
      }
      return result;
    },
    size: 4,
  };
_type2uniformArrayValue[enums.PARAM_MAT2] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
        result[4 * i] = v.m00;
        result[4 * i + 1] = v.m01;
        result[4 * i + 2] = v.m02;
        result[4 * i + 3] = v.m03;
      }
      return result;
    },
    size: 4
  };
_type2uniformArrayValue[enums.PARAM_MAT3] = {
    func: undefined,
    size: 9
  };
_type2uniformArrayValue[enums.PARAM_MAT4] = {
    func: function func (values) {
      var result = _float64_pool.add();
      for (var i = 0; i < values.length; ++i) {
        var v = values[i];
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
  };

var Base = function Base(device, opts) {
  var obj;

  this._device = device;
  this._programLib = new ProgramLib(device, opts.programTemplates, opts.programChunks);
  this._opts = opts;
  this._type2defaultValue = ( obj = {}, obj[enums.PARAM_INT] = 0, obj[enums.PARAM_INT2] = vec2.new(0, 0), obj[enums.PARAM_INT3] = vec3.new(0, 0, 0), obj[enums.PARAM_INT4] = vec4.new(0, 0, 0, 0), obj[enums.PARAM_FLOAT] = 0.0, obj[enums.PARAM_FLOAT2] = vec2.new(0, 0), obj[enums.PARAM_FLOAT3] = vec3.new(0, 0, 0), obj[enums.PARAM_FLOAT4] = vec4.new(0, 0, 0, 0), obj[enums.PARAM_COLOR3] = color3.new(0, 0, 0), obj[enums.PARAM_COLOR4] = color4.new(0, 0, 0, 1), obj[enums.PARAM_MAT2] = mat2.create(), obj[enums.PARAM_MAT3] = mat3.create(), obj[enums.PARAM_MAT4] = mat4.create(), obj[enums.PARAM_TEXTURE_2D] = opts.defaultTexture, obj[enums.PARAM_TEXTURE_CUBE] = opts.defaultTextureCube, obj);
  this._stage2fn = {};
  this._usedTextureUnits = 0;

  this._viewPools = new RecyclePool(function () {
    return new View();
  }, 8);

  this._drawItemsPools = new RecyclePool(function () {
    return {
      model: null,
      node: null,
      ia: null,
      effect: null,
      defines: null,
    };
  }, 100);

  this._stageItemsPools = new RecyclePool(function () {
    return new RecyclePool(function () {
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
};

Base.prototype._resetTextuerUnit = function _resetTextuerUnit () {
  this._usedTextureUnits = 0;
};

Base.prototype._allocTextuerUnit = function _allocTextuerUnit () {
  var device = this._device;

  var unit = this._usedTextureUnits;
  if (unit >= device._caps.maxTextureUnits) {
    console.warn(("Trying to use " + unit + " texture units while this GPU supports only " + (device._caps.maxTextureUnits)));
  }

  this._usedTextureUnits += 1;
  return unit;
};

Base.prototype._registerStage = function _registerStage (name, fn) {
  this._stage2fn[name] = fn;
};

Base.prototype._reset = function _reset () {
  this._viewPools.reset();
  this._stageItemsPools.reset();
};

Base.prototype._requestView = function _requestView () {
  return this._viewPools.add();
};

Base.prototype._render = function _render (view, scene) {
    var this$1 = this;

  var device = this._device;

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
  var clearOpts = {};
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

  for (var i = 0; i < scene._models.length; ++i) {
    var model = scene._models.data[i];

    // filter model by view
    if ((model._cullingMask & view._cullingMask) === 0) {
      continue;
    }

    for (var m = 0; m < model.drawItemCount; ++m) {
      var drawItem = this$1._drawItemsPools.add();
      model.extractDrawItem(drawItem, m);
    }
  }

  // TODO: update frustum
  // TODO: visbility test
  // frustum.update(view._viewProj);

  // dispatch draw items to different stage
  _stageInfos.reset();

  for (var i$1 = 0; i$1 < view._stages.length; ++i$1) {
    var stage = view._stages[i$1];
    var stageItems = this$1._stageItemsPools.add();
    stageItems.reset();

    for (var j = 0; j < this._drawItemsPools.length; ++j) {
      var drawItem$1 = this$1._drawItemsPools.data[j];
      var tech = drawItem$1.effect.getTechnique(stage);

      if (tech) {
        var stageItem = stageItems.add();
        stageItem.model = drawItem$1.model;
        stageItem.node = drawItem$1.node;
        stageItem.ia = drawItem$1.ia;
        stageItem.effect = drawItem$1.effect;
        stageItem.defines = drawItem$1.defines;
        stageItem.technique = tech;
        stageItem.sortKey = -1;
      }
    }

    var stageInfo = _stageInfos.add();
    stageInfo.stage = stage;
    stageInfo.items = stageItems;
  }

  // render stages
  for (var i$2 = 0; i$2 < _stageInfos.length; ++i$2) {
    var info = _stageInfos.data[i$2];
    var fn = this$1._stage2fn[info.stage];

    fn(view, info.items);
  }
};

Base.prototype._draw = function _draw (item) {
    var this$1 = this;

  var device = this._device;
  var programLib = this._programLib;
  var node = item.node;
    var ia = item.ia;
    var effect = item.effect;
    var technique = item.technique;
    var defines = item.defines;

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
  for (var i = 0; i < technique._parameters.length; ++i) {
    var prop = technique._parameters[i];
    var param = effect.getProperty(prop.name);

    if (param === undefined) {
      param = prop.val;
    }

    if (param === undefined) {
      param = this$1._type2defaultValue[prop.type];
    }

    if (param === undefined) {
      console.warn(("Failed to set technique property " + (prop.name) + ", value not found."));
      continue;
    }

    if (
      prop.type === enums.PARAM_TEXTURE_2D ||
      prop.type === enums.PARAM_TEXTURE_CUBE
    ) {
      if (prop.size !== undefined) {
        if (prop.size !== param.length) {
          console.error(("The length of texture array (" + (param.length) + ") is not corrent(expect " + (prop.size) + ")."));
          continue;
        }
        var slots = _int64_pool.add();
        for (var index = 0; index < param.length; ++index) {
          slots[index] = this$1._allocTextuerUnit();
        }
        device.setTextureArray(prop.name, param, slots);
      } else {
        device.setTexture(prop.name, param, this$1._allocTextuerUnit());
      }
    } else {
      var convertedValue = (void 0);
      if (prop.size !== undefined) {
        var convertArray = _type2uniformArrayValue[prop.type];
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
        var convertFn = _type2uniformValue[prop.type];
        convertedValue = convertFn(param);
      }
      device.setUniform(prop.name, convertedValue);
    }
  }

  // for each pass
  for (var i$1 = 0; i$1 < technique._passes.length; ++i$1) {
    var pass = technique._passes[i$1];
    var count = ia.getPrimitiveCount();

    // set vertex buffer
    device.setVertexBuffer(0, ia._vertexBuffer);

    // set index buffer
    if (ia._indexBuffer) {
      device.setIndexBuffer(ia._indexBuffer);
    }

    // set primitive type
    device.setPrimitiveType(ia._primitiveType);

    // set program
    var program = programLib.getProgram(pass._programName, defines);
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

    this$1._resetTextuerUnit();
  }
};

var renderer = {
  // config
  addStage: config.addStage,

  // utils
  createIA: createIA,

  // classes
  Pass: Pass,
  Technique: Technique,
  Effect: Effect,
  InputAssembler: InputAssembler,
  View: View,

  Light: Light,
  Camera: Camera,
  Model: Model,
  Scene: Scene,

  Base: Base,
  ProgramLib: ProgramLib,
};
Object.assign(renderer, enums);

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var _a16_view = new Float32Array(16);
var _a16_proj = new Float32Array(16);
var _a16_viewProj = new Float32Array(16);

var ForwardRenderer = (function (superclass) {
  function ForwardRenderer (device, builtin) {
    superclass.call(this, device, builtin);
    this._registerStage('transparent', this._transparentStage.bind(this));
  }

  if ( superclass ) ForwardRenderer.__proto__ = superclass;
  ForwardRenderer.prototype = Object.create( superclass && superclass.prototype );
  ForwardRenderer.prototype.constructor = ForwardRenderer;

  ForwardRenderer.prototype.reset = function reset () {
    this._reset();
  };

  ForwardRenderer.prototype.render = function render (scene) {
    var this$1 = this;

    this._reset();

    scene._cameras.sort(function (a, b) {
      if (a._depth > b._depth) { return 1; }
      else if (a._depth < b._depth) { return -1; }
      else { return 0; }
    });

    for (var i = 0; i < scene._cameras.length; ++i) {
      var camera = scene._cameras.data[i];

      // reset camera pollID after sort cameras
      camera._poolID = i;
      
      this$1.renderCamera(camera, scene);
    }
  };

  ForwardRenderer.prototype.renderCamera = function renderCamera (camera, scene) {
    var canvas = this._device._gl.canvas;

    var view = camera.view;
    var dirty = camera.dirty;
    if (!view) {
      view = this._requestView();
      dirty = true;
    }
    if (dirty) {
      var width = canvas.width;
      var height = canvas.height;
      if (camera._framebuffer) {
        width = camera._framebuffer._width;
        height = camera._framebuffer._height;
      }
      camera.extractView(view, width, height);
    }
    this._render(view, scene);
  };

  ForwardRenderer.prototype._transparentStage = function _transparentStage (view, items) {
    var this$1 = this;

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    // draw it
    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];
      this$1._draw(item);
    }
  };

  return ForwardRenderer;
}(renderer.Base));

var chunks = {
};

var templates = [
  {
    name: 'gray_sprite',
    vert: '\n \nuniform mat4 viewProj;\nattribute vec3 a_position;\nattribute vec4 a_color;\nvarying lowp vec4 v_fragmentColor;\nattribute vec2 a_uv0;\nvarying vec2 uv0;\nvoid main () {\n  vec4 pos = viewProj * vec4(a_position, 1);\n  v_fragmentColor = a_color;\n  uv0 = a_uv0;\n  gl_Position = pos;\n}',
    frag: '\n \nuniform sampler2D texture;\nvarying vec2 uv0;\nvarying vec4 v_fragmentColor;\nvoid main () {\n  vec4 c = v_fragmentColor * texture2D(texture, uv0);\n  float gray = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;\n  gl_FragColor = vec4(gray, gray, gray, c.a);\n}',
    defines: [
    ],
  },
  {
    name: 'sprite',
    vert: '\n \nuniform mat4 viewProj;\n#ifdef use2DPos\nattribute vec2 a_position;\n#else\nattribute vec3 a_position;\n#endif\nattribute vec4 a_color;\n#ifdef useModel\n  uniform mat4 model;\n#endif\n#ifdef useTexture\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n#endif\n#ifndef useColor\nvarying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n  #ifdef use2DPos\n  vec4 pos = mvp * vec4(a_position, 0, 1);\n  #else\n  vec4 pos = mvp * vec4(a_position, 1);\n  #endif\n  #ifndef useColor\n  v_fragmentColor = a_color;\n  #endif\n  #ifdef useTexture\n    uv0 = a_uv0;\n  #endif\n  gl_Position = pos;\n}',
    frag: '\n \n#ifdef useTexture\n  uniform sampler2D texture;\n  varying vec2 uv0;\n#endif\n#ifdef alphaTest\n  uniform float alphaThreshold;\n#endif\n#ifdef useColor\n  uniform vec4 color;\n#else\n  varying vec4 v_fragmentColor;\n#endif\nvoid main () {\n  #ifdef useColor\n    vec4 o = color;\n  #else\n    vec4 o = v_fragmentColor;\n  #endif\n  #ifdef useTexture\n    o *= texture2D(texture, uv0);\n  #endif\n  #ifdef alphaTest\n    if (o.a <= alphaThreshold)\n      discard;\n  #endif\n  gl_FragColor = o;\n}',
    defines: [
      { name: 'useTexture', },
      { name: 'useModel', },
      { name: 'alphaTest', },
      { name: 'use2DPos', },
      { name: 'useColor', } ],
  } ];

var shaders = {
    chunks: chunks,
    templates: templates
};

// Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.  

/**
 * BaseRenderData is a core data abstraction for renderer, this is a abstract class.
 * An inherited render data type should define raw vertex datas.
 * User should also define the effect, vertex count and index count.
 */
var BaseRenderData = function BaseRenderData () {
    this.material = null;
    this.vertexCount = 0;
    this.indiceCount = 0;
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var _pool;
var _dataPool = new Pool(function () {
  return {
    x: 0.0,
    y: 0.0,
    u: 0.0,
    v: 0.0,
    color: 0
  };
}, 128);

/**
 * RenderData is most widely used render data type.
 * It describes raw vertex data with a fixed data layout.
 * Each vertex is described by five property: x, y, u, v, color. The data layout might be extended in the future.
 * Vertex data objects are managed automatically by RenderData, user only need to set the dataLength property.
 * User can also define rendering index orders for the vertex list.
 */
var RenderData = (function (BaseRenderData$$1) {
  function RenderData () {
    BaseRenderData$$1.call(this);
    this._data = [];
    this._indices = [];

    this._pivotX = 0;
    this._pivotY = 0;
    this._width = 0;
    this._height = 0;

    this.uvDirty = true;
    this.vertDirty = true;
  }

  if ( BaseRenderData$$1 ) RenderData.__proto__ = BaseRenderData$$1;
  RenderData.prototype = Object.create( BaseRenderData$$1 && BaseRenderData$$1.prototype );
  RenderData.prototype.constructor = RenderData;

  var prototypeAccessors = { type: { configurable: true },dataLength: { configurable: true } };

  prototypeAccessors.type.get = function () {
    return RenderData.type;
  };

  prototypeAccessors.dataLength.get = function () {
    return this._data.length;
  };

  prototypeAccessors.dataLength.set = function (length) {
    var data = this._data;
    if (data.length !== length) {
      // Free extra data
      for (var i = length; i < data.length; i++) {
        _dataPool.free(data[i]);
      }
      // Alloc needed data
      for (var i$1 = data.length; i$1 < length; i$1++) {
        data[i$1] = _dataPool.alloc();
      }
      data.length = length;
    }
  };

  RenderData.prototype.updateSizeNPivot = function updateSizeNPivot (width, height, pivotX, pivotY) {
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
  };
  
  RenderData.alloc = function alloc () {
    return _pool.alloc();
  };

  RenderData.free = function free (data) {
    if (data instanceof RenderData) {
      for (var i = data.length-1; i > 0; i--) {
        _dataPool.free(data._data[i]);
      }
      data._data.length = 0;
      data._indices.length = 0;
      data.material = null;
      data.uvDirty = true;
      data.vertDirty = true;
      data.vertexCount = 0;
      data.indiceCount = 0;
      _pool.free(data);
    }
  };

  Object.defineProperties( RenderData.prototype, prototypeAccessors );

  return RenderData;
}(BaseRenderData));

RenderData.type = 'RenderData';

_pool = new Pool(function () {
  return new RenderData();
}, 32);

// Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.  
 
/**
 * IARenderData is user customized render data type, user should provide the entier input assembler.
 * IARenderData just defines a property `ia` for accessing the input assembler.
 * It doesn't manage memory so users should manage the memory of input assembler by themselves.
 */
var IARenderData = (function (BaseRenderData$$1) {
    function IARenderData () {
        BaseRenderData$$1.call(this);
        this.ia = null;
    }

    if ( BaseRenderData$$1 ) IARenderData.__proto__ = BaseRenderData$$1;
    IARenderData.prototype = Object.create( BaseRenderData$$1 && BaseRenderData$$1.prototype );
    IARenderData.prototype.constructor = IARenderData;

    var prototypeAccessors = { type: { configurable: true } };

    prototypeAccessors.type.get = function () {
        return IARenderData.type;
    };

    Object.defineProperties( IARenderData.prototype, prototypeAccessors );

    return IARenderData;
}(BaseRenderData));

IARenderData.type = 'IARenderData';

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Asset = function Asset(persist) {
  if ( persist === void 0 ) persist = true;

  this._loaded = false;
  this._persist = persist;
};

Asset.prototype.unload = function unload () {
  this._loaded = false;
};

Asset.prototype.reload = function reload () {
  // TODO
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Texture$2 = (function (Asset$$1) {
  function Texture(persist) {
    if ( persist === void 0 ) persist = true;

    Asset$$1.call(this, persist);

    this._texture = null;
  }

  if ( Asset$$1 ) Texture.__proto__ = Asset$$1;
  Texture.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Texture.prototype.constructor = Texture;

  Texture.prototype.getImpl = function getImpl () {
    return this._texture;
  };

  Texture.prototype.getId = function getId () {};

  Texture.prototype.destroy = function destroy () {
    this._texture && this._texture.destroy();
  };

  return Texture;
}(Asset));

/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash2_32_gc(str, seed) {
  var
    l = str.length,
    h = seed ^ l,
    i = 0,
    k;
  
  while (l >= 4) {
  	k = 
  	  ((str.charCodeAt(i) & 0xff)) |
  	  ((str.charCodeAt(++i) & 0xff) << 8) |
  	  ((str.charCodeAt(++i) & 0xff) << 16) |
  	  ((str.charCodeAt(++i) & 0xff) << 24);
    
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

	h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    l -= 4;
    ++i;
  }
  
  switch (l) {
  case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
  case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
  case 1: h ^= (str.charCodeAt(i) & 0xff);
          h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }

  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  return h >>> 0;
}

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  

// function genHashCode (str) {
//     var hash = 0;
//     if (str.length == 0) {
//         return hash;
//     }
//     for (var i = 0; i < str.length; i++) {
//         var char = str.charCodeAt(i);
//         hash = ((hash<<5)-hash)+char;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }

function serializeDefines (defines) {
    var str = '';
    for (var i = 0; i < defines.length; i++) {
        str += defines[i].name + defines[i].value;
    }
    return str;
}

function serializePass (pass) {
    var str = pass._programName + pass._cullMode;
    if (pass._blend) {
        str += pass._blendEq + pass._blendAlphaEq + pass._blendSrc + pass._blendDst
             + pass._blendSrcAlpha + pass._blendDstAlpha + pass._blendColor;
    }
    if (pass._depthTest) {
        str += pass._depthWrite + pass._depthFunc;
    }
    if (pass._stencilTest) {
        str += pass._stencilFuncFront + pass._stencilRefFront + pass._stencilMaskFront
             + pass._stencilFailOpFront + pass._stencilZFailOpFront + pass._stencilZPassOpFront
             + pass._stencilWriteMaskFront
             + pass._stencilFuncBack + pass._stencilRefBack + pass._stencilMaskBack
             + pass._stencilFailOpBack + pass._stencilZFailOpBack + pass._stencilZPassOpBack 
             + pass._stencilWriteMaskBack;
    }
    return str;
}

function computeHash(material) {
    var effect = material._effect;
    var hashData = '';
    if (effect) {
        var i, j, techData, param, prop, propKey;

        // effect._defines
        hashData += serializeDefines(effect._defines);
        // effect._techniques
        for (i = 0; i < effect._techniques.length; i++) {
            techData = effect._techniques[i];
            // technique.stageIDs
            hashData += techData.stageIDs;
            // technique._layer
            // hashData += + techData._layer + "_";
            // technique.passes
            for (j = 0; j < techData.passes.length; j++) {
                hashData += serializePass(techData.passes[j]);
            }
            //technique._parameters
            for (j = 0; j < techData._parameters.length; j++) {
                param = techData._parameters[j];
                propKey = param.name;
                prop = effect._properties[propKey];
                if (!prop) {
                    continue;
                }
                switch(param.type) {
                    case renderer.PARAM_INT:
                    case renderer.PARAM_FLOAT:
                        hashData += prop + ';';
                        break;
                    case renderer.PARAM_INT2:
                    case renderer.PARAM_FLOAT2:
                        hashData += prop.x + ',' + prop.y + ';';
                        break;
                    case renderer.PARAM_INT4:
                    case renderer.PARAM_FLOAT4:
                        hashData += prop.x + ',' + prop.y + ',' + prop.z + ',' + prop.w + ';';
                        break;
                    case renderer.PARAM_COLOR4:
                        hashData += prop.r + ',' + prop.g + ',' + prop.b + ',' + prop.a + ';';
                        break;
                    case renderer.PARAM_MAT2:
                        hashData += prop.m00 + ',' + prop.m01 + ',' + prop.m02 + ',' + prop.m03 + ';';
                        break;
                    case renderer.PARAM_TEXTURE_2D:
                    case renderer.PARAM_TEXTURE_CUBE:
                        hashData += material._texIds[propKey] + ';';
                        break;
                    case renderer.PARAM_INT3:
                    case renderer.PARAM_FLOAT3:
                    case renderer.PARAM_COLOR3:
                    case renderer.PARAM_MAT3:
                    case renderer.PARAM_MAT4:
                        hashData += JSON.stringify(prop) + ';';
                        break;
                    default:
                        break;
                }
            }
        }
    }
    return hashData ? murmurhash2_32_gc(hashData, 666) : hashData;
}

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Material = (function (Asset$$1) {
  function Material(persist) {
    if ( persist === void 0 ) persist = false;

    Asset$$1.call(this, persist);

    this._effect = null; // renderer.Effect
    this._texIds = {}; // ids collected from texture defines
    this._hash = '';
  }

  if ( Asset$$1 ) Material.__proto__ = Asset$$1;
  Material.prototype = Object.create( Asset$$1 && Asset$$1.prototype );
  Material.prototype.constructor = Material;

  var prototypeAccessors = { hash: { configurable: true } };

  prototypeAccessors.hash.get = function () {
    return this._hash;
  };

  Material.prototype.updateHash = function updateHash (value) {
    this._hash = value || computeHash(this);
  };

  Object.defineProperties( Material.prototype, prototypeAccessors );

  return Material;
}(Asset));

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var SpriteMaterial = (function (Material$$1) {
  function SpriteMaterial() {
    Material$$1.call(this, false);

    var pass = new renderer.Pass('sprite');
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ['transparent'],
      [
        { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4 } ],
      [
        pass
      ]
    );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {
        'color': {r: 1, g: 1, b: 1, a: 1}
      },
      [
        { name: 'useTexture', value: true },
        { name: 'useModel', value: false },
        { name: 'alphaTest', value: false },
        { name: 'use2DPos', value: true },
        { name: 'useColor', value: true } ]
    );
    
    this._mainTech = mainTech;
    this._texture = null;
    this._color = {r: 1, g: 1, b: 1, a: 1};
  }

  if ( Material$$1 ) SpriteMaterial.__proto__ = Material$$1;
  SpriteMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  SpriteMaterial.prototype.constructor = SpriteMaterial;

  var prototypeAccessors = { effect: { configurable: true },useTexture: { configurable: true },useModel: { configurable: true },use2DPos: { configurable: true },useColor: { configurable: true },texture: { configurable: true },color: { configurable: true } };

  prototypeAccessors.effect.get = function () {
    return this._effect;
  };
  
  prototypeAccessors.useTexture.get = function () {
    this._effect.getDefine('useTexture');
  };

  prototypeAccessors.useTexture.set = function (val) {
    this._effect.define('useTexture', val);
  };
  
  prototypeAccessors.useModel.get = function () {
    this._effect.getDefine('useModel');
  };

  prototypeAccessors.useModel.set = function (val) {
    this._effect.define('useModel', val);
  };

  prototypeAccessors.use2DPos.get = function () {
    this._effect.getDefine('use2DPos');
  };

  prototypeAccessors.use2DPos.set = function (val) {
    this._effect.define('use2DPos', val);
  };

  prototypeAccessors.useColor.get = function () {
    this._effect.getDefine('useColor');
  };

  prototypeAccessors.useColor.set = function (val) {
    this._effect.define('useColor', val);
  };

  prototypeAccessors.texture.get = function () {
    return this._texture;
  };

  prototypeAccessors.texture.set = function (val) {
    if (this._texture !== val) {
      this._texture = val;
      this._effect.setProperty('texture', val.getImpl());
      this._texIds['texture'] = val.getId();
    }
  };

  prototypeAccessors.color.get = function () {
    return this._effect.getProperty('color');
  };

  prototypeAccessors.color.set = function (val) {
    var color = this._color;
    color.r = val.r / 255;
    color.g = val.g / 255;
    color.b = val.b / 255;
    color.a = val.a / 255;
    this._effect.setProperty('color', color);
  };

  SpriteMaterial.prototype.clone = function clone () {
    var copy = new SpriteMaterial();
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.use2DPos = this.use2DPos;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  };

  Object.defineProperties( SpriteMaterial.prototype, prototypeAccessors );

  return SpriteMaterial;
}(Material));

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var GraySpriteMaterial = (function (Material$$1) {
  function GraySpriteMaterial() {
    Material$$1.call(this, false);

    var pass = new renderer.Pass('gray_sprite');
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ['transparent'],
      [
        { name: 'texture', type: renderer.PARAM_TEXTURE_2D } ],
      [
        pass
      ]
    );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {},
      []
    );
    
    this._mainTech = mainTech;
    this._texture = null;
  }

  if ( Material$$1 ) GraySpriteMaterial.__proto__ = Material$$1;
  GraySpriteMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  GraySpriteMaterial.prototype.constructor = GraySpriteMaterial;

  var prototypeAccessors = { effect: { configurable: true },texture: { configurable: true } };

  prototypeAccessors.effect.get = function () {
    return this._effect;
  };

  prototypeAccessors.texture.get = function () {
    return this._texture;
  };

  prototypeAccessors.texture.set = function (val) {
    if (this._texture !== val) {
      this._texture = val;
      this._effect.setProperty('texture', val.getImpl());
      this._texIds['texture'] = val.getId();
    }
  };

  GraySpriteMaterial.prototype.clone = function clone () {
    var copy = new GraySpriteMaterial();
    copy.texture = this.texture;
    copy.updateHash();
    return copy;
  };

  Object.defineProperties( GraySpriteMaterial.prototype, prototypeAccessors );

  return GraySpriteMaterial;
}(Material));

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var StencilMaterial = (function (Material$$1) {
  function StencilMaterial() {
    Material$$1.call(this, false);

    this._pass = new renderer.Pass('sprite');
    this._pass.setDepth(false, false);
    this._pass.setCullMode(gfx.CULL_NONE);
    this._pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ['transparent'],
      [
        { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaThreshold', type: renderer.PARAM_FLOAT },
        { name: 'color', type: renderer.PARAM_COLOR4 } ],
      [
        this._pass
      ]
    );

    this._effect = new renderer.Effect(
      [
        mainTech ],
      {
        'color': {r: 1, g: 1, b: 1, a: 1}
      },
      [
        { name: 'useTexture', value: true },
        { name: 'useModel', value: false },
        { name: 'alphaTest', value: true },
        { name: 'use2DPos', value: true },
        { name: 'useColor', value: true } ]
    );
    
    this._mainTech = mainTech;
    this._texture = null;
  }

  if ( Material$$1 ) StencilMaterial.__proto__ = Material$$1;
  StencilMaterial.prototype = Object.create( Material$$1 && Material$$1.prototype );
  StencilMaterial.prototype.constructor = StencilMaterial;

  var prototypeAccessors = { effect: { configurable: true },useTexture: { configurable: true },useColor: { configurable: true },texture: { configurable: true },alphaThreshold: { configurable: true } };

  prototypeAccessors.effect.get = function () {
    return this._effect;
  };
  
  prototypeAccessors.useTexture.get = function () {
    this._effect.getDefine('useTexture', val);
  };

  prototypeAccessors.useTexture.set = function (val) {
    this._effect.define('useTexture', val);
  };

  prototypeAccessors.useColor.get = function () {
    this._effect.getDefine('useColor');
  };

  prototypeAccessors.useColor.set = function (val) {
    this._effect.define('useColor', val);
  };

  prototypeAccessors.texture.get = function () {
    return this._texture;
  };

  prototypeAccessors.texture.set = function (val) {
    if (this._texture !== val) {
      this._texture = val;
      this._effect.setProperty('texture', val.getImpl());
      this._texIds['texture'] = val.getId();
    }
  };
  
  prototypeAccessors.alphaThreshold.get = function () {
    return this._effect.getProperty('alphaThreshold');
  };

  prototypeAccessors.alphaThreshold.set = function (val) {
    this._effect.setProperty('alphaThreshold', val);
  };

  StencilMaterial.prototype.clone = function clone () {
    var copy = new StencilMaterial();
    copy.useTexture = this.useTexture;
    copy.useColor = this.useColor;
    copy.texture = this.texture;
    copy.alphaThreshold = this.alphaThreshold;
    copy.updateHash();
    return copy;
  };

  Object.defineProperties( StencilMaterial.prototype, prototypeAccessors );

  return StencilMaterial;
}(Material));

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Device$2 = function Device(canvasEL) {
  var ctx;

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
};

Device$2.prototype._restoreTexture = function _restoreTexture (unit) {
};

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
Device$2.prototype.setViewport = function setViewport (x, y, w, h) {
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
};

/**
 * @method setScissor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
Device$2.prototype.setScissor = function setScissor (x, y, w, h) {
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
};

Device$2.prototype.clear = function clear (color) {
  var ctx = this._ctx;
  ctx.clearRect(this._vx, this._vy, this._vw, this._vh);
  if (color && (color[0] !== 0 || color[1] !== 0 || color[2] !== 0)) {
    ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] +')';
    ctx.globalAlpha = color[3];
    ctx.fillRect(this._vx, this._vy, this._vw, this._vh);
  }
};

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Texture2D$2 = function Texture2D(device, options) {
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

    this.updateImage(options);
  }
};

Texture2D$2.prototype.update = function update (options) {
  this.updateImage(options);
};

Texture2D$2.prototype.updateImage = function updateImage (options) {
  if (options.images && options.images[0]) {
    var image = options.images[0];
    if (image && image !== this._image) {
      this._image = image;
    }
  }
};

Texture2D$2.prototype.destroy = function destroy () {
  this._image = null;
};

var canvas = {
    Device: Device$2,
    Texture2D: Texture2D$2
};

// intenral
// deps
var Scene$2 = renderer.Scene;
var Camera$2 = renderer.Camera;
var View$2 = renderer.View;
var Texture2D$4 = gfx.Texture2D;
var Device$4 = gfx.Device;
var Model$2 = renderer.Model;
var InputAssembler$2 = renderer.InputAssembler;

// Add stage to renderer
if (renderer.config) {
  // JSB adaptation
  renderer.config.addStage('transparent');
}
else {
  renderer.addStage('transparent');
}

var renderEngine = {
  // core classes
  Device: Device$4,
  ForwardRenderer: ForwardRenderer,
  Texture2D: Texture2D$4,

  // Canvas render support
  canvas: canvas,

  // render scene
  Scene: Scene$2,
  Camera: Camera$2,
  View: View$2,
  Model: Model$2,
  RenderData: RenderData,
  IARenderData: IARenderData,
  InputAssembler: InputAssembler$2,
  
  // assets
  Asset: Asset,
  TextureAsset: Texture$2,
  Material: Material,
  
  // materials
  SpriteMaterial: SpriteMaterial,
  GraySpriteMaterial: GraySpriteMaterial,
  StencilMaterial: StencilMaterial,

  // shaders
  shaders: shaders,

  // memop
  RecyclePool: RecyclePool,
  Pool: Pool,

  // modules
  math: math,
  renderer: renderer,
  gfx: gfx,
};

module.exports = renderEngine;
