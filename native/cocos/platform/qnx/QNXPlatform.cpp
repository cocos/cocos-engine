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

#include "platform/qnx/QnxPlatform.h"

#include <sys/time.h>
#include <unistd.h>

#include "platform/interfaces/OSInterface.h"
#include "modules/Accelerometer.h"
#include "modules/Battery.h"
#include "modules/Network.h"
#include "modules/Screen.h"
#include "modules/System.h"
#include "modules/SystemWindow.h"
#include "modules/Vibrator.h"

namespace {

} // namespace

namespace cc {
QnxPlatform::QnxPlatform() {
    // _sdl = std::make_unique<SDLHelper>(this);
}

QnxPlatform::~QnxPlatform() {
}

int32_t QnxPlatform::init() {
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    _window = std::make_shared<SystemWindow>();
    registerInterface(_window);
    registerInterface(std::make_shared<Vibrator>());
    return 0;
}

static long getCurrentMillSecond() {
    long           lLastTime;
    struct timeval stCurrentTime;

    gettimeofday(&stCurrentTime, NULL);
    lLastTime = stCurrentTime.tv_sec * 1000 + stCurrentTime.tv_usec * 0.001; // milliseconds
    return lLastTime;
}

int32_t QnxPlatform::loop() {
    long lastTime        = 0L;
    long curTime         = 0L;
    long desiredInterval = 0L;
    long actualInterval  = 0L;
    onResume();
    while (!_quit) {
        curTime         = getCurrentMillSecond();
		desiredInterval = static_cast<long>(1000.0 / getFps());
        pollEvent();
        actualInterval = curTime - lastTime;
        if (actualInterval >= desiredInterval) {
            lastTime = getCurrentMillSecond();
            runTask();
            //_sdl->swapWindow();
        } else {
            usleep((desiredInterval - curTime + lastTime) * 1000);
        }
    }

    onDestory();
    return 0;
}


void QnxPlatform::pollEvent() {
    //_sdl->pollEvent(&_quit);
}

} // namespace cc
