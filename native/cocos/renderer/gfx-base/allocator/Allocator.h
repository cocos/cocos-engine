/****************************************************************************
Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/std/container/vector.h"
#include "base/std/container/list.h"
#include <cstdint>

namespace cc::gfx {

struct AllocatorInfo {
    uint64_t blockSize;
};

class Allocator {
public:
    explicit Allocator(const AllocatorInfo &info);
    ~Allocator() = default;

    using Handle = uint32_t;
    static constexpr Handle INVALID_HANDLE = ~(0U);

    struct Allocation {
        uint32_t blockIndex;
        uint64_t offset;
        uint64_t size;
    };

    class IBlock {
    public:
        IBlock() = default;
        virtual ~IBlock() = default;

        virtual bool allocateBlock() = 0;
        virtual void freeBlock(uint32_t index) = 0;
    };

    struct Block {
        uint64_t used;
    };

    Handle allocate(uint64_t size, uint64_t alignment);

    void free(Handle);

    const Allocation *getAllocation(Handle) const;

    void setBlockImpl(IBlock *impl);

    void reset();

private:
    Handle allocateFromBlock(uint32_t blockIndex, uint64_t size);

    AllocatorInfo _info;
    ccstd::vector<Block> _blocks;
    ccstd::vector<Allocation> _allocations;
    ccstd::list<Handle> _freelist;
    IBlock *_impl = nullptr;
};

} // namespace cc::gfx
