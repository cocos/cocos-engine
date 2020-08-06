/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "base/ccMacros.h"
#include "base/memory/Memory.h"

using namespace se;

cc::map<PoolType, BufferPool *> BufferPool::_poolMap;

BufferPool::BufferPool(PoolType type, uint entryBits, uint bytesPerEntry)
: _entryBits(entryBits), _bytesPerEntry(bytesPerEntry) {
    CCASSERT(BufferPool::_poolMap.count(type) == 0, "The type of pool is already exist");

    _entriesPerChunk = 1 << entryBits;
    _entryMask = _entriesPerChunk - 1;
    _chunkMask = 0xffffffff & ~(_entryMask | _poolFlag);

    _bytesPerChunk = _bytesPerEntry * _entriesPerChunk;

    BufferPool::_poolMap[type] = this;
}

BufferPool::~BufferPool() {
    CCASSERT(_chunks.size() == _jsObjs.size(), "BufferPool: Page count doesn't match the number of javascript array buffer objects.");
    for (auto element : _jsObjs) {
        CC_FREE(element.first);
        element.second->decRef();
        element.second->unroot();
    }

    BufferPool::_poolMap.erase(_type);
}

Object *BufferPool::allocateNewChunk() {
    Chunk chunk = (uint8_t *)CC_MALLOC(_bytesPerChunk);
    _chunks.push_back(chunk);

    Object *jsObj = Object::createArrayBufferObject(chunk, _bytesPerChunk);
    jsObj->root();
    jsObj->incRef();
    _jsObjs.emplace(chunk, jsObj);
    return jsObj;
}
