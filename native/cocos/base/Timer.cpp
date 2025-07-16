/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "Timer.h"

namespace cc {
namespace utils {

Timer::Timer(bool doReset) {
    if (doReset) {
        reset();
    }
}

void Timer::reset() {
    _startTime = Clock::now();
}

int64_t Timer::getMicroseconds() const {
    auto currentTime = Clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(currentTime - _startTime).count();
    if (duration < 0) {
        duration = 0;
    }

    return duration;
}

int64_t Timer::getMilliseconds() const {
    auto currentTime = Clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(currentTime - _startTime).count();
    if (duration < 0) {
        duration = 0;
    }

    return duration;
}

float Timer::getSeconds(bool highPrecision) const {
    if (highPrecision) {
        int64_t micro = getMicroseconds();
        return static_cast<float>(micro) / 1000000.0F;
    }

    int64_t milli = getMilliseconds();
    return static_cast<float>(milli) / 1000.0F;
}

} // namespace utils
} // namespace cc
