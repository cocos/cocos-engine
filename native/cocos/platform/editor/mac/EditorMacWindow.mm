/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
#import <QuartzCore/CAMetalLayer.h>

NSMutableDictionary *layerMap = [[NSMutableDictionary dictionary] retain];
namespace cc {


SystemWindow::SystemWindow(uint32_t windowId, void *externalHandle)
    : _windowId(windowId) {
        if (externalHandle) {
            _windowHandle = reinterpret_cast<uintptr_t>(externalHandle);
        }
}

SystemWindow::~SystemWindow() = default;

bool SystemWindow::createWindow(const char *title,
                                int w, int h, int flags) {
    return createWindow(title, 0, 0, w, h, flags);
}

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
    _width                = w;
    _height               = h;
    CAMetalLayer *layer = [[CAMetalLayer layer] retain];
    layer.pixelFormat   = MTLPixelFormatBGRA8Unorm;
    layer.frame = CGRectMake(0, 0, w, h);
    [layer setAnchorPoint:CGPointMake(0.f, 0.f)];
    NSString *key = [NSString stringWithFormat:@"%u",_windowId];
    [layerMap setValue:layer forKey:key];
    return true;
}

void SystemWindow::closeWindow() {
    //id window = [[[NSApplication sharedApplication] delegate] getWindow];
    if (_window) {
        [_window close];
        _window = nullptr;
    }
}

void SystemWindow::setCursorEnabled(bool value) {
}

void SystemWindow::copyTextToClipboard(const std::string &text) {
    NSPasteboard *pasteboard = [NSPasteboard generalPasteboard];
    [pasteboard clearContents];
    NSString *tmp = [NSString stringWithCString:text.c_str() encoding:NSUTF8StringEncoding];
    [pasteboard setString:tmp forType:NSPasteboardTypeString];
}

uintptr_t SystemWindow::getWindowHandle() const {
    NSString *key = [NSString stringWithFormat:@"%u",_windowId];
    CAMetalLayer *layer = [layerMap valueForKey:key];
    return reinterpret_cast<uintptr_t>(layer);
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(_width), static_cast<float>(_height)};
}

uint32_t SystemWindow::getWindowId() const {
    return _windowId;
}

}
