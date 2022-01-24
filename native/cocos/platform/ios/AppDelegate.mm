/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#import "platform/ios/AppDelegate.h"
#import "ViewController.h"
#import "platform/ios/View.h"

#include "platform/ios/IOSPlatform.h"
#include "platform/ios/service/SDKWrapper.h"

@implementation AppDelegate

cc::IOSPlatform *_platform = nullptr;

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper shared] application:application didFinishLaunchingWithOptions:launchOptions];
    // Add the view controller's view to the window and display.
    CGRect bounds = [[UIScreen mainScreen] bounds];
    self.window   = [[UIWindow alloc] initWithFrame:bounds];

    // Should create view controller first, cc::Application will use it.
    _viewController                           = [[ViewController alloc] init];
    _viewController.view                      = [[View alloc] initWithFrame:bounds];
    _viewController.view.contentScaleFactor   = UIScreen.mainScreen.scale;
    _viewController.view.multipleTouchEnabled = true;
    [self.window setRootViewController:_viewController];

    [self.window makeKeyAndVisible];

    _platform = dynamic_cast<cc::IOSPlatform *>(cc::BasePlatform::getPlatform());
    CCASSERT(_platform != nullptr, "Platform pointer can't be null");
    _platform->loop();

    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    [[SDKWrapper shared] applicationWillResignActive:application];
    _platform->onPause();
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    [[SDKWrapper shared] applicationDidBecomeActive:application];
    _platform->onResume();
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    [[SDKWrapper shared] applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    [[SDKWrapper shared] applicationWillEnterForeground:application];
}

- (void)applicationWillTerminate:(UIApplication *)application {
    _platform->onClose();
    _platform->onDestory();
    _platform = nullptr;
    [[SDKWrapper shared] applicationWillTerminate:application];
}

- (void)dispatchEvent:(const cc::OSEvent &)ev {
    _platform->dispatchEvent(ev);
}

#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    [[SDKWrapper shared] applicationDidReceiveMemoryWarning:application];
    cc::DeviceEvent ev;
    ev.type = cc::DeviceEvent::Type::DEVICE_MEMORY;
    _platform->dispatchEvent(ev);
}

// We must put UIApplicationMain in the same file as AppDelegate,
// otherwise there will be instances where AppDelegate cannot be found at runtime.
// Reference SDL implementation
int runUIAppicationMain(int argc, const char** argv) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, (char**)argv, nil, @"AppDelegate");
    [pool release];
    return retVal;
}



@end
