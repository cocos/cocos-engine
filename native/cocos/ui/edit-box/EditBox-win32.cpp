/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "EditBox.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/platform/interfaces/modules/ISystemWindow.h"


#include <stdlib.h>
#include <windows.h>
#include <codecvt>
#include <locale>
#include <memory>

namespace cc {

/*************************************************************************
 Global variables and functions.
************************************************************************/

namespace {
bool      g_isMultiline        = false;
HWND      g_hwndEditBox        = nullptr;
WNDPROC   g_prevMainWindowProc = nullptr;
WNDPROC   g_prevEditWindowProc = nullptr;
se::Value g_textInputCallback;

HWND getCurrentWindowHwnd() {
    if (!CC_CURRENT_APPLICATION()) {
        return nullptr;
    }
    ISystemWindow *systemWindowIntf = CC_GET_PLATFORM_INTERFACE(ISystemWindow);
    if (!systemWindowIntf) {
        return nullptr;
    }
    return reinterpret_cast<HWND>(systemWindowIntf->getWindowHandler());
}

int getCocosWindowHeight() {
    //HWND parent = cc_get_application_view()->getWindowHandler();
    HWND parent = getCurrentWindowHwnd();
    RECT rect;
    GetClientRect(parent, &rect);
    return (rect.bottom - rect.top);
}

void getTextInputCallback() {
    if (!g_textInputCallback.isUndefined())
        return;

    auto      global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value jsbVal;
    if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject()) {
        jsbVal.toObject()->getProperty("onTextInput", &g_textInputCallback);
        // free globle se::Value before ScriptEngine clean up
        se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
            g_textInputCallback.setUndefined();
        });
    }
}

void callJSFunc(const std::string &type, const std::string &text) {
    getTextInputCallback();

    se::AutoHandleScope scope;
    se::ValueArray      args;
    args.push_back(se::Value(type));
    args.push_back(se::Value(text));
    g_textInputCallback.toObject()->call(args, nullptr);
}

std::string getText(HWND hwnd) {
    int    length = GetWindowTextLength(hwnd);
    LPWSTR str    = (LPWSTR)malloc(sizeof(WCHAR) * (length + 1));
    GetWindowText(hwnd, str, length + 1);

    std::wstring_convert<std::codecvt_utf8<wchar_t>> convert;
    std::string                                      ret(convert.to_bytes(str));
    free(str);

    return ret;
}

std::wstring str2ws(const std::string &text) {
    if (text.empty())
        return std::wstring();

    int          sz = MultiByteToWideChar(CP_UTF8, 0, &text[0], (int)text.size(), 0, 0);
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
            if (EN_CHANGE == HIWORD(wParam))
                callJSFunc("input", getText(g_hwndEditBox).c_str());

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

        UINT32 flags  = WS_CHILD | ES_LEFT | WS_TABSTOP | ES_AUTOHSCROLL;
        g_isMultiline = showInfo.isMultiline;
        if (g_isMultiline) {
            flags |= ES_MULTILINE;
        }
        if (showInfo.inputType == "password")
            flags |= WS_EX_TRANSPARENT;

        g_hwndEditBox = CreateWindowEx(
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
    SetWindowPos(g_hwndEditBox,
                 HWND_NOTOPMOST,
                 showInfo.x,
                 windowHeight - showInfo.y - showInfo.height,
                 showInfo.width,
                 showInfo.height,
                 SWP_NOZORDER);

    ::SetWindowTextW(g_hwndEditBox, str2ws(showInfo.defaultValue).c_str());
    ::PostMessage(g_hwndEditBox, WM_ACTIVATE, 0, 0);
    ::ShowWindow(g_hwndEditBox, SW_SHOW);
    SetFocus(g_hwndEditBox);
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
