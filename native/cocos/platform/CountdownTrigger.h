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
#pragma once

#include <chrono>
#include <memory>
#include "base/Log.h"

namespace cc {
struct CountdownTriggerContext;

/**
 * @class CountdownTrigger
 * @brief A class implementing a singleton countdown trigger mechanism.
 *
 * The CountdownTrigger class provides a mechanism to trigger a callback function after a specified timeout duration.
 * Due to the underlying signal system implementation, only one instance of CountdownTrigger can be created at a time.
 * This is because signal handlers may overwrite each other if multiple instances exist.
 * The callback function is intended to be automatically triggered when the timeout is reached.
 * If the CountdownTrigger object is destroyed, the countdown trigger will be cancelled.
 *
 * Example usage:
 * @code
 *     void myTimeoutFunction() {
 *         // Code to be executed upon timeout.
 *     }
 *     {
 *         CountdownTrigger wd(5000, myTimeoutFunction); // Set a timeout of 5000 milliseconds.
 *         // Perform actions under the supervision of the CountdownTrigger.
 *         ....
 *     }
 * @endcode
 */
class CountdownTrigger final {
public:
    using Callback = void (*)();
    /**
     * @brief Construct a new CountdownTrigger object. Remember only one instance of CountdownTrigger can exist at a time.
     *
     * @param timeoutMS The timeout duration in milliseconds.
     * @param cb The callback function to be executed when the timeout duration is reached.
     */
    CountdownTrigger(int32_t timeoutMS, Callback cb);
    ~CountdownTrigger();

    static void init();
    static void destroy();

private:
    /**
     * @brief Inspect the current state of the CountdownTrigger instance.
     */
    void inspect();
    /**
     * @brief Method triggered when the timeout signal is received. This method should not be called manually.
     */
    inline void fire();
    Callback _onTimeout;
    int32_t _timeoutMS{1000};
    bool _callbackFired{false};
    std::unique_ptr<CountdownTriggerContext> _context;
    std::chrono::time_point<std::chrono::steady_clock> _startTime;

    friend class CountdownTriggerContext;
};

inline void CountdownTrigger::inspect() {
    using std::chrono::duration_cast;
    using std::chrono::milliseconds;
    using std::chrono::steady_clock;
    auto now = steady_clock::now();
    auto past = duration_cast<milliseconds>(now - _startTime).count();
    CC_LOG_INFO("[CountdownTrigger] timeout: %dms, past: %dms", _timeoutMS, static_cast<int>(past));
}

inline void CountdownTrigger::fire() {
    if (_onTimeout) _onTimeout();
    _callbackFired = true;
}

} // namespace cc
