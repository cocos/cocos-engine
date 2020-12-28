#ifndef CC_GFXVULKAN_TEXTURE_H_
#define CC_GFXVULKAN_TEXTURE_H_

namespace cc {
namespace gfx {

class CCVKGPUTexture;
class CCVKGPUTextureView;

class CC_VULKAN_API CCVKTexture final : public Texture {
public:
    CCVKTexture(Device *device);
    ~CCVKTexture();

public:
    bool initialize(const TextureInfo &info);
    bool initialize(const TextureViewInfo &info);
    void destroy();
    void resize(uint width, uint height);

    CC_INLINE CCVKGPUTexture *gpuTexture() const { return _gpuTexture; }
    CC_INLINE CCVKGPUTextureView *gpuTextureView() const { return _gpuTextureView; }

private:
    void createTextureView();

    CCVKGPUTexture *_gpuTexture = nullptr;
    CCVKGPUTextureView *_gpuTextureView = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
