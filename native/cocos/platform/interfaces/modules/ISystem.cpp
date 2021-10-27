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
#include "platform/interfaces/modules/ISystem.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "platform/win32/modules/System.h"
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform/android/modules/System.h"
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "platform/ohos/modules/System.h"
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    #include "platform/mac/modules/System.h"
#elif (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #include "platform/ios/modules/System.h"
#endif

namespace cc {
ISystem::~ISystem() = default;

ISystem::Ptr ISystem::createSystemInterface() {
    return std::make_shared<System>();
}

std::string ISystem::getCurrentLanguageToString() {
    LanguageType language    = getCurrentLanguage();
    std::string  languageStr = ""; // NOLINT
    switch (language) {
        case ISystem::LanguageType::ENGLISH:
            languageStr = "en";
            break;
        case ISystem::LanguageType::CHINESE:
            languageStr = "zh";
            break;
        case ISystem::LanguageType::FRENCH:
            languageStr = "fr";
            break;
        case ISystem::LanguageType::ITALIAN:
            languageStr = "it";
            break;
        case ISystem::LanguageType::GERMAN:
            languageStr = "de";
            break;
        case ISystem::LanguageType::SPANISH:
            languageStr = "es";
            break;
        case ISystem::LanguageType::DUTCH:
            languageStr = "du";
            break;
        case ISystem::LanguageType::RUSSIAN:
            languageStr = "ru";
            break;
        case ISystem::LanguageType::KOREAN:
            languageStr = "ko";
            break;
        case ISystem::LanguageType::JAPANESE:
            languageStr = "ja";
            break;
        case ISystem::LanguageType::HUNGARIAN:
            languageStr = "hu";
            break;
        case ISystem::LanguageType::PORTUGUESE:
            languageStr = "pt";
            break;
        case ISystem::LanguageType::ARABIC:
            languageStr = "ar";
            break;
        case ISystem::LanguageType::NORWEGIAN:
            languageStr = "no";
            break;
        case ISystem::LanguageType::POLISH:
            languageStr = "pl";
            break;
        case ISystem::LanguageType::TURKISH:
            languageStr = "tr";
            break;
        case ISystem::LanguageType::UKRAINIAN:
            languageStr = "uk";
            break;
        case ISystem::LanguageType::ROMANIAN:
            languageStr = "ro";
            break;
        case ISystem::LanguageType::BULGARIAN:
            languageStr = "bg";
            break;
        default:
            languageStr = "unknown";
            break;
    }
    return languageStr;
}

} // namespace cc