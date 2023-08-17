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

#include "platform/qnx/modules/SystemWindow.h"

#include "base/Log.h"
#include "base/Macros.h"

// SDL headers
#include <functional>
#include "SDL2/SDL.h"
#include "SDL2/SDL_main.h"
#include "SDL2/SDL_syswm.h"
#include "bindings/event/EventDispatcher.h"
#include "platform/IEventDispatch.h"
#include "platform/qnx/QnxPlatform.h"

namespace cc {
SystemWindow::SystemWindow() {
}

SystemWindow::~SystemWindow() {
    if (_screenWin) {
        screen_destroy_window(_screenWin);
    }
    if (_screenCtx) {
        screen_destroy_context(_screenCtx);
    }
}

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
    _width = w;
    _height = h;
    createWindow(title, 0, 0, w, h, flags);
    return true;
}

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
    if (_screenWin) {
        return true;
    }
    _width = w;
    _height = h;

    //Create the screen context
    int rc = screen_create_context(&_screenCtx, SCREEN_APPLICATION_CONTEXT);
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
#ifdef CC_USE_GLES3
    screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_USAGE, (const int[]){SCREEN_USAGE_OPENGL_ES3});
#elif CC_USE_GLES2
    screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_USAGE, (const int[]){SCREEN_USAGE_OPENGL_ES2});
#endif

    int pos[2] = {x, y}; /* size of the window on screen */
    rc = screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_POSITION, pos);
    if (rc) {
        perror("screen_set_window_property_iv(SCREEN_PROPERTY_SIZE)");
        return EXIT_FAILURE;
    }

    int size[2] = {w, h}; /* size of the window on screen */
    rc = screen_set_window_property_iv(_screenWin, SCREEN_PROPERTY_SIZE, size);
    if (rc) {
        perror("screen_set_window_property_iv(SCREEN_PROPERTY_POSITION)");
        return EXIT_FAILURE;
    }

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

uintptr_t SystemWindow::getWindowHandle() const {
    return reinterpret_cast<uintptr_t>(_screenWin);
}

void SystemWindow::setCursorEnabled(bool value) {
    //TODO
}

void SystemWindow::copyTextToClipboard(const ccstd::string &text) {
    //TODO
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}

} // namespace cc