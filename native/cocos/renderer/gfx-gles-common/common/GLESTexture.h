#pragma once

#include "gfx-base/GFXTexture.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESTexture final : public gfx::Texture {
public:
    GLESTexture();
    ~GLESTexture() override;

    GLESGPUTexture *gpuTexture() const { return _gpuTexture.get(); }
    GLESGPUTextureView *gpuTextureView() const { return _gpuTextureView.get(); }

private:
    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doInit(const SwapchainTextureInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;

    void createTextureView();

    IntrusivePtr<GLESGPUTexture> _gpuTexture;
    IntrusivePtr<GLESGPUTextureView> _gpuTextureView;
};

} // namespace cc::gfx
