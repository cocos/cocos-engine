#pragma once

namespace cc {
namespace gfx {

class CCMTLContext : public GFXContext {
public:
    CCMTLContext(GFXDevice *device);
    ~CCMTLContext();

    bool initialize(const GFXContextInfo &info) override;
    void destroy() override{};
    void present() override{};
};

} // namespace gfx
} // namespace cc
