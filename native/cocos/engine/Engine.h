/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/TypeDef.h"
#include "math/Vec2.h"

#include "bindings/event/EventDispatcher.h"
#include "engine/BaseEngine.h"

#include <map>
#include <memory>

namespace cc {

#define NANOSECONDS_PER_SECOND 1000000000
#define NANOSECONDS_60FPS      16666667L

class Engine : public BaseEngine {
public:
    /**
     @brief Constructor of Engine.
     */
    Engine();
    /**
     @brief Constructor of Engine.
     */
    ~Engine() override;
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
     @brief Add Event Listening.
     @param evtype:event type.
     @param cb:event callback.
     */
    void addEventCallback(OSEventType evtype, const EventCb &cb) override;
    /**
     @brief Remove Event Listening.
     @param evtype:event type.
     */
    void removeEventCallback(OSEventType evtype) override;
    /**
     @brief Event handling callback.
     @param evtype:event type.
     @param evtype:event information.
     @return whether it's been handled.
     */
    bool handleEvent(const OSEvent &ev);
    /**
     @brief Get engine scheduler.
     */
    SchedulerPtr getScheduler() const override;

private:
    void    tick();
    bool    dispatchWindowEvent(const WindowEvent &ev);
    bool    dispatchDeviceEvent(const DeviceEvent &ev);
    bool    dispatchEventToApp(OSEventType type, const OSEvent &ev);
    void    onPause();
    void    onResume();
    void    onClose();
    int32_t restartVM();

    bool                       _close{false};
    bool                       _pause{false};
    bool                       _resune{false};
    std::shared_ptr<Scheduler> _scheduler{nullptr};
    int64_t                    _prefererredNanosecondsPerFrame{NANOSECONDS_60FPS};
    uint                       _totalFrames{0};
    cc::Vec2                   _viewLogicalSize{0, 0};
    bool                       _needRestart{false};

    std::map<OSEventType, EventCb> _eventCallbacks;
    CC_DISABLE_COPY_AND_MOVE_SEMANTICS(Engine);
};

} // namespace cc