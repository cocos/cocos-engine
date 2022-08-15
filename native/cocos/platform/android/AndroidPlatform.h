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

#include "base/Timer.h"
#include "platform/UniversalPlatform.h"

struct android_app;

namespace cc {
class GameInputProxy;

class CC_DLL AndroidPlatform : public UniversalPlatform {
public:
    AndroidPlatform() = default;

    ~AndroidPlatform() override;

    int init() override;

    void pollEvent() override;

    int32_t run(int argc, const char **argv) override;

    int getSdkVersion() const override;

    int32_t loop() override;

    void *getActivity();

    static void *getEnv();

    void onDestroy() override;

    inline void setAndroidApp(android_app *app) {
        _app = app;
    }

private:
    bool _isLowFrequencyLoopEnabled{false};
    utils::Timer _lowFrequencyTimer;
    int _loopTimeOut{-1};
    GameInputProxy *_inputProxy{nullptr};
    android_app *_app{nullptr};

    friend class GameInputProxy;
};
} // namespace cc
