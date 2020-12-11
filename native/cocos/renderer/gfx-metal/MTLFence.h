#pragma once
namespace cc {
namespace gfx {

class CCMTLFence : public Fence {
public:
    CCMTLFence(Device *device);
    ~CCMTLFence() = default;

    virtual bool initialize(const FenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;

private:
};

} // namespace gfx
} // namespace cc
