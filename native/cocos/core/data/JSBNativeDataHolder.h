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

#include <cstdint>
#include "base/Utils.h"

namespace cc {
class JSBNativeDataHolder final {
public:
    JSBNativeDataHolder() = default;
    explicit JSBNativeDataHolder(uint8_t* data) : _data(data){};

    ~JSBNativeDataHolder() {
        if (_data != nullptr) {
            free(_data); // Remove data in destructor
        }
    }

    inline void setData(uint8_t* data) { _data = data; }
    inline uint8_t* getData() const { return _data; }

    inline void destroy() { // Also support to invoke destroy method to free memory before garbage collection
        free(_data);
        _data = nullptr;
    }

private:
    uint8_t* _data{nullptr};
};
} // namespace cc