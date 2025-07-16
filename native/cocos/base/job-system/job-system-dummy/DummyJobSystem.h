/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"
#include "base/memory/Memory.h"

namespace cc {

using DummyJobToken = size_t;

class DummyJobGraph;

class DummyJobSystem final {
private:
    static DummyJobSystem *instance;

public:
    static DummyJobSystem *getInstance() {
        if (!instance) {
            instance = ccnew DummyJobSystem;
        }
        return instance;
    }

    static void destroyInstance() {
        delete instance;
        instance = nullptr;
    }

    DummyJobSystem() noexcept = default;
    explicit DummyJobSystem(uint32_t /*threadCount*/) noexcept {}

    inline uint32_t threadCount() const { return THREAD_COUNT; } //NOLINT

private:
    static constexpr uint32_t THREAD_COUNT = 1U; //always one
};

} // namespace cc
