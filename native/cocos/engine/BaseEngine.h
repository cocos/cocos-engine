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

#include <functional>

#include "base/Scheduler.h"
#include "base/TypeDef.h"
#include "core/event/EventTarget.h"
#include "platform/BasePlatform.h"

namespace cc {

class CC_DLL BaseEngine : public std::enable_shared_from_this<BaseEngine> {
public:
    enum EngineStatus {
        ON_START,
        ON_PAUSE,
        ON_RESUME,
        ON_CLOSE,
        UNKNOWN,
    };
    ~BaseEngine() = default;
    using Ptr = std::shared_ptr<BaseEngine>;

    IMPL_EVENT_TARGET(BaseEngine)

    DECLARE_TARGET_EVENT_BEGIN(BaseEngine)
    TARGET_EVENT_ARG1(EngineStatusChange, EngineStatus)
    DECLARE_TARGET_EVENT_END()
    /**
     @brief Get operating system interface template.
     */
    template <class T>
    T *getInterface() const {
        BasePlatform *platform = BasePlatform::getPlatform();
        return platform->getInterface<T>();
    }
    /**
     @brief Create default engine.
     */
    static BaseEngine::Ptr createEngine();

    /**
     @brief Initialization engine interface.
     */
    virtual int32_t init() = 0;
    /**
     @brief Run engine main logical interface.
     */
    virtual int32_t run() = 0;
    /**
     @brief Pause engine main logical.
     */
    virtual void pause() = 0;
    /**
     @brief Resume engine main logical.
     */
    virtual void resume() = 0;
    /**
     @brief Restart engine main logical.
     */
    virtual int restart() = 0;
    /**
     @brief Close engine main logical.
     */
    virtual void close() = 0;
    /**
     @brief Gets the total number of frames in the main loop.
     */
    virtual uint getTotalFrames() const = 0;
    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     */
    virtual void setPreferredFramesPerSecond(int fps) = 0;

    using SchedulerPtr = std::shared_ptr<Scheduler>;
    /**
     @brief Get engine scheduler.
     */
    virtual SchedulerPtr getScheduler() const = 0;

    virtual bool isInited() const = 0;
};

} // namespace cc
