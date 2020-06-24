#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommandAllocator.h"
#include "VKCommands.h"
#include "VKContext.h"
#include "VKDevice.h"
#include "VKQueue.h"
#include "VKSPIRV.h"

#include <algorithm>

#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

namespace cc {
namespace gfx {

void insertVkDynamicStates(vector<VkDynamicState> &out, const vector<DynamicState> &dynamicStates) {
    for (DynamicState dynamicState : dynamicStates) {
        switch (dynamicState) {
            case DynamicState::VIEWPORT: break; // we make this dynamic by default
            case DynamicState::SCISSOR: break;  // we make this dynamic by default
            case DynamicState::LINE_WIDTH: out.push_back(VK_DYNAMIC_STATE_LINE_WIDTH); break;
            case DynamicState::DEPTH_BIAS: out.push_back(VK_DYNAMIC_STATE_DEPTH_BIAS); break;
            case DynamicState::BLEND_CONSTANTS: out.push_back(VK_DYNAMIC_STATE_BLEND_CONSTANTS); break;
            case DynamicState::DEPTH_BOUNDS: out.push_back(VK_DYNAMIC_STATE_DEPTH_BOUNDS); break;
            case DynamicState::STENCIL_WRITE_MASK: out.push_back(VK_DYNAMIC_STATE_STENCIL_WRITE_MASK); break;
            case DynamicState::STENCIL_COMPARE_MASK:
                out.push_back(VK_DYNAMIC_STATE_STENCIL_REFERENCE);
                out.push_back(VK_DYNAMIC_STATE_STENCIL_COMPARE_MASK);
                break;
            default: {
                CCASSERT(false, "Unsupported PrimitiveMode, convert to VkPrimitiveTopology failed.");
                break;
            }
        }
    }
}

void beginOneTimeCommands(CCVKDevice *device, CCVKGPUCommandBuffer *cmdBuff) {
    cmdBuff->commandPool = ((CCVKCommandAllocator *)device->getCommandAllocator())->gpuCommandPool();
    cmdBuff->type = CommandBufferType::PRIMARY;
    CCVKCmdFuncAllocateCommandBuffer(device, cmdBuff);

    VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
    VK_CHECK(vkBeginCommandBuffer(cmdBuff->vkCommandBuffer, &beginInfo));
}

void endOneTimeCommands(CCVKDevice *device, CCVKGPUCommandBuffer *cmdBuff) {
    VK_CHECK(vkEndCommandBuffer(cmdBuff->vkCommandBuffer));

    VkFence fence = device->gpuFencePool()->alloc();
    const CCVKGPUQueue *queue = ((CCVKQueue *)device->getQueue())->gpuQueue();
    VkSubmitInfo submitInfo{VK_STRUCTURE_TYPE_SUBMIT_INFO};
    submitInfo.commandBufferCount = 1;
    submitInfo.pCommandBuffers = &cmdBuff->vkCommandBuffer;
    VK_CHECK(vkQueueSubmit(queue->vkQueue, 1, &submitInfo, fence));
    VK_CHECK(vkWaitForFences(device->gpuDevice()->vkDevice, 1, &fence, VK_TRUE, DEFAULT_FENCE_TIMEOUT));
    CCVKCmdFuncFreeCommandBuffer(device, cmdBuff);
}

void insertImageMemoryBarrior(
    VkCommandBuffer cmdBuffer,
    VkImage image,
    VkAccessFlags srcAccessMask,
    VkAccessFlags dstAccessMask,
    VkImageLayout oldImageLayout,
    VkImageLayout newImageLayout,
    VkPipelineStageFlags srcStageMask,
    VkPipelineStageFlags dstStageMask,
    VkImageSubresourceRange subresourceRange) {
    VkImageMemoryBarrier barrier{VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER};
    barrier.image = image;
    barrier.srcAccessMask = srcAccessMask;
    barrier.dstAccessMask = dstAccessMask;
    barrier.oldLayout = oldImageLayout;
    barrier.newLayout = newImageLayout;
    barrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    barrier.subresourceRange = subresourceRange;

    vkCmdPipelineBarrier(cmdBuffer,
                         srcStageMask, dstStageMask, 0,
                         0, nullptr,
                         0, nullptr,
                         1, &barrier);
}

void CCVKCmdFuncCreateRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass) {
    size_t colorAttachmentCount = gpuRenderPass->colorAttachments.size();
    vector<VkAttachmentDescription> attachmentDescriptions(colorAttachmentCount + 1);
    gpuRenderPass->clearValues.resize(colorAttachmentCount + 1);
    for (size_t i = 0u; i < colorAttachmentCount; i++) {
        const ColorAttachment &attachment = gpuRenderPass->colorAttachments[i];
        const VkImageLayout beginLayout = MapVkImageLayout(attachment.beginLayout);
        const VkImageLayout endLayout = MapVkImageLayout(attachment.endLayout);
        const VkAccessFlags beginAccessMask = MapVkAccessFlags(attachment.beginLayout);
        const VkAccessFlags endAccessMask = MapVkAccessFlags(attachment.endLayout);
        attachmentDescriptions[i].format = MapVkFormat(attachment.format);
        attachmentDescriptions[i].samples = MapVkSampleCount(attachment.sampleCount);
        attachmentDescriptions[i].loadOp = MapVkLoadOp(attachment.loadOp);
        attachmentDescriptions[i].storeOp = MapVkStoreOp(attachment.storeOp);
        attachmentDescriptions[i].stencilLoadOp = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
        attachmentDescriptions[i].stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
        attachmentDescriptions[i].initialLayout = beginLayout;
        attachmentDescriptions[i].finalLayout = endLayout;
    }
    const DepthStencilAttachment &depthStencilAttachment = gpuRenderPass->depthStencilAttachment;
    const VkImageLayout beginLayout = MapVkImageLayout(depthStencilAttachment.beginLayout);
    const VkImageLayout endLayout = MapVkImageLayout(depthStencilAttachment.endLayout);
    const VkAccessFlags beginAccessMask = MapVkAccessFlags(depthStencilAttachment.beginLayout);
    const VkAccessFlags endAccessMask = MapVkAccessFlags(depthStencilAttachment.endLayout);
    const VkImageAspectFlags aspectMask = GFX_FORMAT_INFOS[(uint)depthStencilAttachment.format].hasStencil ? VK_IMAGE_ASPECT_DEPTH_BIT | VK_IMAGE_ASPECT_STENCIL_BIT : VK_IMAGE_ASPECT_DEPTH_BIT;
    attachmentDescriptions[colorAttachmentCount].format = MapVkFormat(depthStencilAttachment.format);
    attachmentDescriptions[colorAttachmentCount].samples = MapVkSampleCount(depthStencilAttachment.sampleCount);
    attachmentDescriptions[colorAttachmentCount].loadOp = MapVkLoadOp(depthStencilAttachment.depthLoadOp);
    attachmentDescriptions[colorAttachmentCount].storeOp = MapVkStoreOp(depthStencilAttachment.depthStoreOp);
    attachmentDescriptions[colorAttachmentCount].stencilLoadOp = MapVkLoadOp(depthStencilAttachment.stencilLoadOp);
    attachmentDescriptions[colorAttachmentCount].stencilStoreOp = MapVkStoreOp(depthStencilAttachment.stencilStoreOp);
    attachmentDescriptions[colorAttachmentCount].initialLayout = beginLayout;
    attachmentDescriptions[colorAttachmentCount].finalLayout = endLayout;

    size_t subpassCount = gpuRenderPass->subPasses.size();
    vector<VkSubpassDescription> subpassDescriptions(1, {VK_PIPELINE_BIND_POINT_GRAPHICS});
    vector<VkAttachmentReference> attachmentReferences;
    if (subpassCount) { // pass on user-specified subpasses
        subpassDescriptions.resize(subpassCount);
        for (size_t i = 0u; i < subpassCount; i++) {
            const SubPass &subpass = gpuRenderPass->subPasses[i];
            subpassDescriptions[i].pipelineBindPoint = MapVkPipelineBindPoint(subpass.bindPoint);
            // TODO
        }
    } else { // generate a default subpass from attachment info
        for (size_t i = 0u; i < colorAttachmentCount; i++) {
            attachmentReferences.push_back({(uint32_t)i, VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL});
        }
        attachmentReferences.push_back({(uint32_t)colorAttachmentCount, VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL});
        subpassDescriptions[0].colorAttachmentCount = attachmentReferences.size() - 1;
        subpassDescriptions[0].pColorAttachments = attachmentReferences.data();
        subpassDescriptions[0].pDepthStencilAttachment = &attachmentReferences.back();
    }

    VkRenderPassCreateInfo renderPassCreateInfo{VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO};
    renderPassCreateInfo.attachmentCount = attachmentDescriptions.size();
    renderPassCreateInfo.pAttachments = attachmentDescriptions.data();
    renderPassCreateInfo.subpassCount = subpassDescriptions.size();
    renderPassCreateInfo.pSubpasses = subpassDescriptions.data();

    VK_CHECK(vkCreateRenderPass(device->gpuDevice()->vkDevice, &renderPassCreateInfo, nullptr, &gpuRenderPass->vkRenderPass));
}

void CCVKCmdFuncDestroyRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass) {
    if (gpuRenderPass->vkRenderPass != VK_NULL_HANDLE) {
        vkDestroyRenderPass(device->gpuDevice()->vkDevice, gpuRenderPass->vkRenderPass, nullptr);
        gpuRenderPass->vkRenderPass = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncGetDeviceQueue(CCVKDevice *device, CCVKGPUQueue *gpuQueue) {
    uint queueType = 0u;
    VkBool32 needPresentable = VK_FALSE;
    switch (gpuQueue->type) {
        case QueueType::GRAPHICS:
            queueType = VK_QUEUE_GRAPHICS_BIT;
            needPresentable = VK_TRUE;
            break;
        case QueueType::COMPUTE: queueType = VK_QUEUE_COMPUTE_BIT; break;
        case QueueType::TRANSFER: queueType = VK_QUEUE_TRANSFER_BIT; break;
    }

    const CCVKGPUContext *context = ((CCVKContext *)device->getContext())->gpuContext();

    size_t queueCount = context->queueFamilyProperties.size();
    for (size_t i = 0u; i < queueCount; ++i) {
        const VkQueueFamilyProperties &properties = context->queueFamilyProperties[i];
        const VkBool32 isPresentable = context->queueFamilyPresentables[i];
        if (properties.queueCount > 0 && (properties.queueFlags & queueType) && (!needPresentable || isPresentable)) {
            vkGetDeviceQueue(device->gpuDevice()->vkDevice, i, 0, &gpuQueue->vkQueue);
            gpuQueue->queueFamilyIndex = i;
            break;
        }
    }
}

void CCVKCmdFuncCreateCommandPool(CCVKDevice *device, CCVKGPUCommandPool *gpuCommandPool) {
    VkCommandPoolCreateInfo createInfo{VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO};
    createInfo.queueFamilyIndex = ((CCVKQueue *)device->getQueue())->gpuQueue()->queueFamilyIndex;
    createInfo.flags = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;

    VK_CHECK(vkCreateCommandPool(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuCommandPool->vkCommandPool));
}

void CCVKCmdFuncDestroyCommandPool(CCVKDevice *device, CCVKGPUCommandPool *gpuCommandPool) {
    if (gpuCommandPool->vkCommandPool != VK_NULL_HANDLE) {
        vkDestroyCommandPool(device->gpuDevice()->vkDevice, gpuCommandPool->vkCommandPool, nullptr);
        gpuCommandPool->vkCommandPool = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncAllocateCommandBuffer(CCVKDevice *device, CCVKGPUCommandBuffer *gpuCommandBuffer) {
    CCVKGPUCommandPool *commandPool = gpuCommandBuffer->commandPool;
    CachedArray<VkCommandBuffer> &availableList = commandPool->commandBuffers[(uint)gpuCommandBuffer->type];

    if (availableList.size()) {
        gpuCommandBuffer->vkCommandBuffer = availableList.pop();
    } else {
        VkCommandBufferAllocateInfo allocateInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO};
        allocateInfo.commandPool = commandPool->vkCommandPool;
        allocateInfo.commandBufferCount = 1;
        allocateInfo.level = MapVkCommandBufferLevel(gpuCommandBuffer->type);

        VK_CHECK(vkAllocateCommandBuffers(device->gpuDevice()->vkDevice, &allocateInfo, &gpuCommandBuffer->vkCommandBuffer));
    }
}

void CCVKCmdFuncFreeCommandBuffer(CCVKDevice *device, CCVKGPUCommandBuffer *gpuCommandBuffer) {
    if (gpuCommandBuffer->vkCommandBuffer) {
        gpuCommandBuffer->commandPool->usedCommandBuffers[(uint)gpuCommandBuffer->type].push(gpuCommandBuffer->vkCommandBuffer);
        gpuCommandBuffer->vkCommandBuffer = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer) {
    if (!gpuBuffer->size) {
        return;
    }

    VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
    bufferInfo.size = gpuBuffer->size;
    bufferInfo.usage = MapVkBufferUsageFlagBits(gpuBuffer->usage);

    VmaAllocationCreateInfo allocInfo{};
    allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;

    if (gpuBuffer->memUsage == MemoryUsage::HOST) {
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
        allocInfo.usage = VMA_MEMORY_USAGE_CPU_ONLY;
    } else if (gpuBuffer->memUsage == MemoryUsage::DEVICE) {
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_DST_BIT;
        allocInfo.usage = VMA_MEMORY_USAGE_GPU_ONLY;
    } else if (gpuBuffer->memUsage == (MemoryUsage::HOST | MemoryUsage::DEVICE)) {
        allocInfo.usage = VMA_MEMORY_USAGE_CPU_TO_GPU;
    }

    VmaAllocationInfo res;
    VK_CHECK(vmaCreateBuffer(device->gpuDevice()->memoryAllocator, &bufferInfo, &allocInfo, &gpuBuffer->vkBuffer, &gpuBuffer->vmaAllocation, &res));
    //CC_LOG_DEBUG("Allocated buffer: %llu, %llx %llx %llu %x", res.size, gpuBuffer->vkBuffer, res.deviceMemory, res.offset, res.pMappedData);

    gpuBuffer->mappedData = (uint8_t *)res.pMappedData;
    gpuBuffer->startOffset = 0; // we are creating one VkBuffer each for now
}

void CCVKCmdFuncDestroyBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer) {
    if (gpuBuffer->vmaAllocation) {
        vmaDestroyBuffer(device->gpuDevice()->memoryAllocator, gpuBuffer->vkBuffer, gpuBuffer->vmaAllocation);
        gpuBuffer->buffer = VK_NULL_HANDLE;
        gpuBuffer->vmaAllocation = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncResizeBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer) {
    CCVKCmdFuncDestroyBuffer(device, gpuBuffer);
    CCVKCmdFuncCreateBuffer(device, gpuBuffer);
}

void CCVKCmdFuncUpdateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer, void *buffer, uint offset, uint size) {
    const void *dataToUpload = nullptr;
    size_t sizeToUpload = 0u;

    if (gpuBuffer->usage & BufferUsageBit::INDIRECT) {
        size_t drawInfoCount = size / sizeof(DrawInfo);
        DrawInfo *drawInfo = static_cast<DrawInfo *>(buffer);
        if (drawInfoCount > 0) {
            if (drawInfo->indexCount) {
                for (size_t i = 0; i < drawInfoCount; i++) {
                    gpuBuffer->indexedIndirectCmds[i].indexCount = drawInfo->indexCount;
                    gpuBuffer->indexedIndirectCmds[i].instanceCount = std::max(drawInfo->instanceCount, 1u);
                    gpuBuffer->indexedIndirectCmds[i].firstIndex = drawInfo->firstIndex;
                    gpuBuffer->indexedIndirectCmds[i].vertexOffset = drawInfo->vertexOffset;
                    gpuBuffer->indexedIndirectCmds[i].firstInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                dataToUpload = gpuBuffer->indexedIndirectCmds.data();
                sizeToUpload = drawInfoCount * sizeof(VkDrawIndexedIndirectCommand);
                gpuBuffer->isDrawIndirectByIndex = true;
            } else {
                for (size_t i = 0; i < drawInfoCount; i++) {
                    gpuBuffer->indirectCmds[i].vertexCount = drawInfo->vertexCount;
                    gpuBuffer->indirectCmds[i].instanceCount = drawInfo->instanceCount;
                    gpuBuffer->indirectCmds[i].firstVertex = drawInfo->firstVertex;
                    gpuBuffer->indirectCmds[i].firstInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                dataToUpload = gpuBuffer->indirectCmds.data();
                sizeToUpload = drawInfoCount * sizeof(VkDrawIndirectCommand);
                gpuBuffer->isDrawIndirectByIndex = false;
            }
        }
    } else {
        dataToUpload = buffer;
        sizeToUpload = size;
    }

    if (gpuBuffer->mappedData) {
        memcpy(gpuBuffer->mappedData + offset, dataToUpload, sizeToUpload);
    } else {
        const CCVKGPUBuffer *stagingBuffer = device->stagingBuffer()->gpuBuffer();
        if (stagingBuffer->size < sizeToUpload) device->stagingBuffer()->resize(nextPowerOf2(sizeToUpload));

        memcpy(stagingBuffer->mappedData, dataToUpload, sizeToUpload);

        CCVKGPUCommandBuffer cmdBuff;
        beginOneTimeCommands(device, &cmdBuff);

        VkBufferCopy region{0, gpuBuffer->startOffset + offset, sizeToUpload};
        vkCmdCopyBuffer(cmdBuff.vkCommandBuffer, stagingBuffer->vkBuffer, gpuBuffer->vkBuffer, 1, &region);

        endOneTimeCommands(device, &cmdBuff);
    }
}

void CCVKCmdFuncCreateTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture) {
    if (!gpuTexture->size) return;

    VkFormat format = MapVkFormat(gpuTexture->format);
    VkFormatFeatureFlags features = MapVkFormatFeatureFlags(gpuTexture->usage);
    VkFormatProperties formatProperties;
    vkGetPhysicalDeviceFormatProperties(device->gpuContext()->physicalDevice, format, &formatProperties);
    if (!(formatProperties.optimalTilingFeatures & features)) {
        const char *formatName = GFX_FORMAT_INFOS[(uint)gpuTexture->format].name.c_str();
        CC_LOG_ERROR("CCVKCmdFuncCreateTexture: The specified usage for %s is not supported on this platform", formatName);
        return;
    }

    VkImageUsageFlags usageFlags = MapVkImageUsageFlagBits(gpuTexture->usage);
    if (gpuTexture->flags & TextureFlags::GEN_MIPMAP) {
        usageFlags |= VK_IMAGE_USAGE_TRANSFER_SRC_BIT;
    }

    VkImageCreateInfo createInfo{VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO};
    createInfo.flags = MapVkImageCreateFlags(gpuTexture->type);
    createInfo.imageType = MapVkImageType(gpuTexture->type);
    createInfo.format = format;
    createInfo.extent = {gpuTexture->width, gpuTexture->height, gpuTexture->depth};
    createInfo.mipLevels = gpuTexture->mipLevel;
    createInfo.arrayLayers = gpuTexture->arrayLayer;
    createInfo.samples = MapVkSampleCount(gpuTexture->samples);
    createInfo.tiling = VK_IMAGE_TILING_OPTIMAL;
    createInfo.usage = usageFlags;
    createInfo.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;

    VmaAllocationCreateInfo allocInfo{};
    allocInfo.usage = VMA_MEMORY_USAGE_GPU_ONLY;

    VmaAllocationInfo res;
    VK_CHECK(vmaCreateImage(device->gpuDevice()->memoryAllocator, &createInfo, &allocInfo, &gpuTexture->vkImage, &gpuTexture->vmaAllocation, &res));
    //CC_LOG_DEBUG("Allocated texture: %llu %llx %llx %llu %x", res.size, gpuTexture->vkImage, res.deviceMemory, res.offset, res.pMappedData);

    gpuTexture->currentLayout = MapVkImageLayout(gpuTexture->usage, gpuTexture->format);
    gpuTexture->accessMask = MapVkAccessFlags(gpuTexture->usage, gpuTexture->format);
    gpuTexture->aspectMask = MapVkImageAspectFlags(gpuTexture->format);
    gpuTexture->targetStage = MapVkPipelineStageFlags(gpuTexture->usage);

    if (gpuTexture->currentLayout != VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL) {
        CCVKGPUCommandBuffer cmfBuff;
        beginOneTimeCommands(device, &cmfBuff);

        VkImageSubresourceRange subresourceRange{};
        subresourceRange.aspectMask = gpuTexture->aspectMask;
        subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
        insertImageMemoryBarrior(cmfBuff.vkCommandBuffer,
                                 gpuTexture->vkImage,
                                 0,
                                 gpuTexture->accessMask,
                                 VK_IMAGE_LAYOUT_UNDEFINED,
                                 gpuTexture->currentLayout,
                                 VK_PIPELINE_STAGE_HOST_BIT,
                                 gpuTexture->targetStage,
                                 subresourceRange);

        endOneTimeCommands(device, &cmfBuff);
    }
}

void CCVKCmdFuncDestroyTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture) {
    if (gpuTexture->vmaAllocation) {
        vmaDestroyImage(device->gpuDevice()->memoryAllocator, gpuTexture->vkImage, gpuTexture->vmaAllocation);
        gpuTexture->vkImage = VK_NULL_HANDLE;
        gpuTexture->vmaAllocation = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncResizeTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture) {
    CCVKCmdFuncDestroyTexture(device, gpuTexture);
    CCVKCmdFuncCreateTexture(device, gpuTexture);
}

void CCVKCmdFuncCreateTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView) {
    if (!gpuTextureView->gpuTexture || !gpuTextureView->gpuTexture->vkImage) return;

    VkImageViewCreateInfo createInfo{VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO};
    createInfo.image = gpuTextureView->gpuTexture->vkImage;
    createInfo.viewType = MapVkImageViewType(gpuTextureView->type);
    createInfo.format = MapVkFormat(gpuTextureView->format);
    createInfo.subresourceRange.aspectMask = GFX_FORMAT_INFOS[(uint)gpuTextureView->format].hasDepth ? VK_IMAGE_ASPECT_DEPTH_BIT : VK_IMAGE_ASPECT_COLOR_BIT;
    createInfo.subresourceRange.baseMipLevel = gpuTextureView->baseLevel;
    createInfo.subresourceRange.levelCount = gpuTextureView->levelCount;
    createInfo.subresourceRange.baseArrayLayer = 0;
    createInfo.subresourceRange.layerCount = gpuTextureView->gpuTexture->arrayLayer;

    VK_CHECK(vkCreateImageView(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuTextureView->vkImageView));
}

void CCVKCmdFuncDestroyTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView) {
    if (gpuTextureView->vkImageView != VK_NULL_HANDLE) {
        vkDestroyImageView(device->gpuDevice()->vkDevice, gpuTextureView->vkImageView, nullptr);
        gpuTextureView->vkImageView = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateSampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler) {
    VkSamplerCreateInfo createInfo{VK_STRUCTURE_TYPE_SAMPLER_CREATE_INFO};

    createInfo.magFilter = VK_FILTERS[(uint)gpuSampler->magFilter];
    createInfo.minFilter = VK_FILTERS[(uint)gpuSampler->minFilter];
    createInfo.mipmapMode = VK_SAMPLER_MIPMAP_MODES[(uint)gpuSampler->mipFilter];
    createInfo.addressModeU = VK_SAMPLER_ADDRESS_MODES[(uint)gpuSampler->addressU];
    createInfo.addressModeV = VK_SAMPLER_ADDRESS_MODES[(uint)gpuSampler->addressV];
    createInfo.addressModeW = VK_SAMPLER_ADDRESS_MODES[(uint)gpuSampler->addressW];
    createInfo.mipLodBias = gpuSampler->mipLODBias;
    createInfo.anisotropyEnable = VK_TRUE;
    createInfo.maxAnisotropy = (float)gpuSampler->maxAnisotropy;
    createInfo.compareEnable = VK_TRUE;
    createInfo.compareOp = VK_CMP_FUNCS[(uint)gpuSampler->cmpFunc];
    createInfo.minLod = (float)gpuSampler->minLOD;
    createInfo.maxLod = (float)gpuSampler->maxLOD;
    //createInfo.borderColor; // TODO

    VK_CHECK(vkCreateSampler(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuSampler->vkSampler));
}

void CCVKCmdFuncDestroySampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler) {
    if (gpuSampler->vkSampler != VK_NULL_HANDLE) {
        vkDestroySampler(device->gpuDevice()->vkDevice, gpuSampler->vkSampler, nullptr);
        gpuSampler->vkSampler = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateShader(CCVKDevice *device, CCVKGPUShader *gpuShader) {
    for (CCVKGPUShaderStage &stage : gpuShader->gpuStages) {
        vector<unsigned int> spirv = GLSL2SPIRV(stage.type, "#version 450\n" + stage.source, ((CCVKContext *)device->getContext())->minorVersion());
        VkShaderModuleCreateInfo createInfo{VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO};
        createInfo.codeSize = spirv.size() * sizeof(unsigned int);
        createInfo.pCode = spirv.data();
        VK_CHECK(vkCreateShaderModule(device->gpuDevice()->vkDevice, &createInfo, nullptr, &stage.vkShader));
    }
    CC_LOG_INFO("Shader '%s' compilation succeeded.", gpuShader->name.c_str());
}

void CCVKCmdFuncDestroyShader(CCVKDevice *device, CCVKGPUShader *gpuShader) {
    for (CCVKGPUShaderStage &stage : gpuShader->gpuStages) {
        vkDestroyShaderModule(device->gpuDevice()->vkDevice, stage.vkShader, nullptr);
        stage.vkShader = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateInputAssembler(CCVKDevice *device, CCVKGPUInputAssembler *gpuInputAssembler) {
    size_t vbCount = gpuInputAssembler->gpuVertexBuffers.size();
    gpuInputAssembler->vertexBuffers.resize(vbCount);
    gpuInputAssembler->vertexBufferOffsets.resize(vbCount);

    for (size_t i = 0u; i < vbCount; i++) {
        gpuInputAssembler->vertexBuffers[i] = gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
        gpuInputAssembler->vertexBufferOffsets[i] = gpuInputAssembler->gpuVertexBuffers[i]->startOffset;
    }
}

void CCVKCmdFuncDestroyInputAssembler(CCVKDevice *device, CCVKGPUInputAssembler *gpuInputAssembler) {
    gpuInputAssembler->vertexBuffers.clear();
    gpuInputAssembler->vertexBufferOffsets.clear();
}

void CCVKCmdFuncCreateFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer) {
    size_t colorViewCount = gpuFramebuffer->gpuColorViews.size();
    size_t userAttachmentCount = colorViewCount + (gpuFramebuffer->gpuDepthStencilView ? 1 : 0);
    vector<VkImageView> attachments(userAttachmentCount);
    for (size_t i = 0u; i < colorViewCount; i++) {
        attachments[i] = gpuFramebuffer->gpuColorViews[i]->vkImageView;
    }
    if (gpuFramebuffer->gpuDepthStencilView) {
        attachments[colorViewCount] = gpuFramebuffer->gpuDepthStencilView->vkImageView;
    }

    if (gpuFramebuffer->isOffscreen) {
        VkFramebufferCreateInfo createInfo{VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO};
        createInfo.renderPass = gpuFramebuffer->gpuRenderPass->vkRenderPass;
        createInfo.attachmentCount = attachments.size();
        createInfo.pAttachments = attachments.data();
        createInfo.width = colorViewCount ? gpuFramebuffer->gpuColorViews[0]->gpuTexture->width : 1;
        createInfo.height = colorViewCount ? gpuFramebuffer->gpuColorViews[0]->gpuTexture->height : 1;
        createInfo.layers = 1;
        VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuFramebuffer->vkFramebuffer));
    } else {
        // swapchain-related framebuffers need special treatments: rebuild is needed
        // whenever a user-specified attachment or swapchain itself is changed

        gpuFramebuffer->swapchain = device->gpuSwapchain();
        FramebufferListMap &fboListMap = gpuFramebuffer->swapchain->vkSwapchainFramebufferListMap;
        FramebufferListMapIter fboListMapIter = fboListMap.find(gpuFramebuffer);
        if (fboListMapIter != fboListMap.end() && fboListMapIter->second.size()) {
            return;
        }
        size_t swapchainImageCount = gpuFramebuffer->swapchain->vkSwapchainImageViews.size();
        if (fboListMapIter != fboListMap.end()) {
            fboListMapIter->second.resize(swapchainImageCount);
        } else {
            fboListMap[gpuFramebuffer] = FramebufferList(swapchainImageCount);
        }
        attachments.resize(userAttachmentCount + 2);
        VkFramebufferCreateInfo createInfo{VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO};
        createInfo.renderPass = gpuFramebuffer->gpuRenderPass->vkRenderPass;
        createInfo.attachmentCount = attachments.size();
        createInfo.pAttachments = attachments.data();
        createInfo.width = device->getWidth();
        createInfo.height = device->getHeight();
        createInfo.layers = 1;
        for (size_t i = 0u; i < swapchainImageCount; i++) {
            attachments[userAttachmentCount] = gpuFramebuffer->swapchain->vkSwapchainImageViews[i];
            attachments[userAttachmentCount + 1] = gpuFramebuffer->swapchain->depthStencilImageViews[i];
            VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &fboListMap[gpuFramebuffer][i]));
        }
    }
}

void CCVKCmdFuncDestroyFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer) {
    if (gpuFramebuffer->isOffscreen) {
        if (gpuFramebuffer->vkFramebuffer != VK_NULL_HANDLE) {
            vkDestroyFramebuffer(device->gpuDevice()->vkDevice, gpuFramebuffer->vkFramebuffer, nullptr);
            gpuFramebuffer->vkFramebuffer = VK_NULL_HANDLE;
        }
    } else {
        FramebufferListMap &fboListMap = gpuFramebuffer->swapchain->vkSwapchainFramebufferListMap;
        FramebufferListMapIter fboListMapIter = fboListMap.find(gpuFramebuffer);
        if (fboListMapIter != fboListMap.end()) {
            for (size_t i = 0u; i < fboListMapIter->second.size(); i++) {
                vkDestroyFramebuffer(device->gpuDevice()->vkDevice, fboListMapIter->second[i], nullptr);
            }
            fboListMapIter->second.clear();
            fboListMap.erase(fboListMapIter);
        }
    }
}

void CCVKCmdFuncCreateBindingLayout(CCVKDevice *device, CCVKGPUBindingLayout *gpuBindingLayout, BindingUnitList bindings) {
    size_t count = bindings.size();

    vector<VkDescriptorSetLayoutBinding> setBindings(count);
    for (size_t i = 0u; i < count; i++) {
        const BindingUnit &binding = bindings[i];
        setBindings[i].binding = binding.binding;
        setBindings[i].descriptorType = MapVkDescriptorType(binding.type);
        setBindings[i].descriptorCount = binding.count;
        setBindings[i].stageFlags = MapVkShaderStageFlags(binding.shaderStages);
    }

    VkDescriptorSetLayoutCreateInfo setCreateInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO};
    setCreateInfo.bindingCount = count;
    setCreateInfo.pBindings = setBindings.data();

    VK_CHECK(vkCreateDescriptorSetLayout(device->gpuDevice()->vkDevice, &setCreateInfo, nullptr, &gpuBindingLayout->vkDescriptorSetLayout));

    vector<VkDescriptorPoolSize> poolSizes;
    for (const VkDescriptorSetLayoutBinding &binding : setBindings) {
        bool found = false;
        for (VkDescriptorPoolSize &poolSize : poolSizes) {
            if (poolSize.type == binding.descriptorType) {
                poolSize.descriptorCount++;
                found = true;
                break;
            }
        }
        if (!found) {
            poolSizes.push_back({binding.descriptorType, 1});
        }
    }

    VkDescriptorPoolCreateInfo poolInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO};
    poolInfo.poolSizeCount = poolSizes.size();
    poolInfo.pPoolSizes = poolSizes.data();
    poolInfo.maxSets = 1;

    VK_CHECK(vkCreateDescriptorPool(device->gpuDevice()->vkDevice, &poolInfo, nullptr, &gpuBindingLayout->vkDescriptorPool));

    VkDescriptorSetAllocateInfo allocInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO};
    allocInfo.descriptorPool = gpuBindingLayout->vkDescriptorPool;
    allocInfo.descriptorSetCount = 1;
    allocInfo.pSetLayouts = &gpuBindingLayout->vkDescriptorSetLayout;

    VK_CHECK(vkAllocateDescriptorSets(device->gpuDevice()->vkDevice, &allocInfo, &gpuBindingLayout->vkDescriptorSet));

    gpuBindingLayout->bindings.resize(bindings.size(), {VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET});
    for (size_t i = 0u; i < count; i++) {
        VkWriteDescriptorSet &binding = gpuBindingLayout->bindings[i];
        binding.dstSet = gpuBindingLayout->vkDescriptorSet;
        binding.dstBinding = setBindings[i].binding;
        binding.dstArrayElement = 0;
        binding.descriptorCount = 1;
        binding.descriptorType = setBindings[i].descriptorType;
        switch (binding.descriptorType) {
            case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER:
            case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER:
            case VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER_DYNAMIC:
            case VK_DESCRIPTOR_TYPE_STORAGE_BUFFER_DYNAMIC:
                binding.pBufferInfo = CC_NEW(VkDescriptorBufferInfo);
                break;
            case VK_DESCRIPTOR_TYPE_SAMPLER:
            case VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER:
            case VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE:
            case VK_DESCRIPTOR_TYPE_STORAGE_IMAGE:
            case VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT:
                binding.pImageInfo = CC_NEW(VkDescriptorImageInfo);
                break;
            case VK_DESCRIPTOR_TYPE_UNIFORM_TEXEL_BUFFER:
            case VK_DESCRIPTOR_TYPE_STORAGE_TEXEL_BUFFER:
                binding.pTexelBufferView = CC_NEW(VkBufferView);
                break;
        }
    }
}

void CCVKCmdFuncDestroyBindingLayout(CCVKDevice *device, CCVKGPUBindingLayout *gpuBindingLayout) {
    for (VkWriteDescriptorSet &binding : gpuBindingLayout->bindings) {
        CC_SAFE_DELETE(binding.pBufferInfo);
        CC_SAFE_DELETE(binding.pImageInfo);
        CC_SAFE_DELETE(binding.pTexelBufferView);
    }
    gpuBindingLayout->bindings.clear();

    gpuBindingLayout->vkDescriptorSet = VK_NULL_HANDLE;

    if (gpuBindingLayout->vkDescriptorPool != VK_NULL_HANDLE) {
        vkDestroyDescriptorPool(device->gpuDevice()->vkDevice, gpuBindingLayout->vkDescriptorPool, nullptr);
        gpuBindingLayout->vkDescriptorPool = VK_NULL_HANDLE;
    }

    if (gpuBindingLayout->vkDescriptorSetLayout != VK_NULL_HANDLE) {
        vkDestroyDescriptorSetLayout(device->gpuDevice()->vkDevice, gpuBindingLayout->vkDescriptorSetLayout, nullptr);
        gpuBindingLayout->vkDescriptorSetLayout = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreatePipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout) {
    size_t count = gpuPipelineLayout->gpuBindingLayouts.size();
    vector<VkDescriptorSetLayout> descriptorSetLayouts(count);
    for (size_t i = 0u; i < count; i++) {
        const CCVKGPUBindingLayout *layout = gpuPipelineLayout->gpuBindingLayouts[i];
        descriptorSetLayouts[i] = layout->vkDescriptorSetLayout;
    }

    VkPipelineLayoutCreateInfo createInfo{VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO};
    createInfo.setLayoutCount = count;
    createInfo.pSetLayouts = descriptorSetLayouts.data();

    VK_CHECK(vkCreatePipelineLayout(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuPipelineLayout->vkPipelineLayout));
}

void CCVKCmdFuncDestroyPipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout) {
    if (gpuPipelineLayout->vkPipelineLayout != VK_NULL_HANDLE) {
        vkDestroyPipelineLayout(device->gpuDevice()->vkDevice, gpuPipelineLayout->vkPipelineLayout, nullptr);
        gpuPipelineLayout->vkPipelineLayout = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreatePipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState) {
    VkGraphicsPipelineCreateInfo createInfo{VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO};

    ///////////////////// Shader Stage /////////////////////

    const CCVKGPUShaderStageList &stages = gpuPipelineState->gpuShader->gpuStages;
    const size_t stageCount = stages.size();
    vector<VkPipelineShaderStageCreateInfo> stageInfos(stageCount, {VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO});
    for (size_t i = 0u; i < stageCount; i++) {
        stageInfos[i].stage = MapVkShaderStageFlagBits(stages[i].type);
        stageInfos[i].module = stages[i].vkShader;
        stageInfos[i].pName = "main";
    }
    createInfo.stageCount = stageCount;
    createInfo.pStages = stageInfos.data();

    ///////////////////// Input State /////////////////////

    const AttributeList &attributes = gpuPipelineState->inputState.attributes;
    const size_t attributeCount = attributes.size();
    size_t bindingCount = 1u;
    for (size_t i = 0u; i < attributeCount; i++) {
        const Attribute &attr = attributes[i];
        bindingCount = std::max((size_t)bindingCount, (size_t)(attr.stream + 1));
    }

    vector<VkVertexInputBindingDescription> bindingDescriptions(bindingCount);
    for (size_t i = 0u; i < bindingCount; i++) {
        bindingDescriptions[i].binding = i;
        bindingDescriptions[i].stride = 0;
        bindingDescriptions[i].inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
    }
    for (size_t i = 0u; i < attributeCount; i++) {
        const Attribute &attr = attributes[i];
        bindingDescriptions[attr.stream].stride += GFX_FORMAT_INFOS[(uint)attr.format].size;
        if (attr.isInstanced) {
            bindingDescriptions[attr.stream].inputRate = VK_VERTEX_INPUT_RATE_INSTANCE;
        }
    }

    const AttributeList &shaderAttrs = gpuPipelineState->gpuShader->attributes;
    const size_t shaderAttrCount = shaderAttrs.size();
    vector<VkVertexInputAttributeDescription> attributeDescriptions(shaderAttrCount);
    vector<uint> offsets(bindingCount, 0);
    uint record = 0u;
    for (size_t i = 0u; i < attributeCount; i++) {
        const Attribute &attr = attributes[i];
        size_t j = 0u;
        for (; j < shaderAttrCount; j++) {
            if (shaderAttrs[j].name == attr.name) {
                attributeDescriptions[j].location = shaderAttrs[j].location;
                attributeDescriptions[j].binding = attr.stream;
                attributeDescriptions[j].format = MapVkFormat(attr.format);
                attributeDescriptions[j].offset = offsets[attr.stream];
                record |= 1 << j;
                break;
            }
        }
        offsets[attr.stream] += GFX_FORMAT_INFOS[(uint)attr.format].size;
    }

    // handle absent attributes
    for (size_t i = 0u; i < shaderAttrCount; i++) {
        if (record & (1 << i)) continue;
        attributeDescriptions[i].location = shaderAttrs[i].location;
        attributeDescriptions[i].format = MapVkFormat(shaderAttrs[i].format);
        attributeDescriptions[i].offset = 0; // reuse the first attribute as dummy data
    }

    VkPipelineVertexInputStateCreateInfo vertexInput{VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO};
    vertexInput.vertexBindingDescriptionCount = bindingCount;
    vertexInput.pVertexBindingDescriptions = bindingDescriptions.data();
    vertexInput.vertexAttributeDescriptionCount = shaderAttrCount;
    vertexInput.pVertexAttributeDescriptions = attributeDescriptions.data();
    createInfo.pVertexInputState = &vertexInput;

    ///////////////////// Input Asembly State /////////////////////

    VkPipelineInputAssemblyStateCreateInfo inputAssembly{VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO};
    inputAssembly.topology = VK_PRIMITIVE_MODES[(uint)gpuPipelineState->primitive];
    createInfo.pInputAssemblyState = &inputAssembly;

    ///////////////////// Dynamic State /////////////////////

    vector<VkDynamicState> dynamicStates{VK_DYNAMIC_STATE_VIEWPORT, VK_DYNAMIC_STATE_SCISSOR};
    insertVkDynamicStates(dynamicStates, gpuPipelineState->dynamicStates);

    VkPipelineDynamicStateCreateInfo dynamicState{VK_STRUCTURE_TYPE_PIPELINE_DYNAMIC_STATE_CREATE_INFO};
    dynamicState.dynamicStateCount = dynamicStates.size();
    dynamicState.pDynamicStates = dynamicStates.data();
    createInfo.pDynamicState = &dynamicState;

    ///////////////////// Viewport State /////////////////////

    VkPipelineViewportStateCreateInfo viewportState{VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO};
    viewportState.viewportCount = 1; // dynamic by default
    viewportState.scissorCount = 1;  // dynamic by default
    createInfo.pViewportState = &viewportState;

    ///////////////////// Rasterization State /////////////////////

    VkPipelineRasterizationStateCreateInfo rasterizationState{VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO};

    //rasterizationState.depthClampEnable;
    rasterizationState.rasterizerDiscardEnable = gpuPipelineState->rs.isDiscard;
    rasterizationState.polygonMode = VK_POLYGON_MODES[(uint)gpuPipelineState->rs.polygonMode];
    rasterizationState.cullMode = VK_CULL_MODES[(uint)gpuPipelineState->rs.cullMode];
    rasterizationState.frontFace = gpuPipelineState->rs.isFrontFaceCCW ? VK_FRONT_FACE_COUNTER_CLOCKWISE : VK_FRONT_FACE_CLOCKWISE;
    rasterizationState.depthBiasEnable = gpuPipelineState->rs.depthBiasEnabled;
    rasterizationState.depthBiasConstantFactor = gpuPipelineState->rs.depthBias;
    rasterizationState.depthBiasClamp = gpuPipelineState->rs.depthBiasClamp;
    rasterizationState.depthBiasSlopeFactor = gpuPipelineState->rs.depthBiasSlop;
    rasterizationState.lineWidth = gpuPipelineState->rs.lineWidth;
    createInfo.pRasterizationState = &rasterizationState;

    ///////////////////// Multisample State /////////////////////

    VkPipelineMultisampleStateCreateInfo multisampleState{VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO};
    multisampleState.rasterizationSamples = VK_SAMPLE_COUNT_1_BIT;
    multisampleState.alphaToCoverageEnable = gpuPipelineState->bs.isA2C;
    //multisampleState.sampleShadingEnable;
    //multisampleState.minSampleShading;
    //multisampleState.pSampleMask;
    //multisampleState.alphaToOneEnable;
    createInfo.pMultisampleState = &multisampleState;

    ///////////////////// Depth Stencil State /////////////////////

    VkPipelineDepthStencilStateCreateInfo depthStencilState = {VK_STRUCTURE_TYPE_PIPELINE_DEPTH_STENCIL_STATE_CREATE_INFO};
    depthStencilState.depthTestEnable = gpuPipelineState->dss.depthTest;
    depthStencilState.depthWriteEnable = gpuPipelineState->dss.depthWrite;
    depthStencilState.depthCompareOp = VK_CMP_FUNCS[(uint)gpuPipelineState->dss.depthFunc];
    depthStencilState.stencilTestEnable = gpuPipelineState->dss.stencilTestFront;
    depthStencilState.front = {
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilFailOpFront],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilPassOpFront],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilZFailOpFront],
        VK_CMP_FUNCS[(uint)gpuPipelineState->dss.stencilFuncFront],
        gpuPipelineState->dss.stencilReadMaskFront,
        gpuPipelineState->dss.stencilWriteMaskFront,
        gpuPipelineState->dss.stencilRefFront,
    };
    depthStencilState.back = {
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilFailOpBack],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilPassOpBack],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilZFailOpBack],
        VK_CMP_FUNCS[(uint)gpuPipelineState->dss.stencilFuncBack],
        gpuPipelineState->dss.stencilReadMaskBack,
        gpuPipelineState->dss.stencilWriteMaskBack,
        gpuPipelineState->dss.stencilRefBack,
    };
    //depthStencilState.depthBoundsTestEnable;
    //depthStencilState.minDepthBounds;
    //depthStencilState.maxDepthBounds;
    createInfo.pDepthStencilState = &depthStencilState;

    ///////////////////// Blend State /////////////////////

    size_t blendTargetCount = gpuPipelineState->bs.targets.size();
    vector<VkPipelineColorBlendAttachmentState> blendTargets(blendTargetCount);
    for (size_t i = 0u; i < blendTargetCount; i++) {
        BlendTarget &target = gpuPipelineState->bs.targets[i];
        blendTargets[i].blendEnable = target.blend;
        blendTargets[i].srcColorBlendFactor = VK_BLEND_FACTORS[(uint)target.blendSrc];
        blendTargets[i].dstColorBlendFactor = VK_BLEND_FACTORS[(uint)target.blendDst];
        blendTargets[i].colorBlendOp = VK_BLEND_OPS[(uint)target.blendEq];
        blendTargets[i].srcAlphaBlendFactor = VK_BLEND_FACTORS[(uint)target.blendSrcAlpha];
        blendTargets[i].dstAlphaBlendFactor = VK_BLEND_FACTORS[(uint)target.blendDstAlpha];
        blendTargets[i].alphaBlendOp = VK_BLEND_OPS[(uint)target.blendAlphaEq];
        blendTargets[i].colorWriteMask = MapVkColorComponentFlags(target.blendColorMask);
    }
    Color &blendColor = gpuPipelineState->bs.blendColor;

    VkPipelineColorBlendStateCreateInfo colorBlendState{VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO};
    //colorBlendState.logicOpEnable;
    //colorBlendState.logicOp;
    colorBlendState.attachmentCount = blendTargetCount;
    colorBlendState.pAttachments = blendTargets.data();
    colorBlendState.blendConstants[0] = blendColor.r;
    colorBlendState.blendConstants[1] = blendColor.g;
    colorBlendState.blendConstants[2] = blendColor.b;
    colorBlendState.blendConstants[3] = blendColor.a;
    createInfo.pColorBlendState = &colorBlendState;

    ///////////////////// References /////////////////////

    createInfo.layout = gpuPipelineState->gpuLayout->vkPipelineLayout;
    createInfo.renderPass = gpuPipelineState->gpuRenderPass->vkRenderPass;

    ///////////////////// Creation /////////////////////

    VK_CHECK(vkCreateGraphicsPipelines(device->gpuDevice()->vkDevice, gpuPipelineState->vkPipelineCache,
                                       1, &createInfo, nullptr, &gpuPipelineState->vkPipeline));
}

void CCVKCmdFuncDestroyPipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState) {
    if (gpuPipelineState->vkPipeline != VK_NULL_HANDLE) {
        vkDestroyPipeline(device->gpuDevice()->vkDevice, gpuPipelineState->vkPipeline, nullptr);
        gpuPipelineState->vkPipeline = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCopyBuffersToTexture(CCVKDevice *device, uint8_t *const *buffers, CCVKGPUTexture *gpuTexture, const BufferTextureCopyList &regions) {
    //bool isCompressed = GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed;
    CCVKGPUCommandBuffer cmdBuff;
    beginOneTimeCommands(device, &cmdBuff);

    //transfer image layout to destination for later copy.
    VkImageSubresourceRange subresoureceRange{};
    subresoureceRange.aspectMask = gpuTexture->aspectMask;
    subresoureceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    subresoureceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    insertImageMemoryBarrior(cmdBuff.vkCommandBuffer,
                             gpuTexture->vkImage,
                             gpuTexture->accessMask,
                             VK_ACCESS_TRANSFER_WRITE_BIT,
                             gpuTexture->currentLayout,
                             VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL,
                             gpuTexture->targetStage,
                             VK_PIPELINE_STAGE_TRANSFER_BIT,
                             subresoureceRange);

    uint regionCount = regions.size(), totalSize = 0u;
    vector<uint> regionSizes(regionCount);
    for (size_t i = 0u; i < regionCount; ++i) {
        const BufferTextureCopy &region = regions[i];
        uint w = region.buffStride > 0 ? region.buffStride : region.texExtent.width;
        uint h = region.buffTexHeight > 0 ? region.buffTexHeight : region.texExtent.height;
        totalSize += regionSizes[i] = FormatSize(gpuTexture->format, w, h, region.texExtent.depth);
    }

    CCVKGPUBuffer *stagingBuffer = device->stagingBuffer()->gpuBuffer();
    if (stagingBuffer->size < totalSize) device->stagingBuffer()->resize(nextPowerOf2(totalSize));

    vector<VkBufferImageCopy> stagingRegions(regionCount);
    VkDeviceSize offset = stagingBuffer->startOffset;
    for (size_t i = 0u; i < regionCount; ++i) {
        const BufferTextureCopy &region = regions[i];
        VkBufferImageCopy &stagingRegion = stagingRegions[i];
        stagingRegion.bufferOffset = offset;
        stagingRegion.bufferRowLength = region.buffStride;
        stagingRegion.bufferImageHeight = region.buffTexHeight;
        stagingRegion.imageSubresource = {gpuTexture->aspectMask, region.texSubres.mipLevel, region.texSubres.baseArrayLayer, region.texSubres.layerCount};
        stagingRegion.imageOffset = {region.texOffset.x, region.texOffset.y, region.texOffset.z};
        stagingRegion.imageExtent = {region.texExtent.width, region.texExtent.height, region.texExtent.depth};

        memcpy(stagingBuffer->mappedData + offset, buffers[i], regionSizes[i]);
        offset += regionSizes[i];
    }

    vkCmdCopyBufferToImage(cmdBuff.vkCommandBuffer, stagingBuffer->vkBuffer, gpuTexture->vkImage,
                           VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL, stagingRegions.size(), stagingRegions.data());

    bool layoutReady = false;
    if (gpuTexture->flags & TextureFlags::GEN_MIPMAP) {
        VkFormatProperties formatProperties;
        vkGetPhysicalDeviceFormatProperties(device->gpuContext()->physicalDevice, MapVkFormat(gpuTexture->format), &formatProperties);
        VkFormatFeatureFlags mipmapFeatures = VK_FORMAT_FEATURE_BLIT_SRC_BIT | VK_FORMAT_FEATURE_BLIT_DST_BIT | VK_FORMAT_FEATURE_SAMPLED_IMAGE_FILTER_LINEAR_BIT;

        if (formatProperties.optimalTilingFeatures & mipmapFeatures) {
            VkImageSubresourceRange mipSubRange{};
            mipSubRange.aspectMask = gpuTexture->aspectMask;
            mipSubRange.levelCount = 1;
            mipSubRange.layerCount = VK_REMAINING_ARRAY_LAYERS;

            int32_t mipWidth = gpuTexture->width;
            int32_t mipHeight = gpuTexture->height;

            for (uint i = 1u; i < gpuTexture->mipLevel; i++) {
                mipSubRange.baseMipLevel = i - 1;
                insertImageMemoryBarrior(cmdBuff.vkCommandBuffer,
                                         gpuTexture->vkImage,
                                         VK_ACCESS_TRANSFER_WRITE_BIT,
                                         VK_ACCESS_TRANSFER_READ_BIT,
                                         VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL,
                                         VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL,
                                         VK_PIPELINE_STAGE_TRANSFER_BIT,
                                         VK_PIPELINE_STAGE_TRANSFER_BIT,
                                         mipSubRange);

                VkImageBlit blit{};
                blit.srcOffsets[1] = {mipWidth, mipHeight, 1};
                blit.srcSubresource.aspectMask = gpuTexture->aspectMask;
                blit.srcSubresource.mipLevel = i - 1;
                blit.srcSubresource.layerCount = gpuTexture->arrayLayer;
                blit.dstOffsets[1] = {mipWidth > 1 ? mipWidth >> 1 : 1, mipHeight > 1 ? mipHeight >> 1 : 1, 1};
                blit.dstSubresource.aspectMask = gpuTexture->aspectMask;
                blit.dstSubresource.mipLevel = i;
                blit.dstSubresource.layerCount = gpuTexture->arrayLayer;
                vkCmdBlitImage(cmdBuff.vkCommandBuffer,
                               gpuTexture->vkImage, VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL,
                               gpuTexture->vkImage, VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL,
                               1, &blit,
                               VK_FILTER_LINEAR);

                insertImageMemoryBarrior(cmdBuff.vkCommandBuffer,
                                         gpuTexture->vkImage,
                                         VK_ACCESS_TRANSFER_READ_BIT,
                                         gpuTexture->accessMask,
                                         VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL,
                                         gpuTexture->currentLayout,
                                         VK_PIPELINE_STAGE_TRANSFER_BIT,
                                         gpuTexture->targetStage,
                                         mipSubRange);

                if (mipWidth > 1) mipWidth = mipWidth >> 1;
                if (mipHeight > 1) mipHeight = mipHeight >> 1;
            }

            mipSubRange.baseMipLevel = gpuTexture->mipLevel - 1;
            insertImageMemoryBarrior(cmdBuff.vkCommandBuffer,
                                     gpuTexture->vkImage,
                                     VK_ACCESS_TRANSFER_WRITE_BIT,
                                     gpuTexture->accessMask,
                                     VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL,
                                     gpuTexture->currentLayout,
                                     VK_PIPELINE_STAGE_TRANSFER_BIT,
                                     gpuTexture->targetStage,
                                     mipSubRange);
            layoutReady = true;
        } else {
            const char *formatName = GFX_FORMAT_INFOS[(uint)gpuTexture->format].name.c_str();
            CC_LOG_WARNING("CCVKCmdFuncCopyBuffersToTexture: generate mipmap for %s is not supported on this platform", formatName);
        }
    }

    if (!layoutReady) {
        insertImageMemoryBarrior(cmdBuff.vkCommandBuffer,
                                 gpuTexture->vkImage,
                                 VK_ACCESS_TRANSFER_WRITE_BIT,
                                 gpuTexture->accessMask,
                                 VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL,
                                 gpuTexture->currentLayout,
                                 VK_PIPELINE_STAGE_TRANSFER_BIT,
                                 gpuTexture->targetStage,
                                 subresoureceRange);
    }

    endOneTimeCommands(device, &cmdBuff);
}

} // namespace gfx
} // namespace cc
