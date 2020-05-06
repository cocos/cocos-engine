#include "VKStd.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "VKQueue.h"
#include "VKContext.h"
#include "VKStateCache.h"
#include "VKSPIRV.h"

#define BUFFER_OFFSET(idx) (static_cast<char*>(0) + (idx))

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
        uint32_t flags = 0;
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

    VkImageUsageFlagBits MapVkImageUsageFlagBits(GFXTextureUsage usage)
    {
        uint32_t flags = 0;
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

    uint32_t selectMemoryType(const VkPhysicalDeviceMemoryProperties& memoryProperties, uint32_t memoryTypeBits, VkMemoryPropertyFlags flags)
    {
        for (uint32_t i = 0; i < memoryProperties.memoryTypeCount; ++i)
            if ((memoryTypeBits & (1 << i)) != 0 && (memoryProperties.memoryTypes[i].propertyFlags & flags) == flags)
                return i;

        CCASSERT(false, "No compatible memory type found.");
        return ~0u;
    }

    VkImageCreateFlags MapVkImageCreateFlags(GFXTextureViewType type)
    {
        uint32_t res = 0;
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
        case cocos2d::GFXBindingType::SAMPLER: return VK_DESCRIPTOR_TYPE_SAMPLER;
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
        uint32_t flags = 0;
        if (colorMask & GFXColorMask::R) flags |= VK_COLOR_COMPONENT_R_BIT;
        if (colorMask & GFXColorMask::G) flags |= VK_COLOR_COMPONENT_G_BIT;
        if (colorMask & GFXColorMask::B) flags |= VK_COLOR_COMPONENT_B_BIT;
        if (colorMask & GFXColorMask::A) flags |= VK_COLOR_COMPONENT_A_BIT;
        if (colorMask & GFXColorMask::ALL) flags |= VK_COLOR_COMPONENT_R_BIT | VK_COLOR_COMPONENT_G_BIT | VK_COLOR_COMPONENT_B_BIT | VK_COLOR_COMPONENT_A_BIT;
        return (VkColorComponentFlags)flags;
    }

    const VkShaderStageFlagBits VK_SHADER_TYPES[] =
    {
        VK_SHADER_STAGE_VERTEX_BIT,
        VK_SHADER_STAGE_TESSELLATION_CONTROL_BIT,
        VK_SHADER_STAGE_TESSELLATION_EVALUATION_BIT,
        VK_SHADER_STAGE_GEOMETRY_BIT,
        VK_SHADER_STAGE_FRAGMENT_BIT,
        VK_SHADER_STAGE_COMPUTE_BIT,
    };

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

    const VkCullModeFlags VK_CULL_MODES[] = {
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
}

void CCVKCmdFuncCreateRenderPass(CCVKDevice* device, CCVKGPURenderPass* gpuRenderPass)
{
    uint32_t colorAttachmentCount = gpuRenderPass->colorAttachments.size();
    vector<VkAttachmentDescription>::type attachmentDescriptions(colorAttachmentCount + 1);
    gpuRenderPass->clearValues.resize(colorAttachmentCount + 1);
    gpuRenderPass->beginBarriers.resize(colorAttachmentCount + 1, { VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER });
    gpuRenderPass->endBarriers.resize(colorAttachmentCount + 1, { VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER });
    for (uint32_t i = 0u; i < colorAttachmentCount; i++)
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

    uint32_t subpassCount = gpuRenderPass->subPasses.size();
    vector<VkSubpassDescription>::type subpassDescriptions(1, { VK_PIPELINE_BIND_POINT_GRAPHICS });
    vector<VkAttachmentReference>::type attachmentReferences;
    if (subpassCount) // pass on user-specified subpasses
    {
        subpassDescriptions.resize(subpassCount);
        for (uint32_t i = 0u; i < subpassCount; i++)
        {
            auto &subpass = gpuRenderPass->subPasses[i];
            subpassDescriptions[i].pipelineBindPoint = MapVkPipelineBindPoint(subpass.bindPoint);
            // TODO
        }
    }
    else // generate a default subpass from attachment info
    {
        for (uint32_t i = 0u; i < colorAttachmentCount; i++)
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
    uint32_t queueType = 0;
    VkBool32 needPresentable = VK_FALSE;
    switch (gpuQueue->type)
    {
    case GFXQueueType::GRAPHICS: queueType = VK_QUEUE_GRAPHICS_BIT; needPresentable = VK_TRUE; break;
    case GFXQueueType::COMPUTE: queueType = VK_QUEUE_COMPUTE_BIT; break;
    case GFXQueueType::TRANSFER: queueType = VK_QUEUE_TRANSFER_BIT; break;
    }

    const CCVKGPUContext* context = ((CCVKContext*)device->getContext())->gpuContext();

    size_t queueCount = context->queueFamilyProperties.size();
    for (uint32_t i = 0U; i < queueCount; ++i)
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
    VkCommandBufferLevel level = MapVkCommandBufferLevel(gpuCommandBuffer->type);

    if (commandPool->commandBuffers[level].size())
    {
        gpuCommandBuffer->vkCommandBuffer = commandPool->commandBuffers[level].pop();
    }
    else
    {
        VkCommandBufferAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO };
        allocateInfo.commandPool = gpuCommandBuffer->commandPool->vkCommandPool;
        allocateInfo.commandBufferCount = 1;
        allocateInfo.level = level;

        VK_CHECK(vkAllocateCommandBuffers(device->gpuDevice()->vkDevice, &allocateInfo, &gpuCommandBuffer->vkCommandBuffer));
    }
}

void CCVKCmdFuncFreeCommandBuffer(CCVKDevice* device, CCVKGPUCommandBuffer* gpuCommandBuffer)
{
    VkCommandBufferLevel level = MapVkCommandBufferLevel(gpuCommandBuffer->type);

    if (gpuCommandBuffer->vkCommandBuffer)
    {
        gpuCommandBuffer->commandPool->commandBuffers[level].push(gpuCommandBuffer->vkCommandBuffer);
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

    uint32_t memoryTypeIndex = selectMemoryType(
        ((CCVKContext*)device->getContext())->gpuContext()->physicalDeviceMemoryProperties,
        memoryRequirements.memoryTypeBits, isHostVisible ?
        VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT :
        VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT);

    VkMemoryAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO };
    allocateInfo.allocationSize = memoryRequirements.size;
    allocateInfo.memoryTypeIndex = memoryTypeIndex;

    VK_CHECK(vkAllocateMemory(vkDevice, &allocateInfo, nullptr, &gpuBuffer->vkDeviceMemory));

    VK_CHECK(vkBindBufferMemory(vkDevice, gpuBuffer->vkBuffer, gpuBuffer->vkDeviceMemory, 0));

    if (isHostVisible)
    {
        VK_CHECK(vkMapMemory(vkDevice, gpuBuffer->vkDeviceMemory, 0, gpuBuffer->size, 0, &gpuBuffer->buffer));
    }
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
        memcpy((unsigned char*)gpuBuffer->buffer + offset, buffer, size);
    }
    else
    {
        //auto vkDevice = device->gpuDevice()->vkDevice;
        // TODO
    }
}

void CCVKCmdFuncCreateTexture(CCVKDevice* device, CCVKGPUTexture* gpuTexture)
{
    auto vkDevice = device->gpuDevice()->vkDevice;

    VkImageCreateInfo createInfo{ VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO };
    createInfo.flags = MapVkImageCreateFlags(gpuTexture->viewType);
    createInfo.imageType = MapVkImageType(gpuTexture->type);
    createInfo.format = MapVkFormat(gpuTexture->format);
    createInfo.extent = { gpuTexture->width, gpuTexture->height, gpuTexture->depth };
    createInfo.mipLevels = gpuTexture->mipLevel;
    createInfo.arrayLayers = gpuTexture->arrayLayer;
    createInfo.samples = MapVkSampleCount(gpuTexture->samples);
    createInfo.tiling = VK_IMAGE_TILING_OPTIMAL;
    createInfo.usage = MapVkImageUsageFlagBits(gpuTexture->usage);
    createInfo.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;

    VK_CHECK(vkCreateImage(vkDevice, &createInfo, nullptr, &gpuTexture->vkImage));

    VkMemoryRequirements memoryRequirements;
    vkGetImageMemoryRequirements(vkDevice, gpuTexture->vkImage, &memoryRequirements);

    uint32_t memoryTypeIndex = selectMemoryType(
        ((CCVKContext*)device->getContext())->gpuContext()->physicalDeviceMemoryProperties,
        memoryRequirements.memoryTypeBits, VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT);

    VkMemoryAllocateInfo allocateInfo{ VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO };
    allocateInfo.allocationSize = memoryRequirements.size;
    allocateInfo.memoryTypeIndex = memoryTypeIndex;

    VK_CHECK(vkAllocateMemory(vkDevice, &allocateInfo, nullptr, &gpuTexture->vkDeviceMemory));

    VK_CHECK(vkBindImageMemory(vkDevice, gpuTexture->vkImage, gpuTexture->vkDeviceMemory, 0));
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
    VkImageAspectFlags aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
    auto &info = GFX_FORMAT_INFOS[(uint)gpuTextureView->format];
    if (info.hasDepth) { aspectMask = VK_IMAGE_ASPECT_DEPTH_BIT; }
    if (info.hasStencil) { aspectMask |= VK_IMAGE_ASPECT_STENCIL_BIT; }

    VkImageViewCreateInfo createInfo{ VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO };
    createInfo.image = gpuTextureView->gpuTexture->vkImage;
    createInfo.viewType = MapVkImageViewType(gpuTextureView->type);
    createInfo.format = MapVkFormat(gpuTextureView->format);
    createInfo.subresourceRange.aspectMask = aspectMask;
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

}

void CCVKCmdFuncDestroySampler(CCVKDevice* device, CCVKGPUSampler* gpuSampler)
{

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

    for (uint32_t i = 0; i < vbCount; i++)
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

    uint32_t colorViewCount = gpuFramebuffer->gpuColorViews.size();
    vector<VkImageView>::type attachments(colorViewCount + (gpuFramebuffer->gpuDepthStencilView ? 1 : 0));
    for (uint32_t i = 0u; i < colorViewCount; i++)
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

    VkFramebuffer framebuffer = 0;
    VK_CHECK(vkCreateFramebuffer(device->gpuDevice()->vkDevice, &createInfo, nullptr, &framebuffer));
}

void CCVKCmdFuncDestroyFramebuffer(CCVKDevice* device, CCVKGPUFramebuffer* gpuFramebuffer)
{
    if (gpuFramebuffer->vkFramebuffer != VK_NULL_HANDLE)
    {
        vkDestroyFramebuffer(device->gpuDevice()->vkDevice, gpuFramebuffer->vkFramebuffer, nullptr);
        gpuFramebuffer->vkFramebuffer = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreateBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout)
{
    uint32_t count = gpuBindingLayout->gpuBindings.size();
    vector<VkDescriptorSetLayoutBinding>::type setBindings(count);

    for (uint32_t i = 0u; i < count; i++)
    {
        auto &binding = gpuBindingLayout->gpuBindings[i];
        setBindings[i].binding = binding.binding;
        setBindings[i].descriptorType = MapVkDescriptorType(binding.type);
        setBindings[i].descriptorCount = 1;
        setBindings[i].stageFlags = binding.type == GFXBindingType::STORAGE_BUFFER ? VK_SHADER_STAGE_VERTEX_BIT : VK_SHADER_STAGE_ALL;
    }

    VkDescriptorSetLayoutCreateInfo setCreateInfo{ VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO };
    setCreateInfo.bindingCount = count;
    setCreateInfo.pBindings = setBindings.data();

    VK_CHECK(vkCreateDescriptorSetLayout(device->gpuDevice()->vkDevice, &setCreateInfo, nullptr, &gpuBindingLayout->vkDescriptorSetLayout));
}

void CCVKCmdFuncDestroyBindingLayout(CCVKDevice* device, CCVKGPUBindingLayout* gpuBindingLayout)
{
    if (gpuBindingLayout->vkDescriptorSetLayout != VK_NULL_HANDLE)
    {
        vkDestroyDescriptorSetLayout(device->gpuDevice()->vkDevice, gpuBindingLayout->vkDescriptorSetLayout, nullptr);
        gpuBindingLayout->vkDescriptorSetLayout = VK_NULL_HANDLE;
    }
}

void CCVKCmdFuncCreatePipelineLayout(CCVKDevice* device, CCVKGPUPipelineLayout* gpuPipelineLayout)
{
    uint32_t count = gpuPipelineLayout->gpuBindingLayouts.size();
    vector<VkDescriptorSetLayout>::type descriptorSetLayouts(count);
    for (uint32_t i = 0u; i < count; i++)
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
    uint32_t stageCount = stages.size();
    vector<VkPipelineShaderStageCreateInfo>::type stageInfos(stageCount, { VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO });
    for (uint32_t i = 0u; i < stageCount; i++)
    {
        stageInfos[i].stage = VK_SHADER_TYPES[(uint)stages[i].type];
        stageInfos[i].module = stages[i].vkShader;
        stageInfos[i].pName = "main";
    }
    createInfo.stageCount = stageCount;
    createInfo.pStages = stageInfos.data();

    ///////////////////// Input State /////////////////////

    auto &attributes = gpuPipelineState->inputState.attributes;
    uint32_t attributeCount = attributes.size();
    uint32_t bindingCount = 1;
    for (uint32_t i = 0u; i < attributeCount; i++)
    {
        auto &attr = attributes[i];
        bindingCount = std::max(bindingCount, attr.stream + 1);
    }

    vector<VkVertexInputBindingDescription>::type bindingDescriptions(bindingCount);
    for (uint32_t i = 0u; i < bindingCount; i++)
    {
        bindingDescriptions[i].binding = i;
        bindingDescriptions[i].stride = 0;
        bindingDescriptions[i].inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
    }
    for (uint32_t i = 0u; i < attributeCount; i++)
    {
        auto &attr = attributes[i];
        bindingDescriptions[attr.stream].stride += GFX_FORMAT_INFOS[(uint)attr.format].size;
        if (attr.isInstanced)
        {
            bindingDescriptions[attr.stream].inputRate = VK_VERTEX_INPUT_RATE_INSTANCE;
        }
    }

    vector<uint32_t>::type offsets(bindingCount, 0);
    vector<VkVertexInputAttributeDescription>::type attributeDescriptions(attributeCount);
    for (uint32_t i = 0u; i < attributeCount; i++)
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
    //multisampleState.sampleShadingEnable;
    //multisampleState.minSampleShading;
    //multisampleState.pSampleMask;
    //multisampleState.alphaToCoverageEnable;
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

    uint32_t blendTargetCount = gpuPipelineState->bs.targets.size();
    vector<VkPipelineColorBlendAttachmentState>::type blendTargets(blendTargetCount);
    for (uint32_t i = 0u; i < blendTargetCount; i++)
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

}


NS_CC_END
