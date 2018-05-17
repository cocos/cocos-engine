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

#define IOS_MAX__touchesCOUNT     10

@interface CCEAGLView (Private)
@end

@implementation CCEAGLView

@synthesize isKeyboardShown=_isKeyboardShown;
@synthesize keyboardShowNotification = _keyboardShowNotification;
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
        _isUseUITextField = YES;
        _pixelformatString = format;
        _pixelformat = pixelformat2glenum(_pixelformatString);
        _depthFormat = depth;
        // Multisampling doc: https://developer.apple.com/library/content/documentation/3DDrawing/Conceptual/OpenGLES_ProgrammingGuide/WorkingwithEAGLContexts/WorkingwithEAGLContexts.html#//apple_ref/doc/uid/TP40008793-CH103-SW4
        _multisampling = sampling;
        _requestedSamples = nSamples;
        _preserveBackbuffer = retained;
        _markedText = nil;
        _sharegroup = sharegroup;
        _isReady = FALSE;
        
#if GL_EXT_discard_framebuffer == 1
        _discardFramebufferSupported = YES;
#else
        _discardFramebufferSupported = NO;
#endif
        
        _originalRect = self.frame;
        self.keyboardShowNotification = nil;

        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
            self.contentScaleFactor = [[UIScreen mainScreen] scale];
        
        _touchesIds = 0;
        for (int i = 0; i < 10; ++i)
            _touches[i] = nil;
        
        [self setupGLContext];
    }

    return self;
}

- (void)didMoveToWindow;
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onUIKeyboardNotification:)
                                                 name:UIKeyboardWillShowNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onUIKeyboardNotification:)
                                                 name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onUIKeyboardNotification:)
                                                 name:UIKeyboardWillHideNotification object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onUIKeyboardNotification:)
                                                 name:UIKeyboardDidHideNotification object:nil];
}

- (void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self]; // remove keyboard notification
    self.keyboardShowNotification = nullptr; // implicit release
    
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

#pragma mark CCEAGLView - Point conversion

-(void)handleTouchesAfterKeyboardShow
{
    NSArray *subviews = self.subviews;

    for(UIView* view in subviews)
    {
        if([view isKindOfClass:NSClassFromString(@"UITextView")] ||
           [view isKindOfClass:NSClassFromString(@"UITextField")])
        {
            if ([view isFirstResponder])
            {
                [view resignFirstResponder];
                return;
            }
        }
    }
}

// Pass the touches to the superview
#pragma mark CCEAGLView - Touch Delegate

namespace
{
    int getUnusedID(unsigned int& touchesIDs)
    {
        int i;
        unsigned int temp = touchesIDs;
        
        for (i = 0; i < 10; i++) {
            if (! (temp & 0x00000001))
            {
                touchesIDs |= (1 <<  i);
                return i;
            }
            
            temp >>= 1;
        }
        
        // all bits are used
        return -1;
    }
    
    void resetTouchID(unsigned int& touchesIDs, int index)
    {
        touchesIDs &= ((1 << index) ^ 0xffffffff);
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
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    if (_isKeyboardShown)
    {
        [self handleTouchesAfterKeyboardShow];
        return;
    }

    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::BEGAN;
    for (UITouch *touch in touches) {
        int index = getUnusedID(_touchesIds);
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
    for (UITouch *touch in touches)
    {
        for (int i = 0; i < 10; ++i)
        {
            if (touch == _touches[i])
                touchEvent.touches.push_back(createTouchInfo(i, touch, self.contentScaleFactor));
        }
    }
    
    if (!touchEvent.touches.empty())
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::ENDED;
    for (UITouch *touch in touches)
    {
        for (int i = 0; i < 10; ++i)
        {
            if (touch == _touches[i])
            {
                _touches[i] = nil;
                resetTouchID(_touchesIds, i);
                
                touchEvent.touches.push_back(createTouchInfo(i, touch, self.contentScaleFactor));
            }
        }
    }

    if (!touchEvent.touches.empty())
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
}

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    cocos2d::TouchEvent touchEvent;
    touchEvent.type = cocos2d::TouchEvent::Type::CANCELLED;
    for (UITouch *touch in touches)
    {
        for (int i = 0; i < 10; ++i)
        {
            if (touch == _touches[i])
            {
                _touches[i] = nil;
                resetTouchID(_touchesIds, i);
                
                touchEvent.touches.push_back(createTouchInfo(i, touch, self.contentScaleFactor));
            }
        }
    }
    
    if (!touchEvent.touches.empty())
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
}

#pragma mark - UIView - Responder

- (BOOL)canBecomeFirstResponder
{
    if (nil != _markedText)
        [_markedText release];

    _markedText = nil;
    if (_isUseUITextField)
    {
        return NO;
    }
    return YES;
}

- (BOOL)becomeFirstResponder
{
    _isUseUITextField = NO;
    return [super becomeFirstResponder];
}

- (BOOL)resignFirstResponder
{
    _isUseUITextField = YES;
    return [super resignFirstResponder];
}

#pragma mark - UIKeyInput protocol


- (BOOL)hasText
{
    return NO;
}

- (void)insertText:(NSString *)text
{
    if (nil != _markedText) 
    {
        [_markedText release];
        _markedText = nil;
    }
    const char * pszText = [text cStringUsingEncoding:NSUTF8StringEncoding];
//    cocos2d::IMEDispatcher::sharedDispatcher()->dispatchInsertText(pszText, strlen(pszText));
}

- (void)deleteBackward
{
    if (nil != _markedText) 
    {
        [_markedText release];
        _markedText = nil;
    }
//    cocos2d::IMEDispatcher::sharedDispatcher()->dispatchDeleteBackward();
}

#pragma mark - UITextInputTrait protocol

-(UITextAutocapitalizationType) autocapitalizationType
{
    return UITextAutocapitalizationTypeNone;
}

#pragma mark - UITextInput protocol

#pragma mark UITextInput - properties

@synthesize beginningOfDocument;
@synthesize endOfDocument;
@synthesize inputDelegate;
@synthesize markedTextRange;
@synthesize markedTextStyle;
// @synthesize selectedTextRange;       // must implement
@synthesize tokenizer;

/* Text may have a selection, either zero-length (a caret) or ranged.  Editing operations are
 * always performed on the text from this selection.  nil corresponds to no selection. */
- (void)setSelectedTextRange:(UITextRange *)aSelectedTextRange;
{
    CCLOG("UITextRange:setSelectedTextRange");
}
- (UITextRange *)selectedTextRange;
{
    return [[[UITextRange alloc] init] autorelease];
}

#pragma mark UITextInput - Replacing and Returning Text

- (NSString *)textInRange:(UITextRange *)range;
{
    CCLOG("textInRange");
    return @"";
}
- (void)replaceRange:(UITextRange *)range withText:(NSString *)theText;
{
    CCLOG("replaceRange");
}

#pragma mark UITextInput - Working with Marked and Selected Text



/* If text can be selected, it can be marked. Marked text represents provisionally
 * inserted text that has yet to be confirmed by the user.  It requires unique visual
 * treatment in its display.  If there is any marked text, the selection, whether a
 * caret or an extended range, always resides within.
 *
 * Setting marked text either replaces the existing marked text or, if none is present,
 * inserts it from the current selection. */

- (void)setMarkedTextRange:(UITextRange *)markedTextRange;
{
    CCLOG("setMarkedTextRange");
}

- (UITextRange *)markedTextRange;
{
    CCLOG("markedTextRange");
    return nil; // Nil if no marked text.
}
- (void)setMarkedTextStyle:(NSDictionary *)markedTextStyle;
{
    CCLOG("setMarkedTextStyle");

}
- (NSDictionary *)markedTextStyle;
{
    CCLOG("markedTextStyle");
    return nil;
}
- (void)setMarkedText:(NSString *)markedText selectedRange:(NSRange)selectedRange;
{
    CCLOG("setMarkedText");
    if (markedText == _markedText) {
        return;
    }
    if (nil != _markedText) {
        [_markedText release];
    }
    _markedText = markedText;
    [_markedText retain];
}
- (void)unmarkText;
{
    CCLOG("unmarkText");
    if (nil == _markedText)
    {
        return;
    }
    const char * pszText = [_markedText cStringUsingEncoding:NSUTF8StringEncoding];
//    cocos2d::IMEDispatcher::sharedDispatcher()->dispatchInsertText(pszText, strlen(pszText));
    [_markedText release];
    _markedText = nil;
}

#pragma mark Methods for creating ranges and positions.

- (UITextRange *)textRangeFromPosition:(UITextPosition *)fromPosition toPosition:(UITextPosition *)toPosition;
{
    CCLOG("textRangeFromPosition");
    return nil;
}
- (UITextPosition *)positionFromPosition:(UITextPosition *)position offset:(NSInteger)offset;
{
    CCLOG("positionFromPosition");
    return nil;
}
- (UITextPosition *)positionFromPosition:(UITextPosition *)position inDirection:(UITextLayoutDirection)direction offset:(NSInteger)offset;
{
    CCLOG("positionFromPosition");
    return nil;
}

/* Simple evaluation of positions */
- (NSComparisonResult)comparePosition:(UITextPosition *)position toPosition:(UITextPosition *)other;
{
    CCLOG("comparePosition");
    return (NSComparisonResult)0;
}
- (NSInteger)offsetFromPosition:(UITextPosition *)from toPosition:(UITextPosition *)toPosition;
{
    CCLOG("offsetFromPosition");
    return 0;
}

- (UITextPosition *)positionWithinRange:(UITextRange *)range farthestInDirection:(UITextLayoutDirection)direction;
{
    CCLOG("positionWithinRange");
    return nil;
}
- (UITextRange *)characterRangeByExtendingPosition:(UITextPosition *)position inDirection:(UITextLayoutDirection)direction;
{
    CCLOG("characterRangeByExtendingPosition");
    return nil;
}

#pragma mark Writing direction

- (UITextWritingDirection)baseWritingDirectionForPosition:(UITextPosition *)position inDirection:(UITextStorageDirection)direction;
{
    CCLOG("baseWritingDirectionForPosition");
    return UITextWritingDirectionNatural;
}
- (void)setBaseWritingDirection:(UITextWritingDirection)writingDirection forRange:(UITextRange *)range;
{
    CCLOG("setBaseWritingDirection");
}

#pragma mark Geometry

/* Geometry used to provide, for example, a correction rect. */
- (CGRect)firstRectForRange:(UITextRange *)range;
{
    CCLOG("firstRectForRange");
    return CGRectNull;
}
- (CGRect)caretRectForPosition:(UITextPosition *)position;
{
    CCLOG("caretRectForPosition");
    return _caretRect;
}

#pragma mark Hit testing

/* JS - Find the closest position to a given point */
- (UITextPosition *)closestPositionToPoint:(CGPoint)point;
{
    CCLOG("closestPositionToPoint");
    return nil;
}
- (UITextPosition *)closestPositionToPoint:(CGPoint)point withinRange:(UITextRange *)range;
{
    CCLOG("closestPositionToPoint");
    return nil;
}
- (UITextRange *)characterRangeAtPoint:(CGPoint)point;
{
    CCLOG("characterRangeAtPoint");
    return nil;
}

- (NSArray *)selectionRectsForRange:(UITextRange *)range
{
    CCLOG("selectionRectsForRange");
    return nil;
}

#pragma mark - UIKeyboard notification

- (void)onUIKeyboardNotification:(NSNotification *)notif;
{
    NSString * type = notif.name;

    NSDictionary* info = [notif userInfo];
    CGRect begin = [self convertRect:
                    [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue]
                            fromView:self];
    CGRect end = [self convertRect:
                  [[info objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue]
                          fromView:self];
    double aniDuration = [[info objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    CGSize viewSize = self.frame.size;

    CGFloat tmp;
    switch (getFixedOrientation([[UIApplication sharedApplication] statusBarOrientation]))
    {
        case UIInterfaceOrientationPortrait:
            begin.origin.y = viewSize.height - begin.origin.y - begin.size.height;
            end.origin.y = viewSize.height - end.origin.y - end.size.height;
            break;

        case UIInterfaceOrientationPortraitUpsideDown:
            begin.origin.x = viewSize.width - (begin.origin.x + begin.size.width);
            end.origin.x = viewSize.width - (end.origin.x + end.size.width);
            break;

        case UIInterfaceOrientationLandscapeLeft:
            std::swap(begin.size.width, begin.size.height);
            std::swap(end.size.width, end.size.height);
            std::swap(viewSize.width, viewSize.height);

            tmp = begin.origin.x;
            begin.origin.x = begin.origin.y;
            begin.origin.y = viewSize.height - tmp - begin.size.height;
            tmp = end.origin.x;
            end.origin.x = end.origin.y;
            end.origin.y = viewSize.height - tmp - end.size.height;
            break;

        case UIInterfaceOrientationLandscapeRight:
            std::swap(begin.size.width, begin.size.height);
            std::swap(end.size.width, end.size.height);
            std::swap(viewSize.width, viewSize.height);

            tmp = begin.origin.x;
            begin.origin.x = begin.origin.y;
            begin.origin.y = tmp;
            tmp = end.origin.x;
            end.origin.x = end.origin.y;
            end.origin.y = tmp;
            break;

        default:
            break;
    }

//    auto glview = director->getOpenGLView();
//    float scaleX = glview->getScaleX();
//    float scaleY = glview->getScaleY();

    // Convert to pixel coordinate
    begin = CGRectApplyAffineTransform(begin, CGAffineTransformScale(CGAffineTransformIdentity, self.contentScaleFactor, self.contentScaleFactor));
    end = CGRectApplyAffineTransform(end, CGAffineTransformScale(CGAffineTransformIdentity, self.contentScaleFactor, self.contentScaleFactor));

//    float offestY = glview->getViewPortRect().origin.y;
//    CCLOG("offestY = %f", offestY);
//    if (offestY < 0.0f)
//    {
//        begin.origin.y += offestY;
//        begin.size.height -= offestY;
//        end.size.height -= offestY;
//    }

    // Convert to design coordinate
//    begin = CGRectApplyAffineTransform(begin, CGAffineTransformScale(CGAffineTransformIdentity, 1.0f/scaleX, 1.0f/scaleY));
//    end = CGRectApplyAffineTransform(end, CGAffineTransformScale(CGAffineTransformIdentity, 1.0f/scaleX, 1.0f/scaleY));


//    cocos2d::IMEKeyboardNotificationInfo notiInfo;
//    notiInfo.begin = cocos2d::Rect(begin.origin.x,
//                                     begin.origin.y,
//                                     begin.size.width,
//                                     begin.size.height);
//    notiInfo.end = cocos2d::Rect(end.origin.x,
//                                   end.origin.y,
//                                   end.size.width,
//                                   end.size.height);
//    notiInfo.duration = (float)aniDuration;
//
//    cocos2d::IMEDispatcher* dispatcher = cocos2d::IMEDispatcher::sharedDispatcher();
//    if (UIKeyboardWillShowNotification == type)
//    {
//        self.keyboardShowNotification = notif; // implicit copy
//        dispatcher->dispatchKeyboardWillShow(notiInfo);
//    }
//    else if (UIKeyboardDidShowNotification == type)
//    {
//        //CGSize screenSize = self.window.screen.bounds.size;
//        dispatcher->dispatchKeyboardDidShow(notiInfo);
//        _caretRect = end;
//
//        int fontSize = [UIFont smallSystemFontSize];
//        _caretRect.origin.y = viewSize.height - (_caretRect.origin.y + _caretRect.size.height + fontSize);
//        _caretRect.size.height = 0;
//        _isKeyboardShown = YES;
//    }
//    else if (UIKeyboardWillHideNotification == type)
//    {
//        dispatcher->dispatchKeyboardWillHide(notiInfo);
//    }
//    else if (UIKeyboardDidHideNotification == type)
//    {
//        _caretRect = CGRectZero;
//        dispatcher->dispatchKeyboardDidHide(notiInfo);
//        _isKeyboardShown = NO;
//    }
}

UIInterfaceOrientation getFixedOrientation(UIInterfaceOrientation statusBarOrientation)
{
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
    {
        statusBarOrientation = UIInterfaceOrientationPortrait;
    }
    return statusBarOrientation;
}

-(void) doAnimationWhenKeyboardMoveWithDuration:(float)duration distance:(float)dis
{
    [UIView beginAnimations:nil context:nullptr];
    [UIView setAnimationDelegate:self];
    [UIView setAnimationDuration:duration];
    [UIView setAnimationBeginsFromCurrentState:YES];

    //NSLog(@"[animation] dis = %f, scale = %f \n", dis, cocos2d::GLView::getInstance()->getScaleY());

    if (dis < 0.0f) dis = 0.0f;

//    auto glview = cocos2d::Director::getInstance()->getOpenGLView();
//    dis *= glview->getScaleY();

    dis /= self.contentScaleFactor;

    switch (getFixedOrientation([[UIApplication sharedApplication] statusBarOrientation]))
    {
        case UIInterfaceOrientationPortrait:
            self.frame = CGRectMake(_originalRect.origin.x, _originalRect.origin.y - dis, _originalRect.size.width, _originalRect.size.height);
            break;

        case UIInterfaceOrientationPortraitUpsideDown:
            self.frame = CGRectMake(_originalRect.origin.x, _originalRect.origin.y + dis, _originalRect.size.width, _originalRect.size.height);
            break;

        case UIInterfaceOrientationLandscapeLeft:
            self.frame = CGRectMake(_originalRect.origin.x - dis, _originalRect.origin.y , _originalRect.size.width, _originalRect.size.height);
            break;

        case UIInterfaceOrientationLandscapeRight:
            self.frame = CGRectMake(_originalRect.origin.x + dis, _originalRect.origin.y , _originalRect.size.width, _originalRect.size.height);
            break;

        default:
            break;
    }
    
    [UIView commitAnimations];
}


-(void) doAnimationWhenAnotherEditBeClicked
{
    if (self.keyboardShowNotification != nil)
        [[NSNotificationCenter defaultCenter]postNotification:self.keyboardShowNotification];
}

@end
