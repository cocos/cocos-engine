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
#include <string_view>
#include <thread>
#include "GameStats.h"
#include "base/Config.h"
#include "base/Timer.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {

class ProfilerBlock;
struct ProfilerBlockDepth;

enum class ShowOption : uint32_t {
    CORE_STATS = 0x01,
    MEMORY_STATS = 0x02,
    OBJECT_STATS = 0x04,
    PERFORMANCE_STATS = 0x08,
    ALL = CORE_STATS | MEMORY_STATS | OBJECT_STATS | PERFORMANCE_STATS,
};

/**
 * Profiler
 */
class Profiler {
public:
    static Profiler *getInstance();

    Profiler();
    ~Profiler();
    Profiler(const Profiler &) = delete;
    Profiler(Profiler &&) = delete;
    Profiler &operator=(const Profiler &) = delete;
    Profiler &operator=(Profiler &&) = delete;

    void setEnable(ShowOption option, bool b = true);
    bool isEnabled(ShowOption option) const;

    void beginFrame();
    void endFrame();
    void update();

    inline bool isMainThread() const { return _mainThreadId == std::this_thread::get_id(); }
    inline MemoryStats &getMemoryStats() { return _memoryStats; }
    inline ObjectStats &getObjectStats() { return _objectStats; }

private:
    static void doFrameUpdate();

    void doIntervalUpdate();
    void printStats();

    void beginBlock(const std::string_view &name);
    void endBlock();
    void gatherBlocks(ProfilerBlock *parent, uint32_t depth, std::vector<ProfilerBlockDepth> &outBlocks);

    static Profiler *instance;
    uint32_t _options{static_cast<uint32_t>(ShowOption::ALL)};
    utils::Timer _timer;
    CoreStats _coreStats;
    MemoryStats _memoryStats;
    ObjectStats _objectStats;
    ProfilerBlock *_root{nullptr};
    ProfilerBlock *_current{nullptr};
    std::thread::id _mainThreadId;

    friend class AutoProfiler;
};

/**
 * AutoProfiler: profile code block automatically
 */
class AutoProfiler {
public:
    AutoProfiler(Profiler *profiler, const std::string_view &name)
    : _profiler(profiler) {
        _profiler->beginBlock(name);
    }

    ~AutoProfiler() {
        _profiler->endBlock();
    }

private:
    Profiler *_profiler{nullptr};
};

} // namespace cc

/**
 * Profiler is used through macros only, if CC_USE_PROFILER is 0, there is no side effects on performance.
 */
#if CC_USE_PROFILER
    #define CC_PROFILER cc::Profiler::getInstance()
    #define CC_PROFILER_SET_ENABLE(option, b)    \
        if (CC_PROFILER) {                       \
            CC_PROFILER->setEnable(option, (b)); \
        }
    #define CC_PROFILER_IS_ENABLED(option)  \
        if (CC_PROFILER) {                  \
            CC_PROFILER->isEnabled(option); \
        }
    #define CC_PROFILER_UPDATE     \
        if (CC_PROFILER) {         \
            CC_PROFILER->update(); \
        }
    #define CC_PROFILER_BEGIN_FRAME    \
        if (CC_PROFILER) {             \
            CC_PROFILER->beginFrame(); \
        }
    #define CC_PROFILER_END_FRAME    \
        if (CC_PROFILER) {           \
            CC_PROFILER->endFrame(); \
        }
    #define CC_PROFILE(name) cc::AutoProfiler auto_profiler_##name(CC_PROFILER, #name)
    #define CC_PROFILE_MEMORY_UPDATE(name, count)                 \
        if (CC_PROFILER) {                                        \
            CC_PROFILER->getMemoryStats().update(#name, (count)); \
        }
    #define CC_PROFILE_MEMORY_INC(name, count)                 \
        if (CC_PROFILER) {                                     \
            CC_PROFILER->getMemoryStats().inc(#name, (count)); \
        }
    #define CC_PROFILE_MEMORY_DEC(name, count)                 \
        if (CC_PROFILER) {                                     \
            CC_PROFILER->getMemoryStats().dec(#name, (count)); \
        }
    #define CC_PROFILE_RENDER_UPDATE(name, count)                   \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {           \
            CC_PROFILER->getObjectStats().renders[#name] = (count); \
        }
    #define CC_PROFILE_RENDER_INC(name, count)                       \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {            \
            CC_PROFILER->getObjectStats().renders[#name] += (count); \
        }
    #define CC_PROFILE_RENDER_DEC(name, count)                       \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {            \
            CC_PROFILER->getObjectStats().renders[#name] -= (count); \
        }
    #define CC_PROFILE_OBJECT_UPDATE(name, count)                   \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {           \
            CC_PROFILER->getObjectStats().objects[#name] = (count); \
        }
    #define CC_PROFILE_OBJECT_INC(name, count)                      \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {           \
            C_PROFILER->getObjectStats().objects[#name] += (count); \
        }
    #define CC_PROFILE_OBJECT_DEC(name, count)                       \
        if (CC_PROFILER && CC_PROFILER->isMainThread()) {            \
            CC_PROFILER->getObjectStats().objects[#name] -= (count); \
        }
#else
    #define CC_PROFILER
    #define CC_PROFILER_SET_ENABLE(option, b)
    #define CC_PROFILER_IS_ENABLED(option) false
    #define CC_PROFILER_UPDATE
    #define CC_PROFILER_BEGIN_FRAME
    #define CC_PROFILER_END_FRAME
    #define CC_PROFILE(name)
    #define CC_PROFILE_MEMORY_UPDATE(name, count)
    #define CC_PROFILE_MEMORY_INC(name, count)
    #define CC_PROFILE_MEMORY_DEC(name, count)
    #define CC_PROFILE_RENDER_UPDATE(name, count)
    #define CC_PROFILE_RENDER_INC(name, count)
    #define CC_PROFILE_RENDER_DEC(name, count)
    #define CC_PROFILE_OBJECT_UPDATE(name, count)
    #define CC_PROFILE_OBJECT_INC(name, count)
    #define CC_PROFILE_OBJECT_DEC(name, count)
#endif
