/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "SDL2/SDL_events.h"
#include "platform/BasePlatform.h"
#include "platform/SDLHelper.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "platform/win32/modules/SystemWindow.h"

namespace cc {

int SystemWindowManager::init() {
    return SDLHelper::init();
}

void SystemWindowManager::processEvent() {
    SDL_Event sdlEvent;
    while (SDL_PollEvent(&sdlEvent) != 0) {
        SDL_Window *sdlWindow = SDL_GetWindowFromID(sdlEvent.window.windowID);
        // SDL_Event like SDL_QUIT does not associate a window
        if (!sdlWindow) {
            SDLHelper::dispatchSDLEvent(0, sdlEvent);
        } else {
            ISystemWindow *window = getWindowFromSDLWindow(sdlWindow);
            CC_ASSERT(window);
            uint32_t windowId = window->getWindowId();
            SDLHelper::dispatchSDLEvent(windowId, sdlEvent);
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
    if (windowId == 0) {
        return nullptr;
    }

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
