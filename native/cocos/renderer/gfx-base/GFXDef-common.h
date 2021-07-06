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
 * * macros are hardcoded in the generator for now
 * * aliases can only be used as types, not values (e.g. BufferUsage::NONE is illegal)
 * * parser directives can be specified in comments right after struct member declarations:
 *   * @ts-nullable: declare the member optional
 *   * @ts-overrides `YAML declaration`: overrides any parsed results, use with caution
 * * each struct member have to be specified in a single line, including optional parser directives
 */

namespace cc {
namespace gfx {

class GFXObject;
class Device;
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
class Window;
class Context;

using TextureBarrierList = vector<TextureBarrier *>;
using BufferDataList     = vector<const uint8_t *>;
using CommandBufferList  = vector<CommandBuffer *>;

constexpr uint MAX_ATTACHMENTS  = 4U;
constexpr uint INVALID_BINDING  = static_cast<uint>(-1);
constexpr uint SUBPASS_EXTERNAL = static_cast<uint>(-1);

using BufferList              = vector<Buffer *>;
using TextureList             = vector<Texture *>;
using SamplerList             = vector<Sampler *>;
using DescriptorSetLayoutList = vector<DescriptorSetLayout *>;

enum class ObjectType {
    UNKNOWN,
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
    GLOBAL_BARRIER,
    TEXTURE_BARRIER,
    BUFFER_BARRIER,
};

enum class Status {
    UNREADY,
    FAILED,
    SUCCESS,
};

enum class API {
    UNKNOWN,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    WEBGL,
    WEBGL2,
    WEBGPU,
};

enum class SurfaceTransform {
    IDENTITY,
    ROTATE_90,
    ROTATE_180,
    ROTATE_270,
};

enum class Feature {
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
    COUNT,
};

enum class Format {

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
    D16,
    D16S8,
    D24,
    D24S8,
    D32F,
    D32F_S8,

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

enum class FormatType {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
};

enum class Type {
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
bool isCombinedImageSampler(Type type);
bool isSampledImage(Type type);
bool isStorageImage(Type type);

enum class BufferUsageBit : FlagBits {
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
CC_ENUM_OPERATORS(BufferUsageBit);

enum class BufferFlagBit : FlagBits {
    NONE = 0,
};
using BufferFlags = BufferFlagBit;
CC_ENUM_OPERATORS(BufferFlagBit);

enum class MemoryAccessBit : FlagBits {
    NONE       = 0,
    READ_ONLY  = 0x1,
    WRITE_ONLY = 0x2,
    READ_WRITE = READ_ONLY | WRITE_ONLY,
};
using MemoryAccess = MemoryAccessBit;

enum class MemoryUsageBit : FlagBits {
    NONE   = 0,
    DEVICE = 0x1,
    HOST   = 0x2,
};
using MemoryUsage = MemoryUsageBit;
CC_ENUM_OPERATORS(MemoryUsageBit);

enum class TextureType {
    TEX1D,
    TEX2D,
    TEX3D,
    CUBE,
    TEX1D_ARRAY,
    TEX2D_ARRAY,
};

enum class TextureUsageBit : FlagBits {
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
CC_ENUM_OPERATORS(TextureUsageBit);

enum class TextureFlagBit : FlagBits {
    NONE           = 0,
    GEN_MIPMAP     = 0x1,
    IMMUTABLE      = 0x2,
    GENERAL_LAYOUT = 0x4,
};
using TextureFlags = TextureFlagBit;
CC_ENUM_OPERATORS(TextureFlagBit);

enum class SampleCount {
    X1  = 0x1,
    X2  = 0x2,
    X4  = 0x4,
    X8  = 0x8,
    X16 = 0x10,
    X32 = 0x20,
    X64 = 0x40,
};

enum class Filter {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
};

enum class Address {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
};

enum class ComparisonFunc {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
};

enum class StencilOp {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
};

enum class BlendFactor {
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

enum class BlendOp {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
};

enum class ColorMask : FlagBits {
    NONE = 0x0,
    R    = 0x1,
    G    = 0x2,
    B    = 0x4,
    A    = 0x8,
    ALL  = R | G | B | A,
};
CC_ENUM_OPERATORS(ColorMask);

enum class ShaderStageFlagBit : FlagBits {
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
CC_ENUM_OPERATORS(ShaderStageFlagBit);

enum class LoadOp {
    LOAD,    // Load the contents from the fbo from previous
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore writing to the fbo and keep old data
};

enum class StoreOp {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
};

enum class AccessType {
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

using AccessTypeList = std::vector<AccessType>;

enum class ResolveMode {
    NONE,
    SAMPLE_ZERO,
    AVERAGE,
    MIN,
    MAX,
};

enum class PipelineBindPoint {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
};

enum class PrimitiveMode {
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

enum class PolygonMode {
    FILL,
    POINT,
    LINE,
};

enum class ShadeModel {
    GOURAND,
    FLAT,
};

enum class CullMode {
    NONE,
    FRONT,
    BACK,
};

enum class DynamicStateFlagBit : FlagBits {
    NONE                 = 0x0,
    VIEWPORT             = 0x1,
    SCISSOR              = 0x2,
    LINE_WIDTH           = 0x4,
    DEPTH_BIAS           = 0x8,
    BLEND_CONSTANTS      = 0x10,
    DEPTH_BOUNDS         = 0x20,
    STENCIL_WRITE_MASK   = 0x40,
    STENCIL_COMPARE_MASK = 0x80,
};
using DynamicStateFlags = DynamicStateFlagBit;
CC_ENUM_OPERATORS(DynamicStateFlagBit);

using DynamicStateList = vector<DynamicStateFlagBit>;

enum class StencilFace {
    FRONT = 0x1,
    BACK  = 0x2,
    ALL   = 0x3,
};
CC_ENUM_OPERATORS(StencilFace);

enum class DescriptorType : FlagBits {
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
CC_ENUM_OPERATORS(DescriptorType);

enum class QueueType {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
};

enum class CommandBufferType {
    PRIMARY,
    SECONDARY,
};

enum class ClearFlagBit : FlagBits {
    NONE          = 0,
    COLOR         = 0x1,
    DEPTH         = 0x2,
    STENCIL       = 0x4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL           = COLOR | DEPTH | STENCIL,
};
using ClearFlags = ClearFlagBit;
CC_ENUM_OPERATORS(ClearFlagBit);

struct Size {
    uint x = 0U;
    uint y = 0U;
    uint z = 0U;
};

struct DeviceCaps {
    uint maxVertexAttributes            = 0U;
    uint maxVertexUniformVectors        = 0U;
    uint maxFragmentUniformVectors      = 0U;
    uint maxTextureUnits                = 0U;
    uint maxImageUnits                  = 0U;
    uint maxVertexTextureUnits          = 0U;
    uint maxColorRenderTargets          = 0U;
    uint maxShaderStorageBufferBindings = 0U;
    uint maxShaderStorageBlockSize      = 0U;
    uint maxUniformBufferBindings       = 0U;
    uint maxUniformBlockSize            = 0U;
    uint maxTextureSize                 = 0U;
    uint maxCubeMapTextureSize          = 0U;
    uint depthBits                      = 0U;
    uint stencilBits                    = 0U;
    uint uboOffsetAlignment             = 1U;

    uint maxComputeSharedMemorySize     = 0U;
    uint maxComputeWorkGroupInvocations = 0U;
    Size maxComputeWorkGroupSize;
    Size maxComputeWorkGroupCount;

    float clipSpaceMinZ    = -1.0F;
    float screenSpaceSignY = 1.0F;
    float clipSpaceSignY   = 1.0F;
};

struct Offset {
    int x = 0;
    int y = 0;
    int z = 0;
};

struct Rect {
    int  x      = 0;
    int  y      = 0;
    uint width  = 0U;
    uint height = 0U;

    bool operator==(const Rect &rs) const {
        return x == rs.x &&
               y == rs.y &&
               width == rs.width &&
               height == rs.height;
    }

    bool operator!=(const Rect &rs) const {
        return !(*this == rs);
    }
};

struct Extent {
    uint width  = 0U;
    uint height = 0U;
    uint depth  = 1U;
};

struct TextureSubresLayers {
    uint mipLevel       = 0U;
    uint baseArrayLayer = 0U;
    uint layerCount     = 1U;
};

struct TextureSubresRange {
    uint baseMipLevel   = 0U;
    uint levelCount     = 1U;
    uint baseArrayLayer = 0U;
    uint layerCount     = 1U;
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
    uint                buffStride    = 0;
    uint                buffTexHeight = 0;
    Offset              texOffset;
    Extent              texExtent;
    TextureSubresLayers texSubres;
};
using BufferTextureCopyList = vector<BufferTextureCopy>;

struct Viewport {
    int   left     = 0;
    int   top      = 0;
    uint  width    = 0;
    uint  height   = 0;
    float minDepth = 0.0F;
    float maxDepth = 1.0F;

    bool operator==(const Viewport &rs) const {
        return (left == rs.left &&
                top == rs.top &&
                width == rs.width &&
                height == rs.height &&
                math::IsEqualF(minDepth, rs.minDepth) &&
                math::IsEqualF(maxDepth, maxDepth));
    }

    bool operator!=(const Viewport &rs) const {
        return !(*this == rs);
    }
};

struct Color {
    float x = 0.0F;
    float y = 0.0F;
    float z = 0.0F;
    float w = 0.0F;

    bool operator==(const Color &rhs) const {
        return (math::IsEqualF(x, rhs.x) &&
                math::IsEqualF(y, rhs.y) &&
                math::IsEqualF(z, rhs.z) &&
                math::IsEqualF(w, rhs.w));
    }
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
    std::vector<int> bufferOffsets;
    std::vector<int> samplerOffsets;
    uint             flexibleSet = 0U;
};

struct BufferInfo {
    BufferUsage usage    = BufferUsageBit::NONE;
    MemoryUsage memUsage = MemoryUsageBit::NONE;
    uint        size     = 0U;
    uint        stride   = 0U; // in bytes
    BufferFlags flags    = BufferFlagBit::NONE;
};

struct BufferViewInfo {
    Buffer *buffer = nullptr;
    uint    offset = 0U;
    uint    range  = 0U;
};

struct DrawInfo {
    uint vertexCount   = 0U;
    uint firstVertex   = 0U;
    uint indexCount    = 0U;
    uint firstIndex    = 0U;
    int  vertexOffset  = 0;
    uint instanceCount = 0U;
    uint firstInstance = 0U;
};

using DrawInfoList = vector<DrawInfo>;

struct DispatchInfo {
    uint groupCountX = 0U;
    uint groupCountY = 0U;
    uint groupCountZ = 0U;

    Buffer *indirectBuffer = nullptr; // @ts-nullable
    uint    indirectOffset = 0U;
};

using DispatchInfoList = vector<DispatchInfo>;

struct IndirectBuffer {
    DrawInfoList drawInfos;
};

struct TextureInfo {
    TextureType  type       = TextureType::TEX2D;
    TextureUsage usage      = TextureUsageBit::NONE;
    Format       format     = Format::UNKNOWN;
    uint         width      = 0U;
    uint         height     = 0U;
    TextureFlags flags      = TextureFlagBit::NONE;
    uint         layerCount = 1U;
    uint         levelCount = 1U;
    SampleCount  samples    = SampleCount::X1;
    uint         depth      = 1U;
};

struct TextureViewInfo {
    Texture *   texture    = nullptr;
    TextureType type       = TextureType::TEX2D;
    Format      format     = Format::UNKNOWN;
    uint        baseLevel  = 0U;
    uint        levelCount = 1U;
    uint        baseLayer  = 0U;
    uint        layerCount = 1U;
};

struct SamplerInfo {
    Filter         minFilter     = Filter::LINEAR;
    Filter         magFilter     = Filter::LINEAR;
    Filter         mipFilter     = Filter::NONE;
    Address        addressU      = Address::WRAP;
    Address        addressV      = Address::WRAP;
    Address        addressW      = Address::WRAP;
    uint           maxAnisotropy = 0U;
    ComparisonFunc cmpFunc       = ComparisonFunc::ALWAYS;
    Color          borderColor;
    float          mipLODBias = 0.0F;
};

struct Uniform {
    String name;
    Type   type  = Type::UNKNOWN;
    uint   count = 0U;
};

using UniformList = vector<Uniform>;

struct UniformBlock {
    uint        set     = 0U;
    uint        binding = 0U;
    String      name;
    UniformList members;
    uint        count = 0U;
};

using UniformBlockList = vector<UniformBlock>;

struct UniformSamplerTexture {
    uint   set     = 0U;
    uint   binding = 0U;
    String name;
    Type   type  = Type::UNKNOWN;
    uint   count = 0U;
};

using UniformSamplerTextureList = vector<UniformSamplerTexture>;

struct UniformSampler {
    uint   set     = 0U;
    uint   binding = 0U;
    String name;
    uint   count = 0U;
};

using UniformSamplerList = vector<UniformSampler>;

struct UniformTexture {
    uint   set     = 0U;
    uint   binding = 0U;
    String name;
    Type   type  = Type::UNKNOWN;
    uint   count = 0U;
};

using UniformTextureList = vector<UniformTexture>;

struct UniformStorageImage {
    uint         set     = 0U;
    uint         binding = 0U;
    String       name;
    Type         type         = Type::UNKNOWN;
    uint         count        = 0U;
    MemoryAccess memoryAccess = MemoryAccessBit::READ_WRITE;
};

using UniformStorageImageList = vector<UniformStorageImage>;

struct UniformStorageBuffer {
    uint         set     = 0U;
    uint         binding = 0U;
    String       name;
    uint         count        = 0U;
    MemoryAccess memoryAccess = MemoryAccessBit::READ_WRITE;
};

using UniformStorageBufferList = vector<UniformStorageBuffer>;

struct UniformInputAttachment {
    uint   set     = 0U;
    uint   binding = 0U;
    String name;
    uint   count = 0U;
};

using UniformInputAttachmentList = vector<UniformInputAttachment>;

struct ShaderStage {
    ShaderStageFlagBit stage = ShaderStageFlagBit::NONE;
    String             source;
};

using ShaderStageList = vector<ShaderStage>;

struct Attribute {
    String name;
    Format format       = Format::UNKNOWN;
    bool   isNormalized = false;
    uint   stream       = 0;
    bool   isInstanced  = false;
    uint   location     = 0;
};

using AttributeList = vector<Attribute>;

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
    Buffer *      indexBuffer    = nullptr; // @ts-nullable
    Buffer *      indirectBuffer = nullptr; // @ts-nullable
};

struct ColorAttachment {
    Format                  format      = Format::UNKNOWN;
    SampleCount             sampleCount = SampleCount::X1;
    LoadOp                  loadOp      = LoadOp::CLEAR;
    StoreOp                 storeOp     = StoreOp::STORE;
    std::vector<AccessType> beginAccesses;
    std::vector<AccessType> endAccesses{AccessType::PRESENT};
    bool                    isGeneralLayout = false;
};

using ColorAttachmentList = vector<ColorAttachment>;

struct DepthStencilAttachment {
    Format                  format         = Format::UNKNOWN;
    SampleCount             sampleCount    = SampleCount::X1;
    LoadOp                  depthLoadOp    = LoadOp::CLEAR;
    StoreOp                 depthStoreOp   = StoreOp::STORE;
    LoadOp                  stencilLoadOp  = LoadOp::CLEAR;
    StoreOp                 stencilStoreOp = StoreOp::STORE;
    std::vector<AccessType> beginAccesses;
    std::vector<AccessType> endAccesses{AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
    bool                    isGeneralLayout = false;
};

struct SubpassInfo {
    std::vector<uint> inputs;
    std::vector<uint> colors;
    std::vector<uint> resolves;
    std::vector<uint> preserves;

    uint        depthStencil        = INVALID_BINDING;
    uint        depthStencilResolve = INVALID_BINDING;
    ResolveMode depthResolveMode    = ResolveMode::NONE;
    ResolveMode stencilResolveMode  = ResolveMode::NONE;
};

using SubpassInfoList = vector<SubpassInfo>;

struct SubpassDependency {
    uint                    srcSubpass = 0U;
    uint                    dstSubpass = 0U;
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

    bool discardContents = false;

    Queue *srcQueue = nullptr; // @ts-nullable
    Queue *dstQueue = nullptr; // @ts-nullable
};
using TextureBarrierInfoList = vector<TextureBarrierInfo>;

struct FramebufferInfo {
    RenderPass *      renderPass = nullptr;
    TextureList       colorTextures;                 // @ts-overrides { type: '(Texture | null)[]' }
    Texture *         depthStencilTexture = nullptr; // @ts-nullable
};

struct DescriptorSetLayoutBinding {
    uint             binding        = INVALID_BINDING;
    DescriptorType   descriptorType = DescriptorType::UNKNOWN;
    uint             count          = 0;
    ShaderStageFlags stageFlags     = ShaderStageFlagBit::NONE;
    SamplerList      immutableSamplers;
};
using DescriptorSetLayoutBindingList = vector<DescriptorSetLayoutBinding>;

struct DescriptorSetLayoutInfo {
    DescriptorSetLayoutBindingList bindings;
};

struct DescriptorSetInfo {
    DescriptorSetLayout *layout = nullptr;
};

struct PipelineLayoutInfo {
    DescriptorSetLayoutList setLayouts;
};

struct InputState {
    AttributeList attributes;
};

// Use uint for all boolean values to convert memory to RasterizerState* in shared memory.
struct RasterizerState {
    uint        isDiscard        = 0;
    PolygonMode polygonMode      = PolygonMode::FILL;
    ShadeModel  shadeModel       = ShadeModel::GOURAND;
    CullMode    cullMode         = CullMode::BACK;
    uint        isFrontFaceCCW   = 1;
    uint        depthBiasEnabled = 0;
    float       depthBias        = 0.0F;
    float       depthBiasClamp   = 0.0F;
    float       depthBiasSlop    = 0.0F;
    uint        isDepthClip      = 1;
    uint        isMultisample    = 0;
    float       lineWidth        = 1.0F;
};

// Use uint for all boolean values to convert memory to DepthStencilState* in shared memory.
struct DepthStencilState {
    uint           depthTest             = 1;
    uint           depthWrite            = 1;
    ComparisonFunc depthFunc             = ComparisonFunc::LESS;
    uint           stencilTestFront      = 0;
    ComparisonFunc stencilFuncFront      = ComparisonFunc::ALWAYS;
    uint           stencilReadMaskFront  = 0xffffffff;
    uint           stencilWriteMaskFront = 0xffffffff;
    StencilOp      stencilFailOpFront    = StencilOp::KEEP;
    StencilOp      stencilZFailOpFront   = StencilOp::KEEP;
    StencilOp      stencilPassOpFront    = StencilOp::KEEP;
    uint           stencilRefFront       = 1;
    uint           stencilTestBack       = 0;
    ComparisonFunc stencilFuncBack       = ComparisonFunc::ALWAYS;
    uint           stencilReadMaskBack   = 0xffffffff;
    uint           stencilWriteMaskBack  = 0xffffffff;
    StencilOp      stencilFailOpBack     = StencilOp::KEEP;
    StencilOp      stencilZFailOpBack    = StencilOp::KEEP;
    StencilOp      stencilPassOpBack     = StencilOp::KEEP;
    uint           stencilRefBack        = 1;
};

// Use uint for all boolean values to do convert memory to BlendTarget* in shared memory.
struct BlendTarget {
    uint        blend          = 0;
    BlendFactor blendSrc       = BlendFactor::ONE;
    BlendFactor blendDst       = BlendFactor::ZERO;
    BlendOp     blendEq        = BlendOp::ADD;
    BlendFactor blendSrcAlpha  = BlendFactor::ONE;
    BlendFactor blendDstAlpha  = BlendFactor::ZERO;
    BlendOp     blendAlphaEq   = BlendOp::ADD;
    ColorMask   blendColorMask = ColorMask::ALL;
};

using BlendTargetList = vector<BlendTarget>;

// Use uint for all boolean values to do memeory copy in shared memory.
struct BlendState {
    uint            isA2C      = 0;
    uint            isIndepend = 0;
    Color           blendColor;
    BlendTargetList targets{1};
};

struct PipelineStateInfo {
    Shader *          shader         = nullptr;
    PipelineLayout *  pipelineLayout = nullptr;
    RenderPass *      renderPass     = nullptr;
    InputState        inputState;
    RasterizerState   rasterizerState;
    DepthStencilState depthStencilState;
    BlendState        blendState;
    PrimitiveMode     primitive     = PrimitiveMode::TRIANGLE_LIST;
    DynamicStateFlags dynamicStates = DynamicStateFlagBit::NONE;
    PipelineBindPoint bindPoint     = PipelineBindPoint::GRAPHICS;
    uint              subpass       = 0U;
};

struct CommandBufferInfo {
    Queue *           queue = nullptr;
    CommandBufferType type  = CommandBufferType::PRIMARY;
};

struct QueueInfo {
    QueueType type = QueueType::GRAPHICS;
};

struct FormatInfo {
    const String     name;
    const uint       size         = 0;
    const uint       count        = 0;
    const FormatType type         = FormatType::NONE;
    const bool       hasAlpha     = false;
    const bool       hasDepth     = false;
    const bool       hasStencil   = false;
    const bool       isCompressed = false;
};

struct MemoryStatus {
    uint bufferSize  = 0;
    uint textureSize = 0;
};

struct DynamicStencilStates {
    uint writeMask   = 0U;
    uint compareMask = 0U;
    uint reference   = 0U;
};

struct DynamicStates {
    Viewport viewport;
    Rect     scissor;
    Color    blendConstant;
    float    lineWidth         = 1.F;
    float    depthBiasConstant = 0.F;
    float    depthBiasClamp    = 0.F;
    float    depthBiasSlope    = 0.F;
    float    depthMinBounds    = 0.F;
    float    depthMaxBounds    = 0.F;

    DynamicStencilStates stencilStatesFront;
    DynamicStencilStates stencilStatesBack;
};

} // namespace gfx
} // namespace cc
