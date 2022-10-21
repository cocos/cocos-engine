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

VKTransientPool::~VKTransientPool() {
    if (_memoryPool != VK_NULL_HANDLE) {
        vmaDestroyPool(CCVKDevice::getInstance()->gpuDevice()->memoryAllocator, _memoryPool);
    }
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
        imageInfo.usage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT | VK_IMAGE_USAGE_DEPTH_STENCIL_ATTACHMENT_BIT | VK_IMAGE_USAGE_SAMPLED_BIT;
        imageInfo.imageType = VK_IMAGE_TYPE_2D;
        imageInfo.tiling = VK_IMAGE_TILING_OPTIMAL;
        imageInfo.extent = {1, 1, 1};
        imageInfo.format = VK_FORMAT_R8G8B8A8_UNORM;

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

    VmaPoolCreateInfo poolInfo = {};
    poolInfo.memoryTypeIndex = memTypeIndex;
    vmaCreatePool(allocator, &poolInfo, &_memoryPool);

    _allocationCreateInfo.pool = _memoryPool;
}

void VKTransientPool::doInit(const TransientPoolInfo &info) {
    initMemoryRequirements(info);
}

void VKTransientPool::doInitBuffer(Buffer *buffer) {
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
    gpuBuffer->vmaAllocation = allocation;
    vmaBindBufferMemory(allocator, allocation, vkBuffer);
}

void VKTransientPool::doResetBuffer(Buffer *buffer) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuBuffer = static_cast<CCVKBuffer *>(buffer)->gpuBuffer();
    vmaFreeMemory(allocator, gpuBuffer->vmaAllocation);
    gpuBuffer->vmaAllocation = VK_NULL_HANDLE;
}

void VKTransientPool::doInitTexture(Texture *texture) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuTexture = static_cast<CCVKTexture *>(texture)->gpuTexture();
    VkImage vkImage = gpuTexture->vkImage;

    VmaAllocation allocation = VK_NULL_HANDLE;
    VmaAllocationInfo allocationInfo = {};

    CC_ASSERT(gpuTexture->vmaAllocation == VK_NULL_HANDLE);
    vmaAllocateMemoryForImage(allocator,
                              vkImage,
                              &_allocationCreateInfo,
                              &allocation,
                              &allocationInfo);
    gpuTexture->vmaAllocation = allocation;
    vmaBindImageMemory(allocator, allocation, vkImage);
}

void VKTransientPool::doResetTexture(Texture *texture) {
    VmaAllocator allocator = CCVKDevice::getInstance()->gpuDevice()->memoryAllocator;
    auto *gpuTexture = static_cast<CCVKTexture *>(texture)->gpuTexture();
    vmaFreeMemory(allocator, gpuTexture->vmaAllocation);
    gpuTexture->vmaAllocation = VK_NULL_HANDLE;
}

} // namespace gfx
} // namespace cc
