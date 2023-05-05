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

#include "platform/openharmony/modules/SystemWindow.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "platform/openharmony/OpenHarmonyPlatform.h"

namespace cc {

SystemWindow::SystemWindow(uint32_t windowId, void *externalHandle)
: _windowId(windowId) {
    if (externalHandle) {
        _windowHandle = reinterpret_cast<void*>(externalHandle);
    }
}

SystemWindow::~SystemWindow() {
    _windowHandle = 0;
    _windowId = 0;
}

bool SystemWindow::createWindow(const char* title,
                                int x, int y, int w,
                                int h, int flags) {
    CC_UNUSED_PARAM(title);
    CC_UNUSED_PARAM(x);
    CC_UNUSED_PARAM(y);
    CC_UNUSED_PARAM(flags);

    _width = w;
    _height = h;
    return true;
}


void SystemWindow::setCursorEnabled(bool value) {
}

uint32_t SystemWindow::getWindowId() const {
    return _windowId;
}

uintptr_t SystemWindow::getWindowHandle() const {
    return reinterpret_cast<uintptr_t>(_windowHandle);
}

void SystemWindow::setWindowHandle(void* window) {
    _windowHandle = window;
}

void SystemWindow::setViewSize(uint32_t width, uint32_t height) {
    _width = width;
    _height = height;
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width),
                static_cast<float>(_height)};
}


} // namespace cc