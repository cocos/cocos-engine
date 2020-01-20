#ifndef CC_GFXGLES2_GLES2_SAMPLER_H_
#define CC_GFXGLES2_GLES2_SAMPLER_H_

NS_CC_BEGIN

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler : public GFXSampler {
public:
  GLES2Sampler(GFXDevice* device);
  ~GLES2Sampler();
  
public:
  bool Initialize(const GFXSamplerInfo& info);
  void destroy();
  
  CC_INLINE GLES2GPUSampler* gpu_sampler() const { return gpu_sampler_; }
  
private:
  GLES2GPUSampler* gpu_sampler_;
  String name_;
  GFXFilter min_filter_ = GFXFilter::LINEAR;
  GFXFilter mag_filter_ = GFXFilter::LINEAR;
  GFXFilter mip_filter_ = GFXFilter::NONE;
  GFXAddress address_u_ = GFXAddress::WRAP;
  GFXAddress address_v_ = GFXAddress::WRAP;
  GFXAddress address_w_ = GFXAddress::WRAP;
  uint max_anisotropy_ = 16;
  GFXComparisonFunc cmp_func_ = GFXComparisonFunc::NEVER;
  GFXColor border_color_;
  uint min_lod_ = 0;
  uint max_lod_ = 1000;
  float mip_lod_bias_ = 0.0f;
};

NS_CC_END

#endif
