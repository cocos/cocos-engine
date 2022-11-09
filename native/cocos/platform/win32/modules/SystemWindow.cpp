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

#include "platform/win32/modules/SystemWindow.h"
#include <Windows.h>
#include <functional>
#include "base/Log.h"
#include "engine/EngineEvents.h"
#include "platform/SDLHelper.h"
#include "platform/win32/WindowsPlatform.h"
#include "sdl2/SDL_clipboard.h"

namespace cc {
SystemWindow::SystemWindow(uint32_t windowId, void *externalHandle)
: _windowId(windowId) {
    if (externalHandle) {
        _windowHandle = reinterpret_cast<uintptr_t>(externalHandle);
    }
}

SystemWindow::~SystemWindow() {
    _windowHandle = 0;
    _windowId = 0;
}

void SystemWindow::swapWindow() {
    SDLHelper::swapWindow(_window);
}

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
    _window = SDLHelper::createWindow(title, w, h, flags);
    if (!_window) {
        return false;
    }

    _width = w;
    _height = h;
    _windowHandle = SDLHelper::getWindowHandle(_window);
    return true;
}

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
    _window = SDLHelper::createWindow(title, x, y, w, h, flags);
    if (!_window) {
        return false;
    }

    _width = w;
    _height = h;
    _windowHandle = SDLHelper::getWindowHandle(_window);

    return true;
}

void SystemWindow::closeWindow() {
    HWND windowHandle = reinterpret_cast<HWND>(getWindowHandle());
    if (windowHandle != 0) {
        ::SendMessageA(windowHandle, WM_CLOSE, 0, 0);
    }
}

uint32_t SystemWindow::getWindowId() const {
    return _windowId;
}

uintptr_t SystemWindow::getWindowHandle() const {
    return _windowHandle;
}

void SystemWindow::setCursorEnabled(bool value) {
    SDLHelper::setCursorEnabled(value);
}

void SystemWindow::copyTextToClipboard(const ccstd::string &text) {
    SDL_SetClipboardText(text.c_str());
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}
} // namespace cc
