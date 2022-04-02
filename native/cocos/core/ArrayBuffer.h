/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "bindings/jswrapper/Object.h"

namespace cc {

class ArrayBuffer : public RefCounted {
public:
    using Ptr = IntrusivePtr<ArrayBuffer>;

    explicit ArrayBuffer(uint32_t length) : _byteLength{length} {
        _jsArrayBuffer = se::Object::createArrayBufferObject(nullptr, length);
        _jsArrayBuffer->root();
        _jsArrayBuffer->getArrayBufferData(static_cast<uint8_t **>(&_data), nullptr);
        memset(_data, 0x00, _byteLength);
    }

    ArrayBuffer(const uint8_t *data, uint32_t length) {
        reset(data, length);
    }

    ArrayBuffer() = default;

    ~ArrayBuffer() override {
        if (_jsArrayBuffer) {
            _jsArrayBuffer->unroot();
            _jsArrayBuffer->decRef();
        }
    }

    inline void setJSArrayBuffer(se::Object *arrayBuffer) {
        if (_jsArrayBuffer) {
            _jsArrayBuffer->unroot();
            _jsArrayBuffer->decRef();
        }

        _jsArrayBuffer = arrayBuffer;
        _jsArrayBuffer->incRef();
        _jsArrayBuffer->root();
        size_t length{0};
        _jsArrayBuffer->getArrayBufferData(static_cast<uint8_t **>(&_data), &length);
        _byteLength = static_cast<uint32_t>(length);
    }
    inline se::Object *getJSArrayBuffer() const { return _jsArrayBuffer; }

    inline uint32_t byteLength() const { return _byteLength; }

    Ptr slice(uint32_t begin) {
        return slice(begin, _byteLength);
    }

    Ptr slice(uint32_t begin, uint32_t end) {
        CC_ASSERT(end > begin);
        CC_ASSERT(begin < _byteLength);
        CC_ASSERT(end <= _byteLength);
        uint32_t newBufByteLength = (end - begin);
        Ptr      buffer           = new ArrayBuffer(newBufByteLength);
        memcpy(buffer->getData(), _data + begin, newBufByteLength);
        return buffer;
    }

    // Just use it to copy data. Use TypedArray to get/set data.
    inline const uint8_t *getData() const { return _data; }
    inline uint8_t *      getData() { return _data; }

    inline void reset(const uint8_t *data, uint32_t length) {
        if (_jsArrayBuffer != nullptr) {
            _jsArrayBuffer->unroot();
            _jsArrayBuffer->decRef();
        }
        _jsArrayBuffer = se::Object::createArrayBufferObject(data, length);
        _jsArrayBuffer->getArrayBufferData(static_cast<uint8_t **>(&_data), nullptr);
        _byteLength = length;
    }

private:
    se::Object *_jsArrayBuffer{nullptr};
    uint8_t *   _data{nullptr};
    uint32_t    _byteLength{0};

    template <class T>
    friend class TypedArrayTemp;
    friend class DataView;

    CC_DISALLOW_COPY_MOVE_ASSIGN(ArrayBuffer);
};

} // namespace cc
