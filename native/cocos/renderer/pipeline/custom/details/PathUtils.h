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

#include <boost/algorithm/string/predicate.hpp>
#include <string_view>
#include "cocos/base/std/container/array.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"

namespace cc {

namespace render {

namespace impl {

template <class CharT, class Allocator>
inline void cleanPath(std::basic_string<CharT, std::char_traits<CharT>, Allocator> &str) noexcept {
    using string_t = std::basic_string<CharT, std::char_traits<CharT>, Allocator>;
    constexpr CharT slash[] = {'/', '\0'};
    constexpr CharT doubleSlash[] = {'/', '/', '\0'};

    CC_EXPECTS(!str.empty());
    CC_EXPECTS(boost::algorithm::starts_with(str, std::string_view(slash)));
    CC_EXPECTS(str.find(doubleSlash) == string_t::npos);

    { // remove all /./
        constexpr CharT current[] = {'/', '.', '/', '\0'};

        auto pos = str.rfind(current);
        while (pos != string_t::npos) {
            str.erase(pos, 2);
            pos = str.rfind(current);
        }
        // remove tailing /.
        constexpr CharT ending[] = {'/', '.', '\0'};
        if (boost::algorithm::ends_with(str, std::string_view(ending))) {
            str.resize(str.size() - 2);
        }
    }

    // try remove /..
    constexpr ccstd::array<CharT, 4> previous = {CharT('/'), CharT('.'), CharT('.'), CharT('\0')};
    auto pos = str.find(previous.data());
    while (pos != string_t::npos) {
        if (pos == 0) {
            // root element has not parent path
            str = {}; // slash;
            return;
        }
        auto beg = str.rfind(slash, pos - 1);
        CC_EXPECTS(beg != string_t::npos);
        str.erase(beg, pos - beg + previous.size() - 1);
    }
}

} // namespace impl

} // namespace render

} // namespace cc
