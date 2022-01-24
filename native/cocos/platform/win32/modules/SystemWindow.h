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

#pragma once

#include <iostream>

#include "platform/interfaces/modules/ISystemWindow.h"

struct SDL_Window;
struct SDL_WindowEvent;

namespace cc {

class SystemWindow : public ISystemWindow {
public:
    explicit SystemWindow();
    ~SystemWindow() override;

    class Delegate {
    public:
        virtual ~Delegate()                              = default;
        virtual bool      createWindow(const char* title,
                                       int x, int y, int w,
                                       int h, int flags) = 0;
        virtual uintptr_t getWindowHandler() const       = 0;
    };

    bool      createWindow(const char* title,
                           int x, int y, int w,
                           int h, int flags) override;
    uintptr_t getWindowHandler() const override;

    Size getViewSize() const override;
    /*
     @brief enable/disable(lock) the cursor, default is enabled
     */
    void setCursorEnabled(bool value) override;
    void copyTextToClipboard(const std::string& text) override;

private:
    int _width{0};
    int _height{0};
};

} // namespace cc