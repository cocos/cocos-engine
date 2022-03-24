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
#include "platform/interfaces/modules/ISystemWindow.h"

namespace {

} // namespace

namespace cc {
QnxPlatform::QnxPlatform() {
    // _sdl = std::make_unique<SDLHelper>(this);
}
QnxPlatform::~QnxPlatform() {
    if (_screenWin) {
        screen_destroy_window(_screenWin);
    }
    if (_screenCtx) {
        screen_destroy_context(_screenCtx);
    }
}

int32_t QnxPlatform::init() {
    UniversalPlatform::init();
    // return _sdl->init() ? 0 : -1;
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

bool QnxPlatform::createWindow(const char *title,
                               int x, int y, int w,
                               int h, int flags) {
    if (_inited) {
        return true;
    }
    int rc;

    //Create the screen context
    rc = screen_create_context(&_screenCtx, SCREEN_APPLICATION_CONTEXT);
    if (rc) {
        perror("screen_create_window");
        return EXIT_FAILURE;
    }

    //Create the screen window that will be render onto
    rc = screen_create_window(&_screenWin, _screenCtx);
    if (rc) {
        perror("screen_create_window");
        return EXIT_FAILURE;
    }

    screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_FORMAT, (const int[]){SCREEN_FORMAT_RGBX8888});
    screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_USAGE, (const int[]){SCREEN_USAGE_OPENGL_ES2});

    int size[2] = {w, h}; /* size of the window on screen */
    rc          = screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_SIZE, size);

    int dpi = 0;
    screen_get_window_property_iv(_screenWin, SCREEN_PROPERTY_DPI, &dpi);
    fprintf(stdout, "[glError] %d\n", dpi);

    rc = screen_create_window_buffers(_screenWin, 2);
    if (rc) {
        perror("screen_create_window_buffers");
        return EXIT_FAILURE;
    }
    // return _sdl->createWindow(title, x, y, w, h, flags);
    return true;
}

uintptr_t QnxPlatform::getWindowHandler() const {
    // return _sdl->getWindowHandler();
    return reinterpret_cast<uintptr_t>(_screenWin);
}

} // namespace cc
