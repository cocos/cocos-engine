#pragma once

#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"
#include "gfx-gles-new/GLESTexture.h"
#include "gfx-gles-new/GLESRenderPass.h"
#include "gfx-gles-new/egl/Surface.h"
#include "base/std/container/vector.h"

namespace cc::gfx::gles {

struct GPUFramebuffer : public GFXDeviceObject<DefaultDeleter> {
    GPUFramebuffer() noexcept = default;
    ~GPUFramebuffer() noexcept override;

    void initFramebuffer();

    struct FBHandle {
        GLuint fbo         = 0;
        EGLSurface surface = EGL_NO_SURFACE;
    };

    ccstd::vector<FBHandle> fboList;
    ccstd::vector<IntrusivePtr<GPUTextureView>> attachments;
    IntrusivePtr<GPURenderPass> renderPass;
};

class Framebuffer : public gfx::Framebuffer {
public:
    Framebuffer();
    ~Framebuffer() override;

    GPUFramebuffer *getGPUFramebuffer() const { return _gpuFramebuffer.get(); }

private:
    void doInit(const FramebufferInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUFramebuffer> _gpuFramebuffer;
};

} // namespace cc::gfx::gles
