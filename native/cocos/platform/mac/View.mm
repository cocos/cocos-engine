/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#import "View.h"
#import <AppKit/NSEvent.h>
#import <AppKit/NSScreen.h>
#import <AppKit/NSTouch.h>
#import <QuartzCore/QuartzCore.h>
#import "KeyCodeHelper.h"
#import "cocos/bindings/event/EventDispatcher.h"
#import "platform/mac/AppDelegate.h"

//#include "platform/Application.h"

@implementation View {
    cc::MouseEvent    _mouseEvent;
    cc::KeyboardEvent _keyboardEvent;
    AppDelegate*      _delegate;
}

#ifdef CC_USE_METAL
- (CALayer *)makeBackingLayer {
    CAMetalLayer *layer              = [CAMetalLayer layer];
    layer.delegate                   = self;
    layer.autoresizingMask           = true;
    layer.needsDisplayOnBoundsChange = true;
    return layer;
}
#endif

- (instancetype)initWithFrame:(NSRect)frameRect {
    if (self = [super initWithFrame:frameRect]) {
        [self.window makeFirstResponder:self];
        _delegate = [[NSApplication sharedApplication] delegate];
#ifdef CC_USE_METAL
        int    pixelRatio = [[NSScreen mainScreen] backingScaleFactor];
        CGSize size       = CGSizeMake(frameRect.size.width * pixelRatio, frameRect.size.height * pixelRatio);
        // Create CAMetalLayer
        self.wantsLayer = YES;
        // Config metal layer
        CAMetalLayer *layer = (CAMetalLayer *)self.layer;
        layer.drawableSize  = size;
        layer.pixelFormat   = MTLPixelFormatBGRA8Unorm;
        layer.device = self.device     = [MTLCreateSystemDefaultDevice() autorelease];
        layer.autoresizingMask         = kCALayerWidthSizable | kCALayerHeightSizable;
        self.layerContentsRedrawPolicy = NSViewLayerContentsRedrawDuringViewResize;
        self.layerContentsPlacement    = NSViewLayerContentsPlacementScaleProportionallyToFill;
#endif
    }
    return self;
}

#ifdef CC_USE_METAL
- (void)drawInMTKView:(MTKView *)view {
    //cc::Application::getInstance()->tick();
}

- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::RESIZED;
    ev.width = static_cast<int>(size.width);
    ev.height = static_cast<int>(size.height);
    [_delegate dispatchEvent:ev];
    //cc::EventDispatcher::dispatchResizeEvent(, );
}
#endif

- (void)displayLayer:(CALayer *)layer {
    //cc::Application::getInstance()->tick();
}

- (void)setFrameSize:(NSSize)newSize {
    CAMetalLayer *layer = (CAMetalLayer *)self.layer;

    CGSize nativeSize = [self convertSizeToBacking:newSize];
    [super setFrameSize:newSize];
    layer.drawableSize = nativeSize;
    [self viewDidChangeBackingProperties];

    // Add tracking area to receive mouse move events.
    NSRect          rect         = {0, 0, nativeSize.width, nativeSize.height};
    NSTrackingArea *trackingArea = [[NSTrackingArea alloc] initWithRect:rect
                                                                options:(NSTrackingMouseEnteredAndExited | NSTrackingMouseMoved | NSTrackingActiveInKeyWindow)
                                                                  owner:self
                                                               userInfo:nil];
    [self addTrackingArea:[trackingArea autorelease]];

    if (cc::EventDispatcher::initialized()) {
        cc::WindowEvent ev;
        ev.type = cc::WindowEvent::Type::RESIZED;
        ev.width = static_cast<int>(nativeSize.width);
        ev.height = static_cast<int>(nativeSize.height);
        [_delegate dispatchEvent:ev];
    }
}

- (void)viewDidChangeBackingProperties {
    [super viewDidChangeBackingProperties];
    CAMetalLayer *layer = (CAMetalLayer *)self.layer;
    layer.contentsScale = self.window.backingScaleFactor;
}

- (void)keyDown:(NSEvent *)event {
    _keyboardEvent.key    = translateKeycode(event.keyCode);
    _keyboardEvent.action = [event isARepeat] ? cc::KeyboardEvent::Action::REPEAT
                                              : cc::KeyboardEvent::Action::PRESS;
    [self setModifierFlags:event];
    [_delegate dispatchEvent:_keyboardEvent];
}

- (void)keyUp:(NSEvent *)event {
    _keyboardEvent.key    = translateKeycode(event.keyCode);
    _keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
    [self setModifierFlags:event];
    [_delegate dispatchEvent:_keyboardEvent];
}

- (void)flagsChanged:(NSEvent *)event {
    int keyCode = translateKeycode(event.keyCode);
    updateModifierKeyState(keyCode);
    auto action = getModifierKeyAction(keyCode);
    
    // NOTE: in some cases, flagsChanged event may return some wrong keyCodes
    // For example:
    // - when you long press the capslock key, you may get the keyCode -1
    // - when you press ctrl + space, you may get the keyCode 65
    if (action == cc::KeyboardEvent::Action::UNKNOWN) {
        return;
    }
    _keyboardEvent.key = keyCode;
    _keyboardEvent.action = action;
    [self setModifierFlags:event];
    [_delegate dispatchEvent:_keyboardEvent];
}

- (void)setModifierFlags:(NSEvent *)event {
    NSEventModifierFlags modifierFlags = event.modifierFlags;
    if (modifierFlags & NSEventModifierFlagShift)
        _keyboardEvent.shiftKeyActive = true;
    else
        _keyboardEvent.shiftKeyActive = false;

    if (modifierFlags & NSEventModifierFlagControl)
        _keyboardEvent.ctrlKeyActive = true;
    else
        _keyboardEvent.ctrlKeyActive = false;

    if (modifierFlags & NSEventModifierFlagOption)
        _keyboardEvent.altKeyActive = true;
    else
        _keyboardEvent.altKeyActive = false;

    if (modifierFlags & NSEventModifierFlagCommand)
        _keyboardEvent.metaKeyActive = true;
    else
        _keyboardEvent.metaKeyActive = false;
}

- (void)mouseDown:(NSEvent *)event {
    [self sendMouseEvent:0
                    type:cc::MouseEvent::Type::DOWN
                   event:event];
}

- (void)mouseUp:(NSEvent *)event {
    [self sendMouseEvent:0
                    type:cc::MouseEvent::Type::UP
                   event:event];
}

- (void)mouseDragged:(NSEvent *)event {
    [self mouseMoved:event];
}

- (void)mouseMoved:(NSEvent *)event {
    [self sendMouseEvent:0
                    type:cc::MouseEvent::Type::MOVE
                   event:event];
}

- (void)otherMouseDown:(NSEvent *)event {
    [self sendMouseEvent:[self translateButtonNumber:event.buttonNumber]
                    type:cc::MouseEvent::Type::DOWN
                   event:event];
}

- (void)otherMouseUp:(NSEvent *)event {
    [self sendMouseEvent:[self translateButtonNumber:event.buttonNumber]
                    type:cc::MouseEvent::Type::UP
                   event:event];
}

- (int)translateButtonNumber:(int)buttonNumber {
    if (buttonNumber == 1) // left
        return 0;
    else if (buttonNumber == 2) // right
        return 2;
    else
        return 1;
}

- (void)scrollWheel:(NSEvent *)event {
    double deltaX = [event scrollingDeltaX];
    double deltaY = [event scrollingDeltaY];

    if ([event hasPreciseScrollingDeltas]) {
        deltaX *= 0.1;
        deltaY *= 0.1;
    }

    if (fabs(deltaX) > 0.0 || fabs(deltaY) > 0.0) {
        _mouseEvent.type   = cc::MouseEvent::Type::WHEEL;
        _mouseEvent.button = 0;
        _mouseEvent.x      = deltaX;
        _mouseEvent.y      = deltaY;
        [_delegate dispatchEvent:_mouseEvent];
    }
}

- (void)rightMouseDown:(NSEvent *)event {
    [self sendMouseEvent:2
                    type:cc::MouseEvent::Type::DOWN
                   event:event];
}

- (void)rightMouseUp:(NSEvent *)event {
    [self sendMouseEvent:2
                    type:cc::MouseEvent::Type::UP
                   event:event];
}

- (BOOL)acceptsFirstResponder {
    return YES;
}

- (void)sendMouseEvent:(int)button type:(cc::MouseEvent::Type)type event:(NSEvent *)event {
    const NSRect  contentRect = [self frame];
    const NSPoint pos         = [event locationInWindow];

    _mouseEvent.type   = type;
    _mouseEvent.button = button;
    _mouseEvent.x      = pos.x;
    _mouseEvent.y      = contentRect.size.height - pos.y;
    [_delegate dispatchEvent:_mouseEvent];
}

@end
