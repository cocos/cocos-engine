#include "CoreStd.h"
#include "GFXBufferProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXDeviceThread.h"

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
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        BufferInit,
        remote, GetRemote(),
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
    remoteInfo.buffer = ((BufferProxy*)info.buffer)->GetRemote();

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        BufferViewInit,
        remote, GetRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void BufferProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        BufferDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

void BufferProxy::update(void *buffer, uint offset, uint size) {
    ENCODE_COMMAND_4(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        BufferUpdate,
        remote, GetRemote(),
        buffer, buffer,
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
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        BufferUpdate,
        remote, GetRemote(),
        size, size,
        {
            remote->resize(size);
        });
}

} // namespace gfx
} // namespace cc
