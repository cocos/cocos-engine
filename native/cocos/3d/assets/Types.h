/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
using IBArray = ccstd::variant<Uint8Array, Uint16Array, Uint32Array>;

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
