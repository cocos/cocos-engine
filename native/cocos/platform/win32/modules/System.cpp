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

#include "platform/win32/modules/System.h"
#include <Windows.h>
#include "SDL2/SDL_clipboard.h"
#include "base/memory/Memory.h"
namespace cc {
using OSType = System::OSType;

OSType System::getOSType() const {
    return OSType::WINDOWS;
}

ccstd::string System::getDeviceModel() const {
    return "Windows";
}

System::LanguageType System::getCurrentLanguage() const {
    LanguageType ret = LanguageType::ENGLISH;

    LCID localeID = GetUserDefaultLCID();
    unsigned short primaryLanguageID = localeID & 0xFF;

    switch (primaryLanguageID) {
        case LANG_CHINESE:
            ret = LanguageType::CHINESE;
            break;
        case LANG_ENGLISH:
            ret = LanguageType::ENGLISH;
            break;
        case LANG_FRENCH:
            ret = LanguageType::FRENCH;
            break;
        case LANG_ITALIAN:
            ret = LanguageType::ITALIAN;
            break;
        case LANG_GERMAN:
            ret = LanguageType::GERMAN;
            break;
        case LANG_SPANISH:
            ret = LanguageType::SPANISH;
            break;
        case LANG_DUTCH:
            ret = LanguageType::DUTCH;
            break;
        case LANG_RUSSIAN:
            ret = LanguageType::RUSSIAN;
            break;
        case LANG_KOREAN:
            ret = LanguageType::KOREAN;
            break;
        case LANG_JAPANESE:
            ret = LanguageType::JAPANESE;
            break;
        case LANG_HUNGARIAN:
            ret = LanguageType::HUNGARIAN;
            break;
        case LANG_PORTUGUESE:
            ret = LanguageType::PORTUGUESE;
            break;
        case LANG_ARABIC:
            ret = LanguageType::ARABIC;
            break;
        case LANG_NORWEGIAN:
            ret = LanguageType::NORWEGIAN;
            break;
        case LANG_POLISH:
            ret = LanguageType::POLISH;
            break;
        case LANG_TURKISH:
            ret = LanguageType::TURKISH;
            break;
        case LANG_UKRAINIAN:
            ret = LanguageType::UKRAINIAN;
            break;
        case LANG_ROMANIAN:
            ret = LanguageType::ROMANIAN;
            break;
        case LANG_BULGARIAN:
            ret = LanguageType::BULGARIAN;
            break;
        case LANG_HINDI:
            ret = LanguageType::HINDI;
            break;
    }

    return ret;
}

ccstd::string System::getCurrentLanguageCode() const {
    LANGID lid = GetUserDefaultUILanguage();
    const LCID locale_id = MAKELCID(lid, SORT_DEFAULT);
    int length = GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, nullptr, 0);

    char *tempCode = reinterpret_cast<char *>(CC_MALLOC(length));
    GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, tempCode, length);
    ccstd::string code(tempCode);
    CC_FREE(tempCode);

    return code;
}

ccstd::string System::getSystemVersion() const {
    char buff[256] = {0};
    HMODULE handle = GetModuleHandleW(L"ntdll.dll");
    if (handle) {
        typedef NTSTATUS(WINAPI * RtlGetVersionPtr)(PRTL_OSVERSIONINFOW);
        RtlGetVersionPtr getVersionPtr = (RtlGetVersionPtr)GetProcAddress(handle, "RtlGetVersion");
        if (getVersionPtr != NULL) {
            RTL_OSVERSIONINFOW info;
            if (getVersionPtr(&info) == 0) { /* STATUS_SUCCESS == 0 */
                snprintf(buff, sizeof(buff), "Windows version %d.%d.%d", info.dwMajorVersion, info.dwMinorVersion, info.dwBuildNumber);
                return buff;
            }
        }
    }
    return buff;
}

bool System::openURL(const ccstd::string &url) {
    WCHAR *temp = ccnew WCHAR[url.size() + 1];
    int urlSize = static_cast<int>(url.size() + 1);
    MultiByteToWideChar(CP_UTF8, 0, url.c_str(), urlSize, temp, urlSize);
    HINSTANCE r = ShellExecuteW(NULL, L"open", temp, NULL, NULL, SW_SHOWNORMAL);
    delete[] temp;
    return (size_t)r > 32;
}

void System::copyTextToClipboard(const ccstd::string &text) {
    SDL_SetClipboardText(text.c_str());
}

} // namespace cc
