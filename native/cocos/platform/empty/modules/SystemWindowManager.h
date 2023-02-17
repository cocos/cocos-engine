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

#include "base/std/container/unordered_map.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

namespace cc {

class ISystemWindow;

class SystemWindowManager : public ISystemWindowManager {
public:
    explicit SystemWindowManager() = default;

    int init() override;
    void processEvent() override;

    ISystemWindow *createWindow(const ISystemWindowInfo &info) override;
    ISystemWindow *getWindow(uint32_t windowId) const override;
    const SystemWindowMap &getWindows() const override { return _windows; }

private:
    uint32_t _nextWindowId{1}; // start from 1, 0 means an invalid ID
    SystemWindowMap _windows;
};
} // namespace cc
