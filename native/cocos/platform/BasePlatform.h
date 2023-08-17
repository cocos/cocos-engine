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

#include "base/Log.h"
#include "base/Macros.h"

#include "engine/EngineEvents.h"
#include "platform/interfaces/modules/ISystem.h"

#include <algorithm>
#include <functional>
#include <vector>

namespace cc {

class OSInterface;
class ISystemWindow;

class CC_DLL BasePlatform {
public:
    BasePlatform();
    /**
     * @brief Destructor of AbstratctPlatform.
     */
    virtual ~BasePlatform();
    /**
     * @brief Get default system platform.
     */
    static BasePlatform *getPlatform();
    /**
     * @brief Initialize system platform.
     */
    virtual int32_t init() = 0;
    /**
     * @brief Run system platform.
     */
    virtual int32_t run(int argc, const char **argv) = 0;
    /**
     * @brief Main business logic.
     */
    virtual int32_t loop() = 0;

    /**
     * @brief Polling event.
     */
    virtual void pollEvent() = 0;

    /**
     * @brief Exit platform.
     */
    virtual void exit() = 0;

    /**
     * @brief Get target system type.
     */
    using OSType = ISystem::OSType;

    virtual OSType getOSType() const = 0;

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
    using ThreadCallback = std::function<void(void)>;
    virtual void runInPlatformThread(const ThreadCallback &task) = 0;
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
    std::enable_if_t<std::is_base_of<OSInterface, T>::value, T *>
    getInterface() const {
        for (const auto &it : _osInterfaces) {
            T *intf = dynamic_cast<T *>(it.get());
            if (intf) {
                return intf;
            }
        }
        return nullptr;
    }

    template <class T>
    std::enable_if_t<std::is_base_of<OSInterface, T>::value, T *>
    getInterface() {
        for (const auto &it : _osInterfaces) {
            T *intf = dynamic_cast<T *>(it.get());
            if (intf) {
                return intf;
            }
        }
        return nullptr;
    }

    /**
     * @brief Registration system interface.
     */
    bool registerInterface(const OSInterface::Ptr &osInterface) {
        CC_ASSERT_NOT_NULL(osInterface);
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
    void unregisterInterface(const OSInterface::Ptr &osInterface) {
        CC_ASSERT_NOT_NULL(osInterface);
        auto it = std::find(_osInterfaces.begin(), _osInterfaces.end(), osInterface);
        if (it != _osInterfaces.end()) {
            CC_LOG_WARNING("Interface is not registrated");
            return;
        }
        _osInterfaces.erase(it);
    }

    void unregisterAllInterfaces() {
        _osInterfaces.clear();
    }

    virtual ISystemWindow *createNativeWindow(uint32_t windowId, void *externalHandle) = 0;

private:
    static BasePlatform *createDefaultPlatform();

    static BasePlatform *_currentPlatform; // NOLINT(readability-identifier-naming)
    std::vector<OSInterface::Ptr> _osInterfaces;
    CC_DISALLOW_COPY_MOVE_ASSIGN(BasePlatform);
};
} // namespace cc

#define START_PLATFORM(argc, argv)                                    \
    do {                                                              \
        cc::BasePlatform *platform = cc::BasePlatform::getPlatform(); \
        if (platform->init()) {                                       \
            CC_LOG_FATAL("Platform initialization failed");           \
            return -1;                                                \
        }                                                             \
        return platform->run(argc, argv);                             \
    } while (0)
