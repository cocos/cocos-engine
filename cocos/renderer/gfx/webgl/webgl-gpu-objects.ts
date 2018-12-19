import { GFXBufferUsage, GFXBufferUsageBit, GFXMemoryUsage, GFXMemoryUsageBit } from "../gfx-buffer";
import { GFXTextureType, GFXTextureUsage, GFXTextureUsageBit, GFXTextureFlags, GFXTextureFlagBit } from "../gfx-texture";
import { GFXTextureViewType } from "../gfx-texture-view";
import { GFXFormat, GFX_MAX_VERTEX_ATTRIBUTES, GFXType } from "../gfx-define";
import { GFXInputAttribute } from "../gfx-input-state";
import { ColorAttachmentInfo, DepthStencilAttachmentInfo } from "../gfx-render-pass";
import { GFXShaderType, GFXShaderMacro } from "../gfx-shader";
import { GFXBinding } from "../gfx-binding-set-layout";

export const enum WebGLGPUObjectType {
    UNKNOWN,
    BUFFER,
    TEXTURE,
    TEXTURE_VIEW,
    RENDER_PASS,
    FRAMEBUFFER,
    SHADER,
    INPUT_STATE,
};

export class WebGLGPUObject {
    objType : WebGLGPUObjectType;

    constructor(type : WebGLGPUObjectType) {
        this.objType = type;
   }
};

export class WebGLGPUBuffer extends WebGLGPUObject {
    usage : GFXBufferUsage = GFXBufferUsageBit.NONE;
    memUsage : GFXMemoryUsage = GFXMemoryUsageBit.NONE;
    size : number = 0;
    stride : number = 0;

    glTarget : GLenum = 0;
    glBuffer : WebGLBuffer = 0;

    constructor() {
         super(WebGLGPUObjectType.BUFFER);
    }
};

export class WebGLGPUInputState extends WebGLGPUObject {
    attributes : GFXInputAttribute[] = [];
	vertexBuffers : (WebGLGPUBuffer | null)[] = Array<WebGLGPUBuffer | null>(GFX_MAX_VERTEX_ATTRIBUTES);
	indexBuffer : WebGLGPUBuffer | null = null;
	glVAO : WebGLVertexArrayObjectOES = 0;
};

export class WebGLGPUTexture extends WebGLGPUObject {
    type : GFXTextureType = GFXTextureType.TEX2D;
    viewType : GFXTextureViewType = GFXTextureViewType.TV2D;
    format : GFXFormat = GFXFormat.UNKNOWN;
    usage : GFXTextureUsage = GFXTextureUsageBit.NONE;
    width : number = 0;
    height : number = 0;
    depth : number = 0;
    arrayLayer : number = 0;
    mipLevel : number = 0;
    flags : GFXTextureFlags = GFXTextureFlagBit.NONE;

    glTarget : GLenum = 0;
    glInternelFmt : GLenum = 0;
    glFormat : GLenum = 0;
    glType : GLenum = 0;
    glUsage : GLenum = 0;
    glTexture : WebGLTexture = 0;

    constructor() {
        super(WebGLGPUObjectType.TEXTURE);
    }
};

export class WebGLGPUTextureView extends WebGLGPUObject {

    gpuTexture : WebGLGPUTexture;
    type : GFXTextureViewType = GFXTextureViewType.TV2D;
    format : GFXFormat = GFXFormat.UNKNOWN;
    baseLevel : number = 0;
    levelCount : number = 1;

    constructor(texture : WebGLGPUTexture) {
        super(WebGLGPUObjectType.TEXTURE_VIEW);
        this.gpuTexture = texture;
    }
}

export class WebGLGPURenderPass extends WebGLGPUObject {
    
    colorInfos : ColorAttachmentInfo[] = [];
    depthStencilInfo : DepthStencilAttachmentInfo | null = null;

    constructor() {
        super(WebGLGPUObjectType.RENDER_PASS);
    }
};

export class WebGLGPUFramebuffer extends WebGLGPUObject {
    
    gpuRenderPass : WebGLGPURenderPass;
    gpuColorViews : (WebGLGPUTextureView | null)[] = [];
    gpuDepthStencilView : WebGLGPUTextureView | null = null;
    isOffscreen : boolean = false;

    glFramebuffer : WebGLFramebuffer = 0;

    constructor(gpuRenderPass : WebGLGPURenderPass) {
        super(WebGLGPUObjectType.FRAMEBUFFER);

        this.gpuRenderPass = gpuRenderPass;
    }
};

export class WebGLGPUSampler extends WebGLGPUObject {
    
};

export class WebGLGPUInput {
    binding : number = -1;
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    stride : number = 0;
    count : number = 0;
    size : number = 0;
    
    glType : GLenum = 0;
    glLoc : GLint = 0;
};

export class WebGLGPUUniform {
    binding : number = -1;
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    stride : number = 0;
    count : number = 0;
    size : number = 0;
    offset : number = 0;
    
    glType : GLenum = 0;
    glLoc : WebGLUniformLocation = -1;
};

export class WebGLGPUUniformBlock {
    binding : number = -1;
    name : string = "";
    size : number = 0;
    glUniforms : WebGLGPUUniform[] = [];
}

export class WebGLGPUUniformSampler {
    binding : number = -1;
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    units : number[] = [];

    glType : GLenum = 0;
    glLoc : WebGLUniformLocation = -1;
}

export class WebGLGPUShaderStage {
    type : GFXShaderType = GFXShaderType.VERTEX;
    source : string = "";
    macros : GFXShaderMacro[] = [];
    glShader : WebGLShader = 0;
};

export class WebGLGPUShader extends WebGLGPUObject {
    name : string = "";
    bindings : GFXBinding[] = [];

    gpuStages : WebGLGPUShaderStage[] = [];
    glProgram : WebGLProgram = 0;
    glInputs : WebGLGPUInput[] = [];
    glUniforms : WebGLGPUUniform[] = [];
    glBlocks : WebGLGPUUniformBlock[] = [];
    glSamplers : WebGLGPUUniformSampler[] = [];

    constructor() {
        super(WebGLGPUObjectType.SHADER);
   }
};
