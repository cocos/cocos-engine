/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.
 
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
#include <thread>
#include "GameStats.h"
#include "base/Config.h"
#include "base/Timer.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {

class ProfilerBlock;
struct ProfilerBlockDepth;

enum class ShowOption : uint32_t {
    CoreStats        = 0x01,
    MemoryStats      = 0x02,
    ObjectStats      = 0x04,
    PerformanceStats = 0x08,
    All              = CoreStats | MemoryStats | ObjectStats | PerformanceStats,
};

/**
 * Profiler
 */
class Profiler {
public:
    Profiler(const Profiler &) = delete;
    Profiler(Profiler &&)      = delete;
    Profiler &operator=(const Profiler &) = delete;
    Profiler &operator=(Profiler &&) = delete;

    static Profiler *getInstance();
    static void      destroyInstance();

    void setEnable(ShowOption option, bool b = true);
    bool isEnabled(ShowOption option) const;

    void beginFrame();
    void endFrame();
    void update();

    inline bool         isMainThread() const { return _mainThreadId == std::this_thread::get_id(); }
    inline MemoryStats &getMemoryStats() { return _memoryStats; }
    inline ObjectStats &getObjectStats() { return _objectStats; }

private:
    Profiler();
    ~Profiler();

    void doIntervalUpdate();
    void doFrameUpdate();
    void printStats();

    void beginBlock(const std::string &name);
    void endBlock();
    void gatherBlocks(ProfilerBlock *parent, uint32_t depth, std::vector<ProfilerBlockDepth> &outBlocks);

    static Profiler *_instance;
    uint32_t         _options{static_cast<uint32_t>(ShowOption::All)};
    utils::Timer     _timer;
    CoreStats        _coreStats;
    MemoryStats      _memoryStats;
    ObjectStats      _objectStats;
    ProfilerBlock *  _root{nullptr};
    ProfilerBlock *  _current{nullptr};
    std::thread::id  _mainThreadId;

    friend class AutoProfiler;
};

/**
 * AutoProfiler: profile code block automatically
 */
class AutoProfiler {
public:
    AutoProfiler(Profiler *profiler, const std::string &name)
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
    #define CC_PROFILER                           cc::Profiler::getInstance()
    #define CC_PROFILER_DESTROY                   cc::Profiler::destroyInstance()
    #define CC_PROFILER_SET_ENABLE(option, b)     CC_PROFILER->setEnable(option, (b))
    #define CC_PROFILER_IS_ENABLED(option)        CC_PROFILER->isEnabled(option)
    #define CC_PROFILER_UPDATE                    CC_PROFILER->update()
    #define CC_PROFILER_BEGIN_FRAME               CC_PROFILER->beginFrame()
    #define CC_PROFILER_END_FRAME                 CC_PROFILER->endFrame()
    #define CC_PROFILE(name)                      cc::AutoProfiler auto_profiler_##name(CC_PROFILER, #name)
    #define CC_PROFILE_MEMORY_UPDATE(name, count) CC_PROFILER->getMemoryStats().update(#name, (count))
    #define CC_PROFILE_MEMORY_INC(name, count)    CC_PROFILER->getMemoryStats().inc(#name, (count))
    #define CC_PROFILE_MEMORY_DEC(name, count)    CC_PROFILER->getMemoryStats().dec(#name, (count))
    #define CC_PROFILE_RENDER_UPDATE(name, count)                   \
        if (CC_PROFILER->isMainThread()) {                          \
            CC_PROFILER->getObjectStats().renders[#name] = (count); \
        }
    #define CC_PROFILE_RENDER_INC(name, count)                       \
        if (CC_PROFILER->isMainThread()) {                           \
            CC_PROFILER->getObjectStats().renders[#name] += (count); \
        }
    #define CC_PROFILE_RENDER_DEC(name, count)                       \
        if (CC_PROFILER->isMainThread()) {                           \
            CC_PROFILER->getObjectStats().renders[#name] -= (count); \
        }
    #define CC_PROFILE_OBJECT_UPDATE(name, count)                   \
        if (CC_PROFILER->isMainThread()) {                          \
            CC_PROFILER->getObjectStats().objects[#name] = (count); \
        }
    #define CC_PROFILE_OBJECT_INC(name, count)                      \
        if (CC_PROFILER->isMainThread()) {                          \
            C_PROFILER->getObjectStats().objects[#name] += (count); \
        }
    #define CC_PROFILE_OBJECT_DEC(name, count)                       \
        if (CC_PROFILER->isMainThread()) {                           \
            CC_PROFILER->getObjectStats().objects[#name] -= (count); \
        }
#else
    #define CC_PROFILER
    #define CC_PROFILER_DESTROY
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
