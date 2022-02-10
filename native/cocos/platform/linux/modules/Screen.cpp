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

#include "platform/linux/modules/Screen.h"
#include <X11/Xlib.h>
#include "base/Macros.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {

int Screen::getDPI() const {
    static int dpi = -1;
    if (dpi == -1) {
        Display *dpy;
        char *   displayname = NULL;
        int      scr         = 0; /* Screen number */
        dpy                  = XOpenDisplay(displayname);
        /*
         * there are 2.54 centimeters to an inch; so there are 25.4 millimeters.
         *
         *     dpi = N pixels / (M millimeters / (25.4 millimeters / 1 inch))
         *         = N pixels / (M inch / 25.4)
         *         = N * 25.4 pixels / M inch
         */
        double xres = ((((double)DisplayWidth(dpy, scr)) * 25.4) /
                       ((double)DisplayWidthMM(dpy, scr)));
        dpi         = (int)(xres + 0.5);
        //printf("dpi = %d\n", dpi);
        XCloseDisplay(dpy);
    }
    return dpi;
}

float Screen::getDevicePixelRatio() const {
    return 1;
}

void Screen::setKeepScreenOn(bool value) {
    CC_UNUSED_PARAM(value);
}

Screen::Orientation Screen::getDeviceOrientation() const {
    return Orientation::PORTRAIT;
}

Vec4 Screen::getSafeAreaEdge() const {
    return cc::Vec4();
}

bool Screen::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value           ret;
    char                commandBuf[100] = "cc.profiler.isShowingStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Screen::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char                commandBuf[100] = {0};
    sprintf(commandBuf, isShow ? "cc.profiler.showStats();" : "cc.profiler.hideStats();");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

} // namespace cc