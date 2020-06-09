#pragma once

#import <Metal/MTLTexture.h>

NS_CC_BEGIN

class CCMTLTexture : public GFXTexture {
    friend class CCMTLDevice;
    friend class CCMTLQueue;

public:
    CCMTLTexture(GFXDevice *device);
    ~CCMTLTexture();

    virtual bool initialize(const GFXTextureInfo &info) override;
    virtual bool initialize(const GFXTextureViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;

    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    CC_INLINE GFXFormat getConvertedFormat() const { return _convertedFormat; }

private:
    void update(uint8_t *const *datas, const GFXBufferTextureCopyList &regions);
    bool createMTLTexture();
    void generateMipmaps();

private:
    id<MTLTexture> _mtlTexture = nil;
    GFXFormat _convertedFormat = GFXFormat::UNKNOWN;
};

NS_CC_END
