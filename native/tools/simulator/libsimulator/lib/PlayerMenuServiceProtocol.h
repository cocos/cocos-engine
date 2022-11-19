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

#ifndef __PLAYER_MENU_SERVICE_PROTOCOL_H
#define __PLAYER_MENU_SERVICE_PROTOCOL_H

#include <string>

#include "PlayerMacros.h"
#include "PlayerServiceProtocol.h"
#include "SimulatorExport.h"
#include "cocos/base/RefCounted.h"

PLAYER_NS_BEGIN

#define kPlayerSuperModifyKey "super"
#define kPlayerShiftModifyKey "shift"
#define kPlayerCtrlModifyKey  "ctrl"
#define kPlayerAltModifyKey   "alt"

class CC_LIBSIM_DLL PlayerMenuItem : public cc::RefCounted {
public:
    virtual ~PlayerMenuItem();

    std::string getMenuId() const;
    std::string getTitle() const;
    int         getOrder() const;
    bool        isGroup() const;
    bool        isEnabled() const;
    bool        isChecked() const;
    std::string getShortcut() const;

    virtual void setTitle(const std::string &title)       = 0;
    virtual void setEnabled(bool enabled)                 = 0;
    virtual void setChecked(bool checked)                 = 0;
    virtual void setShortcut(const std::string &shortcut) = 0;

protected:
    PlayerMenuItem();

    std::string _menuId;
    std::string _title;
    int         _order;
    bool        _isGroup;
    bool        _isEnabled;
    bool        _isChecked; // ignored when isGroup = true
    std::string _shortcut;  // ignored when isGroup = true
};

class PlayerMenuServiceProtocol : public PlayerServiceProtocol {
public:
    static const int MAX_ORDER = 9999;

    virtual PlayerMenuItem *addItem(const std::string &menuId,
                                    const std::string &title,
                                    const std::string &parentId,
                                    int                order = MAX_ORDER)        = 0;
    virtual PlayerMenuItem *addItem(const std::string &menuId,
                                    const std::string &title)     = 0;
    virtual PlayerMenuItem *getItem(const std::string &menuId)    = 0;
    virtual bool            removeItem(const std::string &menuId) = 0;
    virtual void            setMenuBarEnabled(bool enabled)       = 0;
};

PLAYER_NS_END

#endif // __PLAYER_MENU_SERVICE_PROTOCOL_H
