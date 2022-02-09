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

#include "renderer/core/TextureBufferPool.h"
#include <cmath>
#include "core/ArrayBuffer.h"
#include "core/TypedArray.h"

namespace {

uint32_t roundUp(uint32_t n, uint32_t alignment) {
    return static_cast<uint32_t>(std::ceil(n / alignment)) * alignment;
}
} // namespace

namespace cc {

TextureBufferPool::TextureBufferPool(gfx::Device *device) {
    _device = device;
}

void TextureBufferPool::initialize(const ITextureBufferPoolInfo &info) {
    const auto &formatInfo = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(info.format)];
    _format                = info.format;
    _formatSize            = formatInfo.size;
    _channels              = formatInfo.count;
    _roundUpFn             = info.roundUpFn.has_value() ? info.roundUpFn.value() : nullptr;
    _alignment             = info.alignment.has_value() ? info.alignment.value() : 1;
    _useMcDonaldAlloc      = info.alignment.has_value() && info.alignment.value();
}

void TextureBufferPool::destroy() {
    for (auto &chunk : _chunks) {
        CC_SAFE_DESTROY_AND_DELETE(chunk.texture);
    }
    _chunks.clear();
    _handles.clear();
}

ITextureBufferHandle TextureBufferPool::alloc(uint32_t size) {
    if (_useMcDonaldAlloc) {
        return mcDonaldAlloc(size);
    }

    size          = roundUp(size, _alignment);
    index_t index = CC_INVALID_INDEX;
    index_t start = CC_INVALID_INDEX;
    if (start < 0) {
        for (index_t i = 0; i < _chunkCount; ++i) {
            index = i;
            start = findAvailableSpace(size, index);
            if (start >= 0) break;
        }
    }

    if (start >= 0) {
        auto chunk = _chunks[index];
        chunk.start += static_cast<index_t>(size);
        ITextureBufferHandle handle;
        handle.chunkIdx = index;
        handle.start    = start;
        handle.end      = static_cast<index_t>(start + size);
        handle.texture  = chunk.texture;

        _handles.emplace_back(handle);
        return handle;
    }
    // create a new one
    auto     targetSize = static_cast<int32_t>(std::sqrt(size / _formatSize));
    uint32_t texLength  = _roundUpFn ? _roundUpFn(targetSize, _formatSize) : std::max(1024, static_cast<int>(utils::nextPOT(targetSize)));
    auto     newChunk   = _chunks[createChunk(texLength)];

    newChunk.start += static_cast<index_t>(size);
    ITextureBufferHandle texHandle;
    texHandle.chunkIdx = static_cast<index_t>(_chunkCount - 1);
    texHandle.start    = 0;
    texHandle.end      = static_cast<index_t>(size);
    texHandle.texture  = newChunk.texture;
    _handles.emplace_back(texHandle);
    return texHandle;
}

ITextureBufferHandle TextureBufferPool::alloc(uint32_t size, index_t chunkIdx) {
    size          = roundUp(size, _alignment);
    index_t index = chunkIdx;
    index_t start = findAvailableSpace(size, index);

    if (start < 0) {
        for (index_t i = 0; i < _chunkCount; ++i) {
            index = i;
            start = findAvailableSpace(size, index);
            if (start >= 0) break;
        }
    }

    if (start >= 0) {
        auto chunk = _chunks[index];
        chunk.start += static_cast<index_t>(size);
        ITextureBufferHandle handle;
        handle.chunkIdx = index;
        handle.start    = start;
        handle.end      = static_cast<index_t>(start + size);
        handle.texture  = chunk.texture;

        _handles.emplace_back(handle);
        return handle;
    }
    // create a new one
    auto     targetSize = static_cast<int32_t>(std::sqrt(size / _formatSize));
    uint32_t texLength  = _roundUpFn ? _roundUpFn(targetSize, _formatSize) : std::max(1024, static_cast<int>(utils::nextPOT(targetSize)));
    auto     newChunk   = _chunks[createChunk(texLength)];

    newChunk.start += static_cast<index_t>(size);
    ITextureBufferHandle texHandle;
    texHandle.chunkIdx = static_cast<index_t>(_chunkCount - 1);
    texHandle.start    = 0;
    texHandle.end      = static_cast<index_t>(size);
    texHandle.texture  = newChunk.texture;
    _handles.emplace_back(texHandle);
    return texHandle;
}

void TextureBufferPool::free(const ITextureBufferHandle &handle) {
    auto iter = std::find(_handles.begin(), _handles.end(), handle);
    if (iter != _handles.end()) {
        _chunks[handle.chunkIdx].end = handle.end;
        _handles.erase(iter);
    }
}

uint32_t TextureBufferPool::createChunk(uint32_t length) {
    uint32_t texSize = length * length * _formatSize;
    // debug(`TextureBufferPool: Allocate chunk $device->createTexture({gfx::TextureType::TEX2D,
    auto *texture = _device->createTexture({gfx::TextureType::TEX2D,
                                            gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST,
                                            _format,
                                            length,
                                            length});

    ITextureBuffer chunk;
    chunk.texture        = texture;
    chunk.size           = texSize;
    chunk.start          = 0;
    chunk.end            = static_cast<index_t>(texSize);
    _chunks[_chunkCount] = chunk;
    return _chunkCount++;
}

void TextureBufferPool::update(const ITextureBufferHandle &handle, ArrayBuffer *buffer) {
    gfx::BufferDataList        buffers;
    uint8_t *                  bufferData = buffer->getData();
    gfx::BufferTextureCopyList regions;
    auto                       start = static_cast<int32_t>(handle.start / _formatSize);

    uint32_t remainSize = buffer->byteLength() / _formatSize;
    int32_t  offsetX    = start % static_cast<int32_t>(handle.texture->getWidth());
    int32_t  offsetY    = std::floor(start / handle.texture->getWidth());
    uint32_t copySize   = std::min(handle.texture->getWidth() - offsetX, remainSize);
    uint32_t begin      = 0;

    if (offsetX > 0) {
        _region0.texOffset.x      = offsetX;
        _region0.texOffset.y      = offsetY;
        _region0.texExtent.width  = copySize;
        _region0.texExtent.height = 1;
        buffers.emplace_back(bufferData + begin * _formatSize);
        regions.emplace_back(_region0);
        offsetX = 0;
        offsetY += 1;
        remainSize -= copySize;
        begin += copySize;
    }

    if (remainSize > 0) {
        _region1.texOffset.x = offsetX;
        _region1.texOffset.y = offsetY;

        if (remainSize > handle.texture->getWidth()) {
            _region1.texExtent.width  = handle.texture->getWidth();
            _region1.texExtent.height = std::floor(remainSize / handle.texture->getWidth());
            copySize                  = _region1.texExtent.width * _region1.texExtent.height;
        } else {
            copySize                  = remainSize;
            _region1.texExtent.width  = copySize;
            _region1.texExtent.height = 1;
        }

        buffers.emplace_back(bufferData + begin * _formatSize);
        regions.emplace_back(_region1);

        offsetX = 0;
        offsetY += static_cast<int32_t>(_region1.texExtent.height);
        remainSize -= copySize;
        begin += copySize;
    }

    if (remainSize > 0) {
        _region2.texOffset.x      = offsetX;
        _region2.texOffset.y      = offsetY;
        _region2.texExtent.width  = remainSize;
        _region2.texExtent.height = 1;

        buffers.emplace_back(bufferData + begin * _formatSize);
        regions.emplace_back(_region2);
    }
    _device->copyBuffersToTexture(buffers, handle.texture, regions);
}

index_t TextureBufferPool::findAvailableSpace(uint32_t size, index_t chunkIdx) const {
    auto    chunk   = _chunks[chunkIdx];
    bool    isFound = false;
    index_t start   = chunk.start;
    if ((start + size) <= chunk.size) {
        isFound = true;
    } else {
        start = 0; // try to find from head again
        std::vector<ITextureBufferHandle> handles;
        for (auto h : _handles) {
            if (h.chunkIdx == chunkIdx) {
                handles.emplace_back(h);
            }
        }
        std::sort(handles.begin(), handles.end(), [](const ITextureBufferHandle &a, const ITextureBufferHandle &b) { return a.start - b.start; });
        for (auto handle : handles) {
            if ((start + size) <= handle.start) {
                isFound = true;
                break;
            }
            start = handle.end;
        }
        if (!isFound && (start + size) <= chunk.size) {
            isFound = true;
        }
    }
    return isFound ? start : CC_INVALID_INDEX;
}

ITextureBufferHandle TextureBufferPool::mcDonaldAlloc(uint32_t size) {
    size = roundUp(size, _alignment);
    for (index_t i = 0; i < _chunkCount; ++i) {
        auto    chunk   = _chunks[i];
        bool    isFound = false;
        index_t start   = chunk.start;
        if ((start + size) <= chunk.end) {
            isFound = true;
        } else if (start > chunk.end) {
            if ((start + size) <= chunk.size) {
                isFound = true;
            } else if (size <= chunk.end) {
                // Try to find from head again.
                start       = 0;
                chunk.start = 0;
                isFound     = true;
            }
        } else if (start == chunk.end) {
            start       = 0;
            chunk.start = 0;
            chunk.end   = static_cast<index_t>(chunk.size);
            if (size <= chunk.end) {
                isFound = true;
            }
        }
        if (isFound) {
            chunk.start += static_cast<index_t>(size);

            ITextureBufferHandle handle;
            handle.chunkIdx = i;
            handle.start    = start;
            handle.end      = static_cast<index_t>(size);
            handle.texture  = chunk.texture;
            _handles.emplace_back(handle);
            return handle;
        }
    }
    // create a new one
    auto     targetSize = static_cast<int32_t>(std::sqrt(size / _formatSize));
    uint32_t texLength  = _roundUpFn ? _roundUpFn(targetSize, _formatSize) : std::max(1024, static_cast<int>(utils::nextPOT(targetSize)));
    auto     newChunk   = _chunks[createChunk(texLength)];

    newChunk.start += static_cast<index_t>(size);
    ITextureBufferHandle texHandle;
    texHandle.chunkIdx = static_cast<index_t>(_chunkCount);
    texHandle.start    = 0;
    texHandle.end      = static_cast<index_t>(size),
    texHandle.texture  = newChunk.texture;
    _handles.emplace_back(texHandle);
    return texHandle;
}

} // namespace cc
