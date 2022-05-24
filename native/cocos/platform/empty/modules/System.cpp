/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/empty/modules/System.h"
#include <string.h>

namespace cc {
    
using OSType = System::OSType;

OSType System::getOSType() const {
    return OSType::LINUX;
}

std::string System::getDeviceModel() const {
    return "Empty";
}

System::LanguageType System::getCurrentLanguage() const {
    return LanguageType::ENGLISH;
}

std::string System::getCurrentLanguageCode() const {
    return "en";
}

std::string System::getSystemVersion() const {
    return "empty";
}

bool System::openURL(const std::string& url) {
    return true;
}

System::LanguageType System::getLanguageTypeByISO2(const char* code) const {
    // this function is used by all platforms to get system language
    // except windows: cocos/platform/win32/CCApplication-win32.cpp
    LanguageType ret = LanguageType::ENGLISH;
    return ret;
}
} // namespace cc
