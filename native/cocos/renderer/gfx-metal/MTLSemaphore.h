/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include <dispatch/dispatch.h>

namespace cc {
namespace gfx {

class CCMTLSemaphore final {
public:
    explicit CCMTLSemaphore(uint initialValue) : _semaphoreCount(initialValue) {
        _semaphore = dispatch_semaphore_create(initialValue);
    }
    ~CCMTLSemaphore() = default;
    CCMTLSemaphore(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore(CCMTLSemaphore &&) = delete;
    CCMTLSemaphore &operator=(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore &operator=(CCMTLSemaphore &&) = delete;
    
    void signal() const {
        dispatch_semaphore_signal(_semaphore);
    }
    
    void wait() const {
        dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
    }

    void syncAll() {
        for (uint i = 0; i < _semaphoreCount; i++) {
            dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
        }
    }

private:
    dispatch_semaphore_t _semaphore = nullptr;
    uint _semaphoreCount = 0;
};

} // namespace gfx
} // namespace cc
