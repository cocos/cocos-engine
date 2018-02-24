/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#import <Cocoa/Cocoa.h>
#include <algorithm>

#import "platform/CCApplication.h"
#import "platform/desktop/CCGLView-desktop.h"
#import "scripting/js-bindings/event/EventDispatcher.h"
#import "renderer/gfx/DeviceGraphics.h"
#import "scripting/js-bindings/jswrapper/jsc/ScriptEngine.hpp"

NS_CC_BEGIN

namespace
{
    long getCurrentMillSecond()
    {
        long lLastTime = 0;
        struct timeval stCurrentTime;
        
        gettimeofday(&stCurrentTime, nullptr);
        lLastTime = stCurrentTime.tv_sec * 1000+stCurrentTime.tv_usec * 0.001; // milliseconds
        return lLastTime;
    }
    
    int g_width = 0;
    int g_height = 0;
    bool setCanvasCallback(se::Object* global)
    {
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        char commandBuf[200] = {0};
        sprintf(commandBuf, "window.canvas = { width: %d, height: %d };",
                g_width,
                g_height);
        se->evalString(commandBuf);
        
        return true;
    }
}

#define CAST_VIEW(view)    ((GLView*)view)

Application::Application(const std::string& name)
{
    createView(name);
    
    renderer::DeviceGraphics::getInstance()->setScaleFactor(CAST_VIEW(_view)->getScaleFactor());
    se::ScriptEngine::getInstance();
}

Application::~Application()
{
    // TODO: destroy DeviceGraphics
    
    se::ScriptEngine::destroyInstance();
    
    delete CAST_VIEW(_view);
    _view = nullptr;
}

void Application::start()
{
    se::ScriptEngine* se = se::ScriptEngine::getInstance();
    se->addRegisterCallback(setCanvasCallback);
    
    if(!applicationDidFinishLaunching())
        return;
    
    long lastTime = 0L;
    long curTime = 0L;

    if (!_view)
        return;
    
    while (!CAST_VIEW(_view)->windowShouldClose())
    {
        lastTime = getCurrentMillSecond();
        
        CAST_VIEW(_view)->pollEvents();
        CAST_VIEW(_view)->swapBuffers();

        curTime = getCurrentMillSecond();
        if (curTime - lastTime < _animationInterval)
            usleep(static_cast<useconds_t>((_animationInterval - curTime + lastTime) * 1000));

        EventDispatcher::dispatchTickEvent();
    }
}

void Application::setAnimationInterval(float interval)
{
    _animationInterval = interval * 1000.0f;
}

Application::Platform Application::getPlatform() const
{
    return Platform::MAC;
}

std::string Application::getCurrentLanguageCode() const
{
    static char code[3]={0};
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *languages = [defaults objectForKey:@"AppleLanguages"];
    NSString *currentLanguage = [languages objectAtIndex:0];
    
    // get the current language code.(such as English is "en", Chinese is "zh" and so on)
    NSDictionary* temp = [NSLocale componentsFromLocaleIdentifier:currentLanguage];
    NSString * languageCode = [temp objectForKey:NSLocaleLanguageCode];
    [languageCode getCString:code maxLength:3 encoding:NSASCIIStringEncoding];
    code[2]='\0';
    return code;
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

bool Application::openURL(const std::string &url)
{
    NSString* msg = [NSString stringWithCString:url.c_str() encoding:NSUTF8StringEncoding];
    NSURL* nsUrl = [NSURL URLWithString:msg];
    return [[NSWorkspace sharedWorkspace] openURL:nsUrl];
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

void Application::setMultitouch(bool)
{
}

void Application::onCreateView(int&x, int& y, int& width, int& height, PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount)
{
    x = 0;
    y = 0;
    width = 960;
    height = 640;
    
    pixelformat = PixelFormat::RGBA8;
    depthFormat = DepthFormat::DEPTH24_STENCIL8;

    multisamplingCount = 0;
}

void Application::createView(const std::string& name)
{
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    int multisamplingCount = 0;
    PixelFormat pixelformat;
    DepthFormat depthFormat;
    
    onCreateView(x,
                 y,
                 width,
                 height,
                 pixelformat,
                 depthFormat,
                 multisamplingCount);

    _view = new GLView(this, name, x, y, width, height, pixelformat, depthFormat, multisamplingCount);
    
    g_width = width;
    g_height = height;
}

NS_CC_END
