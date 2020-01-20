#pragma once

NS_CC_BEGIN

class CCMTLWindow : public GFXWindow
{
public:
    CCMTLWindow(GFXDevice* device);
    ~CCMTLWindow();
    
    virtual bool Initialize(const GFXWindowInfo& info) override;
    virtual void destroy() override;
    virtual void Resize(uint width, uint height) override;
};

NS_CC_END
