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

#include "platform/mac/modules/SystemWindow.h"
#include "platform/mac/View.h"

#include "base/Log.h"
#include "base/Macros.h"

// SDL headers
#include <functional>
#include "SDL2/SDL.h"
#include "SDL2/SDL_main.h"
#include "SDL2/SDL_syswm.h"
#include "engine/EngineEvents.h"
#include "platform/SDLHelper.h"
#import <AppKit/NSView.h>
#import <AppKit/NSWindow.h>
#import <Metal/Metal.h>
#import <QuartzCore/CAMetalLayer.h>
#include "platform/interfaces/modules/IScreen.h"
#include "platform/BasePlatform.h"

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

void SystemWindow::initWindowProperty(SDL_Window* window, const char *title, int x, int y, int w, int h) {
    CC_ASSERT(window != nullptr);
    auto* nsWindow = reinterpret_cast<NSWindow*>(SDLHelper::getWindowHandle(window));
    NSString *astring = [NSString stringWithUTF8String:title];
    nsWindow.title = astring;
    // contentView is created internally by sdl.
    NSView *view = nsWindow.contentView;
    auto* newView = [[View alloc] initWithFrame:view.frame];
    [view addSubview:newView];
    [nsWindow.contentView setWantsBestResolutionOpenGLSurface:YES];
    [nsWindow makeKeyAndOrderFront:nil];
    _windowHandle = reinterpret_cast<uintptr_t>(newView);

    auto dpr = [nsWindow backingScaleFactor];
    _width  = w * dpr;
    _height = h * dpr;
}

NSWindow* SystemWindow::getNSWindow() const {
    CC_ASSERT(_window != nullptr);
    return reinterpret_cast<NSWindow*>(SDLHelper::getWindowHandle(_window));
}

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
#if CC_EDITOR
   return createWindow(title, 0, 0, w, h, flags);
#else
    _window = SDLHelper::createWindow(title, w, h, flags);
    if (!_window) {
        return false;
    }
    Vec2 pos = SDLHelper::getWindowPosition(_window);
    initWindowProperty(_window, title, pos.x, pos.y, w, h);
    return true;
#endif
}

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
#if CC_EDITOR
    _width                = w;
    _height               = h;
    CAMetalLayer *layer = [[CAMetalLayer layer] retain];
    layer.pixelFormat   = MTLPixelFormatBGRA8Unorm;
    layer.frame = CGRectMake(x, y, w, h);
    [layer setAnchorPoint:CGPointMake(0.f, 0.f)];
    _windowHandle = reinterpret_cast<uintptr_t>(layer);
    return true;
#else
    _window = SDLHelper::createWindow(title, x, y, w, h, flags);
    if (!_window) {
        return false;
    }
    initWindowProperty(_window, title, x, y, w, h);
    return true;
#endif
}

void SystemWindow::closeWindow() {
#ifndef CC_SERVER_MODE
    SDL_Event et;
    et.type = SDL_QUIT;
    SDL_PushEvent(&et);
#endif
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
