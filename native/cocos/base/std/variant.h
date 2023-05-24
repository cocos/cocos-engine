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

    #include <variant>

namespace ccstd {

using std::get;
using std::get_if;
using std::holds_alternative;
using std::in_place_index;
using std::monostate;
using std::variant;
using std::variant_alternative;
using std::variant_alternative_t;
using std::variant_size;
using std::variant_size_v;
using std::visit;

}; // namespace ccstd

#else

    #include "boost/variant2/variant.hpp"

namespace ccstd {

using boost::variant2::get;
using boost::variant2::get_if;
using boost::variant2::holds_alternative;
using boost::variant2::in_place_index;
using boost::variant2::monostate;
using boost::variant2::variant;
using boost::variant2::variant_alternative;
using boost::variant2::variant_alternative_t;
using boost::variant2::variant_size;
using boost::variant2::variant_size_v;
using boost::variant2::visit;

}; // namespace ccstd
#endif
