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

#include <iostream>
#include "application/BaseApplication.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"

namespace cc {
class BaseEngine;

class CC_DLL CocosApplication : public BaseApplication {
public:
    CocosApplication();
    ~CocosApplication() override;

    /**
     * @brief Application initialization.
     */
    int32_t init() override;
    /**
     * @brief Application main business logic.
     */
    int32_t run(int argc, const char **argv) override;
    /**
     * @brief Pause the application.
     */
    void pause() override;
    /**
     * @brief Resume the application.
     */
    void resume() override;
    /**
     * @brief Restart the application.
     */
    void restart() override;
    /**
     * @brief Close the application.
     */
    void close() override;
    /**
     * @brief Get engine.
     */
    BaseEngine::Ptr getEngine() const override;

    /**
     * @brief Get arguments passed to execution file
     */
    const std::vector<std::string> &getArguments() const override;

protected:
    /**
     * @brief Set arguments passed to execution file
     * @note setArgumentsInternal needs to be protected since it should only be used internally.
     */
    void setArgumentsInternal(int argc, const char *argv[]) override;

public:
    /**
     * @brief Processing engine start events.
     */
    virtual void onStart();
    /**
     * @brief Processing pause events..
     */
    virtual void onPause();
    /**
     * @brief Processing recovery events.
     */
    virtual void onResume();
    /**
     * @brief Processing close events.
     */
    virtual void onClose();
#if CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX || CC_PLATFORM == CC_PLATFORM_MACOS
    /**
     * @brief Create window.
     * @param title: Window title
     * @param x: x-axis coordinate
     * @param y: y-axis coordinate
     * @param w: Window width
     * @param h: Window height
     * @param flags: Window flag
     */
    virtual void createWindow(const char *title,
                              int32_t x, int32_t y, int32_t w,
                              int32_t h, int32_t flags);
    /**
     * @brief Create a centered window.
     * @param title: Window title
     * @param w: Window width
     * @param h: Window height
     * @param flags: Window flag
     */
    virtual void createWindow(const char *title, int32_t w,
                              int32_t h, int32_t flags);
#endif
    /**
     * @brief Set the debugging server Addr and port
     * @param serverAddr:Server address.
     * @param port:Server port.
     * @param isWaitForConnect:Is Wait for connect.
     */
    virtual void setDebugIpAndPort(const ccstd::string &serverAddr, uint32_t port, bool isWaitForConnect);
    /**
     * @brief Run the script file
     * @param filePath:script path.
     */
    virtual void runScript(const ccstd::string &filePath);
    /**
     * @brief Script exception handling
     * @param location,Exception location
     * @param message,Exception message
     * @param stack,Exception stack
     */
    virtual void handleException(const char *location, const char *message, const char *stack);
    virtual void setXXTeaKey(const ccstd::string &key);

private:
    void unregisterAllEngineEvents();

    ISystemWindow *_systemWindow{nullptr};
    BaseEngine::Ptr _engine{nullptr};

    BaseEngine::EngineStatusChange::EventID _engineEvents;

    std::vector<std::string> _argv;
};
} // namespace cc
