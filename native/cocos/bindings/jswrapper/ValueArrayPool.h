/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

#include "Value.h"
#include "base/std/container/array.h"

namespace se {

class CallbackDepthGuard final {
public:
    CallbackDepthGuard(ValueArray &arr, uint32_t &depth, bool needDelete)
    : _arr(arr), _depth(depth), _needDelete(needDelete) {
        ++_depth;
    }

    ~CallbackDepthGuard() {
        --_depth;
        for (auto &e : _arr) {
            e.setUndefined();
        }
        if (_needDelete) {
            delete &_arr;
        }
    }

private:
    ValueArray &_arr;
    uint32_t &_depth;
    const bool _needDelete{false};
};

class ValueArrayPool final {
public:
    static const uint32_t MAX_ARGS = 20;

    ValueArrayPool();

    ValueArray &get(uint32_t argc, bool &outNeedDelete);

    uint32_t _depth{0};

private:
    void initPool(uint32_t index);
    ccstd::vector<ccstd::array<ValueArray, MAX_ARGS + 1>> _pools;
};

extern ValueArrayPool gValueArrayPool;

} // namespace se
