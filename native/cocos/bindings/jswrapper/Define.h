/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/TypeDef.h"

namespace se {

/**
 * PropertyAttribute.
 * @note Use the same value as which defined in v8, we convert it to v8::PropertyAttribute directly, so don't change the enum value.
 */
enum class PropertyAttribute : uint8_t {
    /** NONE. **/
    NONE = 0,
    /** READ_ONLY, i.e., not writable. **/
    READ_ONLY = 1 << 0,
    /** DONT_ENUM, i.e., not enumerable. **/
    DONT_ENUM = 1 << 1,
    /** DONT_DELETE, i.e., not configurable. **/
    DONT_DELETE = 1 << 2
};
CC_ENUM_BITWISE_OPERATORS(PropertyAttribute);

} // namespace se
