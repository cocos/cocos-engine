#ifndef CC_CORE_GFX_SHADER_H_
#define CC_CORE_GFX_SHADER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXShader : public Object {
 public:
  GFXShader(GFXDevice* device);
  virtual ~GFXShader();
  
 public:
  virtual bool initialize(const GFXShaderInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE uint id() const { return _hash; }
  CC_INLINE const String& name() const { return _name; }
  CC_INLINE const GFXShaderStageList& stages() const { return _stages; }
  CC_INLINE const GFXUniformBlockList& blocks() const { return _blocks; }
  CC_INLINE const GFXUniformSamplerList& samplers() const { return _samplers; }
  
 protected:
  GFXDevice* _device = nullptr;
  uint _hash = 0;
  String _name;
  GFXShaderStageList _stages;
  GFXUniformBlockList _blocks;
  GFXUniformSamplerList _samplers;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
