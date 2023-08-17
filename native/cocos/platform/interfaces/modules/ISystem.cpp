/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "platform/interfaces/modules/ISystem.h"

namespace cc {
ISystem::~ISystem() = default;

ccstd::string ISystem::getCurrentLanguageToString() {
    LanguageType language = getCurrentLanguage();
    ccstd::string languageStr = ""; // NOLINT
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
        case ISystem::LanguageType::HINDI:
            languageStr = "hi";
            break;
        default:
            languageStr = "unknown";
            break;
    }
    return languageStr;
}

} // namespace cc
