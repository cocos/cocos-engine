#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKSampler.h"

namespace cc {
namespace gfx {

CCVKSampler::CCVKSampler(Device *device)
: Sampler(device) {
}

CCVKSampler::~CCVKSampler() {
}

bool CCVKSampler::initialize(const SamplerInfo &info) {
    _name = info.name;
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

    _gpuSampler = CC_NEW(CCVKGPUSampler);
    _gpuSampler->minFilter = _minFilter;
    _gpuSampler->magFilter = _magFilter;
    _gpuSampler->mipFilter = _mipFilter;
    _gpuSampler->addressU = _addressU;
    _gpuSampler->addressV = _addressV;
    _gpuSampler->addressW = _addressW;
    _gpuSampler->maxAnisotropy = _maxAnisotropy;
    _gpuSampler->cmpFunc = _cmpFunc;
    _gpuSampler->borderColor = _borderColor;
    _gpuSampler->minLOD = _minLOD;
    _gpuSampler->maxLOD = _maxLOD;
    _gpuSampler->mipLODBias = _mipLODBias;

    CCVKCmdFuncCreateSampler((CCVKDevice *)_device, _gpuSampler);

    _status = Status::SUCCESS;

    return true;
}

void CCVKSampler::destroy() {
    if (_gpuSampler) {
        ((CCVKDevice *)_device)->gpuDescriptorHub()->disengage(_gpuSampler);
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuSampler);
        _gpuSampler = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
