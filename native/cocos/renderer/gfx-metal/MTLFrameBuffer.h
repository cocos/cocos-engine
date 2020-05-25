#pragma once

NS_CC_BEGIN

class CCMTLFramebuffer : public GFXFramebuffer
{
public:
    CCMTLFramebuffer(GFXDevice* device);
    ~CCMTLFramebuffer();
    
    virtual bool initialize(const GFXFramebufferInfo& info) override;
    virtual void destroy() override;
};

NS_CC_END
