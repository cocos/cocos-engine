/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

// Fix Circular dependency
import * as bits from './bits';
import { ValueType } from '../value-types';
import { IVec3Like } from './type-define';

const _d2r = Math.PI / 180.0;

const _r2d = 180.0 / Math.PI;

export const HALF_PI = Math.PI * 0.5;
export const TWO_PI = Math.PI * 2.0;

export const EPSILON = 0.000001;

/**
 * @en Tests whether or not the arguments have approximately the same value, within an absolute<br/>
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less<br/>
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * @zh 在glMatrix的绝对或相对容差范围内，测试参数是否具有近似相同的值。<br/>
 * EPSILON(小于等于1.0的值采用绝对公差，大于1.0的值采用相对公差)
 * @param a The first number to test.
 * @param b The second number to test.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export function equals (a: number, b: number) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/**
 * @en Tests whether or not the arguments have approximately the same value by given maxDiff<br/>
 * @zh 通过给定的最大差异，测试参数是否具有近似相同的值。
 * @param a The first number to test.
 * @param b The second number to test.
 * @param maxDiff Maximum difference.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export function approx (a: number, b: number, maxDiff: number) {
    maxDiff = maxDiff || EPSILON;
    return Math.abs(a - b) <= maxDiff;
}

/**
 * @en Clamps a value between a minimum float and maximum float value.<br/>
 * @zh 返回最小浮点数和最大浮点数之间的一个数值。可以使用 clamp 函数将不断变化的数值限制在范围内。
 * @param val
 * @param min
 * @param max
 */
export function clamp (val: number, min: number, max: number) {
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }

    return val < min ? min : val > max ? max : val;
}

/**
 * @en Clamps a value between 0 and 1.<br/>
 * @zh 将值限制在0和1之间。
 * @param val
 */
export function clamp01 (val: number) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
}

/**
 * @param from
 * @param to
 * @param ratio - The interpolation coefficient.
 */
export function lerp (from: number, to: number, ratio: number) {
    return from + (to - from) * ratio;
}

/**
 * @en Convert Degree To Radian<br/>
 * @zh 把角度换算成弧度。
 * @param {Number} a Angle in Degrees
 */
export function toRadian (a: number) {
    return a * _d2r;
}

/**
 * @en Convert Radian To Degree<br/>
 * @zh 把弧度换算成角度。
 * @param {Number} a Angle in Radian
 */
export function toDegree (a: number) {
    return a * _r2d;
}

/**
 * @method random
 */
export const random = Math.random;

/**
 * @en Returns a floating-point random number between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点随机数。
 * @method randomRange
 * @param min
 * @param max
 * @return The random number.
 */
export function randomRange (min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * @en Returns a random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的随机整数。
 * @param min
 * @param max
 * @return The random integer.
 */
export function randomRangeInt (min: number, max: number) {
    return Math.floor(randomRange(min, max));
}

/**
 * @en
 * Linear congruence generator using Hull-Dobell Theorem.
 * @zh
 * 使用 Hull-Dobell 算法的线性同余生成器构造伪随机数
 *
 * @param seed The random seed.
 * @return The pseudo random.
 */
export function pseudoRandom (seed: number) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
}

/**
 * @en
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 * @zh
 * 返回一个在范围内的浮点伪随机数，注意，不包含边界值
 *
 * @param seed
 * @param min
 * @param max
 * @return The random number.
 */
export function pseudoRandomRange (seed: number, min: number, max: number) {
    return pseudoRandom(seed) * (max - min) + min;
}

/**
 * @en Returns a pseudo-random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点伪随机数。
 * @param seed
 * @param min
 * @param max
 * @return The random integer.
 */
export function pseudoRandomRangeInt (seed: number, min: number, max: number) {
    return Math.floor(pseudoRandomRange(seed, min, max));
}

/**
 * @en
 * Returns the next power of two for the value.<br/>
 * @zh
 * 返回下一个最接近的 2 的幂
 *
 * @param val
 * @return The the next power of two.
 */
export function nextPow2 (val: number) {
    return bits.nextPow2(val);
}

/**
 * @en Returns float remainder for t / length.<br/>
 * @zh 返回t / length的浮点余数。
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The Time wrapped in the first cycle.
 */
export function repeat (t: number, length: number) {
    return t - Math.floor(t / length) * length;
}

/**
 * @en
 * Returns time wrapped in ping-pong mode.
 * @zh
 * 返回乒乓模式下的相对时间
 *
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The time wrapped in the first cycle.
 */
export function pingPong (t: number, length: number) {
    t = repeat(t, length * 2);
    t = length - Math.abs(t - length);
    return t;
}

/**
 * @en Returns ratio of a value within a given range.<br/>
 * @zh 返回给定范围内的值的比率。
 * @param from Start value.
 * @param to End value.
 * @param value Given value.
 * @return The ratio between [from, to].
 */
export function inverseLerp (from: number, to: number, value: number) {
    return (value - from) / (to - from);
}

/**
 * @en Compare the absolute values of all components and the component with the largest absolute value will be returned.
 * @zh 对所有分量的绝对值进行比较大小，返回绝对值最大的分量。
 * @param v vec3 like value
 * @returns max absolute component
 */
export function absMaxComponent (v: IVec3Like) {
    if (Math.abs(v.x) > Math.abs(v.y)) {
        if (Math.abs(v.x) > Math.abs(v.z)) {
            return v.x;
        } else {
            return v.z;
        }
    } else if (Math.abs(v.y) > Math.abs(v.z)) {
        return v.y;
    } else {
        return v.z;
    }
}

/**
 * @en Compare the absolute value of two values and return the value with the largest absolute value
 * @zh 对 a b 的绝对值进行比较大小，返回绝对值最大的值。
 * @param a number
 * @param b number
 */
export function absMax (a: number, b: number) {
    if (Math.abs(a) > Math.abs(b)) {
        return a;
    } else {
        return b;
    }
}

/**
 * @en
 * Make the attributes of the specified class available to be enumerated
 * @zh
 * 使指定类的特定属性可被枚举
 * @param prototype Inherit the prototype chain of the ValueType class
 * @param attrs List of attributes that need to be enumerated
 */
export function enumerableProps (prototype: ValueType, attrs: string[]) {
    attrs.forEach((key) => {
        Object.defineProperty(prototype, key, { enumerable: true });
    });
}
