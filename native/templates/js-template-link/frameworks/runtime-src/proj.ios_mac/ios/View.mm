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

#include "scripting/js-bindings/event/EventDispatcher.h"

namespace
{
    void dispatchEvents(cocos2d::TouchEvent& touchEvent, NSSet* touches, float scaleFactor)
    {
        for (UITouch* touch in touches) {
            touchEvent.touches.push_back({
                static_cast<float>([touch locationInView: [touch view]].x / scaleFactor),
                static_cast<float>([touch locationInView: [touch view]].y / scaleFactor),
                static_cast<int>((intptr_t)touch)
            });
        }
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }
}

@implementation View

@synthesize preventTouch;

+ (Class) layerClass {
    return [CAEAGLLayer class];
}

-(id) initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame])
        self.preventTouch = false;
    
    return self;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event  {
    if (self.preventTouch)
        return;
    
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::BEGAN;
    
    dispatchEvents(touchEvent, touches, self.contentScaleFactor);
}


- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::MOVED;
    
    dispatchEvents(touchEvent, touches, self.contentScaleFactor);
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::ENDED;
    
    dispatchEvents(touchEvent, touches, self.contentScaleFactor);
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event {
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::CANCELLED;
    
    dispatchEvents(touchEvent, touches, self.contentScaleFactor);
}

-(void) setPreventTouchEvent:(BOOL) flag {
    self.preventTouch = flag;
}

@end
