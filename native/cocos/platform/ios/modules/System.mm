/****************************************************************************
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
#include "platform/ios/modules/System.h"
#import <UIKit/UIKit.h>


#include <sys/utsname.h>
#include <algorithm>
#include <mutex>
#include <sstream>


namespace cc {
using OSType = System::OSType;

OSType System::getOSType() const {
    return OSType::IPHONE;
}

std::string System::getDeviceModel() const {
    struct utsname systemInfo;
    uname(&systemInfo);
    return systemInfo.machine;
}

System::LanguageType System::getCurrentLanguage() const {
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

std::string System::getCurrentLanguageCode() const {
    NSUserDefaults *defaults        = [NSUserDefaults standardUserDefaults];
    NSArray *       languages       = [defaults objectForKey:@"AppleLanguages"];
    NSString *      currentLanguage = [languages objectAtIndex:0];
    return [currentLanguage UTF8String];
}

std::string System::getSystemVersion() const {
    NSString *systemVersion = [UIDevice currentDevice].systemVersion;
    return [systemVersion UTF8String];
}

bool System::openURL(const std::string &url) {
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
} // namespace cc
