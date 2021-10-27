/****************************************************************************
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

#include "base/Log.h"
#include "base/Macros.h"

#include "bindings/event/EventDispatcher.h"
#include "platform/interfaces/modules/ISystem.h"

#include <functional>
#include <vector>

namespace cc {

class OSInterface;

class BasePlatform {
public:
    BasePlatform();
    /**
     * @brief Destructor of AbstratctPlatform.
     */
    virtual ~BasePlatform();
    /**
     * @brief Get default system platform.
     */
    static BasePlatform* getPlatform();
    /**
     * @brief Initialize system platform.
     */
    virtual int32_t init() = 0;
    /**
     * @brief Run system platform.
     */
    virtual int32_t run(int argc, const char** argv) = 0;
    /**
     * @brief Main business logic.
     */
    virtual int32_t loop() = 0;

    /**
     * @brief Polling event.
     */
    virtual void pollEvent() = 0;

    /**
     * @brief Get target system type.
     */
    using OSType = ISystem::OSType;

    virtual OSType getOSType() const = 0;

    /**
     * @brief Set event handling callback function.
     */
    using HandleEventCallback = std::function<bool(const OSEvent&)>;

    virtual void setHandleEventCallback(HandleEventCallback cb) = 0;

    /**
     * @brief Set default event handling callback function.
     */
    virtual void setHandleDefaultEventCallback(HandleEventCallback cb) = 0;
    /**
     * @brief Default event handling.
     */
    virtual void handleDefaultEvent(const OSEvent& ev) = 0;
    /**
     * @brief Get the SDK version for Android.Other systems also have sdk versions, 
              but they are not currently used.
     */
    virtual int getSdkVersion() const = 0;
    /**
     * @brief Run the task in the platform thread, 
     * @brief most platforms are the main thread, android is the non-main thread
     * @param task : Tasks running in platform threads
     * @param fps : Task call frequency
     */
    using ThreadCallback                                         = std::function<void(void)>;
    virtual void runInPlatformThread(const ThreadCallback& task) = 0;
    /**
     * @brief Get task call frequency.
     */
    virtual int32_t getFps() const = 0;
    /**
     * @brief Set task call frequency.
     */
    virtual void setFps(int32_t fps) = 0;

    /**
     * @brief Get target system interface(Non thread safe.).
     */
    template <class T>
    std::enable_if_t<std::is_base_of<OSInterface, T>::value, T*>
    getInterface() const {
        for (const auto& it : _osInterfaces) {
            T* intf = dynamic_cast<T*>(it.get());
            if (intf) {
                return intf;
            }
        }
        CCASSERT(false, "Interface does not exist");
        return nullptr;
    }

    /**
     * @brief Registration system interface.
     */
    bool registerInterface(const OSInterface::Ptr& osInterface) {
        CCASSERT(osInterface != nullptr, "Invalid interface pointer");
        auto it = std::find(_osInterfaces.begin(), _osInterfaces.end(), osInterface);
        if (it != _osInterfaces.end()) {
            CC_LOG_WARNING("Duplicate registration interface");
            return false;
        }
        _osInterfaces.push_back(osInterface);
        return true;
    }
    /**
     * @brief Unregistration system interface.
     */
    void unregisterInterface(const OSInterface::Ptr& osInterface) {
        CCASSERT(osInterface != nullptr, "Invalid interface pointer");
        auto it = std::find(_osInterfaces.begin(), _osInterfaces.end(), osInterface);
        if (it != _osInterfaces.end()) {
            CC_LOG_WARNING("Interface is not registrated");
            return;
        }
        _osInterfaces.erase(it);
    }

private:

    std::vector<OSInterface::Ptr> _osInterfaces;
    CC_DISABLE_COPY_AND_MOVE_SEMANTICS(BasePlatform);
};
} // namespace cc

#define START_PLATFORM(argc, argv)                                    \
    do {                                                              \
        cc::BasePlatform* platform = cc::BasePlatform::getPlatform(); \
        if (platform->init()) {                                       \
            CC_LOG_FATAL("Platform initialization failed");           \
            return -1;                                                \
        }                                                             \
        return platform->run(argc, argv);                             \
    } while (0)