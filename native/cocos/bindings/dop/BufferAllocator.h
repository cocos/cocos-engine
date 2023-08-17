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

#include "PoolType.h"
#include "cocos/base/Macros.h"
#include "cocos/base/std/container/unordered_map.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace se {

class CC_DLL BufferAllocator final {
public:
    explicit BufferAllocator(PoolType type);
    ~BufferAllocator();

    se::Object *alloc(uint32_t index, uint32_t bytes);
    void free(uint32_t index);

private:
    static constexpr uint32_t BUFFER_MASK = ~(1 << 30);

    ccstd::unordered_map<uint32_t, se::Object *> _buffers;
    PoolType _type = PoolType::UNKNOWN;
};

} // namespace se
