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
#include <string>
//#import "Game.h"
#import "ViewController.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/mac/MacPlatform.h"


@interface AppDelegate () {
    NSWindow* _window;
    //    Game*     _game;
    cc::MacPlatform* _platform;
}
@end

@implementation AppDelegate

- (void)createWindow:(NSString*)title xPos:(int)x yPos:(int)y width:(int)w height:(int)h {
    _window.title = title;
    NSRect rect   = NSMakeRect(x, y, w, h);
    _window       = [[NSWindow alloc] initWithContentRect:rect
                                          styleMask:NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskResizable
                                            backing:NSBackingStoreBuffered
                                              defer:NO];
    if (!_window) {
        NSLog(@"Failed to allocated the window.");
        return;
    }
    ViewController* viewController = [[ViewController alloc] initWithSize:rect];
    _window.contentViewController  = viewController;
    _window.contentView            = viewController.view;
    [_window.contentView setWantsBestResolutionOpenGLSurface:YES];
    [_window makeKeyAndOrderFront:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowWillMiniaturizeNotification)
                                                 name:NSWindowWillMiniaturizeNotification
                                               object:_window];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowDidDeminiaturizeNotification)
                                                 name:NSWindowDidDeminiaturizeNotification
                                               object:_window];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(windowWillCloseNotification)
                                                 name:NSWindowWillCloseNotification
                                               object:_window];
}

- (void)applicationDidFinishLaunching:(NSNotification*)aNotification {
    _platform = dynamic_cast<cc::MacPlatform*>(cc::BasePlatform::getPlatform());
    CCASSERT(_platform != nullptr, "Platform pointer can't be null");
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

- (void)applicationWillTerminate:(NSNotification*)aNotification {
    //    delete _game;
    //FIXME: will crash if relase it here.
    // [_window release];
    _platform->onDestory();
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)theApplication {
    return YES;
}

- (void)dispatchEvent:(const cc::OSEvent&)ev {
    _platform->dispatchEvent(ev);
}

@end
