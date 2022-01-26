/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/BasePlatform.h"
#include "platform/IEventDispatch.h"

namespace cc {
class UniversalPlatform : public BasePlatform, public IEventDispatch {
public:
    /**
     * @brief Implement basic platform initialization.
     */
    int32_t init() override;
    /**
     * @brief Start base platform initialization.
     */
    int32_t run(int argc, const char **argv) override;

    /**
     * @brief Get targe platform type.
     */
    OSType getOSType() const override;
    /**
     * @brief Set the event handling callback.
     */
    void setHandleEventCallback(HandleEventCallback cb) override;
    /**
     * @brief Set the event to handle callbacks by default.
     */
    void setHandleDefaultEventCallback(HandleEventCallback cb) override;
    /**
     * @brief Implement dispatch event interface.
     */
    void dispatchEvent(const OSEvent &ev) override;
    /**
     * @brief Implement dispatch touch event interface.
     */
    void dispatchTouchEvent(const OSEvent &ev) override;
    /**
     * @brief Implement handle default event interface.
     */
    void handleDefaultEvent(const OSEvent &ev) override;
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
    virtual void onDestory();

private:
    ThreadCallback _mainTask{nullptr};

    int32_t _fps{60};

    HandleEventCallback _handleEventCallback{nullptr};
    HandleEventCallback _handleDefaultEventCallback{nullptr};
};

} // namespace cc
