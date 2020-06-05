#ifndef CC_GFXVULKAN_CCVK_UTILS_H_
#define CC_GFXVULKAN_CCVK_UTILS_H_

#define WIN32_LEAN_AND_MEAN

#include "vk_mem_alloc.h"
#include "volk.h"

#define DEFAULT_FENCE_TIMEOUT 100000000000

NS_CC_BEGIN

namespace
{
    VkFormat MapVkFormat(GFXFormat format)
    {
        switch (format)
        {
        case GFXFormat::R8: return VK_FORMAT_R8_UNORM;
        case GFXFormat::R8SN: return VK_FORMAT_R8_SNORM;
        case GFXFormat::R8UI: return VK_FORMAT_R8_UINT;
        case GFXFormat::R8I: return VK_FORMAT_R8_SINT;
        case GFXFormat::RG8: return VK_FORMAT_R8G8_UNORM;
        case GFXFormat::RG8SN: return VK_FORMAT_R8G8_SNORM;
        case GFXFormat::RG8UI: return VK_FORMAT_R8G8_UINT;
        case GFXFormat::RG8I: return VK_FORMAT_R8G8_SINT;
        case GFXFormat::RGB8: return VK_FORMAT_R8G8B8_UNORM;
        case GFXFormat::RGB8SN: return VK_FORMAT_R8G8B8_SNORM;
        case GFXFormat::RGB8UI: return VK_FORMAT_R8G8B8_UINT;
        case GFXFormat::RGB8I: return VK_FORMAT_R8G8B8_SINT;
        case GFXFormat::RGBA8: return VK_FORMAT_R8G8B8A8_UNORM;
        case GFXFormat::BGRA8: return VK_FORMAT_B8G8R8A8_UNORM;
        case GFXFormat::RGBA8SN: return VK_FORMAT_R8G8B8A8_SNORM;
        case GFXFormat::RGBA8UI: return VK_FORMAT_R8G8B8A8_UINT;
        case GFXFormat::RGBA8I: return VK_FORMAT_R8G8B8A8_SINT;
        case GFXFormat::R16I: return VK_FORMAT_R16_SINT;
        case GFXFormat::R16UI: return VK_FORMAT_R16_UINT;
        case GFXFormat::R16F: return VK_FORMAT_R16_SFLOAT;
        case GFXFormat::RG16I: return VK_FORMAT_R16G16_SINT;
        case GFXFormat::RG16UI: return VK_FORMAT_R16G16_UINT;
        case GFXFormat::RG16F: return VK_FORMAT_R16G16_SFLOAT;
        case GFXFormat::RGB16I: return VK_FORMAT_R16G16B16_SINT;
        case GFXFormat::RGB16UI: return VK_FORMAT_R16G16B16_UINT;
        case GFXFormat::RGB16F: return VK_FORMAT_R16G16B16_SFLOAT;
        case GFXFormat::RGBA16I: return VK_FORMAT_R16G16B16A16_SINT;
        case GFXFormat::RGBA16UI: return VK_FORMAT_R16G16B16A16_UINT;
        case GFXFormat::RGBA16F: return VK_FORMAT_R16G16B16A16_SFLOAT;
        case GFXFormat::R32I: return VK_FORMAT_R32_SINT;
        case GFXFormat::R32UI: return VK_FORMAT_R32_UINT;
        case GFXFormat::R32F: return VK_FORMAT_R32_SFLOAT;
        case GFXFormat::RG32I: return VK_FORMAT_R32G32_SINT;
        case GFXFormat::RG32UI: return VK_FORMAT_R32G32_UINT;
        case GFXFormat::RG32F: return VK_FORMAT_R32G32_SFLOAT;
        case GFXFormat::RGB32I: return VK_FORMAT_R32G32B32_SINT;
        case GFXFormat::RGB32UI: return VK_FORMAT_R32G32B32_UINT;
        case GFXFormat::RGB32F: return VK_FORMAT_R32G32B32_SFLOAT;
        case GFXFormat::RGBA32I: return VK_FORMAT_R32G32B32A32_SINT;
        case GFXFormat::RGBA32UI: return VK_FORMAT_R32G32B32A32_UINT;
        case GFXFormat::RGBA32F: return VK_FORMAT_R32G32B32A32_SFLOAT;

        case GFXFormat::R5G6B5: return VK_FORMAT_R5G6B5_UNORM_PACK16;
        case GFXFormat::R11G11B10F: return VK_FORMAT_B10G11R11_UFLOAT_PACK32;
        case GFXFormat::RGB5A1: return VK_FORMAT_R5G5B5A1_UNORM_PACK16;
        case GFXFormat::RGBA4: return VK_FORMAT_R4G4B4A4_UNORM_PACK16;
        case GFXFormat::RGB10A2: return VK_FORMAT_A2B10G10R10_UNORM_PACK32;
        case GFXFormat::RGB10A2UI: return VK_FORMAT_A2B10G10R10_UINT_PACK32;
        case GFXFormat::RGB9E5: return VK_FORMAT_E5B9G9R9_UFLOAT_PACK32;
        case GFXFormat::D16: return VK_FORMAT_D16_UNORM;
        case GFXFormat::D16S8: return VK_FORMAT_D16_UNORM_S8_UINT;
        case GFXFormat::D24: return VK_FORMAT_X8_D24_UNORM_PACK32;
        case GFXFormat::D24S8: return VK_FORMAT_D24_UNORM_S8_UINT;
        case GFXFormat::D32F: return VK_FORMAT_D32_SFLOAT;
        case GFXFormat::D32F_S8: return VK_FORMAT_D32_SFLOAT_S8_UINT;

        case GFXFormat::BC1: return VK_FORMAT_BC1_RGB_UNORM_BLOCK;
        case GFXFormat::BC1_ALPHA: return VK_FORMAT_BC1_RGBA_UNORM_BLOCK;
        case GFXFormat::BC1_SRGB: return VK_FORMAT_BC1_RGB_SRGB_BLOCK;
        case GFXFormat::BC1_SRGB_ALPHA: return VK_FORMAT_BC1_RGBA_SRGB_BLOCK;
        case GFXFormat::BC2: return VK_FORMAT_BC2_UNORM_BLOCK;
        case GFXFormat::BC2_SRGB: return VK_FORMAT_BC2_SRGB_BLOCK;
        case GFXFormat::BC3: return VK_FORMAT_BC3_UNORM_BLOCK;
        case GFXFormat::BC3_SRGB: return VK_FORMAT_BC3_SRGB_BLOCK;
        case GFXFormat::BC4: return VK_FORMAT_BC4_UNORM_BLOCK;
        case GFXFormat::BC4_SNORM: return VK_FORMAT_BC4_SNORM_BLOCK;
        case GFXFormat::BC5: return VK_FORMAT_BC5_UNORM_BLOCK;
        case GFXFormat::BC5_SNORM: return VK_FORMAT_BC5_SNORM_BLOCK;
        case GFXFormat::BC6H_UF16: return VK_FORMAT_BC6H_UFLOAT_BLOCK;
        case GFXFormat::BC6H_SF16: return VK_FORMAT_BC6H_SFLOAT_BLOCK;
        case GFXFormat::BC7: return VK_FORMAT_BC7_UNORM_BLOCK;
        case GFXFormat::BC7_SRGB: return VK_FORMAT_BC7_SRGB_BLOCK;

        case GFXFormat::ETC2_RGB8: return VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK;
        case GFXFormat::ETC2_SRGB8: return VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK;
        case GFXFormat::ETC2_RGB8_A1: return VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK;
        case GFXFormat::ETC2_SRGB8_A1: return VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK;
        case GFXFormat::ETC2_RGBA8: return VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK;
        case GFXFormat::ETC2_SRGB8_A8: return VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK;
        case GFXFormat::EAC_R11: return VK_FORMAT_EAC_R11_UNORM_BLOCK;
        case GFXFormat::EAC_R11SN: return VK_FORMAT_EAC_R11_SNORM_BLOCK;
        case GFXFormat::EAC_RG11: return VK_FORMAT_EAC_R11G11_UNORM_BLOCK;
        case GFXFormat::EAC_RG11SN: return VK_FORMAT_EAC_R11G11_SNORM_BLOCK;

        case GFXFormat::PVRTC_RGB2: return VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG;
        case GFXFormat::PVRTC_RGBA2: return VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG;
        case GFXFormat::PVRTC_RGB4: return VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG;
        case GFXFormat::PVRTC_RGBA4: return VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG;
        case GFXFormat::PVRTC2_2BPP: return VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG;
        case GFXFormat::PVRTC2_4BPP: return VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG;
        default:
        {
            CCASSERT(false, "Unsupported GFXFormat, convert to VkFormat failed.");
            return VK_FORMAT_B8G8R8A8_UNORM;
        }
        }
    }

    VkSampleCountFlagBits MapVkSampleCount(uint sampleCount)
    {
        if (sampleCount == 1) return VK_SAMPLE_COUNT_1_BIT;
        else if (sampleCount == 2) return VK_SAMPLE_COUNT_2_BIT;
        else if (sampleCount == 4) return VK_SAMPLE_COUNT_4_BIT;
        else if (sampleCount == 8) return VK_SAMPLE_COUNT_8_BIT;
        else if (sampleCount == 16) return VK_SAMPLE_COUNT_16_BIT;
        else if (sampleCount == 32) return VK_SAMPLE_COUNT_32_BIT;
        else if (sampleCount == 64) return VK_SAMPLE_COUNT_64_BIT;
        else                        return VK_SAMPLE_COUNT_1_BIT;
    }

    VkAttachmentLoadOp MapVkLoadOp(GFXLoadOp loadOp)
    {
        switch (loadOp)
        {
        case GFXLoadOp::CLEAR: return VK_ATTACHMENT_LOAD_OP_CLEAR;
        case GFXLoadOp::LOAD: return VK_ATTACHMENT_LOAD_OP_LOAD;
        case GFXLoadOp::DISCARD: return VK_ATTACHMENT_LOAD_OP_DONT_CARE;
        default:
        {
            CCASSERT(false, "Unsupported GFXLoadOp, convert to VkLoadOp failed.");
            return VK_ATTACHMENT_LOAD_OP_LOAD;
        }
        }
    }

    VkAttachmentStoreOp MapVkStoreOp(GFXStoreOp storeOp)
    {
        switch (storeOp)
        {
        case GFXStoreOp::STORE: return VK_ATTACHMENT_STORE_OP_STORE;
        case GFXStoreOp::DISCARD: return VK_ATTACHMENT_STORE_OP_DONT_CARE;
        default:
        {
            CCASSERT(false, "Unsupported GFXStoreOp, convert to VkStoreOp failed.");
            return VK_ATTACHMENT_STORE_OP_STORE;
        }
        }
    }

    VkImageLayout MapVkImageLayout(GFXTextureLayout layout)
    {
        switch (layout)
        {
        case GFXTextureLayout::UNDEFINED: return VK_IMAGE_LAYOUT_UNDEFINED;
        case GFXTextureLayout::GENERAL: return VK_IMAGE_LAYOUT_GENERAL;
        case GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL: return VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
        case GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL: return VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        case GFXTextureLayout::DEPTH_STENCIL_READONLY_OPTIMAL: return VK_IMAGE_LAYOUT_DEPTH_STENCIL_READ_ONLY_OPTIMAL;
        case GFXTextureLayout::SHADER_READONLY_OPTIMAL: return VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
        case GFXTextureLayout::TRANSFER_SRC_OPTIMAL: return VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL;
        case GFXTextureLayout::TRANSFER_DST_OPTIMAL: return VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
        case GFXTextureLayout::PREINITIALIZED: return VK_IMAGE_LAYOUT_PREINITIALIZED;
        case GFXTextureLayout::PRESENT_SRC: return VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;
        default:
        {
            CCASSERT(false, "Unsupported GFXTextureLayout, convert to VkImageLayout failed.");
            return VK_IMAGE_LAYOUT_GENERAL;
        }
        }
    }

    VkAccessFlags MapVkAccessFlags(GFXTextureLayout layout)
    {
        switch (layout)
        {
        case GFXTextureLayout::UNDEFINED: return 0;
        case GFXTextureLayout::GENERAL: return 0;
        case GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL: return VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        case GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL: return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
        case GFXTextureLayout::DEPTH_STENCIL_READONLY_OPTIMAL: return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT;
        case GFXTextureLayout::SHADER_READONLY_OPTIMAL: return VK_ACCESS_SHADER_READ_BIT;
        case GFXTextureLayout::TRANSFER_SRC_OPTIMAL: return VK_ACCESS_TRANSFER_READ_BIT;
        case GFXTextureLayout::TRANSFER_DST_OPTIMAL: return VK_ACCESS_TRANSFER_WRITE_BIT;
        case GFXTextureLayout::PREINITIALIZED: return 0;
        case GFXTextureLayout::PRESENT_SRC: return 0;
        default:
        {
            CCASSERT(false, "Unsupported GFXTextureLayout, convert to VkImageLayout failed.");
            return 0;
        }
        }
    }

    VkAccessFlags MapVkAccessFlags(GFXTextureUsage usage, GFXFormat format)
    {
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) return VK_ACCESS_COLOR_ATTACHMENT_READ_BIT | VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT | VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
        if (usage & GFXTextureUsage::INPUT_ATTACHMENT) return VK_ACCESS_INPUT_ATTACHMENT_READ_BIT;
        if (usage & GFXTextureUsage::SAMPLED)
        {
            if (GFX_FORMAT_INFOS[(uint)format].hasDepth) return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT;
            else return VK_ACCESS_SHADER_READ_BIT;
        }
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_ACCESS_TRANSFER_READ_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_ACCESS_TRANSFER_WRITE_BIT;
        return VK_ACCESS_SHADER_READ_BIT;
    }

    VkPipelineBindPoint MapVkPipelineBindPoint(GFXPipelineBindPoint bindPoint)
    {
        switch (bindPoint)
        {
        case GFXPipelineBindPoint::GRAPHICS: return VK_PIPELINE_BIND_POINT_GRAPHICS;
        case GFXPipelineBindPoint::COMPUTE: return VK_PIPELINE_BIND_POINT_COMPUTE;
        case GFXPipelineBindPoint::RAY_TRACING: return VK_PIPELINE_BIND_POINT_RAY_TRACING_NV;
        default:
        {
            CCASSERT(false, "Unsupported GFXPipelineBindPoint, convert to VkPipelineBindPoint failed.");
            return VK_PIPELINE_BIND_POINT_GRAPHICS;
        }
        }
    }

    VkBufferUsageFlagBits MapVkBufferUsageFlagBits(GFXBufferUsage usage)
    {
        uint flags = 0u;
        if (usage & GFXBufferUsage::TRANSFER_SRC) flags |= VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
        if (usage & GFXBufferUsage::TRANSFER_DST) flags |= VK_BUFFER_USAGE_TRANSFER_DST_BIT;
        if (usage & GFXBufferUsage::INDEX) flags |= VK_BUFFER_USAGE_INDEX_BUFFER_BIT;
        if (usage & GFXBufferUsage::VERTEX) flags |= VK_BUFFER_USAGE_VERTEX_BUFFER_BIT;
        if (usage & GFXBufferUsage::UNIFORM) flags |= VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT;
        if (usage & GFXBufferUsage::STORAGE) flags |= VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
        if (usage & GFXBufferUsage::INDIRECT) flags |= VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT;
        return (VkBufferUsageFlagBits)flags;
    }

    VkImageType MapVkImageType(GFXTextureType type)
    {
        switch (type)
        {
        case GFXTextureType::TEX1D: return VK_IMAGE_TYPE_1D;
        case GFXTextureType::TEX2D: return VK_IMAGE_TYPE_2D;
        case GFXTextureType::TEX3D: return VK_IMAGE_TYPE_3D;
        default:
        {
            CCASSERT(false, "Unsupported GFXTextureType, convert to VkImageType failed.");
            return VK_IMAGE_TYPE_2D;
        }
        }
    }

    VkSampleCountFlagBits MapVkSampleCount(GFXSampleCount count)
    {
        switch (count)
        {
        case GFXSampleCount::X1: return VK_SAMPLE_COUNT_1_BIT;
        case GFXSampleCount::X2: return VK_SAMPLE_COUNT_2_BIT;
        case GFXSampleCount::X4: return VK_SAMPLE_COUNT_4_BIT;
        case GFXSampleCount::X8: return VK_SAMPLE_COUNT_8_BIT;
        case GFXSampleCount::X16: return VK_SAMPLE_COUNT_16_BIT;
        case GFXSampleCount::X32: return VK_SAMPLE_COUNT_32_BIT;
        default:
        {
            CCASSERT(false, "Unsupported GFXTextureType, convert to VkImageType failed.");
            return VK_SAMPLE_COUNT_1_BIT;
        }
        }
    }

    VkFormatFeatureFlags MapVkFormatFeatureFlags(GFXTextureUsage usage)
    {
        uint flags = 0u;
        if (usage & GFXTextureUsage::TRANSFER_SRC) flags |= VK_FORMAT_FEATURE_TRANSFER_SRC_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) flags |= VK_FORMAT_FEATURE_TRANSFER_DST_BIT;
        if (usage & GFXTextureUsage::SAMPLED) flags |= VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT;
        if (usage & GFXTextureUsage::STORAGE) flags |= VK_FORMAT_FEATURE_STORAGE_IMAGE_BIT;
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) flags |= VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) flags |= VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT;
        if (usage & GFXTextureUsage::TRANSIENT_ATTACHMENT) flags |= VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT;
        if (usage & GFXTextureUsage::INPUT_ATTACHMENT) flags |= VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT;
        return (VkFormatFeatureFlags)flags;
    }

    VkImageUsageFlagBits MapVkImageUsageFlagBits(GFXTextureUsage usage)
    {
        uint flags = 0u;
        if (usage & GFXTextureUsage::TRANSFER_SRC) flags |= VK_IMAGE_USAGE_TRANSFER_SRC_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) flags |= VK_IMAGE_USAGE_TRANSFER_DST_BIT;
        if (usage & GFXTextureUsage::SAMPLED) flags |= VK_IMAGE_USAGE_SAMPLED_BIT;
        if (usage & GFXTextureUsage::STORAGE) flags |= VK_IMAGE_USAGE_STORAGE_BIT;
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) flags |= VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) flags |= VK_IMAGE_USAGE_DEPTH_STENCIL_ATTACHMENT_BIT;
        if (usage & GFXTextureUsage::TRANSIENT_ATTACHMENT) flags |= VK_IMAGE_USAGE_TRANSIENT_ATTACHMENT_BIT;
        if (usage & GFXTextureUsage::INPUT_ATTACHMENT) flags |= VK_IMAGE_USAGE_INPUT_ATTACHMENT_BIT;
        return (VkImageUsageFlagBits)flags;
    }

    VkImageLayout MapVkImageLayout(GFXTextureUsage usage, GFXFormat format)
    {
        const GFXFormatInfo &info = GFX_FORMAT_INFOS[(uint)format];
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) return VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT)
        {
            if (info.hasStencil) return VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
            else return VK_IMAGE_LAYOUT_DEPTH_ATTACHMENT_OPTIMAL;
        }
        if (usage & GFXTextureUsage::SAMPLED)
        {
            if (info.hasDepth && info.hasStencil) return VK_IMAGE_LAYOUT_DEPTH_STENCIL_READ_ONLY_OPTIMAL;
            else if (info.hasDepth) return VK_IMAGE_LAYOUT_DEPTH_READ_ONLY_OPTIMAL;
            else return VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL;
        }
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
        return VK_IMAGE_LAYOUT_UNDEFINED;
    }

    VkImageAspectFlags MapVkImageAspectFlags(GFXFormat format)
    {
        VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        const GFXFormatInfo &info = GFX_FORMAT_INFOS[(uint)format];
        if (info.hasDepth) { aspectMask = VK_IMAGE_ASPECT_DEPTH_BIT; }
        if (info.hasStencil) { aspectMask |= VK_IMAGE_ASPECT_STENCIL_BIT; }
        return aspectMask;
    }

    VkPipelineStageFlags MapVkPipelineStageFlags(GFXTextureUsage usage)
    {
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) return VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) return VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT | VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT;
        if (usage & GFXTextureUsage::SAMPLED) return VK_PIPELINE_STAGE_VERTEX_SHADER_BIT;
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_PIPELINE_STAGE_TRANSFER_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_PIPELINE_STAGE_TRANSFER_BIT;
        return VK_PIPELINE_STAGE_VERTEX_SHADER_BIT;
    }

    uint selectMemoryType(const VkPhysicalDeviceMemoryProperties& memoryProperties, uint memoryTypeBits, VkMemoryPropertyFlags flags)
    {
        for (uint i = 0; i < memoryProperties.memoryTypeCount; ++i)
            if ((memoryTypeBits & (1 << i)) != 0 && (memoryProperties.memoryTypes[i].propertyFlags & flags) == flags)
                return i;

        CCASSERT(false, "No compatible memory type found.");
        return ~0u;
    }

    VkImageCreateFlags MapVkImageCreateFlags(GFXTextureViewType type)
    {
        uint res = 0u;
        switch (type)
        {
        case cocos2d::GFXTextureViewType::CUBE: res |= VK_IMAGE_CREATE_CUBE_COMPATIBLE_BIT; break;
        case cocos2d::GFXTextureViewType::TV2D_ARRAY: res |= VK_IMAGE_CREATE_2D_ARRAY_COMPATIBLE_BIT; break;
        }
        return (VkImageCreateFlags)res;
    }

    VkImageViewType MapVkImageViewType(GFXTextureViewType viewType)
    {
        switch (viewType)
        {
        case GFXTextureViewType::TV1D: return VK_IMAGE_VIEW_TYPE_1D;
        case GFXTextureViewType::TV1D_ARRAY: return VK_IMAGE_VIEW_TYPE_1D_ARRAY;
        case GFXTextureViewType::TV2D: return VK_IMAGE_VIEW_TYPE_2D;
        case GFXTextureViewType::TV2D_ARRAY: return VK_IMAGE_VIEW_TYPE_2D_ARRAY;
        case GFXTextureViewType::TV3D: return VK_IMAGE_VIEW_TYPE_3D;
        case GFXTextureViewType::CUBE: return VK_IMAGE_VIEW_TYPE_CUBE;
        default:
        {
            CCASSERT(false, "Unsupported GFXTextureViewType, convert to VkImageViewType failed.");
            return VK_IMAGE_VIEW_TYPE_2D;
        }
        }
    }

    VkCommandBufferLevel MapVkCommandBufferLevel(GFXCommandBufferType type)
    {
        switch (type)
        {
        case GFXCommandBufferType::PRIMARY: return VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        case GFXCommandBufferType::SECONDARY: return VK_COMMAND_BUFFER_LEVEL_SECONDARY;
        default:
        {
            CCASSERT(false, "Unsupported GFXCommandBufferType, convert to VkCommandBufferLevel failed.");
            return VK_COMMAND_BUFFER_LEVEL_SECONDARY;
        }
        }
    }

    VkDescriptorType MapVkDescriptorType(GFXBindingType type)
    {
        switch (type)
        {
        case cocos2d::GFXBindingType::UNIFORM_BUFFER: return VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER;
        case cocos2d::GFXBindingType::SAMPLER: return VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER;
        case cocos2d::GFXBindingType::STORAGE_BUFFER: return VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
        default:
        {
            CCASSERT(false, "Unsupported GFXBindingType, convert to VkDescriptorType failed.");
            return VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
        }
        }
    }

    VkColorComponentFlags MapVkColorComponentFlags(GFXColorMask colorMask)
    {
        uint flags = 0u;
        if (colorMask & GFXColorMask::R) flags |= VK_COLOR_COMPONENT_R_BIT;
        if (colorMask & GFXColorMask::G) flags |= VK_COLOR_COMPONENT_G_BIT;
        if (colorMask & GFXColorMask::B) flags |= VK_COLOR_COMPONENT_B_BIT;
        if (colorMask & GFXColorMask::A) flags |= VK_COLOR_COMPONENT_A_BIT;
        if (colorMask & GFXColorMask::ALL) flags |= VK_COLOR_COMPONENT_R_BIT | VK_COLOR_COMPONENT_G_BIT | VK_COLOR_COMPONENT_B_BIT | VK_COLOR_COMPONENT_A_BIT;
        return (VkColorComponentFlags)flags;
    }

    VkShaderStageFlagBits MapVkShaderStageFlagBits(GFXShaderType stage)
    {
        switch (stage)
        {
        case GFXShaderType::VERTEX: return VK_SHADER_STAGE_VERTEX_BIT;
        case GFXShaderType::CONTROL: return VK_SHADER_STAGE_TESSELLATION_CONTROL_BIT;
        case GFXShaderType::EVALUATION: return VK_SHADER_STAGE_TESSELLATION_EVALUATION_BIT;
        case GFXShaderType::GEOMETRY: return VK_SHADER_STAGE_GEOMETRY_BIT;
        case GFXShaderType::FRAGMENT: return VK_SHADER_STAGE_FRAGMENT_BIT;
        case GFXShaderType::COMPUTE: return VK_SHADER_STAGE_COMPUTE_BIT;
        default:
        {
            CCASSERT(false, "Unsupported GFXShaderType, convert to VkShaderStageFlagBits failed.");
            return VK_SHADER_STAGE_VERTEX_BIT;
        }
        }
    }

    VkShaderStageFlags MapVkShaderStageFlags(GFXShaderType stages)
    {
        uint flags = 0u;
        if (stages & GFXShaderType::VERTEX) flags |= VK_SHADER_STAGE_VERTEX_BIT;
        if (stages & GFXShaderType::CONTROL) flags |= VK_SHADER_STAGE_TESSELLATION_CONTROL_BIT;
        if (stages & GFXShaderType::EVALUATION) flags |= VK_SHADER_STAGE_TESSELLATION_EVALUATION_BIT;
        if (stages & GFXShaderType::GEOMETRY) flags |= VK_SHADER_STAGE_GEOMETRY_BIT;
        if (stages & GFXShaderType::FRAGMENT) flags |= VK_SHADER_STAGE_FRAGMENT_BIT;
        if (stages & GFXShaderType::COMPUTE) flags |= VK_SHADER_STAGE_COMPUTE_BIT;
        return (VkShaderStageFlags)flags;
    }

    const VkPrimitiveTopology VK_PRIMITIVE_MODES[] =
    {
        VK_PRIMITIVE_TOPOLOGY_POINT_LIST,                     // POINT_LIST
        VK_PRIMITIVE_TOPOLOGY_LINE_LIST,                      // LINE_LIST
        VK_PRIMITIVE_TOPOLOGY_LINE_STRIP,                     // LINE_STRIP
        (VkPrimitiveTopology)0,                               // LINE_LOOP
        VK_PRIMITIVE_TOPOLOGY_LINE_LIST_WITH_ADJACENCY,       // LINE_LIST_ADJACENCY
        VK_PRIMITIVE_TOPOLOGY_LINE_STRIP_WITH_ADJACENCY,      // LINE_STRIP_ADJACENCY
        (VkPrimitiveTopology)0,                               // ISO_LINE_LIST
        VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,                  // TRIANGLE_LIST
        VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP,                 // TRIANGLE_STRIP
        VK_PRIMITIVE_TOPOLOGY_TRIANGLE_FAN,                   // TRIANGLE_FAN
        VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST_WITH_ADJACENCY,   // TRIANGLE_LIST_ADJACENCY
        VK_PRIMITIVE_TOPOLOGY_TRIANGLE_STRIP_WITH_ADJACENCY,  // TRIANGLE_STRIP_ADJACENCY,
        (VkPrimitiveTopology)0,                               // TRIANGLE_PATCH_ADJACENCY,
        VK_PRIMITIVE_TOPOLOGY_PATCH_LIST,                     // QUAD_PATCH_LIST,
    };

    const VkCullModeFlags VK_CULL_MODES[] =
    {
        VK_CULL_MODE_NONE,
        VK_CULL_MODE_FRONT_BIT,
        VK_CULL_MODE_BACK_BIT,
    };

    const VkPolygonMode VK_POLYGON_MODES[] =
    {
        VK_POLYGON_MODE_FILL,
        VK_POLYGON_MODE_LINE,
        VK_POLYGON_MODE_POINT,
    };

    const VkCompareOp VK_CMP_FUNCS[] =
    {
        VK_COMPARE_OP_NEVER,
        VK_COMPARE_OP_LESS,
        VK_COMPARE_OP_EQUAL,
        VK_COMPARE_OP_LESS_OR_EQUAL,
        VK_COMPARE_OP_GREATER,
        VK_COMPARE_OP_NOT_EQUAL,
        VK_COMPARE_OP_GREATER_OR_EQUAL,
        VK_COMPARE_OP_ALWAYS,
    };

    const VkStencilOp VK_STENCIL_OPS[] =
    {
        VK_STENCIL_OP_ZERO,
        VK_STENCIL_OP_KEEP,
        VK_STENCIL_OP_REPLACE,
        VK_STENCIL_OP_INCREMENT_AND_CLAMP,
        VK_STENCIL_OP_DECREMENT_AND_CLAMP,
        VK_STENCIL_OP_INVERT,
        VK_STENCIL_OP_INCREMENT_AND_WRAP,
        VK_STENCIL_OP_DECREMENT_AND_WRAP,
    };

    const VkBlendOp VK_BLEND_OPS[] =
    {
        VK_BLEND_OP_ADD,
        VK_BLEND_OP_SUBTRACT,
        VK_BLEND_OP_REVERSE_SUBTRACT,
        VK_BLEND_OP_ADD,
        VK_BLEND_OP_ADD,
    };

    const VkBlendFactor VK_BLEND_FACTORS[] =
    {
        VK_BLEND_FACTOR_ZERO,
        VK_BLEND_FACTOR_ONE,
        VK_BLEND_FACTOR_SRC_ALPHA,
        VK_BLEND_FACTOR_DST_ALPHA,
        VK_BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
        VK_BLEND_FACTOR_ONE_MINUS_DST_ALPHA,
        VK_BLEND_FACTOR_SRC_COLOR,
        VK_BLEND_FACTOR_DST_COLOR,
        VK_BLEND_FACTOR_ONE_MINUS_SRC_COLOR,
        VK_BLEND_FACTOR_ONE_MINUS_DST_COLOR,
        VK_BLEND_FACTOR_SRC_ALPHA_SATURATE,
        VK_BLEND_FACTOR_CONSTANT_COLOR,
        VK_BLEND_FACTOR_ONE_MINUS_CONSTANT_COLOR,
        VK_BLEND_FACTOR_CONSTANT_ALPHA,
        VK_BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA,
    };

    const VkFilter VK_FILTERS[] =
    {
        (VkFilter)0,        // NONE
        VK_FILTER_NEAREST,  // POINT
        VK_FILTER_LINEAR,   // LINEAR
        (VkFilter)0,        // ANISOTROPIC
    };

    const VkSamplerMipmapMode VK_SAMPLER_MIPMAP_MODES[] =
    {
        (VkSamplerMipmapMode)0,         // NONE
        VK_SAMPLER_MIPMAP_MODE_NEAREST, // POINT
        VK_SAMPLER_MIPMAP_MODE_LINEAR,  // LINEAR
        VK_SAMPLER_MIPMAP_MODE_LINEAR,  // ANISOTROPIC
    };

    const VkSamplerAddressMode VK_SAMPLER_ADDRESS_MODES[] =
    {
        VK_SAMPLER_ADDRESS_MODE_REPEAT,          // WRAP
        VK_SAMPLER_ADDRESS_MODE_MIRRORED_REPEAT, // MIRROR
        VK_SAMPLER_ADDRESS_MODE_CLAMP_TO_EDGE,   // CLAMP
        VK_SAMPLER_ADDRESS_MODE_CLAMP_TO_BORDER, // BORDER
    };

    template <typename T, size_t Size>
    char(*countof_helper(T(&_Array)[Size]))[Size];

    #define COUNTOF(array) (sizeof(*countof_helper(array)) + 0)

    template <class T>
    uint toUint(T value)
    {
        static_assert(std::is_arithmetic<T>::value, "T must be numeric");

        if (static_cast<uintmax_t>(value) > static_cast<uintmax_t>(std::numeric_limits<uint>::max()))
        {
            throw std::runtime_error("to_u32() failed, value is too big to be converted to uint");
        }

        return static_cast<uint>(value);
    }

    uint nextPowerOf2(uint v)
    {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        return ++v;
    }

    const char* MapVendorName(uint32_t vendorID)
    {
        switch (vendorID)
        {
        case 0x1002: return "Advanced Micro Devices, Inc.";
        case 0x1010: return "Imagination Technologies";
        case 0x10DE: return "Nvidia Corporation";
        case 0x13B5: return "Arm Limited";
        case 0x5143: return "Qualcomm Incorporated";
        case 0x8086: return "Intel Corporation";
        }
        return "Unknown";
    }

    bool isLayerSupported(const char * required, const std::vector<VkLayerProperties> &available)
    {
        for (const VkLayerProperties &availableLayer : available)
        {
            if (strcmp(availableLayer.layerName, required) == 0)
            {
                return true;
            }
        }
        return false;
    }

    bool isExtensionSupported(const char * required, const std::vector<VkExtensionProperties> &available)
    {
        for (const VkExtensionProperties &availableExtension : available)
        {
            if (strcmp(availableExtension.extensionName, required) == 0)
            {
                return true;
            }
        }
        return false;
    }
}

NS_CC_END

#endif // CC_GFXVULKAN_CCVK_UTILS_H_
