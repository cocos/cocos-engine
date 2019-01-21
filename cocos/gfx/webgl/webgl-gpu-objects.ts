import { IGFXDrawInfo } from '../buffer';
import {
    GFXBindingType,
    GFXBufferUsage,
    GFXBufferUsageBit,
    GFXDynamicState,
    GFXFormat,
    GFXMemoryUsage,
    GFXMemoryUsageBit,
    GFXShaderType,
    GFXTextureFlagBit,
    GFXTextureFlags,
    GFXTextureType,
    GFXTextureUsage,
    GFXTextureUsageBit,
    GFXTextureViewType,
    GFXType,
} from '../define';
import { IGFXInputAttribute } from '../input-assembler';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';
import { GFXColorAttachment, GFXDepthStencilAttachment } from '../render-pass';
import { GFXUniformBlock, GFXUniformSampler, IGFXShaderMacro } from '../shader';

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
}

export class WebGLGPUObject {
    public objType: WebGLGPUObjectType;

    constructor (type: WebGLGPUObjectType) {
        this.objType = type;
    }
}

export interface IWebGLGPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export class WebGLGPUBuffer extends WebGLGPUObject {
    public usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    public memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    public size: number = 0;
    public stride: number = 0;

    public glTarget: GLenum = 0;
    public glBuffer: WebGLBuffer = 0;
    public buffer: ArrayBuffer | null = null;
    public vf32: Float32Array | null = null;
    public uniforms: IWebGLGPUUniformInfo[] = [];
    public indirects: IGFXDrawInfo[] = [];

    constructor () {
        super(WebGLGPUObjectType.BUFFER);
    }
}

export class WebGLGPUTexture extends WebGLGPUObject {
    public type: GFXTextureType = GFXTextureType.TEX2D;
    public viewType: GFXTextureViewType = GFXTextureViewType.TV2D;
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public usage: GFXTextureUsage = GFXTextureUsageBit.NONE;
    public width: number = 0;
    public height: number = 0;
    public depth: number = 1;
    public arrayLayer: number = 1;
    public mipLevel: number = 1;
    public flags: GFXTextureFlags = GFXTextureFlagBit.NONE;

    public glTarget: GLenum = 0;
    public glInternelFmt: GLenum = 0;
    public glFormat: GLenum = 0;
    public glType: GLenum = 0;
    public glUsage: GLenum = 0;
    public glTexture: WebGLTexture = 0;

    constructor () {
        super(WebGLGPUObjectType.TEXTURE);
    }
}

export class WebGLGPUTextureView extends WebGLGPUObject {

    public gpuTexture: WebGLGPUTexture;
    public type: GFXTextureViewType = GFXTextureViewType.TV2D;
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public baseLevel: number = 0;
    public levelCount: number = 1;

    constructor (texture: WebGLGPUTexture) {
        super(WebGLGPUObjectType.TEXTURE_VIEW);
        this.gpuTexture = texture;
    }
}

export class WebGLGPURenderPass extends WebGLGPUObject {

    public colorAttachments: GFXColorAttachment[] = [];
    public depthStencilAttachment: GFXDepthStencilAttachment | null = null;

    constructor () {
        super(WebGLGPUObjectType.RENDER_PASS);
    }
}

export class WebGLGPUFramebuffer extends WebGLGPUObject {

    public gpuRenderPass: WebGLGPURenderPass;
    public gpuColorViews: WebGLGPUTextureView[] = [];
    public gpuDepthStencilView: WebGLGPUTextureView | null = null;
    public isOffscreen?: boolean = false;

    public glFramebuffer: WebGLFramebuffer = 0;

    constructor (gpuRenderPass: WebGLGPURenderPass) {
        super(WebGLGPUObjectType.FRAMEBUFFER);

        this.gpuRenderPass = gpuRenderPass;
    }
}

export class WebGLGPUSampler extends WebGLGPUObject {
    public glMinFilter: GLenum = WebGLRenderingContext.NONE;
    public glMagFilter: GLenum = WebGLRenderingContext.NONE;
    public glWrapS: GLenum = WebGLRenderingContext.NONE;
    public glWrapT: GLenum = WebGLRenderingContext.NONE;
    public glWrapR: GLenum = WebGLRenderingContext.NONE;

    constructor () {
        super(WebGLGPUObjectType.SAMPLER);
    }
}

export class WebGLGPUInput {
    public binding: number = -1;
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public stride: number = 0;
    public count: number = 0;
    public size: number = 0;

    public glType: GLenum = 0;
    public glLoc: GLint = 0;
}

export interface IWebGLGPUUniform {
    binding: number;
    name: string;
    type: GFXType;
    stride: number;
    count: number;
    size: number;
    offset: number;

    glType: GLenum;
    glLoc: WebGLUniformLocation;
    vi32: Int32Array | null;
    vf32: Float32Array | null;
    begin: number;
}

export class WebGLGPUUniformBlock {
    public binding: number = -1;
    public name: string = '';
    public size: number = 0;
    public glUniforms: IWebGLGPUUniform[] = [];
    public glActiveUniforms: IWebGLGPUUniform[] = [];

    public isUniformPackage: boolean = false;  // Is a single uniform package?
    public buffer: ArrayBuffer | null = null;  // for cache
}

export class WebGLGPUUniformSampler {
    public binding: number = -1;
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public units: number[] = [];

    public glType: GLenum = 0;
    public glLoc: WebGLUniformLocation = -1;
}

export class WebGLGPUShaderStage {
    public type: GFXShaderType = GFXShaderType.VERTEX;
    public source: string = '';
    public macros: IGFXShaderMacro[] = [];
    public glShader: WebGLShader = 0;
}

export class WebGLGPUShader extends WebGLGPUObject {
    public name: string = '';
    public blocks: GFXUniformBlock[] = [];
    public samplers: GFXUniformSampler[] = [];

    public gpuStages: WebGLGPUShaderStage[] = [];
    public glProgram: WebGLProgram = 0;
    public glInputs: WebGLGPUInput[] = [];
    public glUniforms: IWebGLGPUUniform[] = [];
    public glBlocks: WebGLGPUUniformBlock[] = [];
    public glSamplers: WebGLGPUUniformSampler[] = [];

    constructor () {
        super(WebGLGPUObjectType.SHADER);
    }
}

export class WebGLGPUPipelineLayout extends WebGLGPUObject {

}

export class WebGLGPUPipelineState extends WebGLGPUObject {

    public glPrimitive: GLenum = WebGLRenderingContext.TRIANGLES;
    public gpuShader: WebGLGPUShader | null = null;
    public rs: GFXRasterizerState = new GFXRasterizerState();
    public dss: GFXDepthStencilState = new GFXDepthStencilState();
    public bs: GFXBlendState = new GFXBlendState();
    public dynamicStates: GFXDynamicState[] = [];
    public gpuLayout: WebGLGPUPipelineLayout | null = null;
    public gpuRenderPass: WebGLGPURenderPass | null = null;

    constructor () {
        super(WebGLGPUObjectType.PIPELINE_STATE);
    }
}

export class WebGLGPUBinding {
    public binding: number = 0;
    public type: GFXBindingType = GFXBindingType.UNKNOWN;
    public name: string = '';
    public gpuBuffer: WebGLGPUBuffer | null = null;
    public gpuTexView: WebGLGPUTextureView | null = null;
    public gpuSampler: WebGLGPUSampler | null = null;
}

export class WebGLGPUBindingLayout extends WebGLGPUObject {

    public gpuBindings: WebGLGPUBinding[] = [];

    constructor () {
        super(WebGLGPUObjectType.BINDING_LAYOUT);
    }
}

export class WebGLAttrib {
    public name: string = '';
    public glBuffer: WebGLBuffer = 0;
    public glType: GLenum = 0;
    public size: number = 0;
    public count: number = 0;
    public stride: number = 0;
    public componentCount: number = 1;
    public isNormalized: boolean = false;
    public isInstanced: boolean = false;
    public offset: number = 0;
}

export class WebGLGPUInputAssembler extends WebGLGPUObject {
    public attributes: IGFXInputAttribute[] = [];
    public gpuVertexBuffers: WebGLGPUBuffer[] = [];
    public gpuIndexBuffer: WebGLGPUBuffer | null = null;
    public gpuIndirectBuffer: WebGLGPUBuffer | null = null;

    public glAttribs: WebGLAttrib[] = [];
    public glIndexType: GLenum = 0;
    public glVAO: WebGLVertexArrayObjectOES = 0;

    constructor () {
        super(WebGLGPUObjectType.INPUT_ASSEMBLER);
    }
}
