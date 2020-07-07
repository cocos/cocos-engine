#ifndef CC_CORE_GFX_DEF_H_
#define CC_CORE_GFX_DEF_H_

namespace cc {
namespace gfx {

class Device;
class Buffer;
class Texture;
class Sampler;
class Shader;
class InputAssembler;
class RenderPass;
class Framebuffer;
class BindingLayout;
class PipelineState;
class CommandAllocator;
class CommandBuffer;
class Fence;
class Queue;
class Window;
class Context;

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS     16
#define GFX_MAX_ATTACHMENTS       4
#define GFX_MAX_BUFFER_BINDINGS   24
#define GFX_INVALID_BINDING       ((uint8_t)-1)
#define GFX_INVALID_HANDLE        ((uint)-1)

enum class ObjectType : uint8_t {
    UNKNOWN,
    BUFFER,
    TEXTURE,
    TEXTURE_VIEW,
    RENDER_PASS,
    FRAMEBUFFER,
    SAMPLER,
    SHADER,
    PIPELINE_STATE,
    BINDING_LAYOUT,
    INPUT_ASSEMBLER,
    COMMAND_ALLOCATOR,
    COMMAND_BUFFER,
    FENCE,
    QUEUE,
    WINDOW,
};

enum class Status : uint8_t {
    UNREADY,
    FAILED,
    SUCCESS,
};

enum class API : uint8_t {
    UNKNOWN,
    GL,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    DX12,
    WEBGL,
    WEBGL2,
};

enum class Feature : uint8_t {
    COLOR_FLOAT,
    COLOR_HALF_FLOAT,
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    TEXTURE_FLOAT_LINEAR,
    TEXTURE_HALF_FLOAT_LINEAR,
    FORMAT_R11G11B10F,
    FORMAT_D16,
    FORMAT_D16S8,
    FORMAT_D24,
    FORMAT_D24S8,
    FORMAT_D32F,
    FORMAT_D32FS8,
    FORMAT_ETC1,
    FORMAT_ETC2,
    FORMAT_DXT,
    FORMAT_PVRTC,
    FORMAT_ASTC,
    FORMAT_RGB8,
    MSAA,
    ELEMENT_INDEX_UINT,
    INSTANCED_ARRAYS,
    DEPTH_BOUNDS,
    LINE_WIDTH,
    STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK,
    COUNT,
};

enum class Format : uint {

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

    // Total count
    COUNT,
};

enum class FormatType : uint8_t {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
};

enum class Type : uint8_t {
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
    SAMPLER1D,
    SAMPLER1D_ARRAY,
    SAMPLER2D,
    SAMPLER2D_ARRAY,
    SAMPLER3D,
    SAMPLER_CUBE,
    COUNT,
};

enum class BufferUsageBit : FlagBits {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX = 0x4,
    VERTEX = 0x8,
    UNIFORM = 0x10,
    STORAGE = 0x20,
    INDIRECT = 0x40,
};
typedef BufferUsageBit BufferUsage;
CC_ENUM_OPERATORS(BufferUsageBit);

enum class BufferFlagBit : FlagBits {
    NONE = 0,
    BAKUP_BUFFER = 0x4,
};
typedef BufferFlagBit BufferFlags;
CC_ENUM_OPERATORS(BufferFlagBit);

enum class BufferAccessBit : FlagBits {
    NONE = 0,
    READ = 0x1,
    WRITE = 0x2,
};
typedef BufferAccessBit BufferAccess;
CC_ENUM_OPERATORS(BufferAccessBit);

enum class MemoryUsageBit : FlagBits {
    NONE = 0,
    DEVICE = 0x1,
    HOST = 0x2,
};
typedef MemoryUsageBit MemoryUsage;
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
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    SAMPLED = 0x4,
    STORAGE = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    TRANSIENT_ATTACHMENT = 0x40,
    INPUT_ATTACHMENT = 0x80,
};
typedef TextureUsageBit TextureUsage;
CC_ENUM_OPERATORS(TextureUsageBit);

enum class TextureFlagBit : FlagBits {
    NONE = 0,
    GEN_MIPMAP = 0x1,
    CUBEMAP = 0x2,
    BAKUP_BUFFER = 0x4,
};
typedef TextureFlagBit TextureFlags;
CC_ENUM_OPERATORS(TextureFlagBit);

enum class SampleCount : uint8_t {
    X1,
    X2,
    X4,
    X8,
    X16,
    X32,
    X64,
};

enum class Filter : uint8_t {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
};

enum class Address : uint8_t {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
};

enum class ComparisonFunc : uint8_t {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
};

enum class StencilOp : uint8_t {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
};

enum class BlendFactor : uint8_t {
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

enum class BlendOp : uint8_t {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
};

enum class ColorMask : uint8_t {
    NONE = 0x0,
    R = 0x1,
    G = 0x2,
    B = 0x4,
    A = 0x8,
    ALL = R | G | B | A,
};
CC_ENUM_OPERATORS(ColorMask);

enum class ShaderType : uint8_t {
    NONE = 0x0,
    VERTEX = 0x1,
    CONTROL = 0x2,
    EVALUATION = 0x4,
    GEOMETRY = 0x8,
    FRAGMENT = 0x10,
    COMPUTE = 0x20,
    ALL = 0x3f,
};
CC_ENUM_OPERATORS(ShaderType);

enum class LoadOp : uint8_t {
    LOAD,    // Load the contents from the fbo from previous
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore writing to the fbo and keep old data
};

enum class StoreOp : uint8_t {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
};

enum class TextureLayout : uint8_t {
    UNDEFINED,
    GENERAL,
    COLOR_ATTACHMENT_OPTIMAL,
    DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
    DEPTH_STENCIL_READONLY_OPTIMAL,
    SHADER_READONLY_OPTIMAL,
    TRANSFER_SRC_OPTIMAL,
    TRANSFER_DST_OPTIMAL,
    PREINITIALIZED,
    PRESENT_SRC,
};

enum class PipelineBindPoint : uint8_t {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
};

enum class PrimitiveMode : uint8_t {
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

enum class PolygonMode : uint8_t {
    FILL,
    POINT,
    LINE,
};

enum class ShadeModel : uint8_t {
    GOURAND,
    FLAT,
};

enum class CullMode : uint8_t {
    NONE,
    FRONT,
    BACK,
};

enum class DynamicState : uint8_t {
    VIEWPORT,
    SCISSOR,
    LINE_WIDTH,
    DEPTH_BIAS,
    BLEND_CONSTANTS,
    DEPTH_BOUNDS,
    STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK,
};

typedef vector<DynamicState> DynamicStateList;

enum class StencilFace : uint8_t {
    FRONT,
    BACK,
    ALL,
};

enum class BindingType : uint8_t {
    UNKNOWN,
    UNIFORM_BUFFER,
    SAMPLER,
    STORAGE_BUFFER,
};

enum class QueueType : uint8_t {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
};

enum class CommandBufferType : uint8_t {
    PRIMARY,
    SECONDARY,
};

enum class ClearFlagBit : uint8_t {
    NONE = 0,
    COLOR = 0x1,
    DEPTH = 0x2,
    STENCIL = 0x4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL = COLOR | DEPTH | STENCIL,
};
typedef ClearFlagBit ClearFlags;
CC_ENUM_OPERATORS(ClearFlags);

enum class VsyncMode : uint8_t {
    // The application does not synchronizes with the vertical sync. If application renders faster than the display refreshes, frames are wasted and tearing may be observed. FPS is uncapped. Maximum power consumption. If unsupported, "ON" value will be used instead. Minimum latency.
    OFF,
    // The application is always synchronized with the vertical sync. Tearing does not happen. FPS is capped to the display's refresh rate. For fast applications, battery life is improved. Always supported.
    ON,
    // The application synchronizes with the vertical sync, but only if the application rendering speed is greater than refresh rate. Compared to OFF, there is no tearing. Compared to ON, the FPS will be improved for "slower" applications. If unsupported, "ON" value will be used instead. Recommended for most applications. Default if supported.
    RELAXED,
    // The presentation engine will always use the latest fully rendered image. Compared to OFF, no tearing will be observed. Compared to ON, battery power will be worse, especially for faster applications. If unsupported,  "OFF" will be attempted next.
    MAILBOX,
    // The application is capped to using half the vertical sync time. FPS artificially capped to Half the display speed (usually 30fps) to maintain battery. Best possible battery savings. Worst possible performance. Recommended for specific applications where battery saving is critical.
    HALF,
};

struct Offset {
    int x;
    int y;
    int z;
};

struct Rect {
    int x = 0;
    int y = 0;
    uint width = 0u;
    uint height = 0u;

    bool operator==(const Rect &rs) {
        if (x == rs.x &&
            y == rs.y &&
            width == rs.width &&
            height == rs.height) {
            return true;
        } else
            return false;
    }

    bool operator!=(const Rect &rs) {
        return !(*this == rs);
    }
};

struct Extent {
    uint width;
    uint height;
    uint depth;
};

struct TextureSubres {
    uint mipLevel = 0u;
    uint baseArrayLayer = 0u;
    uint layerCount = 1u;
};

struct TextureCopy {
    TextureSubres srcSubres;
    Offset srcOffset = {0, 0, 0};
    TextureSubres dstSubres;
    Offset dstOffset = {0, 0, 0};
    Extent extent = {0, 0, 1};
};

struct BufferTextureCopy {
    uint buffStride = 0;
    uint buffTexHeight = 0;
    Offset texOffset = {0, 0, 0};
    Extent texExtent = {0, 0, 1};
    TextureSubres texSubres;
};
typedef vector<BufferTextureCopy> BufferTextureCopyList;

struct DataArray {
    vector<uint8_t *> datas;
};

struct Viewport {
    int left = 0;
    int top = 0;
    uint width = 0;
    uint height = 0;
    float minDepth = 0.0f;
    float maxDepth = 1.0f;

    bool operator==(const Viewport &rs) {
        if (left == rs.left &&
            top == rs.top &&
            width == rs.width &&
            height == rs.height &&
            math::IsEqualF(minDepth, rs.minDepth) &&
            math::IsEqualF(maxDepth, maxDepth)) {
            return true;
        } else
            return false;
    }

    bool operator!=(const Viewport &rs) {
        return !(*this == rs);
    }
};

#pragma pack(push, 1)
struct Color {
    float r = 0.0f;
    float g = 0.0f;
    float b = 0.0f;
    float a = 0.0f;
};
#pragma pack(pop)

struct DeviceInfo {
    uintptr_t windowHandle = 0;
    uint width = 0;
    uint height = 0;
    uint nativeWidth = 0;
    uint nativeHeight = 0;
    Context *sharedCtx = nullptr;
};

struct WindowInfo {
    String title;
    int left = 0;
    int top = 0;
    uint width = 800;
    uint height = 600;
    Format colorFmt = Format::UNKNOWN;
    Format depthStencilFmt = Format::UNKNOWN;
    bool isOffscreen = false;
    bool isFullscreen = false;
    VsyncMode vsyncMode = VsyncMode::OFF;
    uintptr_t windowHandle = 0;
    RenderPass *renderPass = nullptr;
};

struct ContextInfo {
    uintptr_t windowHandle = 0;
    Context *sharedCtx = nullptr;
    VsyncMode vsyncMode = VsyncMode::RELAXED;
};

struct BufferInfo {
    BufferUsage usage = BufferUsage::NONE;
    MemoryUsage memUsage = MemoryUsage::NONE;
    uint stride = 1;
    uint size = 0;
    BufferFlags flags = BufferFlagBit::NONE;
};

#pragma pack(push, 1)
struct DrawInfo {
    uint vertexCount = 0;
    uint firstVertex = 0;
    uint indexCount = 0;
    uint firstIndex = 0;
    uint vertexOffset = 0;
    uint instanceCount = 0;
    uint firstInstance = 0;
};
#pragma pack(pop)

typedef vector<DrawInfo> DrawInfoList;

struct IndirectBuffer {
    DrawInfoList drawInfos;
};

struct TextureInfo {
    TextureType type = TextureType::TEX2D;
    TextureUsage usage = TextureUsageBit::NONE;
    Format format = Format::UNKNOWN;
    uint width = 0;
    uint height = 0;
    uint depth = 1;
    uint arrayLayer = 1;
    uint mipLevel = 1;
    SampleCount samples = SampleCount::X1;
    TextureFlags flags = TextureFlagBit::NONE;
};

struct TextureViewInfo {
    Texture *texture = nullptr;
    TextureType type = TextureType::TEX2D;
    Format format = Format::UNKNOWN;
    uint baseLevel = 0;
    uint levelCount = 1;
    uint baseLayer = 0;
    uint layerCount = 1;
};

struct SamplerInfo {
    String name;
    Filter minFilter = Filter::LINEAR;
    Filter magFilter = Filter::LINEAR;
    Filter mipFilter = Filter::NONE;
    Address addressU = Address::WRAP;
    Address addressV = Address::WRAP;
    Address addressW = Address::WRAP;
    uint maxAnisotropy = 16;
    ComparisonFunc cmpFunc = ComparisonFunc::NEVER;
    Color borderColor;
    uint minLOD = 0;
    uint maxLOD = 1000;
    float mipLODBias = 0.0f;
};

struct ShaderMacro {
    String macro;
    String value;
};

typedef vector<ShaderMacro> ShaderMacroList;

struct Uniform {
    String name;
    Type type = Type::UNKNOWN;
    uint count = 0;
};

typedef vector<Uniform> UniformList;

struct UniformBlock {
    ShaderType shaderStages = ShaderType::NONE;
    uint binding = 0;
    String name;
    UniformList uniforms;
};

typedef vector<UniformBlock> UniformBlockList;

struct UniformSampler {
    ShaderType shaderStages = ShaderType::NONE;
    uint binding = 0;
    String name;
    Type type = Type::UNKNOWN;
    uint count = 0;
};

typedef vector<UniformSampler> UniformSamplerList;

struct ShaderStage {
    ShaderType type;
    String source;
    ShaderMacroList macros;
};

typedef vector<ShaderStage> ShaderStageList;

struct Attribute {
    String name;
    Format format = Format::UNKNOWN;
    bool isNormalized = false;
    uint stream = 0;
    bool isInstanced = false;
    uint location = 0;
};

typedef vector<Attribute> AttributeList;
typedef vector<Buffer *> BufferList;

struct ShaderInfo {
    String name;
    ShaderStageList stages;
    AttributeList attributes;
    UniformBlockList blocks;
    UniformSamplerList samplers;
};

struct InputAssemblerInfo {
    AttributeList attributes;
    BufferList vertexBuffers;
    Buffer *indexBuffer = nullptr;
    Buffer *indirectBuffer = nullptr;
};

struct ColorAttachment {
    Format format = Format::UNKNOWN;
    LoadOp loadOp = LoadOp::CLEAR;
    StoreOp storeOp = StoreOp::STORE;
    uint sampleCount = 1;
    TextureLayout beginLayout = TextureLayout::UNDEFINED;
    TextureLayout endLayout = TextureLayout::PRESENT_SRC;
};

typedef vector<ColorAttachment> ColorAttachmentList;

struct DepthStencilAttachment {
    Format format = Format::UNKNOWN;
    LoadOp depthLoadOp = LoadOp::CLEAR;
    StoreOp depthStoreOp = StoreOp::STORE;
    LoadOp stencilLoadOp = LoadOp::CLEAR;
    StoreOp stencilStoreOp = StoreOp::STORE;
    uint sampleCount = 1;
    TextureLayout beginLayout = TextureLayout::UNDEFINED;
    TextureLayout endLayout = TextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
};

struct SubPass {
    PipelineBindPoint bindPoint = PipelineBindPoint::GRAPHICS;
    uint8_t inputs[GFX_MAX_ATTACHMENTS];
    uint8_t colors[GFX_MAX_ATTACHMENTS];
    uint8_t resolves[GFX_MAX_ATTACHMENTS];
    uint8_t depthStencil = GFX_INVALID_BINDING;
    uint8_t preserves[GFX_MAX_ATTACHMENTS];

    SubPass() {
        memset(inputs, -1, sizeof(inputs));
        memset(colors, -1, sizeof(colors));
        memset(resolves, -1, sizeof(resolves));
        memset(preserves, -1, sizeof(preserves));
    }
};

typedef vector<SubPass> SubPassList;

struct RenderPassInfo {
    ColorAttachmentList colorAttachments;
    DepthStencilAttachment depthStencilAttachment;
    SubPassList subPasses;
};

typedef vector<Texture *> TextureList;

struct FramebufferInfo {
    RenderPass *renderPass = nullptr;
    TextureList colorTextures;
    vector<int> colorMipmapLevels;
    Texture *depthStencilTexture = nullptr;
    int depthStencilMipmapLevel = 0;
};

struct BindingLayoutInfo {
    Shader *shader = nullptr;
};

struct BindingUnit {
    ShaderType shaderStages = ShaderType::NONE;
    uint binding = 0;
    BindingType type = BindingType::UNKNOWN;
    String name;
    uint count = 0;
    Buffer *buffer = nullptr;
    Texture *texture = nullptr;
    Sampler *sampler = nullptr;
};

typedef vector<BindingUnit> BindingUnitList;

struct InputState {
    AttributeList attributes;
};

struct RasterizerState {
    bool isDiscard = false;
    PolygonMode polygonMode = PolygonMode::FILL;
    ShadeModel shadeModel = ShadeModel::GOURAND;
    CullMode cullMode = CullMode::BACK;
    bool isFrontFaceCCW = true;
    bool depthBiasEnabled = false;
    float depthBias = 0.0f;
    float depthBiasClamp = 0.0f;
    float depthBiasSlop = 0.0f;
    bool isDepthClip = true;
    bool isMultisample = false;
    float lineWidth = 1.0f;
};

struct DepthStencilState {
    bool depthTest = true;
    bool depthWrite = true;
    ComparisonFunc depthFunc = ComparisonFunc::LESS;
    bool stencilTestFront = false;
    ComparisonFunc stencilFuncFront = ComparisonFunc::ALWAYS;
    uint stencilReadMaskFront = 0xffffffff;
    uint stencilWriteMaskFront = 0xffffffff;
    StencilOp stencilFailOpFront = StencilOp::KEEP;
    StencilOp stencilZFailOpFront = StencilOp::KEEP;
    StencilOp stencilPassOpFront = StencilOp::KEEP;
    uint stencilRefFront = 1;
    bool stencilTestBack = false;
    ComparisonFunc stencilFuncBack = ComparisonFunc::ALWAYS;
    uint stencilReadMaskBack = 0xffffffff;
    uint stencilWriteMaskBack = 0xffffffff;
    StencilOp stencilFailOpBack = StencilOp::KEEP;
    StencilOp stencilZFailOpBack = StencilOp::KEEP;
    StencilOp stencilPassOpBack = StencilOp::KEEP;
    uint stencilRefBack = 1;
};

struct BlendTarget {
    bool blend = false;
    BlendFactor blendSrc = BlendFactor::ONE;
    BlendFactor blendDst = BlendFactor::ZERO;
    BlendOp blendEq = BlendOp::ADD;
    BlendFactor blendSrcAlpha = BlendFactor::ONE;
    BlendFactor blendDstAlpha = BlendFactor::ZERO;
    BlendOp blendAlphaEq = BlendOp::ADD;
    ColorMask blendColorMask = ColorMask::ALL;
};

typedef vector<BlendTarget> BlendTargetList;

struct BlendState {
    bool isA2C = false;
    bool isIndepend = false;
    Color blendColor;
    BlendTargetList targets;

    BlendState() {
        targets.emplace_back(BlendTarget());
    }
};

struct PipelineStateInfo {
    PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
    Shader *shader = nullptr;
    InputState inputState;
    RasterizerState rasterizerState;
    DepthStencilState depthStencilState;
    BlendState blendState;
    DynamicStateList dynamicStates;
    RenderPass *renderPass = nullptr;
};

struct CommandBufferInfo {
    Queue *queue = nullptr;
    CommandBufferType type = CommandBufferType::PRIMARY;
};

struct QueueInfo {
    QueueType type = QueueType::GRAPHICS;
    bool forceSync = false;
};

struct FenceInfo {
};

struct FormatInfo {
    String name;
    uint size = 0;
    uint count = 0;
    FormatType type = FormatType::NONE;
    bool hasAlpha = false;
    bool hasDepth = false;
    bool hasStencil = false;
    bool isCompressed = false;
};

extern CC_DLL const FormatInfo GFX_FORMAT_INFOS[];
extern CC_DLL const uint GFX_TYPE_SIZES[];

struct MemoryStatus {
    uint bufferSize = 0;
    uint textureSize = 0;
};

extern CC_DLL uint FormatSize(Format format, uint width, uint height, uint depth);

extern CC_DLL uint FormatSurfaceSize(Format format, uint width, uint height, uint depth, uint mips);

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DEF_H_
