#pragma once

namespace cc {
namespace gfx {

class CCMTLFence : public GFXFence {
public:
    CCMTLFence(GFXDevice *device);
    ~CCMTLFence();

    virtual bool initialize(const GFXFenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

private:
};

} // namespace gfx
} // namespace cc
