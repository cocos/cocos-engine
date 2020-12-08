#include "CoreStd.h"

#include "job-system/JobSystem.h"
#include "threading/CommandEncoder.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXQueueProxy.h"

namespace cc {
namespace gfx {

bool QueueProxy::initialize(const QueueInfo &info) {
    _type = info.type;

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        QueueInit,
        remote, getRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void QueueProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            QueueDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

void QueueProxy::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    CommandEncoder *encoder = ((DeviceProxy *)_device)->getMainEncoder();

    const CommandBuffer **remoteCmdBuffs = encoder->Allocate<const CommandBuffer *>(count);
    for (uint i = 0u; i < count; ++i) {
        remoteCmdBuffs[i] = ((CommandBufferProxy *)cmdBuffs[i])->getRemote();
    }

    bool multiThreaded = _device->hasFeature(Feature::MULTITHREADED_SUBMISSION);

    ENCODE_COMMAND_6(
        encoder,
        QueueSubmit,
        remote, getRemote(),
        multiThreaded, multiThreaded,
        cmdBuffs, cmdBuffs,
        remoteCmdBuffs, remoteCmdBuffs,
        count, count,
        fence, fence,
        {
            if (multiThreaded) {
                JobGraph g;
                Job j = g.createForEachIndexJob(1u, count, 1u, [this](uint i) {
                    ((CommandBufferProxy *)cmdBuffs[i])->getEncoder()->FlushCommands();
                });
                JobSystem::getInstance().run(g);
                ((CommandBufferProxy *)cmdBuffs[0])->getEncoder()->FlushCommands();
                JobSystem::getInstance().waitForAll();
            } else {
                for (uint i = 0u; i < count; ++i) {
                    ((CommandBufferProxy *)cmdBuffs[i])->getEncoder()->FlushCommands();
                }
            }

            remote->submit(remoteCmdBuffs, count, fence);
        });
}

} // namespace gfx
} // namespace cc
