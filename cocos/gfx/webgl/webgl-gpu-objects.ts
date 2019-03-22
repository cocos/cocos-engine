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

export interface IWebGLGPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export class WebGLGPUBuffer {
    public usage: GFXBufferUsage = GFXBufferUsageBit.NONE;
    public memUsage: GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    public size: number = 0;
    public stride: number = 0;

    public glTarget: GLenum = 0;
    public glBuffer: WebGLBuffer = 0;
    public buffer: ArrayBuffer | null = null;
    public vf32: Float32Array | null = null;
    public indirects: IGFXDrawInfo[] = [];
}

export class WebGLGPUTexture {
    public type: GFXTextureType = GFXTextureType.TEX2D;
    public viewType: GFXTextureViewType = GFXTextureViewType.TV2D;
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public usage: GFXTextureUsage = GFXTextureUsageBit.NONE;
    public width: number = 0;
    public height: number = 0;
    public depth: number = 1;
    public size: number = 0;
    public arrayLayer: number = 1;
    public mipLevel: number = 1;
    public flags: GFXTextureFlags = GFXTextureFlagBit.NONE;
    public isPowerOf2: boolean = false;

    public glTarget: GLenum = 0;
    public glInternelFmt: GLenum = 0;
    public glFormat: GLenum = 0;
    public glType: GLenum = 0;
    public glUsage: GLenum = 0;
    public glTexture: WebGLTexture = 0;
    public glWrapS: GLenum = 0;
    public glWrapT: GLenum = 0;
    public glMinFilter: GLenum = 0;
    public glMagFilter: GLenum = 0;
}

export class WebGLGPUTextureView {

    public gpuTexture: WebGLGPUTexture;
    public type: GFXTextureViewType = GFXTextureViewType.TV2D;
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public baseLevel: number = 0;
    public levelCount: number = 1;

    constructor (texture: WebGLGPUTexture) {
        this.gpuTexture = texture;
    }
}

export class WebGLGPURenderPass {

    public colorAttachments: GFXColorAttachment[] = [];
    public depthStencilAttachment: GFXDepthStencilAttachment | null = null;
}

export class WebGLGPUFramebuffer {

    public gpuRenderPass: WebGLGPURenderPass;
    public gpuColorViews: WebGLGPUTextureView[] = [];
    public gpuDepthStencilView: WebGLGPUTextureView | null = null;
    public isOffscreen?: boolean = false;

    public glFramebuffer: WebGLFramebuffer = 0;

    constructor (gpuRenderPass: WebGLGPURenderPass) {
        this.gpuRenderPass = gpuRenderPass;
    }
}

export class WebGLGPUSampler {
    public glMinFilter: GLenum = WebGLRenderingContext.NONE;
    public glMagFilter: GLenum = WebGLRenderingContext.NONE;
    public glWrapS: GLenum = WebGLRenderingContext.NONE;
    public glWrapT: GLenum = WebGLRenderingContext.NONE;
    public glWrapR: GLenum = WebGLRenderingContext.NONE;
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
    array: number[];
    begin: number;
    isFirst: boolean;
}

export class WebGLGPUUniformBlock {
    public binding: number = -1;
    public name: string = '';
    public size: number = 0;
    public glUniforms: IWebGLGPUUniform[] = [];
    public glActiveUniforms: IWebGLGPUUniform[] = [];

    public isUniformPackage: boolean = false;  // Is a single uniform package?
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

export class WebGLGPUShader {
    public name: string = '';
    public blocks: GFXUniformBlock[] = [];
    public samplers: GFXUniformSampler[] = [];

    public gpuStages: WebGLGPUShaderStage[] = [];
    public glProgram: WebGLProgram = 0;
    public glInputs: WebGLGPUInput[] = [];
    public glUniforms: IWebGLGPUUniform[] = [];
    public glBlocks: WebGLGPUUniformBlock[] = [];
    public glSamplers: WebGLGPUUniformSampler[] = [];
}

export class WebGLGPUPipelineLayout {

}

export class WebGLGPUPipelineState {

    public glPrimitive: GLenum = WebGLRenderingContext.TRIANGLES;
    public gpuShader: WebGLGPUShader | null = null;
    public rs: GFXRasterizerState = new GFXRasterizerState();
    public dss: GFXDepthStencilState = new GFXDepthStencilState();
    public bs: GFXBlendState = new GFXBlendState();
    public dynamicStates: GFXDynamicState[] = [];
    public gpuLayout: WebGLGPUPipelineLayout | null = null;
    public gpuRenderPass: WebGLGPURenderPass | null = null;
}

export class WebGLGPUBinding {
    public binding: number = 0;
    public type: GFXBindingType = GFXBindingType.UNKNOWN;
    public name: string = '';
    public gpuBuffer: WebGLGPUBuffer | null = null;
    public gpuTexView: WebGLGPUTextureView | null = null;
    public gpuSampler: WebGLGPUSampler | null = null;
}

export class WebGLGPUBindingLayout {

    public gpuBindings: WebGLGPUBinding[] = [];
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

export interface IWebGLGPUInputAssembler {
    attributes: IGFXInputAttribute[];
    gpuVertexBuffers: WebGLGPUBuffer[];
    gpuIndexBuffer: WebGLGPUBuffer | null;
    gpuIndirectBuffer: WebGLGPUBuffer | null;

    glAttribs: WebGLAttrib[];
    glIndexType: GLenum;
    glVAOs: Map<WebGLProgram, WebGLVertexArrayObjectOES>;
}
