#ifndef CC_GFXGLES3_GLOBAL_BARRIER_H_
#define CC_GFXGLES3_GLOBAL_BARRIER_H_

namespace cc {
namespace gfx {

class GLES3GPUGlobalBarrier;

class CC_DLL GLES3GlobalBarrier : public GlobalBarrier {
public:
    GLES3GlobalBarrier(Device *device);
    ~GLES3GlobalBarrier();

    CC_INLINE const GLES3GPUGlobalBarrier *gpuBarrier() const { return _gpuBarrier; }

protected:
    bool initialize(const GlobalBarrierInfo &info) override;

    GLES3GPUGlobalBarrier *_gpuBarrier = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_GLOBAL_BARRIER_H_
