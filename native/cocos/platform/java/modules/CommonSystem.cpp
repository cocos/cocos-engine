/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/CommonSystem.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"

namespace cc {
CommonSystem::CommonSystem()  = default;
CommonSystem::~CommonSystem() = default;

std::string CommonSystem::getDeviceModel() const {
    return getDeviceModelJNI();
}

CommonSystem::LanguageType CommonSystem::getCurrentLanguage() const {
    std::string  languageName  = getCurrentLanguageJNI();
    const char*  pLanguageName = languageName.c_str();
    LanguageType ret           = LanguageType::ENGLISH;

    if (0 == strcmp("zh", pLanguageName)) {
        ret = LanguageType::CHINESE;
    } else if (0 == strcmp("en", pLanguageName)) {
        ret = LanguageType::ENGLISH;
    } else if (0 == strcmp("fr", pLanguageName)) {
        ret = LanguageType::FRENCH;
    } else if (0 == strcmp("it", pLanguageName)) {
        ret = LanguageType::ITALIAN;
    } else if (0 == strcmp("de", pLanguageName)) {
        ret = LanguageType::GERMAN;
    } else if (0 == strcmp("es", pLanguageName)) {
        ret = LanguageType::SPANISH;
    } else if (0 == strcmp("ru", pLanguageName)) {
        ret = LanguageType::RUSSIAN;
    } else if (0 == strcmp("nl", pLanguageName)) {
        ret = LanguageType::DUTCH;
    } else if (0 == strcmp("ko", pLanguageName)) {
        ret = LanguageType::KOREAN;
    } else if (0 == strcmp("ja", pLanguageName)) {
        ret = LanguageType::JAPANESE;
    } else if (0 == strcmp("hu", pLanguageName)) {
        ret = LanguageType::HUNGARIAN;
    } else if (0 == strcmp("pt", pLanguageName)) {
        ret = LanguageType::PORTUGUESE;
    } else if (0 == strcmp("ar", pLanguageName)) {
        ret = LanguageType::ARABIC;
    } else if (0 == strcmp("nb", pLanguageName)) {
        ret = LanguageType::NORWEGIAN;
    } else if (0 == strcmp("pl", pLanguageName)) {
        ret = LanguageType::POLISH;
    } else if (0 == strcmp("tr", pLanguageName)) {
        ret = LanguageType::TURKISH;
    } else if (0 == strcmp("uk", pLanguageName)) {
        ret = LanguageType::UKRAINIAN;
    } else if (0 == strcmp("ro", pLanguageName)) {
        ret = LanguageType::ROMANIAN;
    } else if (0 == strcmp("bg", pLanguageName)) {
        ret = LanguageType::BULGARIAN;
    }
    return ret;
}

std::string CommonSystem::getCurrentLanguageCode() const {
    return getCurrentLanguageCodeJNI();
}

std::string CommonSystem::getSystemVersion() const {
    return getSystemVersionJNI();
}

bool CommonSystem::openURL(const std::string& url) {
    return openURLJNI(url);
}

} // namespace cc