/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2017 Chukong Technologies Inc.

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

#import "CCApplication.h"

#include "base/CCScheduler.h"
#include "base/CCAutoreleasePool.h"
#include "base/CCGLUtils.h"
#include "renderer/gfx/DeviceGraphics.h"
#include "scripting/js-bindings/jswrapper/jsc/ScriptEngine.hpp"
#include "scripting/js-bindings/event/EventDispatcher.h"

#import "CCEAGLView-ios.h"
#import <UIKit/UIKit.h>

namespace
{
    bool setCanvasCallback(se::Object* global)
    {
        CGRect bounds = [UIScreen mainScreen].bounds;
        float scale = [[UIScreen mainScreen] scale];
        float width = bounds.size.width * scale;
        float height = bounds.size.height * scale;
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        char commandBuf[200] = {0};
        sprintf(commandBuf, "window.innerWidth = %d; window.innerHeight = %d;",
                (int)(width),
                (int)(height));
        se->evalString(commandBuf);
        glViewport(0, 0, width, height);
        glDepthMask(GL_TRUE);
        return true;
    }
}

@interface MainLoop : NSObject
{
    id _displayLink;
    int _interval;
    BOOL _isAppActive;
    cocos2d::Application* _application;
    cocos2d::Scheduler* _scheduler;
}
@property (readwrite) int interval;
-(void) startMainLoop;
-(void) stopMainLoop;
-(void) doCaller: (id) sender;
-(void) setAnimationInterval:(double)interval;
-(void) firstStart:(id) view;
@end

@interface NSObject(CADisplayLink)
+(id) displayLinkWithTarget: (id)arg1 selector:(SEL)arg2;
-(void) addToRunLoop: (id)arg1 forMode: (id)arg2;
-(void) setFrameInterval: (NSInteger)interval;
-(void) invalidate;
@end

@implementation MainLoop

@synthesize interval;

- (instancetype)initWithApplication:(cocos2d::Application*) application
{
    self = [super init];
    if (self)
    {
        _interval = 1;
    
        _application = application;
        _scheduler = _application->getScheduler();
        
        _isAppActive = [UIApplication sharedApplication].applicationState == UIApplicationStateActive;
        NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
        [nc addObserver:self selector:@selector(appDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
        [nc addObserver:self selector:@selector(appDidBecomeInactive) name:UIApplicationWillResignActiveNotification object:nil];
    }
    return self;
}

-(void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [_displayLink release];
    
    [super dealloc];
}

- (void)appDidBecomeActive
{
    _isAppActive = YES;
}

- (void)appDidBecomeInactive
{
    _isAppActive = NO;
}

-(void) firstStart:(id) view
{
    if ([view isReady]) {
        cocos2d::ccInvalidateStateCache();
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        se->addRegisterCallback(setCanvasCallback);

        if(!_application->applicationDidFinishLaunching())
            return;

        [self startMainLoop];
    }
    else
        [self performSelector:@selector(firstStart:) withObject:view afterDelay:0];
}

-(void) startMainLoop
{
    [self stopMainLoop];
    
    _displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(doCaller:)];
    [_displayLink setFrameInterval: self.interval];
    [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

-(void) stopMainLoop
{
    [_displayLink invalidate];
    _displayLink = nil;
}

-(void) setAnimationInterval:(double)intervalNew
{
    [self stopMainLoop];
    
    self.interval = 60.0 * intervalNew;
    
    _displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(doCaller:)];
    [_displayLink setFrameInterval: self.interval];
    [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

-(void) doCaller: (id) sender
{
    static std::chrono::steady_clock::time_point prevTime;
    static std::chrono::steady_clock::time_point now;
    static float dt = 0.f;

    prevTime = std::chrono::steady_clock::now();
    
    _scheduler->update(dt);
    cocos2d::EventDispatcher::dispatchTickEvent(dt);
    
    [(CCEAGLView*)(_application->getView()) swapBuffers];
    cocos2d::PoolManager::getInstance()->getCurrentPool()->clear();
    
    now = std::chrono::steady_clock::now();
    dt = std::chrono::duration_cast<std::chrono::microseconds>(now - prevTime).count() / 1000000.f;
}

@end

NS_CC_BEGIN

Application* Application::_instance = nullptr;

Application::Application(const std::string& name)
{
    Application::_instance = this;
    _scheduler = new Scheduler();

    createView(name);
    
    se::ScriptEngine::getInstance();
    EventDispatcher::init();
    
    _delegate = [[MainLoop alloc] initWithApplication:this];
}

Application::~Application()
{
    [(CCEAGLView*)_view release];
    _view = nullptr;

    delete _scheduler;
    _scheduler = nullptr;
    
    // TODO: destroy DeviceGraphics
    EventDispatcher::destroy();
    se::ScriptEngine::destroyInstance();
    
    // stop main loop
    [(MainLoop*)_delegate stopMainLoop];
    [(MainLoop*)_delegate release];
    _delegate = nullptr;

    Application::_instance = nullptr;
}

void Application::start()
{
    if (_delegate)
        [(MainLoop*)_delegate performSelector:@selector(firstStart:) withObject:(CCEAGLView*)_view afterDelay:0];
}

void Application::setAnimationInterval(float interval)
{
    [(MainLoop*)_delegate setAnimationInterval: interval];
}

std::string Application::getCurrentLanguageCode() const
{
    char code[3]={0};
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *languages = [defaults objectForKey:@"AppleLanguages"];
    NSString *currentLanguage = [languages objectAtIndex:0];

    // get the current language code.(such as English is "en", Chinese is "zh" and so on)
    NSDictionary* temp = [NSLocale componentsFromLocaleIdentifier:currentLanguage];
    NSString * languageCode = [temp objectForKey:NSLocaleLanguageCode];
    [languageCode getCString:code maxLength:3 encoding:NSASCIIStringEncoding];
    code[2]='\0';
    return std::string(code);
}

Application::LanguageType Application::getCurrentLanguage() const
{
    // get the current language and country config
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *languages = [defaults objectForKey:@"AppleLanguages"];
    NSString *currentLanguage = [languages objectAtIndex:0];

    // get the current language code.(such as English is "en", Chinese is "zh" and so on)
    NSDictionary* temp = [NSLocale componentsFromLocaleIdentifier:currentLanguage];
    NSString * languageCode = [temp objectForKey:NSLocaleLanguageCode];

    if ([languageCode isEqualToString:@"zh"]) return LanguageType::CHINESE;
    if ([languageCode isEqualToString:@"en"]) return LanguageType::ENGLISH;
    if ([languageCode isEqualToString:@"fr"]) return LanguageType::FRENCH;
    if ([languageCode isEqualToString:@"it"]) return LanguageType::ITALIAN;
    if ([languageCode isEqualToString:@"de"]) return LanguageType::GERMAN;
    if ([languageCode isEqualToString:@"es"]) return LanguageType::SPANISH;
    if ([languageCode isEqualToString:@"nl"]) return LanguageType::DUTCH;
    if ([languageCode isEqualToString:@"ru"]) return LanguageType::RUSSIAN;
    if ([languageCode isEqualToString:@"ko"]) return LanguageType::KOREAN;
    if ([languageCode isEqualToString:@"ja"]) return LanguageType::JAPANESE;
    if ([languageCode isEqualToString:@"hu"]) return LanguageType::HUNGARIAN;
    if ([languageCode isEqualToString:@"pt"]) return LanguageType::PORTUGUESE;
    if ([languageCode isEqualToString:@"ar"]) return LanguageType::ARABIC;
    if ([languageCode isEqualToString:@"nb"]) return LanguageType::NORWEGIAN;
    if ([languageCode isEqualToString:@"pl"]) return LanguageType::POLISH;
    if ([languageCode isEqualToString:@"tr"]) return LanguageType::TURKISH;
    if ([languageCode isEqualToString:@"uk"]) return LanguageType::UKRAINIAN;
    if ([languageCode isEqualToString:@"ro"]) return LanguageType::ROMANIAN;
    if ([languageCode isEqualToString:@"bg"]) return LanguageType::BULGARIAN;
    return LanguageType::ENGLISH;
}

Application::Platform Application::getPlatform() const
{
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) // idiom for iOS <= 3.2, otherwise: [UIDevice userInterfaceIdiom] is faster.
        return Platform::IPAD;
    else
        return Platform::IPHONE;
}

bool Application::openURL(const std::string &url)
{
    NSString* msg = [NSString stringWithCString:url.c_str() encoding:NSUTF8StringEncoding];
    NSURL* nsUrl = [NSURL URLWithString:msg];
    return [[UIApplication sharedApplication] openURL:nsUrl];
}

bool Application::applicationDidFinishLaunching()
{
    return true;
}

void Application::applicationDidEnterBackground()
{
}

void Application::applicationWillEnterForeground()
{
}

void Application::setMultitouch(bool value)
{
    if (value != _multiTouch)
    {
        _multiTouch = value;
        if (_view)
            [(CCEAGLView*)_view setMultipleTouchEnabled:_multiTouch];
    }
}

void Application::onCreateView(int&x, int& y, int& width, int& height, PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount)
{
    CGRect bounds = [UIScreen mainScreen].bounds;
    x = bounds.origin.x;
    y = bounds.origin.y;
    width = bounds.size.width;
    height = bounds.size.height;
    
    pixelformat = PixelFormat::RGB565;
    depthFormat = DepthFormat::DEPTH24_STENCIL8;

    multisamplingCount = 0;
}

namespace
{
    GLenum depthFormatMap[] =
    {
        0,                        // NONE: no depth and no stencil
        GL_DEPTH_COMPONENT24_OES, // DEPTH_COMPONENT16: unsupport, convert to GL_DEPTH_COMPONENT24_OES
        GL_DEPTH_COMPONENT24_OES, // DEPTH_COMPONENT24
        GL_DEPTH_COMPONENT24_OES, // DEPTH_COMPONENT32F: unsupport, convert to GL_DEPTH_COMPONENT24_OES
        GL_DEPTH24_STENCIL8_OES,  // DEPTH24_STENCIL8
        GL_DEPTH24_STENCIL8_OES,  // DEPTH32F_STENCIL8: unsupport, convert to GL_DEPTH24_STENCIL8_OES
        GL_DEPTH_STENCIL_OES      // STENCIL_INDEX8
    };
    
    GLenum depthFormat2GLDepthFormat(cocos2d::Application::DepthFormat depthFormat)
    {
        return depthFormatMap[(int)depthFormat];
    }
}

void Application::createView(const std::string& /*name*/)
{
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    PixelFormat pixelFormat = PixelFormat::RGB565;
    DepthFormat depthFormat = DepthFormat::DEPTH24_STENCIL8;
    int multisamplingCount = 0;
    
    onCreateView(x,
                 y,
                 width,
                 height,
                 pixelFormat,
                 depthFormat,
                 multisamplingCount);
    
    CGRect bounds;
    bounds.origin.x = x;
    bounds.origin.y = y;
    bounds.size.width = width;
    bounds.size.height = height;
    
    //FIXME: iOS only support these pixel format?
    // - RGB565
    // - RGBA8
    NSString *pixelString = kEAGLColorFormatRGB565;
    if (PixelFormat::RGB565 != pixelFormat &&
        PixelFormat::RGBA8 != pixelFormat)
        NSLog(@"Unsupported pixel format is set, iOS only support RGB565 or RGBA8. Change to use RGB565");
    else if (PixelFormat::RGBA8 == pixelFormat)
        pixelString = kEAGLColorFormatRGBA8;
    
    // create view
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: bounds
                                         pixelFormat: pixelString
                                         depthFormat: depthFormat2GLDepthFormat(depthFormat)
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: multisamplingCount != 0
                                     numberOfSamples: multisamplingCount];
    
    [eaglView setMultipleTouchEnabled:_multiTouch];
    
    [eaglView retain];
    _view = eaglView;
}

NS_CC_END
