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

#include "platform/qnx/modules/System.h"
#include <string.h>
#include <sys/utsname.h>

namespace cc {

using OSType = System::OSType;

OSType System::getOSType() const {
    return OSType::QNX;
}

std::string System::getDeviceModel() const {
    return "QNX";
}

System::LanguageType System::getCurrentLanguage() const {
    char* pLanguageName = getenv("LANG");
    if (!pLanguageName) {
        return LanguageType::ENGLISH;
    }
    strtok(pLanguageName, "_");
    if (!pLanguageName) {
        return LanguageType::ENGLISH;
    }

    return getLanguageTypeByISO2(pLanguageName);
}

std::string System::getCurrentLanguageCode() const {
    static char code[3]={0};
    char *pLanguageName = getenv("LANG");
    if (!pLanguageName) {
        return "en";
    }
    strtok(pLanguageName, "_");
    if (!pLanguageName) {
        return "en";
    }
    strncpy(code,pLanguageName,2);
    code[2]='\0';
    return code;
}

std::string System::getSystemVersion() const {
    struct utsname u;
    uname(&u);
    return u.version;
}

bool System::openURL(const std::string& url) {
    //std::string op = std::string("xdg-open '").append(url).append("'");
    //return system(op.c_str()) == 0;
    return false;
}

System::LanguageType System::getLanguageTypeByISO2(const char* code) const {
    // this function is used by all platforms to get system language
    // except windows: cocos/platform/win32/CCApplication-win32.cpp
    LanguageType ret = LanguageType::ENGLISH;

    if (strncmp(code, "zh", 2) == 0) {
        ret = LanguageType::CHINESE;
    } else if (strncmp(code, "ja", 2) == 0) {
        ret = LanguageType::JAPANESE;
    } else if (strncmp(code, "fr", 2) == 0) {
        ret = LanguageType::FRENCH;
    } else if (strncmp(code, "it", 2) == 0) {
        ret = LanguageType::ITALIAN;
    } else if (strncmp(code, "de", 2) == 0) {
        ret = LanguageType::GERMAN;
    } else if (strncmp(code, "es", 2) == 0) {
        ret = LanguageType::SPANISH;
    } else if (strncmp(code, "nl", 2) == 0) {
        ret = LanguageType::DUTCH;
    } else if (strncmp(code, "ru", 2) == 0) {
        ret = LanguageType::RUSSIAN;
    } else if (strncmp(code, "hu", 2) == 0) {
        ret = LanguageType::HUNGARIAN;
    } else if (strncmp(code, "pt", 2) == 0) {
        ret = LanguageType::PORTUGUESE;
    } else if (strncmp(code, "ko", 2) == 0) {
        ret = LanguageType::KOREAN;
    } else if (strncmp(code, "ar", 2) == 0) {
        ret = LanguageType::ARABIC;
    } else if (strncmp(code, "nb", 2) == 0) {
        ret = LanguageType::NORWEGIAN;
    } else if (strncmp(code, "pl", 2) == 0) {
        ret = LanguageType::POLISH;
    } else if (strncmp(code, "tr", 2) == 0) {
        ret = LanguageType::TURKISH;
    } else if (strncmp(code, "uk", 2) == 0) {
        ret = LanguageType::UKRAINIAN;
    } else if (strncmp(code, "ro", 2) == 0) {
        ret = LanguageType::ROMANIAN;
    } else if (strncmp(code, "bg", 2) == 0) {
        ret = LanguageType::BULGARIAN;
    } 
    return ret;
}
} // namespace cc