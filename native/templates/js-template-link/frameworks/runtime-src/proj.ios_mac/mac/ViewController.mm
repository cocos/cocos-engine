#import "ViewController.h"
#import <AppKit/NSTouch.h>
#import <AppKit/NSEvent.h>

#import "Game.h"

@implementation ViewController
{
    NSView* _view;
}

- (instancetype)initWithSize:(NSRect)rect {
    if ( self = [super init]) {
        _view = [[NSView alloc] initWithFrame:rect];
        self.view = _view;
    }
    return self;
}

- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

    // Update the view, if already loaded.
}

- (void)viewDidAppear
{
    // Make the view controller the window's first responder so that it can handle the Key events
    [_view.window makeFirstResponder:self];
}

- (void)keyDown:(NSEvent *)event {
}

- (BOOL)acceptsFirstResponder {
    return YES;
}

@end
