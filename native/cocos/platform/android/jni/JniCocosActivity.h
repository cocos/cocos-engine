/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include <string>
#include <android/native_window.h>
#include <android/asset_manager.h>
#include <mutex>
#include <condition_variable>

namespace cc {

struct CocosApp {
    AAssetManager *assetManager = nullptr;
    ANativeWindow *window = nullptr;
    std::string obbPath;
    int sdkVersion = 0;

    std::mutex mutex;
    std::condition_variable cond;
    ANativeWindow *pendingWindow = nullptr;
    bool destroyRequested = false;
    bool animating = true;
    bool running = false;

    // Current state of the app's activity.  May be either APP_CMD_RESUME, APP_CMD_PAUSE.
    int activityState = 0;
};

extern CocosApp cocosApp;

} // namespace cc
