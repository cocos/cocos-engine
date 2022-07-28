/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include <iostream>
#include "bindings/event/EventDispatcher.h"

struct SDL_Window;
class OSEvent;
union SDL_Event;
struct SDL_WindowEvent;

namespace cc {
class IEventDispatch;

class SDLHelper {
    friend class SystemWindowManager;

public:
    static SDLHelper* getInstance() {
        return _instance;
    }

public:
    SDLHelper(IEventDispatch* delegate);
    ~SDLHelper();

    int init();
    void swapWindow();
    void swapWindow(SDL_Window* window);

    SDL_Window* createWindow(const char* title,
                      int w, int h, int flags);
    SDL_Window* createWindow(const char* title,
                      int x, int y, int w,
                      int h, int flags);

    void pollEvent(bool* quit);
    int pollEvent(SDL_Event* event);

    uintptr_t getWindowHandle() const { return 0; }
    uintptr_t getWindowHandle(SDL_Window* window) const;
#if (CC_PLATFORM == CC_PLATFORM_LINUX)
    uintptr_t getDisplay() const;
#endif
    void setCursorEnabled(bool value);
    SDL_Window* getSDLWindowHandle() const;

private:
    void dispatchSDLEvent(const SDL_Event& sdlEvent, bool* quit);
    void dispatchSDLEvent(uint32_t windowId, const SDL_Event& sdlEvent, bool* quit);
    void dispatchWindowEvent(uint32_t windowId, const SDL_WindowEvent& wevent);

    bool _isWindowCreated{false};
    IEventDispatch* _delegate{nullptr};
    SDL_Window* _handle{nullptr};

    std::vector<SDL_Window *> _handles;

    static SDLHelper* _instance;
};
} // namespace cc
