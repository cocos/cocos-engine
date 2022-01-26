/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include <array>
#include "Value.h"

namespace se {

class CallbackDepthGuard final {
public:
    CallbackDepthGuard(ValueArray &arr, uint32_t &depth)
    : _arr(arr), _depth(depth) {
        ++_depth;
    }

    ~CallbackDepthGuard() {
        --_depth;
        for (auto &e : _arr) {
            e.setUndefined();
        }
    }

private:
    ValueArray &_arr;
    uint32_t &  _depth;
};

class ValueArrayPool final {
public:
    static const uint32_t MAX_ARGS = 20;

    ValueArrayPool();

    ValueArray &get(uint32_t argc);

    uint32_t _depth{0};

private:
    void                                              initPool(uint32_t index);
    std::vector<std::array<ValueArray, MAX_ARGS + 1>> _pools;
};

extern ValueArrayPool gValueArrayPool;

} // namespace se
