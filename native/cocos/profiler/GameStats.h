/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
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
#include <algorithm>
#include <cmath>
#include <iostream>
#include <mutex>
#include <sstream>
#include <utility>
#include "base/StringUtil.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"

namespace cc {

struct TimeCounter {
    // current frame
    uint64_t max{0U};
    uint64_t time{0U};
    uint32_t count{0U};

    // last interval
    uint64_t intervalMax{0U};
    uint64_t intervalTime{0U};
    uint32_t intervalCount{0U};
    uint32_t framesOfInterval{0U};

    // whole time
    uint64_t totalMax{0U};
    uint64_t totalTime{0U};
    uint32_t totalCount{0U};

    // frame & whole data used to display
    uint64_t frameMaxDisplay{0U};
    uint64_t frameTimeDisplay{0U};
    uint32_t frameCountDisplay{0U};

    uint64_t totalMaxDisplay{0U};
    uint64_t totalTimeDisplay{0U};
    uint32_t totalCountDisplay{0U};

    inline void operator+=(uint64_t value) {
        max = std::max(max, value);
        time += value;
        count++;
    }

    inline void onFrameBegin() {
        // reset current frame
        max = 0U;
        time = 0U;
        count = 0U;
    }

    inline void onFrameEnd() {
        // update last interval
        intervalMax = std::max(intervalMax, max);
        intervalTime += time;
        intervalCount += count;
        framesOfInterval++;

        // update whole time
        totalMax = std::max(totalMax, max);
        totalTime += time;
        totalCount += count;
    }

    inline void onIntervalUpdate() {
        // update display data
        frameMaxDisplay = intervalMax;
        frameTimeDisplay = framesOfInterval ? intervalTime / framesOfInterval : 0U;
        frameCountDisplay = framesOfInterval ? intervalCount / framesOfInterval : 0U;

        totalMaxDisplay = totalMax;
        totalTimeDisplay = totalTime;
        totalCountDisplay = totalCount;

        // reset interval data
        intervalMax = 0U;
        intervalTime = 0U;
        intervalCount = 0U;
        framesOfInterval = 0U;
    }
};

struct MemoryCounter {
    uint64_t total{0U};    // memory in current frame
    uint32_t count{0U};    // count in current frame
    uint64_t totalMax{0U}; // max memory during whole time

    inline void operator=(uint64_t value) {
        total = value;
        totalMax = std::max(totalMax, total);
        count = 1;
    }

    inline void operator+=(uint64_t value) {
        total += value;
        totalMax = std::max(totalMax, total);
        count++;
    }

    inline void operator-=(uint64_t value) {
        total -= value;
        count--;
    }
};

struct ObjectCounter {
    uint32_t total{0U};     // count in current frame
    uint32_t lastTotal{0U}; // count in last frame
    uint32_t totalMax{0U};  // max count during whole time

    inline void operator=(uint32_t value) {
        total = value;
        totalMax = std::max(totalMax, total);
    }

    inline void operator+=(uint32_t value) {
        total += value;
        totalMax = std::max(totalMax, total);
    }

    inline void operator-=(uint32_t value) {
        total -= value;
    }

    inline void onFrameBegin() {
        total = 0U;
    }

    inline void onFrameEnd() {
        lastTotal = total;
    }
};

// assume update in main thread only.
struct CoreStats {
    uint32_t fps{0U};
    float frameTime{0.0F};
    ccstd::string gfx;
    bool multiThread{true};
    bool occlusionQuery{false};
    bool shadowMap{false};
    uint32_t screenWidth{0U};
    uint32_t screenHeight{0U};
};

struct MemoryStats {
    // memory stats
    std::mutex mutex;
    ccstd::unordered_map<ccstd::string, MemoryCounter> memories;

    inline void update(const ccstd::string &name, uint64_t value) {
        std::lock_guard<std::mutex> lock(mutex);
        memories[name] = value;
    }

    inline void inc(const ccstd::string &name, uint64_t value) {
        std::lock_guard<std::mutex> lock(mutex);
        memories[name] += value;
    }

    inline void dec(const ccstd::string &name, uint64_t value) {
        std::lock_guard<std::mutex> lock(mutex);
        memories[name] -= value;
    }
};

// assume update in main thread only.
struct ObjectStats {
    // render stats: drawcalls, instances, triangles, etc
    ccstd::unordered_map<ccstd::string, ObjectCounter> renders;
    // object stats
    ccstd::unordered_map<ccstd::string, ObjectCounter> objects;

    inline void onFrameBegin() {
        for (auto &item : renders) {
            item.second.onFrameBegin();
        }

        for (auto &item : objects) {
            item.second.onFrameBegin();
        }
    }

    inline void onFrameEnd() {
        for (auto &item : renders) {
            item.second.onFrameEnd();
        }

        for (auto &item : objects) {
            item.second.onFrameEnd();
        }
    }
};

class StatsUtil {
public:
    static inline ccstd::string formatBytes(uint64_t bytes) {
        if (bytes >= 1024 * 1024 * 1024) {
            return StringUtil::format("%.3fG", bytes / (1024.0F * 1024.0F * 1024.0F));
        } else if (bytes >= 1024 * 1024) {
            return StringUtil::format("%.3fM", bytes / (1024.0F * 1024.0F));
        } else if (bytes >= 1024) {
            return StringUtil::format("%.3fK", bytes / 1024.0F);
        } else {
            return StringUtil::format("%llu", bytes);
        }
    }

    static inline ccstd::string formatTime(uint64_t time) {
        if (time >= 1000000) {
            return StringUtil::format("%.3fs", time / 1000000.0F);
        } else {
            return StringUtil::format("%.3fms", time / 1000.0F);
        }
    }

    static inline ccstd::string formatName(uint32_t depth, const ccstd::string &name) {
        if (depth > 0U) {
            return StringUtil::format("%*s%s", depth * 2, " ", name.c_str());
        }
        return name;
    }
};

} // namespace cc
