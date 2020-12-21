#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXBufferAgent.h"
#include "GFXDeviceAgent.h"

namespace cc {
namespace gfx {

bool BufferAgent::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _flags = info.flags;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        BufferInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

bool BufferAgent::initialize(const BufferViewInfo &info) {
    _usage = info.buffer->getUsage();
    _memUsage = info.buffer->getMemUsage();
    _flags = info.buffer->getFlags();
    _offset = info.offset;
    _size = _stride = info.range;
    _count = 1u;

    BufferViewInfo actorInfo = info;
    actorInfo.buffer = ((BufferAgent *)info.buffer)->getActor();

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        BufferViewInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void BufferAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            BufferDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

void BufferAgent::update(void *buffer, uint size) {
    CommandEncoder *encoder = ((DeviceAgent *)_device)->getMainEncoder();

    uint8_t *actorBuffer = encoder->allocate<uint8_t>(size);
    memcpy(actorBuffer, buffer, size);

    ENCODE_COMMAND_3(
        encoder,
        BufferUpdate,
        actor, getActor(),
        buffer, actorBuffer,
        size, size,
        {
            actor->update(buffer, size);
        });
}

void BufferAgent::resize(uint size) {
    _size = size;
    _count = size / _stride;

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        BufferResize,
        actor, getActor(),
        size, size,
        {
            actor->resize(size);
        });
}

} // namespace gfx
} // namespace cc
