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

#include "platform/win32/modules/SystemWindow.h"
#include <Windows.h>
#include <functional>
#include "base/Log.h"
#include "engine/EngineEvents.h"
#include "platform/SDLHelper.h"
#include "platform/win32/WindowsPlatform.h"

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

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}
} // namespace cc
