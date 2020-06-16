#pragma once

namespace cc {
namespace gfx {

class CCMTLFramebuffer : public GFXFramebuffer {
public:
    CCMTLFramebuffer(GFXDevice *device);
    ~CCMTLFramebuffer();

    virtual bool initialize(const GFXFramebufferInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
