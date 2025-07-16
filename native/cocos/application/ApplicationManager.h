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

#include <memory>
#include "application/BaseApplication.h"
#include "base/std/container/vector.h"

namespace cc {
class CC_DLL ApplicationManager {
public:
    static ApplicationManager* getInstance();

    using ApplicationPtr = std::shared_ptr<BaseApplication>;

    /**
     * @brief Generate application entry.
     */
    template <class T>
    std::enable_if_t<std::is_base_of<BaseApplication, T>::value, ApplicationPtr>
    createApplication(int argc, const char* argv[]) {
        ApplicationPtr app = std::make_shared<T>();
        app->setArgumentsInternal(argc, argv);
        _apps.push_back(app);
        _currentApp = app;
        return app;
    }

    /**
     * @brief Release all generated applications.
     */
    void releaseAllApplications();
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
    ccstd::vector<ApplicationPtr> _apps;
};
} // namespace cc

#define CC_APPLICATION_MANAGER()        cc::ApplicationManager::getInstance()
#define CC_CURRENT_APPLICATION()        CC_APPLICATION_MANAGER()->getCurrentApp()
#define CC_CURRENT_APPLICATION_SAFE()   CC_APPLICATION_MANAGER()->getCurrentAppSafe()
#define CC_CURRENT_ENGINE()             CC_CURRENT_APPLICATION_SAFE()->getEngine()
#define CC_GET_PLATFORM_INTERFACE(intf) CC_CURRENT_ENGINE()->getInterface<intf>()
#define CC_GET_SYSTEM_WINDOW(id)        CC_GET_PLATFORM_INTERFACE(cc::ISystemWindowManager)->getWindow(id)
#define CC_GET_MAIN_SYSTEM_WINDOW()     CC_GET_SYSTEM_WINDOW(cc::ISystemWindow::mainWindowId) // Assuming the 1st created window is the main system window for now!

#define CC_GET_XR_INTERFACE() BasePlatform::getPlatform()->getInterface<IXRInterface>()

/**
 * @brief Called at the user-defined main entry
 */
#define CC_START_APPLICATION(className)                                                \
    do {                                                                               \
        auto app = CC_APPLICATION_MANAGER()->createApplication<className>(argc, argv); \
        if (app->init()) {                                                             \
            return -1;                                                                 \
        }                                                                              \
        return app->run(argc, argv);                                                   \
    } while (0)

#define CC_REGISTER_APPLICATION(className)        \
    int cocos_main(int argc, const char** argv) { \
        CC_START_APPLICATION(className);          \
    }
