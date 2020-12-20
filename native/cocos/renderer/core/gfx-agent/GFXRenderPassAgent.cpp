#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceAgent.h"
#include "GFXRenderPassAgent.h"

namespace cc {
namespace gfx {

bool RenderPassAgent::initialize(const RenderPassInfo &info) {

    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subPasses = info.subPasses;
    _hash = computeHash();

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
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
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
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
