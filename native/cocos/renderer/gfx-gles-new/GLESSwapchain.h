#pragma once

#include "gfx-base/GFXSwapchain.h"
#include "gfx-gles-new/egl/Surface.h"

namespace cc::gfx::gles {

class Swapchain : public gfx::Swapchain {
public:
    Swapchain();
    ~Swapchain() override;

    egl::Surface *getSurface() const { return _surface.get(); }

protected:
    void doInit(const SwapchainInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, SurfaceTransform transform) override;
    void doDestroySurface() override;
    void doCreateSurface(void *windowHandle) override;
    void createTexture();

    IntrusivePtr<egl::Surface> _surface;
    uint32_t _eglWidth{0};
    uint32_t _eglHeight{0};
    EGLint _swapInterval{0};
};

} // namespace cc::gfx::gles
