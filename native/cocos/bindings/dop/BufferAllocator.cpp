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

#include "BufferAllocator.h"
#include "base/Log.h"
#include "base/memory/Memory.h"

namespace se {

BufferAllocator::BufferAllocator(PoolType type)
: _type(type) {
}

BufferAllocator::~BufferAllocator() {
    for (auto buffer : _buffers) {
        buffer.second->decRef();
    }
    _buffers.clear();
}

se::Object *BufferAllocator::alloc(uint32_t index, uint32_t bytes) {
    if (_buffers.count(index)) {
        se::Object *oldObj = _buffers[index];
        oldObj->decRef();
    }
    se::Object *obj = se::Object::createArrayBufferObject(nullptr, bytes);

    _buffers[index] = obj;

    uint8_t *ret = nullptr;
    size_t len;
    obj->getArrayBufferData(static_cast<uint8_t **>(&ret), &len);

    return obj;
}

void BufferAllocator::free(uint32_t index) {
    if (_buffers.count(index)) {
        se::Object *oldObj = _buffers[index];
        oldObj->decRef();
        _buffers.erase(index);
    }
}

} // namespace se
