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

template <typename T, typename = typename std::enable_if_t<std::is_integral<T>::value>>
T alignTo(T size, T alignment) {
    return ((size - 1) / alignment + 1) * alignment;
}

template <uint size, uint alignment>
constexpr uint ALIGN_TO = ((size - 1) / alignment + 1) * alignment;

template <class T>
uint toUint(T value) {
    static_assert(std::is_arithmetic<T>::value, "T must be numeric");

    CCASSERT(static_cast<uintmax_t>(value) <= static_cast<uintmax_t>(std::numeric_limits<uint>::max()),
             "value is too big to be converted to uint");

    return static_cast<uint>(value);
}

} // namespace utils
} // namespace cc
