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

#include <sys/types.h>
#include <unistd.h>
#include <algorithm>
#include <chrono>
#include <csignal>
#include <cstdlib>
#include <ctime>
#include <functional>
#include <memory>
#include "base/Log.h"
#include "platform/CountdownTrigger.h"

namespace cc {

struct CountdownTriggerContext {
    struct sigaction preAction;
    struct sigaction currAction;
    timer_t timer;

    static void fire(CountdownTrigger *watcher) {
        if (watcher) watcher->fire();
    }
};

namespace {
cc::CountdownTrigger *currentCountdownTrigger = nullptr;
void timer_signal_handler(int signal, siginfo_t *si, void *uc) { // NOLINT
    if (signal == SIGUSR1 && currentCountdownTrigger) {
        auto *svptr = si->si_value.sival_ptr;
        auto *watcher = reinterpret_cast<cc::CountdownTrigger *>(svptr);
        CountdownTriggerContext::fire(watcher);
    }
}

struct sigaction backupAction;
struct sigaction globalPrevAction;
} // namespace

void CountdownTrigger::init() {
    memset(&backupAction, 0, sizeof(backupAction));
    sigaction(SIGUSR1, nullptr, &globalPrevAction);
    // App may crash if no handler setup for signal
    if (globalPrevAction.sa_handler == nullptr && globalPrevAction.sa_sigaction == nullptr) {
        memset(&backupAction, 0, sizeof(backupAction));
        backupAction.sa_handler = SIG_IGN; // ignore signal
        backupAction.sa_flags = 0;
        sigaction(SIGUSR1, &backupAction, nullptr);
    } else {
        // restore signal handle
        sigaction(SIGUSR1, &globalPrevAction, nullptr);
    }
}

void CountdownTrigger::destroy() {
    if (backupAction.sa_handler == SIG_IGN) {
        sigaction(SIGUSR1, &globalPrevAction, nullptr);
    }
}

CountdownTrigger::CountdownTrigger(int32_t timeoutMS, Callback cb) : _onTimeout(cb), _timeoutMS(timeoutMS) {
    CC_ASSERTF(currentCountdownTrigger == nullptr, "Only one instance of CountdownTrigger should exist at a time. ");
    currentCountdownTrigger = this;

    if (timeoutMS <= 0) {
        return;
    }

    _context = std::make_unique<CountdownTriggerContext>();
    _startTime = std::chrono::steady_clock::now();

    auto &action = _context->currAction;
    auto &prev = _context->preAction;
    auto &timer = _context->timer;

    memset(&action, 0, sizeof(action));
    action.sa_sigaction = timer_signal_handler;
    action.sa_flags = SA_SIGINFO;
    sigaction(SIGUSR1, &action, &prev);

    sigevent sev;
    memset(&sev, 0, sizeof(sev));
    sev.sigev_notify = SIGEV_SIGNAL;
    sev.sigev_signo = SIGUSR1;
    sev.sigev_value.sival_ptr = this;
    timer_create(CLOCK_REALTIME, &sev, &timer);

    struct itimerspec its;
    its.it_value.tv_sec = timeoutMS / 1000;
    its.it_value.tv_nsec = (timeoutMS % 1000) * 1000000;
    its.it_interval.tv_sec = 0;
    its.it_interval.tv_nsec = 0;
    timer_settime(timer, 0, &its, nullptr);
}

CountdownTrigger::~CountdownTrigger() {
    currentCountdownTrigger = nullptr;
    if (!_context) {
        return;
    }
    timer_delete(_context->timer);
    sigaction(SIGUSR1, &_context->preAction, nullptr);
    if (_callbackFired) {
        inspect();
    }
}

} // namespace cc
