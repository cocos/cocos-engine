
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

#include "ImmutableState.h"
#include <vector>
#include "DevicePassResourceTable.h"
#include "gfx-base/GFXBarrier.h"

namespace cc {
namespace framegraph {

using gfx::AccessFlags;
using gfx::BufferUsage;
using gfx::hasFlag;
using gfx::MemoryAccess;
using gfx::MemoryUsage;
using gfx::ShaderStageFlags;
using gfx::TextureUsage;

namespace {

AccessFlags getAccessFlags(BufferUsage usage, MemoryUsage memUsage, const AccessStatus& status) noexcept {
    return gfx::getAccessFlags(usage, memUsage, status.access, status.visibility);
}

AccessFlags getAccessFlags(TextureUsage usage, const AccessStatus& status) noexcept {
    return gfx::getAccessFlags(usage, status.access, status.visibility);
}

} // namespace

std::pair<gfx::GFXObject*, gfx::GFXObject*> getBarrier(const ResourceBarrier& barrierInfo, const DevicePassResourceTable* dictPtr) noexcept {
    std::pair<gfx::GFXObject*, gfx::GFXObject*> res;

    const auto& dict = *dictPtr;
    if (barrierInfo.resourceType == ResourceType::BUFFER) {
        gfx::Buffer* gfxBuffer{nullptr};
        if (hasFlag(barrierInfo.endStatus.access, MemoryAccess::WRITE_ONLY)) {
            gfxBuffer = dict.getWrite(static_cast<BufferHandle>(barrierInfo.handle));
        } else {
            gfxBuffer = dict.getRead(static_cast<BufferHandle>(barrierInfo.handle));
        }
        auto usage = gfxBuffer->getUsage();
        auto memUsage = gfxBuffer->getMemUsage();
        gfx::BufferBarrierInfo info;
        info.prevAccesses = getAccessFlags(usage, memUsage, barrierInfo.beginStatus);
        info.nextAccesses = getAccessFlags(usage, memUsage, barrierInfo.endStatus);
        info.offset = static_cast<uint32_t>(barrierInfo.bufferRange.base);
        info.size = static_cast<uint32_t>(barrierInfo.bufferRange.len);
        info.type = barrierInfo.barrierType;

        res.first = gfx::Device::getInstance()->getBufferBarrier(info);
        res.second = gfxBuffer;
    } else if (barrierInfo.resourceType == ResourceType::TEXTURE) {
        gfx::Texture* gfxTexture{nullptr};
        if (hasFlag(barrierInfo.beginStatus.access, MemoryAccess::WRITE_ONLY)) {
            gfxTexture = dict.getWrite(static_cast<TextureHandle>(barrierInfo.handle));
        } else {
            gfxTexture = dict.getRead(static_cast<TextureHandle>(barrierInfo.handle));
        }
        auto usage = gfxTexture->getInfo().usage;
        gfx::TextureBarrierInfo info;
        info.type = barrierInfo.barrierType;
        info.prevAccesses = getAccessFlags(usage, barrierInfo.beginStatus);
        info.nextAccesses = getAccessFlags(usage, barrierInfo.endStatus);
        info.range.mipLevel = static_cast<uint32_t>(barrierInfo.mipRange.base);
        info.range.levelCount = static_cast<uint32_t>(barrierInfo.mipRange.len);
        info.range.firstSlice = static_cast<uint32_t>(barrierInfo.layerRange.base);
        info.range.numSlices = static_cast<uint32_t>(barrierInfo.layerRange.len);

        res.first = gfx::Device::getInstance()->getTextureBarrier(info);
        res.second = gfxTexture;
    }

    return res;
}

} // namespace framegraph
} // namespace cc
