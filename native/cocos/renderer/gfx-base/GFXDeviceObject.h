/****************************************************************************
Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.
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

#include "base/Ptr.h"
#include "base/Macros.h"
#include <atomic>

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
        CC_ASSERT(count >= 0);
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
