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

#include "platform/linux/modules/SystemWindow.h"

#include "base/Log.h"
#include "base/Macros.h"

// SDL headers
#include <functional>
#include "SDL2/SDL.h"
#include "SDL2/SDL_main.h"
#include "SDL2/SDL_syswm.h"
#include "bindings/event/EventDispatcher.h"
#include "platform/IEventDispatch.h"
#include "platform/SDLHelper.h"

namespace cc {
SystemWindow::SystemWindow(IEventDispatch *delegate)
: _sdl(std::make_unique<SDLHelper>(delegate)) {
}

SystemWindow::~SystemWindow() {
}

int SystemWindow::init() {
    return _sdl->init();
}

void SystemWindow::pollEvent(bool *quit) {
    return _sdl->pollEvent(quit);
}

void SystemWindow::swapWindow() {
    _sdl->swapWindow();
}

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
    _sdl->createWindow(title, w, h, flags);
    _width = w;
    _height = h;
    return true;
}

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
    // Create window
    _sdl->createWindow(title, x, y, w, h, flags);
    _width = w;
    _height = h;
    return true;
}

void SystemWindow::closeWindow() {
#ifndef CC_SERVER_MODE
    auto windowHandle = getSDLWindowHandle();

    SDL_Event et;
    et.type = SDL_QUIT;
    auto posted = SDL_PushEvent(&et);
#endif
}

uintptr_t SystemWindow::getWindowHandle() const {
    return _sdl->getWindowHandle();
}

SDL_Window *SystemWindow::getSDLWindowHandle() const {
    return _sdl->getSDLWindowHandle();
}

uintptr_t SystemWindow::getDisplay() const {
    return _sdl->getDisplay();
}

void SystemWindow::setCursorEnabled(bool value) {
    _sdl->setCursorEnabled(value);
}

void SystemWindow::copyTextToClipboard(const ccstd::string &text) {
    //TODO
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}

} // namespace cc
