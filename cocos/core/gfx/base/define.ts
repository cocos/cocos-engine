/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

/**
 * @packageDocumentation
 * @module gfx
 */

import { Buffer } from './buffer';
import { DescriptorSetLayout } from './descriptor-set-layout';
import { Queue } from './queue';
import { RenderPass } from './render-pass';
import { Sampler } from './states/sampler';
import { Swapchain } from './swapchain';
import { Texture } from './texture';

interface ICopyable { copy(info: ICopyable): ICopyable; }

const deepCopy = <T extends ICopyable>(target: T[], source: T[], Ctor: Constructor<T>) => {
    for (let i = 0; i < source.length; ++i) {
        if (target.length <= i) target.push(new Ctor());
        target[i].copy(source[i]);
    }
    target.length = source.length;
};

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated from engine-native/cocos/renderer/core/gfx/GFXDef-common.h
 * by the script engine-native/tools/gfx-define-generator/generate.js.
 * Changes to these public interfaces should be made there first and synced back.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */

export enum ObjectType {
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
}

export enum Status {
    UNREADY,
    FAILED,
    SUCCESS,
}

export enum API {
    UNKNOWN,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    NVN,
    WEBGL,
    WEBGL2,
    WEBGPU,
}

export enum SurfaceTransform {
    IDENTITY,
    ROTATE_90,
    ROTATE_180,
    ROTATE_270,
}

export enum Feature {
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
}

export enum Format {

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
}

export enum FormatType {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
}

export enum Type {
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
}

export enum BufferUsageBit {
    NONE         = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX        = 0x4,
    VERTEX       = 0x8,
    UNIFORM      = 0x10,
    STORAGE      = 0x20,
    INDIRECT     = 0x40,
}

export enum BufferFlagBit {
    NONE = 0,
}

export enum MemoryAccessBit {
    NONE       = 0,
    READ_ONLY  = 0x1,
    WRITE_ONLY = 0x2,
    READ_WRITE = READ_ONLY | WRITE_ONLY,
}

export enum MemoryUsageBit {
    NONE   = 0,
    DEVICE = 0x1, // for rarely-updated resources, use MemoryUsageBit::DEVICE
    HOST   = 0x2, // for frequently-updated resources, use MemoryUsageBit::DEVICE | MemoryUsageBit::HOST
}

export enum TextureType {
    TEX1D,
    TEX2D,
    TEX3D,
    CUBE,
    TEX1D_ARRAY,
    TEX2D_ARRAY,
}

export enum TextureUsageBit {
    NONE                     = 0,
    TRANSFER_SRC             = 0x1,
    TRANSFER_DST             = 0x2,
    SAMPLED                  = 0x4,
    STORAGE                  = 0x8,
    COLOR_ATTACHMENT         = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    INPUT_ATTACHMENT         = 0x40,
}

export enum TextureFlagBit {
    NONE           = 0,
    GEN_MIPMAP     = 0x1, // Generate mipmaps using bilinear filter
    GENERAL_LAYOUT = 0x2, // For inout framebuffer attachments
}

export enum FormatFeatureBit {
    NONE             = 0,
    RENDER_TARGET    = 0x1,  // Texture or renderBuffer
    SAMPLED_TEXTURE  = 0x2,  // allow shaders to read a texture through a sampler
    LINEAR_FILTER    = 0x4,  // allow using linear filter and copy from texture to texture linearly
    STORAGE_TEXTURE  = 0x8,  // allow performing texture reads without sampling and store to arbitrary positions in shaders
    VERTEX_ATTRIBUTE = 0x10, // use this format as vertex inputs
}

export enum SampleCount {
    ONE,                  // Single sample
    MULTIPLE_PERFORMANCE, // Multiple samples prioritizing performance over quality
    MULTIPLE_BALANCE,     // Multiple samples leveraging both quality and performance
    MULTIPLE_QUALITY,     // Multiple samples prioritizing quality over performance
}

export enum VsyncMode {
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
}

export enum Filter {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
}

export enum Address {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
}

export enum ComparisonFunc {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
}

export enum StencilOp {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
}

export enum BlendFactor {
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
}

export enum BlendOp {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
}

export enum ColorMask {
    NONE = 0x0,
    R    = 0x1,
    G    = 0x2,
    B    = 0x4,
    A    = 0x8,
    ALL  = R | G | B | A,
}

export enum ShaderStageFlagBit {
    NONE       = 0x0,
    VERTEX     = 0x1,
    CONTROL    = 0x2,
    EVALUATION = 0x4,
    GEOMETRY   = 0x8,
    FRAGMENT   = 0x10,
    COMPUTE    = 0x20,
    ALL        = 0x3f,
}

export enum LoadOp {
    LOAD,    // Load the contents from the fbo from previous
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore writing to the fbo and keep old data
}

export enum StoreOp {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
}

export enum AccessType {
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
}

export enum ResolveMode {
    NONE,
    SAMPLE_ZERO,
    AVERAGE,
    MIN,
    MAX,
}

export enum PipelineBindPoint {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
}

export enum PrimitiveMode {
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
}

export enum PolygonMode {
    FILL,
    POINT,
    LINE,
}

export enum ShadeModel {
    GOURAND,
    FLAT,
}

export enum CullMode {
    NONE,
    FRONT,
    BACK,
}

export enum DynamicStateFlagBit {
    NONE                 = 0x0,
    LINE_WIDTH           = 0x1,
    DEPTH_BIAS           = 0x2,
    BLEND_CONSTANTS      = 0x4,
    DEPTH_BOUNDS         = 0x8,
    STENCIL_WRITE_MASK   = 0x10,
    STENCIL_COMPARE_MASK = 0x20,
}

export enum StencilFace {
    FRONT = 0x1,
    BACK  = 0x2,
    ALL   = 0x3,
}

export enum DescriptorType {
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
}

export enum QueueType {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
}

export enum QueryType {
    OCCLUSION,
    PIPELINE_STATISTICS,
    TIMESTAMP,
}

export enum CommandBufferType {
    PRIMARY,
    SECONDARY,
}

export enum ClearFlagBit {
    NONE          = 0,
    COLOR         = 0x1,
    DEPTH         = 0x2,
    STENCIL       = 0x4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL           = COLOR | DEPTH | STENCIL,
}

export type BufferUsage = BufferUsageBit;
export type BufferFlags = BufferFlagBit;
export type MemoryAccess = MemoryAccessBit;
export type MemoryUsage = MemoryUsageBit;
export type TextureUsage = TextureUsageBit;
export type TextureFlags = TextureFlagBit;
export type FormatFeature = FormatFeatureBit;
export type ShaderStageFlags = ShaderStageFlagBit;
export type DynamicStateFlags = DynamicStateFlagBit;
export type ClearFlags = ClearFlagBit;

export class Size {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}

    public copy (info: Readonly<Size>) {
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        return this;
    }
}

export class DeviceCaps {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public maxVertexAttributes: number = 0,
        public maxVertexUniformVectors: number = 0,
        public maxFragmentUniformVectors: number = 0,
        public maxTextureUnits: number = 0,
        public maxImageUnits: number = 0,
        public maxVertexTextureUnits: number = 0,
        public maxColorRenderTargets: number = 0,
        public maxShaderStorageBufferBindings: number = 0,
        public maxShaderStorageBlockSize: number = 0,
        public maxUniformBufferBindings: number = 0,
        public maxUniformBlockSize: number = 0,
        public maxTextureSize: number = 0,
        public maxCubeMapTextureSize: number = 0,
        public uboOffsetAlignment: number = 1,
        public maxComputeSharedMemorySize: number = 0,
        public maxComputeWorkGroupInvocations: number = 0,
        public maxComputeWorkGroupSize: Size = new Size(),
        public maxComputeWorkGroupCount: Size = new Size(),
        public supportQuery: boolean = false,
        public clipSpaceMinZ: number = -1,
        public screenSpaceSignY: number = 1,
        public clipSpaceSignY: number = 1,
    ) {}

    public copy (info: Readonly<DeviceCaps>) {
        this.maxVertexAttributes = info.maxVertexAttributes;
        this.maxVertexUniformVectors = info.maxVertexUniformVectors;
        this.maxFragmentUniformVectors = info.maxFragmentUniformVectors;
        this.maxTextureUnits = info.maxTextureUnits;
        this.maxImageUnits = info.maxImageUnits;
        this.maxVertexTextureUnits = info.maxVertexTextureUnits;
        this.maxColorRenderTargets = info.maxColorRenderTargets;
        this.maxShaderStorageBufferBindings = info.maxShaderStorageBufferBindings;
        this.maxShaderStorageBlockSize = info.maxShaderStorageBlockSize;
        this.maxUniformBufferBindings = info.maxUniformBufferBindings;
        this.maxUniformBlockSize = info.maxUniformBlockSize;
        this.maxTextureSize = info.maxTextureSize;
        this.maxCubeMapTextureSize = info.maxCubeMapTextureSize;
        this.uboOffsetAlignment = info.uboOffsetAlignment;
        this.maxComputeSharedMemorySize = info.maxComputeSharedMemorySize;
        this.maxComputeWorkGroupInvocations = info.maxComputeWorkGroupInvocations;
        this.maxComputeWorkGroupSize.copy(info.maxComputeWorkGroupSize);
        this.maxComputeWorkGroupCount.copy(info.maxComputeWorkGroupCount);
        this.supportQuery = info.supportQuery;
        this.clipSpaceMinZ = info.clipSpaceMinZ;
        this.screenSpaceSignY = info.screenSpaceSignY;
        this.clipSpaceSignY = info.clipSpaceSignY;
        return this;
    }
}

export class Offset {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}

    public copy (info: Readonly<Offset>) {
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        return this;
    }
}

export class Rect {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public width: number = 0,
        public height: number = 0,
    ) {}

    public copy (info: Readonly<Rect>) {
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        return this;
    }
}

export class Extent {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public width: number = 0,
        public height: number = 0,
        public depth: number = 1,
    ) {}

    public copy (info: Readonly<Extent>) {
        this.width = info.width;
        this.height = info.height;
        this.depth = info.depth;
        return this;
    }
}

export class TextureSubresLayers {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public mipLevel: number = 0,
        public baseArrayLayer: number = 0,
        public layerCount: number = 1,
    ) {}

    public copy (info: Readonly<TextureSubresLayers>) {
        this.mipLevel = info.mipLevel;
        this.baseArrayLayer = info.baseArrayLayer;
        this.layerCount = info.layerCount;
        return this;
    }
}

export class TextureSubresRange {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public baseMipLevel: number = 0,
        public levelCount: number = 1,
        public baseArrayLayer: number = 0,
        public layerCount: number = 1,
    ) {}

    public copy (info: Readonly<TextureSubresRange>) {
        this.baseMipLevel = info.baseMipLevel;
        this.levelCount = info.levelCount;
        this.baseArrayLayer = info.baseArrayLayer;
        this.layerCount = info.layerCount;
        return this;
    }
}

export class TextureCopy {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubres: TextureSubresLayers = new TextureSubresLayers(),
        public srcOffset: Offset = new Offset(),
        public dstSubres: TextureSubresLayers = new TextureSubresLayers(),
        public dstOffset: Offset = new Offset(),
        public extent: Extent = new Extent(),
    ) {}

    public copy (info: Readonly<TextureCopy>) {
        this.srcSubres.copy(info.srcSubres);
        this.srcOffset.copy(info.srcOffset);
        this.dstSubres.copy(info.dstSubres);
        this.dstOffset.copy(info.dstOffset);
        this.extent.copy(info.extent);
        return this;
    }
}

export class TextureBlit {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubres: TextureSubresLayers = new TextureSubresLayers(),
        public srcOffset: Offset = new Offset(),
        public srcExtent: Extent = new Extent(),
        public dstSubres: TextureSubresLayers = new TextureSubresLayers(),
        public dstOffset: Offset = new Offset(),
        public dstExtent: Extent = new Extent(),
    ) {}

    public copy (info: Readonly<TextureBlit>) {
        this.srcSubres.copy(info.srcSubres);
        this.srcOffset.copy(info.srcOffset);
        this.srcExtent.copy(info.srcExtent);
        this.dstSubres.copy(info.dstSubres);
        this.dstOffset.copy(info.dstOffset);
        this.dstExtent.copy(info.dstExtent);
        return this;
    }
}

export class BufferTextureCopy {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffStride: number = 0,
        public buffTexHeight: number = 0,
        public texOffset: Offset = new Offset(),
        public texExtent: Extent = new Extent(),
        public texSubres: TextureSubresLayers = new TextureSubresLayers(),
    ) {}

    public copy (info: Readonly<BufferTextureCopy>) {
        this.buffStride = info.buffStride;
        this.buffTexHeight = info.buffTexHeight;
        this.texOffset.copy(info.texOffset);
        this.texExtent.copy(info.texExtent);
        this.texSubres.copy(info.texSubres);
        return this;
    }
}

export class Viewport {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public left: number = 0,
        public top: number = 0,
        public width: number = 0,
        public height: number = 0,
        public minDepth: number = 0,
        public maxDepth: number = 1,
    ) {}

    public copy (info: Readonly<Viewport>) {
        this.left = info.left;
        this.top = info.top;
        this.width = info.width;
        this.height = info.height;
        this.minDepth = info.minDepth;
        this.maxDepth = info.maxDepth;
        return this;
    }
}

export class Color {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0,
    ) {}

    public copy (info: Readonly<Color>) {
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        this.w = info.w;
        return this;
    }
}

export class BindingMappingInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bufferOffsets: number[] = [],
        public samplerOffsets: number[] = [],
        public flexibleSet: number = 0,
    ) {}

    public copy (info: Readonly<BindingMappingInfo>) {
        this.bufferOffsets = info.bufferOffsets.slice();
        this.samplerOffsets = info.samplerOffsets.slice();
        this.flexibleSet = info.flexibleSet;
        return this;
    }
}

export class SwapchainInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public windowHandle: HTMLCanvasElement = null!,
        public vsyncMode: VsyncMode = VsyncMode.ON,
        public width: number = 0,
        public height: number = 0,
    ) {}

    public copy (info: Readonly<SwapchainInfo>) {
        this.windowHandle = info.windowHandle;
        this.vsyncMode = info.vsyncMode;
        this.width = info.width;
        this.height = info.height;
        return this;
    }
}

export class DeviceInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bindingMappingInfo: BindingMappingInfo = new BindingMappingInfo(),
    ) {}

    public copy (info: Readonly<DeviceInfo>) {
        this.bindingMappingInfo.copy(info.bindingMappingInfo);
        return this;
    }
}

export class BufferInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public usage: BufferUsage = BufferUsageBit.NONE,
        public memUsage: MemoryUsage = MemoryUsageBit.NONE,
        public size: number = 0,
        public stride: number = 1,
        public flags: BufferFlags = BufferFlagBit.NONE,
    ) {}

    public copy (info: Readonly<BufferInfo>) {
        this.usage = info.usage;
        this.memUsage = info.memUsage;
        this.size = info.size;
        this.stride = info.stride;
        this.flags = info.flags;
        return this;
    }
}

export class BufferViewInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffer: Buffer = null!,
        public offset: number = 0,
        public range: number = 0,
    ) {}

    public copy (info: Readonly<BufferViewInfo>) {
        this.buffer = info.buffer;
        this.offset = info.offset;
        this.range = info.range;
        return this;
    }
}

export class DrawInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public vertexCount: number = 0,
        public firstVertex: number = 0,
        public indexCount: number = 0,
        public firstIndex: number = 0,
        public vertexOffset: number = 0,
        public instanceCount: number = 0,
        public firstInstance: number = 0,
    ) {}

    public copy (info: Readonly<DrawInfo>) {
        this.vertexCount = info.vertexCount;
        this.firstVertex = info.firstVertex;
        this.indexCount = info.indexCount;
        this.firstIndex = info.firstIndex;
        this.vertexOffset = info.vertexOffset;
        this.instanceCount = info.instanceCount;
        this.firstInstance = info.firstInstance;
        return this;
    }
}

export class DispatchInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public groupCountX: number = 0,
        public groupCountY: number = 0,
        public groupCountZ: number = 0,
        public indirectBuffer: Buffer | null = null,
        public indirectOffset: number = 0,
    ) {}

    public copy (info: Readonly<DispatchInfo>) {
        this.groupCountX = info.groupCountX;
        this.groupCountY = info.groupCountY;
        this.groupCountZ = info.groupCountZ;
        this.indirectBuffer = info.indirectBuffer;
        this.indirectOffset = info.indirectOffset;
        return this;
    }
}

export class IndirectBuffer {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public drawInfos: DrawInfo[] = [],
    ) {}

    public copy (info: Readonly<IndirectBuffer>) {
        deepCopy(this.drawInfos, info.drawInfos, DrawInfo);
        return this;
    }
}

export class TextureInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public type: TextureType = TextureType.TEX2D,
        public usage: TextureUsage = TextureUsageBit.NONE,
        public format: Format = Format.UNKNOWN,
        public width: number = 0,
        public height: number = 0,
        public flags: TextureFlags = TextureFlagBit.NONE,
        public layerCount: number = 1,
        public levelCount: number = 1,
        public samples: SampleCount = SampleCount.ONE,
        public depth: number = 1,
        public externalRes: number = 0,
    ) {}

    public copy (info: Readonly<TextureInfo>) {
        this.type = info.type;
        this.usage = info.usage;
        this.format = info.format;
        this.width = info.width;
        this.height = info.height;
        this.flags = info.flags;
        this.layerCount = info.layerCount;
        this.levelCount = info.levelCount;
        this.samples = info.samples;
        this.depth = info.depth;
        this.externalRes = info.externalRes;
        return this;
    }
}

export class TextureViewInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public texture: Texture = null!,
        public type: TextureType = TextureType.TEX2D,
        public format: Format = Format.UNKNOWN,
        public baseLevel: number = 0,
        public levelCount: number = 1,
        public baseLayer: number = 0,
        public layerCount: number = 1,
    ) {}

    public copy (info: Readonly<TextureViewInfo>) {
        this.texture = info.texture;
        this.type = info.type;
        this.format = info.format;
        this.baseLevel = info.baseLevel;
        this.levelCount = info.levelCount;
        this.baseLayer = info.baseLayer;
        this.layerCount = info.layerCount;
        return this;
    }
}

export class SamplerInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public minFilter: Filter = Filter.LINEAR,
        public magFilter: Filter = Filter.LINEAR,
        public mipFilter: Filter = Filter.NONE,
        public addressU: Address = Address.WRAP,
        public addressV: Address = Address.WRAP,
        public addressW: Address = Address.WRAP,
        public maxAnisotropy: number = 0,
        public cmpFunc: ComparisonFunc = ComparisonFunc.ALWAYS,
    ) {}

    public copy (info: Readonly<SamplerInfo>) {
        this.minFilter = info.minFilter;
        this.magFilter = info.magFilter;
        this.mipFilter = info.mipFilter;
        this.addressU = info.addressU;
        this.addressV = info.addressV;
        this.addressW = info.addressW;
        this.maxAnisotropy = info.maxAnisotropy;
        this.cmpFunc = info.cmpFunc;
        return this;
    }
}

export class Uniform {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 0,
    ) {}

    public copy (info: Readonly<Uniform>) {
        this.name = info.name;
        this.type = info.type;
        this.count = info.count;
        return this;
    }
}

export class UniformBlock {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public members: Uniform[] = [],
        public count: number = 0,
    ) {}

    public copy (info: Readonly<UniformBlock>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        deepCopy(this.members, info.members, Uniform);
        this.count = info.count;
        return this;
    }
}

export class UniformSamplerTexture {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 0,
    ) {}

    public copy (info: Readonly<UniformSamplerTexture>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.type = info.type;
        this.count = info.count;
        return this;
    }
}

export class UniformSampler {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public count: number = 0,
    ) {}

    public copy (info: Readonly<UniformSampler>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.count = info.count;
        return this;
    }
}

export class UniformTexture {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 0,
    ) {}

    public copy (info: Readonly<UniformTexture>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.type = info.type;
        this.count = info.count;
        return this;
    }
}

export class UniformStorageImage {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 0,
        public memoryAccess: MemoryAccess = MemoryAccessBit.READ_WRITE,
    ) {}

    public copy (info: Readonly<UniformStorageImage>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.type = info.type;
        this.count = info.count;
        this.memoryAccess = info.memoryAccess;
        return this;
    }
}

export class UniformStorageBuffer {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public count: number = 0,
        public memoryAccess: MemoryAccess = MemoryAccessBit.READ_WRITE,
    ) {}

    public copy (info: Readonly<UniformStorageBuffer>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.count = info.count;
        this.memoryAccess = info.memoryAccess;
        return this;
    }
}

export class UniformInputAttachment {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = 0,
        public binding: number = 0,
        public name: string = '',
        public count: number = 0,
    ) {}

    public copy (info: Readonly<UniformInputAttachment>) {
        this.set = info.set;
        this.binding = info.binding;
        this.name = info.name;
        this.count = info.count;
        return this;
    }
}

export class ShaderStage {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public stage: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
        public source: string = '',
    ) {}

    public copy (info: Readonly<ShaderStage>) {
        this.stage = info.stage;
        this.source = info.source;
        return this;
    }
}

export class Attribute {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public format: Format = Format.UNKNOWN,
        public isNormalized: boolean = false,
        public stream: number = 0,
        public isInstanced: boolean = false,
        public location: number = 0,
    ) {}

    public copy (info: Readonly<Attribute>) {
        this.name = info.name;
        this.format = info.format;
        this.isNormalized = info.isNormalized;
        this.stream = info.stream;
        this.isInstanced = info.isInstanced;
        this.location = info.location;
        return this;
    }
}

export class ShaderInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public stages: ShaderStage[] = [],
        public attributes: Attribute[] = [],
        public blocks: UniformBlock[] = [],
        public buffers: UniformStorageBuffer[] = [],
        public samplerTextures: UniformSamplerTexture[] = [],
        public samplers: UniformSampler[] = [],
        public textures: UniformTexture[] = [],
        public images: UniformStorageImage[] = [],
        public subpassInputs: UniformInputAttachment[] = [],
    ) {}

    public copy (info: Readonly<ShaderInfo>) {
        this.name = info.name;
        deepCopy(this.stages, info.stages, ShaderStage);
        deepCopy(this.attributes, info.attributes, Attribute);
        deepCopy(this.blocks, info.blocks, UniformBlock);
        deepCopy(this.buffers, info.buffers, UniformStorageBuffer);
        deepCopy(this.samplerTextures, info.samplerTextures, UniformSamplerTexture);
        deepCopy(this.samplers, info.samplers, UniformSampler);
        deepCopy(this.textures, info.textures, UniformTexture);
        deepCopy(this.images, info.images, UniformStorageImage);
        deepCopy(this.subpassInputs, info.subpassInputs, UniformInputAttachment);
        return this;
    }
}

export class InputAssemblerInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public attributes: Attribute[] = [],
        public vertexBuffers: Buffer[] = [],
        public indexBuffer: Buffer | null = null,
        public indirectBuffer: Buffer | null = null,
    ) {}

    public copy (info: Readonly<InputAssemblerInfo>) {
        deepCopy(this.attributes, info.attributes, Attribute);
        this.vertexBuffers = info.vertexBuffers.slice();
        this.indexBuffer = info.indexBuffer;
        this.indirectBuffer = info.indirectBuffer;
        return this;
    }
}

export class ColorAttachment {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public format: Format = Format.UNKNOWN,
        public sampleCount: SampleCount = SampleCount.ONE,
        public loadOp: LoadOp = LoadOp.CLEAR,
        public storeOp: StoreOp = StoreOp.STORE,
        public beginAccesses: AccessType[] = [],
        public endAccesses: AccessType[] = [AccessType.COLOR_ATTACHMENT_WRITE],
        public isGeneralLayout: boolean = false,
    ) {}

    public copy (info: Readonly<ColorAttachment>) {
        this.format = info.format;
        this.sampleCount = info.sampleCount;
        this.loadOp = info.loadOp;
        this.storeOp = info.storeOp;
        this.beginAccesses = info.beginAccesses.slice();
        this.endAccesses = info.endAccesses.slice();
        this.isGeneralLayout = info.isGeneralLayout;
        return this;
    }
}

export class DepthStencilAttachment {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public format: Format = Format.UNKNOWN,
        public sampleCount: SampleCount = SampleCount.ONE,
        public depthLoadOp: LoadOp = LoadOp.CLEAR,
        public depthStoreOp: StoreOp = StoreOp.STORE,
        public stencilLoadOp: LoadOp = LoadOp.CLEAR,
        public stencilStoreOp: StoreOp = StoreOp.STORE,
        public beginAccesses: AccessType[] = [],
        public endAccesses: AccessType[] = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE],
        public isGeneralLayout: boolean = false,
    ) {}

    public copy (info: Readonly<DepthStencilAttachment>) {
        this.format = info.format;
        this.sampleCount = info.sampleCount;
        this.depthLoadOp = info.depthLoadOp;
        this.depthStoreOp = info.depthStoreOp;
        this.stencilLoadOp = info.stencilLoadOp;
        this.stencilStoreOp = info.stencilStoreOp;
        this.beginAccesses = info.beginAccesses.slice();
        this.endAccesses = info.endAccesses.slice();
        this.isGeneralLayout = info.isGeneralLayout;
        return this;
    }
}

export class SubpassInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public inputs: number[] = [],
        public colors: number[] = [],
        public resolves: number[] = [],
        public preserves: number[] = [],
        public depthStencil: number = -1,
        public depthStencilResolve: number = -1,
        public depthResolveMode: ResolveMode = ResolveMode.NONE,
        public stencilResolveMode: ResolveMode = ResolveMode.NONE,
    ) {}

    public copy (info: Readonly<SubpassInfo>) {
        this.inputs = info.inputs.slice();
        this.colors = info.colors.slice();
        this.resolves = info.resolves.slice();
        this.preserves = info.preserves.slice();
        this.depthStencil = info.depthStencil;
        this.depthStencilResolve = info.depthStencilResolve;
        this.depthResolveMode = info.depthResolveMode;
        this.stencilResolveMode = info.stencilResolveMode;
        return this;
    }
}

export class SubpassDependency {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubpass: number = 0,
        public dstSubpass: number = 0,
        public srcAccesses: AccessType[] = [],
        public dstAccesses: AccessType[] = [],
    ) {}

    public copy (info: Readonly<SubpassDependency>) {
        this.srcSubpass = info.srcSubpass;
        this.dstSubpass = info.dstSubpass;
        this.srcAccesses = info.srcAccesses.slice();
        this.dstAccesses = info.dstAccesses.slice();
        return this;
    }
}

export class RenderPassInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public colorAttachments: ColorAttachment[] = [],
        public depthStencilAttachment: DepthStencilAttachment = new DepthStencilAttachment(),
        public subpasses: SubpassInfo[] = [],
        public dependencies: SubpassDependency[] = [],
    ) {}

    public copy (info: Readonly<RenderPassInfo>) {
        deepCopy(this.colorAttachments, info.colorAttachments, ColorAttachment);
        this.depthStencilAttachment.copy(info.depthStencilAttachment);
        deepCopy(this.subpasses, info.subpasses, SubpassInfo);
        deepCopy(this.dependencies, info.dependencies, SubpassDependency);
        return this;
    }
}

export class GlobalBarrierInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public prevAccesses: AccessType[] = [],
        public nextAccesses: AccessType[] = [],
    ) {}

    public copy (info: Readonly<GlobalBarrierInfo>) {
        this.prevAccesses = info.prevAccesses.slice();
        this.nextAccesses = info.nextAccesses.slice();
        return this;
    }
}

export class TextureBarrierInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public prevAccesses: AccessType[] = [],
        public nextAccesses: AccessType[] = [],
        public discardContents: boolean = false,
        public srcQueue: Queue | null = null,
        public dstQueue: Queue | null = null,
    ) {}

    public copy (info: Readonly<TextureBarrierInfo>) {
        this.prevAccesses = info.prevAccesses.slice();
        this.nextAccesses = info.nextAccesses.slice();
        this.discardContents = info.discardContents;
        this.srcQueue = info.srcQueue;
        this.dstQueue = info.dstQueue;
        return this;
    }
}

export class FramebufferInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public renderPass: RenderPass = null!,
        public colorTextures: Texture[] = [],
        public depthStencilTexture: Texture | null = null,
    ) {}

    public copy (info: Readonly<FramebufferInfo>) {
        this.renderPass = info.renderPass;
        this.colorTextures = info.colorTextures.slice();
        this.depthStencilTexture = info.depthStencilTexture;
        return this;
    }
}

export class DescriptorSetLayoutBinding {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public binding: number = -1,
        public descriptorType: DescriptorType = DescriptorType.UNKNOWN,
        public count: number = 0,
        public stageFlags: ShaderStageFlags = ShaderStageFlagBit.NONE,
        public immutableSamplers: Sampler[] = [],
    ) {}

    public copy (info: Readonly<DescriptorSetLayoutBinding>) {
        this.binding = info.binding;
        this.descriptorType = info.descriptorType;
        this.count = info.count;
        this.stageFlags = info.stageFlags;
        this.immutableSamplers = info.immutableSamplers.slice();
        return this;
    }
}

export class DescriptorSetLayoutInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bindings: DescriptorSetLayoutBinding[] = [],
    ) {}

    public copy (info: Readonly<DescriptorSetLayoutInfo>) {
        deepCopy(this.bindings, info.bindings, DescriptorSetLayoutBinding);
        return this;
    }
}

export class DescriptorSetInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public layout: DescriptorSetLayout = null!,
    ) {}

    public copy (info: Readonly<DescriptorSetInfo>) {
        this.layout = info.layout;
        return this;
    }
}

export class PipelineLayoutInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public setLayouts: DescriptorSetLayout[] = [],
    ) {}

    public copy (info: Readonly<PipelineLayoutInfo>) {
        this.setLayouts = info.setLayouts.slice();
        return this;
    }
}

export class InputState {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public attributes: Attribute[] = [],
    ) {}

    public copy (info: Readonly<InputState>) {
        deepCopy(this.attributes, info.attributes, Attribute);
        return this;
    }
}

export class CommandBufferInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public queue: Queue = null!,
        public type: CommandBufferType = CommandBufferType.PRIMARY,
    ) {}

    public copy (info: Readonly<CommandBufferInfo>) {
        this.queue = info.queue;
        this.type = info.type;
        return this;
    }
}

export class QueueInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public type: QueueType = QueueType.GRAPHICS,
    ) {}

    public copy (info: Readonly<QueueInfo>) {
        this.type = info.type;
        return this;
    }
}

export class QueryPoolInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public type: QueryType = QueryType.OCCLUSION,
        public maxQueryObjects: number = 32767,
        public forceWait: boolean = true,
    ) {}

    public copy (info: Readonly<QueryPoolInfo>) {
        this.type = info.type;
        this.maxQueryObjects = info.maxQueryObjects;
        this.forceWait = info.forceWait;
        return this;
    }
}

export class FormatInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public readonly name: string = '',
        public readonly size: number = 0,
        public readonly count: number = 0,
        public readonly type: FormatType = FormatType.NONE,
        public readonly hasAlpha: boolean = false,
        public readonly hasDepth: boolean = false,
        public readonly hasStencil: boolean = false,
        public readonly isCompressed: boolean = false,
    ) {}
}

export class MemoryStatus {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bufferSize: number = 0,
        public textureSize: number = 0,
    ) {}

    public copy (info: Readonly<MemoryStatus>) {
        this.bufferSize = info.bufferSize;
        this.textureSize = info.textureSize;
        return this;
    }
}

export class DynamicStencilStates {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public writeMask: number = 0,
        public compareMask: number = 0,
        public reference: number = 0,
    ) {}

    public copy (info: Readonly<DynamicStencilStates>) {
        this.writeMask = info.writeMask;
        this.compareMask = info.compareMask;
        this.reference = info.reference;
        return this;
    }
}

export class DynamicStates {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public viewport: Viewport = new Viewport(),
        public scissor: Rect = new Rect(),
        public blendConstant: Color = new Color(),
        public lineWidth: number = 1,
        public depthBiasConstant: number = 0,
        public depthBiasClamp: number = 0,
        public depthBiasSlope: number = 0,
        public depthMinBounds: number = 0,
        public depthMaxBounds: number = 0,
        public stencilStatesFront: DynamicStencilStates = new DynamicStencilStates(),
        public stencilStatesBack: DynamicStencilStates = new DynamicStencilStates(),
    ) {}

    public copy (info: Readonly<DynamicStates>) {
        this.viewport.copy(info.viewport);
        this.scissor.copy(info.scissor);
        this.blendConstant.copy(info.blendConstant);
        this.lineWidth = info.lineWidth;
        this.depthBiasConstant = info.depthBiasConstant;
        this.depthBiasClamp = info.depthBiasClamp;
        this.depthBiasSlope = info.depthBiasSlope;
        this.depthMinBounds = info.depthMinBounds;
        this.depthMaxBounds = info.depthMaxBounds;
        this.stencilStatesFront.copy(info.stencilStatesFront);
        this.stencilStatesBack.copy(info.stencilStatesBack);
        return this;
    }
}

/**
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 * The above section is auto-generated from engine-native/cocos/renderer/core/gfx/GFXDef-common.h
 * by the script engine-native/tools/gfx-define-generator/generate.js.
 * Changes to these public interfaces should be made there first and synced back.
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 */

/**
 * @en GFX base object.
 * @zh GFX 基类对象。
 */
export class GFXObject {
    public get objectType (): ObjectType {
        return this._objectType;
    }

    public get objectID (): number {
        return this._objectID;
    }

    public get typedID (): number {
        return this._typedID;
    }

    protected _objectType = ObjectType.UNKNOWN;
    protected _objectID = 0;
    protected _typedID = 0;

    private static _idTable = Array(ObjectType.COUNT).fill(1 << 16);

    constructor (objectType: ObjectType) {
        this._objectType = objectType;
        this._objectID = GFXObject._idTable[ObjectType.UNKNOWN]++;
        this._typedID = GFXObject._idTable[objectType]++;
    }
}

export interface ISwapchainTextureInfo {
    swapchain: Swapchain;
    format: Format;
    width: number;
    height: number;
}

export enum AttributeName {
    ATTR_POSITION = 'a_position',
    ATTR_NORMAL = 'a_normal',
    ATTR_TANGENT = 'a_tangent',
    ATTR_BITANGENT = 'a_bitangent',
    ATTR_WEIGHTS = 'a_weights',
    ATTR_JOINTS = 'a_joints',
    ATTR_COLOR = 'a_color',
    ATTR_COLOR1 = 'a_color1',
    ATTR_COLOR2 = 'a_color2',
    ATTR_TEX_COORD = 'a_texCoord',
    ATTR_TEX_COORD1 = 'a_texCoord1',
    ATTR_TEX_COORD2 = 'a_texCoord2',
    ATTR_TEX_COORD3 = 'a_texCoord3',
    ATTR_TEX_COORD4 = 'a_texCoord4',
    ATTR_TEX_COORD5 = 'a_texCoord5',
    ATTR_TEX_COORD6 = 'a_texCoord6',
    ATTR_TEX_COORD7 = 'a_texCoord7',
    ATTR_TEX_COORD8 = 'a_texCoord8',
    ATTR_BATCH_ID = 'a_batch_id',
    ATTR_BATCH_UV = 'a_batch_uv',
}

export const FormatInfos = Object.freeze([

    new FormatInfo('UNKNOWN', 0, 0, FormatType.NONE, false, false, false, false),

    new FormatInfo('A8', 1, 1, FormatType.UNORM, true, false, false, false),
    new FormatInfo('L8', 1, 1, FormatType.UNORM, false, false, false, false),
    new FormatInfo('LA8', 1, 2, FormatType.UNORM, true, false, false, false),

    new FormatInfo('R8', 1, 1, FormatType.UNORM, false, false, false, false),
    new FormatInfo('R8SN', 1, 1, FormatType.SNORM, false, false, false, false),
    new FormatInfo('R8UI', 1, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R8I', 1, 1, FormatType.INT, false, false, false, false),
    new FormatInfo('R16F', 2, 1, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('R16UI', 2, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R16I', 2, 1, FormatType.INT, false, false, false, false),
    new FormatInfo('R32F', 4, 1, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('R32UI', 4, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R32I', 4, 1, FormatType.INT, false, false, false, false),

    new FormatInfo('RG8', 2, 2, FormatType.UNORM, false, false, false, false),
    new FormatInfo('RG8SN', 2, 2, FormatType.SNORM, false, false, false, false),
    new FormatInfo('RG8UI', 2, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG8I', 2, 2, FormatType.INT, false, false, false, false),
    new FormatInfo('RG16F', 4, 2, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RG16UI', 4, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG16I', 4, 2, FormatType.INT, false, false, false, false),
    new FormatInfo('RG32F', 8, 2, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RG32UI', 8, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG32I', 8, 2, FormatType.INT, false, false, false, false),

    new FormatInfo('RGB8', 3, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('SRGB8', 3, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('RGB8SN', 3, 3, FormatType.SNORM, false, false, false, false),
    new FormatInfo('RGB8UI', 3, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB8I', 3, 3, FormatType.INT, false, false, false, false),
    new FormatInfo('RGB16F', 6, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB16UI', 6, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB16I', 6, 3, FormatType.INT, false, false, false, false),
    new FormatInfo('RGB32F', 12, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB32UI', 12, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB32I', 12, 3, FormatType.INT, false, false, false, false),

    new FormatInfo('RGBA8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('BGRA8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('SRGB8_A8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGBA8SN', 4, 4, FormatType.SNORM, true, false, false, false),
    new FormatInfo('RGBA8UI', 4, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA8I', 4, 4, FormatType.INT, true, false, false, false),
    new FormatInfo('RGBA16F', 8, 4, FormatType.FLOAT, true, false, false, false),
    new FormatInfo('RGBA16UI', 8, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA16I', 8, 4, FormatType.INT, true, false, false, false),
    new FormatInfo('RGBA32F', 16, 4, FormatType.FLOAT, true, false, false, false),
    new FormatInfo('RGBA32UI', 16, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA32I', 16, 4, FormatType.INT, true, false, false, false),

    new FormatInfo('R5G6B5', 2, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('R11G11B10F', 4, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB5A1', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGBA4', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGB10A2', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGB10A2UI', 2, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGB9E5', 2, 4, FormatType.FLOAT, true, false, false, false),

    new FormatInfo('DEPTH', 4, 1, FormatType.FLOAT, false, true, false, false),
    new FormatInfo('DEPTH_STENCIL', 5, 2, FormatType.FLOAT, false, true, true, false),

    new FormatInfo('BC1', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC1_ALPHA', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC1_SRGB', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC1_SRGB_ALPHA', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC2', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC2_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC3', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC3_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC4', 1, 1, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC4_SNORM', 1, 1, FormatType.SNORM, false, false, false, true),
    new FormatInfo('BC5', 1, 2, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC5_SNORM', 1, 2, FormatType.SNORM, false, false, false, true),
    new FormatInfo('BC6H_UF16', 1, 3, FormatType.UFLOAT, false, false, false, true),
    new FormatInfo('BC6H_SF16', 1, 3, FormatType.FLOAT, false, false, false, true),
    new FormatInfo('BC7', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC7_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ETC_RGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_RGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_SRGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_RGB8_A1', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_SRGB8_A1', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_RGBA8', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_SRGB8_A8', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('EAC_R11', 1, 1, FormatType.UNORM, false, false, false, true),
    new FormatInfo('EAC_R11SN', 1, 1, FormatType.SNORM, false, false, false, true),
    new FormatInfo('EAC_RG11', 2, 2, FormatType.UNORM, false, false, false, true),
    new FormatInfo('EAC_RG11SN', 2, 2, FormatType.SNORM, false, false, false, true),

    new FormatInfo('PVRTC_RGB2', 2, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('PVRTC_RGBA2', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC_RGB4', 2, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('PVRTC_RGBA4', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC2_2BPP', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC2_4BPP', 2, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ASTC_RGBA_4x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_5x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_5x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_6x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_6x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_12x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_12x12', 1, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ASTC_SRGBA_4x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_5x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_5x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_6x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_6x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_12x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_12x12', 1, 4, FormatType.UNORM, true, false, false, true),
]);

export const DESCRIPTOR_BUFFER_TYPE = DescriptorType.UNIFORM_BUFFER | DescriptorType.DYNAMIC_UNIFORM_BUFFER
                                      | DescriptorType.STORAGE_BUFFER | DescriptorType.DYNAMIC_STORAGE_BUFFER;

export const DESCRIPTOR_SAMPLER_TYPE = DescriptorType.SAMPLER_TEXTURE | DescriptorType.SAMPLER | DescriptorType.TEXTURE
                                       | DescriptorType.STORAGE_IMAGE | DescriptorType.INPUT_ATTACHMENT;

export const DESCRIPTOR_DYNAMIC_TYPE = DescriptorType.DYNAMIC_STORAGE_BUFFER | DescriptorType.DYNAMIC_UNIFORM_BUFFER;

export const DRAW_INFO_SIZE = 28;

export type BufferSource = ArrayBuffer | IndirectBuffer;

export function IsPowerOf2 (x: number): boolean {
    return x > 0 && (x & (x - 1)) === 0;
}

/**
 * @en Get memory size of the specified fomat.
 * @zh 获取指定格式对应的内存大小。
 * @param format The target format.
 * @param width The target width.
 * @param height The target height.
 * @param depth The target depth.
 */
export function FormatSize (format: Format, width: number, height: number, depth: number): number {
    if (!FormatInfos[format].isCompressed) {
        return (width * height * depth * FormatInfos[format].size);
    } else {
        switch (format) {
        case Format.BC1:
        case Format.BC1_ALPHA:
        case Format.BC1_SRGB:
        case Format.BC1_SRGB_ALPHA:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
        case Format.BC2:
        case Format.BC2_SRGB:
        case Format.BC3:
        case Format.BC3_SRGB:
        case Format.BC4:
        case Format.BC4_SNORM:
        case Format.BC6H_SF16:
        case Format.BC6H_UF16:
        case Format.BC7:
        case Format.BC7_SRGB:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
        case Format.BC5:
        case Format.BC5_SNORM:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 32 * depth;

        case Format.ETC_RGB8:
        case Format.ETC2_RGB8:
        case Format.ETC2_SRGB8:
        case Format.ETC2_RGB8_A1:
        case Format.EAC_R11:
        case Format.EAC_R11SN:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
        case Format.ETC2_RGBA8:
        case Format.ETC2_SRGB8_A1:
        case Format.EAC_RG11:
        case Format.EAC_RG11SN:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

        case Format.PVRTC_RGB2:
        case Format.PVRTC_RGBA2:
        case Format.PVRTC2_2BPP:
            return Math.ceil(Math.max(width, 16) * Math.max(height, 8) / 4) * depth;
        case Format.PVRTC_RGB4:
        case Format.PVRTC_RGBA4:
        case Format.PVRTC2_4BPP:
            return Math.ceil(Math.max(width, 8) * Math.max(height, 8) / 2) * depth;

        case Format.ASTC_RGBA_4X4:
        case Format.ASTC_SRGBA_4X4:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
        case Format.ASTC_RGBA_5X4:
        case Format.ASTC_SRGBA_5X4:
            return Math.ceil(width / 5) * Math.ceil(height / 4) * 16 * depth;
        case Format.ASTC_RGBA_5X5:
        case Format.ASTC_SRGBA_5X5:
            return Math.ceil(width / 5) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_6X5:
        case Format.ASTC_SRGBA_6X5:
            return Math.ceil(width / 6) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_6X6:
        case Format.ASTC_SRGBA_6X6:
            return Math.ceil(width / 6) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_8X5:
        case Format.ASTC_SRGBA_8X5:
            return Math.ceil(width / 8) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_8X6:
        case Format.ASTC_SRGBA_8X6:
            return Math.ceil(width / 8) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_8X8:
        case Format.ASTC_SRGBA_8X8:
            return Math.ceil(width / 8) * Math.ceil(height / 8) * 16 * depth;
        case Format.ASTC_RGBA_10X5:
        case Format.ASTC_SRGBA_10X5:
            return Math.ceil(width / 10) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_10X6:
        case Format.ASTC_SRGBA_10X6:
            return Math.ceil(width / 10) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_10X8:
        case Format.ASTC_SRGBA_10X8:
            return Math.ceil(width / 10) * Math.ceil(height / 8) * 16 * depth;
        case Format.ASTC_RGBA_10X10:
        case Format.ASTC_SRGBA_10X10:
            return Math.ceil(width / 10) * Math.ceil(height / 10) * 16 * depth;
        case Format.ASTC_RGBA_12X10:
        case Format.ASTC_SRGBA_12X10:
            return Math.ceil(width / 12) * Math.ceil(height / 10) * 16 * depth;
        case Format.ASTC_RGBA_12X12:
        case Format.ASTC_SRGBA_12X12:
            return Math.ceil(width / 12) * Math.ceil(height / 12) * 16 * depth;

        default: {
            return 0;
        }
        }
    }
}

/**
 * @en Get memory size of the specified surface.
 * @zh GFX 格式表面内存大小。
 * @param format The target format.
 * @param width The target width.
 * @param height The target height.
 * @param depth The target depth.
 * @param mips The target mip levels.
 */
export function FormatSurfaceSize (
    format: Format, width: number, height: number,
    depth: number, mips: number,
): number {
    let size = 0;

    for (let i = 0; i < mips; ++i) {
        size += FormatSize(format, width, height, depth);
        width = Math.max(width >> 1, 1);
        height = Math.max(height >> 1, 1);
    }

    return size;
}

const _type2size = [
    0,  // UNKNOWN
    4,  // BOOL
    8,  // BOOL2
    12, // BOOL3
    16, // BOOL4
    4,  // INT
    8,  // INT2
    12, // INT3
    16, // INT4
    4,  // UINT
    8,  // UINT2
    12, // UINT3
    16, // UINT4
    4,  // FLOAT
    8,  // FLOAT2
    12, // FLOAT3
    16, // FLOAT4
    16, // MAT2
    24, // MAT2X3
    32, // MAT2X4
    24, // MAT3X2
    36, // MAT3
    48, // MAT3X4
    32, // MAT4X2
    48, // MAT4X3
    64, // MAT4
    4,  // SAMPLER1D
    4,  // SAMPLER1D_ARRAY
    4,  // SAMPLER2D
    4,  // SAMPLER2D_ARRAY
    4,  // SAMPLER3D
    4,  // SAMPLER_CUBE
];

/**
 * @en Get the memory size of the specified type.
 * @zh 得到 GFX 数据类型的大小。
 * @param type The target type.
 */
export function GetTypeSize (type: Type): number {
    return _type2size[type] || 0;
}

export function getTypedArrayConstructor (info: FormatInfo): TypedArrayConstructor {
    const stride = info.size / info.count;
    switch (info.type) {
    case FormatType.UNORM:
    case FormatType.UINT: {
        switch (stride) {
        case 1: return Uint8Array;
        case 2: return Uint16Array;
        case 4: return Uint32Array;
        default:
        }
        break;
    }
    case FormatType.SNORM:
    case FormatType.INT: {
        switch (stride) {
        case 1: return Int8Array;
        case 2: return Int16Array;
        case 4: return Int32Array;
        default:
        }
        break;
    }
    case FormatType.FLOAT: {
        return Float32Array;
    }
    default:
    }
    return Float32Array;
}
