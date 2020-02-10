#include "GLES2Std.h"
#include "GLES2Sampler.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2Sampler::GLES2Sampler(GFXDevice* device)
    : GFXSampler(device),
      gpu_sampler_(nullptr) {
}

GLES2Sampler::~GLES2Sampler() {
}

bool GLES2Sampler::initialize(const GFXSamplerInfo &info) {
  _name = info.name;
  _minFilter = info.min_filter;
  _magFilter = info.mag_filter;
  _mipFilter = info.mip_filter;
  _addressU = info.address_u;
  _addressV = info.address_v;
  _addressW = info.address_w;
  _maxAnisotropy = info.max_anisotropy;
  _cmpFunc = info.cmp_func;
  _borderColor = info.border_color;
  _minLod = info.min_lod;
  _maxLod = info.max_lod;
  _mipLodBias = info.mip_lod_bias;
  
  gpu_sampler_ = CC_NEW(GLES2GPUSampler);
  gpu_sampler_->min_filter = _minFilter;
  gpu_sampler_->mag_filter = _magFilter;
  gpu_sampler_->mip_filter = _mipFilter;
  gpu_sampler_->address_u = _addressU;
  gpu_sampler_->address_v = _addressV;
  gpu_sampler_->address_w = _addressW;
  gpu_sampler_->min_lod = _minLod;
  gpu_sampler_->max_lod = _maxLod;
  
  GLES2CmdFuncCreateSampler((GLES2Device*)_device, gpu_sampler_);
  
  return true;
}

void GLES2Sampler::destroy() {
  if (gpu_sampler_) {
    GLES2CmdFuncDestroySampler((GLES2Device*)_device, gpu_sampler_);
    CC_DELETE(gpu_sampler_);
    gpu_sampler_ = nullptr;
  }
}

NS_CC_END
