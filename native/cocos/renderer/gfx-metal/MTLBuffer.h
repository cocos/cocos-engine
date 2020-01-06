#pragma once

#import <Metal/MTLBuffer.h>

NS_CC_BEGIN

class CCMTLBuffer: public GFXBuffer
{
public:
    CCMTLBuffer(GFXDevice* device);
    ~CCMTLBuffer();
    
    virtual bool Initialize(const GFXBufferInfo& info) override;
    virtual void Destroy() override;
    virtual void Resize(uint size) override;
    virtual void Update(void* buffer, uint offset, uint size) override;
    
    CC_INLINE id<MTLBuffer> getMTLBuffer() const { return _mtlBuffer; }
    
private:
    id<MTLBuffer> _mtlBuffer = nullptr;
    uint8_t* _systemMemory = nullptr;
    // Whether backup memory and CCMTLBuffer share memory.
    bool _shareMemory = false;
};

NS_CC_END
