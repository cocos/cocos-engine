import { WebGLGPUBuffer, WebGLGPUTexture, WebGLGPUInputAssembler, WebGLGPUFramebuffer, WebGLGPUShader, WebGLGPUInput, WebGLAttrib, WebGLGPUPipelineState, WebGLGPUUniformBlock, WebGLGPUBindingLayout, WebGLGPUUniform, WebGLGPUUniformSampler } from "./webgl-gpu-objects";
import { WebGLGFXDevice } from "./webgl-device";
import { GFXFormatInfos, GFXFormat, WebGLEXT, GFXType, GFX_MAX_VERTEX_ATTRIBUTES, GFXFormatSize, GFXColor, GFXRect, GFXBindingType, GFXBufferTextureCopy, GFXColorMask, GFXCullMode, GFXShaderType, GFXTextureViewType, GFXTextureLayout, GFXLoadOp, GFXTextureFlagBit, GFXMemoryUsageBit, GFXBufferUsageBit } from "../define";
import { WebGLGFXCommandAllocator } from "./webgl-command-allocator";
import { WebGLTexUnit } from "./webgl-state-cache";

function GFXFormatToWebGLType(format: GFXFormat, device: WebGLGFXDevice): GLenum {
    switch (format) {
        case GFXFormat.R8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.R8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R8I: return WebGLRenderingContext.INT;
        case GFXFormat.R16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.R16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R16I: return WebGLRenderingContext.INT;
        case GFXFormat.R32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.R32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R32I: return WebGLRenderingContext.INT;

        case GFXFormat.RG8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RG8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG8I: return WebGLRenderingContext.INT;
        case GFXFormat.RG16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RG16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG16I: return WebGLRenderingContext.INT;
        case GFXFormat.RG32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RG32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGB8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB8I: return WebGLRenderingContext.INT;
        case GFXFormat.RGB16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB16I: return WebGLRenderingContext.INT;
        case GFXFormat.RGB32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGBA8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8_A8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGBA8UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA8I: return WebGLRenderingContext.INT;
        case GFXFormat.RGBA16F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA16UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA16I: return WebGLRenderingContext.INT;
        case GFXFormat.RGBA32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA32I: return WebGLRenderingContext.INT;

        case GFXFormat.R5G6B5: return WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        case GFXFormat.R11G11B10F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        case GFXFormat.RGB10A2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB10A2UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB9E5: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.D16: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D16S8: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D24: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D24S8: return device.WEBGL_depth_texture ? device.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL : WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.FLOAT;

        case GFXFormat.BC1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC1_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC5: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC5_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC6H_SF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC6H_UF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC7: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC7_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.ETC_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.EAC_RG11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_RG11SN: return WebGLRenderingContext.BYTE;

        case GFXFormat.PVRTC_RGB2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGB4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_2BPP: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_4BPP: return WebGLRenderingContext.UNSIGNED_BYTE;

        default: {
            return WebGLRenderingContext.UNSIGNED_BYTE;
        }
    }
}

function GFXFormatToWebGLInternalFormat(format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB565;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGB5_A1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA4;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT16;
        case GFXFormat.D16S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error("Unsupported GFXFormat, convert to WebGL internal format failed.");
            return WebGLRenderingContext.RGBA;
        }
    }
}

function GFXFormatToWebGLFormat(format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D16S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error("Unsupported GFXFormat, convert to WebGL format failed.");
            return WebGLRenderingContext.RGBA;
        }
    }
}

function GFXTypeToWebGLType(type: GFXType): GLenum {
    switch (type) {
        case GFXType.BOOL: return WebGLRenderingContext.BOOL;
        case GFXType.BOOL2: return WebGLRenderingContext.BOOL_VEC2;
        case GFXType.BOOL3: return WebGLRenderingContext.BOOL_VEC3;
        case GFXType.BOOL4: return WebGLRenderingContext.BOOL_VEC4;
        case GFXType.INT: return WebGLRenderingContext.INT;
        case GFXType.INT2: return WebGLRenderingContext.INT_VEC2;
        case GFXType.INT3: return WebGLRenderingContext.INT_VEC3;
        case GFXType.INT4: return WebGLRenderingContext.INT_VEC4;
        case GFXType.UINT: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXType.FLOAT: return WebGLRenderingContext.FLOAT;
        case GFXType.FLOAT2: return WebGLRenderingContext.FLOAT_VEC2;
        case GFXType.FLOAT3: return WebGLRenderingContext.FLOAT_VEC3;
        case GFXType.FLOAT4: return WebGLRenderingContext.FLOAT_VEC4;
        case GFXType.COLOR4: return WebGLRenderingContext.FLOAT_VEC4;
        case GFXType.MAT2: return WebGLRenderingContext.FLOAT_MAT2;
        case GFXType.MAT3: return WebGLRenderingContext.FLOAT_MAT3;
        case GFXType.MAT4: return WebGLRenderingContext.FLOAT_MAT4;
        case GFXType.SAMPLER2D: return WebGLRenderingContext.SAMPLER_2D;
        case GFXType.SAMPLER_CUBE: return WebGLRenderingContext.SAMPLER_CUBE;
        default: {
            console.error("Unsupported GLType, convert to GL type failed.");
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLTypeToGFXType(glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.BOOL: return GFXType.BOOL;
        case WebGLRenderingContext.BOOL_VEC2: return GFXType.BOOL2;
        case WebGLRenderingContext.BOOL_VEC3: return GFXType.BOOL3;
        case WebGLRenderingContext.BOOL_VEC4: return GFXType.BOOL4;
        case WebGLRenderingContext.INT: return GFXType.INT;
        case WebGLRenderingContext.INT_VEC2: return GFXType.INT2;
        case WebGLRenderingContext.INT_VEC3: return GFXType.INT3;
        case WebGLRenderingContext.INT_VEC4: return GFXType.INT4;
        case WebGLRenderingContext.UNSIGNED_INT: return GFXType.UINT;
        case WebGLRenderingContext.FLOAT: return GFXType.FLOAT;
        case WebGLRenderingContext.FLOAT_VEC2: return GFXType.FLOAT2;
        case WebGLRenderingContext.FLOAT_VEC3: return GFXType.FLOAT3;
        case WebGLRenderingContext.FLOAT_VEC4: return GFXType.FLOAT4;
        case WebGLRenderingContext.FLOAT_MAT2: return GFXType.MAT2;
        case WebGLRenderingContext.FLOAT_MAT3: return GFXType.MAT3;
        case WebGLRenderingContext.FLOAT_MAT4: return GFXType.MAT4;
        case WebGLRenderingContext.SAMPLER_2D: return GFXType.SAMPLER2D;
        case WebGLRenderingContext.SAMPLER_CUBE: return GFXType.SAMPLER_CUBE;
        default: {
            console.error("Unsupported GLType, convert to GFXType failed.");
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLGetTypeSize(glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.BOOL: return 4;
        case WebGLRenderingContext.BOOL_VEC2: return 8;
        case WebGLRenderingContext.BOOL_VEC3: return 12;
        case WebGLRenderingContext.BOOL_VEC4: return 16;
        case WebGLRenderingContext.INT: return 4;
        case WebGLRenderingContext.INT_VEC2: return 8;
        case WebGLRenderingContext.INT_VEC3: return 12;
        case WebGLRenderingContext.INT_VEC4: return 16;
        case WebGLRenderingContext.UNSIGNED_INT: return 4;
        case WebGLRenderingContext.FLOAT: return 4;
        case WebGLRenderingContext.FLOAT_VEC2: return 8;
        case WebGLRenderingContext.FLOAT_VEC3: return 12;
        case WebGLRenderingContext.FLOAT_VEC4: return 16;
        case WebGLRenderingContext.FLOAT_MAT2: return 16;
        case WebGLRenderingContext.FLOAT_MAT3: return 36;
        case WebGLRenderingContext.FLOAT_MAT4: return 64;
        case WebGLRenderingContext.SAMPLER_2D: return 4;
        case WebGLRenderingContext.SAMPLER_CUBE: return 4;
        default: {
            console.error("Unsupported GLType, get type failed.");
            return 0;
        }
    }
}

function WebGLGetComponentCount(glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.FLOAT_MAT2: return 2;
        case WebGLRenderingContext.FLOAT_MAT3: return 3;
        case WebGLRenderingContext.FLOAT_MAT4: return 4;
        default: {
            return 1;
        }
    }
}

const WebGLCmpFuncs: GLenum[] = [
    WebGLRenderingContext.NEVER,
    WebGLRenderingContext.LESS,
    WebGLRenderingContext.EQUAL,
    WebGLRenderingContext.LEQUAL,
    WebGLRenderingContext.GREATER,
    WebGLRenderingContext.NOTEQUAL,
    WebGLRenderingContext.GEQUAL,
    WebGLRenderingContext.ALWAYS,
];

const WebGLStencilOps: GLenum[] = [
    WebGLRenderingContext.KEEP,
    WebGLRenderingContext.ZERO,
    WebGLRenderingContext.REPLACE,
    WebGLRenderingContext.INCR,
    WebGLRenderingContext.DECR,
    WebGLRenderingContext.INVERT,
    WebGLRenderingContext.INCR_WRAP,
    WebGLRenderingContext.DECR_WRAP,
];

const WebGLBlendOps: GLenum[] = [
    WebGLRenderingContext.FUNC_ADD,
    WebGLRenderingContext.FUNC_SUBTRACT,
    WebGLRenderingContext.FUNC_REVERSE_SUBTRACT,
    WebGLRenderingContext.FUNC_ADD,
    WebGLRenderingContext.FUNC_ADD,
];

const WebGLBlendFactors: GLenum[] = [
    WebGLRenderingContext.ZERO,
    WebGLRenderingContext.ONE,
    WebGLRenderingContext.SRC_ALPHA,
    WebGLRenderingContext.DST_ALPHA,
    WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
    WebGLRenderingContext.ONE_MINUS_DST_ALPHA,
    WebGLRenderingContext.SRC_COLOR,
    WebGLRenderingContext.DST_COLOR,
    WebGLRenderingContext.SRC_ALPHA_SATURATE,
    WebGLRenderingContext.CONSTANT_COLOR,
    WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR,
    WebGLRenderingContext.CONSTANT_ALPHA,
    WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA,
];

export enum WebGLCmd {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_PIPELINE_STATE,
    BIND_BINDING_LAYOUT,
    BIND_INPUT_ASSEMBLER,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    COUNT,
};

export class WebGLCmdObject {
    cmdType: WebGLCmd;

    constructor(type: WebGLCmd) {
        this.cmdType = type;
    }
};

export class WebGLCmdBeginRenderPass extends WebGLCmdObject {

    gpuFramebuffer: WebGLGPUFramebuffer | null = null;
    renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };
    clearColors: GFXColor[] = [];
    clearDepth: number = 1.0;
    clearStencil: number = 0;

    constructor() {
        super(WebGLCmd.BEGIN_RENDER_PASS);
    }
}

export class WebGLCmdBindPipelineState extends WebGLCmdObject {

    gpuPipelineState: WebGLGPUPipelineState | null = null;

    constructor() {
        super(WebGLCmd.BIND_PIPELINE_STATE);
    }
};

export class WebGLCmdBindInputAssembler extends WebGLCmdObject {

    gpuInputAssembler: WebGLGPUInputAssembler | null = null;

    constructor() {
        super(WebGLCmd.BIND_INPUT_ASSEMBLER);
    }
};

export class WebGLCmdBindBindingLayout extends WebGLCmdObject {

    gpuBindingLayout: WebGLGPUBindingLayout | null = null;

    constructor() {
        super(WebGLCmd.BIND_BINDING_LAYOUT);
    }
};

export class WebGLCmdDraw extends WebGLCmdObject {

    vertexCount: number = 0;
    firstVertex: number = 0;

    indexCount: number = 0;
    firstIndex: number = 0;
    vertexOffset: number = 0;

    instanceCount: number = 0;
    firstInstance: number = 0;

    constructor() {
        super(WebGLCmd.DRAW);
    }
};

export class WebGLCmdUpdateBuffer extends WebGLCmdObject {

    gpuBuffer: WebGLGPUBuffer | null = null;
    buffer: ArrayBuffer | null = null;
    offset: number = 0;

    constructor() {
        super(WebGLCmd.UPDATE_BUFFER);
    }
};

export class WebGLGFXTextureSubres {
    baseMipLevel: number = 0;
    levelCount: number = 1;
    baseArrayLayer: number = 0;
    layerCount: number = 1;
}

export class WebGLGFXBufferTextureCopy {
    buffOffset: number = 0;
    buffStride: number = 0;
    buffTexHeight: number = 0;
    texOffset: number[] = [0, 0, 0];
    texExtent: number[] = [0, 0, 0];
    texSubres: WebGLGFXTextureSubres = new WebGLGFXTextureSubres;
}

export class WebGLCmdCopyBufferToTexture extends WebGLCmdObject {

    gpuBuffer: WebGLGPUBuffer | null = null;
    gpuTexture: WebGLGPUTexture | null = null;
    dstLayout: GFXTextureLayout | null = null;
    regions: GFXBufferTextureCopy[] = [];

    constructor() {
        super(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
    }
};

export class WebGLCmdPackage {
    cmds: WebGLCmd[] = [];
    beginRenderPassCmds: WebGLCmdBeginRenderPass[] = [];
    bindPipelineStateCmds: WebGLCmdBindPipelineState[] = [];
    bindBindingLayoutCmds: WebGLCmdBindBindingLayout[] = [];
    bindInputAssemblerCmds: WebGLCmdBindInputAssembler[] = [];
    drawCmds: WebGLCmdDraw[] = [];
    updateBufferCmds: WebGLCmdUpdateBuffer[] = [];
    copyBufferToTextureCmds: WebGLCmdCopyBufferToTexture[] = [];

    clearCmds(allocator: WebGLGFXCommandAllocator) {

        if (this.beginRenderPassCmds.length) {
            for (let i = 0; i < this.beginRenderPassCmds.length; ++i) {
                allocator.beginRenderPassCmdPool.free(this.beginRenderPassCmds[i]);
            }
            this.beginRenderPassCmds = [];
        }

        if (this.bindPipelineStateCmds.length) {
            for (let i = 0; i < this.bindPipelineStateCmds.length; ++i) {
                allocator.bindPipelineStateCmdPool.free(this.bindPipelineStateCmds[i]);
            }
            this.bindPipelineStateCmds = [];
        }

        if (this.bindBindingLayoutCmds.length) {
            for (let i = 0; i < this.bindBindingLayoutCmds.length; ++i) {
                allocator.bindBindingLayoutCmdPool.free(this.bindBindingLayoutCmds[i]);
            }
            this.bindBindingLayoutCmds = [];
        }

        if (this.bindInputAssemblerCmds.length) {
            for (let i = 0; i < this.bindInputAssemblerCmds.length; ++i) {
                allocator.bindInputAssemblerCmdPool.free(this.bindInputAssemblerCmds[i]);
            }
            this.bindInputAssemblerCmds = [];
        }

        if (this.drawCmds.length) {
            for (let i = 0; i < this.drawCmds.length; ++i) {
                allocator.drawCmdPool.free(this.drawCmds[i]);
            }
            this.drawCmds = [];
        }

        if (this.updateBufferCmds.length) {
            for (let i = 0; i < this.updateBufferCmds.length; ++i) {
                allocator.updateBufferCmdPool.free(this.updateBufferCmds[i]);
            }
            this.updateBufferCmds = [];
        }

        if (this.copyBufferToTextureCmds.length) {
            for (let i = 0; i < this.copyBufferToTextureCmds.length; ++i) {
                allocator.copyBufferToTextureCmdPool.free(this.copyBufferToTextureCmds[i]);
            }
            this.copyBufferToTextureCmds = [];
        }

        this.cmds = [];
    }
}

export function WebGLCmdFuncCreateBuffer(device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer) {

    let gl = device.gl;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {

        gpuBuffer.glTarget = WebGLRenderingContext.ARRAY_BUFFER;
        let glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;

            if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
            }

            let glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.DEVICE ? WebGLRenderingContext.STATIC_DRAW : WebGLRenderingContext.DYNAMIC_DRAW;
            gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);
            device.stateCache.glArrayBuffer = 0;
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {

        gpuBuffer.glTarget = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;
        let glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;

            if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }

            let glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.DEVICE ? WebGLRenderingContext.STATIC_DRAW : WebGLRenderingContext.DYNAMIC_DRAW;
            gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);

            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
            device.stateCache.glElementArrayBuffer = 0;
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        //console.error("WebGL 1.0 doesn't support uniform buffer.");
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;

        if (gpuBuffer.buffer) {
            gpuBuffer.viewF32 = new Float32Array(gpuBuffer.buffer);
        }

    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else {
        console.error("Unsupported GFXBufferType, create buffer failed.");
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    }
}

export function WebGLCmdFuncDestroyBuffer(device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer) {
    if (gpuBuffer.glBuffer > 0) {
        device.gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = 0;
    }
}

export function WebGLCmdFuncUpdateBuffer(device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer, offset: number, buffer: ArrayBuffer) {

    if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        if (gpuBuffer.viewF32 && buffer) {
            gpuBuffer.viewF32.set(new Float32Array(buffer), offset);
        }
    } else {
        let gl = device.gl;

        switch (gpuBuffer.glTarget) {
            case WebGLRenderingContext.ARRAY_BUFFER: {
                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }
                gl.bufferSubData(gpuBuffer.glTarget, offset, buffer);
                break;
            }
            case WebGLRenderingContext.ELEMENT_ARRAY_BUFFER: {
                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }
                gl.bufferSubData(gpuBuffer.glTarget, offset, buffer);
                break;
            }
            default: {
                console.error("Unsupported GFXBufferType, update buffer failed.");
            }
        }
    }
}

export function WebGLCmdFuncCreateTexture(device: WebGLGFXDevice, gpuTexture: WebGLGPUTexture) {

    let gl = device.gl;

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, device);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D: {

            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;

            let glTexture = gl.createTexture();
            if (glTexture) {
                gpuTexture.glTexture = glTexture;
                let glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                let w = gpuTexture.width;
                let h = gpuTexture.height;

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    let view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                }
            }

            break;
        }
        case GFXTextureViewType.CUBE: {

            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_CUBE_MAP;

            let glTexture = gl.createTexture();
            if (glTexture) {
                gpuTexture.glTexture = glTexture;
                let glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                } else {
                    let view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };

                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                }
            }

            break;
        }
        default: {
            console.error("Unsupported GFXTextureType, create texture failed.");
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;
        }
    }
}

export function WebGLCmdFuncDestroyTexture(device: WebGLGFXDevice, gpuTexture: WebGLGPUTexture) {
    if (gpuTexture.glTexture > 0) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = 0;
    }
}

export function WebGLCmdFuncCreateFramebuffer(device: WebGLGFXDevice, gpuFramebuffer: WebGLGPUFramebuffer) {

    if (!gpuFramebuffer.isOffscreen) {

        let gl = device.gl;

        let glFramebuffer = gl.createFramebuffer();
        if (glFramebuffer) {
            gpuFramebuffer.glFramebuffer = glFramebuffer;

            if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
                gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
                device.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
            }

            for (let i = 0; i < gpuFramebuffer.gpuColorViews.length; ++i) {

                let gpuColorView = gpuFramebuffer.gpuColorViews[i];
                if (gpuColorView) {
                    gl.framebufferTexture2D(
                        WebGLRenderingContext.FRAMEBUFFER,
                        WebGLRenderingContext.COLOR_ATTACHMENT0 + i,
                        gpuColorView.gpuTexture.glTarget,
                        gpuColorView.gpuTexture.glTexture,
                        gpuColorView.baseLevel);
                }
            }

            if (gpuFramebuffer.gpuDepthStencilView) {

                let glAttachment = GFXFormatInfos[gpuFramebuffer.gpuDepthStencilView.format].hasStencil ?
                    WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT : WebGLRenderingContext.DEPTH_ATTACHMENT;

                gl.framebufferTexture2D(
                    WebGLRenderingContext.FRAMEBUFFER,
                    glAttachment,
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTarget,
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTexture,
                    gpuFramebuffer.gpuDepthStencilView.baseLevel);
            }

            let status = gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER);
            if (status !== WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
                switch (status) {
                    case WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: {
                        console.error("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                        break;
                    }
                    case WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: {
                        console.error("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                        break;
                    }
                    case WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: {
                        console.error("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                        break;
                    }
                    case WebGLRenderingContext.FRAMEBUFFER_UNSUPPORTED: {
                        console.error("glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
                        break;
                    }
                    default: ;
                }
            }
        }
    }
}

export function WebGLCmdFuncDestroyFramebuffer(device: WebGLGFXDevice, gpuFramebuffer: WebGLGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer > 0) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = 0;
    }
}

export function WebGLCmdFuncCreateShader(device: WebGLGFXDevice, gpuShader: WebGLGPUShader) {
    let gl = device.gl;

    for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
        let gpuStage = gpuShader.gpuStages[i];

        let glShaderType: GLenum = 0;
        let shaderTypeStr = "";

        switch (gpuStage.type) {
            case GFXShaderType.VERTEX: {
                shaderTypeStr = "VertexShader";
                glShaderType = WebGLRenderingContext.VERTEX_SHADER;
                break;
            }
            case GFXShaderType.FRAGMENT: {
                shaderTypeStr = "FragmentShader";
                glShaderType = WebGLRenderingContext.FRAGMENT_SHADER;
                break;
            }
            default: {
                console.error("Unsupported GFXShaderType.");
                return;
            }
        }

        let glShader = gl.createShader(glShaderType);
        if (glShader) {
            gpuStage.glShader = glShader;
            gl.shaderSource(gpuStage.glShader, gpuStage.source);
            gl.compileShader(gpuStage.glShader);

            var isSuccess = gl.getShaderParameter(gpuStage.glShader, gl.COMPILE_STATUS);
            if (!isSuccess) {
                console.error(shaderTypeStr + " in '" + gpuShader.name + "' compilation failed.");
                console.error(gpuStage.source);
                console.error(gl.getShaderInfoLog(gpuStage.glShader));

                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = 0;
            }
        }
    }

    let glProgram = gl.createProgram();
    if (glProgram) {
        gpuShader.glProgram = glProgram;

        // link program
        for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
            let gpuStage = gpuShader.gpuStages[i];

            gl.attachShader(gpuShader.glProgram, gpuStage.glShader);
        }
    }

    gl.linkProgram(gpuShader.glProgram);
    var isSuccess = gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS);
    if (isSuccess) {
        console.info("Shader '" + gpuShader.name + "' compilation successed.");
    } else {
        console.error("Failed to link shader '" + gpuShader.name + "'.");
        console.error(gl.getProgramInfoLog(gpuShader.glProgram));

        for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
            let gpuStage = gpuShader.gpuStages[i];
            if (gpuStage.glShader > 0) {
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = 0;
            }
        }
    }

    // parse inputs
    let activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array<WebGLGPUInput>(activeAttribCount);

    for (let i = 0; i < activeAttribCount; ++i) {
        let attribInfo = gl.getActiveAttrib(gpuShader.glProgram, i);
        if (attribInfo) {
            let varName: string;
            let nameOffset = attribInfo.name.indexOf('[');
            if (nameOffset !== -1) {
                varName = attribInfo.name.substr(0, nameOffset);
            } else {
                varName = attribInfo.name;
            }

            let glLoc = gl.getAttribLocation(gpuShader.glProgram, varName);
            let type = WebGLTypeToGFXType(attribInfo.type);
            let stride = WebGLGetTypeSize(attribInfo.type);

            gpuShader.glInputs[i] = {
                binding: glLoc,
                name: varName,
                type: type,
                stride: stride,
                count: attribInfo.size,
                size: stride * attribInfo.size,

                glType: attribInfo.type,
                glLoc: glLoc,
            };
        }
    }

    // create uniform blocks
    if (gpuShader.blocks && gpuShader.blocks.length > 0) {
        gpuShader.glBlocks = new Array<WebGLGPUUniformBlock>(gpuShader.blocks.length);
        for (let i = 0; i < gpuShader.blocks.length; ++i) {
            let block = gpuShader.blocks[i];

            let glBlock: WebGLGPUUniformBlock = {
                binding: block.binding,
                name: block.name,
                size: 0,
                glUniforms: new Array<WebGLGPUUniform>(block.uniforms.length),
                isUniformPackage: true,
                buffer: null,
            };

            gpuShader.glBlocks[i] = glBlock;

            for (let u = 0; u < block.uniforms.length; ++u) {
                let uniform = block.uniforms[u];
                let glType = GFXTypeToWebGLType(uniform.type);
                let stride = WebGLGetTypeSize(glType);
                let size = stride * uniform.count;

                glBlock.glUniforms[u] = {
                    binding: -1,
                    name: uniform.name,
                    type: uniform.type,
                    stride: stride,
                    count: uniform.count,
                    size: size,
                    offset: glBlock.size,

                    glType: glType,
                    glLoc: -1,
                    view: null,
                }

                glBlock.size += size;
            }

            glBlock.buffer = new ArrayBuffer(glBlock.size);
        }
    }

    // create uniform samplers
    if (gpuShader.samplers && gpuShader.samplers.length > 0) {
        gpuShader.glSamplers = new Array<WebGLGPUUniformSampler>(gpuShader.samplers.length);

        for (let i = 0; i < gpuShader.samplers.length; ++i) {
            let sampler = gpuShader.samplers[i];
            gpuShader.glSamplers[i] = {
                binding: sampler.binding,
                name: sampler.name,
                type: sampler.type,
                units: [],
                glType: GFXTypeToWebGLType(sampler.type),
                glLoc: -1,
            }
        }
    }

    // parse uniforms
    let activeUniformCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORMS);
    let unitIdx = 0;

    for (let i = 0; i < activeUniformCount; ++i) {
        let uniformInfo = gl.getActiveUniform(gpuShader.glProgram, i);
        if (uniformInfo) {
            let glLoc = gl.getUniformLocation(gpuShader.glProgram, uniformInfo.name);
            if (glLoc) {
                let varName: string;
                let nameOffset = uniformInfo.name.indexOf('[');
                if (nameOffset !== -1) {
                    varName = uniformInfo.name.substr(0, nameOffset);
                } else {
                    varName = uniformInfo.name;
                }

                let isSampler = (uniformInfo.type === WebGLRenderingContext.SAMPLER_2D) ||
                    (uniformInfo.type === WebGLRenderingContext.SAMPLER_CUBE);

                if (!isSampler) {
                    //let stride = WebGLGetTypeSize(info.type);

                    // build uniform block mapping
                    for (let b = 0; b < gpuShader.glBlocks.length; ++b) {

                        let glBlock = gpuShader.glBlocks[b];

                        for (let u = 0; u < glBlock.glUniforms.length; ++u) {
                            let glUniform = glBlock.glUniforms[u];
                            if (glUniform.name === varName) {
                                //let varSize = stride * info.size;

                                glUniform.glLoc = glLoc;

                                //let count = glUniform.size / 4;
                                //glUniform.view = new Float32Array(<ArrayBuffer>glBlock.buffer, glUniform.offset, count);

                                switch (glUniform.glType) {
                                    case WebGLRenderingContext.BOOL:
                                    case WebGLRenderingContext.BOOL_VEC2:
                                    case WebGLRenderingContext.BOOL_VEC3:
                                    case WebGLRenderingContext.BOOL_VEC4:
                                    case WebGLRenderingContext.INT:
                                    case WebGLRenderingContext.INT_VEC3:
                                    case WebGLRenderingContext.INT_VEC2:
                                    case WebGLRenderingContext.INT_VEC4: {
                                        let count = glUniform.size / 4;
                                        glUniform.view = new Int32Array(<ArrayBuffer>glBlock.buffer, glUniform.offset, count);
                                        break;
                                    }
                                    default: {
                                        let count = glUniform.size / 4;
                                        glUniform.view = new Float32Array(<ArrayBuffer>glBlock.buffer, glUniform.offset, count);
                                    }
                                }

                                break;
                            }
                        }
                    } // for
                } else {

                    for (let s = 0; s < gpuShader.glSamplers.length; ++s) {
                        let glSampler = gpuShader.glSamplers[s];
                        if (glSampler.name === varName) {
                            //let varSize = stride * uniformInfo.size;

                            for (let t = 0; t < uniformInfo.size; ++t) {
                                glSampler.units.push(unitIdx + t);
                            }

                            glSampler.glLoc = glLoc;

                            unitIdx += uniformInfo.size;

                            break;
                        }
                    } // for
                }
            }
        }
    } // for
}

export function WebGLCmdFuncDestroyShader(device: WebGLGFXDevice, gpuShader: WebGLGPUShader) {

    for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
        let gpuStage = gpuShader.gpuStages[i];

        if (gpuStage.glShader > 0) {
            device.gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = 0;
        }
    }

    if (gpuShader.glProgram > 0) {
        device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = 0;
    }
}

export function WebGLCmdFuncCreateInputAssember(device: WebGLGFXDevice, gpuInputAssembler: WebGLGPUInputAssembler) {

    gpuInputAssembler.glAttribs = new Array<WebGLAttrib>(gpuInputAssembler.attributes.length);

    let offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        let attrib = gpuInputAssembler.attributes[i];

        let stream = attrib.stream !== undefined ? attrib.stream : 0;
        //if (stream < gpuInputAssembler.gpuVertexBuffers.length) {

        let gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];

        let glType = GFXFormatToWebGLType(attrib.format, device);
        let size = GFXFormatInfos[attrib.format].size;

        gpuInputAssembler.glAttribs[i] = {
            name: attrib.name,
            glBuffer: gpuBuffer.glBuffer,
            glType: glType,
            size: size,
            count: GFXFormatInfos[attrib.format].count,
            stride: gpuBuffer.stride,
            componentCount: WebGLGetComponentCount(glType),
            isNormalized: (attrib.isNormalized !== undefined? attrib.isNormalized : false),
            isInstanced: (attrib.isInstanced !== undefined ? attrib.isInstanced : false),
            offset: offsets[stream],
        };

        offsets[stream] += size;
    }

    /*
    if (gpuInputAssembler.gpuShader) {
        let attribCount = gpuInputAssembler.gpuShader.glInputs.length;
        gpuInputAssembler.glAttribs = new Array<WebGLAttrib>(attribCount);

        let offsets = [0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < attribCount; ++i) {
            let glInput = gpuInputAssembler.gpuShader.glInputs[i];
            let glAttrib = gpuInputAssembler.glAttribs[i];
            glAttrib.glLoc = glInput.glLoc;
            glAttrib.glType = glInput.glType;
            glAttrib.size = glInput.size;
            glAttrib.componentCount = WebGLGetComponentCount(glAttrib.glType);

            for (let j = 0; j < gpuInputAssembler.attributes.length; ++j) {
                let attrib = gpuInputAssembler.attributes[j];

                let stream = attrib.stream !== undefined ? attrib.stream : 0;

                if (glInput.name === attrib.name && stream < gpuInputAssembler.gpuVertexBuffers.length) {

                    let gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];
                    glAttrib.count = GFXFormatInfos[attrib.format].count;
                    glAttrib.stride = gpuBuffer.stride;
                    glAttrib.glBuffer = gpuBuffer.glBuffer;

                    if (attrib.isInstanced) {
                        glAttrib.isInstanced = attrib.isInstanced;
                    }

                    glAttrib.offset = offsets[stream];
                    offsets[stream] += glInput.size;
                    break;
                }
            }
        }
    }
    */
}

export function WebGLCmdFuncDestroyInputAssembler(device: WebGLGFXDevice, gpuInputAssembler: WebGLGPUInputAssembler) {
}

export function WebGLCmdFuncExecuteCmds(device: WebGLGFXDevice, cmdPackage: WebGLCmdPackage) {

    let gl = device.gl;
    let cmdIds = [0, 0, 0, 0, 0, 0, 0, 0];   // 8

    let gpuShader: WebGLGPUShader | null = null;
    let gpuInputAssembler: WebGLGPUInputAssembler | null = null;
    let glPrimitive = WebGLRenderingContext.TRIANGLES;

    for (let i = 0; i < cmdPackage.cmds.length; ++i) {
        let cmd = cmdPackage.cmds[i];
        let cmdId = cmdIds[cmd]++;

        switch (cmdPackage.cmds[i]) {
            case WebGLCmd.BEGIN_RENDER_PASS: {
                let cmd0 = cmdPackage.beginRenderPassCmds[cmdId];

                let clears: GLbitfield = 0;

                if (cmd0.gpuFramebuffer) {
                    if (device.stateCache.glFramebuffer !== cmd0.gpuFramebuffer.glFramebuffer) {
                        let glFBO = (cmd0.gpuFramebuffer.glFramebuffer !== 0 ? cmd0.gpuFramebuffer.glFramebuffer : null);
                        gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, glFBO);
                        device.stateCache.glFramebuffer = cmd0.gpuFramebuffer.glFramebuffer;
                    }

                    if (device.stateCache.viewport.left !== cmd0.renderArea.x ||
                        device.stateCache.viewport.top !== cmd0.renderArea.y ||
                        device.stateCache.viewport.width !== cmd0.renderArea.width ||
                        device.stateCache.viewport.height !== cmd0.renderArea.height) {

                        gl.viewport(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        device.stateCache.viewport.left = cmd0.renderArea.x;
                        device.stateCache.viewport.top = cmd0.renderArea.y;
                        device.stateCache.viewport.width = cmd0.renderArea.width;
                        device.stateCache.viewport.height = cmd0.renderArea.height;
                    }

                    if (device.stateCache.scissorRect.x !== cmd0.renderArea.x ||
                        device.stateCache.scissorRect.y !== cmd0.renderArea.y ||
                        device.stateCache.scissorRect.width !== cmd0.renderArea.width ||
                        device.stateCache.scissorRect.height !== cmd0.renderArea.height) {

                        gl.scissor(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        device.stateCache.scissorRect.x = cmd0.renderArea.x;
                        device.stateCache.scissorRect.y = cmd0.renderArea.y;
                        device.stateCache.scissorRect.width = cmd0.renderArea.width;
                        device.stateCache.scissorRect.height = cmd0.renderArea.height;
                    }

                    let curGPURenderPass = cmd0.gpuFramebuffer.gpuRenderPass;

                    let invalidateAttachments: GLenum[] = [0, 0, 0, 0];
                    let numInvalidAttach = 0;

                    if (curGPURenderPass.colorAttachments.length > 0) {
                        let colorAttachment = curGPURenderPass.colorAttachments[0];

                        if (colorAttachment.format !== GFXFormat.UNKNOWN) {
                            switch (colorAttachment.loadOp) {
                                case GFXLoadOp.LOAD: break; // GL default behaviour
                                case GFXLoadOp.CLEAR: {

                                    if (device.stateCache.bs.targets[0].blendColorMask !== GFXColorMask.ALL) {
                                        gl.colorMask(true, true, true, true);
                                    }

                                    let clearColor = cmd0.clearColors[0];
                                    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
                                    clears |= WebGLRenderingContext.COLOR_BUFFER_BIT;

                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    invalidateAttachments[numInvalidAttach++] = WebGLRenderingContext.COLOR_ATTACHMENT0;
                                    break;
                                }
                                default: ;
                            }
                        }
                    } // if (curGPURenderPass)

                    if (curGPURenderPass.depthStencilAttachment) {

                        if (curGPURenderPass.depthStencilAttachment.format !== GFXFormat.UNKNOWN) {
                            switch (curGPURenderPass.depthStencilAttachment.depthLoadOp) {
                                case GFXLoadOp.LOAD: break; // GL default behaviour
                                case GFXLoadOp.CLEAR: {

                                    if (!device.stateCache.dss.depthWrite) {
                                        gl.depthMask(true);
                                    }

                                    gl.clearDepth(cmd0.clearDepth);

                                    clears |= WebGLRenderingContext.DEPTH_BUFFER_BIT;

                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    invalidateAttachments[numInvalidAttach++] = WebGLRenderingContext.DEPTH_ATTACHMENT;
                                    break;
                                }
                                default: ;
                            }

                            if (GFXFormatInfos[curGPURenderPass.depthStencilAttachment.format].hasStencil) {
                                switch (curGPURenderPass.depthStencilAttachment.stencilLoadOp) {
                                    case GFXLoadOp.LOAD: break; // GL default behaviour
                                    case GFXLoadOp.CLEAR: {

                                        if (!device.stateCache.dss.stencilWriteMaskFront) {
                                            gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, 0xFFFFFFFF);
                                        }

                                        if (!device.stateCache.dss.stencilWriteMaskBack) {
                                            gl.stencilMaskSeparate(WebGLRenderingContext.BACK, 0xFFFFFFFF);
                                        }

                                        gl.clearStencil(cmd0.clearStencil);
                                        clears |= WebGLRenderingContext.STENCIL_BUFFER_BIT;

                                        break;
                                    }
                                    case GFXLoadOp.DISCARD: {
                                        // invalidate the framebuffer
                                        invalidateAttachments[numInvalidAttach++] = WebGLRenderingContext.STENCIL_ATTACHMENT;
                                        break;
                                    }
                                    default: ;
                                }
                            }
                        }
                    } // if (curGPURenderPass.depthStencilAttachment)

                    /*
                    if (numInvalidAttach) {
                        gl.invalidateFramebuffer(WebGLRenderingContext.FRAMEBUFFER, numInvalidAttach, invalidateAttachments);
                    }
                    */

                    if (clears) {
                        gl.clear(clears);
                    }

                    // restore states
                    if (clears & WebGLRenderingContext.COLOR_BUFFER_BIT) {

                        let colorMask = device.stateCache.bs.targets[0].blendColorMask;
                        if (colorMask !== GFXColorMask.ALL) {
                            let r = (colorMask & GFXColorMask.R) != GFXColorMask.NONE;
                            let g = (colorMask & GFXColorMask.G) != GFXColorMask.NONE;
                            let b = (colorMask & GFXColorMask.B) != GFXColorMask.NONE;
                            let a = (colorMask & GFXColorMask.A) != GFXColorMask.NONE;
                            gl.colorMask(r, g, b, a);
                        }
                    }

                    if ((clears & WebGLRenderingContext.DEPTH_BUFFER_BIT) &&
                        !device.stateCache.dss.depthWrite) {
                        gl.depthMask(false);
                    }

                    if (clears & WebGLRenderingContext.STENCIL_BUFFER_BIT) {
                        if (!device.stateCache.dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, 0);
                        }

                        if (!device.stateCache.dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.BACK, 0);
                        }
                    }
                } // if (curGPURenderPass)

                break;
            }
            case WebGLCmd.END_RENDER_PASS: {
                // WebGL 1.0 doesn't support store operation of attachments.
                // GFXStoreOp.Store is the default GL behaviour.
                break;
            }
            case WebGLCmd.BIND_PIPELINE_STATE: {

                let cmd2 = cmdPackage.bindPipelineStateCmds[cmdId];
                if (cmd2.gpuPipelineState) {

                    glPrimitive = cmd2.gpuPipelineState.glPrimitive;

                    if (cmd2.gpuPipelineState.gpuShader) {

                        let glProgram = cmd2.gpuPipelineState.gpuShader.glProgram;
                        if (device.stateCache.glProgram !== glProgram) {
                            gl.useProgram(glProgram);
                            device.stateCache.glProgram = glProgram;
                        }

                        gpuShader = cmd2.gpuPipelineState.gpuShader;
                    }

                    // rasterizer state
                    let rs = cmd2.gpuPipelineState.rs;
                    if (rs) {

                        if (device.stateCache.rs.cullMode !== rs.cullMode) {
                            switch (rs.cullMode) {
                                case GFXCullMode.NONE: {
                                    gl.disable(WebGLRenderingContext.CULL_FACE);
                                    break;
                                }
                                case GFXCullMode.FRONT: {
                                    gl.enable(WebGLRenderingContext.CULL_FACE);
                                    gl.cullFace(WebGLRenderingContext.FRONT);
                                    break;
                                }
                                case GFXCullMode.BACK: {
                                    gl.enable(WebGLRenderingContext.CULL_FACE);
                                    gl.cullFace(WebGLRenderingContext.BACK);
                                    break;
                                }
                                default: ;
                            }

                            device.stateCache.rs.cullMode = rs.cullMode;
                        }

                        if (device.stateCache.rs.isFrontFaceCCW !== rs.isFrontFaceCCW) {
                            gl.frontFace(rs.isFrontFaceCCW ? WebGLRenderingContext.CCW : WebGLRenderingContext.CW);
                            device.stateCache.rs.isFrontFaceCCW = rs.isFrontFaceCCW;
                        }

                        if ((device.stateCache.rs.depthBias !== rs.depthBias) ||
                            (device.stateCache.rs.depthBiasFactor !== rs.depthBiasFactor)) {
                            gl.polygonOffset(rs.depthBiasFactor, rs.depthBias);
                            device.stateCache.rs.depthBias = rs.depthBias;
                            device.stateCache.rs.depthBiasFactor = rs.depthBiasFactor;
                        }

                        /* no browser actually supports this
                        if (device.stateCache.rs.lineWidth !== rs.lineWidth) {
                            gl.lineWidth(rs.lineWidth);
                            device.stateCache.rs.lineWidth = rs.lineWidth;
                        }
                        */

                    } // rasterizater state

                    // depth-stencil state
                    let dss = cmd2.gpuPipelineState.dss;
                    if (dss) {

                        if (device.stateCache.dss.depthTest !== dss.depthTest) {
                            if (dss.depthTest) {
                                gl.enable(WebGLRenderingContext.DEPTH_TEST);
                            } else {
                                gl.disable(WebGLRenderingContext.DEPTH_TEST);
                            }
                            device.stateCache.dss.depthTest = dss.depthTest;
                        }

                        if (device.stateCache.dss.depthWrite !== dss.depthWrite) {
                            gl.depthMask(dss.depthWrite);
                            device.stateCache.dss.depthWrite = dss.depthWrite;
                        }

                        if (device.stateCache.dss.depthFunc !== dss.depthFunc) {
                            gl.depthFunc(WebGLCmpFuncs[dss.depthFunc]);
                            device.stateCache.dss.depthFunc = dss.depthFunc;
                        }

                        // front
                        if ((device.stateCache.dss.stencilTestFront !== dss.stencilTestFront) ||
                            (device.stateCache.dss.stencilTestBack !== dss.stencilTestBack)) {
                            if (dss.stencilTestFront || dss.stencilTestBack) {
                                gl.enable(WebGLRenderingContext.STENCIL_TEST);
                            } else {
                                gl.disable(WebGLRenderingContext.STENCIL_TEST);
                            }
                            device.stateCache.dss.stencilTestFront = dss.stencilTestFront;
                            device.stateCache.dss.stencilTestBack = dss.stencilTestBack;
                        }

                        if ((device.stateCache.dss.stencilFuncFront !== dss.stencilFuncFront) ||
                            (device.stateCache.dss.stencilRefFront !== dss.stencilRefFront) ||
                            (device.stateCache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront)) {

                            gl.stencilFuncSeparate(
                                WebGLRenderingContext.FRONT,
                                WebGLCmpFuncs[dss.stencilFuncFront],
                                dss.stencilRefFront,
                                dss.stencilReadMaskFront);

                            device.stateCache.dss.stencilFuncFront = dss.stencilFuncFront;
                            device.stateCache.dss.stencilRefFront = dss.stencilRefFront;
                            device.stateCache.dss.stencilReadMaskFront = dss.stencilReadMaskFront;
                        }

                        if ((device.stateCache.dss.stencilFailOpFront !== dss.stencilFailOpFront) ||
                            (device.stateCache.dss.stencilZFailOpFront !== dss.stencilZFailOpFront) ||
                            (device.stateCache.dss.stencilPassOpFront !== dss.stencilPassOpFront)) {

                            gl.stencilOpSeparate(
                                WebGLRenderingContext.FRONT,
                                WebGLStencilOps[dss.stencilFailOpFront],
                                WebGLStencilOps[dss.stencilZFailOpFront],
                                WebGLStencilOps[dss.stencilPassOpFront]);

                            device.stateCache.dss.stencilFailOpFront = dss.stencilFailOpFront;
                            device.stateCache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
                            device.stateCache.dss.stencilPassOpFront = dss.stencilPassOpFront;
                        }

                        if (device.stateCache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, dss.stencilWriteMaskFront);
                            device.stateCache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
                        }

                        // back
                        if ((device.stateCache.dss.stencilFuncBack !== dss.stencilFuncBack) ||
                            (device.stateCache.dss.stencilRefBack !== dss.stencilRefBack) ||
                            (device.stateCache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack)) {

                            gl.stencilFuncSeparate(
                                WebGLRenderingContext.BACK,
                                WebGLCmpFuncs[dss.stencilFuncBack],
                                dss.stencilRefBack,
                                dss.stencilReadMaskBack);

                            device.stateCache.dss.stencilFuncBack = dss.stencilFuncBack;
                            device.stateCache.dss.stencilRefBack = dss.stencilRefBack;
                            device.stateCache.dss.stencilReadMaskBack = dss.stencilReadMaskBack;
                        }

                        if ((device.stateCache.dss.stencilFailOpBack !== dss.stencilFailOpBack) ||
                            (device.stateCache.dss.stencilZFailOpBack !== dss.stencilZFailOpBack) ||
                            (device.stateCache.dss.stencilPassOpBack !== dss.stencilPassOpBack)) {

                            gl.stencilOpSeparate(
                                WebGLRenderingContext.BACK,
                                WebGLStencilOps[dss.stencilFailOpBack],
                                WebGLStencilOps[dss.stencilZFailOpBack],
                                WebGLStencilOps[dss.stencilPassOpBack]);

                            device.stateCache.dss.stencilFailOpBack = dss.stencilFailOpBack;
                            device.stateCache.dss.stencilZFailOpBack = dss.stencilZFailOpBack;
                            device.stateCache.dss.stencilPassOpBack = dss.stencilPassOpBack;
                        }

                        if (device.stateCache.dss.stencilWriteMaskBack !== dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.BACK, dss.stencilWriteMaskBack);
                            device.stateCache.dss.stencilWriteMaskBack = dss.stencilWriteMaskBack;
                        }
                    } // depth-stencil state

                    // blend state
                    let bs = cmd2.gpuPipelineState.bs;
                    if (bs) {

                        if (device.stateCache.bs.isA2C !== bs.isA2C) {
                            if (bs.isA2C) {
                                gl.enable(WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
                            } else {
                                gl.disable(WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
                            }
                            device.stateCache.bs.isA2C = bs.isA2C;
                        }

                        if ((device.stateCache.bs.blendColor[0] !== bs.blendColor[0]) ||
                            (device.stateCache.bs.blendColor[1] !== bs.blendColor[1]) ||
                            (device.stateCache.bs.blendColor[2] !== bs.blendColor[2]) ||
                            (device.stateCache.bs.blendColor[3] !== bs.blendColor[3])) {

                            gl.blendColor(bs.blendColor[0], bs.blendColor[1], bs.blendColor[2], bs.blendColor[3]);

                            device.stateCache.bs.blendColor[0] = bs.blendColor[0];
                            device.stateCache.bs.blendColor[1] = bs.blendColor[1];
                            device.stateCache.bs.blendColor[2] = bs.blendColor[2];
                            device.stateCache.bs.blendColor[3] = bs.blendColor[3];
                        }

                        let target0 = bs.targets[0];
                        let catchTarget0 = device.stateCache.bs.targets[0];

                        if (catchTarget0.blend !== target0.blend) {
                            if (target0.blend) {
                                gl.enable(WebGLRenderingContext.BLEND);
                            } else {
                                gl.disable(WebGLRenderingContext.BLEND);
                            }
                            catchTarget0.blend = target0.blend;
                        }

                        if ((catchTarget0.blendEq !== target0.blendEq) ||
                            (catchTarget0.blendAlphaEq !== target0.blendAlphaEq)) {

                            gl.blendEquationSeparate(WebGLBlendOps[target0.blendEq], WebGLBlendOps[target0.blendAlphaEq]);

                            catchTarget0.blendEq = target0.blendEq;
                            catchTarget0.blendAlphaEq = target0.blendAlphaEq;
                        }

                        if ((catchTarget0.blendSrc !== target0.blendSrc) ||
                            (catchTarget0.blendDst !== target0.blendDst) ||
                            (catchTarget0.blendSrcAlpha !== target0.blendSrcAlpha) ||
                            (catchTarget0.blendDstAlpha !== target0.blendDstAlpha)) {

                            gl.blendFuncSeparate(
                                WebGLBlendFactors[target0.blendSrc],
                                WebGLBlendFactors[target0.blendDst],
                                WebGLBlendFactors[target0.blendSrcAlpha],
                                WebGLBlendFactors[target0.blendDstAlpha]);

                            catchTarget0.blendSrc = target0.blendSrc;
                            catchTarget0.blendDst = target0.blendDst;
                            catchTarget0.blendSrcAlpha = target0.blendSrcAlpha;
                            catchTarget0.blendDstAlpha = target0.blendDstAlpha;
                        }

                        if (catchTarget0.blendColorMask !== target0.blendColorMask) {

                            gl.colorMask(
                                (target0.blendColorMask & GFXColorMask.R) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.G) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.B) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.A) !== GFXColorMask.NONE);

                            catchTarget0.blendColorMask = target0.blendColorMask;
                        }
                    } // blend state
                }

                break;
            }
            case WebGLCmd.BIND_BINDING_LAYOUT: {

                let cmd3 = cmdPackage.bindBindingLayoutCmds[cmdId];
                if (cmd3.gpuBindingLayout && gpuShader) {
                    for (let n = 0; n < cmd3.gpuBindingLayout.gpuBindings.length; ++n) {
                        let gpuBinding = cmd3.gpuBindingLayout.gpuBindings[n];

                        switch (gpuBinding.type) {
                            case GFXBindingType.UNIFORM_BUFFER: {

                                if (gpuBinding.gpuBuffer && gpuBinding.gpuBuffer.buffer) {

                                    let glBlock: WebGLGPUUniformBlock | null = null;

                                    for (let b = 0; b < gpuShader.glBlocks.length; ++b) {
                                        if (gpuShader.glBlocks[b].binding === gpuBinding.binding) {
                                            glBlock = gpuShader.glBlocks[b];
                                            break;
                                        }
                                    }

                                    if (glBlock && gpuBinding.gpuBuffer.viewF32) {
                                        let vf32 = gpuBinding.gpuBuffer.viewF32;

                                        for (let u = 0; u < glBlock.glUniforms.length; ++u) {
                                            let glUniform = glBlock.glUniforms[u];
                                            if (glUniform.glLoc && glUniform.view) {

                                                let offset = glUniform.offset / 4;

                                                switch (glUniform.glType) {
                                                    case WebGLRenderingContext.BOOL:
                                                    case WebGLRenderingContext.INT: {
                                                        for (let m = 0; m < glUniform.count; ++m, ++offset) {
                                                            if (vf32[offset] !== glUniform.view[m]) {
                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + glUniform.count));
                                                                gl.uniform1iv(glUniform.glLoc, <Int32Array>glUniform.view);
                                                                glUniform.view[m] = vf32[offset];
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.BOOL_VEC2:
                                                    case WebGLRenderingContext.INT_VEC2: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 2) {
                                                            let idx = 2 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 2 * glUniform.count));
                                                                gl.uniform2iv(glUniform.glLoc, <Int32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.BOOL_VEC3:
                                                    case WebGLRenderingContext.INT_VEC3: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 3) {
                                                            let idx = 3 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 3 * glUniform.count));
                                                                gl.uniform3iv(glUniform.glLoc, <Int32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.BOOL_VEC4:
                                                    case WebGLRenderingContext.INT_VEC4: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 4) {
                                                            let idx = 4 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2] ||
                                                                vf32[offset + 3] !== glUniform.view[idx + 3]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 4 * glUniform.count));
                                                                gl.uniform4iv(glUniform.glLoc, <Int32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT: {
                                                        for (let m = 0; m < glUniform.count; ++m, ++offset) {
                                                            if (vf32[offset] !== glUniform.view[m]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + glUniform.count));
                                                                gl.uniform1fv(glUniform.glLoc, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_VEC2: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 2) {
                                                            let idx = 2 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 2 * glUniform.count));
                                                                gl.uniform2fv(glUniform.glLoc, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_VEC3: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 3) {
                                                            let idx = 3 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 3 * glUniform.count));
                                                                gl.uniform3fv(glUniform.glLoc, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                            ;
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_VEC4: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 4) {
                                                            let idx = 4 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2] ||
                                                                vf32[offset + 3] !== glUniform.view[idx + 3]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 4 * glUniform.count));
                                                                gl.uniform4fv(glUniform.glLoc, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_MAT2: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 4) {
                                                            let idx = 4 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2] ||
                                                                vf32[offset + 3] !== glUniform.view[idx + 3]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 4 * glUniform.count));
                                                                gl.uniformMatrix2fv(glUniform.glLoc, false, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_MAT3: {
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 9) {
                                                            let idx = 9 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2] ||
                                                                vf32[offset + 3] !== glUniform.view[idx + 3] ||
                                                                vf32[offset + 4] !== glUniform.view[idx + 4] ||
                                                                vf32[offset + 5] !== glUniform.view[idx + 5] ||
                                                                vf32[offset + 6] !== glUniform.view[idx + 6] ||
                                                                vf32[offset + 7] !== glUniform.view[idx + 7] ||
                                                                vf32[offset + 8] !== glUniform.view[idx + 8]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 9 * glUniform.count));
                                                                gl.uniformMatrix3fv(glUniform.glLoc, false, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    case WebGLRenderingContext.FLOAT_MAT4: {
                                                        let offset = glUniform.offset;
                                                        for (let m = 0; m < glUniform.count; ++m, offset += 16) {
                                                            let idx = 16 * m;
                                                            if (vf32[offset] !== glUniform.view[idx] ||
                                                                vf32[offset + 1] !== glUniform.view[idx + 1] ||
                                                                vf32[offset + 2] !== glUniform.view[idx + 2] ||
                                                                vf32[offset + 3] !== glUniform.view[idx + 3] ||
                                                                vf32[offset + 4] !== glUniform.view[idx + 4] ||
                                                                vf32[offset + 5] !== glUniform.view[idx + 5] ||
                                                                vf32[offset + 6] !== glUniform.view[idx + 6] ||
                                                                vf32[offset + 7] !== glUniform.view[idx + 7] ||
                                                                vf32[offset + 8] !== glUniform.view[idx + 8] ||
                                                                vf32[offset + 9] !== glUniform.view[idx + 9] ||
                                                                vf32[offset + 10] !== glUniform.view[idx + 10] ||
                                                                vf32[offset + 11] !== glUniform.view[idx + 11] ||
                                                                vf32[offset + 12] !== glUniform.view[idx + 12] ||
                                                                vf32[offset + 13] !== glUniform.view[idx + 13] ||
                                                                vf32[offset + 14] !== glUniform.view[idx + 14] ||
                                                                vf32[offset + 15] !== glUniform.view[idx + 15]) {

                                                                let begin = glUniform.offset / 4;
                                                                glUniform.view.set(vf32.subarray(begin, begin + 16 * glUniform.count));
                                                                gl.uniformMatrix4fv(glUniform.glLoc, false, <Float32Array>glUniform.view);
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                    default: ;
                                                }
                                            } // if
                                        }
                                    }
                                } // if

                                break;
                            }
                            case GFXBindingType.SAMPLER: {

                                if (gpuBinding.gpuSampler && gpuBinding.gpuTexView) {

                                    let glSampler: WebGLGPUUniformSampler | null = null;

                                    for (let s = 0; s < gpuShader.glSamplers.length; ++s) {
                                        if (gpuShader.glSamplers[s].binding === gpuBinding.binding) {
                                            glSampler = gpuShader.glSamplers[s];
                                            break;
                                        }
                                    }

                                    if (glSampler) {
                                        let gpuTexture = gpuBinding.gpuTexView.gpuTexture;

                                        for (let u = 0; u < glSampler.units.length; ++u) {

                                            let texUnit = glSampler.units[u];
                                            if (device.stateCache.texUnit !== texUnit) {
                                                gl.activeTexture(WebGLRenderingContext.TEXTURE0 + texUnit);
                                                device.stateCache.texUnit == texUnit;
                                            }

                                            let glTexUnit: WebGLTexUnit | null = null;

                                            switch (glSampler.glType) {
                                                case WebGLRenderingContext.SAMPLER_2D: {
                                                    glTexUnit = device.stateCache.glTex2DUnits[texUnit];
                                                    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                        gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                                                        glTexUnit.glTexture = gpuTexture.glTexture;
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.SAMPLER_CUBE: {
                                                    glTexUnit = device.stateCache.glTexCubeUnits[texUnit];

                                                    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                        gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                                                        glTexUnit.glTexture = gpuTexture.glTexture;
                                                    }
                                                    break;
                                                }
                                                default: {
                                                    console.error("Unsupported GL Texture type.");
                                                }
                                            }

                                            if (glTexUnit) {
                                                let gpuSampler = gpuBinding.gpuSampler;

                                                if (glTexUnit.minFilter !== gpuSampler.glMinFilter) {
                                                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MIN_FILTER, gpuSampler.glMinFilter);
                                                    glTexUnit.minFilter = gpuSampler.glMinFilter;
                                                }

                                                if (glTexUnit.magFilter !== gpuSampler.glMagFilter) {
                                                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
                                                    glTexUnit.magFilter = gpuSampler.glMagFilter;
                                                }

                                                if (glTexUnit.wrapS !== gpuSampler.glWrapS) {
                                                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_S, gpuSampler.glWrapS);
                                                    glTexUnit.wrapS = gpuSampler.glWrapS;
                                                }

                                                if (glTexUnit.wrapT !== gpuSampler.glWrapT) {
                                                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_T, gpuSampler.glWrapT);
                                                    glTexUnit.wrapT = gpuSampler.glWrapT;
                                                }

                                                /*
                                                if(glTexUnit.wrapR !== gpuSampler.glWrapR) {
                                                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_R, gpuSampler.glWrapR);
                                                    glTexUnit.wrapR = gpuSampler.glWrapR;
                                                }
                                                */
                                            }
                                        }
                                    } // if
                                } // if

                                break;
                            }
                        }
                    }
                }

                break;
            }
            case WebGLCmd.BIND_INPUT_ASSEMBLER: {
                let cmd4 = cmdPackage.bindInputAssemblerCmds[cmdId];
                gpuInputAssembler = cmd4.gpuInputAssembler;
                break;
            }
            case WebGLCmd.DRAW: {
                let cmd5: WebGLCmdDraw = cmdPackage.drawCmds[cmdId];

                if (gpuInputAssembler && gpuShader) {
                    for (let a = 0; a < device.maxVertexAttributes; ++a) {
                        device.stateCache.glCurrentAttribLocs[a] = false;
                    }

                    for (let n = 0; n < gpuShader.glInputs.length; ++n) {
                        let glInput = gpuShader.glInputs[n];
                        let glAttrib: WebGLAttrib | null = null;

                        for (let a = 0; a < gpuInputAssembler.glAttribs.length; ++a) {
                            if (gpuInputAssembler.glAttribs[a].name === glInput.name) {
                                glAttrib = gpuInputAssembler.glAttribs[a];
                                break;
                            }
                        }

                        if (glAttrib) {
                            if (device.stateCache.glArrayBuffer !== glAttrib.glBuffer) {
                                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, glAttrib.glBuffer);
                                device.stateCache.glArrayBuffer = glAttrib.glBuffer;
                            }

                            for (let c = 0; c < glAttrib.componentCount; ++c) {
                                let glLoc = glInput.glLoc + c;
                                let attribOffset = glAttrib.offset + glAttrib.size * c;

                                if (!device.stateCache.glEnabledAttribLocs[glLoc] && glLoc >= 0) {
                                    gl.enableVertexAttribArray(glLoc);
                                    device.stateCache.glEnabledAttribLocs[glLoc] = true;
                                }
                                device.stateCache.glCurrentAttribLocs[glLoc] = true;

                                gl.vertexAttribPointer(glLoc, glAttrib.count, glAttrib.glType, glAttrib.isNormalized, glAttrib.stride, attribOffset);
                            }
                        }
                    } // if

                    if (gpuInputAssembler.gpuIndexBuffer && cmd5.indexCount > 0) {
                        let gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

                        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                            device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                        }

                        let offset = cmd5.firstIndex * gpuBuffer.stride;
                        gl.drawElements(glPrimitive, cmd5.indexCount, gpuInputAssembler.glIndexType, offset);
                    } else {
                        gl.drawArrays(glPrimitive, cmd5.firstVertex, cmd5.vertexCount);
                    }

                    for (let a = 0; a < device.maxVertexAttributes; ++a) {
                        if (device.stateCache.glEnabledAttribLocs[a] !== device.stateCache.glCurrentAttribLocs[a]) {
                            gl.disableVertexAttribArray(a);
                            device.stateCache.glEnabledAttribLocs[a] = false;
                        }
                    }
                }
                break;
            }
            case WebGLCmd.UPDATE_BUFFER: {
                let cmd6 = cmdPackage.updateBufferCmds[cmdId];
                if (cmd6.gpuBuffer) {

                    if (cmd6.buffer && cmd6.gpuBuffer.viewUI8) {
                        cmd6.gpuBuffer.viewUI8.set(new Uint8Array(cmd6.buffer), cmd6.offset);
                    }

                    switch (cmd6.gpuBuffer.glTarget) {
                        case WebGLRenderingContext.ARRAY_BUFFER: {
                            if (device.stateCache.glArrayBuffer !== cmd6.gpuBuffer.glBuffer) {
                                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, cmd6.gpuBuffer.glBuffer);
                                device.stateCache.glArrayBuffer = cmd6.gpuBuffer.glBuffer;
                            }

                            if (cmd6.buffer) {
                                gl.bufferSubData(cmd6.gpuBuffer.glTarget, cmd6.offset, cmd6.buffer);
                            }
                            break;
                        }
                        case WebGLRenderingContext.ELEMENT_ARRAY_BUFFER: {
                            if (device.stateCache.glElementArrayBuffer !== cmd6.gpuBuffer.glBuffer) {
                                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, cmd6.gpuBuffer.glBuffer);
                                device.stateCache.glElementArrayBuffer = cmd6.gpuBuffer.glBuffer;
                            }

                            if (cmd6.buffer) {
                                gl.bufferSubData(cmd6.gpuBuffer.glTarget, cmd6.offset, cmd6.buffer);
                            }
                            break;
                        }
                        default: ;
                    }
                }

                break;
            }
            case WebGLCmd.COPY_BUFFER_TO_TEXTURE: {
                let cmd7 = cmdPackage.copyBufferToTextureCmds[cmdId];
                if (cmd7.gpuBuffer && cmd7.gpuBuffer.viewUI8 && cmd7.gpuTexture) {
                    WebGLCmdFuncCopyBufferToTexture(device, cmd7.gpuBuffer.viewUI8, cmd7.gpuTexture, cmd7.regions);
                }

                break;
            }
        } // switch
    } // for
}

export function WebGLCmdFuncCopyBufferToTexture(
    device: WebGLGFXDevice,
    bufferView: Uint8Array,
    gpuTexture: WebGLGPUTexture,
    regions: GFXBufferTextureCopy[]) {

    let gl = device.gl;

    switch (gpuTexture.glTarget) {
        case WebGLRenderingContext.TEXTURE_2D: {
            let glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            let isCompressed = GFXFormatInfos[gpuTexture.format].isCompressed;
            if (!isCompressed) {
                for (let r = 0; r < regions.length; ++r) {
                    let region = regions[r];
                    let buffOffset = region.buffOffset; + region.buffTexHeight * region.buffStride;

                    let w = region.texExtent.width;
                    let h = region.texExtent.height;

                    for (let m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                        let memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                        let data = bufferView.subarray(buffOffset, buffOffset + memSize);

                        gl.texSubImage2D(WebGLRenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, gpuTexture.glType, data);

                        buffOffset += memSize;
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, w >> 1);
                    }
                }
            } else {
                for (let r = 0; r < regions.length; ++r) {
                    let region = regions[r];
                    let buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

                    let w = region.texExtent.width;
                    let h = region.texExtent.height;

                    for (let m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                        let memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                        let data = bufferView.subarray(buffOffset, buffOffset + memSize);

                        gl.compressedTexSubImage2D(WebGLRenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, data);

                        buffOffset += memSize;
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, w >> 1);
                    }
                }
            }
            break;
        }
        case WebGLRenderingContext.TEXTURE_CUBE_MAP: {
            let glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            let isCompressed = GFXFormatInfos[gpuTexture.format].isCompressed;
            if (!isCompressed) {
                for (let r = 0; r < regions.length; ++r) {
                    let region = regions[r];
                    let buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

                    let w = region.texExtent.width;
                    let h = region.texExtent.height;

                    for (let f = 0; f < 6; ++f) {
                        let w = region.texExtent.width;
                        let h = region.texExtent.height;

                        for (let m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                            let memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            let data = bufferView.subarray(buffOffset, buffOffset + memSize);

                            gl.texSubImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, gpuTexture.glType, data);

                            buffOffset += memSize;
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, w >> 1);
                        }
                    }
                }
            } else {
                for (let r = 0; r < regions.length; ++r) {
                    let region = regions[r];
                    let buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

                    for (let f = 0; f < 6; ++f) {
                        let w = region.texExtent.width;
                        let h = region.texExtent.height;

                        for (let m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                            let memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            let data = bufferView.subarray(buffOffset, buffOffset + memSize);

                            gl.compressedTexSubImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X + f, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, data);

                            buffOffset += memSize;
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, w >> 1);
                        }
                    }
                }
            }
            break;
        }
        default: {
            console.error("Unsupported GL texture type, copy buffer to texture failed.");
        }
    }

    if (gpuTexture.flags & GFXTextureFlagBit.GEN_MIPMAP) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}
