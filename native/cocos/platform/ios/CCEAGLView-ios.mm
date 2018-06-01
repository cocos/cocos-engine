/*

===== IMPORTANT =====

This is sample code demonstrating API, technology or techniques in development.
Although this sample code has been reviewed for technical accuracy, it is not
final. Apple is supplying this information to help you plan for the adoption of
the technologies and programming interfaces described herein. This information
is subject to change, and software implemented based on this sample code should
be tested with final operating system software and final documentation. Newer
versions of this sample code may be provided with future seeds of the API or
technology. For information about updates to this and other developer
documentation, view the New & Updated sidebars in subsequent documentation
seeds.

=====================

File: EAGLView.m
Abstract: Convenience class that wraps the CAEAGLLayer from CoreAnimation into a
UIView subclass.

Version: 1.3

Disclaimer: IMPORTANT:  This Apple software is supplied to you by Apple Inc.
("Apple") in consideration of your agreement to the following terms, and your
use, installation, modification or redistribution of this Apple software
constitutes acceptance of these terms.  If you do not agree with these terms,
please do not use, install, modify or redistribute this Apple software.

In consideration of your agreement to abide by the following terms, and subject
to these terms, Apple grants you a personal, non-exclusive license, under
Apple's copyrights in this original Apple software (the "Apple Software"), to
use, reproduce, modify and redistribute the Apple Software, with or without
modifications, in source and/or binary forms; provided that if you redistribute
the Apple Software in its entirety and without modifications, you must retain
this notice and the following text and disclaimers in all such redistributions
of the Apple Software.
Neither the name, trademarks, service marks or logos of Apple Inc. may be used
to endorse or promote products derived from the Apple Software without specific
prior written permission from Apple.  Except as expressly stated in this notice,
no other rights or licenses, express or implied, are granted by Apple herein,
including but not limited to any patent rights that may be infringed by your
derivative works or by other works in which the Apple Software may be
incorporated.

The Apple Software is provided by Apple on an "AS IS" basis.  APPLE MAKES NO
WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE IMPLIED
WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND OPERATION ALONE OR IN
COMBINATION WITH YOUR PRODUCTS.

IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION, MODIFICATION AND/OR
DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED AND WHETHER UNDER THEORY OF
CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, EVEN IF
APPLE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Copyright (C) 2008 Apple Inc. All Rights Reserved.

*/

#import "platform/ios/CCEAGLView-ios.h"
#import <QuartzCore/QuartzCore.h>

#include "scripting/js-bindings/event/EventDispatcher.h"
#include "platform/ios/OpenGL_Internal-ios.h"
#include "platform/CCApplication.h"
#include "base/ccMacros.h"
#include "ui/edit-box/EditBox.h"

namespace
{
    GLenum pixelformat2glenum(NSString* str)
    {
        if ([str isEqualToString:kEAGLColorFormatRGB565])
            return GL_RGB565;
        else
            return GL_RGBA8_OES;
    }
}

//CLASS IMPLEMENTATIONS:

#define MAX_TOUCH_COUNT     10

@interface CCEAGLView (Private)
@end

@implementation CCEAGLView

+ (Class) layerClass
{
    return [CAEAGLLayer class];
}

+ (id) viewWithFrame:(CGRect)frame pixelFormat:(NSString*)format depthFormat:(GLuint)depth preserveBackbuffer:(BOOL)retained sharegroup:(EAGLSharegroup*)sharegroup multiSampling:(BOOL)multisampling numberOfSamples:(unsigned int)samples
{
    return [[[self alloc]initWithFrame:frame pixelFormat:format depthFormat:depth preserveBackbuffer:retained sharegroup:sharegroup multiSampling:multisampling numberOfSamples:samples] autorelease];
}

- (id) initWithFrame:(CGRect)frame pixelFormat:(NSString*)format depthFormat:(GLuint)depth preserveBackbuffer:(BOOL)retained sharegroup:(EAGLSharegroup*)sharegroup multiSampling:(BOOL)sampling numberOfSamples:(unsigned int)nSamples;
{
    if((self = [super initWithFrame:frame]))
    {
        _pixelformatString = format;
        _pixelformat = pixelformat2glenum(_pixelformatString);
        _depthFormat = depth;
        // Multisampling doc: https://developer.apple.com/library/content/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/WorkingwithEAGLContexts/WorkingwithEAGLContexts.html#//apple_ref/doc/uid/TP40008793-CH103-SW4
        _multisampling = sampling;
        _requestedSamples = nSamples;
        _preserveBackbuffer = retained;
        _sharegroup = sharegroup;
        _isReady = FALSE;
        _needToPreventTouch = FALSE;
        
#if GL_EXT_discard_framebuffer == 1
        _discardFramebufferSupported = YES;
#else
        _discardFramebufferSupported = NO;
#endif
        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
            self.contentScaleFactor = [[UIScreen mainScreen] scale];
        
        _touchIds = 0;
        for (int i = 0; i < 10; ++i)
            _touches[i] = nil;
        
        [self setupGLContext];
    }

    return self;
}

- (void) dealloc
{
    if (_defaultColorBuffer)
    {
        glDeleteRenderbuffers(1, &_defaultColorBuffer);
        _defaultColorBuffer = 0;
    }
    
    if (_defaultDepthBuffer)
    {
        glDeleteRenderbuffers(1, &_defaultDepthBuffer);
        _defaultDepthBuffer = 0;
    }
    
    if (_defaultFramebuffer)
    {
        glDeleteFramebuffers(1, &_defaultFramebuffer);
        _defaultFramebuffer = 0;
    }
    
    if (_msaaColorBuffer)
    {
        glDeleteRenderbuffers(1, &_msaaColorBuffer);
        _msaaColorBuffer = 0;
    }
    
    if (_msaaDepthBuffer)
    {
        glDeleteRenderbuffers(1, &_msaaDepthBuffer);
        _msaaDepthBuffer = 0;
    }
    
    if (_msaaFramebuffer)
    {
        glDeleteFramebuffers(1, &_msaaFramebuffer);
        _msaaFramebuffer = 0;
    }

    if ([EAGLContext currentContext] == _context)
        [EAGLContext setCurrentContext:nil];
    
    if (_context)
    {
        [_context release];
        _context = nil;
    }
    
    [super dealloc];
}

- (void) layoutSubviews
{
    glBindFramebuffer(GL_FRAMEBUFFER, _defaultFramebuffer);
    if (_defaultColorBuffer)
    {
        glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
        if(! [_context renderbufferStorage:GL_RENDERBUFFER fromDrawable:(CAEAGLLayer *)self.layer])
        {
            NSLog(@"failed to call context");
            return;
        }
    }
    
    int backingWidth = 0;
    int backingHeight = 0;
    glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_WIDTH, &backingWidth);
    glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_HEIGHT, &backingHeight);
    
    if (_defaultDepthBuffer)
    {
        glBindRenderbuffer(GL_RENDERBUFFER, _defaultDepthBuffer);
        glRenderbufferStorage(GL_RENDERBUFFER, _depthFormat, backingWidth, backingHeight);
    }
    
    if (_multisampling)
    {
        glBindFramebuffer(GL_FRAMEBUFFER, _msaaFramebuffer);
        if (_msaaColorBuffer)
        {
            glBindRenderbuffer(GL_RENDERBUFFER, _msaaColorBuffer);
            glRenderbufferStorageMultisampleAPPLE(GL_RENDERBUFFER, _requestedSamples, _pixelformat, backingWidth, backingHeight);
        }
        
        if (_msaaDepthBuffer)
        {
            glBindRenderbuffer(GL_RENDERBUFFER, _msaaDepthBuffer);
            glRenderbufferStorageMultisampleAPPLE(GL_RENDERBUFFER, _requestedSamples, _depthFormat, backingWidth, backingHeight);
        }
    }
    else
    {
        glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    }

    CHECK_GL_ERROR();
    
    GLenum error;
    if( (error=glCheckFramebufferStatus(GL_FRAMEBUFFER)) != GL_FRAMEBUFFER_COMPLETE)
        NSLog(@"Failed to make complete framebuffer object 0x%X", error);
    
    _isReady = TRUE;
}

- (BOOL) isReady
{
    return _isReady;
}

-(void) setPreventTouchEvent:(BOOL) flag
{
    _needToPreventTouch = flag;
}

- (void) setupGLContext
{
    CAEAGLLayer *eaglLayer = (CAEAGLLayer *)self.layer;
    
    eaglLayer.opaque = YES;
    eaglLayer.drawableProperties = [NSDictionary dictionaryWithObjectsAndKeys:
                                    [NSNumber numberWithBool:_preserveBackbuffer], kEAGLDrawablePropertyRetainedBacking,
                                    _pixelformatString, kEAGLDrawablePropertyColorFormat, nil];
    
    if(! _sharegroup)
        _context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];
    else
        _context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2 sharegroup:_sharegroup];
    
    if (!_context || ![EAGLContext setCurrentContext:_context] )
    {
        NSLog(@"Can not crate GL context.");
        return;
    }
    
    if (![self createFrameBuffer])
        return;
    if (![self createAndAttachColorBuffer])
        return;
    
    [self createAndAttachDepthBuffer];
}

- (BOOL) createFrameBuffer
{
    if (!_context)
        return FALSE;
    
    glGenFramebuffers(1, &_defaultFramebuffer);
    if (0 == _defaultFramebuffer)
    {
        NSLog(@"Can not create default frame buffer.");
        return FALSE;
    }
    
    if (_multisampling)
    {
        glGenFramebuffers(1, &_msaaFramebuffer);
        if (0 == _msaaFramebuffer)
        {
            NSLog(@"Can not create multi sampling frame buffer");
            _multisampling = FALSE;
        }
    }
    
    return TRUE;
}

- (BOOL) createAndAttachColorBuffer
{
    if (0 == _defaultFramebuffer)
        return FALSE;

    glBindFramebuffer(GL_FRAMEBUFFER, _defaultFramebuffer);
    glGenRenderbuffers(1, &_defaultColorBuffer);
    if (0 == _defaultColorBuffer)
    {
        NSLog(@"Can not create default color buffer.");
        return FALSE;
    }
    
    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _defaultColorBuffer);
    CHECK_GL_ERROR();
    
    if (!_multisampling || (0 == _msaaFramebuffer))
        return TRUE;
    
    glBindFramebuffer(GL_FRAMEBUFFER, _msaaFramebuffer);
    glGenRenderbuffers(1, &_msaaColorBuffer);
    if (0 == _msaaColorBuffer)
    {
        NSLog(@"Can not create multi sampling color buffer.");
    
        // App can work without multi sampleing.
        return TRUE;
    }
    glBindRenderbuffer(GL_RENDERBUFFER, _msaaColorBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _msaaColorBuffer);
    CHECK_GL_ERROR();
    return TRUE;
}

- (BOOL) createAndAttachDepthBuffer
{
    if (0 == _defaultFramebuffer || 0 == _depthFormat)
        return FALSE;
    
    glBindFramebuffer(GL_FRAMEBUFFER, _defaultFramebuffer);
    glGenRenderbuffers(1, &_defaultDepthBuffer);
    if (0 == _defaultDepthBuffer)
    {
        NSLog(@"Can not create default depth buffer.");
        return FALSE;
    }

    glBindRenderbuffer(GL_RENDERBUFFER, _defaultDepthBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthBuffer);
    CHECK_GL_ERROR();
    
    if (GL_DEPTH24_STENCIL8_OES == _depthFormat ||
        GL_DEPTH_STENCIL_OES == _depthFormat)
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthBuffer);
    
    CHECK_GL_ERROR();
    
    if (!_multisampling || (0 == _msaaFramebuffer))
        return TRUE;
    
    glBindFramebuffer(GL_FRAMEBUFFER, _msaaFramebuffer);
    glGenRenderbuffers(1, &_msaaDepthBuffer);
    if (0 == _msaaDepthBuffer)
    {
        NSLog(@"Can not create multi sampling depth buffer.");
        return TRUE;
    }
    glBindRenderbuffer(GL_RENDERBUFFER, _msaaDepthBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _msaaDepthBuffer);
    CHECK_GL_ERROR();
    
    if (GL_DEPTH24_STENCIL8_OES == _depthFormat ||
        GL_DEPTH_STENCIL_OES == _depthFormat)
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _msaaDepthBuffer);
    
    CHECK_GL_ERROR();

    return TRUE;
}

- (void) swapBuffers
{
    // IMPORTANT:
    // - preconditions
    //    -> context_ MUST be the OpenGL context
    //    -> renderbuffer_ must be the RENDER BUFFER

    if (_multisampling)
    {
        /* Resolve from msaaFramebuffer to resolveFramebuffer */
        //glDisable(GL_SCISSOR_TEST);
        glBindFramebuffer(GL_READ_FRAMEBUFFER_APPLE, _msaaFramebuffer);
        glBindFramebuffer(GL_DRAW_FRAMEBUFFER_APPLE, _defaultFramebuffer);
        glResolveMultisampleFramebufferAPPLE();
    }
    
    CHECK_GL_ERROR();
    
    if (_discardFramebufferSupported)
    {    
        if (_multisampling)
        {
            if (_depthFormat)
            {
                GLenum attachments[] = {GL_COLOR_ATTACHMENT0, GL_DEPTH_ATTACHMENT};
                glDiscardFramebufferEXT(GL_READ_FRAMEBUFFER_APPLE, 2, attachments);
            }
            else
            {
                GLenum attachments[] = {GL_COLOR_ATTACHMENT0};
                glDiscardFramebufferEXT(GL_READ_FRAMEBUFFER_APPLE, 1, attachments);
            }
            

        }
        else if (_depthFormat)
        {
            // not MSAA
            GLenum attachments[] = { GL_DEPTH_ATTACHMENT};
            glDiscardFramebufferEXT(GL_FRAMEBUFFER, 1, attachments);
        }
        
        CHECK_GL_ERROR();
    }

    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);

    if(![_context presentRenderbuffer:GL_RENDERBUFFER])
         NSLog(@"cocos2d: Failed to swap renderbuffer in %s\n", __FUNCTION__);

#if COCOS2D_DEBUG
    CHECK_GL_ERROR();
#endif
    
    // We can safely re-bind the framebuffer here, since this will be the
    // 1st instruction of the new main loop
    if(_multisampling)
        glBindFramebuffer(GL_FRAMEBUFFER, _msaaFramebuffer);
}

// Pass the touches to the superview
#pragma mark CCEAGLView - Touch Delegate

namespace
{
    int getUnusedID(unsigned int& touchIDs)
    {
        int i;
        unsigned int temp = touchIDs;
        
        for (i = 0; i < 10; i++) {
            if (! (temp & 0x00000001))
            {
                touchIDs |= (1 <<  i);
                return i;
            }
            
            temp >>= 1;
        }
        
        // all bits are used
        return -1;
    }
    
    void resetTouchID(unsigned int& touchIDs, int index)
    {
        touchIDs &= ((1 << index) ^ 0xffffffff);
    }
    
    cocos2d::TouchInfo createTouchInfo(int index, UITouch* touch, float contentScaleFactor)
    {
        uint8_t deviceRatio = cocos2d::Application::getInstance()->getDevicePixelRatio();
        cocos2d::TouchInfo touchInfo;
        touchInfo.index = index;
        touchInfo.x = [touch locationInView: [touch view]].x * contentScaleFactor / deviceRatio;
        touchInfo.y = [touch locationInView: [touch view]].y * contentScaleFactor / deviceRatio;
        
        return touchInfo;
    }
    
    void deliverTouch(cocos2d::TouchEvent& touchEvent,
                      NSSet* touches,
                      UITouch** internalTouches,
                      float contentScaleFactor,
                      bool reset,
                      unsigned int& touchIds)
    {
        for (UITouch *touch in touches)
        {
            for (int i = 0; i < MAX_TOUCH_COUNT; ++i)
            {
                if (touch == internalTouches[i])
                {
                    if (reset)
                    {
                        internalTouches[i] = nil;
                        resetTouchID(touchIds, i);
                    }
                    touchEvent.touches.push_back(createTouchInfo(i, touch, contentScaleFactor));
                }
            }
        }
        
        if (!touchEvent.touches.empty())
            cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    // When editbox is editing, should prevent glview to handle touch events.
    if (_needToPreventTouch)
    {
        cocos2d::EditBox::complete();
        return;
    }
    
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::BEGAN;
    for (UITouch *touch in touches) {
        int index = getUnusedID(_touchIds);
        if (-1 == index)
            return;
        
        _touches[index] = touch;

        touchEvent.touches.push_back(createTouchInfo(index, touch, self.contentScaleFactor));
    }
    
    if (!touchEvent.touches.empty())
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::MOVED;
    deliverTouch(touchEvent, touches, _touches, self.contentScaleFactor, false, _touchIds);
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::ENDED;
    deliverTouch(touchEvent, touches, _touches, self.contentScaleFactor, true, _touchIds);
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::CANCELLED;
    deliverTouch(touchEvent, touches, _touches, self.contentScaleFactor, true, _touchIds);
}

@end
