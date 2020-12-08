#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXBufferProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool BufferProxy::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _flags = info.flags;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        BufferInit,
        remote, getRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

bool BufferProxy::initialize(const BufferViewInfo &info) {
    _usage = info.buffer->getUsage();
    _memUsage = info.buffer->getMemUsage();
    _size = info.buffer->getSize();
    _flags = info.buffer->getFlags();
    _stride = info.buffer->getStride();
    _count = info.buffer->getCount();

    BufferViewInfo remoteInfo = info;
    remoteInfo.buffer = ((BufferProxy *)info.buffer)->getRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        BufferViewInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void BufferProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            BufferDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

void BufferProxy::update(void *buffer, uint offset, uint size) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    uint8_t *remoteBuffer = encoder->Allocate<uint8_t>(size);
    memcpy(remoteBuffer, buffer, size);

    ENCODE_COMMAND_4(
        encoder,
        BufferUpdate,
        remote, getRemote(),
        buffer, remoteBuffer,
        offset, offset,
        size, size,
        {
            remote->update(buffer, offset, size);
        });
}

void BufferProxy::resize(uint size) {
    _size = size;
    _count = size / _stride;

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        BufferResize,
        remote, getRemote(),
        size, size,
        {
            remote->resize(size);
        });
}

} // namespace gfx
} // namespace cc
