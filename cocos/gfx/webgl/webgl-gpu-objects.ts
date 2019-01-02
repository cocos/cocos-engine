import { GFXFormat, GFXType, GFXTextureType, GFXTextureUsage, GFXTextureUsageBit, GFXTextureFlags, GFXTextureFlagBit, GFXShaderType, GFXBindingType, GFXTextureViewType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXMemoryUsage, GFXBufferUsage } from "../define";
import { GFXColorAttachment, GFXDepthStencilAttachment } from "../render-pass";
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../pipeline-state";
import { GFXInputAttribute } from "../input-assembler";
import { GFXUniformBlock, GFXUniformSampler, GFXShaderMacro } from "../shader";

export enum WebGLGPUObjectType {
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
    COMMAND_BUFFER,
};

export class WebGLGPUObject {
    objType: WebGLGPUObjectType;

    constructor(type: WebGLGPUObjectType) {
        this.objType = type;
    }
};

export class WebGLGPUBuffer extends WebGLGPUObject {
    usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    size: number = 0;
    stride: number = 0;

    glTarget: GLenum = 0;
    glBuffer: WebGLBuffer = 0;
    buffer: ArrayBuffer | null = null;
    bufferView: Uint8Array | null = null;

    constructor() {
        super(WebGLGPUObjectType.BUFFER);
    }
};

export class WebGLGPUTexture extends WebGLGPUObject {
    type: GFXTextureType = GFXTextureType.TEX2D;
    viewType: GFXTextureViewType = GFXTextureViewType.TV2D;
    format: GFXFormat = GFXFormat.UNKNOWN;
    usage: GFXTextureUsage = GFXTextureUsageBit.NONE;
    width: number = 0;
    height: number = 0;
    depth: number = 1;
    arrayLayer: number = 1;
    mipLevel: number = 1;
    flags: GFXTextureFlags = GFXTextureFlagBit.NONE;

    glTarget: GLenum = 0;
    glInternelFmt: GLenum = 0;
    glFormat: GLenum = 0;
    glType: GLenum = 0;
    glUsage: GLenum = 0;
    glTexture: WebGLTexture = 0;

    constructor() {
        super(WebGLGPUObjectType.TEXTURE);
    }
};

export class WebGLGPUTextureView extends WebGLGPUObject {

    gpuTexture: WebGLGPUTexture;
    type: GFXTextureViewType = GFXTextureViewType.TV2D;
    format: GFXFormat = GFXFormat.UNKNOWN;
    baseLevel: number = 0;
    levelCount: number = 1;

    constructor(texture: WebGLGPUTexture) {
        super(WebGLGPUObjectType.TEXTURE_VIEW);
        this.gpuTexture = texture;
    }
}

export class WebGLGPURenderPass extends WebGLGPUObject {

    colorAttachments: GFXColorAttachment[] = [];
    depthStencilAttachment: GFXDepthStencilAttachment | null = null;

    constructor() {
        super(WebGLGPUObjectType.RENDER_PASS);
    }
};

export class WebGLGPUFramebuffer extends WebGLGPUObject {

    gpuRenderPass: WebGLGPURenderPass;
    gpuColorViews: WebGLGPUTextureView[] = [];
    gpuDepthStencilView: WebGLGPUTextureView | null = null;
    isOffscreen?: boolean = false;

    glFramebuffer: WebGLFramebuffer = 0;

    constructor(gpuRenderPass: WebGLGPURenderPass) {
        super(WebGLGPUObjectType.FRAMEBUFFER);

        this.gpuRenderPass = gpuRenderPass;
    }
};

export class WebGLGPUSampler extends WebGLGPUObject {
    glMinFilter: GLenum = WebGLRenderingContext.NONE;
    glMagFilter: GLenum = WebGLRenderingContext.NONE;
    glWrapS: GLenum = WebGLRenderingContext.NONE;
    glWrapT: GLenum = WebGLRenderingContext.NONE;
    glWrapR: GLenum = WebGLRenderingContext.NONE;

    constructor() {
        super(WebGLGPUObjectType.SAMPLER);
    }
};

export class WebGLGPUInput {
    binding: number = -1;
    name: string = "";
    type: GFXType = GFXType.UNKNOWN;
    stride: number = 0;
    count: number = 0;
    size: number = 0;

    glType: GLenum = 0;
    glLoc: GLint = 0;
};

export class WebGLGPUUniform {
    binding: number = -1;
    name: string = "";
    type: GFXType = GFXType.UNKNOWN;
    stride: number = 0;
    count: number = 0;
    size: number = 0;
    offset: number = 0;

    glType: GLenum = 0;
    glLoc: WebGLUniformLocation = -1;
    bufferView: Int32Array | Float32Array | null = null;
};

export class WebGLGPUUniformBlock {
    binding: number = -1;
    name: string = "";
    size: number = 0;
    glUniforms: WebGLGPUUniform[] = [];

    isUniformPackage: boolean = false;  // Is a single uniform package?
    buffer: ArrayBuffer | null = null;  // for cache
    bufferView: DataView | null = null;
}

export class WebGLGPUUniformSampler {
    binding: number = -1;
    name: string = "";
    type: GFXType = GFXType.UNKNOWN;
    units: number[] = [];

    glType: GLenum = 0;
    glLoc: WebGLUniformLocation = -1;
}

export class WebGLGPUShaderStage {
    type: GFXShaderType = GFXShaderType.VERTEX;
    source: string = "";
    macros: GFXShaderMacro[] = [];
    glShader: WebGLShader = 0;
};

export class WebGLGPUShader extends WebGLGPUObject {
    name: string = "";
    blocks?: GFXUniformBlock[];
    samplers?: GFXUniformSampler[];

    gpuStages: WebGLGPUShaderStage[] = [];
    glProgram: WebGLProgram = 0;
    glInputs: WebGLGPUInput[] = [];
    glUniforms: WebGLGPUUniform[] = [];
    glBlocks: WebGLGPUUniformBlock[] = [];
    glSamplers: WebGLGPUUniformSampler[] = [];

    constructor() {
        super(WebGLGPUObjectType.SHADER);
    }
};

export class WebGLGPUPipelineLayout extends WebGLGPUObject {

};

export class WebGLGPUPipelineState extends WebGLGPUObject {

    glPrimitive: GLenum = WebGLRenderingContext.TRIANGLES;
    gpuShader: WebGLGPUShader | null = null;
    rs: GFXRasterizerState = new GFXRasterizerState;
    dss: GFXDepthStencilState = new GFXDepthStencilState;
    bs: GFXBlendState = new GFXBlendState;
    gpuLayout: WebGLGPUPipelineLayout | null = null;
    gpuRenderPass: WebGLGPURenderPass | null = null;

    constructor() {
        super(WebGLGPUObjectType.PIPELINE_STATE);
    }
};

export class WebGLGPUBinding {
    binding: number = 0;
    type: GFXBindingType = GFXBindingType.UNKNOWN;
    name: string = "";
    gpuBuffer: WebGLGPUBuffer | null = null;
    gpuTexView: WebGLGPUTextureView | null = null;
    gpuSampler: WebGLGPUSampler | null = null;
};

export class WebGLGPUBindingLayout extends WebGLGPUObject {

    gpuBindings: WebGLGPUBinding[] = [];

    constructor() {
        super(WebGLGPUObjectType.BINDING_LAYOUT);
    }
};

export class WebGLAttrib {
    name: string = "";
    glBuffer: WebGLBuffer = 0;
    glLoc: number = 0;
    glType: GLenum = 0;
    size: number = 0;
    count: number = 0;
    stride: number = 0;
    componentCount: number = 1;
    isInstanced: boolean = false;
    offset: number = 0;
};

export class WebGLGPUInputAssembler extends WebGLGPUObject {
    attributes: GFXInputAttribute[] = [];
    gpuVertexBuffers: WebGLGPUBuffer[] = [];
    gpuIndexBuffer: WebGLGPUBuffer | null = null;

    glAttribs: WebGLAttrib[] = [];
    glIndexType: GLenum = 0;
    glVAO: WebGLVertexArrayObjectOES = 0;

    constructor() {
        super(WebGLGPUObjectType.INPUT_ASSEMBLER);
    }
};
