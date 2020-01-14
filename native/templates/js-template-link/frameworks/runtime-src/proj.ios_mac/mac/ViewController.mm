#import "ViewController.h"
#import <AppKit/NSTouch.h>
#import <AppKit/NSEvent.h>

#import "Game.h"

@implementation ViewController
{
    MTKView* _view;
    Game* _game;
}

- (void)viewDidLoad {
    [super viewDidLoad];

    [super viewDidLoad];
    
    // Set the view to use the default device
    _view = (MTKView *)self.view;
    _view.depthStencilPixelFormat = MTLPixelFormatDepth24Unorm_Stencil8;
    _view.device = MTLCreateSystemDefaultDevice();
    NSAssert(_view.device, @"Metal is not supported on this device");
    _view.delegate = self;
    
    CGSize size = _view.drawableSize;
    _game = new Game(size.width, size.height);
    _game->init();
}


- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

    // Update the view, if already loaded.
}


- (void)drawInMTKView:(nonnull MTKView *)view {
    _game->tick();
}

- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
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
