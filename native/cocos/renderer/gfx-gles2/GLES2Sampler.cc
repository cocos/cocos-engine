#include "GLES2Std.h"
#include "GLES2Sampler.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2Sampler::GLES2Sampler(GFXDevice *device)
: GFXSampler(device) {
}

GLES2Sampler::~GLES2Sampler() {
}

bool GLES2Sampler::initialize(const GFXSamplerInfo &info) {
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

    _gpuSampler = CC_NEW(GLES2GPUSampler);
    _gpuSampler->minFilter = _minFilter;
    _gpuSampler->magFilter = _magFilter;
    _gpuSampler->mipFilter = _mipFilter;
    _gpuSampler->addressU = _addressU;
    _gpuSampler->addressV = _addressV;
    _gpuSampler->addressW = _addressW;
    _gpuSampler->minLOD = _minLOD;
    _gpuSampler->maxLOD = _maxLOD;

    _status = GFXStatus::SUCCESS;

    GLES2CmdFuncCreateSampler((GLES2Device *)_device, _gpuSampler);

    return true;
}

void GLES2Sampler::destroy() {
    if (_gpuSampler) {
        GLES2CmdFuncDestroySampler((GLES2Device *)_device, _gpuSampler);
        CC_DELETE(_gpuSampler);
        _gpuSampler = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

} // namespace gfx
} // namespace cc
