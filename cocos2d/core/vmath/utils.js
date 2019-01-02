/**
 * @ignore
 */
const _d2r = Math.PI / 180.0;
/**
 * @ignore
 */
const _r2d = 180.0 / Math.PI;

/**
 * @property {number} EPSILON
 */
export const EPSILON = 0.000001;

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
export function equals(a, b) {
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
export function approx(a, b, maxDiff) {
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
export function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

/**
 * Clamps a value between 0 and 1.
 *
 * @method clamp01
 * @param {number} val
 * @return {number}
 */
export function clamp01(val) {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}

/**
 * @method lerp
 * @param {number} from
 * @param {number} to
 * @param {number} ratio - the interpolation coefficient
 * @return {number}
 */
export function lerp(from, to, ratio) {
  return from + (to - from) * ratio;
}

/**
* Convert Degree To Radian
*
* @param {Number} a Angle in Degrees
*/
export function toRadian(a) {
  return a * _d2r;
}

/**
* Convert Radian To Degree
*
* @param {Number} a Angle in Radian
*/
export function toDegree(a) {
  return a * _r2d;
}

/**
* @method random
*/
export const random = Math.random;

/**
 * Returns a floating-point random number between min (inclusive) and max (exclusive).
 *
 * @method randomRange
 * @param {number} min
 * @param {number} max
 * @return {number} the random number
 */
export function randomRange(min, max) {
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
export function randomRangeInt(min, max) {
  return Math.floor(randomRange(min, max));
}

/**
 * Linear congruential generator using Hull-Dobell Theorem.
 *
 * @method pseudoRandom
 * @param {number} seed the random seed
 * @return {number} the pseudo random
 */
export function pseudoRandom(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280.0;
}

/**
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 *
 * @method pseudoRandomRange
 * @param {number} seed
 * @param {number} min
 * @param {number} max
 * @return {number} the random number
 */
export function pseudoRandomRange(seed, min, max) {
  return pseudoRandom(seed) * (max - min) + min;
}

/**
 * Returns a pseudo-random integer between min (inclusive) and max (exclusive).
 *
 * @method pseudoRandomRangeInt
 * @param {number} seed
 * @param {number} min
 * @param {number} max
 * @return {number} the random integer
 */
export function pseudoRandomRangeInt(seed, min, max) {
  return Math.floor(pseudoRandomRange(seed, min, max));
}

/**
 * Returns the next power of two for the value
 *
 * @method nextPow2
 * @param {number} val
 * @return {number} the the next power of two
 */
export function nextPow2(val) {
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
 * Returns float remainder for t / length
 *
 * @method repeat
 * @param {number} t time start at 0
 * @param {number} length time of one cycle
 * @return {number} the time wrapped in the first cycle
 */
export function repeat(t, length) {
  return t - Math.floor(t / length) * length;
}

/**
 * Returns time wrapped in ping-pong mode
 *
 * @method repeat
 * @param {number} t time start at 0
 * @param {number} length time of one cycle
 * @return {number} the time wrapped in the first cycle
 */
export function pingPong(t, length) {
  t = repeat(t, length * 2);
  t = length - Math.abs(t - length);
  return t;
}

/**
 * Returns ratio of a value within a given range
 *
 * @method repeat
 * @param {number} from start value
 * @param {number} to end value
 * @param {number} value given value
 * @return {number} the ratio between [from,to]
 */
export function inverseLerp(from, to, value) {
  return (value - from) / (to - from);
}