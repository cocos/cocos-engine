/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "platform/java/modules/SystemWindow.h"

namespace cc {


int SystemWindowManager::init() {
    return 0;
}

void SystemWindowManager::processEvent(bool *quit) {
}

void SystemWindowManager::swapWindows() {
}

ISystemWindow *SystemWindowManager::createWindow(const ISystemWindowInfo &info) {
    if (!isExternalHandleExist(info.externalHandle)) {
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
    return getWindowFromANativeWindow(static_cast<ANativeWindow *>(info.externalHandle));
}

ISystemWindow *SystemWindowManager::getWindow(uint32_t windowId) const {
    if (windowId == 0) {
        return nullptr;
    }

    auto iter = _windows.find(windowId);
    if (iter != _windows.end()) {
        return iter->second.get();
    }
    return nullptr;
}

ISystemWindow *SystemWindowManager::getWindowFromANativeWindow(ANativeWindow *window) const {
    if (!window) {
        return nullptr;
    }
    for (const auto &pair : _windows) {
        ISystemWindow *sysWindow = pair.second.get();
        auto *nativeWindow = reinterpret_cast<ANativeWindow *>(sysWindow->getWindowHandle());
        if (nativeWindow == window) {
            return sysWindow;
        }
    }
    return nullptr;
}

bool SystemWindowManager::isExternalHandleExist(void *externalHandle) const {
    return std::any_of(_windows.begin(), _windows.end(), [externalHandle](const auto &pair) {
        auto *handle = reinterpret_cast<void *>(pair.second->getWindowHandle());
        return handle == externalHandle;
    });
}
} // namespace cc
