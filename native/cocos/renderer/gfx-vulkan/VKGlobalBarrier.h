#ifndef CC_GFXVULKAN_GLOBAL_BARRIER_H_
#define CC_GFXVULKAN_GLOBAL_BARRIER_H_

namespace cc {
namespace gfx {

class CCVKGPUGlobalBarrier;

class CC_DLL CCVKGlobalBarrier : public GlobalBarrier {
public:
    CCVKGlobalBarrier(Device *device);
    ~CCVKGlobalBarrier();

    CC_INLINE const CCVKGPUGlobalBarrier *gpuBarrier() const { return _gpuBarrier; }

protected:
    bool initialize(const GlobalBarrierInfo &info) override;

    CCVKGPUGlobalBarrier *_gpuBarrier = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_GLOBAL_BARRIER_H_
