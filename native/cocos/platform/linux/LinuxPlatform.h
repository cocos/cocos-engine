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

#include "platform/UniversalPlatform.h"

namespace cc {
class SystemWindow;
class SystemWindowManager;

class CC_DLL LinuxPlatform : public UniversalPlatform {
public:
    LinuxPlatform();
    /**
     * Destructor of WindowPlatform.
     */
    ~LinuxPlatform() override;
    /**
     * Implementation of Windows platform initialization.
     */
    int32_t init() override;

    int32_t loop() override;

    ISystemWindow *createNativeWindow(uint32_t windowId, void *externalHandle) override;

private:
    bool _quit{false};
    std::shared_ptr<SystemWindowManager> _windowManager{nullptr};
    std::shared_ptr<SystemWindow> _window{nullptr};
};

} // namespace cc
