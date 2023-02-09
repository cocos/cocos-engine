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

#include "platform/mac/modules/SystemWindow.h"
#import <AppKit/AppKit.h>
#include "platform/BasePlatform.h"
#include "platform/interfaces/modules/IScreen.h"

#if CC_EDITOR
#import <QuartzCore/CAMetalLayer.h>
#else
#include "platform/mac/AppDelegate.h"
#endif

namespace cc {

SystemWindow::SystemWindow(uint32_t windowId, void *externalHandle)
    : _windowId(windowId) {
    if (externalHandle) {
        _windowHandle = reinterpret_cast<uintptr_t>(externalHandle);
    }
}

SystemWindow::~SystemWindow() {
    setCursorEnabled(true);
}

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
#if CC_EDITOR
    return createWindow(title, 0, 0, w, h, flags);
#else
    AppDelegate *delegate = [[NSApplication sharedApplication] delegate];
    NSString *aString = [NSString stringWithUTF8String:title];
    _window = [delegate createLeftBottomWindow:aString width:w height:h];
    NSView *view = [_window contentView];
    _windowHandle = reinterpret_cast<uintptr_t>(view);
    
    auto dpr = BasePlatform::getPlatform()->getInterface<IScreen>()->getDevicePixelRatio();
    _width  = w * dpr;
    _height = h * dpr;
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
    AppDelegate *delegate = [[NSApplication sharedApplication] delegate];
    NSString *aString = [NSString stringWithUTF8String:title];
    _window = [delegate createWindow:aString xPos:x yPos:y width:w height:h];
    NSView *view = [_window contentView];
    _windowHandle = reinterpret_cast<uintptr_t>(view);
    
    auto dpr = BasePlatform::getPlatform()->getInterface<IScreen>()->getDevicePixelRatio();
    _width  = w * dpr;
    _height = h * dpr;
    return true;
#endif
}

void SystemWindow::closeWindow() {
    //id window = [[[NSApplication sharedApplication] delegate] getWindow];
    if (_window) {
        [_window close];
        _window = nullptr;
    }
}

void SystemWindow::setCursorEnabled(bool value) {
    CGError result;
    if(value) {
        result = CGAssociateMouseAndMouseCursorPosition(YES);
        [NSCursor unhide];
        if(_pointerLock) {
            CGPoint point =
                CGPointMake((float)_lastMousePosX, _lastMousePosY);
            CGWarpMouseCursorPosition(point);
        }
        _pointerLock = false;
    } else {
        result = CGAssociateMouseAndMouseCursorPosition(NO);
        [NSCursor hide];
        _pointerLock = true;
    }
    CC_ASSERT(result == kCGErrorSuccess);
}

void SystemWindow::copyTextToClipboard(const std::string &text) {
    NSPasteboard *pasteboard = [NSPasteboard generalPasteboard];
    [pasteboard clearContents];
    NSString *tmp = [NSString stringWithCString:text.c_str() encoding:NSUTF8StringEncoding];
    [pasteboard setString:tmp forType:NSPasteboardTypeString];
}

uintptr_t SystemWindow::getWindowHandle() const {
    //NSView *view = [[[[NSApplication sharedApplication] delegate] getWindow] contentView];
    return _windowHandle;
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}

uint32_t SystemWindow::getWindowId() const { 
    return _windowId;
}

bool SystemWindow::isPointerLock() const {
    return _pointerLock;
}

void SystemWindow::setLastMousePos(float x, float y) {
    _lastMousePosX = x;
    _lastMousePosY = y;
}

} // namespace cc
