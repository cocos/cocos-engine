/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/base/UTF8.h"
#include "cocos/base/Log.h"
#include "PlayerMessageBoxServiceWin.h"

PLAYER_NS_BEGIN

PlayerMessageBoxServiceWin::PlayerMessageBoxServiceWin(HWND hwnd)
: _hwnd(hwnd)
{
}

int PlayerMessageBoxServiceWin::showMessageBox(const std::string &title,
                                               const std::string &message,
                                               int buttonsType /* = BUTTONS_OK */)
{
    std::u16string u16title;
    cc::StringUtils::UTF8ToUTF16(title, u16title);
    std::u16string u16message;
    cc::StringUtils::UTF8ToUTF16(message, u16message);

    CC_LOG_DEBUG("PlayerMessageBoxServiceWin::showMessageBox() - title = %s, message = %s", title.c_str(), message.c_str());

    UINT mbtype = MB_APPLMODAL;
    switch (buttonsType)
    {
    case BUTTONS_OK_CANCEL:
        mbtype |= MB_OKCANCEL | MB_ICONQUESTION;
        break;

    case BUTTONS_YES_NO:
        mbtype |= MB_YESNO | MB_ICONQUESTION;
        break;

    case BUTTONS_YES_NO_CANCEL:
        mbtype |= MB_YESNOCANCEL | MB_ICONQUESTION;
        break;

    default:
        mbtype |= MB_OK | MB_ICONINFORMATION;
    }

    // MessageBox() used by cocos2d
    int result = ::MessageBoxW(_hwnd, (LPCWSTR)u16message.c_str(), (LPCWSTR)u16title.c_str(), mbtype);

    switch (result)
    {
    case IDCANCEL:
        result = BUTTON_CANCEL;
        break;

    case IDYES:
        result = BUTTON_YES;
        break;

    case IDNO:
        result = BUTTON_NO;
        break;

    default:
        result = BUTTON_OK;
    }

    CC_LOG_DEBUG("PlayerMessageBoxServiceWin::showMessageBox() - result = %d", result);

    return result;
}

PLAYER_NS_END
