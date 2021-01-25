#ifndef CC_GFXVULKAN_TEXTURE_BARRIER_H_
#define CC_GFXVULKAN_TEXTURE_BARRIER_H_

namespace cc {
namespace gfx {

class CCVKGPUTextureBarrier;

class CC_DLL CCVKTextureBarrier : public TextureBarrier {
public:
    CCVKTextureBarrier(Device *device);
    ~CCVKTextureBarrier();

    CC_INLINE const CCVKGPUTextureBarrier *gpuBarrier() const { return _gpuBarrier; }

protected:
    bool initialize(const TextureBarrierInfo &info) override;

    CCVKGPUTextureBarrier *_gpuBarrier = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_TEXTURE_BARRIER_H_
