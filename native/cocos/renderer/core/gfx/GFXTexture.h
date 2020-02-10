#ifndef CC_CORE_GFX_TEXTURE_H_
#define CC_CORE_GFX_TEXTURE_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXTexture : public Object {
 public:
  GFXTexture(GFXDevice* device);
  virtual ~GFXTexture();
  
 public:
  virtual bool initialize(const GFXTextureInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void resize(uint width, uint height) = 0;
  
  CC_INLINE GFXTextureType type() const { return _type; }
  CC_INLINE GFXTextureUsage usage() const { return _usage; }
  CC_INLINE GFXFormat format() const { return _format; }
  CC_INLINE uint width() const { return _width; }
  CC_INLINE uint height() const { return _height; }
  CC_INLINE uint depth() const { return _depth; }
  CC_INLINE uint arrayLayer() const { return _arrayLayer; }
  CC_INLINE uint mipLevel() const { return _mipLevel; }
  CC_INLINE uint size() const { return _size; }
  CC_INLINE GFXSampleCount samples() const { return _samples; }
  CC_INLINE GFXTextureFlags flags() const { return _flags; }
  CC_INLINE uint8_t* buffer() const { return _buffer; }
  
 protected:
  GFXDevice* _device = nullptr;
  GFXTextureType _type = GFXTextureType::TEX2D;
  GFXTextureUsage _usage = GFXTextureUsageBit::NONE;
  GFXFormat _format = GFXFormat::UNKNOWN;
  uint _width = 0;
  uint _height = 0;
  uint _depth = 1;
  uint _arrayLayer = 1;
  uint _mipLevel = 1;
  uint _size = 0;
  GFXSampleCount _samples = GFXSampleCount::X1;
  GFXTextureFlags _flags = GFXTextureFlagBit::NONE;
  uint8_t* _buffer = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_H_
