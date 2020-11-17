#include "CoreStd.h"
#include "GFXBufferProxy.h"

namespace cc {
namespace gfx {

bool BufferProxy::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _flags = info.flags;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;

    bool res = _remote->initialize(info);

    return res;
}

bool BufferProxy::initialize(const BufferViewInfo &info) {
    _usage = info.buffer->getUsage();
    _memUsage = info.buffer->getMemUsage();
    _size = info.buffer->getSize();
    _flags = info.buffer->getFlags();
    _stride = info.buffer->getStride();
    _count = info.buffer->getCount();

    bool res = _remote->initialize(info);

    return res;
}

void BufferProxy::destroy() {
    _remote->destroy();
}

void BufferProxy::resize(uint size) {
    _size = size;
    _count = size / _stride;

    _remote->resize(size);
}

void BufferProxy::update(void *buffer, uint offset, uint size) {
    _remote->update(buffer, offset, size);
}

} // namespace gfx
} // namespace cc
