#include "CoreStd.h"

#include "GFXDeviceAgent.h"
#include "GFXRenderPassAgent.h"
#include "base/threading/MessageQueue.h"

namespace cc {
namespace gfx {

RenderPassAgent::~RenderPassAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        RenderPassDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool RenderPassAgent::initialize(const RenderPassInfo &info) {

    _colorAttachments       = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subpasses              = info.subpasses;
    _hash                   = computeHash();

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
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        RenderPassDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
