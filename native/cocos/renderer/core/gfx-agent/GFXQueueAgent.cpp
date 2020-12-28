#include "CoreStd.h"

#include "GFXCommandBufferAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXLinearAllocatorPool.h"
#include "GFXQueueAgent.h"
#include "job-system/JobSystem.h"
#include "threading/CommandEncoder.h"

namespace cc {
namespace gfx {

bool QueueAgent::initialize(const QueueInfo &info) {
    _type = info.type;

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        QueueInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void QueueAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            QueueDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

void QueueAgent::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    if (!count) return;
    
    LinearAllocatorPool *allocator = ((DeviceAgent *)_device)->getMainAllocator();
    const CommandBuffer **actorCmdBuffs = allocator->allocate<const CommandBuffer *>(count);
    for (uint i = 0u; i < count; ++i) {
        actorCmdBuffs[i] = ((CommandBufferAgent *)cmdBuffs[i])->getActor();
    }

    bool multiThreaded = _device->hasFeature(Feature::MULTITHREADED_SUBMISSION);

    ENCODE_COMMAND_6(
        ((DeviceAgent *)_device)->getMainEncoder(),
        QueueSubmit,
        actor, getActor(),
        multiThreaded, multiThreaded,
        cmdBuffs, (CommandBufferAgent *const *)cmdBuffs,
        actorCmdBuffs, actorCmdBuffs,
        count, count,
        fence, fence,
        {
            //auto startTime = std::chrono::steady_clock::now();

            CommandBufferAgent::flushCommands(cmdBuffs, count, multiThreaded);

            //auto endTime = std::chrono::steady_clock::now();
            //float dt = std::chrono::duration_cast<std::chrono::nanoseconds>(endTime - startTime).count() / 1e6;
            //static float timeAcc = 0.f;
            //if (!timeAcc) timeAcc = dt;
            //else timeAcc = timeAcc * 0.95f + dt * 0.05f;
            //CC_LOG_INFO("---------- %.2fms", timeAcc);

            //CC_LOG_INFO("======== one round ========");

            auto endTime = std::chrono::steady_clock::now();
            float dt = std::chrono::duration_cast<std::chrono::nanoseconds>(endTime - startTime).count() / 1e6;
            static float timeAcc = 0.f;
            if (!timeAcc) timeAcc = dt;
            else timeAcc = timeAcc * 0.95f + dt * 0.05f;
            CC_LOG_INFO("---------- %.2fms", timeAcc);

            actor->submit(actorCmdBuffs, count, fence);
        });
}

} // namespace gfx
} // namespace cc
