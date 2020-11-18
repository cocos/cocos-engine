#include "CoreStd.h"
#include "GFXQueueProxy.h"
#include "GFXCommandBufferProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool QueueProxy::initialize(const QueueInfo &info) {
    _type = info.type;

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        QueueInit,
        remote, GetRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void QueueProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        QueueDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

void QueueProxy::submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) {
    CommandEncoder *encoder = ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder();

    const CommandBuffer **remoteCmdBuffs = encoder->Allocate<const CommandBuffer *>(count);
    for (uint i = 0u; i < count; ++i) {
        remoteCmdBuffs[i] = ((CommandBufferProxy*)cmdBuffs[i])->GetRemote();
    }

    ENCODE_COMMAND_4(
        encoder,
        QueueSubmit,
        remote, GetRemote(),
        cmdBuffs, remoteCmdBuffs,
        count, count,
        fence, fence,
        {
            remote->submit(cmdBuffs, count, fence);
        });
}

} // namespace gfx
} // namespace cc
