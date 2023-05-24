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

#include "BufferAllocator.h"
#include "PoolType.h"
#include "base/std/container/vector.h"
#include "cocos/base/Macros.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace se {

class CC_DLL BufferPool final {
public:
    using Chunk = uint8_t *;

    inline static uint32_t getPoolFlag() { return POOL_FLAG; }

    BufferPool(PoolType type, uint32_t entryBits, uint32_t bytesPerEntry);
    ~BufferPool();

    template <class T>
    T *getTypedObject(uint32_t id) const {
        uint32_t chunk = (_chunkMask & id) >> _entryBits;
        uint32_t entry = _entryMask & id;
        CC_ASSERT(chunk < _chunks.size() && entry < _entriesPerChunk);
        return reinterpret_cast<T *>(_chunks[chunk] + (entry * _bytesPerEntry));
    }

    se::Object *allocateNewChunk();

private:
    static constexpr uint32_t POOL_FLAG{1 << 30};

    BufferAllocator _allocator;
    ccstd::vector<Chunk> _chunks;
    uint32_t _entryBits{1 << 8};
    uint32_t _chunkMask{0};
    uint32_t _entryMask{0};
    uint32_t _bytesPerChunk{0};
    uint32_t _entriesPerChunk{0};
    uint32_t _bytesPerEntry{0};
    PoolType _type{PoolType::UNKNOWN};
};

} // namespace se
