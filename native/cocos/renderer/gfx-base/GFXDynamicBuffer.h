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

#pragma once

#include "GFXObject.h"
#include "base/RefCounted.h"

namespace cc {
namespace gfx {

class CC_DLL DynamicBuffer : public GFXObject, public RefCounted {
public:
    DynamicBuffer();
    ~DynamicBuffer() override = default;

    void initialize(const DynamicBufferInfo &info);

    void destroy();

    void swapBuffer();

    template <typename T>
    void write(const T &value, uint32_t offset) {
        write(reinterpret_cast<const uint8_t *>(&value), sizeof(T), offset);
    }

    void write(const uint8_t *buffer, uint32_t size, uint32_t offset);

    void setData(uint8_t *ptr);

    void flush();

    virtual void flush(const uint8_t *data, uint32_t size) = 0;

    virtual uint32_t getInflightNum() const { return _size; };
    virtual uint32_t getCurrentIndex() const { return 0; }

    const uint8_t *getData() const { return _data; }
protected:
    virtual void doInit(const DynamicBufferInfo &info) = 0;
    virtual void doSwapBuffer() = 0;
    virtual void doDestroy() = 0;

    uint8_t *getActiveAddress() const;

    BufferUsage _usage = BufferUsageBit::NONE;
    uint32_t _size{0};
    uint8_t *_data{nullptr};
};

} // namespace gfx
} // namespace cc
