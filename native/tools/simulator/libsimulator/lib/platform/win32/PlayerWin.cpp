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

#include "PlayerWin.h"

using namespace std;
PLAYER_NS_BEGIN

PlayerWin::PlayerWin()
: PlayerProtocol(), _messageBoxService(nullptr), _menuService(nullptr), _editboxService(nullptr), _taskService(nullptr), _hwnd(NULL) {
}

PlayerWin::~PlayerWin() {
    CC_SAFE_DELETE(_menuService);
    CC_SAFE_DELETE(_messageBoxService);
    CC_SAFE_DELETE(_fileDialogService);
}

PlayerWin *PlayerWin::createWithHwnd(HWND hWnd) {
    auto instance = new PlayerWin();
    instance->_hwnd = hWnd;
    instance->initServices();
    return instance;
}

PlayerFileDialogServiceProtocol *PlayerWin::getFileDialogService() {
    return _fileDialogService;
}

PlayerMessageBoxServiceProtocol *PlayerWin::getMessageBoxService() {
    return _messageBoxService;
}

PlayerMenuServiceProtocol *PlayerWin::getMenuService() {
    return _menuService;
}

PlayerEditBoxServiceProtocol *PlayerWin::getEditBoxService() {
    return _editboxService;
}

PlayerTaskServiceProtocol *PlayerWin::getTaskService() {
    return _taskService;
}

// services
void PlayerWin::initServices() {
    CC_ASSERT_NULL(_menuService); // Can't initialize services again.
    _menuService = new PlayerMenuServiceWin(_hwnd);
    _messageBoxService = new PlayerMessageBoxServiceWin(_hwnd);
    _fileDialogService = new PlayerFileDialogServiceWin(_hwnd);
    _editboxService = new PlayerEditBoxServiceWin(_hwnd);
    _taskService = new PlayerTaskServiceWin(_hwnd);
}

PLAYER_NS_END
