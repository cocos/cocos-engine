/****************************************************************************
Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include <Windows.h>
#include <conio.h>
#include "base/Log.h"
#include "platform/CountdownTrigger.h"

namespace cc {
struct CountdownTriggerContext {
    HANDLE timer;
    static void fire(CountdownTrigger *watcher) {
        if (watcher) watcher->fire();
    }
};
namespace {
cc::CountdownTrigger *currentCountdownTrigger = nullptr;
static VOID CALLBACK timer_routine(PVOID lpParam, BOOLEAN timerOrWaitFired) { // NOLINT
    auto *watchDog = static_cast<cc::CountdownTrigger *>(lpParam);
    if (currentCountdownTrigger == watchDog) {
        cc::CountdownTriggerContext::fire(watchDog);
    }
}
} // namespace
void CountdownTrigger::init() {}
void CountdownTrigger::destroy() {}

CountdownTrigger::CountdownTrigger(int32_t timeoutMS, Callback cb) : _onTimeout(cb), _timeoutMS(timeoutMS) {
    CC_ASSERTF(currentCountdownTrigger == nullptr, "Only one instance of CountdownTrigger should exist at a time. ");
    currentCountdownTrigger = this;
    if (timeoutMS <= 0) {
        return;
    }
    _context = std::make_unique<CountdownTriggerContext>();
    _startTime = std::chrono::steady_clock::now();
    BOOLEAN success = CreateTimerQueueTimer(&_context->timer, nullptr, (WAITORTIMERCALLBACK)timer_routine, this, timeoutMS, 0, 0);
    if (!success) {
        CC_LOG_ERROR("Failed to create timer");
    }
}

CountdownTrigger::~CountdownTrigger() {
    currentCountdownTrigger = nullptr;
    if (!_context) return;
    if (!DeleteTimerQueueTimer(nullptr, _context->timer, nullptr)) {
        CC_LOG_ERROR("Failed to delete timer");
    }
    if (_callbackFired) {
        inspect();
    }
}

} // namespace cc
