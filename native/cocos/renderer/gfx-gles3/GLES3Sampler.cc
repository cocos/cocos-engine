#include "GLES3Std.h"
#include "GLES3Sampler.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3Sampler::GLES3Sampler(GFXDevice* device)
    : GFXSampler(device),
      gpu_sampler_(nullptr) {
}

GLES3Sampler::~GLES3Sampler() {
}

bool GLES3Sampler::Initialize(const GFXSamplerInfo &info) {
  name_ = info.name;
  min_filter_ = info.min_filter;
  mag_filter_ = info.mag_filter;
  mip_filter_ = info.mip_filter;
  address_u_ = info.address_u;
  address_v_ = info.address_v;
  address_w_ = info.address_w;
  max_anisotropy_ = info.max_anisotropy;
  cmp_func_ = info.cmp_func;
  border_color_ = info.border_color;
  min_lod_ = info.min_lod;
  max_lod_ = info.max_lod;
  mip_lod_bias_ = info.mip_lod_bias;
  
  gpu_sampler_ = CC_NEW(GLES3GPUSampler);
  gpu_sampler_->min_filter = min_filter_;
  gpu_sampler_->mag_filter = mag_filter_;
  gpu_sampler_->mip_filter = mip_filter_;
  gpu_sampler_->address_u = address_u_;
  gpu_sampler_->address_v = address_v_;
  gpu_sampler_->address_w = address_w_;
  gpu_sampler_->min_lod = min_lod_;
  gpu_sampler_->max_lod = max_lod_;
  
  GLES3CmdFuncCreateSampler((GLES3Device*)device_, gpu_sampler_);
  
  return true;
}

void GLES3Sampler::Destroy() {
  if (gpu_sampler_) {
    GLES3CmdFuncDestroySampler((GLES3Device*)device_, gpu_sampler_);
    CC_DELETE(gpu_sampler_);
    gpu_sampler_ = nullptr;
  }
}

NS_CC_END
