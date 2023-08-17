/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/openharmony/modules/System.h"
#include <string>
#include "platform/openharmony/napi/NapiHelper.h"

namespace cc {
System::System() = default;
System::~System() = default;

System::OSType System::getOSType() const {
    return OSType::OPENHARMONY;
}

std::string System::getDeviceModel() const {
    return "";
}

System::LanguageType System::getCurrentLanguage() const {
    ccstd::string languageStr = getCurrentLanguageCode(); // NOLINT
    if (languageStr == "en") {
        return ISystem::LanguageType::ENGLISH;
    } else if (languageStr == "zh") {
        return ISystem::LanguageType::CHINESE;
    } else if (languageStr == "fr") {
        return ISystem::LanguageType::FRENCH;
    } else if (languageStr == "it") {
        return ISystem::LanguageType::ITALIAN;
    } else if (languageStr == "de") {
        return ISystem::LanguageType::GERMAN;
    } else if (languageStr == "es") {
        return ISystem::LanguageType::SPANISH;
    } else if (languageStr == "du") {
        return ISystem::LanguageType::DUTCH;
    } else if (languageStr == "ru") {
        return ISystem::LanguageType::RUSSIAN;
    } else if (languageStr == "ko") {
        return ISystem::LanguageType::KOREAN;
    } else if (languageStr == "ja") {
        return ISystem::LanguageType::JAPANESE;
    } else if (languageStr == "hu") {
        return ISystem::LanguageType::HUNGARIAN;
    } else if (languageStr == "pt") {
        return ISystem::LanguageType::PORTUGUESE;
    } else if (languageStr == "ar") {
        return ISystem::LanguageType::ARABIC;
    } else if (languageStr == "no") {
        return ISystem::LanguageType::NORWEGIAN;
    } else if (languageStr == "pl") {
        return ISystem::LanguageType::POLISH;
    } else if (languageStr == "tr") {
        return ISystem::LanguageType::TURKISH;
    } else if (languageStr == "uk") {
        return ISystem::LanguageType::UKRAINIAN;
    } else if (languageStr == "ro") {
        return ISystem::LanguageType::ROMANIAN;
    } else if (languageStr == "bg") {
        return ISystem::LanguageType::BULGARIAN;
    }
    return ISystem::LanguageType::ENGLISH;
}

std::string System::getCurrentLanguageCode() const {
    auto ret = NapiHelper::napiCallFunction("getSystemLanguage");
    if (!ret.IsString()) {
        return {};
    }
    auto str = ret.As<Napi::String>().Utf8Value();
    std::string::size_type pos = str.find('-');
    if(pos != std::string::npos) {
        str = str.substr(0, pos);
    }
    return str;
}

std::string System::getSystemVersion() const {
    auto ret = NapiHelper::napiCallFunction("getOSFullName");
    if (!ret.IsString()) {
        return {};
    }
    return ret.As<Napi::String>().Utf8Value();
}

bool System::openURL(const std::string& url) {
    return false;
}

void System::copyTextToClipboard(const std::string& text) {
    //copyTextToClipboardJNI(text);
}

} // namespace cc
