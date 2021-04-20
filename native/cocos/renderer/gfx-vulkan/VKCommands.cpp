/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKContext.h"
#include "VKDevice.h"
#include "VKQueue.h"
#include "VKSPIRV.h"

#include <algorithm>

namespace cc {
namespace gfx {

namespace {
constexpr bool ENABLE_LAZY_ALLOCATION = true;
}

CCVKGPUCommandBufferPool *CCVKGPUDevice::getCommandBufferPool() {
    std::thread::id threadID = std::this_thread::get_id();
    if (!_commandBufferPools.count(threadID)) {
        //std::scoped_lock<std::mutex> guard(mutex);
        _commandBufferPools[threadID] = CC_NEW(CCVKGPUCommandBufferPool(this));
    }
    return _commandBufferPools[threadID];
}

CCVKGPUDescriptorSetPool *CCVKGPUDevice::getDescriptorSetPool(uint layoutID) {
    return &_descriptorSetPools[layoutID];
}

void insertVkDynamicStates(vector<VkDynamicState> *out, const vector<DynamicStateFlagBit> &dynamicStates) {
    for (DynamicStateFlagBit dynamicState : dynamicStates) {
        switch (dynamicState) {
            case DynamicStateFlagBit::VIEWPORT:
            case DynamicStateFlagBit::SCISSOR: break; // we make this dynamic by default
            case DynamicStateFlagBit::LINE_WIDTH: out->push_back(VK_DYNAMIC_STATE_LINE_WIDTH); break;
            case DynamicStateFlagBit::DEPTH_BIAS: out->push_back(VK_DYNAMIC_STATE_DEPTH_BIAS); break;
            case DynamicStateFlagBit::BLEND_CONSTANTS: out->push_back(VK_DYNAMIC_STATE_BLEND_CONSTANTS); break;
            case DynamicStateFlagBit::DEPTH_BOUNDS: out->push_back(VK_DYNAMIC_STATE_DEPTH_BOUNDS); break;
            case DynamicStateFlagBit::STENCIL_WRITE_MASK: out->push_back(VK_DYNAMIC_STATE_STENCIL_WRITE_MASK); break;
            case DynamicStateFlagBit::STENCIL_COMPARE_MASK:
                out->push_back(VK_DYNAMIC_STATE_STENCIL_REFERENCE);
                out->push_back(VK_DYNAMIC_STATE_STENCIL_COMPARE_MASK);
                break;
            default: {
                CCASSERT(false, "Unsupported DynamicStateFlagBit, convert to VkDynamicState failed.");
                break;
            }
        }
    }
}

void cmdFuncCCVKGetDeviceQueue(CCVKDevice *device, CCVKGPUQueue *gpuQueue) {
    uint     queueType       = 0U;
    VkBool32 needPresentable = VK_FALSE;
    switch (gpuQueue->type) {
        case QueueType::GRAPHICS:
            queueType       = VK_QUEUE_GRAPHICS_BIT;
            needPresentable = VK_TRUE;
            break;
        case QueueType::COMPUTE: queueType = VK_QUEUE_COMPUTE_BIT; break;
        case QueueType::TRANSFER: queueType = VK_QUEUE_TRANSFER_BIT; break;
    }

    const CCVKGPUContext *context = device->gpuContext();

    size_t queueCount = context->queueFamilyProperties.size();
    for (size_t i = 0U; i < queueCount; ++i) {
        const VkQueueFamilyProperties &properties    = context->queueFamilyProperties[i];
        const VkBool32                 isPresentable = context->queueFamilyPresentables[i];
        if (properties.queueCount > 0 && (properties.queueFlags & queueType) && (!needPresentable || isPresentable)) {
            vkGetDeviceQueue(device->gpuDevice()->vkDevice, i, 0, &gpuQueue->vkQueue);
            gpuQueue->queueFamilyIndex = i;
            break;
        }
    }
}

void cmdFuncCCVKCreateTexture(CCVKDevice *device, CCVKGPUTexture *gpuTexture) {
    if (!gpuTexture->size) return;

    gpuTexture->aspectMask = mapVkImageAspectFlags(gpuTexture->format);

    VkFormat             format   = mapVkFormat(gpuTexture->format);
    VkFormatFeatureFlags features = mapVkFormatFeatureFlags(gpuTexture->usage);
    VkFormatProperties   formatProperties;
    vkGetPhysicalDeviceFormatProperties(device->gpuContext()->physicalDevice, format, &formatProperties);
    if (!(formatProperties.optimalTilingFeatures & features)) {
        const char *formatName = GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)].name.c_str();
        CC_LOG_ERROR("cmdFuncCCVKCreateTexture: The specified usage for %s is not supported on this platform", formatName);
        return;
    }

    VkImageUsageFlags usageFlags = mapVkImageUsageFlagBits(gpuTexture->usage);
    if (hasFlag(gpuTexture->flags, TextureFlags::GEN_MIPMAP)) {
        usageFlags |= VK_IMAGE_USAGE_TRANSFER_SRC_BIT;
    }

    VkImageCreateInfo createInfo{VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO};
    createInfo.flags         = mapVkImageCreateFlags(gpuTexture->type);
    createInfo.imageType     = mapVkImageType(gpuTexture->type);
    createInfo.format        = format;
    createInfo.extent        = {gpuTexture->width, gpuTexture->height, gpuTexture->depth};
    createInfo.mipLevels     = gpuTexture->mipLevels;
    createInfo.arrayLayers   = gpuTexture->arrayLayers;
    createInfo.samples       = mapVkSampleCount(gpuTexture->samples);
    createInfo.tiling        = VK_IMAGE_TILING_OPTIMAL;
    createInfo.usage         = usageFlags;
    createInfo.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;

    VmaAllocationCreateInfo allocInfo{};
    allocInfo.usage = VMA_MEMORY_USAGE_GPU_ONLY;

    VmaAllocationInfo res;

    TextureUsage transientUsages = gpuTexture->usage & TEXTURE_USAGE_TRANSIENT;
    if (ENABLE_LAZY_ALLOCATION && transientUsages != TextureUsage::NONE && transientUsages == gpuTexture->usage) {
        createInfo.usage = usageFlags | VK_IMAGE_USAGE_TRANSIENT_ATTACHMENT_BIT;
        allocInfo.usage  = VMA_MEMORY_USAGE_GPU_LAZILY_ALLOCATED;
        VkResult result  = vmaCreateImage(device->gpuDevice()->memoryAllocator, &createInfo, &allocInfo, &gpuTexture->vkImage, &gpuTexture->vmaAllocation, &res);
        if (!result) {
            CC_LOG_INFO("Created memoryless texture: %s-%dx%d",
                        GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)].name.c_str(),
                        gpuTexture->width, gpuTexture->height);
            return;
        }

        // feature not present, fallback
        createInfo.usage = usageFlags;
        allocInfo.usage  = VMA_MEMORY_USAGE_GPU_ONLY;
    }

    VK_CHECK(vmaCreateImage(device->gpuDevice()->memoryAllocator, &createInfo, &allocInfo, &gpuTexture->vkImage, &gpuTexture->vmaAllocation, &res));
    //CC_LOG_DEBUG("Allocated texture: %llu %llx %llx %llu %x", res.size, gpuTexture->vkImage, res.deviceMemory, res.offset, res.pMappedData);
}

void cmdFuncCCVKCreateTextureView(CCVKDevice *device, CCVKGPUTextureView *gpuTextureView) {
    if (!gpuTextureView->gpuTexture || !gpuTextureView->gpuTexture->vkImage) return;

    VkImageViewCreateInfo createInfo{VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO};
    createInfo.image                           = gpuTextureView->gpuTexture->vkImage;
    createInfo.viewType                        = mapVkImageViewType(gpuTextureView->type);
    createInfo.format                          = mapVkFormat(gpuTextureView->format);
    createInfo.subresourceRange.aspectMask     = GFX_FORMAT_INFOS[static_cast<uint>(gpuTextureView->format)].hasDepth ? VK_IMAGE_ASPECT_DEPTH_BIT : VK_IMAGE_ASPECT_COLOR_BIT;
    createInfo.subresourceRange.baseMipLevel   = gpuTextureView->baseLevel;
    createInfo.subresourceRange.levelCount     = gpuTextureView->levelCount;
    createInfo.subresourceRange.baseArrayLayer = gpuTextureView->baseLayer;
    createInfo.subresourceRange.layerCount     = gpuTextureView->layerCount;

    VK_CHECK(vkCreateImageView(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuTextureView->vkImageView));

    device->gpuDescriptorHub()->update(gpuTextureView);
}

void cmdFuncCCVKCreateSampler(CCVKDevice *device, CCVKGPUSampler *gpuSampler) {
    VkSamplerCreateInfo createInfo{VK_STRUCTURE_TYPE_SAMPLER_CREATE_INFO};
    CCVKGPUContext *    context = device->gpuContext();

    createInfo.magFilter        = VK_FILTERS[static_cast<uint>(gpuSampler->magFilter)];
    createInfo.minFilter        = VK_FILTERS[static_cast<uint>(gpuSampler->minFilter)];
    createInfo.mipmapMode       = VK_SAMPLER_MIPMAP_MODES[static_cast<uint>(gpuSampler->mipFilter)];
    createInfo.addressModeU     = VK_SAMPLER_ADDRESS_MODES[static_cast<uint>(gpuSampler->addressU)];
    createInfo.addressModeV     = VK_SAMPLER_ADDRESS_MODES[static_cast<uint>(gpuSampler->addressV)];
    createInfo.addressModeW     = VK_SAMPLER_ADDRESS_MODES[static_cast<uint>(gpuSampler->addressW)];
    createInfo.mipLodBias       = gpuSampler->mipLODBias;
    createInfo.anisotropyEnable = gpuSampler->maxAnisotropy && context->physicalDeviceFeatures.samplerAnisotropy;
    createInfo.maxAnisotropy    = std::min(context->physicalDeviceProperties.limits.maxSamplerAnisotropy, static_cast<float>(gpuSampler->maxAnisotropy));
    createInfo.compareEnable    = gpuSampler->cmpFunc != ComparisonFunc::ALWAYS;
    createInfo.compareOp        = VK_CMP_FUNCS[static_cast<uint>(gpuSampler->cmpFunc)];
    createInfo.minLod           = 0.0;               // UNASSIGNED-BestPractices-vkCreateSampler-lod-clamping
    createInfo.maxLod           = VK_LOD_CLAMP_NONE; // UNASSIGNED-BestPractices-vkCreateSampler-lod-clamping
    //createInfo.borderColor; // TODO

    VK_CHECK(vkCreateSampler(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuSampler->vkSampler));
}

void cmdFuncCCVKCreateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer) {
    if (!gpuBuffer->size) {
        return;
    }

    gpuBuffer->instanceSize = 0U;

    VkBufferCreateInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO};
    bufferInfo.size  = gpuBuffer->size;
    bufferInfo.usage = mapVkBufferUsageFlagBits(gpuBuffer->usage);

    VmaAllocationCreateInfo allocInfo{};

    if (gpuBuffer->memUsage == MemoryUsage::HOST) {
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
        allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;
        allocInfo.usage = VMA_MEMORY_USAGE_CPU_ONLY;
    } else if (gpuBuffer->memUsage == MemoryUsage::DEVICE) {
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_DST_BIT;
        allocInfo.usage = VMA_MEMORY_USAGE_GPU_ONLY;
    } else if (gpuBuffer->memUsage == (MemoryUsage::HOST | MemoryUsage::DEVICE)) {
        /*
        gpuBuffer->instanceSize = roundUp(gpuBuffer->size, device->getCapabilities().uboOffsetAlignment);
        bufferInfo.size = gpuBuffer->instanceSize * device->gpuDevice()->backBufferCount;
        allocInfo.flags = VMA_ALLOCATION_CREATE_MAPPED_BIT;
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_SRC_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT;
        */
        bufferInfo.usage |= VK_BUFFER_USAGE_TRANSFER_DST_BIT;
        allocInfo.usage = VMA_MEMORY_USAGE_CPU_TO_GPU;
    }

    VmaAllocationInfo res;
    VK_CHECK(vmaCreateBuffer(device->gpuDevice()->memoryAllocator, &bufferInfo, &allocInfo, &gpuBuffer->vkBuffer, &gpuBuffer->vmaAllocation, &res));
    //CC_LOG_DEBUG("Allocated buffer: %llu, %llx %llx %llu %x", res.size, gpuBuffer->vkBuffer, res.deviceMemory, res.offset, res.pMappedData);

    gpuBuffer->mappedData  = reinterpret_cast<uint8_t *>(res.pMappedData);
    gpuBuffer->startOffset = 0; // we are creating one VkBuffer each for now

    // add special access types directly from usage
    if (hasFlag(gpuBuffer->usage, BufferUsageBit::VERTEX)) gpuBuffer->renderAccessTypes.push_back(THSVS_ACCESS_VERTEX_BUFFER);
    if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDEX)) gpuBuffer->renderAccessTypes.push_back(THSVS_ACCESS_INDEX_BUFFER);
    if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDIRECT)) gpuBuffer->renderAccessTypes.push_back(THSVS_ACCESS_INDIRECT_BUFFER);
}

void cmdFuncCCVKCreateRenderPass(CCVKDevice *device, CCVKGPURenderPass *gpuRenderPass) {
    static vector<VkAttachmentDescription> attachmentDescriptions;
    static vector<VkSubpassDescription>    subpassDescriptions;
    static vector<VkAttachmentReference>   attachmentReferences;
    static vector<VkSubpassDependency>     subpassDependencies;
    static vector<ThsvsAccessType>         accessTypeCaches;

    const size_t colorAttachmentCount = gpuRenderPass->colorAttachments.size();
    const size_t hasDepth             = gpuRenderPass->depthStencilAttachment.format != Format::UNKNOWN ? 1 : 0;
    attachmentDescriptions.resize(colorAttachmentCount + hasDepth);
    gpuRenderPass->clearValues.resize(colorAttachmentCount + hasDepth);
    gpuRenderPass->beginAccesses.resize(colorAttachmentCount + hasDepth);
    gpuRenderPass->endAccesses.resize(colorAttachmentCount + hasDepth);

    // not using static storage so they can be captured in lambdas
    vector<CCVKAccessInfo> beginAccessInfos(colorAttachmentCount + hasDepth);
    vector<CCVKAccessInfo> endAccessInfos(colorAttachmentCount + hasDepth);

    for (size_t i = 0U; i < colorAttachmentCount; ++i) {
        const ColorAttachment &attachment = gpuRenderPass->colorAttachments[i];

        vector<ThsvsAccessType> &beginAccesses   = gpuRenderPass->beginAccesses[i];
        vector<ThsvsAccessType> &endAccesses     = gpuRenderPass->endAccesses[i];
        CCVKAccessInfo &         beginAccessInfo = beginAccessInfos[i];
        CCVKAccessInfo &         endAccessInfo   = endAccessInfos[i];

        for (AccessType type : attachment.beginAccesses) {
            beginAccesses.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
        }
        for (AccessType type : attachment.endAccesses) {
            endAccesses.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
        }
        thsvsGetAccessInfo(beginAccesses.size(), beginAccesses.data(), &beginAccessInfo.stageMask, &beginAccessInfo.accessMask, &beginAccessInfo.imageLayout, &beginAccessInfo.hasWriteAccess);
        thsvsGetAccessInfo(endAccesses.size(), endAccesses.data(), &endAccessInfo.stageMask, &endAccessInfo.accessMask, &endAccessInfo.imageLayout, &endAccessInfo.hasWriteAccess);

        attachmentDescriptions[i].format         = mapVkFormat(attachment.format);
        attachmentDescriptions[i].samples        = mapVkSampleCount(attachment.sampleCount);
        attachmentDescriptions[i].loadOp         = mapVkLoadOp(attachment.loadOp);
        attachmentDescriptions[i].storeOp        = mapVkStoreOp(attachment.storeOp);
        attachmentDescriptions[i].stencilLoadOp  = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
        attachmentDescriptions[i].stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
        attachmentDescriptions[i].initialLayout  = beginAccessInfo.imageLayout;
        attachmentDescriptions[i].finalLayout    = endAccessInfo.imageLayout;
    }
    if (hasDepth) {
        const DepthStencilAttachment &depthStencilAttachment = gpuRenderPass->depthStencilAttachment;

        vector<ThsvsAccessType> &beginAccesses   = gpuRenderPass->beginAccesses[colorAttachmentCount];
        vector<ThsvsAccessType> &endAccesses     = gpuRenderPass->endAccesses[colorAttachmentCount];
        CCVKAccessInfo &         beginAccessInfo = beginAccessInfos[colorAttachmentCount];
        CCVKAccessInfo &         endAccessInfo   = endAccessInfos[colorAttachmentCount];

        for (AccessType type : depthStencilAttachment.beginAccesses) {
            beginAccesses.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
        }
        for (AccessType type : depthStencilAttachment.endAccesses) {
            endAccesses.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
        }
        thsvsGetAccessInfo(beginAccesses.size(), beginAccesses.data(), &beginAccessInfo.stageMask, &beginAccessInfo.accessMask, &beginAccessInfo.imageLayout, &beginAccessInfo.hasWriteAccess);
        thsvsGetAccessInfo(endAccesses.size(), endAccesses.data(), &endAccessInfo.stageMask, &endAccessInfo.accessMask, &endAccessInfo.imageLayout, &endAccessInfo.hasWriteAccess);

        attachmentDescriptions[colorAttachmentCount].format         = mapVkFormat(depthStencilAttachment.format);
        attachmentDescriptions[colorAttachmentCount].samples        = mapVkSampleCount(depthStencilAttachment.sampleCount);
        attachmentDescriptions[colorAttachmentCount].loadOp         = mapVkLoadOp(depthStencilAttachment.depthLoadOp);
        attachmentDescriptions[colorAttachmentCount].storeOp        = mapVkStoreOp(depthStencilAttachment.depthStoreOp);
        attachmentDescriptions[colorAttachmentCount].stencilLoadOp  = mapVkLoadOp(depthStencilAttachment.stencilLoadOp);
        attachmentDescriptions[colorAttachmentCount].stencilStoreOp = mapVkStoreOp(depthStencilAttachment.stencilStoreOp);
        attachmentDescriptions[colorAttachmentCount].initialLayout  = beginAccessInfo.imageLayout;
        attachmentDescriptions[colorAttachmentCount].finalLayout    = endAccessInfo.imageLayout;
    }

    size_t subpassCount = gpuRenderPass->subpasses.size();
    attachmentReferences.clear();

    if (subpassCount) { // pass on user-specified subpasses
        for (auto &subpassInfo : gpuRenderPass->subpasses) {
            for (uint input : subpassInfo.inputs) {
                attachmentReferences.push_back({input, VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL});
            }
            for (uint color : subpassInfo.colors) {
                attachmentReferences.push_back({color, VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL});
            }
            for (uint resolve : subpassInfo.resolves) {
                attachmentReferences.push_back({resolve, VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL});
            }
            if (hasDepth && subpassInfo.depthStencil == INVALID_BINDING) {
                subpassInfo.depthStencil = static_cast<uint>(colorAttachmentCount);
            }
            attachmentReferences.push_back({subpassInfo.depthStencil, VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL});
        }

        uint offset{0U};
        subpassDescriptions.resize(subpassCount, {});
        for (uint i = 0U; i < gpuRenderPass->subpasses.size(); ++i) {
            const SubpassInfo subpassInfo = gpuRenderPass->subpasses[i];

            VkSubpassDescription &desc = subpassDescriptions[i];
            desc.pipelineBindPoint     = VK_PIPELINE_BIND_POINT_GRAPHICS;

            if (!subpassInfo.inputs.empty()) {
                desc.inputAttachmentCount = subpassInfo.inputs.size();
                desc.pInputAttachments    = attachmentReferences.data() + offset;
                offset += subpassInfo.inputs.size();
            }

            if (!subpassInfo.colors.empty()) {
                desc.colorAttachmentCount = subpassInfo.colors.size();
                desc.pColorAttachments    = attachmentReferences.data() + offset;
                offset += subpassInfo.colors.size();
                if (!subpassInfo.resolves.empty()) {
                    desc.pResolveAttachments = attachmentReferences.data() + offset;
                    offset += subpassInfo.resolves.size();
                }
            }

            if (!subpassInfo.preserves.empty()) {
                desc.preserveAttachmentCount = subpassInfo.preserves.size();
                desc.pPreserveAttachments    = subpassInfo.preserves.data();
            }

            if (subpassInfo.depthStencil != INVALID_BINDING) {
                desc.pDepthStencilAttachment = attachmentReferences.data() + offset++;
            }
        }
    } else { // generate a default subpass from attachment info
        subpassCount = 1U;
        subpassDescriptions.resize(subpassCount, {});
        for (size_t i = 0U; i < colorAttachmentCount; ++i) {
            attachmentReferences.push_back({static_cast<uint32_t>(i), VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL});
        }
        attachmentReferences.push_back({static_cast<uint32_t>(colorAttachmentCount), VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL});
        subpassDescriptions[0].pipelineBindPoint    = VK_PIPELINE_BIND_POINT_GRAPHICS;
        subpassDescriptions[0].colorAttachmentCount = attachmentReferences.size() - 1;
        subpassDescriptions[0].pColorAttachments    = attachmentReferences.data();
        if (hasDepth) subpassDescriptions[0].pDepthStencilAttachment = &attachmentReferences.back();
    }

    size_t dependencyCount = gpuRenderPass->dependencies.size();
    accessTypeCaches.clear();
    subpassDependencies.clear();

    if (dependencyCount) {
        for (const auto &dependency : gpuRenderPass->dependencies) {
            for (AccessType type : dependency.srcAccesses) {
                accessTypeCaches.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
            }
            for (AccessType type : dependency.dstAccesses) {
                accessTypeCaches.push_back(THSVS_ACCESS_TYPES[static_cast<uint>(type)]);
            }
        }

        uint          offset{0U};
        VkImageLayout imageLayout{VK_IMAGE_LAYOUT_UNDEFINED};
        bool          hasWriteAccess{false};

        for (uint i = 0U; i < dependencyCount; ++i) {
            const SubpassDependency &dependency   = gpuRenderPass->dependencies[i];
            VkSubpassDependency &    vkDependency = subpassDependencies.emplace_back();
            vkDependency.srcSubpass               = dependency.srcSubpass;
            vkDependency.dstSubpass               = dependency.dstSubpass;
            vkDependency.dependencyFlags          = VK_DEPENDENCY_BY_REGION_BIT;

            thsvsGetAccessInfo(
                dependency.srcAccesses.size(),
                accessTypeCaches.data() + offset,
                &vkDependency.srcStageMask,
                &vkDependency.srcAccessMask,
                &imageLayout, &hasWriteAccess);

            offset += dependency.srcAccesses.size();

            thsvsGetAccessInfo(
                dependency.dstAccesses.size(),
                accessTypeCaches.data() + offset,
                &vkDependency.dstStageMask,
                &vkDependency.dstAccessMask,
                &imageLayout, &hasWriteAccess);

            offset += dependency.dstAccesses.size();
        }
    } else {
        // explicitly declare external dependencies if needed

        // wait for resources to become available by the specified access types
        VkSubpassDependency beginDependency{VK_SUBPASS_EXTERNAL, 0, VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT};
        auto                beginDependencyCheck = [&beginDependency, &beginAccessInfos](const VkAttachmentReference &ref, VkPipelineStageFlags dstStage,
                                                                          VkPipelineStageFlags dstAccessRead, VkAccessFlags dstAccessWrite) {
            const VkAttachmentDescription &desc = attachmentDescriptions[ref.attachment];
            const CCVKAccessInfo &         info = beginAccessInfos[ref.attachment];
            if (desc.loadOp == VK_ATTACHMENT_LOAD_OP_DONT_CARE) return;
            if (desc.initialLayout != ref.layout || info.hasWriteAccess || desc.loadOp == VK_ATTACHMENT_LOAD_OP_CLEAR) {
                beginDependency.srcStageMask |= info.stageMask;
                beginDependency.dstStageMask |= dstStage;
                if (desc.initialLayout != ref.layout || info.hasWriteAccess) {
                    beginDependency.srcAccessMask |= info.hasWriteAccess ? info.accessMask : 0;
                    beginDependency.dstAccessMask |= (desc.loadOp == VK_ATTACHMENT_LOAD_OP_CLEAR ? dstAccessWrite : dstAccessRead);
                }
            }
        };
        VkSubpassDescription &firstSubpass = subpassDescriptions[0];
        for (size_t j = 0U; j < firstSubpass.colorAttachmentCount; ++j) {
            beginDependencyCheck(firstSubpass.pColorAttachments[j], VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
                                 VK_ACCESS_COLOR_ATTACHMENT_READ_BIT, VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT);
        }
        if (firstSubpass.pDepthStencilAttachment) {
            beginDependencyCheck(*firstSubpass.pDepthStencilAttachment, VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT,
                                 VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT, VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT);
        }
        if (beginDependency.srcStageMask != VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT) {
            subpassDependencies.push_back(beginDependency);
        }

        // make rendering result visible for the specified access types
        VkSubpassDependency endDependency{static_cast<uint>(subpassCount) - 1, VK_SUBPASS_EXTERNAL, VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT};
        auto                endDependencyCheck = [&endDependency, &endAccessInfos](const VkAttachmentReference &ref, VkPipelineStageFlags srcStage, VkAccessFlags srcAccess) {
            const VkAttachmentDescription &desc = attachmentDescriptions[ref.attachment];
            if (desc.storeOp == VK_ATTACHMENT_STORE_OP_STORE) {
                const CCVKAccessInfo &info = endAccessInfos[ref.attachment];
                endDependency.srcStageMask |= srcStage;
                endDependency.srcAccessMask |= srcAccess;
                endDependency.dstStageMask |= info.stageMask;
                endDependency.dstAccessMask |= info.accessMask;
            }
        };
        VkSubpassDescription &lastSubpass = subpassDescriptions[subpassCount - 1];
        for (size_t j = 0U; j < lastSubpass.colorAttachmentCount; ++j) {
            endDependencyCheck(lastSubpass.pColorAttachments[j], VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT);
        }
        if (lastSubpass.pDepthStencilAttachment) {
            endDependencyCheck(*lastSubpass.pDepthStencilAttachment, VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT, VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT);
        }
        if (endDependency.dstAccessMask) {
            subpassDependencies.push_back(endDependency);
        }
    }

    VkRenderPassCreateInfo renderPassCreateInfo{VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO};
    renderPassCreateInfo.attachmentCount = attachmentDescriptions.size();
    renderPassCreateInfo.pAttachments    = attachmentDescriptions.data();
    renderPassCreateInfo.subpassCount    = subpassDescriptions.size();
    renderPassCreateInfo.pSubpasses      = subpassDescriptions.data();
    renderPassCreateInfo.dependencyCount = subpassDependencies.size();
    renderPassCreateInfo.pDependencies   = subpassDependencies.data();

    VK_CHECK(vkCreateRenderPass(device->gpuDevice()->vkDevice, &renderPassCreateInfo, nullptr, &gpuRenderPass->vkRenderPass));
}

void cmdFuncCCVKCreateFramebuffer(CCVKDevice *device, CCVKGPUFramebuffer *gpuFramebuffer) {
    size_t              colorViewCount = gpuFramebuffer->gpuColorViews.size();
    bool                depthSpecified = gpuFramebuffer->gpuDepthStencilView;
    bool                hasDepth       = gpuFramebuffer->gpuRenderPass->depthStencilAttachment.format != Format::UNKNOWN;
    vector<VkImageView> attachments(colorViewCount + (depthSpecified || hasDepth ? 1 : 0));
    uint                swapchainImageIndices = 0;
    CCVKGPUTexture *    gpuTexture            = nullptr;
    for (size_t i = 0U; i < colorViewCount; ++i) {
        CCVKGPUTextureView *texView = gpuFramebuffer->gpuColorViews[i];
        if (texView) {
            gpuTexture     = gpuFramebuffer->gpuColorViews[i]->gpuTexture;
            attachments[i] = gpuFramebuffer->gpuColorViews[i]->vkImageView;
        } else {
            swapchainImageIndices |= (1 << i);
        }
    }
    if (depthSpecified) {
        gpuTexture                  = gpuFramebuffer->gpuDepthStencilView->gpuTexture;
        attachments[colorViewCount] = gpuFramebuffer->gpuDepthStencilView->vkImageView;
    } else if (hasDepth) {
        swapchainImageIndices |= (1 << colorViewCount);
    }
    gpuFramebuffer->isOffscreen = !swapchainImageIndices;

    if (gpuFramebuffer->isOffscreen) {
        VkFramebufferCreateInfo createInfo{VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO};
        createInfo.renderPass      = gpuFramebuffer->gpuRenderPass->vkRenderPass;
        createInfo.attachmentCount = attachments.size();
        createInfo.pAttachments    = attachments.data();
        createInfo.width           = gpuTexture ? gpuTexture->width : 1;
        createInfo.height          = gpuTexture ? gpuTexture->height : 1;
        createInfo.layers          = 1;
        VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuFramebuffer->vkFramebuffer));
    } else {
        // swapchain-related framebuffers need special treatments: rebuild is needed
        // whenever a user-specified attachment or swapchain itself is changed

        gpuFramebuffer->swapchain          = device->gpuSwapchain();
        FramebufferListMap &fboListMap     = gpuFramebuffer->swapchain->vkSwapchainFramebufferListMap;
        auto                fboListMapIter = fboListMap.find(gpuFramebuffer);
        if (fboListMapIter != fboListMap.end() && !fboListMapIter->second.empty()) {
            return;
        }
        size_t swapchainImageCount = gpuFramebuffer->swapchain->vkSwapchainImageViews.size();
        if (fboListMapIter != fboListMap.end()) {
            fboListMapIter->second.resize(swapchainImageCount);
        } else {
            fboListMap.emplace(std::piecewise_construct, std::forward_as_tuple(gpuFramebuffer), std::forward_as_tuple(swapchainImageCount));
        }
        VkFramebufferCreateInfo createInfo{VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO};
        createInfo.renderPass      = gpuFramebuffer->gpuRenderPass->vkRenderPass;
        createInfo.attachmentCount = attachments.size();
        createInfo.pAttachments    = attachments.data();
        createInfo.width           = device->getWidth();
        createInfo.height          = device->getHeight();
        createInfo.layers          = 1;
        for (size_t i = 0U; i < swapchainImageCount; ++i) {
            for (size_t j = 0U; j < colorViewCount; ++j) {
                if (swapchainImageIndices & (1 << j)) {
                    attachments[j] = gpuFramebuffer->swapchain->vkSwapchainImageViews[i];
                }
            }
            if (swapchainImageIndices & (1 << colorViewCount)) {
                attachments[colorViewCount] = gpuFramebuffer->swapchain->depthStencilImageViews[i];
            }
            VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &fboListMap[gpuFramebuffer][i]));
        }
    }
}

void cmdFuncCCVKCreateShader(CCVKDevice *device, CCVKGPUShader *gpuShader) {
    for (CCVKGPUShaderStage &stage : gpuShader->gpuStages) {
        vector<unsigned int>     spirv = GLSL2SPIRV(stage.type, "#version 450\n" + stage.source, device->gpuDevice()->minorVersion);
        VkShaderModuleCreateInfo createInfo{VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO};
        createInfo.codeSize = spirv.size() * sizeof(unsigned int);
        createInfo.pCode    = spirv.data();
        VK_CHECK(vkCreateShaderModule(device->gpuDevice()->vkDevice, &createInfo, nullptr, &stage.vkShader));
    }
    CC_LOG_INFO("Shader '%s' compilation succeeded.", gpuShader->name.c_str());
}

void cmdFuncCCVKCreateDescriptorSetLayout(CCVKDevice *device, CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout) {
    CCVKGPUDevice *gpuDevice    = device->gpuDevice();
    size_t         bindingCount = gpuDescriptorSetLayout->bindings.size();

    gpuDescriptorSetLayout->vkBindings.resize(bindingCount);
    for (size_t i = 0U; i < bindingCount; ++i) {
        const DescriptorSetLayoutBinding &binding   = gpuDescriptorSetLayout->bindings[i];
        VkDescriptorSetLayoutBinding &    vkBinding = gpuDescriptorSetLayout->vkBindings[i];
        vkBinding.stageFlags                        = mapVkShaderStageFlags(binding.stageFlags);
        vkBinding.descriptorType                    = mapVkDescriptorType(binding.descriptorType);
        vkBinding.binding                           = binding.binding;
        vkBinding.descriptorCount                   = binding.count;
    }

    VkDescriptorSetLayoutCreateInfo setCreateInfo{VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO};
    setCreateInfo.bindingCount = bindingCount;
    setCreateInfo.pBindings    = gpuDescriptorSetLayout->vkBindings.data();
    VK_CHECK(vkCreateDescriptorSetLayout(gpuDevice->vkDevice, &setCreateInfo, nullptr, &gpuDescriptorSetLayout->vkDescriptorSetLayout));

    CCVKGPUDescriptorSetPool *pool = gpuDevice->getDescriptorSetPool(gpuDescriptorSetLayout->id);
    pool->link(gpuDevice, gpuDescriptorSetLayout->maxSetsPerPool, gpuDescriptorSetLayout->vkBindings, gpuDescriptorSetLayout->vkDescriptorSetLayout);

    gpuDescriptorSetLayout->defaultDescriptorSet = pool->request(0);

    if (gpuDevice->useDescriptorUpdateTemplate && bindingCount) {
        const vector<VkDescriptorSetLayoutBinding> &bindings = gpuDescriptorSetLayout->vkBindings;

        vector<VkDescriptorUpdateTemplateEntry> entries(bindingCount);
        for (size_t j = 0U, k = 0U; j < bindingCount; ++j) {
            const VkDescriptorSetLayoutBinding &binding = bindings[j];
            if (binding.descriptorType != VK_DESCRIPTOR_TYPE_INLINE_UNIFORM_BLOCK_EXT) {
                entries[j].dstBinding      = binding.binding;
                entries[j].dstArrayElement = 0;
                entries[j].descriptorCount = binding.descriptorCount;
                entries[j].descriptorType  = binding.descriptorType;
                entries[j].offset          = sizeof(CCVKDescriptorInfo) * k;
                entries[j].stride          = sizeof(CCVKDescriptorInfo);
                k += binding.descriptorCount;
            } // TODO(YunHsiao): inline UBOs
        }

        VkDescriptorUpdateTemplateCreateInfo createInfo = {VK_STRUCTURE_TYPE_DESCRIPTOR_UPDATE_TEMPLATE_CREATE_INFO};
        createInfo.descriptorUpdateEntryCount           = bindingCount;
        createInfo.pDescriptorUpdateEntries             = entries.data();
        createInfo.templateType                         = VK_DESCRIPTOR_UPDATE_TEMPLATE_TYPE_DESCRIPTOR_SET;
        createInfo.descriptorSetLayout                  = gpuDescriptorSetLayout->vkDescriptorSetLayout;
        if (gpuDevice->minorVersion > 0) {
            VK_CHECK(vkCreateDescriptorUpdateTemplate(gpuDevice->vkDevice, &createInfo, nullptr, &gpuDescriptorSetLayout->vkDescriptorUpdateTemplate));
        } else {
            VK_CHECK(vkCreateDescriptorUpdateTemplateKHR(gpuDevice->vkDevice, &createInfo, nullptr, &gpuDescriptorSetLayout->vkDescriptorUpdateTemplate));
        }
    }
}

void cmdFuncCCVKCreatePipelineLayout(CCVKDevice *device, CCVKGPUPipelineLayout *gpuPipelineLayout) {
    CCVKGPUDevice *gpuDevice   = device->gpuDevice();
    size_t         layoutCount = gpuPipelineLayout->setLayouts.size();

    vector<VkDescriptorSetLayout> descriptorSetLayouts(layoutCount);
    for (uint i = 0; i < layoutCount; ++i) {
        descriptorSetLayouts[i] = gpuPipelineLayout->setLayouts[i]->vkDescriptorSetLayout;
    }

    VkPipelineLayoutCreateInfo pipelineLayoutCreateInfo{VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO};
    pipelineLayoutCreateInfo.setLayoutCount = layoutCount;
    pipelineLayoutCreateInfo.pSetLayouts    = descriptorSetLayouts.data();
    VK_CHECK(vkCreatePipelineLayout(gpuDevice->vkDevice, &pipelineLayoutCreateInfo, nullptr, &gpuPipelineLayout->vkPipelineLayout));
}

void cmdFuncCCVKCreateComputePipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState) {
    VkComputePipelineCreateInfo createInfo{VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO};

    ///////////////////// Shader Stage /////////////////////

    const CCVKGPUShaderStageList &  stages = gpuPipelineState->gpuShader->gpuStages;
    VkPipelineShaderStageCreateInfo stageInfo{VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO};
    stageInfo.stage  = mapVkShaderStageFlagBits(stages[0].type);
    stageInfo.module = stages[0].vkShader;
    stageInfo.pName  = "main";

    createInfo.stage  = stageInfo;
    createInfo.layout = gpuPipelineState->gpuPipelineLayout->vkPipelineLayout;

    ///////////////////// Creation /////////////////////

    VK_CHECK(vkCreateComputePipelines(device->gpuDevice()->vkDevice, device->gpuDevice()->vkPipelineCache,
                                      1, &createInfo, nullptr, &gpuPipelineState->vkPipeline));
}

void cmdFuncCCVKCreateGraphicsPipelineState(CCVKDevice *device, CCVKGPUPipelineState *gpuPipelineState) {
    VkGraphicsPipelineCreateInfo createInfo{VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO};

    ///////////////////// Shader Stage /////////////////////

    const CCVKGPUShaderStageList &          stages     = gpuPipelineState->gpuShader->gpuStages;
    const size_t                            stageCount = stages.size();
    vector<VkPipelineShaderStageCreateInfo> stageInfos(stageCount, {VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO});
    for (size_t i = 0U; i < stageCount; ++i) {
        stageInfos[i].stage  = mapVkShaderStageFlagBits(stages[i].type);
        stageInfos[i].module = stages[i].vkShader;
        stageInfos[i].pName  = "main";
    }
    createInfo.stageCount = stageCount;
    createInfo.pStages    = stageInfos.data();

    ///////////////////// Input State /////////////////////

    const AttributeList &attributes     = gpuPipelineState->inputState.attributes;
    const size_t         attributeCount = attributes.size();
    size_t               bindingCount   = 1U;
    for (size_t i = 0U; i < attributeCount; ++i) {
        const Attribute &attr = attributes[i];
        bindingCount          = std::max(bindingCount, static_cast<size_t>(attr.stream + 1));
    }

    vector<VkVertexInputBindingDescription> bindingDescriptions(bindingCount);
    for (size_t i = 0U; i < bindingCount; ++i) {
        bindingDescriptions[i].binding   = i;
        bindingDescriptions[i].stride    = 0;
        bindingDescriptions[i].inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
    }
    for (size_t i = 0U; i < attributeCount; ++i) {
        const Attribute &attr = attributes[i];
        bindingDescriptions[attr.stream].stride += GFX_FORMAT_INFOS[static_cast<uint>(attr.format)].size;
        if (attr.isInstanced) {
            bindingDescriptions[attr.stream].inputRate = VK_VERTEX_INPUT_RATE_INSTANCE;
        }
    }

    const AttributeList &                     shaderAttrs     = gpuPipelineState->gpuShader->attributes;
    const size_t                              shaderAttrCount = shaderAttrs.size();
    vector<VkVertexInputAttributeDescription> attributeDescriptions(shaderAttrCount);
    vector<uint>                              offsets(bindingCount, 0);

    for (size_t i = 0; i < shaderAttrCount; ++i) {
        bool attributeFound = false;
        offsets.assign(bindingCount, 0);
        for (const Attribute &attr : attributes) {
            if (shaderAttrs[i].name == attr.name) {
                attributeDescriptions[i].location = shaderAttrs[i].location;
                attributeDescriptions[i].binding  = attr.stream;
                attributeDescriptions[i].format   = mapVkFormat(attr.format);
                attributeDescriptions[i].offset   = offsets[attr.stream];
                attributeFound                    = true;
                break;
            }
            offsets[attr.stream] += GFX_FORMAT_INFOS[static_cast<uint>(attr.format)].size;
        }
        if (!attributeFound) { // handle absent attribute
            attributeDescriptions[i].location = shaderAttrs[i].location;
            attributeDescriptions[i].binding  = 0;
            attributeDescriptions[i].format   = mapVkFormat(shaderAttrs[i].format);
            attributeDescriptions[i].offset   = 0; // reuse the first attribute as dummy data
        }
    }

    VkPipelineVertexInputStateCreateInfo vertexInput{VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO};
    vertexInput.vertexBindingDescriptionCount   = bindingCount;
    vertexInput.pVertexBindingDescriptions      = bindingDescriptions.data();
    vertexInput.vertexAttributeDescriptionCount = shaderAttrCount;
    vertexInput.pVertexAttributeDescriptions    = attributeDescriptions.data();
    createInfo.pVertexInputState                = &vertexInput;

    ///////////////////// Input Asembly State /////////////////////

    VkPipelineInputAssemblyStateCreateInfo inputAssembly{VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO};
    inputAssembly.topology         = VK_PRIMITIVE_MODES[static_cast<uint>(gpuPipelineState->primitive)];
    createInfo.pInputAssemblyState = &inputAssembly;

    ///////////////////// Dynamic State /////////////////////

    vector<VkDynamicState> dynamicStates{VK_DYNAMIC_STATE_VIEWPORT, VK_DYNAMIC_STATE_SCISSOR};
    insertVkDynamicStates(&dynamicStates, gpuPipelineState->dynamicStates);

    VkPipelineDynamicStateCreateInfo dynamicState{VK_STRUCTURE_TYPE_PIPELINE_DYNAMIC_STATE_CREATE_INFO};
    dynamicState.dynamicStateCount = dynamicStates.size();
    dynamicState.pDynamicStates    = dynamicStates.data();
    createInfo.pDynamicState       = &dynamicState;

    ///////////////////// Viewport State /////////////////////

    VkPipelineViewportStateCreateInfo viewportState{VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO};
    viewportState.viewportCount = 1; // dynamic by default
    viewportState.scissorCount  = 1; // dynamic by default
    createInfo.pViewportState   = &viewportState;

    ///////////////////// Rasterization State /////////////////////

    VkPipelineRasterizationStateCreateInfo rasterizationState{VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO};

    //rasterizationState.depthClampEnable;
    rasterizationState.rasterizerDiscardEnable = gpuPipelineState->rs.isDiscard;
    rasterizationState.polygonMode             = VK_POLYGON_MODES[static_cast<uint>(gpuPipelineState->rs.polygonMode)];
    rasterizationState.cullMode                = VK_CULL_MODES[static_cast<uint>(gpuPipelineState->rs.cullMode)];
    rasterizationState.frontFace               = gpuPipelineState->rs.isFrontFaceCCW ? VK_FRONT_FACE_COUNTER_CLOCKWISE : VK_FRONT_FACE_CLOCKWISE;
    rasterizationState.depthBiasEnable         = gpuPipelineState->rs.depthBiasEnabled;
    rasterizationState.depthBiasConstantFactor = gpuPipelineState->rs.depthBias;
    rasterizationState.depthBiasClamp          = gpuPipelineState->rs.depthBiasClamp;
    rasterizationState.depthBiasSlopeFactor    = gpuPipelineState->rs.depthBiasSlop;
    rasterizationState.lineWidth               = gpuPipelineState->rs.lineWidth;
    createInfo.pRasterizationState             = &rasterizationState;

    ///////////////////// Multisample State /////////////////////

    VkPipelineMultisampleStateCreateInfo multisampleState{VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO};
    multisampleState.rasterizationSamples  = VK_SAMPLE_COUNT_1_BIT;
    multisampleState.alphaToCoverageEnable = gpuPipelineState->bs.isA2C;
    //multisampleState.sampleShadingEnable;
    //multisampleState.minSampleShading;
    //multisampleState.pSampleMask;
    //multisampleState.alphaToOneEnable;
    createInfo.pMultisampleState = &multisampleState;

    ///////////////////// Depth Stencil State /////////////////////

    VkPipelineDepthStencilStateCreateInfo depthStencilState = {VK_STRUCTURE_TYPE_PIPELINE_DEPTH_STENCIL_STATE_CREATE_INFO};
    depthStencilState.depthTestEnable                       = gpuPipelineState->dss.depthTest;
    depthStencilState.depthWriteEnable                      = gpuPipelineState->dss.depthWrite;
    depthStencilState.depthCompareOp                        = VK_CMP_FUNCS[static_cast<uint>(gpuPipelineState->dss.depthFunc)];
    depthStencilState.stencilTestEnable                     = gpuPipelineState->dss.stencilTestFront;

    depthStencilState.front = {
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilFailOpFront)],
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilPassOpFront)],
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilZFailOpFront)],
        VK_CMP_FUNCS[static_cast<uint>(gpuPipelineState->dss.stencilFuncFront)],
        gpuPipelineState->dss.stencilReadMaskFront,
        gpuPipelineState->dss.stencilWriteMaskFront,
        gpuPipelineState->dss.stencilRefFront,
    };
    depthStencilState.back = {
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilFailOpBack)],
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilPassOpBack)],
        VK_STENCIL_OPS[static_cast<uint>(gpuPipelineState->dss.stencilZFailOpBack)],
        VK_CMP_FUNCS[static_cast<uint>(gpuPipelineState->dss.stencilFuncBack)],
        gpuPipelineState->dss.stencilReadMaskBack,
        gpuPipelineState->dss.stencilWriteMaskBack,
        gpuPipelineState->dss.stencilRefBack,
    };
    //depthStencilState.depthBoundsTestEnable;
    //depthStencilState.minDepthBounds;
    //depthStencilState.maxDepthBounds;
    createInfo.pDepthStencilState = &depthStencilState;

    ///////////////////// Blend State /////////////////////

    size_t                                      blendTargetCount = gpuPipelineState->bs.targets.size();
    vector<VkPipelineColorBlendAttachmentState> blendTargets(blendTargetCount);
    for (size_t i = 0U; i < blendTargetCount; ++i) {
        BlendTarget &target                 = gpuPipelineState->bs.targets[i];
        blendTargets[i].blendEnable         = target.blend;
        blendTargets[i].srcColorBlendFactor = VK_BLEND_FACTORS[static_cast<uint>(target.blendSrc)];
        blendTargets[i].dstColorBlendFactor = VK_BLEND_FACTORS[static_cast<uint>(target.blendDst)];
        blendTargets[i].colorBlendOp        = VK_BLEND_OPS[static_cast<uint>(target.blendEq)];
        blendTargets[i].srcAlphaBlendFactor = VK_BLEND_FACTORS[static_cast<uint>(target.blendSrcAlpha)];
        blendTargets[i].dstAlphaBlendFactor = VK_BLEND_FACTORS[static_cast<uint>(target.blendDstAlpha)];
        blendTargets[i].alphaBlendOp        = VK_BLEND_OPS[static_cast<uint>(target.blendAlphaEq)];
        blendTargets[i].colorWriteMask      = mapVkColorComponentFlags(target.blendColorMask);
    }
    Color &blendColor = gpuPipelineState->bs.blendColor;

    VkPipelineColorBlendStateCreateInfo colorBlendState{VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO};
    //colorBlendState.logicOpEnable;
    //colorBlendState.logicOp;
    colorBlendState.attachmentCount   = blendTargetCount;
    colorBlendState.pAttachments      = blendTargets.data();
    colorBlendState.blendConstants[0] = blendColor.x;
    colorBlendState.blendConstants[1] = blendColor.y;
    colorBlendState.blendConstants[2] = blendColor.z;
    colorBlendState.blendConstants[3] = blendColor.w;
    createInfo.pColorBlendState       = &colorBlendState;

    ///////////////////// References /////////////////////

    createInfo.layout     = gpuPipelineState->gpuPipelineLayout->vkPipelineLayout;
    createInfo.renderPass = gpuPipelineState->gpuRenderPass->vkRenderPass;
    createInfo.subpass    = gpuPipelineState->subpass;

    ///////////////////// Creation /////////////////////

    VK_CHECK(vkCreateGraphicsPipelines(device->gpuDevice()->vkDevice, device->gpuDevice()->vkPipelineCache,
                                       1, &createInfo, nullptr, &gpuPipelineState->vkPipeline));
}

void cmdFuncCCVKUpdateBuffer(CCVKDevice *device, CCVKGPUBuffer *gpuBuffer, const void *buffer, uint size, const CCVKGPUCommandBuffer *cmdBuffer) {
    if (!gpuBuffer) return;

    const void *dataToUpload = nullptr;
    size_t      sizeToUpload = 0U;

    if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDIRECT)) {
        size_t      drawInfoCount = size / sizeof(DrawInfo);
        const auto *drawInfo      = static_cast<const DrawInfo *>(buffer);
        if (drawInfoCount > 0) {
            if (drawInfo->indexCount) {
                for (size_t i = 0; i < drawInfoCount; ++i) {
                    gpuBuffer->indexedIndirectCmds[i].indexCount    = drawInfo->indexCount;
                    gpuBuffer->indexedIndirectCmds[i].instanceCount = std::max(drawInfo->instanceCount, 1U);
                    gpuBuffer->indexedIndirectCmds[i].firstIndex    = drawInfo->firstIndex;
                    gpuBuffer->indexedIndirectCmds[i].vertexOffset  = drawInfo->vertexOffset;
                    gpuBuffer->indexedIndirectCmds[i].firstInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                dataToUpload                     = gpuBuffer->indexedIndirectCmds.data();
                sizeToUpload                     = drawInfoCount * sizeof(VkDrawIndexedIndirectCommand);
                gpuBuffer->isDrawIndirectByIndex = true;
            } else {
                for (size_t i = 0; i < drawInfoCount; ++i) {
                    gpuBuffer->indirectCmds[i].vertexCount   = drawInfo->vertexCount;
                    gpuBuffer->indirectCmds[i].instanceCount = drawInfo->instanceCount;
                    gpuBuffer->indirectCmds[i].firstVertex   = drawInfo->firstVertex;
                    gpuBuffer->indirectCmds[i].firstInstance = drawInfo->firstInstance;
                    drawInfo++;
                }
                dataToUpload                     = gpuBuffer->indirectCmds.data();
                sizeToUpload                     = drawInfoCount * sizeof(VkDrawIndirectCommand);
                gpuBuffer->isDrawIndirectByIndex = false;
            }
        }
    } else {
        dataToUpload = buffer;
        sizeToUpload = size;
    }

    // back buffer instances update command
    if (!cmdBuffer && gpuBuffer->instanceSize) {
        device->gpuBufferHub()->record(gpuBuffer, dataToUpload, sizeToUpload);
        return;
    }

    CCVKGPUBuffer stagingBuffer;
    stagingBuffer.size = sizeToUpload;
    device->gpuStagingBufferPool()->alloc(&stagingBuffer);
    memcpy(stagingBuffer.mappedData, dataToUpload, sizeToUpload);

    VkBufferCopy region{stagingBuffer.startOffset, gpuBuffer->startOffset, sizeToUpload};
    auto         upload = [&stagingBuffer, &gpuBuffer, &region](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
#if BARRIER_DEDUCTION_LEVEL >= BARRIER_DEDUCTION_LEVEL_BASIC
        if (gpuBuffer->transferAccess) {
            // guard against WAW hazard
            VkMemoryBarrier vkBarrier{VK_STRUCTURE_TYPE_MEMORY_BARRIER};
            vkBarrier.srcAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;
            vkBarrier.dstAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer,
                                 VK_PIPELINE_STAGE_TRANSFER_BIT,
                                 VK_PIPELINE_STAGE_TRANSFER_BIT,
                                 0, 1, &vkBarrier, 0, nullptr, 0, nullptr);
        }
#endif
        vkCmdCopyBuffer(gpuCommandBuffer->vkCommandBuffer, stagingBuffer.vkBuffer, gpuBuffer->vkBuffer, 1, &region);
    };

    if (cmdBuffer) {
        upload(cmdBuffer);
    } else {
        device->gpuTransportHub()->checkIn(upload);
    }

    gpuBuffer->transferAccess = THSVS_ACCESS_TRANSFER_WRITE;
    device->gpuBarrierManager()->checkIn(gpuBuffer);
}

void cmdFuncCCVKCopyBuffersToTexture(CCVKDevice *device, const uint8_t *const *buffers, CCVKGPUTexture *gpuTexture,
                                     const BufferTextureCopy *regions, uint count, const CCVKGPUCommandBuffer *gpuCommandBuffer) {
    vector<ThsvsAccessType> &curTypes = gpuTexture->currentAccessTypes;

    ThsvsImageBarrier barrier{};
    barrier.image                       = gpuTexture->vkImage;
    barrier.discardContents             = false;
    barrier.srcQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.dstQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    barrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    barrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    barrier.subresourceRange.aspectMask = gpuTexture->aspectMask;
    barrier.prevAccessCount             = curTypes.size();
    barrier.pPrevAccesses               = curTypes.data();
    barrier.nextAccessCount             = 1;
    barrier.pNextAccesses               = &THSVS_ACCESS_TYPES[static_cast<uint>(AccessType::TRANSFER_WRITE)];

    if (gpuTexture->transferAccess != THSVS_ACCESS_TRANSFER_WRITE) {
        cmdFuncCCVKImageMemoryBarrier(gpuCommandBuffer, barrier);
    } else {
        // guard against WAW hazard
        VkMemoryBarrier vkBarrier{VK_STRUCTURE_TYPE_MEMORY_BARRIER};
        vkBarrier.srcAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;
        vkBarrier.dstAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;
        vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_TRANSFER_BIT,
                             VK_PIPELINE_STAGE_TRANSFER_BIT,
                             0, 1, &vkBarrier, 0, nullptr, 0, nullptr);
    }

    uint         totalSize = 0U;
    vector<uint> regionSizes(count);
    for (size_t i = 0U; i < count; ++i) {
        const BufferTextureCopy &region = regions[i];
        uint                     w      = region.buffStride > 0 ? region.buffStride : region.texExtent.width;
        uint                     h      = region.buffTexHeight > 0 ? region.buffTexHeight : region.texExtent.height;
        totalSize += regionSizes[i]     = formatSize(gpuTexture->format, w, h, region.texExtent.depth);
    }

    CCVKGPUBuffer stagingBuffer;
    stagingBuffer.size = totalSize;
    uint texelSize     = GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)].size;
    device->gpuStagingBufferPool()->alloc(&stagingBuffer, texelSize);

    vector<VkBufferImageCopy> stagingRegions(count);
    VkDeviceSize              offset = 0;
    for (size_t i = 0U; i < count; ++i) {
        const BufferTextureCopy &region        = regions[i];
        VkBufferImageCopy &      stagingRegion = stagingRegions[i];
        stagingRegion.bufferOffset             = stagingBuffer.startOffset + offset;
        stagingRegion.bufferRowLength          = region.buffStride;
        stagingRegion.bufferImageHeight        = region.buffTexHeight;
        stagingRegion.imageSubresource         = {gpuTexture->aspectMask, region.texSubres.mipLevel, region.texSubres.baseArrayLayer, region.texSubres.layerCount};
        stagingRegion.imageOffset              = {region.texOffset.x, region.texOffset.y, region.texOffset.z};
        stagingRegion.imageExtent              = {region.texExtent.width, region.texExtent.height, region.texExtent.depth};

        memcpy(stagingBuffer.mappedData + offset, buffers[i], regionSizes[i]);
        offset += regionSizes[i];
    }

    vkCmdCopyBufferToImage(gpuCommandBuffer->vkCommandBuffer, stagingBuffer.vkBuffer, gpuTexture->vkImage,
                           VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL, stagingRegions.size(), stagingRegions.data());

    if (hasFlag(gpuTexture->flags, TextureFlags::GEN_MIPMAP)) {
        VkFormatProperties formatProperties;
        vkGetPhysicalDeviceFormatProperties(device->gpuContext()->physicalDevice, mapVkFormat(gpuTexture->format), &formatProperties);
        VkFormatFeatureFlags mipmapFeatures = VK_FORMAT_FEATURE_BLIT_SRC_BIT | VK_FORMAT_FEATURE_BLIT_DST_BIT | VK_FORMAT_FEATURE_SAMPLED_IMAGE_FILTER_LINEAR_BIT;

        if (formatProperties.optimalTilingFeatures & mipmapFeatures) {
            const int32_t width  = gpuTexture->width;
            const int32_t height = gpuTexture->height;

            VkImageBlit blitInfo{};
            blitInfo.srcSubresource.aspectMask  = gpuTexture->aspectMask;
            blitInfo.srcSubresource.layerCount  = gpuTexture->arrayLayers;
            blitInfo.dstSubresource.aspectMask  = gpuTexture->aspectMask;
            blitInfo.dstSubresource.layerCount  = gpuTexture->arrayLayers;
            blitInfo.srcOffsets[1]              = {width, height, 1};
            blitInfo.dstOffsets[1]              = {std::max(width >> 1, 1), std::max(height >> 1, 1), 1};
            barrier.subresourceRange.levelCount = 1;
            barrier.prevAccessCount             = 1;
            barrier.pPrevAccesses               = &THSVS_ACCESS_TYPES[static_cast<uint>(AccessType::TRANSFER_WRITE)];
            barrier.pNextAccesses               = &THSVS_ACCESS_TYPES[static_cast<uint>(AccessType::TRANSFER_READ)];

            for (uint i = 1U; i < gpuTexture->mipLevels; ++i) {
                barrier.subresourceRange.baseMipLevel = i - 1;
                cmdFuncCCVKImageMemoryBarrier(gpuCommandBuffer, barrier);

                blitInfo.srcSubresource.mipLevel = i - 1;
                blitInfo.dstSubresource.mipLevel = i;
                vkCmdBlitImage(gpuCommandBuffer->vkCommandBuffer, gpuTexture->vkImage, VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL,
                               gpuTexture->vkImage, VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL, 1, &blitInfo, VK_FILTER_LINEAR);

                const int32_t w = blitInfo.srcOffsets[1].x = blitInfo.dstOffsets[1].x;
                const int32_t h = blitInfo.srcOffsets[1].y = blitInfo.dstOffsets[1].y;
                blitInfo.dstOffsets[1].x                   = std::max(w >> 1, 1);
                blitInfo.dstOffsets[1].y                   = std::max(h >> 1, 1);
            }

            barrier.subresourceRange.baseMipLevel = 0;
            barrier.subresourceRange.levelCount   = gpuTexture->mipLevels - 1;
            barrier.pPrevAccesses                 = &THSVS_ACCESS_TYPES[static_cast<uint>(AccessType::TRANSFER_READ)];
            barrier.pNextAccesses                 = &THSVS_ACCESS_TYPES[static_cast<uint>(AccessType::TRANSFER_WRITE)];

            cmdFuncCCVKImageMemoryBarrier(gpuCommandBuffer, barrier);
        } else {
            const char *formatName = GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)].name.c_str();
            CC_LOG_WARNING("cmdFuncCCVKCopyBuffersToTexture: generate mipmap for %s is not supported on this platform", formatName);
        }
    }

    curTypes.assign({THSVS_ACCESS_TRANSFER_WRITE});
    gpuTexture->transferAccess = THSVS_ACCESS_TRANSFER_WRITE;
    device->gpuBarrierManager()->checkIn(gpuTexture);
}

void cmdFuncCCVKDestroyRenderPass(CCVKGPUDevice *gpuDevice, CCVKGPURenderPass *gpuRenderPass) {
    if (gpuRenderPass->vkRenderPass != VK_NULL_HANDLE) {
        vkDestroyRenderPass(gpuDevice->vkDevice, gpuRenderPass->vkRenderPass, nullptr);
        gpuRenderPass->vkRenderPass = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKDestroySampler(CCVKGPUDevice *gpuDevice, CCVKGPUSampler *gpuSampler) {
    if (gpuSampler->vkSampler != VK_NULL_HANDLE) {
        vkDestroySampler(gpuDevice->vkDevice, gpuSampler->vkSampler, nullptr);
        gpuSampler->vkSampler = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKDestroyShader(CCVKGPUDevice *gpuDevice, CCVKGPUShader *gpuShader) {
    for (CCVKGPUShaderStage &stage : gpuShader->gpuStages) {
        vkDestroyShaderModule(gpuDevice->vkDevice, stage.vkShader, nullptr);
        stage.vkShader = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKDestroyFramebuffer(CCVKGPUDevice *gpuDevice, CCVKGPUFramebuffer *gpuFramebuffer) {
    if (gpuFramebuffer->isOffscreen) {
        if (gpuFramebuffer->vkFramebuffer != VK_NULL_HANDLE) {
            vkDestroyFramebuffer(gpuDevice->vkDevice, gpuFramebuffer->vkFramebuffer, nullptr);
            gpuFramebuffer->vkFramebuffer = VK_NULL_HANDLE;
        }
    } else {
        FramebufferListMap &fboListMap     = gpuFramebuffer->swapchain->vkSwapchainFramebufferListMap;
        auto                fboListMapIter = fboListMap.find(gpuFramebuffer);
        if (fboListMapIter != fboListMap.end()) {
            for (auto &i : fboListMapIter->second) {
                vkDestroyFramebuffer(gpuDevice->vkDevice, i, nullptr);
            }
            fboListMapIter->second.clear();
            fboListMap.erase(fboListMapIter);
        }
    }
}

void cmdFuncCCVKDestroyDescriptorSetLayout(CCVKGPUDevice *gpuDevice, CCVKGPUDescriptorSetLayout *gpuDescriptorSetLayout) {
    if (gpuDescriptorSetLayout->defaultDescriptorSet != VK_NULL_HANDLE) {
        gpuDevice->getDescriptorSetPool(gpuDescriptorSetLayout->id)->yield(gpuDescriptorSetLayout->defaultDescriptorSet, 0);
        gpuDescriptorSetLayout->defaultDescriptorSet = VK_NULL_HANDLE;
    }

    if (gpuDescriptorSetLayout->vkDescriptorUpdateTemplate != VK_NULL_HANDLE) {
        if (gpuDevice->minorVersion > 0) {
            vkDestroyDescriptorUpdateTemplate(gpuDevice->vkDevice, gpuDescriptorSetLayout->vkDescriptorUpdateTemplate, nullptr);
        } else {
            vkDestroyDescriptorUpdateTemplateKHR(gpuDevice->vkDevice, gpuDescriptorSetLayout->vkDescriptorUpdateTemplate, nullptr);
        }
        gpuDescriptorSetLayout->vkDescriptorUpdateTemplate = VK_NULL_HANDLE;
    }

    if (gpuDescriptorSetLayout->vkDescriptorSetLayout != VK_NULL_HANDLE) {
        vkDestroyDescriptorSetLayout(gpuDevice->vkDevice, gpuDescriptorSetLayout->vkDescriptorSetLayout, nullptr);
        gpuDescriptorSetLayout->vkDescriptorSetLayout = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKDestroyPipelineLayout(CCVKGPUDevice *gpuDevice, CCVKGPUPipelineLayout *gpuPipelineLayout) {
    if (gpuPipelineLayout->vkPipelineLayout != VK_NULL_HANDLE) {
        vkDestroyPipelineLayout(gpuDevice->vkDevice, gpuPipelineLayout->vkPipelineLayout, nullptr);
        gpuPipelineLayout->vkPipelineLayout = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKDestroyPipelineState(CCVKGPUDevice *gpuDevice, CCVKGPUPipelineState *gpuPipelineState) {
    if (gpuPipelineState->vkPipeline != VK_NULL_HANDLE) {
        vkDestroyPipeline(gpuDevice->vkDevice, gpuPipelineState->vkPipeline, nullptr);
        gpuPipelineState->vkPipeline = VK_NULL_HANDLE;
    }
}

void cmdFuncCCVKImageMemoryBarrier(const CCVKGPUCommandBuffer *gpuCommandBuffer, const ThsvsImageBarrier &imageBarrier) {
    VkPipelineStageFlags srcStageMask     = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags dstStageMask     = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    VkPipelineStageFlags tempSrcStageMask = 0;
    VkPipelineStageFlags tempDstStageMask = 0;
    VkImageMemoryBarrier vkBarrier;
    thsvsGetVulkanImageMemoryBarrier(imageBarrier, &tempSrcStageMask, &tempDstStageMask, &vkBarrier);
    srcStageMask |= tempSrcStageMask;
    dstStageMask |= tempDstStageMask;
    vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0, 0, nullptr, 0, nullptr, 1, &vkBarrier);
}

void CCVKGPURecycleBin::clear() {
    for (uint i = 0U; i < _count; ++i) {
        Resource &res = _resources[i];
        switch (res.type) {
            case RecycledType::BUFFER:
                if (res.buffer.vkBuffer) {
                    vmaDestroyBuffer(_device->memoryAllocator, res.buffer.vkBuffer, res.buffer.vmaAllocation);
                    res.buffer.vkBuffer      = VK_NULL_HANDLE;
                    res.buffer.vmaAllocation = VK_NULL_HANDLE;
                }
                break;
            case RecycledType::TEXTURE:
                if (res.image.vkImage) {
                    vmaDestroyImage(_device->memoryAllocator, res.image.vkImage, res.image.vmaAllocation);
                    res.image.vkImage       = VK_NULL_HANDLE;
                    res.image.vmaAllocation = VK_NULL_HANDLE;
                }
                break;
            case RecycledType::TEXTURE_VIEW:
                if (res.vkImageView) {
                    vkDestroyImageView(_device->vkDevice, res.vkImageView, nullptr);
                    res.vkImageView = VK_NULL_HANDLE;
                }
                break;
            case RecycledType::RENDER_PASS:
                if (res.gpuRenderPass) {
                    cmdFuncCCVKDestroyRenderPass(_device, res.gpuRenderPass);
                    CC_DELETE(res.gpuRenderPass);
                    res.gpuRenderPass = nullptr;
                }
                break;
            case RecycledType::FRAMEBUFFER:
                if (res.gpuFramebuffer) {
                    cmdFuncCCVKDestroyFramebuffer(_device, res.gpuFramebuffer);
                    CC_DELETE(res.gpuFramebuffer);
                    res.gpuFramebuffer = nullptr;
                }
                break;
            case RecycledType::SAMPLER:
                if (res.gpuSampler) {
                    cmdFuncCCVKDestroySampler(_device, res.gpuSampler);
                    CC_DELETE(res.gpuSampler);
                    res.gpuSampler = nullptr;
                }
                break;
            case RecycledType::SHADER:
                if (res.gpuShader) {
                    cmdFuncCCVKDestroyShader(_device, res.gpuShader);
                    CC_DELETE(res.gpuShader);
                    res.gpuShader = nullptr;
                }
                break;
            case RecycledType::DESCRIPTOR_SET_LAYOUT:
                if (res.gpuDescriptorSetLayout) {
                    cmdFuncCCVKDestroyDescriptorSetLayout(_device, res.gpuDescriptorSetLayout);
                    CC_DELETE(res.gpuDescriptorSetLayout);
                    res.gpuDescriptorSetLayout = nullptr;
                }
                break;
            case RecycledType::PIPELINE_LAYOUT:
                if (res.gpuPipelineLayout) {
                    cmdFuncCCVKDestroyPipelineLayout(_device, res.gpuPipelineLayout);
                    CC_DELETE(res.gpuPipelineLayout);
                    res.gpuPipelineLayout = nullptr;
                }
                break;
            case RecycledType::PIPELINE_STATE:
                if (res.gpuPipelineState) {
                    cmdFuncCCVKDestroyPipelineState(_device, res.gpuPipelineState);
                    CC_DELETE(res.gpuPipelineState);
                    res.gpuPipelineState = nullptr;
                }
                break;
            default: break;
        }
        res.type = RecycledType::UNKNOWN;
    }
    _count = 0;
}

void CCVKGPUBarrierManager::update(CCVKGPUTransportHub *transportHub) {
    if (_buffersToBeChecked.empty() && _texturesToBeChecked.empty()) return;

    static vector<ThsvsAccessType>      prevAccesses;
    static vector<ThsvsAccessType>      nextAccesses;
    static vector<VkImageMemoryBarrier> vkImageBarriers;
    VkPipelineStageFlags                srcStageMask = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags                dstStageMask = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    vkImageBarriers.clear();
    prevAccesses.clear();
    nextAccesses.clear();

    for (CCVKGPUBuffer *gpuBuffer : _buffersToBeChecked) {
        vector<ThsvsAccessType> &render = gpuBuffer->renderAccessTypes;
        if (gpuBuffer->transferAccess == THSVS_ACCESS_NONE) continue;
        if (std::find(prevAccesses.begin(), prevAccesses.end(), gpuBuffer->transferAccess) == prevAccesses.end()) {
            prevAccesses.push_back(gpuBuffer->transferAccess);
        }
        nextAccesses.insert(nextAccesses.end(), render.begin(), render.end());
        gpuBuffer->transferAccess = THSVS_ACCESS_NONE;
    }

    VkMemoryBarrier  vkBarrier;
    VkMemoryBarrier *pVkBarrier = nullptr;
    if (!prevAccesses.empty()) {
        ThsvsGlobalBarrier globalBarrier{};
        globalBarrier.prevAccessCount         = prevAccesses.size();
        globalBarrier.pPrevAccesses           = prevAccesses.data();
        globalBarrier.nextAccessCount         = nextAccesses.size();
        globalBarrier.pNextAccesses           = nextAccesses.data();
        VkPipelineStageFlags tempSrcStageMask = 0;
        VkPipelineStageFlags tempDstStageMask = 0;
        thsvsGetVulkanMemoryBarrier(globalBarrier, &tempSrcStageMask, &tempDstStageMask, &vkBarrier);
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;
        pVkBarrier = &vkBarrier;
    }

    ThsvsImageBarrier imageBarrier{};
    imageBarrier.discardContents             = false;
    imageBarrier.prevLayout                  = THSVS_IMAGE_LAYOUT_OPTIMAL;
    imageBarrier.nextLayout                  = THSVS_IMAGE_LAYOUT_OPTIMAL;
    imageBarrier.srcQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    imageBarrier.dstQueueFamilyIndex         = VK_QUEUE_FAMILY_IGNORED;
    imageBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    imageBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    imageBarrier.prevAccessCount             = 1;

    for (CCVKGPUTexture *gpuTexture : _texturesToBeChecked) {
        vector<ThsvsAccessType> &render = gpuTexture->renderAccessTypes;
        if (gpuTexture->transferAccess == THSVS_ACCESS_NONE || render.empty()) continue;
        vector<ThsvsAccessType> &current         = gpuTexture->currentAccessTypes;
        imageBarrier.pPrevAccesses               = &gpuTexture->transferAccess;
        imageBarrier.nextAccessCount             = render.size();
        imageBarrier.pNextAccesses               = render.data();
        imageBarrier.image                       = gpuTexture->vkImage;
        imageBarrier.subresourceRange.aspectMask = gpuTexture->aspectMask;

        vkImageBarriers.emplace_back();
        VkPipelineStageFlags tempSrcStageMask = 0;
        VkPipelineStageFlags tempDstStageMask = 0;
        thsvsGetVulkanImageMemoryBarrier(imageBarrier, &tempSrcStageMask, &tempDstStageMask, &vkImageBarriers.back());
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;

        // don't override any other access changes since this barrier always happens first
        if (current.size() == 1 && current[0] == gpuTexture->transferAccess) {
            current = render;
        }
        gpuTexture->transferAccess = THSVS_ACCESS_NONE;
    }

    if (pVkBarrier || !vkImageBarriers.empty()) {
        transportHub->checkIn([&](CCVKGPUCommandBuffer *gpuCommandBuffer) {
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0,
                                 pVkBarrier ? 1 : 0, pVkBarrier, 0, nullptr, vkImageBarriers.size(), vkImageBarriers.data());
        });
    }

    _buffersToBeChecked.clear();
    _texturesToBeChecked.clear();
}

} // namespace gfx
} // namespace cc
