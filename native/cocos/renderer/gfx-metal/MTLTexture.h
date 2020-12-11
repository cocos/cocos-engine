#pragma once

#import <Metal/MTLTexture.h>

namespace cc {
namespace gfx {

class CCMTLTexture : public Texture {
public:
    CCMTLTexture(Device *device);
    ~CCMTLTexture() = default;

    virtual bool initialize(const TextureInfo &info) override;
    virtual bool initialize(const TextureViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;

    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    CC_INLINE Format getConvertedFormat() const { return _convertedFormat; }
    CC_INLINE bool isArray() const { return _isArray; }
    CC_INLINE bool isPVRTC() const { return _isPVRTC; }

private:
    bool createMTLTexture();
    void generateMipmaps();

private:
    id<MTLTexture> _mtlTexture = nil;
    Format _convertedFormat = Format::UNKNOWN;
    bool _isArray = false;
    bool _isPVRTC = false;
};

} // namespace gfx
} // namespace cc
