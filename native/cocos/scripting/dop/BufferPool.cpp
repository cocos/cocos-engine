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

BufferPool::BufferPool(size_t bytesPerEntry, uint32_t entryBits)
: _entryBits(entryBits)
, _bytesPerEntry(bytesPerEntry)
{
    _entiesPerChunk = 1 << entryBits;
    _entryMask = _entiesPerChunk - 1;
    _chunkMask = 0xffffffff & ~(_entryMask | _poolFlag);
    
    _bytesPerChunk = _bytesPerEntry * _entiesPerChunk;
    allocateNewChunk();
}

BufferPool::~BufferPool()
{
    CCASSERT(_chunks.size() == _jsObjs.size(), "BufferPool: Page count doesn't match the number of javascript array buffer objects.");
    for (size_t i = 0; i < _chunks.size(); ++i) {
        CC_FREE(_chunks.at(i));
        Object *jsObj = _jsObjs.at(i);
        jsObj->setPrivateData(nullptr);
        jsObj->decRef();
        jsObj->unroot();
        _jsObjs[i] = nullptr;
    }
}

void *BufferPool::getData(uint32_t id)
{
    size_t chunk = (_chunkMask & id) >> _entryBits;
    size_t entry = _entryMask & id;
    CCASSERT(chunk < _chunks.size() && entry < _entiesPerChunk, "BufferPool: Invalid buffer pool entry id");
    size_t offset = entry * _bytesPerEntry;
    return &_chunks[chunk][offset];
}

template<class Type>
Type *BufferPool::getTypedObject(uint32_t id)
{
    size_t chunk = (_chunkMask & id) >> _entryBits;
    size_t entry = _entryMask & id;
    CCASSERT(chunk < _chunks.size() && entry < _entiesPerChunk, "BufferPool: Invalid buffer pool entry id");
    Type *object = ((Type*)_chunks[chunk])[entry];
    return object;
}

Object *BufferPool::allocateNewChunk()
{
    Chunk chunk = (uint8_t *)CC_MALLOC(_bytesPerChunk);
    _chunks.push_back(chunk);
    _sizes.push_back(0);

    Object *jsObj = Object::createArrayBufferObject(chunk, _bytesPerChunk);
    jsObj->root();
    jsObj->incRef();
    jsObj->setPrivateData(this);
    _jsObjs.push_back(jsObj);
    return jsObj;
}

Object *BufferPool::getChunkArrayBuffer(uint32_t chunkId)
{
    return _jsObjs[chunkId];
}
