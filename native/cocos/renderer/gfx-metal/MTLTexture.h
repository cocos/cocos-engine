#pragma once

#import <Metal/MTLTexture.h>

namespace cc {
namespace gfx {

class CCMTLTexture : public Texture {
    friend class CCMTLDevice;
    friend class CCMTLQueue;

public:
    CCMTLTexture(Device *device);
    ~CCMTLTexture();

    virtual bool initialize(const TextureInfo &info) override;
    virtual bool initialize(const TextureViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;

    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    CC_INLINE Format getConvertedFormat() const { return _convertedFormat; }

private:
    void update(uint8_t *const *datas, const BufferTextureCopyList &regions);
    bool createMTLTexture();
    void generateMipmaps();

private:
    id<MTLTexture> _mtlTexture = nil;
    Format _convertedFormat = Format::UNKNOWN;
};

} // namespace gfx
} // namespace cc
