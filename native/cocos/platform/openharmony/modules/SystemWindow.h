/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include <ace/xcomponent/native_interface_xcomponent.h>

namespace cc {

class SystemWindow : public ISystemWindow {
public:
    explicit SystemWindow(uint32_t windowId, void* externalHandle);
    ~SystemWindow() override;
    
    bool createWindow(const char* title,
                      int x, int y, int w,
                      int h, int flags) override;

    uint32_t getWindowId() const override;
    uintptr_t getWindowHandle() const override;
    void setWindowHandle(void* window);
    Size getViewSize() const override;
    void setViewSize(uint32_t width, uint32_t height) override;

    /**
     @brief enable/disable(lock) the cursor, default is enabled
     */
    void               setCursorEnabled(bool value) override;

private:
    void* _windowHandle{nullptr};
    uint32_t _windowId{0};
    std::string _id{""};
    uint64_t _width{0};
    uint64_t _height{0};
};

} // namespace cc