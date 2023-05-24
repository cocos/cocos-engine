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

#include <algorithm>
#include <thread>
#include "base/memory/Memory.h"
#include "tbb/global_control.h"

namespace cc {

class TBBJobGraph;

class TBBJobSystem final {
public:
    static TBBJobSystem *getInstance() {
        if (!_instance) {
            _instance = ccnew TBBJobSystem;
        }
        return _instance;
    }

    static void destroyInstance() {
        CC_SAFE_DELETE(_instance);
    }

    TBBJobSystem() noexcept : TBBJobSystem(std::max(2u, std::thread::hardware_concurrency() - 2u)) {}
    explicit TBBJobSystem(uint32_t threadCount) noexcept;

    inline uint32_t threadCount() { return _threadCount; }

private:
    static TBBJobSystem *_instance;

    tbb::global_control _control;
    uint32_t _threadCount{0u};
};

} // namespace cc
