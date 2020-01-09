#ifndef CC_CORE_GFX_DEF_H_
#define CC_CORE_GFX_DEF_H_

NS_CC_BEGIN

class GFXDevice;
class GFXBuffer;
class GFXTexture;
class GFXTextureView;
class GFXSampler;
class GFXShader;
class GFXInputAssembler;
class GFXRenderPass;
class GFXFramebuffer;
class GFXBindingLayout;
class GFXPipelineLayout;
class GFXPipelineState;
class GFXCommandAllocator;
class GFXCommandBuffer;
class GFXQueue;
class GFXWindow;
class GFXContext;

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS 16
#define GFX_MAX_ATTACHMENTS 4
#define GFX_MAX_BUFFER_BINDINGS 24
#define GFX_INVALID_BINDING ((uint8_t)-1)
#define GFX_INVALID_HANDLE ((uint)-1)

enum class GFXAPI : uint8_t {
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

enum class GFXFeature : uint8_t {
  COLOR_FLOAT,
  COLOR_HALF_FLOAT,
  TEXTURE_FLOAT,
  TEXTURE_HALF_FLOAT,
  TEXTURE_FLOAT_LINEAR,
  TEXTURE_HALF_FLOAT_LINEAR,
  FORMAT_R11G11B10F,
  FORMAT_D24S8,
  FORMAT_ETC1,
  FORMAT_ETC2,
  FORMAT_DXT,
  FORMAT_PVRTC,
  FORMAT_ASTC,
  MSAA,
  COUNT,
};

enum class GFXFormat : uint {
  
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
  SRGB8_A8,
  RGBA8SN,
  RGBA8UI,
  BGRA8UN,
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

enum class GFXFormatType : uint8_t {
  NONE,
  UNORM,
  SNORM,
  UINT,
  INT,
  UFLOAT,
  FLOAT,
};

enum class GFXType : uint8_t {
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

enum class GFXBufferUsageBit : FlagBits {
  NONE = 0,
  TRANSFER_SRC = 0x1,
  TRANSFER_DST = 0x2,
  INDEX = 0x4,
  VERTEX = 0x8,
  UNIFORM = 0x10,
  STORAGE = 0x20,
  INDIRECT = 0x40,
};
typedef GFXBufferUsageBit GFXBufferUsage;
CC_ENUM_OPERATORS(GFXBufferUsageBit);

enum class GFXBufferFlagBit : FlagBits {
  NONE = 0,
  BAKUP_BUFFER = 0x4,
};
typedef GFXBufferFlagBit GFXBufferFlags;
CC_ENUM_OPERATORS(GFXBufferFlagBit);

enum class GFXBufferAccessBit : FlagBits {
  NONE = 0,
  READ = 0x1,
  WRITE = 0x2,
};
typedef GFXBufferAccessBit GFXBufferAccess;
CC_ENUM_OPERATORS(GFXBufferAccessBit);

enum class GFXMemoryUsageBit : FlagBits {
  NONE = 0,
  DEVICE = 0x1,
  HOST = 0x2,
};
typedef GFXMemoryUsageBit  GFXMemoryUsage;
CC_ENUM_OPERATORS(GFXMemoryUsageBit);

enum class GFXTextureType {
  TEX1D,
  TEX2D,
  TEX3D,
};

enum class GFXTextureUsageBit : FlagBits {
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
typedef GFXTextureUsageBit GFXTextureUsage;
CC_ENUM_OPERATORS(GFXTextureUsageBit);

enum class GFXTextureFlagBit : FlagBits {
  NONE = 0,
  GEN_MIPMAP = 0x1,
  CUBEMAP = 0x2,
  BAKUP_BUFFER = 0x4,
};
typedef GFXTextureFlagBit GFXTextureFlags;
CC_ENUM_OPERATORS(GFXTextureFlagBit);

enum class GFXSampleCount : uint8_t {
  X1,
  X2,
  X4,
  X8,
  X16,
  X32,
  X64,
};

enum class GFXTextureViewType : uint8_t {
  TV1D,
  TV2D,
  TV3D,
  CUBE,
  TV1D_ARRAY,
  TV2D_ARRAY,
};

enum class GFXFilter : uint8_t {
  NONE,
  POINT,
  LINEAR,
  ANISOTROPIC,
};

enum class GFXAddress : uint8_t {
  WRAP,
  MIRROR,
  CLAMP,
  BORDER,
};

enum class GFXComparisonFunc : uint8_t {
  NEVER,
  LESS,
  EQUAL,
  LESS_EQUAL,
  GREATER,
  NOT_EQUAL,
  GREATER_EQUAL,
  ALWAYS,
};

enum class GFXStencilOp : uint8_t {
  ZERO,
  KEEP,
  REPLACE,
  INCR,
  DECR,
  INVERT,
  INCR_WRAP,
  DECR_WRAP,
};

enum class GFXBlendFactor : uint8_t {
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

enum class GFXBlendOp : uint8_t {
  ADD,
  SUB,
  REV_SUB,
  MIN,
  MAX,
};

enum class GFXColorMask : uint8_t {
  NONE = 0x0,
  R = 0x1,
  G = 0x2,
  B = 0x4,
  A = 0x8,
  ALL = R | G | B | A,
};
CC_ENUM_OPERATORS(GFXColorMask);

enum class GFXShaderType : uint8_t {
  VERTEX,
  CONTROL,
  EVALUATION,
  GEOMETRY,
  FRAGMENT,
  COMPUTE,
  COUNT,
};

enum class GFXLoadOp : uint8_t {
  LOAD,    // Load the contents from the fbo from previous
  CLEAR,    // Clear the fbo
  DISCARD,  // Ignore writing to the fbo and keep old data
};

enum class GFXStoreOp : uint8_t {
  STORE,    // Write the source to the destination
  DISCARD,  // Don't write the source to the destination
};

enum class GFXTextureLayout : uint8_t {
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

enum class GFXPipelineBindPoint : uint8_t {
  GRAPHICS,
  COMPUTE,
  RAY_TRACING,
};

enum class GFXPrimitiveMode : uint8_t {
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

enum class GFXPolygonMode : uint8_t {
  FILL,
  POINT,
  LINE,
};

enum class GFXShadeModel : uint8_t {
  GOURAND,
  FLAT,
};

enum class GFXCullMode : uint8_t {
  NONE,
  FRONT,
  BACK,
};

enum class GFXDynamicState : uint8_t {
  VIEWPORT,
  SCISSOR,
  LINE_WIDTH,
  DEPTH_BIAS,
  BLEND_CONSTANTS,
  DEPTH_BOUNDS,
  STENCIL_WRITE_MASK,
  STENCIL_COMPARE_MASK,
};

typedef vector<GFXDynamicState>::type GFXDynamicStateList;

enum class GFXStencilFace : uint8_t {
  FRONT,
  BACK,
  ALL,
};

enum class GFXBindingType : uint8_t {
  UNKNOWN,
  UNIFORM_BUFFER,
  SAMPLER,
  STORAGE_BUFFER,
};

enum class GFXQueueType : uint8_t {
  GRAPHICS,
  COMPUTE,
  TRANSFER,
};

enum class GFXCommandBufferType : uint8_t {
  PRIMARY,
  SECONDARY,
};

enum class GFXClearFlagBit : uint8_t {
  NONE = 0,
  COLOR = 0x1,
  DEPTH = 0x2,
  STENCIL = 0x4,
  DEPTH_STENCIL = DEPTH | STENCIL,
  ALL = COLOR | DEPTH | STENCIL,
};
typedef GFXClearFlagBit GFXClearFlags;
CC_ENUM_OPERATORS(GFXClearFlags);

enum class GFXVsyncMode : uint8_t {
  // The application does not synchronizes with the vertical sync. If application renders faster than the display refreshes, frames are wasted and tearing may be observed. FPS is uncapped. Maximum power consumption. If unsupported, "ON" value will be used instead. Minimum latency.
  OFF,
  // The application is always synchronized with the vertical sync. Tearing does not happen. FPS is capped to the display's refresh rate. For fast applications, battery life is improved. Always supported.
  ON,
  // The application synchronizes with the vertical sync, but only if the application rendering speed is greater than refresh rate. Compared to OFF, there is no tearing. Compared to ON, the FPS will be improved for "slower" applications. If unsupported, "ON" value will be used instead. Recommended for most applications. Default if supported.
  RELAXED,
  // The presentation engine will always use the latest fully rendered image. Compared to OFF, no tearing will be observed. Compared to ON, battery power will be worse, especially for faster applications. If unsupported,  "OFF" will be attempted next.
  MAILBOX,
  // The application is capped to using half the vertical sync time. FPS artificially capped to Half the display speed (usually 30fps) to maintain battery. Best possible battery savings. Worst possibly performance. Recommended for specific applications where battery saving is critical.
  HALF,
};

struct GFXOffset {
  int x;
  int y;
  int z;
};

struct GFXRect {
  int x;
  int y;
  uint width;
  uint height;
    
    bool operator ==(const GFXRect& rs)
    {
        if (x == rs.x &&
            y == rs.y &&
            width == rs.width &&
            height == rs.height)
        {
            return true;
        }
        else
            return false;
    }
    
    bool operator !=(const GFXRect& rs)
    {
        return !(*this == rs);
    }
};

struct GFXExtent {
  uint width;
  uint height;
  uint depth;
};

struct GFXTextureSubres {
  uint base_mip_level = 0;
  uint level_count = 1;
  uint base_array_layer = 0;
  uint layer_count = 1;
};

struct GFXTextureCopy {
  GFXTextureSubres src_subres;
  GFXOffset src_offset = { 0, 0, 0 };
  GFXTextureSubres dst_subres;
  GFXOffset dst_offset = { 0, 0, 0 };
  GFXExtent extent = { 0, 0, 0 };
};

struct GFXBufferTextureCopy {
  uint buff_offset = 0;
  uint buff_stride = 0;
  uint buff_tex_height = 0;
  GFXOffset tex_offset = { 0, 0, 0 };
  GFXExtent tex_extent = { 0, 0, 0 };
  GFXTextureSubres tex_subres;
};
typedef vector<GFXBufferTextureCopy>::type GFXBufferTextureCopyList;

struct GFXViewport {
  int left = 0;
  int top = 0;
  uint width = 0;
  uint height = 0;
  float minDepth = 0.0f;
  float maxDepth = 0.0f;
    
    bool operator ==(const GFXViewport& rs)
    {
        if (left == rs.left &&
            top == rs.top &&
            width == rs.width &&
            height == rs.height &&
            math::IsEqualF(minDepth, rs.minDepth) &&
            math::IsEqualF(maxDepth, maxDepth))
        {
            return true;
        }
        else
            return false;
    }
    
    bool operator !=(const GFXViewport& rs)
    {
        return !(*this == rs);
    }
};

#pragma pack(push, 1)
struct GFXColor {
  float r = 0.0f;
  float g = 0.0f;
  float b = 0.0f;
  float a = 0.0f;
};
#pragma pack(pop)

struct GFXDeviceInfo {
  intptr_t window_handle = 0;
  uint width = 0;
  uint height = 0;
  uint native_width = 0;
  uint native_height = 0;
  GFXContext* shared_ctx = nullptr;
};

struct GFXWindowInfo {
  String title;
  int left = 0;
  int top = 0;
  uint width = 800;
  uint height = 600;
  GFXFormat color_fmt = GFXFormat::UNKNOWN;
  GFXFormat depth_stencil_fmt = GFXFormat::UNKNOWN;
  bool is_offscreen = false;
  bool is_fullscreen = false;
  GFXVsyncMode vsync_mode = GFXVsyncMode::OFF;
  intptr_t window_handle = 0;
};

struct GFXContextInfo {
  intptr_t window_handle = 0;
  GFXContext* shared_ctx = nullptr;
  GFXVsyncMode vsync_mode = GFXVsyncMode::OFF;
};

struct GFXBufferInfo {
  GFXBufferUsage usage = GFXBufferUsage::NONE;
  GFXMemoryUsage mem_usage = GFXMemoryUsage::NONE;
  uint stride = 1;
  uint size = 0;
  GFXBufferFlags flags = GFXBufferFlagBit::NONE;
};

#pragma pack(push, 1)
struct GFXDrawInfo {
  uint vertex_count = 0;
  uint first_vertex = 0;
  uint index_count = 0;
  uint first_index = 0;
  uint vertex_offset = 0;
  uint instance_count = 0;
  uint first_instance = 0;
};
#pragma pack(pop)

typedef vector<GFXDrawInfo>::type GFXDrawInfoList;

struct GFXIndirectBuffer {
  GFXDrawInfoList draws;
};

struct GFXTextureInfo {
  GFXTextureType type = GFXTextureType::TEX2D;
  GFXTextureUsage usage = GFXTextureUsageBit::NONE;
  GFXFormat format = GFXFormat::UNKNOWN;
  uint width = 0;
  uint height = 0;
  uint depth = 1;
  uint array_layer = 1;
  uint mip_level = 1;
  GFXSampleCount samples = GFXSampleCount::X1;
  GFXTextureFlags flags = GFXTextureFlagBit::NONE;
};

struct GFXTextureViewInfo {
  GFXTexture* texture = nullptr;
  GFXTextureViewType type = GFXTextureViewType::TV2D;
  GFXFormat format = GFXFormat::UNKNOWN;
  uint base_level = 0;
  uint level_count = 1;
  uint base_layer = 0;
  uint layer_count = 1;
};

struct GFXSamplerInfo {
  String name;
  GFXFilter min_filter = GFXFilter::LINEAR;
  GFXFilter mag_filter = GFXFilter::LINEAR;
  GFXFilter mip_filter = GFXFilter::NONE;
  GFXAddress address_u = GFXAddress::WRAP;
  GFXAddress address_v = GFXAddress::WRAP;
  GFXAddress address_w = GFXAddress::WRAP;
  uint max_anisotropy = 16;
  GFXComparisonFunc cmp_func = GFXComparisonFunc::NEVER;
  GFXColor border_color;
  uint min_lod = 0;
  uint max_lod = 1000;
  float mip_lod_bias = 0.0f;
};

struct GFXShaderMacro {
  String macro;
  String value;
};

typedef vector<GFXShaderMacro>::type GFXShaderMacroList;

struct GFXUniform {
  String name;
  GFXType type;
  uint count;
};

typedef vector<GFXUniform>::type GFXUniformList;

struct GFXUniformBlock {
  uint binding;
  String name;
  GFXUniformList uniforms;
};

typedef vector<GFXUniformBlock>::type GFXUniformBlockList;

struct GFXUniformSampler {
  uint binding;
  String name;
  GFXType type;
  uint count;
};

typedef vector<GFXUniformSampler>::type GFXUniformSamplerList;

struct GFXShaderStage {
  GFXShaderType type;
  String source;
  GFXShaderMacroList macros;
};

typedef vector<GFXShaderStage>::type GFXShaderStageList;

struct GFXShaderInfo {
  String name;
  GFXShaderStageList stages;
  GFXUniformBlockList blocks;
  GFXUniformSamplerList samplers;
};

struct GFXAttribute {
  String name;
  GFXFormat format = GFXFormat::UNKNOWN;
  bool is_normalized = false;
  uint stream = 0;
  bool is_instanced = false;
};

typedef vector<GFXAttribute>::type GFXAttributeList;
typedef vector<GFXBuffer*>::type GFXBufferList;

struct GFXInputAssemblerInfo {
  GFXAttributeList attributes;
  GFXBufferList vertex_buffers;
  GFXBuffer* index_buffer = nullptr;
  GFXBuffer* indirect_buffer = nullptr;
};

struct GFXColorAttachment {
  GFXFormat format = GFXFormat::UNKNOWN;
  GFXLoadOp load_op = GFXLoadOp::CLEAR;
  GFXStoreOp store_op = GFXStoreOp::STORE;
  uint sample_count = 1;
  GFXTextureLayout begin_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
  GFXTextureLayout end_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
};

typedef vector<GFXColorAttachment>::type GFXColorAttachmentList;

struct GFXDepthStencilAttachment {
  GFXFormat format = GFXFormat::UNKNOWN;
  GFXLoadOp depth_load_op = GFXLoadOp::CLEAR;
  GFXStoreOp depth_store_op = GFXStoreOp::STORE;
  GFXLoadOp stencil_load_op = GFXLoadOp::CLEAR;
  GFXStoreOp stencil_store_op = GFXStoreOp::STORE;
  uint sample_count = 1;
  GFXTextureLayout begin_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
  GFXTextureLayout end_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
};

struct GFXSubPass {
  GFXPipelineBindPoint bind_point;
  uint8_t inputs[GFX_MAX_ATTACHMENTS];
  uint8_t colors[GFX_MAX_ATTACHMENTS];
  uint8_t resolves[GFX_MAX_ATTACHMENTS];
  uint8_t depth_stencil;
  uint8_t preserves[GFX_MAX_ATTACHMENTS];
  
  GFXSubPass()
    : bind_point(GFXPipelineBindPoint::GRAPHICS),
      depth_stencil(GFX_INVALID_BINDING) {
    memset(inputs, -1, sizeof(inputs));
    memset(colors, -1, sizeof(colors));
    memset(resolves, -1, sizeof(resolves));
    memset(preserves, -1, sizeof(preserves));
  }
};

typedef vector<GFXSubPass>::type GFXSubPassList;

struct GFXRenderPassInfo {
  GFXColorAttachmentList color_attachments;
  GFXDepthStencilAttachment depth_stencil_attachment;
  GFXSubPassList sub_passes;
};

typedef vector<GFXTextureView*>::type GFXTextureViewList;

struct GFXFramebufferInfo {
  GFXRenderPass* render_pass = nullptr;
  GFXTextureViewList color_views;
  GFXTextureView* depth_stencil_view = nullptr;
  bool is_offscreen = true;
};

struct GFXBinding {
  uint binding;
  GFXBindingType type;
  String name;
};

typedef vector<GFXBinding>::type GFXBindingList;

struct GFXBindingLayoutInfo {
  GFXBindingList bindings;
};

struct GFXBindingUnit {
  uint binding;
  GFXBindingType type;
  String name;
  GFXBuffer* buffer;
  GFXTextureView* tex_view;
  GFXSampler* sampler;
};

typedef vector<GFXBindingUnit>::type GFXBindingUnitList;

struct GFXPushConstantRange {
  GFXShaderType shader_type;
  uint offset;
  uint count;
};

typedef vector<GFXPushConstantRange>::type GFXPushConstantRangeList;
typedef vector<GFXBindingLayout*>::type GFXBindingLayoutList;

struct GFXPipelineLayoutInfo {
  GFXPushConstantRangeList push_constant_ranges;
  GFXBindingLayoutList layouts;
};

struct GFXInputState {
  GFXAttributeList attributes;
};

struct GFXRasterizerState {
  bool is_discard = false;
  GFXPolygonMode polygon_mode = GFXPolygonMode::FILL;
  GFXShadeModel shade_model = GFXShadeModel::GOURAND;
  GFXCullMode cull_mode = GFXCullMode::BACK;
  bool is_front_face_ccw = true;
  float depth_bias = 0.0f;
  float depth_bias_clamp = 0.0f;
  float depth_bias_slope = 0.0f;
  bool is_depth_clip = true;
  bool is_multisample = false;
  float line_width = 1.0f;
};

struct GFXDepthStencilState {
  bool depth_test = true;
  bool depth_write = true;
  GFXComparisonFunc depth_func = GFXComparisonFunc::LESS;
  bool stencil_test_front = false;
  GFXComparisonFunc stencil_func_front = GFXComparisonFunc::ALWAYS;
  uint stencil_read_mask_front = 0xffffffff;
  uint stencil_write_mask_front = 0xffffffff;
  GFXStencilOp stencil_fail_op_front = GFXStencilOp::KEEP;
  GFXStencilOp stencil_z_fail_op_front = GFXStencilOp::KEEP;
  GFXStencilOp stencil_pass_op_front = GFXStencilOp::KEEP;
  uint stencil_ref_front = 1;
  bool stencil_test_back = false;
  GFXComparisonFunc stencil_func_back = GFXComparisonFunc::ALWAYS;
  uint stencil_read_mask_back = 0xffffffff;
  uint stencil_write_mask_back = 0xffffffff;
  GFXStencilOp stencil_fail_op_back = GFXStencilOp::KEEP;
  GFXStencilOp stencil_z_fail_op_back = GFXStencilOp::KEEP;
  GFXStencilOp stencil_pass_op_back = GFXStencilOp::KEEP;
  uint stencil_ref_back = 1;
};

struct GFXBlendTarget {
  bool is_blend = false;
  GFXBlendFactor blend_src = GFXBlendFactor::ONE;
  GFXBlendFactor blend_dst = GFXBlendFactor::ZERO;
  GFXBlendOp blend_eq = GFXBlendOp::ADD;
  GFXBlendFactor blend_src_alpha = GFXBlendFactor::ONE;
  GFXBlendFactor blend_dst_alpha = GFXBlendFactor::ZERO;
  GFXBlendOp blend_alpha_eq = GFXBlendOp::ADD;
  GFXColorMask blend_color_mask = GFXColorMask::ALL;
};

typedef vector<GFXBlendTarget>::type GFXBlendTargetList;

struct GFXBlendState {
  bool is_a2c = false;
  bool is_independ = false;
  GFXColor blend_color;
  GFXBlendTargetList targets;
  
  GFXBlendState() {
    targets.emplace_back(GFXBlendTarget());
  }
};

struct GFXPipelineStateInfo {
  GFXPrimitiveMode primitive;
  GFXShader* shader = nullptr;
  GFXInputState is;
  GFXRasterizerState rs;
  GFXDepthStencilState dss;
  GFXBlendState bs;
  GFXDynamicStateList dynamic_states;
  GFXPipelineLayout* layout = nullptr;
  GFXRenderPass* render_pass = nullptr;
};

struct GFXCommandAllocatorInfo {
};

struct GFXCommandBufferInfo {
  GFXCommandAllocator* allocator = nullptr;
  GFXCommandBufferType type;
};

struct GFXQueueInfo {
  GFXQueueType type;
};

struct GFXFormatInfo {
  String name;
  uint size;
  uint count;
  GFXFormatType type;
  bool has_alpha;
  bool has_depth;
  bool has_stencil;
  bool is_compressed;
};

extern CC_CORE_API const GFXFormatInfo GFX_FORMAT_INFOS[];
extern CC_CORE_API const uint GFX_TYPE_SIZES[];

struct GFXMemoryStatus {
  uint buffer_size = 0;
  uint texture_size = 0;
};

extern CC_CORE_API uint GFXFormatSize(GFXFormat format, uint width, uint height, uint depth);

extern CC_CORE_API uint GFXFormatSurfaceSize(GFXFormat format, uint width, uint height, uint depth, uint mips);

NS_CC_END

#endif // CC_CORE_GFX_DEF_H_
