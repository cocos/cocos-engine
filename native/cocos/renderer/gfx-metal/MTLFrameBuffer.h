#pragma once

namespace cc {
namespace gfx {

class CCMTLFramebuffer : public Framebuffer {
public:
    CCMTLFramebuffer(Device *device);
    ~CCMTLFramebuffer();

    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
