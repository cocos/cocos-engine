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

#pragma once

#include <iostream>
#include "platform/interfaces/modules/ISystemWindow.h"

struct SDL_Window;

namespace cc {
class SDLHelper;

class CC_DLL SystemWindow : public ISystemWindow {
    friend class SystemWindowManager;

public:
    explicit SystemWindow(uint32_t windowId, void* externalHandle);
    ~SystemWindow() override;

    bool createWindow(const char* title,
                      int w, int h, int flags) override;
    bool createWindow(const char* title,
                      int x, int y, int w,
                      int h, int flags) override;
    void closeWindow() override;

    uint32_t getWindowId() const override;
    uintptr_t getWindowHandle() const override;

    Size getViewSize() const override;
    void setViewSize(uint32_t width, uint32_t height) override {
        _width = width;
        _height = height;
    }
    /*
     @brief enable/disable(lock) the cursor, default is enabled
     */
    void setCursorEnabled(bool value) override;
    void copyTextToClipboard(const std::string& text) override;

private:
    SDL_Window* getSDLWindow() const { return _window; }

    uint32_t _width{0};
    uint32_t _height{0};

    uint32_t _windowId{0};
    uintptr_t _windowHandle{0};
    SDL_Window* _window{nullptr};
};

} // namespace cc
