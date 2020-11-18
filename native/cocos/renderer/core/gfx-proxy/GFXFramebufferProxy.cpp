#include "CoreStd.h"
#include "GFXFramebufferProxy.h"
#include "GFXTextureProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXDeviceThread.h"

namespace cc {
namespace gfx {

bool FramebufferProxy::initialize(const FramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    FramebufferInfo remoteInfo = info;
    for (uint i = 0u; i < info.colorTextures.size(); ++i) {
        if (info.colorTextures[i]) {
            remoteInfo.colorTextures[i] = ((TextureProxy*) info.colorTextures[i])->GetRemote();
        }
    }
    if (info.depthStencilTexture) {
        remoteInfo.depthStencilTexture = ((TextureProxy*) info.depthStencilTexture)->GetRemote();
    }

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        FramebufferInit,
        remote, GetRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void FramebufferProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        FramebufferDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

} // namespace gfx
} // namespace cc
