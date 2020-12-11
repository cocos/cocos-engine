#pragma once

#include <dispatch/dispatch.h>

namespace cc {
namespace gfx {

class CCMTLSemaphore final {
public:
    CCMTLSemaphore(uint initiaValue) {
        _semaphore = dispatch_semaphore_create(initiaValue);
    }
    
    ~CCMTLSemaphore() = default;
    
    CCMTLSemaphore(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore(CCMTLSemaphore &&) = delete;
    CCMTLSemaphore &operator=(const CCMTLSemaphore &) = delete;
    CCMTLSemaphore &operator=(CCMTLSemaphore &&) = delete;
    
    void signal() {
        dispatch_semaphore_signal(_semaphore);
    }
    
    void wait() {
        dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
    }
    
private:
    dispatch_semaphore_t _semaphore = nil;
};

}
}
