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

#pragma once

#include "cocos/base/Object.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/scripting/js-bindings/jswrapper/Object.h"
#include "cocos/base/ccMacros.h"

namespace se {

class CC_DLL BufferPool : public cc::Object {
public:
    using Chunk = uint8_t*;
    
    BufferPool(size_t bytesPerEntry, uint32_t entryBits);
    ~BufferPool();
    void *getData(uint32_t id);
    template<class Type>
    Type *getTypedObject(uint32_t id);
    
    Object *allocateNewChunk();
    Object *getChunkArrayBuffer(uint32_t chunkId);
protected:
    cc::vector<Chunk> _chunks;
    cc::vector<Object*> _jsObjs;
    cc::vector<size_t> _sizes;
    uint32_t _poolFlag = 1 << 30;
    uint32_t _entryBits = 1 << 8;
    uint32_t _chunkMask = 0;
    uint32_t _entryMask = 0;
    size_t _bytesPerChunk = 0;
    size_t _entiesPerChunk = 0;
    size_t _bytesPerEntry = 0;
};

} // namespace se {
