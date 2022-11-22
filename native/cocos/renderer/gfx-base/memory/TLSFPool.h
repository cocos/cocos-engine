/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-base/memory/ObjectChunkPool.h"
#include "gfx-base/memory/MemoryView.h"

namespace cc::gfx {

template <typename T>
constexpr T log2(T n) { // NOLINT(misc-no-recursion)
    return ((n < 2) ? 0 : 1 + log2(n / 2));
}

class TLSFPool {
public:
    TLSFPool() = default;
    ~TLSFPool() = default;

    TLSFPool(const TLSFPool &) = delete;
    TLSFPool &operator=(const TLSFPool &) = delete;

    TLSFPool(TLSFPool &&) noexcept = default;
    TLSFPool &operator=(TLSFPool &&) noexcept = default;

    struct Descriptor {
        uint64_t poolSize = 0;
    };

    void initialize(const Descriptor &);

    static constexpr uint32_t POOL_BLOCK_NUM_PER_CHUNK = 64;
    static constexpr uint32_t SECOND_LEVEL_INDEX = 4;                       // SLI, reasonable values are 4 or 5.
    static constexpr uint32_t SECOND_LEVEL_COUNT = 1 << SECOND_LEVEL_INDEX; // second level split count
    static constexpr uint32_t MIN_BLOCK_SIZE = 256;                         // MBS
    static constexpr uint32_t SMALL_BUFFER_STEP = MIN_BLOCK_SIZE / SECOND_LEVEL_COUNT;
    static constexpr uint32_t DEFAULT_POOL_SIZE = 1024 * 1024 * 32;         // 32M
    static constexpr uint32_t FIRST_LEVEL_SHIFT = log2(MIN_BLOCK_SIZE);
    static constexpr uint32_t MAX_FIRST_LEVEL_INDEX = 31;
    static constexpr uint32_t MAX_FIRST_LEVEL_COUNT = MAX_FIRST_LEVEL_INDEX - FIRST_LEVEL_SHIFT + 1;

    struct Block : public MemoryView {
        Block *prevPhy = nullptr;
        Block *nextPhy = nullptr;

        Block *prevFree = nullptr;
        Block *nextFree = nullptr;

        bool isFree() const { return prevFree != this; }
    };

    static uint64_t roundUpSize(uint64_t);
    static void levelMapping(uint64_t size, uint32_t &fl, uint32_t &sl);
    static std::pair<uint32_t, uint32_t> levelMapping(uint64_t);
    static bool check(const Block &block, uint64_t size, uint64_t alignment, uint64_t &alignOffset);

    Block *searchDefault(uint64_t size, uint64_t alignment, uint64_t &alignOffset);
    Block *searchFreeBlock(uint32_t &fl, uint32_t &sl);

    Block *allocate(uint64_t size, uint64_t alignment);
    void free(Block *);

private:
    void allocateFromBlock(Block &current, uint64_t size, uint64_t alignOffset);
    void adjustAlignOffset(Block &current, uint64_t alignOffset);
    void updateBlock(Block &current, uint64_t size);
    void mergeBlock(Block &current, Block &prev);

    void insertFreeBlock(Block &);
    void insertFreeBlock(Block &, uint32_t fl, uint32_t sl);

    void removeFreeBlock(Block &);
    void removeFreeBlock(Block &, uint32_t fl, uint32_t sl);

    Block *_nullBlock = nullptr; // block not in free list.
    uint64_t _poolSize = DEFAULT_POOL_SIZE;
    uint32_t _freeBlockCount = 0;
    uint64_t _totalSize = 0;
    uint32_t _flBitMask = 0;
    ccstd::vector<uint32_t> _slBitMask;
    Block *_freeList[MAX_FIRST_LEVEL_COUNT][SECOND_LEVEL_COUNT];
    ObjectChunkPool<Block> _blocks{POOL_BLOCK_NUM_PER_CHUNK};
};

} // namespace cc::gfx
