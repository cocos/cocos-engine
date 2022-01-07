/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2011 Zynga Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/Scheduler.h"

#include <algorithm>
#include <climits>
#include <vector>
#include "base/Log.h"
#include "base/Macros.h"

namespace {
constexpr unsigned CC_REPEAT_FOREVER{UINT_MAX - 1};
constexpr int      MAX_FUNC_TO_PERFORM{30};
constexpr int      INITIAL_TIMER_COUND{10};
} // namespace

namespace cc {
// implementation Timer

void Timer::setupTimerWithInterval(float seconds, unsigned int repeat, float delay) {
    _elapsed    = -1;
    _interval   = seconds;
    _delay      = delay;
    _useDelay   = _delay > 0.0F;
    _repeat     = repeat;
    _runForever = _repeat == CC_REPEAT_FOREVER;
}

void Timer::update(float dt) {
    if (_elapsed == -1) {
        _elapsed       = 0;
        _timesExecuted = 0;
        return;
    }

    // accumulate elapsed time
    _elapsed += dt;

    // deal with delay
    if (_useDelay) {
        if (_elapsed < _delay) {
            return;
        }
        trigger(_delay);
        _elapsed = _elapsed - _delay;
        _timesExecuted += 1;
        _useDelay = false;
        // after delay, the rest time should compare with interval
        if (!_runForever && _timesExecuted > _repeat) { //unschedule timer
            cancel();
            return;
        }
    }

    // if _interval == 0, should trigger once every frame
    float interval = (_interval > 0) ? _interval : _elapsed;
    while (_elapsed >= interval) {
        trigger(interval);
        _elapsed -= interval;
        _timesExecuted += 1;

        if (!_runForever && _timesExecuted > _repeat) {
            cancel();
            break;
        }

        if (_elapsed <= 0.F) {
            break;
        }

        if (_scheduler->isCurrentTargetSalvaged()) {
            break;
        }
    }
}

// TimerTargetCallback

bool TimerTargetCallback::initWithCallback(Scheduler *scheduler, const ccSchedulerFunc &callback, void *target, const std::string &key, float seconds, unsigned int repeat, float delay) {
    _scheduler = scheduler;
    _target    = target;
    _callback  = callback;
    _key       = key;
    setupTimerWithInterval(seconds, repeat, delay);
    return true;
}

void TimerTargetCallback::trigger(float dt) {
    if (_callback) {
        _callback(dt);
    }
}

void TimerTargetCallback::cancel() {
    _scheduler->unschedule(_key, _target);
}

// implementation of Scheduler

Scheduler::Scheduler() {
    // I don't expect to have more than 30 functions to all per frame
    _functionsToPerform.reserve(MAX_FUNC_TO_PERFORM);
}

Scheduler::~Scheduler() {
    unscheduleAll();
}

void Scheduler::removeHashElement(HashTimerEntry *element) {
    if (element) {
        for (auto &timer : element->timers) {
            timer->release();
        }
        element->timers.clear();

        _hashForTimers.erase(element->target);
        free(element);
    }
}

void Scheduler::schedule(const ccSchedulerFunc &callback, void *target, float interval, bool paused, const std::string &key) {
    this->schedule(callback, target, interval, CC_REPEAT_FOREVER, 0.0F, paused, key);
}

void Scheduler::schedule(const ccSchedulerFunc &callback, void *target, float interval, unsigned int repeat, float delay, bool paused, const std::string &key) {
    CCASSERT(target, "Argument target must be non-nullptr");
    CCASSERT(!key.empty(), "key should not be empty!");

    auto            iter    = _hashForTimers.find(target);
    HashTimerEntry *element = nullptr;
    if (iter == _hashForTimers.end()) {
        element         = new HashTimerEntry();
        element->target = target;

        _hashForTimers[target] = element;

        // Is this the 1st element ? Then set the pause level to all the selectors of this target
        element->paused = paused;
    } else {
        element = iter->second;
        CCASSERT(element->paused == paused, "element's paused should be paused!");
    }

    if (element->timers.empty()) {
        element->timers.reserve(INITIAL_TIMER_COUND);
    } else {
        for (auto &e : element->timers) {
            auto *timer = dynamic_cast<TimerTargetCallback *>(e);
            if (key == timer->getKey()) {
                CC_LOG_DEBUG("CCScheduler#scheduleSelector. Selector already scheduled. Updating interval from: %.4f to %.4f", timer->getInterval(), interval);
                timer->setInterval(interval);
                return;
            }
        }
    }

    auto *timer = new (std::nothrow) TimerTargetCallback();
    timer->addRef();
    timer->initWithCallback(this, callback, target, key, interval, repeat, delay);
    element->timers.emplace_back(timer);
}

void Scheduler::unschedule(const std::string &key, void *target) {
    // explicit handle nil arguments when removing an object
    if (target == nullptr || key.empty()) {
        return;
    }

    auto iter = _hashForTimers.find(target);
    if (iter != _hashForTimers.end()) {
        HashTimerEntry *element = iter->second;
        int             i       = 0;
        auto &          timers  = element->timers;

        for (auto *t : timers) {
            auto *timer = dynamic_cast<TimerTargetCallback *>(t);

            if (timer && key == timer->getKey()) {
                if (timer == element->currentTimer && (!element->currentTimerSalvaged)) {
                    element->currentTimer->addRef();
                    element->currentTimerSalvaged = true;
                }

                timers.erase(timers.begin() + i);
                timer->release();

                // update timerIndex in case we are in tick:, looping over the actions
                if (element->timerIndex >= i) {
                    element->timerIndex--;
                }

                if (timers.empty()) {
                    if (_currentTarget == element) {
                        _currentTargetSalvaged = true;
                    } else {
                        removeHashElement(element);
                    }
                }

                return;
            }

            ++i;
        }
    }
}

bool Scheduler::isScheduled(const std::string &key, void *target) {
    CCASSERT(!key.empty(), "Argument key must not be empty");
    CCASSERT(target, "Argument target must be non-nullptr");

    auto iter = _hashForTimers.find(target);
    if (iter == _hashForTimers.end()) {
        return false;
    }

    HashTimerEntry *element = iter->second;
    if (element->timers.empty()) {
        return false;
    }

    const auto &timers = element->timers;
    return std::any_of(timers.begin(), timers.end(), [&key](Timer *t) {
        auto *timer = dynamic_cast<TimerTargetCallback *>(t);
        return (timer && key == timer->getKey());
    });
}

void Scheduler::unscheduleAll() {
    for (auto iter = _hashForTimers.begin(); iter != _hashForTimers.end();) {
        unscheduleAllForTarget(iter++->first);
    }
}

void Scheduler::unscheduleAllForTarget(void *target) {
    // explicit nullptr handling
    if (target == nullptr) {
        return;
    }

    // Custom Selectors

    auto iter = _hashForTimers.find(target);
    if (iter != _hashForTimers.end()) {
        HashTimerEntry *element = iter->second;
        auto &          timers  = element->timers;
        if (std::find(timers.begin(), timers.end(), element->currentTimer) != timers.end() &&
            (!element->currentTimerSalvaged)) {
            element->currentTimer->addRef();
            element->currentTimerSalvaged = true;
        }

        for (auto *t : timers) {
            t->release();
        }
        timers.clear();

        if (_currentTarget == element) {
            _currentTargetSalvaged = true;
        } else {
            removeHashElement(element);
        }
    }
}

void Scheduler::resumeTarget(void *target) {
    CCASSERT(target != nullptr, "target can't be nullptr!");

    // custom selectors
    auto iter = _hashForTimers.find(target);
    if (iter != _hashForTimers.end()) {
        iter->second->paused = false;
    }
}

void Scheduler::pauseTarget(void *target) {
    CCASSERT(target != nullptr, "target can't be nullptr!");

    // custom selectors
    auto iter = _hashForTimers.find(target);
    if (iter != _hashForTimers.end()) {
        iter->second->paused = true;
    }
}

bool Scheduler::isTargetPaused(void *target) {
    CCASSERT(target != nullptr, "target must be non nil");

    // Custom selectors
    auto iter = _hashForTimers.find(target);
    if (iter != _hashForTimers.end()) {
        return iter->second->paused;
    }

    return false; // should never get here
}

void Scheduler::performFunctionInCocosThread(const std::function<void()> &function) {
    _performMutex.lock();
    _functionsToPerform.push_back(function);
    _performMutex.unlock();
}

void Scheduler::removeAllFunctionsToBePerformedInCocosThread() {
    std::unique_lock<std::mutex> lock(_performMutex);
    _functionsToPerform.clear();
}

// main loop
void Scheduler::update(float dt) {
    _updateHashLocked = true;

    // Iterate over all the custom selectors
    HashTimerEntry *elt = nullptr;
    for (auto iter = _hashForTimers.begin(); iter != _hashForTimers.end();) {
        elt                    = iter->second;
        _currentTarget         = elt;
        _currentTargetSalvaged = false;

        if (!_currentTarget->paused) {
            // The 'timers' array may change while inside this loop
            for (elt->timerIndex = 0; elt->timerIndex < static_cast<int>(elt->timers.size()); ++(elt->timerIndex)) {
                elt->currentTimer         = elt->timers.at(elt->timerIndex);
                elt->currentTimerSalvaged = false;

                elt->currentTimer->update(dt);

                if (elt->currentTimerSalvaged) {
                    // The currentTimer told the remove itself. To prevent the timer from
                    // accidentally deallocating itself before finishing its step, we retained
                    // it. Now that step is done, it's safe to release it.
                    elt->currentTimer->release();
                }

                elt->currentTimer = nullptr;
            }
        }

        // only delete currentTarget if no actions were scheduled during the cycle (issue #481)
        if (_currentTargetSalvaged && _currentTarget->timers.empty()) {
            ++iter;
            removeHashElement(_currentTarget);
            if (iter != _hashForTimers.end()) {
                ++iter;
            }
        } else {
            ++iter;
        }
    }

    _updateHashLocked = false;
    _currentTarget    = nullptr;

    //
    // Functions allocated from another thread
    //

    // Testing size is faster than locking / unlocking.
    // And almost never there will be functions scheduled to be called.
    if (!_functionsToPerform.empty()) {
        _performMutex.lock();
        // fixed #4123: Save the callback functions, they must be invoked after '_performMutex.unlock()', otherwise if new functions are added in callback, it will cause thread deadlock.
        auto temp = _functionsToPerform;
        _functionsToPerform.clear();
        _performMutex.unlock();
        for (const auto &function : temp) {
            function();
        }
    }
}

} // namespace cc
