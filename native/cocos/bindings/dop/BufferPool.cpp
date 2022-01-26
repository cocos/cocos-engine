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

#include "BufferPool.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"

namespace se {

BufferPool::BufferPool(PoolType type, uint entryBits, uint bytesPerEntry)
: _allocator(type),
  _entryBits(entryBits),
  _bytesPerEntry(bytesPerEntry),
  _type(type) {
    _entriesPerChunk = 1 << entryBits;
    _entryMask       = _entriesPerChunk - 1;
    _chunkMask       = 0xffffffff & ~(_entryMask | POOL_FLAG);

    _bytesPerChunk = _bytesPerEntry * _entriesPerChunk;
}

BufferPool::~BufferPool() = default;

Object *BufferPool::allocateNewChunk() {
    Object *jsObj = _allocator.alloc(static_cast<uint>(_chunks.size()), _bytesPerChunk);

    uint8_t *realPtr = nullptr;
    size_t   len     = 0;
    jsObj->getArrayBufferData(&realPtr, &len);
    _chunks.push_back(realPtr);

    return jsObj;
}

} // namespace se
