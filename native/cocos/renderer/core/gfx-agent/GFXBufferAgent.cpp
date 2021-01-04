#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXBufferAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXLinearAllocatorPool.h"

namespace cc {
namespace gfx {

BufferAgent::~BufferAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        BufferDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool BufferAgent::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _flags = info.flags;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
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

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        BufferViewInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void BufferAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        BufferDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void BufferAgent::update(void *buffer, uint size) {
    uint8_t *actorBuffer = ((DeviceAgent *)_device)->getMainAllocator()->allocate<uint8_t>(size);
    memcpy(actorBuffer, buffer, size);

    ENQUEUE_MESSAGE_3(
        ((DeviceAgent *)_device)->getMessageQueue(),
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

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        BufferResize,
        actor, getActor(),
        size, size,
        {
            actor->resize(size);
        });
}

} // namespace gfx
} // namespace cc
