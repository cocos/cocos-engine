/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#import "application/ApplicationManager.h"
#import "cocos/bindings/event/EventDispatcher.h"
#import "platform/mac/AppDelegate.h"
#import "platform/mac/modules/SystemWindow.h"
#import "platform/mac/modules/SystemWindowManager.h"

#include "SDL2/SDL.h"

static int MetalViewEventWatch(void* userData, SDL_Event*event) {
    if (event->type == SDL_WINDOWEVENT && event->window.event == SDL_WINDOWEVENT_SIZE_CHANGED) {
        @autoreleasepool {
            auto *view = (__bridge View *)userData;
            if ([view getWindowId] == event->window.windowID) {
                [view viewDidChangeBackingProperties];
            }
        }
    }
    return 0;
}

@implementation View {
    cc::MouseEvent _mouseEvent;
    cc::KeyboardEvent _keyboardEvent;
}

- (CALayer *)makeBackingLayer {
    CAMetalLayer *layer = [CAMetalLayer layer];
    layer.delegate = self;
    layer.autoresizingMask = true;
    layer.needsDisplayOnBoundsChange = true;
    return layer;
}

- (instancetype)initWithFrame:(NSRect)frameRect {
    if (self = [super initWithFrame:frameRect]) {
        // View is used as a subview, so the resize message needs to be handled manually.
        SDL_AddEventWatch(MetalViewEventWatch, (__bridge void*)(self));
        [self.window makeFirstResponder:self];
        int pixelRatio = [[NSScreen mainScreen] backingScaleFactor];
        CGSize size = CGSizeMake(frameRect.size.width * pixelRatio, frameRect.size.height * pixelRatio);
        // Create CAMetalLayer
        self.wantsLayer = YES;
        // Config metal layer
        CAMetalLayer *layer = (CAMetalLayer *)self.layer;
        layer.drawableSize = size;
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.device = self.device = [MTLCreateSystemDefaultDevice() autorelease];
        layer.autoresizingMask = kCALayerWidthSizable | kCALayerHeightSizable;
        self.layerContentsRedrawPolicy = NSViewLayerContentsRedrawDuringViewResize;
        self.layerContentsPlacement = NSViewLayerContentsPlacementScaleProportionallyToFill;

        // Add tracking area to receive mouse move events.
        NSRect rect = {0, 0, size.width, size.height};
        NSTrackingArea *trackingArea = [[[NSTrackingArea alloc] initWithRect:rect
                                                                     options:(NSTrackingMouseEnteredAndExited | NSTrackingMouseMoved | NSTrackingActiveInKeyWindow | NSTrackingInVisibleRect)
                                                                       owner:self
                                                                    userInfo:nil] autorelease];
        [self addTrackingArea:trackingArea];
    }
    return self;
}

- (void)drawInMTKView:(MTKView *)view {
    //cc::Application::getInstance()->tick();
}

- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
    cc::WindowEvent ev;
    ev.windowId = [self getWindowId];
    ev.type = cc::WindowEvent::Type::RESIZED;
    ev.width = static_cast<int>(size.width);
    ev.height = static_cast<int>(size.height);
    cc::events::WindowEvent::broadcast(ev);
}

- (void)displayLayer:(CALayer *)layer {
    //cc::Application::getInstance()->tick();
}

- (void)setFrameSize:(NSSize)newSize {
    CAMetalLayer *layer = (CAMetalLayer *)self.layer;

    CGSize nativeSize = [self convertSizeToBacking:newSize];
    [super setFrameSize:newSize];
    layer.drawableSize = nativeSize;
}

- (void)viewDidChangeBackingProperties {
    [super viewDidChangeBackingProperties];
    CAMetalLayer *layer = (CAMetalLayer *)self.layer;
    layer.contentsScale = self.window.backingScaleFactor;
    auto size = [[self.window contentView] frame].size;
    auto width = size.width * self.window.backingScaleFactor;
    auto height = size.height * self.window.backingScaleFactor;

    if (width > 0 && height > 0) {
        [super setFrameSize:size];
        layer.drawableSize = CGSizeMake(width, height);
    }
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
    _keyboardEvent.windowId = [self getWindowId];
    _keyboardEvent.key = keyCode;
    _keyboardEvent.action = action;
    [self setModifierFlags:event];
    cc::events::Keyboard::broadcast(_keyboardEvent);
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

- (BOOL)acceptsFirstResponder {
    return YES;
}

- (int)getWindowId {
    auto *windowMgr = CC_GET_PLATFORM_INTERFACE(cc::SystemWindowManager);
    auto *window = windowMgr->getWindowFromNSWindow([self window]);
    return window->getWindowId();
}
@end
