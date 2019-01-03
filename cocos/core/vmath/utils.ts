const _d2r = Math.PI / 180.0;

const _r2d = 180.0 / Math.PI;

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
export function equals(a: number, b: number) {
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
export function approx(a: number, b: number, maxDiff: number) {
    maxDiff = maxDiff || EPSILON;
    return Math.abs(a - b) <= maxDiff;
}

/**
 * Clamps a value between a minimum float and maximum float value.
 *
 * @param val
 * @param min
 * @param max
 */
export function clamp(val: number, min: number, max: number) {
    return val < min ? min : val > max ? max : val;
}

/**
 * Clamps a value between 0 and 1.
 *
 * @param val
 */
export function clamp01(val: number) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
}

/**
 * @param from
 * @param to
 * @param ratio - The interpolation coefficient.
 */
export function lerp(from: number, to: number, ratio: number) {
    return from + (to - from) * ratio;
}

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
export function toRadian(a: number) {
    return a * _d2r;
}

/**
 * Convert Radian To Degree
 *
 * @param {Number} a Angle in Radian
 */
export function toDegree(a: number) {
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
 * @return The random number.
 */
export function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 *
 * @param min
 * @param max
 * @return The random integer.
 */
export function randomRangeInt(min: number, max: number) {
    return Math.floor(randomRange(min, max));
}

/**
 * Linear congruential generator using Hull-Dobell Theorem.
 *
 * @param seed The random seed.
 * @return The pseudo random.
 */
export function pseudoRandom(seed: number) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
}

/**
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 *
 * @param seed
 * @param min
 * @param max
 * @return The random number.
 */
export function pseudoRandomRange(seed: number, min: number, max: number) {
    return pseudoRandom(seed) * (max - min) + min;
}

/**
 * Returns a pseudo-random integer between min (inclusive) and max (exclusive).
 *
 * @param seed
 * @param min
 * @param max
 * @return The random integer.
 */
export function pseudoRandomRangeInt(seed: number, min: number, max: number) {
    return Math.floor(pseudoRandomRange(seed, min, max));
}

/**
 * Returns the next power of two for the value.
 *
 * @param val
 * @return The the next power of two.
 */
export function nextPow2(val: number) {
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
 * Returns float remainder for t / length.
 *
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The Time wrapped in the first cycle.
 */
export function repeat(t: number, length: number) {
    return t - Math.floor(t / length) * length;
}

/**
 * Returns time wrapped in ping-pong mode.
 *
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The time wrapped in the first cycle.
 */
export function pingPong(t: number, length: number) {
    t = repeat(t, length * 2);
    t = length - Math.abs(t - length);
    return t;
}

/**
 * Returns ratio of a value within a given range.
 *
 * @param from Start value.
 * @param to End value.
 * @param value Given value.
 * @return The ratio between [from, to].
 */
export function inverseLerp(from: number, to: number, value: number) {
    return (value - from) / (to - from);
}
