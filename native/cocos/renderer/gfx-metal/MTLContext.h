#pragma once

NS_CC_BEGIN

class CCMTLContext : public GFXContext {
public:
    CCMTLContext(GFXDevice *device);
    ~CCMTLContext();

    bool initialize(const GFXContextInfo &info) override;
    void destroy() override{};
    void present() override{};
};

NS_CC_END
