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
#include "bindings/event/EventDispatcher.h"

namespace {
void dispatchEvents(cc::TouchEvent &touchEvent, NSSet *touches) {
    for (UITouch *touch in touches) {
        touchEvent.touches.push_back({static_cast<float>([touch locationInView:[touch view]].x),
                                      static_cast<float>([touch locationInView:[touch view]].y),
                                      static_cast<int>((intptr_t)touch)});
    }
    cc::EventDispatcher::dispatchTouchEvent(touchEvent);
    touchEvent.touches.clear();
}
}

@implementation View {
    cc::TouchEvent _touchEvent;
}

@synthesize preventTouch;

+ (Class)layerClass {
    return [CAEAGLLayer class];
}

- (id)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame])
        self.preventTouch = false;

    return self;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    _touchEvent.type = cc::TouchEvent::Type::BEGAN;
    dispatchEvents(_touchEvent, touches);
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    _touchEvent.type = cc::TouchEvent::Type::MOVED;
    dispatchEvents(_touchEvent, touches);
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    _touchEvent.type = cc::TouchEvent::Type::ENDED;
    dispatchEvents(_touchEvent, touches);
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event {
    if (self.preventTouch)
        return;

    _touchEvent.type = cc::TouchEvent::Type::CANCELLED;
    dispatchEvents(_touchEvent, touches);
}

- (void)setPreventTouchEvent:(BOOL)flag {
    self.preventTouch = flag;
}

@end
