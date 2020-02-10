#ifndef CC_GFXGLES3_GLES3_SAMPLER_H_
#define CC_GFXGLES3_GLES3_SAMPLER_H_

NS_CC_BEGIN

class GLES3GPUSampler;

class CC_GLES3_API GLES3Sampler : public GFXSampler {
public:
  GLES3Sampler(GFXDevice* device);
  ~GLES3Sampler();
  
public:
  bool initialize(const GFXSamplerInfo& info);
  void destroy();
  
  CC_INLINE GLES3GPUSampler* gpu_sampler() const { return gpu_sampler_; }
  
private:
  GLES3GPUSampler* gpu_sampler_;
};

NS_CC_END

#endif
