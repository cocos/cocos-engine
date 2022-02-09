#import "AppDelegate.h"
#import "ViewController.h"
#import "Game.h"
#include <string>

@interface AppDelegate ()
{
    NSWindow* _window;
    Game* _game;
}
@end

@implementation AppDelegate

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
    [_window.contentView setWantsBestResolutionOpenGLSurface:YES];
    [_window makeKeyAndOrderFront:nil];
        
    _game = new Game(rect.size.width, rect.size.height);
    _game->init();

    [[NSNotificationCenter defaultCenter] addObserver:self 
        selector:@selector(windowWillMiniaturizeNotification)name:NSWindowWillMiniaturizeNotification 
        object:_window];
    [[NSNotificationCenter defaultCenter] addObserver:self 
        selector:@selector(windowDidDeminiaturizeNotification)name:NSWindowDidDeminiaturizeNotification 
        object:_window];
}

- (void)windowWillMiniaturizeNotification
{
    _game->onPause();
}

- (void)windowDidDeminiaturizeNotification
{
    _game->onResume();
}

- (NSWindow*)getWindow
{
    return _window;
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    delete _game;
    [_window release];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication {
    return YES;
}

@end
