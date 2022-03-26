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

@implementation AppDelegateBridge
cc::IOSPlatform *_platform = nullptr;
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    _platform = dynamic_cast<cc::IOSPlatform *>(cc::BasePlatform::getPlatform());
    CCASSERT(_platform != nullptr, "Platform pointer can't be null");
    _platform->loop();
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    _platform->onPause();
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    _platform->onResume();
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
}

- (void)applicationWillTerminate:(UIApplication *)application {
    _platform->onClose();
    _platform->onDestory();
    _platform = nullptr;
}

- (void)dispatchEvent:(const cc::OSEvent &)ev {
    _platform->dispatchEvent(ev);
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    cc::DeviceEvent ev;
    ev.type = cc::DeviceEvent::Type::DEVICE_MEMORY;
    _platform->dispatchEvent(ev);
}


- (float)getPixelRatio {
    cc::BasePlatform* platform = cc::BasePlatform::getPlatform();
    cc::IScreen* screenIntf = platform->getInterface<cc::IScreen>();
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
    cc::BasePlatform* platform = cc::BasePlatform::getPlatform();
    cc::IScreen* screenIntf = platform->getInterface<cc::IScreen>();
    ev.type           = cc::DeviceEvent::Type::DEVICE_ORIENTATION;
    ev.args[0].intVal = static_cast<int>(screenIntf->getDeviceOrientation());
    _platform->dispatchEvent(ev);

    float pixelRatio = screenIntf->getDevicePixelRatio();
    cc::WindowEvent resizeEv;
    resizeEv.type = cc::WindowEvent::Type::RESIZED;
    resizeEv.width = size.width * pixelRatio;
    resizeEv.height = size.height * pixelRatio;
    _platform->dispatchEvent(resizeEv);
}

- (void)dispatchTouchEvent:(cc::TouchEvent::Type)type touches:(NSSet *)touches withEvent:(UIEvent *)event {
    cc::TouchEvent touchEvent;
    touchEvent.type = type;
    for (UITouch *touch in touches) {
        touchEvent.touches.push_back({static_cast<float>([touch locationInView:[touch view]].x),
                                      static_cast<float>([touch locationInView:[touch view]].y),
                                      static_cast<int>((intptr_t)touch)});
    }
    _platform->dispatchEvent(touchEvent);
    touchEvent.touches.clear();
}

@end

