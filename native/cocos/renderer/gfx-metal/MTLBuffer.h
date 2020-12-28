#pragma once

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLStageInputOutputDescriptor.h>

namespace cc {
namespace gfx {

class CCMTLBuffer;
class CCMTLRenderCommandEncoder;

class CCMTLBuffer : public Buffer {
public:
    CCMTLBuffer(Device *device);
    ~CCMTLBuffer() = default;

    virtual bool initialize(const BufferInfo &info) override;
    virtual bool initialize(const BufferViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint offset) override;

    void encodeBuffer(CCMTLRenderCommandEncoder &encoder, uint offset, uint binding, ShaderStageFlags stages);

    CC_INLINE id<MTLBuffer> getMTLBuffer() const { return _mtlBuffer; }
    CC_INLINE MTLIndexType getIndexType() const { return _indexType; }
    CC_INLINE bool isDrawIndirectByIndex() const { return _isDrawIndirectByIndex; }
    CC_INLINE const DrawInfoList &getDrawInfos() const { return _drawInfos; }

private:
    void resizeBuffer(uint8_t **, uint, uint);
    bool createMTLBuffer(uint size, MemoryUsage usage);
    void updateMTLBuffer(void *buffer, uint offset, uint size);

    id<MTLDevice> _mtlDevice = nil;
    id<MTLBuffer> _mtlBuffer = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLResourceOptions _mtlResourceOptions = MTLResourceStorageModePrivate;
    NSMutableArray *_dynamicDataBuffers = nil;
    bool _isIndirectDrawSupported = false;
    uint _bufferViewOffset = 0;

    bool _isDrawIndirectByIndex = false;
    std::vector<MTLDrawIndexedPrimitivesIndirectArguments> _indexedPrimitivesIndirectArguments;
    std::vector<MTLDrawPrimitivesIndirectArguments> _primitiveIndirectArguments;
    DrawInfoList _drawInfos;
};

} // namespace gfx
} // namespace cc
