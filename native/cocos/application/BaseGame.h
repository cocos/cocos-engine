/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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
#include <string>
#include "CocosApplication.h"

namespace cc {
class BaseGame : public CocosApplication {
public:
    struct DebuggerInfo {
        bool enabled{true};
        int32_t port{6086};
        std::string address{"0.0.0.0"};
        bool pauseOnStart{false};
    };
    struct WindowInfo {
        std::string title;
        int32_t x{-1};
        int32_t y{-1};
        int32_t width{-1};
        int32_t height{-1};
        int32_t flags{-1};
    };

    BaseGame() = default;
    int init() override;

protected:
    std::string _xxteaKey;
    DebuggerInfo _debuggerInfo;
    WindowInfo _windowInfo;
    std::once_flag _windowCreateFlag;
};
} // namespace cc
