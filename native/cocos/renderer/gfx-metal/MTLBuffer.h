#pragma once

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLStageInputOutputDescriptor.h>

namespace cc {
namespace gfx {

class CCMTLBuffer;
class CCMTLBufferManager {
public:
    static void addBuffer(CCMTLBuffer *buffer);
    static void removeBuffer(CCMTLBuffer *buffer);
    static void begin();

private:
    static vector<CCMTLBuffer *> _buffers;
};

class CCMTLBuffer : public Buffer {
public:
    CCMTLBuffer(Device *device);
    ~CCMTLBuffer();

    virtual bool initialize(const BufferInfo &info) override;
    virtual bool initialize(const BufferViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint offset, uint size) override;

    CC_INLINE id<MTLBuffer> getMTLBuffer() const { return _mtlBuffer; }
    CC_INLINE uint8_t *getTransferBuffer() const { return _transferBuffer; }
    CC_INLINE MTLIndexType getIndexType() const { return _indexType; }
    CC_INLINE bool isDrawIndirectByIndex() const { return _isDrawIndirectByIndex; }
    void encodeBuffer(id<MTLRenderCommandEncoder> encoder, uint offset, uint binding, ShaderStageFlags stages);

private:
    friend class CCMTLBufferManager;
    void resizeBuffer(uint8_t **, uint, uint);
    bool createMTLBuffer(uint size, MemoryUsage usage);
    void begin();
    void updateInflightBuffer(uint offset, uint size);

    id<MTLDevice> _mtlDevice = nil;
    bool _inflightDirty = false;
    uint _inflightIndex = 0;
    id<MTLBuffer> _mtlBuffer = nullptr;
    uint8_t *_transferBuffer = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLResourceOptions _mtlResourceOptions = MTLResourceStorageModePrivate;
    NSMutableArray *_dynamicDataBuffers = nil;
    bool _tripleEnabled = false;

    bool _isDrawIndirectByIndex = false;
    uint _bufferViewOffset = 0;
};

} // namespace gfx
} // namespace cc
