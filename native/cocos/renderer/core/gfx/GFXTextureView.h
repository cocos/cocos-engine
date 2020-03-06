#ifndef CC_CORE_GFX_TEXTURE_VIEW_H_
#define CC_CORE_GFX_TEXTURE_VIEW_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXTextureView : public Object {
 public:
  GFXTextureView(GFXDevice* device);
  virtual ~GFXTextureView();
  
 public:
  virtual bool initialize(const GFXTextureViewInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  CC_INLINE GFXTexture* getTexture() const { return _texture; }
  CC_INLINE GFXTextureViewType getType() const { return _type; }
  CC_INLINE GFXFormat getFormat() const { return _format; }
  CC_INLINE uint getBaseLevel() const { return _baseLevel; }
  CC_INLINE uint getLevelCount() const { return _levelCount; }
  CC_INLINE uint getBaseLayer() const { return _baseLayer; }
  CC_INLINE uint getLayerCount() const { return _layerCount; }
  
 protected:
  GFXDevice* _device = nullptr;
  GFXTexture* _texture = nullptr;
  GFXTextureViewType _type = GFXTextureViewType::TV2D;
  GFXFormat _format = GFXFormat::UNKNOWN;
  uint _baseLevel = 0;
  uint _levelCount = 1;
  uint _baseLayer = 0;
  uint _layerCount = 1;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
