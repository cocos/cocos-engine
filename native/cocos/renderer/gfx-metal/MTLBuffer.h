#pragma once

#import <Metal/MTLBuffer.h>
#import <Metal/MTLStageInputOutputDescriptor.h>

NS_CC_BEGIN

class CCMTLBuffer: public GFXBuffer
{
public:
    CCMTLBuffer(GFXDevice* device);
    ~CCMTLBuffer();
    
    virtual bool initialize(const GFXBufferInfo& info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void* buffer, uint offset, uint size) override;
    
    CC_INLINE id<MTLBuffer> getMTLBuffer() const { return _mtlBuffer; }
    CC_INLINE uint8_t* getTransferBuffer() const { return _transferBuffer; }
    CC_INLINE MTLIndexType getIndexType() const { return _indexType; }
    
private:
    void resizeBuffer(uint8_t**, uint, uint);
    
    id<MTLBuffer> _mtlBuffer = nullptr;
    uint8_t* _transferBuffer = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLResourceOptions _mtlResourceOptions = MTLResourceStorageModePrivate;
};

NS_CC_END
