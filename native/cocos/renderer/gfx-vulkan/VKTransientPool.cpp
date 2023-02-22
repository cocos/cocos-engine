/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-vulkan/VKTransientPool.h"
#include "gfx-vulkan/VKDevice.h"
#include "gfx-vulkan/VKGPUObjects.h"
#include "gfx-vulkan/VKBuffer.h"
#include "gfx-vulkan/VKTexture.h"

namespace cc {
namespace gfx {
VKTransientPool::VKTransientPool() {
    _typedID = generateObjectID<decltype(this)>();
}

void VKTransientPool::initMemoryRequirements(const TransientPoolInfo &info) {
    uint32_t memoryTypeBits = ~(0U);

    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    VkDevice vkDevice = CCVKDevice::getInstance()->gpuDevice()->vkDevice;

    if (info.enableBuffer) {
        VkBufferCreateInfo bufferInfo = {};
        bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
        bufferInfo.size  = 0x4;
        bufferInfo.usage = VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT | VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;

        VkBuffer tmpBuffer = VK_NULL_HANDLE;
        vkCreateBuffer(vkDevice, &bufferInfo, nullptr, &tmpBuffer);

        if (tmpBuffer != VK_NULL_HANDLE) {
            VkMemoryRequirements bufferReq = {};
            vkGetBufferMemoryRequirements(vkDevice, tmpBuffer, &bufferReq);
            memoryTypeBits &= bufferReq.memoryTypeBits;
            vkDestroyBuffer(vkDevice, tmpBuffer, nullptr);
        }
    }

    if (info.enableImage) {
        VkImageCreateInfo imageInfo = {};
        imageInfo.sType = VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO;
        imageInfo.usage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT | VK_IMAGE_USAGE_SAMPLED_BIT;
        imageInfo.imageType = VK_IMAGE_TYPE_2D;
        imageInfo.tiling = VK_IMAGE_TILING_OPTIMAL;
        imageInfo.extent = {1, 1, 1};
        imageInfo.format = VK_FORMAT_R8G8B8A8_UNORM;
        imageInfo.samples = VK_SAMPLE_COUNT_1_BIT;
        imageInfo.mipLevels = 1;
        imageInfo.arrayLayers = 1;

        VkImage tmpImage = VK_NULL_HANDLE;
        vkCreateImage(vkDevice, &imageInfo, nullptr, &tmpImage);

        if (tmpImage != VK_NULL_HANDLE) {
            VkMemoryRequirements imageReq = {};
            vkGetImageMemoryRequirements(vkDevice, tmpImage, &imageReq);
            memoryTypeBits &= imageReq.memoryTypeBits;
            vkDestroyImage(vkDevice, tmpImage, nullptr);
        }
    }

    _allocationCreateInfo.usage = VMA_MEMORY_USAGE_GPU_ONLY;

    uint32_t memTypeIndex = UINT32_MAX;
    vmaFindMemoryTypeIndex(allocator, memoryTypeBits, &_allocationCreateInfo, &memTypeIndex);


    _memoryPool = ccnew CCVKGPUMemoryPool();
    VmaPoolCreateInfo poolInfo = {};
    poolInfo.memoryTypeIndex = memTypeIndex;
    vmaCreatePool(allocator, &poolInfo, &_memoryPool->vmaPool);
    _allocationCreateInfo.pool = _memoryPool->vmaPool;
}

void VKTransientPool::doInit(const TransientPoolInfo &info) {
    initMemoryRequirements(info);
    _context = std::make_unique<AliasingContext>();
}

void VKTransientPool::doBeginFrame() {
    _context->clear();
    _resources.clear();
}

void VKTransientPool::doEndFrame() {

}

void VKTransientPool::doInitBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuBuffer = static_cast<CCVKBuffer *>(buffer)->gpuBuffer();
    VkBuffer vkBuffer = gpuBuffer->vkBuffer;

    VmaAllocation allocation = VK_NULL_HANDLE;
    VmaAllocationInfo allocationInfo = {};

    CC_ASSERT(gpuBuffer->vmaAllocation == VK_NULL_HANDLE);
    vmaAllocateMemoryForBuffer(allocator,
                               vkBuffer,
                               &_allocationCreateInfo,
                               &allocation,
                               &allocationInfo);
    vmaBindBufferMemory(allocator, allocation, vkBuffer);
    gpuBuffer->vmaAllocation = allocation;

    // record scope and access flag
    auto &res = _resources[buffer->getObjectID()];
    res.resource.object = buffer;
    res.first = scope;
    res.firstAccess = accessFlag;
}

void VKTransientPool::doResetBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuBuffer = static_cast<CCVKBuffer *>(buffer)->gpuBuffer();
    VmaAllocationInfo allocationInfo = {};
    vmaGetAllocationInfo(allocator, gpuBuffer->vmaAllocation, &allocationInfo);
    vmaFreeMemory(allocator, gpuBuffer->vmaAllocation);
    gpuBuffer->vmaAllocation = VK_NULL_HANDLE;

    auto iter = _resources.find(buffer->getObjectID());
    if (iter == _resources.end()) {
        return;
    }
    iter->second.last = scope;
    iter->second.lastAccess = accessFlag;
    _context->record({iter->second,
                     reinterpret_cast<uint64_t>(allocationInfo.deviceMemory),
                     allocationInfo.offset,
                     allocationInfo.offset + allocationInfo.size - 1});
}

void VKTransientPool::doInitTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *vkTexture = static_cast<CCVKTexture *>(texture);
    VkImage vkImage = vkTexture->gpuTexture()->vkImage;

    VmaAllocation allocation = VK_NULL_HANDLE;
    VmaAllocationInfo allocationInfo = {};

    CC_ASSERT(vkTexture->gpuTexture()->vmaAllocation == VK_NULL_HANDLE);
    vmaAllocateMemoryForImage(allocator,
                              vkImage,
                              &_allocationCreateInfo,
                              &allocation,
                              &allocationInfo);
    vmaBindImageMemory(allocator, allocation, vkImage);
    vkTexture->gpuTexture()->vmaAllocation = allocation;
    vkTexture->createTextureView();

    // record scope and access flag
    auto &res = _resources[texture->getObjectID()];
    res.resource.object = texture;
    res.first = scope;
    res.firstAccess = accessFlag;
}

void VKTransientPool::doResetTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuTexture = static_cast<CCVKTexture *>(texture)->gpuTexture();
    VmaAllocationInfo allocationInfo = {};
    vmaGetAllocationInfo(allocator, gpuTexture->vmaAllocation, &allocationInfo);
    vmaFreeMemory(allocator, gpuTexture->vmaAllocation);
    gpuTexture->vmaAllocation = VK_NULL_HANDLE;

    auto iter = _resources.find(texture->getObjectID());
    if (iter == _resources.end()) {
        return;
    }
    iter->second.last = scope;
    iter->second.lastAccess = accessFlag;
    _context->record({iter->second,
                      reinterpret_cast<uint64_t>(allocationInfo.deviceMemory),
                      allocationInfo.offset,
                      allocationInfo.offset + allocationInfo.size - 1});
}

void VKTransientPool::barrier(PassScope scope, CommandBuffer *cmdBuffer) {
    const auto &aliasingData = _context->getAliasingData();
    auto iter = aliasingData.find(scope);
    if (iter == aliasingData.end()) {
        return;
    }
    std::vector<BufferBarrier *> bufferBarriers;
    std::vector<Buffer *> buffers;

    std::vector<TextureBarrier*> textureBarriers;
    std::vector<Texture *> textures;

    auto *device = Device::getInstance();
    for (const auto &aliasingInfo : iter->second) {
        if (aliasingInfo.after.object->getObjectType() == ObjectType::BUFFER) {
            auto *buffer = static_cast<Buffer *>(aliasingInfo.after.object);
            BufferBarrierInfo barrierInfo = {};
            barrierInfo.prevAccesses = aliasingInfo.beforeAccess;
            barrierInfo.nextAccesses = aliasingInfo.afterAccess;
            barrierInfo.offset = 0;
            barrierInfo.size = buffer->getSize();
            bufferBarriers.emplace_back(device->getBufferBarrier(barrierInfo));
            buffers.emplace_back(buffer);
        } else if (aliasingInfo.after.object->getObjectType() == ObjectType::TEXTURE) {
            auto *texture = static_cast<Texture *>(aliasingInfo.after.object);
            const auto& texInfo = texture->getInfo();
            TextureBarrierInfo barrierInfo = {};
            barrierInfo.prevAccesses = aliasingInfo.beforeAccess;
            barrierInfo.nextAccesses = aliasingInfo.afterAccess;
            barrierInfo.levelCount = texInfo.levelCount;
            barrierInfo.sliceCount = texInfo.layerCount;
            textureBarriers.emplace_back(device->getTextureBarrier(barrierInfo));
            textures.emplace_back(texture);
        }
    }
    if (!bufferBarriers.empty() || !textureBarriers.empty()) {
        cmdBuffer->pipelineBarrier(nullptr, bufferBarriers, buffers, textureBarriers, textures);
    }
}

void CCVKGPUMemoryPool::shutdown() {
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(vmaPool);
}

} // namespace gfx
} // namespace cc
