#pragma once

#import <Metal/MTLTexture.h>

NS_CC_BEGIN

class CCMTLTexture : public GFXTexture
{
    friend class CCMTLDevice;
public:
    CCMTLTexture(GFXDevice* device);
    ~CCMTLTexture();
    
    virtual bool initialize(const GFXTextureInfo& info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    
    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    CC_INLINE GFXFormat getConvertedFormat() const { return _convertedFormat; }
    
private:
    void update(uint8_t* data, const GFXBufferTextureCopy& region);
    
private:
    id<MTLTexture> _mtlTexture = nil;
    GFXFormat _convertedFormat = GFXFormat::UNKNOWN;
};

NS_CC_END
