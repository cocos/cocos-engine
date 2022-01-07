/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
#include "cocos/base/Optional.h"
#include "core/ArrayBuffer.h"
#include "gfx-base/GFXTexture.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {
using roundUpType = std::function<uint32_t(uint32_t size, uint32_t formatSize)>;

struct ITextureBuffer {
    gfx::Texture *texture{nullptr};
    uint32_t      size{0};
    index_t       start{0};
    index_t       end{0};
};

struct ITextureBufferHandle {
    index_t       chunkIdx{0};
    index_t       start{0};
    index_t       end{0};
    gfx::Texture *texture{nullptr};

    bool operator==(const ITextureBufferHandle &handle) const {
        return chunkIdx == handle.chunkIdx && start == handle.start && end == handle.end && texture == handle.texture;
    }
};

struct ITextureBufferPoolInfo {
    gfx::Format               format{gfx::Format::UNKNOWN}; // target texture format
    cc::optional<bool>        inOrderFree;                  // will the handles be freed exactly in the order of their allocation?
    cc::optional<uint32_t>    alignment;                    // the data alignment for each handle allocated, in bytes
    cc::optional<roundUpType> roundUpFn;                    // given a target size, how will the actual texture size round up?
};

class TextureBufferPool : public RefCounted {
public:
    TextureBufferPool() = default;
    explicit TextureBufferPool(gfx::Device *device);
    ~TextureBufferPool() override = default;

    void                 initialize(const ITextureBufferPoolInfo &info);
    void                 destroy();
    ITextureBufferHandle alloc(uint32_t size);
    ITextureBufferHandle alloc(uint32_t size, index_t chunkIdx);

    void     free(const ITextureBufferHandle &handle);
    uint32_t createChunk(uint32_t length);
    void     update(const ITextureBufferHandle &handle, ArrayBuffer *buffer);

private:
    index_t findAvailableSpace(uint32_t size, index_t chunkIdx) const;

    // [McDonald 12] Efficient Buffer Management
    ITextureBufferHandle mcDonaldAlloc(uint32_t size);

    gfx::Device *                     _device{nullptr};
    gfx::Format                       _format{gfx::Format::UNKNOWN};
    uint32_t                          _formatSize{0};
    std::vector<ITextureBuffer>       _chunks;
    uint32_t                          _chunkCount{0};
    std::vector<ITextureBufferHandle> _handles;
    gfx::BufferTextureCopy            _region0;
    gfx::BufferTextureCopy            _region1;
    gfx::BufferTextureCopy            _region2;
    roundUpType                       _roundUpFn{nullptr};
    bool                              _useMcDonaldAlloc{false};
    uint32_t                          _channels{4};
    uint32_t                          _alignment{1};
    CC_DISALLOW_COPY_MOVE_ASSIGN(TextureBufferPool);
};

} // namespace cc
