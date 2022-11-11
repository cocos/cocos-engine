/****************************************************************************
   重写getDevicePixelRatio方法
*/

#include "platform/mac/modules/Screen.h"

#import <AppKit/AppKit.h>
#include <Cocoa/Cocoa.h>
#include <Foundation/Foundation.h>

#include "base/Macros.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {

int Screen::getDPI() const {
    NSScreen *    screen              = [NSScreen mainScreen];
    NSDictionary *description         = [screen deviceDescription];
    NSSize        displayPixelSize    = [[description objectForKey:NSDeviceSize] sizeValue];
    CGSize        displayPhysicalSize = CGDisplayScreenSize([[description objectForKey:@"NSScreenNumber"] unsignedIntValue]);

    return ((displayPixelSize.width / displayPhysicalSize.width) * 25.4f);
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
