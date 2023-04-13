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

#include <UIKit/UIScreen.h>
#import "platform/ios/AppDelegateBridge.h"
#include "platform/ios/IOSPlatform.h"

namespace {
} // namespace

@implementation View {
    cc::IOSPlatform *_platform;
}

@synthesize preventTouch;

#ifdef CC_USE_METAL
+ (Class)layerClass {
    return [CAMetalLayer class];
}
#else
+ (Class)layerClass {
    return [CAEAGLLayer class];
}
#endif

- (void)dispatchTouchEvent:(cc::TouchEvent::Type)type withEvent:(NSSet *)touches {
    cc::TouchEvent touchEvent;
    touchEvent.windowId = 1;
    touchEvent.type = type;
    for (UITouch *touch in touches) {
        touchEvent.touches.push_back({static_cast<float>([touch locationInView:[touch view]].x),
                                      static_cast<float>([touch locationInView:[touch view]].y),
                                      static_cast<int>((intptr_t)touch)});
    }
    CC_ASSERT_NOT_NULL(_platform);
    cc::events::Touch::broadcast(touchEvent);
}

- (id)initWithFrame:(CGRect)frame {
    _platform = reinterpret_cast<cc::IOSPlatform *>(cc::BasePlatform::getPlatform());
#ifdef CC_USE_METAL
    if (self = [super initWithFrame:frame]) {
        self.preventTouch = FALSE;

        float pixelRatio = [[UIScreen mainScreen] nativeScale];
        CGSize size = CGSizeMake(static_cast<int>(frame.size.width * pixelRatio),
                                 static_cast<int>(frame.size.height * pixelRatio));
        self.contentScaleFactor = pixelRatio;
        // Config metal layer
        CAMetalLayer *layer = (CAMetalLayer *)self.layer;
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.device = self.device = MTLCreateSystemDefaultDevice();
        layer.drawableSize = size;
    }
#else
    if (self = [super initWithFrame:frame]) {
        self.preventTouch = FALSE;
    }
#endif

    return self;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    [self dispatchTouchEvent:cc::TouchEvent::Type::BEGAN withEvent:touches];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    [self dispatchTouchEvent:cc::TouchEvent::Type::MOVED withEvent:touches];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    [self dispatchTouchEvent:cc::TouchEvent::Type::ENDED withEvent:touches];
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    [self dispatchTouchEvent:cc::TouchEvent::Type::CANCELLED withEvent:touches];
}

- (void)setPreventTouchEvent:(BOOL)flag {
    self.preventTouch = flag;
}

@end
