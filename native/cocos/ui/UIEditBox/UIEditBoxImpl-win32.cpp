/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013 Jozef Pridavok
 Copyright (c) 2017 zilongshanren

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#include "UIEditBoxImpl-win32.h"

#include "platform/CCPlatformConfig.h"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "UIEditBox.h"
#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include "2d/CCLabel.h"
#include "base/CCDirector.h"
#include "base/ccUTF8.h"

#pragma warning (disable: 4312)

// Structure used to orient the inputbox behavior
struct WIN32INPUTBOX_PARAM
{
    friend class CWin32InputBox;

    //
    IN OPTIONAL bool bMultiline;

    // Pass this as none zero so to use this memory dlg template
    IN OPTIONAL LPVOID DlgTemplateData;

    // Pass this as none ZERO so to load DLGTEMPLATE from resources
    IN OPTIONAL LPCSTR DlgTemplateName;

    // passing both "DlgTemplateName" and "DlgTemplateData" ZERO will cause
    // the dialog to use his default embedded resource

    // Center on monitor or owner window?
    IN OPTIONAL bool bCenter;

    // Want to add more styles to the dialog?
    IN OPTIONAL DWORD dwStylesPlus, dwStylesMinus;
    IN OPTIONAL DWORD dwExStylesPlus, dwExStylesMinus;

    IN LPCSTR szTitle, szPrompt;

    // Return buffer
    std::string* pstrResult;

    IN DWORD nMaxLength;

    // Owner window
    HWND hwndOwner;
    HINSTANCE hInstance;

    short xPos, yPos;

    WIN32INPUTBOX_PARAM();
private:
    HWND hDlg;
};

class CWin32InputBox
{
private:
    WIN32INPUTBOX_PARAM *_param;
    static LRESULT CALLBACK DlgProc(HWND, UINT, WPARAM, LPARAM);
    HWND _hwndEditCtrl;
    int _recursionDepth;
    HHOOK _getMsgHook;

    cocos2d::ui::EditBox::KeyboardReturnType _returnType;
    cocos2d::ui::EditBox::InputMode _inputMode;
    cocos2d::ui::EditBox::InputFlag _inputFlag;
    std::function<void (const char *)> _onTextChange;
    std::function<void (INT_PTR)> _onClose;

    void InitDialog();
    static LRESULT CALLBACK GetMsgProc(int code, WPARAM wParam, LPARAM lParam);

public:

    CWin32InputBox(WIN32INPUTBOX_PARAM *);
    ~CWin32InputBox();

    static INT_PTR InputBoxEx(WIN32INPUTBOX_PARAM *,
        cocos2d::ui::EditBox::KeyboardReturnType eReturnType,
        cocos2d::ui::EditBox::InputMode eInputMode,
        cocos2d::ui::EditBox::InputFlag eInputFlag,
        const std::function<void (const char *)> &onTextChange,
        const std::function<void (INT_PTR)> &onClose);

    static INT_PTR InputBox(
        LPCSTR szTitle,
        LPCSTR szPrompt,
        std::string* pstrResult,
        DWORD nMaxLength,
        bool bMultiLine,
        HWND hwndParent,
        cocos2d::ui::EditBox::KeyboardReturnType eReturnType,
        cocos2d::ui::EditBox::InputMode eInputMode,
        cocos2d::ui::EditBox::InputFlag eInputFlag,
        const std::function<void (const char *)> &onTextChange,
        const std::function<void (INT_PTR)> &onClose);

    void SetText(const char *pText);
    void Close(INT_PTR buttonId);
};

typedef struct _MSDN_DLGTEMPLATEEX
{
    WORD dlgVer;
    WORD signature;
    DWORD helpID;
    DWORD exStyle;
    DWORD style;
    WORD cDlgItems;
    short x;
    short y;
    short cx;
    short cy;
    BYTE  _rest[1]; // rest of structure
} MSDN_DLGTEMPLATEEX;

static bool IsDlgTemplateExtended(DLGTEMPLATE *dlgTemplate)
{
    MSDN_DLGTEMPLATEEX *dgExTemplate = (MSDN_DLGTEMPLATEEX *)dlgTemplate;

    // MSDN excerpt:
    //* dlgVer
    //  Specifies the version number of the extended dialog box template. This member must be 1.
    //* signature
    //  Indicates whether a template is an extended dialog box template.
    // If signature is 0xFFFF, this is an extended dialog box template.
    // In this case, the dlgVer member specifies the template version number.
    // If signature is any value other than 0xFFFF, this is a standard dialog box template that uses the DLGTEMPLATE and DLGITEMTEMPLATE structures.

    return (dgExTemplate->dlgVer == 1) && (dgExTemplate->signature == 0xFFFF);
}

// Use alignment if supported by the compiler
#ifdef _MSC_VER
#if _MSC_VER > 1200
__declspec(align(4))
#endif
#endif

// per the MSDN, the DLGTEMPLATE must be DWORD aligned
// this was generated by the DlgResToDlgTemplate tool
static unsigned char definputbox_dlg[] =
{
    0x01, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc8, 0x00, 0xc8, 0x00, 0x06,
    0x00, 0x16, 0x00, 0x11, 0x00, 0xe7, 0x00, 0x6d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x57, 0x00, 0x69,
    0x00, 0x6e, 0x00, 0x33, 0x00, 0x32, 0x00, 0x49, 0x00, 0x6e, 0x00, 0x70, 0x00, 0x75, 0x00, 0x74,
    0x00, 0x42, 0x00, 0x6f, 0x00, 0x78, 0x00, 0x00, 0x00, 0x08, 0x00, 0xbc, 0x02, 0x00, 0x00, 0x4d,
    0x00, 0x53, 0x00, 0x20, 0x00, 0x53, 0x00, 0x68, 0x00, 0x65, 0x00, 0x6c, 0x00, 0x6c, 0x00, 0x20,
    0x00, 0x44, 0x00, 0x6c, 0x00, 0x67, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x80, 0x00, 0x02, 0x50, 0x06, 0x00, 0x04, 0x00, 0x9d, 0x00, 0x21, 0x00, 0xe8,
    0x03, 0x00, 0x00, 0xff, 0xff, 0x82, 0x00, 0x50, 0x00, 0x72, 0x00, 0x6f, 0x00, 0x6d, 0x00, 0x70,
    0x00, 0x74, 0x00, 0x3a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x80, 0x00, 0x81, 0x50, 0x06, 0x00, 0x25, 0x00, 0xd8, 0x00, 0x0e, 0x00, 0xe9,
    0x03, 0x00, 0x00, 0xff, 0xff, 0x81, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x84, 0x10, 0xa1, 0x50, 0x06, 0x00, 0x37, 0x00, 0xd8, 0x00, 0x31, 0x00, 0xea,
    0x03, 0x00, 0x00, 0xff, 0xff, 0x81, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x50, 0xab, 0x00, 0x04, 0x00, 0x33, 0x00, 0x0e, 0x00, 0x01,
    0x00, 0x00, 0x00, 0xff, 0xff, 0x80, 0x00, 0x4f, 0x00, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x50, 0xab, 0x00, 0x15, 0x00, 0x33,
    0x00, 0x0e, 0x00, 0x02, 0x00, 0x00, 0x00, 0xff, 0xff, 0x80, 0x00, 0x43, 0x00, 0x41, 0x00, 0x4e,
    0x00, 0x43, 0x00, 0x45, 0x00, 0x4c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x40, 0x00, 0x00, 0x27, 0x00, 0x08, 0x00, 0x08, 0x00, 0xff,
    0xff, 0xff, 0xff, 0xff, 0xff, 0x82, 0x00, 0x00, 0x00, 0x00, 0x00
};

static const INT
definputbox_id_prompt = 1000,
definputbox_id_edit1 = 1001,
definputbox_id_edit2 = 1002;

static CWin32InputBox *s_win32InputBox = nullptr;

WIN32INPUTBOX_PARAM::WIN32INPUTBOX_PARAM()
{
    bMultiline = false;
    hwndOwner = 0;
    DlgTemplateName = 0;
    hInstance = (HINSTANCE) ::GetModuleHandle(0);
    DlgTemplateData = definputbox_dlg;

    bCenter = true;

    dwStylesPlus = 0;
    dwExStylesPlus = 0;
    dwStylesMinus = 0xFFFFFFFF;
    dwExStylesMinus = 0xFFFFFFFF;

    xPos = yPos = -1;

    pstrResult = nullptr;
    nMaxLength = (DWORD) -1;
}

CWin32InputBox::CWin32InputBox(WIN32INPUTBOX_PARAM *param)
{
    _param = new (std::nothrow) WIN32INPUTBOX_PARAM(*param);
    _hwndEditCtrl = NULL;
    _recursionDepth = 0;
    _getMsgHook = NULL;
}

CWin32InputBox::~CWin32InputBox()
{
    CC_SAFE_DELETE(_param);
}

INT_PTR CWin32InputBox::InputBoxEx(WIN32INPUTBOX_PARAM *param,
    cocos2d::ui::EditBox::KeyboardReturnType eReturnType,
    cocos2d::ui::EditBox::InputMode eInputMode,
    cocos2d::ui::EditBox::InputFlag eInputFlag,
    const std::function<void (const char *)> &onTextChange,
    const std::function<void (INT_PTR)> &onClose)
{
    // Check mandatory parameters
    if (param->pstrResult == nullptr)
    {
        ::SetLastError(ERROR_INVALID_PARAMETER);
        return 0;
    }

    LPDLGTEMPLATE dlgTemplate;

    if (param->DlgTemplateName != 0)
    {
        HMODULE hModule = (HMODULE)param->hInstance;
#ifdef __MINGW32__
        HRSRC rcDlg = ::FindResource(hModule, (LPWSTR)(ULONG_PTR)(size_t)(param->DlgTemplateName), RT_DIALOG);
#else
        HRSRC rcDlg = ::FindResource(hModule, MAKEINTRESOURCE(param->DlgTemplateName), RT_DIALOG);
#endif
        if (rcDlg == nullptr)
            return 0;

        HGLOBAL hglobalDlg = ::LoadResource(hModule, rcDlg);
        if (hglobalDlg == nullptr)
            return 0;

        dlgTemplate = (LPDLGTEMPLATE)hglobalDlg;
    }
    else if (param->DlgTemplateData != 0)
    {
        dlgTemplate = (LPDLGTEMPLATE)param->DlgTemplateData;
    }

    MSDN_DLGTEMPLATEEX *dlgTemplateEx =
        IsDlgTemplateExtended((LPDLGTEMPLATE)dlgTemplate) ? (MSDN_DLGTEMPLATEEX *)dlgTemplate : 0;

    if (dlgTemplateEx != 0)
    {
        dlgTemplateEx->exStyle |= param->dwExStylesPlus;
        dlgTemplateEx->style |= param->dwStylesPlus;
        dlgTemplateEx->exStyle &= param->dwExStylesMinus;
        dlgTemplateEx->style &= param->dwStylesMinus;

        if (param->bCenter)
            dlgTemplateEx->style |= DS_CENTER;

        if (param->xPos != -1)
            dlgTemplateEx->x = param->xPos;
        if (param->yPos != -1)
            dlgTemplateEx->y = param->yPos;
    }
    else
    {
        dlgTemplate->dwExtendedStyle |= param->dwExStylesPlus;
        dlgTemplate->style |= param->dwStylesPlus;
        dlgTemplate->dwExtendedStyle &= param->dwExStylesMinus;
        dlgTemplate->style &= param->dwStylesMinus;

        if (param->bCenter)
            dlgTemplate->style |= DS_CENTER;

        if (param->xPos != -1)
            dlgTemplate->x = param->xPos;

        if (param->yPos != -1)
            dlgTemplate->y = param->yPos;
    }

    CCASSERT(s_win32InputBox == nullptr, "Only one instance of Win32InputBox allowed");

    s_win32InputBox = new (std::nothrow) CWin32InputBox(param);
    s_win32InputBox->_returnType = eReturnType;
    s_win32InputBox->_inputMode = eInputMode;
    s_win32InputBox->_inputFlag = eInputFlag;
    s_win32InputBox->_onTextChange = onTextChange;
    s_win32InputBox->_onClose = onClose;

    HWND hDlg = ::CreateDialogIndirectParam(param->hInstance, dlgTemplate, param->hwndOwner, (DLGPROC)DlgProc, (LPARAM)s_win32InputBox);
    ::ShowWindow(hDlg, SW_SHOW);
    ::EnableWindow(param->hwndOwner, FALSE);

    return TRUE;
}

INT_PTR CWin32InputBox::InputBox(
    LPCSTR szTitle,
    LPCSTR szPrompt,
    std::string* pstrResult,
    DWORD nResultSize,
    bool bMultiLine,
    HWND hwndParent,
    cocos2d::ui::EditBox::KeyboardReturnType eReturnType,
    cocos2d::ui::EditBox::InputMode eInputMode,
    cocos2d::ui::EditBox::InputFlag eInputFlag,
    const std::function<void (const char *)> &onTextChange,
    const std::function<void (INT_PTR)> &onClose)
{
    WIN32INPUTBOX_PARAM param;

    param.szTitle = szTitle;
    param.szPrompt = szPrompt;
    param.pstrResult = pstrResult;
    param.nMaxLength = nResultSize;
    param.bMultiline = bMultiLine;
    param.hwndOwner = hwndParent;

    return InputBoxEx(&param, eReturnType, eInputMode, eInputFlag, onTextChange, onClose);
}

void CWin32InputBox::InitDialog()
{
    // Set the button captions, associated with ReturnType
    switch (_returnType)
    {
    case cocos2d::ui::EditBox::KeyboardReturnType::DEFAULT:
        ::SetDlgItemTextW(_param->hDlg, IDOK, L"OK");
        break;
    case cocos2d::ui::EditBox::KeyboardReturnType::DONE:
        ::SetDlgItemTextW(_param->hDlg, IDOK, L"DONE");
        break;
    case cocos2d::ui::EditBox::KeyboardReturnType::SEND:
        ::SetDlgItemTextW(_param->hDlg, IDOK, L"SEND");
        break;
    case cocos2d::ui::EditBox::KeyboardReturnType::SEARCH:
        ::SetDlgItemTextW(_param->hDlg, IDOK, L"SEARCH");
        break;
    case cocos2d::ui::EditBox::KeyboardReturnType::GO:
        ::SetDlgItemTextW(_param->hDlg, IDOK, L"GO");
        break;
    }
    ::SetDlgItemTextW(_param->hDlg, IDCANCEL, L"CANCEL");

    // Set other controls
    std::u16string utf16Title;
    cocos2d::StringUtils::UTF8ToUTF16(_param->szTitle, utf16Title);
    ::SetWindowTextW(_param->hDlg, (LPCWSTR) utf16Title.c_str());

    std::u16string utf16Prompt;
    cocos2d::StringUtils::UTF8ToUTF16(_param->szPrompt, utf16Prompt);
    ::SetDlgItemTextW(_param->hDlg, definputbox_id_prompt, (LPCWSTR) utf16Prompt.c_str());

    HWND hwndEdit1 = ::GetDlgItem(_param->hDlg, definputbox_id_edit1);
    HWND hwndEdit2 = ::GetDlgItem(_param->hDlg, definputbox_id_edit2);

    if (_param->bMultiline)
        _hwndEditCtrl = hwndEdit2;
    else
        _hwndEditCtrl = hwndEdit1;

    std::u16string utf16Result;
    cocos2d::StringUtils::UTF8ToUTF16(*_param->pstrResult, utf16Result);
    ::SetWindowTextW(_hwndEditCtrl, (LPCWSTR) utf16Result.c_str());

    RECT rectDlg, rectEdit1, rectEdit2;

    ::GetWindowRect(_param->hDlg, &rectDlg);
    ::GetWindowRect(hwndEdit1, &rectEdit1);
    ::GetWindowRect(hwndEdit2, &rectEdit2);

    if (_param->bMultiline)
    {
        ::ShowWindow(hwndEdit1, SW_HIDE);
        ::SetWindowPos(
            hwndEdit2,
            HWND_NOTOPMOST,
            rectEdit1.left - rectDlg.left,
            (rectEdit1.top - rectDlg.top) - (rectEdit1.bottom - rectEdit1.top),
            0,
            0,
            SWP_NOSIZE | SWP_NOZORDER);

        ::SetWindowPos(
            _param->hDlg,
            HWND_NOTOPMOST,
            0,
            0,
            rectDlg.right - rectDlg.left,
            rectDlg.bottom - rectDlg.top - (rectEdit1.bottom - rectEdit1.top),
            SWP_NOMOVE);
    }
    else
    {
        ::SetWindowPos(
            _param->hDlg,
            HWND_NOTOPMOST,
            0,
            0,
            rectDlg.right - rectDlg.left,
            rectEdit1.bottom - rectDlg.top + 5,
            SWP_NOMOVE);

        ::ShowWindow(hwndEdit2, SW_HIDE);
    }

    // Sets the text limit of the edit control.
    // wParam is the maximum number of WCHARs the user can enter. For Unicode text, wParam is the number of characters.
    // Please refer to https://msdn.microsoft.com/en-us/library/bb761607%28v=vs.85%29.aspx
    if ((int)_param->nMaxLength > 0)
    {
        ::SendMessageW(hwndEdit1, EM_LIMITTEXT, (WPARAM)_param->nMaxLength, 0);
        ::SendMessageW(hwndEdit2, EM_LIMITTEXT, (WPARAM)_param->nMaxLength, 0);
    }

    switch (_inputFlag)
    {
    case cocos2d::ui::EditBox::InputFlag::PASSWORD:
        // Sets a password character displayed in a edit control when the user types text.
        // Please refer to https://msdn.microsoft.com/en-us/library/bb761653%28v=vs.85%29.aspx
        ::SendMessageW(hwndEdit1, EM_SETPASSWORDCHAR, (WPARAM)L'*', 0);
        ::SendMessageW(hwndEdit2, EM_SETPASSWORDCHAR, (WPARAM)L'*', 0);
        break;
    case cocos2d::ui::EditBox::InputFlag::SENSITIVE:
        break;
    case cocos2d::ui::EditBox::InputFlag::INITIAL_CAPS_WORD:
        break;
    case cocos2d::ui::EditBox::InputFlag::INITIAL_CAPS_SENTENCE:
        break;
    case cocos2d::ui::EditBox::InputFlag::INITIAL_CAPS_ALL_CHARACTERS:
        // Converts all characters to lowercase as they are typed into the edit control.
        // Please refer to https://msdn.microsoft.com/en-us/library/bb775464%28v=vs.85%29.aspx
        ::SetWindowLongW(hwndEdit1, GWL_STYLE, ::GetWindowLongW(hwndEdit1, GWL_STYLE) | ES_UPPERCASE);
        ::SetWindowLongW(hwndEdit2, GWL_STYLE, ::GetWindowLongW(hwndEdit2, GWL_STYLE) | ES_UPPERCASE);
        break;
    default:
        break;
    }

    switch (_inputMode)
    {
    case cocos2d::ui::EditBox::InputMode::ANY:
        break;
    case cocos2d::ui::EditBox::InputMode::EMAIL_ADDRESS:
        break;
    case cocos2d::ui::EditBox::InputMode::NUMERIC:
        // Allows only digits to be entered into the edit control.
        // Note that, even with this set, it is still possible to paste non-digits into the edit control.
        // Please refer to https://msdn.microsoft.com/en-us/library/bb775464%28v=vs.85%29.aspx
        ::SetWindowLongW(hwndEdit1, GWL_STYLE, ::GetWindowLongW(hwndEdit1, GWL_STYLE) | ES_NUMBER);
        ::SetWindowLongW(hwndEdit2, GWL_STYLE, ::GetWindowLongW(hwndEdit2, GWL_STYLE) | ES_NUMBER);
        break;
    case cocos2d::ui::EditBox::InputMode::PHONE_NUMBER:
        break;
    case cocos2d::ui::EditBox::InputMode::URL:
        break;
    case cocos2d::ui::EditBox::InputMode::DECIMAL:
        break;
    case cocos2d::ui::EditBox::InputMode::SINGLE_LINE:
        break;
    default:
        break;
    }
    CCASSERT(_getMsgHook == NULL, "Windows Message hook already set");

    // To make the enter key work, here need a Windows Message hook.
    // Please refer to https://support.microsoft.com/en-us/kb/187988
    _getMsgHook = ::SetWindowsHookEx(WH_GETMESSAGE, &CWin32InputBox::GetMsgProc, ::GetModuleHandle(nullptr), ::GetCurrentThreadId());
}

LRESULT CALLBACK CWin32InputBox::GetMsgProc(int code, WPARAM wParam, LPARAM lParam)
{
    if (code == HC_ACTION)
    {
        LPMSG lpMsg = (LPMSG)lParam;
        if (lpMsg->message == WM_KEYDOWN)
        {
            if (lpMsg->wParam == VK_RETURN)  // User has hit the ENTER key.
            {
                // Translate the message manually.
                lpMsg->hwnd = s_win32InputBox->_param->hDlg;
                lpMsg->message = WM_COMMAND;
                lpMsg->wParam = IDOK;
            }
        }
    }
    return ::CallNextHookEx(s_win32InputBox->_getMsgHook, code, wParam, lParam);
}

// Message handler for about box.
LRESULT CALLBACK CWin32InputBox::DlgProc(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    CWin32InputBox *_this = (CWin32InputBox *) ::GetWindowLongPtr(hDlg, GWLP_USERDATA);

    switch (message)
    {
        case WM_INITDIALOG:
        {
            SetWindowLongPtr(hDlg, GWLP_USERDATA, (LONG_PTR)lParam);
    
            _this = (CWin32InputBox *)lParam;
            _this->_param->hDlg = hDlg;
            _this->InitDialog();
            return TRUE;
        }

        case WM_COMMAND:
        {
#ifdef _MY_DEBUG
            CHAR buf[1024];
            static int i = 0;
            sprintf(buf, "WM_COMMAND: %09d wParam=%08X lParam=%08X\n", i++, wParam, lParam);
            OutputDebugStringA(buf);
#endif
            INT_PTR buttonId = LOWORD(wParam);
            if (buttonId == IDOK || buttonId == IDCANCEL)
            {
                 // Yes! Just close the dialog box simply,
                 // because the text of EditBox has been already synced at the moment of text altered in the edit control
                 _this->Close(buttonId);
                 return TRUE;
            }
    
            // text altered in the edit control
            // Please refer to https://msdn.microsoft.com/en-us/library/bb761676%28v=vs.85%29.aspx
            if (HIWORD(wParam) == EN_CHANGE && _this->_recursionDepth == 0)
            {
                std::u16string wstrResult;
                std::string utf8Result;
    
                int inputLength = ::GetWindowTextLengthW(_this->_hwndEditCtrl);
                wstrResult.resize(inputLength);
    
                ::GetWindowTextW(_this->_hwndEditCtrl, (LPWSTR) const_cast<char16_t*>(wstrResult.c_str()), inputLength+1);
                bool conversionResult = cocos2d::StringUtils::UTF16ToUTF8(wstrResult, utf8Result);
                _this->_param->pstrResult->clear();
                ++_this->_recursionDepth;  // Prevent recursive calls
                if (conversionResult)
                {
                    *(_this->_param->pstrResult) = std::move(utf8Result);
                }
    
                // Invoke editBoxTextChanged indirectly
                _this->_onTextChange(_this->_param->pstrResult->c_str());
                --_this->_recursionDepth;
                return TRUE;
            }
            break;
        }
    }
    return FALSE;
}

void CWin32InputBox::SetText(const char* pText)
{
    if (_hwndEditCtrl != NULL)
    {
        std::u16string utf16Text;
        cocos2d::StringUtils::UTF8ToUTF16(pText, utf16Text);

        // Keep the cursor position
        // Please refer to :
        // https://msdn.microsoft.com/en-us/library/bb761598%28v=vs.85%29.aspx
        // https://msdn.microsoft.com/en-us/library/bb761661%28v=vs.85%29.aspx
        size_t len = utf16Text.length();
        DWORD beginPos, endPos;
        ::SendMessageW(_hwndEditCtrl, EM_GETSEL, (WPARAM)&beginPos, (LPARAM)&endPos);
        ::SendMessageW(_hwndEditCtrl, WM_SETTEXT, 0, (LPARAM)utf16Text.c_str());
        ::SendMessageW(_hwndEditCtrl, EM_SETSEL, (WPARAM)std::min<long>(beginPos, len), (LPARAM)std::min<long>(endPos, len));
    }
}

void CWin32InputBox::Close(INT_PTR buttonId)
{
    if (_getMsgHook != NULL)
    {
        ::UnhookWindowsHookEx(_getMsgHook);
        _getMsgHook = NULL;
    }

    if (_param->hDlg != NULL)
    {
        ::EnableWindow(_param->hwndOwner, TRUE);
        ::SetFocus(_param->hwndOwner);
        ::DestroyWindow(_param->hDlg);
        _param->hDlg = NULL;

        _onClose(buttonId);
    }
}

NS_CC_BEGIN

namespace ui {

EditBoxImpl* __createSystemEditBox(EditBox* pEditBox)
{
    return new (std::nothrow) EditBoxImplWin(pEditBox);
}

EditBoxImplWin::EditBoxImplWin(EditBox* pEditText)
: EditBoxImplCommon(pEditText)
{

}

EditBoxImplWin::~EditBoxImplWin()
{
}

bool EditBoxImplWin::isEditing()
{
    return false;
}

void EditBoxImplWin::createNativeControl(const Rect & frame)
{
}

void EditBoxImplWin::setNativeFont(const char * pFontName, int fontSize)
{
}



void EditBoxImplWin::setNativeFontColor(const Color4B & color)
{
}

void EditBoxImplWin::setNativePlaceholderFont(const char * pFontName, int fontSize)
{
}

void EditBoxImplWin::setNativePlaceholderFontColor(const Color4B& color)
{

}

void EditBoxImplWin::setNativeInputMode(EditBox::InputMode inputMode)
{

}
void EditBoxImplWin::setNativeInputFlag(EditBox::InputFlag inputFlag)
{

}
void EditBoxImplWin::setNativeReturnType(EditBox::KeyboardReturnType returnType)
{

}
void EditBoxImplWin::setNativeText(const char* pText)
{

}
void EditBoxImplWin::setNativePlaceHolder(const char* pText)
{

}
void EditBoxImplWin::setNativeVisible(bool visible)
{

}
void EditBoxImplWin::updateNativeFrame(const Rect& rect)
{

}
const char* EditBoxImplWin::getNativeDefaultFontName()
{
    return "Arial";
}
void EditBoxImplWin::nativeOpenKeyboard()
{

}
void EditBoxImplWin::nativeCloseKeyboard()
{

}
void EditBoxImplWin::setNativeMaxLength(int maxLength)
{

}

}

NS_CC_END

#endif /* (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) */
