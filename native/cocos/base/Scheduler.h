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

#pragma once

#include <functional>
#include <mutex>
#include <set>
#include <unordered_map>
#include <vector>

#include "base/RefCounted.h"

namespace cc {

class Scheduler;

using ccSchedulerFunc = std::function<void(float)>;

/**
 * @cond
 */
class CC_DLL Timer : public RefCounted {
public:
    /** get interval in seconds */
    inline float getInterval() const { return _interval; };
    /** set interval in seconds */
    inline void setInterval(float interval) { _interval = interval; };

    void setupTimerWithInterval(float seconds, unsigned int repeat, float delay);

    virtual void trigger(float dt) = 0;
    virtual void cancel()          = 0;

    /** triggers the timer */
    void update(float dt);

protected:
    Timer() = default;

    Scheduler *  _scheduler     = nullptr;
    float        _elapsed       = 0.F;
    bool         _runForever    = false;
    bool         _useDelay      = false;
    unsigned int _timesExecuted = 0;
    unsigned int _repeat        = 0; //0 = once, 1 is 2 x executed
    float        _delay         = 0.F;
    float        _interval      = 0.F;
};

class CC_DLL TimerTargetCallback final : public Timer {
public:
    TimerTargetCallback() = default;

    // Initializes a timer with a target, a lambda and an interval in seconds, repeat in number of times to repeat, delay in seconds.
    bool initWithCallback(Scheduler *scheduler, const ccSchedulerFunc &callback, void *target, const std::string &key, float seconds, unsigned int repeat, float delay);

    inline const ccSchedulerFunc &getCallback() const { return _callback; };
    inline const std::string &    getKey() const { return _key; };

    void trigger(float dt) override;
    void cancel() override;

private:
    void *          _target   = nullptr;
    ccSchedulerFunc _callback = nullptr;
    std::string     _key;
};

/**
 * @endcond
 */

/**
 * @addtogroup base
 * @{
 */

struct _listEntry;
struct _hashSelectorEntry;
struct _hashUpdateEntry;

/** @brief Scheduler is responsible for triggering the scheduled callbacks.
You should not use system timer for your game logic. Instead, use this class.

There are 2 different types of callbacks (selectors):

- update selector: the 'update' selector will be called every frame. You can customize the priority.
- custom selector: A custom selector will be called every frame, or with a custom interval of time

The 'custom selectors' should be avoided when possible. It is faster, and consumes less memory to use the 'update selector'.

*/
class CC_DLL Scheduler final {
public:
    /**
     * Constructor
     *
     * @js ctor
     */
    Scheduler();

    /**
     * Destructor
     *
     * @js NA
     * @lua NA
     */
    ~Scheduler();

    /** 'update' the scheduler.
     * You should NEVER call this method, unless you know what you are doing.
     * @lua NA
     */
    void update(float dt);

    /////////////////////////////////////

    // schedule

    /** The scheduled method will be called every 'interval' seconds.
     If paused is true, then it won't be called until it is resumed.
     If 'interval' is 0, it will be called every frame, but if so, it's recommended to use 'scheduleUpdate' instead.
     If the 'callback' is already scheduled, then only the interval parameter will be updated without re-scheduling it again.
     repeat let the action be repeated repeat + 1 times, use CC_REPEAT_FOREVER to let the action run continuously
     delay is the amount of time the action will wait before it'll start.
     @param callback The callback function.
     @param target The target of the callback function.
     @param interval The interval to schedule the callback. If the value is 0, then the callback will be scheduled every frame.
     @param repeat repeat+1 times to schedule the callback.
     @param delay Schedule call back after `delay` seconds. If the value is not 0, the first schedule will happen after `delay` seconds.
            But it will only affect first schedule. After first schedule, the delay time is determined by `interval`.
     @param paused Whether or not to pause the schedule.
     @param key The key to identify the callback function, because there is not way to identify a std::function<>.
     @since v3.0
     */
    void schedule(const ccSchedulerFunc &callback, void *target, float interval, unsigned int repeat, float delay, bool paused, const std::string &key);

    /** The scheduled method will be called every 'interval' seconds for ever.
     @param callback The callback function.
     @param target The target of the callback function.
     @param interval The interval to schedule the callback. If the value is 0, then the callback will be scheduled every frame.
     @param paused Whether or not to pause the schedule.
     @param key The key to identify the callback function, because there is not way to identify a std::function<>.
     @since v3.0
     */
    void schedule(const ccSchedulerFunc &callback, void *target, float interval, bool paused, const std::string &key);

    /////////////////////////////////////

    // unschedule

    /** Unschedules a callback for a key and a given target.
     If you want to unschedule the 'callbackPerFrame', use unscheduleUpdate.
     @param key The key to identify the callback function, because there is not way to identify a std::function<>.
     @param target The target to be unscheduled.
     @since v3.0
     */
    void unschedule(const std::string &key, void *target);

    /** Unschedules all selectors for a given target.
     This also includes the "update" selector.
     @param target The target to be unscheduled.
     @since v0.99.3
     @lua NA
     */
    void unscheduleAllForTarget(void *target);

    /** Unschedules all selectors from all targets.
     You should NEVER call this method, unless you know what you are doing.
     @since v0.99.3
     */
    void unscheduleAll();

    /** Unschedules all selectors from all targets with a minimum priority.
     You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
     @param minPriority The minimum priority of selector to be unscheduled. Which means, all selectors which
            priority is higher than minPriority will be unscheduled.
     @since v2.0.0
     */
    void unscheduleAllWithMinPriority(int minPriority);

    /////////////////////////////////////

    // isScheduled

    /** Checks whether a callback associated with 'key' and 'target' is scheduled.
     @param key The key to identify the callback function, because there is not way to identify a std::function<>.
     @param target The target of the callback.
     @return True if the specified callback is invoked, false if not.
     @since v3.0.0
     */
    bool isScheduled(const std::string &key, void *target);

    /////////////////////////////////////

    /** Pauses the target.
     All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.
     If the target is not present, nothing happens.
     @param target The target to be paused.
     @since v0.99.3
     */
    void pauseTarget(void *target);

    /** Resumes the target.
     The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.
     If the target is not present, nothing happens.
     @param target The target to be resumed.
     @since v0.99.3
     */
    void resumeTarget(void *target);

    /** Returns whether or not the target is paused.
     * @param target The target to be checked.
     * @return True if the target is paused, false if not.
     * @since v1.0.0
     * @lua NA
     */
    bool isTargetPaused(void *target);

    /** Pause all selectors from all targets with a minimum priority.
      You should only call this with PRIORITY_NON_SYSTEM_MIN or higher.
      @param minPriority The minimum priority of selector to be paused. Which means, all selectors which
            priority is higher than minPriority will be paused.
      @since v2.0.0
      */
    std::set<void *> pauseAllTargetsWithMinPriority(int minPriority);

    /** Calls a function on the cocos2d thread. Useful when you need to call a cocos2d function from another thread.
     This function is thread safe.
     @param function The function to be run in cocos2d thread.
     @since v3.0
     @js NA
     */
    void performFunctionInCocosThread(const std::function<void()> &function);

    /**
     * Remove all pending functions queued to be performed with Scheduler::performFunctionInCocosThread
     * Functions unscheduled in this manner will not be executed
     * This function is thread safe
     * @since v3.14
     * @js NA
     */
    void removeAllFunctionsToBePerformedInCocosThread();

    bool isCurrentTargetSalvaged() const { return _currentTargetSalvaged; };

private:
    // Hash Element used for "selectors with interval"
    struct HashTimerEntry {
        std::vector<Timer *> timers;
        void *               target;
        int                  timerIndex;
        Timer *              currentTimer;
        bool                 currentTimerSalvaged;
        bool                 paused;
    };

    void removeHashElement(struct HashTimerEntry *element);
    void removeUpdateFromHash(struct _listEntry *entry);

    // update specific

    // Used for "selectors with interval"
    std::unordered_map<void *, HashTimerEntry *> _hashForTimers;
    struct HashTimerEntry *                      _currentTarget         = nullptr;
    bool                                         _currentTargetSalvaged = false;
    // If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.
    bool _updateHashLocked = false;

    // Used for "perform Function"
    std::vector<std::function<void()>> _functionsToPerform;
    std::mutex                         _performMutex;
};

// end of base group
/** @} */

} // namespace cc
