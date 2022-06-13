/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "SystemWindowManager.h"
#include "BasePlatform.h"
#include "platform/SDLHelper.h"
#include "platform/win32/modules/SystemWindow.h"

namespace cc {

SystemWindowManager *SystemWindowManager::_instance = nullptr;

 SystemWindowManager::SystemWindowManager(IEventDispatch *delegate)
: _sdl(std::make_unique<SDLHelper>(delegate)) {
    _instance = this;
}

int SystemWindowManager::init() {
    return _sdl->init();
}

void SystemWindowManager::poolEvent(bool *quit) {
    return _sdl->pollEvent(quit);
}

void SystemWindowManager::swapWindows() {
    for (auto pair : _windows) {
        SystemWindow *window = dynamic_cast<SystemWindow *>(pair.second.get());
        if (window) {
            window->swapWindow();
        }
    }
}

ISystemWindow *SystemWindowManager::createWindow(const char *name) {
    auto window = BasePlatform::getPlatform()->createNativeWindow();
    _windows.insert(std::make_pair(std::string(name), window));
    return window;
}
} // namespace cc
