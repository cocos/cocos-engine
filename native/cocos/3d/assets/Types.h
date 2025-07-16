/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include <cstdint>
#include "base/std/container/string.h"
#include "base/std/optional.h"
#include "core/TypedArray.h"
namespace cc {

using MeshWeightsType = ccstd::vector<float>;

/**
 * @en Array views for index buffer
 * @zh 允许存储索引的数组视图
 */
using IBArray = ccstd::variant<ccstd::monostate, Uint8Array, Uint16Array, Uint32Array>;

template <typename T>
T getIBArrayValue(const IBArray &arr, uint32_t idx) {
#define IBARRAY_GET_VALUE(type)               \
    do {                                      \
        auto *p = ccstd::get_if<type>(&arr);  \
        if (p != nullptr) {                   \
            return static_cast<T>((*p)[idx]); \
        }                                     \
    } while (false)

    IBARRAY_GET_VALUE(Uint16Array);
    IBARRAY_GET_VALUE(Uint32Array);
    IBARRAY_GET_VALUE(Uint8Array);

#undef IBARRAY_GET_VALUE

    return 0;
}

} // namespace cc
