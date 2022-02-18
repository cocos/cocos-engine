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
#include "engine/BaseEngine.h"

namespace cc {
class ApplicationObserver;
class BaseApplication {
public:
    virtual ~BaseApplication() = default;
    /**
     * @brief Application initialization
     */
    virtual int32_t init() = 0;
    /**
     * @brief Application main business logic.
     */
    virtual int32_t run(int          argc,
                        const char **argv) = 0;
    /**
     * @brief Pause the application.
     */
    virtual void pause() = 0;
    /**
     * @brief Resume the application.
     */
    virtual void resume() = 0;
    /**
     * @brief Restart the application.
     */
    virtual void restart() = 0;
    /**
     * @brief Close the application.
     */
    virtual void close() = 0;

    /**
     * @brief Register an app observer.
     */
    virtual void registrObserver(ApplicationObserver *observer) = 0;
    /**
     * @brief Unregister an app observer.
     */
    virtual void unregistrObserver(ApplicationObserver *observer) = 0;

    /**
     * @brief Get engine.
     */
    virtual BaseEngine::Ptr getEngine() const = 0;
};

} // namespace cc