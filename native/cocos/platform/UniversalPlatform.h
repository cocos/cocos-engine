/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/BasePlatform.h"

namespace cc {
class CC_DLL UniversalPlatform : public BasePlatform {
public:
    /**
     * @brief Start base platform initialization.
     */
    int32_t run(int argc, const char **argv) override;

    /**
     * @brief Get targe platform type.
     */
    OSType getOSType() const override;
    /**
     * @brief Get the SDK version for Android.Other systems also have sdk versions,
            but they are not currently used.
     */
    int getSdkVersion() const override;
    /**
     * @brief Polling event
     */
    void pollEvent() override;
    /**
     * @brief Run the task in the platform thread,
     * @brief most platforms are the main thread, android is the non-main thread
     * @param task : Tasks running in platform threads
     */
    void runInPlatformThread(const ThreadCallback &task) override;
    /**
     * @brief Get task call frequency.
     */
    int32_t getFps() const override;
    /**
     * @brief Set task call frequency.
     */
    void setFps(int32_t fps) override;

    virtual void runTask();
    /**
     * @brief Processing pause message
     */
    virtual void onPause();
    /**
     * @brief Processing resume message
     */
    virtual void onResume();
    /**
     * @brief Processing close message
     */
    virtual void onClose();
    /**
     * @brief Processing destroy message
     */
    virtual void onDestroy();

    /**
     * @brief Exit platform.
     */
    void exit() override;

private:
    ThreadCallback _mainTask{nullptr};

    int32_t _fps{60};
};

} // namespace cc
