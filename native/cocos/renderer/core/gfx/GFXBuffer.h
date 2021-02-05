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

#ifndef CC_CORE_GFX_BUFFER_H_
#define CC_CORE_GFX_BUFFER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Buffer : public GFXObject {
public:
    Buffer(Device *device);
    virtual ~Buffer();

public:
    virtual bool initialize(const BufferInfo &info) = 0;
    virtual bool initialize(const BufferViewInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void resize(uint size) = 0;
    virtual void update(void *buffer, uint size) = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE BufferUsage getUsage() const { return _usage; }
    CC_INLINE MemoryUsage getMemUsage() const { return _memUsage; }
    CC_INLINE uint getStride() const { return _stride; }
    CC_INLINE uint getCount() const { return _count; }
    CC_INLINE uint getSize() const { return _size; }
    CC_INLINE BufferFlags getFlags() const { return _flags; }

protected:
    Device *_device = nullptr;
    BufferUsage _usage = BufferUsageBit::NONE;
    MemoryUsage _memUsage = MemoryUsageBit::NONE;
    uint _stride = 0u;
    uint _count = 0u;
    uint _size = 0u;
    uint _offset = 0u;
    BufferFlags _flags = BufferFlagBit::NONE;
    uint8_t *_buffer = nullptr;
    bool _isBufferView = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_BUFFER_H_
