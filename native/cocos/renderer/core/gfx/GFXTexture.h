#ifndef CC_CORE_GFX_TEXTURE_H_
#define CC_CORE_GFX_TEXTURE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Texture : public GFXObject {
public:
    Texture(Device *device);
    virtual ~Texture();

public:
    virtual bool initialize(const TextureInfo &info) = 0;
    virtual bool initialize(const TextureViewInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void resize(uint width, uint height) = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE TextureType getType() const { return _type; }
    CC_INLINE TextureUsage getUsage() const { return _usage; }
    CC_INLINE Format getFormat() const { return _format; }
    CC_INLINE uint getWidth() const { return _width; }
    CC_INLINE uint getHeight() const { return _height; }
    CC_INLINE uint getDepth() const { return _depth; }
    CC_INLINE uint getLayerCount() const { return _layerCount; }
    CC_INLINE uint getLevelCount() const { return _levelCount; }
    CC_INLINE uint getSize() const { return _size; }
    CC_INLINE SampleCount getSamples() const { return _samples; }
    CC_INLINE TextureFlags getFlags() const { return _flags; }
    CC_INLINE uint8_t *getBuffer() const { return _buffer; }
    CC_INLINE bool isTextureView() const { return _isTextureView; }

protected:
    Device *_device = nullptr;
    TextureType _type = TextureType::TEX2D;
    TextureUsage _usage = TextureUsageBit::NONE;
    Format _format = Format::UNKNOWN;
    uint _width = 0u;
    uint _height = 0u;
    uint _depth = 1u;
    uint _baseLevel = 0u;
    uint _levelCount = 1u;
    uint _baseLayer = 0u;
    uint _layerCount = 1u;
    uint _size = 0u;
    SampleCount _samples = SampleCount::X1;
    TextureFlags _flags = TextureFlagBit::NONE;
    uint8_t *_buffer = nullptr;
    bool _isTextureView = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_TEXTURE_H_
