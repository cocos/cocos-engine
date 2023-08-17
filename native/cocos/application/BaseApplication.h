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
#include "engine/BaseEngine.h"

namespace cc {

class CC_DLL BaseApplication {
public:
    virtual ~BaseApplication() = default;
    /**
     * @brief Application initialization
     */
    virtual int32_t init() = 0;
    /**
     * @brief Application main business logic.
     */
    virtual int32_t run(int argc,
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
     * @brief Get engine.
     */
    virtual BaseEngine::Ptr getEngine() const = 0;

    /**
     * @brief Get arguments passed to execution file
     */
    virtual const std::vector<std::string> &getArguments() const = 0;

protected:
    /**
     * @brief Set arguments passed to execution file
     * @note setArgumentsInternal needs to be protected since it should only be used internally.
     */
    virtual void setArgumentsInternal(int argc, const char *argv[]) = 0;

    friend class ApplicationManager;
};

} // namespace cc
