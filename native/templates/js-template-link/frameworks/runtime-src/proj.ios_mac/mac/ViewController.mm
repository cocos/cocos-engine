#import "ViewController.h"
#import <AppKit/NSTouch.h>
#import <AppKit/NSEvent.h>

#import "Game.h"
#import "KeyCodeHelper.h"
#import "scripting/js-bindings/event/EventDispatcher.h"

@implementation ViewController
{
    NSView* _view;
    cocos2d::MouseEvent _mouseEvent;
    cocos2d::KeyboardEvent _keyboardEvent;
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
    
    _keyboardEvent.key = translateKeycode(event.keyCode);
    _keyboardEvent.action = [event isARepeat] ? cocos2d::KeyboardEvent::Action::REPEAT
                                              : cocos2d::KeyboardEvent::Action::PRESS;
    [self setModifierFlags:event];
    cocos2d::EventDispatcher::dispatchKeyboardEvent(_keyboardEvent);
}

- (void)keyUp:(NSEvent *)event {
    _keyboardEvent.key = translateKeycode(event.keyCode);
    _keyboardEvent.action = cocos2d::KeyboardEvent::Action::RELEASE;
    [self setModifierFlags:event];
    cocos2d::EventDispatcher::dispatchKeyboardEvent(_keyboardEvent);
}

- (void)setModifierFlags:(NSEvent*)event {
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
                    type:cocos2d::MouseEvent::Type::DOWN
                   event:event];
}

- (void)mouseUp:(NSEvent *)event {
    [self sendMouseEvent:0
                    type:cocos2d::MouseEvent::Type::UP
                   event:event];
}

- (void)mouseDragged:(NSEvent *)event {
    [self mouseMoved:event];
}

- (void)mouseMoved:(NSEvent *)event {
    [self sendMouseEvent:0
                    type:cocos2d::MouseEvent::Type::MOVE
                   event:event];
}

- (void)otherMouseDown:(NSEvent *)event {
    [self sendMouseEvent:[self translateButtonNumber:event.buttonNumber]
                    type:cocos2d::MouseEvent::Type::DOWN
                   event:event];
}

- (void)otherMouseUp:(NSEvent *)event {
    [self sendMouseEvent:[self translateButtonNumber:event.buttonNumber]
                    type:cocos2d::MouseEvent::Type::UP
                   event:event];
}

- (int)translateButtonNumber:(int) buttonNumber {
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
        _mouseEvent.type = cocos2d::MouseEvent::Type::WHEEL;
        _mouseEvent.button = 0;
        _mouseEvent.x = deltaX;
        _mouseEvent.y = deltaY;
        cocos2d::EventDispatcher::dispatchMouseEvent(_mouseEvent);
    }
}

- (void)rightMouseDown:(NSEvent *)event {
    [self sendMouseEvent:2
                    type:cocos2d::MouseEvent::Type::DOWN
                   event:event];
}

- (void)rightMouseUp:(NSEvent *)event {
    [self sendMouseEvent:2
                    type:cocos2d::MouseEvent::Type::UP
                   event:event];
}

- (BOOL)acceptsFirstResponder {
    return YES;
}

- (void)sendMouseEvent:(int)button type:(cocos2d::MouseEvent::Type)type event:(NSEvent*)event {
    const NSRect contentRect = [self.view frame];
    const NSPoint pos = [event locationInWindow];
    
    _mouseEvent.type = type;
    _mouseEvent.button = button;
    _mouseEvent.x = pos.x;
    _mouseEvent.y = contentRect.size.height - pos.y;
    cocos2d::EventDispatcher::dispatchMouseEvent(_mouseEvent);
}

@end
