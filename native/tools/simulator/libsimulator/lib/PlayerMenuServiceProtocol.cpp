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


#include "PlayerMenuServiceProtocol.h"

PLAYER_NS_BEGIN

PlayerMenuItem::PlayerMenuItem()
: _order(0)
, _isGroup(false)
, _isEnabled(true)
, _isChecked(false)
{
}

PlayerMenuItem::~PlayerMenuItem()
{
}

std::string PlayerMenuItem::getMenuId() const
{
    return _menuId;
}

std::string PlayerMenuItem::getTitle() const
{
    return _title;
}

int PlayerMenuItem::getOrder() const
{
    return _order;
}

bool PlayerMenuItem::isGroup() const
{
    return _isGroup;
}

bool PlayerMenuItem::isEnabled() const
{
    return _isEnabled;
}

bool PlayerMenuItem::isChecked() const
{
    return _isChecked;
}

std::string PlayerMenuItem::getShortcut() const
{
    return _shortcut;
}

PLAYER_NS_END
