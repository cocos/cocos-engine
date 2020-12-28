#include "CoreStd.h"

#include "threading/MessageQueue.h"
#include "GFXDeviceAgent.h"
#include "GFXRenderPassAgent.h"

namespace cc {
namespace gfx {

bool RenderPassAgent::initialize(const RenderPassInfo &info) {

    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subPasses = info.subPasses;
    _hash = computeHash();

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        RenderPassInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void RenderPassAgent::destroy() {
    if (_actor) {
        ENQUEUE_MESSAGE_1(
            ((DeviceAgent *)_device)->getMessageQueue(),
            RenderPassDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
