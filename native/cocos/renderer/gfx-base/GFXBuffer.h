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

#pragma once

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL Buffer : public GFXObject {
public:
    Buffer();
    ~Buffer() override;

    static size_t computeHash(const BufferInfo &info);

    void initialize(const BufferInfo &info);
    void initialize(const BufferViewInfo &info);
    void resize(uint32_t size);
    void destroy();

    virtual void update(const void *buffer, uint32_t size) = 0;

    inline void update(const void *buffer) { update(buffer, _size); }

    inline BufferUsage getUsage() const { return _usage; }
    inline MemoryUsage getMemUsage() const { return _memUsage; }
    inline uint32_t    getStride() const { return _stride; }
    inline uint32_t    getCount() const { return _count; }
    inline uint32_t    getSize() const { return _size; }
    inline BufferFlags getFlags() const { return _flags; }
    inline bool        isBufferView() const { return _isBufferView; }

protected:
    virtual void doInit(const BufferInfo &info)          = 0;
    virtual void doInit(const BufferViewInfo &info)      = 0;
    virtual void doResize(uint32_t size, uint32_t count) = 0;
    virtual void doDestroy()                             = 0;

    BufferUsage _usage        = BufferUsageBit::NONE;
    MemoryUsage _memUsage     = MemoryUsageBit::NONE;
    uint32_t    _stride       = 0U;
    uint32_t    _count        = 0U;
    uint32_t    _size         = 0U;
    uint32_t    _offset       = 0U;
    BufferFlags _flags        = BufferFlagBit::NONE;
    bool        _isBufferView = false;
};

} // namespace gfx
} // namespace cc
