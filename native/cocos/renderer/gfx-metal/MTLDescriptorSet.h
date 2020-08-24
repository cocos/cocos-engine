#pragma once
namespace cc {
namespace gfx {
class CCMTLGPUDescriptorSet;

class CCMTLDescriptorSet : public DescriptorSet {
public:
    CCMTLDescriptorSet(Device *device);
    ~CCMTLDescriptorSet();
    
    virtual bool initialize(const DescriptorSetInfo &info) override;
    virtual void destroy() override;
    virtual void update() override;
    
    CC_INLINE CCMTLGPUDescriptorSet *gpuDescriptorSet() const { return _gpuDescriptorSet; }
private:
    
    CCMTLGPUDescriptorSet *_gpuDescriptorSet = nullptr;
};
}
}
