/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Config.h"
#include "base/TypeDef.h"
#include "engine/BaseEngine.h"
#include "engine/EngineEvents.h"
#include "math/Vec2.h"

#include <map>
#include <memory>

namespace se {
class ScriptEngine;
}

namespace cc {

namespace gfx {
class Device;
}

class FileUtils;
class DebugRenderer;
class Profiler;
class BuiltinResMgr;
class ProgramLib;
class IXRInterface;

#define NANOSECONDS_PER_SECOND 1000000000
#define NANOSECONDS_60FPS      16666667L

class CC_DLL Engine : public BaseEngine {
public:
    /**
     @brief Constructor of Engine.
     */
    Engine();
    /**
     @brief Constructor of Engine.
     */
    ~Engine();
    /**
     @brief Implement initialization engine.
     */
    int32_t init() override;
    /**
     @brief Implement the main logic of the running engine.
     */
    int32_t run() override;
    /**
     @brief Implement pause engine running.
     */
    void pause() override;
    /**
     @brief Implement resume engine running.
     */
    void resume() override;
    /**
     @brief Implement restart engine running.
     */
    int restart() override;
    /**
     @brief Implement close engine running.
     */
    void close() override;
    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     */
    void setPreferredFramesPerSecond(int fps) override;
    /**
     @brief Gets the total number of frames in the main loop.
     */
    uint getTotalFrames() const override;
    /**
     @brief Get engine scheduler.
     */
    SchedulerPtr getScheduler() const override;

    bool isInited() const override { return _inited; }

private:
    void destroy();
    void tick();
    bool redirectWindowEvent(const WindowEvent &ev);
    void doRestart();

    SchedulerPtr _scheduler{nullptr};
    int64_t _preferredNanosecondsPerFrame{NANOSECONDS_60FPS};
    uint _totalFrames{0};
    cc::Vec2 _viewLogicalSize{0, 0};
    bool _needRestart{false};
    bool _inited{false};

    // Some global objects.
    FileUtils *_fs{nullptr};
#if CC_USE_PROFILER
    Profiler *_profiler{nullptr};
#endif
    DebugRenderer *_debugRenderer{nullptr};
    se::ScriptEngine *_scriptEngine{nullptr};
    // Should move to renderer system in future.
    gfx::Device *_gfxDevice{nullptr};

    // Should move them into material system in future.
    BuiltinResMgr *_builtinResMgr{nullptr};
    ProgramLib *_programLib{nullptr};

    events::WindowEvent::Listener _windowEventListener;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Engine);

    IXRInterface *_xr{nullptr};
};

} // namespace cc
