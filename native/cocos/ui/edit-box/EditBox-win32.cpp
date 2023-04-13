/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

#include "EditBox.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"
#include "cocos/platform/interfaces/modules/ISystemWindowManager.h"

#include <stdlib.h>
#include <windows.h>
#include <codecvt>
#include <locale>
#include <memory>

#include "Richedit.h"

namespace cc {

/*************************************************************************
 Global variables and functions.
************************************************************************/

namespace {
bool g_isMultiline = false;
HWND g_hwndEditBox = nullptr;
WNDPROC g_prevMainWindowProc = nullptr;
WNDPROC g_prevEditWindowProc = nullptr;
se::Value g_textInputCallback;

HWND getCurrentWindowHwnd() {
    if (!CC_CURRENT_APPLICATION()) {
        return nullptr;
    }
    ISystemWindow *systemWindowIntf = CC_GET_MAIN_SYSTEM_WINDOW();
    if (!systemWindowIntf) {
        return nullptr;
    }
    return reinterpret_cast<HWND>(systemWindowIntf->getWindowHandle());
}

int getCocosWindowHeight() {
    // HWND parent = cc_get_application_view()->getWindowHandle();
    HWND parent = getCurrentWindowHwnd();
    RECT rect;
    GetClientRect(parent, &rect);
    return (rect.bottom - rect.top);
}

void getTextInputCallback() {
    if (!g_textInputCallback.isUndefined())
        return;

    auto global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value jsbVal;
    if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject()) {
        jsbVal.toObject()->getProperty("onTextInput", &g_textInputCallback);
        // free globle se::Value before ScriptEngine clean up
        se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
            g_textInputCallback.setUndefined();
        });
    }
}

void callJSFunc(const ccstd::string &type, const ccstd::string &text) {
    getTextInputCallback();

    se::AutoHandleScope scope;
    se::ValueArray args;
    args.push_back(se::Value(type));
    args.push_back(se::Value(text));
    g_textInputCallback.toObject()->call(args, nullptr);
}

ccstd::string getText(HWND hwnd) {
    int length = GetWindowTextLength(hwnd);
    LPWSTR str = (LPWSTR)malloc(sizeof(WCHAR) * (length + 1));
    GetWindowText(hwnd, str, length + 1);

    std::wstring_convert<std::codecvt_utf8<wchar_t>> convert;
    ccstd::string ret(convert.to_bytes(str));
    free(str);

    return ret;
}

std::wstring str2ws(const ccstd::string &text) {
    if (text.empty())
        return std::wstring();

    int sz = MultiByteToWideChar(CP_UTF8, 0, &text[0], (int)text.size(), 0, 0);
    std::wstring res(sz, 0);
    MultiByteToWideChar(CP_UTF8, 0, &text[0], (int)text.size(), &res[0], sz);
    return res;
}

LRESULT mainWindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_LBUTTONDOWN:
            EditBox::complete();
            EditBox::hide();
            SetFocus(getCurrentWindowHwnd());
            break;
        case WM_COMMAND:
            // EN_CHANGE => EN_UPDATE
            if (EN_UPDATE == HIWORD(wParam)) {
                callJSFunc("input", getText(g_hwndEditBox).c_str());
            }
            break;
        default:
            break;
    }

    return CallWindowProc(g_prevMainWindowProc, hwnd, msg, wParam, lParam);
}

LRESULT editWindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_KEYUP:
            if (wParam == VK_RETURN && !g_isMultiline) {
                EditBox::complete();
                EditBox::hide();
                SetFocus(getCurrentWindowHwnd());
            }
            break;
        default:
            break;
    }

    return CallWindowProc(g_prevEditWindowProc, hwnd, msg, wParam, lParam);
}
} // namespace

/*************************************************************************
Implementation of EditBox.
************************************************************************/
void EditBox::show(const EditBox::ShowInfo &showInfo) {
    int windowHeight = getCocosWindowHeight();
    if (!g_hwndEditBox) {
        HWND parent = getCurrentWindowHwnd();

        UINT32 flags = WS_CHILD | showInfo.textAlignment | WS_TABSTOP | ES_AUTOHSCROLL;
        g_isMultiline = showInfo.isMultiline;
        if (g_isMultiline) {
            flags |= ES_MULTILINE;
        }
        if (showInfo.inputType == "password")
            flags |= WS_EX_TRANSPARENT;

        /* g_hwndEditBox = CreateWindowEx(
            WS_EX_WINDOWEDGE,
            L"EDIT",
            NULL,
            flags,
            0,
            0,
            0,
            0,
            parent,
            0,
            NULL,
            NULL);*/
        LoadLibrary(TEXT("Msftedit.dll"));
        g_hwndEditBox = CreateWindowEx(
            0,
            MSFTEDIT_CLASS,
            NULL,
            flags,
            0,
            0,
            0,
            0,
            parent,
            0,
            NULL,
            NULL);

        if (!g_hwndEditBox) {
            wchar_t buffer[256] = {0};
            FormatMessageW(FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
                           NULL,
                           GetLastError(),
                           MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
                           buffer,
                           sizeof(buffer) / sizeof(wchar_t),
                           NULL);
            std::wstring_convert<std::codecvt_utf8<wchar_t>> convert;
            CC_LOG_DEBUG("Can not create editbox: %s", convert.to_bytes(buffer).c_str());
            return;
        }

        g_prevMainWindowProc = (WNDPROC)SetWindowLongPtr(parent, GWLP_WNDPROC, (LONG_PTR)mainWindowProc);
        g_prevEditWindowProc = (WNDPROC)SetWindowLongPtr(g_hwndEditBox, GWLP_WNDPROC, (LONG_PTR)editWindowProc);
    }

    ::SendMessageW(g_hwndEditBox, EM_LIMITTEXT, showInfo.maxLength, 0);

    // SendMessage(g_hwndEditBox, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);
    SetWindowPos(g_hwndEditBox,
                 HWND_NOTOPMOST,
                 showInfo.x,
                 windowHeight - showInfo.y - showInfo.height,
                 showInfo.width,
                 showInfo.height,
                 SWP_NOZORDER);

    ::SetWindowTextW(g_hwndEditBox, str2ws(showInfo.defaultValue).c_str());

    // SendMessage(g_hwndEditBox, EM_SETFONTSIZE, 1, 0);
    SendMessage(g_hwndEditBox, EM_SETBKGNDCOLOR, 0, RGB((showInfo.backgroundColor & 0x000000ff), (showInfo.backgroundColor & 0x0000ff00) >> 8, (showInfo.backgroundColor & 0x00ff0000) >> 16));

    ::PostMessage(g_hwndEditBox, WM_ACTIVATE, 0, 0);
    ::ShowWindow(g_hwndEditBox, SW_SHOW);
    /* Get current length of text in the box */
    int index = GetWindowTextLength(g_hwndEditBox);
    SetFocus(g_hwndEditBox);

    SendMessage(g_hwndEditBox, EM_SETSEL, (WPARAM)0, (LPARAM)index);
    // int height = CC_GET_MAIN_SYSTEM_WINDOW()->kheight;
    CHARFORMAT2 cf;
    RECT rect;

    GetWindowRect(getCurrentWindowHwnd(), &rect);
    float WindowRatio = (float)(rect.bottom - rect.top) / (float)CC_GET_MAIN_SYSTEM_WINDOW()->getViewSize().height;
    float JsFontRatio = float(showInfo.fontSize) / 5;
    /** A probale way to calculate the increase of font size
     * OriginalSize + Increase = OriginalSize * Ratio_of_js_fontSize * Ratio_of_window
     * Default value : OriginalSize = 8, Ratio_of_js_fontSize = showInfo.fontSize /5,
     * Ratio_of_window = (float)height / (float)CC_GET_MAIN_SYSTEM_WINDOW()->getViewSize().height
     * thus Increase was calculated.
     */
    int fsize = (float)(JsFontRatio + 8) * WindowRatio - 8;

    SendMessage(g_hwndEditBox, EM_SETFONTSIZE, fsize, 0);
    /* Set the caret to the end of the text in the box */
    SendMessage(g_hwndEditBox, EM_SETSEL, (WPARAM)index, (LPARAM)index);

    cf.cbSize = sizeof(CHARFORMAT2);
    cf.crTextColor = RGB((showInfo.fontColor & 0x000000ff), (showInfo.fontColor & 0x0000ff00) >> 8, (showInfo.fontColor & 0x00ff0000) >> 16);

    cf.crBackColor = RGB((showInfo.backColor & 0x000000ff), (showInfo.backColor & 0x0000ff00) >> 8, (showInfo.backColor & 0x00ff0000) >> 16);
    cf.dwMask = CFM_COLOR | CFM_BOLD | CFM_ITALIC | CFM_UNDERLINE;
    cf.dwEffects = (showInfo.isUnderline ? CFE_UNDERLINE : 0) | (showInfo.isBold ? CFE_BOLD : 0) | (showInfo.isItalic ? CFE_ITALIC : 0);
    cf.bUnderlineColor = showInfo.underlineColor;
    SendMessage(g_hwndEditBox, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);
}

void EditBox::hide() {
    DestroyWindow(g_hwndEditBox);

    SetWindowLongPtr(getCurrentWindowHwnd(), GWLP_WNDPROC, (LONG_PTR)g_prevMainWindowProc);
    SetWindowLongPtr(g_hwndEditBox, GWLP_WNDPROC, (LONG_PTR)g_prevEditWindowProc);
    g_hwndEditBox = nullptr;
}

bool EditBox::complete() {
    callJSFunc("complete", getText(g_hwndEditBox).c_str());
    return true;
}

} // namespace cc
