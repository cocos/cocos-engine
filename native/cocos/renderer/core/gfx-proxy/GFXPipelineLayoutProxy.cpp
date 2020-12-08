#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDescriptorSetLayoutProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXPipelineLayoutProxy.h"

namespace cc {
namespace gfx {

bool PipelineLayoutProxy::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    PipelineLayoutInfo remoteInfo;
    remoteInfo.setLayouts.resize(info.setLayouts.size());
    for (uint i = 0u; i < info.setLayouts.size(); i++) {
        remoteInfo.setLayouts[i] = ((DescriptorSetLayoutProxy *)info.setLayouts[i])->getRemote();
    }

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        PipelineLayoutInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void PipelineLayoutProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            PipelineLayoutDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
