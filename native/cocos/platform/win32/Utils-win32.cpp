/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/win32/Utils-win32.h"
#include <sstream>
#include "base/Log.h"
#include "platform/StdC.h"

namespace cc {

std::wstring StringUtf8ToWideChar(const std::string &strUtf8) {
    std::wstring ret;
    if (!strUtf8.empty()) {
        int nNum = MultiByteToWideChar(CP_UTF8, 0, strUtf8.c_str(), -1, nullptr, 0);
        if (nNum) {
            WCHAR *wideCharString = new WCHAR[nNum + 1];
            wideCharString[0]     = 0;

            nNum = MultiByteToWideChar(CP_UTF8, 0, strUtf8.c_str(), -1, wideCharString, nNum + 1);

            ret = wideCharString;
            delete[] wideCharString;
        } else {
            CC_LOG_DEBUG("Wrong convert to WideChar code:0x%x", GetLastError());
        }
    }
    return ret;
}

std::string StringWideCharToUtf8(const std::wstring &strWideChar) {
    std::string ret;
    if (!strWideChar.empty()) {
        int nNum = WideCharToMultiByte(CP_UTF8, 0, strWideChar.c_str(), -1, nullptr, 0, nullptr, FALSE);
        if (nNum) {
            char *utf8String = new char[nNum + 1];
            utf8String[0]    = 0;

            nNum = WideCharToMultiByte(CP_UTF8, 0, strWideChar.c_str(), -1, utf8String, nNum + 1, nullptr, FALSE);

            ret = utf8String;
            delete[] utf8String;
        } else {
            CC_LOG_DEBUG("Wrong convert to Utf8 code:0x%x", GetLastError());
        }
    }

    return ret;
}

std::string UTF8StringToMultiByte(const std::string &strUtf8) {
    std::string ret;
    if (!strUtf8.empty()) {
        std::wstring strWideChar = StringUtf8ToWideChar(strUtf8);
        int          nNum        = WideCharToMultiByte(CP_ACP, 0, strWideChar.c_str(), -1, nullptr, 0, nullptr, FALSE);
        if (nNum) {
            char *ansiString = new char[nNum + 1];
            ansiString[0]    = 0;

            nNum = WideCharToMultiByte(CP_ACP, 0, strWideChar.c_str(), -1, ansiString, nNum + 1, nullptr, FALSE);

            ret = ansiString;
            delete[] ansiString;
        } else {
            CC_LOG_DEBUG("Wrong convert to Ansi code:0x%x", GetLastError());
        }
    }

    return ret;
}

} // namespace cc
