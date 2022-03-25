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
#import "AppDelegate.h"

#include <UIKit/UIScreen.h>
#import "platform/ios/AppDelegateBridge.h"

namespace {
} // namespace

@implementation View {
    AppDelegate*      _delegate;
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

- (id)initWithFrame:(CGRect)frame {
    _delegate = [[UIApplication sharedApplication] delegate];
#ifdef CC_USE_METAL
    if (self = [super initWithFrame:frame]) {
        self.preventTouch = FALSE;

        float  pixelRatio       = [[UIScreen mainScreen] nativeScale];
        CGSize size             = CGSizeMake(static_cast<int>(frame.size.width * pixelRatio),
                                             static_cast<int>(frame.size.height * pixelRatio));
        self.contentScaleFactor = pixelRatio;
        // Config metal layer
        CAMetalLayer *layer = (CAMetalLayer *)self.layer;
        layer.pixelFormat   = MTLPixelFormatBGRA8Unorm;
        layer.device = self.device = MTLCreateSystemDefaultDevice();
        layer.drawableSize         = size;
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
    [_delegate.appDelegateBridge dispatchTouchEvent:
        cc::TouchEvent::Type::BEGAN touches:touches withEvent:event];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;
    [_delegate.appDelegateBridge dispatchTouchEvent:
        cc::TouchEvent::Type::MOVED touches:touches withEvent:event];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;
    [_delegate.appDelegateBridge dispatchTouchEvent:
        cc::TouchEvent::Type::ENDED touches:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;
    [_delegate.appDelegateBridge dispatchTouchEvent:
        cc::TouchEvent::Type::CANCELLED touches:touches withEvent:event];
}

- (void)setPreventTouchEvent:(BOOL)flag {
    self.preventTouch = flag;
}

@end
