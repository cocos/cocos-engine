/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2017 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#import "Application.h"

#import <UIKit/UIKit.h>
#include <sstream>

#include "audio/include/AudioEngine.h"
#include "base/AutoreleasePool.h"
#include "base/Scheduler.h"
#include "bindings/event/EventDispatcher.h"
#include "bindings/jswrapper/SeApi.h"
#include "platform/Device.h"

#include "pipeline/Define.h"
#include "pipeline/RenderPipeline.h"
#include "renderer/GFXDeviceManager.h"

@interface MyTimer : NSObject {
    cc::Application *_app;
    CADisplayLink *  _displayLink;
    int              _fps;
}
- (instancetype)initWithApp:(cc::Application *)app fps:(int)fps;
- (void)start;
- (void)changeFPS:(int)fps;
- (void)pause;
- (void)resume;
@end

@implementation MyTimer

- (instancetype)initWithApp:(cc::Application *)app fps:(int)fps {
    if (self = [super init]) {
        _fps                                  = fps;
        _app                                  = app;
        _displayLink                          = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(renderScene:)];
        _displayLink.preferredFramesPerSecond = _fps;
    }
    return self;
}

- (void)start {
    [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

- (void)pause {
    _displayLink.paused = TRUE;
}

- (void)resume {
    _displayLink.paused = FALSE;
}

- (void)changeFPS:(int)fps {
    _displayLink.preferredFramesPerSecond = fps;
}

- (void)renderScene:(id)sender {
    _app->tick();
}

@end

namespace cc {

namespace {
bool setCanvasCallback(se::Object *global) {
    auto              viewLogicalSize = cc::Application::getInstance()->getViewLogicalSize();
    se::ScriptEngine *se              = se::ScriptEngine::getInstance();

    int nativeWidth  = static_cast<int>(viewLogicalSize.x * Device::getDevicePixelRatio());
    int nativeHeight = static_cast<int>(viewLogicalSize.y * Device::getDevicePixelRatio());

    // https://stackoverflow.com/questions/5795978/string-format-for-intptr-t-and-uintptr-t/41897226#41897226
    // format intptr_t
    //set window.innerWidth/innerHeight in css pixel units
    uintptr_t         windowHandle = reinterpret_cast<uintptr_t>(UIApplication.sharedApplication.delegate.window.rootViewController.view);
    std::stringstream ss;
    {
        ss << "window.innerWidth = " << viewLogicalSize.x
           << "; window.innerHeight = " << viewLogicalSize.y
           << "; window.nativeWidth= " << nativeWidth
           << "; window.nativeHeight = " << nativeHeight
           << "; window.windowHandler = ";
        if constexpr (sizeof(windowHandle) == 8) { // use bigint
            ss << static_cast<uint64_t>(windowHandle) << "n;";
        }
        if constexpr (sizeof(windowHandle) == 4) {
            ss << static_cast<uint32_t>(windowHandle) << ";";
        }
    }
    se->evalString(ss.str().c_str());

    return true;
}

MyTimer *_timer;
}

Application *              Application::instance  = nullptr;
std::shared_ptr<Scheduler> Application::scheduler = nullptr;

Application::Application(int width, int height) {
    Application::instance = this;
    scheduler             = std::make_shared<Scheduler>();
    EventDispatcher::init();
    _viewLogicalSize.x = width;
    _viewLogicalSize.y = height;

    _timer = [[MyTimer alloc] initWithApp:this fps:_fps];
}

Application::~Application() {
#if USE_AUDIO
    AudioEngine::end();
#endif

    pipeline::RenderPipeline::getInstance()->destroy();

    EventDispatcher::destroy();
    se::ScriptEngine::destroyInstance();

    gfx::DeviceManager::destroy();

    Application::instance = nullptr;

    [_timer release];
}

std::string Application::getCurrentLanguageCode() const {
    NSUserDefaults *defaults        = [NSUserDefaults standardUserDefaults];
    NSArray *       languages       = [defaults objectForKey:@"AppleLanguages"];
    NSString *      currentLanguage = [languages objectAtIndex:0];
    return [currentLanguage UTF8String];
}

bool Application::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value           ret;
    char                commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Application::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char                commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

void Application::setCursorEnabled(bool value) {
}

Application::LanguageType Application::getCurrentLanguage() const {
    // get the current language and country config
    NSUserDefaults *defaults        = [NSUserDefaults standardUserDefaults];
    NSArray *       languages       = [defaults objectForKey:@"AppleLanguages"];
    NSString *      currentLanguage = [languages objectAtIndex:0];

    // get the current language code.(such as English is "en", Chinese is "zh" and so on)
    NSDictionary *temp         = [NSLocale componentsFromLocaleIdentifier:currentLanguage];
    NSString *    languageCode = [temp objectForKey:NSLocaleLanguageCode];

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

Application::Platform Application::getPlatform() const {
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) // idiom for iOS <= 3.2, otherwise: [UIDevice userInterfaceIdiom] is faster.
        return Platform::IPAD;
    else
        return Platform::IPHONE;
}

bool Application::openURL(const std::string &url) {
    NSString *   msg   = [NSString stringWithCString:url.c_str() encoding:NSUTF8StringEncoding];
    NSURL *      nsUrl = [NSURL URLWithString:msg];
    __block BOOL flag  = false;
    [[UIApplication sharedApplication] openURL:nsUrl
        options:@{}
        completionHandler:^(BOOL success) {
            flag = success;
        }];
    return flag;
}

void Application::copyTextToClipboard(const std::string &text) {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string        = [NSString stringWithCString:text.c_str() encoding:NSUTF8StringEncoding];
}

bool Application::init() {
    se::ScriptEngine *se = se::ScriptEngine::getInstance();
    se->addRegisterCallback(setCanvasCallback);

    [_timer start];
    return true;
}

void Application::onPause() {
    [_timer pause];
}

void Application::onResume() {
    [_timer resume];
}

void Application::onClose() {
}

std::string Application::getSystemVersion() {
    NSString *systemVersion = [UIDevice currentDevice].systemVersion;
    return [systemVersion UTF8String];
}

void Application::setPreferredFramesPerSecond(int fps) {
    _fps = fps;
    [_timer changeFPS:_fps];
}

} // namespace cc
