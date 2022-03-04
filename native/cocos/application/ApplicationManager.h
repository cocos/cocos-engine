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

#include <memory>
#include <vector>

#include "application/BaseApplication.h"

namespace cc {
class ApplicationManager {
public:
    static ApplicationManager *getInstance();

    using ApplicationPtr = std::shared_ptr<BaseApplication>;

    /**
     * @brief Generate application entry.
     */
    template <class T>
    std::enable_if_t<std::is_base_of<BaseApplication, T>::value, ApplicationPtr>
    createApplication() {
        ApplicationPtr app = std::make_shared<T>();
        _apps.push_back(app);
        _currentApp = app;
        return app;
    }

    /**
     * @brief Release all generated applications.
     */
    void releseAllApplications();
    /**
     * @brief Get the current application, may get empty.
     */
    ApplicationPtr getCurrentApp() const;
    /**
     * @brief Get the current application, make sure it is not empty.
     *        Used to get the engine.
     */
    ApplicationPtr getCurrentAppSafe() const;

private:
    std::weak_ptr<BaseApplication> _currentApp;
    std::vector<ApplicationPtr>    _apps;
};
} // namespace cc

#define CC_APPLICATION_MANAGER()        cc::ApplicationManager::getInstance()
#define CC_CURRENT_APPLICATION()        CC_APPLICATION_MANAGER()->getCurrentApp()
#define CC_CURRENT_APPLICATION_SAFE()   CC_APPLICATION_MANAGER()->getCurrentAppSafe()
#define CC_CURRENT_ENGINE()             CC_CURRENT_APPLICATION_SAFE()->getEngine()
#define CC_GET_PLATFORM_INTERFACE(intf) CC_CURRENT_ENGINE()->getInterface<intf>()

/**
 * @brief Called at the user-defined main entry
 */
#define CC_START_APPLICATION(className)                                      \
    do {                                                                     \
        auto app = CC_APPLICATION_MANAGER()->createApplication<className>(); \
        if (app->init()) {                                                   \
            return -1;                                                       \
        }                                                                    \
        return app->run(argc, argv);                                         \
    } while (0)

#define CC_APPLICATION_MAIN(className)            \
    int cocos_main(int argc, const char **argv) { \
        CC_START_APPLICATION(className);          \
    }
