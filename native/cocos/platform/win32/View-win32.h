/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include <Windows.h>
#include <assert.h>
#include <array>
#include <string>
#include "base/Macros.h"
#include "platform/StdC.h"

// SDL headers
#include "sdl2/SDL.h"
#include "sdl2/SDL_main.h"
#include "sdl2/SDL_syswm.h"

#include "cocos/bindings/event/EventDispatcher.h"

namespace cc {

class View {
public:
    View(const std::string &title, int width, int height);
    virtual ~View();

    bool init();

    bool pollEvent(bool *quit, bool *resume, bool *pause, bool *close);

    std::array<int, 2> getViewSize() const { return std::array<int, 2>{_width, _height}; }

    HWND getWindowHandler();

    void swapbuffer() { SDL_GL_SwapWindow(_window); }

    void setCursorEnabeld(bool);

private:
    std::string _title;
    int         _width  = 0;
    int         _height = 0;
    bool        _inited = false;

    SDL_Window *_window = nullptr;
    SDL_Event   sdlEvent;
};

} // namespace cc
