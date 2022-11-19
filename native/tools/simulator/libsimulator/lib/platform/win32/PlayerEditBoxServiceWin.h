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


#ifndef __PLAYER_EDITBOX_SERVICE_WIN_H_
#define __PLAYER_EDITBOX_SERVICE_WIN_H_

#include "stdafx.h"
#include "PlayerEditBoxServiceProtocol.h"
#include <array>

typedef std::array<uint8_t, 3> Color3B;

PLAYER_NS_BEGIN

class PlayerEditBoxServiceWin : public PlayerEditBoxServiceProtocol
{
public:
    PlayerEditBoxServiceWin(HWND hwnd);
    virtual ~PlayerEditBoxServiceWin();

    virtual void showSingleLineEditBox(const cc::Rect &rect);
    virtual void showMultiLineEditBox(const cc::Rect &rect);
    virtual void hide();

    virtual void setText(const std::string &text);
    virtual void setFont(const std::string &name, int size);
    virtual void setFontColor(const Color3B &color);

    virtual void setFormator(int formator);
protected:
    HWND _hwnd;
    HWND _hwndSingle;
    HWND _hwndMulti;
    HFONT _hfont;

    void removeFont();
};

PLAYER_NS_END

#endif // __PLAYER_EDITBOX_SERVICE_WIN_H_
