#pragma once
#include "gfx-base/GFXRenderPass.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESRenderPass final : public RenderPass {
public:
    GLESRenderPass();
    ~GLESRenderPass() override;

    GLESGPURenderPass *gpuRenderPass() const { return _gpuRenderPass.get(); }

protected:
    void doInit(const RenderPassInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPURenderPass> _gpuRenderPass;
};

} // namespace cc::gfx
