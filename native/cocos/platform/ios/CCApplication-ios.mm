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
#import <UIKit/UIKit.h>
#import "CCEAGLView-ios.h"
#import "renderer/gfx/DeviceGraphics.h"
#import "scripting/js-bindings/jswrapper/jsc/ScriptEngine.hpp"
#import "scripting/js-bindings/event/EventDispatch.h"

@interface MainLoop : NSObject
{
    id displayLink;
    int interval;
    BOOL isAppActive;
}
@property (readwrite) int interval;
-(void) startMainLoop;
-(void) stopMainLoop;
-(void) doCaller: (id) sender;
-(void) setAnimationInterval:(double)interval;
@end

@interface NSObject(CADisplayLink)
+(id) displayLinkWithTarget: (id)arg1 selector:(SEL)arg2;
-(void) addToRunLoop: (id)arg1 forMode: (id)arg2;
-(void) setFrameInterval: (NSInteger)interval;
-(void) invalidate;
@end

@implementation MainLoop

@synthesize interval;

-(void) alloc
{
    interval = 1;
}

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        isAppActive = [UIApplication sharedApplication].applicationState == UIApplicationStateActive;
        NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
        [nc addObserver:self selector:@selector(appDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
        [nc addObserver:self selector:@selector(appDidBecomeInactive) name:UIApplicationWillResignActiveNotification object:nil];
    }
    return self;
}

-(void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [displayLink release];
    [super dealloc];
}

- (void)appDidBecomeActive
{
    isAppActive = YES;
}

- (void)appDidBecomeInactive
{
    isAppActive = NO;
}

-(void) startMainLoop
{
    [self stopMainLoop];
    
    displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(doCaller:)];
    [displayLink setFrameInterval: self.interval];
    [displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

-(void) stopMainLoop
{
    [displayLink invalidate];
    displayLink = nil;
}

-(void) setAnimationInterval:(double)intervalNew
{
    // Director::setAnimationInterval() is called, we should invalidate it first
    [self stopMainLoop];
    
    self.interval = 60.0 * intervalNew;
    
    displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(doCaller:)];
    [displayLink setFrameInterval: self.interval];
    [displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

-(void) doCaller: (id) sender
{
    cocos2d::EventDispatch::dispatchTicket();
}

@end

NS_CC_BEGIN

Application::Application(const std::string& name)
{
    createView(name);
    
    renderer::DeviceGraphics::getInstance();
    se::ScriptEngine::getInstance();
    
    _delegate = [[MainLoop alloc] init];
}

Application::~Application()
{
    [(CCEAGLView*)_view release];
    _view = nullptr;
    
    // TODO: destroy DeviceGraphics
    
    se::ScriptEngine::destroyInstance();
    
    // stop main loop
    [(MainLoop*)_delegate stopMainLoop];
    [(MainLoop*)_delegate release];
    _delegate = nullptr;
}

void Application::start()
{
    if (_delegate)
        [(MainLoop*)_delegate startMainLoop];
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

void Application::onCreateView(int&x, int& y, int& width, int& height, int& rBits, int& gBits, int& bBits, int& aBits, int& depthBits, int& stencilBits, int& multisamplingCount)
{
    CGRect bounds = [UIScreen mainScreen].bounds;
    x = bounds.origin.x;
    y = bounds.origin.y;
    width = bounds.size.width;
    height = bounds.size.height;
    
    rBits = 5;
    gBits = 6;
    bBits = 5;
    aBits = 0;
    depthBits = 24;
    stencilBits = 8;
    multisamplingCount = 0;
}

void Application::createView(const std::string& /*name*/)
{
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    int r = 0;
    int g = 0;
    int b = 0;
    int a = 0;
    int depth = 0;
    int stencil = 0;
    int multisamplingCount = 0;
    
    onCreateView(x,
                 y,
                 width,
                 height,
                 r, g, b, a, depth, stencil, multisamplingCount);
    
    CGRect bounds;
    bounds.origin.x = x;
    bounds.origin.y = y;
    bounds.size.width = width;
    bounds.size.height = height;
    
    //TODO: pixel format, depth format
    // create view
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: bounds
                                         pixelFormat: kEAGLColorFormatRGB565
                                         depthFormat: GL_DEPTH_COMPONENT24_OES
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: multisamplingCount != 0
                                     numberOfSamples: multisamplingCount];
    
    eaglView.backgroundColor = [UIColor redColor]; // TODO: remove it
    [eaglView setMultipleTouchEnabled:_multiTouch];
    
    [eaglView retain];
    _view = eaglView;
}

NS_CC_END
