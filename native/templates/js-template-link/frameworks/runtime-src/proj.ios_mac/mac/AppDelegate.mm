#import "AppDelegate.h"
#import "ViewController.h"
#import "Game.h"
#import "scripting/js-bindings/event/EventDispatcher.h"
#import "scripting/js-bindings/event/CustomEventTypes.h"
#include <string>

namespace
{
    AppDelegate* app = nil;
    void applicationReady(const cocos2d::CustomEvent& event)
    {
        if (event.name == EVENT_APPLICATION_READY)
        {
            [NSTimer scheduledTimerWithTimeInterval:(1.0 / 60)
                                             target:app
                                           selector:@selector(renderScene)
                                           userInfo:nil repeats:YES];
        }
    }
}

@interface AppDelegate ()
{
    NSWindow* _window;
    Game* _game;
}
@end

@implementation AppDelegate

- (instancetype)init
{
    self = [super init];
    if (self) {
        app = self;
    }
    return self;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    NSRect rect = NSMakeRect(200, 200, 960, 640);
    _window = [[NSWindow alloc] initWithContentRect:rect
                                          styleMask:NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskTitled | NSWindowStyleMaskClosable
                                            backing:NSBackingStoreBuffered
                                              defer:NO];
    if (!_window) {
        NSLog(@"Failed to allocated the window.");
        return;
    }
    
    _window.title = @"Cocos creator 3D Game";
    
    ViewController* viewController = [[ViewController alloc] initWithSize: rect];
    _window.contentViewController = viewController;
    _window.contentView = viewController.view;
    [_window makeKeyAndOrderFront:nil];
    
    cocos2d::EventDispatcher::addCustomEventListener(EVENT_APPLICATION_READY, applicationReady);
    
    _game = new Game(rect.size.width, rect.size.height);
    _game->init();
}


- (void)applicationWillTerminate:(NSNotification *)aNotification {
    // Insert code here to tear down your application
    delete _game;
    [_window release];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication {
    return YES;
}

- (BOOL) renderScene {
    _game->tick();
    return true;
}

@end
