/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include <iostream>
#include "engine/EngineEvents.h"

struct SDL_Window;
union SDL_Event;
struct SDL_WindowEvent;

namespace cc {

class SDLHelper {
    friend class SystemWindowManager;

public:
    SDLHelper();
    ~SDLHelper();

    static int init();

    static SDL_Window* createWindow(const char* title,
                                    int w, int h, int flags);
    static SDL_Window* createWindow(const char* title,
                                    int x, int y, int w,
                                    int h, int flags);

    static uintptr_t getWindowHandle(SDL_Window* window);
#if (CC_PLATFORM == CC_PLATFORM_LINUX)
    static uintptr_t getDisplay(SDL_Window* window);
#endif
    static void setCursorEnabled(bool value);

private:
    static void dispatchSDLEvent(uint32_t windowId, const SDL_Event& sdlEvent);
    static void dispatchWindowEvent(uint32_t windowId, const SDL_WindowEvent& wevent);
};
} // namespace cc
