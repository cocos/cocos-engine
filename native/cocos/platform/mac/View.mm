/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
#import "View.h"
#import "KeyCodeHelper.h"
#import "cocos/bindings/event/EventDispatcher.h"
#include "platform/Application.h"
#import <AppKit/NSEvent.h>
#import <AppKit/NSTouch.h>

@implementation View {
    cc::MouseEvent _mouseEvent;
    cc::KeyboardEvent _keyboardEvent;
}

- (instancetype)initWithFrame:(NSRect)frameRect {
    if (self = [super initWithFrame:frameRect]) {
        [self.window makeFirstResponder:self];
#ifdef CC_USE_METAL
        self.device = MTLCreateSystemDefaultDevice();
        self.framebufferOnly = YES;
        self.delegate = self;
#endif
    }
    return self;
}

#ifdef CC_USE_METAL
- (void)drawInMTKView:(MTKView *)view {
    cc::Application::getInstance()->tick();
}

- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
    CC_LOG_WARNING("CCView::mtkView: drawable size will change: %f x %f", size.width, size.height);
}
#endif

- (void)keyDown:(NSEvent *)event {
    _keyboardEvent.key = translateKeycode(event.keyCode);
    _keyboardEvent.action = [event isARepeat] ? cc::KeyboardEvent::Action::REPEAT
                                              : cc::KeyboardEvent::Action::PRESS;
    [self setModifierFlags:event];
    cc::EventDispatcher::dispatchKeyboardEvent(_keyboardEvent);
}

- (void)keyUp:(NSEvent *)event {
    _keyboardEvent.key = translateKeycode(event.keyCode);
    _keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
    [self setModifierFlags:event];
    cc::EventDispatcher::dispatchKeyboardEvent(_keyboardEvent);
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
        _mouseEvent.type = cc::MouseEvent::Type::WHEEL;
        _mouseEvent.button = 0;
        _mouseEvent.x = deltaX;
        _mouseEvent.y = deltaY;
        cc::EventDispatcher::dispatchMouseEvent(_mouseEvent);
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
    const NSRect contentRect = [self frame];
    const NSPoint pos = [event locationInWindow];

    _mouseEvent.type = type;
    _mouseEvent.button = button;
    _mouseEvent.x = pos.x;
    _mouseEvent.y = contentRect.size.height - pos.y;
    cc::EventDispatcher::dispatchMouseEvent(_mouseEvent);
}

@end
