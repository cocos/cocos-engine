#pragma once

namespace cc {
namespace gfx {

class CCMTLFramebuffer : public Framebuffer {
public:
    CCMTLFramebuffer(Device *device);
    ~CCMTLFramebuffer() = default;

    virtual bool initialize(const FramebufferInfo &info) override;
    virtual void destroy() override;

    CC_INLINE bool isOffscreen() const { return _isOffscreen; }

private:
    bool _isOffscreen = false;
};

} // namespace gfx
} // namespace cc
