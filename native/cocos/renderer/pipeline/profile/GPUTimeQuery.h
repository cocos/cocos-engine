/****************************************************************************
 Copyright (c) 2023-2023 Xiamen Yaji Software Co., Ltd.

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
#include "base/Ptr.h"
#include "base/std/variant.h"
#include "base/std/container/vector.h"
#include "gfx-base/GFXQueryPool.h"
#include "gfx-base/GFXCommandBuffer.h"

namespace cc::render {

class GPUTimeQuery {
public:
    GPUTimeQuery() = default;
    ~GPUTimeQuery() = default;

    using KeyType = ccstd::variant<uint32_t, uint64_t>;

    void resize(uint32_t size);

    void reset(gfx::CommandBuffer *cmdBuffer);
    void writeTimestamp(gfx::CommandBuffer *cmdBuffer);
    void writeTimestampWithKey(gfx::CommandBuffer *cmdBuffer, const KeyType &key);

    void copyResult(gfx::CommandBuffer *cmdBuffer);

    template <typename Func>
    void foreachData(Func &&func) const {
        const uint64_t *data = getReadBuffer();
        for (uint32_t i = 0; i < _count; ++i) {
            func(_keys[i], data[i]);
        }
    }

private:
    const uint64_t *getReadBuffer() const;

    uint32_t _capacity = 0;
    uint32_t _count = 0;
    uint32_t _frameIndex = 0;
    ccstd::vector<KeyType> _keys;
    ccstd::vector<uint64_t> _results;
    IntrusivePtr<gfx::QueryPool> _queryPool;
    IntrusivePtr<gfx::Buffer> _readBackBuffer;
};

} // namespace cc::render
