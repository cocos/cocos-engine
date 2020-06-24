#pragma once

namespace cc {
namespace gfx {

class CCMTLContext : public Context {
public:
    CCMTLContext(Device *device);
    ~CCMTLContext();

    bool initialize(const ContextInfo &info) override;
    void destroy() override{};
    void present() override{};
};

} // namespace gfx
} // namespace cc
