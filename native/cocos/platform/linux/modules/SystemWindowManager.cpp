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
#include "SDL2/SDL_events.h"
#include "platform/BasePlatform.h"
#include "platform/SDLHelper.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "platform/linux/modules/SystemWindow.h"

namespace cc {

int SystemWindowManager::init() {
    return SDLHelper::init();
}

void SystemWindowManager::processEvent(bool *quit) {
    SDL_Event sdlEvent;
    while (SDL_PollEvent(&sdlEvent) != 0) {
        SDL_Window *sdlWindow = SDL_GetWindowFromID(sdlEvent.window.windowID);
        // SDL_Event like SDL_QUIT does not associate a window
        if (!sdlWindow) {
            SDLHelper::dispatchSDLEvent(0, sdlEvent, quit);
        } else {
            ISystemWindow *window = getWindowFromSDLWindow(sdlWindow);
            CC_ASSERT(window);
            uint32_t windowId = window->getWindowId();
            SDLHelper::dispatchSDLEvent(windowId, sdlEvent, quit);
        }
        if (*quit) {
            break;
        }
    }
}

void SystemWindowManager::swapWindows() {
    for (const auto &pair : _windows) {
        SystemWindow *window = static_cast<SystemWindow *>(pair.second.get());
        if (window) {
            window->swapWindow();
        }
    }
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
    if (windowId == 0)
        return nullptr;

    auto iter = _windows.find(windowId);
    if (iter != _windows.end())
        return iter->second.get();
    return nullptr;
}

cc::ISystemWindow *SystemWindowManager::getWindowFromSDLWindow(SDL_Window *window) const {
    for (const auto &iter : _windows) {
        SystemWindow *sysWindow = static_cast<SystemWindow *>(iter.second.get());
        SDL_Window *sdlWindow = sysWindow->getSDLWindow();
        if (sdlWindow == window) {
            return sysWindow;
        }
    }
    return nullptr;
}

} // namespace cc
