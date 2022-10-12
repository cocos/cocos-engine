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

#include "GFXDynamicBuffer.h"

namespace cc {
namespace gfx {

DynamicBuffer::DynamicBuffer()
: GFXObject(ObjectType::DYNAMIC_BUFFER) {
}

void DynamicBuffer::initialize(const DynamicBufferInfo &info){
    _usage = info.usage;
    _size = info.size;

    if (info.allocHost) {
        uint32_t inflightNum = getInflightNum();
        _data = static_cast<uint8_t *>(malloc(_size * inflightNum));
    }

    doInit(info);
}
void DynamicBuffer::destroy(){
    doDestroy();
}

void DynamicBuffer::swapBuffer(){
    doSwapBuffer();
}

void DynamicBuffer::write(const uint8_t *buffer, uint32_t size, uint32_t offset) {
    if (_data != nullptr && offset + size > _size) {
        return;
    }
    memcpy(getActiveAddress() + offset, buffer, size);
}

void DynamicBuffer::setData(uint8_t *ptr) {
    _data = ptr;
}

void DynamicBuffer::flush() {
    flush(getActiveAddress(), _size);
}

uint8_t *DynamicBuffer::getActiveAddress() const {
    return _data + getCurrentIndex() * _size;
}

} // namespace gfx
} // namespace cc
