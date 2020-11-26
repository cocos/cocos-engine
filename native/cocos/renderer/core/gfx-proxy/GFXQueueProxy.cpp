#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
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

    ENCODE_COMMAND_4(
        encoder,
        QueueSubmit,
        remote, getRemote(),
        cmdBuffs, remoteCmdBuffs,
        count, count,
        fence, fence,
        {
            remote->submit(cmdBuffs, count, fence);
        });
}

} // namespace gfx
} // namespace cc
