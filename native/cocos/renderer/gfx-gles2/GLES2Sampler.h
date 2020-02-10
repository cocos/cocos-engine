#ifndef CC_GFXGLES2_GLES2_SAMPLER_H_
#define CC_GFXGLES2_GLES2_SAMPLER_H_

NS_CC_BEGIN

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler : public GFXSampler {
public:
  GLES2Sampler(GFXDevice* device);
  ~GLES2Sampler();
  
public:
  bool initialize(const GFXSamplerInfo& info);
  void destroy();
  
  CC_INLINE GLES2GPUSampler* gpu_sampler() const { return gpu_sampler_; }
  
private:
  GLES2GPUSampler* gpu_sampler_;
  String _name;
  GFXFilter _minFilter = GFXFilter::LINEAR;
  GFXFilter _magFilter = GFXFilter::LINEAR;
  GFXFilter _mipFilter = GFXFilter::NONE;
  GFXAddress _addressU = GFXAddress::WRAP;
  GFXAddress _addressV = GFXAddress::WRAP;
  GFXAddress _addressW = GFXAddress::WRAP;
  uint _maxAnisotropy = 16;
  GFXComparisonFunc _cmpFunc = GFXComparisonFunc::NEVER;
  GFXColor _borderColor;
  uint _minLod = 0;
  uint _maxLod = 1000;
  float _mipLodBias = 0.0f;
};

NS_CC_END

#endif
