#pragma once
namespace cc {
namespace gfx {
class CCMTLGPUPipelineLayout;

class CCMTLPipelineLayout : public PipelineLayout {
public:
    CCMTLPipelineLayout(Device *device);
    virtual ~CCMTLPipelineLayout() = default;

    virtual bool initialize(const PipelineLayoutInfo &info) override;
    virtual void destroy() override;

    CC_INLINE CCMTLGPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout; }

private:
    CCMTLGPUPipelineLayout *_gpuPipelineLayout = nullptr;
};
} // namespace gfx
} // namespace cc
