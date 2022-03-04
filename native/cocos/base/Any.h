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

#ifdef USE_CXX_17

    #include <any>

namespace cc {

using any = std::any;

template <typename ValueType>
inline ValueType *any_cast(any *operand) noexcept {
    return std::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline const ValueType *any_cast(const any *operand) noexcept {
    return std::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(any &operand) {
    return std::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(const any &operand) {
    return std::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(any &&operand) {
    return std::any_cast<ValueType>(operand);
}

} // namespace cc

#else

    #include "boost/any.hpp"

namespace cc {
class any : public boost::any { // NOLINT // use std style
public:
    using boost::any::any;

    inline bool has_value() const noexcept { // NOLINT // use std style
        return !this->empty();
    }
};

template <typename ValueType>
inline ValueType *any_cast(any *operand) noexcept { // NOLINT // use std style
    return boost::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline const ValueType *any_cast(const any *operand) noexcept { // NOLINT // use std style
    return boost::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(any &operand) { // NOLINT // use std style
    return boost::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(const any &operand) { // NOLINT // use std style
    return boost::any_cast<ValueType>(operand);
}

template <typename ValueType>
inline ValueType any_cast(any &&operand) { // NOLINT // use std style
    return boost::any_cast<ValueType>(operand);
}

} // namespace cc
#endif
