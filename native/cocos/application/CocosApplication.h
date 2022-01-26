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

#include <iostream>
#include "application/BaseApplication.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"

namespace cc {
class BaseEngine;

class CocosApplication : public BaseApplication {
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
     * @brief Set the js debugging server Addr and port
     * @param serverAddr:Server address.
     * @param port:Server port.
     * @param isWaitForConnect:Is Wait for connect.
     */
    virtual void setJsDebugIpAndPort(const std::string &serverAddr, uint32_t port, bool isWaitForConnect);
    /**
     * @brief Run the js code file
     * @param filePath:Js file path.
     */
    virtual void runJsScript(const std::string &filePath);
    /**
     * @brief Js exception handling
     * @param location,Exception location
     * @param message,Exception message
     * @param stack,Exception stack
     */
    virtual void handleException(const char *location, const char *message, const char *stack);
    virtual void setXXTeaKey(const std::string &key);

private:
    void handleAppEvent(const OSEvent &ev);

    ISystemWindow * _systemWidow{nullptr};
    BaseEngine::Ptr _engine{nullptr};
};
} // namespace cc
