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


#ifndef __PLAYER_MENU_SERVICE_WIN_H_
#define __PLAYER_MENU_SERVICE_WIN_H_

#include <string>
#include <unordered_map>

#include "cocos/base/RefVector.h"
#include "stdafx.h"
#include "PlayerMenuServiceProtocol.h"
#include "SimulatorExport.h"

PLAYER_NS_BEGIN

class CC_LIBSIM_DLL PlayerMenuItemWin : public PlayerMenuItem
{
public:
    static PlayerMenuItemWin *create(const std::string &menuId, const std::string &title);
    virtual ~PlayerMenuItemWin();

    virtual void setTitle(const std::string &title);
    virtual void setEnabled(bool enabled);
    virtual void setChecked(bool checked);
    virtual void setShortcut(const std::string &shortcut);

protected:
    PlayerMenuItemWin();

    PlayerMenuItemWin *_parent;
    UINT _commandId;
    HMENU _hmenu;
    bool _menubarEnabled;
    cc::RefVector<PlayerMenuItemWin*> _children;

    friend class PlayerMenuServiceWin;
};

class CC_LIBSIM_DLL PlayerMenuServiceWin : public PlayerMenuServiceProtocol
{
public:
    PlayerMenuServiceWin(HWND hwnd);
    virtual ~PlayerMenuServiceWin();

    virtual PlayerMenuItem *addItem(const std::string &menuId,
                                    const std::string &title,
                                    const std::string &parentId,
                                    int order = MAX_ORDER);
    virtual PlayerMenuItem *addItem(const std::string &menuId,
                                    const std::string &title);
    virtual PlayerMenuItem *getItem(const std::string &menuId);
    virtual bool removeItem(const std::string &menuId);
    virtual void setMenuBarEnabled(bool enabled);

    PlayerMenuItemWin *getItemByCommandId(WORD commandId);

private:
    static WORD _newCommandId;

    HWND _hwnd;
    bool _menubarEnabled;
    PlayerMenuItemWin _root;
    std::unordered_map<std::string, PlayerMenuItemWin*> _items;
    std::unordered_map<WORD, std::string> _commandId2menuId;

    bool removeItemInternal(const std::string &menuId, bool isUpdateChildrenOrder);
    void updateChildrenOrder(PlayerMenuItemWin *parent);
};

PLAYER_NS_END

#endif // __PLAYER_MENU_SERVICE_WIN_H_
