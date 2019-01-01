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
 * @param a The first number to test.
 * @param b The second number to test.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/**
 * Tests whether or not the arguments have approximately the same value by given maxDiff
 *
 * @param a The first number to test.
 * @param b The second number to test.
 * @param maxDiff Maximum difference.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export function approx(a, b, maxDiff) {
  maxDiff = maxDiff || EPSILON;
  return Math.abs(a - b) <= maxDiff;
}

/**
 * Clamps a value between a minimum float and maximum float value.
 *
 * @method clamp
 * @param val
 * @param min
 * @param max
 * @return
 */
export function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

/**
 * Clamps a value between 0 and 1.
 *
 * @method clamp01
 * @param val
 * @return
 */
export function clamp01(val) {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}

/**
 * @method lerp
 * @param from
 * @param to
 * @param ratio - the interpolation coefficient
 * @return
 */
export function lerp(from, to, ratio) {
  return from + (to - from) * ratio;
}

/**
* Convert Degree To Radian
*
* @param a Angle in Degrees
*/
export function toRadian(a) {
  return a * _d2r;
}

/**
* Convert Radian To Degree
*
* @param a Angle in Radian
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
 * @param min
 * @param max
 * @return the random number
 */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 *
 * @method randomRangeInt
 * @param min
 * @param max
 * @return the random integer
 */
export function randomRangeInt(min, max) {
  return Math.floor(randomRange(min, max));
}

/**
 * Linear congruential generator using Hull-Dobell Theorem.
 *
 * @method pseudoRandom
 * @param seed the random seed
 * @return the pseudo random
 */
export function pseudoRandom(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280.0;
}

/**
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 *
 * @method pseudoRandomRange
 * @param seed
 * @param min
 * @param max
 * @return the random number
 */
export function pseudoRandomRange(seed, min, max) {
  return pseudoRandom(seed) * (max - min) + min;
}

/**
 * Returns a pseudo-random integer between min (inclusive) and max (exclusive).
 *
 * @method pseudoRandomRangeInt
 * @param seed
 * @param min
 * @param max
 * @return the random integer
 */
export function pseudoRandomRangeInt(seed, min, max) {
  return Math.floor(pseudoRandomRange(seed, min, max));
}

/**
 * Returns the next power of two for the value
 *
 * @method nextPow2
 * @param val
 * @return the the next power of two
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
 * @param t time start at 0
 * @param length time of one cycle
 * @return the time wrapped in the first cycle
 */
export function repeat(t, length) {
  return t - Math.floor(t / length) * length;
}

/**
 * Returns time wrapped in ping-pong mode
 *
 * @method repeat
 * @param t time start at 0
 * @param length time of one cycle
 * @return the time wrapped in the first cycle
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
 * @param from start value
 * @param to end value
 * @param value given value
 * @return the ratio between [from,to]
 */
export function inverseLerp(from, to, value) {
  return (value - from) / (to - from);
}