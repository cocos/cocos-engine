#include "VKStd.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKQueue.h"
#include "VKContext.h"
#include "VKStateCache.h"
#include "VKCommandAllocator.h"
#include "VKSPIRV.h"

#define BUFFER_OFFSET(idx) (static_cast<char*>(0) + (idx))
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
        if      (sampleCount ==  1) return VK_SAMPLE_COUNT_1_BIT;
        else if (sampleCount ==  2) return VK_SAMPLE_COUNT_2_BIT;
        else if (sampleCount ==  4) return VK_SAMPLE_COUNT_4_BIT;
        else if (sampleCount ==  8) return VK_SAMPLE_COUNT_8_BIT;
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
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_ACCESS_TRANSFER_READ_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_ACCESS_TRANSFER_WRITE_BIT;
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) return VK_ACCESS_COLOR_ATTACHMENT_READ_BIT | VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT | VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
        if (usage & GFXTextureUsage::INPUT_ATTACHMENT) return VK_ACCESS_INPUT_ATTACHMENT_READ_BIT;
        if (usage & GFXTextureUsage::SAMPLED)
        {
            if (GFX_FORMAT_INFOS[(uint)format].hasDepth) return VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT;
            else return VK_ACCESS_SHADER_READ_BIT;
        }
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
        auto &info = GFX_FORMAT_INFOS[(uint)format];
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
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
        return VK_IMAGE_LAYOUT_UNDEFINED;
    }

    VkImageAspectFlags MapVkImageAspectFlags(GFXFormat format)
    {
        VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        auto &info = GFX_FORMAT_INFOS[(uint)format];
        if (info.hasDepth) { aspectMask = VK_IMAGE_ASPECT_DEPTH_BIT; }
        if (info.hasStencil) { aspectMask |= VK_IMAGE_ASPECT_STENCIL_BIT; }
        return aspectMask;
    }

    VkPipelineStageFlags MapVkPipelineStageFlags(GFXTextureUsage usage)
    {
        if (usage & GFXTextureUsage::TRANSFER_SRC) return VK_PIPELINE_STAGE_TRANSFER_BIT;
        if (usage & GFXTextureUsage::TRANSFER_DST) return VK_PIPELINE_STAGE_TRANSFER_BIT;
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT) return VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
        if (usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT) return VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT | VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT;
        if (usage & GFXTextureUsage::SAMPLED) return VK_PIPELINE_STAGE_VERTEX_SHADER_BIT;
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

    void InsertVkDynamicStates(vector<VkDynamicState>::type& out, const vector<GFXDynamicState>::type& dynamicStates)
    {
        for (auto dynamicState : dynamicStates)
        {
            switch (dynamicState)
            {
            case GFXDynamicState::VIEWPORT: break; // we make this dynamic by default
            case GFXDynamicState::SCISSOR: break; // we make this dynamic by default
            case GFXDynamicState::LINE_WIDTH: out.push_back(VK_DYNAMIC_STATE_LINE_WIDTH); break;
            case GFXDynamicState::DEPTH_BIAS: out.push_back(VK_DYNAMIC_STATE_DEPTH_BIAS); break;
            case GFXDynamicState::BLEND_CONSTANTS: out.push_back(VK_DYNAMIC_STATE_BLEND_CONSTANTS); break;
            case GFXDynamicState::DEPTH_BOUNDS: out.push_back(VK_DYNAMIC_STATE_DEPTH_BOUNDS); break;
            case GFXDynamicState::STENCIL_WRITE_MASK: out.push_back(VK_DYNAMIC_STATE_STENCIL_WRITE_MASK); break;
            case GFXDynamicState::STENCIL_COMPARE_MASK:
                out.push_back(VK_DYNAMIC_STATE_STENCIL_REFERENCE);
                out.push_back(VK_DYNAMIC_STATE_STENCIL_COMPARE_MASK);
                break;
            default:
            {
                CCASSERT(false, "Unsupported GFXPrimitiveMode, convert to VkPrimitiveTopology failed.");
                break;
            }
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
        (VkSamplerMipmapMode)0,         // ANISOTROPIC
    };

    const VkSamplerAddressMode VK_SAMPLER_ADDRESS_MODES[] =
    {
        VK_SAMPLER_ADDRESS_MODE_REPEAT,          // WRAP
        VK_SAMPLER_ADDRESS_MODE_MIRRORED_REPEAT, // MIRROR
        VK_SAMPLER_ADDRESS_MODE_CLAMP_TO_EDGE,   // CLAMP
        VK_SAMPLER_ADDRESS_MODE_CLAMP_TO_BORDER, // BORDER
    };
}

void beginOneTimeCommands(CCVKDevice* device, CCVKGPUCommandBuffer* cmdBuff)
{
    cmdBuff->commandPool = ((CCVKCommandAllocator*)device->getCommandAllocator())->gpuCommandPool();
    cmdBuff->type = GFXCommandBufferType::PRIMARY;
    CCVKCmdFuncAllocateCommandBuffer(device, cmdBuff);

    VkCommandBufferBeginInfo beginInfo{ VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO };
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
    VK_CHECK(vkBeginCommandBuffer(cmdBuff->vkCommandBuffer, &beginInfo));
}

void endOneTimeCommands(CCVKDevice* device, CCVKGPUCommandBuffer* cmdBuff)
{
    VK_CHECK(vkEndCommandBuffer(cmdBuff->vkCommandBuffer));

    auto fence = device->gpuFencePool()->alloc();
    auto queue = ((CCVKQueue*)device->getQueue())->gpuQueue();
    VkSubmitInfo submitInfo{ VK_STRUCTURE_TYPE_SUBMIT_INFO };
    submitInfo.commandBufferCount = 1;
    submitInfo.pCommandBuffers = &cmdBuff->vkCommandBuffer;
    VK_CHECK(vkQueueSubmit(queue->vkQueue, 1, &submitInfo, fence));
    VK_CHECK(vkWaitForFences(device->gpuDevice()->vkDevice, 1, &fence, VK_TRUE, DEFAULT_FENCE_TIMEOUT));

    CCVKCmdFuncFreeCommandBuffer(device, cmdBuff);
}

void CCVKCmdFuncCreateRenderPass(CCVKDevice* device, CCVKGPURenderPass* gpuRenderPass)
{
    auto colorAttachmentCount = gpuRenderPass->colorAttachments.size();
    vector<VkAttachmentDescription>::type attachmentDescriptions(colorAttachmentCount + 1);
    gpuRenderPass->clearValues.resize(colorAttachmentCount + 1);
    gpuRenderPass->beginBarriers.resize(colorAttachmentCount + 1, { VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER });
    gpuRenderPass->endBarriers.resize(colorAttachmentCount + 1, { VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER });
    for (size_t i = 0u; i < colorAttachmentCount; i++)
    {
        auto &attachment = gpuRenderPass->colorAttachments[i];
        auto beginLayout = MapVkImageLayout(attachment.beginLayout);
        auto endLayout = MapVkImageLayout(attachment.endLayout);
        auto beginAccessMask = MapVkAccessFlags(attachment.beginLayout);
        auto endAccessMask = MapVkAccessFlags(attachment.endLayout);
        attachmentDescriptions[i].format = MapVkFormat(attachment.format);
        attachmentDescriptions[i].samples = MapVkSampleCount(attachment.sampleCount);
        attachmentDescriptions[i].loadOp = MapVkLoadOp(attachment.loadOp);
        attachmentDescriptions[i].storeOp = MapVkStoreOp(attachment.storeOp);
        attachmentDescriptions[i].stencilLoadOp = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
        attachmentDescriptions[i].stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
        attachmentDescriptions[i].initialLayout = beginLayout;
        attachmentDescriptions[i].finalLayout = endLayout;

        auto &beginBarrier = gpuRenderPass->beginBarriers[i];
        beginBarrier.srcAccessMask = 0;
        beginBarrier.dstAccessMask = beginAccessMask;
        beginBarrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
        beginBarrier.newLayout = beginLayout;
        beginBarrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        beginBarrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        beginBarrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        beginBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        beginBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;

        auto &endBarrier = gpuRenderPass->endBarriers[i];
        endBarrier.srcAccessMask = beginAccessMask;
        endBarrier.dstAccessMask = endAccessMask;
        endBarrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED; // TODO: we get a layout mismatch validation error if pass beginLayout here, probably a bug in the validation layer
        endBarrier.newLayout = endLayout;
        endBarrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        endBarrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        endBarrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        endBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        endBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
    }
    auto &depthStencilAttachment = gpuRenderPass->depthStencilAttachment;
    auto beginLayout = MapVkImageLayout(depthStencilAttachment.beginLayout);
    auto endLayout = MapVkImageLayout(depthStencilAttachment.endLayout);
    auto beginAccessMask = MapVkAccessFlags(depthStencilAttachment.beginLayout);
    auto endAccessMask = MapVkAccessFlags(depthStencilAttachment.endLayout);
    auto aspectMask = GFX_FORMAT_INFOS[(uint)depthStencilAttachment.format].hasStencil ?
        VK_IMAGE_ASPECT_DEPTH_BIT | VK_IMAGE_ASPECT_STENCIL_BIT : VK_IMAGE_ASPECT_DEPTH_BIT;
    attachmentDescriptions[colorAttachmentCount].format = MapVkFormat(depthStencilAttachment.format);
    attachmentDescriptions[colorAttachmentCount].samples = MapVkSampleCount(depthStencilAttachment.sampleCount);
    attachmentDescriptions[colorAttachmentCount].loadOp = MapVkLoadOp(depthStencilAttachment.depthLoadOp);
    attachmentDescriptions[colorAttachmentCount].storeOp = MapVkStoreOp(depthStencilAttachment.depthStoreOp);
    attachmentDescriptions[colorAttachmentCount].stencilLoadOp = MapVkLoadOp(depthStencilAttachment.stencilLoadOp);
    attachmentDescriptions[colorAttachmentCount].stencilStoreOp = MapVkStoreOp(depthStencilAttachment.stencilStoreOp);
    attachmentDescriptions[colorAttachmentCount].initialLayout = MapVkImageLayout(depthStencilAttachment.beginLayout);
    attachmentDescriptions[colorAttachmentCount].finalLayout = MapVkImageLayout(depthStencilAttachment.endLayout);

    auto &beginBarrier = gpuRenderPass->beginBarriers[colorAttachmentCount];
    beginBarrier.srcAccessMask = 0;
    beginBarrier.dstAccessMask = beginAccessMask;
    beginBarrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
    beginBarrier.newLayout = beginLayout;
    beginBarrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    beginBarrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    beginBarrier.subresourceRange.aspectMask = aspectMask;
    beginBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    beginBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;

    auto &endBarrier = gpuRenderPass->endBarriers[colorAttachmentCount];
    endBarrier.srcAccessMask = beginAccessMask;
    endBarrier.dstAccessMask = endAccessMask;
    endBarrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED; // TODO: we get a layout mismatch validation error if pass beginLayout here, probably a bug in the validation layer
    endBarrier.newLayout = endLayout;
    endBarrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    endBarrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    endBarrier.subresourceRange.aspectMask = aspectMask;
    endBarrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
    endBarrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;

    auto subpassCount = gpuRenderPass->subPasses.size();
    vector<VkSubpassDescription>::type subpassDescriptions(1, { VK_PIPELINE_BIND_POINT_GRAPHICS });
    vector<VkAttachmentReference>::type attachmentReferences;
    if (subpassCount) // pass on user-specified subpasses
    {
        subpassDescriptions.resize(subpassCount);
        for (size_t i = 0u; i < subpassCount; i++)
        {
            auto &subpass = gpuRenderPass->subPasses[i];
            subpassDescriptions[i].pipelineBindPoint = MapVkPipelineBindPoint(subpass.bindPoint);
            // TODO
        }
    }
    else // generate a default subpass from attachment info
    {
        for (size_t i = 0u; i < colorAttachmentCount; i++)
        {
            attachmentReferences.push_back({ i, VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL });
        }
        attachmentReferences.push_back({ colorAttachmentCount, VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL });
        subpassDescriptions[0].colorAttachmentCount = attachmentReferences.size() - 1;
        subpassDescriptions[0].pColorAttachments = attachmentReferences.data();
        subpassDescriptions[0].pDepthStencilAttachment = &attachmentReferences.back();
    }

    VkRenderPassCreateInfo renderPassCreateInfo{ VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO };
    renderPassCreateInfo.attachmentCount = attachmentDescriptions.size();
    renderPassCreateInfo.pAttachments = attachmentDescriptions.data();
    renderPassCreateInfo.subpassCount = subpassDescriptions.size();
    renderPassCreateInfo.pSubpasses = subpassDescriptions.data();

    VK_CHECK(vkCreateRenderPass(device->gpuDevice()->vkDevice, &renderPassCreateInfo, nullptr, &gpuRenderPass->vkRenderPass));
}

void CCVKCmdFuncDestroyRenderPass(CCVKDevice* device, CCVKGPURenderPass* gpuRenderPass)
{
    if (gpuRenderPass->vkRenderPass != VK_NULL_HANDLE)
    {
        vkDestroyRenderPass(device->gpuDevice()->vkDevice, gpuRenderPass->vkRenderPass, nullptr);
        gpuRenderPass->vkRenderPass = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncGetDeviceQueue(CCVKDevice* device, CCVKGPUQueue* gpuQueue)
{
    uint queueType = 0u;
    VkBool32 needPresentable = VK_FALSE;
    switch (gpuQueue->type)
    {
    case GFXQueueType::GRAPHICS: queueType = VK_QUEUE_GRAPHICS_BIT; needPresentable = VK_TRUE; break;
    case GFXQueueType::COMPUTE: queueType = VK_QUEUE_COMPUTE_BIT; break;
    case GFXQueueType::TRANSFER: queueType = VK_QUEUE_TRANSFER_BIT; break;
    }

    const CCVKGPUContext* context = ((CCVKContext*)device->getContext())->gpuContext();

    auto queueCount = context->queueFamilyProperties.size();
    for (size_t i = 0u; i < queueCount; ++i)
    {
        const VkQueueFamilyProperties &properties = context->queueFamilyProperties[i];
        const VkBool32 isPresentable = context->queueFamilyPresentables[i];
        if (properties.queueCount > 0 && (properties.queueFlags & queueType) && (!needPresentable || isPresentable))
        {
            vkGetDeviceQueue(device->gpuDevice()->vkDevice, i, 0, &gpuQueue->vkQueue);
            gpuQueue->queueFamilyIndex = i;
            break;
        }
    }
}

void CCVKCmdFuncCreateCommandPool(CCVKDevice* device, CCVKGPUCommandPool* gpuCommandPool)
{
    VkCommandPoolCreateInfo createInfo{ VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO };
    createInfo.queueFamilyIndex = ((CCVKQueue*)device->getQueue())->gpuQueue()->queueFamilyIndex;
    createInfo.flags = VK_COMMAND_POOL_CREATE_TRANSIENT_BIT;

    VK_CHECK(vkCreateCommandPool(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuCommandPool->vkCommandPool));
}

void CCVKCmdFuncDestroyCommandPool(CCVKDevice* device, CCVKGPUCommandPool* gpuCommandPool)
{
    if (gpuCommandPool->vkCommandPool != VK_NULL_HANDLE)
    {
        vkDestroyCommandPool(device->gpuDevice()->vkDevice, gpuCommandPool->vkCommandPool, nullptr);
        gpuCommandPool->vkCommandPool = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncAllocateCommandBuffer(CCVKDevice* device, CCVKGPUCommandBuffer* gpuCommandBuffer)
{
    CCVKGPUCommandPool* commandPool = gpuCommandBuffer->commandPool;
    auto &availableList = commandPool->commandBuffers[(uint)gpuCommandBuffer->type];

    if (availableList.size())
    {
        gpuCommandBuffer->vkCommandBuffer = availableList.pop();
    }
    else
    {
        VkCommandBufferAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO };
        allocateInfo.commandPool = commandPool->vkCommandPool;
        allocateInfo.commandBufferCount = 1;
        allocateInfo.level = MapVkCommandBufferLevel(gpuCommandBuffer->type);

        VK_CHECK(vkAllocateCommandBuffers(device->gpuDevice()->vkDevice, &allocateInfo, &gpuCommandBuffer->vkCommandBuffer));
    }
}

void CCVKCmdFuncFreeCommandBuffer(CCVKDevice* device, CCVKGPUCommandBuffer* gpuCommandBuffer)
{
    if (gpuCommandBuffer->vkCommandBuffer)
    {
        gpuCommandBuffer->commandPool->usedCommandBuffers[(uint)gpuCommandBuffer->type].push(gpuCommandBuffer->vkCommandBuffer);
        gpuCommandBuffer->vkCommandBuffer = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer)
{
    auto vkDevice = device->gpuDevice()->vkDevice;
    bool isHostVisible = gpuBuffer->memUsage & GFXMemoryUsage::HOST;

    VkBufferCreateInfo createInfo{ VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO };
    createInfo.size = gpuBuffer->size;
    createInfo.usage = MapVkBufferUsageFlagBits(gpuBuffer->usage);

    VK_CHECK(vkCreateBuffer(vkDevice, &createInfo, nullptr, &gpuBuffer->vkBuffer));

    VkMemoryRequirements memoryRequirements;
    vkGetBufferMemoryRequirements(vkDevice, gpuBuffer->vkBuffer, &memoryRequirements);

    uint memoryTypeIndex = selectMemoryType(
        device->gpuContext()->physicalDeviceMemoryProperties,
        memoryRequirements.memoryTypeBits, isHostVisible ?
        VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT :
        VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT);

    VkMemoryAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO };
    allocateInfo.allocationSize = memoryRequirements.size;
    allocateInfo.memoryTypeIndex = memoryTypeIndex;

    VK_CHECK(vkAllocateMemory(vkDevice, &allocateInfo, nullptr, &gpuBuffer->vkDeviceMemory));

    VK_CHECK(vkBindBufferMemory(vkDevice, gpuBuffer->vkBuffer, gpuBuffer->vkDeviceMemory, 0));
}

void CCVKCmdFuncDestroyBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer)
{
    auto vkDevice = device->gpuDevice()->vkDevice;

    if (gpuBuffer->vkDeviceMemory)
    {
        vkFreeMemory(vkDevice, gpuBuffer->vkDeviceMemory, nullptr);
        gpuBuffer->vkDeviceMemory = VK_NULL_HANDLE;
    }

    if (gpuBuffer->vkBuffer)
    {
        vkDestroyBuffer(vkDevice, gpuBuffer->vkBuffer, nullptr);
        gpuBuffer->vkBuffer = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncResizeBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer)
{
    CCVKCmdFuncDestroyBuffer(device, gpuBuffer);
    CCVKCmdFuncCreateBuffer(device, gpuBuffer);
}

void CCVKCmdFuncUpdateBuffer(CCVKDevice* device, CCVKGPUBuffer* gpuBuffer, void* buffer, uint offset, uint size)
{
    if (gpuBuffer->memUsage & GFXMemoryUsage::HOST)
    {
        void *buf;
        VK_CHECK(vkMapMemory(device->gpuDevice()->vkDevice, gpuBuffer->vkDeviceMemory, 0, gpuBuffer->size, 0, &buf));
        memcpy((unsigned char*)buf + offset, buffer, size);
        vkUnmapMemory(device->gpuDevice()->vkDevice, gpuBuffer->vkDeviceMemory);
    }
    else
    {
        //auto vkDevice = device->gpuDevice()->vkDevice;
        // TODO
    }
}

bool CCVKCmdFuncCreateTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture)
{
    auto format = MapVkFormat(gpuTexture->format);
    auto features = MapVkFormatFeatureFlags(gpuTexture->usage);
    VkImageTiling tiling = VK_IMAGE_TILING_LINEAR; // TODO: use staging buffer to upload data

    VkFormatProperties formatProperties;
    vkGetPhysicalDeviceFormatProperties(device->gpuContext()->physicalDevice, format, &formatProperties);

    if (!(formatProperties.linearTilingFeatures & features)) // TODO: change to optimal tiling
    {
        if (formatProperties.optimalTilingFeatures & features)
        {
            tiling = VK_IMAGE_TILING_OPTIMAL;
        }
        else
        {
            return false;
        }
    }
    
    auto vkDevice = device->gpuDevice()->vkDevice;

    VkImageCreateInfo createInfo{ VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO };
    createInfo.flags = MapVkImageCreateFlags(gpuTexture->viewType);
    createInfo.imageType = MapVkImageType(gpuTexture->type);
    createInfo.format = format;
    createInfo.extent = { gpuTexture->width, gpuTexture->height, gpuTexture->depth };
    createInfo.mipLevels = gpuTexture->mipLevel;
    createInfo.arrayLayers = gpuTexture->arrayLayer;
    createInfo.samples = MapVkSampleCount(gpuTexture->samples);
    createInfo.tiling = tiling;
    createInfo.usage = MapVkImageUsageFlagBits(gpuTexture->usage);
    createInfo.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;

    VK_CHECK(vkCreateImage(vkDevice, &createInfo, nullptr, &gpuTexture->vkImage));

    VkMemoryRequirements memoryRequirements;
    vkGetImageMemoryRequirements(vkDevice, gpuTexture->vkImage, &memoryRequirements);

    uint memoryTypeIndex = selectMemoryType(
        ((CCVKContext*)device->getContext())->gpuContext()->physicalDeviceMemoryProperties,
        memoryRequirements.memoryTypeBits, VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT);

    VkMemoryAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO };
    allocateInfo.allocationSize = memoryRequirements.size;
    allocateInfo.memoryTypeIndex = memoryTypeIndex;

    VK_CHECK(vkAllocateMemory(vkDevice, &allocateInfo, nullptr, &gpuTexture->vkDeviceMemory));

    VK_CHECK(vkBindImageMemory(vkDevice, gpuTexture->vkImage, gpuTexture->vkDeviceMemory, 0));

    gpuTexture->currentLayout = MapVkImageLayout(gpuTexture->usage, gpuTexture->format);

    if (gpuTexture->currentLayout != VK_IMAGE_LAYOUT_UNDEFINED)
    {
        CCVKGPUCommandBuffer cmdBuff;
        beginOneTimeCommands(device, &cmdBuff);

        VkImageMemoryBarrier barrier{ VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER };
        barrier.image = gpuTexture->vkImage;
        barrier.srcAccessMask = 0;
        barrier.dstAccessMask = MapVkAccessFlags(gpuTexture->usage, gpuTexture->format);
        barrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
        barrier.newLayout = gpuTexture->currentLayout;
        barrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
        barrier.subresourceRange.aspectMask = MapVkImageAspectFlags(gpuTexture->format);
        barrier.subresourceRange.levelCount = VK_REMAINING_MIP_LEVELS;
        barrier.subresourceRange.layerCount = VK_REMAINING_ARRAY_LAYERS;
        vkCmdPipelineBarrier(cmdBuff.vkCommandBuffer, VK_PIPELINE_STAGE_HOST_BIT, MapVkPipelineStageFlags(gpuTexture->usage), 0,
            0, nullptr, 0, nullptr, 1, &barrier);

        endOneTimeCommands(device, &cmdBuff);
    }

    return true;
}

void CCVKCmdFuncDestroyTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture)
{
    auto vkDevice = device->gpuDevice()->vkDevice;

    if (gpuTexture->vkImage)
    {
        vkDestroyImage(vkDevice, gpuTexture->vkImage, nullptr);
        gpuTexture->vkImage = VK_NULL_HANDLE;
    }

    if (gpuTexture->vkDeviceMemory)
    {
        vkFreeMemory(vkDevice, gpuTexture->vkDeviceMemory, nullptr);
        gpuTexture->vkDeviceMemory = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncResizeTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture)
{
    CCVKCmdFuncDestroyTexture(device, gpuTexture);
    CCVKCmdFuncCreateTexture(device, gpuTexture);
}

void CCVKCmdFuncCreateTextureView(CCVKDevice* device, CCVKGPUTextureView* gpuTextureView)
{
    VkImageViewCreateInfo createInfo{ VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO };
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

void CCVKCmdFuncDestroyTextureView(CCVKDevice* device, CCVKGPUTextureView* gpuTextureView)
{
    if (gpuTextureView->vkImageView != VK_NULL_HANDLE)
    {
        vkDestroyImageView(device->gpuDevice()->vkDevice, gpuTextureView->vkImageView, nullptr);
        gpuTextureView->vkImageView = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateSampler(CCVKDevice* device, CCVKGPUSampler* gpuSampler)
{
    VkSamplerCreateInfo createInfo{ VK_STRUCTURE_TYPE_SAMPLER_CREATE_INFO };

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

void CCVKCmdFuncDestroySampler(CCVKDevice* device, CCVKGPUSampler* gpuSampler)
{
    if (gpuSampler->vkSampler!= VK_NULL_HANDLE)
    {
        vkDestroySampler(device->gpuDevice()->vkDevice, gpuSampler->vkSampler, nullptr);
        gpuSampler->vkSampler = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateShader(CCVKDevice* device, CCVKGPUShader* gpuShader)
{
    for (auto &stage : gpuShader->gpuStages)
    {
        auto spirv = GLSL2SPIRV(stage.type, "#version 450\n" + stage.source, ((CCVKContext*)device->getContext())->minorVersion());
        VkShaderModuleCreateInfo createInfo{ VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO };
        createInfo.codeSize = spirv.size() * sizeof(unsigned int);
        createInfo.pCode = spirv.data();
        VK_CHECK(vkCreateShaderModule(device->gpuDevice()->vkDevice, &createInfo, nullptr, &stage.vkShader));
    }
    CC_LOG_INFO("Shader '%s' compilation succeeded.", gpuShader->name.c_str());
}

void CCVKCmdFuncDestroyShader(CCVKDevice* device, CCVKGPUShader* gpuShader)
{
    for (auto &stage : gpuShader->gpuStages)
    {
        vkDestroyShaderModule(device->gpuDevice()->vkDevice, stage.vkShader, nullptr);
        stage.vkShader = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateInputAssembler(CCVKDevice* device, CCVKGPUInputAssembler* gpuInputAssembler)
{
    auto vbCount = gpuInputAssembler->gpuVertexBuffers.size();
    gpuInputAssembler->vertexBuffers.resize(vbCount);
    gpuInputAssembler->vertexBufferOffsets.resize(vbCount);

    for (size_t i = 0; i < vbCount; i++)
    {
        gpuInputAssembler->vertexBuffers[i] = gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
        gpuInputAssembler->vertexBufferOffsets[i] = 0;
    }
}

void CCVKCmdFuncDestroyInputAssembler(CCVKDevice* device, CCVKGPUInputAssembler* gpuInputAssembler)
{
    gpuInputAssembler->vertexBuffers.clear();
    gpuInputAssembler->vertexBufferOffsets.clear();
}

void CCVKCmdFuncCreateFramebuffer(CCVKDevice* device, CCVKGPUFramebuffer* gpuFramebuffer)
{
    if (!gpuFramebuffer->isOffscreen)
    {
        gpuFramebuffer->swapchain = device->gpuSwapchain();
        return;
    }

    auto colorViewCount = gpuFramebuffer->gpuColorViews.size();
    vector<VkImageView>::type attachments(colorViewCount + (gpuFramebuffer->gpuDepthStencilView ? 1 : 0));
    for (size_t i = 0u; i < colorViewCount; i++)
    {
        attachments[i] = gpuFramebuffer->gpuColorViews[i]->vkImageView;
    }
    if (gpuFramebuffer->gpuDepthStencilView)
    {
        attachments[colorViewCount] = gpuFramebuffer->gpuDepthStencilView->vkImageView;
    }

    VkFramebufferCreateInfo createInfo{ VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO };
    createInfo.renderPass = gpuFramebuffer->gpuRenderPass->vkRenderPass;
    createInfo.attachmentCount = attachments.size();
    createInfo.pAttachments = attachments.data();
    createInfo.width = colorViewCount ? gpuFramebuffer->gpuColorViews[0]->gpuTexture->width : 1;
    createInfo.height = colorViewCount ? gpuFramebuffer->gpuColorViews[0]->gpuTexture->height : 1;
    createInfo.layers = 1;

    VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuFramebuffer->vkFramebuffer));
}

void CCVKCmdFuncDestroyFramebuffer(CCVKDevice* device, CCVKGPUFramebuffer* gpuFramebuffer)
{
    if (gpuFramebuffer->vkFramebuffer != VK_NULL_HANDLE)
    {
        vkDestroyFramebuffer(device->gpuDevice()->vkDevice, gpuFramebuffer->vkFramebuffer, nullptr);
        gpuFramebuffer->vkFramebuffer = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout, GFXBindingUnitList bindings)
{
    auto count = bindings.size();

    vector<VkDescriptorSetLayoutBinding>::type setBindings(count);
    for (size_t i = 0u; i < count; i++)
    {
        auto &binding = bindings[i];
        setBindings[i].binding = binding.binding;
        setBindings[i].descriptorType = MapVkDescriptorType(binding.type);
        setBindings[i].descriptorCount = binding.count;
        setBindings[i].stageFlags = MapVkShaderStageFlags(binding.shaderStages);
    }

    VkDescriptorSetLayoutCreateInfo setCreateInfo{ VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO };
    setCreateInfo.bindingCount = count;
    setCreateInfo.pBindings = setBindings.data();

    VK_CHECK(vkCreateDescriptorSetLayout(device->gpuDevice()->vkDevice, &setCreateInfo, nullptr, &gpuBindingLayout->vkDescriptorSetLayout));

    vector<VkDescriptorPoolSize>::type poolSizes;
    for (auto & binding : setBindings)
    {
        bool found = false;
        for (auto &poolSize : poolSizes)
        {
            if (poolSize.type == binding.descriptorType)
            {
                poolSize.descriptorCount++;
                found = true;
                break;
            }
        }
        if (!found)
        {
            poolSizes.push_back({ binding.descriptorType, 1 });
        }
    }

    VkDescriptorPoolCreateInfo poolInfo{ VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO };
    poolInfo.poolSizeCount = poolSizes.size();
    poolInfo.pPoolSizes = poolSizes.data();
    poolInfo.maxSets = 1;

    VK_CHECK(vkCreateDescriptorPool(device->gpuDevice()->vkDevice, &poolInfo, nullptr, &gpuBindingLayout->vkDescriptorPool));

    VkDescriptorSetAllocateInfo allocInfo{ VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO };
    allocInfo.descriptorPool = gpuBindingLayout->vkDescriptorPool;
    allocInfo.descriptorSetCount = 1;
    allocInfo.pSetLayouts = &gpuBindingLayout->vkDescriptorSetLayout;

    VK_CHECK(vkAllocateDescriptorSets(device->gpuDevice()->vkDevice, &allocInfo, &gpuBindingLayout->vkDescriptorSet));

    gpuBindingLayout->bindings.resize(bindings.size(), { VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET });
    for (size_t i = 0u; i < count; i++)
    {
        auto &binding = gpuBindingLayout->bindings[i];
        binding.dstSet = gpuBindingLayout->vkDescriptorSet;
        binding.dstBinding = setBindings[i].binding;
        binding.dstArrayElement = 0;
        binding.descriptorCount = 1;
        binding.descriptorType = setBindings[i].descriptorType;
        switch (binding.descriptorType)
        {
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

void CCVKCmdFuncDestroyBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout)
{
    for (auto &binding : gpuBindingLayout->bindings)
    {
        CC_SAFE_DELETE(binding.pBufferInfo);
        CC_SAFE_DELETE(binding.pImageInfo);
        CC_SAFE_DELETE(binding.pTexelBufferView);
    }
    gpuBindingLayout->bindings.clear();

    gpuBindingLayout->vkDescriptorSet = VK_NULL_HANDLE;

    if (gpuBindingLayout->vkDescriptorPool != VK_NULL_HANDLE)
    {
        vkDestroyDescriptorPool(device->gpuDevice()->vkDevice, gpuBindingLayout->vkDescriptorPool, nullptr);
        gpuBindingLayout->vkDescriptorPool = VK_NULL_HANDLE;
    }

    if (gpuBindingLayout->vkDescriptorSetLayout != VK_NULL_HANDLE)
    {
        vkDestroyDescriptorSetLayout(device->gpuDevice()->vkDevice, gpuBindingLayout->vkDescriptorSetLayout, nullptr);
        gpuBindingLayout->vkDescriptorSetLayout = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreatePipelineLayout(CCVKDevice* device, CCVKGPUPipelineLayout* gpuPipelineLayout)
{
    auto count = gpuPipelineLayout->gpuBindingLayouts.size();
    vector<VkDescriptorSetLayout>::type descriptorSetLayouts(count);
    for (size_t i = 0u; i < count; i++)
    {
        auto layout = gpuPipelineLayout->gpuBindingLayouts[i];
        descriptorSetLayouts[i] = layout->vkDescriptorSetLayout;
    }

    VkPipelineLayoutCreateInfo createInfo{ VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO };
    createInfo.setLayoutCount = count;
    createInfo.pSetLayouts = descriptorSetLayouts.data();

    VK_CHECK(vkCreatePipelineLayout(device->gpuDevice()->vkDevice, &createInfo, nullptr, &gpuPipelineLayout->vkPipelineLayout));
}

void CCVKCmdFuncDestroyPipelineLayout(CCVKDevice* device, CCVKGPUPipelineLayout* gpuPipelineLayout)
{
    if (gpuPipelineLayout->vkPipelineLayout != VK_NULL_HANDLE)
    {
        vkDestroyPipelineLayout(device->gpuDevice()->vkDevice, gpuPipelineLayout->vkPipelineLayout, nullptr);
        gpuPipelineLayout->vkPipelineLayout = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreatePipelineState(CCVKDevice* device, CCVKGPUPipelineState* gpuPipelineState)
{
    VkGraphicsPipelineCreateInfo createInfo{ VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO };

    ///////////////////// Shader Stage /////////////////////

    auto &stages = gpuPipelineState->gpuShader->gpuStages;
    auto stageCount = stages.size();
    vector<VkPipelineShaderStageCreateInfo>::type stageInfos(stageCount, { VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO });
    for (size_t i = 0u; i < stageCount; i++)
    {
        stageInfos[i].stage = MapVkShaderStageFlagBits(stages[i].type);
        stageInfos[i].module = stages[i].vkShader;
        stageInfos[i].pName = "main";
    }
    createInfo.stageCount = stageCount;
    createInfo.pStages = stageInfos.data();

    ///////////////////// Input State /////////////////////

    auto &attributes = gpuPipelineState->inputState.attributes;
    auto attributeCount = attributes.size();
    size_t bindingCount = 1u;
    for (size_t i = 0u; i < attributeCount; i++)
    {
        auto &attr = attributes[i];
        bindingCount = std::max(bindingCount, attr.stream + 1);
    }

    vector<VkVertexInputBindingDescription>::type bindingDescriptions(bindingCount);
    for (size_t i = 0u; i < bindingCount; i++)
    {
        bindingDescriptions[i].binding = i;
        bindingDescriptions[i].stride = 0;
        bindingDescriptions[i].inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
    }
    for (size_t i = 0u; i < attributeCount; i++)
    {
        auto &attr = attributes[i];
        bindingDescriptions[attr.stream].stride += GFX_FORMAT_INFOS[(uint)attr.format].size;
        if (attr.isInstanced)
        {
            bindingDescriptions[attr.stream].inputRate = VK_VERTEX_INPUT_RATE_INSTANCE;
        }
    }

    vector<uint>::type offsets(bindingCount, 0);
    vector<VkVertexInputAttributeDescription>::type attributeDescriptions(attributeCount);
    for (size_t i = 0u; i < attributeCount; i++)
    {
        auto &attr = attributes[i];
        attributeDescriptions[i].location = i;
        attributeDescriptions[i].binding = attr.stream;
        attributeDescriptions[i].format = MapVkFormat(attr.format);
        attributeDescriptions[i].offset = offsets[attr.stream];
        offsets[attr.stream] += GFX_FORMAT_INFOS[(uint)attr.format].size;
    }

    VkPipelineVertexInputStateCreateInfo vertexInput{ VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO };
    vertexInput.vertexBindingDescriptionCount = bindingCount;
    vertexInput.pVertexBindingDescriptions = bindingDescriptions.data();
    vertexInput.vertexAttributeDescriptionCount = attributeCount;
    vertexInput.pVertexAttributeDescriptions = attributeDescriptions.data();
    createInfo.pVertexInputState = &vertexInput;

    ///////////////////// Input Asembly State /////////////////////

    VkPipelineInputAssemblyStateCreateInfo inputAssembly{ VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO };
    inputAssembly.topology = VK_PRIMITIVE_MODES[(uint)gpuPipelineState->primitive];
    createInfo.pInputAssemblyState = &inputAssembly;

    ///////////////////// Dynamic State /////////////////////

    vector<VkDynamicState>::type dynamicStates{ VK_DYNAMIC_STATE_VIEWPORT, VK_DYNAMIC_STATE_SCISSOR };
    InsertVkDynamicStates(dynamicStates, gpuPipelineState->dynamicStates);

    VkPipelineDynamicStateCreateInfo dynamicState{ VK_STRUCTURE_TYPE_PIPELINE_DYNAMIC_STATE_CREATE_INFO };
    dynamicState.dynamicStateCount = dynamicStates.size();
    dynamicState.pDynamicStates = dynamicStates.data();
    createInfo.pDynamicState = &dynamicState;

    ///////////////////// Viewport State /////////////////////

    VkPipelineViewportStateCreateInfo viewportState{ VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO };
    viewportState.viewportCount = 1; // dynamic by default
    viewportState.scissorCount = 1; // dynamic by default
    createInfo.pViewportState = &viewportState;

    ///////////////////// Rasterization State /////////////////////

    VkPipelineRasterizationStateCreateInfo rasterizationState{ VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO };

    //rasterizationState.depthClampEnable;
    rasterizationState.rasterizerDiscardEnable = gpuPipelineState->rs.isDiscard;
    rasterizationState.polygonMode = VK_POLYGON_MODES[(uint)gpuPipelineState->rs.polygonMode];
    rasterizationState.cullMode = VK_CULL_MODES[(uint)gpuPipelineState->rs.cullMode];
    rasterizationState.frontFace = gpuPipelineState->rs.isFrontFaceCCW ? VK_FRONT_FACE_COUNTER_CLOCKWISE : VK_FRONT_FACE_CLOCKWISE;
    rasterizationState.depthBiasEnable = !!gpuPipelineState->rs.depthBias;
    rasterizationState.depthBiasConstantFactor = gpuPipelineState->rs.depthBias;
    rasterizationState.depthBiasClamp = gpuPipelineState->rs.depthBiasClamp;
    rasterizationState.depthBiasSlopeFactor = gpuPipelineState->rs.depthBiasSlop;
    rasterizationState.lineWidth = gpuPipelineState->rs.lineWidth;
    createInfo.pRasterizationState = &rasterizationState;

    ///////////////////// Multisample State /////////////////////

    VkPipelineMultisampleStateCreateInfo multisampleState{ VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO };
    multisampleState.rasterizationSamples = VK_SAMPLE_COUNT_1_BIT;
    multisampleState.alphaToCoverageEnable = gpuPipelineState->bs.isA2C;
    //multisampleState.sampleShadingEnable;
    //multisampleState.minSampleShading;
    //multisampleState.pSampleMask;
    //multisampleState.alphaToOneEnable;
    createInfo.pMultisampleState = &multisampleState;

    ///////////////////// Depth Stencil State /////////////////////

    VkPipelineDepthStencilStateCreateInfo depthStencilState = { VK_STRUCTURE_TYPE_PIPELINE_DEPTH_STENCIL_STATE_CREATE_INFO };
    depthStencilState.depthTestEnable = gpuPipelineState->dss.depthTest;
    depthStencilState.depthWriteEnable = gpuPipelineState->dss.depthWrite;
    depthStencilState.depthCompareOp = VK_CMP_FUNCS[(uint)gpuPipelineState->dss.depthFunc];
    depthStencilState.stencilTestEnable = gpuPipelineState->dss.stencilTestFront;
    depthStencilState.front =
    {
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilFailOpFront],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilPassOpFront],
        VK_STENCIL_OPS[(uint)gpuPipelineState->dss.stencilZFailOpFront],
        VK_CMP_FUNCS[(uint)gpuPipelineState->dss.stencilFuncFront],
        gpuPipelineState->dss.stencilReadMaskFront,
        gpuPipelineState->dss.stencilWriteMaskFront,
        gpuPipelineState->dss.stencilRefFront,
    };
    depthStencilState.back =
    {
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

    auto blendTargetCount = gpuPipelineState->bs.targets.size();
    vector<VkPipelineColorBlendAttachmentState>::type blendTargets(blendTargetCount);
    for (size_t i = 0u; i < blendTargetCount; i++)
    {
        auto &target = gpuPipelineState->bs.targets[i];
        blendTargets[i].blendEnable = target.blend;
        blendTargets[i].srcColorBlendFactor = VK_BLEND_FACTORS[(uint)target.blendSrc];
        blendTargets[i].dstColorBlendFactor = VK_BLEND_FACTORS[(uint)target.blendDst];
        blendTargets[i].colorBlendOp = VK_BLEND_OPS[(uint)target.blendEq];
        blendTargets[i].srcAlphaBlendFactor = VK_BLEND_FACTORS[(uint)target.blendSrcAlpha];
        blendTargets[i].dstAlphaBlendFactor = VK_BLEND_FACTORS[(uint)target.blendDstAlpha];
        blendTargets[i].alphaBlendOp = VK_BLEND_OPS[(uint)target.blendAlphaEq];
        blendTargets[i].colorWriteMask = MapVkColorComponentFlags(target.blendColorMask);
    }
    auto &blendColor = gpuPipelineState->bs.blendColor;

    VkPipelineColorBlendStateCreateInfo colorBlendState{ VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO };
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

void CCVKCmdFuncDestroyPipelineState(CCVKDevice* device, CCVKGPUPipelineState* gpuPipelineState)
{
    if (gpuPipelineState->vkPipeline != VK_NULL_HANDLE)
    {
        vkDestroyPipeline(device->gpuDevice()->vkDevice, gpuPipelineState->vkPipeline, nullptr);
        gpuPipelineState->vkPipeline = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCopyBuffersToTexture(CCVKDevice* device, uint8_t* const* buffers, CCVKGPUTexture* gpuTexture, const GFXBufferTextureCopyList& regions)
{
    //bool isCompressed = GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed;
    uint n = 0u, w, h;

    // TODO
    void *buffer;
    VK_CHECK(vkMapMemory(device->gpuDevice()->vkDevice, gpuTexture->vkDeviceMemory, 0, gpuTexture->size, 0, &buffer));

    for (size_t i = 0; i < regions.size(); ++i)
    {
        const GFXBufferTextureCopy& region = regions[i];
        w = region.texExtent.width;
        h = region.texExtent.height;
        for (uint m = region.texSubres.baseMipLevel; m < region.texSubres.baseMipLevel + region.texSubres.levelCount; ++m)
        {
            uint8_t* buff = region.buffOffset + region.buffTexHeight * region.buffStride + buffers[n++];
            memcpy(buffer, buff, w * h * 4);

            w = std::max(w >> 1, 1U);
            h = std::max(h >> 1, 1U);
        }
    }

    vkUnmapMemory(device->gpuDevice()->vkDevice, gpuTexture->vkDeviceMemory);
}

NS_CC_END
