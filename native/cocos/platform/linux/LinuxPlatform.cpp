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

#include "platform/linux/LinuxPlatform.h"

#include <sys/time.h>
#include <unistd.h>

#include "platform/SDLHelper.h"

#include "modules/Accelerometer.h"
#include "modules/Battery.h"
#include "modules/Network.h"
#include "modules/System.h"
#include "modules/Vibrator.h"

#if defined(CC_SERVER_MODE)
    #include "platform/empty/modules/Screen.h"
    #include "platform/empty/modules/SystemWindow.h"
    #include "platform/empty/modules/SystemWindowManager.h"
#else
    #include "modules/Screen.h"
    #include "modules/SystemWindow.h"
    #include "modules/SystemWindowManager.h"
#endif

#include "base/memory/Memory.h"

namespace {

} // namespace

namespace cc {
LinuxPlatform::LinuxPlatform() {
}

LinuxPlatform::~LinuxPlatform() {
}

int32_t LinuxPlatform::init() {
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    _windowManager = std::make_shared<SystemWindowManager>();
    registerInterface(_windowManager);
    registerInterface(std::make_shared<Vibrator>());
    return _windowManager->init();
}

ISystemWindow *LinuxPlatform::createNativeWindow(uint32_t windowId, void *externalHandle) {
    return ccnew SystemWindow(windowId, externalHandle);
}

static long getCurrentMillSecond() {
    long lLastTime;
    struct timeval stCurrentTime;

    gettimeofday(&stCurrentTime, NULL);
    lLastTime = stCurrentTime.tv_sec * 1000 + stCurrentTime.tv_usec * 0.001; // milliseconds
    return lLastTime;
}

void LinuxPlatform::exit() {
    _quit = true;
}

int32_t LinuxPlatform::loop() {
    long lastTime = 0L;
    long curTime = 0L;
    long desiredInterval = 0L;
    long actualInterval = 0L;
    onResume();
    while (!_quit) {
        curTime = getCurrentMillSecond();
        desiredInterval = static_cast<long>(1000.0 / getFps());
        _windowManager->processEvent();
        actualInterval = curTime - lastTime;
        if (actualInterval >= desiredInterval) {
            lastTime = getCurrentMillSecond();
            runTask();
        } else {
            usleep((desiredInterval - curTime + lastTime) * 1000);
        }
    }

    onDestroy();
    return 0;
}

} // namespace cc
