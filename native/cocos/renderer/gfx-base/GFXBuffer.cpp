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

#include "base/CoreStd.h"

#include "GFXBuffer.h"
#include "GFXDevice.h"

namespace cc {
namespace gfx {

Buffer::Buffer()
: GFXObject(ObjectType::BUFFER) {
}

Buffer::~Buffer() = default;

size_t Buffer::computeHash(const BufferInfo &info) {
    return Hasher<BufferInfo>()(info);
}

void Buffer::initialize(const BufferInfo &info) {
    _usage    = info.usage;
    _memUsage = info.memUsage;
    _size     = info.size;
    _flags    = info.flags;
    _stride   = std::max(info.stride, 1U);
    _count    = _size / _stride;

    doInit(info);
}

void Buffer::initialize(const BufferViewInfo &info) {
    _usage    = info.buffer->getUsage();
    _memUsage = info.buffer->getMemUsage();
    _flags    = info.buffer->getFlags();
    _offset   = info.offset;
    _size = _stride = info.range;
    _count          = 1U;
    _isBufferView   = true;

    doInit(info);
}

void Buffer::destroy() {
    doDestroy();

    _offset = _size = _stride = _count = 0U;
}

void Buffer::resize(uint32_t size) {
    if (size != _size) {
        uint32_t count = size / _stride;
        doResize(size, count);

        _size  = size;
        _count = count;
    }
}

} // namespace gfx
} // namespace cc
