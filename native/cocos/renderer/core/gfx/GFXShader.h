#ifndef CC_CORE_GFX_SHADER_H_
#define CC_CORE_GFX_SHADER_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXShader : public Object {
 public:
  GFXShader(GFXDevice* device);
  virtual ~GFXShader();
  
 public:
  virtual bool Initialize(const GFXShaderInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE uint hash() const { return hash_; }
  CC_INLINE const String& name() const { return name_; }
  CC_INLINE const GFXShaderStageList& stages() const { return stages_; }
  CC_INLINE const GFXUniformBlockList& blocks() const { return blocks_; }
  CC_INLINE const GFXUniformSamplerList& samplers() const { return samplers_; }
  
 protected:
  GFXDevice* device_;
  uint hash_;
  String name_;
  GFXShaderStageList stages_;
  GFXUniformBlockList blocks_;
  GFXUniformSamplerList samplers_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
