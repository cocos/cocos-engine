/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "gfx-base/GFXBuffer.h"

#import <Metal/MTLBuffer.h>
#import <Metal/MTLRenderCommandEncoder.h>
#import <Metal/MTLStageInputOutputDescriptor.h>

namespace cc {
namespace gfx {

class CCMTLCommandEncoder;
struct CCMTLGPUBuffer;

class CCMTLBuffer final : public Buffer {
public:
    explicit CCMTLBuffer();
    ~CCMTLBuffer();
    CCMTLBuffer(const CCMTLBuffer &) = delete;
    CCMTLBuffer(CCMTLBuffer &&) = delete;
    CCMTLBuffer &operator=(const CCMTLBuffer &) = delete;
    CCMTLBuffer &operator=(CCMTLBuffer &&) = delete;

    void update(const void *buffer, uint32_t offset) override;

    void encodeBuffer(CCMTLCommandEncoder &encoder, uint32_t offset, uint32_t binding, ShaderStageFlags stages);

    uint32_t currentOffset() const;
    id<MTLBuffer> mtlBuffer() const;

    inline CCMTLGPUBuffer *gpuBuffer() { return _gpuBuffer; }
    inline MTLIndexType getIndexType() const { return _indexType; }
    inline bool isDrawIndirectByIndex() const { return _isDrawIndirectByIndex; }
    inline const DrawInfoList &getDrawInfos() const { return _drawInfos; }

protected:
    void doInit(const BufferInfo &info) override;
    void doInit(const BufferViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t size, uint32_t count) override;

    bool createMTLBuffer(uint32_t size, MemoryUsage usage);
    void updateMTLBuffer(const void *buffer, uint32_t offset, uint32_t size);

    MTLIndexType _indexType = MTLIndexTypeUInt16;
    MTLResourceOptions _mtlResourceOptions = MTLResourceStorageModePrivate;
    bool _isIndirectDrawSupported = false;
    uint32_t _bufferViewOffset = 0;
    uint8_t _lastUpdateCycle{0};

    bool _isDrawIndirectByIndex = false;
    ccstd::vector<MTLDrawIndexedPrimitivesIndirectArguments> _indexedPrimitivesIndirectArguments;
    ccstd::vector<MTLDrawPrimitivesIndirectArguments> _primitiveIndirectArguments;
    DrawInfoList _drawInfos;

    CCMTLGPUBuffer *_gpuBuffer = nullptr;
};

} // namespace gfx
} // namespace cc
