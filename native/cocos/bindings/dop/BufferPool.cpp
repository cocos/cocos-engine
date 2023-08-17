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

#include "BufferPool.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"

namespace se {

BufferPool::BufferPool(PoolType type, uint32_t entryBits, uint32_t bytesPerEntry)
: _allocator(type),
  _entryBits(entryBits),
  _bytesPerEntry(bytesPerEntry),
  _type(type) {
    _entriesPerChunk = 1 << entryBits;
    _entryMask = _entriesPerChunk - 1;
    _chunkMask = 0xffffffff & ~(_entryMask | POOL_FLAG);

    _bytesPerChunk = _bytesPerEntry * _entriesPerChunk;
}

BufferPool::~BufferPool() = default;

se::Object *BufferPool::allocateNewChunk() {
    se::Object *jsObj = _allocator.alloc(static_cast<uint32_t>(_chunks.size()), _bytesPerChunk);

    uint8_t *realPtr = nullptr;
    size_t len = 0;
    jsObj->getArrayBufferData(&realPtr, &len);
    _chunks.push_back(realPtr);

    return jsObj;
}

} // namespace se
