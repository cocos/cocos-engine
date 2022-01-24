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

#include "platform/ios/modules/Screen.h"

#include <CoreFoundation/CoreFoundation.h>
#import <CoreMotion/CoreMotion.h>
#include <CoreText/CoreText.h>
#import <UIKit/UIKit.h>

#include "base/Macros.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {

int Screen::getDPI() const {
    static int dpi = -1;

    if (dpi == -1) {
        float scale = 1.0f;

        if ([[UIScreen mainScreen] respondsToSelector:@selector(scale)]) {
            scale = [[UIScreen mainScreen] scale];
        }

        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
            dpi = 132 * scale;
        } else if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
            dpi = 163 * scale;
        } else {
            dpi = 160 * scale;
        }
    }
    return dpi;
}

float Screen::getDevicePixelRatio() const {
    return [[UIScreen mainScreen] nativeScale];
}

void Screen::setKeepScreenOn(bool value) {
    [[UIApplication sharedApplication] setIdleTimerDisabled:(BOOL)value];
}

Screen::Orientation Screen::getDeviceOrientation() const {
    Orientation orientation = Orientation::PORTRAIT;
    switch ([[UIApplication sharedApplication] statusBarOrientation]) {
        case UIInterfaceOrientationLandscapeRight:
            orientation = Orientation::LANDSCAPE_RIGHT;
            break;

        case UIInterfaceOrientationLandscapeLeft:
            orientation = Orientation::LANDSCAPE_LEFT;
            break;

        case UIInterfaceOrientationPortraitUpsideDown:
            orientation = Orientation::PORTRAIT_UPSIDE_DOWN;
            break;

        case UIInterfaceOrientationPortrait:
            orientation = Orientation::PORTRAIT;
            break;
        default:
            assert(false);
            break;
    }

    return orientation;
}

Vec4 Screen::getSafeAreaEdge() const {
    UIView *screenView = UIApplication.sharedApplication.delegate.window.rootViewController.view;

    if (@available(iOS 11.0, *)) {
        UIEdgeInsets safeAreaEdge = screenView.safeAreaInsets;
        return cc::Vec4(safeAreaEdge.top, safeAreaEdge.left, safeAreaEdge.bottom, safeAreaEdge.right);
    }
    // If running on iOS devices lower than 11.0, return ZERO Vec4.
    return cc::Vec4();
}

bool Screen::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value           ret;
    char                commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Screen::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char                commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}


} // namespace cc
