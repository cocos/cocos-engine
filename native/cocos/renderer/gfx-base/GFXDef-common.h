/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/TypeDef.h"
#include "base/memory/Memory.h"
#include "math/Math.h"

/**
 * This file should be synced with engine/cocos/core/gfx/base/define.ts
 * every time changes being made, by manually running:
 * node tools/gfx-define-generator/generate.js
 *
 * Due to Clang AST's incompleteness for now we are parsing this header manually.
 * Some caveat:
 * * native-specific structs should not be included here, put them in GFXDef.h instead
 * * no typedefs, only usings
 * * define struct members first, then other helper functions
 * * aliases can only be used as types, not values (e.g. BufferUsage::NONE is illegal)
 * * parser directives can be specified in comments right after struct member declarations:
 *   * @ts-nullable: declare the member optional
 *   * @ts-overrides `YAML declaration`: overrides any parsed results, use with caution
 * * each struct member have to be specified in a single line, including optional parser directives
 * * members with a name starts with an underscore is automatically ignored
 */

namespace cc {
namespace gfx {

class GFXObject;
class Device;
class Swapchain;
class Buffer;
class GlobalBarrier;
class TextureBarrier;
class Texture;
class Sampler;
class Shader;
class InputAssembler;
class RenderPass;
class Framebuffer;
class DescriptorSetLayout;
class PipelineLayout;
class PipelineState;
class DescriptorSet;
class CommandBuffer;
class Queue;
class QueryPool;
class Window;
class Context;

using TextureBarrierList = vector<TextureBarrier *>;
using BufferDataList     = vector<const uint8_t *>;
using CommandBufferList  = vector<CommandBuffer *>;
using QueryPoolList      = vector<QueryPool *>;

constexpr uint32_t MAX_ATTACHMENTS  = 4U;
constexpr uint32_t INVALID_BINDING  = ~0U;
constexpr uint32_t SUBPASS_EXTERNAL = ~0U;

using BufferList              = vector<Buffer *>;
using TextureList             = vector<Texture *>;
using SamplerList             = vector<Sampler *>;
using DescriptorSetLayoutList = vector<DescriptorSetLayout *>;

enum class ObjectType : uint32_t {
    UNKNOWN,
    SWAPCHAIN,
    BUFFER,
    TEXTURE,
    RENDER_PASS,
    FRAMEBUFFER,
    SAMPLER,
    SHADER,
    DESCRIPTOR_SET_LAYOUT,
    PIPELINE_LAYOUT,
    PIPELINE_STATE,
    DESCRIPTOR_SET,
    INPUT_ASSEMBLER,
    COMMAND_BUFFER,
    QUEUE,
    QUERY_POOL,
    GLOBAL_BARRIER,
    TEXTURE_BARRIER,
    BUFFER_BARRIER,
    COUNT,
};
CC_ENUM_CONVERSION_OPERATOR(ObjectType);

enum class Status : uint32_t {
    UNREADY,
    FAILED,
    SUCCESS,
};
CC_ENUM_CONVERSION_OPERATOR(Status);

enum class API : uint32_t {
    UNKNOWN,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    WEBGL,
    WEBGL2,
    WEBGPU,
};
CC_ENUM_CONVERSION_OPERATOR(API);

enum class SurfaceTransform : uint32_t {
    IDENTITY,
    ROTATE_90,
    ROTATE_180,
    ROTATE_270,
};
CC_ENUM_CONVERSION_OPERATOR(SurfaceTransform);

enum class Feature : uint32_t {
    COLOR_FLOAT,
    COLOR_HALF_FLOAT,
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    TEXTURE_FLOAT_LINEAR,
    TEXTURE_HALF_FLOAT_LINEAR,
    FORMAT_R11G11B10F,
    FORMAT_SRGB,
    FORMAT_ETC1,
    FORMAT_ETC2,
    FORMAT_DXT,
    FORMAT_PVRTC,
    FORMAT_ASTC,
    FORMAT_RGB8,
    ELEMENT_INDEX_UINT,
    INSTANCED_ARRAYS,
    MULTIPLE_RENDER_TARGETS,
    BLEND_MINMAX,
    COMPUTE_SHADER,
    // This flag indicates whether the device can benefit from subpass-style usages.
    // Specifically, this only differs on the GLES backends: the Framebuffer Fetch
    // extension is used to simulate input attachments, so the flag is not set when
    // the extension is not supported, and you should switch to the fallback branch
    // (without the extension requirement) in GLSL shader sources accordingly.
    // Everything else can remain the same.
    //
    // Another caveat when using the Framebuffer Fetch extensions in shaders is that
    // for subpasses with exactly 4 inout attachments the output is automatically set
    // to the last attachment (taking advantage of 'inout' property), and a separate
    // blit operation (if needed) will be added for you afterwards to transfer the
    // rendering result to the correct subpass output texture. This is to ameliorate
    // the max number of attachment limit(4) situation for many devices, and shader
    // sources inside this kind of subpass must match this behavior.
    INPUT_ATTACHMENT_BENEFIT,
    COUNT,
};
CC_ENUM_CONVERSION_OPERATOR(Feature);

enum class Format : uint32_t {

    UNKNOWN,

    A8,
    L8,
    LA8,

    R8,
    R8SN,
    R8UI,
    R8I,
    R16F,
    R16UI,
    R16I,
    R32F,
    R32UI,
    R32I,

    RG8,
    RG8SN,
    RG8UI,
    RG8I,
    RG16F,
    RG16UI,
    RG16I,
    RG32F,
    RG32UI,
    RG32I,

    RGB8,
    SRGB8,
    RGB8SN,
    RGB8UI,
    RGB8I,
    RGB16F,
    RGB16UI,
    RGB16I,
    RGB32F,
    RGB32UI,
    RGB32I,

    RGBA8,
    BGRA8,
    SRGB8_A8,
    RGBA8SN,
    RGBA8UI,
    RGBA8I,
    RGBA16F,
    RGBA16UI,
    RGBA16I,
    RGBA32F,
    RGBA32UI,
    RGBA32I,

    // Special Format
    R5G6B5,
    R11G11B10F,
    RGB5A1,
    RGBA4,
    RGB10A2,
    RGB10A2UI,
    RGB9E5,

    // Depth-Stencil Format
    DEPTH,
    DEPTH_STENCIL,

    // Compressed Format

    // Block Compression Format, DDS (DirectDraw Surface)
    // DXT1: 3 channels (5:6:5), 1/8 origianl size, with 0 or 1 bit of alpha
    BC1,
    BC1_ALPHA,
    BC1_SRGB,
    BC1_SRGB_ALPHA,
    // DXT3: 4 channels (5:6:5), 1/4 origianl size, with 4 bits of alpha
    BC2,
    BC2_SRGB,
    // DXT5: 4 channels (5:6:5), 1/4 origianl size, with 8 bits of alpha
    BC3,
    BC3_SRGB,
    // 1 channel (8), 1/4 origianl size
    BC4,
    BC4_SNORM,
    // 2 channels (8:8), 1/2 origianl size
    BC5,
    BC5_SNORM,
    // 3 channels (16:16:16), half-floating point, 1/6 origianl size
    // UF16: unsigned float, 5 exponent bits + 11 mantissa bits
    // SF16: signed float, 1 signed bit + 5 exponent bits + 10 mantissa bits
    BC6H_UF16,
    BC6H_SF16,
    // 4 channels (4~7 bits per channel) with 0 to 8 bits of alpha, 1/3 original size
    BC7,
    BC7_SRGB,

    // Ericsson Texture Compression Format
    ETC_RGB8,
    ETC2_RGB8,
    ETC2_SRGB8,
    ETC2_RGB8_A1,
    ETC2_SRGB8_A1,
    ETC2_RGBA8,
    ETC2_SRGB8_A8,
    EAC_R11,
    EAC_R11SN,
    EAC_RG11,
    EAC_RG11SN,

    // PVRTC (PowerVR)
    PVRTC_RGB2,
    PVRTC_RGBA2,
    PVRTC_RGB4,
    PVRTC_RGBA4,
    PVRTC2_2BPP,
    PVRTC2_4BPP,

    // ASTC (Adaptive Scalable Texture Compression)
    ASTC_RGBA_4X4,
    ASTC_RGBA_5X4,
    ASTC_RGBA_5X5,
    ASTC_RGBA_6X5,
    ASTC_RGBA_6X6,
    ASTC_RGBA_8X5,
    ASTC_RGBA_8X6,
    ASTC_RGBA_8X8,
    ASTC_RGBA_10X5,
    ASTC_RGBA_10X6,
    ASTC_RGBA_10X8,
    ASTC_RGBA_10X10,
    ASTC_RGBA_12X10,
    ASTC_RGBA_12X12,

    // ASTC (Adaptive Scalable Texture Compression) SRGB
    ASTC_SRGBA_4X4,
    ASTC_SRGBA_5X4,
    ASTC_SRGBA_5X5,
    ASTC_SRGBA_6X5,
    ASTC_SRGBA_6X6,
    ASTC_SRGBA_8X5,
    ASTC_SRGBA_8X6,
    ASTC_SRGBA_8X8,
    ASTC_SRGBA_10X5,
    ASTC_SRGBA_10X6,
    ASTC_SRGBA_10X8,
    ASTC_SRGBA_10X10,
    ASTC_SRGBA_12X10,
    ASTC_SRGBA_12X12,

    // Total count
    COUNT,
};
CC_ENUM_CONVERSION_OPERATOR(Format);

enum class FormatType : uint32_t {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
};
CC_ENUM_CONVERSION_OPERATOR(FormatType);

enum class Type : uint32_t {
    UNKNOWN,
    BOOL,
    BOOL2,
    BOOL3,
    BOOL4,
    INT,
    INT2,
    INT3,
    INT4,
    UINT,
    UINT2,
    UINT3,
    UINT4,
    FLOAT,
    FLOAT2,
    FLOAT3,
    FLOAT4,
    MAT2,
    MAT2X3,
    MAT2X4,
    MAT3X2,
    MAT3,
    MAT3X4,
    MAT4X2,
    MAT4X3,
    MAT4,
    // combined image samplers
    SAMPLER1D,
    SAMPLER1D_ARRAY,
    SAMPLER2D,
    SAMPLER2D_ARRAY,
    SAMPLER3D,
    SAMPLER_CUBE,
    // sampler
    SAMPLER,
    // sampled textures
    TEXTURE1D,
    TEXTURE1D_ARRAY,
    TEXTURE2D,
    TEXTURE2D_ARRAY,
    TEXTURE3D,
    TEXTURE_CUBE,
    // storage images
    IMAGE1D,
    IMAGE1D_ARRAY,
    IMAGE2D,
    IMAGE2D_ARRAY,
    IMAGE3D,
    IMAGE_CUBE,
    // input attachment
    SUBPASS_INPUT,
    COUNT,
};
CC_ENUM_CONVERSION_OPERATOR(Type);

bool isCombinedImageSampler(Type type);
bool isSampledImage(Type type);
bool isStorageImage(Type type);

enum class BufferUsageBit : uint32_t {
    NONE         = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX        = 0x4,
    VERTEX       = 0x8,
    UNIFORM      = 0x10,
    STORAGE      = 0x20,
    INDIRECT     = 0x40,
};
using BufferUsage = BufferUsageBit;
CC_ENUM_BITWISE_OPERATORS(BufferUsageBit);

enum class BufferFlagBit : uint32_t {
    NONE = 0,
};
using BufferFlags = BufferFlagBit;
CC_ENUM_BITWISE_OPERATORS(BufferFlagBit);

enum class MemoryAccessBit : uint32_t {
    NONE       = 0,
    READ_ONLY  = 0x1,
    WRITE_ONLY = 0x2,
    READ_WRITE = READ_ONLY | WRITE_ONLY,
};
using MemoryAccess = MemoryAccessBit;
CC_ENUM_BITWISE_OPERATORS(MemoryAccessBit);

enum class MemoryUsageBit : uint32_t {
    NONE   = 0,
    DEVICE = 0x1, // for rarely-updated resources, use MemoryUsageBit::DEVICE
    HOST   = 0x2, // for frequently-updated resources, use MemoryUsageBit::DEVICE | MemoryUsageBit::HOST
};
using MemoryUsage = MemoryUsageBit;
CC_ENUM_BITWISE_OPERATORS(MemoryUsageBit);

enum class TextureType : uint32_t {
    TEX1D,
    TEX2D,
    TEX3D,
    CUBE,
    TEX1D_ARRAY,
    TEX2D_ARRAY,
};
CC_ENUM_CONVERSION_OPERATOR(TextureType);

enum class TextureUsageBit : uint32_t {
    NONE                     = 0,
    TRANSFER_SRC             = 0x1,
    TRANSFER_DST             = 0x2,
    SAMPLED                  = 0x4,
    STORAGE                  = 0x8,
    COLOR_ATTACHMENT         = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    INPUT_ATTACHMENT         = 0x40,
};
using TextureUsage = TextureUsageBit;
CC_ENUM_BITWISE_OPERATORS(TextureUsageBit);

enum class TextureFlagBit : uint32_t {
    NONE           = 0,
    GEN_MIPMAP     = 0x1, // Generate mipmaps using bilinear filter
    GENERAL_LAYOUT = 0x2, // For inout framebuffer attachments
};
using TextureFlags = TextureFlagBit;
CC_ENUM_BITWISE_OPERATORS(TextureFlagBit);

enum class SampleCount : uint32_t {
    ONE,                  // Single sample
    MULTIPLE_PERFORMANCE, // Multiple samples prioritizing performance over quality
    MULTIPLE_BALANCE,     // Multiple samples leveraging both quality and performance
    MULTIPLE_QUALITY,     // Multiple samples prioritizing quality over performance
};
CC_ENUM_CONVERSION_OPERATOR(SampleCount);

enum class VsyncMode : uint32_t {
    // The application does not synchronizes with the vertical sync.
    // If application renders faster than the display refreshes, frames are wasted and tearing may be observed.
    // FPS is uncapped. Maximum power consumption. If unsupported, "ON" value will be used instead. Minimum latency.
    OFF,
    // The application is always synchronized with the vertical sync. Tearing does not happen.
    // FPS is capped to the display's refresh rate. For fast applications, battery life is improved. Always supported.
    ON,
    // The application synchronizes with the vertical sync, but only if the application rendering speed is greater than refresh rate.
    // Compared to OFF, there is no tearing. Compared to ON, the FPS will be improved for "slower" applications.
    // If unsupported, "ON" value will be used instead. Recommended for most applications. Default if supported.
    RELAXED,
    // The presentation engine will always use the latest fully rendered image.
    // Compared to OFF, no tearing will be observed.
    // Compared to ON, battery power will be worse, especially for faster applications.
    // If unsupported,  "OFF" will be attempted next.
    MAILBOX,
    // The application is capped to using half the vertical sync time.
    // FPS artificially capped to Half the display speed (usually 30fps) to maintain battery.
    // Best possible battery savings. Worst possible performance.
    // Recommended for specific applications where battery saving is critical.
    HALF,
};
CC_ENUM_CONVERSION_OPERATOR(VsyncMode);

enum class Filter : uint32_t {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
};
CC_ENUM_CONVERSION_OPERATOR(Filter);

enum class Address : uint32_t {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
};
CC_ENUM_CONVERSION_OPERATOR(Address);

enum class ComparisonFunc : uint32_t {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
};
CC_ENUM_CONVERSION_OPERATOR(ComparisonFunc);

enum class StencilOp : uint32_t {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
};
CC_ENUM_CONVERSION_OPERATOR(StencilOp);

enum class BlendFactor : uint32_t {
    ZERO,
    ONE,
    SRC_ALPHA,
    DST_ALPHA,
    ONE_MINUS_SRC_ALPHA,
    ONE_MINUS_DST_ALPHA,
    SRC_COLOR,
    DST_COLOR,
    ONE_MINUS_SRC_COLOR,
    ONE_MINUS_DST_COLOR,
    SRC_ALPHA_SATURATE,
    CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA,
};
CC_ENUM_CONVERSION_OPERATOR(BlendFactor);

enum class BlendOp : uint32_t {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
};
CC_ENUM_CONVERSION_OPERATOR(BlendOp);

enum class ColorMask : uint32_t {
    NONE = 0x0,
    R    = 0x1,
    G    = 0x2,
    B    = 0x4,
    A    = 0x8,
    ALL  = R | G | B | A,
};
CC_ENUM_BITWISE_OPERATORS(ColorMask);

enum class ShaderStageFlagBit : uint32_t {
    NONE       = 0x0,
    VERTEX     = 0x1,
    CONTROL    = 0x2,
    EVALUATION = 0x4,
    GEOMETRY   = 0x8,
    FRAGMENT   = 0x10,
    COMPUTE    = 0x20,
    ALL        = 0x3f,
};
using ShaderStageFlags = ShaderStageFlagBit;
CC_ENUM_BITWISE_OPERATORS(ShaderStageFlagBit);

enum class LoadOp : uint32_t {
    LOAD,    // Load the contents from the fbo from previous
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore writing to the fbo and keep old data
};
CC_ENUM_CONVERSION_OPERATOR(LoadOp);

enum class StoreOp : uint32_t {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
};
CC_ENUM_CONVERSION_OPERATOR(StoreOp);

enum class AccessType : uint32_t {
    NONE,

    // Read access
    INDIRECT_BUFFER,                                     // Read as an indirect buffer for drawing or dispatch
    INDEX_BUFFER,                                        // Read as an index buffer for drawing
    VERTEX_BUFFER,                                       // Read as a vertex buffer for drawing
    VERTEX_SHADER_READ_UNIFORM_BUFFER,                   // Read as a uniform buffer in a vertex shader
    VERTEX_SHADER_READ_TEXTURE,                          // Read as a sampled image/uniform texel buffer in a vertex shader
    VERTEX_SHADER_READ_OTHER,                            // Read as any other resource in a vertex shader
    FRAGMENT_SHADER_READ_UNIFORM_BUFFER,                 // Read as a uniform buffer in a fragment shader
    FRAGMENT_SHADER_READ_TEXTURE,                        // Read as a sampled image/uniform texel buffer in a fragment shader
    FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT,         // Read as an input attachment with a color format in a fragment shader
    FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT, // Read as an input attachment with a depth/stencil format in a fragment shader
    FRAGMENT_SHADER_READ_OTHER,                          // Read as any other resource in a fragment shader
    COLOR_ATTACHMENT_READ,                               // Read by standard blending/logic operations or subpass load operations
    DEPTH_STENCIL_ATTACHMENT_READ,                       // Read by depth/stencil tests or subpass load operations
    COMPUTE_SHADER_READ_UNIFORM_BUFFER,                  // Read as a uniform buffer in a compute shader
    COMPUTE_SHADER_READ_TEXTURE,                         // Read as a sampled image/uniform texel buffer in a compute shader
    COMPUTE_SHADER_READ_OTHER,                           // Read as any other resource in a compute shader
    TRANSFER_READ,                                       // Read as the source of a transfer operation
    HOST_READ,                                           // Read on the host
    PRESENT,                                             // Read by the presentation engine

    // Write access
    VERTEX_SHADER_WRITE,            // Written as any resource in a vertex shader
    FRAGMENT_SHADER_WRITE,          // Written as any resource in a fragment shader
    COLOR_ATTACHMENT_WRITE,         // Written as a color attachment during rendering, or via a subpass store op
    DEPTH_STENCIL_ATTACHMENT_WRITE, // Written as a depth/stencil attachment during rendering, or via a subpass store op
    COMPUTE_SHADER_WRITE,           // Written as any resource in a compute shader
    TRANSFER_WRITE,                 // Written as the destination of a transfer operation
    HOST_PREINITIALIZED,            // Data pre-filled by host before device access starts
    HOST_WRITE,                     // Written on the host
};
CC_ENUM_CONVERSION_OPERATOR(AccessType);

using AccessTypeList = std::vector<AccessType>;

enum class ResolveMode : uint32_t {
    NONE,
    SAMPLE_ZERO,
    AVERAGE,
    MIN,
    MAX,
};
CC_ENUM_CONVERSION_OPERATOR(ResolveMode);

enum class PipelineBindPoint : uint32_t {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
};
CC_ENUM_CONVERSION_OPERATOR(PipelineBindPoint);

enum class PrimitiveMode : uint32_t {
    POINT_LIST,
    LINE_LIST,
    LINE_STRIP,
    LINE_LOOP,
    LINE_LIST_ADJACENCY,
    LINE_STRIP_ADJACENCY,
    ISO_LINE_LIST,
    // raycast detectable:
    TRIANGLE_LIST,
    TRIANGLE_STRIP,
    TRIANGLE_FAN,
    TRIANGLE_LIST_ADJACENCY,
    TRIANGLE_STRIP_ADJACENCY,
    TRIANGLE_PATCH_ADJACENCY,
    QUAD_PATCH_LIST,
};
CC_ENUM_CONVERSION_OPERATOR(PrimitiveMode);

enum class PolygonMode : uint32_t {
    FILL,
    POINT,
    LINE,
};
CC_ENUM_CONVERSION_OPERATOR(PolygonMode);

enum class ShadeModel : uint32_t {
    GOURAND,
    FLAT,
};
CC_ENUM_CONVERSION_OPERATOR(ShadeModel);

enum class CullMode : uint32_t {
    NONE,
    FRONT,
    BACK,
};
CC_ENUM_CONVERSION_OPERATOR(CullMode);

enum class DynamicStateFlagBit : uint32_t {
    NONE                 = 0x0,
    LINE_WIDTH           = 0x1,
    DEPTH_BIAS           = 0x2,
    BLEND_CONSTANTS      = 0x4,
    DEPTH_BOUNDS         = 0x8,
    STENCIL_WRITE_MASK   = 0x10,
    STENCIL_COMPARE_MASK = 0x20,
};
using DynamicStateFlags = DynamicStateFlagBit;
CC_ENUM_BITWISE_OPERATORS(DynamicStateFlagBit);

using DynamicStateList = vector<DynamicStateFlagBit>;

enum class StencilFace : uint32_t {
    FRONT = 0x1,
    BACK  = 0x2,
    ALL   = 0x3,
};
CC_ENUM_BITWISE_OPERATORS(StencilFace);

enum class DescriptorType : uint32_t {
    UNKNOWN                = 0,
    UNIFORM_BUFFER         = 0x1,
    DYNAMIC_UNIFORM_BUFFER = 0x2,
    STORAGE_BUFFER         = 0x4,
    DYNAMIC_STORAGE_BUFFER = 0x8,
    SAMPLER_TEXTURE        = 0x10,
    SAMPLER                = 0x20,
    TEXTURE                = 0x40,
    STORAGE_IMAGE          = 0x80,
    INPUT_ATTACHMENT       = 0x100,
};
CC_ENUM_BITWISE_OPERATORS(DescriptorType);

enum class QueueType : uint32_t {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
};
CC_ENUM_CONVERSION_OPERATOR(QueueType);

enum class QueryType : uint32_t {
    OCCLUSION,
    PIPELINE_STATISTICS,
    TIMESTAMP,
};
CC_ENUM_CONVERSION_OPERATOR(QueryType);

enum class CommandBufferType : uint32_t {
    PRIMARY,
    SECONDARY,
};
CC_ENUM_CONVERSION_OPERATOR(CommandBufferType);

enum class ClearFlagBit : uint32_t {
    NONE          = 0,
    COLOR         = 0x1,
    DEPTH         = 0x2,
    STENCIL       = 0x4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL           = COLOR | DEPTH | STENCIL,
};
using ClearFlags = ClearFlagBit;
CC_ENUM_BITWISE_OPERATORS(ClearFlagBit);

struct Size {
    uint32_t x{0U};
    uint32_t y{0U};
    uint32_t z{0U};
};

struct DeviceCaps {
    uint32_t maxVertexAttributes{0U};
    uint32_t maxVertexUniformVectors{0U};
    uint32_t maxFragmentUniformVectors{0U};
    uint32_t maxTextureUnits{0U};
    uint32_t maxImageUnits{0U};
    uint32_t maxVertexTextureUnits{0U};
    uint32_t maxColorRenderTargets{0U};
    uint32_t maxShaderStorageBufferBindings{0U};
    uint32_t maxShaderStorageBlockSize{0U};
    uint32_t maxUniformBufferBindings{0U};
    uint32_t maxUniformBlockSize{0U};
    uint32_t maxTextureSize{0U};
    uint32_t maxCubeMapTextureSize{0U};
    uint32_t uboOffsetAlignment{1U};

    uint32_t maxComputeSharedMemorySize{0U};
    uint32_t maxComputeWorkGroupInvocations{0U};
    Size     maxComputeWorkGroupSize;
    Size     maxComputeWorkGroupCount;

    bool supportQuery{false};

    float clipSpaceMinZ{-1.F};
    float screenSpaceSignY{1.F};
    float clipSpaceSignY{1.F};
};

struct Offset {
    int32_t x{0};
    int32_t y{0};
    int32_t z{0};
};

struct Rect {
    int32_t  x{0};
    int32_t  y{0};
    uint32_t width{0U};
    uint32_t height{0U};
};

struct Extent {
    uint32_t width{0U};
    uint32_t height{0U};
    uint32_t depth{1U};
};

struct TextureSubresLayers {
    uint32_t mipLevel{0U};
    uint32_t baseArrayLayer{0U};
    uint32_t layerCount{1U};
};

struct TextureSubresRange {
    uint32_t baseMipLevel{0U};
    uint32_t levelCount{1U};
    uint32_t baseArrayLayer{0U};
    uint32_t layerCount{1U};
};

struct TextureCopy {
    TextureSubresLayers srcSubres;
    Offset              srcOffset;
    TextureSubresLayers dstSubres;
    Offset              dstOffset;
    Extent              extent;
};

struct TextureBlit {
    TextureSubresLayers srcSubres;
    Offset              srcOffset;
    Extent              srcExtent;
    TextureSubresLayers dstSubres;
    Offset              dstOffset;
    Extent              dstExtent;
};
using TextureBlitList = vector<TextureBlit>;

struct BufferTextureCopy {
    uint32_t            buffStride{0U};
    uint32_t            buffTexHeight{0U};
    Offset              texOffset;
    Extent              texExtent;
    TextureSubresLayers texSubres;
};
using BufferTextureCopyList = vector<BufferTextureCopy>;

struct Viewport {
    int32_t  left{0};
    int32_t  top{0};
    uint32_t width{0U};
    uint32_t height{0U};
    float    minDepth{0.F};
    float    maxDepth{1.F};
};

struct Color {
    float x{0.F};
    float y{0.F};
    float z{0.F};
    float w{0.F};
};
using ColorList = vector<Color>;

/**
 * For non-vulkan backends, to maintain compatibility and maximize
 * descriptor cache-locality, descriptor-set-based binding numbers need
 * to be mapped to backend-specific bindings based on maximum limit
 * of available descriptor slots in each set.
 *
 * The GFX layer assumes the binding numbers for each descriptor type inside each set
 * are guaranteed to be consecutive, so the mapping procedure is reduced
 * to a simple shifting operation. This data structure specifies the
 * offsets for each descriptor type in each set.
 */
struct BindingMappingInfo {
    std::vector<int32_t> bufferOffsets;
    std::vector<int32_t> samplerOffsets;
    uint32_t             flexibleSet{0U};
};

struct SwapchainInfo {
    void *    windowHandle{nullptr}; // @ts-overrides { type: 'HTMLCanvasElement' }
    VsyncMode vsyncMode{VsyncMode::ON};

    uint32_t width{0U};
    uint32_t height{0U};
};

struct DeviceInfo {
    BindingMappingInfo bindingMappingInfo;
};

struct ALIGNAS(8) BufferInfo {
    BufferUsage usage{BufferUsageBit::NONE};
    MemoryUsage memUsage{MemoryUsageBit::NONE};
    uint32_t    size{0U};
    uint32_t    stride{1U}; // in bytes
    BufferFlags flags{BufferFlagBit::NONE};
    uint32_t    _padding{0U};
};

struct BufferViewInfo {
    Buffer * buffer{nullptr};
    uint32_t offset{0U};
    uint32_t range{0U};
};

struct DrawInfo {
    uint32_t vertexCount{0U};
    uint32_t firstVertex{0U};
    uint32_t indexCount{0U};
    uint32_t firstIndex{0U};
    int32_t  vertexOffset{0};
    uint32_t instanceCount{0U};
    uint32_t firstInstance{0U};
};

using DrawInfoList = vector<DrawInfo>;

struct DispatchInfo {
    uint32_t groupCountX{0U};
    uint32_t groupCountY{0U};
    uint32_t groupCountZ{0U};

    Buffer * indirectBuffer{nullptr}; // @ts-nullable
    uint32_t indirectOffset{0U};
};

using DispatchInfoList = vector<DispatchInfo>;

struct IndirectBuffer {
    DrawInfoList drawInfos;
};

struct ALIGNAS(8) TextureInfo {
    TextureType  type{TextureType::TEX2D};
    TextureUsage usage{TextureUsageBit::NONE};
    Format       format{Format::UNKNOWN};
    uint32_t     width{0U};
    uint32_t     height{0U};
    TextureFlags flags{TextureFlagBit::NONE};
    uint32_t     layerCount{1U};
    uint32_t     levelCount{1U};
    SampleCount  samples{SampleCount::ONE};
    uint32_t     depth{1U};
    void *       externalRes{nullptr}; // CVPixelBuffer for Metal, EGLImage for GLES
#if CC_CPU_ARCH == CC_CPU_ARCH_32
    uint32_t _padding{0U};
#endif
};

struct ALIGNAS(8) TextureViewInfo {
    Texture *   texture{nullptr};
    TextureType type{TextureType::TEX2D};
    Format      format{Format::UNKNOWN};
    uint32_t    baseLevel{0U};
    uint32_t    levelCount{1U};
    uint32_t    baseLayer{0U};
    uint32_t    layerCount{1U};
#if CC_CPU_ARCH == CC_CPU_ARCH_32
    uint32_t _padding{0U};
#endif
};

struct ALIGNAS(8) SamplerInfo {
    Filter         minFilter{Filter::LINEAR};
    Filter         magFilter{Filter::LINEAR};
    Filter         mipFilter{Filter::NONE};
    Address        addressU{Address::WRAP};
    Address        addressV{Address::WRAP};
    Address        addressW{Address::WRAP};
    uint32_t       maxAnisotropy{0U};
    ComparisonFunc cmpFunc{ComparisonFunc::ALWAYS};
};

struct Uniform {
    String   name;
    Type     type{Type::UNKNOWN};
    uint32_t count{0U};
};

using UniformList = vector<Uniform>;

struct UniformBlock {
    uint32_t    set{0U};
    uint32_t    binding{0U};
    String      name;
    UniformList members;
    uint32_t    count{0U};
};

using UniformBlockList = vector<UniformBlock>;

struct UniformSamplerTexture {
    uint32_t set{0U};
    uint32_t binding{0U};
    String   name;
    Type     type{Type::UNKNOWN};
    uint32_t count{0U};
};

using UniformSamplerTextureList = vector<UniformSamplerTexture>;

struct UniformSampler {
    uint32_t set{0U};
    uint32_t binding{0U};
    String   name;
    uint32_t count{0U};
};

using UniformSamplerList = vector<UniformSampler>;

struct UniformTexture {
    uint32_t set{0U};
    uint32_t binding{0U};
    String   name;
    Type     type{Type::UNKNOWN};
    uint32_t count{0U};
};

using UniformTextureList = vector<UniformTexture>;

struct UniformStorageImage {
    uint32_t     set{0U};
    uint32_t     binding{0U};
    String       name;
    Type         type{Type::UNKNOWN};
    uint32_t     count{0U};
    MemoryAccess memoryAccess{MemoryAccessBit::READ_WRITE};
};

using UniformStorageImageList = vector<UniformStorageImage>;

struct UniformStorageBuffer {
    uint32_t     set{0U};
    uint32_t     binding{0U};
    String       name;
    uint32_t     count{0U};
    MemoryAccess memoryAccess{MemoryAccessBit::READ_WRITE};
};

using UniformStorageBufferList = vector<UniformStorageBuffer>;

struct UniformInputAttachment {
    uint32_t set{0U};
    uint32_t binding{0U};
    String   name;
    uint32_t count{0U};
};

using UniformInputAttachmentList = vector<UniformInputAttachment>;

struct ShaderStage {
    ShaderStageFlagBit stage{ShaderStageFlagBit::NONE};
    String             source;
};

using ShaderStageList = vector<ShaderStage>;

struct Attribute {
    String   name;
    Format   format{Format::UNKNOWN};
    bool     isNormalized{false};
    uint32_t stream{0U};
    bool     isInstanced{false};
    uint32_t location{0U};
};

using AttributeList = vector<Attribute>;

constexpr const char *ATTR_NAME_POSITION   = "a_position";
constexpr const char *ATTR_NAME_NORMAL     = "a_normal";
constexpr const char *ATTR_NAME_TANGENT    = "a_tangent";
constexpr const char *ATTR_NAME_BITANGENT  = "a_bitangent";
constexpr const char *ATTR_NAME_WEIGHTS    = "a_weights";
constexpr const char *ATTR_NAME_JOINTS     = "a_joints";
constexpr const char *ATTR_NAME_COLOR      = "a_color";
constexpr const char *ATTR_NAME_COLOR1     = "a_color1";
constexpr const char *ATTR_NAME_COLOR2     = "a_color2";
constexpr const char *ATTR_NAME_TEX_COORD  = "a_texCoord";
constexpr const char *ATTR_NAME_TEX_COORD1 = "a_texCoord1";
constexpr const char *ATTR_NAME_TEX_COORD2 = "a_texCoord2";
constexpr const char *ATTR_NAME_TEX_COORD3 = "a_texCoord3";
constexpr const char *ATTR_NAME_TEX_COORD4 = "a_texCoord4";
constexpr const char *ATTR_NAME_TEX_COORD5 = "a_texCoord5";
constexpr const char *ATTR_NAME_TEX_COORD6 = "a_texCoord6";
constexpr const char *ATTR_NAME_TEX_COORD7 = "a_texCoord7";
constexpr const char *ATTR_NAME_TEX_COORD8 = "a_texCoord8";
constexpr const char *ATTR_NAME_BATCH_ID   = "a_batch_id";
constexpr const char *ATTR_NAME_BATCH_UV   = "a_batch_uv";

struct ShaderInfo {
    String                     name;
    ShaderStageList            stages;
    AttributeList              attributes;
    UniformBlockList           blocks;
    UniformStorageBufferList   buffers;
    UniformSamplerTextureList  samplerTextures;
    UniformSamplerList         samplers;
    UniformTextureList         textures;
    UniformStorageImageList    images;
    UniformInputAttachmentList subpassInputs;
};

struct InputAssemblerInfo {
    AttributeList attributes;
    BufferList    vertexBuffers;
    Buffer *      indexBuffer{nullptr};    // @ts-nullable
    Buffer *      indirectBuffer{nullptr}; // @ts-nullable
};

struct ColorAttachment {
    Format                  format{Format::UNKNOWN};
    SampleCount             sampleCount{SampleCount::ONE};
    LoadOp                  loadOp{LoadOp::CLEAR};
    StoreOp                 storeOp{StoreOp::STORE};
    std::vector<AccessType> beginAccesses;
    std::vector<AccessType> endAccesses{AccessType::COLOR_ATTACHMENT_WRITE};
    bool                    isGeneralLayout{false};
};

using ColorAttachmentList = vector<ColorAttachment>;

struct DepthStencilAttachment {
    Format                  format{Format::UNKNOWN};
    SampleCount             sampleCount{SampleCount::ONE};
    LoadOp                  depthLoadOp{LoadOp::CLEAR};
    StoreOp                 depthStoreOp{StoreOp::STORE};
    LoadOp                  stencilLoadOp{LoadOp::CLEAR};
    StoreOp                 stencilStoreOp{StoreOp::STORE};
    std::vector<AccessType> beginAccesses;
    std::vector<AccessType> endAccesses{AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
    bool                    isGeneralLayout{false};
};

struct SubpassInfo {
    std::vector<uint32_t> inputs;
    std::vector<uint32_t> colors;
    std::vector<uint32_t> resolves;
    std::vector<uint32_t> preserves;

    uint32_t    depthStencil{INVALID_BINDING};
    uint32_t    depthStencilResolve{INVALID_BINDING};
    ResolveMode depthResolveMode{ResolveMode::NONE};
    ResolveMode stencilResolveMode{ResolveMode::NONE};
};

using SubpassInfoList = vector<SubpassInfo>;

struct SubpassDependency {
    uint32_t                srcSubpass{0U};
    uint32_t                dstSubpass{0U};
    std::vector<AccessType> srcAccesses;
    std::vector<AccessType> dstAccesses;
};

using SubpassDependencyList = vector<SubpassDependency>;

struct RenderPassInfo {
    ColorAttachmentList    colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubpassInfoList        subpasses;
    SubpassDependencyList  dependencies;
};

struct GlobalBarrierInfo {
    std::vector<AccessType> prevAccesses;
    std::vector<AccessType> nextAccesses;
};
using GlobalBarrierInfoList = vector<GlobalBarrierInfo>;

struct TextureBarrierInfo {
    std::vector<AccessType> prevAccesses;
    std::vector<AccessType> nextAccesses;

    bool discardContents{false};

    Queue *srcQueue{nullptr}; // @ts-nullable
    Queue *dstQueue{nullptr}; // @ts-nullable
};
using TextureBarrierInfoList = vector<TextureBarrierInfo>;

struct FramebufferInfo {
    RenderPass *renderPass{nullptr};
    TextureList colorTextures;                // @ts-overrides { type: '(Texture | null)[]' }
    Texture *   depthStencilTexture{nullptr}; // @ts-nullable
};

struct DescriptorSetLayoutBinding {
    uint32_t         binding{INVALID_BINDING};
    DescriptorType   descriptorType{DescriptorType::UNKNOWN};
    uint32_t         count{0U};
    ShaderStageFlags stageFlags{ShaderStageFlagBit::NONE};
    SamplerList      immutableSamplers;
};
using DescriptorSetLayoutBindingList = vector<DescriptorSetLayoutBinding>;

struct DescriptorSetLayoutInfo {
    DescriptorSetLayoutBindingList bindings;
};

struct DescriptorSetInfo {
    DescriptorSetLayout *layout{nullptr};
};

struct PipelineLayoutInfo {
    DescriptorSetLayoutList setLayouts;
};

struct InputState {
    AttributeList attributes;
};

// Use uint32_t for all boolean values to convert memory to RasterizerState* in shared memory.
struct RasterizerState {
    uint32_t    isDiscard{0U};
    PolygonMode polygonMode{PolygonMode::FILL};
    ShadeModel  shadeModel{ShadeModel::GOURAND};
    CullMode    cullMode{CullMode::BACK};
    uint32_t    isFrontFaceCCW{1U};
    uint32_t    depthBiasEnabled{0U};
    float       depthBias{0.F};
    float       depthBiasClamp{0.F};
    float       depthBiasSlop{0.F};
    uint32_t    isDepthClip{1U};
    uint32_t    isMultisample{0U};
    float       lineWidth{1.F};

    void reset() {
        isDiscard        = 0;
        polygonMode      = PolygonMode::FILL;
        shadeModel       = ShadeModel::GOURAND;
        cullMode         = CullMode::BACK;
        isFrontFaceCCW   = 1;
        depthBiasEnabled = 0;
        depthBias        = 0.0F;
        depthBiasClamp   = 0.0F;
        depthBiasSlop    = 0.0F;
        isDepthClip      = 1;
        isMultisample    = 0;
        lineWidth        = 1.0F;
    }
};

// Use uint32_t for all boolean values to convert memory to DepthStencilState* in shared memory.
struct DepthStencilState {
    uint32_t       depthTest{1U};
    uint32_t       depthWrite{1U};
    ComparisonFunc depthFunc{ComparisonFunc::LESS};
    uint32_t       stencilTestFront{0U};
    ComparisonFunc stencilFuncFront{ComparisonFunc::ALWAYS};
    uint32_t       stencilReadMaskFront{0xffffffffU};
    uint32_t       stencilWriteMaskFront{0xffffffffU};
    StencilOp      stencilFailOpFront{StencilOp::KEEP};
    StencilOp      stencilZFailOpFront{StencilOp::KEEP};
    StencilOp      stencilPassOpFront{StencilOp::KEEP};
    uint32_t       stencilRefFront{1U};
    uint32_t       stencilTestBack{0U};
    ComparisonFunc stencilFuncBack{ComparisonFunc::ALWAYS};
    uint32_t       stencilReadMaskBack{0xffffffffU};
    uint32_t       stencilWriteMaskBack{0xffffffffU};
    StencilOp      stencilFailOpBack{StencilOp::KEEP};
    StencilOp      stencilZFailOpBack{StencilOp::KEEP};
    StencilOp      stencilPassOpBack{StencilOp::KEEP};
    uint32_t       stencilRefBack{1U};

    void reset() {
        depthTest             = 1;
        depthWrite            = 1;
        depthFunc             = ComparisonFunc::LESS;
        stencilTestFront      = 0;
        stencilFuncFront      = ComparisonFunc::ALWAYS;
        stencilReadMaskFront  = 0xffffffff;
        stencilWriteMaskFront = 0xffffffff;
        stencilFailOpFront    = StencilOp::KEEP;
        stencilZFailOpFront   = StencilOp::KEEP;
        stencilPassOpFront    = StencilOp::KEEP;
        stencilRefFront       = 1;
        stencilTestBack       = 0;
        stencilFuncBack       = ComparisonFunc::ALWAYS;
        stencilReadMaskBack   = 0xffffffff;
        stencilWriteMaskBack  = 0xffffffff;
        stencilFailOpBack     = StencilOp::KEEP;
        stencilZFailOpBack    = StencilOp::KEEP;
        stencilPassOpBack     = StencilOp::KEEP;
        stencilRefBack        = 1;
    }
};

// Use uint32_t for all boolean values to do convert memory to BlendTarget* in shared memory.
struct BlendTarget {
    uint32_t    blend{0U};
    BlendFactor blendSrc{BlendFactor::ONE};
    BlendFactor blendDst{BlendFactor::ZERO};
    BlendOp     blendEq{BlendOp::ADD};
    BlendFactor blendSrcAlpha{BlendFactor::ONE};
    BlendFactor blendDstAlpha{BlendFactor::ZERO};
    BlendOp     blendAlphaEq{BlendOp::ADD};
    ColorMask   blendColorMask{ColorMask::ALL};
};

using BlendTargetList = vector<BlendTarget>;

// Use uint32_t for all boolean values to do memeory copy in shared memory.
struct BlendState {
    uint32_t        isA2C{0U};
    uint32_t        isIndepend{0U};
    Color           blendColor;
    BlendTargetList targets{1U};

    void setTarget(index_t index, const BlendTarget &target) {
        if (index >= targets.size()) {
            targets.resize(index + 1);
        }
        targets[index] = target;
    }

    void reset() {
        isA2C        = 0;
        isIndepend   = 0;
        blendColor.x = 0;
        blendColor.y = 0;
        blendColor.z = 0;
        blendColor.w = 0;
        targets.clear();
        targets.resize(1);
    }

    void destroy() {}
};

struct PipelineStateInfo {
    Shader *          shader{nullptr};
    PipelineLayout *  pipelineLayout{nullptr};
    RenderPass *      renderPass{nullptr};
    InputState        inputState;
    RasterizerState   rasterizerState;
    DepthStencilState depthStencilState;
    BlendState        blendState;
    PrimitiveMode     primitive{PrimitiveMode::TRIANGLE_LIST};
    DynamicStateFlags dynamicStates{DynamicStateFlagBit::NONE};
    PipelineBindPoint bindPoint{PipelineBindPoint::GRAPHICS};
    uint32_t          subpass{0U};
};

struct CommandBufferInfo {
    Queue *           queue{nullptr};
    CommandBufferType type{CommandBufferType::PRIMARY};
};

struct QueueInfo {
    QueueType type{QueueType::GRAPHICS};
};

// Although the standard is not limited, some devices do not support up to 65536 queries
constexpr uint32_t DEFAULT_MAX_QUERY_OBJECTS = 32767U;

struct QueryPoolInfo {
    QueryType type{QueryType::OCCLUSION};
    uint32_t  maxQueryObjects{DEFAULT_MAX_QUERY_OBJECTS};
    bool      forceWait{true};
};

struct FormatInfo {
    const String     name;
    const uint32_t   size{0U};
    const uint32_t   count{0U};
    const FormatType type{FormatType::NONE};
    const bool       hasAlpha{false};
    const bool       hasDepth{false};
    const bool       hasStencil{false};
    const bool       isCompressed{false};
};

struct MemoryStatus {
    uint32_t bufferSize{0U};
    uint32_t textureSize{0U};
};

struct DynamicStencilStates {
    uint32_t writeMask{0U};
    uint32_t compareMask{0U};
    uint32_t reference{0U};
};

struct DynamicStates {
    Viewport viewport;
    Rect     scissor;
    Color    blendConstant;
    float    lineWidth{1.F};
    float    depthBiasConstant{0.F};
    float    depthBiasClamp{0.F};
    float    depthBiasSlope{0.F};
    float    depthMinBounds{0.F};
    float    depthMaxBounds{0.F};

    DynamicStencilStates stencilStatesFront;
    DynamicStencilStates stencilStatesBack;
};

} // namespace gfx
} // namespace cc
