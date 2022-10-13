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

class CC_DLL Buffer : public GFXObject, public RefCounted {
public:
    Buffer();
    ~Buffer() override;

    static ccstd::hash_t computeHash(const BufferInfo &info);

    void initialize(const BufferInfo &info);
    void initialize(const BufferViewInfo &info);
    void resize(uint32_t size);
    void destroy();

    template <typename T>
    struct StructuredWriter {
        T *operator->() {
            return ptr;
        }
        T *ptr;
    };

    template <typename T>
    StructuredWriter<T> createWriter() {
        return StructuredWriter<T>{reinterpret_cast<T*>(getStagingAddress())};
    }

    template <typename T>
    void write(const T& value, uint32_t offset) const {
        write(reinterpret_cast<const uint8_t*>(&value), offset, sizeof(T));
    }

    void write(const uint8_t *value, uint32_t offset, uint32_t size) const;

    virtual void update(const void *buffer, uint32_t size) = 0;

    virtual void flush(const void *buffer) { update(buffer, _size); }

    inline void update(const void *buffer) { update(buffer, _size); }

    void update();

    inline BufferUsage getUsage() const { return _usage; }
    inline MemoryUsage getMemUsage() const { return _memUsage; }
    inline uint32_t getStride() const { return _stride; }
    inline uint32_t getCount() const { return _count; }
    inline uint32_t getSize() const { return _size; }
    inline BufferFlags getFlags() const { return _flags; }
    inline bool isBufferView() const { return _isBufferView; }

    virtual uint8_t *getStagingAddress() const { return _data; }
protected:
    virtual void doInit(const BufferInfo &info) = 0;
    virtual void doInit(const BufferViewInfo &info) = 0;
    virtual void doResize(uint32_t size, uint32_t count) = 0;
    virtual void doDestroy() = 0;

    BufferUsage _usage = BufferUsageBit::NONE;
    MemoryUsage _memUsage = MemoryUsageBit::NONE;
    uint32_t _stride = 0U;
    uint32_t _count = 0U;
    uint32_t _size = 0U;
    uint32_t _offset = 0U;
    BufferFlags _flags = BufferFlagBit::NONE;
    uint8_t *_data{nullptr};
    bool _isBufferView = false;
};

} // namespace gfx
} // namespace cc
