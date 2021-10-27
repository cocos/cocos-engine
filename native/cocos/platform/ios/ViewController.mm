/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#import "ViewController.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/IEventDispatch.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/BasePlatform.h"
#include "platform/ios/AppDelegate.h"
//#include "cocos/platform/Device.h"

namespace {
//    cc::Device::Orientation _lastOrientation;
}

@interface ViewController ()
 
@end

@implementation ViewController

cc::IScreen::Orientation _lastOrientation;

- (BOOL) shouldAutorotate {
    return YES;
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    cc::IScreen::Orientation orientation = _lastOrientation;
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
    if (_lastOrientation != orientation) {
        cc::DeviceEvent ev;
        cc::BasePlatform* platform = cc::BasePlatform::getPlatform();
        cc::IScreen* screenIntf = platform->getInterface<cc::IScreen>();
        ev.type           = cc::DeviceEvent::Type::DEVICE_ORIENTATION;
        ev.args[0].intVal = static_cast<int>(screenIntf->getDeviceOrientation());
        AppDelegate* delegate = [[UIApplication sharedApplication] delegate];
        [delegate dispatchEvent:ev];
        _lastOrientation = orientation;
    }
}

@end
