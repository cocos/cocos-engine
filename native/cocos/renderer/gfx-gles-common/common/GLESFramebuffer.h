#pragma once

#include "gfx-base/GFXFramebuffer.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESFramebuffer final : public Framebuffer {
public:
    GLESFramebuffer();
    ~GLESFramebuffer() override;

    GLESGPUFramebuffer *gpuFramebuffer() const { return _gpuFBO.get(); }

protected:
    void doInit(const FramebufferInfo &info) override;
    void doDestroy() override;
    void updateExtent();

    IntrusivePtr<GLESGPUFramebuffer> _gpuFBO;
};

} // namespace cc::gfx
