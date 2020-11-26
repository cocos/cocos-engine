#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
#include "GFXDeviceProxy.h"
#include "GFXFramebufferProxy.h"
#include "GFXTextureProxy.h"

namespace cc {
namespace gfx {

bool FramebufferProxy::initialize(const FramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    FramebufferInfo remoteInfo = info;
    for (uint i = 0u; i < info.colorTextures.size(); ++i) {
        if (info.colorTextures[i]) {
            remoteInfo.colorTextures[i] = ((TextureProxy *)info.colorTextures[i])->getRemote();
        }
    }
    if (info.depthStencilTexture) {
        remoteInfo.depthStencilTexture = ((TextureProxy *)info.depthStencilTexture)->getRemote();
    }

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        FramebufferInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void FramebufferProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            FramebufferDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
