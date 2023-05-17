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

#import "AppDelegate.h"
#include "base/std/container/string.h"
//#import "Game.h"
#import "ViewController.h"
#include "engine/EngineEvents.h"
#include "platform/mac/MacPlatform.h"

@interface AppDelegate () {
    NSWindow* _window;
    //    Game*     _game;
    cc::MacPlatform* _platform;
}
@end

@implementation AppDelegate

- (void)createLeftBottomWindow:(NSString*)title width:(int)w height:(int)h {
    [self createWindow:title xPos:0 yPos:0 width:w height:h];
}

- (NSWindow*)createWindow:(NSString*)title xPos:(int)x yPos:(int)y width:(int)w height:(int)h {
    //_window.title = title;
    NSRect rect = NSMakeRect(x, y, w, h);
    NSWindow* window = [[NSWindow alloc] initWithContentRect:rect
                                          styleMask:NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskResizable
                                            backing:NSBackingStoreBuffered
                                              defer:NO];
    if (!window) {
        NSLog(@"Failed to allocated the window.");
        return nullptr;
    }
    
    ViewController* viewController = [[ViewController alloc] initWithSize:rect];
    window.contentViewController = viewController;
    window.contentView = viewController.view;
    [viewController release];
    viewController = nil;
    
    window.title = title;
    [window.contentView setWantsBestResolutionOpenGLSurface:YES];
    [window makeKeyAndOrderFront:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowWillMiniaturizeNotification)
                                                 name:NSWindowWillMiniaturizeNotification
                                               object:window];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowDidDeminiaturizeNotification)
                                                 name:NSWindowDidDeminiaturizeNotification
                                               object:window];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowWillCloseNotification)
                                                 name:NSWindowWillCloseNotification
                                               object:window];
    if (!_window) {
        _window = window;
    }
    return window;
}

- (void)applicationDidFinishLaunching:(NSNotification*)aNotification {
    _platform = dynamic_cast<cc::MacPlatform*>(cc::BasePlatform::getPlatform());
    CC_ASSERT_NOT_NULL(_platform);
    _platform->loop();
}

- (void)windowWillMiniaturizeNotification {
    _platform->onPause();
}

- (void)windowDidDeminiaturizeNotification {
    _platform->onResume();
}

- (void)windowWillCloseNotification {
    _platform->onClose();
}

- (NSWindow*)getWindow {
    return _window;
}

- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)sender
{
    return _platform->readyToExit() ? NSTerminateNow : NSTerminateLater;
}

- (void)applicationWillTerminate:(NSNotification*)aNotification {
    //    delete _game;
    //FIXME: will crash if relase it here.
    // [_window release];
    _platform->onDestroy();
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)theApplication {
    return YES;
}

@end
