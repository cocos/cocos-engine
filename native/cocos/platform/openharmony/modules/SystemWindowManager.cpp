/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "SystemWindowManager.h"
#include "platform/BasePlatform.h"
#include "platform/SDLHelper.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "platform/openharmony/modules/SystemWindow.h"

namespace cc {

int SystemWindowManager::init() {
    return 0;
}

void SystemWindowManager::processEvent() {
}

ISystemWindow *SystemWindowManager::createWindow(const ISystemWindowInfo &info) {
    ISystemWindow *window = BasePlatform::getPlatform()->createNativeWindow(_nextWindowId, info.externalHandle);
    if (window) {
        if (!info.externalHandle) {
            window->createWindow(info.title.c_str(), info.x, info.y, info.width, info.height, info.flags);
        }
        _windows[_nextWindowId] = std::shared_ptr<ISystemWindow>(window);
        _nextWindowId++;
    }
    return window;
}

ISystemWindow *SystemWindowManager::getWindow(uint32_t windowId) const {
    if (windowId == 0) {
        return nullptr;
    }

    auto iter = _windows.find(windowId);
    if (iter != _windows.end())
        return iter->second.get();
    return nullptr;
}


ISystemWindow *SystemWindowManager::getWindowFromHandle(void *window) const {
    if (!window) {
        return nullptr;
    }
    for (const auto &pair : _windows) {
        ISystemWindow *sysWindow = pair.second.get();
        auto *nativeWindow = reinterpret_cast<void *>(sysWindow->getWindowHandle());
        if (nativeWindow == window) {
            return sysWindow;
        }
    }
    return nullptr;
}

void SystemWindowManager::removeWindow(void* window) {
    if (!window) {
        return;
    }
    for (auto it = _windows.begin(); it != _windows.end(); ++it) {
        ISystemWindow *sysWindow = it->second.get();
        auto *nativeWindow = reinterpret_cast<void *>(sysWindow->getWindowHandle());
        if (nativeWindow == window) {
            _windows.erase(it);
            break;
        }
    }
    return;
}

} // namespace cc
