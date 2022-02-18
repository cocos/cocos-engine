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

#include <functional>

#include "base/Scheduler.h"
#include "base/TypeDef.h"
#include "platform/BasePlatform.h"

namespace cc {
class EngineObserver;
class BaseEngine : public std::enable_shared_from_this<BaseEngine> {
public:
    virtual ~BaseEngine();
    using Ptr = std::shared_ptr<BaseEngine>;

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
    /**
     * @brief Register an observer
     */
    virtual void registrObserver(EngineObserver *observer) = 0;
    /**
     * @brief Unregister an observer
     */
    virtual void unregistrObserver(EngineObserver *observer) = 0;

    using EventCb = std::function<void(const OSEvent &)>;
    /**
     @brief Add listening event callback.
     */
    virtual void addEventCallback(OSEventType evtype, const EventCb &cb) = 0;
    /**
     @brief Remove listening event callback.
     */
    virtual void removeEventCallback(OSEventType evtype) = 0;

    virtual void setXXTeaKey(const std::string &key) = 0;
    /**
     * @brief Run the js code file
     * @param filePath:Js file path.
     */
    virtual void runJsScript(const std::string &filePath) = 0;
    /**
     * @brief Set the js debugging server Addr and port
     * @param serverAddr:Server address.
     * @param port:Server port.
     * @param isWaitForConnect:Is Wait for connect.
     */
    virtual void setJsDebugIpAndPort(const std::string &serverAddr, uint32_t port, bool isWaitForConnect) = 0;
    /**
     @brief Set exception callback.
     */
    using ExceptionCallback = std::function<void(const char *, const char *, const char *)>; // location, message, stack
    virtual void setExceptionCallback(const ExceptionCallback &cb) = 0;

    using SchedulerPtr = std::shared_ptr<Scheduler>;
    /**
     @brief Get engine scheduler.
     */
    virtual SchedulerPtr getScheduler() const = 0;
};

} // namespace cc
