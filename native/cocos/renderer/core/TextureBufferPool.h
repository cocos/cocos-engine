/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include <functional>
#include "audio/android/PcmBufferProvider.h"
#include "base/std/optional.h"
#include "core/ArrayBuffer.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {
using roundUpType = std::function<uint32_t(uint32_t size, uint32_t formatSize)>;

struct ITextureBuffer {
    gfx::Texture *texture{nullptr};
    uint32_t size{0};
    index_t start{0};
    index_t end{0};
};

struct ITextureBufferHandle {
    index_t chunkIdx{0};
    index_t start{0};
    index_t end{0};
    gfx::Texture *texture{nullptr};

    bool operator==(const ITextureBufferHandle &handle) const {
        return chunkIdx == handle.chunkIdx && start == handle.start && end == handle.end && texture == handle.texture;
    }
};

struct ITextureBufferPoolInfo {
    gfx::Format format{gfx::Format::UNKNOWN}; // target texture format
    ccstd::optional<bool> inOrderFree;        // will the handles be freed exactly in the order of their allocation?
    ccstd::optional<uint32_t> alignment;      // the data alignment for each handle allocated, in bytes
    ccstd::optional<roundUpType> roundUpFn;   // given a target size, how will the actual texture size round up?
};

class TextureBufferPool : public RefCounted {
public:
    TextureBufferPool();
    explicit TextureBufferPool(gfx::Device *device);
    ~TextureBufferPool() override;

    void initialize(const ITextureBufferPoolInfo &info);
    void destroy();
    ITextureBufferHandle alloc(uint32_t size);
    ITextureBufferHandle alloc(uint32_t size, index_t chunkIdx);

    void free(const ITextureBufferHandle &handle);
    uint32_t createChunk(uint32_t length);
    void update(const ITextureBufferHandle &handle, ArrayBuffer *buffer);

private:
    index_t findAvailableSpace(uint32_t size, index_t chunkIdx) const;

    // [McDonald 12] Efficient Buffer Management
    ITextureBufferHandle mcDonaldAlloc(uint32_t size);

    gfx::Device *_device{nullptr};
    gfx::Format _format{gfx::Format::UNKNOWN};
    uint32_t _formatSize{0};
    ccstd::vector<ITextureBuffer> _chunks;
    uint32_t _chunkCount{0};
    ccstd::vector<ITextureBufferHandle> _handles;
    gfx::BufferTextureCopy _region0;
    gfx::BufferTextureCopy _region1;
    gfx::BufferTextureCopy _region2;
    roundUpType _roundUpFn{nullptr};
    bool _useMcDonaldAlloc{false};
    uint32_t _channels{4};
    uint32_t _alignment{1};
    CC_DISALLOW_COPY_MOVE_ASSIGN(TextureBufferPool);
};

} // namespace cc
