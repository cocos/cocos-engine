#pragma once

#include "gfx-base/GFXTexture.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"
#include "gfx-gles-new/egl/Surface.h"

namespace cc::gfx::gles {

struct GPUTexture : public GFXDeviceObject<DefaultDeleter> {
    // textureInfo
    TextureType type     = TextureType::TEX2D;
    uint32_t sampleCount = 1;
    uint32_t width       = 1;
    uint32_t height      = 1;
    uint32_t depth       = 1;
    uint32_t size        = 0;
    uint32_t mipLevel    = 1;
    uint32_t arrayLayer  = 1;
    GLenum   target      = GL_TEXTURE_2D;
    const InternalFormat *format = nullptr;

    // gpu handle
    GLuint texId         = 0;
    EGLSurface surface   = EGL_NO_SURFACE;
    bool isRenderBuffer  = false;

    GPUTexture() noexcept = default;
    ~GPUTexture() noexcept override;

    void initRenderBuffer();
    void initTexture();
};

struct GPUTextureView : GFXDeviceObject<DefaultDeleter> {
    IntrusivePtr<GPUTexture> texture;
    uint32_t baseLevel{0};
    uint32_t levelCount{1};
    uint32_t baseLayer{0};
    uint32_t layerCount{1};
};

class Texture : public gfx::Texture {
public:
    Texture();
    ~Texture() override;

    GPUTextureView *getGPUTextureView() const { return _gpuTextureView.get(); }

private:
    void doInit(const TextureInfo &info) override;
    void doInit(const TextureViewInfo &info) override;
    void doInit(const SwapchainTextureInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t width, uint32_t height, uint32_t size) override;

    uint32_t getGLTextureHandle() const noexcept override { return 0; }

    void initGPUTexture(uint32_t width, uint32_t height, uint32_t size);

    IntrusivePtr<GPUTextureView> _gpuTextureView;
};

} // namespace cc::gfx::gles
