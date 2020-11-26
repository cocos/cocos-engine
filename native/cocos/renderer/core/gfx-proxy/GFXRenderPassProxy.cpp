#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
#include "GFXDeviceProxy.h"
#include "GFXRenderPassProxy.h"

namespace cc {
namespace gfx {

bool RenderPassProxy::initialize(const RenderPassInfo &info) {

    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subPasses = info.subPasses;
    _hash = computeHash();

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        RenderPassInit,
        remote, getRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void RenderPassProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            RenderPassDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
