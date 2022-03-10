/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "BufferAllocator.h"
#include "PoolType.h"
#include "cocos/base/Macros.h"
#include "cocos/base/Object.h"
#include "cocos/base/TypeDef.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace se {

class CC_DLL BufferPool final : public cc::Object {
public:
    using Chunk = uint8_t *;

    inline static uint getPoolFlag() { return POOL_FLAG; }

    BufferPool(PoolType type, uint entryBits, uint bytesPerEntry);
    ~BufferPool() override;

    template <class T>
    T *getTypedObject(uint id) const {
        uint chunk = (_chunkMask & id) >> _entryBits;
        uint entry = _entryMask & id;
        CCASSERT(chunk < _chunks.size() && entry < _entriesPerChunk, "BufferPool: Invalid buffer pool entry id");
        return reinterpret_cast<T *>(_chunks[chunk] + (entry * _bytesPerEntry));
    }

    se::Object *allocateNewChunk();

private:
    static constexpr uint POOL_FLAG = 1 << 30;

    BufferAllocator   _allocator;
    cc::vector<Chunk> _chunks;
    uint              _entryBits       = 1 << 8;
    uint              _chunkMask       = 0;
    uint              _entryMask       = 0;
    uint              _bytesPerChunk   = 0;
    uint              _entriesPerChunk = 0;
    uint              _bytesPerEntry   = 0;
    PoolType          _type            = PoolType::UNKNOWN;
};

} // namespace se
