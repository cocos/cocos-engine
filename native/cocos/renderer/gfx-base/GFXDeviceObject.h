/****************************************************************************
Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.
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

#include <atomic>
#include "base/Macros.h"
#include "base/Ptr.h"

namespace cc {
namespace gfx {

struct DefaultDeleter {
    template <typename T>
    void operator()(T *ptr) const {
        delete ptr;
    }
};

template <typename Deleter = DefaultDeleter>
class GFXDeviceObject {
public:
    virtual ~GFXDeviceObject() noexcept = default;

    void addRef() const noexcept {
        ++_referenceCount;
    }

    void release() const noexcept {
        // atomic::operator _Ty uses load(memory_order_seq_cst), all threads observe all modifications in the same order.
        auto count = static_cast<int32_t>(--_referenceCount);
        CC_ASSERT_GE(count, 0);
        if (count == 0) {
            Deleter()(this);
        }
    }

    uint32_t getRefCount() const noexcept {
        return static_cast<uint32_t>(_referenceCount);
    }

protected:
    GFXDeviceObject() noexcept = default;

    mutable std::atomic_uint32_t _referenceCount{0};
};

template <typename T>
using ConstPtr = IntrusivePtr<const T>;

} // namespace gfx
} // namespace cc
