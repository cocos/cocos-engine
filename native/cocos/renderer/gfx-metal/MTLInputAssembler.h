#pragma once

NS_CC_BEGIN

class CCMTLCmdDraw;
class CCMTLGPUInputAssembler;

class CCMTLInputAssembler : public GFXInputAssembler
{
public:
    CCMTLInputAssembler(GFXDevice* device);
    ~CCMTLInputAssembler();
    
    virtual bool Initialize(const GFXInputAssemblerInfo& info) override;
    virtual void Destroy() override;
    
    void extractDrawInfo(CCMTLCmdDraw*) const;
    
    CC_INLINE CCMTLGPUInputAssembler* getGPUInputAssembler() const { return _GPUInputAssembler; }
    
private:
    CCMTLGPUInputAssembler* _GPUInputAssembler = nullptr;
};

NS_CC_END
