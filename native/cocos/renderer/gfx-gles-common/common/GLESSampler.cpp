#include "GLESSampler.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

GLESSampler::GLESSampler(const SamplerInfo& info) : Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuSampler = ccnew GLESGPUSampler;
    _gpuSampler->minFilter = _info.minFilter;
    _gpuSampler->magFilter = _info.magFilter;
    _gpuSampler->mipFilter = _info.mipFilter;
    _gpuSampler->addressU = _info.addressU;
    _gpuSampler->addressV = _info.addressV;
    _gpuSampler->addressW = _info.addressW;

    glesCreateSampler(GLESDevice::getInstance(), _gpuSampler);
}

GLESGPUSampler::~GLESGPUSampler() {
    glesDestroySampler(GLESDevice::getInstance(), this);
}
} // namespace cc::gfx
