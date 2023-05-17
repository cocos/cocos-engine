/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "3d/misc/BufferBlob.h"
#include "core/TypedArray.h"

namespace cc {

void BufferBlob::setNextAlignment(uint32_t align) {
    if (align != 0) {
        const uint32_t remainder = _length % align;
        if (remainder != 0) {
            const uint32_t padding = align - remainder;
            _arrayBufferOrPaddings.emplace_back(padding);
            _length += padding;
        }
    }
}

uint32_t BufferBlob::addBuffer(ArrayBuffer *arrayBuffer) {
    const uint32_t result = _length;
    _arrayBufferOrPaddings.emplace_back(arrayBuffer);
    _length += arrayBuffer->byteLength();
    return result;
}

ArrayBuffer::Ptr BufferBlob::getCombined() {
    Int8Array result(_length);
    uint32_t counter = 0;

    for (const auto &arrayBufferOrPadding : _arrayBufferOrPaddings) {
        if (const auto *p = ccstd::get_if<uint32_t>(&arrayBufferOrPadding)) {
            counter += *p;
        } else if (const auto *p = ccstd::get_if<ArrayBuffer::Ptr>(&arrayBufferOrPadding)) {
            result.set(*p, counter);
            counter += (*p)->byteLength();
        }
    }

    return result.buffer();
}

} // namespace cc
