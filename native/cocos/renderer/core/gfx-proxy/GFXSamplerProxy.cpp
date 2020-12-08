#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDescriptorSetLayoutProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXSamplerProxy.h"

namespace cc {
namespace gfx {

bool SamplerProxy::initialize(const SamplerInfo &info) {

    _minFilter = info.minFilter;
    _magFilter = info.magFilter;
    _mipFilter = info.mipFilter;
    _addressU = info.addressU;
    _addressV = info.addressV;
    _addressW = info.addressW;
    _maxAnisotropy = info.maxAnisotropy;
    _cmpFunc = info.cmpFunc;
    _borderColor = info.borderColor;
    _minLOD = info.minLOD;
    _maxLOD = info.maxLOD;
    _mipLODBias = info.mipLODBias;

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        SamplerInit,
        remote, getRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void SamplerProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            SamplerDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
