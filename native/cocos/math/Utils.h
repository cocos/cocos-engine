/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

#pragma once

#include <algorithm>
#include <cmath>
#include "math/Vec3.h"

namespace cc {

namespace mathutils {

constexpr auto EPSILON = 0.000001;
constexpr auto D2R = M_PI / 180.0;
constexpr auto R2D = 180.0 / M_PI;
constexpr auto HALF_TO_RAD = 0.5 * D2R;
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
template <typename F>
bool equals(F a, F b) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return std::fabs(a - b) <= EPSILON * std::max(1.0F, std::max(std::fabs(a), std::fabs(b)));
}

/**
 * @en Tests whether or not the arguments have approximately the same value by given maxDiff<br/>
 * @zh 通过给定的最大差异，测试参数是否具有近似相同的值。
 * @param a The first number to test.
 * @param b The second number to test.
 * @param maxDiff Maximum difference.
 * @return True if the numbers are approximately equal, false otherwise.
 */
template <typename F>
bool approx(F a, F b, F maxDiff) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return std::fabs(a - b) <= maxDiff;
}

template <typename F>
bool approx(F a, F b) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return std::fabs(a - b) <= EPSILON;
}

/**
 * @en Clamps a value between a minimum float and maximum float value.<br/>
 * @zh 返回最小浮点数和最大浮点数之间的一个数值。可以使用 clamp 函数将不断变化的数值限制在范围内。
 * @param val
 * @param min
 * @param max
 */
template <typename F>
typename std::enable_if<std::is_arithmetic<F>::value, F>::type
clamp(F val, F min, F max) {
    if (min > max) {
        const auto temp = min;
        min = max;
        max = temp;
    }

    return val < min ? min : val > max ? max
                                       : val;
}

/**
 * @en Clamps a value between 0 and 1.<br/>
 * @zh 将值限制在0和1之间。
 * @param val
 */
template <typename F>
auto clamp01(F val) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return val < 0 ? 0 : val > 1 ? 1
                                 : val;
}

/**
 * @param from
 * @param to
 * @param ratio - The interpolation coefficient.
 */
template <typename F>
auto lerp(F from, F to, F ratio) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return from + (to - from) * ratio;
}

/**
 * @en Convert Degree To Radian<br/>
 * @zh 把角度换算成弧度。
 * @param {Number} a Angle in Degrees
 */
template <typename F>
auto toRadian(F a) {
    static_assert(std::is_floating_point<F>::value, "number expected");
    return a * D2R;
}

/**
 * @en Convert Radian To Degree<br/>
 * @zh 把弧度换算成角度。
 * @param {Number} a Angle in Radian
 */
template <typename F>
auto toDegree(F a) {
    return a * R2D;
}

/**
 * @method random
 */
float random();

/**
 * @en Returns a floating-point random number between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点随机数。
 * @method randomRange
 * @param min
 * @param max
 * @return The random number.
 */
template <typename T>
auto randomRange(T min, T max) {
    return random() * (max - min) + min;
}

/**
 * @en Returns a random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的随机整数。
 * @param min
 * @param max
 * @return The random integer.
 */
template <typename T>
auto randomRangeInt(T min, T max) {
    static_assert(std::is_arithmetic<T>::value, "number expected");
    return floor(randomRange(min, max));
}

/**
 * Linear congruential generator using Hull-Dobell Theorem.
 *
 * @param seed The random seed.
 * @return The pseudo random.
 */
template <typename In>
auto pseudoRandom(In seed) {
    static_assert(std::is_arithmetic<In>::value, "number expected");
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
template <typename In>
auto pseudoRandomRange(In seed, In min, In max) {
    static_assert(std::is_arithmetic<In>::value, "number expected");
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
template <typename In>
auto pseudoRandomRangeInt(In seed, In min, In max) {
    return floor(pseudoRandomRange(seed, min, max));
}

/**
 * Returns the next power of two for the value.<br/>
 *
 * @param val
 * @return The the next power of two.
 */
template <typename T>
auto nextPow2(T val) {
    // ref: https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
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
 * @en Returns float remainder for t / length.<br/>
 * @zh 返回t / length的浮点余数。
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The Time wrapped in the first cycle.
 */
template <typename T>
auto repeat(T t, T length) {
    return t - floor(t / length) * length;
}

/**
 * Returns time wrapped in ping-pong mode.
 *
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The time wrapped in the first cycle.
 */
template <typename T>
auto pingPong(T t, T length) {
    t = repeat(t, length * 2);
    t = length - std::fabs(t - length);
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
template <typename T>
auto inverseLerp(T from, T to, T value) {
    return (value - from) / (to - from);
}

/**
 * @zh 对所有分量的绝对值进行比较大小，返回绝对值最大的分量。
 * @param v 类 Vec3 结构
 * @returns 绝对值最大的分量
 */
float absMaxComponent(const Vec3 &v);

float maxComponent(const Vec3 &v);

/**
 * @zh 对 a b 的绝对值进行比较大小，返回绝对值最大的值。
 * @param a number
 * @param b number
 */
template <typename F>
auto absMax(F a, F b) {
    return std::fabs(a) > std::fabs(b) ? a : b;
}

uint16_t floatToHalf(float fval);

float halfToFloat(uint16_t hval);

} // namespace mathutils
} // namespace cc
