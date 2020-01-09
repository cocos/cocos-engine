#pragma once

#import <Metal/MTLTexture.h>

NS_CC_BEGIN

class CCMTLTextureView : public GFXTextureView
{
public:
    CCMTLTextureView(GFXDevice* device);
    ~CCMTLTextureView();
    
    bool Initialize(const GFXTextureViewInfo& info) override;
    void Destroy() override;
    
    CC_INLINE id<MTLTexture> getMTLTexture() const { return _mtlTexture; }
    
private:
    id<MTLTexture> _mtlTexture = nil;
    GFXFormat _convertedFormat = GFXFormat::UNKNOWN;
};

NS_CC_END
