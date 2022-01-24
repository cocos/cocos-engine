/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include <dispatch/dispatch.h>

namespace cc {
namespace gfx {

class CCMTLSemaphore final {
public:
    explicit CCMTLSemaphore(uint initialValue) : _semaphoreCount(initialValue) {
        _semaphore = dispatch_semaphore_create(initialValue);
    }
    ~CCMTLSemaphore()                      = default;
    CCMTLSemaphore(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore(CCMTLSemaphore &&)      = delete;
    CCMTLSemaphore &operator=(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore &operator=(CCMTLSemaphore &&) = delete;

    void signal() const {
        dispatch_semaphore_signal(_semaphore);
    }

    void wait() const {
        dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
    }

    void trySyncAll(uint64_t nanoSec) {
        for (uint i = 0; i < _semaphoreCount; i++) {
            dispatch_semaphore_wait(_semaphore, nanoSec);
        }
    }

    void syncAll() {
        for (uint i = 0; i < _semaphoreCount; i++) {
            dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
        }
    }

protected:
    dispatch_semaphore_t _semaphore      = nullptr;
    uint                 _semaphoreCount = 0;
};

} // namespace gfx
} // namespace cc
