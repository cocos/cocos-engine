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

#include "TLSFPool.h"
#include "base/BitScan.h"
#include "base/Utils.h"

namespace cc::gfx {
void TLSFPool::initialize(const Descriptor &desc) {
    _poolSize = desc.poolSize != 0 ? desc.poolSize : DEFAULT_POOL_SIZE;

    _nullBlock = _blocks.allocate();
    _nullBlock->offset = 0;
    _nullBlock->size = _poolSize;
    _nullBlock->prevPhy = nullptr;
    _nullBlock->nextPhy = nullptr;
    _nullBlock->prevFree = nullptr;
    _nullBlock->nextFree = nullptr;

    _flBitMask = 0;
    _slBitMask.resize(MAX_FIRST_LEVEL_COUNT, 0);
    for (auto &firstLevel : _freeList) {
        for (auto &block : firstLevel) {
            block = nullptr;
        }
    }
}

uint64_t TLSFPool::roundUpSize(uint64_t size) {
    uint64_t roundSize = size;
    if (size >= MIN_BLOCK_SIZE) {
        roundSize += (1ULL << (bitScanReverse(size) - SECOND_LEVEL_INDEX)) - 1;
    } else {
        roundSize += SMALL_BUFFER_STEP - 1;
    }
    return roundSize;
}

void TLSFPool::levelMapping(uint64_t size, uint32_t &fl, uint32_t &sl) {
    if (size < MIN_BLOCK_SIZE) {
        fl = 0;
        sl = static_cast<uint32_t>(size) / SMALL_BUFFER_STEP;
    } else {
        fl = bitScanReverse(size);
        sl = static_cast<uint32_t>(size >> (fl - SECOND_LEVEL_INDEX)) ^ (1U << SECOND_LEVEL_INDEX);
        fl -= (FIRST_LEVEL_SHIFT - 1);
    }
}

std::pair<uint32_t, uint32_t> TLSFPool::levelMapping(uint64_t size) {
    uint32_t fl = 0;
    uint32_t sl = 0;
    levelMapping(size, fl, sl);
    return {fl, sl};
}

TLSFPool::Block *TLSFPool::searchDefault(uint64_t size, uint64_t alignment, uint64_t &alignOffset) {
    // quick check free list
    if (_freeBlockCount == 0) {
        return check(*_nullBlock, size, alignment, alignOffset) ? _nullBlock : nullptr;
    }

    // try next level
    {
        uint64_t roundupSize = roundUpSize(size);
        auto [fl, sl] = levelMapping(roundupSize);
        auto *freeBlock = searchFreeBlock(fl, sl);
        while (freeBlock != nullptr) {
            if (check(*freeBlock, size, alignment, alignOffset)) {
                return freeBlock;
            }
            freeBlock = freeBlock->nextFree;
        }
    }

    // try null block again
    if (check(*_nullBlock, size, alignment, alignOffset)) {
        return _nullBlock;
    }

    // try best fit
    {
        auto [fl, sl] = levelMapping(size);
        auto *freeBlock = searchFreeBlock(fl, sl);
        while (freeBlock != nullptr) {
            if (check(*freeBlock, size, alignment, alignOffset)) {
                return freeBlock;
            }
            freeBlock = freeBlock->nextFree;
        }
    }
    return nullptr;
}

TLSFPool::Block *TLSFPool::searchFreeBlock(uint32_t &fl, uint32_t &sl) {
    uint32_t slMap = _slBitMask[fl] & (~(0U) << sl);
    if (slMap == 0) {
        uint32_t flMap = _flBitMask & (~(0U) << (fl + 1));
        if (flMap == 0) {
            // no available free blocks
            return nullptr;
        }

        fl = bitScan(flMap);
        slMap = _slBitMask[fl];
    }
    sl = bitScan(slMap);
    return _freeList[fl][sl];
}

TLSFPool::Block *TLSFPool::allocate(uint64_t size, uint64_t alignment) {
    uint64_t realAlignment = std::max(alignment, static_cast<uint64_t>(SMALL_BUFFER_STEP));
    uint64_t allocSize = utils::align(size, realAlignment);

    uint64_t alignOffset = 0;
    Block *block = searchDefault(allocSize, realAlignment, alignOffset);
    if (block != nullptr) {
        allocateFromBlock(*block, allocSize, alignOffset);
    }
    return block;
}

void TLSFPool::free(Block *block) {
    if (block->prevPhy != nullptr && block->prevPhy->isFree()) {
        // pre Phy block should be nullBlock
        removeFreeBlock(*block->prevPhy);
        mergeBlock(*block, *block->prevPhy);
    }

    // block->nextPhy should not be nullptr
    if (!block->nextPhy->isFree()) {
        insertFreeBlock(*block);
    } else if (block->nextPhy == _nullBlock) {
        mergeBlock(*block->nextPhy, *block);
    } else {
        Block *next = block->nextPhy;
        removeFreeBlock(*next);
        mergeBlock(*next, *block);
        insertFreeBlock(*next);
    }
}

bool TLSFPool::check(const Block &block, uint64_t size, uint64_t alignment, uint64_t &alignOffset) {
    alignOffset = utils::align(block.offset, alignment);
    return alignOffset + size <= block.offset + block.size;
}

void TLSFPool::allocateFromBlock(Block &current, uint64_t size, uint64_t alignOffset) {
    if (&current != _nullBlock) {
        removeFreeBlock(current);
    }

    adjustAlignOffset(current, alignOffset);
    updateBlock(current, size);
}

void TLSFPool::adjustAlignOffset(Block &current, uint64_t alignOffset) {
    uint64_t padding = alignOffset - current.offset;
    if (padding != 0) {
        // There should be no padding at the first allocation, prevPhy should not be nullptr;
        Block *prevPhy = current.prevPhy;

        /**
             * |----------prevPhy---------|-----------current---------|
             * |----------prevPhy---------|-padding-|-----current-----|
             *
             * block.size + padding may exceed the current block range.
             * if prevPhy is free, check if it needs to change freeList index.
             * if prevPhy is taken, add a padding block.
         */
        if (prevPhy->isFree()) {
            uint64_t newSize = prevPhy->size + padding;

            auto [oldFl, oldSl] = levelMapping(prevPhy->size);
            auto [newFl, newSl] = levelMapping(newSize);

            if (oldFl != newFl || oldSl != newSl) {
                removeFreeBlock(*prevPhy, oldFl, oldSl);
                prevPhy->size = newSize;
                insertFreeBlock(*prevPhy, newFl, newSl);
            }
        } else {
            Block *newBlock = _blocks.allocate();
            current.prevPhy = newBlock;
            prevPhy->nextPhy = newBlock;

            newBlock->size = padding;
            newBlock->offset = current.offset;
            newBlock->prevPhy = prevPhy;
            newBlock->nextPhy = &current;
            newBlock->nextFree = nullptr;
            newBlock->prevFree = nullptr;
            insertFreeBlock(*newBlock);
        }

        current.size -= padding;
        current.offset += padding;
    }
}

void TLSFPool::updateBlock(Block &current, uint64_t size) {
    uint64_t blockLeftSize = current.size - size;
    if (blockLeftSize == 0) {
        if (_nullBlock == &current) {
            _nullBlock = _blocks.allocate();
            _nullBlock->size = 0;
            _nullBlock->offset = current.offset + size;
            _nullBlock->prevPhy = &current;
            _nullBlock->nextPhy = nullptr;
            _nullBlock->prevFree = nullptr;
            _nullBlock->nextFree = nullptr;

            current.nextPhy = _nullBlock;
            current.prevFree = &current;
        }
    } else {
        auto *newBlock = _blocks.allocate();
        newBlock->size = blockLeftSize;
        newBlock->offset = current.offset + size;
        newBlock->prevPhy = &current;
        newBlock->nextPhy = current.nextPhy;
        newBlock->prevFree = nullptr;
        newBlock->nextFree = nullptr;

        current.nextPhy = newBlock;
        current.size = size;
        if (_nullBlock == &current) {
            _nullBlock = newBlock;
            current.prevFree = &current;
        } else {
            newBlock->nextPhy->prevPhy = newBlock;
            insertFreeBlock(*newBlock);
        }
    }
}

void TLSFPool::mergeBlock(Block &current, Block &prev) {
    current.offset = prev.offset;
    current.size += prev.size;
    current.prevPhy = prev.prevPhy;
    if (current.prevPhy != nullptr) {
        current.prevPhy->nextPhy = &current;
    }
    _blocks.free(&prev);
}

void TLSFPool::insertFreeBlock(Block &block) {
    auto [fl, sl] = levelMapping(block.size);
    insertFreeBlock(block, fl, sl);
}

void TLSFPool::insertFreeBlock(Block &block, uint32_t fl, uint32_t sl) {
    block.prevFree = nullptr;
    block.nextFree = _freeList[fl][sl];
    if (block.nextFree != nullptr) {
        block.nextFree->prevFree = &block;
    } else {
        // set bitmap
        _flBitMask |= (1U << fl);
        _slBitMask[fl] |= (1U << sl);
    }
    _freeList[fl][sl] = &block;
    ++_freeBlockCount;
}

void TLSFPool::removeFreeBlock(Block &block) {
    auto [fl, sl] = levelMapping(block.size);
    removeFreeBlock(block, fl, sl);
}

void TLSFPool::removeFreeBlock(Block &block, uint32_t fl, uint32_t sl) {
    // update tail
    if (block.nextFree != nullptr) {
        block.nextFree->prevFree = block.prevFree;
    }

    // update head
    if (block.prevFree != nullptr) {
        block.prevFree->nextFree = block.nextFree;
    } else {
        _freeList[fl][sl] = block.nextFree;

        // update bitmap
        if (block.nextFree == nullptr) {
            _slBitMask[fl] &= ~(1U << sl);
            if (_slBitMask[fl] == 0) {
                _flBitMask &= ~(1U << fl);
            }
        }
    }
    block.prevFree = &block;
    block.nextFree = nullptr;
    --_freeBlockCount;
}

} // namespace cc::gfx
