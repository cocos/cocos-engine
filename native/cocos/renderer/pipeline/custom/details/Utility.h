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
#include <boost/container_hash/hash.hpp>
#include <string_view>

// transparent hash
// see https://stackoverflow.com/questions/20317413/what-are-transparent-comparators

namespace cc {

template <class Char>
struct TransparentStringHash {
    using is_transparent = void;
    using string_view_type = std::basic_string_view<Char>;

    size_t operator()(string_view_type str) const noexcept {
        return boost::hash<string_view_type>{}(str);
    }
    size_t operator()(const Char* str) const noexcept {
        return boost::hash<string_view_type>{}(str);
    }
    template <class Alloc>
    size_t operator()(const std::basic_string<Char, std::char_traits<Char>, Alloc>& str) const noexcept {
        return boost::hash<string_view_type>{}(str);
    }
};

template <class Char>
struct TransparentStringEqual {
    using is_transparent = void;
    using string_view_type = std::basic_string_view<Char>;
    template <class T, class U>
    bool operator()(T&& lhs, U&& rhs) const noexcept {
        return string_view_type{lhs} == string_view_type{rhs};
    }
};

} // namespace cc
