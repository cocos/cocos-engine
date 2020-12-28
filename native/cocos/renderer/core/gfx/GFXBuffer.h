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
