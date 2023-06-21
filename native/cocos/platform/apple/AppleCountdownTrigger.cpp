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

#include <sys/time.h>
#include <unistd.h>
#include <algorithm>
#include <chrono>
#include <csignal>
#include <cstdlib>
#include <ctime>
#include <functional>
#include <memory>
#include "base/Assertf.h"
#include "base/Log.h"
#include "platform/CountdownTrigger.h"

namespace cc {
struct CountdownTriggerContext {
    struct sigaction preAction;
    struct sigaction currAction;
    struct itimerval timer;
    struct itimerval prevTimer;

    static void fire(CountdownTrigger *watcher) {
        if (watcher) watcher->fire();
    }
};
namespace {
cc::CountdownTrigger *currentCountdownTrigger = nullptr;
void timer_signal_handler(int signal, siginfo_t *info, void *) { // NOLINT
    if (signal == SIGVTALRM) {
        cc::CountdownTriggerContext::fire(currentCountdownTrigger);
    }
}

struct sigaction backupAction;
struct sigaction globalPrevAction;

} // namespace

void CountdownTrigger::init() {
    memset(&backupAction, 0, sizeof(backupAction));
    sigaction(SIGVTALRM, nullptr, &globalPrevAction);
    // App may crash if no handler setup for signal
    if (globalPrevAction.sa_handler == nullptr && globalPrevAction.sa_sigaction == nullptr) {
        memset(&backupAction, 0, sizeof(backupAction));
        backupAction.sa_handler = SIG_IGN; // ignore signal
        backupAction.sa_flags = 0;
        sigaction(SIGVTALRM, &backupAction, nullptr);
    } else {
        // restore signal handle
        sigaction(SIGVTALRM, &globalPrevAction, nullptr);
    }
}

void CountdownTrigger::destroy() {
    if (backupAction.sa_handler == SIG_IGN) {
        sigaction(SIGVTALRM, &globalPrevAction, nullptr);
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
    auto &pTimer = _context->prevTimer;

    memset(&action, 0, sizeof(action));
    action.sa_sigaction = timer_signal_handler;
    action.sa_flags = SA_SIGINFO;

    if (sigaction(SIGVTALRM, &action, &prev)) {
        perror("sigaction register");
    }

    timer.it_value.tv_sec = timeoutMS / 1000;
    timer.it_value.tv_usec = (timeoutMS % 1000) * 1000;
    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 0;
    setitimer(ITIMER_VIRTUAL, &timer, &pTimer);
}

CountdownTrigger::~CountdownTrigger() {
    currentCountdownTrigger = nullptr;
    if (!_context) {
        return;
    }

    auto &timer = _context->timer;
    auto &ptimer = _context->prevTimer;
    timer.it_value.tv_sec = 0;
    timer.it_value.tv_usec = 0;
    setitimer(ITIMER_VIRTUAL, &timer, nullptr);
    setitimer(ITIMER_VIRTUAL, &ptimer, nullptr);
    if (sigaction(SIGVTALRM, &_context->preAction, nullptr)) {
        perror("sigaction cancel");
    }
    if (_callbackFired) {
        inspect();
    }
}

} // namespace cc
