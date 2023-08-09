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

#include <utility>

#include "base/std/container/string.h"
#include "renderer/core/PassUtils.h"

namespace cc {
namespace scene {

struct IMacroPatch {
    ccstd::string name;
    MacroValue value;

    IMacroPatch() = default;
    IMacroPatch(const ccstd::string& n, const MacroValue& v) {
        name = n;
        value = v;
    }

    IMacroPatch(const std::pair<const std::string, cc::MacroValue>& pair) {
        name = pair.first;
        value = pair.second;
    }

    bool operator==(const IMacroPatch& rhs) const {
        return rhs.name == name && rhs.value == value;
    }

    static bool compare(const IMacroPatch& lhs, const IMacroPatch& rhs) {
        return lhs.name < rhs.name;
    }
};

} // namespace scene
} // namespace cc
