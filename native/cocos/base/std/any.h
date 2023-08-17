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

#ifdef USE_CXX_17

    #include <any>

namespace ccstd {

using std::any;
using std::any_cast;

} // namespace ccstd

#else

    #include "boost/any.hpp"

namespace ccstd {

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

} // namespace ccstd
#endif
