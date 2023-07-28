#pragma once

#include "gfx-base/GFXSwapchain.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc {
class IXRInterface;
} // namespace cc

namespace cc::gfx {

class GLESSwapchain final : public Swapchain {
public:
    GLESSwapchain();
    ~GLESSwapchain() override;

    GLESGPUSwapchain *gpuSwapchain() const { return _gpuSwapchain.get(); }

protected:
    void doInit(const SwapchainInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, SurfaceTransform transform) override;
    void doDestroySurface() override;
    void doCreateSurface(void *windowHandle) override;

    IntrusivePtr<GLESGPUSwapchain> _gpuSwapchain;
    IXRInterface *_xr{nullptr};
};

} // namespace cc::gfx
