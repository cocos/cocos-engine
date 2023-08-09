/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include <type_traits>
#include "base/VirtualInheritBase.h"
#include "base/HasMemberFunction.h"
#include "bindings/jswrapper/SeApi.h"

namespace cc {

template<typename T, typename STATE>
inline void invokeOnGarbageCollectMethod(STATE& s) {
    if constexpr (cc::has_onGarbageCollect<T, void()>::value) {
        if constexpr (std::is_base_of_v<cc::VirtualInheritBase, T>) {
            auto* cobj = SE_THIS_OBJECT_VIRTUAL<T, cc::VirtualInheritBase, STATE>(s);
            if (cobj != nullptr) cobj->onGarbageCollect();
        } else {
            auto* cobj = SE_THIS_OBJECT<T, STATE>(s);
            if (cobj != nullptr) cobj->onGarbageCollect();
        }
    }
}

} // namespace cc
