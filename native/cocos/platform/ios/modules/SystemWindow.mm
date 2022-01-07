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
#include "platform/ios/modules/SystemWindow.h"
#import <UIKit/UIKit.h>
#include "platform/ios/AppDelegate.h"

namespace {

}

namespace cc {

SystemWindow::~SystemWindow() = default;

bool SystemWindow::createWindow(const char* title,
                                int x, int y, int w,
                                int h, int flags) {
    _width  = w;
    _height = h;
    return true;
}

void SystemWindow::setCursorEnabled(bool value) {
}

void SystemWindow::copyTextToClipboard(const std::string& text) {
    UIPasteboard* pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string        = [NSString stringWithCString:text.c_str() encoding:NSUTF8StringEncoding];
}

uintptr_t SystemWindow::getWindowHandler() const {
    return reinterpret_cast<uintptr_t>(UIApplication.sharedApplication.delegate.window.rootViewController.view);
}

SystemWindow::Size SystemWindow::getViewSize() const {
    CGRect bounds = [[UIScreen mainScreen] bounds];
    return Size{static_cast<float>(bounds.size.width), static_cast<float>(bounds.size.height)};
}


}
