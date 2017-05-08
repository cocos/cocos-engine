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
#include <tchar.h>
#include <stdio.h>
#include "2d/CCLabel.h"
#include "base/CCDirector.h"
#include "base/ccUTF8.h"
#include <Commctrl.h>
#include <windows.h>


NS_CC_BEGIN

namespace ui {

bool EditBoxImplWin::s_isInitialized = false;
int EditBoxImplWin::s_editboxChildID = 100;
void EditBoxImplWin::lazyInit()
{
    HWND hwnd = cocos2d::Director::getInstance()->getOpenGLView()->getWin32Window();
    LONG style = GetWindowLong(hwnd, GWL_STYLE);
    SetWindowLong(hwnd, GWL_STYLE, style | WS_CLIPCHILDREN);
    s_isInitialized = true;
}

EditBoxImpl* __createSystemEditBox(EditBox* pEditBox)
{
    return new (std::nothrow) EditBoxImplWin(pEditBox);
}

EditBoxImplWin::EditBoxImplWin(EditBox* pEditText)
: EditBoxImplCommon(pEditText)
{
    if (!s_isInitialized)
    {
        lazyInit();
    }

    hwndCocos = cocos2d::Director::getInstance()->getOpenGLView()->getWin32Window();
    hInstance = GetModuleHandle(NULL);
    s_editboxChildID++;

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
    hwndEdit = CreateWindowEx(
        WS_EX_CLIENTEDGE, L"EDIT",   // predefined class 
        NULL,         // no window title 
        WS_CHILD |
        ES_LEFT | WS_BORDER | ES_AUTOHSCROLL | ES_AUTOVSCROLL | WS_EX_TRANSPARENT,
        2, 14, 200, 50,   // set size in WM_SIZE message 
        hwndCocos,         // parent window 
        (HMENU)s_editboxChildID,   // edit control ID 
        hInstance,
        NULL);        // pointer not needed 
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
    // Allows only digits to be entered into the edit control.
    // Note that, even with this set, it is still possible to paste non-digits into the edit control.
    // Please refer to https://msdn.microsoft.com/en-us/library/bb775464%28v=vs.85%29.aspx
    // ::SetWindowLongW(hwndEdit1, GWL_STYLE, ::GetWindowLongW(hwndEdit1, GWL_STYLE) | ES_NUMBER);
    // ::SetWindowLongW(hwndEdit2, GWL_STYLE, ::GetWindowLongW(hwndEdit2, GWL_STYLE) | ES_NUMBER);
}
void EditBoxImplWin::setNativeInputFlag(EditBox::InputFlag inputFlag)
{

    // // Converts all characters to lowercase as they are typed into the edit control.
    // // Please refer to https://msdn.microsoft.com/en-us/library/bb775464%28v=vs.85%29.aspx
    // ::SetWindowLongW(hwndEdit1, GWL_STYLE, ::GetWindowLongW(hwndEdit1, GWL_STYLE) | ES_UPPERCASE);
    // ::SetWindowLongW(hwndEdit2, GWL_STYLE, ::GetWindowLongW(hwndEdit2, GWL_STYLE) | ES_UPPERCASE);
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
    if (visible)
    {
        ::ShowWindow(hwndEdit, SW_SHOW);
    }
    else
    {
        ::ShowWindow(hwndEdit, SW_HIDE);
    }
}
void EditBoxImplWin::updateNativeFrame(const Rect& rect)

{
    // ::SetWindowPos(
    //     hwndEdit2,
    //     HWND_NOTOPMOST,
    //     rectEdit1.left - rectDlg.left,
    //     (rectEdit1.top - rectDlg.top) - (rectEdit1.bottom - rectEdit1.top),
    //     0,
    //     0,
    //     SWP_NOSIZE | SWP_NOZORDER);

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
    // // Sets the text limit of the edit control.
    // // wParam is the maximum number of WCHARs the user can enter. For Unicode text, wParam is the number of characters.
    // // Please refer to https://msdn.microsoft.com/en-us/library/bb761607%28v=vs.85%29.aspx
    // if ((int)_param->nMaxLength > 0)
    // {
    //     ::SendMessageW(hwndEdit1, EM_LIMITTEXT, (WPARAM)_param->nMaxLength, 0);
    //     ::SendMessageW(hwndEdit2, EM_LIMITTEXT, (WPARAM)_param->nMaxLength, 0);
    // }
}

LRESULT EditBoxImplWin::WndProc(HWND, UINT, WPARAM, LPARAM)
{
    return LRESULT();
}

}

NS_CC_END

#endif /* (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) */
