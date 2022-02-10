/****************************************************************************
 Copyright (c) 2010 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <algorithm>
#include <bitset>
#include <cerrno>
#include <climits>
#include <limits>
#include <string>
#include <vector>
#include "base/Macros.h"
#include "base/TypeDef.h"
/** @file ccUtils.h
Misc free functions
*/

namespace cc {
namespace utils {

CC_DLL std::string getStacktrace(uint skip = 0, uint maxDepth = UINT_MAX);

/**
 * Returns the Next Power of Two value.
 * Examples:
 * - If "value" is 15, it will return 16.
 * - If "value" is 16, it will return 16.
 * - If "value" is 17, it will return 32.
 * @param value The value to get next power of two.
 * @return Returns the next power of two value.
 * @since v0.99.5
*/
CC_DLL uint nextPOT(uint x);

/**
 * Same to ::atof, but strip the string, remain 7 numbers after '.' before call atof.
 * Why we need this? Because in android c++_static, atof ( and std::atof ) is unsupported for numbers have long decimal part and contain
 * several numbers can approximate to 1 ( like 90.099998474121094 ), it will return inf. This function is used to fix this bug.
 * @param str The string be to converted to double.
 * @return Returns converted value of a string.
 */
CC_DLL double atof(const char *str);

template <typename T, typename = typename std::enable_if_t<std::is_integral<T>::value && std::is_unsigned<T>::value>>
inline T getLowestBit(T mask) {
    return mask & (-mask);
}

template <typename T, typename = typename std::enable_if_t<std::is_integral<T>::value && std::is_unsigned<T>::value>>
inline T clearLowestBit(T mask) {
    return mask & (mask - 1);
}

// v must be power of 2
inline uint32_t getBitPosition(uint32_t v) {
    if (!v) return 0;
    uint32_t c = 32;
    if (v & 0x0000FFFF) c -= 16;
    if (v & 0x00FF00FF) c -= 8;
    if (v & 0x0F0F0F0F) c -= 4;
    if (v & 0x33333333) c -= 2;
    if (v & 0x55555555) c -= 1;
    return c;
}

// v must be power of 2
inline uint64_t getBitPosition(uint64_t v) {
    if (!v) return 0;
    uint64_t c = 64;
    if (v & 0x00000000FFFFFFFFLL) c -= 32;
    if (v & 0x0000FFFF0000FFFFLL) c -= 16;
    if (v & 0x00FF00FF00FF00FFLL) c -= 8;
    if (v & 0x0F0F0F0F0F0F0F0FLL) c -= 4;
    if (v & 0x3333333333333333LL) c -= 2;
    if (v & 0x5555555555555555LL) c -= 1;
    return c;
}

template <typename T, typename = typename std::enable_if_t<std::is_integral<T>::value>>
inline size_t popcount(T mask) {
    return std::bitset<sizeof(T)>(mask).count();
}

template <typename T, typename = typename std::enable_if_t<std::is_integral<T>::value>>
inline T alignTo(T size, T alignment) {
    return ((size - 1) / alignment + 1) * alignment;
}

template <uint size, uint alignment>
constexpr uint ALIGN_TO = ((size - 1) / alignment + 1) * alignment;

template <class T>
inline uint toUint(T value) {
    static_assert(std::is_arithmetic<T>::value, "T must be numeric");

    CCASSERT(static_cast<uintmax_t>(value) <= static_cast<uintmax_t>(std::numeric_limits<uint>::max()),
             "value is too big to be converted to uint");

    return static_cast<uint>(value);
}

template <typename Map>
Map &mergeToMap(Map &outMap, const Map &inMap) {
    for (const auto &e : inMap) {
        outMap.emplace(e.first, e.second);
    }
    return outMap;
}

namespace array {

/**
 * @zh
 * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
 * @en
 * Removes the first occurrence of a specific object from the array.
 * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
 * @param array 数组。
 * @param value 待移除元素。
 */
template <typename T>
bool remove(std::vector<T> &array, T value) {
    auto iter = std::find(array.begin(), array.end(), value);
    if (iter != array.end()) {
        array.erase(iter);
        return true;
    }
    return false;
}

/**
 * @zh
 * 移除指定索引的数组元素。
 * @en
 * Removes the array item at the specified index.
 * @param array 数组。
 * @param index 待移除元素的索引。
 */
template <typename T>
bool removeAt(std::vector<T> &array, int32_t index) {
    if (index >= 0 && index < static_cast<int32_t>(array.size())) {
        array.erase(array.begin() + index);
        return true;
    }
    return false;
}

/**
 * @zh
 * 移除指定索引的数组元素。
 * 此函数十分高效，但会改变数组的元素次序。
 * @en
 * Removes the array item at the specified index.
 * It's faster but the order of the array will be changed.
 * @param array 数组。
 * @param index 待移除元素的索引。
 */
template <typename T>
bool fastRemoveAt(std::vector<T> &array, int32_t index) {
    const auto length = static_cast<int32_t>(array.size());
    if (index < 0 || index >= length) {
        return false;
    }
    array[index] = array[length - 1];
    array.resize(length - 1);
    return true;
}

/**
 * @zh
 * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
 * 此函数十分高效，但会改变数组的元素次序。
 * @en
 * Removes the first occurrence of a specific object from the array.
 * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
 * It's faster but the order of the array will be changed.
 * @param array 数组。
 * @param value 待移除元素。
 */
template <typename T>
bool fastRemove(std::vector<T> &array, T value) {
    auto iter = std::find(array.begin(), array.end(), value);
    if (iter != array.end()) {
        *iter = array[array.size() - 1];
        array.resize(array.size() - 1);
        return true;
    }
    return false;
}

} // namespace array
} // namespace utils
} // namespace cc
