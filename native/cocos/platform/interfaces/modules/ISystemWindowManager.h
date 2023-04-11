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
#include "platform/interfaces/OSInterface.h"

namespace cc {
class ISystemWindow;

struct ISystemWindowInfo {
    ccstd::string title;
    int32_t x{-1};
    int32_t y{-1};
    int32_t width{-1};
    int32_t height{-1};
    int32_t flags{-1};
    void *externalHandle{nullptr};
};

// key: window id
using SystemWindowMap = ccstd::unordered_map<uint32_t, std::shared_ptr<ISystemWindow>>;

/**
 * Responsible for creating, finding ISystemWindow object and message handling
 */
class ISystemWindowManager : public OSInterface {
public:
    /**
     * Initialize the NativeWindow environment
     * @return 0 Succeed -1 Failed
     */
    virtual int init() = 0;

    /**
     * Process messages at the PAL layer
     */
    virtual void processEvent() = 0;

    /**
     * Create an ISystemWindow object
     * @param info window description
     * @return The created ISystemWindow object，if failed then return nullptr
     */
    virtual ISystemWindow *createWindow(const ISystemWindowInfo &info) = 0;

    /**
     * Find an ISystemWindow object
     * @param windowId unique ID of window
     */
    virtual ISystemWindow *getWindow(uint32_t windowId) const = 0;

    /**
     * Retrive all windows
     */
    virtual const SystemWindowMap &getWindows() const = 0;
};
} // namespace cc
