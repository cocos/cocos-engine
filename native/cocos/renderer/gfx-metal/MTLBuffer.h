/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#pragma once

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLStageInputOutputDescriptor.h>

namespace cc {
namespace gfx {

class CCMTLBuffer;
class CCMTLRenderCommandEncoder;

class CCMTLBuffer final : public Buffer {
public:
    explicit CCMTLBuffer(Device *device);
    ~CCMTLBuffer() override = default;
    CCMTLBuffer(const CCMTLBuffer &) = delete;
    CCMTLBuffer(CCMTLBuffer &&) = delete;
    CCMTLBuffer &operator=(const CCMTLBuffer &) = default;
    CCMTLBuffer &operator=(CCMTLBuffer &&) = delete;

    bool initialize(const BufferInfo &info) override;
    bool initialize(const BufferViewInfo &info) override;
    void destroy() override;
    void resize(uint size) override;
    void update(void *buffer, uint offset) override;

    void encodeBuffer(CCMTLRenderCommandEncoder &encoder, uint offset, uint binding, ShaderStageFlags stages);

    CC_INLINE id<MTLBuffer> getMTLBuffer() const { return _mtlBuffer; }
    CC_INLINE MTLIndexType getIndexType() const { return _indexType; }
    CC_INLINE bool isDrawIndirectByIndex() const { return _isDrawIndirectByIndex; }
    CC_INLINE const DrawInfoList &getDrawInfos() const { return _drawInfos; }

private:
    void resizeBuffer(uint8_t **, uint, uint);
    bool createMTLBuffer(uint size, MemoryUsage usage);
    void updateMTLBuffer(void *buffer, uint offset, uint size);

    id<MTLBuffer> _mtlBuffer = nullptr;
    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLResourceOptions _mtlResourceOptions = MTLResourceStorageModePrivate;
    bool _isIndirectDrawSupported = false;
    uint _bufferViewOffset = 0;

    bool _isDrawIndirectByIndex = false;
    std::vector<MTLDrawIndexedPrimitivesIndirectArguments> _indexedPrimitivesIndirectArguments;
    std::vector<MTLDrawPrimitivesIndirectArguments> _primitiveIndirectArguments;
    DrawInfoList _drawInfos;
};

} // namespace gfx
} // namespace cc
