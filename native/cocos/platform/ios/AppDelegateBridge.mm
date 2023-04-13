/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#import "platform/ios/AppDelegateBridge.h"
#include "platform/ios/IOSPlatform.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

@implementation AppDelegateBridge
cc::IOSPlatform *_platform = nullptr;
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    _platform = dynamic_cast<cc::IOSPlatform *>(cc::BasePlatform::getPlatform());
    CC_ASSERT_NOT_NULL(_platform);
    
    // Create main system window
    CGRect bounds = [[UIScreen mainScreen] bounds];
    cc::ISystemWindowInfo info;
    info.width  = static_cast<int32_t>(bounds.size.width);
    info.height = static_cast<int32_t>(bounds.size.height);
    auto *windowMgr = _platform->getInterface<cc::ISystemWindowManager>();
    windowMgr->createWindow(info);
    
    _platform->loop();
}

- (void)applicationWillResignActive:(UIApplication *)application {
    _platform->onPause();
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    _platform->onResume();
}

- (void)applicationWillTerminate:(UIApplication *)application {
    _platform->onClose();
    _platform->onDestroy();
    _platform = nullptr;
}


- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    cc::events::LowMemory::broadcast();
}

- (float)getPixelRatio {
    cc::BasePlatform *platform = cc::BasePlatform::getPlatform();
    cc::IScreen *screenIntf = platform->getInterface<cc::IScreen>();
    return (float)screenIntf->getDevicePixelRatio();
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    cc::IScreen::Orientation orientation;
    // reference: https://developer.apple.com/documentation/uikit/uiinterfaceorientation?language=objc
    // UIInterfaceOrientationLandscapeRight = UIDeviceOrientationLandscapeLeft
    // UIInterfaceOrientationLandscapeLeft = UIDeviceOrientationLandscapeRight
    switch ([UIDevice currentDevice].orientation) {
        case UIDeviceOrientationPortrait:
            orientation = cc::IScreen::Orientation::PORTRAIT;
            break;
        case UIDeviceOrientationLandscapeRight:
            orientation = cc::IScreen::Orientation::LANDSCAPE_LEFT;
            break;
        case UIDeviceOrientationPortraitUpsideDown:
            orientation = cc::IScreen::Orientation::PORTRAIT_UPSIDE_DOWN;
            break;
        case UIDeviceOrientationLandscapeLeft:
            orientation = cc::IScreen::Orientation::LANDSCAPE_RIGHT;
            break;
        default:
            break;
    }
    cc::DeviceEvent ev;
    cc::BasePlatform *platform = cc::BasePlatform::getPlatform();
    cc::IScreen *screenIntf = platform->getInterface<cc::IScreen>();
    cc::events::Orientation::broadcast((int)screenIntf->getDeviceOrientation());

    float pixelRatio = screenIntf->getDevicePixelRatio();
    cc::WindowEvent resizeEv;
    resizeEv.windowId = 1;
    resizeEv.type = cc::WindowEvent::Type::RESIZED;
    resizeEv.width = size.width * pixelRatio;
    resizeEv.height = size.height * pixelRatio;
    cc::events::WindowEvent::broadcast(resizeEv);
}

- (void)dispatchTouchEvent:(cc::TouchEvent::Type)type touches:(NSSet *)touches withEvent:(UIEvent *)event {
    cc::TouchEvent touchEvent;
    touchEvent.windowId = 1;
    touchEvent.type = type;
    for (UITouch *touch in touches) {
        touchEvent.touches.push_back({static_cast<float>([touch locationInView:[touch view]].x),
                                      static_cast<float>([touch locationInView:[touch view]].y),
                                      static_cast<int>((intptr_t)touch)});
    }
    cc::events::Touch::broadcast(touchEvent);
    touchEvent.touches.clear();
}

@end
