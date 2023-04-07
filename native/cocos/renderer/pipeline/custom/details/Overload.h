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
#include <boost/mp11/algorithm.hpp>
#include <type_traits>
#include <utility>
#include "cocos/base/std/variant.h"

namespace cc {

template<class... Ts> struct Overloaded : Ts... {
    using Ts::operator()...;
};

template<class... Ts> Overloaded(Ts...) -> Overloaded<Ts...>;

template <class... Ts>
Overloaded<Ts...> overload(Ts&&... ts) {
    return {std::forward<Ts>(ts)...};
}

template <typename V>
auto variantFromIndex(size_t index) -> V { // NOLINT
    return boost::mp11::mp_with_index<boost::mp11::mp_size<V>>(index,
                                                               [](auto i) { return V(ccstd::in_place_index<i>); });
}

} // namespace cc
