/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/empty/modules/System.h"
#include <string.h>

namespace cc {
using OSType = System::OSType;

OSType System::getOSType() const {
    return OSType::LINUX;
}

ccstd::string System::getDeviceModel() const {
    return "Empty";
}

System::LanguageType System::getCurrentLanguage() const {
    return LanguageType::ENGLISH;
}

ccstd::string System::getCurrentLanguageCode() const {
    return "en";
}

ccstd::string System::getSystemVersion() const {
    return "empty";
}

bool System::openURL(const ccstd::string &url) {
    return true;
}

System::LanguageType System::getLanguageTypeByISO2(const char *code) const {
    // this function is used by all platforms to get system language
    // except windows: cocos/platform/win32/CCApplication-win32.cpp
    LanguageType ret = LanguageType::ENGLISH;
    return ret;
}

void System::copyTextToClipboard(const ccstd::string &text) {
    // TODO
}

} // namespace cc