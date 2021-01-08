#include "CoreStd.h"

#include "GFXCommandBufferAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXLinearAllocatorPool.h"
#include "GFXQueueAgent.h"
#include "base/job-system/JobSystem.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

QueueAgent::~QueueAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        QueueDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool QueueAgent::initialize(const QueueInfo &info) {
    _type = info.type;

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        QueueInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void QueueAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        QueueDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void QueueAgent::submit(CommandBuffer *const *cmdBuffs, uint count) {
    if (!count) return;

    LinearAllocatorPool *allocator = ((DeviceAgent *)_device)->getMainAllocator();
    CommandBuffer **actorCmdBuffs = allocator->allocate<CommandBuffer *>(count);
    for (uint i = 0u; i < count; ++i) {
        actorCmdBuffs[i] = ((CommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    ENQUEUE_MESSAGE_3(
        ((DeviceAgent *)_device)->getMessageQueue(),
        QueueSubmit,
        actor, getActor(),
        actorCmdBuffs, actorCmdBuffs,
        count, count,
        {
            //auto startTime = std::chrono::steady_clock::now();

            //auto endTime = std::chrono::steady_clock::now();
            //float dt = std::chrono::duration_cast<std::chrono::nanoseconds>(endTime - startTime).count() / 1e6;
            //static float timeAcc = 0.f;
            //if (!timeAcc) timeAcc = dt;
            //else timeAcc = timeAcc * 0.95f + dt * 0.05f;
            //CC_LOG_INFO("---------- %.2fms", timeAcc);

            //CC_LOG_INFO("======== one round ========");

            actor->submit(actorCmdBuffs, count);
        });
}

} // namespace gfx
} // namespace cc
